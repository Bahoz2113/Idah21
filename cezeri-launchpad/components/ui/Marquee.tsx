/**
 * Sonsuz telemetri şeridi — saf CSS.
 *
 * Sunucu bileşeni: metin ham HTML'de bulunur (GEO kuralı K1). JS ile
 * klonlama yapılmaz; ikinci kopya `aria-hidden` ile işaretlenir ki ekran
 * okuyucu metni iki kez okumasın.
 */
export function Marquee({ items }: { items: readonly string[] }) {
  const line = items.join("  —  ");

  return (
    <div className="relative flex overflow-hidden border-y border-[var(--hairline)] py-4">
      <div className="animate-marquee flex shrink-0 items-center gap-8 whitespace-nowrap">
        <span className="t-mono text-ash">{line}</span>
        <span className="t-mono text-ignition" aria-hidden="true">—</span>
      </div>
      <div
        aria-hidden="true"
        className="animate-marquee flex shrink-0 items-center gap-8 whitespace-nowrap"
      >
        <span className="t-mono text-ash">{line}</span>
        <span className="t-mono text-ignition">—</span>
      </div>
    </div>
  );
}
