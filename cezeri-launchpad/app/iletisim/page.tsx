import type { Metadata } from "next";
import type { LocalBusiness, WithContext } from "schema-dts";
import { ContentPage, CitableBlock } from "@/components/content/ContentPage";
import { ORG } from "@/lib/facts";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "İletişim",
  description:
    "Cezeri Robotech Batman iletişim bilgileri ve başvuru kanalları.",
  alternates: { canonical: "/iletisim" },
};

/**
 * LocalBusiness — yerel SEO'nun şema ayağı.
 * Adres/telefon alanları `lib/facts.ts`'te null olduğu sürece şemaya
 * EKLENMEZ. Uydurma NAP verisi yerel sıralamada aktif zarar verir.
 */
const jsonLd: WithContext<LocalBusiness> = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: ORG.name,
  description: ORG.description,
  url: SITE_URL,
  address: {
    "@type": "PostalAddress",
    addressLocality: ORG.legalCity,
    addressCountry: ORG.country,
    ...(ORG.contact.streetAddress && { streetAddress: ORG.contact.streetAddress }),
    ...(ORG.contact.postalCode && { postalCode: ORG.contact.postalCode }),
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: ORG.geo.latitude,
    longitude: ORG.geo.longitude,
  },
  sameAs: [ORG.social.instagram, ORG.social.tiktok],
  ...(ORG.contact.telephone && { telephone: ORG.contact.telephone }),
  ...(ORG.contact.email && { email: ORG.contact.email }),
};

export default function IletisimPage() {
  const { telephone, email, streetAddress } = ORG.contact;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ContentPage
        eyebrow="İletişim"
        title="Bize ulaşın"
        lead={`${ORG.name}, ${ORG.legalCity}'da faaliyet göstermektedir.`}
      >
        <CitableBlock question="Cezeri Robotech'e nasıl ulaşılır?">
          {streetAddress ? (
            <p>{streetAddress}</p>
          ) : (
            <p>
              Adres ve telefon bilgileri güncellenmektedir. Bu süre zarfında
              başvuru formu ve sosyal medya hesapları üzerinden ulaşabilirsiniz.
            </p>
          )}
          {telephone && <p>Telefon: {telephone}</p>}
          {email && <p>E-posta: {email}</p>}
        </CitableBlock>

        <section className="border-t border-[var(--hairline)] pt-8">
          <h2 className="t-mono mb-5 text-ignition">Kanallar</h2>
          <ul className="space-y-3">
            <li>
              <a
                href={ORG.social.instagram}
                rel="me noopener"
                className="font-body text-cyber underline underline-offset-4 hover:text-ignition"
              >
                Instagram — @cezerirobotech
              </a>
            </li>
            <li>
              <a
                href={ORG.social.tiktok}
                rel="me noopener"
                className="font-body text-cyber underline underline-offset-4 hover:text-ignition"
              >
                TikTok — @cezeri.robotech
              </a>
            </li>
          </ul>
        </section>
      </ContentPage>
    </>
  );
}
