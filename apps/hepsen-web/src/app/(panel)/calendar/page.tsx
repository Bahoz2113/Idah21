import { getServerSupabase } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const dynamic = "force-dynamic";

interface ScheduledRow {
  id: string;
  text: string;
  recommended_publish_at: string | null;
  topics: { title: string } | null;
  publications: { scheduled_at: string; status: string; error_message: string | null }[];
}

async function loadScheduled(supabase: ReturnType<typeof getServerSupabase>): Promise<ScheduledRow[]> {
  const { data } = await supabase
    .from("drafts")
    .select("id, text, recommended_publish_at, topics(title), publications(scheduled_at, status, error_message)")
    .eq("status", "SCHEDULED")
    .order("recommended_publish_at", { ascending: true });
  return (data ?? []) as unknown as ScheduledRow[];
}

export default async function CalendarPage() {
  const supabase = getServerSupabase();
  const scheduled = await loadScheduled(supabase);

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-xl font-bold">Takvim</h1>

      {scheduled.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Zamanlanmış paylaşım yok</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-hepsenNavy/60">
              Taslaklar panelinden onaylanan bir taslağı zamanladığınızda burada görünecek.
            </p>
          </CardContent>
        </Card>
      ) : (
        scheduled.map((draft) => {
          const pub = draft.publications?.[0];
          return (
            <Card key={draft.id}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <CardTitle>{draft.topics?.title ?? "Konu bağlı değil"}</CardTitle>
                <Badge variant={pub?.error_message ? "high" : "low"}>{pub?.status ?? "pending"}</Badge>
              </CardHeader>
              <CardContent className="flex flex-col gap-2">
                <p className="text-sm">{draft.text}</p>
                <p className="text-xs text-hepsenNavy/60">
                  Zamanlanan: {pub ? new Date(pub.scheduled_at).toLocaleString("tr-TR") : "—"}
                </p>
                {pub?.error_message && <p className="text-xs text-risk-blocked">{pub.error_message}</p>}
              </CardContent>
            </Card>
          );
        })
      )}
    </div>
  );
}
