import { describe, it, expect } from "vitest";
import { buildDraftPostTask, DRAFT_POST_VERSION } from "../src/prompts/draft-post.js";

const baseInput = {
  topicTitle: "Nöbet ücreti gecikmesi",
  topicSummary: "Üç aydır ödenmedi.",
  facts: [{ url: "https://x", publishedAt: "2026-07-26", claim: "Ödeme gecikti", verified: true }],
  uncertainties: [],
  contentCategory: "ozluk_haklari",
  benchmarkHints: [],
};

describe("buildDraftPostTask", () => {
  it("regenerationHint verilmezse ciktida yonerge blogu olmaz", () => {
    const task = buildDraftPostTask(baseInput);
    expect(task).not.toContain("YENIDEN URETME YONERGESI");
    expect(task).toContain(DRAFT_POST_VERSION);
  });

  it("regenerationHint verilirse gorev metnine eklenir", () => {
    const task = buildDraftPostTask({ ...baseInput, regenerationHint: "Metni daha kısa yaz." });
    expect(task).toContain("YENIDEN URETME YONERGESI");
    expect(task).toContain("Metni daha kısa yaz.");
  });

  it("regenerationHint disindaki cikti degismez", () => {
    const withHint = buildDraftPostTask({ ...baseInput, regenerationHint: "x" }).replace(
      /\nYENIDEN URETME YONERGESI[\s\S]*?(?=\n\nYAZIM KURALLARI)/,
      "",
    );
    const without = buildDraftPostTask(baseInput);
    expect(withHint).toBe(without);
  });
});
