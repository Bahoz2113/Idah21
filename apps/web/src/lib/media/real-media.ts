// ══════════════════════════════════════════════════════════════════
// GERÇEK MEDYA MANIFESTİ — Atölye & Saha Deneyimi galerisi
//
// Kurumun Batman atölyesinde ve saha uçuş/fırlatma testlerinde çekilmiş
// GERÇEK fotoğraf ve videoları buradan yönetilir. Dosyalar
// `public/assets/real-media/` altındadır.
//
// TASARIM KARARI — neden manifest:
// Dizini otomatik taramak yerine açık kayıt tutuyoruz. Sebep: her varlığın
// `alt` metni SEO'nun taşıyıcısıdır ve dosya adından türetilemez; ayrıca
// `width`/`height` bilinmeden CLS (düzen kayması) sıfırlanamaz. Manifest bu
// iki alanı ZORUNLU kılar — eksikse TypeScript derlemede durdurur.
//
// Manifest boşken sayfa çökmez: galeri "yakında" iskeletine düşer.
//
// KAYNAK NOTU: Buradaki her varlık kurumun kendi çekimidir. Yapay zeka ile
// üretilmiş marka görselleri (baykuş amblemi, sinematik sekans) KASITLI
// olarak bu listede DEĞİLDİR — `public/assets/brand/` altında ayrı durur.
// "Gerçek atölye deneyimi" vaadi, üretilmiş görsellerle karışmamalıdır.
// ══════════════════════════════════════════════════════════════════

export type MediaCategory =
  | "atolye"      // Atölye içi çalışma
  | "3d-baski"    // 3D yazıcı / üretim
  | "drone"       // İHA / VTOL
  | "saha"        // Saha uçuş / fırlatma testi
  | "robotik"     // Robotik çalışmaları
  | "ekip";       // Ekip / etkinlik

/** Bento ızgarasında kapladığı alan. */
export type MediaSpan = "normal" | "wide" | "tall" | "hero";

type MediaBase = {
  id: string;
  /** SEO taşıyıcısı. Anahtar kelime içermeli, dosya adı tekrarı OLMAMALI. */
  alt: string;
  /** Kart üstünde ve lightbox'ta görünen kısa açıklama. */
  caption: string;
  category: MediaCategory;
  span?: MediaSpan;
  /** Gerçek piksel boyutu — CLS'i sıfırlamak için zorunlu. */
  width: number;
  height: number;
};

export type RealImage = MediaBase & {
  kind: "image";
  src: string;
};

export type RealVideo = MediaBase & {
  kind: "video";
  src: string;
  /**
   * Poster zorunlu. Galeri kartı YALNIZCA posteri yükler; video dosyası
   * ancak kullanıcı kartı açtığında indirilir. Postersiz bir video, altı
   * kartlık bir ızgarada megabaytlarca gereksiz indirme demektir.
   */
  poster: string;
  /** Poster görselinin boyutu (video kadrajından farklı olabilir). */
  posterWidth: number;
  posterHeight: number;
  /** Saniye cinsinden süre. */
  durationSec: number;
};

export type RealMediaItem = RealImage | RealVideo;

// ──────────────────────────────────────────────────────────────────
// KAYITLAR
// ──────────────────────────────────────────────────────────────────

