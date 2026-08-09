import type { Metadata, Viewport } from "next";
import { BaseMap } from "@/components/marketing/BaseMap";
import { BrandSequence } from "@/components/marketing/BrandSequence";
import { ContactChannels } from "@/components/marketing/ContactChannels";
import { FaqAccordion } from "@/components/marketing/FaqAccordion";
import { HeroLaunchpad } from "@/components/marketing/HeroLaunchpad";
import { PressSection } from "@/components/marketing/PressSection";
import { LegacyTimeline } from "@/components/marketing/LegacyTimeline";
import { MarketingFooter } from "@/components/marketing/MarketingFooter";
import { MarketingNav } from "@/components/marketing/MarketingNav";
import { MetricsDeck } from "@/components/marketing/MetricsDeck";
import { RealMediaGrid } from "@/components/marketing/RealMediaGrid";
import { Reveal } from "@/components/marketing/Reveal";
import { SectionHeading } from "@/components/marketing/SectionHeading";
import { TrainingCatalog } from "@/components/marketing/TrainingCatalog";
import { AmbientAudio } from "@/components/marketing/world/AmbientAudio";
import { StationRail } from "@/components/marketing/world/StationRail";
import { WorldStage } from "@/components/marketing/world/WorldStage";
import { schemaJson } from "@/lib/seo/schema";
import { contact, org, SITE_URL } from "@/lib/seo/site";

/**
 * Statik üretim: sayfa tamamen sunucuda derlenir ve CDN'den servis edilir.
 * LCP hedefi (< 2.5 sn) için kritik — ilk bayt beklemesi ortadan kalkar.
 */
