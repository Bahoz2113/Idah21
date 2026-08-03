/**
 * El-Cezerî sibernetik dişli düzeneği — saf SVG, sıfır JavaScript.
 *
 * Hero'nun ilk karesi budur. R3F sahnesi yüklenene kadar (ve düşük güçlü
 * cihazlarda hiç yüklenmediğinde) görsel ağırlığı bu taşır. Animasyon CSS
 * ile döner: ana iş parçacığını meşgul etmez, LCP'yi geciktirmez.
 *
 * Tamamen dekoratiftir — erişilebilirlik ağacından gizlenir.
 */

type GearProps = {
  cx: number;
  cy: number;
  r: number;
  teeth: number;
  className?: string;
  opacity?: number;
  strokeWidth?: number;
};

/** Diş uçlarını polar koordinatta üreterek gerçekçi bir çark profili çizer. */
function gearPath(cx: number, cy: number, r: number, teeth: number): string {
  const toothDepth = r * 0.16;
  const outer = r + toothDepth / 2;
  const inner = r - toothDepth / 2;
  const step = (Math.PI * 2) / teeth;
  const pts: string[] = [];

  for (let i = 0; i < teeth; i += 1) {
    const a0 = i * step;
    const a1 = a0 + step * 0.28;
    const a2 = a0 + step * 0.5;
    const a3 = a0 + step * 0.78;

    pts.push(`${cx + Math.cos(a0) * outer},${cy + Math.sin(a0) * outer}`);
    pts.push(`${cx + Math.cos(a1) * outer},${cy + Math.sin(a1) * outer}`);
    pts.push(`${cx + Math.cos(a2) * inner},${cy + Math.sin(a2) * inner}`);
    pts.push(`${cx + Math.cos(a3) * inner},${cy + Math.sin(a3) * inner}`);
  }

  return `M${pts.join("L")}Z`;
}

function Gear({ cx, cy, r, teeth, className = "", opacity = 1, strokeWidth = 1.2 }: GearProps) {
  return (
    <g
      className={className}
      style={{ transformOrigin: `${cx}px ${cy}px`, opacity }}
    >
      <path
        d={gearPath(cx, cy, r, teeth)}
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
      />
      <circle cx={cx} cy={cy} r={r * 0.42} fill="none" stroke="currentColor" strokeWidth={strokeWidth} />
      <circle cx={cx} cy={cy} r={r * 0.1} fill="currentColor" opacity={0.6} />
      {/* Kol çubukları — el-Cezerî düzeneklerinin kam/krank karakteri */}
      {[0, 60, 120, 180, 240, 300].map((deg) => {
        const rad = (deg * Math.PI) / 180;
        return (
          <line
            key={deg}
            x1={cx + Math.cos(rad) * r * 0.42}
            y1={cy + Math.sin(rad) * r * 0.42}
            x2={cx + Math.cos(rad) * r * 0.86}
            y2={cy + Math.sin(rad) * r * 0.86}
            stroke="currentColor"
            strokeWidth={strokeWidth * 0.7}
            opacity={0.5}
          />
        );
      })}
    </g>
  );
}

export function CezeriGears({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 600 600"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <Gear cx={300} cy={300} r={168} teeth={28} className="animate-gear-spin text-czr-teal-soft" opacity={0.55} strokeWidth={1.4} />
      <Gear cx={300} cy={300} r={112} teeth={20} className="animate-gear-spin-rev text-czr-orange" opacity={0.4} />
      <Gear cx={470} cy={188} r={62} teeth={14} className="animate-gear-spin-rev text-czr-teal-soft" opacity={0.35} />
      <Gear cx={132} cy={430} r={48} teeth={12} className="animate-gear-spin text-czr-emerald" opacity={0.3} />

      {/* Dış yörünge halkaları — hangar/telemetri hissi */}
      <circle cx={300} cy={300} r={228} fill="none" stroke="currentColor" strokeWidth={0.8} className="text-czr-teal-soft" opacity={0.22} strokeDasharray="2 10" />
      <circle cx={300} cy={300} r={262} fill="none" stroke="currentColor" strokeWidth={0.6} className="text-czr-ice" opacity={0.1} />
    </svg>
  );
}
