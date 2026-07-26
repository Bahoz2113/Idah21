import { describe, it, expect } from "vitest";
import { transition, publishGate, textHash, DraftStateError } from "../src/state/draft-machine.js";

const okGate = {
  status: "SCHEDULED" as const,
  riskLevel: "LOW" as const,
  currentText: "Nöbet ücreti ödemeleri gecikiyor.",
  approvedTextHash: textHash("Nöbet ücreti ödemeleri gecikiyor."),
  emergencyStop: false,
  alreadyPublishedIdempotencyKeys: new Set<string>(),
  idempotencyKey: "draft-1:2026-07-27T09:00",
};

describe("durum makinesi", () => {
  it("normal akisi izler", () => {
    let s = transition("DRAFT", "submit_for_review");
    s = transition(s, "approve");
    s = transition(s, "schedule");
    s = transition(s, "start_publish");
    s = transition(s, "publish_success");
    expect(s).toBe("PUBLISHED");
  });

  it("onaydan sonra duzenleme onayi dusurur", () => {
    expect(transition("APPROVED", "edit")).toBe("REVIEW_REQUIRED");
    expect(transition("SCHEDULED", "edit")).toBe("REVIEW_REQUIRED");
  });

  it("yayimlanmis taslak degistirilemez", () => {
    expect(() => transition("PUBLISHED", "edit")).toThrow(DraftStateError);
  });

  it("onaysiz zamanlama yapilamaz", () => {
    expect(() => transition("REVIEW_REQUIRED", "schedule")).toThrow(DraftStateError);
  });
});

describe("yayin kapisi", () => {
  it("uygun taslagi gecirir", () => {
    expect(publishGate(okGate).allowed).toBe(true);
  });

  it("metin degistiyse onayi iptal eder", () => {
    const r = publishGate({ ...okGate, currentText: "Değişmiş metin." });
    expect(r.allowed).toBe(false);
    expect(r.revokeApproval).toBe(true);
  });

  it("HIGH riski engeller", () => {
    expect(publishGate({ ...okGate, riskLevel: "HIGH" }).allowed).toBe(false);
  });

  it("BLOCKED riski engeller", () => {
    expect(publishGate({ ...okGate, riskLevel: "BLOCKED" }).allowed).toBe(false);
  });

  it("acil durdurma her seyi durdurur", () => {
    expect(publishGate({ ...okGate, emergencyStop: true }).allowed).toBe(false);
  });

  it("ayni taslagi iki kez yayimlamaz", () => {
    const r = publishGate({ ...okGate, alreadyPublishedIdempotencyKeys: new Set([okGate.idempotencyKey]) });
    expect(r.allowed).toBe(false);
    expect(r.reason).toContain("idempotency");
  });

  it("onay kaydi yoksa gecirmez", () => {
    expect(publishGate({ ...okGate, approvedTextHash: null }).allowed).toBe(false);
  });
});
