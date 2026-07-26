import { trLower } from "../dedup/content-hash.js";

/**
 * DETERMINISTIK HUKUK GUARD'I — Asama 1.
 *
 * LLM'e guvenilmez. Bu modul regex ve sozluk tabanlidir, tek basina BLOCKED
 * verebilir ve LLM degerlendirmesinden ONCE calisir. LLM'in "sorun yok" demesi
 * buradaki bir isabeti gecersiz kilamaz.
 *
 * Sozlukler seed verisidir; Ayarlar > Yasak ifadeler ekranindan genisletilir.
 */

export type RiskLevel = "LOW" | "MEDIUM" | "HIGH" | "BLOCKED";

export type HitCategory =
  | "profanity"
  | "personal_insult"
  | "crime_accusation"
  | "threat"
  | "discrimination"
  | "private_life"
  | "health_data"
  | "harsh_word"
  | "absolute_claim"
  | "named_person";

export interface BlocklistHit {
  category: HitCategory;
  matched: string;
  index: number;
  level: RiskLevel;
  /** Panelde gosterilecek Turkce gerekce */
  reason: string;
}

export interface BlocklistResult {
  level: RiskLevel;
  hits: BlocklistHit[];
  /** true ise LLM asamasina gecmeden yayin kapatilir */
  blocked: boolean;
}

const LEVEL_ORDER: Record<RiskLevel, number> = { LOW: 0, MEDIUM: 1, HIGH: 2, BLOCKED: 3 };

/** Turkce ek toleransi: kok + olasi cekim ekleri */
const SUF = "(?:[a-zçğıöşü]{0,6})";

interface Rule {
  category: HitCategory;
  level: RiskLevel;
  reason: string;
  patterns: RegExp[];
}

/* ------------------------------------------------------------------ */
/* SOZLUKLER                                                           */
/* ------------------------------------------------------------------ */

/** Kufur ve agir hakaret kokleri — dogrudan BLOCKED */
const PROFANITY_ROOTS = [
  "amk", "aq", "oç", "piç", "orospu", "yavşak", "pezevenk", "deyyus",
  "şerefsiz", "namussuz", "haysiyetsiz", "alçak herif", "it herif",
  "gerizekalı", "geri zekalı", "salak", "aptal", "beyinsiz", "dangalak",
  "hayvan herif", "köpek gibi", "sürtük", "kahpe",
];

/** Kisiye yonelik asagilama kaliplari */
const PERSONAL_INSULT_PATTERNS = [
  new RegExp(`(?<![\\p{L}])cahil${SUF}\\s+(bakan|müdür|başhekim|yönetici|bürokrat)`, "u"),
  new RegExp(`(?<![\\p{L}])(bu|şu)\\s+(adam|herif|kadın|zat)\\s+[\\p{L}\\p{N}]*\\s*(bilmez|anlamaz|beceriksiz)`, "u"),
  new RegExp(`(?<![\\p{L}])beceriksiz${SUF}\\s+(bakan|müdür|başhekim|yönetici)`, "u"),
  new RegExp(`(?<![\\p{L}])koltuk\\s+sevdalısı`, "u"),
];

/** Kesin suc isnadi — resmi karar olmadan kullanilamaz */
const CRIME_ACCUSATION_PATTERNS = [
  new RegExp(`(?<![\\p{L}])(hırsızlık|rüşvet|yolsuzluk|zimmet|irtikap|dolandırıcılık)${SUF}\\s*(yapt|aldı|karıştı|batağı)`, "u"),
  new RegExp(`(?<![\\p{L}])görev${SUF}\\s+kötüye\\s+kullan${SUF}`, "u"),
  new RegExp(`(?<![\\p{L}])suç\\s+işle${SUF}`, "u"),
  new RegExp(`(?<![\\p{L}])(çaldı|çalmış|çalıyor)(?![\\p{L}])`, "u"),
  new RegExp(`(?<![\\p{L}])peşkeş\\s+çek${SUF}`, "u"),
  new RegExp(`(?<![\\p{L}])haksız\\s+kazanç\\s+sağla${SUF}`, "u"),
  new RegExp(`(?<![\\p{L}])cebine\\s+at${SUF}`, "u"),
  new RegExp(`(?<![\\p{L}])(hırsız|rüşvetçi|yolsuzluk yapan)(?![\\p{L}])`, "u"),
];

