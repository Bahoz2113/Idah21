import { LABS } from "./content";
import { PROGRAMS } from "./curriculum";

export const SITE_URL = "https://cezerirobotech.com";

/** Basında Biz — doğrulanmış haber girdileri (lib/facts.ts ile hizalı). */
export interface PressItem {
  readonly slug: string;
  readonly title: string;
  readonly summary: string;
  /** ISO tarih. Kesin gün bilinmiyorsa ay başı kullanılır ve metinde ay olarak anılır. */
  readonly date: string;
  readonly factId: string;
}

export const PRESS: readonly PressItem[] = [
  {
    slug: "batmanin-ilk-vtol-iha-ucusu",
    title: "Batman'ın ilk VTOL İHA uçuşu ve ilk model roket fırlatışı",
    summary:
      "Cezeri Robotech, Batman Valiliği'nin düzenlediği Yediiki Robot ve Teknoloji Yarışması kapsamında Batman'da bir ilki gerçekleştirdi.",
    date: "2025-04-29",
    factId: "first-vtol-and-rocket",
  },
  {
    slug: "beso-dijital-donusum-protokolu",
    title: "Batman Esnaf ve Sanatkârlar Odası ile dijital dönüşüm protokolü",
    summary:
      "BESO, üyelerinin dijital dönüşümü ve çocuklara yönelik teknoloji eğitimi için Cezeri Robotech ile protokol imzaladı.",
    date: "2025-04-01",
    factId: "beso-protocol",
  },
];

/** SSS — FAQPage şeması ve /sss sayfası aynı kaynaktan beslenir (AEO yakıtı). */
export interface Faq {
  readonly question: string;
  readonly answer: string;
}

export const FAQS: readonly Faq[] = [
  {
    question: "Batman'da robotik kodlama kursu nerede?",
    answer:
      "Cezeri Robotech, Batman'da robotik kodlama, yazılım ve yapay zekâ eğitimi veren bir öğrenme merkezidir. Kurum, Yazılım Mühendisi Metin Özer tarafından kurulmuştur ve 7-18 yaş aralığındaki öğrencilere yönelik programlar yürütmektedir.",
  },
  {
    question: "Cezeri Robotech hangi yaş gruplarına eğitim veriyor?",
    answer:
      "Cezeri Robotech, 7-9, 10-12, 13-15 ve 16-18 yaş olmak üzere dört yaş grubunda program yürütür. Her yaş grubu için müfredat, öğrencinin soyutlama düzeyine göre ayrı tasarlanır.",
  },
  {
    question: "Cezeri Robotech'in Batman'daki ilkleri neler?",
    answer:
      "Cezeri Robotech, Batman Valiliği'nin düzenlediği Yediiki Robot ve Teknoloji Yarışması'nda Batman'ın ilk VTOL İHA uçuşunu ve ilk model roket fırlatışını gerçekleştirmiştir.",
  },
  {
    question: "Batman'da çocuklar için yapay zekâ eğitimi var mı?",
    answer:
      "Evet. Cezeri Robotech'in AI & Deep Learning Lab'inde çocuklara ve gençlere görüntü işleme, nesne tanıma ve otonom karar sistemleri üzerine uygulamalı yapay zekâ eğitimi verilmektedir.",
  },
  {
    question: "Cezeri Robotech'i kim kurdu?",
    answer:
      "Cezeri Robotech, Yazılım Mühendisi Metin Özer tarafından Batman'da kurulmuştur.",
  },
  {
    question: "Cezeri Robotech kurumsal iş birliği yapıyor mu?",
    answer:
      "Evet. Batman Esnaf ve Sanatkârlar Odası, Nisan 2025'te üyelerinin dijital dönüşümü ve çocuklara yönelik teknoloji eğitimi için Cezeri Robotech ile protokol imzalamıştır.",
  },
];

/** Yerel arama sorgusuna doğrudan karşılık gelen sayfalar. */
export interface LocalPage {
  readonly slug: string;
  readonly title: string;
  readonly description: string;
  readonly heading: string;
  readonly body: readonly string[];
}

export const LOCAL_PAGES: readonly LocalPage[] = [
  {
    slug: "batman-robotik-kodlama-kursu",
    title: "Batman Robotik Kodlama Kursu",
    description:
      "Cezeri Robotech, Batman'da 7-18 yaş arası öğrencilere robotik kodlama, yazılım ve yapay zekâ eğitimi verir.",
    heading: "Batman'da robotik kodlama kursu",
    body: [
      "Cezeri Robotech, Batman'da robotik kodlama eğitimi veren bir öğrenme merkezidir. Programlar 7-9, 10-12, 13-15 ve 16-18 yaş gruplarına ayrılır ve her grup kendi soyutlama düzeyine uygun bir müfredat izler.",
      "Eğitim ezber üzerine değil üretim üzerine kuruludur: öğrenci önce tasarlar, sonra prototipler, sonra sahada test eder. Kâğıtta biten bir proje yoktur.",
      "Cezeri Robotech, Batman Valiliği'nin düzenlediği Yediiki Robot ve Teknoloji Yarışması'nda Batman'ın ilk VTOL İHA uçuşunu ve ilk model roket fırlatışını gerçekleştirmiştir.",
    ],
  },
  {
    slug: "batman-cocuk-yazilim-kursu",
    title: "Batman Çocuk Yazılım Kursu",
    description:
      "Cezeri Robotech, Batman'da çocuklara yönelik yazılım ve yapay zekâ eğitimi veren bir öğrenme merkezidir.",
    heading: "Batman'da çocuklar için yazılım kursu",
    body: [
      "Cezeri Robotech, Batman'da çocuklara yazılım eğitimi veren bir öğrenme merkezidir. Öğrenciler Python ile başlar, görüntü işleme ve otonom sistemlere kadar ilerler.",
      "Batman Esnaf ve Sanatkârlar Odası, Nisan 2025'te çocukların yapay zekâ, yazılım ve dijitalleşme alanlarında eğitim alabilmesi için Cezeri Robotech ile protokol imzalamıştır.",
      "Dersler laboratuvar temellidir: her öğrenci kendi donanımını kurar, kodunu yazar ve sonucunu ölçer.",
    ],
  },
];

/** Sitemap ve llms.txt aynı rota listesinden beslenir — tek kaynak. */
export function allRoutes(): readonly string[] {
  return [
    "/",
    "/hakkimizda",
    "/iletisim",
    "/sss",
    "/basinda-biz",
    ...PRESS.map((p) => `/basinda-biz/${p.slug}`),
    ...LABS.map((l) => `/laboratuvarlar/${l.slug}`),
    ...LOCAL_PAGES.map((p) => `/${p.slug}`),
    "/mufredat",
    ...PROGRAMS.map((p) => `/mufredat/${p.slug}`),
  ];
}
