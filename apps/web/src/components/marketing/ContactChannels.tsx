import type { ReactNode } from "react";
import type { Locale } from "@/lib/i18n/config";
import { ui } from "@/lib/i18n/ui";
import { localizedChannels } from "@/lib/i18n/view";
import { contact } from "@/lib/seo/site";
import { Reveal } from "./Reveal";

/**
 * İletişim kanalları — WhatsApp, Instagram, Google Maps.
 *
 * Üç kanal da tek dokunuşla dış uygulamaya devreder. Hepsi düz `<a>`
 * bağlantısıdır: JavaScript gerekmez, arama motorları ve AI tarayıcıları
 * bağlantıları izleyebilir, kullanıcı sekmede açmayı kendi seçebilir.
 *
 * MARKALAR KENDİ RESMÎ BİÇİMLERİNDE. Önceki çizimler yaklaşıktı: WhatsApp
 * koyu zemin üstünde yeşil bir çizgi, Instagram gradyan konturlu bir
 * çerçeve, Google Maps ise iğneye benzeyen serbest bir şekildi. Hiçbiri
 * markanın kendi kilit görselini (lockup) taşımıyordu. Artık her biri
 * uygulama simgesinin kendisi: kendi zemin rengi, kendi köşe yarıçapı,
 * kendi glifi. Tanınırlık burada işlevseldir — veli kartı okumadan önce
 * hangi uygulamaya gideceğini simgeden anlar.
 *
 * SVG İNLINE. Dış istek yok; CSP `img-src` gevşetilmiyor, hiçbir marka
 * CDN'i ziyaretçiyi izleyemiyor ve simgeler çevrimdışı da çiziliyor.
 * Marka renkleri sabittir, hover'da değişmez — logo rengiyle oynamak
 * marka kullanım kurallarına aykırıdır.
 */

/** WhatsApp — yeşil zemin (#25D366), beyaz glif. */
function WhatsAppMark() {
  return (
    <svg viewBox="0 0 48 48" className="h-full w-full" aria-hidden="true">
      <rect width="48" height="48" rx="11" fill="#25D366" />
      <path
        fill="#fff"
        transform="translate(12 12)"
        d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.149-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"
      />
    </svg>
  );
}

/**
 * Instagram — resmî radyal gradyan, beyaz kamera glifi.
 *
 * Gradyanın merkezi sol ALT köşenin dışındadır (cx .3 / cy 1.07); marka
 * kılavuzundaki sıcak sarıdan mora geçiş ancak oradan başlarsa doğru
 * çıkar. Merkez kareye alınsaydı renkler simetrik dağılır ve logo
 * tanınmaz hâle gelirdi.
 */
function InstagramMark() {
  return (
    <svg viewBox="0 0 48 48" className="h-full w-full" aria-hidden="true">
      <defs>
        <radialGradient id="czr-ig" cx=".3" cy="1.07" r="1.15">
          <stop offset="0" stopColor="#FDF497" />
          <stop offset=".05" stopColor="#FDF497" />
          <stop offset=".45" stopColor="#FD5949" />
          <stop offset=".6" stopColor="#D6249F" />
          <stop offset=".9" stopColor="#285AEB" />
        </radialGradient>
      </defs>
      <rect width="48" height="48" rx="11" fill="url(#czr-ig)" />
      <rect
        x="12.2"
        y="12.2"
        width="23.6"
        height="23.6"
        rx="7.2"
        fill="none"
        stroke="#fff"
        strokeWidth="2.7"
      />
      <circle cx="24" cy="24" r="6.1" fill="none" stroke="#fff" strokeWidth="2.7" />
      <circle cx="31.6" cy="16.4" r="1.75" fill="#fff" />
    </svg>
  );
}

/**
 * Google Maps — uygulama simgesinin dört renkli düzeni.
 *
 * Kompozisyon markanın kendi kurgusudur: sol altta yeşil kara parçası,
 * sağ üstte mavi su, ikisini kesen sarı yol ve merkezde kırmızı konum
 * iğnesi. Yalnızca kırmızı iğne çizilseydi bu "bir harita işareti"
 * olurdu; Google Maps simgesi olmazdı.
 *
 * `clipPath` gerekli: renk alanları kare sınırını taşacak biçimde
 * çiziliyor ve yuvarlatılmış köşeye onunla kırpılıyor. Her parçayı
 * köşeye göre ayrı ayrı kesmek yerine tek kırpma yolu kullanmak hem
 * kısa hem de köşe yarıçapı değişince tek yerden ayarlanır.
 */
function MapsMark() {
  return (
    <svg viewBox="0 0 48 48" className="h-full w-full" aria-hidden="true">
      <defs>
        <clipPath id="czr-gm">
          <rect width="48" height="48" rx="11" />
        </clipPath>
      </defs>
      <g clipPath="url(#czr-gm)">
        <rect width="48" height="48" fill="#F3F1EC" />
        <path d="M0 25.5 L22.5 48 L0 48 Z" fill="#34A853" />
        <path d="M31 0 L48 0 L48 17 Z" fill="#4285F4" />
        <path d="M0 5.5 L42.5 48 L48 48 L48 42.5 L5.5 0 L0 0 Z" fill="#FBBC04" />
        <path
          d="M24 10.2a8.6 8.6 0 0 0-8.6 8.6c0 6.45 8.6 16 8.6 16s8.6-9.55 8.6-16a8.6 8.6 0 0 0-8.6-8.6z"
          fill="#EA4335"
        />
        <circle cx="24" cy="18.8" r="3.15" fill="#fff" />
      </g>
    </svg>
  );
}

