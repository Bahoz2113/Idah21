import type { Metadata, Viewport } from "next";
import { Archivo, Inter, JetBrains_Mono } from "next/font/google";
import type { EducationalOrganization, WithContext } from "schema-dts";
import { ORG } from "@/lib/facts";
import { OG_IMAGE } from "@/lib/media";
import { Frame } from "@/components/hud/Frame";
import { Telemetry } from "@/components/hud/Telemetry";
import "./globals.css";

const archivo = Archivo({
  subsets: ["latin", "latin-ext"],
  display: "swap",
  variable: "--font-archivo",
  weight: ["700", "800", "900"],
});

const inter = Inter({
  subsets: ["latin", "latin-ext"],
  display: "swap",
  variable: "--font-inter",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin", "latin-ext"],
  display: "swap",
  variable: "--font-jetbrains",
  weight: ["400", "700"],
});

/** GEO: description, <h1> ve JSON-LD `description` birebir aynı cümledir. */
export const metadata: Metadata = {
  metadataBase: new URL("https://cezerirobotech.com"),
  title: {
    default: "Cezeri Robotech — Batman'da yazılım, yapay zekâ ve havacılık eğitimi",
    template: "%s — Cezeri Robotech",
  },
  description: ORG.description,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "tr_TR",
    siteName: ORG.name,
    title: "Cezeri Robotech — Batman'da yazılım, yapay zekâ ve havacılık eğitimi",
    description: ORG.description,
    images: [
      {
        url: OG_IMAGE.src,
        width: OG_IMAGE.width,
        height: OG_IMAGE.height,
        alt: "Gece gökyüzünde yükselen model roket — Cezeri Robotech, Batman.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: [OG_IMAGE.src],
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#121212",
  colorScheme: "dark",
};

/**
 * JSON-LD sunucudan basılır (GEO kuralı K3).
 * `useEffect` içinde enjekte edilseydi AI crawler'ları göremezdi.
 */
const jsonLd: WithContext<EducationalOrganization> = {
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  name: ORG.name,
  description: ORG.description,
  founder: { "@type": "Person", name: ORG.founder },
  address: {
    "@type": "PostalAddress",
    addressLocality: ORG.legalCity,
    addressCountry: ORG.country,
  },
  sameAs: [ORG.social.instagram, ORG.social.tiktok],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="tr"
      className={`${archivo.variable} ${inter.variable} ${jetbrains.variable}`}
    >
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <a href="#icerik" className="skip-link">
          İçeriğe geç
        </a>
        <Frame />
        <Telemetry />
        {children}
      </body>
    </html>
  );
}
