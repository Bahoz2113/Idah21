import type { Course, WithContext } from "schema-dts";
import { ContentPage, CitableBlock } from "@/components/content/ContentPage";
import { ORG } from "@/lib/facts";
import { SITE_URL, type LocalPage } from "@/lib/site";
import { AGE_GROUPS } from "@/lib/content";

/** Yerel arama sorgusu sayfası — tek bir sorgu kümesini hedefler. */
export function LocalPageView({ page }: { page: LocalPage }) {
  const jsonLd: WithContext<Course> = {
    "@context": "https://schema.org",
    "@type": "Course",
    name: page.title,
    description: page.description,
    inLanguage: "tr-TR",
    url: `${SITE_URL}/${page.slug}`,
    provider: {
      "@type": "EducationalOrganization",
      name: ORG.name,
      address: {
        "@type": "PostalAddress",
        addressLocality: ORG.legalCity,
        addressCountry: ORG.country,
      },
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ContentPage
        eyebrow={ORG.legalCity}
        title={page.heading}
        lead={page.description}
      >
        <CitableBlock question={`${page.heading} nerede?`}>
          {page.body.map((paragraph) => (
            <p key={paragraph.slice(0, 40)}>{paragraph}</p>
          ))}
        </CitableBlock>

        <CitableBlock question="Hangi yaş grupları için program var?">
          <p>
            Cezeri Robotech {AGE_GROUPS.join(", ")} yaş gruplarında program
            yürütür. Müfredat her yaş grubu için ayrı tasarlanır.
          </p>
        </CitableBlock>
      </ContentPage>
    </>
  );
}