/** Gmail — beyaz zemin, dört renkli zarf. Kurumun adresi bir Gmail adresi. */
function GmailMark({ className = "h-full w-full" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <rect width="48" height="48" rx="11" fill="#fff" />
      <path fill="#4caf50" d="M45,16.2l-5,2.75l-5,4.75L35,40h7c1.657,0,3-1.343,3-3V16.2z" />
      <path fill="#1e88e5" d="M3,16.2l3.614,1.71L13,23.7V40H6c-1.657,0-3-1.343-3-3V16.2z" />
      <polygon fill="#e53935" points="35,11.2 24,19.45 13,11.2 12,17 13,23.7 24,31.95 35,23.7 36,17" />
      <path
        fill="#c62828"
        d="M3,12.298V16.2l10,7.5V11.2L9.876,8.859C9.132,8.301,8.228,8,7.298,8h0C4.924,8,3,9.924,3,12.298z"
      />
      <path
        fill="#fbc02d"
        d="M45,12.298V16.2l-10,7.5V11.2l3.124-2.341C38.868,8.301,39.772,8,40.702,8h0C43.076,8,45,9.924,45,12.298z"
      />
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
  newTab: string;
};

function ChannelCard({ href, mark, label, value, hint, accent, delay, newTab }: ChannelCardProps) {
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
        {/* Marka karosu kendi zeminini taşır; altına ayrıca bir kutu
            koymuyoruz. Önceki düzende koyu bir kap içinde duruyorlardı ve
            logo kendi rengini kaybediyordu. Hover'da yalnızca ölçek ve
            markanın kendi renginde bir hâle değişir — logonun renkleri
            sabit kalır. */}
        <span className="relative h-12 w-12 shrink-0 overflow-hidden rounded-[13px] shadow-[0_2px_10px_rgba(0,0,0,0.35)] transition duration-500 ease-czr-cine group-hover:scale-[1.06] group-hover:shadow-[0_0_22px_var(--czr-accent)] sm:h-14 sm:w-14 sm:rounded-[15px]">
          {mark}
        </span>

        <span className="min-w-0 flex-1">
          <span className="flex min-w-0 flex-wrap items-baseline gap-x-2 gap-y-0.5">
            <span className="text-[15px] font-bold text-white">{label}</span>
            {/* Telefon numarası, @kullanıcı adı ve adres gibi latin/rakam
                değerler sağdan sola akışta ters sıralanır; kendi yönlerini
                korumaları gerekir. */}
            <span dir="ltr" className="min-w-0 truncate czr-mono text-[11px] text-czr-ice/60">
              {value}
            </span>
          </span>
          <span className="mt-1 block text-[13px] leading-relaxed text-czr-ice/70">{hint}</span>
        </span>

        <span
          aria-hidden="true"
          className="shrink-0 rounded-full border border-white/15 p-2 text-czr-ice/70 transition duration-500 ease-czr-cine group-hover:border-[var(--czr-accent)] group-hover:text-[var(--czr-accent)]"
        >
          <svg viewBox="0 0 20 20" className="h-3.5 w-3.5" fill="currentColor">
            <path d="M6 4h10v10h-2V7.4L5.7 15.7 4.3 14.3 12.6 6H6z" />
          </svg>
        </span>

        <span className="sr-only">{newTab}</span>
      </a>
    </Reveal>
  );
}

export function ContactChannels({ locale }: { locale: Locale }) {
  const t = ui(locale);
  const channels = localizedChannels(locale);

  return (
    <div className="space-y-4">
      <ChannelCard
        href={channels.whatsapp.url}
        mark={<WhatsAppMark />}
        label={channels.whatsapp.label}
        value={channels.whatsapp.value}
        hint={channels.whatsapp.hint}
        accent="#25D366"
        delay={0}
        newTab={t.newTab}
      />
      <ChannelCard
        href={channels.instagram.url}
        mark={<InstagramMark />}
        label={channels.instagram.label}
        value={channels.instagram.value}
        hint={channels.instagram.hint}
        accent="#E1306C"
        delay={90}
        newTab={t.newTab}
      />
      <ChannelCard
        href={channels.maps.url}
        mark={<MapsMark />}
        label={channels.maps.label}
        value={channels.maps.value}
        hint={channels.maps.hint}
        accent="#EA4335"
        delay={180}
        newTab={t.newTab}
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
            {t.ctaPrimaryShort}
          </a>

          <a
            href={`mailto:${contact.email}`}
            className="flex items-center justify-center gap-2.5 rounded-2xl border border-white/20 px-6 py-4 text-sm font-semibold uppercase tracking-wide text-white transition duration-300 ease-czr-cine hover:border-czr-orange/50 hover:bg-white/5"
          >
            {/* Kurumun adresi bir Gmail adresi; jenerik zarf simgesi
                yerine markanın kendisi duruyor. */}
            <GmailMark className="h-[18px] w-[18px] rounded-[5px]" />
            {t.contactEmailCta}
          </a>
        </div>
      </Reveal>
    </div>
  );
}
