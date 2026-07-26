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

interface AppSettingsRow {
  emergency_stop: boolean;
  emergency_stop_reason: string | null;
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

  const { data: settings } = await supabase
    .from("app_settings")
    .select("emergency_stop, emergency_stop_reason")
    .maybeSingle<AppSettingsRow>();
  const emergencyStop = settings?.emergency_stop ?? false;

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

      <Card>
        <CardHeader>
          <CardTitle>Acil Durdurma</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <Badge variant={emergencyStop ? "blocked" : "low"}>
                {emergencyStop ? "Yayın durduruldu" : "Aktif"}
              </Badge>
            </div>
            <p className="text-xs text-hepsenNavy/60">
              Açıldığında tüm otomatik X yayınları (saatlik yayın işi) hemen durur;
              onaylanmış/zamanlanmış taslaklar etkilenmez, sadece gerçek paylaşım askıya alınır.
            </p>
            {settings?.emergency_stop_reason && (
              <p className="text-xs text-hepsenNavy/50">Gerekçe: {settings.emergency_stop_reason}</p>
            )}
            <form action="/api/settings/emergency-stop" method="post" className="flex flex-col gap-2">
              <input type="hidden" name="enabled" value={(!emergencyStop).toString()} />
              {!emergencyStop && (
                <input
                  type="text"
                  name="reason"
                  placeholder="Durdurma gerekçesi (opsiyonel)"
                  className="rounded-md border border-black/15 px-3 py-2 text-sm"
                />
              )}
              <Button type="submit" variant={emergencyStop ? "default" : "destructive"} size="sm">
                {emergencyStop ? "Yayını yeniden başlat" : "Acil durdur"}
              </Button>
            </form>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
