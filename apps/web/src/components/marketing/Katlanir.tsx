"use client";

import { useId, useState } from "react";
import type { Locale } from "@/lib/i18n/config";
import { ui } from "@/lib/i18n/ui";

/**
 * KATLANIR LİSTE — ilk N kayıt görünür, gerisi "tümünü gör" ile açılır.
 *
 * Neden gerekli: basın ve atölye bölümleri zamanla büyüyecek. Her yeni
 * haber ve her yeni video sayfaya bir blok daha ekleseydi, ziyaretçinin
 * kaydırma yolu içerik eklendikçe uzardı ve bölümler birbirini boğardı.
 * Görünen kısım sabit kalıyor; arşiv isteyene açılıyor.
 *
 * GİZLENEN İÇERİK DOM'DA KALIR. Kapalı kayıtlar `hidden` sınıfıyla
 * gizleniyor, koşullu render ile SİLİNMİYOR. İki sebep:
 *
 *   1. Arama motoru ve yanıt motorları kapalı haberleri de görür. Koşullu
 *      render edilseydi ilk üç dışındaki her haber, her video sayfadan
 *      tamamen yok olurdu — arşiv indekslenemezdi.
 *   2. Ctrl+F ile sayfa içi arama kapalı kayıtları da bulur.
 *
 * BANT GENİŞLİĞİ MALİYETİ YOK: `display:none` bir kabın içindeki
 * `loading="lazy"` görselleri tarayıcı indirmez; açılana kadar beklerler.
 *
 * Düğme yalnızca gizlenecek kayıt VARSA çizilir — üç haber varken
 * "tümünü gör" düğmesi göstermek kullanıcıyı boşa tıklatır.
 */
export function Katlanir({
  locale,
  gorunen,
  gizli,
  /** Açılınca görünecek ek bölümler (sosyal medya listesi, dipnot vb.). */
  ek,
  className = "",
}: {
  locale: Locale;
  gorunen: React.ReactNode;
  gizli: React.ReactNode;
  ek?: React.ReactNode;
  className?: string;
}) {
  const t = ui(locale);
  const [acik, setAcik] = useState(false);
  const id = useId();

  const gizliVar = Array.isArray(gizli) ? gizli.length > 0 : Boolean(gizli);

  return (
    <div className={className}>
      {gorunen}

      {gizliVar || ek ? (
        <>
          <div id={id} className={acik ? "contents" : "hidden"}>
            {gizli}
            {ek}
          </div>

          <div className="mt-8 flex justify-center">
            <button
              type="button"
              onClick={() => setAcik((v) => !v)}
              aria-expanded={acik}
              aria-controls={id}
              className="group inline-flex items-center gap-2.5 rounded-full border border-white/20 px-7 py-3 text-[13px] font-semibold uppercase tracking-wide text-white transition duration-300 ease-czr-cine hover:border-czr-orange/60 hover:bg-white/5"
            >
              {acik ? t.showLess : t.showAll}
              <svg
                viewBox="0 0 20 20"
                aria-hidden="true"
                className={`h-3.5 w-3.5 text-czr-orange transition-transform duration-300 ${
                  acik ? "rotate-180" : ""
                }`}
                fill="currentColor"
              >
                <path d="M10 13.2 3.8 7l1.4-1.4L10 10.4l4.8-4.8L16.2 7z" />
              </svg>
            </button>
          </div>
        </>
      ) : null}
    </div>
  );
}