/** Tehdit ve siddet cagrisi */
const THREAT_PATTERNS = [
  new RegExp(`(?<![\\p{L}])hesab${SUF}\\s+sor${SUF}\\s+(yoksa|aksi)`, "u"),
  new RegExp(`(?<![\\p{L}])pişman\\s+ol${SUF}`, "u"),
  new RegExp(`(?<![\\p{L}])günün${SUF}\\s+gör${SUF}`, "u"),
  new RegExp(`(?<![\\p{L}])(ezeceğiz|yakacağız|gebertir|canına oku)${SUF}`, "u"),
  new RegExp(`(?<![\\p{L}])sokakta\\s+bulur${SUF}`, "u"),
  new RegExp(`(?<![\\p{L}])meydan${SUF}\\s+in${SUF}\\s+hesap`, "u"),
];

/** Ayrimcilik isaretcileri — etnik, dini, mezhepsel, cinsiyetci genelleme */
const DISCRIMINATION_PATTERNS = [
  new RegExp(`(?<![\\p{L}])(kürtler|türkler|araplar|aleviler|sünniler|suriyeliler|mülteciler)\\s+(hep|hepsi|zaten|kesin)`, "u"),
  new RegExp(`(?<![\\p{L}])(kadınlar|erkekler)\\s+(zaten|hep|kesin)\\s+[\\p{L}\\p{N}]*\\s*(yapamaz|beceremez|olmaz)`, "u"),
  new RegExp(`(?<![\\p{L}])o\\s+(mezhep|ırk|milliyet)ten\\s+ol${SUF}\\s+için`, "u"),
];

/** Ozel hayat */
const PRIVATE_LIFE_PATTERNS = [
  new RegExp(`(?<![\\p{L}])(eşi|karısı|kocası|çocuğu|ailesi)\\s+[\\p{L}\\p{N}]*\\s*(ile ilişki|aldat|boşan)`, "u"),
  new RegExp(`(?<![\\p{L}])evlilik\\s+dışı`, "u"),
  new RegExp(`(?<![\\p{L}])gizli\\s+(görüşme|ilişki)\\s+kayd${SUF}`, "u"),
];

/** Saglik verisi — ozel nitelikli kisisel veri (KVKK m.6) */
const HEALTH_DATA_PATTERNS = [
  new RegExp(`(?<![\\p{L}])(hiv|aids|kanser|şizofren|bipolar|psikiyatri|bağımlılık)[\\p{L}\\p{N}]*\\s+(hastası|teşhisi|tanısı|tedavisi)`, "u"),
  new RegExp(`(?<![\\p{L}])(tahlil|rapor|epikriz)\\s+sonuc${SUF}\\s+[\\p{L}\\p{N}]*\\s*(ekte|paylaş)`, "u"),
  new RegExp(`(?<![\\p{L}])ruh\\s+sağlığı\\s+(raporu|geçmişi)`, "u"),
];

/** Sert ama mesru olabilecek kelimeler — BLOCKED degil, MEDIUM isaret */
const HARSH_WORDS = [
  "rezalet", "skandal", "utanç", "vahim", "içler acısı", "kepazelik", "faciası",
];

/** Kesinlik iddiasi — HIGH, kaynak zorunlulugu tetikler */
const ABSOLUTE_CLAIM_PATTERNS = [
  new RegExp(`(?<![\\p{L}])kesinlikle\\s+(suçlu|sorumlu|kasıtlı)`, "u"),
  new RegExp(`(?<![\\p{L}])bilerek\\s+ve\\s+isteyerek`, "u"),
  new RegExp(`(?<![\\p{L}])kasten\\s+[\\p{L}\\p{N}]*\\s*(yap|engelle|geciktir)${SUF}`, "u"),
  new RegExp(`(?<![\\p{L}])hiç\\s+şüphe\\s+yok\\s+ki`, "u"),
];

/** Kisi adi tespiti — unvan + buyuk harfle baslayan ad. HIGH tetikler. */
const NAMED_PERSON_RE =
  /\b(Dr|Doç|Prof|Op|Uzm|Sayın|Başhekim|Müdür|Bakan|Vali|Kaymakam|Genel Müdür|Müsteşar)\.?\s+[A-ZÇĞİÖŞÜ][a-zçğıöşü]+(?:\s+[A-ZÇĞİÖŞÜ][a-zçğıöşü]+)?/gu;

/* ------------------------------------------------------------------ */
/* KURAL TABLOSU                                                       */
/* ------------------------------------------------------------------ */

