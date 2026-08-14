import Image from "next/image";
import { BrandSequence } from "./BrandSequence";
import { LegacyTimeline } from "./LegacyTimeline";
import { Reveal } from "./Reveal";
import type { Locale } from "@/lib/i18n/config";
import { content } from "@/lib/i18n/content";

/**
 * BİZ KİMİZ — kurumsal otobiyografi bölümü.
 *
 * Bu bölüm sayfanın en uzun metnidir ve bilerek öyledir: bir veli
 * "burası kim, neye inanıyor, çocuğumu kime emanet ediyorum" sorusunun
 * cevabını burada arar. Arama motorları açısından da sayfanın konu
 * otoritesini taşıyan blok budur — kurum tanımı, faaliyet alanları,
 * yaş aralığı, iş birlikleri ve doğrulanabilir olaylar tek anlatıda.
 *
 * OKUMA RİTMİ. Uzun metnin tek blok hâlinde akması okumayı öldürür.
 * Üç farklı doku dönüşümlü kullanılıyor:
 *   1. İKİ KOLONLU ANLATI — solda başlık, sağda gövde. Ölçü (measure)
 *      65 karakter civarında kalır.
 *   2. ALINTI BANDI — büyük puntolu tek cümle. Gözün dinlendiği yer ve
 *      bölümün tezini taşıyan cümle. Kurucunun belgesinde bu cümleler
 *      ayrıca işaretlenmişti.
 *   3. IZGARA — değerler ve misyon/vizyon kart olarak. Liste hâlinde
 *      okunması gereken içerik paragraf olarak okunmaz.
 *
 * MARKA SEKANSI KORUNDU. Dişlilerden mekanik baykuşa dönüşen klip
 * bölümün sonunda, adın hikâyesini anlatan alt blokta duruyor. Bölüm
 * "Miras"tan "Biz Kimiz"e döndüğünde bu klip anlamını kaybetmedi;
 * tersine, kurumun adını nereden aldığı artık kendi başlığını taşıyor.
 *
 * BAŞLIKLAR h3. Bölümün h2'si `SectionHeading` içinde; buradaki alt
 * başlıklar onun altına asılır. Sıra atlanırsa ekran okuyucu belge
 * ana hattını yanlış kurar.
 */

/** Alıntı bandı — bölümün tezini taşıyan tek cümle. */
function PullQuote({ text, index }: { text: string; index: number }) {
  return (
    <Reveal>
      <figure className="relative my-20 lg:my-24">
        {/* Turuncu ray: alıntıyı gövde metninden ayıran tek işaret.
            Tırnak karakteri yerine ray tercih edildi — tırnak dört dilde
            farklı biçimde çizilir (« », " ", „ "), ray her dilde aynı. */}
        <span
          aria-hidden="true"
          className="absolute inset-y-0 start-0 w-[3px] rounded-full bg-gradient-to-b from-czr-orange via-czr-orange/50 to-transparent"
        />
        <blockquote className="ps-7 sm:ps-10">
          <p className="text-balance text-[22px] font-bold leading-[1.35] tracking-[-0.01em] text-white sm:text-[30px] lg:text-[36px]">
            {text}
          </p>
        </blockquote>
        <figcaption className="czr-mono mt-4 ps-7 text-[10px] uppercase tracking-[0.2em] text-czr-ice/35 sm:ps-10">
          {String(index).padStart(2, "0")}
        </figcaption>
      </figure>
    </Reveal>
  );
}

