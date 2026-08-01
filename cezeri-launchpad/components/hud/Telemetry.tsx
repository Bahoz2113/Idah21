"use client";

import { useEffect, useState } from "react";
import { ORG } from "@/lib/facts";

const COORDS = `${ORG.geo.latitude.toFixed(4)}°N ${ORG.geo.longitude.toFixed(4)}°E`;

/**
 * Sağ üst telemetri: sabit koordinat + canlı UTC+3 saati.
 *
 * Saat yalnızca mount sonrası basılır — sunucu ve istemci saatinin
 * farklı olması hidrasyon uyuşmazlığı üretir. Koordinat ise sunucudan gelir.
 */
export function Telemetry() {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    const tick = () =>
      setTime(
        new Intl.DateTimeFormat("tr-TR", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
          timeZone: "Europe/Istanbul",
        }).format(new Date()),
      );
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed z-40 hidden text-right md:block"
      style={{
        right: "calc(var(--hud-inset) + 12px)",
        top: "calc(var(--hud-inset) + 12px)",
      }}
    >
      <span className="t-mono block text-ash">{COORDS}</span>
      <span className="t-mono block text-ignition tabular-nums">
        UTC+3 {time ?? "--:--:--"}
      </span>
    </div>
  );
}
