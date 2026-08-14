import "../globals.css";
import "./fonts.css";
import "./marketing.css";
import type { ReactNode } from "react";

/**
 * TANITIM SİTESİ KÖK DÜZENİ.
 *
 * İKİ KÖK DÜZEN. Bu dosya `<html>` etiketini kendisi basar; paneli
 * `(panel)/layout.tsx` basar. Ayrılmalarının tek sebebi `<html lang>`:
 * tanıtım sitesi dört dilde yayınlanıyor ve her dilin sayfası kendi dil
 * etiketini taşımak zorunda, Arapça ayrıca `dir="rtl"`. Tek kök düzende
 * `<html>` bir kez ve sabit yazılırdı.
 *
 * Buradaki değerler Türkçe içindir; `/en`, `/ku`, `/ar` altındaki düzen
 * (`[locale]/layout.tsx`) kendi dilini yazar. Rota grubu adı parantezli
 * olduğu için adreste görünmez: içindeki `page.tsx` kök rotayı karşılar.
 *
 * FONTLAR: `next/font/google` bilinçli olarak KULLANILMIYOR. O yaklaşım
 * fontları derleme anında indirir; ağın kapalı olduğu bir derleme
 * ortamında build tamamen çuvallar. Google Fonts'a `<link>` de atılmıyor —
 * atılamıyor: uygulamanın güvenlik başlığı `style-src 'self'` ve
 * `font-src 'self'` diyor. Aileler kendi sunucumuzda, `/public/fonts`
 * altında, latin + latin-ext altkümelerine kırpılmış hâlde; Arapça için
 * ayrıca Noto Sans Arabic.
 *
 * RENKLER: yeni palet üretilmedi. Değişkenler kurumun mevcut marka
 * paletine bağlanır; tek kaynak `packages/config` içindeki
 * `marketingTokens`.
 */
export default function MarketingRootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="tr" dir="ltr">
      <body className="scrub-site">{children}</body>
    </html>
  );
}
