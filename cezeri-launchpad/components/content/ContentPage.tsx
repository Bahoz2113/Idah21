import Link from "next/link";
import type { ReactNode } from "react";
import { ORG } from "@/lib/facts";

/**
 * İÇERİK KATMANI KABUĞU
 *
 * Hafif, hızlı, WebGL'siz. Bu ağaçtaki hiçbir bileşen three.js veya GSAP
 * import etmez (GEO kuralı K4) — hedef LCP < 1.2 s (AC9).
 */
export function ContentPage({
  eyebrow,
  title,
  lead,
  children,
}: {
  eyebrow: string;
  title: string;
  lead?: string;
  children: ReactNode;
}) {
  return (
    <div className="min-h-svh bg-void">
      <header className="border-b border-[var(--hairline)]">
        <nav
          aria-label="Ana navigasyon"
          className="flex items-center justify-between px-6 py-5 md:px-16"
        >
          <Link href="/" className="t-mono text-cyber hover:text-ignition">
            ← {ORG.name}
          </Link>
          <Link
            href="/#s07"
            className="t-mono border border-ignition px-4 py-2 text-ignition transition-colors hover:bg-ignition hover:text-void"
          >
            Başvuru
          </Link>
        </nav>
      </header>

      <main id="icerik" className="px-6 py-16 md:px-16 md:py-24">
        <div className="mx-auto max-w-3xl">
          <p className="t-mono mb-5 text-ignition">{eyebrow}</p>
          <h1 className="t-display-l mb-8 text-cyber">{title}</h1>
          {lead && (
            <p className="mb-12 font-body text-lg leading-relaxed text-ash md:text-xl">
              {lead}
            </p>
          )}
          {children}
        </div>
      </main>

      <footer className="border-t border-[var(--hairline)] px-6 py-10 md:px-16">
        <div className="mx-auto flex max-w-3xl flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <p className="t-mono text-ash">
            © {new Date().getFullYear()} {ORG.name} · {ORG.legalCity}
          </p>
          <Link href="/" className="t-mono text-ash hover:text-ignition">
            Ana sayfa →
          </Link>
        </div>
      </footer>
    </div>
  );
}

/** Kendi kendine yeten alıntılanabilir blok (GEO chunk kuralı). */
export function CitableBlock({
  question,
  children,
}: {
  question: string;
  children: ReactNode;
}) {
  return (
    <section className="mb-10 border-l-2 border-ignition pl-6">
      <h2 className="mb-3 font-display text-2xl font-bold uppercase leading-tight text-cyber">
        {question}
      </h2>
      <div className="space-y-4 font-body leading-relaxed text-ash">
        {children}
      </div>
    </section>
  );
}
