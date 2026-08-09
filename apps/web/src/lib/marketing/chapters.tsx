import type { ReactNode } from "react";
import { BaseMap } from "@/components/marketing/BaseMap";
import { BrandSequence } from "@/components/marketing/BrandSequence";
import { ContactChannels } from "@/components/marketing/ContactChannels";
import { CurriculumSection } from "@/components/marketing/CurriculumSection";
import { FaqAccordion } from "@/components/marketing/FaqAccordion";
import { LegacyTimeline } from "@/components/marketing/LegacyTimeline";
import { PressSection } from "@/components/marketing/PressSection";
import { RealMediaGrid } from "@/components/marketing/RealMediaGrid";
import { Reveal } from "@/components/marketing/Reveal";
import { TrainingCatalog } from "@/components/marketing/TrainingCatalog";
import { contact } from "@/lib/seo/site";

/**
 * BÖLÜMLERİN TEK KAYNAĞI.
 *
 * Aynı içerik iki farklı düzende sunuluyor: `/` sürekli dünya,
 * `/alternatif` sekans sahnesi. Metinler iki dosyada ayrı ayrı dursaydı
 * er ya da geç ayrışırlardı — birinde düzeltilen bir cümle öbüründe
 * eski hâliyle kalırdı ve iki sayfa aynı kurumu farklı anlatmaya
 * başlardı. Bu yüzden başlık, künye ve gövde metinleri burada, tek
 * yerde durur; sayfalar yalnızca ÇERÇEVEYİ seçer.
 *
 * SEO açısından da doğrusu bu: `/alternatif` `noindex` taşır ve
 * kanonik olarak `/`'i gösterir, ama içerik birebir aynı kalır.
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

export const chapters: Chapter[] = [
  {
    id: "egitimler",
    headingId: "egitimler-baslik",
    code: "DURAK 02",
    eyebrow: "Eğitimlerimiz",
    title: (
      <span id="egitimler-baslik">
        On Eğitim, Tek Disiplin: <br className="hidden sm:block" />
        <span className="text-czr-orange">Çalışan Bir Şey Üret.</span>
      </span>
    ),
    lead: "CEZERİ ROBOTECH'te eğitim on temel disipline ayrılmıştır: İHA/VTOL sistemleri, roketçilik, yapay zeka ve makine öğrenmesi, robotik kodlama, 3D tasarım ve eklemeli üretim, yazılım ve algoritma, elektronik ve mekatronik, siber güvenlik farkındalığı, uzay ve havacılık bilimleri, teknoloji girişimciliği. Her eğitim, öğrencinin dönem sonunda kendi eliyle ürettiği çalışan bir çıktıyla kapanır. Bir başlığa dokunduğunuzda arkadaki sahne o disiplinin animasyonuna geçer.",
    body: <TrainingCatalog />,
  },
  {
    id: "mufredat",
    headingId: "mufredat-baslik",
    code: "DURAK 03",
    eyebrow: "Müfredatımız",
    title: (
      <span id="mufredat-baslik">
        Hafta Hafta <span className="text-czr-orange">Ne Öğretiyoruz?</span>
      </span>
    ),
    lead: "CEZERİ ROBOTECH'te dört ayrı program yürütülür: blok tabanlı kodlama (ScratchJr'dan mBlock'a), temel elektrik ve enerji atölyesi, elektronik deney ve lehim atölyesi, Arduino ile robotik ve kodlama. Aşağıda her programın haftalık ders planı, kullanılan araçlar ve modül yapısı yer alıyor — ne öğrettiğimizi hafta hafta okuyabilirsiniz.",
    body: <CurriculumSection />,
  },
  {
    id: "atolye",
    headingId: "atolye-baslik",
    code: "DURAK 04",
    eyebrow: "Atölye ve Saha",
    title: <span id="atolye-baslik">Simülasyon Değil. Gerçek Atölye.</span>,
    lead: "Batman'daki atölyede öğrenciler 3D yazıcı çalıştırır, drone gövdesi monte eder, devre lehimler ve sahada gerçek uçuş testi yapar. Aşağıdaki kareler bu çalışmalardan alınmıştır; henüz kaydı olmayan disiplinler ise 'Konsept' etiketiyle işaretlendi. Öğrencilerin yüzleri gizliliğe saygı gereği bulanıklaştırılmıştır.",
    body: (
      <div className="mt-14">
        <RealMediaGrid />
      </div>
    ),
  },
  {
    id: "miras",
    headingId: "miras-baslik",
    code: "DURAK 05",
    eyebrow: "Cezerî Mirası",
    title: (
      <span id="miras-baslik">
        Sekiz Yüz Yıl Önce Burada <span className="text-czr-orange">Otomat</span> Vardı.
      </span>
    ),
    lead: "Kurumun adı, programlanabilir otomatların ilk sistematik kaydını bırakan İsmail el-Cezerî'den gelir. Bugün aynı disiplin mikrodenetleyici, sensör ve algoritmayla sürüyor.",
    body: (
      <div className="mt-16 grid gap-12 lg:grid-cols-5 lg:items-center lg:gap-16">
        {/* Marka sekansı: dişliler → mekanik baykuş. Bölümün anlatısının
            görsel karşılığı. */}
        <div className="mx-auto w-full max-w-sm lg:col-span-2 lg:mx-0">
          <BrandSequence />
        </div>

        <div className="lg:col-span-3">
          <LegacyTimeline />
        </div>
      </div>
    ),
  },
  {
    id: "basin",
    headingId: "basin-baslik",
    code: "DURAK 06",
    eyebrow: "Basında Biz",
    title: <span id="basin-baslik">Bizi Başkaları Anlatınca</span>,
    lead: "Yerel ve ulusal basında çıkan haberler, röportajlar ve etkinlik kayıtları. Kurumun kendi anlattığı değil, üçüncü tarafın doğruladığı kayıt.",
    body: <PressSection />,
  },
  {
    id: "sss",
    headingId: "sss-baslik",
    code: "DURAK 07",
    eyebrow: "Sıkça Sorulan Sorular",
    title: <span id="sss-baslik">Merak Edilenler</span>,
    lead: "Velilerin ve öğrencilerin en sık sorduğu sorular ve net yanıtları.",
    width: "narrow",
    body: (
      <div className="mt-14">
        <FaqAccordion />
      </div>
    ),
  },
  {
    id: "iletisim",
    headingId: "iletisim-baslik",
    code: "DURAK 08",
    eyebrow: "Üs Operasyonları",
    title: <span id="iletisim-baslik">Üsse Bağlan</span>,
    lead: `WhatsApp'tan yazın, Instagram'dan takip edin veya doğrudan atölyeye gelin. Telefon: ${contact.phoneDisplay}`,
    body: (
      <div className="mt-14 grid gap-10 lg:grid-cols-5 lg:gap-14">
        {/* Konum ve künye */}
        <div className="lg:col-span-2">
          <Reveal>
            <BaseMap />
          </Reveal>

          <Reveal delay={120}>
            <dl className="mt-8 space-y-6">
              <div>
                <dt className="czr-mono text-[11px] uppercase text-czr-ice/45">Adres</dt>
                <dd className="mt-2 text-[15px] leading-relaxed text-czr-ice/80">
                  {contact.address.full}
                </dd>
              </div>
              <div>
                <dt className="czr-mono text-[11px] uppercase text-czr-ice/45">Telefon</dt>
                <dd className="mt-2">
                  <a
                    href={`tel:${contact.phoneE164}`}
                    className="text-[15px] font-semibold text-white transition hover:text-czr-orange"
                  >
                    {contact.phoneDisplay}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="czr-mono text-[11px] uppercase text-czr-ice/45">E-posta</dt>
                <dd className="mt-2">
                  <a
                    href={`mailto:${contact.email}`}
                    className="text-[15px] font-semibold text-white transition hover:text-czr-orange"
                  >
                    {contact.email}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="czr-mono text-[11px] uppercase text-czr-ice/45">
                  Çalışma Saatleri
                </dt>
                <dd className="mt-2 space-y-1 text-[15px] text-czr-ice/80">
                  <p>Pazartesi – Cuma · 09:00 – 19:00</p>
                  <p>Cumartesi · 10:00 – 18:00</p>
                </dd>
              </div>
            </dl>
          </Reveal>
        </div>

        {/* İletişim kanalları */}
        <div className="min-w-0 lg:col-span-3">
          <ContactChannels />
        </div>
      </div>
    ),
  },
];
