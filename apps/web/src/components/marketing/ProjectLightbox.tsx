"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
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
 * YÖNE GÖRE KAYNAK. Kurucunun kararı: bilgisayarda görsele girildiğinde
 * tamamen YATAY görünmeli; mobil dikey kalır. Dikey fotoğrafların elle
 * kadrajlanmış 16:9 kopyaları (`yataySrc`) PC'de gösterilir; kopyası
 * olmayan (zaten yatay) fotoğraf her ekranda kendisidir.
 *
 * Lightbox içinde `czr-grade` tonlaması UYGULANMAZ: ızgaradaki tonlama
 * galerinin bütünlüğü içindir; kullanıcı bir kareyi büyütmeyi seçtiğinde
 * fotoğrafın gerçek rengini görmeyi hak eder.
 */
export function ProjectLightbox({ item, onClose, onPrev, onNext }: Props) {
  const [dar, setDar] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    const uygula = () => setDar(mq.matches);
    uygula();
    mq.addEventListener("change", uygula);
    return () => mq.removeEventListener("change", uygula);
  }, []);

  const yatayGoster = item ? !dar && Boolean(item.yataySrc) : false;

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
            key={`${item.id}-${yatayGoster ? "y" : "d"}`}
            src={yatayGoster ? item.yataySrc! : item.src}
            alt={item.alt}
            width={yatayGoster ? item.yatayWidth! : item.width}
            height={yatayGoster ? item.yatayHeight! : item.height}
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
