import type { LlmGateway } from "./types";
import { createAnthropicGateway } from "./anthropic";
import { createOpenAiGateway, createGeminiGateway } from "./unimplemented";

export interface LlmEnv {
  LLM_PROVIDER: "anthropic" | "openai" | "gemini";
  ANTHROPIC_API_KEY: string;
}

/** budget-model.md'de tekrarlanmasin diye tek yerde: @hepsen/core pricing.ts ile ayni model adi. */
export const ANTHROPIC_MODEL = "claude-sonnet-5";

export function getLlmGateway(env: LlmEnv): LlmGateway {
  switch (env.LLM_PROVIDER) {
    case "anthropic":
      return createAnthropicGateway(env.ANTHROPIC_API_KEY, ANTHROPIC_MODEL);
    case "openai":
      return createOpenAiGateway();
    case "gemini":
      return createGeminiGateway();
    default:
      throw new Error(`Bilinmeyen LLM_PROVIDER: ${env.LLM_PROVIDER as string}`);
  }
}
