"use client";
import Link from "next/link";
import { trpc } from "@cezeri/trpc";

const tiles = [
  { href:"/admin/siniflar",     label:"Sınıflar",     icon:"📚", desc:"Program & ders saatleri" },
  { href:"/admin/ogrenciler",   label:"Öğrenciler",   icon:"🎓", desc:"Kayıt & sınıf ataması" },
  { href:"/admin/egitmenler",   label:"Eğitmenler",   icon:"👨‍🏫", desc:"Kadro & davet" },
  { href:"/teacher/teacher-ai", label:"AI Öğretmen",  icon:"🤖", desc:"Yapay zeka ders asistanı" },
  { href:"/admin/kullanicilar", label:"Kullanıcılar", icon:"👥", desc:"Rol & erişim yönetimi" },
  { href:"/admin/projeler",     label:"Projeler",     icon:"🚀", desc:"Kurum projeleri & görevler" },
  { href:"/admin/envanter",     label:"Envanter",     icon:"📦", desc:"Malzeme stok & sınıf ataması" },
  { href:"/admin/gorusmeler",   label:"Görüşmeler",   icon:"🤝", desc:"Kurumsal takvim" },
  { href:"/admin/etkinlik",     label:"Etkinlik",     icon:"📅", desc:"Duyuru & takvim" },
];

export default function AdminDashboard(): JSX.Element {
  const upcoming = trpc.meetings.upcoming.useQuery();
  const stats    = trpc.lookup.overview.useQuery();
  const meets    = (upcoming.data ?? []) as any[];
  const s         = stats.data;

  const today = new Date();
  function daysLeft(dateStr: string) {
    const d = new Date(dateStr + "T12:00:00");
    return Math.ceil((d.getTime() - today.getTime()) / 86400000);
  }

  const kpis = [
    { label: "Toplam Öğrenci", value: s?.students, icon: "🎓", href: "/admin/ogrenciler" },
    { label: "Aktif Öğrenci",  value: s?.activeStudents, icon: "✨", href: "/admin/ogrenciler" },
    { label: "Sınıf",          value: s?.classes, icon: "📚", href: "/admin/siniflar" },
    { label: "Eğitmen",        value: s?.teachers, icon: "👨‍🏫", href: "/admin/egitmenler" },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto w-full animate-fade-up">
      {/* Premium hero header */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-darktech text-white p-5 sm:p-6 mb-6 shadow-czr-md">
        <div className="absolute -right-8 -top-8 w-40 h-40 rounded-full bg-white/5 blur-2xl" />
        <div className="relative">
          <p className="text-white/60 text-sm">CEZERİ ROBOTECH · Yönetim</p>
          <h1 className="text-2xl sm:text-3xl font-bold mt-1">Yönetici Paneli</h1>
          <p className="text-white/70 text-sm mt-1.5 max-w-md">
            Kurumun genel durumu, yaklaşan görüşmeler ve hızlı erişim tek ekranda.
          </p>
        </div>
      </div>

      {/* KPI metrik kartları */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {kpis.map((k) => (
          <Link key={k.label} href={k.href}
            className="group bg-white border border-borderc rounded-lg p-4 hover:shadow-czr-md hover:-translate-y-0.5 transition-all duration-200 ease-czr">
            <div className="flex items-center justify-between">
              <span className="text-lg">{k.icon}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-turkuaz/40 group-hover:bg-vurgu transition-colors" />
            </div>
            <div className="mt-3 text-2xl font-bold text-lacivert tabular-nums">
              {k.value ?? "—"}
            </div>
            <div className="text-xs text-textSecondary mt-0.5">{k.label}</div>
          </Link>
        ))}
      </div>

      {/* AI insight kartı — soft blue aura */}
      <div className="relative rounded-lg border border-turkuaz/20 bg-gradient-to-br from-turkuaz/[0.06] to-transparent p-4 mb-6 czr-ai-glow">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-md bg-mavi/10 flex items-center justify-center text-lg shrink-0">🤖</div>
          <div className="flex-1">
            <p className="font-semibold text-lacivert text-sm">AI Öğretmen hazır</p>
            <p className="text-xs text-textSecondary mt-0.5">
              Ders materyali analizi, yaşa göre içerik ve canlı öğrenci koçu — hepsi tek panelde.
            </p>
          </div>
          <Link href="/teacher/teacher-ai"
            className="text-xs bg-mavi text-white px-3 py-1.5 rounded-md font-medium hover:bg-lacivert transition-colors shrink-0">
            Aç
          </Link>
        </div>
      </div>

      {/* Yaklaşan görüşmeler */}
      {meets.length > 0 && (
        <div className="mb-6 space-y-2">
          <p className="text-sm font-semibold text-textSecondary">🔔 Yaklaşan Görüşmeler</p>
          {meets.map((m: any) => {
            const days = daysLeft(m.meetingDate?.slice(0,10));
            const isUrgent = days <= 2;
            return (
              <Link key={m.id} href="/admin/gorusmeler"
                className={`flex items-center gap-3 p-3 rounded-lg border transition-all hover:shadow-czr-sm ${isUrgent ? "bg-danger/5 border-danger/20" : "bg-vurgu/5 border-vurgu/20"}`}>
                <div className={`text-2xl font-bold min-w-10 text-center tabular-nums ${isUrgent ? "text-danger" : "text-vurguKoyu"}`}>
                  {days === 0 ? "!" : days}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-lacivert">
                    {m.personName} {m.institution ? `— ${m.institution}` : ""}
                  </p>
                  <p className="text-xs text-textSecondary truncate">{m.subject}</p>
                </div>
                <div className="text-xs text-textMuted shrink-0">
                  {days === 0 ? "Bugün!" : days === 1 ? "Yarın!" : `${days} gün`}
                </div>
              </Link>
            );
          })}
        </div>
      )}

      {/* Hızlı erişim */}
      <p className="text-sm font-semibold text-textSecondary mb-3">Hızlı Erişim</p>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
        {tiles.map((t) => (
          <Link key={t.href} href={t.href}
            className="group p-4 bg-white border border-borderc rounded-lg hover:border-vurgu/40 hover:shadow-czr-md hover:-translate-y-0.5 transition-all duration-200 ease-czr">
            <div className="w-10 h-10 rounded-md bg-mavi/5 group-hover:bg-vurgu/10 flex items-center justify-center text-xl transition-colors">{t.icon}</div>
            <div className="font-semibold text-lacivert mt-2.5 text-sm">{t.label}</div>
            <div className="text-xs text-textMuted mt-0.5">{t.desc}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
