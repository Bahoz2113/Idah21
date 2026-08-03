"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

/**
 * 3D sahnenin performans kapısı.
 *
 * Three.js + R3F yaklaşık 500 KB'lık bir yüktür. Hero'nun LCP hedefini
 * (< 2.5 sn) korumak için sahne şu üç koşulun HEPSİ sağlanmadan yüklenmez:
 *
 *   1. Sayfa ilk boyamasını tamamlamış olmalı (requestIdleCallback)
 *   2. Kullanıcı azaltılmış hareket istememiş olmalı
 *   3. Cihaz yeterli kapasitede olmalı (bellek / çekirdek / veri tasarrufu)
 *
 * Koşullar sağlanmazsa hero, altındaki SVG dişli düzeneğiyle eksiksiz
 * çalışmaya devam eder — hiçbir içerik kaybolmaz.
 */

const DroneScene = dynamic(() => import("./DroneScene"), {
  // ssr:false zorunlu — three sunucuda WebGL bağlamı bulamaz.
  ssr: false,
  loading: () => null,
});

type NetworkInformation = { saveData?: boolean };

function deviceCanHandleWebGL(): boolean {
  if (typeof window === "undefined") return false;

  // Hareket azaltma tercihi 3D sahneyi tamamen devre dışı bırakır.
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;

  const nav = navigator as Navigator & {
    deviceMemory?: number;
    connection?: NetworkInformation;
  };

  // Veri tasarrufu açıksa yarım megabaytlık sahneyi indirmek saygısızlık olur.
  if (nav.connection?.saveData) return false;

  // deviceMemory/hardwareConcurrency bilgisi olmayan tarayıcılarda (Safari)
  // engellemek yerine geçmesine izin veriyoruz — aksi hâlde masaüstü Safari
  // kullanıcıları sahneyi hiç göremezdi.
  if (typeof nav.deviceMemory === "number" && nav.deviceMemory < 4) return false;
  if (typeof nav.hardwareConcurrency === "number" && nav.hardwareConcurrency < 4) return false;

  // Küçük ekranlarda sahne zaten kırpılıyor; mobil pili boşuna yakmayalım.
  if (window.innerWidth < 768) return false;

  return true;
}

export function HeroScene() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (!deviceCanHandleWebGL()) return;

    const idle =
      window.requestIdleCallback?.bind(window) ??
      ((cb: () => void) => window.setTimeout(cb, 1200));

    // Boşta kalma anına kadar bekle: LCP ölçümü bu noktada çoktan kapanmıştır.
    const handle = idle(() => setEnabled(true), { timeout: 3000 } as never);

    return () => {
      window.cancelIdleCallback?.(handle as number);
    };
  }, []);

  if (!enabled) return null;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-auto absolute inset-0 animate-fade-up"
    >
      <DroneScene />
    </div>
  );
}
