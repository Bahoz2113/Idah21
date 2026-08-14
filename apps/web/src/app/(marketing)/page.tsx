import type { Metadata, Viewport } from "next";
import { MetricsDeck } from "@/components/marketing/MetricsDeck";
import { SectionHeading } from "@/components/marketing/SectionHeading";
import { ScrollScrubHero } from "@/components/scrub/ScrollScrubHero";
import { ScrubFooter } from "@/components/scrub/ScrubFooter";
import { ScrubNav } from "@/components/scrub/ScrubNav";
import { ScrubReveal } from "@/components/scrub/ScrubReveal";
import { SmoothScroll } from "@/components/scrub/SmoothScroll";
import { chapters } from "@/lib/marketing/chapters";
import { schemaJson } from "@/lib/seo/schema";
import { contact, org, SITE_URL } from "@/lib/seo/site";

/**
 * CEZERİ ROBOTECH TANITIM SAYFASI.
 *
 * Sayfanın açılışı, kullanıcının kaydırmasıyla kare kare ilerleyen bir
 * filmdir: kaydırma konumu videonun zamanına eşlenir, durunca kare donar,
 * yukarı çıkınca geri sarar (bkz. `ScrollScrubHero`).
 *
 * DÜZEN RİTMİ. Anlatının nefes alan durakları (giriş, davet) açık yüzeyde,
 * medya ve veri yoğun blokları koyu yüzeyde durur. Sabit gezinme çubuğu
 * hero'dan sonra açık yüzeye döner ve öyle kalır — koyu bantların üzerinde
 * de ayrı bir katman olduğu belli olur.
 *
 * İÇERİK TEK KAYNAKTAN. Bölüm metinleri `lib/marketing/chapters` içinde,
 * kurumsal veri `lib/seo/site` içinde durur. Sayfada görünen metin ile
 * Google'a giden structured data aynı satırdan beslenir; ikisi ayrışamaz.
 *
 * Statik üretim: sayfa tamamen sunucuda derlenir ve CDN'den servis edilir.
 * LCP hedefi (< 2,5 sn) için kritik — ilk bayt beklemesi ortadan kalkar.
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
  // Panel kok duzeniyle ortak degil: tanitim sitesi kendi kok duzenine
  // ayrildiginda bu dort alan onunla birlikte gitmisti. Belirtisi sessizdi
  // — tarayici ikon bulamayinca kendiliginden /favicon.ico istiyor ve
  // konsola 404 dusuyordu.
  manifest: "/manifest.webmanifest",
  appleWebApp: { capable: true, statusBarStyle: "black-translucent", title: org.name },
  icons: { icon: "/favicon-32.png", apple: "/apple-touch-icon.png" },
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

/** Koyu bantta duran bölümler: içerik bileşenleri koyu yüzey için yazıldı. */
const DARK = new Set(["egitimler", "mufredat", "atolye", "miras", "basin", "sss"]);

