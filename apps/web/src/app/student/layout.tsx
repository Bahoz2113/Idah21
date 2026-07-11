import { AppShell } from "@/components/AppShell";
export default function StudentLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppShell roleLabel="Öğrenci" nav={[
      { href: "/student/dashboard",  label: "Panel",    icon: "🏠" },
      { href: "/student/derslerim",  label: "Derslerim",icon: "📖" },
      { href: "/student/bildirimler",label: "Bildirim", icon: "🔔" },
    ]}>{children}</AppShell>
  );
}
