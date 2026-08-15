import type { Locale } from "@/lib/i18n/config";
import { content } from "@/lib/i18n/content";
import { curriculum } from "@/lib/seo/curriculum";
import { localizedCurriculum } from "@/lib/i18n/curriculum";
import { disciplines } from "@/lib/seo/site";

/**
 * FORMDA SEÇİLEBİLİR PROGRAMLAR.
 *
 * Kâğıt formda "Katılınacak Program(lar)" boş bir çizgidir ve veli oraya ne
 * yazacağını bilemez; merkez de her formda farklı yazımla uğraşır ("İHA",
 * "iha vtol", "drone"). Burada liste SİTENİN KENDİ KAYNAĞINDAN üretiliyor:
 * on disiplin `seo/site.ts`, dört müfredat programı `seo/curriculum.ts`.
 * Yeni bir eğitim eklendiğinde formda kendiliğinden görünür; ayrı bir liste
 * tutulsaydı er ya da geç sayfayla ayrışırdı.
 *
 * KİMLİK GİDER, AD GELMEZ. İstemci yalnızca `id` gönderir; okunur ad
 * sunucuda bu listeden okunur. İstemcinin gönderdiği metin doğrudan PDF'e
 * basılsaydı forma istenen her şey yazdırılabilirdi.
 */

export type ProgramSecenegi = {
  id: string;
  /** Kaynak: hangi listeden geldiği — arayüzde gruplamak için. */
  grup: "disiplin" | "mufredat";
};

export const programSecenekleri: readonly ProgramSecenegi[] = [
  ...disciplines.map((d) => ({ id: `d:${d.id}`, grup: "disiplin" as const })),
  ...curriculum.map((p) => ({ id: `m:${p.id}`, grup: "mufredat" as const })),
];

/** Seçeneğin görünen adı — disiplinler dile göre, müfredat programları Türkçe. */
export function programAdi(id: string, locale: Locale): string {
  if (id.startsWith("d:")) {
    const key = id.slice(2) as keyof ReturnType<typeof content>["disciplines"];
    return content(locale).disciplines[key]?.title ?? id;
  }
  // Müfredat program adları da dile göre gelir (çeviri katmanı
  // lib/i18n/curriculum). PDF Türkçe kalır: programAdiTr "tr" ile çağırır.
  return localizedCurriculum(locale).find((p) => `m:${p.id}` === id)?.title ?? id;
}

/** PDF ve e-posta için Türkçe ad — belge dili her zaman Türkçedir. */
export function programAdiTr(id: string): string {
  return programAdi(id, "tr");
}
