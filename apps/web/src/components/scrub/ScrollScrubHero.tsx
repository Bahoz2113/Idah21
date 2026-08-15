"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef, useState } from "react";
import { defaultLocale, type Locale } from "@/lib/i18n/config";
import { ui } from "@/lib/i18n/ui";
import { org } from "@/lib/seo/site";

/**
 * KAYDIRMAYLA KAZINAN HERO.
 *
 * Kaydırma konumu videonun zamanına eşlenir: aşağı inince video ilerler,
 * yukarı çıkınca geri sarar, durunca karede donar. Video kendi kendine
 * ASLA oynamaz ve bir oynatıcı gibi görünmez — kontrol çubuğu, ilerleme
 * çubuğu, oynat düğmesi yoktur.
 *
 * KAYNAK. `cezeri-baykus-2k-kaynak.mp4` (2560×1440, 24 fps, 8,00 sn) bu
 * hero için üretildi. Türev `cezeri-scrub.mp4` ondan çıkar:
 * 1600×900 · 15 fps · CRF 20 · 5,3 saniye · 5,4 MB.
 *
 * NEDEN 5,3 SANİYE. Kaynağın son 2,7 saniyesinde sahnede holografik bir
 * "CEZERİ ROBOTECH" tabelası beliriyor. Gezinme çubuğu markanın adını
 * zaten taşıyor; ikisi aynı ekranda, üstelik farklı harf karakteriyle yan
 * yana gelince tasarım kaza gibi duruyordu (ölçüldü, ekran görüntüsüyle
 * karşılaştırıldı). Kesim baykuşun kanatlarını açtığı karede yapılır —
 * final beat korunur, ikinci logo düşer. Kesimin ikinci faydası teknik:
 * 80 kare 120 kare yerine, aynı bütçeyle 1280 px değil 1600 px genişlik.
 *
 * ÜÇ KURAL — üçü de takılmayı önlemek için, hiçbiri süs değil:
 *
 * 1. KAYNAK TÜMÜYLE ANAHTAR KARE. Türev her karesi I-frame olacak şekilde
 *    kodlandı (80/80 ölçüldü). Normal bir MP4'te
 *    araya konan kareler yalnızca farkı taşır; geri sararken kod çözücü en
 *    yakın anahtar kareye dönüp aradaki her kareyi yeniden çözmek zorunda
 *    kalır ve görüntü kilitlenir.
 *
 * 2. TEK SAAT. Lenis, GSAP ticker'ından beslenir (bkz. `SmoothScroll`).
 *
 * 3. ARAMA `onUpdate` İÇİNDE YAPILMAZ. ScrollTrigger yalnızca hedefi bir
 *    değişkene yazar. Gerçek `currentTime` ataması AYRI bir ticker
 *    fonksiyonunda, yumuşatılarak yapılır. Kaydırma olayı saniyede
 *    onlarca kez tetiklenir; her tetiklemede kod çözücüden yeni bir kare
 *    istemek onu boğar. Ticker kare hızında çalışır ve her karede en
 *    fazla bir arama yapar.
 *
 * Azaltılmış harekette hiçbir ScrollTrigger ve ticker kurulmaz; aynı
 * videonun tek bir karesi durur, metinler animasyonsuz okunur.
 */

/** Kaydırma yumuşatması. Düşük değer daha sinematik, yüksek değer daha teknik. */
const SEEK_LERP = 0.12;
/** Bu eşiğin altındaki fark için arama yapılmaz — gereksiz kare isteği kod çözücüyü yorar. */
const SEEK_EPSILON = 0.015;

