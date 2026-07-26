export const LEGAL_REVIEW_VERSION = "legal-review@1.0.0";

/**
 * ASAMA 2. Deterministik blocklist'ten SONRA calisir.
 * Bu modelin "sorun yok" demesi blocklist isabetini gecersiz KILMAZ.
 */
export function buildLegalReviewTask(text: string, blocklistHits: string[]): string {
  return `GOREV: Asagidaki metni Turk hukuku ve kurumsal itibar acisindan degerlendir.

DETERMINISTIK TARAMADA BULUNANLAR (bunlari gecersiz kilamazsin, yalnizca baglam ekleyebilirsin):
${blocklistHits.length ? blocklistHits.map((h) => `- ${h}`).join("\n") : "- yok"}

DEGERLENDIRILECEK METIN:
<untrusted_source>
${text}
</untrusted_source>

SEVIYELER:
LOW     Resmi bilgi, dogrulanmis haber ozeti, genel degerlendirme
MEDIUM  Kurum uygulamasina elestiri, tartismali yorum
HIGH    Kisi adi, agir iddia, kusur veya suc imasi
BLOCKED Hakaret, tehdit, suc isnadi, ozel hayat, saglik verisi, siddet cagrisi,
        ayrimcilik veya dogrulanmamis agir iddia

Degerlendirmen nihai hukuk gorusu degildir; panelde bu uyari gosterilir.
HIGH veya BLOCKED verirsen daha guvenli bir alternatif metin de uret.

JSON SEMASI:
{
  "promptVersion": "${LEGAL_REVIEW_VERSION}",
  "level": "LOW"|"MEDIUM"|"HIGH"|"BLOCKED",
  "reasons": string[],
  "saferAlternative": string|null,
  "namedEntities": string[]
}`;
}
