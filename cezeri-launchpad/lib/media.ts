/**
 * MEDYA SLOT KAYDI
 *
 * Görseller Nano Banana ile üretildi (artifacts/gorsel-senaryolari.md), 18 MB
 * PNG kaynaktan WebP'ye indirgendi (toplam 0.45 MB). `blur` alanları 16px
 * genişliğinde gömülü LQIP yer tutuculardır — yükleme sırasında düzen kaymaz.
 *
 * Videolar (Gemini Omni) henüz gelmedi; o slot'lar kayıtta olmadığı için
 * `MediaSlot` prosedürel yer tutucuya düşer. Site medyasız da çalışır.
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
