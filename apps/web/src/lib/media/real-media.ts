// ══════════════════════════════════════════════════════════════════
// GERÇEK MEDYA MANIFESTİ — Atölye & Saha Deneyimi galerisi
//
// Kurumun Batman atölyesinde ve saha uçuş testlerinde çekilmiş GERÇEK
// fotoğraf/videoları buradan yönetilir. Dosyalar `public/assets/real-media/`
// altına konur, buraya bir satır kayıt eklenir; galeri, lightbox, video
// modalı ve ImageObject/VideoObject schema'sı otomatik beslenir.
//
// TASARIM KARARI — neden manifest:
// Dizini otomatik taramak yerine açık kayıt tutuyoruz. Sebep: her varlığın
// `alt` metni SEO'nun taşıyıcısıdır ve dosya adından türetilemez; ayrıca
// `width`/`height` bilinmeden CLS (düzen kayması) sıfırlanamaz. Manifest bu
// iki alanı ZORUNLU kılar — eksikse TypeScript derlemede durdurur.
//
// Manifest boşken sayfa çökmez: galeri "yakında" iskeletine düşer.
// ══════════════════════════════════════════════════════════════════

export type MediaCategory =
  | "atolye"      // Atölye içi çalışma
  | "3d-baski"    // 3D yazıcı / üretim
  | "drone"       // İHA / VTOL montaj
  | "saha"        // Saha uçuş / fırlatma testi
  | "robotik"     // Robotik çalışmaları
  | "ekip";       // Ekip / etkinlik

/** Bento ızgarasında kapladığı alan. */
export type MediaSpan = "normal" | "wide" | "tall" | "hero";

type MediaBase = {
  id: string;
  /** SEO taşıyıcısı. Anahtar kelime içermeli, dosya adı tekrarı OLMAMALI. */
  alt: string;
  /** Görselin üstünde/lightbox'ta görünen kısa açıklama. */
  caption?: string;
  category: MediaCategory;
  span?: MediaSpan;
  /** Gerçek piksel boyutu — CLS'i sıfırlamak için zorunlu. */
  width: number;
  height: number;
};

export type RealImage = MediaBase & {
  kind: "image";
  /** `/assets/real-media/...` ile başlayan public yol. */
  src: string;
};

export type RealVideo = MediaBase & {
  kind: "video";
  src: string;
  /** Poster zorunlu: postersiz video LCP'yi ve algılanan hızı bozar. */
  poster: string;
  /** Saniye cinsinden süre — VideoObject schema'sı için. */
  durationSec: number;
};

export type RealMediaItem = RealImage | RealVideo;

// ──────────────────────────────────────────────────────────────────
// KAYITLAR
//
// Kurum medyası teslim edildiğinde aşağıdaki diziye eklenecek.
// Beklenen dosya listesi ve teknik gereksinimler:
//   public/assets/real-media/README.md
//
// Örnek kayıt:
//   {
//     kind: "image",
//     id: "atolye-3d-baski-01",
//     src: "/assets/real-media/atolye-3d-baski-01.webp",
//     alt: "Batman CEZERİ ROBOTECH atölyesinde 3D yazıcıyla parça üreten öğrenci",
//     caption: "Eklemeli üretim istasyonu",
//     category: "3d-baski",
//     span: "wide",
//     width: 1600,
//     height: 1067,
//   },
// ──────────────────────────────────────────────────────────────────
export const realMedia: readonly RealMediaItem[] = [];

/** Galeri gerçek içerikle mi render edilecek, iskeletle mi? */
export const hasRealMedia = realMedia.length > 0;

export const mediaFilters: readonly { id: MediaCategory | "tumu"; label: string }[] = [
  { id: "tumu", label: "Tümü" },
  { id: "atolye", label: "Atölye" },
  { id: "drone", label: "İHA / VTOL" },
  { id: "saha", label: "Saha Testi" },
  { id: "3d-baski", label: "3D Baskı" },
  { id: "robotik", label: "Robotik" },
  { id: "ekip", label: "Ekip" },
];

/** Bento ızgarasında span → Tailwind sınıf eşlemesi. */
export const spanClass: Record<MediaSpan, string> = {
  normal: "sm:col-span-1 sm:row-span-1",
  wide: "sm:col-span-2 sm:row-span-1",
  tall: "sm:col-span-1 sm:row-span-2",
  hero: "sm:col-span-2 sm:row-span-2",
};
