"use client";

import { useCallback, useEffect, useRef, type ReactNode } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
  label: string;
  children: ReactNode;
  /** Önceki/sonraki gezinme — verilirse ok tuşları ve düğmeler etkinleşir. */
  onPrev?: () => void;
  onNext?: () => void;
};

/**
 * VideoModal ve ProjectLightbox'ın paylaştığı erişilebilir örtü katmanı.
 *
 * Modal erişilebilirliğinde üç şey sıklıkla atlanır ve üçü de burada
 * karşılanır:
 *   1. Odak tuzağı — Tab, modal dışına kaçamaz
 *   2. Odak iadesi — kapanınca odak, modalı açan öğeye geri döner
 *   3. Arka plan kilidi — altta kalan sayfa kaydırılamaz
 */
export function MediaOverlay({ open, onClose, label, children, onPrev, onNext }: Props) {
  const panelRef = useRef<HTMLDivElement>(null);
  const restoreFocusRef = useRef<HTMLElement | null>(null);

  const handleKey = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key === "ArrowLeft") onPrev?.();
      if (e.key === "ArrowRight") onNext?.();

      if (e.key !== "Tab" || !panelRef.current) return;

      const focusables = panelRef.current.querySelectorAll<HTMLElement>(
        'button, [href], video[controls], [tabindex]:not([tabindex="-1"])',
      );
      if (focusables.length === 0) return;

      const first = focusables[0];
      const last = focusables[focusables.length - 1];

      // Odak tuzağı: uçlarda döngüye al
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    },
    [onClose, onPrev, onNext],
  );

  useEffect(() => {
    if (!open) return;

    restoreFocusRef.current = document.activeElement as HTMLElement | null;

    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKey);

    // Açılışta odağı modalın içine taşı
    panelRef.current?.querySelector<HTMLElement>("button")?.focus();

    return () => {
      document.body.style.overflow = overflow;
      document.removeEventListener("keydown", handleKey);
      restoreFocusRef.current?.focus();
    };
  }, [open, handleKey]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={label}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-czr-base/94 p-4 backdrop-blur-md animate-fade-up sm:p-8"
      onClick={(e) => {
        // Yalnızca boşluğa tıklandığında kapan; içeriğe tıklamak kapatmamalı.
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div ref={panelRef} className="relative w-full max-w-5xl">
        <div className="flex items-center justify-between gap-3 pb-3">
          <p className="czr-mono text-[11px] uppercase text-czr-ice/50">{label}</p>

          <div className="flex items-center gap-2">
            {onPrev ? (
              <button
                type="button"
                onClick={onPrev}
                aria-label="Önceki medya"
                className="rounded-full border border-white/12 p-2 text-czr-ice transition hover:border-czr-orange/50 hover:text-czr-orange"
              >
                <svg viewBox="0 0 20 20" className="h-4 w-4" fill="currentColor" aria-hidden="true">
                  <path d="M12.5 4.5 14 6l-4 4 4 4-1.5 1.5L7 10z" />
                </svg>
              </button>
            ) : null}

            {onNext ? (
              <button
                type="button"
                onClick={onNext}
                aria-label="Sonraki medya"
                className="rounded-full border border-white/12 p-2 text-czr-ice transition hover:border-czr-orange/50 hover:text-czr-orange"
              >
                <svg viewBox="0 0 20 20" className="h-4 w-4" fill="currentColor" aria-hidden="true">
                  <path d="M7.5 4.5 6 6l4 4-4 4 1.5 1.5L13 10z" />
                </svg>
              </button>
            ) : null}

            <button
              type="button"
              onClick={onClose}
              aria-label="Kapat"
              className="rounded-full border border-white/12 p-2 text-czr-ice transition hover:border-czr-orange/50 hover:text-czr-orange"
            >
              <svg viewBox="0 0 20 20" className="h-4 w-4" fill="currentColor" aria-hidden="true">
                <path d="m5.5 4 4.5 4.5L14.5 4 16 5.5 11.5 10l4.5 4.5-1.5 1.5L10 11.5 5.5 16 4 14.5 8.5 10 4 5.5z" />
              </svg>
            </button>
          </div>
        </div>

        {children}
      </div>
    </div>
  );
}
