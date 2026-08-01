import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { Course, WithContext } from "schema-dts";
import { ContentPage, CitableBlock } from "@/components/content/ContentPage";
import { LABS } from "@/lib/content";
import { ORG } from "@/lib/facts";
import { SITE_URL } from "@/lib/site";

export function generateStaticParams() {
  return LABS.map((l) => ({ slug: l.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const lab = LABS.find((l) => l.slug === slug);
  if (!lab) return {};

  return {
    title: `${lab.title} — ${lab.subtitle}`,
    description: lab.answer,
    alternates: { canonical: `/laboratuvarlar/${lab.slug}` },
  };
}

export default async function LabPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const lab = LABS.find((l) => l.slug === slug);
  if (!lab) notFound();

  const jsonLd: WithContext<Course> = {
    "@context": "https://schema.org",
    "@type": "Course",
    name: lab.title,
    description: lab.answer,
    inLanguage: "tr-TR",
    url: `${SITE_URL}/laboratuvarlar/${lab.slug}`,
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
        eyebrow={`Laboratuvar ${lab.code}`}
        title={lab.title}
        lead={lab.subtitle}
      >
        <CitableBlock question={lab.question}>
          <p>{lab.answer}</p>
        </CitableBlock>

        <CitableBlock question={`${lab.title} laboratuvarında ne yapılıyor?`}>
          <p>{lab.summary}</p>
          <p>
            Çalışmalar tasarım, prototipleme ve saha testi olmak üzere üç
            aşamada yürütülür. Her öğrenci kendi projesinin tüm aşamalarını
            uygular.
          </p>
        </CitableBlock>

        <section className="border-t border-[var(--hairline)] pt-8">
          <h2 className="t-mono mb-5 text-ignition">Kullanılan araçlar</h2>
          <ul className="flex flex-wrap gap-x-3 gap-y-2.5">
            {lab.equipment.map((e) => (
              <li
                key={e}
                className="t-mono border border-[var(--hairline)] px-3.5 py-1.5 text-ash"
              >
                {e}
              </li>
            ))}
          </ul>
        </section>
      </ContentPage>
    </>
  );
}