export default function HomePage() {
  return (
    <SmoothScroll>
      {/* Tek @graph JSON-LD: kurum → kampüs → 10 kurs → SSS → site zinciri */}
      <script
        type="application/ld+json"
        // Değer `schemaJson()` içinde `<` kaçırılarak üretilir.
        dangerouslySetInnerHTML={{ __html: schemaJson() }}
      />

      <a
        href="#egitimler"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[200] focus:rounded-full focus:bg-[var(--color-brand-accent)] focus:px-5 focus:py-3 focus:text-sm focus:font-bold focus:text-[var(--color-surface-dark)]"
      >
        İçeriğe geç
      </a>

      <ScrubNav />

      <main>
        <ScrollScrubHero />

        {/* 01 — Giriş: açık yüzeyde editoryal nefes */}
        <section
          aria-labelledby="czr-giris-baslik"
          className="scrub-chapter border-b border-[var(--color-line)] bg-[var(--color-surface-light)] py-24 lg:py-36"
        >
          <div className="mx-auto max-w-7xl px-6 lg:px-10">
            <ScrubReveal>
              <p className="scrub-index">01 — Yaklaşımımız</p>
            </ScrubReveal>

            <div className="mt-8 grid gap-10 lg:grid-cols-12 lg:gap-16">
              <ScrubReveal delay={80} className="lg:col-span-7">
                <h2
                  id="czr-giris-baslik"
                  className="scrub-display text-[var(--color-surface-dark)]"
                >
                  Geleceği Tüketen Değil,{" "}
                  <span className="text-[var(--color-brand-accent)]">Tasarlayan</span> Nesiller
                </h2>
              </ScrubReveal>

              <ScrubReveal delay={160} className="lg:col-span-5 lg:pt-3">
                <p className="max-w-prose text-pretty text-[17px] leading-relaxed text-[var(--color-text-muted)]">
                  {org.description}
                </p>
                <p className="mt-5 max-w-prose text-pretty text-[15px] leading-relaxed text-[var(--color-text-muted)]">
                  Öğrenciler burada yalnızca kod yazmayı veya bir robotu çalıştırmayı öğrenmez;
                  düşünmeyi, tasarlamayı, denemeyi, hata yapmayı ve yeniden üretmeyi öğrenir.
                </p>
              </ScrubReveal>
            </div>
          </div>
        </section>

        {/* Telemetri — koyu bant, mevcut bileşen */}
        <div className="scrub-chapter scrub-dark bg-[var(--color-surface-dark)]">
          <MetricsDeck />
        </div>

        {/* 02 → 08 — Bölümler tek kaynaktan */}
        {chapters.map((c, i) => {
          const dark = DARK.has(c.id);
          return (
            <section
              key={c.id}
              id={c.id}
              aria-labelledby={c.headingId}
              className={`scrub-chapter border-b py-24 lg:py-32 ${
                dark
                  ? "scrub-dark border-white/8 bg-[var(--color-surface-dark)]"
                  : "border-[var(--color-line)] bg-[var(--color-surface-light)]"
              }`}
            >
              <div
                className={`mx-auto px-6 lg:px-10 ${
                  c.width === "narrow" ? "max-w-4xl" : "max-w-7xl"
                }`}
              >
                {/* Bölüm etiketi YALNIZCA `SectionHeading` içinde basılır.
                    Burada ikinci bir indeks satırı da vardı ("02 —
                    Eğitimlerimiz") ve hemen altındaki "DURAK 02 —— Eğitimlerimiz"
                    ile aynı bilgiyi iki farklı biçimde tekrarlıyordu; yedi
                    bölümün yedisinde de. Numaralandırma da çakışıyordu.
                    Açılış (01) ve davet (09) kendi indeks satırlarını korur:
                    onlarda `SectionHeading` yok ve turun iki ucunu işaretler. */}
                <div>
                  <SectionHeading
                    code={c.code}
                    eyebrow={c.eyebrow}
                    title={c.title}
                    lead={c.lead}
                  />
                </div>

                {c.body}
              </div>
            </section>
          );
        })}

        {/* 09 — Davet */}
        <section
          aria-labelledby="czr-cta-baslik"
          className="scrub-chapter bg-[var(--color-surface-light)] py-24 lg:py-36"
        >
          <div className="mx-auto max-w-4xl px-6 text-center lg:px-10">
            <ScrubReveal>
              <p className="scrub-index">09 — Davet</p>
            </ScrubReveal>

            <ScrubReveal delay={80}>
              <h2
                id="czr-cta-baslik"
                className="scrub-display mt-7 text-[var(--color-surface-dark)]"
              >
                Geleceği <span className="text-[var(--color-brand-accent)]">Birlikte</span>{" "}
                Tasarlayalım
              </h2>
            </ScrubReveal>

            <ScrubReveal delay={160}>
              <p className="mx-auto mt-6 max-w-2xl text-pretty text-[17px] leading-relaxed text-[var(--color-text-muted)]">
                Çocuğunuzun teknoloji yolculuğunu doğru yaşta, doğru rehberlikle ve gerçek
                projelerle başlatın.
              </p>
            </ScrubReveal>

            <ScrubReveal delay={240}>
              <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <a
                  href={`tel:${contact.phoneE164}`}
                  className="inline-flex items-center justify-center rounded-full bg-[var(--color-brand-accent)] px-8 py-4 text-sm font-bold uppercase tracking-wide text-[var(--color-surface-dark)] transition duration-300 hover:-translate-y-0.5 hover:brightness-110"
                >
                  Kayıt ve Bilgi Talep Edin
                </a>
                <a
                  href={`mailto:${contact.email}`}
                  className="inline-flex items-center justify-center rounded-full border border-[var(--color-line)] px-8 py-4 text-sm font-semibold uppercase tracking-wide text-[var(--color-surface-dark)] transition duration-300 hover:border-[var(--color-brand-accent)]"
                >
                  E-posta Gönderin
                </a>
              </div>
            </ScrubReveal>
          </div>
        </section>
      </main>

      <ScrubFooter />
    </SmoothScroll>
  );
}
