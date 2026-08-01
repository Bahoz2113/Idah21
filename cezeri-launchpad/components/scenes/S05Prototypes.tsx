import Link from "next/link";
import { PROTOTYPES } from "@/lib/content";
import { MediaSlot } from "@/components/ui/MediaSlot";
import { HorizontalTrack } from "./HorizontalTrack";
import { ScrollScene } from "./ScrollScene";

/**
 * S05 — KADET PROJELERİ
 *
 * Yatay scroll galeri. Kartların tamamı sunucudan gelir; `HorizontalTrack`
 * yalnızca yatay kaydırmayı sürer. Mobilde animasyon yerine doğal
 * swipe (`overflow-x`) devreye girer.
 */
export function S05Prototypes() {
  return (
    <ScrollScene id="s05" index={4} length={3}>
      <div className="relative flex h-full flex-col justify-center">
        <div className="mb-10 px-6 md:px-16">
          <p className="t-mono mb-4 text-ignition">05 / Prototipler</p>
          <h2 className="t-display-l text-cyber">Kadet projeleri</h2>
          <p className="mt-5 max-w-xl font-body leading-relaxed text-ash">
            Öğrencilerin tasarlayıp ürettiği prototipler. Görsellerde KVKK gereği
            öğrenci kimliği paylaşılmaz.
          </p>
        </div>

        <HorizontalTrack>
          {/* Kilometre taşı kartı — diziyi böler */}
          <article className="relative flex h-[58svh] w-[78vw] shrink-0 flex-col justify-between bg-ignition p-8 md:w-[30rem]">
            <p className="t-mono text-void/70">Kilometre Taşı</p>
            <div>
              <p className="font-display text-4xl font-extrabold uppercase leading-[0.95] tracking-tight text-void md:text-5xl">
                Batman&apos;ın ilki
              </p>
              <p className="mt-4 font-body text-void/80">
                VTOL İHA uçuşu + model roket fırlatışı — Yediiki Robot ve
                Teknoloji Yarışması.
              </p>
              <Link
                href="/basinda-biz/batmanin-ilk-vtol-iha-ucusu"
                className="t-mono mt-6 inline-block border border-void px-4 py-2 text-void transition-colors hover:bg-void hover:text-ignition"
              >
                Haberi oku →
              </Link>
            </div>
          </article>

          {PROTOTYPES.map((p, i) => (
            <article
              key={p.id}
              className="relative flex h-[58svh] w-[70vw] shrink-0 flex-col border border-[var(--hairline)] md:w-[24rem]"
            >
              <MediaSlot
                slot={p.mediaSlot}
                label={`${p.name} — ${p.category}. Cezeri Robotech öğrenci prototipi.`}
                className="h-full w-full flex-1"
              />
              <div className="border-t border-[var(--hairline)] bg-void p-5">
                <p className="t-mono mb-2 text-ash">
                  Proje {String(i + 1).padStart(2, "0")} / {String(PROTOTYPES.length).padStart(2, "0")} — {p.category}
                </p>
                <h3 className="font-display text-xl font-bold uppercase text-cyber">
                  {p.name}
                </h3>
                <p className="mt-2 font-body text-sm text-ash">{p.note}</p>
              </div>
            </article>
          ))}
        </HorizontalTrack>
      </div>
    </ScrollScene>
  );
}
