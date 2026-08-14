import { AppShell } from "@/components/AppShell";
export default function TeacherLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppShell roleLabel="Eğitmen" nav={[
      { href: "/teacher/dashboard",    label: "Panel",          icon: "🏠" },
      { href: "/admin/siniflar",       label: "Sınıflar",       icon: "📚" },
      { href: "/teacher/yoklama",      label: "Yoklama",        icon: "✅" },
      { href: "/teacher/degerlendirme",label: "Değerlendirme",  icon: "⭐" },
      { href: "/teacher/dersler",      label: "Haftalık Plan",  icon: "📋" },
      { href: "/teacher/ders-plani",   label: "Ders Planı",     icon: "🗓️" },
      { href: "/teacher/teacher-ai",   label: "AI Öğretmen",   icon: "🤖" },
      { href: "/teacher/veliye-not",   label: "Veliye Not",     icon: "📝" },
      { href: "/teacher/raporlar",     label: "Raporlar",       icon: "📊" },
      { href: "/teacher/bildirimler",  label: "Bildirimler",    icon: "🔔" },
    ]}>{children}</AppShell>
  );
}
