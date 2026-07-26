import type { LlmGateway } from "./types";

/**
 * Master prompt md. 24: "AI provider degistirilebilir olsun; uygulama tek
 * modele bagimli kalmasin." Bu turda yalnizca Anthropic implementasyonu
 * yapildi (kullanicida hazir anahtar bu). OpenAI/Gemini icin mock KULLANMA
 * yerine acikca "uygulanmadi" hatasi verilir (master prompt md. 35: "Mock
 * kullanimini acikca isaretle; production entegrasyonunu gizleme").
 */
export function createOpenAiGateway(): LlmGateway {
  return {
    async complete() {
      throw new Error("OpenAI LLM Gateway henüz uygulanmadı — bu turda yalnızca Anthropic destekleniyor.");
    },
  };
}

export function createGeminiGateway(): LlmGateway {
  return {
    async complete() {
      throw new Error("Gemini LLM Gateway henüz uygulanmadı — bu turda yalnızca Anthropic destekleniyor.");
    },
  };
}
