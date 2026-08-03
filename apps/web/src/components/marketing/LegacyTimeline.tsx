import { legacy } from "@/lib/seo/site";
import { Reveal } from "./Reveal";

/**
 * 05 — CEZERÎ MİRASI
 *
 * Kurumun adını taşıdığı tarihsel figürle bağını kuran anlatı şeridi.
 * SEO açısından da işlevseldir: "el-Cezerî", "otomat", "kontrol mühendisliği"
 * gibi konusal olarak ilişkili terimler sayfaya doğal bağlamda girer ve
 * kurumun konu otoritesini güçlendirir.
 *
 * Dikey ray düzeni: bölüm artık marka sekansının yanında dar bir sütunda
 * duruyor; yatay dört kolonluk şerit burada okunmaz hâle gelirdi. Dikey
 * akış hem dar alanda çalışır hem kronolojiyi daha net taşır.
 */
export function LegacyTimeline() {
  return (
    <ol className="relative space-y-8">
      {/* Kronoloji rayı */}
      <span
        aria-hidden="true"
        className="absolute left-[7px] top-2 h-[calc(100%-1.5rem)] w-px bg-gradient-to-b from-czr-orange/60 via-white/12 to-transparent"
      />

      {legacy.map((item, i) => (
        <li key={item.era} className="relative pl-9">
          {/*
            Kronoloji noktası KASITLI olarak <Reveal> dışında.
            `czr-reveal` sınıfı `transform` taşır ve transform, mutlak
            konumlanan alt öğeler için yeni bir kapsayıcı blok yaratır —
            nokta Reveal içine konursa `left-0` artık <li>'nin sol kenarına
            değil, girintili içerik kutusuna hizalanır ve metnin üstüne biner.
          */}
          <span
            aria-hidden="true"
            className="absolute left-0 top-1.5 h-[15px] w-[15px] rounded-full border-2 border-czr-orange bg-czr-base"
          />

          <Reveal delay={i * 110}>
            <span className="czr-mono block text-[11px] uppercase text-czr-orange">
              {item.era}
            </span>
            <h3 className="mt-2 text-lg font-bold leading-snug text-white">{item.title}</h3>
            <p className="mt-2 text-[14px] leading-relaxed text-czr-ice/60">{item.body}</p>
          </Reveal>
        </li>
      ))}
    </ol>
  );
}
