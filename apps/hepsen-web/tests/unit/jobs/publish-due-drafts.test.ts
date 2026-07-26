import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/x/client", () => ({ postTweet: vi.fn() }));
vi.mock("@/lib/x/token-manager", () => ({ ensureFreshAccessToken: vi.fn() }));
vi.mock("@/lib/audit/log", () => ({ writeAuditLog: vi.fn() }));

function chain(data: unknown, table: string | undefined, updateLog: { table: string; payload: unknown }[]): unknown {
  const obj: Record<string, unknown> = {
    select: vi.fn(() => obj),
    eq: vi.fn(() => obj),
    lte: vi.fn(() => obj),
    lt: vi.fn(() => obj),
    limit: vi.fn(() => obj),
    order: vi.fn(() => obj),
    is: vi.fn(() => obj),
    maybeSingle: vi.fn().mockResolvedValue({ data, error: null }),
    single: vi.fn().mockResolvedValue({ data, error: null }),
    update: vi.fn((payload: unknown) => {
      if (table) updateLog.push({ table, payload });
      return chain(null, table, updateLog);
    }),
    insert: vi.fn(() => chain(null, table, updateLog)),
    delete: vi.fn(() => chain(null, table, updateLog)),
    then: (resolve: (v: { data: unknown; error: null }) => void) => resolve({ data, error: null }),
  };
  return obj;
}

function makeSupabase(opts: { emergencyStop?: { user_id: string }; dueRows: unknown[] }) {
  const updateLog: { table: string; payload: unknown }[] = [];
  const from = vi.fn((table: string) => {
    if (table === "app_settings") return chain(opts.emergencyStop ?? null, table, updateLog);
    if (table === "publications") return chain(opts.dueRows, table, updateLog);
    return chain(null, table, updateLog);
  });
  return { from, updateLog };
}

const lowRiskDraft = {
  id: "draft-1",
  status: "SCHEDULED",
  text: "Onaylanmış ve zamanlanmış bir taslak metni.",
  legal_risk_level: "LOW",
  approved_text_hash: null as string | null,
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe("publishDueDrafts", () => {
  it("acil durdurma aktifse hicbir sey yapmaz", async () => {
    const { publishDueDrafts } = await import("@/lib/jobs/publish-due-drafts");
    const supabase = makeSupabase({ emergencyStop: { user_id: "user-1" }, dueRows: [] });
    const result = await publishDueDrafts(supabase as never);
    expect(result).toEqual({ emergencyStopped: true, attempted: 0, published: 0, gateDenied: 0, failed: 0 });
  });

  it("metin onaydan sonra degismisse (hash uyusmuyor) yayini reddeder ve onayi iptal eder", async () => {
    const { publishDueDrafts } = await import("@/lib/jobs/publish-due-drafts");
    const { createHash } = await import("node:crypto");
    const wrongHash = createHash("sha256").update("baska bir metin").digest("hex");
    const draft = { ...lowRiskDraft, approved_text_hash: wrongHash };
    const supabase = makeSupabase({
      dueRows: [{ id: "pub-1", draft_id: "draft-1", user_id: "user-1", attempt_count: 0, idempotency_key: "draft-1:v1", drafts: draft }],
    });

    const result = await publishDueDrafts(supabase as never);
    expect(result.gateDenied).toBe(1);
    expect(result.published).toBe(0);

    const draftUpdate = supabase.updateLog.find((u) => u.table === "drafts");
    expect(draftUpdate?.payload).toMatchObject({ status: "REVIEW_REQUIRED", approved_text_hash: null });
    const pubUpdate = supabase.updateLog.find((u) => u.table === "publications");
    expect(pubUpdate?.payload).toMatchObject({ status: "cancelled" });
  });

  it("HIGH riskli taslagi yayinlamaz", async () => {
    const { publishDueDrafts } = await import("@/lib/jobs/publish-due-drafts");
    const { textHash } = await import("@hepsen/core");
    const draft = { ...lowRiskDraft, legal_risk_level: "HIGH", approved_text_hash: textHash(lowRiskDraft.text) };
    const supabase = makeSupabase({
      dueRows: [{ id: "pub-1", draft_id: "draft-1", user_id: "user-1", attempt_count: 0, idempotency_key: "draft-1:v1", drafts: draft }],
    });
    const result = await publishDueDrafts(supabase as never);
    expect(result.gateDenied).toBe(1);
    expect(result.published).toBe(0);
  });

  it("gecerli taslagi basariyla X'e paylasir", async () => {
    const { publishDueDrafts } = await import("@/lib/jobs/publish-due-drafts");
    const { textHash } = await import("@hepsen/core");
    const { postTweet } = await import("@/lib/x/client");
    const { ensureFreshAccessToken } = await import("@/lib/x/token-manager");
    vi.mocked(ensureFreshAccessToken).mockResolvedValue("access-token");
    vi.mocked(postTweet).mockResolvedValue({ id: "tweet-123" });

    const draft = { ...lowRiskDraft, approved_text_hash: textHash(lowRiskDraft.text) };
    const supabase = makeSupabase({
      dueRows: [{ id: "pub-1", draft_id: "draft-1", user_id: "user-1", attempt_count: 0, idempotency_key: "draft-1:v1", drafts: draft }],
    });

    const result = await publishDueDrafts(supabase as never);
    expect(result.published).toBe(1);
    expect(postTweet).toHaveBeenCalledWith("access-token", draft.text);

    const finalDraftUpdate = supabase.updateLog.filter((u) => u.table === "drafts").at(-1);
    expect(finalDraftUpdate?.payload).toMatchObject({ status: "PUBLISHED" });
    const pubUpdate = supabase.updateLog.find((u) => u.table === "publications" && (u.payload as { status?: string }).status === "published");
    expect(pubUpdate?.payload).toMatchObject({ x_post_id: "tweet-123" });
  });

  it("X hesabi bagli degilse denemeyi basarisiz sayar ve attempt_count'u artirir", async () => {
    const { publishDueDrafts } = await import("@/lib/jobs/publish-due-drafts");
    const { textHash } = await import("@hepsen/core");
    const { ensureFreshAccessToken } = await import("@/lib/x/token-manager");
    vi.mocked(ensureFreshAccessToken).mockResolvedValue(null);

    const draft = { ...lowRiskDraft, approved_text_hash: textHash(lowRiskDraft.text) };
    const supabase = makeSupabase({
      dueRows: [{ id: "pub-1", draft_id: "draft-1", user_id: "user-1", attempt_count: 2, idempotency_key: "draft-1:v1", drafts: draft }],
    });

    const result = await publishDueDrafts(supabase as never);
    expect(result.failed).toBe(1);
    const pubUpdate = supabase.updateLog.find((u) => u.table === "publications" && "attempt_count" in (u.payload as object));
    // attempt_count 2 -> 3, MAX_ATTEMPTS(3)'e ulasti -> kalici 'failed'
    expect(pubUpdate?.payload).toMatchObject({ attempt_count: 3, status: "failed" });
    const draftUpdate = supabase.updateLog.filter((u) => u.table === "drafts").at(-1);
    expect(draftUpdate?.payload).toMatchObject({ status: "SCHEDULED" });
  });
});
