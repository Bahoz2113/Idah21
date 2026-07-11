import { AppShell } from "@/components/AppShell";
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppShell roleLabel="Yönetici" nav={[
      { href: "/admin/dashboard",    label: "Panel",        icon: "🏠" },
      { href: "/admin/siniflar",     label: "Sınıflar",     icon: "📚" },
      { href: "/admin/mufredat",     label: "Müfredat",     icon: "📖" },
      { href: "/admin/ders-plani",   label: "Ders Planı",   icon: "🗓️" },
      { href: "/admin/ogrenciler",   label: "Öğrenciler",   icon: "🎓" },
      { href: "/admin/egitmenler",   label: "Eğitmenler",   icon: "👨‍🏫" },
      { href: "/admin/kullanicilar", label: "Kullanıcılar", icon: "👥" },
      { href: "/admin/projeler",     label: "Projeler",     icon: "🚀" },
      { href: "/admin/envanter",     label: "Envanter",     icon: "📦" },
      { href: "/admin/gorusmeler",   label: "Görüşmeler",   icon: "🤝" },
      { href: "/admin/etkinlik",     label: "Etkinlik",     icon: "📅" },
      { href: "/admin/bildirimler",  label: "Bildirimler",  icon: "🔔" },
    ]}>{children}</AppShell>
  );
}
