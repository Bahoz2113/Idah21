import { THEME_LABEL, type Program, type Week } from "@/lib/curriculum";
import { ThemeAnimation } from "./ThemeAnimation";

/**
 * Hafta listesi.
 *
 * Animasyon, bir temanın programda İLK GEÇTİĞİ haftada çıkar — her tema
 * değişiminde değil.
 *
 * Neden: temalar sık sık dönüşümlü ilerliyor (P2'de lehim haftaları bir
 * atlayarak geliyor), bu yüzden "tema değişti" kuralı 26 haftalık programda
 * 24 animasyon üretiyordu — neredeyse her hafta. "İlk geçiş" kuralı program
 * başına tema sayısı kadar animasyon veriyor: 8-12 arası.
 */
export function WeekList({ program }: { program: Program }) {
  const groups = program.terms?.length
    ? program.terms.map((t) => ({
        title: t.title,
        weeks: program.weeks.filter((w) => w.no >= t.from && w.no <= t.to),
      }))
    : [{ title: null as string | null, weeks: program.weeks }];

  // Program genelinde takip edilir; dönem sınırında sıfırlanmaz.
  const seen = new Set<string>();

  return (
    <div className="space-y-16">
      {groups.map((group, gi) => (
        <section key={group.title ?? gi}>
          {group.title && (
            <h2 className="t-mono mb-8 border-b border-[var(--hairline)] pb-3 text-ignition">
              {group.title}
            </h2>
          )}
          <ol className="space-y-0">
            {group.weeks.map((week) => {
              const first = !seen.has(week.theme);
              if (first) seen.add(week.theme);
              return <WeekRow key={week.no} week={week} showAnimation={first} />;
            })}
          </ol>
        </section>
      ))}
    </div>
  );
}

function WeekRow({ week, showAnimation }: { week: Week; showAnimation: boolean }) {
  return (
    <li className="border-b border-[var(--hairline)]">
      {showAnimation && (
        <figure className="my-8 border border-[var(--hairline)] bg-navy/10 p-5">
          <figcaption className="t-mono mb-4 text-ignition">
            {THEME_LABEL[week.theme]}
          </figcaption>
          <ThemeAnimation theme={week.theme} />
        </figure>
      )}

      <article className="flex gap-5 py-5">
        <span className="t-mono w-12 shrink-0 pt-0.5 text-ignition tabular-nums">
          {String(week.no).padStart(2, "0")}
        </span>
        <div>
          <h3 className="font-display text-lg font-bold uppercase leading-snug text-cyber">
            {week.title}
          </h3>
          <p className="mt-1.5 font-body leading-relaxed text-ash">{week.body}</p>
        </div>
      </article>
    </li>
  );
}
