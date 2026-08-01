import { ORG, getFact } from "@/lib/facts";
import { Reveal } from "@/components/ui/Reveal";
import { MediaSlot } from "@/components/ui/MediaSlot";
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
      {/* Fırlatma videosu — aynalandı, duman sütunu sağda; manşetin arkası
          temiz gece gökyüzü kalıyor. WebGL dişli katmanının altında durur. */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        {/*
          Kadraj kaydırma: video 16:9. Dikey ekranda `object-cover` genişliğin
          yalnızca ~%26'sını gösteriyor ve merkez kırpması duman sütununu
          kadraj dışında bırakıyordu — arka plan boş karanlığa dönüyordu.
          Mobilde odak sağa (%78) kaydırıldı; masaüstünde merkez kalıyor.
        */}
        <MediaSlot
          slot="v1-launch"
          label="Gece yapılan model roket fırlatışı; turuncu alev ve yükselen duman sütunu."
          className="h-full w-full object-cover object-[78%_center] opacity-60 md:object-center md:opacity-55"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-void via-void/70 to-void/15 md:via-void/55 md:to-void/20" />
      </div>

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
