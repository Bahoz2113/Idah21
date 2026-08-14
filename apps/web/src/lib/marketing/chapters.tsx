import type { ReactNode } from "react";
import { BaseMap } from "@/components/marketing/BaseMap";
import { AboutSection } from "@/components/marketing/AboutSection";
import { ContactChannels } from "@/components/marketing/ContactChannels";
import { CurriculumSection } from "@/components/marketing/CurriculumSection";
import { FaqAccordion } from "@/components/marketing/FaqAccordion";
import { PressSection } from "@/components/marketing/PressSection";
import { RealMediaGrid } from "@/components/marketing/RealMediaGrid";
import { Reveal } from "@/components/marketing/Reveal";
import { TrainingCatalog } from "@/components/marketing/TrainingCatalog";
import type { Locale } from "@/lib/i18n/config";
import { content } from "@/lib/i18n/content";
import { ui } from "@/lib/i18n/ui";
import { contact } from "@/lib/seo/site";

/**
 * BÖLÜMLERİN TEK KAYNAĞI.
 *
 * Metinler bileşenlerin içinde ayrı ayrı dursaydı
 * er ya da geç ayrışırlardı — birinde düzeltilen bir cümle öbüründe
 * eski hâliyle kalırdı ve iki sayfa aynı kurumu farklı anlatmaya
 * başlardı. Bu yüzden BAŞLIK YAPISI burada, tek yerde durur; metnin
 * kendisi `lib/i18n/content` altındaki dört sözlükten gelir.
 *
 * ARTIK BİR FONKSİYON. Önce sabit bir diziydi ve metinler doğrudan
 * içine yazılmıştı; dil eklendiğinde aynı dizinin dört kopyası gerekirdi.
 * Şimdi dili alıp o dilin bölümlerini üretiyor — yapı tek, metin dörde
 * ayrılıyor.
 *
 * BAŞLIK ÜÇ PARÇADAN KURULUR. Tasarımda başlığın bir kelimesi turuncudur.
 * Bu daha önce JSX'in içine gömülüydü (`<span className="text-czr-orange">`)
 * ve çevrilemezdi. Vurgulanan kelime her dilde aynı sırada olmadığı için —
 * Arapçada cümlenin başına, İngilizcede ortasına düşebilir — metin
 * `titleLead` / `titleAccent` / `titleTail` olarak üçe bölündü ve renk
 * burada, ortadaki parçaya uygulanıyor. Kullanılmayan parça boş dizedir
 * ve hiç basılmaz.
 *
 * `body` bilerek `ReactNode` — bölümlerin gövdesi düz metin değil,
 * kendi etkileşimini taşıyan bileşenlerdir (katalog, müfredat akordeonu,
 * basın kartları, iletişim kanalları).
 */

export type Chapter = {
  /** Bölüm kimliği; menü bağlantıları ve durak rayı buna bakar. */
  id: string;
  /** `aria-labelledby` hedefi — başlık içindeki span'in id'si. */
  headingId: string;
  code: string;
  eyebrow: string;
  title: ReactNode;
  lead: string;
  body: ReactNode;
  /** İçerik kolonunun genişliği; SSS dar kolonda okunur. */
  width?: "wide" | "narrow";
};

/** Üç parçalı başlığı vurgulu kelimesiyle birlikte kurar. */
function chapterTitle(
  headingId: string,
  parts: { titleLead: string; titleAccent: string; titleTail: string },
  /** Uzun başlıklarda geniş ekranda kırılma noktası. */
  breakBeforeAccent = false,
) {
  return (
    <span id={headingId}>
      {parts.titleLead}
      {parts.titleAccent ? (
        <>
          {/* Boşluk `<br>` olsa da yazılır: satır sonu yalnızca ≥640px'te
              görünür (`hidden sm:block`), mobilde gizlenir. Yalnızca `<br>`
              koysaydık dar ekranda iki kelime bitişik çıkardı. */}{" "}
          {breakBeforeAccent ? <br className="hidden sm:block" /> : null}
          <span className="text-czr-orange">{parts.titleAccent}</span>
        </>
      ) : null}
      {parts.titleTail ? ` ${parts.titleTail}` : null}
    </span>
  );
}

