import Link from "next/link";
export default function ParentDashboard(): JSX.Element {
  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-3xl mx-auto w-full">
      <h1 className="text-xl sm:text-2xl font-bold text-lacivert mb-4">Veli Paneli</h1>
      <div className="grid grid-cols-2 gap-3">
        {[
          { href: "/parent/raporlar",   icon: "📄", label: "Raporlar" },
          { href: "/parent/devam",      icon: "✅", label: "Devam Takibi" },
          { href: "/parent/testler",    icon: "📝", label: "Test Sonuçları" },
          { href: "/parent/etkinlik",   icon: "📅", label: "Duyuru/Etkinlik" },
          { href: "/parent/bildirimler",icon: "🔔", label: "Bildirimler" },
        ].map((t) => (
          <Link key={t.href} href={t.href} className="p-4 bg-white border rounded-xl hover:border-mavi transition">
            <div className="text-2xl">{t.icon}</div>
            <div className="font-semibold text-lacivert mt-1">{t.label}</div>
          </Link>
        ))}
      </div>
      <p className="text-xs text-gray-400 mt-4">Görseller harici/anlık paylaşılır, sistemde tutulmaz (KVKK).</p>
    </div>
  );
}
