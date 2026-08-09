// ══════════════════════════════════════════════════════════════════
// JSON-LD @graph üreticisi — GEO (Generative Engine Optimization) katmanı
//
// Neden tek @graph: Google ve üretken arama motorları, birbirine @id ile
// bağlanmış tek bir grafiği, sayfaya serpiştirilmiş kopuk schema bloklarından
// daha güvenilir bir varlık tanımı olarak değerlendirir. Kurum → şube →
// kurslar → SSS zinciri buradan kurulur.
//
// Tüm veri `site.ts` tek kaynağından gelir; burada hiçbir metin elle
// tekrarlanmaz. Böylece DOM ile structured data arasında sapma oluşmaz.
// ══════════════════════════════════════════════════════════════════

import { realMedia } from "../media/real-media";
import { SITE_URL, contact, disciplines, faqs, org, press, sameAs } from "./site";
import { serviceArea, trainingSeoById } from "./trainings";

const ID = {
  org: `${SITE_URL}/#organization`,
  place: `${SITE_URL}/#kampus`,
  website: `${SITE_URL}/#website`,
  webpage: `${SITE_URL}/#webpage`,
  faq: `${SITE_URL}/#sss`,
  breadcrumb: `${SITE_URL}/#breadcrumb`,
  course: (id: string) => `${SITE_URL}/#kurs-${id}`,
} as const;

const postalAddress = {
  "@type": "PostalAddress",
  streetAddress: contact.address.street,
  addressLocality: contact.address.city,
  addressRegion: contact.address.region,
  addressCountry: contact.address.country,
} as const;

const geoCoordinates = {
  "@type": "GeoCoordinates",
  latitude: contact.geo.lat,
  longitude: contact.geo.lng,
} as const;

const openingHoursSpecification = contact.openingHours.map((slot) => ({
  "@type": "OpeningHoursSpecification",
  dayOfWeek: slot.days,
  opens: slot.opens,
  closes: slot.closes,
}));

/** 6-16 yaş hedef kitlesi — Course ve Organization altında ortak kullanılır. */
const audience = {
  "@type": "EducationalAudience",
  educationalRole: "student",
  audienceType: "Çocuklar ve gençler",
  suggestedMinAge: org.ageRange.min,
  suggestedMaxAge: org.ageRange.max,
} as const;

function organizationNode() {
  return {
    "@type": ["EducationalOrganization", "LocalBusiness"],
    "@id": ID.org,
    name: org.name,
    legalName: org.legalName,
    alternateName: [...org.alternateNames],
    slogan: org.slogan,
    description: org.description,
    url: SITE_URL,
    logo: {
      "@type": "ImageObject",
      "@id": `${SITE_URL}/#logo`,
      url: `${SITE_URL}/logo.png`,
      caption: `${org.name} logosu`,
    },
    image: `${SITE_URL}/opengraph-image`,
    telephone: contact.phoneE164,
    email: contact.email,
    // Doğrulanabilir sosyal profiller — Knowledge Panel varlık eşleştirmesi
    sameAs: [...sameAs],
    address: postalAddress,
    geo: geoCoordinates,
    hasMap: contact.mapsPlaceUrl,
    openingHoursSpecification,
    // Hizmet coğrafyası tek kaynaktan (trainings.serviceArea) gelir ve
    // sayfada görünen cümleyle birebir aynıdır. İlçeler `containedInPlace`
    // ile bağlı iline asılır — yerel aramada ilçe adı da eşleşir.
    areaServed: serviceArea.map((a) => ({
      "@type": a.type,
      name: a.name,
      ...(a.alt?.length ? { alternateName: [...a.alt] } : {}),
      ...(a.parent ? { containedInPlace: { "@type": "City", name: a.parent } } : {}),
    })),
    foundingLocation: { "@type": "Place", name: org.foundingLocation },
    knowsLanguage: [...org.languages],
    audience,
    // Kurs kataloğu kuruma bağlanır — AI motorları "ne öğretiyor" sorusunu
    // bu kenardan yanıtlar.
    // BASIN KAYITLARI — üçüncü taraf doğrulaması.
    // `datePublished` bilerek YOK: kaynak sayfalar okunamadığı için yayın
    // tarihleri doğrulanamadı ve yanlış tarih yazmak yapılandırılmış veride
    // hiç yazmamaktan kötüdür. Yalnızca sosyal paylaşımlar değil, haber
    // kaynakları alınır — `sameAs` kurumun kendi hesaplarına ayrılmıştır.
    subjectOf: press
      .filter((p) => p.kind === "haber")
      .map((p) => ({
        "@type": "NewsArticle",
        headline: p.title,
        url: p.url,
        ...(p.summary ? { description: p.summary } : {}),
        inLanguage: "tr-TR",
        publisher: { "@type": "NewsMediaOrganization", name: p.outlet },
        about: { "@id": ID.org },
      })),
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "CEZERİ ROBOTECH Eğitim Hangarları",
      itemListElement: disciplines.map((d, i) => ({
        "@type": "ListItem",
        position: i + 1,
        item: { "@id": ID.course(d.id) },
      })),
    },
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      telephone: contact.phoneE164,
      email: contact.email,
      areaServed: "TR",
      availableLanguage: ["Turkish"],
    },
  };
}

