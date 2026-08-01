import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { Course, WithContext } from "schema-dts";
import { ContentPage, CitableBlock } from "@/components/content/ContentPage";
import { WeekList } from "@/components/curriculum/WeekList";
import { PROGRAMS, getProgram } from "@/lib/curriculum";
import { ORG } from "@/lib/facts";
import { SITE_URL } from "@/lib/site";

export function generateStaticParams() {
  return PROGRAMS.map((p) => ({ program: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ program: string }>;
}): Promise<Metadata> {
  const { program } = await params;
  const p = getProgram(program);
  if (!p) return {};
  return {
    title: `${p.shortTitle} Müfredatı`,
    description: p.answer,
    alternates: { canonical: `/mufredat/${p.slug}` },
  };
}

export default async function ProgramPage({
  params,
}: {
  params: Promise<{ program: string }>;
}) {
  const { program } = await params;
  const p = getProgram(program);
  if (!p) notFound();

  /**
   * Course + syllabusSections — haftalık plan yapısal veriye de yansıtılır.
   * Cevap motorları müfredatı bu şemadan doğrudan okuyabilir.
   */
  const jsonLd: WithContext<Course> = {
    "@context": "https://schema.org",
    "@type": "Course",
    name: p.title,
    description: p.answer,
    inLanguage: "tr-TR",
    url: `${SITE_URL}/mufredat/${p.slug}`,
    typicalAgeRange: p.ageRange,
    numberOfCredits: p.weekCount,
    provider: {
      "@type": "EducationalOrganization",
      name: ORG.name,
      address: {
        "@type": "PostalAddress",
        addressLocality: ORG.legalCity,
        addressCountry: ORG.country,
      },
    },
    syllabusSections: p.weeks.map((w) => ({
      "@type": "Syllabus" as const,
      name: `${w.no}. Hafta — ${w.title}`,
      description: w.body,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ContentPage
        eyebrow={`${p.ageRange} · ${p.weekCount} hafta`}
        title={p.shortTitle}
        lead={p.lead}
      >
        <CitableBlock question={p.question}>
          <p>{p.answer}</p>
        </CitableBlock>

        <WeekList program={p} />
      </ContentPage>
    </>
  );
}
