import type { ThemeId } from "@/lib/curriculum";
import { MediaSlot } from "@/components/ui/MediaSlot";

/**
 * TEMA ANİMASYONLARI
 *
 * İki tür: fiziksel temalar video, soyut temalar SVG.
 * AI video "for döngüsü" üretemez; diyagram bu konularda videodan iyidir.
 *
 * SVG'ler saf CSS ile animasyonlu — JS yok, sunucudan render ediliyor,
 * her biri birkaç KB. İçerik katmanının hız bütçesini bozmuyorlar (AC9).
 *
 * `prefers-reduced-motion` altında animasyonlar durur; diyagramın DURAĞAN
 * hâli de anlamını koruyacak şekilde tasarlandı (AC4).
 */

const V = "0 0 200 120";
const S = {
  line: "stroke-[var(--color-ash)]",
  hot: "stroke-[var(--color-ignition)]",
} as const;

function Frame({ children, title }: { children: React.ReactNode; title: string }) {
  return (
    <svg
      viewBox={V}
      role="img"
      aria-label={title}
      className="h-auto w-full max-w-[280px]"
      fill="none"
      strokeWidth="1.5"
      strokeLinecap="round"
    >
      {children}
    </svg>
  );
}

/** T02 — Direnç, potansiyometre, parlaklık */
function Resistor() {
  return (
    <Frame title="Potansiyometre süpürgesi hareket ettikçe LED parlaklığı değişir">
      <path d="M10 60 H50" className={S.line} />
      <path d="M50 60 l6-12 12 24 12-24 12 24 6-12" className={S.line} />
      <path d="M110 60 H140" className={S.line} />
      <g className="czr-wiper">
        <path d="M80 34 v10" className={S.hot} />
        <path d="M76 30 h8 l-4 6 z" fill="var(--color-ignition)" stroke="none" />
      </g>
      <circle cx="158" cy="60" r="12" className={S.hot} />
      <circle cx="158" cy="60" r="12" fill="var(--color-ignition)" stroke="none" className="czr-glow" />
      <path d="M170 60 H190 V100 H10 V60" className={S.line} />
    </Frame>
  );
}

/** T05 — Ses sensörü & buzzer */
function Sound() {
  return (
    <Frame title="Ses dalgası eşiği aştığında LED tetiklenir">
      <path d="M14 60 h20 l14-14 v28 l-14-14" className={S.line} />
      {[0, 1, 2].map((i) => (
        <path
          key={i}
          d={`M${58 + i * 14} ${48 - i * 6} a ${14 + i * 8} ${14 + i * 8} 0 0 1 0 ${24 + i * 12}`}
          className={`${S.hot} czr-wave`}
          style={{ animationDelay: `${i * 0.25}s` }}
        />
      ))}
      <path d="M120 30 H190" className={S.line} strokeDasharray="3 4" />
      <text x="124" y="26" fontSize="8" fill="var(--color-ash)" stroke="none">
        eşik
      </text>
      <circle cx="170" cy="72" r="11" className={S.hot} />
      <circle cx="170" cy="72" r="11" fill="var(--color-ignition)" stroke="none" className="czr-blink" />
    </Frame>
  );
}

/** T07 — Sıcaklık sensörü */
function Temperature() {
  return (
    <Frame title="Sıcaklık yükselip eşiği geçtiğinde uyarı devreye girer">
      <rect x="46" y="14" width="18" height="72" rx="9" className={S.line} />
      <circle cx="55" cy="94" r="14" className={S.line} />
      <circle cx="55" cy="94" r="10" fill="var(--color-ignition)" stroke="none" />
      <rect
        x="50"
        y="24"
        width="10"
        height="62"
        rx="5"
        fill="var(--color-ignition)"
        stroke="none"
        className="czr-mercury"
      />
      <path d="M78 34 H190" className={S.line} strokeDasharray="3 4" />
      <text x="82" y="30" fontSize="8" fill="var(--color-ash)" stroke="none">
        uyarı eşiği
      </text>
      <path
        d="M150 62 l14 24 h-28 z"
        className={`${S.hot} czr-blink`}
        fill="var(--color-ignition)"
        fillOpacity="0.25"
      />
    </Frame>
  );
}

