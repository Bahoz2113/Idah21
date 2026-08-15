import Link from "next/link";
export default function StudentDashboard(): JSX.Element {
  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-3xl mx-auto w-full">
      <h1 className="text-xl sm:text-2xl font-bold text-lacivert mb-4">Öğrenci Paneli</h1>
      <div className="grid grid-cols-2 gap-3">
        {[
          { href: "/student/derslerim",   icon: "📖", label: "Derslerim & Ödevler" },
          { href: "/student/bildirimler", icon: "🔔", label: "Bildirimler" },
        ].map((t) => (
          <Link key={t.href} href={t.href} className="p-4 bg-white border rounded-xl hover:border-mavi transition">
            <div className="text-2xl">{t.icon}</div>
            <div className="font-semibold text-lacivert mt-1">{t.label}</div>
          </Link>
        ))}
        <div className="p-4 bg-gray-50 border rounded-xl text-gray-400 col-span-2 text-sm">
          🤖 TEACHER AI quizi öğretmenin paylaştığı linkten · 🏅 Rozetler Faz 5'te
        </div>
      </div>
    </div>
  );
}
