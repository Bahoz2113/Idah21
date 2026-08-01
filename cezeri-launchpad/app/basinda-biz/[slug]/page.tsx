import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { NewsArticle, WithContext } from "schema-dts";
import { ContentPage, CitableBlock } from "@/components/content/ContentPage";
import { PRESS, SITE_URL } from "@/lib/site";
import { ORG, getFact } from "@/lib/facts";

export function generateStaticParams() {
  return PRESS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const item = PRESS.find((p) => p.slug === slug);
  if (!item) return {};

  return {
    title: item.title,
    description: item.summary,
    alternates: { canonical: `/basinda-biz/${item.slug}` },
    openGraph: {
      type: "article",
      title: item.title,
      description: item.summary,
      publishedTime: item.date,
    },
  };
}

export default async function PressDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = PRESS.find((p) => p.slug === slug);
  if (!item) notFound();

  const fact = getFact(item.factId);

  const jsonLd: WithContext<NewsArticle> = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: item.title,
    description: item.summary,
    datePublished: item.date,
    dateModified: item.date,
    inLanguage: "tr-TR",
    mainEntityOfPage: `${SITE_URL}/basinda-biz/${item.slug}`,
    about: { "@type": "Organization", name: ORG.name },
    publisher: { "@type": "Organization", name: ORG.name },
    ...(fact && {
      citation: fact.sources.map((s) => ({
        "@type": "CreativeWork" as const,
        name: s.publisher,
        url: s.url,
      })),
    }),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ContentPage eyebrow="Basında Biz" title={item.title} lead={item.summary}>
        <p className="t-mono mb-10 text-ash">
          Yayın tarihi: <time dateTime={item.date}>{item.date}</time>
        </p>

        {fact && (
          <>
            <CitableBlock question="Ne oldu?">
              <p>{fact.statement}</p>
            </CitableBlock>

            <section className="border-t border-[var(--hairline)] pt-8">
              <h2 className="t-mono mb-4 text-ignition">Kaynaklar</h2>
              <ul className="space-y-3">
                {fact.sources.map((s) => (
                  <li key={s.url}>
                    <a
                      href={s.url}
                      rel="noopener"
                      className="font-body text-cyber underline underline-offset-4 hover:text-ignition"
                    >
                      {s.publisher}
                    </a>
                    <span className="t-mono ml-3 break-all text-ash/60">
                      {s.url}
                    </span>
                  </li>
                ))}
              </ul>
              <p className="t-mono mt-6 text-ash/70">
                Bu sayfadaki bilgiler yukarıdaki bağımsız kaynaklara dayanır.
              </p>
            </section>
          </>
        )}
      </ContentPage>
    </>
  );
}
