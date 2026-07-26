import { similarity } from "@hepsen/core";

export interface ClusterableItem {
  id: string;
  sourceId: string;
  title: string;
  content: string;
}

export interface ItemCluster {
  items: ClusterableItem[];
  distinctSourceCount: number;
}

const SIMILARITY_THRESHOLD = 0.35;

/**
 * Ayni gundemi anlatan (farkli kaynaklardan da gelebilen) ogeleri tek
 * kumede toplar. Tek-kaynakli agir iddia kuralinin ("scoreTopic")
 * dogru calismasi icin distinctSourceCount burada hesaplanir. Basit
 * acgozlu (greedy) kumeleme — gunluk toplu is icin yeterli, O(n*k).
 */
export function clusterItems(items: ClusterableItem[]): ItemCluster[] {
  const clusters: ItemCluster[] = [];

  for (const item of items) {
    const text = `${item.title} ${item.content}`;
    const match = clusters.find((cluster) => {
      const rep = cluster.items[0]!;
      return similarity(text, `${rep.title} ${rep.content}`) >= SIMILARITY_THRESHOLD;
    });

    if (match) {
      match.items.push(item);
      match.distinctSourceCount = new Set(match.items.map((i) => i.sourceId)).size;
    } else {
      clusters.push({ items: [item], distinctSourceCount: 1 });
    }
  }

  return clusters;
}
