import { getServerSupabase } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const dynamic = "force-dynamic";

interface XAccountRow {
  username: string;
  connected_at: string;
  revoked_at: string | null;
}

export default async function SettingsPage() {
  const supabase = getServerSupabase();
  const { data: account } = await supabase
    .from("x_accounts")
    .select("username, connected_at, revoked_at")
    .is("revoked_at", null)
    .order("connected_at", { ascending: false })
    .limit(1)
    .maybeSingle<XAccountRow>();

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-xl font-bold">Ayarlar</h1>

      <Card>
        <CardHeader>
          <CardTitle>X hesabı bağlantısı</CardTitle>
        </CardHeader>
        <CardContent>
          {account ? (
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <Badge variant="low">Bağlı</Badge>
                <span className="text-sm">@{account.username}</span>
              </div>
              <p className="text-xs text-hepsenNavy/60">
                Bağlantı tarihi: {new Date(account.connected_at).toLocaleString("tr-TR")}
              </p>
              <form action="/api/auth/x/disconnect" method="post">
                <Button type="submit" variant="destructive" size="sm">
                  Bağlantıyı kaldır
                </Button>
              </form>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              <p className="text-sm text-hepsenNavy/60">
                X hesabı henüz bağlı değil. Şifre asla istenmez — OAuth 2.0 PKCE ile
                X&apos;in kendi sayfasından onay verilir.
              </p>
              <a href="/api/auth/x/connect">
                <Button type="button" size="sm">
                  X hesabını bağla
                </Button>
              </a>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
