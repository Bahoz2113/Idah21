"use client";

import Image from "next/image";
import { useId, useMemo, useState } from "react";
import {
  realMedia,
  spanClass,
  type MediaCategory,
  type RealImage,
  type RealMediaItem,
  type RealVideo,
} from "@/lib/media/real-media";
import { localizedMedia, localizedMediaFilters } from "@/lib/i18n/media";
import type { Locale } from "@/lib/i18n/config";
import { ui } from "@/lib/i18n/ui";
import { DahaFazla } from "./DahaFazla";
import { ProjectLightbox } from "./ProjectLightbox";
import { VideoModal } from "./VideoModal";

/**
 * 04 — GERÇEK ATÖLYE & SAHA DENEYİMİ
 *
 * Kurumun Batman atölyesinde ve sahada çekilmiş gerçek fotoğraf/videolarının
 * bento ızgarası. İçerik `lib/media/real-media.ts` manifest'inden gelir.
 *
 * PERFORMANS KARARI — poster öncelikli:
 * Izgaradaki video kartları video DOSYASINI YÜKLEMEZ; yalnızca poster
 * görselini gösterir. Videolar ancak kullanıcı bir kartı açtığında indirilir.
 * Altı videoyu otomatik oynatan bir ızgara, bu sayfada ~8 MB'lık istenmemiş
 * indirme demekti — üstelik çoğu ziyaretçi hiçbirini izlemeden geçiyor.
 *
 * Manifest boşken bileşen ÇÖKMEZ: planlanan çekimleri gösteren bir hangar
 * iskeletine düşer.
 *
 * AÇILIŞTA ÜÇ KAYIT. Galeri her yeni çekimle büyüyecek; hepsini birden
 * çizmek bölümü sayfanın en uzun bloğuna çevirirdi. Açılışta yalnızca
 * `oneCikan` işaretli üç VİDEO görünür — duran bir kare atölyenin ne
 * yaptığını anlatmaz, hareket anlatır. "Tümünü gör" hem kalan kayıtları
 * hem kategori filtrelerini açar; kapalıyken filtre göstermek, üç karede
 * işe yaramayan yedi düğme demekti.
 *
 * Kapalı kayıtlar DOM'da kalır (`hidden`), silinmez — gerekçesi
 * `DahaFazla` bileşeninde.
 */