export function chapters(locale: Locale): Chapter[] {
  const all = content(locale);
  const c = all.chapters;
  const t = ui(locale);
  const stop = (n: string) => `${t.stop} ${n}`;

  return [
    {
      id: "egitimler",
      headingId: "egitimler-baslik",
      code: stop("02"),
      eyebrow: c.egitimler.eyebrow,
      title: chapterTitle("egitimler-baslik", c.egitimler, true),
      lead: c.egitimler.lead,
      body: <TrainingCatalog locale={locale} />,
    },
    {
      id: "mufredat",
      headingId: "mufredat-baslik",
      code: stop("03"),
      eyebrow: c.mufredat.eyebrow,
      title: chapterTitle("mufredat-baslik", c.mufredat),
      lead: c.mufredat.lead,
      body: <CurriculumSection locale={locale} />,
    },
    {
      id: "atolye",
      headingId: "atolye-baslik",
      code: stop("04"),
      eyebrow: c.atolye.eyebrow,
      title: chapterTitle("atolye-baslik", c.atolye),
      lead: c.atolye.lead,
      body: (
        <div className="mt-14">
          <RealMediaGrid locale={locale} />
        </div>
      ),
    },
    {
      // "Miras" idi. Bölüm artık kurumun kendi anlattığı otobiyografiyi
      // taşıyor; el-Cezerî kronolojisi ve marka klibi onun içinde, adın
      // hikâyesini anlatan alt blokta duruyor. Çapa da yenilendi:
      // `#miras` adresi "Biz Kimiz" başlığını açsaydı paylaşılan bağlantı
      // gittiği yeri yanlış tarif ederdi.
      id: "biz-kimiz",
      headingId: "biz-kimiz-baslik",
      code: stop("05"),
      // Başlık ve giriş cümlesi `about` sözlüğünde duruyor; bölüm
      // metniyle aynı yerden gelsin diye burada tekrarlanmıyor.
      eyebrow: all.about.eyebrow,
      title: chapterTitle("biz-kimiz-baslik", all.about),
      lead: all.about.lead,
      body: <AboutSection locale={locale} />,
    },
    {
      id: "basin",
      headingId: "basin-baslik",
      code: stop("06"),
      eyebrow: c.basin.eyebrow,
      title: chapterTitle("basin-baslik", c.basin),
      lead: c.basin.lead,
      body: <PressSection locale={locale} />,
    },
    {
      id: "sss",
      headingId: "sss-baslik",
      code: stop("07"),
      eyebrow: c.sss.eyebrow,
      title: chapterTitle("sss-baslik", c.sss),
      lead: c.sss.lead,
      width: "narrow",
      body: (
        <div className="mt-14">
          <FaqAccordion locale={locale} />
        </div>
      ),
    },
    {
      id: "iletisim",
      headingId: "iletisim-baslik",
      code: stop("08"),
      eyebrow: c.iletisim.eyebrow,
      title: chapterTitle("iletisim-baslik", c.iletisim),
      lead: c.iletisim.lead,
      body: (
        <div className="mt-14 grid gap-10 lg:grid-cols-5 lg:gap-14">
          {/* Konum ve künye */}
          <div className="lg:col-span-2">
            <Reveal>
              <BaseMap locale={locale} />
            </Reveal>

            <Reveal delay={120}>
              <dl className="mt-8 space-y-6">
                <div>
                  <dt className="czr-mono text-[11px] uppercase text-czr-ice/45">
                    {t.contactAddress}
                  </dt>
                  {/* Adres, telefon ve e-posta latin harf ve rakam taşır;
                      sağdan sola akışta kendi yönlerini korumaları gerekir. */}
                  <dd dir="ltr" className="mt-2 text-[15px] leading-relaxed text-czr-ice/80">
                    {contact.address.full}
                  </dd>
                </div>
                <div>
                  <dt className="czr-mono text-[11px] uppercase text-czr-ice/45">
                    {t.contactPhone}
                  </dt>
                  <dd className="mt-2">
                    <a
                      dir="ltr"
                      href={`tel:${contact.phoneE164}`}
                      className="inline-block text-[15px] font-semibold text-white transition hover:text-czr-orange"
                    >
                      {contact.phoneDisplay}
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className="czr-mono text-[11px] uppercase text-czr-ice/45">
                    {t.contactEmail}
                  </dt>
                  <dd className="mt-2">
                    <a
                      dir="ltr"
                      href={`mailto:${contact.email}`}
                      className="inline-block text-[15px] font-semibold text-white transition hover:text-czr-orange"
                    >
                      {contact.email}
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className="czr-mono text-[11px] uppercase text-czr-ice/45">
                    {t.contactHours}
                  </dt>
                  <dd className="mt-2 space-y-1 text-[15px] text-czr-ice/80">
                    <p>
                      {t.hoursWeekdays} ·{" "}
                      <span dir="ltr" className="inline-block">
                        09:00 – 19:00
                      </span>
                    </p>
                    <p>
                      {t.hoursSaturday} ·{" "}
                      <span dir="ltr" className="inline-block">
                        10:00 – 18:00
                      </span>
                    </p>
                  </dd>
                </div>
              </dl>
            </Reveal>
          </div>

          {/* İletişim kanalları */}
          <div className="min-w-0 lg:col-span-3">
            <ContactChannels locale={locale} />
          </div>
        </div>
      ),
    },
  ];
}
