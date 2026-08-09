"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { observeWorld, setWorldFx, worldClock } from "../world/progress";
import { SceneForeground } from "../world/SceneParallax";
import { WorldFocus } from "../world/WorldFocus";
import { actAt, actProgress, SHOW } from "./show";

/**
 * SEKANS SAHNESİ — alternatif sayfanın arka plan gösterisi.
 *
 * Ana sayfanın dünyası tek bir mekândır ve içinde gezilir. Buradaki
 * sahne ise bir GÖSTERİDİR: kaydırdıkça perdeler sırayla açılır —
 * roket kalkar, İHA geçer, 3D yazıcı basar, sinir ağı ateşlenir...
 *
 * Üç katman üst üste çalışır:
 *
 *   1. PLAKA   — perdenin Higgsfield görseli. Yavaşça yakınlaşır
 *                (perde içi ilerlemeye bağlı), perde değişince çapraz
 *                geçişle yenisi gelir.
 *   2. KAYIT   — o disiplinin GERÇEK saha kaydı, sessiz ve döngüde.
 *                Yalnızca üç perdede var; olmayan yere temsilî
 *                görüntü konmaz.
 *   3. EFEKT   — prosedürel animasyon (`FxCanvas`). Asıl "roket uçuyor"
 *                hissi burada; her çözünürlükte net, birkaç yüz üçgen.
 *
 * Perde numarası React state'ine yazılır — ama scroll'a değil, PERDE
 * DEĞİŞİMİNE bağlı: tüm sayfa boyunca on kez olur. Scroll'un kendisi
 * yine mutable saatten okunur, hiçbir karede render tetiklenmez.
 */

const FxCanvas = dynamic(() => import("../world/FxCanvas"), {
  ssr: false,
  loading: () => null,
});

type NetworkInformation = { saveData?: boolean };

function deviceCanRenderStage(): boolean {
  if (typeof window === "undefined") return false;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;

  const nav = navigator as Navigator & {
    deviceMemory?: number;
    connection?: NetworkInformation;
  };
  if (nav.connection?.saveData) return false;
  if (typeof nav.deviceMemory === "number" && nav.deviceMemory < 3) return false;
  if (typeof nav.hardwareConcurrency === "number" && nav.hardwareConcurrency < 4) return false;

  try {
    const probe = document.createElement("canvas");
    if (!(probe.getContext("webgl2") ?? probe.getContext("webgl"))) return false;
  } catch {
    return false;
  }
  return true;
}

function isLiteDevice(): boolean {
  if (typeof window === "undefined") return true;
  const nav = navigator as Navigator & { deviceMemory?: number };
  if (window.innerWidth < 768) return true;
  if (typeof nav.deviceMemory === "number" && nav.deviceMemory < 6) return true;
  return false;
}

