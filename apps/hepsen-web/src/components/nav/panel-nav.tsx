"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/components/ui/cn";

const ITEMS = [
  { href: "/today", label: "Bugün" },
  { href: "/drafts", label: "Taslaklar" },
  { href: "/calendar", label: "Takvim" },
  { href: "/analytics", label: "Analiz" },
  { href: "/settings", label: "Ayarlar" },
] as const;

export function PanelNav() {
  const pathname = usePathname();

  return (
    <>
      {/* Masaüstü: sol menü */}
      <nav className="hidden md:flex md:w-56 md:flex-col md:gap-1 md:border-r md:border-black/10 md:p-4">
        <div className="mb-4 px-2 text-sm font-bold text-hepsenNavy dark:text-white">
          HEP-SEN Batman
        </div>
        {ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "rounded-md px-3 py-2 text-sm font-medium transition-colors",
              pathname.startsWith(item.href)
                ? "bg-hepsenBlue text-white"
                : "text-hepsenNavy hover:bg-hepsenBlue/10 dark:text-white",
            )}
          >
            {item.label}
          </Link>
        ))}
      </nav>

      {/* Mobil: alt navigasyon */}
      <nav className="fixed inset-x-0 bottom-0 z-10 flex border-t border-black/10 bg-white md:hidden">
        {ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-1 flex-col items-center gap-0.5 py-2 text-[11px] font-medium",
              pathname.startsWith(item.href) ? "text-hepsenBlue" : "text-hepsenNavy/60",
            )}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </>
  );
}
