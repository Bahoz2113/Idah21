import { channels, contact } from "@/lib/seo/site";

/**
 * TEK TUŞLA İLETİŞİM — hero'nun altındaki eylem şeridi.
 *
 * Ziyaretçinin sayfanın sonunu beklemeden bize ulaşabilmesi için ilk
 * ekranda durur. Görüntüyü kapatmaması gerektiğinden kutu değil şerit:
 * yalnızca ikon + etiket, cam yüzey, arkasındaki dünya görünür kalır.
 *
 * Telefon ilk sırada ve dolgulu — velilerin ezici çoğunluğu arıyor.
 * Diğerleri aynı ağırlıkta: WhatsApp, Instagram, Google Maps, e-posta.
 *
 * Sunucuda render edilir: `tel:`, `https:` ve `mailto:` bağlantıları JS
 * gerektirmez, tarayıcı botu da hepsini görür.
 */

type Item = {
  href: string;
  label: string;
  hint: string;
  accent: string;
  icon: JSX.Element;
  primary?: boolean;
  external?: boolean;
};

const items: Item[] = [
  {
    href: `tel:${contact.phoneE164}`,
    label: "Hemen Ara",
    hint: contact.phoneDisplay,
    accent: "#FF8C00",
    primary: true,
    icon: (
      <path d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.2.4 2.4.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.4 0 .8-.2 1l-2.3 2.2z" />
    ),
  },
  {
    href: channels.whatsapp.url,
    label: "WhatsApp",
    hint: "Yazın",
    accent: "#25D366",
    external: true,
    icon: (
      <path d="M12 2a10 10 0 0 0-8.6 15l-1.3 4.7 4.8-1.3A10 10 0 1 0 12 2zm0 18.2c-1.6 0-3.2-.4-4.6-1.3l-.3-.2-2.9.8.8-2.8-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.4-.7-1.7-.8-.2-.1-.4-.1-.5.1l-.7.9c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.1-.2 0-.4.1-.5l.4-.5c.1-.2.1-.3 0-.5l-.7-1.7c-.2-.4-.4-.4-.5-.4h-.5c-.2 0-.5.1-.7.3-.9.9-.9 2.2-.1 3.5a10 10 0 0 0 4 4c1.4.6 2.6.7 3.4.3.5-.2 1-.7 1.2-1.2.1-.4.1-.7 0-.8l-.4-.2z" />
    ),
  },
  {
    href: channels.instagram.url,
    label: "Instagram",
    hint: channels.instagram.handle,
    accent: "#E1306C",
    external: true,
    icon: (
      <path d="M12 2.2c3.2 0 3.6 0 4.8.1 1.2.1 1.8.2 2.2.4.6.2 1 .5 1.4.9.4.4.7.8.9 1.4.2.4.4 1 .4 2.2.1 1.2.1 1.6.1 4.8s0 3.6-.1 4.8c-.1 1.2-.2 1.8-.4 2.2-.2.6-.5 1-.9 1.4-.4.4-.8.7-1.4.9-.4.2-1 .4-2.2.4-1.2.1-1.6.1-4.8.1s-3.6 0-4.8-.1c-1.2-.1-1.8-.2-2.2-.4a3.9 3.9 0 0 1-1.4-.9 3.9 3.9 0 0 1-.9-1.4c-.2-.4-.4-1-.4-2.2C2.2 15.6 2.2 15.2 2.2 12s0-3.6.1-4.8c.1-1.2.2-1.8.4-2.2.2-.6.5-1 .9-1.4.4-.4.8-.7 1.4-.9.4-.2 1-.4 2.2-.4 1.2-.1 1.6-.1 4.8-.1zm0 3.3a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13zm0 10.7a4.2 4.2 0 1 1 0-8.4 4.2 4.2 0 0 1 0 8.4zm6.8-11a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z" />
    ),
  },
  {
    href: contact.directionsUrl,
    label: "Yol Tarifi",
    hint: "Google Maps",
    accent: "#4285F4",
    external: true,
    icon: (
      <path d="M12 2a7 7 0 0 0-7 7c0 5.2 7 13 7 13s7-7.8 7-13a7 7 0 0 0-7-7zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5z" />
    ),
  },
  {
    href: `mailto:${contact.email}`,
    label: "E-posta",
    hint: contact.email,
    accent: "#EA4335",
    icon: (
      <path d="M3 5h18c.6 0 1 .4 1 1v12c0 .6-.4 1-1 1H3c-.6 0-1-.4-1-1V6c0-.6.4-1 1-1zm9 7.2L4.4 7H4v.6l8 5.6 8-5.6V7h-.4L12 12.2z" />
    ),
  },
];

export function QuickContact() {
  return (
    <nav
      aria-label="Hızlı iletişim"
      className="mt-10 flex flex-wrap items-center gap-2.5 sm:gap-3"
    >
      {items.map((it) => (
        <a
          key={it.label}
          href={it.href}
          {...(it.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
          style={{ "--czr-accent": it.accent } as React.CSSProperties}
          className={
            it.primary
              ? "group inline-flex items-center gap-2.5 rounded-full bg-czr-launch px-5 py-3 text-[13px] font-bold uppercase tracking-wide text-czr-base shadow-[0_0_28px_rgba(255,140,0,0.26)] transition duration-300 ease-czr-cine hover:-translate-y-0.5 hover:shadow-[0_0_44px_rgba(255,140,0,0.42)]"
              : "czr-glass-panel group inline-flex items-center gap-2.5 rounded-full px-4 py-3 text-[13px] font-semibold text-czr-ice transition duration-300 ease-czr-cine hover:-translate-y-0.5 hover:border-[var(--czr-accent)]"
          }
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="currentColor"
            className={`h-[18px] w-[18px] shrink-0 transition-colors duration-300 ${
              it.primary ? "" : "text-czr-ice/70 group-hover:text-[var(--czr-accent)]"
            }`}
          >
            {it.icon}
          </svg>
          <span>{it.label}</span>
          <span className="sr-only"> — {it.hint}</span>
        </a>
      ))}
    </nav>
  );
}
