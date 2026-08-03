import { faqs } from "@/lib/seo/site";
import { Reveal } from "./Reveal";

/**
 * 06 — SSS / AI SORGULAMA BÖLÜMÜ
 *
 * Yerel `<details>`/`<summary>` üzerine kurulmuştur — bilinçli bir karar:
 *
 *   • Cevap metni JavaScript çalışmasa bile DOM'da mevcuttur. JS ile
 *     açılan akordeonlarda içerik çoğu zaman kapalıyken render edilmez ve
 *     tarayıcı botu cevabı hiç görmez — GEO açısından ölümcül bir hata.
 *   • Klavye ve ekran okuyucu desteği tarayıcıdan gelir; ARIA taklidi gerekmez.
 *   • Ctrl+F ile sayfa içi arama kapalı cevapları da bulur.
 *
 * Aynı sorular `lib/seo/schema.ts` içindeki FAQPage grafiğini de besler —
 * görünen metinle structured data birebir aynıdır.
 */
export function FaqAccordion() {
  return (
    <div className="divide-y divide-white/8 border-y border-white/8">
      {faqs.map((faq, i) => (
        <Reveal key={faq.q} delay={Math.min(i, 5) * 60}>
          <details className="group py-1">
            <summary className="flex cursor-pointer list-none items-start justify-between gap-6 py-5 text-left [&::-webkit-details-marker]:hidden">
              <h3 className="text-[16px] font-semibold leading-snug text-white transition-colors group-open:text-czr-orange sm:text-lg">
                {faq.q}
              </h3>

              <span
                aria-hidden="true"
                className="mt-1 shrink-0 rounded-full border border-white/12 p-1.5 text-czr-ice/60 transition duration-300 ease-czr-cine group-open:rotate-45 group-open:border-czr-orange/50 group-open:text-czr-orange"
              >
                <svg viewBox="0 0 20 20" className="h-3.5 w-3.5" fill="currentColor">
                  <path d="M9 4h2v5h5v2h-5v5H9v-5H4V9h5z" />
                </svg>
              </span>
            </summary>

            <p className="max-w-3xl pb-6 pr-10 text-[15px] leading-relaxed text-czr-ice/65">
              {faq.a}
            </p>
          </details>
        </Reveal>
      ))}
    </div>
  );
}
