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

import { localizedMedia } from "../i18n/media";
import { SITE_URL, contact, disciplines, org, press, sameAs } from "./site";
import { localizedCurriculum } from "../i18n/curriculum";
import { serviceArea, trainingSeoById } from "./trainings";
import { defaultLocale, type Locale, localeMeta, localePath } from "../i18n/config";
import { content } from "../i18n/content";
import { ui } from "../i18n/ui";
import { localizedDisciplines, localizedFaqs } from "../i18n/view";

/**
 * KİMLİKLER — hangisi dile göre değişir, hangisi değişmez.
 *
 * KURUM, KAMPÜS ve KURSLAR dört dilde de AYNI VARLIKTIR. Arapça sayfada
 * anlatılan kurum, Türkçe sayfadakinin çevirisi değil kendisidir; bu yüzden
 * `@id`'leri sabittir ve dört sayfa tek varlığa işaret eder. Ayrı `@id`
 * verseydik arama motoru aynı okulu dört ayrı kurum sanardı ve hiçbirinin
 * sinyali diğerini güçlendirmezdi.
 *
 * SAYFA, SİTE, SSS ve KIRINTI YOLU ise dile göre AYRILIR. Bunlar belgenin
 * kendisini tarif eder ve her dilin belgesi ayrı bir adrestir; tek `@id`
 * paylaşsalardı dört farklı içerik tek belge olarak bildirilmiş olurdu.
 */
const ID = {
  org: `${SITE_URL}/#organization`,
  place: `${SITE_URL}/#kampus`,
  course: (id: string) => `${SITE_URL}/#kurs-${id}`,
} as const;

function pageIds(locale: Locale) {
  const base = `${SITE_URL}${localePath(locale)}`;
  return {
    url: base,
    website: `${SITE_URL}/#website-${locale}`,
    webpage: `${base}#webpage`,
    faq: `${base}#sss`,
    breadcrumb: `${base}#breadcrumb`,
  };
}

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
function audienceNode(locale: Locale) {
  return {
    "@type": "EducationalAudience",
    educationalRole: "student",
    audienceType: ui(locale).schemaAudience,
    suggestedMinAge: org.ageRange.min,
    suggestedMaxAge: org.ageRange.max,
  };
}