export function RealMediaGrid({ locale }: { locale: Locale }) {
  const t = ui(locale);
  const [filter, setFilter] = useState<MediaCategory | "tumu">("tumu");
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [acik, setAcik] = useState(false);
  const galeriId = useId();

  // Kayıtlar dile göre: caption ve alt seçilen dilde gelir (kurucunun
  // kuralı: seçilen dilde HER yazılı içerik o dile döner).
  const tumKayitlar = useMemo(() => localizedMedia(locale), [locale]);
  const items = useMemo(
    () => (filter === "tumu" ? tumKayitlar : tumKayitlar.filter((m) => m.category === filter)),
    [filter, tumKayitlar],
  );
  const filtreler = useMemo(() => localizedMediaFilters(locale), [locale]);

  // Kapalıyken yalnızca öne çıkanlar çizilir. Filtre satırı da kapalıyken
  // gizli olduğu için `filter` her zaman "tumu"dur; yine de görünürlüğü
  // filtrelenmiş listeden hesaplıyoruz ki ikisi ayrışmasın.
  const gizliMi = (m: (typeof realMedia)[number]) => !acik && !m.oneCikan;
  const gizliSayi = acik ? 0 : items.filter((m) => !m.oneCikan).length;

  const active: RealMediaItem | null = activeIndex === null ? null : items[activeIndex] ?? null;

  const step = (delta: number) => {
    if (activeIndex === null || items.length === 0) return;
    // Uçlarda döngü: son karede "sonraki" başa döner
    setActiveIndex((activeIndex + delta + items.length) % items.length);
  };

  if (realMedia.length === 0) return <PendingMediaState locale={locale} />;

  return (
    <>
      {/* Kategori filtresi */}
      <div
        role="group"
        aria-label={t.mediaCategoryAria}
        className={`flex flex-wrap gap-2 ${acik ? "" : "hidden"}`}
      >
        {filtreler.map((f) => {
          const selected = filter === f.id;
          return (
            <button
              key={f.id}
              type="button"
              aria-pressed={selected}
              onClick={() => {
                setFilter(f.id);
                setActiveIndex(null);
              }}
              className={`rounded-full border px-4 py-2 text-[13px] font-semibold transition duration-300 ease-czr-cine ${
                selected
                  ? "border-czr-orange bg-czr-orange text-czr-base"
                  : "border-white/12 text-czr-ice/70 hover:border-czr-orange/45 hover:text-white"
              }`}
            >
              {f.id === "tumu" ? t.mediaAll : f.label}
            </button>
          );
        })}
      </div>

      {/*
        `grid-flow-row-dense`: bento ızgarasında geniş (2 kolon) bir kart
        satırın kalanına sığmadığında bir sonraki satıra düşer ve arkasında
        boş hücre bırakır. Dense yerleşim, sonraki küçük kartları o boşluklara
        geri doldurur — ızgarada delik kalmaz. Görsel sıra bozulur ama kartlar
        bağımsız olduğu için okuma sırası anlam taşımıyor.
      */}
      <div
        id={galeriId}
        className="mt-8 grid auto-rows-[200px] grid-flow-row-dense grid-cols-1 gap-4 sm:grid-cols-3 lg:auto-rows-[230px] lg:grid-cols-4"
      >
        {items.map((item, i) => {
          const isVideo = item.kind === "video";
          // Video kartında gösterilen görsel posterdir; ölçüleri de posterin.
          const thumb = isVideo ? item.poster : item.src;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveIndex(i)}
              aria-label={`${item.caption} — ${isVideo ? t.mediaPlayAction : t.mediaZoomAction}`}
              className={`czr-grade czr-grade-hover group relative overflow-hidden rounded-2xl border border-white/8 text-left transition duration-500 ease-czr-cine hover:border-czr-orange/40 ${
                spanClass[item.span ?? "normal"]
              } ${gizliMi(item) ? "hidden" : ""}`}
            >
              <Image
                src={thumb}
                alt={item.alt}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover transition-transform duration-700 ease-czr-cine group-hover:scale-105"
                loading="lazy"
              />

              <span className="absolute inset-x-4 top-4 z-20 flex items-start justify-between gap-2">
                {/* Video rozeti — süre + oynat simgesi */}
                {isVideo ? (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-white/25 bg-czr-base/70 px-2.5 py-1 czr-mono text-[10px] text-white backdrop-blur">
                    <svg viewBox="0 0 20 20" className="h-2.5 w-2.5" fill="currentColor" aria-hidden="true">
                      <path d="M6 4l10 6-10 6z" />
                    </svg>
                    {item.durationSec}
                    {t.mediaSeconds}
                  </span>
                ) : (
                  <span />
                )}

                {/*
                  Konsept etiketi — üretilmiş varlıkları gerçek çekimlerden
                  ayırır. Bölüm "Simülasyon Değil. Gerçek Atölye." diyor;
                  etiketsiz bir üretilmiş kare bu cümleyi yanlış beyana çevirir.
                */}
                {item.source === "generated" ? (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-czr-orange/40 bg-czr-base/70 px-2.5 py-1 czr-mono text-[10px] uppercase text-czr-orange backdrop-blur">
                    {t.conceptTag}
                  </span>
                ) : null}
              </span>

              {/* Etiket şeridi */}
              <span className="absolute inset-x-0 bottom-0 z-20 flex items-end justify-between gap-3 p-4">
                <span className="text-[13px] font-semibold leading-snug text-white drop-shadow">
                  {item.caption}
                </span>
                <span className="shrink-0 rounded-full border border-white/25 bg-czr-base/60 p-2 text-white backdrop-blur transition group-hover:border-czr-orange group-hover:text-czr-orange">
                  {isVideo ? (
                    <svg viewBox="0 0 20 20" className="h-3.5 w-3.5" fill="currentColor" aria-hidden="true">
                      <path d="M6 4l10 6-10 6z" />
                    </svg>
                  ) : (
                    <svg viewBox="0 0 20 20" className="h-3.5 w-3.5" fill="currentColor" aria-hidden="true">
                      <path d="M4 4h5v2H6v3H4zm7 0h5v5h-2V6h-3zm5 7v5h-5v-2h3v-3zM4 11h2v3h3v2H4z" />
                    </svg>
                  )}
                </span>
              </span>
            </button>
          );
        })}
      </div>

      <DahaFazla
        locale={locale}
        acik={acik}
        onToggle={() => setAcik((v) => !v)}
        kontrolId={galeriId}
        gizliSayi={gizliSayi}
      />

      <ProjectLightbox
        item={active?.kind === "image" ? (active as RealImage) : null}
        onClose={() => setActiveIndex(null)}
        onPrev={items.length > 1 ? () => step(-1) : undefined}
        onNext={items.length > 1 ? () => step(1) : undefined}
      />

      <VideoModal
        item={active?.kind === "video" ? (active as RealVideo) : null}
        onClose={() => setActiveIndex(null)}
        onPrev={items.length > 1 ? () => step(-1) : undefined}
        onNext={items.length > 1 ? () => step(1) : undefined}
      />
    </>
  );
}

/** Planlanan çekimler — manifest dolana kadar gösterilen hangar iskeleti. */
const PLANNED = [
  { label: "Atölye — genel görünüm", span: "sm:col-span-2 sm:row-span-2" },
  { label: "3D baskı üretim istasyonu", span: "sm:col-span-2" },
  { label: "İHA montaj tezgahı", span: "" },
  { label: "Uçuş kontrol kalibrasyonu", span: "" },
  { label: "Saha uçuş testi — video", span: "sm:col-span-2" },
  { label: "Roket fırlatma — video", span: "" },
  { label: "Robotik çalışma", span: "" },
] as const;

function PendingMediaState({ locale }: { locale: Locale }) {
  const t = ui(locale);

  return (
    <div>
      <div className="flex items-center gap-3 rounded-2xl border border-czr-orange/25 bg-czr-orange/[0.06] px-5 py-4">
        <span className="h-2 w-2 shrink-0 animate-pulse-signal rounded-full bg-czr-orange" />
        <p className="text-[13px] leading-relaxed text-czr-ice/75">
          <strong className="font-semibold text-white">{t.mediaPending}</strong>{" "}
          {t.mediaPendingBody}
        </p>
      </div>

      <div className="mt-6 grid auto-rows-[190px] grid-cols-1 gap-4 sm:grid-cols-4 lg:auto-rows-[230px]">
        {PLANNED.map((slot) => (
          <div
            key={slot.label}
            className={`relative overflow-hidden rounded-2xl border border-dashed border-white/12 bg-czr-base-alt/40 ${slot.span}`}
          >
            <div className="czr-grid-texture absolute inset-0 opacity-40" />
            <span className="absolute inset-x-0 top-0 h-1/3 animate-scan-line bg-gradient-to-b from-transparent via-czr-teal-soft/20 to-transparent" />
            <div className="relative flex h-full flex-col justify-end p-4">
              <span className="czr-mono text-[10px] uppercase text-czr-ice/35">{t.mediaSoon}</span>
              <span className="mt-1 text-[13px] font-medium text-czr-ice/55">{slot.label}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
