import { METHOD_STAGES } from "@/lib/content";
import { MethodGears } from "./MethodGears";
import { ScrollScene } from "./ScrollScene";

/**
 * S06 — ÖĞRENMENİN MEKANİĞİ
 *
 * Üç SVG dişli scroll yönüne göre zıt yönlerde döner (1:2:3 oranı).
 * Metin ve aşama listesi sunucudan gelir; dişliler saf SVG — WebGL yok.
 */
export function S06Methodology() {
  return (
    <ScrollScene id="s06" index={5} length={2.5}>
      <div className="relative flex h-full items-center px-6 md:px-16">
        <MethodGears />

        <div className="relative z-10 max-w-2xl">
          <p className="t-mono mb-4 text-ignition">06 / Metodoloji</p>
          <h2 className="t-display-l mb-8 max-w-xl text-cyber">
            Ezber yok. Tasarım, prototipleme ve gerçek uçuş var.
          </h2>

          <ol className="space-y-0 border-t border-[var(--hairline)]">
            {METHOD_STAGES.map((stage) => (
              <li
                key={stage.no}
                data-stage
                className="border-b border-[var(--hairline)] py-5"
              >
                <div className="flex items-baseline gap-5">
                  <span className="t-mono shrink-0 text-ignition">{stage.no}</span>
                  <div>
                    <h3 className="font-display text-2xl font-bold uppercase text-cyber">
                      {stage.title}
                    </h3>
                    <p className="mt-1.5 font-body leading-relaxed text-ash">
                      {stage.body}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </ScrollScene>
  );
}
