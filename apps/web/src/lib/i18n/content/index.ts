import type { Locale } from "../config";
import { ar } from "./ar";
import { en } from "./en";
import { ku } from "./ku";
import { type Content, tr as trSource } from "./tr";

/**
 * İÇERİK SEÇİCİ.
 *
 * Türkçe kaynak `as const` ile yazılmıştır; her alanı kendi harfi kadar
 * dar bir tipe sabitlenir. Sözlüğe koyarken `Content` olarak genişletiyoruz
 * ki dört dil aynı tipte dursun ve `content(locale)` çağıran bileşen hangi
 * dilde olduğunu bilmek zorunda kalmasın.
 */
const tr: Content = trSource;

const dictionaries: Record<Locale, Content> = { tr, en, ku, ar };

export function content(locale: Locale): Content {
  return dictionaries[locale];
}

export type { Content };
