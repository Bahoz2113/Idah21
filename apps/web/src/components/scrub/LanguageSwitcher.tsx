"use client";

import { useEffect, useRef, useState } from "react";
import { type Locale, localeMeta, localePath, locales } from "@/lib/i18n/config";
import { ui } from "@/lib/i18n/ui";

/**
 * DİL SEÇİCİ.
 *
 * GERÇEK BAĞLANTILAR. Her seçenek `<a href="/en">` — JavaScript ile
 * yönlendiren bir düğme değil. Dört dil dört ayrı adres ve ayrı ayrı
 * dizine giriyor; arama motorunun bu bağlantıları görmesi `hreflang`
 * etiketlerinin sayfa içindeki karşılığıdır. Düğme olsaydı diller
 * birbirine bağlanmamış dört ada gibi görünürdü.
 *
 * DİLLER KENDİ ADIYLA. Listede "İngilizce" değil "English", "Arapça"
 * değil "العربية" yazar. Bir kullanıcı bilmediği dilin adını kendi
 * dilinde okuyamaz; kendi dilini ise her zaman tanır.
 *
 * Arapça seçeneği kendi yönünde çizilir (`dir="rtl"`), yoksa noktalama
 * ve harf sırası listede yanlış görünür.
 */
export function LanguageSwitcher({ locale, past }: { locale: Locale; past: boolean }) {
  const [open, setOpen] = useState(false);
  const box = useRef<HTMLDivElement>(null);
  const t = ui(locale);

  // Dışarı tıklama ve Escape kapatır — açık kalan bir katman gezinmeyi
  // örter ve klavye kullanıcısı kapana kısılır.
  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (box.current && !box.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={box} className="relative">
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label={t.languageAria}
        onClick={() => setOpen((v) => !v)}
        className={`flex items-center gap-1.5 rounded-full border px-3 py-2 text-[12px] font-semibold uppercase tracking-wide transition-colors duration-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-brand-accent)] ${
          past
            ? "border-black/15 text-[var(--color-surface-dark)] hover:border-[var(--color-brand-accent)]"
            : "border-white/25 text-white hover:border-white/60"
        }`}
      >
        <svg viewBox="0 0 20 20" className="h-3.5 w-3.5" fill="currentColor" aria-hidden="true">
          <path d="M10 1a9 9 0 1 0 0 18 9 9 0 0 0 0-18Zm6.5 8h-3a13.8 13.8 0 0 0-1.2-5.2A7.5 7.5 0 0 1 16.5 9ZM10 2.7c.7 1 1.6 3.1 1.8 6.3H8.2C8.4 5.8 9.3 3.7 10 2.7ZM3.5 9a7.5 7.5 0 0 1 4.2-5.2A13.8 13.8 0 0 0 6.5 9h-3Zm0 2h3c.1 2 .5 3.8 1.2 5.2A7.5 7.5 0 0 1 3.5 11Zm6.5 6.3c-.7-1-1.6-3.1-1.8-6.3h3.6c-.2 3.2-1.1 5.3-1.8 6.3Zm2.3-1.1c.7-1.4 1.1-3.2 1.2-5.2h3a7.5 7.5 0 0 1-4.2 5.2Z" />
        </svg>
        {localeMeta[locale].short}
      </button>

      {open ? (
        <div
          role="menu"
          aria-label={t.languageLabel}
          className="absolute end-0 top-[calc(100%+8px)] z-50 min-w-[10rem] overflow-hidden rounded-2xl border border-black/10 bg-[var(--color-surface-light)] shadow-[0_18px_48px_rgba(10,25,29,0.28)]"
        >
          {locales.map((l) => {
            const m = localeMeta[l];
            const active = l === locale;
            return (
              <a
                key={l}
                role="menuitem"
                href={localePath(l)}
                lang={m.tag}
                dir={m.dir}
                aria-current={active ? "true" : undefined}
                className={`flex items-center justify-between gap-4 border-b border-black/5 px-4 py-3 text-[14px] last:border-b-0 transition-colors ${
                  active
                    ? "bg-[var(--color-brand-accent)]/10 font-bold text-[var(--color-surface-dark)]"
                    : "text-[var(--color-surface-dark)]/75 hover:bg-black/[0.04]"
                }`}
              >
                <span>{m.native}</span>
                <span className="scrub-mono text-[10px] uppercase tracking-[0.18em] opacity-55">
                  {m.short}
                </span>
              </a>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
