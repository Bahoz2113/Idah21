import type { Metadata } from "next";
import type { FAQPage, WithContext } from "schema-dts";
import { ContentPage, CitableBlock } from "@/components/content/ContentPage";
import { FAQS } from "@/lib/site";

export const metadata: Metadata = {
  title: "Sık Sorulan Sorular",
  description:
    "Cezeri Robotech hakkında sık sorulan sorular: Batman'da robotik kodlama kursu, yaş grupları, yapay zekâ eğitimi ve kurumsal iş birlikleri.",
  alternates: { canonical: "/sss" },
};

/**
 * FAQPage — AEO'nun ana yakıtı.
 *
 * Her soru-cevap bloğu kendi kendine yeter: özne açık, zamir yok, kurum adı
 * tam yazılır. Cevap motorları pasajları bağımsız sıralar; bir bloğun anlamı
 * bir öncekine bağlıysa alıntılanamaz.
 */
const jsonLd: WithContext<FAQPage> = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQS.map((f) => ({
    "@type": "Question",
    name: f.question,
    acceptedAnswer: { "@type": "Answer", text: f.answer },
  })),
};

export default function SssPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ContentPage
        eyebrow="Sık Sorulan Sorular"
        title="Merak edilenler"
        lead="Cezeri Robotech, Batman'da yazılım, yapay zekâ ve havacılık alanlarında eğitim veren bir öğrenme merkezidir. En sık sorulan sorular ve yanıtları aşağıdadır."
      >
        {FAQS.map((f) => (
          <CitableBlock key={f.question} question={f.question}>
            <p>{f.answer}</p>
          </CitableBlock>
        ))}
      </ContentPage>
    </>
  );
}
