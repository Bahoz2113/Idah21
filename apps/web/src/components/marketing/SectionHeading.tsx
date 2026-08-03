import type { ReactNode } from "react";
import { Reveal } from "./Reveal";

type Props = {
  /** Kontrol merkezi hissi veren bölüm kodu — dekoratif, okuyucudan gizlenir. */
  code: string;
  eyebrow: string;
  title: ReactNode;
  /**
   * "Answer-first" paragraf. GEO açısından kritik: üretken arama motorları
   * bağlamdan koparıp alıntılayabileceği, kendi kendine yeterli açılış
   * cümleleri arar. Her bölüm bu yüzden tanımla başlar.
   */
  lead?: string;
  align?: "left" | "center";
};

export function SectionHeading({ code, eyebrow, title, lead, align = "left" }: Props) {
  const centered = align === "center";

  return (
    <header className={`max-w-3xl ${centered ? "mx-auto text-center" : ""}`}>
      <Reveal>
        <div
          className={`flex items-center gap-3 ${centered ? "justify-center" : ""}`}
        >
          <span aria-hidden="true" className="czr-mono text-[11px] text-czr-orange">
            {code}
          </span>
          <span aria-hidden="true" className="h-px w-8 bg-czr-orange/40" />
          <span className="czr-mono text-[11px] uppercase text-czr-ice/55">
            {eyebrow}
          </span>
        </div>
      </Reveal>

      <Reveal delay={80}>
        <h2 className="mt-5 text-balance text-3xl font-bold leading-[1.1] tracking-tight text-white sm:text-4xl lg:text-5xl">
          {title}
        </h2>
      </Reveal>

      {lead ? (
        <Reveal delay={160}>
          <p className="mt-5 text-pretty text-base leading-relaxed text-czr-ice/70 sm:text-lg">
            {lead}
          </p>
        </Reveal>
      ) : null}
    </header>
  );
}
