import { contact } from "@/lib/seo/site";

/**
 * Üs konumu — taktik harita.
 *
 * Üçüncü taraf harita iframe'i BİLİNÇLİ OLARAK kullanılmadı:
 *   • Gömülü harita, CSP'ye `frame-src` izni eklenmesini gerektirirdi;
 *     mevcut güvenlik başlıkları gevşetilmemiş olarak korunuyor.
 *   • Harita sağlayıcısı, sayfayı açan her ziyaretçiyi (çocuk ve veliler
 *     dahil) çerezleyebilirdi.
 *   • Gömülü harita ~800 KB ve onlarca istek getirir; bu SVG sıfır istek.
 *
 * Yol tarifi isteyen kullanıcı, tıkladığında kendi harita uygulamasına
 * yönlendirilir — bu noktada seçim bilinçli olarak kullanıcınındır.
 */
export function BaseMap() {
  return (
    // Haritanın TAMAMI bağlantıdır. Önceki tasarımda alt-ortada ayrı bir
    // "Yol Tarifi Al" butonu vardı; buton yüksekliği sabit, harita ise
    // en-boy oranıyla küçüldüğü için dar ekranda koordinat etiketinin
    // üstüne biniyordu. Tüm yüzeyi tıklanabilir yapmak hem çakışmayı
    // kaldırır hem dokunma hedefini büyütür.
    <a
      href={contact.directionsUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative block overflow-hidden rounded-3xl border border-white/10 bg-czr-base-alt transition duration-500 ease-czr-cine hover:border-czr-orange/40"
    >
      <svg
        viewBox="0 0 640 420"
        className="h-full w-full"
        role="img"
        aria-label={`${contact.address.city} şehir merkezindeki CEZERİ ROBOTECH üssünün konumunu gösteren şematik harita`}
      >
        <defs>
          <pattern id="czr-map-grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M40 0H0V40" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
          </pattern>
          <radialGradient id="czr-map-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FF8C00" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#FF8C00" stopOpacity="0" />
          </radialGradient>
        </defs>

        <rect width="640" height="420" fill="#0D1F23" />
        <rect width="640" height="420" fill="url(#czr-map-grid)" />

        {/* Şematik yol ağı — Batman şehir dokusunu temsil eden soyut ızgara */}
        <g stroke="#1B6E7E" strokeWidth="2.5" opacity="0.5" fill="none">
          <path d="M0 250 L180 232 L340 246 L520 214 L640 226" />
          <path d="M0 130 L200 148 L420 120 L640 142" />
          <path d="M236 0 L252 160 L238 300 L258 420" />
          <path d="M448 0 L432 140 L452 290 L436 420" />
        </g>
        <g stroke="#0F4C5C" strokeWidth="1.2" opacity="0.65" fill="none">
          <path d="M0 330 L640 316" />
          <path d="M0 60 L640 74" />
          <path d="M120 0 L134 420" />
          <path d="M560 0 L548 420" />
        </g>

        {/* Konum işareti — etiketlere ve alttaki butona yer bırakmak için
            görsel merkezin biraz üstüne alındı. */}
        <circle cx="320" cy="188" r="92" fill="url(#czr-map-glow)" />
        <circle cx="320" cy="188" r="46" fill="none" stroke="#FF8C00" strokeWidth="1" opacity="0.35" strokeDasharray="3 7" />
        <circle cx="320" cy="188" r="26" fill="none" stroke="#FF8C00" strokeWidth="1.5" opacity="0.65" />
        <circle cx="320" cy="188" r="7" fill="#FF8C00" />

        {/* Nişangah çizgileri — kontrol merkezi hissi */}
        <g stroke="#FF8C00" strokeWidth="1" opacity="0.4">
          <line x1="320" y1="122" x2="320" y2="148" />
          <line x1="320" y1="228" x2="320" y2="254" />
          <line x1="254" y1="188" x2="280" y2="188" />
          <line x1="360" y1="188" x2="386" y2="188" />
        </g>

        {/* Koordinat etiketi */}
        <text x="320" y="286" textAnchor="middle" fill="#CFE3E6" fontSize="13" fontFamily="ui-monospace, monospace" letterSpacing="2">
          {contact.geo.lat.toFixed(5)}°K · {contact.geo.lng.toFixed(5)}°D
        </text>
        <text x="320" y="306" textAnchor="middle" fill="#7FA8B0" fontSize="11" fontFamily="ui-monospace, monospace" letterSpacing="3">
          CEZERİ ROBOTECH — {contact.address.city.toUpperCase()} ÜSSÜ
        </text>
      </svg>

      {/* Eylem ipucu — üst köşede, alttaki koordinat etiketlerinden uzakta */}
      <span className="absolute right-4 top-4 inline-flex items-center gap-2 rounded-full border border-czr-orange/40 bg-czr-base/85 px-4 py-2 text-[12px] font-semibold text-czr-orange backdrop-blur transition duration-300 ease-czr-cine group-hover:bg-czr-orange group-hover:text-czr-base">
        Yol Tarifi Al
        <svg viewBox="0 0 20 20" className="h-3 w-3" fill="currentColor" aria-hidden="true">
          <path d="M6 4h10v10h-2V7.4L5.7 15.7 4.3 14.3 12.6 6H6z" />
        </svg>
      </span>

      <span className="sr-only">
        Yol tarifi al — yeni sekmede harita uygulamasında açılır
      </span>
    </a>
  );
}
