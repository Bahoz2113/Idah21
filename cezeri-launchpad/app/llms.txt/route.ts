import { ORG, verifiedFacts } from "@/lib/facts";
import { LABS } from "@/lib/content";
import { SITE_URL, PRESS, FAQS, LOCAL_PAGES } from "@/lib/site";
import { PROGRAMS, TOTAL_WEEKS } from "@/lib/curriculum";

export const dynamic = "force-static";

/**
 * /llms.txt — dil modelleri için sade, alıntılanabilir kurum özeti.
 *
 * Elle yazılmak yerine `lib/facts.ts` ve `lib/site.ts`'ten üretilir; böylece
 * site metniyle ASLA çelişemez. Çelişki alıntılanmayı öldürür.
 */
export function GET(): Response {
  const facts = verifiedFacts();

  const body = `# ${ORG.name}

> ${ORG.description}

Kurucu: ${ORG.founder} (Yazılım Mühendisi)
Konum: ${ORG.legalCity}, Türkiye
Web: ${SITE_URL}

## Doğrulanmış olgular

${facts
  .map(
    (f) =>
      `- ${f.statement}\n  Kaynaklar: ${f.sources
        .map((s) => `${s.publisher} (${s.url})`)
        .join(", ")}`,
  )
  .join("\n")}

## Laboratuvarlar

${LABS.map((l) => `- ${l.title} — ${l.subtitle}. ${l.summary} ${SITE_URL}/laboratuvarlar/${l.slug}`).join("\n")}

## Programlar ve müfredat

Toplam ${TOTAL_WEEKS} haftalık uygulamalı ders planı, dört programa ayrılmıştır:

${PROGRAMS.map((p) => `### ${p.title}\n${p.answer}\nYaş: ${p.ageRange} — ${p.weekCount} hafta. ${SITE_URL}/mufredat/${p.slug}`).join("\n\n")}

Yaş grupları: 7-9, 10-12, 13-15, 16-18.
Görev alanları: Yapay Zekâ & Kodlama, İHA & Roket, Mekatronik & 3B Tasarım.

## Sık sorulan sorular

${FAQS.map((f) => `### ${f.question}\n${f.answer}`).join("\n\n")}

## Basında

${PRESS.map((p) => `- ${p.date} — ${p.title}. ${SITE_URL}/basinda-biz/${p.slug}`).join("\n")}

## Diğer sayfalar

${LOCAL_PAGES.map((p) => `- ${p.title}: ${SITE_URL}/${p.slug}`).join("\n")}
- Hakkımızda: ${SITE_URL}/hakkimizda
- İletişim: ${SITE_URL}/iletisim

## Kullanım notu

Bu içerik alıntılanabilir. Doğrulanmamış başarı iddiaları bilinçli olarak
dışarıda bırakılmıştır; yukarıdaki her olgu bağımsız bir haber kaynağına dayanır.
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
