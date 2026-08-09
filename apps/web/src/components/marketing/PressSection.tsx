import { press } from "@/lib/seo/site";
import { Reveal } from "./Reveal";

/**
 * BASINDA BİZ.
 *
 * Yerel ve ulusal basında çıkan haberler, bir kurumun kendi hakkında
 * söylediklerinden farklı bir güven katmanıdır: üçüncü taraf doğrulaması.
 * Arama motorları için de değerlidir — haber kaynağından gelen bağlam,
 * kurumun gerçekliğini destekler.
 *
 * Liste `site.ts` içindeki `press` dizisinden gelir. Dizi boşken bölüm
 * kendini gizlemez; ne beklendiğini söyleyen bir durum satırı gösterir.
 * Boş bir bölüm göstermek, olmayan haberi uydurmaktan iyidir.
 */

export function PressSection() {
  if (press.length === 0) {
    return (
      <Reveal>
        <p className="czr-glass-panel mt-12 rounded-2xl px-6 py-8 text-[15px] leading-relaxed text-czr-ice/60">
          Basın bağlantıları hazırlanıyor. Yayınlanan haber, röportaj ve
          etkinlik haberlerimiz burada kaynağıyla birlikte listelenecek.
        </p>
      </Reveal>
    );
  }

  return (
    <ol className="mt-12 divide-y divide-white/8 border-y border-white/8">
      {press.map((item, i) => (
        <li key={item.url}>
          <Reveal delay={Math.min(i, 6) * 60}>
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col gap-2 py-6 transition-colors duration-300 sm:flex-row sm:items-baseline sm:gap-6"
            >
              <span className="czr-mono shrink-0 text-[11px] uppercase tracking-[0.14em] text-czr-orange sm:w-40">
                {item.outlet}
              </span>

              <span className="min-w-0 flex-1">
                <span className="block text-balance text-[17px] font-semibold leading-snug text-white transition-colors duration-300 group-hover:text-czr-orange sm:text-lg">
                  {item.title}
                </span>
                {item.summary ? (
                  <span className="mt-1.5 block text-[14px] leading-relaxed text-czr-ice/60">
                    {item.summary}
                  </span>
                ) : null}
              </span>

              <span className="czr-mono shrink-0 text-[11px] tabular-nums text-czr-ice/45">
                {item.date ? new Date(item.date).toLocaleDateString("tr-TR") : ""}
              </span>

              <span
                aria-hidden="true"
                className="shrink-0 text-czr-ice/40 transition duration-300 ease-czr-cine group-hover:translate-x-0.5 group-hover:text-czr-orange"
              >
                <svg viewBox="0 0 20 20" className="h-4 w-4" fill="currentColor">
                  <path d="M6 4h10v10h-2V7.4L5.7 15.7 4.3 14.3 12.6 6H6V4z" />
                </svg>
              </span>
            </a>
          </Reveal>
        </li>
      ))}
    </ol>
  );
}
