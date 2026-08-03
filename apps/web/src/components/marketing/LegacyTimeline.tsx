import { legacy } from "@/lib/seo/site";
import { Reveal } from "./Reveal";

/**
 * 05 — CEZERÎ MİRASI
 *
 * Kurumun adını taşıdığı tarihsel figürle bağını kuran anlatı şeridi.
 * SEO açısından da işlevseldir: "el-Cezerî", "otomat", "kontrol mühendisliği"
 * gibi konusal olarak ilişkili terimler sayfaya doğal bağlamda girer ve
 * kurumun konu otoritesini güçlendirir.
 */
export function LegacyTimeline() {
  return (
    <ol className="relative grid grid-cols-1 gap-8 md:grid-cols-4 md:gap-6">
      {/* Bağlantı çizgisi — masaüstünde kartları birleştirir */}
      <span
        aria-hidden="true"
        className="absolute left-[7px] top-2 hidden h-[calc(100%-1rem)] w-px bg-gradient-to-b from-czr-orange/50 via-white/12 to-transparent md:left-0 md:top-[7px] md:h-px md:w-full md:bg-gradient-to-r"
      />

      {legacy.map((item, i) => (
        <li key={item.era} className="relative pl-8 md:pl-0 md:pt-8">
          <Reveal delay={i * 110}>
            <span
              aria-hidden="true"
              className="absolute left-0 top-1.5 h-[15px] w-[15px] rounded-full border-2 border-czr-orange bg-czr-base md:top-0"
            />

            <span className="czr-mono block text-[11px] uppercase text-czr-orange">
              {item.era}
            </span>
            <h3 className="mt-3 text-lg font-bold leading-snug text-white">{item.title}</h3>
            <p className="mt-2.5 text-[14px] leading-relaxed text-czr-ice/60">{item.body}</p>
          </Reveal>
        </li>
      ))}
    </ol>
  );
}
