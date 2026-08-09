"use client";

import { useEffect } from "react";

/**
 * DERİNLİK ODAĞI — bölüm değiştikçe dünyanın çekilmesi.
 *
 * Tek bir dünya içinde geziliyorsa o dünyanın her bölümde aynı
 * yoğunlukta durması yanlıştır: eşikte mekân açılmalı, yoğun okuma
 * bölümlerinde geri çekilmelidir. Sahne müfredatın 165 haftalık ders
 * planının arkasında hero'daki keskinlikle durduğunda, göz metne değil
 * arkadaki harekete kayıyordu.
 *
 * Bu yüzden her durağın bir DERİNLİĞİ var:
 *
 *   · esik   — dünya tam önde. Bulanıklık yok, karartma yok.
 *   · sahne  — hareketin anlamı olan duraklar (eğitimler, atölye, miras).
 *              Sahne okunur kalır ama öne çıkmaz.
 *   · okuma  — metnin tek başına taşıdığı duraklar (telemetri, müfredat,
 *              basın, sorular, konsol). Dünya arka plana çekilir.
 *
 * Değerler `document.documentElement` üzerine CSS değişkeni olarak
 * yazılır; hem dünya katmanı hem de içeriğin üstünden geçen ön plan
 * aynı değeri okur — ikisi birlikte çekilir, aralarında kopukluk olmaz.
 *
 * Geçişi CSS yapar (`transition`), JS her karede değer yazmaz: bölüm
 * değişimi saniyede bir kez bile olmaz, animasyonu tarayıcıya bırakmak
 * hem daha akıcı hem bedavadır.
 */

type Depth = {
  blur: number;
  dim: number;
  /**
   * Ön planın yoğunluğu (0-1).
   *
   * Eşikte ayrı tutulur çünkü hero'nun içeriği ilk ekranın altına taşacak
   * kadar uzundur: makine sırtı orada tam yoğunlukta durursa "Fırlatmaya
   * Hazırlan" butonunun üstüne biner. Dünyaya girildikçe kapanır — eşikte
   * mekân açık, içeride çevrelenmiş.
   */
  fg: number;
};

const OPEN: Depth = { blur: 0, dim: 0, fg: 0.26 };
const STAGE: Depth = { blur: 2.5, dim: 0.16, fg: 1 };
const READ: Depth = { blur: 7, dim: 0.4, fg: 1 };

const DEPTH: Record<string, Depth> = {
  esik: OPEN,
  telemetri: READ,
  egitimler: STAGE,
  mufredat: READ,
  atolye: STAGE,
  miras: STAGE,
  basin: READ,
  sss: READ,
  iletisim: READ,
};

/** Kimliği tanınmayan bölüm (footer gibi) metin ağırlıklıdır. */
const FALLBACK = READ;

export function WorldFocus() {
  useEffect(() => {
    const root = document.documentElement;
    const sections = Array.from(
      document.querySelectorAll<HTMLElement>("main .czr-chapter, footer.czr-chapter"),
    );
    if (sections.length === 0) return;

    const apply = (d: Depth) => {
      root.style.setProperty("--czr-depth-blur", `${d.blur}px`);
      root.style.setProperty("--czr-depth-dim", String(d.dim));
      root.style.setProperty("--czr-depth-fg", String(d.fg));
    };

    apply(DEPTH.esik);

    // Ekranın ORTA ŞERİDİ karar verir: rootMargin üstten ve alttan
    // %45 kırpıldığında yalnızca viewport'un ortasından geçen bölüm
    // eşiği tetikler. Aksi hâlde iki bölüm aynı anda "görünür" olur ve
    // derinlik scroll boyunca titrerdi.
    const seen = new Set<HTMLElement>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          const el = e.target as HTMLElement;
          if (e.isIntersecting) seen.add(el);
          else seen.delete(el);
        }

        // Aynı anda birden fazlası şeride girerse belge sırasında
        // önce gelen kazanır: aşağı inerken derinlik erken değil,
        // bölüm gerçekten yerleştiğinde değişir.
        const active = sections.find((s) => seen.has(s));
        apply(active ? (DEPTH[active.id] ?? FALLBACK) : DEPTH.esik);
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 },
    );

    for (const s of sections) io.observe(s);

    return () => {
      io.disconnect();
      root.style.removeProperty("--czr-depth-blur");
      root.style.removeProperty("--czr-depth-dim");
      root.style.removeProperty("--czr-depth-fg");
    };
  }, []);

  return null;
}