export const dynamic = "force-static";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${org.name} — Batman Robotik Kodlama, Yapay Zeka ve İHA Eğitim Merkezi`,
    template: `%s | ${org.name}`,
  },
  description: org.description,
  applicationName: org.name,
  // Anahtar kelimeler Google sıralamasında doğrudan kullanılmaz; burada
  // bulunmalarının nedeni bazı yerel dizinlerin ve AI tarayıcılarının hâlâ
  // bu alanı konu sinyali olarak okumasıdır.
  keywords: [
    "Batman robotik kodlama kursu",
    "Batman yapay zeka eğitimi",
    "Batman drone eğitimi",
    "Batman İHA eğitimi",
    "Batman 3D tasarım kursu",
    "Batman çocuk kodlama kursu",
    "Batman roketçilik eğitimi",
    "6-16 yaş teknoloji kursu",
    "Güneydoğu robotik eğitim merkezi",
    "Cezeri Robotech",
  ],
  authors: [{ name: org.name, url: SITE_URL }],
  creator: org.name,
  publisher: org.legalName,
  alternates: {
    canonical: "/",
    languages: { "tr-TR": "/" },
  },
  category: "education",
  openGraph: {
    type: "website",
    locale: "tr_TR",
    url: SITE_URL,
    siteName: org.name,
    title: `${org.name} — ${org.slogan}`,
    description: org.description,
  },
  twitter: {
    card: "summary_large_image",
    title: `${org.name} — ${org.slogan}`,
    description: org.tagline,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  formatDetection: { telephone: true, address: true, email: true },
  other: {
    // Yerel arama için coğrafi meta işaretleri
    "geo.region": "TR-72",
    "geo.placename": contact.address.city,
    "geo.position": `${contact.geo.lat};${contact.geo.lng}`,
    ICBM: `${contact.geo.lat}, ${contact.geo.lng}`,
  },
};

/**
 * Tanıtım sayfası koyu petrol siyahıdır; mobil tarayıcı çubuğunun panelin
 * lacivertinde kalması sayfayla uyumsuz bir şerit oluştururdu. Bu override
 * yalnızca bu rotayı etkiler, panel kendi rengini korur.
 */
export const viewport: Viewport = {
  themeColor: "#0A191D",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function HomePage() {
  return (
    <div className="czr-site">
      {/* Tek @graph JSON-LD: kurum → kampüs → 10 kurs → SSS → site zinciri */}
      <script
        type="application/ld+json"
        // Değer `schemaJson()` içinde `<` kaçırılarak üretilir.
        dangerouslySetInnerHTML={{ __html: schemaJson() }}
      />

      <a
        href="#egitimler"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[200] focus:rounded-full focus:bg-czr-orange focus:px-5 focus:py-3 focus:text-sm focus:font-bold focus:text-czr-base"
      >
        İçeriğe geç
      </a>

      {/* Sayfanın içinde geçtiği tek sürekli dünya — bölümlerin arkasında
          sabit durur, scroll boyunca hiç sökülmez. Dekoratiftir: yüklenmese
          de sayfa eksiksiz okunur. */}
      <WorldStage />

      <MarketingNav />

      {/* Yürüyüşün neresindeyiz — sahneden bağımsız çalışır */}
      <StationRail />

      {/* Sessiz varsayılan; ses yalnızca kullanıcı açarsa indirilir */}
      <AmbientAudio />

      <main className="relative z-10">
        {/* 01 — Fırlatma üssü */}
        <HeroLaunchpad />

        {/* 02 — Telemetri */}
        <MetricsDeck />

        {/* 03 — Eğitim ve faaliyet hangarları */}
        <section
          id="egitimler"
          aria-labelledby="egitimler-baslik"
          className="czr-chapter border-b border-white/8 py-24 lg:py-32"
        >
          <div className="mx-auto max-w-7xl px-6 lg:px-10">
            <SectionHeading
              code="DURAK 02"
              eyebrow="Eğitimlerimiz"
              title={
                <span id="egitimler-baslik">
                  On Eğitim, Tek Disiplin: <br className="hidden sm:block" />
                  <span className="text-czr-orange">Çalışan Bir Şey Üret.</span>
                </span>
              }
              lead="CEZERİ ROBOTECH'te eğitim on temel disipline ayrılmıştır: İHA/VTOL sistemleri, roketçilik, yapay zeka ve makine öğrenmesi, robotik kodlama, 3D tasarım ve eklemeli üretim, yazılım ve algoritma, elektronik ve mekatronik, siber güvenlik farkındalığı, uzay ve havacılık bilimleri, teknoloji girişimciliği. Her eğitim, öğrencinin dönem sonunda kendi eliyle ürettiği çalışan bir çıktıyla kapanır. Bir başlığa dokunduğunuzda arkadaki sahne o disiplinin animasyonuna geçer."
            />

            <TrainingCatalog />
          </div>
        </section>

        {/* 04 — Gerçek atölye ve saha deneyimi */}
        <section
          id="atolye"
          aria-labelledby="atolye-baslik"
          className="czr-chapter border-b border-white/8 py-24 lg:py-32"
        >
          <div className="mx-auto max-w-7xl px-6 lg:px-10">
            <SectionHeading
              code="DURAK 03"
              eyebrow="Atölye ve Saha"
              title={<span id="atolye-baslik">Simülasyon Değil. Gerçek Atölye.</span>}
              lead="Batman'daki atölyede öğrenciler 3D yazıcı çalıştırır, drone gövdesi monte eder, devre lehimler ve sahada gerçek uçuş testi yapar. Aşağıdaki kareler bu çalışmalardan alınmıştır; henüz kaydı olmayan disiplinler ise 'Konsept' etiketiyle işaretlendi. Öğrencilerin yüzleri gizliliğe saygı gereği bulanıklaştırılmıştır."
            />

            <div className="mt-14">
              <RealMediaGrid />
            </div>
          </div>
        </section>

        {/* 05 — Cezerî mirası */}
        <section
          id="miras"
          aria-labelledby="miras-baslik"
          className="czr-chapter border-b border-white/8 py-24 lg:py-32"
        >
          <div className="mx-auto max-w-7xl px-6 lg:px-10">
            <SectionHeading
              code="DURAK 04"
              eyebrow="Cezerî Mirası"
              title={
                <span id="miras-baslik">
                  Sekiz Yüz Yıl Önce Burada <span className="text-czr-orange">Otomat</span> Vardı.
                </span>
              }
              lead="Kurumun adı, programlanabilir otomatların ilk sistematik kaydını bırakan İsmail el-Cezerî'den gelir. Bugün aynı disiplin mikrodenetleyici, sensör ve algoritmayla sürüyor."
            />

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
          </div>
        </section>

        {/* 06 — Basında biz */}
        <section
          id="basin"
          aria-labelledby="basin-baslik"
          className="czr-chapter border-b border-white/8 py-24 lg:py-32"
        >
          <div className="mx-auto max-w-5xl px-6 lg:px-10">
            <SectionHeading
              code="DURAK 05"
              eyebrow="Basında Biz"
              title={<span id="basin-baslik">Bizi Başkaları Anlatınca</span>}
              lead="Yerel ve ulusal basında çıkan haberler, röportajlar ve etkinlik kayıtları. Kurumun kendi anlattığı değil, üçüncü tarafın doğruladığı kayıt."
            />

            <PressSection />
          </div>
        </section>

        {/* 07 — SSS / AI sorgulama */}
        <section
          id="sss"
          aria-labelledby="sss-baslik"
          className="czr-chapter border-b border-white/8 py-24 lg:py-32"
        >
          <div className="mx-auto max-w-4xl px-6 lg:px-10">
            <SectionHeading
              code="DURAK 06"
              eyebrow="Sıkça Sorulan Sorular"
              title={<span id="sss-baslik">Merak Edilenler</span>}
              lead="Velilerin ve öğrencilerin en sık sorduğu sorular ve net yanıtları."
            />

            <div className="mt-14">
              <FaqAccordion />
            </div>
          </div>
        </section>

        {/* 07 — Üs operasyonları */}
        <section
          id="iletisim"
          aria-labelledby="iletisim-baslik"
          className="czr-chapter py-24 lg:py-32"
        >
          <div className="mx-auto max-w-7xl px-6 lg:px-10">
            <SectionHeading
              code="DURAK 07"
              eyebrow="Üs Operasyonları"
              title={<span id="iletisim-baslik">Üsse Bağlan</span>}
              lead={`WhatsApp'tan yazın, Instagram'dan takip edin veya doğrudan atölyeye gelin. Telefon: ${contact.phoneDisplay}`}
            />

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
          </div>
        </section>
      </main>

      <MarketingFooter />
    </div>
  );
}
