import { describe, it, expect } from "vitest";
import { buildTopicScoringTask, TOPIC_SCORING_VERSION } from "../src/prompts/topic-scoring.js";

const items = [
  {
    collectedItemId: "abc-123",
    title: "Nöbet ücretlerinde gecikme",
    content: "Batman'da nöbet ücretleri üç aydır ödenmedi.",
    sourceName: "Resmi Gazete",
    publishedAt: "2026-07-26T06:00:00.000Z",
  },
];

describe("buildTopicScoringTask", () => {
  const task = buildTopicScoringTask(items);

  it("prompt version'i içerir", () => {
    expect(task).toContain(TOPIC_SCORING_VERSION);
  });

  it("kaynak metnini guvenilmeyen veri olarak isaretler", () => {
    expect(task).toContain("<untrusted_source>");
    expect(task).toContain("</untrusted_source>");
    expect(task).toContain("Nöbet ücretlerinde gecikme");
  });

  it("her item icin collectedItemId'yi tasir", () => {
    expect(task).toContain("abc-123");
  });

  it("JSON semasindaki zorunlu alanlari listeler", () => {
    for (const field of [
      "healthRelevance",
      "urgency",
      "rightsImpact",
      "batmanRelevance",
      "discussionPotential",
      "isHeavyAllegation",
      "category",
    ]) {
      expect(task).toContain(field);
    }
  });

  it("bos liste ile de gecerli bir gorev metni uretir", () => {
    expect(() => buildTopicScoringTask([])).not.toThrow();
  });
});
