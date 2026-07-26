export const TONE_REVIEW_VERSION = "tone-review@1.0.0";

/** Dogal dil / anti-AI kontrolu — master prompt md. 13. */
export function buildToneReviewTask(text: string, styleGuideHints: string[] = []): string {
  const hints = styleGuideHints.length
    ? `\nBASKANIN USLUP TERCIHLERI:\n${styleGuideHints.map((h) => `- ${h}`).join("\n")}`
    : "";

  return `GOREV: Asagidaki metni yapay zeka hissi, klise ve kurumsal/insan uslubu
acisindan degerlendir.

DEGERLENDIRILECEK METIN:
<untrusted_source>
${text}
</untrusted_source>${hints}

ARANACAK SORUNLAR:
- Yapay zeka klisesi: "bir kez daha", "yalnizca degil ayni zamanda",
  "bilindigi uzere", "hepimizin bildigi gibi", surekli uclu siralama.
- Gereksiz unlem, emoji, slogan tekrari.
- Dogal olmayan, tek duze cumle uzunlugu.
- Icerik kisaysa sirf uzatmak icin eklenmis dolgu cumlesi.

PUANLAMA (0-100):
- humanStyleScore: metnin insan tarafindan yazilmis gibi dogal hissetme derecesi.
- corporateAlignmentScore: HEP-SEN kurumsal kimligi ve baskanlik agirligiyla uyum.
- toneScore: kararli-ama-olculu ton hedefine uyum.

Skorlardan herhangi biri dusukse detectedCliches listesini doldur ve
rewrite alaninda duzeltilmis bir versiyon oner (aksi halde rewrite: null).

JSON SEMASI:
{
  "promptVersion": "${TONE_REVIEW_VERSION}",
  "humanStyleScore": number,
  "corporateAlignmentScore": number,
  "toneScore": number,
  "detectedCliches": string[],
  "rewrite": string|null
}`;
}
