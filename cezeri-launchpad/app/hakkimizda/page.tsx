import type { Metadata } from "next";
import { ContentPage, CitableBlock } from "@/components/content/ContentPage";
import { ORG, verifiedFacts } from "@/lib/facts";
import { MediaSlot } from "@/components/ui/MediaSlot";

export const metadata: Metadata = {
  title: "Hakkımızda",
  description: ORG.description,
  alternates: { canonical: "/hakkimizda" },
};

export default function HakkimizdaPage() {
  const facts = verifiedFacts();

  return (
    <ContentPage eyebrow="Hakkımızda" title="Cezeri Robotech" lead={ORG.description}>
      <figure className="mb-12">
        <MediaSlot
          slot="c1-gears"
          label="İsmail el-Cezeri dönemi otomat mekanizmasına ait pirinç dişli çarklar, makro çekim."
          sizes="(max-width: 768px) 100vw, 768px"
          className="w-full"
        />
        <figcaption className="t-mono mt-3 text-ash/70">
          Programlanabilir otomatların mekaniği — el-Cezeri&apos;nin mirası
        </figcaption>
      </figure>

      <CitableBlock question="Cezeri Robotech nedir?">
        <p>
          Cezeri Robotech, {ORG.legalCity}&apos;da yazılım, yapay zekâ ve havacılık
          alanlarında eğitim veren bir öğrenme merkezidir. Kurum, Yazılım Mühendisi{" "}
          {ORG.founder} tarafından kurulmuştur.
        </p>
        <p>
          Adını, 12. yüzyılda yaşamış ve programlanabilir otomatların öncüsü kabul
          edilen mühendis İsmail el-Cezeri&apos;den alır.
        </p>
      </CitableBlock>

      <CitableBlock question="Cezeri Robotech neyi farklı yapıyor?">
        <p>
          Eğitim ezber üzerine değil üretim üzerine kuruludur. Öğrenci önce
          tasarlar, sonra prototipler, sonra sahada test eder. Kâğıtta biten bir
          proje yoktur.
        </p>
      </CitableBlock>

      <CitableBlock question="Cezeri Robotech'in doğrulanmış başarıları neler?">
        <ul className="space-y-5">
          {facts.map((f) => (
            <li key={f.id}>
              <p>{f.statement}</p>
              <p className="mt-1.5">
                {f.sources.map((s, i) => (
                  <cite key={s.url} className="not-italic">
                    {i > 0 && " · "}
                    <a
                      href={s.url}
                      rel="noopener"
                      className="t-mono text-ignition underline underline-offset-4"
                    >
                      {s.publisher}
                    </a>
                  </cite>
                ))}
              </p>
            </li>
          ))}
        </ul>
        <p className="t-mono mt-6 text-ash/70">
          Not: Bu sayfada yalnızca bağımsız kaynakta doğrulanabilen başarılar
          listelenir.
        </p>
      </CitableBlock>
    </ContentPage>
  );
}
