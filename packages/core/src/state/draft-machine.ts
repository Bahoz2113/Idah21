/** Taslak durum makinesi — master prompt md. 22 */
import { createHash } from "node:crypto";
import { canPublish, type RiskLevel } from "../legal-guard/blocklist.js";

export type DraftStatus =
  | "DRAFT"
  | "REVIEW_REQUIRED"
  | "APPROVED"
  | "SCHEDULED"
  | "PUBLISHING"
  | "PUBLISHED"
  | "REJECTED"
  | "NEEDS_REVISION"
  | "BLOCKED_BY_RISK";

export type DraftAction =
  | "submit_for_review"
  | "approve"
  | "reject"
  | "request_revision"
  | "edit"
  | "schedule"
  | "start_publish"
  | "publish_success"
  | "publish_fail"
  | "block_by_risk";

const TRANSITIONS: Record<DraftStatus, Partial<Record<DraftAction, DraftStatus>>> = {
  DRAFT: { submit_for_review: "REVIEW_REQUIRED", block_by_risk: "BLOCKED_BY_RISK", edit: "DRAFT" },
  REVIEW_REQUIRED: {
    approve: "APPROVED",
    reject: "REJECTED",
    request_revision: "NEEDS_REVISION",
    edit: "REVIEW_REQUIRED",
    block_by_risk: "BLOCKED_BY_RISK",
  },
  APPROVED: { schedule: "SCHEDULED", edit: "REVIEW_REQUIRED", reject: "REJECTED", block_by_risk: "BLOCKED_BY_RISK" },
  SCHEDULED: { start_publish: "PUBLISHING", edit: "REVIEW_REQUIRED", reject: "REJECTED", block_by_risk: "BLOCKED_BY_RISK" },
  PUBLISHING: { publish_success: "PUBLISHED", publish_fail: "SCHEDULED" },
  PUBLISHED: {},
  REJECTED: { edit: "DRAFT" },
  NEEDS_REVISION: { edit: "DRAFT", submit_for_review: "REVIEW_REQUIRED" },
  BLOCKED_BY_RISK: { edit: "DRAFT" },
};

export class DraftStateError extends Error {}

export function transition(from: DraftStatus, action: DraftAction): DraftStatus {
  const to = TRANSITIONS[from]?.[action];
  if (!to) throw new DraftStateError(`Gecersiz gecis: ${from} --${action}--> ?`);
  return to;
}

/** Onay anindaki metnin parmak izi. */
export function textHash(text: string): string {
  return createHash("sha256").update(text.normalize("NFC")).digest("hex");
}

export interface PublishGateInput {
  status: DraftStatus;
  riskLevel: RiskLevel;
  currentText: string;
  approvedTextHash: string | null;
  emergencyStop: boolean;
  alreadyPublishedIdempotencyKeys: Set<string>;
  idempotencyKey: string;
}

export interface PublishGateResult {
  allowed: boolean;
  reason: string;
  /** true ise onay dusurulmeli ve taslak REVIEW_REQUIRED'a donmeli */
  revokeApproval: boolean;
}

/**
 * Yayin anindaki son kapi. UI'da butonun kapali olmasi yeterli degildir;
 * bu kontrol API ve is katmaninda da calisir.
 */
export function publishGate(i: PublishGateInput): PublishGateResult {
  if (i.emergencyStop)
    return { allowed: false, reason: "Acil durdurma anahtari acik.", revokeApproval: false };

  if (i.alreadyPublishedIdempotencyKeys.has(i.idempotencyKey))
    return { allowed: false, reason: "Bu taslak zaten yayimlanmis (idempotency).", revokeApproval: false };

  if (i.status !== "SCHEDULED" && i.status !== "PUBLISHING")
    return { allowed: false, reason: `Durum ${i.status}. Yalnizca SCHEDULED yayimlanabilir.`, revokeApproval: false };

  if (!canPublish(i.riskLevel))
    return { allowed: false, reason: `Hukuki risk ${i.riskLevel}. Yayin kapali.`, revokeApproval: true };

  if (!i.approvedTextHash)
    return { allowed: false, reason: "Onay kaydi yok.", revokeApproval: true };

  if (textHash(i.currentText) !== i.approvedTextHash)
    return {
      allowed: false,
      reason: "Metin onaydan sonra degismis. Onay iptal edildi, yeniden onay gerekli.",
      revokeApproval: true,
    };

  return { allowed: true, reason: "Yayin icin uygun.", revokeApproval: false };
}
