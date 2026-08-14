import type { ReactNode } from "react";
import { channels, contact } from "@/lib/seo/site";
import { Reveal } from "./Reveal";

/**
 * İletişim kanalları — Instagram, WhatsApp, Google Maps.
 *
 * Üç kanal da tek dokunuşla dış uygulamaya devreder. Hepsi düz `<a>`
 * bağlantısıdır: JavaScript gerekmez, arama motorları ve AI tarayıcıları
 * bağlantıları izleyebilir, kullanıcı sekmede açmayı kendi seçebilir.
 *
 * Logolar inline SVG'dir — dış istek yok, CSP korunur, marka renkleri
 * hover'da canlanır.
 */

function InstagramMark() {
  return (
    <svg viewBox="0 0 24 24" className="h-7 w-7" aria-hidden="true" fill="none">
      <defs>
        <linearGradient id="czr-ig" x1="0" y1="24" x2="24" y2="0">
          <stop offset="0%" stopColor="#FFDC80" />
          <stop offset="30%" stopColor="#F77737" />
          <stop offset="60%" stopColor="#E1306C" />
          <stop offset="100%" stopColor="#833AB4" />
        </linearGradient>
      </defs>
      <rect x="2.2" y="2.2" width="19.6" height="19.6" rx="5.6" stroke="url(#czr-ig)" strokeWidth="2" />
      <circle cx="12" cy="12" r="4.6" stroke="url(#czr-ig)" strokeWidth="2" />
      <circle cx="17.6" cy="6.4" r="1.35" fill="url(#czr-ig)" />
    </svg>
  );
}

function WhatsAppMark() {
  return (
    <svg viewBox="0 0 24 24" className="h-7 w-7" aria-hidden="true" fill="#25D366">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.149-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
    </svg>
  );
}

function MapsMark() {
  return (
    <svg viewBox="0 0 24 24" className="h-7 w-7" aria-hidden="true">
      {/* Konum iğnesi — Google harita işaretinin dört marka rengiyle */}
      <path d="M12 1.6c-3.9 0-7.1 3.2-7.1 7.1 0 5.3 7.1 13.7 7.1 13.7s7.1-8.4 7.1-13.7c0-3.9-3.2-7.1-7.1-7.1Z" fill="#EA4335" />
      <path d="M6.2 4.1a7.1 7.1 0 0 0-1.3 4.6c0 1.7.75 3.7 1.78 5.6l6.2-7.4-6.68-2.8Z" fill="#34A853" />
      <path d="M12 1.6c-2.3 0-4.35 1.1-5.64 2.8l6.5 3.2 4.05-2.0A7.09 7.09 0 0 0 12 1.6Z" fill="#4285F4" />
      <path d="M16.91 5.6 12 7.6l4.28 5.1c1.6-2.5 2.82-4.6 2.82-6.0 0-.4-.03-.75-.1-1.1H16.9Z" fill="#FBBC04" />
      <circle cx="12" cy="8.7" r="2.5" fill="#FFFFFF" />
    </svg>
  );
}

type ChannelCardProps = {
  href: string;
  mark: ReactNode;
  label: string;
  value: string;
  hint: string;
  /** Hover'da kartın çerçevesini alan marka rengi. */
  accent: string;
  delay: number;
};

