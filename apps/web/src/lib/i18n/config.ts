/**
 * DİL YAPILANDIRMASI — tanıtım sitesinin tek gerçek kaynağı.
 *
 * Site dört dilde gezilir. Türkçe kanonik dildir ve kök adreste (`/`)
 * durur; diğerleri yol öneki alır (`/en`, `/ku`, `/ar`). Alt alan adı ya da
 * sorgu parametresi DEĞİL: yol öneki hem arama motorlarının ayrı sayfa
 * olarak indekslediği hem de tek sertifika/tek dağıtımla çalışan biçim.
 *
 * KÜRTÇE. Kurmancî, Latin alfabesiyle — Batman ve çevresinde konuşulan ve
 * yazılan biçim bu. Soranî ayrı bir dil kodu (`ckb`) ve Arap alfabesi
 * ister; istenirse buraya beşinci kayıt olarak eklenir, altyapı hazır.
 *
 * ARAPÇA. Yalnızca metin çevirisi değil, düzenin tamamı aynalanır
 * (`dir: "rtl"`). Kenar boşlukları, ok yönleri ve hero'nun metin kolonu
 * mantıksal özelliklerle yazıldığı için yön değişimini kendiliğinden
 * izler; bkz. `marketing.css`.
 */

export const locales = ["tr", "en", "ku", "ar"] as const;

export type Locale = (typeof locales)[number];

/** Kanonik dil. Kök adreste (`/`) bu yayınlanır, önek almaz. */
export const defaultLocale: Locale = "tr";

type LocaleMeta = {
  /** `<html lang>` ve `hreflang` için BCP 47 etiketi. */
  tag: string;
  /** Yazı yönü. */
  dir: "ltr" | "rtl";
  /** Dilin kendi adı — dil seçici bunu gösterir, çevirisini değil. */
  native: string;
  /** Seçicide dar ekranda görünen kısa kod. */
  short: string;
  /** Open Graph `og:locale` biçimi. */
  ogLocale: string;
};

export const localeMeta: Record<Locale, LocaleMeta> = {
  tr: { tag: "tr-TR", dir: "ltr", native: "Türkçe", short: "TR", ogLocale: "tr_TR" },
  en: { tag: "en", dir: "ltr", native: "English", short: "EN", ogLocale: "en_US" },
  ku: { tag: "ku", dir: "ltr", native: "Kurdî", short: "KU", ogLocale: "ku_TR" },
  ar: { tag: "ar", dir: "rtl", native: "العربية", short: "AR", ogLocale: "ar_AR" },
};

/** Bir dilin kök göreli yolu. Türkçe önek almaz. */
export function localePath(locale: Locale, hash?: string): string {
  const base = locale === defaultLocale ? "/" : `/${locale}`;
  return hash ? `${base}#${hash}` : base;
}

/** Gelen değer geçerli bir dil mi — rota parametresi doğrulaması için. */
export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}
