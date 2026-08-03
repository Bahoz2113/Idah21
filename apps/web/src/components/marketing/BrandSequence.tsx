"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

/**
 * Marka sinematiği — dişli düzeneğinden robotik baykuşa dönüşüm.
 *
 * Bu klip, Cezerî Mirası bölümünün görsel çapasıdır ve tesadüfen değil:
 * videoda amblem önce dişli çarklara ayrışıyor, sonra mekanik bir canlıya
 * dönüşüyor. Bölümün anlattığı şeyin ta kendisi — el-Cezerî'nin
 * programlanabilir otomatlarından bugünün otonom sistemlerine.
 *
 * DÜRÜSTLÜK NOTU: Bu klip yapay zeka ile üretilmiştir; kurumun gerçek
 * atölye/saha kayıtları DEĞİLDİR. Bu yüzden `real-media` galerisine
 * konmadı ve altında kaynak etiketi taşıyor. Gerçek çekimlerle aynı
 * çerçevede sunulsaydı, "gerçek atölye deneyimi" vaadini zayıflatırdı.
 *
 * YÜKLEME: Poster önce gelir; video dosyası yalnızca bölüm görünür olduğunda
 * ve hareket azaltma kapalıysa indirilir.
 */
export function BrandSequence() {
  const ref = useRef<HTMLDivElement>(null);
  const [loadVideo, setLoadVideo] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    // Hareket azaltma tercihinde döngüsel video hiç yüklenmez; poster kalır.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    if (typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setLoadVideo(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <figure ref={ref} className="relative">
      <div className="czr-grade relative overflow-hidden rounded-3xl border border-white/10 bg-czr-base-alt">
        {/* Poster her zaman DOM'da: video yüklenmezse de bölüm boş kalmaz. */}
        <Image
          src="/assets/brand/cezeri-baykus-sekans-poster.webp"
          alt="CEZERİ ROBOTECH robotik baykuş amblemi, dişli çarklardan oluşan mekanik bir bütüne dönüşürken"
          width={800}
          height={1422}
          sizes="(max-width: 1024px) 100vw, 480px"
          className="h-auto w-full object-cover"
          loading="lazy"
        />

        {loadVideo ? (
          <video
            src="/assets/brand/cezeri-baykus-sekans.mp4"
            poster="/assets/brand/cezeri-baykus-sekans-poster.webp"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            aria-hidden="true"
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : null}
      </div>

      <figcaption className="mt-3 czr-mono text-[10px] uppercase leading-relaxed text-czr-ice/35">
        Marka sekansı · yapay zeka ile üretilmiş konsept görsel
      </figcaption>
    </figure>
  );
}
