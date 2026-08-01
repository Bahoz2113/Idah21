"use client";

import { useEffect, useState } from "react";
import { SCENES } from "@/lib/scenes";
import { subscribeActiveScene } from "@/lib/sceneState";

/**
 * Sağ kenarda dikey ilerleme rayı + sahne atlama.
 *
 * 900vh'lik bir scroll kullanıcıyı yorabilir; bu ray hem konum bildirir hem
 * de tıklanarak sahne atlamaya izin verir. Klavye ile de erişilebilir.
 */
export function ProgressRail() {
  const [active, setActive] = useState(0);

  useEffect(() => subscribeActiveScene(setActive), []);

  return (
    <nav
      aria-label="Sahne navigasyonu"
      className="fixed z-40 hidden -translate-y-1/2 flex-col gap-3 md:flex"
      style={{ right: "calc(var(--hud-inset) + 14px)", top: "50%" }}
    >
      {SCENES.map((scene, i) => (
        <a
          key={scene.id}
          href={`#${scene.id}`}
          aria-label={`Sahne ${scene.label}`}
          aria-current={i === active ? "true" : undefined}
          className="group flex items-center justify-end gap-2"
        >
          <span className="t-mono pointer-events-none whitespace-nowrap text-ash opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
            {scene.label}
          </span>
          <span
            className={`block h-px transition-all duration-300 ${
              i === active ? "w-6 bg-ignition" : "w-3 bg-ash/40 group-hover:w-5"
            }`}
          />
        </a>
      ))}
    </nav>
  );
}
