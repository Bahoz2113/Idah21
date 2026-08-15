import Link from "next/link";
const tiles = [
  { href: "/teacher/yoklama", label: "Yoklama", icon: "✅", b: "mavi" },
  { href: "/teacher/dersler", label: "Dersler & Materyal", icon: "📖", b: "mavi" },
  { href: "/teacher/degerlendirme", label: "Değerlendirme", icon: "📊", b: "mavi" },
  { href: "/teacher/teacher-ai", label: "TEACHER AI", icon: "🤖", b: "vurgu" },
  { href: "/teacher/raporlar", label: "Raporlar", icon: "📄", b: "mavi" },
  { href: "/bildirimler", label: "Bildirimler", icon: "🔔", b: "mavi" },
];
export default function TeacherDashboard(): JSX.Element {
  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto w-full">
      <h1 className="text-xl sm:text-2xl font-bold text-lacivert mb-4">Eğitmen Paneli</h1>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
        {tiles.map((t) => (
          <Link key={t.href} href={t.href} className={`p-4 bg-white border rounded-xl hover:border-${t.b} transition`}>
            <div className="text-2xl">{t.icon}</div>
            <div className="font-semibold text-lacivert mt-1 text-sm sm:text-base">{t.label}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
