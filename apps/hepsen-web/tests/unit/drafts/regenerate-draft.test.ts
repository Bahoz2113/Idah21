import { describe, it, expect, vi, beforeEach } from "vitest";
import { DraftStateError } from "@hepsen/core";

const pipelineResult = {
  text: "Yeniden yazılmış metin.",
  altHooks: ["a yeterince uzun hook", "b yeterince uzun hook"],
  hashtags: [],
  sourceSummary: "özet metni burada",
  toneScore: 80,
  corporateAlignmentScore: 85,
  humanStyleScore: 80,
  hookStrength: 70,
  riskLevel: "LOW" as const,
  legalRiskReasons: ["sorun yok"],
  blocklistHits: [],
  recommendedPublishAt: new Date().toISOString(),
  timingScore: 60,
  timingConfidence: 0,
  timingReason: "genel veri",
  promptVersion: "draft-post@1.0.0",
};

vi.mock("@/lib/drafts/generate-draft", async () => {
  const actual = await vi.importActual<typeof import("@/lib/drafts/generate-draft")>("@/lib/drafts/generate-draft");
  return { ...actual, runProductionPipeline: vi.fn().mockResolvedValue(pipelineResult) };
});

function makeSupabase(draftRow: unknown, topicRow: unknown) {
  const updateEq = vi.fn().mockResolvedValue({ error: null });
  const feedbackInsert = vi.fn().mockResolvedValue({ data: null, error: null });
  const from = vi.fn((table: string) => {
    if (table === "drafts") {
      return {
        select: () => ({ eq: () => ({ single: () => Promise.resolve({ data: draftRow, error: null }) }) }),
        update: () => ({ eq: updateEq }),
      };
    }
    if (table === "topics") {
      return { select: () => ({ eq: () => ({ single: () => Promise.resolve({ data: topicRow, error: null }) }) }) };
    }
    if (table === "draft_feedback") {
      return { insert: feedbackInsert };
    }
    throw new Error(`beklenmeyen tablo: ${table}`);
  });
  return { from, updateEq, feedbackInsert };
}

const topicRow = { id: "topic-1", title: "Konu", summary: "özet", category: "ozluk_haklari" };

describe("regenerateDraft", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("REVIEW_REQUIRED durumundaki taslagi yeniden uretip ayni satirda gunceller (version++)", async () => {
    const { regenerateDraft } = await import("@/lib/drafts/regenerate-draft");
    const draftRow = { id: "draft-1", status: "REVIEW_REQUIRED", version: 1, text: "eski metin", topic_id: "topic-1" };
    const supabase = makeSupabase(draftRow, topicRow);

    const result = await regenerateDraft({
      supabase: supabase as never,
      gateway: { complete: vi.fn() },
      userId: "user-1",
      draftId: "draft-1",
      hint: "daha_kisa",
      presidentialContext: "ilkeler",
      accountHistory: [],
      accountStartedAt: new Date("2026-01-01"),
    });

    expect(result).toEqual({ status: "REVIEW_REQUIRED", riskLevel: "LOW", version: 2 });
    expect(supabase.feedbackInsert).toHaveBeenCalledWith(
      expect.objectContaining({ action: "regenerate", free_text: "daha_kisa", original_text: "eski metin" }),
    );
  });

  it("BLOCKED_BY_RISK (DRAFT'a esdeger) durumdan basariyla yeniden uretilirse REVIEW_REQUIRED'a doner", async () => {
    const { regenerateDraft } = await import("@/lib/drafts/regenerate-draft");
    const draftRow = { id: "draft-2", status: "BLOCKED_BY_RISK", version: 1, text: "riskli eski metin", topic_id: "topic-1" };
    const supabase = makeSupabase(draftRow, topicRow);

    const result = await regenerateDraft({
      supabase: supabase as never,
      gateway: { complete: vi.fn() },
      userId: "user-1",
      draftId: "draft-2",
      presidentialContext: "ilkeler",
      accountHistory: [],
      accountStartedAt: new Date("2026-01-01"),
    });

    expect(result!.status).toBe("REVIEW_REQUIRED");
  });

  it("PUBLISHING durumundaki taslak icin DraftStateError firlatir (kilitli)", async () => {
    const { regenerateDraft } = await import("@/lib/drafts/regenerate-draft");
    const draftRow = { id: "draft-3", status: "PUBLISHING", version: 1, text: "metin", topic_id: "topic-1" };
    const supabase = makeSupabase(draftRow, topicRow);

    await expect(
      regenerateDraft({
        supabase: supabase as never,
        gateway: { complete: vi.fn() },
        userId: "user-1",
        draftId: "draft-3",
        presidentialContext: "ilkeler",
        accountHistory: [],
        accountStartedAt: new Date("2026-01-01"),
      }),
    ).rejects.toThrow(DraftStateError);
  });

  it("taslak bulunamazsa null doner", async () => {
    const { regenerateDraft } = await import("@/lib/drafts/regenerate-draft");
    const supabase = makeSupabase(null, topicRow);

    const result = await regenerateDraft({
      supabase: supabase as never,
      gateway: { complete: vi.fn() },
      userId: "user-1",
      draftId: "yok",
      presidentialContext: "ilkeler",
      accountHistory: [],
      accountStartedAt: new Date("2026-01-01"),
    });
    expect(result).toBeNull();
  });
});
