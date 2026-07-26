import { describe, it, expect, vi } from "vitest";
import { generateDraftForTopic } from "@/lib/drafts/generate-draft";
import type { LlmGateway } from "@/lib/ai/types";

function fakeUsage(raw: string) {
  return { raw, inputTokens: 10, outputTokens: 5, cachedTokens: 0, model: "claude-sonnet-5" };
}

function makeSupabaseMock(insertedDraftId = "draft-1") {
  const budgetInsert = vi.fn().mockResolvedValue({ data: null, error: null });
  const draftsInsert = vi.fn().mockReturnValue({
    select: vi.fn().mockReturnValue({
      single: vi.fn().mockResolvedValue({ data: { id: insertedDraftId }, error: null }),
    }),
  });
  const from = vi.fn((table: string) => {
    if (table === "budget_usage") return { insert: budgetInsert };
    if (table === "drafts") return { insert: draftsInsert };
    throw new Error(`beklenmeyen tablo: ${table}`);
  });
  return { from, budgetInsert, draftsInsert } as unknown as { from: typeof from; budgetInsert: typeof budgetInsert; draftsInsert: typeof draftsInsert };
}

const topic = { id: "topic-1", title: "Nöbet ücreti gecikmesi", summary: "Üç aydır ödenmedi.", category: "ozluk_haklari" };

const LOW_RISK_DRAFT = JSON.stringify({
  promptVersion: "draft-post@1.0.0",
  text: "Batman'da nöbet ücretleri üç aydır ödenmedi. HEP-SEN olarak takipçisiyiz.",
  altHooks: ["Alternatif açılış bir.", "Alternatif açılış iki."],
  hashtags: [],
  sourceSummary: "Resmi kaynak özeti",
  factsGroundedInSources: true,
  uncertainties: [],
});
const LOW_RISK_LEGAL = JSON.stringify({ promptVersion: "legal-review@1.0.0", level: "LOW", reasons: ["Sorun yok"], saferAlternative: null, namedEntities: [] });
const GOOD_TONE = JSON.stringify({ promptVersion: "tone-review@1.0.0", humanStyleScore: 80, corporateAlignmentScore: 85, toneScore: 75, detectedCliches: [], rewrite: null });

describe("generateDraftForTopic", () => {
  it("dusuk riskli taslagi REVIEW_REQUIRED durumuyla olusturur", async () => {
    const complete = vi
      .fn()
      .mockResolvedValueOnce(fakeUsage(LOW_RISK_DRAFT))
      .mockResolvedValueOnce(fakeUsage(LOW_RISK_LEGAL))
      .mockResolvedValueOnce(fakeUsage(GOOD_TONE));
    const gateway: LlmGateway = { complete };
    const supabase = makeSupabaseMock();

    const result = await generateDraftForTopic({
      supabase: supabase as never,
      gateway,
      userId: "user-1",
      topic,
      presidentialContext: "ilkeler",
      accountHistory: [],
      accountStartedAt: new Date("2026-01-01"),
    });

    expect(result).not.toBeNull();
    expect(result!.status).toBe("REVIEW_REQUIRED");
    expect(result!.riskLevel).toBe("LOW");
    expect(supabase.budgetInsert).toHaveBeenCalledTimes(3); // draft+legal+tone
  });

  it("blocklist BLOCKED verirse LLM 'sorun yok' dese bile BLOCKED_BY_RISK olur", async () => {
    const blockedDraftText = JSON.stringify({
      promptVersion: "draft-post@1.0.0",
      text: "Bu şerefsiz bakan istifa etmeli!", // blocklist BLOCKED tetikler
      altHooks: ["Alternatif açılış bir.", "Alternatif açılış iki."],
      hashtags: [],
      sourceSummary: "Resmi kaynak özeti burada",
      factsGroundedInSources: true,
      uncertainties: [],
    });
    const complete = vi
      .fn()
      .mockResolvedValueOnce(fakeUsage(blockedDraftText))
      .mockResolvedValueOnce(fakeUsage(LOW_RISK_LEGAL)) // LLM "sorun yok" dese bile
      .mockResolvedValueOnce(fakeUsage(GOOD_TONE));
    const gateway: LlmGateway = { complete };
    const supabase = makeSupabaseMock();

    const result = await generateDraftForTopic({
      supabase: supabase as never,
      gateway,
      userId: "user-1",
      topic,
      presidentialContext: "ilkeler",
      accountHistory: [],
      accountStartedAt: new Date("2026-01-01"),
    });

    expect(result!.riskLevel).toBe("BLOCKED");
    expect(result!.status).toBe("BLOCKED_BY_RISK");
  });

  it("ton skoru dusukse rewrite metnini kullanir", async () => {
    const poorTone = JSON.stringify({
      promptVersion: "tone-review@1.0.0",
      humanStyleScore: 30,
      corporateAlignmentScore: 40,
      toneScore: 35,
      detectedCliches: ["bir kez daha"],
      rewrite: "Yeniden yazılmış daha doğal metin.",
    });
    const complete = vi
      .fn()
      .mockResolvedValueOnce(fakeUsage(LOW_RISK_DRAFT))
      .mockResolvedValueOnce(fakeUsage(LOW_RISK_LEGAL))
      .mockResolvedValueOnce(fakeUsage(poorTone));
    const gateway: LlmGateway = { complete };
    const supabase = makeSupabaseMock();

    await generateDraftForTopic({
      supabase: supabase as never,
      gateway,
      userId: "user-1",
      topic,
      presidentialContext: "ilkeler",
      accountHistory: [],
      accountStartedAt: new Date("2026-01-01"),
    });

    const insertedArgs = supabase.draftsInsert.mock.calls[0]![0] as { text: string };
    expect(insertedArgs.text).toBe("Yeniden yazılmış daha doğal metin.");
  });
});