export const realMedia: readonly RealMediaItem[] = [
  {
    kind: "video",
    id: "saha-roket-firlatma-01",
    src: "/assets/real-media/saha-roket-firlatma-01.mp4",
    poster: "/assets/real-media/saha-roket-firlatma-01-poster.webp",
    alt: "CEZERİ ROBOTECH öğrencilerinin Batman'da gerçekleştirdiği model roket fırlatma testi ve baretli öğrencilerin uçuşu izlemesi",
    caption: "Saha fırlatma testi",
    category: "saha",
    span: "hero",
    width: 640,
    height: 1138,
    posterWidth: 800,
    posterHeight: 1422,
    durationSec: 11,
  },
  {
    kind: "video",
    id: "atolye-iha-uretim-01",
    src: "/assets/real-media/atolye-iha-uretim-01.mp4",
    poster: "/assets/real-media/atolye-iha-uretim-01-poster.webp",
    alt: "Batman CEZERİ ROBOTECH atölyesinde karbonfiber gövdeli model İHA'nın uçuş elektroniğinin monte edilmesi",
    caption: "İHA gövde ve elektronik montajı",
    category: "atolye",
    span: "tall",
    width: 640,
    height: 990,
    posterWidth: 800,
    posterHeight: 1238,
    durationSec: 11,
  },
  {
    kind: "video",
    id: "saha-iha-simurgh-01",
    src: "/assets/real-media/saha-iha-simurgh-01.mp4",
    poster: "/assets/real-media/saha-iha-simurgh-01-poster.webp",
    alt: "CEZERİ ROBOTECH öğrencilerinin ürettiği Simurgh-24 sabit kanatlı İHA'nın ilk kalkış ve uçuş testi",
    caption: "Simurgh-24 uçuş testi",
    category: "drone",
    span: "wide",
    width: 640,
    height: 1138,
    posterWidth: 800,
    posterHeight: 1422,
    durationSec: 10,
  },
  {
    kind: "image",
    id: "ekip-egitmenler-01",
    src: "/assets/real-media/ekip-egitmenler-01.webp",
    alt: "CEZERİ ROBOTECH Batman eğitmen kadrosu, kurumun robotik baykuş amblemi önünde",
    caption: "Eğitmen kadrosu",
    category: "ekip",
    span: "normal",
    width: 1200,
    height: 1200,
  },
  {
    kind: "image",
    id: "atolye-ldr-dersi-01",
    src: "/assets/real-media/atolye-ldr-dersi-01.webp",
    alt: "Batman CEZERİ ROBOTECH atölyesinde LDR ışık sensörü dersinde devre kuran ve LED'leri yakan öğrenciler",
    caption: "LDR sensörü dersi",
    category: "atolye",
    span: "tall",
    width: 828,
    height: 1192,
  },
  {
    kind: "video",
    id: "atolye-tur-01",
    src: "/assets/real-media/atolye-tur-01.mp4",
    poster: "/assets/real-media/atolye-tur-01-poster.webp",
    alt: "CEZERİ ROBOTECH Batman atölyesinin içi: 3D baskı ürünleri, hexacopter drone ve robotik eğitim kitleri",
    caption: "Atölye turu",
    category: "atolye",
    span: "wide",
    width: 640,
    height: 1138,
    posterWidth: 800,
    posterHeight: 1422,
    durationSec: 11,
  },
  {
    kind: "video",
    id: "saha-roket-mizrak-01",
    src: "/assets/real-media/saha-roket-mizrak-01.mp4",
    poster: "/assets/real-media/saha-roket-mizrak-01-poster.webp",
    alt: "CEZERİ ROBOTECH öğrencilerinin ürettiği MIZRAK 305 model roketinin ateşlenmesi ve tırmanışı",
    caption: "MIZRAK 305 fırlatması",
    category: "saha",
    span: "normal",
    width: 640,
    height: 1138,
    posterWidth: 800,
    posterHeight: 1422,
    durationSec: 6,
  },
  {
    kind: "image",
    id: "ekip-iha-takim-01",
    src: "/assets/real-media/ekip-iha-takim-01.webp",
    alt: "CEZERİ ROBOTECH forması giyen öğrenci takımı, ürettikleri Simurgh-24 sabit kanatlı İHA ile",
    caption: "İHA takımı",
    category: "drone",
    span: "normal",
    width: 800,
    height: 1422,
  },
  {
    kind: "video",
    id: "saha-hava-cekimi-01",
    src: "/assets/real-media/saha-hava-cekimi-01.mp4",
    poster: "/assets/real-media/saha-hava-cekimi-01-poster.webp",
    alt: "CEZERİ ROBOTECH roket fırlatma etkinliğinin drone ile çekilmiş havadan görüntüsü ve katılımcı kalabalığı",
    caption: "Etkinlik havadan görüntü",
    category: "saha",
    span: "wide",
    width: 640,
    height: 954,
    posterWidth: 800,
    posterHeight: 1194,
    durationSec: 9,
  },
  {
    kind: "image",
    id: "saha-roket-ekip-01",
    src: "/assets/real-media/saha-roket-ekip-01.webp",
    alt: "MIZRAK 305 roketini geliştiren CEZERİ ROBOTECH mühendis ve öğrenci ekibi fırlatma sahasında",
    caption: "MIZRAK 305 ekibi",
    category: "saha",
    span: "normal",
    width: 800,
    height: 1238,
  },
  {
    kind: "image",
    id: "etkinlik-avm-standi-01",
    src: "/assets/real-media/etkinlik-avm-standi-01.webp",
    alt: "CEZERİ ROBOTECH'in Batman Petrol City AVM'deki robotik tanıtım standı ve ziyaretçi aileler",
    caption: "Batman AVM tanıtım standı",
    category: "ekip",
    span: "normal",
    width: 828,
    height: 1280,
  },
];

/** Galeri gerçek içerikle mi render edilecek, iskeletle mi? */
export const hasRealMedia = realMedia.length > 0;

const CATEGORY_LABELS: Record<MediaCategory, string> = {
  atolye: "Atölye",
  drone: "İHA / VTOL",
  saha: "Saha Testi",
  "3d-baski": "3D Baskı",
  robotik: "Robotik",
  ekip: "Ekip",
};

/**
 * Filtreler manifest'ten TÜRETİLİR, elle sayılmaz.
 * Elle yazılan bir filtre listesi, varlığı olmayan kategoriler için boş
 * sonuç veren düğmeler üretir — kullanıcı tıklar, hiçbir şey görmez.
 * Türetilmiş liste bu hatayı yapısal olarak imkânsız kılar.
 */
export const mediaFilters: readonly { id: MediaCategory | "tumu"; label: string }[] = [
  { id: "tumu" as const, label: "Tümü" },
  ...(Object.keys(CATEGORY_LABELS) as MediaCategory[])
    .filter((c) => realMedia.some((m) => m.category === c))
    .map((c) => ({ id: c, label: CATEGORY_LABELS[c] })),
];

/** Bento ızgarasında span → Tailwind sınıf eşlemesi. */
export const spanClass: Record<MediaSpan, string> = {
  normal: "sm:col-span-1 sm:row-span-1",
  wide: "sm:col-span-2 sm:row-span-1",
  tall: "sm:col-span-1 sm:row-span-2",
  hero: "sm:col-span-2 sm:row-span-2",
};