function courseNodes() {
  return disciplines.map((d) => {
    const seo = trainingSeoById.get(d.id);
    return {
    "@type": "Course",
    "@id": ID.course(d.id),
    name: d.title,
    // Yanıt motorlarının alıntıladığı "answer-first" tanım; sayfada da
    // birebir bu metin görünür.
    description: seo?.answer ?? d.detail,
    ...(seo?.keywords?.length ? { keywords: seo.keywords.join(", ") } : {}),
    ...(seo?.faq?.length
      ? {
          // Kategoriye özel soru-cevap. Sohbet tabanlı motorlar (ChatGPT,
          // Gemini, Perplexity, Copilot) bu biçimi doğrudan alıntılıyor.
          subjectOf: {
            "@type": "FAQPage",
            "@id": `${ID.course(d.id)}-sss`,
            inLanguage: "tr-TR",
            mainEntity: seo.faq.map((f) => ({
              "@type": "Question",
              name: f.q,
              acceptedAnswer: { "@type": "Answer", text: f.a },
            })),
          },
        }
      : {}),
    url: `${SITE_URL}/#egitim-${d.id}`,
    inLanguage: "tr-TR",
    provider: { "@id": ID.org },
    educationalLevel: d.ageRange,
    teaches: [...d.outcomes],
    audience: {
      ...audience,
      // Modül bazlı yaş aralığı ("11-16 yaş" → 11)
      suggestedMinAge: Number(d.ageRange.split("-")[0]) || org.ageRange.min,
      suggestedMaxAge: org.ageRange.max,
    },
    // hasCourseInstance olmadan Google Course zengin sonucu üretmez.
    hasCourseInstance: {
      "@type": "CourseInstance",
      courseMode: "onsite",
      courseWorkload: "PT3H",
      location: { "@id": ID.place },
      inLanguage: "tr-TR",
    },
    offers: {
      "@type": "Offer",
      category: "Eğitim",
      availability: "https://schema.org/InStock",
      areaServed: serviceArea.map((a) => ({ "@type": a.type, name: a.name })),
      url: `${SITE_URL}/#iletisim`,
    },
    };
  });
}

function placeNode() {
  return {
    "@type": "Place",
    "@id": ID.place,
    name: `${org.name} Batman Atölyesi`,
    address: postalAddress,
    geo: geoCoordinates,
    hasMap: contact.mapsPlaceUrl,
  };
}

