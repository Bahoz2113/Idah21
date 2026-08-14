import { channels, contact, org, sameAs } from "@/lib/seo/site";

/**
 * ALT BİLGİ — küçük, rafine, işlevsel.
 *
 * Uydurma yok: telefon, e-posta, adres ve sosyal hesap yalnızca
 * `lib/seo/site.ts` içinde GERÇEKTEN tanımlı olanlardan gelir. Kurumun
 * hesabı olmayan bir platform için boş bir ikon konmaz.
 *
 * Yıl derleme anında değil, render anında hesaplanır; statik sayfa
 * yeniden derlenene kadar eskimesin diye tarih tek yerde durur.
 */
export function ScrubFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-white/10 bg-[var(--color-surface-dark)]">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-10 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <p className="scrub-display text-xl font-bold tracking-tight text-white">
              {org.name}
            </p>
            <p className="scrub-mono mt-3 text-[11px] uppercase tracking-[0.18em] text-[var(--color-brand-accent)]">
              Hayal Et, Kodla, Geleceği Tasarla.
            </p>
          </div>

          <div className="lg:col-span-4">
            <h2 className="scrub-mono text-[10px] uppercase tracking-[0.16em] text-white/40">
              İletişim
            </h2>
            <address className="mt-4 space-y-2 not-italic text-[15px] leading-relaxed text-white/70">
              <p>{contact.address.full}</p>
              <p>
                <a
                  href={`tel:${contact.phoneE164}`}
                  dir="ltr"
                  className="font-semibold text-white transition hover:text-[var(--color-brand-accent)]"
                >
                  {contact.phoneDisplay}
                </a>
              </p>
              <p>
                <a
                  href={`mailto:${contact.email}`}
                  className="transition hover:text-[var(--color-brand-accent)]"
                >
                  {contact.email}
                </a>
              </p>
            </address>
          </div>

          <div className="lg:col-span-3">
            <h2 className="scrub-mono text-[10px] uppercase tracking-[0.16em] text-white/40">
              Bizi Takip Edin
            </h2>
            <ul className="mt-4 space-y-2">
              {sameAs.map((url) => (
                <li key={url}>
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[15px] text-white/70 transition hover:text-[var(--color-brand-accent)]"
                  >
                    {channels.instagram.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-white/10 pt-7 text-[13px] text-white/40 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {org.name}. Tüm hakları saklıdır.
          </p>
          <p className="scrub-mono text-[10px] uppercase tracking-[0.14em]">
            {contact.address.city} · Türkiye
          </p>
        </div>
      </div>
    </footer>
  );
}
