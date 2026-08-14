import { notFound } from "next/navigation";
import { defaultLocale, isLocale, type Locale, locales } from "./config";

/**
 * ROTA PARAMETRESİ ↔ DİL.
 *
 * `[[...locale]]` isteğe bağlı yakalayıcı olduğu için parametre üç biçimde
 * gelebilir: hiç yok (`/`), tek parçalı (`/en`) ya da çok parçalı
 * (`/en/bir-sey`). İlki Türkçedir; ikincisi geçerliyse o dildir; geri
 * kalan her şey 404'tür.
 *
 * SESSİZ GERİ DÜŞÜŞ YOK. Tanınmayan bir önek Türkçe sayfaya düşseydi
 * `/foobar`, `/tr-TR`, `/EN` gibi sonsuz sayıda adres aynı içeriği
 * yayınlar ve arama motoru bunları yinelenen içerik sayardı. 404 tek
 * doğru cevap.
 */
export function resolveLocale(segments: string[] | undefined): Locale {
  if (!segments || segments.length === 0) return defaultLocale;
  if (segments.length > 1) notFound();

  const first = segments[0];
  // Türkçe kanonik dil ve öneksiz yayınlanıyor; `/tr` ikinci bir adres
  // olurdu ve aynı sayfayı iki yerden yayınlamak yinelenen içeriktir.
  if (!isLocale(first) || first === defaultLocale) notFound();

  return first;
}

/**
 * Derlenecek adresler. Türkçe için parametre YOK (`/`), diğerleri için
 * tek parçalı önek. `dynamicParams = false` ile birlikte bu liste dışında
 * kalan her şey 404 verir — sayfa üretim anında sabitlenir.
 */
export function localeStaticParams(): Array<{ locale?: string[] }> {
  return [
    { locale: undefined },
    ...locales.filter((l) => l !== defaultLocale).map((l) => ({ locale: [l] })),
  ];
}
