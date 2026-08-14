import "../../globals.css";
import "./fonts.css";
import "./marketing.css";
import type { ReactNode } from "react";
import { localeMeta } from "@/lib/i18n/config";
import { resolveLocaleLenient } from "@/lib/i18n/route";

/**
 * TANITIM SİTESİ KÖK DÜZENİ.
 *
 * NEDEN BU KADAR DERİNDE. Kök düzen `<html>` etiketini basan düzendir ve
 * bir rota için karşılaşılan İLK düzendir. Dil etiketi (`lang`) ve yazı
 * yönü (`dir`) o etikette durmak zorunda; ikisi de dile göre değişiyor.
 * Düzen `(marketing)/layout.tsx` konumunda kalsaydı dil parametresinin
 * ÜSTÜNDE olurdu ve hangi dilde olduğunu bilemezdi — Arapça sayfa
 * `lang="tr"` derdi. Bir kademe aşağı, parametrenin İÇİNE alınınca
 * parametreyi okuyabiliyor.
 *
 * ADRESLER. `[[...locale]]` isteğe bağlı yakalayıcıdır: hem `/` (parametre
 * yok → Türkçe) hem `/en`, `/ku`, `/ar` bu tek dala düşer. Türkçe kanonik
 * dil olduğu için önek almaz.
 *
 * Panel bu ağacın dışında, kendi kök düzeninde (`(panel)/layout.tsx`) ve
 * tek dilli. Buradaki fontlardan da renk değişkenlerinden de etkilenmez.
 *
 * FONTLAR: `next/font/google` bilinçli olarak KULLANILMIYOR — o yaklaşım
 * fontları derleme anında indirir ve ağın kapalı olduğu bir derleme
 * ortamında build çuvallar. Google Fonts'a `<link>` de atılamıyor:
 * güvenlik başlığı `style-src 'self'` ve `font-src 'self'` diyor.
 * Aileler kendi sunucumuzda, `/public/fonts` altında.
 */
export default async function MarketingRootLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale?: string[] }>;
}) {
  // Hoşgörülü çözümleyici: 404 sayfası da BU düzenin içinde çizilir.
  // Düzen katı çözümleyiciyle `notFound()` fırlatsaydı 404'ün kendisini
  // saracak düzen kalmaz, Next markasız varsayılanına düşerdi. 404 kararı
  // sayfanın katı çözümleyicisinde (bkz. route.ts).
  const locale = resolveLocaleLenient((await params).locale);
  const meta = localeMeta[locale];

  return (
    <html lang={meta.tag} dir={meta.dir}>
      <body className="scrub-site">{children}</body>
    </html>
  );
}
