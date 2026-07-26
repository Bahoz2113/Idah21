import { NextResponse, type NextRequest } from "next/server";
import { transition } from "@hepsen/core";
import { getServerSupabase } from "@/lib/supabase/server";
import { writeAuditLog } from "@/lib/audit/log";
import { draftErrorResponse } from "@/lib/drafts/http-errors";

export const dynamic = "force-dynamic";

interface RouteParams {
  params: { id: string };
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  const supabase = getServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.redirect(new URL("/login", request.url));

  const formData = await request.formData();
  const publishAtRaw = formData.get("publishAt");

  const { data: draft } = await supabase
    .from("drafts")
    .select("id, status, version, recommended_publish_at")
    .eq("id", params.id)
    .single();
  if (!draft) return NextResponse.json({ error: "Taslak bulunamadı" }, { status: 404 });

  const scheduledAt =
    typeof publishAtRaw === "string" && publishAtRaw.length > 0
      ? new Date(publishAtRaw).toISOString()
      : draft.recommended_publish_at ?? new Date().toISOString();

  try {
    const newStatus = transition(draft.status, "schedule");
    await supabase.from("drafts").update({ status: newStatus }).eq("id", params.id);

    // Onceki (artik gecersiz) bekleyen yayin kayitlarini temizle — publishGate
    // her halukarda draft'in CANLI durumuna bakar, ama karisikligi onler.
    await supabase.from("publications").delete().eq("draft_id", params.id).eq("status", "pending");

    await supabase.from("publications").insert({
      user_id: user.id,
      draft_id: params.id,
      scheduled_at: scheduledAt,
      status: "pending",
      idempotency_key: `${params.id}:v${draft.version}`,
      attempt_count: 0,
    });

    await writeAuditLog({
      userId: user.id,
      action: "draft_scheduled",
      entityType: "drafts",
      entityId: params.id,
      metadata: { scheduledAt },
    });
  } catch (e) {
    return draftErrorResponse(e);
  }

  return NextResponse.redirect(new URL("/calendar", request.url));
}
