/**
 * Dünyanın scroll saati.
 *
 * Sahne her karede nerede olduğunu buradan okur. Değer React state'inde
 * TUTULMAZ: scroll saniyede 60+ kez değişir ve her değişimde ağacı yeniden
 * render etmek sahneyi de sayfayı da kilitler. Bunun yerine tek bir mutable
 * kutu güncellenir; `useFrame` içindeki sahne onu okur, React hiç uyanmaz.
 */

export type WorldClock = {
  /** Sayfanın kaydırılabilir yüksekliğine göre 0 → 1. */
  progress: number;
  /** Son karede ölçülen anlık hız; kamera sarsıntısı ve toz sürüklenmesi için. */
  velocity: number;
  /** Viewport genişliği — sahne mobilde kadrajı daraltır. */
  viewportWidth: number;
};

export const worldClock: WorldClock = {
  progress: 0,
  velocity: 0,
  viewportWidth: 1440,
};

/**
 * Yürüyüşün durakları. Kamera anahtar kareleri ve bölüm kimlikleri buradan
 * türetilir; sayfa iskeleti ile sahne aynı tek kaynağa bakar.
 */
export const STATIONS = [
  { id: "esik", label: "Eşik", chapter: "00" },
  { id: "telemetri", label: "Telemetri", chapter: "01" },
  { id: "hangarlar", label: "Hangarlar", chapter: "02" },
  { id: "atolye", label: "Saha", chapter: "03" },
  { id: "miras", label: "Miras", chapter: "04" },
  { id: "sss", label: "Sorular", chapter: "05" },
  { id: "iletisim", label: "Konsol", chapter: "06" },
] as const;

export type StationId = (typeof STATIONS)[number]["id"];

let listeners: Array<() => void> = [];
let rafPending = false;
let lastProgress = 0;
let started = false;

function measure() {
  rafPending = false;

  const doc = document.documentElement;
  const scrollable = doc.scrollHeight - window.innerHeight;
  const next = scrollable > 0 ? Math.min(1, Math.max(0, window.scrollY / scrollable)) : 0;

  worldClock.velocity = next - lastProgress;
  worldClock.progress = next;
  worldClock.viewportWidth = window.innerWidth;
  lastProgress = next;

  for (const fn of listeners) fn();
}

function schedule() {
  if (rafPending) return;
  rafPending = true;
  requestAnimationFrame(measure);
}

/**
 * Ölçümü başlatır. Birden çok bileşen çağırsa da tek dinleyici kurulur;
 * dönen fonksiyon yalnızca kendi abonesini söker.
 */
export function observeWorld(onTick?: () => void): () => void {
  if (typeof window === "undefined") return () => {};

  if (!started) {
    started = true;
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });
    measure();
  }

  if (!onTick) return () => {};

  listeners.push(onTick);
  return () => {
    listeners = listeners.filter((fn) => fn !== onTick);
  };
}
