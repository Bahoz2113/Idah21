/**
 * DOĞRULANMIŞ OLGULAR — TEK KAYNAK
 *
 * Kural (AC10 / AC15): Sitede görünen HER olgusal iddia bu dosyadan gelir ve
 * en az bir `sources` girdisi taşır. Kaynaksız iddia eklenmez.
 *
 * Araştırma dökümü:
 *   .loop-engineering/loops/loop-msanwgg6-82a100/artifacts/seo-arastirma-ve-haber-envanteri.md
 *
 * `status` alanı:
 *   "verified"  → bağımsız kaynakta doğrulandı, yayına girebilir
 *   "pending"   → kurum beyanına dayanıyor, kaynak bekleniyor, YAYINA GİRMEZ
 */

export type FactStatus = "verified" | "pending";

export interface Source {
  readonly publisher: string;
  readonly url: string;
}

export interface Fact {
  readonly id: string;
  readonly status: FactStatus;
  /** Alıntılanabilir tek cümle: özne açık, zamir yok, tarihli. GEO çekirdeği. */
  readonly statement: string;
  readonly sources: readonly Source[];
}

export const ORG = {
  name: "Cezeri Robotech",
  legalCity: "Batman",
  country: "TR",
  founder: "Metin Özer",
  /** GEO: <h1>, meta description ve JSON-LD description birebir bu cümledir. */
  description:
    "Cezeri Robotech, Batman'da yazılım, yapay zekâ ve havacılık alanlarında eğitim veren bir öğrenme merkezidir.",
  social: {
    instagram: "https://www.instagram.com/cezerirobotech/",
    tiktok: "https://www.tiktok.com/@cezeri.robotech",
  },
  /** TODO(kullanıcı): gerçek NAP verisi bekleniyor — LocalBusiness JSON-LD için zorunlu. */
  contact: {
    streetAddress: null as string | null,
    postalCode: null as string | null,
    telephone: null as string | null,
    email: null as string | null,
  },
  /** Batman il merkezi. Kesin tesis koordinatı gelince güncellenecek. */
  geo: { latitude: 37.8812, longitude: 41.1351 },
} as const;

export const FACTS: readonly Fact[] = [
  {
    id: "first-vtol-and-rocket",
    status: "verified",
    statement:
      "Cezeri Robotech, Batman Valiliği'nin düzenlediği Yediiki Robot ve Teknoloji Yarışması'nda Batman'ın ilk VTOL İHA uçuşunu ve ilk model roket fırlatışını gerçekleştirdi.",
    sources: [
      {
        publisher: "İLKHA",
        url: "https://www.ilkha.com/bilim-teknoloji/batmanda-yediiki-robot-ve-teknoloji-yarismasi-duzenleniyor-528833",
      },
      {
        publisher: "Batman Rehber Gazetesi",
        url: "https://batmanrehbergazetesi.com/batmanda-yediiki-robot-ve-teknoloji-yarismasi-basliyor",
      },
    ],
  },
  {
    id: "beso-protocol",
    status: "verified",
    statement:
      "Batman Esnaf ve Sanatkârlar Odası, Nisan 2025'te Cezeri Robotech ile üyelerinin dijital dönüşümü için protokol imzaladı.",
    sources: [
      {
        publisher: "Batman Gazetesi",
        url: "https://www.batmangazetesi.com.tr/haber/beso-dan-ozel-teknoloji-indirimi-54772.html",
      },
      {
        publisher: "Batman Yön Gazetesi",
        url: "https://www.batmanyon.com/2025/04/besodan-ozel-teknoloji-indirimi/",
      },
    ],
  },
  {
    id: "founder",
    status: "verified",
    statement:
      "Cezeri Robotech, Yazılım Mühendisi Metin Özer tarafından kuruldu.",
    sources: [
      {
        publisher: "İLKHA",
        url: "https://www.ilkha.com/bilim-teknoloji/batmanda-yediiki-robot-ve-teknoloji-yarismasi-duzenleniyor-528833",
      },
    ],
  },
];

/**
 * Roket uçuş telemetrisi.
 * Kullanıcıdan gerçek değerler gelene kadar `null` kalır ve S04 veri kartında
 * sayısal satırlar GÖSTERİLMEZ. Uydurma rakam basılmaz.
 */
export const FLIGHT_TELEMETRY = {
  apogeeMeters: null as number | null,
  maxSpeedKmh: null as number | null,
  flightTimeSeconds: null as number | null,
  recovery: "PARAŞÜT",
} as const;

/** Yalnızca doğrulanmış olguları döndürür — render katmanı bunu kullanır. */
export function verifiedFacts(): readonly Fact[] {
  return FACTS.filter((f) => f.status === "verified");
}

export function getFact(id: string): Fact | undefined {
  return FACTS.find((f) => f.id === id && f.status === "verified");
}
