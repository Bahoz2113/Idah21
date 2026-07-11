"use client";

/** Radar (örümcek) grafik — 18 kriteri tek bakışta gösterir. Bağımlılıksız SVG. */
export function RadarChart({
  data, size = 300, max = 10,
}: {
  data: { label: string; value: number }[];
  size?: number;
  max?: number;
}) {
  const cx = size / 2, cy = size / 2;
  const r = size / 2 - 46;
  const n = data.length;
  if (n < 3) return <p className="text-sm text-gray-400">Radar için en az 3 kriter gerekli.</p>;

  const angle = (i: number) => (Math.PI * 2 * i) / n - Math.PI / 2;
  const point = (i: number, val: number) => {
    const rr = (val / max) * r;
    return [cx + rr * Math.cos(angle(i)), cy + rr * Math.sin(angle(i))];
  };

  const rings = [0.25, 0.5, 0.75, 1];
  const polygon = data.map((d, i) => point(i, d.value).join(",")).join(" ");

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="mx-auto">
      {/* Izgara halkaları */}
      {rings.map((ring, ri) => (
        <polygon key={ri}
          points={data.map((_, i) => point(i, max * ring).join(",")).join(" ")}
          fill="none" stroke="#e6e9ee" strokeWidth={1} />
      ))}
      {/* Eksen çizgileri */}
      {data.map((_, i) => {
        const [x, y] = point(i, max);
        return <line key={i} x1={cx} y1={cy} x2={x} y2={y} stroke="#eceef1" strokeWidth={1} />;
      })}
      {/* Veri poligonu */}
      <polygon points={polygon} fill="#1E6FA0" fillOpacity={0.18} stroke="#1E6FA0" strokeWidth={2} />
      {/* Veri noktaları */}
      {data.map((d, i) => {
        const [x, y] = point(i, d.value);
        return <circle key={i} cx={x} cy={y} r={3} fill="#F2951F" />;
      })}
      {/* Etiketler */}
      {data.map((d, i) => {
        const [x, y] = point(i, max * 1.16);
        const anchor = Math.abs(x - cx) < 8 ? "middle" : x > cx ? "start" : "end";
        return (
          <text key={i} x={x} y={y} fontSize={8.5} fill="#5b6472" textAnchor={anchor} dominantBaseline="middle">
            {d.label.length > 16 ? d.label.slice(0, 15) + "…" : d.label}
          </text>
        );
      })}
    </svg>
  );
}

/** Aylık gelişim çizgi grafiği — dönem ortalamalarını gösterir. */
export function LineChart({
  data, width = 460, height = 180, max = 10,
}: {
  data: { period: string; average: number }[];
  width?: number; height?: number; max?: number;
}) {
  const pad = { l: 28, r: 12, t: 12, b: 26 };
  const w = width - pad.l - pad.r;
  const h = height - pad.t - pad.b;

  if (data.length === 0) return <p className="text-sm text-gray-400">Henüz değerlendirme verisi yok.</p>;

  const x = (i: number) => pad.l + (data.length === 1 ? w / 2 : (w * i) / (data.length - 1));
  const y = (v: number) => pad.t + h - (v / max) * h;

  const path = data.map((d, i) => `${i === 0 ? "M" : "L"} ${x(i)} ${y(d.average)}`).join(" ");
  const area = `${path} L ${x(data.length - 1)} ${pad.t + h} L ${x(0)} ${pad.t + h} Z`;

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="w-full">
      {/* Yatay ızgara + y ekseni etiketleri */}
      {[0, 2.5, 5, 7.5, 10].map((v) => (
        <g key={v}>
          <line x1={pad.l} y1={y(v)} x2={width - pad.r} y2={y(v)} stroke="#eceef1" strokeWidth={1} />
          <text x={pad.l - 6} y={y(v)} fontSize={9} fill="#aab2bd" textAnchor="end" dominantBaseline="middle">{v}</text>
        </g>
      ))}
      {/* Alan + çizgi */}
      <path d={area} fill="#1E6FA0" fillOpacity={0.08} />
      <path d={path} fill="none" stroke="#1E6FA0" strokeWidth={2.5} strokeLinejoin="round" />
      {/* Noktalar + dönem etiketleri */}
      {data.map((d, i) => (
        <g key={i}>
          <circle cx={x(i)} cy={y(d.average)} r={4} fill="#F2951F" stroke="#fff" strokeWidth={1.5} />
          <text x={x(i)} y={height - 8} fontSize={9} fill="#5b6472" textAnchor="middle">{d.period}</text>
        </g>
      ))}
    </svg>
  );
}
