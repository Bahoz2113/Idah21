import { AppShell } from "@/components/AppShell";
export default function ParentLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppShell roleLabel="Veli" nav={[
      { href: "/parent/dashboard",  label: "Panel",    icon: "🏠" },
      { href: "/parent/raporlar",   label: "Raporlar", icon: "📄" },
      { href: "/parent/devam",      label: "Devam",    icon: "✅" },
      { href: "/parent/testler",    label: "Testler",  icon: "📝" },
      { href: "/parent/etkinlik",   label: "Etkinlik", icon: "📅" },
      { href: "/parent/bildirimler",label: "Bildirim", icon: "🔔" },
    ]}>{children}</AppShell>
  );
}
