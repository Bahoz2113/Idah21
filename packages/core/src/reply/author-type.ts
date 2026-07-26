/** Yanit firsati motoru — master prompt md. 15 */
import { trLower } from "../dedup/content-hash.js";

export type AuthorType = "institution" | "official" | "news" | "public_figure" | "individual";

export interface AuthorSignals {
  handle: string;
  displayName: string;
  bio: string;
  isVerified: boolean;
  followerCount: number;
}

const INSTITUTION_HINTS = [
  "bakanlığı", "bakanlik", "müdürlüğü", "genel müdürlük", "başkanlığı", "kurumu",
  "sgk", "yök", "resmi gazete", "resmî gazete", "valilik", "belediye", "hastanesi",
  "üniversitesi", "sendika", "konfederasyon", "oda", "birliği",
];
const NEWS_HINTS = [
  "haber", "gazete", "ajans", "medya", "tv", "muhabir", "gazeteci", "editör",
  "anadolu ajansı", "aa", "dha", "iha",
];
const OFFICIAL_HINTS = ["resmi hesap", "resmî hesap", "official", "sözcü", "basın müşaviri"];

/**
 * Bireysel kisisel hesaplara YANIT FIRSATI OLUSTURULMAZ.
 * Belirsizlik durumunda en guvenli sinif olan "individual" secilir.
 */
export function classifyAuthor(s: AuthorSignals): { type: AuthorType; confidence: number; reason: string } {
  const hay = trLower(`${s.handle} ${s.displayName} ${s.bio}`);
  const has = (list: string[]) => list.some((h) => hay.includes(h));

  if (has(INSTITUTION_HINTS))
    return { type: "institution", confidence: 0.9, reason: "Kurum adi veya resmi yapi isareti tespit edildi." };
  if (has(NEWS_HINTS))
    return { type: "news", confidence: 0.85, reason: "Haber kurulusu veya gazeteci isareti tespit edildi." };
  if (s.isVerified && has(OFFICIAL_HINTS))
    return { type: "official", confidence: 0.8, reason: "Dogrulanmis resmi hesap isareti." };
  if (s.isVerified && s.followerCount >= 100_000)
    return { type: "public_figure", confidence: 0.6, reason: "Dogrulanmis ve genis erisimli hesap." };

  return {
    type: "individual",
    confidence: 0.5,
    reason: "Kurumsal isaret bulunamadi. Guvenli varsayim: bireysel hesap.",
  };
}

export const REPLYABLE: AuthorType[] = ["institution", "official", "news", "public_figure"];

export interface OpportunityInput {
  author: AuthorSignals;
  likes: number;
  publishedAt: Date;
  now: Date;
  topicMatched: boolean;
  minLikes: number;
  ttlHours: number;
  dailyDraftedCount: number;
  dailyCap: number;
}

export interface OpportunityDecision {
  create: boolean;
  authorType: AuthorType;
  decayAt: Date;
  reasons: string[];
}

export function evaluateOpportunity(i: OpportunityInput): OpportunityDecision {
  const { type } = classifyAuthor(i.author);
  const decayAt = new Date(i.publishedAt.getTime() + i.ttlHours * 3600_000);
  const reasons: string[] = [];
  let create = true;

  if (!REPLYABLE.includes(type)) {
    create = false;
    reasons.push("Bireysel kisisel hesap. Yanit firsati olusturulmaz.");
  }
  if (!i.topicMatched) {
    create = false;
    reasons.push("Konu kumeleriyle eslesmiyor.");
  }
  if (i.likes < i.minLikes) {
    create = false;
    reasons.push(`Etkilesim esigi altinda (${i.likes} < ${i.minLikes}).`);
  }
  if (decayAt.getTime() <= i.now.getTime()) {
    create = false;
    reasons.push("Firsatin omru dolmus.");
  }
  if (i.dailyDraftedCount >= i.dailyCap) {
    create = false;
    reasons.push(`Gunluk yanit taslagi tavani doldu (${i.dailyCap}).`);
  }
  if (create) reasons.push(`Uygun. Yazar tipi: ${type}.`);

  return { create, authorType: type, decayAt, reasons };
}

/** Yanitlarin hukuki risk seviyesi bir kademe yukseltilir. */
export function escalateReplyRisk(level: "LOW" | "MEDIUM" | "HIGH" | "BLOCKED") {
  const order = ["LOW", "MEDIUM", "HIGH", "BLOCKED"] as const;
  const idx = order.indexOf(level);
  return order[Math.min(idx + 1, order.length - 1)]!;
}