function rootsToPatterns(roots: string[]): RegExp[] {
  return roots.map((r) => {
    const escaped = r.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    return new RegExp(`(?:^|[^\\p{L}])${escaped}${SUF}(?![\\p{L}])`, "u");
  });
}

const RULES: Rule[] = [
  {
    category: "profanity",
    level: "BLOCKED",
    reason: "Kufur veya agir hakaret ifadesi. Iletisim anayasasi md. 2 geregi yayimlanamaz.",
    patterns: rootsToPatterns(PROFANITY_ROOTS),
  },
  {
    category: "personal_insult",
    level: "BLOCKED",
    reason: "Kisiye yonelik asagilama. Elestiri kisiye degil karara ve uygulamaya yoneltilmelidir.",
    patterns: PERSONAL_INSULT_PATTERNS,
  },
  {
    category: "crime_accusation",
    level: "BLOCKED",
    reason: "Kesin suc isnadi. Resmi karar veya acik belge olmadan kullanilamaz (md. 3).",
    patterns: CRIME_ACCUSATION_PATTERNS,
  },
  {
    category: "threat",
    level: "BLOCKED",
    reason: "Tehdit veya siddet cagrisi iceriyor.",
    patterns: THREAT_PATTERNS,
  },
  {
    category: "discrimination",
    level: "BLOCKED",
    reason: "Etnik, dini veya cinsiyetci genelleme iceriyor.",
    patterns: DISCRIMINATION_PATTERNS,
  },
  {
    category: "private_life",
    level: "BLOCKED",
    reason: "Ozel hayata iliskin bilgi. Kamusal gorevle ilgisi olmayan icerik paylasilamaz.",
    patterns: PRIVATE_LIFE_PATTERNS,
  },
  {
    category: "health_data",
    level: "BLOCKED",
    reason: "Ozel nitelikli kisisel saglik verisi (KVKK md. 6). Islenemez ve paylasilamaz.",
    patterns: HEALTH_DATA_PATTERNS,
  },
  {
    category: "absolute_claim",
    level: "HIGH",
    reason: "Kesinlik iddiasi. Kaynak yoksa 'iddia' veya 'dogrulanamadi' etiketiyle yumusatilmali.",
    patterns: ABSOLUTE_CLAIM_PATTERNS,
  },
  {
    category: "harsh_word",
    level: "MEDIUM",
    reason: "Sert ton. Mesru olabilir ancak somut talep veya cozum onerisiyle dengelenmelidir.",
    patterns: rootsToPatterns(HARSH_WORDS),
  },
];

/* ------------------------------------------------------------------ */
/* CALISTIRICI                                                         */
/* ------------------------------------------------------------------ */

export function runBlocklist(text: string): BlocklistResult {
  const lower = trLower(text);
  const hits: BlocklistHit[] = [];

  for (const rule of RULES) {
    for (const re of rule.patterns) {
      const m = re.exec(lower);
      if (m) {
        hits.push({
          category: rule.category,
          matched: m[0].trim(),
          index: m.index,
          level: rule.level,
          reason: rule.reason,
        });
        break; // ayni kategoriden tek isabet yeterli
      }
    }
  }

  // Kisi adi tespiti orijinal metinde (buyuk harf onemli)
  const nameMatches = [...text.matchAll(NAMED_PERSON_RE)];
  for (const nm of nameMatches.slice(0, 3)) {
    hits.push({
      category: "named_person",
      matched: nm[0],
      index: nm.index ?? 0,
      level: "HIGH",
      reason:
        "Metinde kisi adi geciyor. Kisi adiyla yapilan elestiri yuksek risklidir; " +
        "iddia dogrulanmis ve kamusal gorevle ilgili olmalidir.",
    });
  }

  const level = hits.reduce<RiskLevel>(
    (acc, h) => (LEVEL_ORDER[h.level] > LEVEL_ORDER[acc] ? h.level : acc),
    "LOW",
  );

  return { level, hits, blocked: level === "BLOCKED" };
}

/** Iki asamali guard'in birlestirilmesi. Blocklist LLM'i EZER. */
export function combineRisk(blocklist: BlocklistResult, llmLevel: RiskLevel): RiskLevel {
  return LEVEL_ORDER[blocklist.level] >= LEVEL_ORDER[llmLevel] ? blocklist.level : llmLevel;
}

/** Yayin izni. HIGH ve BLOCKED yayimlanamaz. */
export function canPublish(level: RiskLevel): boolean {
  return level === "LOW" || level === "MEDIUM";
}
