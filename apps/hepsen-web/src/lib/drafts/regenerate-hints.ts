/** Master prompt md. 21 ikincil menu — UI metni core'a sizmaz, burada tutulur. */
export const REGENERATE_HINTS = {
  daha_kararli: "Metni daha kararlı ve net bir dille yeniden yaz; ölçülü ama daha az yumuşak olsun.",
  daha_kisa: "Metni daha kısa ve öz yaz; gereksiz kelimeleri çıkar.",
  daha_dogal: "Metni daha doğal ve insan sesine yakın yaz; yapay/klişe ifadelerden kaçın.",
  daha_kurumsal: "Metni HEP-SEN kurumsal kimliğine ve başkanlık ağırlığına daha uygun yaz.",
  riski_azalt: "Metindeki hukuki/itibar riskini azalt; daha temkinli ve ölçülü bir dil kullan.",
  hashtag_degistir: "Metni aynı tut ama farklı, konuya daha uygun hashtag alternatifleri öner.",
} as const;

export type RegenerateHintKey = keyof typeof REGENERATE_HINTS;

export function isRegenerateHintKey(value: string): value is RegenerateHintKey {
  return value in REGENERATE_HINTS;
}
