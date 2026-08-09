import type { Metadata, Viewport } from "next";
import { HeroLaunchpad } from "@/components/marketing/HeroLaunchpad";
import { MarketingFooter } from "@/components/marketing/MarketingFooter";
import { MarketingNav } from "@/components/marketing/MarketingNav";
import { MetricsDeck } from "@/components/marketing/MetricsDeck";
import { SectionHeading } from "@/components/marketing/SectionHeading";
import { AmbientAudio } from "@/components/marketing/world/AmbientAudio";
import { StationRail } from "@/components/marketing/world/StationRail";
import { WorldStage } from "@/components/marketing/world/WorldStage";
import { chapters } from "@/lib/marketing/chapters";
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
    images: [
      {
        url: "/assets/sahne/og-paylasim.webp",
        width: 1200,
        height: 675,
        alt: "CEZERİ ROBOTECH — Batman'da gece hangarı, fırlatma rampasındaki roket ve havalanan İHA",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${org.name} — ${org.slogan}`,
    description: org.tagline,
    images: ["/assets/sahne/og-paylasim.webp"],
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

        {/* 03 → 08 — Bölümler tek kaynaktan gelir (`lib/marketing/chapters`).
            Aynı içerik `/alternatif` rotasında farklı bir çerçeveyle
            sunuluyor; metinler iki dosyada ayrı dursaydı zamanla
            ayrışırlardı. */}
        {chapters.map((c) => (
          <section
            key={c.id}
            id={c.id}
            aria-labelledby={c.headingId}
            className={`czr-chapter py-24 lg:py-32${
              c.id === "iletisim" ? "" : " border-b border-white/8"
            }`}
          >
            <div
              className={`mx-auto px-6 lg:px-10 ${
                c.width === "narrow" ? "max-w-4xl" : "max-w-7xl"
              }`}
            >
              <SectionHeading
                code={c.code}
                eyebrow={c.eyebrow}
                title={c.title}
                lead={c.lead}
              />

              {c.body}
            </div>
          </section>
        ))}

      </main>

      <MarketingFooter />
    </div>
  );
}
