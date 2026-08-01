"use client";

import { useEffect, useRef } from "react";
import type { VideoAsset } from "@/lib/media";

/**
 * Görünürlüğe bağlı arka plan videosu.
 *
 * Üç hangar videosunu aynı anda oynatmak boşuna kod çözme demektir; her klip
 * yalnızca ekranda görünürken oynar, çıkınca durur.
 *
 * `prefers-reduced-motion` altında video HİÇ oynatılmaz — poster karesi
 * gösterilir ve sahne tam okunur kalır (AC4).
 *
 * Not: `poster` sunucu HTML'inde bulunur, dolayısıyla video hiç yüklenmese de
 * (yavaş bağlantı, veri tasarrufu) sahne boş görünmez.
 */
export function AutoVideo({
  asset,
  label,
  className = "",
}: {
  asset: VideoAsset;
  label: string;
  className?: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return;
        if (entry.isIntersecting) {
          void el.play().catch(() => {
            /* otomatik oynatma engellendi — poster kalır, sorun değil */
          });
        } else {
          el.pause();
        }
      },
      { threshold: 0.05 },
    );

    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <video
      ref={ref}
      className={className}
      poster={asset.poster}
      preload="none"
      muted
      loop
      playsInline
      aria-label={label}
    >
      <source src={asset.webm} type="video/webm" />
      <source src={asset.mp4} type="video/mp4" />
    </video>
  );
}
