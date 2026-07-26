export const DRAFT_REPLY_VERSION = "draft-reply@1.0.0";

export function buildDraftReplyTask(input: {
  targetPostId: string;
  targetAuthorHandle: string;
  targetAuthorType: string;
  targetSummary: string;
  ourPosition: string;
}): string {
  return `GOREV: Asagidaki gundem gonderisine baskan adina bir YANIT taslagi yaz.

HEDEF GONDERI: ${input.targetPostId} (@${input.targetAuthorHandle}, tip: ${input.targetAuthorType})

<untrusted_source>
HEDEF GONDERININ OZETI:
${input.targetSummary}
</untrusted_source>

HEP-SEN'IN BU KONUDAKI DURUSU:
${input.ourPosition}

YANIT KURALLARI (ek ve daha siki):
- Yanit tek basina anlamli olmali; karsi tarafin metnini tekrar etme.
- Hashtag KULLANMA.
- 240 karakteri asma.
- Kisiyi degil, karari veya uygulamayi hedef al.
- Alinti-tweet mantigiyla kisi hedefleyen elestiri yazma.
- Tartisma acma; bilgi ver, saha karsiligini soyle, somut talebi belirt.
- Karsi tarafa dogrulanmamis hicbir isnat yoneltme.

JSON SEMASI:
{
  "promptVersion": "${DRAFT_REPLY_VERSION}",
  "text": string,
  "altHooks": [string, string],
  "hashtags": [],
  "replyToPostId": "${input.targetPostId}",
  "sourceSummary": string,
  "factsGroundedInSources": true,
  "uncertainties": string[]
}`;
}
