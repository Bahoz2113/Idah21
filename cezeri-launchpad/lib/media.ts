/**
 * MEDYA SLOT KAYDI
 *
 * Görseller Nano Banana ile üretildi (artifacts/gorsel-senaryolari.md), 18 MB
 * PNG kaynaktan WebP'ye indirgendi (toplam 0.45 MB). `blur` alanları 16px
 * genişliğinde gömülü LQIP yer tutuculardır — yükleme sırasında düzen kaymaz.
 *
 * Videolar Kling ile üretildi: 1920×1080, 24fps, 8 sn kaynaklar sesi silinip
 * 1600×900'e ölçeklendi ve kuyruk→baş çapraz geçişiyle 7 sn KESİNTİSİZ DÖNGÜYE
 * çevrildi. Kayıtta olmayan slot prosedürel yer tutucuya düşer.
 */

export interface VideoAsset {
  readonly kind: "video";
  readonly mp4: string;
  readonly webm: string;
  readonly poster: string;
}

export interface ImageAsset {
  readonly kind: "image";
  readonly src: string;
  readonly width: number;
  readonly height: number;
  readonly blur: string;
}

export type MediaAsset = VideoAsset | ImageAsset;

export const MEDIA: Readonly<Record<string, MediaAsset | undefined>> = {
  // ——— Videolar (Kling, 1920×1080 24fps 8s → 1600×900 7s kesintisiz döngü) ———
  "v1-launch": {
    kind: "video",
    webm: "/media/v1-launch.webm",
    mp4: "/media/v1-launch.mp4",
    poster: "/media/v1-launch-poster.webp",
  },
  "v2-uav": {
    kind: "video",
    webm: "/media/v2-uav.webm",
    mp4: "/media/v2-uav.mp4",
    poster: "/media/v2-uav-poster.webp",
  },
  "v3-lab": {
    kind: "video",
    webm: "/media/v3-lab.webm",
    mp4: "/media/v3-lab.mp4",
    poster: "/media/v3-lab-poster.webp",
  },
  "v4-mech": {
    kind: "video",
    webm: "/media/v4-mech.webm",
    mp4: "/media/v4-mech.mp4",
    poster: "/media/v4-mech-poster.webp",
  },
  "g1-rocket": {
    kind: "image",
    src: "/media/g1-rocket.webp",
    width: 900,
    height: 1200,
    blur: "data:image/webp;base64,UklGRkgAAABXRUJQVlA4IDwAAABQAgCdASoQABUABUB8JZwAAtz90QlCW0k/wIAA/vQwhzazblKwssbP+iUeglx3avxtyzKEuupU2RnAgAA=",
  },
  "g2-rover": {
    kind: "image",
    src: "/media/g2-rover.webp",
    width: 900,
    height: 1200,
    blur: "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACwAgCdASoQABUAPzmGulOvKKWisAgB4CcJZwAAeyAA/u7bOerxFqxSbWB84AAA",
  },
  "g3-uav": {
    kind: "image",
    src: "/media/g3-uav.webp",
    width: 900,
    height: 1200,
    blur: "data:image/webp;base64,UklGRjYAAABXRUJQVlA4ICoAAACwAgCdASoQABUAPzmEuVOvKKWisAgB4CcJaQAAeyAA/u8GkOZV984gIAA=",
  },
  "g4-arm": {
    kind: "image",
    src: "/media/g4-arm.webp",
    width: 900,
    height: 1200,
    blur: "data:image/webp;base64,UklGRkwAAABXRUJQVlA4IEAAAACQAwCdASoQABUAPzmEuVOvKKWisAgB4CcJaQAASovKYleu5uoAAP7r/ykXc9lD4KGNc4CG16FpkHTBBnQMAAAA",
  },
  "g5-linefollower": {
    kind: "image",
    src: "/media/g5-linefollower.webp",
    width: 900,
    height: 1200,
    blur: "data:image/webp;base64,UklGRj4AAABXRUJQVlA4IDIAAADQAgCdASoQABUAPzmGuVOvKKWisAgB4CcJZwAAhAwAAP7u2zl2hLKueeC+Q63fTnT4AA==",
  },
  "g6-pcb": {
    kind: "image",
    src: "/media/g6-pcb.webp",
    width: 900,
    height: 1200,
    blur: "data:image/webp;base64,UklGRkwAAABXRUJQVlA4IEAAAACQAwCdASoQABUAPzmGuVOvKSWisAgB4CcJZwAAW+y5eJ/z4wj4AP7r5wSSHAezpecQlTux38ACO4ljqQDlAAAA",
  },
  "l1-ai-lab": {
    kind: "image",
    src: "/media/l1-ai-lab.webp",
    width: 1600,
    height: 900,
    blur: "data:image/webp;base64,UklGRiwAAABXRUJQVlA4ICAAAABwAQCdASoQAAkABUB8JYwC7AFAAAD+8Igh4wjPRdn4AA==",
  },
  "l2-uav-lab": {
    kind: "image",
    src: "/media/l2-uav-lab.webp",
    width: 1600,
    height: 900,
    blur: "data:image/webp;base64,UklGRiwAAABXRUJQVlA4ICAAAABwAQCdASoQAAkABUB8JZQC7AF1AAD+8IdmI3ID//xAAA==",
  },
  "l3-mechatronics": {
    kind: "image",
    src: "/media/l3-mechatronics.webp",
    width: 1600,
    height: 900,
    blur: "data:image/webp;base64,UklGRioAAABXRUJQVlA4IB4AAABQAQCdASoQAAkABUB8JZQABAAAAP7woVFGaL4AAAA=",
  },
  "c1-gears": {
    kind: "image",
    src: "/media/c1-gears.webp",
    width: 800,
    height: 800,
    blur: "data:image/webp;base64,UklGRkoAAABXRUJQVlA4ID4AAADwAQCdASoQABAABUB8JQBOgB4i7YOWuAAA/uzekeMQanqe1xPpSLCZsWUKe4sRZYsLiIjlXqSnjxhPd9AAAA==",
  },
  "c2-og": {
    kind: "image",
    src: "/media/c2-og.webp",
    width: 1200,
    height: 630,
    blur: "data:image/webp;base64,UklGRjAAAABXRUJQVlA4ICQAAADQAQCdASoQAAgABUB8JZQC7AEOcy+UYAD+8MaKDspBfl9JAAA=",
  },
};

export function hasMedia(slot: string): boolean {
  return MEDIA[slot] !== undefined;
}

/** Sosyal paylaşım kartı — layout metadata'sında kullanılır. */
export const OG_IMAGE = MEDIA["c2-og"] as ImageAsset;
