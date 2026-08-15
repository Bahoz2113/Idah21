"use client";

import type { Locale } from "@/lib/i18n/config";
import { ui } from "@/lib/i18n/ui";

/**
 * "TÜMÜNÜ GÖR" DÜĞMESİ.
 *
 * Basın ve atölye bölümleri zamanla büyüyecek; her yeni haber ve her yeni
 * video sayfaya bir blok daha eklerse ziyaretçinin kaydırma yolu içerik
 * eklendikçe uzar ve bölümler birbirini boğar. Görünen kısım sabit kalır,
 * arşiv isteyene açılır.
 *
 * NEDEN YALNIZCA DÜĞME. Gizlenen kayıtlar ızgaranın (`ul.grid`) doğrudan
 * çocuklarıdır; araya bir sarmalayıcı `<div>` koymak hem geçersiz HTML
 * (ul içinde div) hem de ızgara yerleşimini bozardı. Bu yüzden açık/kapalı
 * durumu bölümün kendisinde durur ve gizlenecek öğelere tek tek `hidden`
 * verilir; buradan yalnızca düğme gelir.
 *
 * GİZLENEN İÇERİK DOM'DA KALIR — koşullu render ile SİLİNMEZ:
 *   1. Arama motorları ve yanıt motorları kapalı kayıtları da görür.
 *      Silinseydi ilk üç dışındaki her haber ve video sayfadan tamamen
 *      yok olur, arşiv hiç indekslenmezdi.
 *   2. Ctrl+F ile sayfa içi arama kapalı kayıtları da bulur.
 *
 * Bant genişliği maliyeti yok: `display:none` bir kabın içindeki
 * `loading="lazy"` görselleri tarayıcı açılana kadar indirmez.
 */
export function DahaFazla({
  locale,
  acik,
  onToggle,
  kontrolId,
  /** Kapalıyken kaç kayıt gizli — düğmede sayı olarak görünür. */
  gizliSayi,
}: {
  locale: Locale;
  acik: boolean;
  onToggle: () => void;
  kontrolId: string;
  gizliSayi: number;
}) {
  const t = ui(locale);
  if (gizliSayi <= 0) return null;

  return (
    <div className="mt-9 flex justify-center">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={acik}
        aria-controls={kontrolId}
        className="inline-flex items-center gap-2.5 rounded-full border border-white/20 px-7 py-3 text-[13px] font-semibold uppercase tracking-wide text-white transition duration-300 ease-czr-cine hover:border-czr-orange/60 hover:bg-white/5"
      >
        {acik ? t.showLess : t.showAll}
        {/* Sayı yalnızca kapalıyken: açıkken "gizli" diye bir şey kalmıyor
            ve rakamı orada bırakmak yanlış bilgi olurdu. */}
        {acik ? null : (
          <span className="czr-mono rounded-full bg-czr-orange/15 px-2 py-0.5 text-[11px] tabular-nums text-czr-orange">
            +{gizliSayi}
          </span>
        )}
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
  );
}
