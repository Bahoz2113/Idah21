export const DRAFT_POST_VERSION = "draft-post@1.0.0";

export interface SourceFact { url: string; publishedAt: string; claim: string; verified: boolean }

export function buildDraftPostTask(input: {
  topicTitle: string;
  topicSummary: string;
  facts: SourceFact[];
  uncertainties: string[];
  contentCategory: string;
  benchmarkHints: string[];
}): string {
  const facts = input.facts
    .map((f) => `- [${f.verified ? "DOGRULANMIS" : "IDDIA"}] ${f.claim} (${f.url}, ${f.publishedAt})`)
    .join("\n");
  const hints = input.benchmarkHints.length
    ? `\nBU HAFTA DENENECEK KALIPLAR (zorunlu degil):\n${input.benchmarkHints.map((h) => `- ${h}`).join("\n")}`
    : "";

  return `GOREV: Asagidaki gundem icin tek bir X gonderisi taslagi yaz.

KONU: ${input.topicTitle}
OZET: ${input.topicSummary}
KATEGORI: ${input.contentCategory}

<untrusted_source>
KAYNAK PAKETI:
${facts}

BELIRSIZLIKLER (bunlari kesinmis gibi yazma):
${input.uncertainties.map((u) => `- ${u}`).join("\n") || "- yok"}
</untrusted_source>${hints}

YAZIM KURALLARI:
- 280 karakteri asma.
- Ilk cumle 12 kelimeyi gecmesin ve somut olsun (rakam, tarih veya mevzuat referansi).
- Metne URL koyma.
- En fazla 2 hashtag; uygun degilse hic kullanma.
- Elestiriyi somut talep veya aciklama cagrisiyla tamamla.
- Kaynak paketinde olmayan hicbir olguyu yazma.

Ayrica ana metninkinden FARKLI iki alternatif acilis cumlesi uret.

JSON SEMASI:
{
  "promptVersion": "${DRAFT_POST_VERSION}",
  "text": string,
  "altHooks": [string, string],
  "hashtags": string[],
  "sourceSummary": string,
  "factsGroundedInSources": true,
  "uncertainties": string[]
}`;
}
