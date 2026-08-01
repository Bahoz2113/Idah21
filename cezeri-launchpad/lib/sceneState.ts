/**
 * PAYLAŞILAN SAHNE DURUMU
 *
 * GSAP ScrollTrigger buraya yazar, R3F `useFrame` buradan okur.
 * Kasıtlı olarak React state DEĞİL: scroll her karede tetiklenir; React
 * re-render'ı bu frekansta 60fps'i öldürür. Mutable modül nesnesi
 * render döngüsünün dışında kalır.
 */
export interface SceneState {
  /** S01 dişli→İHA morph ilerlemesi, 0..1 */
  launchpad: number;
  /** S02 exploded view ayrışma miktarı, 0..1 */
  exploded: number;
  /** S04 roket tırmanış ilerlemesi, 0..1 */
  ascent: number;
  /** Aktif sahne indeksi — HUD etiketi bunu okur */
  activeScene: number;
  /** Hareket azaltma tercihi; true ise sahneler son duruma sabitlenir */
  reducedMotion: boolean;
}

export const sceneState: SceneState = {
  launchpad: 0,
  exploded: 0,
  ascent: 0,
  activeScene: 0,
  reducedMotion: false,
};

/** Aktif sahne değişimini HUD'a bildiren hafif abonelik. */
type Listener = (index: number) => void;
const listeners = new Set<Listener>();

export function setActiveScene(index: number): void {
  if (sceneState.activeScene === index) return;
  sceneState.activeScene = index;
  listeners.forEach((l) => l(index));
}

export function subscribeActiveScene(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