function organizationNode(locale: Locale) {
  const c = content(locale).org;
  const t = ui(locale);
  return {
    "@type": ["EducationalOrganization", "LocalBusiness"],
    "@id": ID.org,
    name: org.name,
    legalName: c.legalName,
    alternateName: [...org.alternateNames],
    slogan: c.slogan,
    description: c.description,
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
    foundingLocation: { "@type": "Place", name: c.foundingLocation },
    knowsLanguage: [...org.languages],
    audience: audienceNode(locale),
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
      name: `${org.name} — ${t.sectionLabels.egitimler}`,
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

function courseNodes(locale: Locale) {
  const tag = localeMeta[locale].tag;
  // Arama ekleri yalnızca Türkçe sayfada GÖRÜNÜR (bkz. `TrainingCatalog`).
  // Yapılandırılmış veri görünen metinle birebir olmak zorundadır; diğer
  // dillerde bu alanları yazmak, sayfada olmayan içeriği bildirmek olurdu.
  const withSeoCopy = locale === defaultLocale;

  return localizedDisciplines(locale).map((d) => {
    const seo = withSeoCopy ? trainingSeoById.get(d.id) : undefined;
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
            inLanguage: tag,
            mainEntity: seo.faq.map((f) => ({
              "@type": "Question",
              name: f.q,
              acceptedAnswer: { "@type": "Answer", text: f.a },
            })),
          },
        }
      : {}),
    url: `${SITE_URL}${localePath(locale)}#egitim-${d.id}`,
    inLanguage: tag,
    provider: { "@id": ID.org },
    educationalLevel: d.ageRange,
    teaches: [...d.outcomes],
    audience: {
      ...audienceNode(locale),
      // Modül bazlı yaş aralığı ("11-16 yaş" → 11)
      suggestedMinAge: Number(d.ageRange.match(/\d+/)?.[0]) || org.ageRange.min,
      suggestedMaxAge: org.ageRange.max,
    },
    // MÜFREDAT — `syllabusSections`, Google'ın Course zengin sonucunda
    // okuduğu ve yanıt motorlarının "ne öğretiyor" sorusuna cevap ararken
    // taradığı alandır. Modül adları ve hafta sayıları sayfada birebir
    // görünür; görünmeyen hiçbir şey buraya yazılmaz.
    ...(() => {
      const programs = localizedCurriculum(locale).filter((c) => c.relatedDisciplines.includes(d.id));
      if (programs.length === 0) return {};
      return {
        syllabusSections: programs.flatMap((prog) =>
          prog.modules.map((m, i) => ({
            "@type": "Syllabus",
            name: `${prog.title} — ${m.title}`,
            description: m.summary,
            position: i + 1,
            timeRequired: `P${m.weeks.length}W`,
            // Müfredat kayıtları henüz yalnızca Türkçe; dilini olduğu gibi
            // bildiriyoruz. Sayfada Türkçe görünen bir modülü Arapça diye
            // bildirmek yanlış beyan olurdu.
            inLanguage: "tr-TR",
          })),
        ),
      };
    })(),

    // hasCourseInstance olmadan Google Course zengin sonucu üretmez.
    hasCourseInstance: {
      "@type": "CourseInstance",
      courseMode: "onsite",
      courseWorkload: "PT3H",
      location: { "@id": ID.place },
      inLanguage: tag,
    },
    offers: {
      "@type": "Offer",
      category: ui(locale).sectionLabels.egitimler,
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

function faqNode(locale: Locale) {
  return {
    "@type": "FAQPage",
    "@id": pageIds(locale).faq,
    inLanguage: localeMeta[locale].tag,
    mainEntity: localizedFaqs(locale).map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

function websiteNodes(locale: Locale) {
  const c = content(locale).org;
  const t = ui(locale);
  const tag = localeMeta[locale].tag;
  const id = pageIds(locale);

  return [
    {
      "@type": "WebSite",
      "@id": id.website,
      url: id.url,
      name: org.name,
      description: c.description,
      inLanguage: tag,
      publisher: { "@id": ID.org },
    },
    {
      "@type": "WebPage",
      "@id": id.webpage,
      url: id.url,
      name: `${org.name} — ${c.slogan}`,
      description: c.description,
      inLanguage: tag,
      isPartOf: { "@id": id.website },
      about: { "@id": ID.org },
      primaryImageOfPage: `${SITE_URL}/opengraph-image`,
      breadcrumb: { "@id": id.breadcrumb },
    },
    {
      "@type": "BreadcrumbList",
      "@id": id.breadcrumb,
      itemListElement: [
        { "@type": "ListItem", position: 1, name: t.schemaHome, item: id.url },
        { "@type": "ListItem", position: 2, name: t.sectionLabels.egitimler, item: `${id.url}#egitimler` },
        { "@type": "ListItem", position: 3, name: t.sectionLabels.sss, item: `${id.url}#sss` },
        { "@type": "ListItem", position: 4, name: t.sectionLabels.iletisim, item: `${id.url}#iletisim` },
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
function mediaNodes(locale: Locale) {
  // Medya adı/açıklaması sayfanın diliyle aynı olmalı: sayfada Kürtçe
  // görünen kartın şeması Türkçe kalsaydı ikisi ayrışırdı.
  return localizedMedia(locale).map((m) => {
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
export function buildSchemaGraph(locale: Locale) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      organizationNode(locale),
      placeNode(),
      ...courseNodes(locale),
      faqNode(locale),
      ...mediaNodes(locale),
      ...websiteNodes(locale),
    ],
  };
}

/**
 * JSON-LD'yi script etiketine güvenle gömer.
 * `<` kaçışı, içerikte kapanış etiketi belirirse HTML ayrıştırıcısının
 * script bloğunu erken kapatmasını engeller (XSS vektörü).
 */
export function schemaJson(locale: Locale): string {
  return JSON.stringify(buildSchemaGraph(locale)).replace(/</g, "\\u003c");
}
