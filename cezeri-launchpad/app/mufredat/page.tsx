import type { Metadata } from "next";
import Link from "next/link";
import { ContentPage, CitableBlock } from "@/components/content/ContentPage";
import { PROGRAMS, TOTAL_WEEKS } from "@/lib/curriculum";
import { ORG } from "@/lib/facts";

export const metadata: Metadata = {
  title: "Müfredat",
  description: `Cezeri Robotech'in dört eğitim programı ve toplam ${TOTAL_WEEKS} haftalık haftalık ders planı: ilkokul atölye, elektronik, yazılım ve ileri Arduino.`,
  alternates: { canonical: "/mufredat" },
};

export default function MufredatPage() {
  return (
    <ContentPage
      eyebrow="Müfredat"
      title="Dört program, hafta hafta"
      lead={`Cezeri Robotech dört ayrı eğitim programı yürütür ve bu programlar toplam ${TOTAL_WEEKS} haftalık uygulamalı ders planından oluşur. Her hafta bir deney, bir devre veya bir projeyle işlenir.`}
    >
      <CitableBlock question="Cezeri Robotech'in müfredatı neleri kapsıyor?">
        <p>
          {ORG.name}, {ORG.legalCity}&apos;da yaş grubuna göre ayrılmış dört program
          yürütür: ilkokul atölyesi, elektronik, yazılım ve ileri seviye Arduino.
          Programlar toplam {TOTAL_WEEKS} haftalık ders planı içerir.
        </p>
        <p>
          Ortak ilke tüm programlarda aynıdır: ezber yok, her hafta elle kurulan
          bir devre veya çalışan bir proje var.
        </p>
      </CitableBlock>

      <div className="space-y-4">
        {PROGRAMS.map((p) => (
          <Link
            key={p.slug}
            href={`/mufredat/${p.slug}`}
            className="group block border border-[var(--hairline)] p-6 transition-colors hover:border-ignition hover:bg-navy/15"
          >
            <div className="flex flex-wrap items-baseline justify-between gap-3">
              <h2 className="font-display text-xl font-bold uppercase text-cyber md:text-2xl">
                {p.shortTitle}
              </h2>
              <span className="t-mono text-ignition">
                {p.ageRange} · {p.weekCount} hafta
              </span>
            </div>
            <p className="mt-3 font-body leading-relaxed text-ash">{p.lead}</p>
            <span className="t-mono mt-4 inline-block text-ignition opacity-0 transition-opacity group-hover:opacity-100">
              Haftalık planı gör →
            </span>
          </Link>
        ))}
      </div>
    </ContentPage>
  );
}