/** T08 — Ultrasonik mesafe */
function Ultrasonic() {
  return (
    <Frame title="Ses dalgası cisme gidip yansıyarak döner; geçen süreden mesafe hesaplanır">
      <rect x="10" y="42" width="26" height="36" rx="4" className={S.line} />
      <circle cx="17" cy="60" r="5" className={S.line} />
      <circle cx="29" cy="60" r="5" className={S.line} />
      <rect x="164" y="26" width="26" height="68" rx="3" className={S.line} />
      {[0, 1, 2].map((i) => (
        <path
          key={i}
          d="M44 60 h20"
          className={`${S.hot} czr-ping`}
          style={{ animationDelay: `${i * 0.5}s` }}
        />
      ))}
      <path d="M44 92 H160" className={S.line} strokeDasharray="2 5" />
      <path d="M44 88 v8 M160 88 v8" className={S.line} />
      <text x="88" y="108" fontSize="9" fill="var(--color-ignition)" stroke="none">
        mesafe
      </text>
    </Frame>
  );
}

/** T09 — Transistör & anahtarlama */
function Transistor() {
  return (
    <Frame title="Küçük beyz akımı, büyük kollektör akımını açar">
      <path d="M96 34 V86" className={S.line} strokeWidth="3" />
      <path d="M40 60 H96" className={`${S.hot} czr-flow`} strokeDasharray="6 6" />
      <text x="40" y="52" fontSize="8" fill="var(--color-ash)" stroke="none">
        beyz (küçük)
      </text>
      <path d="M96 44 L134 22" className={S.line} />
      <path d="M96 76 L134 98" className={S.line} />
      <path
        d="M134 22 V10 H190"
        className={`${S.hot} czr-flow-fat`}
        strokeWidth="4"
        strokeDasharray="8 8"
      />
      <text x="140" y="42" fontSize="8" fill="var(--color-ignition)" stroke="none">
        kollektör (büyük)
      </text>
      <path d="M134 98 V110 H190" className={S.line} />
    </Frame>
  );
}

/** T12 — Enerji depolama */
function Battery() {
  return (
    <Frame title="Kapasitör dolar; kaynak kesilse bile LED bir süre daha yanar">
      <rect x="14" y="40" width="34" height="40" rx="3" className={S.line} />
      <path d="M48 52 v16" className={S.line} strokeWidth="3" />
      <rect x="70" y="34" width="46" height="52" rx="3" className={S.line} />
      {[0, 1, 2].map((i) => (
        <rect
          key={i}
          x="76"
          y={72 - i * 18}
          width="34"
          height="12"
          rx="2"
          fill="var(--color-ignition)"
          stroke="none"
          className="czr-fill"
          style={{ animationDelay: `${i * 0.7}s` }}
        />
      ))}
      <path d="M116 60 H150" className={S.line} />
      <circle cx="166" cy="60" r="12" className={S.hot} />
      <circle cx="166" cy="60" r="12" fill="var(--color-ignition)" stroke="none" className="czr-glow" />
      <path d="M14 80 V104 H190 V72" className={S.line} />
    </Frame>
  );
}

/** T16 — Blok kodlama & döngü */
function Blocks() {
  return (
    <Frame title="Döngü bloğu, içindeki komutları tekrar tekrar çalıştırır">
      <rect x="16" y="16" width="168" height="88" rx="4" className={S.hot} />
      <path d="M16 40 H184" className={S.hot} />
      <text x="26" y="33" fontSize="10" fill="var(--color-ignition)" stroke="none">
        tekrarla
      </text>
      {[0, 1].map((i) => (
        <rect
          key={i}
          x="34"
          y={52 + i * 22}
          width="120"
          height="16"
          rx="3"
          className={`${S.line} czr-step`}
          style={{ animationDelay: `${i * 0.9}s` }}
        />
      ))}
      <path
        d="M168 96 a 14 14 0 0 0 0-28"
        className={`${S.hot} czr-spin-arrow`}
        markerEnd="url(#czr-arrow)"
      />
      <defs>
        <marker id="czr-arrow" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
          <path d="M0 0 L6 3 L0 6 z" fill="var(--color-ignition)" />
        </marker>
      </defs>
    </Frame>
  );
}

