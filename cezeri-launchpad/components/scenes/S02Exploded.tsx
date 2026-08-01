import { DRONE_PARTS } from "@/lib/content";
import { Reveal } from "@/components/ui/Reveal";
import { ScrollScene } from "./ScrollScene";

/**
 * S02 — OTONOM SİSTEM ANATOMİSİ
 *
 * WebGL katmanındaki İHA scroll ile parçalarına ayrılır; bu bileşen o
 * parçaların etiketlerini taşır. Etiketler sunucudan gelir ve WebGL
 * yoksa da tam okunur bir teknik liste olarak durur.
 */
export function S02Exploded() {
  return (
    <ScrollScene id="s02" index={1} length={2.5} progressKey="exploded">
      <div className="relative flex h-full items-center px-6 md:px-16">
        <div className="w-full md:max-w-md">
          <Reveal>
            <p className="t-mono mb-4 text-ignition">
              <span className="line-mask">
                <span>02 / Anatomi</span>
              </span>
            </p>
            <h2 className="t-display-l mb-8 text-cyber">
              <span className="line-mask">
                <span>Otonom</span>
              </span>
              <span className="line-mask">
                <span>Sistem</span>
              </span>
            </h2>
          </Reveal>

          <p className="mb-10 max-w-sm font-body leading-relaxed text-ash">
            Bir insansız hava aracı tek parça değildir. Öğrenciler her bileşeni
            ayrı ayrı tasarlar, test eder ve birleştirir.
          </p>

          <ul className="space-y-0 border-t border-[var(--hairline)]">
            {DRONE_PARTS.map((part) => (
              <li
                key={part.no}
                className="group flex items-baseline gap-4 border-b border-[var(--hairline)] py-3 transition-colors hover:bg-navy/20"
              >
                <span className="t-mono w-6 shrink-0 text-ignition">{part.no}</span>
                <span className="font-body text-cyber">{part.name}</span>
                <span className="t-mono ml-auto text-right text-ash">{part.spec}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </ScrollScene>
  );
}
