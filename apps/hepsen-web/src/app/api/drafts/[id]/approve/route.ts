import { NextResponse, type NextRequest } from "next/server";
import { transition, textHash } from "@hepsen/core";
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

  const { data: draft } = await supabase.from("drafts").select("id, status, text").eq("id", params.id).single();
  if (!draft) return NextResponse.json({ error: "Taslak bulunamadı" }, { status: 404 });

  try {
    const newStatus = transition(draft.status, "approve");
    await supabase
      .from("drafts")
      .update({ status: newStatus, approved_text_hash: textHash(draft.text) })
      .eq("id", params.id);
    await writeAuditLog({ userId: user.id, action: "draft_approved", entityType: "drafts", entityId: params.id });
  } catch (e) {
    return draftErrorResponse(e);
  }

  return NextResponse.redirect(new URL("/drafts", request.url));
}
