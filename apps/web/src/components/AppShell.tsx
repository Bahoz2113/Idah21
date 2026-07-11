"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { trpc } from "@cezeri/trpc";
import { OwlMark } from "@/components/OwlMark";

interface NavItem { href: string; label: string; icon: string; }
interface Props { roleLabel: string; nav: NavItem[]; children: React.ReactNode; }

export function AppShell({ roleLabel, nav, children }: Props) {
  const pathname = usePathname();
  const router   = useRouter();
  const [open, setOpen] = useState(false);
  const { data: me } = trpc.auth.me.useQuery();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST", credentials: "include" }).catch(() => {});
    router.push("/login");
  }

  const initials = me ? (me.firstName?.[0] ?? "") + (me.lastName?.[0] ?? "") : "?";

  return (
    <div className="min-h-screen flex flex-col bg-bgLight">
      {/* ÜST BAR */}
      <header className="bg-gradient-darktech text-white px-4 h-14 flex items-center gap-3 shadow-czr-sm z-30 sticky top-0">
        <button onClick={() => setOpen(!open)}
          className="w-9 h-9 flex items-center justify-center rounded-md hover:bg-white/10 transition-colors"
          aria-label="Menü">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>
        <div className="flex-1 flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-white/95 flex items-center justify-center p-0.5 shadow-czr-sm">
            <OwlMark size={28} />
          </div>
          <span className="font-extrabold tracking-tight leading-none">
            <span className="text-white">CZR</span> <span className="text-vurgu">CEOS</span>
          </span>
          <span className="text-white/40 text-xs ml-1 hidden sm:inline">· {roleLabel}</span>
        </div>
        <div className="w-9 h-9 rounded-full bg-vurgu text-lacivert font-bold text-sm flex items-center justify-center">
          {initials.toUpperCase() || "?"}
        </div>
      </header>

      <div className="flex flex-1 relative">
        {/* KENAR ÇUBUĞU — premium floating hissi */}
        <aside className={`fixed inset-y-0 left-0 z-20 w-64 bg-gradient-darktech text-white transform transition-transform duration-200 ease-czr pt-14 flex flex-col ${open ? "translate-x-0" : "-translate-x-full"}`}>
          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
            {nav.map((item) => {
              const active = pathname.startsWith(item.href);
              return (
                <Link key={item.href} href={item.href}
                  onClick={() => setOpen(false)}
                  className={`relative flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-all duration-200 ease-czr ${
                    active
                      ? "bg-white/10 text-white border border-white/10 shadow-[0_0_16px_rgba(99,182,242,0.15)]"
                      : "text-white/60 hover:bg-white/5 hover:text-white border border-transparent"
                  }`}>
                  {active && <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r bg-vurgu" />}
                  <span className="text-lg">{item.icon}</span>
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <div className="p-3 border-t border-white/10">
            {me && (
              <div className="px-3 py-2 text-sm mb-1">
                <div className="font-semibold text-white">{me.firstName} {me.lastName}</div>
                <div className="text-xs text-white/50">{me.email}</div>
              </div>
            )}
            <button onClick={handleLogout}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-white/60 hover:bg-white/5 hover:text-red-300 transition-colors">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M16 17l5-5-5-5M21 12H9M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Çıkış Yap
            </button>
          </div>
        </aside>

        {/* KAPLAMA */}
        {open && <div className="fixed inset-0 z-10 bg-lacivert/50 backdrop-blur-sm" onClick={() => setOpen(false)} />}

        {/* İÇERİK */}
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
