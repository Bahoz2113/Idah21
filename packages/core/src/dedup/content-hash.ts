import { createHash } from "node:crypto";

/** Turkce-guvenli kucuk harf. */
export function trLower(s: string): string {
  return s.replace(/İ/g, "i").replace(/I/g, "ı").toLocaleLowerCase("tr-TR");
}

/** Dedup icin metni normalize eder: URL, etiket, noktalama, fazla bosluk atilir. */
export function normalizeForHash(text: string): string {
  return trLower(text)
    .replace(/https?:\/\/\S+/g, " ")
    .replace(/[#@]\S+/g, " ")
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function contentHash(...parts: string[]): string {
  return createHash("sha256").update(parts.map(normalizeForHash).join("|")).digest("hex");
}

/** Jaccard benzerligi — yakin kopya tespiti icin. */
export function similarity(a: string, b: string): number {
  const ta = new Set(normalizeForHash(a).split(" ").filter(Boolean));
  const tb = new Set(normalizeForHash(b).split(" ").filter(Boolean));
  if (ta.size === 0 || tb.size === 0) return 0;
  let inter = 0;
  for (const t of ta) if (tb.has(t)) inter++;
  return inter / (ta.size + tb.size - inter);
}
