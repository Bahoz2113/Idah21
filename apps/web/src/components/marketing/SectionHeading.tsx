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

/**
 * BÖLÜM BAŞLIĞI — editoryal masthead.
 *
 * Düzen, sinematik editoryal sayfaların klasik kurgusudur: solda büyük
 * ve sıkı bir başlık, sağda nefes alan gövde metni, ikisinin üstünde
 * ince bir künye rayı. Geniş ekranda başlık ile gövdenin YAN YANA
 * durması iki şey kazandırır — okuma ölçüsü (measure) 65 karakter
 * civarında kalır ve göz, başlıktan gövdeye dikey bir boşluk aşmadan
 * geçer.
 *
 * Dar ekranda kolonlar üst üste yığılır; orada yan yana düzen ölçüyü
 * bozar, hiyerarşiyi değil.
 *
 * Tipografi ölçeği kasıtlı olarak agresif: `clamp()` ile başlık viewport
 * ile birlikte büyür ama üst sınırı vardır, böylece çok geniş ekranda
 * satır uzunluğu kontrolden çıkmaz. Büyük punto negatif harf aralığı
 * ister — optik olarak aynı sıkılıkta görünmesi için `tracking` boyla
 * birlikte azalır.
 */
export function SectionHeading({ code, eyebrow, title, lead, align = "left" }: Props) {
  const centered = align === "center";

  return (
    // `czr-veil`: başlık bloğu hareketli sahnenin üzerinde durur; kontrast
    // tesadüfe bırakılamaz. Yerel perde, genel karartma yerine yalnızca
    // metnin arkasını koyulaştırır — dünya görünür kalır.
    <header className={`czr-veil ${centered ? "mx-auto max-w-3xl text-center" : ""}`}>
      <Reveal>
        <div className={`flex items-center gap-3.5 ${centered ? "justify-center" : ""}`}>
          <span
            aria-hidden="true"
            className="czr-mono text-[11px] tabular-nums tracking-[0.2em] text-czr-orange"
          >
            {code}
          </span>
          <span aria-hidden="true" className="h-px w-10 bg-czr-orange/35" />
          <span className="czr-mono text-[11px] uppercase tracking-[0.2em] text-czr-ice/50">
            {eyebrow}
          </span>
        </div>
      </Reveal>

      <div
        className={
          centered
            ? ""
            : "mt-7 grid gap-x-14 gap-y-6 lg:grid-cols-12 lg:items-start"
        }
      >
        {/* Kolon yerleşimi `Reveal` sarmalayıcısına verilir: ızgaranın
            çocukları h2/p değil, onları saran elemanlardır. */}
        <Reveal delay={80} className={centered ? "mt-6" : "lg:col-span-7"}>
          <h2 className="czr-display text-white">{title}</h2>
        </Reveal>

        {lead ? (
          <Reveal delay={160} className={centered ? "mt-5" : "lg:col-span-5 lg:pt-3"}>
            <p className="max-w-prose text-pretty text-[15px] leading-[1.75] text-czr-ice/70 sm:text-[17px]">
              {lead}
            </p>
          </Reveal>
        ) : null}
      </div>
    </header>
  );
}
