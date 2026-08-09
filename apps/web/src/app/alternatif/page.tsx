import type { Metadata, Viewport } from "next";
import { HeroLaunchpad } from "@/components/marketing/HeroLaunchpad";
import { MarketingFooter } from "@/components/marketing/MarketingFooter";
import { MarketingNav } from "@/components/marketing/MarketingNav";
import { MetricsDeck } from "@/components/marketing/MetricsDeck";
import { SectionHeading } from "@/components/marketing/SectionHeading";
import { SequenceChapter } from "@/components/marketing/sequence/SequenceChapter";
import { ActMarquee, SequenceStage } from "@/components/marketing/sequence/SequenceStage";
import { SHOW } from "@/components/marketing/sequence/show";
import { AmbientAudio } from "@/components/marketing/world/AmbientAudio";
import { StationRail } from "@/components/marketing/world/StationRail";
import { chapters } from "@/lib/marketing/chapters";
import { org, SITE_URL } from "@/lib/seo/site";

/**
 * ALTERNATİF DÜZEN — aynı içerik, sekans çerçevesi.
 *
 * `/` sürekli bir dünyadır: sahne arkada sabit yaşar, bölümler onun
 * üzerinden akar, arkadaki animasyonu kullanıcı katalogdan seçer.
 *
 * Bu sayfa aynı içeriği bir GÖSTERİ olarak sunar. Kaydırdıkça arka
 * planda perdeler kendiliğinden sırayla açılır — önce roket kalkar,
 * sonra İHA geçer, sonra 3D yazıcı basar — ve bölümler yaklaşıldıkça
 * teker teker açılır.
 *
 * İçerik tek kaynaktan gelir (`lib/marketing/chapters`); iki sayfa
 * arasında tek bir cümle bile ayrışamaz.
 *
 * SEO KRİTİK NOKTASI:
 * Aynı içeriğin iki adreste durması, önlem alınmazsa `/` sayfasının
 * sıralamasını zayıflatır — arama motoru hangisinin asıl olduğunu
 * bilemez. Bu yüzden:
 *   · `robots: noindex, nofollow` — bu sayfa dizine hiç girmez
 *   · `alternates.canonical = "/"` — asıl adres açıkça bildirilir
 *   · JSON-LD @graph BURAYA KONMAZ — yapılandırılmış veri tek yerde,
 *     `/` sayfasında yaşar
 *   · `sitemap.xml` bu rotayı listelemez
 * Sayfa kurucunun karşılaştırma yapması için vardır, yayın için değil.
 */

export const dynamic = "force-static";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: `${org.name} — Sekans Düzeni (alternatif tasarım)`,
  description:
    "CEZERİ ROBOTECH tanıtım sayfasının alternatif düzeni: arka planda perdeler sırayla açılır, bölümler kaydırıldıkça teker teker görünür.",
  alternates: { canonical: "/" },
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false },
  },
};

export const viewport: Viewport = {
  themeColor: "#0A191D",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function AlternatifPage() {
  return (
    <div className="czr-site">
      <a
        href="#egitimler"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[200] focus:rounded-full focus:bg-czr-orange focus:px-5 focus:py-3 focus:text-sm focus:font-bold focus:text-czr-base"
      >
        İçeriğe geç
      </a>

      {/* Arka plan gösterisi: perdeler sırayla açılır */}
      <SequenceStage />

      <MarketingNav />
      <StationRail />
      <AmbientAudio />

      {/* Arkada ne oynadığını söyler */}
      <ActMarquee />

      <main className="relative z-10">
        <HeroLaunchpad />
        <MetricsDeck />

        {chapters.map((c, i) => (
          <SequenceChapter
            key={c.id}
            id={c.id}
            headingId={c.headingId}
            index={i + 1}
            last={i === chapters.length - 1}
            narrow={c.width === "narrow"}
            masthead={
              <SectionHeading
                code={c.code}
                eyebrow={c.eyebrow}
                title={c.title}
                lead={c.lead}
              />
            }
          >
            {c.body}
          </SequenceChapter>
        ))}
      </main>

      <MarketingFooter />

      {/* Gösterinin perde listesi — sayfanın sonunda, arka planda ne
          geçtiğinin dökümü. Arama motoru için değil, kurucunun iki
          düzeni karşılaştırması için. */}
      <p className="sr-only">
        Arka plan gösterisi sırası: {SHOW.map((a) => a.title).join(", ")}.
      </p>
    </div>
  );
}
