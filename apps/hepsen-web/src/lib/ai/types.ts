/** Provider-independent LLM Gateway sozlesmesi — master prompt md. 24. */
export interface LlmCallInput {
  /** Sirayla cache_control alan bloklar: [SYSTEM_POLICY, presidentialContext]. */
  systemCacheable: string[];
  task: string;
  maxTokens: number;
}

export interface LlmCallResult {
  raw: string;
  inputTokens: number;
  outputTokens: number;
  cachedTokens: number;
  model: string;
}

export interface LlmGateway {
  complete(input: LlmCallInput): Promise<LlmCallResult>;
}
