import { ORG, getFact } from "@/lib/facts";
import { Reveal } from "@/components/ui/Reveal";
import { ScrollScene } from "./ScrollScene";

/**
 * S01 — LAUNCHPAD
 *
 * Sunucu bileşeni. Tüm metin ham HTML'de bulunur; WebGL katmanı sayfa
 * seviyesinde ayrı mount edilir ve bu sahnenin arkasında durur.
 */
export function S01Launchpad() {
  const firstFlight = getFact("first-vtol-and-rocket");

  return (
    <ScrollScene id="s01" index={0} length={3} progressKey="launchpad">
      <div className="relative flex h-full flex-col justify-end px-6 pb-24 md:px-16 md:pb-32">
        <Reveal>
          <p className="t-mono mb-6 text-ignition">
            <span className="line-mask">
              <span>{ORG.legalCity} · Fırlatma Üssü</span>
            </span>
          </p>

          {/* Sinematik manşet — GÖRSEL. Semantik başlık aşağıdaki h1'dir. */}
          <p className="t-display-xl max-w-5xl text-cyber" aria-hidden="true">
            <span className="line-mask">
              <span>Batman&apos;da</span>
            </span>
            <span className="line-mask">
              <span>Geleceği</span>
            </span>
            <span className="line-mask">
              <span>İnşa Ediyoruz</span>
            </span>
          </p>
        </Reveal>

        {/* Olgusal h1 — LLM ve arama motorlarının okuduğu satır (GEO kuralı G3) */}
        <h1 className="mt-10 max-w-2xl font-body text-lg leading-relaxed text-ash md:text-xl">
          {ORG.description}
        </h1>

        {firstFlight && (
          <p className="mt-5 max-w-2xl font-body leading-relaxed text-ash">
            {firstFlight.statement}{" "}
            {firstFlight.sources.map((s, i) => (
              <cite key={s.url} className="not-italic">
                {i > 0 && " · "}
                <a
                  href={s.url}
                  rel="noopener"
                  className="text-ignition underline underline-offset-4"
                >
                  {s.publisher}
                </a>
              </cite>
            ))}
          </p>
        )}

        <p className="t-mono mt-12 text-ash" aria-hidden="true">
          ↓ Kaydırarak fırlatma sekansını başlat
        </p>
      </div>
    </ScrollScene>
  );
}
