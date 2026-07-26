import { NextResponse, type NextRequest } from "next/server";
import { evaluate, llmCostUsd, DEFAULT_PRICING } from "@hepsen/core";
import { getEnv } from "@/lib/env";
import { getServerSupabase } from "@/lib/supabase/server";
import { buildBudgetConfig } from "@/lib/budget-config";
import { loadBudgetState } from "@/lib/budget-state";
import { getLlmGateway, ANTHROPIC_MODEL } from "@/lib/ai/gateway";
import { loadDraftGenerationContext } from "@/lib/drafts/context";
import { regenerateDraft } from "@/lib/drafts/regenerate-draft";
import { isRegenerateHintKey } from "@/lib/drafts/regenerate-hints";
import { checkRateLimit } from "@/lib/rate-limit";
import { writeAuditLog } from "@/lib/audit/log";
import { draftErrorResponse } from "@/lib/drafts/http-errors";

export const dynamic = "force-dynamic";

interface RouteParams {
  params: { id: string };
}

/** Kaba on-tahmin (gercek maliyet regenerateDraft->runProductionPipeline icinde yazilir). */
const REGENERATION_ESTIMATE_TOKENS = { input: 2500, output: 1200 };

export async function POST(request: NextRequest, { params }: RouteParams) {
  const supabase = getServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.redirect(new URL("/login", request.url));

  const rl = checkRateLimit(`regenerate:${user.id}`, 10, 60_000);
  if (!rl.allowed) {
    return NextResponse.json({ error: "Çok fazla istek, birazdan tekrar deneyin." }, { status: 429 });
  }

  const formData = await request.formData();
  const hintRaw = formData.get("hint");
  const hint = typeof hintRaw === "string" && isRegenerateHintKey(hintRaw) ? hintRaw : undefined;

  const env = getEnv();
  const budgetCfg = buildBudgetConfig();
  const budgetState = await loadBudgetState(supabase);
  const estCost = llmCostUsd(DEFAULT_PRICING, ANTHROPIC_MODEL, REGENERATION_ESTIMATE_TOKENS);
  const decision = evaluate(budgetCfg, budgetState, "anthropic", "regeneration", estCost);
  if (!decision.allowed) {
    return NextResponse.json({ error: decision.reason }, { status: 200 });
  }

  const gateway = getLlmGateway(env);
  const { presidentialContext, accountHistory, accountStartedAt } = await loadDraftGenerationContext(supabase);

  try {
    const result = await regenerateDraft({
      supabase,
      gateway,
      userId: user.id,
      draftId: params.id,
      hint,
      presidentialContext,
      accountHistory,
      accountStartedAt,
    });
    if (!result) return NextResponse.json({ error: "Taslak bulunamadı" }, { status: 404 });

    await writeAuditLog({
      userId: user.id,
      action: "draft_regenerate",
      entityType: "drafts",
      entityId: params.id,
      metadata: { hint },
    });
  } catch (e) {
    return draftErrorResponse(e);
  }

  return NextResponse.redirect(new URL("/drafts", request.url));
}
