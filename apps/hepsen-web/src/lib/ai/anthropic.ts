import type { LlmCallInput, LlmCallResult, LlmGateway } from "./types";

const ANTHROPIC_API_URL = "https://api.anthropic.com/v1/messages";
const ANTHROPIC_VERSION = "2023-06-01";

interface AnthropicResponse {
  content: { type: string; text?: string }[];
  usage: {
    input_tokens: number;
    output_tokens: number;
    cache_read_input_tokens?: number;
  };
  model: string;
}

/**
 * Ham fetch ile Anthropic Messages API — SDK eklenmedi (bkz. docs/adr/0005):
 * kurulu SDK surumunde cache_control yalnizca beta ad alaninda destekleniyor,
 * ham HTTP cagrisi surum bagimsiz ve mock'lanmasi daha kolay.
 * `systemCacheable` dizisindeki her metin ayri bir cache_control:ephemeral
 * bloguna yazilir (1. katman SYSTEM_POLICY, 2. katman presidentialContext).
 */
export function createAnthropicGateway(apiKey: string, model: string): LlmGateway {
  return {
    async complete(input: LlmCallInput): Promise<LlmCallResult> {
      const system = input.systemCacheable.map((text) => ({
        type: "text" as const,
        text,
        cache_control: { type: "ephemeral" as const },
      }));

      const res = await fetch(ANTHROPIC_API_URL, {
        method: "POST",
        headers: {
          "x-api-key": apiKey,
          "anthropic-version": ANTHROPIC_VERSION,
          "content-type": "application/json",
        },
        body: JSON.stringify({
          model,
          max_tokens: input.maxTokens,
          system,
          messages: [{ role: "user", content: input.task }],
        }),
      });

      if (!res.ok) {
        // API anahtari asla hata mesajina/loga yazilmaz.
        throw new Error(`Anthropic API hatası: HTTP ${res.status}`);
      }

      const json = (await res.json()) as AnthropicResponse;
      const raw = json.content.find((b) => b.type === "text")?.text ?? "";

      return {
        raw,
        inputTokens: json.usage.input_tokens,
        outputTokens: json.usage.output_tokens,
        cachedTokens: json.usage.cache_read_input_tokens ?? 0,
        model: json.model,
      };
    },
  };
}
