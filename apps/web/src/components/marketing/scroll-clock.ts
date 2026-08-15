/**
 * KAYDIRMA SAATİ.
 *
 * Sayfada konuma göre açılan bloklar (`Reveal`) her karede nerede
 * olduklarını buradan okur. Değer React state'inde TUTULMAZ: kaydırma
 * saniyede 60+ kez değişir ve her değişimde ağacı yeniden render etmek
 * sayfayı kilitler. Bunun yerine tek bir dinleyici kurulur, ölçüm
 * `requestAnimationFrame` ile kare hızına indirgenir ve aboneler çağrılır.
 *
 * NEDEN `IntersectionObserver` DEĞİL. IO yalnızca bir eşik GEÇİLDİĞİNDE
 * tetiklenir. Kaydırma çubuğunu tutup en alta sürüklerseniz ya da bir
 * çapaya atlarsanız aradaki bloklar hiç eşik geçmez; olay hiç gelmez ve o
 * bloklar sonsuza dek gizli kalır. Ölçüldü: çubuk sürüklemesinden sonra 77
 * bloğun 45'i görünmez kalmıştı. Konum yoklaması bu durumu tanımaz bile —
 * blok neredeyse oradadır.
 */

let listeners: Array<() => void> = [];
let rafPending = false;
let started = false;

function measure() {
  rafPending = false;
  for (const fn of listeners) fn();
}

function schedule() {
  if (rafPending) return;
  rafPending = true;
  requestAnimationFrame(measure);
}

/**
 * Ölçümü başlatır ve bir aboneyi kaydeder.
 *
 * Birden çok bileşen çağırsa da pencereye tek `scroll` ve tek `resize`
 * dinleyicisi kurulur; dönen fonksiyon yalnızca kendi abonesini söker.
 * Blok açıldıktan sonra abone kendini sökerse yoklama bedeli sıfırlanır.
 */
export function observeScroll(onTick?: () => void): () => void {
  if (typeof window === "undefined") return () => {};

  if (!started) {
    started = true;
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });
    schedule();
  }

  if (!onTick) return () => {};

  listeners.push(onTick);
  // İlk ölçüm hemen: sayfa zaten aşağıda açılmış olabilir (yenileme,
  // çapalı bağlantı, geri tuşu). Bir sonraki kaydırmayı beklemek o
  // durumda bloğun görünür alanda gizli kalması demekti.
  schedule();

  return () => {
    listeners = listeners.filter((fn) => fn !== onTick);
  };
}
