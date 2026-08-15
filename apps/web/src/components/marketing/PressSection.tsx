"use client";

import Image from "next/image";
import { useId, useState } from "react";
import type { Locale } from "@/lib/i18n/config";
import { ui, type UiStrings } from "@/lib/i18n/ui";
import { press, type PressItem } from "@/lib/seo/site";
import { localizedPress } from "@/lib/i18n/press";
import { DahaFazla } from "./DahaFazla";
import { Reveal } from "./Reveal";

/**
 * BASINDA BİZ.
 *
 * Yerel basında çıkan haberler ve sosyal paylaşımlar, kurumun kendi
 * anlattığından farklı bir güven katmanıdır: üçüncü taraf doğrulaması.
 *
 * Kartlarda görünen fotoğraflar HABERİN kendi görselleri değildir —
 * yayınların görselleri bize ait değil. Her karede "CEZERİ ROBOTECH
 * arşivi" kredisi basılır; gazetecilikte dosya fotoğrafı ne ise odur.
 * Bu ayrım okuyucuya görünür olmalı, yoksa kaynağın fotoğrafıymış gibi
 * okunur.
 *
 * Haberler ve sosyal paylaşımlar ayrı listelenir; ikisi aynı ağırlıkta
 * değildir ve karıştırmak haber kaynağının değerini düşürür.
 *
 * İLK ÜÇ HABER GÖRÜNÜR, GERİSİ AÇILIR. Arşiv büyüdükçe bölüm sayfayı
 * şişirmesin diye. Görünen üç kayıt `lib/seo/site.ts` içindeki sıranın
 * ilk üçüdür ve kasıtlı seçildi: iki milletvekili ziyareti ve valinin
 * katıldığı yarışma. Kapalı kayıtlar DOM'da kalır (`hidden`), silinmez —
 * gerekçesi `DahaFazla` bileşeninde.
 */

/** Ana ekranda görünen haber kartı sayısı. */
const ILK_GORUNEN = 3;

type Item = PressItem;

function PressCard({
  item,
  index,
  t,
  gizli,
}: {
  item: Item;
  index: number;
  t: UiStrings;
  gizli: boolean;
}) {
  return (
    <li className={gizli ? "hidden" : undefined}>
      <Reveal delay={Math.min(index, 5) * 70}>
        <article className="czr-glass-panel czr-rim group relative h-full overflow-hidden rounded-2xl">
          {item.image ? (
            // Galeri tonlaması (`czr-grade`) bu kırpımda fotoğrafı
            // neredeyse siyaha indiriyordu. Kartlarda yalnızca alt kenara
            // inen hafif bir perde var: kredi çipini okunur kılar, görüntüyü
            // karartmaz.
            <div className="relative aspect-[4/3] overflow-hidden">
              <Image
                src={item.image}
                alt={item.imageAlt ?? ""}
                width={item.imageWidth ?? 800}
                height={item.imageHeight ?? 600}
                sizes="(min-width: 1024px) 380px, (min-width: 640px) 45vw, 90vw"
                loading="lazy"
                className="h-full w-full object-cover saturate-[0.92] transition-transform duration-[900ms] ease-czr-cine group-hover:scale-[1.04]"
              />

              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-gradient-to-t from-czr-base/85 via-czr-base/10 to-transparent"
              />

              {/* Arşiv kredisi — haberin fotoğrafı sanılmasın */}
              <span className="absolute bottom-2 right-2 z-10 rounded-full bg-czr-base/75 px-2 py-0.5 czr-mono text-[9px] uppercase tracking-[0.12em] text-czr-ice/70 backdrop-blur">
                {t.pressArchiveCredit}
              </span>

              {item.video ? (
                <span className="absolute left-3 top-3 z-10 inline-flex items-center gap-1.5 rounded-full border border-czr-orange/45 bg-czr-base/75 px-2.5 py-1 czr-mono text-[10px] uppercase tracking-[0.12em] text-czr-orange backdrop-blur">
                  <svg aria-hidden="true" viewBox="0 0 20 20" className="h-3 w-3" fill="currentColor">
                    <path d="M7 4.5v11l9-5.5-9-5.5z" />
                  </svg>
                  Video
                </span>
              ) : null}
            </div>
          ) : null}

          <div className="flex flex-col gap-3 p-6">
            <span className="czr-mono text-[10px] uppercase tracking-[0.16em] text-czr-orange">
              {item.outlet}
            </span>

            <h4 className="text-balance text-[17px] font-bold leading-snug text-white">
              {item.title}
            </h4>

            {item.summary ? (
              <p className="text-[14px] leading-relaxed text-czr-ice/65">{item.summary}</p>
            ) : null}

            <div className="mt-1 flex flex-wrap items-center gap-2.5">
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-white/14 px-3.5 py-1.5 text-[12px] font-semibold text-czr-ice transition duration-300 ease-czr-cine hover:border-czr-orange/50 hover:text-czr-orange"
              >
                {t.pressRead}
                <svg aria-hidden="true" viewBox="0 0 20 20" className="h-3 w-3" fill="currentColor">
                  <path d="M6 4h10v10h-2V7.4L5.7 15.7 4.3 14.3 12.6 6H6V4z" />
                </svg>
              </a>

              {item.video ? (
                <a
                  href={item.video}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-czr-launch px-3.5 py-1.5 text-[12px] font-bold text-czr-base transition duration-300 ease-czr-cine hover:-translate-y-0.5"
                >
                  <svg aria-hidden="true" viewBox="0 0 20 20" className="h-3 w-3" fill="currentColor">
                    <path d="M7 4.5v11l9-5.5-9-5.5z" />
                  </svg>
                  {t.pressVideo}
                </a>
              ) : null}
            </div>
          </div>
        </article>
      </Reveal>
    </li>
  );
}

