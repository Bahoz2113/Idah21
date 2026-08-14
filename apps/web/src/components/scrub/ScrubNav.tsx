"use client";

import Image from "next/image";
import { type MouseEvent, useEffect, useRef, useState } from "react";
import { contact, org, sections } from "@/lib/seo/site";
import { scrollToSection } from "./SmoothScroll";

/**
 * GEZİNME ÇUBUĞU — hero üzerinde şeffaf, hero geçilince açık yüzey.
 *
 * Durum değişimi `IntersectionObserver` ile yapılır, ikinci bir
 * ScrollTrigger ile DEĞİL. Hero zaten bir ScrollTrigger'a bağlı; aynı
 * öğeye ikinci bir tetikleyici asmak `refresh()` sırasında ölçüm sırasını
 * belirsizleştirir ve iki tetikleyici birbirinin hesabını bozabilir.
 * Burada gereken bilgi tek bir eşik: hero hâlâ ekranda mı?
 *
 * Gözlemci hero'nun ALTINI izler (`rootMargin` üstten -100%): hero'nun alt
 * kenarı ekranın üstünü geçtiği an çubuk açık yüzeye döner.
 */
export function ScrubNav() {
  const [past, setPast] = useState(false);
  const [open, setOpen] = useState(false);
  const panel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const hero = document.getElementById("esik");
    if (!hero) return;

    const io = new IntersectionObserver(
      ([entry]) => setPast(!entry.isIntersecting),
      { rootMargin: "-72px 0px 0px 0px", threshold: 0 },
    );

    io.observe(hero);
    return () => io.disconnect();
  }, []);

  // Menü açıkken Escape kapatır; klavye kullanıcısı kapana kısılmaz.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  /**
   * Gezinme öğeleri `<a href="#id">` — `<button>` DEĞİL.
   *
   * Belgedeki bir konuma götüren denetim, tanımı gereği bağlantıdır.
   * Düğme olarak yazıldığında dört şey birden kayboluyordu: arama
   * motorları sayfanın kendi içindekiler listesini hiç görmüyor, kullanıcı
   * bir bölümün adresini kopyalayıp paylaşamıyor, yeni sekmede açamıyor ve
   * tarayıcı geçmişi ilerlemiyordu.
   *
   * `preventDefault` yalnızca JavaScript çalışırken devreye girer; Lenis
   * yumuşak kaydırmayı üstlenir. Script yüklenmediyse tarayıcının kendi
   * çapa davranışı çalışır ve bağlantı yine hedefe gider.
   */
  const go = (e: MouseEvent<HTMLAnchorElement>, id: string) => {
    // Yeni sekmede açma niyetini bozma: Ctrl/Cmd/Shift veya orta tık.
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
    e.preventDefault();
    setOpen(false);
    scrollToSection(id);

    // Adres çubuğu bölümü göstersin. `preventDefault` tarayıcının çapayı
    // yazmasını da engelliyor; onsuz bağlantı kopyalanamaz ve geri tuşu
    // bir önceki bölüme dönmez — yani düğmeden bağlantıya geçmenin
    // kazandırdığı şey yarım kalırdı. `blob:` belgede history yazımı
    // SecurityError atar (gezilebilir kopya), o yüzden sessizce yutulur.
    try {
      history.pushState(null, "", `#${id}`);
    } catch {
      /* yoksay */
    }
  };

  return (
    <header
      // Arka plan sınıfla değil stille veriliyor: Tailwind'in opaklık
      // eki (`/92`) rastgele bir CSS değişkenine uygulanamaz — rengin
      // biçimini bilmediği için alfa enjekte edemez ve kural sessizce
      // düşer. İlk sürümde çubuk bu yüzden hep şeffaf kalıyordu.
      style={{
        backgroundColor: past ? "rgba(242, 248, 248, 0.92)" : "transparent",
        borderBottomColor: past ? "rgba(10, 25, 29, 0.08)" : "transparent",
      }}
      className={`fixed inset-x-0 top-0 z-50 border-b transition-colors duration-500 ${
        past ? "backdrop-blur-xl" : ""
      }`}
    >
      <nav
        aria-label="Ana gezinme"
        className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-6 lg:px-10"
      >
        <a
          href="#esik"
          onClick={(e) => go(e, "esik")}
          aria-label={`${org.name} — sayfanın başına dön`}
          className="flex items-center gap-3 rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-brand-accent)]"
        >
          <Image
            src="/logo.png"
            alt={`${org.name} logosu`}
            width={36}
            height={36}
            priority
            className="h-9 w-9 object-contain"
          />
          <span
            className={`scrub-display text-[15px] font-bold tracking-tight transition-colors duration-500 ${
              past ? "text-[var(--color-surface-dark)]" : "text-white"
            }`}
          >
            {org.name}
          </span>
        </a>

        <ul className="hidden items-center gap-7 lg:flex">
          {sections.map((s) => (
            <li key={s.id}>
              <a
                href={`#${s.id}`}
                onClick={(e) => go(e, s.id)}
                className={`text-[13px] font-medium transition-colors duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-brand-accent)] ${
                  past
                    ? "text-[var(--color-surface-dark)]/70 hover:text-[var(--color-brand-primary)]"
                    : "text-white/75 hover:text-white"
                }`}
              >
                {s.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3">
          <a
            href={`tel:${contact.phoneE164}`}
            className="hidden rounded-full bg-[var(--color-brand-accent)] px-5 py-2.5 text-[13px] font-bold text-[var(--color-surface-dark)] transition hover:brightness-110 sm:inline-block"
          >
            {contact.phoneDisplay}
          </a>

          <button
            type="button"
            aria-expanded={open}
            aria-controls="czr-mobil-menu"
            aria-label={open ? "Menüyü kapat" : "Menüyü aç"}
            onClick={() => setOpen((v) => !v)}
            className={`grid h-10 w-10 place-items-center rounded-full border transition-colors duration-500 lg:hidden ${
              past
                ? "border-black/15 text-[var(--color-surface-dark)]"
                : "border-white/25 text-white"
            }`}
          >
            <svg viewBox="0 0 20 20" className="h-4 w-4" fill="currentColor" aria-hidden="true">
              {open ? (
                <path d="M4.5 5.9 5.9 4.5 10 8.6l4.1-4.1 1.4 1.4L11.4 10l4.1 4.1-1.4 1.4L10 11.4l-4.1 4.1-1.4-1.4L8.6 10z" />
              ) : (
                <path d="M3 5h14v1.6H3zm0 4.2h14v1.6H3zm0 4.2h14V15H3z" />
              )}
            </svg>
          </button>
        </div>
      </nav>

      {open ? (
        <div
          id="czr-mobil-menu"
          ref={panel}
          className="border-t border-black/8 bg-[var(--color-surface-light)] lg:hidden"
        >
          <ul className="mx-auto max-w-7xl px-6 py-3">
            {sections.map((s) => (
              <li key={s.id} className="border-b border-black/6 last:border-b-0">
                <a
                  href={`#${s.id}`}
                  onClick={(e) => go(e, s.id)}
                  className="block w-full py-3.5 text-left text-[15px] font-medium text-[var(--color-surface-dark)]"
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
