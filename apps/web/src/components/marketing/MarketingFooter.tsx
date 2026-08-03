import Image from "next/image";
import { channels, contact, disciplines, org, sections } from "@/lib/seo/site";

/**
 * 08 — ALT BİLGİ
 *
 * NAP (Name / Address / Phone) tutarlılığı yerel SEO'nun temel sinyalidir:
 * kurum adı, adres ve telefon sitede — ve dış dizinlerde — birebir aynı
 * yazımla görünmelidir. Bu blok, tek kaynak `site.ts`'ten beslendiği için
 * sayfanın geri kalanıyla ve JSON-LD ile kelimesi kelimesine örtüşür.
 */
export function MarketingFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-white/8 bg-czr-base-alt">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-16 lg:grid-cols-4 lg:px-10">
        {/* Kurum bloğu — NAP */}
        <div className="lg:col-span-2">
          <div className="flex items-center gap-3">
            <Image
              src="/logo.png"
              alt={`${org.name} robotik baykuş amblemi`}
              width={48}
              height={48}
              loading="lazy"
              className="h-11 w-11 shrink-0 object-contain"
            />
            <p className="text-lg font-extrabold tracking-tight text-white">{org.name}</p>
          </div>
          <p className="mt-3 czr-mono text-[11px] uppercase text-czr-orange">{org.slogan}</p>

          <address className="mt-6 not-italic text-[14px] leading-relaxed text-czr-ice/60">
            {contact.address.full}
          </address>

          <div className="mt-4 flex flex-col gap-1.5 text-[14px]">
            <a
              href={`tel:${contact.phoneE164}`}
              className="text-czr-ice/75 transition hover:text-czr-orange"
            >
              {contact.phoneDisplay}
            </a>
            <a
              href={`mailto:${contact.email}`}
              className="text-czr-ice/75 transition hover:text-czr-orange"
            >
              {contact.email}
            </a>
          </div>

          {/* Sosyal ve konum kanalları */}
          <ul className="mt-6 flex flex-wrap items-center gap-3">
            {[
              { ...channels.whatsapp, accent: "#25D366" },
              { ...channels.instagram, accent: "#E1306C" },
              { ...channels.maps, accent: "#EA4335" },
            ].map((c) => (
              <li key={c.label}>
                <a
                  href={c.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-white/12 px-4 py-2 text-[13px] font-semibold text-czr-ice/70 transition duration-300 hover:border-[var(--czr-accent)] hover:text-white"
                  style={{ ["--czr-accent" as string]: c.accent }}
                >
                  <span
                    aria-hidden="true"
                    className="h-2 w-2 rounded-full"
                    style={{ background: c.accent }}
                  />
                  {c.label}
                </a>
              </li>
            ))}
          </ul>

          <p className="mt-6 max-w-md text-[13px] leading-relaxed text-czr-ice/40">
            {org.legalName} · {org.ageRange.label} · Hizmet bölgesi:{" "}
            {contact.areaServed.join(", ")}
          </p>
        </div>

        {/* Bölümler */}
        <nav aria-label="Alt bilgi bölümleri">
          <p className="czr-mono text-[11px] uppercase text-czr-ice/45">Bölümler</p>
          <ul className="mt-5 space-y-2.5">
            {sections.map((s) => (
              <li key={s.id}>
                <a
                  href={`#${s.id}`}
                  className="text-[14px] text-czr-ice/65 transition hover:text-czr-orange"
                >
                  {s.label}
                </a>
              </li>
            ))}
            <li>
              <a href="/login" className="text-[14px] text-czr-ice/45 transition hover:text-czr-orange">
                Panel Girişi
              </a>
            </li>
          </ul>
        </nav>

        {/* Eğitim alanları — dahili bağlam ve anahtar kelime kapsamı */}
        <div>
          <p className="czr-mono text-[11px] uppercase text-czr-ice/45">Eğitim Alanları</p>
          <ul className="mt-5 space-y-2.5">
            {disciplines.map((d) => (
              <li key={d.id}>
                <a
                  href="#hangarlar"
                  className="text-[14px] text-czr-ice/65 transition hover:text-czr-orange"
                >
                  {d.title}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-white/8">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-6 py-6 text-[12px] text-czr-ice/35 sm:flex-row sm:items-center sm:justify-between lg:px-10">
          <p>
            © {year} {org.name}. Tüm hakları saklıdır.
          </p>
          <p className="czr-mono uppercase">
            {contact.address.city} · {contact.geo.lat.toFixed(5)}°K {contact.geo.lng.toFixed(5)}°D
          </p>
        </div>
      </div>
    </footer>
  );
}
