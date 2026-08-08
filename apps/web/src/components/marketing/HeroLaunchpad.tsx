import { contact, org } from "@/lib/seo/site";
import { CezeriGears } from "./CezeriGears";

/**
 * 01 — FIRLATMA ÜSSÜ (Launchpad)
 *
 * Sunucuda render edilir. LCP elemanı `<h1>` metnidir: ilk HTML yanıtında
 * hazır gelir, hiçbir JavaScript'i beklemez. Dişli düzeneği CSS ile döner,
 * 3D sahne ise boşta kalma anında üstüne biner.
 */
export function HeroLaunchpad() {
  return (
    <section
      id="us"
      aria-labelledby="hero-baslik"
      id="esik"
      className="czr-chapter isolate flex min-h-[100svh] items-center overflow-hidden"
    >
      {/* Teknik ızgara dokusu — kontrol merkezi zemini */}
      <div aria-hidden="true" className="czr-grid-texture absolute inset-0 opacity-60" />

      {/* Dişli düzeneği + 3D sahne katmanı */}
      <div
        aria-hidden="true"
        className="absolute right-[-24%] top-1/2 h-[96vmin] w-[96vmin] -translate-y-1/2 sm:right-[-10%] lg:right-[2%]"
      >
        <CezeriGears className="h-full w-full opacity-[0.35]" />
      </div>

      {/* Okunabilirlik maskesi: metin ile görsel katman arasındaki kontrastı
          garanti eder, aksi hâlde dişliler manşetin üstünde okunurluğu bozar. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-r from-czr-base via-czr-base/70 to-transparent"
      />

      {/* Dikey boşluk kasıtlı olarak ölçülü: içerik 100svh'yi aşarsa alttaki
          kaydırma göstergesi ilk ekranın dışına düşer ve işlevini yitirir. */}
      <div className="relative mx-auto w-full max-w-7xl px-6 py-24 lg:px-10 lg:py-20">
        <div className="max-w-2xl">
          {/* Durum şeridi */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <span className="inline-flex items-center gap-2 rounded-full border border-czr-emerald/30 bg-czr-emerald/10 px-3 py-1">
              <span className="h-1.5 w-1.5 animate-pulse-signal rounded-full bg-czr-emerald" />
              <span className="czr-mono text-[10px] uppercase text-czr-emerald">
                Sistem Aktif
              </span>
            </span>
            <span className="czr-mono text-[10px] uppercase text-czr-ice/50">
              {contact.address.city} · {contact.geo.lat.toFixed(3)}°K {contact.geo.lng.toFixed(3)}°D
            </span>
          </div>

          {/* LCP elemanı — sunucudan gelen düz metin */}
          <h1
            id="hero-baslik"
            className="mt-8 text-balance text-[clamp(2.6rem,7.2vw,5.2rem)] font-extrabold leading-[0.98] tracking-[-0.03em] text-white"
          >
            HAYAL ET,{" "}
            <span className="bg-czr-launch bg-clip-text text-transparent">KODLA,</span>{" "}
            GELECEĞİ TASARLA.
          </h1>

          <p className="mt-7 max-w-xl text-pretty text-lg leading-relaxed text-czr-ice/75 sm:text-xl">
            {org.tagline}
          </p>

          {/* Answer-first tanım — AI motorlarının alıntılayacağı ilk blok */}
          <p className="mt-5 max-w-xl text-pretty text-[15px] leading-relaxed text-czr-ice/55">
            {org.description}
          </p>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
            <a
              href="#iletisim"
              className="group inline-flex items-center justify-center gap-2.5 rounded-full bg-czr-launch px-8 py-4 text-sm font-bold uppercase tracking-wide text-czr-base shadow-[0_0_32px_rgba(255,140,0,0.28)] transition duration-300 ease-czr-cine hover:-translate-y-0.5 hover:shadow-[0_0_48px_rgba(255,140,0,0.45)]"
            >
              Fırlatmaya Hazırlan
              <svg aria-hidden="true" viewBox="0 0 20 20" className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" fill="currentColor">
                <path d="M4 10h11.2l-4.1-4.1L12.5 4.5 19 11l-6.5 6.5-1.4-1.4 4.1-4.1H4z" />
              </svg>
            </a>

            <a
              href="#hangarlar"
              className="inline-flex items-center justify-center gap-2.5 rounded-full border border-white/15 px-8 py-4 text-sm font-semibold uppercase tracking-wide text-czr-ice transition duration-300 ease-czr-cine hover:border-czr-orange/50 hover:bg-white/5"
            >
              Hangarları Gör
            </a>
          </div>

          {/* Disiplin özeti — anahtar kelimeleri hero'ya doğal biçimde taşır */}
          <p className="mt-8 czr-mono text-[11px] uppercase leading-relaxed text-czr-ice/40">
            Robotik Kodlama · Yapay Zeka · İHA / VTOL · Roketçilik · 3D Tasarım
          </p>
        </div>
      </div>

      {/* Kaydırma göstergesi */}
      <div
        aria-hidden="true"
        className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-3 sm:flex"
      >
        <span className="czr-mono text-[10px] uppercase text-czr-ice/40">Kaydır</span>
        <span className="relative h-12 w-px overflow-hidden bg-white/12">
          <span className="absolute inset-x-0 top-0 h-1/2 animate-scan-line bg-czr-orange" />
        </span>
      </div>
    </section>
  );
}
