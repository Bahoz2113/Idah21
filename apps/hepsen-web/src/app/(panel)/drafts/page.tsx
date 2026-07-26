import { getServerSupabase } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { REGENERATE_HINTS } from "@/lib/drafts/regenerate-hints";

export const dynamic = "force-dynamic";

type DraftStatus = "REVIEW_REQUIRED" | "APPROVED" | "BLOCKED_BY_RISK" | "NEEDS_REVISION";

interface DraftRow {
  id: string;
  text: string;
  hashtags: string[];
  legal_risk_level: "LOW" | "MEDIUM" | "HIGH" | "BLOCKED";
  status: DraftStatus;
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

const REJECT_REASONS = [
  { value: "too_harsh", label: "Fazla sert" },
  { value: "too_soft", label: "Fazla yumuşak" },
  { value: "artificial", label: "Yapay/klişe" },
  { value: "not_corporate", label: "Kurumsal değil" },
  { value: "risky", label: "Riskli" },
  { value: "irrelevant", label: "İlgisiz" },
  { value: "repetitive", label: "Tekrar" },
  { value: "off_tone", label: "Üsluba uymuyor" },
] as const;

async function loadDrafts(supabase: ReturnType<typeof getServerSupabase>): Promise<DraftRow[]> {
  const { data } = await supabase
    .from("drafts")
    .select("id, text, hashtags, legal_risk_level, status, recommended_publish_at, timing_reason, topics(title)")
    .in("status", ["REVIEW_REQUIRED", "APPROVED", "BLOCKED_BY_RISK", "NEEDS_REVISION"])
    .order("created_at", { ascending: false })
    .limit(20);
  return (data ?? []) as unknown as DraftRow[];
}

function toDatetimeLocal(iso: string | null): string {
  if (!iso) return "";
  return new Date(iso).toISOString().slice(0, 16);
}

export default async function DraftsPage() {
  const supabase = getServerSupabase();
  const drafts = await loadDrafts(supabase);

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-xl font-bold">Taslaklar</h1>

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
              <div className="flex gap-2">
                <Badge variant={RISK_VARIANT[draft.legal_risk_level]}>{draft.legal_risk_level}</Badge>
                <Badge>{draft.status}</Badge>
              </div>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              <p className="text-sm">{draft.text}</p>
              {draft.hashtags.length > 0 && <p className="text-xs text-hepsenBlue">{draft.hashtags.join(" ")}</p>}
              {draft.timing_reason && <p className="text-xs text-hepsenNavy/50">{draft.timing_reason}</p>}

              <div className="flex flex-wrap gap-2 border-t border-black/10 pt-3">
                {draft.status === "REVIEW_REQUIRED" && (
                  <form action={`/api/drafts/${draft.id}/approve`} method="post">
                    <Button type="submit" size="sm">
                      Onayla
                    </Button>
                  </form>
                )}

                {draft.status === "APPROVED" && (
                  <form
                    action={`/api/drafts/${draft.id}/schedule`}
                    method="post"
                    className="flex items-center gap-2"
                  >
                    <input
                      type="datetime-local"
                      name="publishAt"
                      defaultValue={toDatetimeLocal(draft.recommended_publish_at)}
                      className="rounded-md border border-black/15 px-2 py-1 text-xs"
                    />
                    <Button type="submit" size="sm">
                      Zamanla
                    </Button>
                  </form>
                )}

                {(draft.status === "REVIEW_REQUIRED" || draft.status === "APPROVED") && (
                  <form action={`/api/drafts/${draft.id}/reject`} method="post" className="flex items-center gap-2">
                    <select name="reasonCode" className="rounded-md border border-black/15 px-2 py-1 text-xs" required>
                      {REJECT_REASONS.map((r) => (
                        <option key={r.value} value={r.value}>
                          {r.label}
                        </option>
                      ))}
                    </select>
                    <Button type="submit" variant="destructive" size="sm">
                      Reddet
                    </Button>
                  </form>
                )}
              </div>

              <details className="text-xs">
                <summary className="cursor-pointer text-hepsenBlue">Düzenle</summary>
                <form action={`/api/drafts/${draft.id}/edit`} method="post" className="mt-2 flex flex-col gap-2">
                  <textarea
                    name="text"
                    defaultValue={draft.text}
                    rows={3}
                    className="rounded-md border border-black/15 p-2 text-sm"
                  />
                  <Button type="submit" size="sm" variant="outline">
                    Kaydet
                  </Button>
                </form>
              </details>

              <details className="text-xs">
                <summary className="cursor-pointer text-hepsenBlue">Yeniden üret</summary>
                <div className="mt-2 flex flex-wrap gap-2">
                  {Object.entries(REGENERATE_HINTS).map(([key]) => (
                    <form key={key} action={`/api/drafts/${draft.id}/regenerate`} method="post">
                      <input type="hidden" name="hint" value={key} />
                      <Button type="submit" size="sm" variant="outline">
                        {REGENERATE_HINT_LABELS[key as keyof typeof REGENERATE_HINTS]}
                      </Button>
                    </form>
                  ))}
                </div>
              </details>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}

const REGENERATE_HINT_LABELS: Record<keyof typeof REGENERATE_HINTS, string> = {
  daha_kararli: "Daha kararlı",
  daha_kisa: "Daha kısa",
  daha_dogal: "Daha doğal",
  daha_kurumsal: "Daha kurumsal",
  riski_azalt: "Riski azalt",
  hashtag_degistir: "Hashtag değiştir",
};
