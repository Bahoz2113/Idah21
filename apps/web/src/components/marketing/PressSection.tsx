import { press } from "@/lib/seo/site";
import { Reveal } from "./Reveal";

/**
 * BASINDA BİZ.
 *
 * Yerel basında çıkan haberler ve sosyal paylaşımlar, kurumun kendi
 * anlattığından farklı bir güven katmanıdır: üçüncü taraf doğrulaması.
 * Arama motorları için de değerli — haber kaynağından gelen bağlam
 * kurumun gerçekliğini destekler.
 *
 * Haberler ve sosyal paylaşımlar ayrı listelenir; ikisi aynı ağırlıkta
 * değildir ve karıştırmak haber kaynağının değerini düşürür.
 *
 * Tarih yalnızca BİLİNİYORSA basılır. Bilinmeyen bir tarihi tahmin edip
 * yazmak, hiç yazmamaktan kötüdür.
 */

function PressRow({ item, index }: { item: (typeof press)[number]; index: number }) {
  return (
    <li>
      <Reveal delay={Math.min(index, 6) * 60}>
        <div className="group relative py-6">
          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:gap-6"
          >
            <span className="czr-mono shrink-0 text-[11px] uppercase tracking-[0.14em] text-czr-orange sm:w-44">
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

            {item.date ? (
              <span className="czr-mono shrink-0 text-[11px] tabular-nums text-czr-ice/45">
                {new Date(item.date).toLocaleDateString("tr-TR")}
              </span>
            ) : null}

            <span
              aria-hidden="true"
              className="shrink-0 text-czr-ice/40 transition duration-300 ease-czr-cine group-hover:translate-x-0.5 group-hover:text-czr-orange"
            >
              <svg viewBox="0 0 20 20" className="h-4 w-4" fill="currentColor">
                <path d="M6 4h10v10h-2V7.4L5.7 15.7 4.3 14.3 12.6 6H6V4z" />
              </svg>
            </span>
          </a>

          {/* Videosu olan haber, kaydına da doğrudan bağlanır. */}
          {item.video ? (
            <a
              href={item.video}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center gap-2 rounded-full border border-white/12 px-3 py-1.5 czr-mono text-[10px] uppercase tracking-[0.14em] text-czr-ice/60 transition duration-300 ease-czr-cine hover:border-czr-orange/45 hover:text-czr-orange sm:ml-[200px]"
            >
              <svg aria-hidden="true" viewBox="0 0 20 20" className="h-3 w-3" fill="currentColor">
                <path d="M7 4.5v11l9-5.5-9-5.5z" />
              </svg>
              Video kaydı
            </a>
          ) : null}
        </div>
      </Reveal>
    </li>
  );
}

export function PressSection() {
  const haberler = press.filter((p) => p.kind === "haber");
  const sosyal = press.filter((p) => p.kind === "sosyal");

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
    <div className="mt-12">
      {haberler.length > 0 ? (
        <section aria-labelledby="basin-haber">
          <Reveal>
            <h3
              id="basin-haber"
              className="czr-mono text-[10px] uppercase tracking-[0.18em] text-czr-ice/45"
            >
              Haber ve gazete
            </h3>
          </Reveal>
          <ol className="mt-4 divide-y divide-white/8 border-y border-white/8">
            {haberler.map((item, i) => (
              <PressRow key={item.url} item={item} index={i} />
            ))}
          </ol>
        </section>
      ) : null}

      {sosyal.length > 0 ? (
        <section aria-labelledby="basin-sosyal" className="mt-14">
          <Reveal>
            <h3
              id="basin-sosyal"
              className="czr-mono text-[10px] uppercase tracking-[0.18em] text-czr-ice/45"
            >
              Sosyal medya
            </h3>
          </Reveal>
          <ol className="mt-4 divide-y divide-white/8 border-y border-white/8">
            {sosyal.map((item, i) => (
              <PressRow key={item.url} item={item} index={i} />
            ))}
          </ol>
        </section>
      ) : null}
    </div>
  );
}
