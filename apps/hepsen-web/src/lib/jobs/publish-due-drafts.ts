import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import { publishGate, transition, type DraftStatus, type RiskLevel } from "@hepsen/core";
import { postTweet } from "@/lib/x/client";
import { ensureFreshAccessToken } from "@/lib/x/token-manager";
import { writeAuditLog } from "@/lib/audit/log";

const MAX_ATTEMPTS = 3;

export interface PublishJobResult {
  emergencyStopped: boolean;
  attempted: number;
  published: number;
  gateDenied: number;
  failed: number;
}

interface DuePublicationRow {
  id: string;
  draft_id: string;
  user_id: string;
  attempt_count: number;
  idempotency_key: string;
  drafts: {
    id: string;
    status: DraftStatus;
    text: string;
    legal_risk_level: RiskLevel;
    approved_text_hash: string | null;
  } | null;
}

/**
 * Master prompt md. 16/25: saatlik olarak onaylanmis ve zamani gelen
 * yayinlari kontrol eder. Acil durdurma anahtari TUM otomatik yayin
 * islerini durdurur. Her kayit icin publishGate() (durum+onay kaydi TEKRAR
 * dogrulanir) SCHEDULED durumuyken cagrilir — state machine PUBLISHING'den
 * geri REVIEW_REQUIRED'a donus tanimlamadigi icin.
 */
export async function publishDueDrafts(supabase: SupabaseClient): Promise<PublishJobResult> {
  const { data: stoppedSettings } = await supabase
    .from("app_settings")
    .select("user_id")
    .eq("emergency_stop", true)
    .limit(1)
    .maybeSingle();

  if (stoppedSettings) {
    await writeAuditLog({ userId: stoppedSettings.user_id as string, action: "publish_job_blocked", metadata: { reason: "emergency_stop" } });
    return { emergencyStopped: true, attempted: 0, published: 0, gateDenied: 0, failed: 0 };
  }

  const now = new Date().toISOString();
  const { data: due } = await supabase
    .from("publications")
    .select(
      "id, draft_id, user_id, attempt_count, idempotency_key, drafts(id, status, text, legal_risk_level, approved_text_hash)",
    )
    .eq("status", "pending")
    .lte("scheduled_at", now)
    .lt("attempt_count", MAX_ATTEMPTS);

  const rows = (due ?? []) as unknown as DuePublicationRow[];
  let published = 0;
  let gateDenied = 0;
  let failed = 0;

  for (const row of rows) {
    const draft = row.drafts;
    if (!draft) continue;

    const gate = publishGate({
      status: draft.status,
      riskLevel: draft.legal_risk_level,
      currentText: draft.text,
      approvedTextHash: draft.approved_text_hash,
      emergencyStop: false,
      alreadyPublishedIdempotencyKeys: new Set(),
      idempotencyKey: row.idempotency_key,
    });

    if (!gate.allowed) {
      gateDenied++;
      await supabase.from("publications").update({ status: "cancelled", error_message: gate.reason }).eq("id", row.id);
      if (gate.revokeApproval) {
        const revertedStatus = transition(draft.status, "edit");
        await supabase
          .from("drafts")
          .update({ status: revertedStatus, approved_text_hash: null })
          .eq("id", draft.id);
      }
      await writeAuditLog({
        userId: row.user_id,
        action: "publish_gate_denied",
        entityType: "drafts",
        entityId: draft.id,
        metadata: { reason: gate.reason },
      });
      continue;
    }

    const publishingStatus = transition(draft.status, "start_publish");
    await supabase.from("drafts").update({ status: publishingStatus }).eq("id", draft.id);

    const accessToken = await ensureFreshAccessToken(supabase, row.user_id);
    if (!accessToken) {
      failed += await recordFailure(supabase, row, draft.id, publishingStatus, "X hesabı bağlı değil");
      continue;
    }

    try {
      const posted = await postTweet(accessToken, draft.text);
      await supabase
        .from("publications")
        .update({ x_post_id: posted.id, published_at: new Date().toISOString(), status: "published" })
        .eq("id", row.id);
      await supabase
        .from("drafts")
        .update({ status: transition(publishingStatus, "publish_success") })
        .eq("id", draft.id);
      await writeAuditLog({
        userId: row.user_id,
        action: "draft_published",
        entityType: "drafts",
        entityId: draft.id,
        metadata: { xPostId: posted.id },
      });
      published++;
    } catch (e) {
      // Hata mesaji token/govde icermez (postTweet zaten bunu garanti eder).
      failed += await recordFailure(
        supabase,
        row,
        draft.id,
        publishingStatus,
        e instanceof Error ? e.message : "Bilinmeyen hata",
      );
    }
  }

  return { emergencyStopped: false, attempted: rows.length, published, gateDenied, failed };
}

async function recordFailure(
  supabase: SupabaseClient,
  row: DuePublicationRow,
  draftId: string,
  currentStatus: DraftStatus,
  errorMessage: string,
): Promise<1> {
  const attemptCount = row.attempt_count + 1;
  await supabase
    .from("publications")
    .update({
      attempt_count: attemptCount,
      error_message: errorMessage,
      status: attemptCount >= MAX_ATTEMPTS ? "failed" : "pending",
    })
    .eq("id", row.id);
  await supabase.from("drafts").update({ status: transition(currentStatus, "publish_fail") }).eq("id", draftId);
  await writeAuditLog({
    userId: row.user_id,
    action: "publish_attempt_failed",
    entityType: "drafts",
    entityId: draftId,
    metadata: { attemptCount, errorMessage },
  });
  return 1;
}
