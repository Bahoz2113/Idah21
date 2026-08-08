"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { observeWorld } from "./progress";

/**
 * Dünyanın performans ve erişilebilirlik kapısı.
 *
 * Sahne sayfanın ARKASINDA sabit durur ve scroll boyunca hiç sökülmez —
 * kinematik deneyimin tamamı buna dayanır. Ancak three.js ~500 kB'dır;
 * LCP hedefini (< 2.5 sn) korumak için şu dört koşul sağlanmadan yüklenmez:
 *
 *   1. İlk boyama bitmiş olmalı (requestIdleCallback)
 *   2. Kullanıcı azaltılmış hareket istememiş olmalı
 *   3. Cihaz yeterli kapasitede olmalı (bellek / çekirdek / veri tasarrufu)
 *   4. Ekran koridoru taşıyacak genişlikte olmalı
 *
 * Koşullar sağlanmazsa sahne HİÇ yüklenmez ve sayfa altındaki statik
 * gradyan zemine düşer. İçeriğin tamamı sunucuda render edildiği için
 * bu durumda da sayfa eksiksiz okunur — sahne yalnızca dekordur.
 */

const HangarWorld = dynamic(() => import("./HangarWorld"), {
  // ssr:false zorunlu — three sunucuda WebGL bağlamı bulamaz.
  ssr: false,
  loading: () => null,
});

type NetworkInformation = { saveData?: boolean };

function deviceCanRenderWorld(): boolean {
  if (typeof window === "undefined") return false;

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;

  const nav = navigator as Navigator & {
    deviceMemory?: number;
    connection?: NetworkInformation;
  };

  if (nav.connection?.saveData) return false;
  if (typeof nav.deviceMemory === "number" && nav.deviceMemory < 3) return false;
  if (typeof nav.hardwareConcurrency === "number" && nav.hardwareConcurrency < 4) return false;

  // WebGL gerçekten var mı — yetenek beyanına değil, bağlama bak.
  try {
    const probe = document.createElement("canvas");
    const ctx = probe.getContext("webgl2") ?? probe.getContext("webgl");
    if (!ctx) return false;
  } catch {
    return false;
  }

  return true;
}

/**
 * Telefonda dünya kapatılmaz, hafifletilir: partikül yok, düşük DPR,
 * daha yakın kadraj. Ziyaretçilerin çoğu mobilden geliyor; deneyimin
 * tamamını onlardan esirgemek yanlış olurdu.
 */
function isLiteDevice(): boolean {
  if (typeof window === "undefined") return true;
  const nav = navigator as Navigator & { deviceMemory?: number };
  if (window.innerWidth < 768) return true;
  if (typeof nav.deviceMemory === "number" && nav.deviceMemory < 6) return true;
  return false;
}

export function WorldStage() {
  const [enabled, setEnabled] = useState(false);
  const [lite, setLite] = useState(true);

  useEffect(() => {
    // Scroll saati sahneden bağımsız çalışır: ilerleme rayı ve chapter
    // göstergesi WebGL olmadan da doğru değeri okur.
    observeWorld();

    if (!deviceCanRenderWorld()) return;
    setLite(isLiteDevice());

    const idle =
      window.requestIdleCallback?.bind(window) ??
      ((cb: () => void) => window.setTimeout(cb, 1200));

    const handle = idle(() => setEnabled(true), { timeout: 3000 } as never);

    return () => {
      window.cancelIdleCallback?.(handle as number);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="czr-world pointer-events-none fixed inset-0 z-0"
      data-active={enabled ? "" : undefined}
    >
      {/* Taban katman: sahne yüklenmese de dünyanın rengi ve derinliği kalır. */}
      <div className="czr-world-floor absolute inset-0" />

      {enabled ? <HangarWorld lite={lite} /> : null}

      {/* Okunabilirlik perdesi — hareketli sahnenin üstünde metin kontrastı
          tesadüfe bırakılamaz. */}
      <div className="czr-world-scrim absolute inset-0" />
    </div>
  );
}
