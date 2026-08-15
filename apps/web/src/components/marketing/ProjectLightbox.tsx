"use client";

import Image from "next/image";
import type { RealImage } from "@/lib/media/real-media";
import { MediaOverlay } from "./MediaOverlay";

type Props = {
  item: RealImage | null;
  onClose: () => void;
  onPrev?: () => void;
  onNext?: () => void;
};

/**
 * Gerçek atölye/saha fotoğrafları için tam ekran görüntüleyici.
 *
 * Lightbox içinde `czr-grade` tonlaması UYGULANMAZ: ızgaradaki tonlama
 * galerinin bütünlüğü içindir; kullanıcı bir kareyi büyütmeyi seçtiğinde
 * fotoğrafın gerçek rengini görmeyi hak eder.
 */
export function ProjectLightbox({ item, onClose, onPrev, onNext }: Props) {
  return (
    <MediaOverlay
      open={item !== null}
      onClose={onClose}
      onPrev={onPrev}
      onNext={onNext}
      label={item?.caption ?? "Atölye görseli"}
    >
      {item ? (
        <figure className="overflow-hidden rounded-2xl border border-white/10 bg-czr-base-alt">
          <Image
            src={item.src}
            alt={item.alt}
            width={item.width}
            height={item.height}
            sizes="(max-width: 1024px) 100vw, 1024px"
            className="h-auto w-full object-contain"
            priority
          />
          <figcaption className="border-t border-white/8 px-5 py-4 text-sm text-czr-ice/70">
            {item.caption ?? item.alt}
          </figcaption>
        </figure>
      ) : null}
    </MediaOverlay>
  );
}
