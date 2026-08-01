import { getFact, FLIGHT_TELEMETRY } from "@/lib/facts";
import { AscentRail } from "./AscentRail";
import { ScrollScene } from "./ScrollScene";

/**
 * S04 — İLK FIRLATIŞ
 *
 * Sahne doğrulanmış olaya dayanır: Batman'ın ilk model roket fırlatışı.
 * Sayısal telemetri `lib/facts.ts`'te `null` olduğu sürece GÖSTERİLMEZ —
 * uydurma rakam basmaktansa satırı hiç açmayız (AC10).
 */
export function S04FirstLaunch() {
  const fact = getFact("first-vtol-and-rocket");
  const t = FLIGHT_TELEMETRY;
  const hasNumbers = t.apogeeMeters !== null;

  return (
    <ScrollScene id="s04" index={3} length={3.5} progressKey="ascent">
      <div className="relative h-full overflow-hidden">
        {/* Gökyüzü: lacivertten kömüre — scroll ile AscentRail tarafından sürülür */}
        <div
          data-sky
          aria-hidden="true"
          className="absolute inset-0 -z-10"
          style={{
            background:
              "linear-gradient(to top, #1a237e 0%, #0d1240 45%, #121212 100%)",
          }}
        />

        <AscentRail />

        <div className="relative flex h-full items-center justify-end px-6 md:px-16">
          <div className="max-w-lg">
            <p className="t-mono mb-4 text-ignition">04 / İlk Fırlatış</p>
            <h2 className="t-display-l mb-8 text-cyber">Batman&apos;ın ilki</h2>

            {fact && (
              <p className="mb-10 font-body leading-relaxed text-ash">
                {fact.statement}{" "}
                {fact.sources.map((s, i) => (
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

            {/* Uçuş kartı — yalnızca doğrulanmış alanlar */}
            <dl className="border border-[var(--hairline)] bg-void/70 p-6 backdrop-blur-sm">
              <div className="flex justify-between gap-6 border-b border-[var(--hairline)] pb-3">
                <dt className="t-mono text-ash">Olay</dt>
                <dd className="t-mono text-right text-cyber">
                  Batman&apos;ın ilk model roket fırlatışı
                </dd>
              </div>
              <div className="flex justify-between gap-6 border-b border-[var(--hairline)] py-3">
                <dt className="t-mono text-ash">Organizasyon</dt>
                <dd className="t-mono text-right text-cyber">
                  Yediiki Robot ve Teknoloji Yarışması
                </dd>
              </div>
              <div className="flex justify-between gap-6 border-b border-[var(--hairline)] py-3">
                <dt className="t-mono text-ash">Ekip</dt>
                <dd className="t-mono text-right text-cyber">Cezeri Robotech</dd>
              </div>

              {hasNumbers && (
                <>
                  <div className="flex justify-between gap-6 border-b border-[var(--hairline)] py-3">
                    <dt className="t-mono text-ash">Apogee</dt>
                    <dd className="t-mono text-right text-ignition tabular-nums">
                      {t.apogeeMeters} m
                    </dd>
                  </div>
                  {t.maxSpeedKmh !== null && (
                    <div className="flex justify-between gap-6 border-b border-[var(--hairline)] py-3">
                      <dt className="t-mono text-ash">Maks. hız</dt>
                      <dd className="t-mono text-right text-ignition tabular-nums">
                        {t.maxSpeedKmh} km/h
                      </dd>
                    </div>
                  )}
                </>
              )}

              <div className="flex justify-between gap-6 pt-3">
                <dt className="t-mono text-ash">Kurtarma</dt>
                <dd className="t-mono text-right text-ignition">
                  {t.recovery} / NOMINAL
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </ScrollScene>
  );
}