export function ScrollScrubHero({ locale = defaultLocale }: { locale?: Locale }) {
  const t = ui(locale);
  const section = useRef<HTMLElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const copy = useRef<HTMLDivElement>(null);
  const hint = useRef<HTMLDivElement>(null);

  const [ready, setReady] = useState(false);
  const [tall, setTall] = useState(true);
  // Kaynak seçimi ekran ölçüsü OKUNMADAN yapılamaz; o yüzden üç durumlu.
  const [kaynak, setKaynak] = useState<"masaustu" | "mobil" | null>(null);

  // Mobilde kaydırma yolu kısalır: 500vh'lik bir hero telefonda bitmek
  // bilmez ve kullanıcı içeriğe ulaşamadan vazgeçer.
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    const apply = () => {
      setTall(!mq.matches);
      // Kaynak yalnızca İLK okumada seçilir, pencere büyüyünce değişmez:
      // `src` değiştirmek videoyu sıfırdan indirtir ve scrub konumunu
      // düşürür. Telefonu yatay çeviren kullanıcı 960px'lik kareyi biraz
      // yumuşak görür — yeni bir indirme başlatmaktan iyidir.
      setKaynak((önceki) => önceki ?? (mq.matches ? "mobil" : "masaustu"));
    };
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  // `<source>` çocukları videoya SONRADAN eklendiğinde kaynak seçimini
  // spec kendiliğinden tetikler ("insert source element" adımı); ayrıca
  // `load()` ÇAĞRILMAZ. Çağrıldığında yarıda kesilen ilk seçim kendi
  // yedeğine (WebM) ilerliyor, yeni seçim MP4'ü alıyor ve İKİ dosya
  // birden iniyor (ölçüldü: masaüstünde 5,7 MB yerine 11,5 MB).

  useEffect(() => {
    const el = section.current;
    const vid = video.current;
    if (!el || !vid) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      // Tek kare: videonun başı. Oynatma yok, kaydırma bağı yok.
      const freeze = () => {
        vid.pause();
        try {
          vid.currentTime = 0.05;
        } catch {
          /* metadata henüz yoksa sessizce geç */
        }
      };
      vid.addEventListener("loadeddata", freeze);
      setReady(true);
      return () => vid.removeEventListener("loadeddata", freeze);
    }

    gsap.registerPlugin(ScrollTrigger);

    // KURAL 3 — ScrollTrigger ile arama arasındaki tek köprü bu değişken.
    let targetProgress = 0;
    let current = 0;
    let duration = 0;

    const onMeta = () => {
      duration = Number.isFinite(vid.duration) ? vid.duration : 0;
      // Ölçüler yerleştikten sonra tetikleyici yeniden hesaplanmalı;
      // aksi hâlde hero yüksekliği video gelmeden hesaplanmış olur.
      ScrollTrigger.refresh();
    };

    const onData = () => setReady(true);

    vid.addEventListener("loadedmetadata", onMeta);
    vid.addEventListener("loadeddata", onData);
    if (vid.readyState >= 1) onMeta();
    if (vid.readyState >= 2) onData();

    // Yükleme perdesi hiçbir koşulda takılı kalmamalı. Video hiç
    // gelmezse (ağ kopuk, kodek desteklenmiyor, dosya bozuk) manşet ve
    // eylem metni perdenin altında kalırdı — sayfanın en önemli metni
    // görünmez olurdu. Bu güvenlik ağı 2,5 saniye sonra perdeyi kaldırır;
    // arkada video yerine markanın koyu zemini durur, metin okunur.
    const onFail = () => setReady(true);
    vid.addEventListener("error", onFail);
    const bail = window.setTimeout(onFail, 2500);

    const trigger = ScrollTrigger.create({
      trigger: el,
      start: "top top",
      end: "bottom bottom",
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        targetProgress = self.progress;
      },
    });

    // Metin sönümü için hazır setter'lar: her karede stil dizesi kurmak
    // yerine GSAP'in doğrudan yazıcısı kullanılır.
    const setCopyOpacity = copy.current ? gsap.quickSetter(copy.current, "opacity") : null;
    const setCopyY = copy.current ? gsap.quickSetter(copy.current, "y", "px") : null;
    const setHintOpacity = hint.current ? gsap.quickSetter(hint.current, "opacity") : null;

    const seek = () => {
      if (duration > 0) {
        const target = targetProgress * duration;
        current += (target - current) * SEEK_LERP;

        // Video hiçbir koşulda kendi kendine oynamaz.
        if (!vid.paused) vid.pause();

        if (Math.abs(vid.currentTime - current) > SEEK_EPSILON) {
          vid.currentTime = current;
        }
      }

      // Görsel güncellemeler de bu akışta — `onUpdate` içinde DOM'a
      // dokunmak kaydırma olayını ağırlaştırırdı.
      const p = targetProgress;
      if (setHintOpacity) setHintOpacity(1 - Math.min(1, p / 0.12));
      if (setCopyOpacity && setCopyY) {
        const out = Math.max(0, (p - 0.85) / 0.15);
        setCopyOpacity(1 - out);
        setCopyY(out * -40);
      }
    };

    gsap.ticker.add(seek);

    const onResize = () => ScrollTrigger.refresh();
    window.addEventListener("resize", onResize);

    return () => {
      gsap.ticker.remove(seek);
      trigger.kill();
      window.clearTimeout(bail);
      window.removeEventListener("resize", onResize);
      vid.removeEventListener("loadedmetadata", onMeta);
      vid.removeEventListener("loadeddata", onData);
      vid.removeEventListener("error", onFail);
    };
  }, [tall]);

  return (
    <section
      ref={section}
      id="esik"
      aria-labelledby="czr-hero-baslik"
      className="relative"
      style={{ height: tall ? "500vh" : "320vh" }}
    >
      <div className="sticky top-0 h-[100svh] w-full overflow-hidden">
        {/* İki kaynak, MP4 ÖNCE: tarayıcı oynatabildiği İLK kaynağı seçer.
            Chrome, Safari, Edge ve sistem kodeklerine sahip Firefox H.264
            oynatır ve MP4'ü indirir. WebM yalnızca tescilli kodek
            derlenmemiş sürümler için yedektir — o kullanıcı da boş bir
            hero görmez.

            KAYNAKLAR SUNUCUDA DEĞİL, EKRAN ÖLÇÜSÜ OKUNDUKTAN SONRA BASILIR.
            Sunucu HTML'ine kaynak yazılsaydı telefon, hidrasyon beklemeden
            5,7 MB'lık masaüstü dosyasını indirmeye başlardı (ölçüldü:
            mobil ilk yükün 7,2 MB'ının 5,9'u bu videoydu). `<source media>`
            HTML'den kaldırıldığı için ayrım ancak JS ile yapılabiliyor;
            bedeli, indirmeye hidrasyondan sonra başlamak. Yükleme perdesi
            ve 2,5 sn'lik güvenlik ağı bu gecikmeyi zaten karşılıyor.

            Mobil kopya aynı kesimin 960×540 hâli (1,6 MB, 80/80 anahtar
            kare) — telefonda kadraj zaten ortadan kırpılıyor, fark
            görünmüyor. */}
        <video
          ref={video}
          className="absolute inset-0 h-full w-full object-cover"
          // Kaynak 2560×1440 (16:9) — hero'nun en boy oranıyla aynı, yani
          // masaüstünde neredeyse hiç kırpma olmuyor. Önceki kaynak 608 px
          // genişliğinde dikey bir dosyaydı ve masaüstünde ~3× büyütülüyordu;
          // "kaydırdıkça bozuluyor" şikâyetinin kök nedeni buydu.
          //
          // Özne kadrajın ortasında duruyor, bu yüzden odak da merkez: yatayda
          // kaydırmak baykuşu kenara iter. Telefonda kırpılan eksen yataydır
          // (0,46'ya karşı 1,78) ve merkez korunduğu için baykuş kadrajda kalır.
          style={{ objectPosition: "center center" }}
          muted
          playsInline
          preload="auto"
        >
          {kaynak === "mobil" ? (
            <>
              <source src="/assets/brand/cezeri-scrub-mobil.mp4" type="video/mp4" />
              <source src="/assets/brand/cezeri-scrub-mobil.webm" type="video/webm" />
            </>
          ) : kaynak === "masaustu" ? (
            <>
              <source src="/assets/brand/cezeri-scrub.mp4" type="video/mp4" />
              <source src="/assets/brand/cezeri-scrub.webm" type="video/webm" />
            </>
          ) : null}
        </video>

        {/* Okunabilirlik yıkaması.
            İki katman, çünkü tek bir dikey gradyan yetmiyordu: video
            kare kare değişiyor ve bazı karelerde metnin arkası açık
            griye dönüyor — beyaz manşet o karelerde eriyordu (ölçüldü).

            YATAY katman metnin durduğu sol kolonu toplar, sağ tarafı
            videoya bırakır. DİKEY katman üstte gezinme çubuğunu, altta
            bir sonraki bölüme geçişi tutar. İkisi de renksiz: markanın
            koyu zemini, üstüne renk atmıyor. */}
        <div
          aria-hidden="true"
          // `scrub-wash-x`: sağdan sola düzende bu gradyan aynalanır
          // (bkz. marketing.css). Metin kolonu sağa geçtiği için yıkama
          // da dönmezse manşet videonun aydınlık tarafında kalırdı.
          className="scrub-wash-x absolute inset-0"
          style={{
            background:
              "linear-gradient(90deg, rgba(10,25,29,0.92) 0%, rgba(10,25,29,0.78) 34%, rgba(10,25,29,0.30) 62%, rgba(10,25,29,0.10) 100%)",
          }}
        />
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(10,25,29,0.72) 0%, rgba(10,25,29,0.10) 26%, rgba(10,25,29,0.10) 68%, rgba(10,25,29,0.80) 100%)",
          }}
        />

        {/* Yükleme durumu: sade, sayfayı zıplatmayan, hazır olunca sönen. */}
        <div
          aria-hidden="true"
          className={`absolute inset-0 grid place-items-center bg-[var(--color-surface-dark)] transition-opacity duration-700 ${
            ready ? "pointer-events-none opacity-0" : "opacity-100"
          }`}
        >
          <span className="scrub-mono text-[10px] uppercase tracking-[0.28em] text-[var(--color-brand-accent)]">
            {t.heroLoading}
          </span>
        </div>

        <div className="relative z-10 flex h-full items-center">
          <div ref={copy} className="mx-auto w-full max-w-7xl px-6 lg:px-10">
            <div className="max-w-3xl">
              <p className="scrub-mono text-[10px] uppercase tracking-[0.28em] text-[var(--color-brand-accent)] sm:text-[11px]">
                {t.heroEyebrow}
              </p>

              <h1
                id="czr-hero-baslik"
                className="scrub-display mt-7 text-balance text-white"
              >
                {t.heroHeadlineTop}
                <br />
                {t.heroHeadlineBottom}
              </h1>

              <p className="mt-7 max-w-xl text-pretty text-lg leading-relaxed text-white/80 sm:text-xl">
                {org.tagline}
              </p>

              <p className="mt-5 max-w-xl text-pretty text-[15px] leading-relaxed text-white/60">
                {org.description}
              </p>
            </div>
          </div>
        </div>

        <div
          ref={hint}
          aria-hidden="true"
          className="absolute inset-x-0 bottom-8 z-10 flex flex-col items-center gap-3"
        >
          <span className="scrub-mono text-[10px] uppercase tracking-[0.2em] text-white/55">
            {t.heroScrollHint}
          </span>
          <span className="relative h-12 w-px overflow-hidden bg-white/20">
            <span className="absolute inset-x-0 top-0 h-1/2 animate-scan-line bg-[var(--color-brand-accent)]" />
          </span>
        </div>
      </div>
    </section>
  );
}
