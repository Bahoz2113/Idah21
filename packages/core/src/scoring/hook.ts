/** Acilis cumlesi gucu — master prompt md. 19 */
import { trLower } from "../dedup/content-hash.js";

const CLICHES = [
  "bir kez daha", "yalnızca değil", "aynı zamanda", "bilindiği üzere",
  "malumunuz", "hepimizin bildiği gibi", "günümüzde", "son zamanlarda",
  "unutulmamalıdır ki", "şunu belirtmek isterim",
];

export interface HookScoreResult {
  score: number;              // 0-100
  firstSentence: string;
  wordCount: number;
  components: { specificity: number; stakeClarity: number; tension: number; brevityFit: number };
  clichePenalty: number;
  suggestions: string[];
}

export function firstSentenceOf(text: string): string {
  const t = text.trim();
  const m = t.match(/^[\s\S]*?[.!?…](\s|$)/);
  return (m ? m[0] : t.split("\n")[0] ?? t).trim();
}

export function scoreHook(text: string): HookScoreResult {
  const fs = firstSentenceOf(text);
  const low = trLower(fs);
  const words = fs.split(/\s+/).filter(Boolean);
  const wc = words.length;
  const suggestions: string[] = [];

  // Somutluk: rakam, yuzde, tarih, para birimi, mevzuat referansi
  let specificity = 0;
  if (/\d/.test(fs)) specificity += 45;
  if (/%|\byüzde\b|\bTL\b|\blira\b/i.test(fs)) specificity += 20;
  if (/\b(madde|yönetmelik|genelge|resmî gazete|resmi gazete|kanun)\b/i.test(low)) specificity += 25;
  if (/\b(dün|bugün|bu sabah|bu hafta|\d{1,2}\s+\p{L}+)\b/u.test(low)) specificity += 10;
  specificity = Math.min(100, specificity);
  if (specificity < 40) suggestions.push("Acilisa somut bir rakam, tarih veya mevzuat referansi ekle.");

  // Kimin neyi etkileniyor
  const actors = /\b(hemşire|ebe|paramedik|tekniker|sekreter|hekim|doktor|sağlık çalışan|personel|memur|batman)/u;
  const effects = /\b(kaybediyor|alamıyor|ödenmiyor|kesiliyor|zorlanıyor|mağdur|hak|ücret|nöbet|maaş|zam)/u;
  let stakeClarity = 0;
  if (actors.test(low)) stakeClarity += 55;
  if (effects.test(low)) stakeClarity += 45;
  stakeClarity = Math.min(100, stakeClarity);
  if (stakeClarity < 55) suggestions.push("Ilk cumlede kimin neyinin etkilendigi acikca gorunmuyor.");

  // Gerilim
  let tension = 0;
  if (/\b(ama|ancak|fakat|rağmen|oysa|hâlâ|hala|neden|niçin|kim)\b/u.test(low)) tension += 45;
  if (/\?/.test(fs)) tension += 25;
  if (/\b(soruyoruz|bekliyoruz|talep ediyoruz|açıklansın|yanıt)\b/u.test(low)) tension += 30;
  tension = Math.min(100, tension);
  if (tension < 35) suggestions.push("Bir gerilim, celiski veya somut talep ekle.");

  // Kisalik
  let brevityFit: number;
  if (wc <= 12) brevityFit = 100;
  else if (wc <= 16) brevityFit = 75;
  else if (wc <= 22) brevityFit = 45;
  else brevityFit = 15;
  if (brevityFit < 75) suggestions.push(`Acilis ${wc} kelime. 12 kelimenin altina indir.`);

  const clicheCount = CLICHES.filter((c) => low.includes(c)).length;
  const clichePenalty = clicheCount * 12;
  if (clicheCount > 0) suggestions.push("Klise kalip tespit edildi, acilisi ozgunlestir.");

  const raw =
    0.35 * specificity + 0.25 * stakeClarity + 0.2 * tension + 0.2 * brevityFit - clichePenalty;

  return {
    score: Math.round(Math.max(0, Math.min(100, raw)) * 10) / 10,
    firstSentence: fs,
    wordCount: wc,
    components: { specificity, stakeClarity, tension, brevityFit },
    clichePenalty,
    suggestions,
  };
}

export const HOOK_REWRITE_THRESHOLD = 55;
