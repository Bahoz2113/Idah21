"use client";

import { useEffect, useState } from "react";
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
 * YÖNE GÖRE KAYNAK. Kayıtların çoğu telefonla dikey çekildi; PC için
 * bulanık zeminli 1280×720 yatay kadraj üretildi. Kurucunun kararı: PC
 * yatay kopyayı, telefon orijinal dikey kopyayı oynatır — dikey bir kare,
 * dikey tutulan telefonda tam ekran dolar; yatay kadraj orada küçük bir
 * şerit kalırdı. Dikey kopyası olmayan kayıt (ör. Vali ziyareti — yatay
 * çekilmiş) her ekranda yatay oynar.
 *
 * `key` kaynağı da içerir: pencere eşikten geçerse video yeni kaynakla
 * baştan kurulur — aynı elementte `src` değiştirmek konumu ve oynatma
 * durumunu belirsiz bırakıyordu.
 *
 * `preload="metadata"`: modal açılana kadar tam dosya indirilmez.
 */
export function VideoModal({ item, onClose, onPrev, onNext }: Props) {
  const [dar, setDar] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    const uygula = () => setDar(mq.matches);
    uygula();
    mq.addEventListener("change", uygula);
    return () => mq.removeEventListener("change", uygula);
  }, []);

  const kaynak = item ? (dar && item.dikeySrc ? item.dikeySrc : item.src) : null;

  return (
    <MediaOverlay
      open={item !== null}
      onClose={onClose}
      onPrev={onPrev}
      onNext={onNext}
      label={item?.caption ?? "Saha videosu"}
    >
      {item && kaynak ? (
        <figure className="overflow-hidden rounded-2xl border border-white/10 bg-black">
          {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
          <video
            key={`${item.id}-${kaynak}`}
            src={kaynak}
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
