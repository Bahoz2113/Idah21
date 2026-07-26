import { describe, it, expect } from "vitest";
import { classifyAuthor, evaluateOpportunity, escalateReplyRisk } from "../src/reply/author-type.js";

const now = new Date("2026-07-27T12:00:00+03:00");
const pub = new Date("2026-07-27T10:30:00+03:00");

const author = (o: Partial<Parameters<typeof classifyAuthor>[0]>) => ({
  handle: "@x", displayName: "X", bio: "", isVerified: false, followerCount: 100, ...o,
});

const opp = (a: ReturnType<typeof author>) => ({
  author: a, likes: 120, publishedAt: pub, now, topicMatched: true,
  minLikes: 50, ttlHours: 3, dailyDraftedCount: 0, dailyCap: 5,
});

describe("yazar siniflandirmasi", () => {
  it("kurumu tanir", () => {
    expect(classifyAuthor(author({ displayName: "T.C. Sağlık Bakanlığı" })).type).toBe("institution");
  });
  it("haber kurulusunu tanir", () => {
    expect(classifyAuthor(author({ bio: "Sağlık muhabiri" })).type).toBe("news");
  });
  it("belirsizde bireysel varsayar", () => {
    expect(classifyAuthor(author({ displayName: "Ali K." })).type).toBe("individual");
  });
});

describe("yanit firsati", () => {
  it("kuruma firsat olusturur", () => {
    expect(evaluateOpportunity(opp(author({ displayName: "Sağlık Bakanlığı" }))).create).toBe(true);
  });

  it("BIREYSEL hesaba firsat olusturmaz", () => {
    const d = evaluateOpportunity(opp(author({ displayName: "Mehmet" })));
    expect(d.create).toBe(false);
    expect(d.reasons.join(" ")).toContain("Bireysel");
  });

  it("etkilesim esigi altini eler", () => {
    expect(evaluateOpportunity({ ...opp(author({ displayName: "Sağlık Bakanlığı" })), likes: 10 }).create).toBe(false);
  });

  it("omru dolan firsati eler", () => {
    const old = new Date("2026-07-27T05:00:00+03:00");
    expect(evaluateOpportunity({ ...opp(author({ displayName: "Sağlık Bakanlığı" })), publishedAt: old }).create).toBe(false);
  });

  it("gunluk tavani uygular", () => {
    expect(evaluateOpportunity({ ...opp(author({ displayName: "Sağlık Bakanlığı" })), dailyDraftedCount: 5 }).create).toBe(false);
  });

  it("decay_at 3 saat sonra", () => {
    const d = evaluateOpportunity(opp(author({ displayName: "Sağlık Bakanlığı" })));
    expect(d.decayAt.getTime() - pub.getTime()).toBe(3 * 3600_000);
  });
});

describe("yanit risk yukseltmesi", () => {
  it("bir kademe yukseltir", () => {
    expect(escalateReplyRisk("LOW")).toBe("MEDIUM");
    expect(escalateReplyRisk("MEDIUM")).toBe("HIGH");
    expect(escalateReplyRisk("BLOCKED")).toBe("BLOCKED");
  });
});