export function SequenceStage() {
  const [act, setAct] = useState(0);
  const [enabled, setEnabled] = useState(false);
  const [lite, setLite] = useState(true);
  /** Video ancak yeterli cihazda ve veri tasarrufu kapalıyken oynar. */
  const [clips, setClips] = useState(false);

  const plateRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const capable = deviceCanRenderStage();
    const small = isLiteDevice();
    setLite(small);
    setClips(capable && !small);

    const stop = observeWorld(() => {
      const next = actAt(worldClock.progress);
      if (next !== act) setAct(next);

      // Perde içi yavaş yakınlaşma. Değer doğrudan style'a yazılır;
      // React bu ritimde uyandırılmaz.
      const el = plateRef.current;
      if (el) {
        const k = actProgress(worldClock.progress);
        el.style.transform = `scale(${(1.04 + k * 0.12).toFixed(4)})`;
      }
    });

    if (!capable) return stop;

    const idle =
      window.requestIdleCallback?.bind(window) ??
      ((cb: () => void) => window.setTimeout(cb, 1200));
    const handle = idle(() => setEnabled(true), { timeout: 3000 } as never);

    return () => {
      stop();
      window.cancelIdleCallback?.(handle as number);
    };
  }, [act]);

  // Perde değiştikçe prosedürel efekt de değişir: gösteriyi süren tek
  // saat bu. `setWorldFx` React state'ine yazmaz, sahne onu `useFrame`
  // içinde okur.
  useEffect(() => {
    setWorldFx(SHOW[act].fx);
    return () => setWorldFx(null);
  }, [act]);

  const current = SHOW[act];

  return (
    <>
      <div aria-hidden="true" className="czr-world czr-seq-stage pointer-events-none fixed inset-0 z-0">
        {/* Taban: perde görselleri yüklenmese de sahnenin rengi durur */}
        <div className="czr-world-floor absolute inset-0" />

        {/* 1 — Perdenin plakası. `key` ile yeniden monte edilir; yeni
            görsel saydamdan açılır, eskisi altında kalıp söner. */}
        <div
          key={current.plate}
          ref={plateRef}
          className="czr-seq-plate absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${current.plate})` }}
        />

        {/* 2 — Gerçek kayıt. Yalnızca kaydı olan perdelerde ve yalnızca
            yeterli cihazda. Sessiz, döngüde, kullanıcı denetimi yok:
            dekoratif bir katman, içerik değil. */}
        {clips && current.clip ? (
          <video
            key={current.clip}
            className="czr-seq-clip absolute inset-0 h-full w-full object-cover"
            src={current.clip}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
          />
        ) : null}

        {/* 3 — Prosedürel efekt: asıl animasyon */}
        {enabled ? (
          <div className="absolute inset-0 z-[3]">
            <FxCanvas lite={lite} anywhere wordmark={false} />
          </div>
        ) : null}

        {/* Okunabilirlik perdesi */}
        <div className="czr-seq-scrim absolute inset-0" />
      </div>

      {/* Makine sırtı içeriğin üstünden geçer — ana sayfadaki katmanın
          aynısı; iki sürüm aynı dünyanın içinde geçiyor. */}
      <SceneForeground />

      {/* Bölüm değiştikçe sahne geri çekilir */}
      <WorldFocus />
    </>
  );
}

/**
 * PERDE BİLDİRİMİ — arkada ne oynadığını söyler.
 *
 * Gösteri kendiliğinden akıyor; ziyaretçinin arkadaki hareketin ne
 * olduğunu tahmin etmesi gerekmesin.
 *
 * Neden KALICI bir panel değil: ilk hâli ekranın sol altında sabit
 * duruyordu ve içerik kolonunun üstüne biniyordu. 1440 px'de gövde
 * metni x = 104'ten başlar, panel ise 216'ya kadar uzanıyordu —
 * müfredat paragrafının son satırı panelin altında kalıyordu. Sabit
 * konumlu hiçbir kutu, akan metinle er ya da geç çakışır.
 *
 * Bu yüzden bildirim yalnızca PERDE DEĞİŞİNCE belirir ve birkaç
 * saniye sonra çekilir. Bilgi verilir, yer işgal edilmez.
 */
const NOTICE_MS = 3200;

export function ActMarquee() {
  const [act, setAct] = useState(0);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    return observeWorld(() => {
      const next = actAt(worldClock.progress);
      if (next !== act) setAct(next);
    });
  }, [act]);

  useEffect(() => {
    setShown(true);
    const t = window.setTimeout(() => setShown(false), NOTICE_MS);
    return () => window.clearTimeout(t);
  }, [act]);

  return (
    <div
      // `aria-live` yok ve `aria-hidden` var: bildirim dekoratiftir,
      // arkadaki dekorun adını her değişimde ekran okuyucuya bağırmak
      // okumayı böler. Perde sırası sayfanın sonunda metin olarak da
      // duruyor.
      aria-hidden="true"
      data-shown={shown ? "" : undefined}
      className="czr-act-notice pointer-events-none fixed bottom-6 left-6 z-40 hidden sm:block"
    >
      <div className="czr-glass-panel czr-rim rounded-full py-2.5 pl-3.5 pr-5">
        <div className="flex items-center gap-3">
          <span className="h-1.5 w-1.5 animate-pulse-signal rounded-full bg-czr-orange" />
          <span className="czr-mono text-[10px] uppercase tracking-[0.16em] text-czr-orange">
            Perde {String(act + 1).padStart(2, "0")}
          </span>
          <span className="text-[14px] font-bold leading-none text-white">
            {SHOW[act].title}
          </span>
        </div>
      </div>
    </div>
  );
}