function ChannelCard({ href, mark, label, value, hint, accent, delay }: ChannelCardProps) {
  return (
    <Reveal delay={delay}>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        // `min-w-0`: kartın min-content genişliği, kapsayıcı grid track'ini
        // dar ekranda büyütüp tüm sütunu taşırıyordu. Zincirdeki her flex
        // seviyesinde min-w-0 verilmezse metin kutusu küçülemez.
        className="czr-glass-panel group flex min-w-0 items-center gap-4 rounded-2xl p-4 transition duration-500 ease-czr-cine hover:-translate-y-0.5 sm:gap-5 sm:p-6"
        style={{ ["--czr-accent" as string]: accent }}
      >
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-czr-base/70 transition duration-500 ease-czr-cine group-hover:scale-105 group-hover:border-[var(--czr-accent)] sm:h-14 sm:w-14">
          {mark}
        </span>

        <span className="min-w-0 flex-1">
          <span className="flex min-w-0 flex-wrap items-baseline gap-x-2 gap-y-0.5">
            <span className="text-[15px] font-bold text-white">{label}</span>
            {/* Telefon numarası, @kullanıcı adı ve adres gibi latin/rakam
                değerler sağdan sola akışta ters sıralanır; kendi yönlerini
                korumaları gerekir. */}
            <span dir="ltr" className="min-w-0 truncate czr-mono text-[11px] text-czr-ice/45">
              {value}
            </span>
          </span>
          <span className="mt-1 block text-[13px] leading-relaxed text-czr-ice/55">{hint}</span>
        </span>

        <span
          aria-hidden="true"
          className="shrink-0 rounded-full border border-white/12 p-2 text-czr-ice/55 transition duration-500 ease-czr-cine group-hover:border-[var(--czr-accent)] group-hover:text-[var(--czr-accent)]"
        >
          <svg viewBox="0 0 20 20" className="h-3.5 w-3.5" fill="currentColor">
            <path d="M6 4h10v10h-2V7.4L5.7 15.7 4.3 14.3 12.6 6H6z" />
          </svg>
        </span>

        <span className="sr-only">(yeni sekmede açılır)</span>
      </a>
    </Reveal>
  );
}

export function ContactChannels() {
  return (
    <div className="space-y-4">
      <ChannelCard
        href={channels.whatsapp.url}
        mark={<WhatsAppMark />}
        label={channels.whatsapp.label}
        value={contact.phoneDisplay}
        hint={channels.whatsapp.hint}
        accent="#25D366"
        delay={0}
      />
      <ChannelCard
        href={channels.instagram.url}
        mark={<InstagramMark />}
        label={channels.instagram.label}
        value={channels.instagram.handle}
        hint={channels.instagram.hint}
        accent="#E1306C"
        delay={90}
      />
      <ChannelCard
        href={channels.maps.url}
        mark={<MapsMark />}
        label={channels.maps.label}
        value={contact.address.city}
        hint={channels.maps.hint}
        accent="#EA4335"
        delay={180}
      />

      {/* Doğrudan arama ve e-posta — sosyal kanal kullanmayan veliler için */}
      <Reveal delay={270}>
        <div className="grid gap-4 sm:grid-cols-2">
          <a
            href={`tel:${contact.phoneE164}`}
            className="flex items-center justify-center gap-2.5 rounded-2xl bg-czr-launch px-6 py-4 text-sm font-bold uppercase tracking-wide text-czr-base transition duration-300 ease-czr-cine hover:-translate-y-0.5 hover:shadow-[0_0_44px_rgba(255,140,0,0.42)]"
          >
            <svg viewBox="0 0 20 20" className="h-4 w-4" fill="currentColor" aria-hidden="true">
              <path d="M5.2 2.5c.5 0 .9.3 1.1.8l1 2.4c.2.5.1 1-.3 1.3l-1 .8a10 10 0 0 0 4.2 4.2l.8-1c.3-.4.8-.5 1.3-.3l2.4 1c.5.2.8.6.8 1.1v2.4c0 .7-.6 1.3-1.3 1.3A13.5 13.5 0 0 1 1.5 3.8c0-.7.6-1.3 1.3-1.3z" />
            </svg>
            Hemen Ara
          </a>

          <a
            href={`mailto:${contact.email}`}
            className="flex items-center justify-center gap-2.5 rounded-2xl border border-white/14 px-6 py-4 text-sm font-semibold uppercase tracking-wide text-czr-ice transition duration-300 ease-czr-cine hover:border-czr-orange/50 hover:bg-white/5"
          >
            <svg viewBox="0 0 20 20" className="h-4 w-4" fill="currentColor" aria-hidden="true">
              <path d="M2.5 4.5h15c.6 0 1 .4 1 1v9c0 .6-.4 1-1 1h-15c-.6 0-1-.4-1-1v-9c0-.6.4-1 1-1zm7.5 6L3.6 6.2v.6L10 11l6.4-4.2v-.6z" />
            </svg>
            E-posta Gönder
          </a>
        </div>
      </Reveal>
    </div>
  );
}
