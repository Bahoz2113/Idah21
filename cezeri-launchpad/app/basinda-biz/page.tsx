import type { Metadata } from "next";
import Link from "next/link";
import { ContentPage } from "@/components/content/ContentPage";
import { PRESS } from "@/lib/site";
import { getFact } from "@/lib/facts";

export const metadata: Metadata = {
  title: "Basında Biz",
  description:
    "Cezeri Robotech'in Batman yerel basınında yer alan haberleri ve doğrulanmış kurumsal gelişmeleri.",
  alternates: { canonical: "/basinda-biz" },
};

export default function BasindaBizPage() {
  return (
    <ContentPage
      eyebrow="Basında Biz"
      title="Haberler"
      lead="Cezeri Robotech hakkında Batman yerel basınında çıkan haberler. Her kayıt, özgün kaynağına bağlantı taşır."
    >
      <ul className="space-y-0 border-t border-[var(--hairline)]">
        {PRESS.map((item) => {
          const fact = getFact(item.factId);
          return (
            <li key={item.slug} className="border-b border-[var(--hairline)]">
              <Link
                href={`/basinda-biz/${item.slug}`}
                className="group block py-7 transition-colors hover:bg-navy/15"
              >
                <time
                  dateTime={item.date}
                  className="t-mono mb-2 block text-ignition"
                >
                  {item.date}
                </time>
                <h2 className="font-display text-xl font-bold uppercase leading-snug text-cyber md:text-2xl">
                  {item.title}
                </h2>
                <p className="mt-2 font-body leading-relaxed text-ash">
                  {item.summary}
                </p>
                {fact && (
                  <p className="t-mono mt-3 text-ash/70">
                    Kaynak: {fact.sources.map((s) => s.publisher).join(" · ")}
                  </p>
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </ContentPage>
  );
}
