"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef, useState } from "react";
import { org } from "@/lib/seo/site";

/**
 * KAYDIRMAYLA KAZINAN HERO.
 *
 * Kaydırma konumu videonun zamanına eşlenir: aşağı inince video ilerler,
 * yukarı çıkınca geri sarar, durunca karede donar. Video kendi kendine
 * ASLA oynamaz ve bir oynatıcı gibi görünmez — kontrol çubuğu, ilerleme
 * çubuğu, oynat düğmesi yoktur.
 *
 * ÜÇ KURAL — üçü de takılmayı önlemek için, hiçbiri süs değil:
 *
 * 1. KAYNAK TÜMÜYLE ANAHTAR KARE. `cezeri-scrub.mp4` her karesi I-frame
 *    olacak şekilde yeniden kodlandı (197/197 ölçüldü). Normal bir MP4'te
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

export function ScrollScrubHero() {
  const section = useRef<HTMLElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const copy = useRef<HTMLDivElement>(null);
  const hint = useRef<HTMLDivElement>(null);

  const [ready, setReady] = useState(false);
  const [tall, setTall] = useState(true);

  // Mobilde kaydırma yolu kısalır: 500vh'lik bir hero telefonda bitmek
  // bilmez ve kullanıcı içeriğe ulaşamadan vazgeçer.
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    const apply = () => setTall(!mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

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
      window.removeEventListener("resize", onResize);
      vid.removeEventListener("loadedmetadata", onMeta);
      vid.removeEventListener("loadeddata", onData);
    };
  }, [tall]);

  return (
    <section
      ref={section}
      id="esik"
      aria-labelledby="sinema-hero-baslik"
      className="relative"
      style={{ height: tall ? "500vh" : "320vh" }}
    >
      <div className="sticky top-0 h-[100svh] w-full overflow-hidden">
        {/* İki kaynak, MP4 ÖNCE: tarayıcı oynatabildiği İLK kaynağı seçer.
            Chrome, Safari, Edge ve sistem kodeklerine sahip Firefox H.264
            oynatır ve daha küçük olan MP4'ü indirir (4,5 MB). WebM yalnızca
            tescilli kodek derlenmemiş sürümler için yedektir — o kullanıcı
            da boş bir hero görmez. */}
        <video
          ref={video}
          className="absolute inset-0 h-full w-full object-cover"
          // Kaynak dikey (608×1080), masaüstü yatay. Kırpma yalnızca CSS ile
          // yapılır — dosyaya dokunulmaz. Odak noktası merkezin biraz
          // üstünde: düzeneğin gövdesi orada.
          style={{ objectPosition: "center 42%" }}
          muted
          playsInline
          preload="auto"
        >
          <source src="/assets/brand/cezeri-scrub.mp4" type="video/mp4" />
          <source src="/assets/brand/cezeri-scrub.webm" type="video/webm" />
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
          className="absolute inset-0"
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
            Yükleniyor
          </span>
        </div>

        <div className="relative z-10 flex h-full items-center">
          <div ref={copy} className="mx-auto w-full max-w-7xl px-6 lg:px-10">
            <div className="max-w-3xl">
              <p className="scrub-mono text-[10px] uppercase tracking-[0.28em] text-[var(--color-brand-accent)] sm:text-[11px]">
                Yapay Zekâ ve Robotik Kodlama Teknoloji Üssü
              </p>

              <h1
                id="sinema-hero-baslik"
                className="scrub-display mt-7 text-balance text-white"
              >
                HAYAL ET, KODLA,
                <br />
                GELECEĞİ TASARLA.
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
            Geleceği keşfetmek için kaydırın
          </span>
          <span className="relative h-12 w-px overflow-hidden bg-white/20">
            <span className="absolute inset-x-0 top-0 h-1/2 animate-scan-line bg-[var(--color-brand-accent)]" />
          </span>
        </div>
      </div>
    </section>
  );
}
