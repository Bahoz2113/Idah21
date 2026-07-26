import { describe, it, expect } from "vitest";
import { buildToneReviewTask, TONE_REVIEW_VERSION } from "../src/prompts/tone-review.js";

describe("buildToneReviewTask", () => {
  it("prompt version'i icerir", () => {
    expect(buildToneReviewTask("örnek metin")).toContain(TONE_REVIEW_VERSION);
  });

  it("kaynak metnini guvenilmeyen veri olarak isaretler", () => {
    const task = buildToneReviewTask("Bilindiği üzere bu bir denemedir.");
    expect(task).toContain("<untrusted_source>");
    expect(task).toContain("Bilindiği üzere bu bir denemedir.");
  });

  it("uslup ipuclari verildiginde bunlari gorev metnine ekler", () => {
    const task = buildToneReviewTask("metin", ["kısa cümleler tercih edilir"]);
    expect(task).toContain("kısa cümleler tercih edilir");
  });

  it("ipucu verilmediginde hata vermez ve bolumu atlar", () => {
    const task = buildToneReviewTask("metin");
    expect(task).not.toContain("USLUP TERCIHLERI");
  });

  it("JSON semasindaki zorunlu alanlari listeler", () => {
    const task = buildToneReviewTask("metin");
    for (const field of [
      "humanStyleScore",
      "corporateAlignmentScore",
      "toneScore",
      "detectedCliches",
      "rewrite",
    ]) {
      expect(task).toContain(field);
    }
  });
});
