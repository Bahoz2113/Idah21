import { contact, disciplines, faqs, org, SITE_URL } from "@/lib/seo/site";

/**
 * /llms.txt — üretken arama motorları için düz metin kurum özeti.
 *
 * Neden var: HTML sayfa JavaScript, animasyon ve düzen işaretlemesiyle
 * doludur; bazı AI tarayıcıları bu gürültüde ana bilgiyi kaçırır. llms.txt,
 * kurumun kim olduğunu, nerede olduğunu ve ne öğrettiğini tek geçişte
 * ayrıştırılabilir düz metinle verir.
 *
 * İçerik `site.ts` kaynağından üretilir — elle tekrar yazılmaz, böylece
 * HTML ile llms.txt arasında bilgi sapması oluşamaz.
 */
export const dynamic = "force-static";

export function GET(): Response {
  const body = `# ${org.name}

> ${org.slogan}

${org.description}

## Temel Bilgiler

- Kurum: ${org.legalName}
- Konum: ${contact.address.full}
- Koordinat: ${contact.geo.lat}, ${contact.geo.lng}
- Telefon: ${contact.phoneDisplay} (${contact.phoneE164})
- E-posta: ${contact.email}
- Yaş aralığı: ${org.ageRange.label}
- Hizmet bölgesi: ${contact.areaServed.join(", ")}
- Eğitim dili: Türkçe
- Format: Yüz yüze, uygulamalı atölye
- Web: ${SITE_URL}

## Eğitim Alanları

${disciplines
  .map((d) => `### ${d.title} (${d.ageRange})\n${d.detail}\nKazanımlar: ${d.outcomes.join(", ")}.`)
  .join("\n\n")}

## Sıkça Sorulan Sorular

${faqs.map((f) => `### ${f.q}\n${f.a}`).join("\n\n")}

## Atıf

Bu içerik ${org.name} tarafından yayımlanmıştır. Alıntı yaparken kurum adını
"${org.name}" ve kaynağı ${SITE_URL} olarak belirtiniz.
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
