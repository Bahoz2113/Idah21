import type { Locale } from "@/lib/i18n/config";
import { localizedLegacy } from "@/lib/i18n/view";
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
 *
 * BAŞLIK SEVİYESİ h4. Kronoloji, "Biz Kimiz" bölümünün "Adımızın
 * Hikâyesi" alt başlığının (h4'ün bir üstü, h3) altında duruyor. h3
 * kalsaydı ekran okuyucu bu dört kaydı bölümün alt başlığıyla aynı
 * düzeye koyar ve belge ana hattı yanlış kurulurdu.
 */
export function LegacyTimeline({ locale }: { locale: Locale }) {
  const legacy = localizedLegacy(locale);

  return (
    <ol className="relative space-y-8">
      {/* Kronoloji rayı */}
      <span
        aria-hidden="true"
        className="absolute start-[7px] top-2 h-[calc(100%-1.5rem)] w-px bg-gradient-to-b from-czr-orange/60 via-white/12 to-transparent"
      />

      {legacy.map((item, i) => (
        <li key={item.era} className="relative ps-9">
          {/*
            Kronoloji noktası KASITLI olarak <Reveal> dışında.
            `czr-reveal` sınıfı `transform` taşır ve transform, mutlak
            konumlanan alt öğeler için yeni bir kapsayıcı blok yaratır —
            nokta Reveal içine konursa `start-0` artık <li>'nin kenarına
            değil, girintili içerik kutusuna hizalanır ve metnin üstüne biner.
          */}
          <span
            aria-hidden="true"
            className="absolute start-0 top-1.5 h-[15px] w-[15px] rounded-full border-2 border-czr-orange bg-czr-base"
          />

          <Reveal delay={i * 110}>
            <span className="czr-mono block text-[11px] uppercase text-czr-orange">
              {item.era}
            </span>
            <h4 className="mt-2 text-lg font-bold leading-snug text-white">{item.title}</h4>
            <p className="mt-2 text-[14px] leading-relaxed text-czr-ice/60">{item.body}</p>
          </Reveal>
        </li>
      ))}
    </ol>
  );
}
