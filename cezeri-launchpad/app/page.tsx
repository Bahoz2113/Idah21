import { SceneMount } from "@/components/three/SceneMount";
import { SceneLabel } from "@/components/hud/Frame";
import { ORG, getFact } from "@/lib/facts";

/**
 * S01 — LAUNCHPAD (F0 iskeleti)
 *
 * Bu bir Server Component'tir. Tüm metin sunucuda render edilir; WebGL
 * yalnızca `SceneMount` sınırının arkasında istemciye iner (GEO kuralı K1).
 * Doğrulama: `curl -A "GPTBot" http://localhost:3100/ | grep "Batman'ın ilk"`
 */
export default function HomePage() {
  const firstFlight = getFact("first-vtol-and-rocket");

  return (
    <main id="icerik" className="relative min-h-svh overflow-hidden bg-void">
      {/* Dekoratif WebGL katmanı — metnin arkasında, ekran okuyuculara görünmez */}
      <div className="absolute inset-0 opacity-70">
        <SceneMount />
      </div>

      {/* Metin katmanı — sunucudan gelir, animasyon yalnızca bunu hareket ettirir */}
      <div className="relative z-10 flex min-h-svh flex-col justify-end px-6 pb-24 md:px-16 md:pb-32">
        <p className="t-mono mb-6 text-ignition">
          {ORG.legalCity} · Fırlatma Üssü
        </p>

        {/* Sinematik manşet — GÖRSEL, semantik başlık değil */}
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

        {/* Olgusal h1 — LLM'lerin ve Google'ın okuduğu satır (GEO kuralı G3) */}
        <h1 className="mt-10 max-w-2xl font-body text-lg leading-relaxed text-ash md:text-xl">
          {ORG.description}
        </h1>

        {/* Alıntılanabilir olgu + inline kaynak atfı (AC15) */}
        {firstFlight && (
          <p className="mt-6 max-w-2xl font-body text-base leading-relaxed text-ash">
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
      </div>

      <SceneLabel label="SCENE 01 / LAUNCHPAD" />
    </main>
  );
}
