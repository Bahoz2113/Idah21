"use client";

import type { RealVideo } from "@/lib/media/real-media";
import { MediaOverlay } from "./MediaOverlay";

type Props = {
  item: RealVideo | null;
  onClose: () => void;
  onPrev?: () => void;
  onNext?: () => void;
};

/**
 * Saha uçuş testi / fırlatma videoları için tam ekran oynatıcı.
 *
 * Izgaradaki önizleme sessiz ve kontrolsüz döner; ses ve kontroller yalnızca
 * burada açılır. Kullanıcı videoyu izlemeyi bilinçli olarak seçtiğinde tam
 * deneyimi alır, galeride ise otomatik ses çalmaz.
 *
 * `preload="metadata"`: modal açılana kadar tam dosya indirilmez.
 */
export function VideoModal({ item, onClose, onPrev, onNext }: Props) {
  return (
    <MediaOverlay
      open={item !== null}
      onClose={onClose}
      onPrev={onPrev}
      onNext={onNext}
      label={item?.caption ?? "Saha videosu"}
    >
      {item ? (
        <figure className="overflow-hidden rounded-2xl border border-white/10 bg-black">
          {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
          <video
            key={item.id}
            src={item.src}
            poster={item.poster}
            controls
            autoPlay
            playsInline
            preload="metadata"
            aria-label={item.alt}
            className="h-auto max-h-[72vh] w-full bg-black"
          />
          <figcaption className="border-t border-white/8 px-5 py-4 text-sm text-czr-ice/70">
            {item.caption ?? item.alt}
          </figcaption>
        </figure>
      ) : null}
    </MediaOverlay>
  );
}
