import "server-only";
import { getServiceRoleClient } from "@/lib/supabase/server";

/**
 * audit_logs icin TEK yazma noktasi. Tablo trigger'la degistirilemez/silinemez
 * (bkz. supabase/migrations/0001_init.sql). Token, sifre veya kisisel veri
 * ASLA metadata icine konmaz (master prompt md. 23).
 */
export async function writeAuditLog(params: {
  userId: string | null;
  action: string;
  entityType?: string;
  entityId?: string;
  metadata?: Record<string, unknown>;
}): Promise<void> {
  const supabase = getServiceRoleClient();
  const { error } = await supabase.from("audit_logs").insert({
    user_id: params.userId,
    action: params.action,
    entity_type: params.entityType ?? null,
    entity_id: params.entityId ?? null,
    metadata: params.metadata ?? {},
  });
  if (error) {
    // Audit yazma hatasi sessizce yutulmaz ama akisi da durdurmaz; sunucu logu.
    console.error(`[audit] yazilamadi: ${error.message}`);
  }
}
