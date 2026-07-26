import { evaluate } from "@hepsen/core";
import { getServerSupabase } from "@/lib/supabase/server";
import { buildBudgetConfig } from "@/lib/budget-config";
import { loadBudgetState } from "@/lib/budget-state";
import { BudgetGauge } from "@/components/budget/budget-gauge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const dynamic = "force-dynamic";

interface TopicRow {
  id: string;
  title: string;
  final_score: number | null;
  category: string | null;
}

async function loadTodaysTopics(supabase: ReturnType<typeof getServerSupabase>): Promise<TopicRow[]> {
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);
  const { data } = await supabase
    .from("topics")
    .select("id, title, final_score, category")
    .gte("created_at", startOfDay.toISOString())
    .order("final_score", { ascending: false })
    .limit(3);
  return (data ?? []) as TopicRow[];
}

async function loadPendingDraftsCount(supabase: ReturnType<typeof getServerSupabase>): Promise<number> {
  const { count } = await supabase
    .from("drafts")
    .select("id", { count: "exact", head: true })
    .eq("status", "REVIEW_REQUIRED");
  return count ?? 0;
}

export default async function TodayPage() {
  const supabase = getServerSupabase();
  const cfg = buildBudgetConfig();
  const [state, topics, pendingDrafts] = await Promise.all([
    loadBudgetState(supabase),
    loadTodaysTopics(supabase),
    loadPendingDraftsCount(supabase),
  ]);
  // Bilgilendirme amaçlı: bu ayki genel durumu göstermek için 0 USD'lik bir
  // "discovery_query" değerlendirmesi kullanılıyor (gerçek harcama tetiklemez).
  const decision = evaluate(cfg, state, "anthropic", "discovery_query", 0);

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-xl font-bold">Bugün</h1>

      <BudgetGauge decision={decision} monthlyUsd={cfg.monthlyUsd} />

      <Card>
        <CardHeader>
          <CardTitle>Günün sağlık gündemi</CardTitle>
        </CardHeader>
        <CardContent>
          {topics.length === 0 ? (
            <p className="text-sm text-hepsenNavy/60">
              Bugün için henüz puanlanmış gündem yok. Toplama/üretim işleri çalıştıktan sonra burada görünecek.
            </p>
          ) : (
            <ul className="flex flex-col gap-2">
              {topics.map((t) => (
                <li key={t.id} className="flex items-center justify-between text-sm">
                  <span>{t.title}</span>
                  <Badge>{t.final_score ?? "—"} puan</Badge>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Onay bekleyen taslak</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{pendingDrafts}</p>
            <p className="text-xs text-hepsenNavy/60">Onay/red işlemleri Faz 3&apos;te eklenecek.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Sıradaki planlı paylaşım</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">—</p>
            <p className="text-xs text-hepsenNavy/60">Zamanlanmış yayın Faz 3&apos;te aktif olacak.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