function SocialRow({ item, index, t }: { item: Item; index: number; t: UiStrings }) {
  return (
    <li>
      <Reveal delay={Math.min(index, 5) * 60}>
        <a
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex flex-col gap-1.5 py-5 sm:flex-row sm:items-baseline sm:gap-6"
        >
          <span className="czr-mono shrink-0 text-[11px] uppercase tracking-[0.14em] text-czr-orange sm:w-48">
            {item.outlet}
          </span>

          <span className="min-w-0 flex-1">
            <span className="block text-[15px] font-semibold text-white transition-colors duration-300 group-hover:text-czr-orange">
              {item.title}
            </span>
            {item.summary ? (
              <span className="mt-1 block text-[13px] leading-relaxed text-czr-ice/55">
                {item.summary}
              </span>
            ) : null}
          </span>

          <span
            aria-hidden="true"
            className="shrink-0 text-czr-ice/40 transition duration-300 ease-czr-cine group-hover:translate-x-0.5 group-hover:text-czr-orange"
          >
            <svg viewBox="0 0 20 20" className="h-4 w-4" fill="currentColor">
              <path d="M6 4h10v10h-2V7.4L5.7 15.7 4.3 14.3 12.6 6H6V4z" />
            </svg>
          </span>
        </a>
      </Reveal>
    </li>
  );
}

export function PressSection({ locale }: { locale: Locale }) {
  const t = ui(locale);
  const [acik, setAcik] = useState(false);
  const arsivId = useId();
  // Başlık ve özetler dile göre; kaynak adları özel isimdir, çevrilmez.
  const kayitlar = localizedPress(locale);
  const haberler = kayitlar.filter((p) => p.kind === "haber");
  const sosyal = kayitlar.filter((p) => p.kind === "sosyal");
  // Gizlenen: ilk üçün dışındaki haberler + sosyal paylaşımların tamamı.
  const gizliSayi = Math.max(0, haberler.length - ILK_GORUNEN) + sosyal.length;

  if (press.length === 0) {
    return (
      <Reveal>
        <p className="czr-glass-panel mt-12 rounded-2xl px-6 py-8 text-[15px] leading-relaxed text-czr-ice/60">
          {t.pressEmpty}
        </p>
      </Reveal>
    );
  }

  return (
    <div className="mt-12">
      {haberler.length > 0 ? (
        <section aria-labelledby="basin-haber">
          <Reveal>
            <h3
              id="basin-haber"
              className="czr-mono text-[10px] uppercase tracking-[0.18em] text-czr-ice/45"
            >
              {t.pressNewsAndPapers}
            </h3>
          </Reveal>

          <ul id={arsivId} className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {haberler.map((item, i) => (
              <PressCard
                key={item.url}
                item={item}
                index={i}
                t={t}
                gizli={!acik && i >= ILK_GORUNEN}
              />
            ))}
          </ul>
        </section>
      ) : null}

      {sosyal.length > 0 ? (
        <section
          aria-labelledby="basin-sosyal"
          className={`mt-14 ${acik ? "" : "hidden"}`}
        >
          <Reveal>
            <h3
              id="basin-sosyal"
              className="czr-mono text-[10px] uppercase tracking-[0.18em] text-czr-ice/45"
            >
              {t.pressSocial}
            </h3>
          </Reveal>
          <ul className="mt-4 divide-y divide-white/8 border-y border-white/8">
            {sosyal.map((item, i) => (
              <SocialRow key={item.url} item={item} index={i} t={t} />
            ))}
          </ul>
        </section>
      ) : null}

      <DahaFazla
        locale={locale}
        acik={acik}
        onToggle={() => setAcik((v) => !v)}
        kontrolId={arsivId}
        gizliSayi={gizliSayi}
      />

      <Reveal>
        <p className={`mt-8 text-[12px] leading-relaxed text-czr-ice/40 ${acik ? "" : "hidden"}`}>
          {t.pressPhotoNote}
        </p>
      </Reveal>
    </div>
  );
}
