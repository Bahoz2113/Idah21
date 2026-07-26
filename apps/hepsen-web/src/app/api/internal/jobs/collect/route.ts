import { NextResponse, type NextRequest } from "next/server";
import { contentHash, evaluate, apifyCostUsd, DEFAULT_PRICING } from "@hepsen/core";
import { getEnv } from "@/lib/env";
import { getServiceRoleClient } from "@/lib/supabase/server";
import { collectFromSource, type SourceRow } from "@/lib/sources";
import { buildBudgetConfig } from "@/lib/budget-config";
import { loadBudgetState } from "@/lib/budget-state";
import { recordApifyUsage } from "@/lib/budget-usage";
import { writeAuditLog } from "@/lib/audit/log";
import { isAuthorizedCronRequest } from "@/lib/cron-auth";

export const dynamic = "force-dynamic";

interface SourceDbRow extends SourceRow {
  user_id: string;
}

/** Apify icin kaba on-tahmin (gercek maliyet toplama sonrasi ayrica yazilir). */
const APIFY_ESTIMATED_RESULTS = 50;

// Vercel Cron istekleri GET ile gelir; POST manuel/lokal tetikleme icin ayni mantigi kullanir.
export { handleCollectJob as GET, handleCollectJob as POST };

async function handleCollectJob(request: NextRequest) {
  const env = getEnv();
  if (!isAuthorizedCronRequest(request, env.CRON_SECRET)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const supabase = getServiceRoleClient();
  const { data: sources, error: sourcesError } = await supabase
    .from("sources")
    .select("id, user_id, name, type, url_or_query, reliability_level, is_active, category")
    .eq("is_active", true);

  if (sourcesError) {
    return NextResponse.json({ error: sourcesError.message }, { status: 500 });
  }
  if (!sources || sources.length === 0) {
    return NextResponse.json({ sourceCount: 0, collected: 0, skipped: 0, errors: [] });
  }

  const budgetCfg = buildBudgetConfig();
  let collected = 0;
  let skipped = 0;
  const errors: string[] = [];

  for (const source of sources as SourceDbRow[]) {
    try {
      if (source.type === "apify_query") {
        const budgetState = await loadBudgetState(supabase);
        const estCost = apifyCostUsd(DEFAULT_PRICING, APIFY_ESTIMATED_RESULTS);
        const decision = evaluate(budgetCfg, budgetState, "apify", "discovery_query", estCost);
        if (!decision.allowed) {
          errors.push(`${source.name}: bütçe guard engelledi (${decision.reason})`);
          continue;
        }
      }

      const items = await collectFromSource(source, {
        APIFY_API_TOKEN: env.APIFY_API_TOKEN,
        APIFY_X_ACTOR_ID: env.APIFY_X_ACTOR_ID,
      });

      for (const item of items) {
        const hash = contentHash(item.title ?? "", item.content, item.url);
        const { error: insertError } = await supabase.from("collected_items").insert({
          user_id: source.user_id,
          source_id: source.id,
          external_id: item.externalId,
          platform: item.platform,
          title: item.title,
          content: item.content,
          url: item.url,
          author: item.author,
          author_handle: item.authorHandle,
          published_at: item.publishedAt,
          raw_payload: item.rawPayload ?? null,
          content_hash: hash,
        });

        if (insertError) {
          // 23505 = unique_violation -> ayni icerik zaten var, dedup, sessizce say
          if (insertError.code === "23505") {
            skipped++;
          } else {
            errors.push(`${source.name}: ${insertError.message}`);
          }
        } else {
          collected++;
        }
      }

      if (source.type === "apify_query" && items.length > 0) {
        await recordApifyUsage(supabase, source.user_id, items.length);
      }

      await supabase.from("sources").update({ last_checked_at: new Date().toISOString() }).eq("id", source.id);
    } catch (e) {
      errors.push(`${source.name}: ${e instanceof Error ? e.message : String(e)}`);
    }
  }

  await writeAuditLog({
    userId: (sources[0] as SourceDbRow).user_id,
    action: "collect_job_run",
    metadata: { sourceCount: sources.length, collected, skipped, errorCount: errors.length },
  });

  return NextResponse.json({ sourceCount: sources.length, collected, skipped, errors });
}