/** T17 — Ekran & veri akışı */
function DataFlow() {
  return (
    <Frame title="Veri paketleri hat boyunca akar ve ekranda görüntülenir">
      <rect x="10" y="44" width="32" height="32" rx="3" className={S.line} />
      <path d="M42 54 H126 M42 66 H126" className={S.line} />
      {[0, 1, 2].map((i) => (
        <rect
          key={i}
          x="46"
          y="50"
          width="10"
          height="8"
          rx="1.5"
          fill="var(--color-ignition)"
          stroke="none"
          className="czr-packet"
          style={{ animationDelay: `${i * 0.6}s` }}
        />
      ))}
      <rect x="126" y="26" width="64" height="68" rx="4" className={S.line} />
      <rect x="134" y="36" width="48" height="26" rx="2" className={S.hot} />
      {[0, 1, 2, 3].map((i) => (
        <rect
          key={i}
          x={139 + i * 11}
          y="44"
          width="6"
          height="10"
          fill="var(--color-ignition)"
          stroke="none"
          className="czr-char"
          style={{ animationDelay: `${0.4 + i * 0.35}s` }}
        />
      ))}
    </Frame>
  );
}

const SVGS: Partial<Record<ThemeId, () => React.ReactElement>> = {
  direnc: Resistor,
  ses: Sound,
  sicaklik: Temperature,
  mesafe: Ultrasonic,
  transistor: Transistor,
  depolama: Battery,
  blok: Blocks,
  ekran: DataFlow,
};

/** Fiziksel temalar → video slot'u. Kayıt yoksa prosedürel yer tutucuya düşer. */
const VIDEOS: Partial<Record<ThemeId, { slot: string; label: string }>> = {
  devre: { slot: "c01-breadboard", label: "Breadboard üzerinde LED'in yanıp sönmesi." },
  lehim: { slot: "c02-solder", label: "Havya ucunun kızarması ve lehim dumanının yükselişi." },
  isik: { slot: "c03-ldr", label: "Işık sensörünün üzerine ışık düştüğünde lambanın sönmesi." },
  su: { slot: "c04-water", label: "Su damlalarının sensör üzerindeki bakır izleri köprülemesi." },
  motor: { slot: "c05-motor", label: "DC motorun pervaneyi çevirmesi ve dönüş yönünün tersine dönmesi." },
  jenerator: { slot: "c06-generator", label: "Jeneratör kolu döndükçe LED'in parlaklığının artması." },
  statik: { slot: "c07-static", label: "Yüklü çubuğun akan su huzmesini bükmesi." },
  uretim: { slot: "c08-3dprint", label: "3B yazıcı nozülünün katman katman malzeme yığması." },
  dron: { slot: "v2-uav", label: "İnsansız hava aracının alçak irtifada geçişi." },
  robot: { slot: "v4-mech", label: "Robot kol ekleminin hassas dönüşü." },
};

export function ThemeAnimation({ theme }: { theme: ThemeId }) {
  const Svg = SVGS[theme];
  if (Svg) {
    return (
      <div className="flex items-center justify-center py-2">
        <Svg />
      </div>
    );
  }

  const video = VIDEOS[theme];
  if (video) {
    return (
      <MediaSlot
        slot={video.slot}
        label={video.label}
        sizes="(max-width: 768px) 100vw, 320px"
        className="aspect-video w-full"
      />
    );
  }

  return null;
}