function faqNode() {
  return {
    "@type": "FAQPage",
    "@id": ID.faq,
    inLanguage: "tr-TR",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

function websiteNodes() {
  return [
    {
      "@type": "WebSite",
      "@id": ID.website,
      url: SITE_URL,
      name: org.name,
      description: org.description,
      inLanguage: "tr-TR",
      publisher: { "@id": ID.org },
    },
    {
      "@type": "WebPage",
      "@id": ID.webpage,
      url: `${SITE_URL}/`,
      name: `${org.name} — ${org.slogan}`,
      description: org.description,
      inLanguage: "tr-TR",
      isPartOf: { "@id": ID.website },
      about: { "@id": ID.org },
      primaryImageOfPage: `${SITE_URL}/opengraph-image`,
      breadcrumb: { "@id": ID.breadcrumb },
    },
    {
      "@type": "BreadcrumbList",
      "@id": ID.breadcrumb,
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Ana Sayfa", item: SITE_URL },
        { "@type": "ListItem", position: 2, name: "Eğitim Hangarları", item: `${SITE_URL}/#hangarlar` },
        { "@type": "ListItem", position: 3, name: "Sıkça Sorulan Sorular", item: `${SITE_URL}/#sss` },
        { "@type": "ListItem", position: 4, name: "İletişim", item: `${SITE_URL}/#iletisim` },
      ],
    },
  ];
}

/**
 * Atölye ve saha medyası — ImageObject / VideoObject.
 *
 * Görsel ve video aramada görünürlüğü bunlar sağlar. `uploadDate` KASITLI
 * olarak yazılmadı: çekimlerin gerçek tarihleri elimizde yok ve uydurulmuş
 * bir tarih, structured data'yı doğrulanamaz hâle getirir. Alan eksik
 * olduğunda Google video zengin sonucu üretmeyebilir — ama yanlış veri
 * yayımlamaktan iyidir. Tarihler netleştiğinde buraya eklenmelidir.
 */
function mediaNodes() {
  return realMedia.map((m) => {
    const id = `${SITE_URL}/#medya-${m.id}`;
    const generated = m.source === "generated";
    const common = {
      "@id": id,
      name: m.caption,
      description: m.alt,
      // `contentLocation` "bu kare şu mekânda çekildi" demektir. Üretilmiş
      // konsept görselleri Batman atölyesine bağlamak yanlış beyan olur —
      // yalnızca belgesel kayıtlarda yer alır.
      ...(generated ? {} : { contentLocation: { "@id": ID.place } }),
      // Üretim aracı schema'da açıkça bildirilir; arama motorları da
      // insanlar da kaynağı ayırt edebilsin.
      ...(generated ? { creditText: "Yapay zeka ile üretilmiş konsept görsel" } : {}),
      copyrightHolder: { "@id": ID.org },
      creator: { "@id": ID.org },
      inLanguage: "tr-TR",
    };

    if (m.kind === "video") {
      return {
        "@type": "VideoObject",
        ...common,
        thumbnailUrl: `${SITE_URL}${m.poster}`,
        contentUrl: `${SITE_URL}${m.src}`,
        duration: `PT${m.durationSec}S`,
        width: m.width,
        height: m.height,
      };
    }

    return {
      "@type": "ImageObject",
      ...common,
      contentUrl: `${SITE_URL}${m.src}`,
      thumbnailUrl: `${SITE_URL}${m.src}`,
      caption: m.caption,
      width: m.width,
      height: m.height,
    };
  });
}

/** Sayfaya gömülecek eksiksiz JSON-LD grafiği. */
export function buildSchemaGraph() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      organizationNode(),
      placeNode(),
      ...courseNodes(),
      faqNode(),
      ...mediaNodes(),
      ...websiteNodes(),
    ],
  };
}

/**
 * JSON-LD'yi script etiketine güvenle gömer.
 * `<` kaçışı, içerikte kapanış etiketi belirirse HTML ayrıştırıcısının
 * script bloğunu erken kapatmasını engeller (XSS vektörü).
 */
export function schemaJson(): string {
  return JSON.stringify(buildSchemaGraph()).replace(/</g, "\\u003c");
}
