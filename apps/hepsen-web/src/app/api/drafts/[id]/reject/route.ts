import { NextResponse, type NextRequest } from "next/server";
import { transition } from "@hepsen/core";
import { getServerSupabase } from "@/lib/supabase/server";
import { writeAuditLog } from "@/lib/audit/log";
import { draftErrorResponse } from "@/lib/drafts/http-errors";

export const dynamic = "force-dynamic";

interface RouteParams {
  params: { id: string };
}

const VALID_REASON_CODES = new Set([
  "too_harsh",
  "too_soft",
  "artificial",
  "not_corporate",
  "risky",
  "irrelevant",
  "repetitive",
  "off_tone",
]);

export async function POST(request: NextRequest, { params }: RouteParams) {
  const supabase = getServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.redirect(new URL("/login", request.url));

  const formData = await request.formData();
  const reasonCodeRaw = formData.get("reasonCode");
  const reasonCode = typeof reasonCodeRaw === "string" && VALID_REASON_CODES.has(reasonCodeRaw) ? reasonCodeRaw : null;
  const freeText = formData.get("freeText");

  const { data: draft } = await supabase.from("drafts").select("id, status, text").eq("id", params.id).single();
  if (!draft) return NextResponse.json({ error: "Taslak bulunamadı" }, { status: 404 });

  try {
    const newStatus = transition(draft.status, "reject");
    await supabase.from("drafts").update({ status: newStatus }).eq("id", params.id);
    await supabase.from("draft_feedback").insert({
      user_id: user.id,
      draft_id: params.id,
      action: "reject",
      reason_code: reasonCode,
      free_text: typeof freeText === "string" && freeText.length > 0 ? freeText : null,
      original_text: draft.text,
    });
    await writeAuditLog({
      userId: user.id,
      action: "draft_rejected",
      entityType: "drafts",
      entityId: params.id,
      metadata: { reasonCode },
    });
  } catch (e) {
    return draftErrorResponse(e);
  }

  return NextResponse.redirect(new URL("/drafts", request.url));
}
