/**
 * HUD ÇERÇEVESİ — görev kontrol konsolu kadrajı.
 * Sunucu bileşeni: saf CSS, JS yok. Sahnelerin üstünde sabit durur.
 */
export function Frame() {
  const corner =
    "pointer-events-none absolute h-3 w-3 border-ignition/70";

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed z-40"
      style={{ inset: "var(--hud-inset)" }}
    >
      <div className="absolute inset-0 border border-[var(--hairline)]" />
      <div className={`${corner} -left-px -top-px border-l border-t`} />
      <div className={`${corner} -right-px -top-px border-r border-t`} />
      <div className={`${corner} -bottom-px -left-px border-b border-l`} />
      <div className={`${corner} -bottom-px -right-px border-b border-r`} />
    </div>
  );
}

/** Sol kenarda dikey aktif sahne etiketi. */
export function SceneLabel({ label }: { label: string }) {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed bottom-0 left-0 z-40 hidden md:block"
      style={{ left: "calc(var(--hud-inset) + 12px)", bottom: "calc(var(--hud-inset) + 12px)" }}
    >
      <span
        className="t-mono block text-ash"
        style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
      >
        {label}
      </span>
    </div>
  );
}
