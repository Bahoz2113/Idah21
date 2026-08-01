import Link from "next/link";
import { ORG } from "@/lib/facts";
import { Marquee } from "@/components/ui/Marquee";
import { ScrollScene } from "./ScrollScene";

const TELEMETRY = [
  `BATMAN ${ORG.geo.latitude}°N ${ORG.geo.longitude}°E`,
  "BATMAN'IN İLK VTOL İHA UÇUŞU",
  "BATMAN'IN İLK MODEL ROKET FIRLATIŞI",
  "YAZILIM · YAPAY ZEKÂ · HAVACILIK",
] as const;

const NAV = [
  { href: "/laboratuvarlar/yapay-zeka", label: "Yapay Zekâ Laboratuvarı" },
  { href: "/laboratuvarlar/iha-roket", label: "İHA & Roket Atölyesi" },
  { href: "/laboratuvarlar/mekatronik", label: "Mekatronik Atölyesi" },
  { href: "/batman-robotik-kodlama-kursu", label: "Batman Robotik Kodlama Kursu" },
  { href: "/basinda-biz", label: "Basında Biz" },
  { href: "/sss", label: "Sık Sorulan Sorular" },
  { href: "/hakkimizda", label: "Hakkımızda" },
  { href: "/iletisim", label: "İletişim" },
] as const;

/** S08 — KULE. Footer aynı zamanda içerik katmanına açılan iç link merkezidir. */
export function S08Tower() {
  return (
    <ScrollScene id="s08" index={7} className="bg-void">
      <Marquee items={TELEMETRY} />

      <footer className="px-6 pt-20 pb-10 md:px-16">
        <div className="grid gap-12 md:grid-cols-[1.2fr_1fr]">
          <div>
            <h2 className="t-display-l text-cyber">Uçuş kulesi</h2>
            <p className="mt-6 max-w-md font-body leading-relaxed text-ash">
              {ORG.description} Merkez {ORG.legalCity}&apos;da bulunmaktadır.
            </p>

            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2">
              <a
                href={ORG.social.instagram}
                rel="me noopener"
                className="t-mono text-ash transition-colors hover:text-ignition"
              >
                Instagram
              </a>
              <a
                href={ORG.social.tiktok}
                rel="me noopener"
                className="t-mono text-ash transition-colors hover:text-ignition"
              >
                TikTok
              </a>
            </div>
          </div>

          <nav aria-label="Site haritası">
            <p className="t-mono mb-5 text-ignition">Rotalar</p>
            <ul className="space-y-2.5">
              {NAV.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="font-body text-ash transition-colors hover:text-cyber"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <p className="t-display-xl mt-20 select-none text-cyber/10" aria-hidden="true">
          Cezeri
        </p>

        <div className="mt-8 flex flex-col gap-2 border-t border-[var(--hairline)] pt-6 md:flex-row md:items-center md:justify-between">
          <p className="t-mono text-ash">
            © {new Date().getFullYear()} {ORG.name} · {ORG.legalCity}
          </p>
          <p className="t-mono text-ash">
            KVKK gereği öğrenci görselleri paylaşılmaz
          </p>
        </div>
      </footer>
    </ScrollScene>
  );
}
