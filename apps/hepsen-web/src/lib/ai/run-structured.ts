import type { ZodType } from "zod";
import type { LlmCallInput, LlmCallResult, LlmGateway } from "./types";

export interface StructuredResult<T> {
  data: T;
  usage: LlmCallResult;
}

function extractJson(raw: string): unknown {
  // Model bazen ```json kod blogu ile sarabilir; savunma amacli temizle.
  const cleaned = raw.trim().replace(/^```(?:json)?\s*/i, "").replace(/```\s*$/, "");
  return JSON.parse(cleaned);
}

/**
 * Model ciktisini Zod semasiyla dogrular. Ilk deneme gecersizse (bozuk JSON
 * veya sema uyumsuzlugu) hata ozetiyle TEK retry yapilir; ikinci basarisizlikta
 * hata yukari firlatilir (cagiran taraf taslagi NEEDS_REVISION'a dusurur).
 */
export async function runStructured<T>(
  gateway: LlmGateway,
  input: LlmCallInput,
  schema: ZodType<T>,
): Promise<StructuredResult<T>> {
  const first = await gateway.complete(input);
  try {
    const data = schema.parse(extractJson(first.raw));
    return { data, usage: first };
  } catch (firstError) {
    const reason = firstError instanceof Error ? firstError.message : String(firstError);
    const retryInput: LlmCallInput = {
      ...input,
      task: `${input.task}\n\nÖNCEKİ ÇIKTI GEÇERSİZDİ: ${reason}\nSadece istenen JSON şemasına uygun, geçerli bir JSON döndür.`,
    };
    const second = await gateway.complete(retryInput);
    const data = schema.parse(extractJson(second.raw)); // burada da basarisizsa yukari firlar
    return {
      data,
      usage: {
        raw: second.raw,
        inputTokens: first.inputTokens + second.inputTokens,
        outputTokens: first.outputTokens + second.outputTokens,
        cachedTokens: first.cachedTokens + second.cachedTokens,
        model: second.model,
      },
    };
  }
}
