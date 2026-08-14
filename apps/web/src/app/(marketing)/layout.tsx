import type { ReactNode } from "react";
import "./fonts.css";
import "./marketing.css";

/**
 * TANITIM SİTESİ DÜZENİ — tipografi ve renk değişkenlerinin kapsamı.
 *
 * ROTA GRUBU. Klasör adı paranteziyle yazıldığı için (`(marketing)`) URL'de
 * görünmez: içindeki `page.tsx` kök rotayı (`/`) karşılar. Grup olmasının
 * tek sebebi bu düzenin YALNIZCA tanıtım sayfasına inmesi. Panel rotaları
 * (yönetim, eğitmen, veli, öğrenci) kök düzenin altında kalır ve buradaki
 * fontlardan da renk değişkenlerinden de etkilenmez.
 *
 * FONTLAR: `next/font/google` bilinçli olarak KULLANILMIYOR. O yaklaşım
 * fontları derleme anında indirir; ağın kapalı olduğu bir derleme
 * ortamında build tamamen çuvallar.
 *
 * Google Fonts'a `<link>` de atılmıyor — atılamıyor. Uygulamanın
 * güvenlik başlığı `style-src 'self'` ve `font-src 'self'` diyor;
 * harici font yüklemek için bu politikayı gevşetmek gerekirdi.
 * Güvenlik politikasını gevşetmek insan onayı gerektiren bir karardır
 * ve bir tasarım tercihi için alınmaz.
 *
 * Bunun yerine iki aile kendi sunucumuzda: Space Grotesk ve Inter,
 * latin + latin-ext altkümelerine kırpılıp `/public/fonts` altına
 * alındı (toplam 175 kB). Bu, `<link>` yaklaşımının amacını
 * (derlemenin ağa bağımlı olmaması) zaten karşılıyor; üstüne bir DNS
 * ve TLS turu daha az, üçüncü tarafa giden istek yok.
 *
 * RENKLER: yeni bir palet üretilmedi. Değişkenler kurumun mevcut marka
 * paletine bağlanır — logodan türetilen teal, turuncu ve zümrüt. Tek
 * kaynak `packages/config` içindeki `marketingTokens`; buradaki değerler
 * onun birebir karşılığıdır.
 */
export default function MarketingLayout({ children }: { children: ReactNode }) {
  return <div className="scrub-site">{children}</div>;
}
