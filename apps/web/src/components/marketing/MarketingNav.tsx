"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { contact, org, sections } from "@/lib/seo/site";

/**
 * Sabit navigasyon + kaydırma ilerleme çubuğu.
 *
 * Aktif bölüm takibi IntersectionObserver ile yapılır; scroll olayında
 * `getBoundingClientRect()` çağırmak her karede zorunlu düzen hesabı
 * (layout thrashing) tetikler ve tam da sinematik akışın pürüzsüz olması
 * gereken yerde kare düşürür.
 *
 * İlerleme çubuğu ise scroll olayına bağlıdır ama yalnızca CSS transform
 * günceller — düzen hesabı gerektirmez.
 */
export function MarketingNav() {
  const [active, setActive] = useState<string>(sections[0].id);
  const [progress, setProgress] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        // Görünür bölümler arasında ekranda en çok yer kaplayanı seç.
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(visible.target.id);
      },
      { threshold: [0.15, 0.4, 0.7], rootMargin: "-15% 0px -45% 0px" },
    );

    sections.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    let ticking = false;

    const onScroll = () => {
      if (ticking) return;
      ticking = true;

      requestAnimationFrame(() => {
        const scrollable = document.documentElement.scrollHeight - window.innerHeight;
        setProgress(scrollable > 0 ? window.scrollY / scrollable : 0);
        setScrolled(window.scrollY > 40);
        ticking = false;
      });
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ease-czr-cine ${
        scrolled ? "border-b border-white/8 bg-czr-base/88 backdrop-blur-xl" : "bg-transparent"
      }`}
    >
      {/* Kaydırma ilerlemesi */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-0.5 origin-left bg-czr-launch"
        style={{ transform: `scaleX(${progress})` }}
      />

      <nav aria-label="Ana navigasyon" className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-4 lg:px-10">
        <a href="#us" className="group flex items-center gap-3">
          {/* Kurumun robotik baykuş amblemi. `priority`: sabit başlıkta,
              ilk ekranda görünür — tembel yüklenirse logo geç belirir. */}
          <Image
            src="/logo.png"
            alt={`${org.name} robotik baykuş amblemi`}
            width={40}
            height={40}
            priority
            className="h-9 w-9 shrink-0 object-contain transition-transform duration-500 ease-czr-cine group-hover:scale-105"
          />
          <span className="text-[15px] font-extrabold tracking-tight text-white">
            {org.name}
          </span>
        </a>

        {/* Masaüstü bölüm bağlantıları */}
        <ul className="hidden items-center gap-1 lg:flex">
          {sections.map((s) => (
            <li key={s.id}>
              <a
                href={`#${s.id}`}
                aria-current={active === s.id ? "true" : undefined}
                className={`rounded-full px-4 py-2 text-[13px] font-semibold transition duration-300 ${
                  active === s.id
                    ? "bg-white/8 text-czr-orange"
                    : "text-czr-ice/60 hover:text-white"
                }`}
              >
                {s.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <a
            href={`tel:${contact.phoneE164}`}
            className="hidden rounded-full border border-white/12 px-5 py-2.5 text-[13px] font-semibold text-czr-ice transition duration-300 hover:border-czr-orange/50 hover:text-czr-orange sm:inline-flex"
          >
            {contact.phoneDisplay}
          </a>

          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-expanded={menuOpen}
            aria-controls="mobil-menu"
            aria-label={menuOpen ? "Menüyü kapat" : "Menüyü aç"}
            className="rounded-full border border-white/12 p-2.5 text-czr-ice lg:hidden"
          >
            <svg viewBox="0 0 20 20" className="h-4 w-4" fill="currentColor" aria-hidden="true">
              {menuOpen ? (
                <path d="m5.5 4 4.5 4.5L14.5 4 16 5.5 11.5 10l4.5 4.5-1.5 1.5L10 11.5 5.5 16 4 14.5 8.5 10 4 5.5z" />
              ) : (
                <path d="M3 5h14v2H3zm0 4h14v2H3zm0 4h14v2H3z" />
              )}
            </svg>
          </button>
        </div>
      </nav>

      {menuOpen ? (
        <div id="mobil-menu" className="border-t border-white/8 bg-czr-base/96 backdrop-blur-xl lg:hidden">
          <ul className="mx-auto max-w-7xl px-6 py-3">
            {sections.map((s) => (
              <li key={s.id}>
                <a
                  href={`#${s.id}`}
                  onClick={() => setMenuOpen(false)}
                  className={`block border-b border-white/6 py-3.5 text-[15px] font-semibold ${
                    active === s.id ? "text-czr-orange" : "text-czr-ice/75"
                  }`}
                >
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </header>
  );
}
