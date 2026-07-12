/**
 * TTFD (time-to-first-data) olcum yardimcisi — loop-mrgp6m54-2963ab / T1 baseline.
 *
 * Amac: liste ekranindan bir ogrenciye tik anindan, detay ekraninda useStudent
 * verisinin geldigi ana kadar gecen sureyi (ms) olcmek.
 *
 * Production-etkisiz: yalnizca `localStorage.ttfd === "1"` iken calisir (A5).
 * Kapali iken tum fonksiyonlar no-op'tur, hicbir sey loglamaz/olcmez.
 *
 * Kullanim (olcum icin, tarayici console'unda):
 *   localStorage.ttfd = "1"; location.reload();
 *   // 20 kez: liste -> ogrenci tik -> detay yuklendi -> geri
 *   __ttfdReport();          // medyan + tum ornekler
 *   __ttfdReset();           // ornekleri sifirla
 *   localStorage.ttfd = "0"; // olcumu kapat
 */

function enabled(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return window.localStorage.getItem("ttfd") === "1";
  } catch {
    return false;
  }
}

// SPA (Next App Router) icinde client navigasyonu boyunca modul singleton'i yasar.
let navStart: number | null = null;

declare global {
  interface Window {
    __ttfd?: number[];
    __ttfdMount?: number[];
    __ttfdReport?: () => { n: number; median: number; samples: number[]; mountMedian: number | null } | null;
    __ttfdReset?: () => void;
  }
}

/** Liste linkine tik aninda cagrilir. */
export function markNavStart(): void {
  if (!enabled()) return;
  navStart = performance.now();
}

/** Detay bileseni ilk mount oldugunda cagrilir; nav+route+mount segmentini kaydeder. */
export function markDetailMount(): void {
  if (!enabled() || navStart == null) return;
  (window.__ttfdMount ??= []).push(performance.now() - navStart);
}

/** Detayda useStudent verisi ilk geldiginde cagrilir; TTFD ornegini kaydeder. */
export function measureTTFD(): void {
  if (!enabled() || navStart == null) return;
  const ms = performance.now() - navStart;
  navStart = null;
  const arr = (window.__ttfd ??= []);
  arr.push(ms);
  const med = median(arr);
  // eslint-disable-next-line no-console
  console.log(`[TTFD] #${arr.length} = ${ms.toFixed(1)}ms  (median=${med.toFixed(1)}ms, n=${arr.length})`);
}

function median(xs: number[]): number {
  if (xs.length === 0) return 0;
  const s = [...xs].sort((a, b) => a - b);
  const m = Math.floor(s.length / 2);
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
}

if (typeof window !== "undefined") {
  window.__ttfdReport = () => {
    const arr = window.__ttfd ?? [];
    if (arr.length === 0) return null;
    const mount = window.__ttfdMount ?? [];
    return { n: arr.length, median: median(arr), samples: [...arr], mountMedian: mount.length ? median(mount) : null };
  };
  window.__ttfdReset = () => {
    window.__ttfd = [];
    window.__ttfdMount = [];
    navStart = null;
  };
}
