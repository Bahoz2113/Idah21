export const TOPIC_SCORING_VERSION = "topic-scoring@1.0.0";

export interface ScorableItem {
  collectedItemId: string;
  title: string;
  content: string;
  sourceName: string;
  publishedAt: string;
}

/**
 * Toplu gundem puanlama gorevi. Yalnizca LLM'in degerlendirebilecegi
 * semantik sinyaller istenir (healthRelevance, urgency, rightsImpact,
 * batmanRelevance, discussionPotential, isHeavyAllegation, category).
 * sourceReliability ve trendStrength deterministiktir, burada istenmez
 * (bkz. apps/hepsen-web/src/lib/topics/signals.ts).
 */
export function buildTopicScoringTask(items: ScorableItem[]): string {
  const list = items
    .map(
      (it, i) =>
        `${i + 1}. [id:${it.collectedItemId}] (${it.sourceName}, ${it.publishedAt})\n${it.title}\n${it.content}`,
    )
    .join("\n\n");

  return `GOREV: Asagidaki toplanan icerikleri saglik calisanlari ve HEP-SEN Batman
acisindan gundem puanlamasi icin degerlendir. Her ogeye ayri ayri puan ver.

<untrusted_source>
TOPLANAN ICERIKLER:
${list}
</untrusted_source>

DEGERLENDIRME OLCUTLERI (her biri 0-100):
- healthRelevance: saglik calisanlarini dogrudan ilgilendirme derecesi.
- urgency: konunun aciliyeti/guncelligi.
- rightsImpact: ozluk haklari, ucret, calisma kosullari uzerindeki etkisi.
- batmanRelevance: Batman ili/yerel saglik gundemiyle iliskisi (ulusal
  gundemse dusuk puanla).
- discussionPotential: kamuoyunda tartisma/etkilesim yaratma potansiyeli.
- isHeavyAllegation: icerik dogrulanmamis agir bir suc isnadi/iddia iceriyorsa true.
- category: konuyu tek kelime/kisa ifadeyle sinifla (orn. "ozluk_haklari", "atama", "mevzuat").

Kaynakta olmayan hicbir olguyu uretme. Emin degilsen dusuk puan ver.

JSON SEMASI:
{
  "promptVersion": "${TOPIC_SCORING_VERSION}",
  "items": [
    {
      "collectedItemId": string,
      "healthRelevance": number,
      "urgency": number,
      "rightsImpact": number,
      "batmanRelevance": number,
      "discussionPotential": number,
      "isHeavyAllegation": boolean,
      "category": string
    }
  ]
}`;
}
