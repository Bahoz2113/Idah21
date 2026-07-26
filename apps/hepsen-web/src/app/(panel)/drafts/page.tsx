import { getServerSupabase } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const dynamic = "force-dynamic";

interface DraftRow {
  id: string;
  text: string;
  hashtags: string[];
  legal_risk_level: "LOW" | "MEDIUM" | "HIGH" | "BLOCKED";
  status: string;
  recommended_publish_at: string | null;
  timing_reason: string | null;
  topics: { title: string } | null;
}

const RISK_VARIANT: Record<DraftRow["legal_risk_level"], "low" | "medium" | "high" | "blocked"> = {
  LOW: "low",
  MEDIUM: "medium",
  HIGH: "high",
  BLOCKED: "blocked",
};

async function loadDrafts(supabase: ReturnType<typeof getServerSupabase>): Promise<DraftRow[]> {
  const { data } = await supabase
    .from("drafts")
    .select("id, text, hashtags, legal_risk_level, status, recommended_publish_at, timing_reason, topics(title)")
    .in("status", ["REVIEW_REQUIRED", "BLOCKED_BY_RISK", "NEEDS_REVISION"])
    .order("created_at", { ascending: false })
    .limit(20);
  return (data ?? []) as unknown as DraftRow[];
}

export default async function DraftsPage() {
  const supabase = getServerSupabase();
  const drafts = await loadDrafts(supabase);

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-xl font-bold">Taslaklar</h1>

      <Card>
        <CardContent className="pt-4">
          <p className="text-sm text-hepsenNavy/60">
            Onay, düzenleme ve reddetme işlemleri Faz 3&apos;te eklenecek. Bu ekran şimdilik salt-okur bir
            listedir.
          </p>
        </CardContent>
      </Card>

      {drafts.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Henüz taslak yok</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-hepsenNavy/60">
              Toplama ve taslak üretim işleri çalıştıktan sonra gündeme uygun taslaklar burada listelenecek.
            </p>
          </CardContent>
        </Card>
      ) : (
        drafts.map((draft) => (
          <Card key={draft.id}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <CardTitle>{draft.topics?.title ?? "Konu bağlı değil"}</CardTitle>
              <Badge variant={RISK_VARIANT[draft.legal_risk_level]}>{draft.legal_risk_level}</Badge>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              <p className="text-sm">{draft.text}</p>
              {draft.hashtags.length > 0 && (
                <p className="text-xs text-hepsenBlue">{draft.hashtags.join(" ")}</p>
              )}
              <div className="flex items-center justify-between text-xs text-hepsenNavy/60">
                <span>Durum: {draft.status}</span>
                {draft.recommended_publish_at && (
                  <span>Önerilen: {new Date(draft.recommended_publish_at).toLocaleString("tr-TR")}</span>
                )}
              </div>
              {draft.timing_reason && <p className="text-xs text-hepsenNavy/50">{draft.timing_reason}</p>}
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}
