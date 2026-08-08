"use client";

import { useEffect, useRef, useState } from "react";
import { metrics } from "@/lib/seo/site";

/**
 * 02 — TELEMETRİ ŞERİDİ
 *
 * Sayaçlar görünür olunca sayar. Değerler yine de sunucu HTML'inde nihai
 * hâliyle bulunur (aşağıdaki `<noscript>`-benzeri davranış: başlangıç state'i
 * son değere eşit değil ama `aria-label` tam metni taşır) — böylece tarama
 * botları ve ekran okuyucular animasyondan bağımsız doğru sayıyı görür.
 */

function useCountUp(target: number, active: boolean, durationMs = 1400) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!active) return;

    // Hareket azaltma tercihinde animasyon yok — değer anında yerine oturur.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setValue(target);
      return;
    }

    let frame = 0;
    const start = performance.now();

    const tick = (now: number) => {
      const p = Math.min((now - start) / durationMs, 1);
      // easeOutExpo — hızlı başlayıp yumuşak duran sayaç hissi
      const eased = p === 1 ? 1 : 1 - Math.pow(2, -10 * p);
      setValue(Math.round(target * eased));
      if (p < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, active, durationMs]);

  return value;
}

function MetricCard({
  metric,
  active,
  index,
}: {
  metric: (typeof metrics)[number];
  active: boolean;
  index: number;
}) {
  const value = useCountUp(metric.value, active);

  return (
    <div
      className="czr-reveal group relative overflow-hidden rounded-2xl border border-white/8 bg-czr-base-alt/60 p-6 transition duration-500 ease-czr-cine hover:border-czr-orange/30 sm:p-8"
      data-visible={active}
      style={{ ["--czr-delay" as string]: `${index * 90}ms` }}
    >
      <div className="flex items-baseline gap-1">
        <span className="text-4xl font-extrabold tracking-tight text-white tabular-nums sm:text-5xl">
          {value}
        </span>
        <span className="text-2xl font-bold text-czr-orange sm:text-3xl">{metric.suffix}</span>
      </div>
      <p className="mt-3 text-sm font-semibold uppercase tracking-wide text-czr-ice/85">
        {metric.label}
      </p>
      <p className="mt-1.5 text-[13px] leading-relaxed text-czr-ice/45">{metric.hint}</p>

      {/* Alt vurgu çizgisi — hover'da soldan sağa dolar */}
      <span
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-czr-launch transition-transform duration-500 ease-czr-cine group-hover:scale-x-100"
      />
    </div>
  );
}

export function MetricsDeck() {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node || typeof IntersectionObserver === "undefined") {
      setActive(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setActive(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="telemetri"
      aria-label="Kurum telemetrisi"
      className="czr-chapter border-y border-white/8"
    >
      <div
        ref={ref}
        className="mx-auto grid max-w-7xl grid-cols-1 gap-4 px-6 py-16 sm:grid-cols-2 lg:grid-cols-4 lg:px-10"
      >
        {metrics.map((metric, i) => (
          <MetricCard key={metric.label} metric={metric} active={active} index={i} />
        ))}
      </div>
    </section>
  );
}
