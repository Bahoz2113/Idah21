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

import { SITE_URL, contact, disciplines, faqs, org } from "./site";

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
    address: postalAddress,
    geo: geoCoordinates,
    hasMap: contact.mapsPlaceUrl,
    openingHoursSpecification,
    areaServed: contact.areaServed.map((name) => ({ "@type": "Place", name })),
    foundingLocation: { "@type": "Place", name: org.foundingLocation },
    knowsLanguage: [...org.languages],
    audience,
    // Kurs kataloğu kuruma bağlanır — AI motorları "ne öğretiyor" sorusunu
    // bu kenardan yanıtlar.
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
  return disciplines.map((d) => ({
    "@type": "Course",
    "@id": ID.course(d.id),
    name: d.title,
    description: d.detail,
    url: `${SITE_URL}/#hangarlar`,
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
      areaServed: { "@type": "Place", name: contact.address.city },
      url: `${SITE_URL}/#iletisim`,
    },
  }));
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

/** Sayfaya gömülecek eksiksiz JSON-LD grafiği. */
export function buildSchemaGraph() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      organizationNode(),
      placeNode(),
      ...courseNodes(),
      faqNode(),
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
