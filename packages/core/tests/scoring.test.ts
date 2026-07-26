import { describe, it, expect } from "vitest";
import { scoreTopic } from "../src/scoring/topic.js";
import { scoreHook, firstSentenceOf } from "../src/scoring/hook.js";
import { selectHashtags } from "../src/scoring/hashtag.js";

const base = {
  healthRelevance: 90, sourceReliability: 85, urgency: 70, trendStrength: 60,
  rightsImpact: 80, batmanRelevance: 40, discussionPotential: 50,
  legalRiskPenalty: 0, distinctSourceCount: 3, isHeavyAllegation: false,
};

describe("topic scoring", () => {
  it("guclu konuyu uygun bulur", () => {
    const r = scoreTopic(base);
    expect(r.score).toBeGreaterThanOrEqual(70);
    expect(r.eligible).toBe(true);
  });

  it("esik altini eler", () => {
    const r = scoreTopic({ ...base, healthRelevance: 20, sourceReliability: 30, urgency: 10, rightsImpact: 10 });
    expect(r.eligible).toBe(false);
  });

  it("tek kaynakli agir iddiayi eler", () => {
    const r = scoreTopic({ ...base, isHeavyAllegation: true, distinctSourceCount: 1 });
    expect(r.eligible).toBe(false);
    expect(r.reasons.join(" ")).toContain("iki bagimsiz kaynak");
  });

  it("hukuki risk cezasi puani dusurur", () => {
    expect(scoreTopic({ ...base, legalRiskPenalty: 40 }).score).toBeLessThan(scoreTopic(base).score);
  });
});

describe("hook scoring", () => {
  it("ilk cumleyi ayirir", () => {
    expect(firstSentenceOf("Üç aydır ödenmedi. Bunu soruyoruz.")).toBe("Üç aydır ödenmedi.");
  });

  it("somut ve kisa acilisi yuksek puanlar", () => {
    const r = scoreHook("Nöbet ücreti 3 aydır ödenmiyor, neden? Sahadan gelen bilgi bu.");
    expect(r.score).toBeGreaterThan(60);
  });

  it("klise ve uzun acilisi dusuk puanlar", () => {
    const r = scoreHook(
      "Bilindiği üzere günümüzde hepimizin bildiği gibi sağlık alanında yaşanan sorunlar yalnızca değil aynı zamanda çok boyutludur.",
    );
    expect(r.score).toBeLessThan(40);
    expect(r.clichePenalty).toBeGreaterThan(0);
  });

  it("oneri uretir", () => {
    expect(scoreHook("Bir açıklama yapıldı.").suggestions.length).toBeGreaterThan(0);
  });
});

describe("hashtag selection", () => {
  const strong = { topicRelevance: 95, currentVelocity: 80, healthAudienceUsage: 85, reachPotential: 70, brandAlignment: 80, spamPenalty: 0 };
  const weak = { topicRelevance: 20, currentVelocity: 90, healthAudienceUsage: 10, reachPotential: 40, brandAlignment: 10, spamPenalty: 30 };

  it("en fazla 2 etiket secer", () => {
    const r = selectHashtags([
      { tag: "#NöbetÜcreti", signals: strong },
      { tag: "#SağlıkÇalışanları", signals: strong },
      { tag: "#HEPSEN", signals: strong },
    ]);
    expect(r.selected.length).toBeLessThanOrEqual(2);
  });

  it("konu disi trendi eler", () => {
    expect(selectHashtags([{ tag: "#GündemDışı", signals: weak }]).selected).toHaveLength(0);
  });

  it("yanitlarda hashtag kullanmaz", () => {
    const r = selectHashtags([{ tag: "#NöbetÜcreti", signals: strong }], { isReply: true });
    expect(r.selected).toHaveLength(0);
  });
});
