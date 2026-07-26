import { NextResponse, type NextRequest } from "next/server";
import { transition, runBlocklist, combineRisk, canPublish, type RiskLevel } from "@hepsen/core";
import { getServerSupabase } from "@/lib/supabase/server";
import { writeAuditLog } from "@/lib/audit/log";
import { draftErrorResponse } from "@/lib/drafts/http-errors";

export const dynamic = "force-dynamic";

interface RouteParams {
  params: { id: string };
}

/**
 * Manuel duzenleme: yalnizca DETERMINISTIK blocklist yeniden calisir (LLM
 * tekrar odenmez). Risk YALNIZCA kotulesebilir — mevcut legal_risk_level ile
 * birlestirilir (combineRisk max alir). Riski DUSURMEK icin tam pipeline'dan
 * gecen "yeniden uret" (regenerate) kullanilmali. Bilincli sinirlama.
 */
export async function POST(request: NextRequest, { params }: RouteParams) {
  const supabase = getServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.redirect(new URL("/login", request.url));

  const formData = await request.formData();
  const newText = formData.get("text");
  if (typeof newText !== "string" || newText.trim().length < 20) {
    return NextResponse.json({ error: "Metin en az 20 karakter olmalı" }, { status: 400 });
  }

  const { data: draft } = await supabase
    .from("drafts")
    .select("id, status, version, legal_risk_level")
    .eq("id", params.id)
    .single();
  if (!draft) return NextResponse.json({ error: "Taslak bulunamadı" }, { status: 404 });

  try {
    const statusAfterEdit = transition(draft.status, "edit");
    const blocklistResult = runBlocklist(newText);
    const riskLevel: RiskLevel = combineRisk(blocklistResult, draft.legal_risk_level as RiskLevel);
    const finalStatus = canPublish(riskLevel) ? statusAfterEdit : transition(statusAfterEdit, "block_by_risk");

    await supabase
      .from("drafts")
      .update({
        text: newText,
        legal_risk_level: riskLevel,
        blocklist_hits: blocklistResult.hits,
        approved_text_hash: null,
        version: draft.version + 1,
        status: finalStatus,
      })
      .eq("id", params.id);

    await writeAuditLog({ userId: user.id, action: "draft_manual_edit", entityType: "drafts", entityId: params.id });
  } catch (e) {
    return draftErrorResponse(e);
  }

  return NextResponse.redirect(new URL("/drafts", request.url));
}