/** İki kolonlu anlatı bloğu — solda başlık, sağda gövde. */
function NarrativeBlock({
  index,
  title,
  body,
}: {
  index: number;
  title: string;
  body: readonly string[];
}) {
  return (
    <section className="grid gap-6 border-t border-white/8 py-14 lg:grid-cols-12 lg:gap-14 lg:py-16">
      <Reveal className="lg:col-span-4">
        {/* Başlık geniş ekranda kaydırma boyunca sabit kalır: uzun bir
            gövdeyi okurken hangi başlığın altında olduğun görünür kalsın.
            `top` değeri gezinme çubuğunun yüksekliğinden büyük. */}
        <div className="lg:sticky lg:top-32">
          <span className="czr-mono block text-[11px] tabular-nums text-czr-orange">
            {String(index).padStart(2, "0")}
          </span>
          <h3 className="mt-3 text-balance text-[22px] font-bold leading-tight text-white sm:text-[26px]">
            {title}
          </h3>
        </div>
      </Reveal>

      <div className="space-y-5 lg:col-span-8">
        {body.map((p, i) => (
          <Reveal key={p.slice(0, 24)} delay={Math.min(i, 4) * 60}>
            <p className="max-w-prose text-pretty text-[15px] leading-[1.75] text-czr-ice/75 sm:text-[16.5px]">
              {p}
            </p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

export function AboutSection({ locale }: { locale: Locale }) {
  const a = content(locale).about;

  return (
    <div className="mt-14">
      {/* ── Kimlik: ekip fotoğrafı + açılış anlatısı ────────────── */}
      <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
        <Reveal className="lg:col-span-5">
          <figure>
            <div className="czr-rim relative aspect-square overflow-hidden rounded-3xl border border-white/10">
              {/*
                GERÇEK FOTOĞRAF. Kurumun kendi arşivinden; stok ya da
                üretilmiş görsel değil. Bölümün tamamı "biz kimiz"
                diyorsa buradaki yüzler gerçek olmak zorunda.

                `priority` YOK: bölüm sayfanın ortasında, ilk ekranda
                değil. Öncelik verilseydi hero videosuyla bant genişliği
                için yarışır ve LCP'yi geciktirirdi.
              */}
              <Image
                src="/assets/real-media/ekip-egitmenler-01.webp"
                alt={a.photoAlt}
                fill
                sizes="(min-width: 1024px) 520px, 92vw"
                loading="lazy"
                className="object-cover"
              />
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-gradient-to-t from-czr-base/70 via-transparent to-transparent"
              />
            </div>
            <figcaption className="czr-mono mt-3 text-[10px] uppercase tracking-[0.16em] text-czr-ice/40">
              {a.photoCaption}
            </figcaption>
          </figure>
        </Reveal>

        <div className="space-y-5 lg:col-span-7 lg:pt-2">
          {a.identity.map((p, i) => (
            <Reveal key={p.slice(0, 24)} delay={Math.min(i, 3) * 80}>
              <p className="max-w-prose text-pretty text-[15px] leading-[1.75] text-czr-ice/80 sm:text-[16.5px]">
                {p}
              </p>
            </Reveal>
          ))}
        </div>
      </div>

      <PullQuote text={a.quotes[0]} index={1} />

      {/* ── Anlatı blokları ──────────────────────────────────────
          Alıntılar araya kasıtlı olarak dağıtıldı: iki blok, alıntı,
          iki blok, alıntı, son blok. Hepsi arka arkaya dizilseydi
          nefes alma noktası kalmazdı. */}
      <NarrativeBlock index={1} title={a.blocks[0].title} body={a.blocks[0].body} />
      <NarrativeBlock index={2} title={a.blocks[1].title} body={a.blocks[1].body} />

      <PullQuote text={a.quotes[1]} index={2} />

      <NarrativeBlock index={3} title={a.blocks[2].title} body={a.blocks[2].body} />
      <NarrativeBlock index={4} title={a.blocks[3].title} body={a.blocks[3].body} />

      <PullQuote text={a.quotes[2]} index={3} />

      <NarrativeBlock index={5} title={a.blocks[4].title} body={a.blocks[4].body} />

      {/* ── Değerler ─────────────────────────────────────────────
          Altı değer paragraf olarak yazılsaydı okunmazdı; liste
          niteliğindeki içerik ızgarada okunur. */}
      <section className="border-t border-white/8 pt-14">
        <Reveal>
          <h3 className="text-[22px] font-bold leading-tight text-white sm:text-[26px]">
            {a.valuesTitle}
          </h3>
        </Reveal>

        <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {a.values.map((v, i) => (
            <li key={v.title}>
              <Reveal delay={Math.min(i, 5) * 60}>
                <div className="czr-glass-panel czr-rim h-full rounded-2xl p-6">
                  <span className="czr-mono block text-[10px] tabular-nums text-czr-orange">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h4 className="mt-3 text-[17px] font-bold leading-snug text-white">
                    {v.title}
                  </h4>
                  <p className="mt-2.5 text-[14px] leading-relaxed text-czr-ice/70">{v.body}</p>
                </div>
              </Reveal>
            </li>
          ))}
        </ul>
      </section>

      {/* ── Misyon ve vizyon ─────────────────────────────────────
          Yan yana duruyorlar çünkü biri bugünü biri yarını tarif eder;
          alt alta dizilselerdi bu karşıtlık görünmezdi. */}
      <div className="mt-16 grid gap-4 lg:grid-cols-2">
        {[
          { t: a.missionTitle, b: a.mission },
          { t: a.visionTitle, b: a.vision },
        ].map((item, i) => (
          <Reveal key={item.t} delay={i * 90}>
            <div className="czr-rim h-full rounded-3xl border border-czr-orange/25 bg-czr-orange/[0.05] p-7 sm:p-9">
              <h3 className="czr-mono text-[11px] uppercase tracking-[0.2em] text-czr-orange">
                {item.t}
              </h3>
              <p className="mt-4 text-pretty text-[15px] leading-[1.75] text-czr-ice/85 sm:text-[16.5px]">
                {item.b}
              </p>
            </div>
          </Reveal>
        ))}
      </div>

      {/* ── Adımızın hikâyesi: marka sekansı + kronoloji ──────────
          Marka klibi ve el-Cezerî kronolojisi bölüm "Miras" adını
          taşırken sayfanın tamamıydı. Bölüm "Biz Kimiz"e dönünce
          kaldırılmadılar; kurumun adını nereden aldığı hikâyenin
          parçasıdır ve artık kendi alt başlığıyla duruyor. */}
      <section className="mt-20 border-t border-white/8 pt-14">
        <Reveal>
          <h3 className="text-[22px] font-bold leading-tight text-white sm:text-[26px]">
            {a.heritageTitle}
          </h3>
          <p className="mt-4 max-w-prose text-pretty text-[15px] leading-[1.75] text-czr-ice/70 sm:text-[16.5px]">
            {a.heritageLead}
          </p>
        </Reveal>

        <div className="mt-12 grid gap-12 lg:grid-cols-5 lg:items-center lg:gap-16">
          <div className="mx-auto w-full max-w-sm lg:col-span-2 lg:mx-0">
            <BrandSequence locale={locale} />
          </div>
          <div className="lg:col-span-3">
            <LegacyTimeline locale={locale} />
          </div>
        </div>
      </section>

      {/* ── Geleceğe verdiğimiz söz ──────────────────────────────
          Bölümün kapanışı ortalanır ve daralır: uzun bir okumadan
          sonra göz merkeze döner, kurumun sözü orada durur. */}
      <section className="mt-20 border-t border-white/8 pt-16 text-center">
        <Reveal>
          <h3 className="czr-mono text-[11px] uppercase tracking-[0.2em] text-czr-orange">
            {a.promiseTitle}
          </h3>
        </Reveal>

        <div className="mx-auto mt-7 max-w-3xl space-y-5">
          {a.promise.map((p, i) => (
            <Reveal key={p.slice(0, 24)} delay={Math.min(i, 4) * 70}>
              <p className="text-pretty text-[15px] leading-[1.75] text-czr-ice/75 sm:text-[16.5px]">
                {p}
              </p>
            </Reveal>
          ))}
        </div>

        <Reveal delay={120}>
          <p className="mx-auto mt-12 max-w-3xl text-balance text-[22px] font-bold leading-[1.35] text-white sm:text-[30px] lg:text-[34px]">
            {a.quotes[3]}
          </p>
        </Reveal>

        <Reveal delay={200}>
          <p className="mx-auto mt-10 max-w-2xl text-pretty text-[15px] leading-relaxed text-czr-ice/65">
            {a.signOff}
          </p>
        </Reveal>

        <Reveal delay={260}>
          {/* Slogan kurumun imzasıdır ve `org.slogan` ile aynı satırdan
              beslenir — sayfada, üst veride ve şemada tek metin. */}
          <p className="czr-mono mt-8 text-[12px] uppercase leading-relaxed tracking-[0.24em] text-czr-orange sm:text-[13px]">
            {content(locale).org.slogan}
          </p>
        </Reveal>
      </section>
    </div>
  );
}
