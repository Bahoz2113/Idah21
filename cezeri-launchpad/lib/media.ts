/**
 * MEDYA SLOT KAYDI
 *
 * Üretim dışı kaynaklardan gelen medya buraya bağlanır:
 *   • Videolar  → Gemini Omni  (artifacts/video-senaryolari.md)
 *   • Görseller → Nano Banana  (artifacts/gorsel-senaryolari.md)
 *
 * Dosya `public/media/` altına konur ve aşağıdaki kayda eklenir. Kayıtta
 * olmayan slot otomatik olarak prosedürel yer tutucuya düşer — site medyasız
 * da eksiksiz çalışır (F6 kritik yolda değildir).
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
}

export type MediaAsset = VideoAsset | ImageAsset;

/**
 * Medya geldikçe buraya eklenecek. Örnek:
 *
 *   "g1-rocket": { kind: "image", src: "/media/g1-rocket.avif", width: 1200, height: 1600 },
 *   "v1-launch": { kind: "video", mp4: "/media/v1-launch.mp4",
 *                  webm: "/media/v1-launch.webm", poster: "/media/v1-launch.avif" },
 */
export const MEDIA: Readonly<Record<string, MediaAsset | undefined>> = {};

export function hasMedia(slot: string): boolean {
  return MEDIA[slot] !== undefined;
}
