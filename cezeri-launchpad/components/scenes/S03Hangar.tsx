import Link from "next/link";
import { LABS } from "@/lib/content";
import { MediaSlot } from "@/components/ui/MediaSlot";
import { ScrollScene } from "./ScrollScene";
import { HangarDoors } from "./HangarDoors";

/**
 * S03 — HANGAR
 *
 * Üç hangar kapısı scroll ile sırayla açılır. Kapı animasyonu
 * `HangarDoors` istemci sarmalayıcısında; içerik burada, sunucuda üretilir.
 * WebGL yok — saf CSS `clip-path`.
 */
export function S03Hangar() {
  return (
    <ScrollScene id="s03" index={2} length={4}>
      <HangarDoors>
        <div className="relative h-full">
          {LABS.map((lab, i) => (
            <article
              key={lab.slug}
              data-door={i}
              className="absolute inset-0 flex items-center px-6 md:px-16"
              style={{ opacity: i === 0 ? 1 : 0 }}
            >
              {/* Arka plan medya slot'u — kapı arkası */}
              <div className="pointer-events-none absolute inset-0 -z-10">
                <MediaSlot
                  slot={lab.mediaSlot}
                  label={`${lab.title} — laboratuvar görüntüsü`}
                  className="h-full w-full opacity-30"
                />
              </div>

              {/* Uyarı şeridi */}
              <div
                aria-hidden="true"
                className="absolute inset-x-0 top-0 h-2"
                style={{
                  backgroundImage:
                    "repeating-linear-gradient(45deg, #ff6f00 0 12px, #121212 12px 24px)",
                }}
              />

              <div className="max-w-xl">
                <p className="t-mono mb-4 text-ignition">
                  Hangar {lab.code} — {String(i + 1).padStart(2, "0")} / 03
                </p>
                <h2 className="t-display-l mb-4 text-cyber">{lab.title}</h2>
                <p className="t-mono mb-6 text-ash">{lab.subtitle}</p>
                <p className="mb-8 max-w-md font-body leading-relaxed text-ash">
                  {lab.summary}
                </p>

                <ul className="mb-8 flex flex-wrap gap-x-4 gap-y-2">
                  {lab.equipment.map((e) => (
                    <li
                      key={e}
                      className="t-mono border border-[var(--hairline)] px-3 py-1 text-ash"
                    >
                      {e}
                    </li>
                  ))}
                </ul>

                <Link
                  href={`/laboratuvarlar/${lab.slug}`}
                  className="t-mono inline-block border border-ignition px-5 py-2.5 text-ignition transition-colors hover:bg-ignition hover:text-void"
                >
                  Laboratuvarı incele →
                </Link>
              </div>
            </article>
          ))}
        </div>
      </HangarDoors>
    </ScrollScene>
  );
}
