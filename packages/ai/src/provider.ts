import Anthropic from "@anthropic-ai/sdk";

// Soyut katman — OpenAI/Gemini için ayrı implementasyon eklenebilir
export interface AIProvider {
  completeText(system: string, user: string, maxTokens?: number): Promise<string>;
  completeJSON<T = unknown>(system: string, user: string, maxTokens?: number): Promise<T>;
}

class ClaudeProvider implements AIProvider {
  private client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  private model = process.env.ANTHROPIC_MODEL ?? "claude-sonnet-4-6";

  async completeText(system: string, user: string, maxTokens = 4096): Promise<string> {
    const res = await this.client.messages.create({
      model: this.model,
      max_tokens: maxTokens,
      system,
      messages: [{ role: "user", content: user }],
    });
    return res.content.filter((b) => b.type === "text").map((b: any) => b.text).join("\n");
  }

  async completeJSON<T>(system: string, user: string, maxTokens = 4096): Promise<T> {
    const text = await this.completeText(
      system + "\n\nYANIT YALNIZCA GEÇERLİ JSON OLMALI. Markdown, açıklama veya ``` kullanma.",
      user,
      maxTokens
    );
    const clean = text.replace(/```json/gi, "").replace(/```/g, "").trim();
    return JSON.parse(clean) as T;
  }
}

let _provider: AIProvider | null = null;
export function getProvider(): AIProvider {
  if (!_provider) _provider = new ClaudeProvider();
  return _provider;
}

export interface AgeContext { name: string; minAge: number; maxAge: number; tone: string }
