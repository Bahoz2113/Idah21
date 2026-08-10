import type { ReactNode } from "react";
import "./fonts.css";
import "./sinema.css";

/**
 * SİNEMA DÜZENİ — tipografi ve renk değişkenlerinin kapsamı.
 *
 * FONTLAR: `next/font/google` bilinçli olarak KULLANILMIYOR. O yaklaşım
 * fontları derleme anında indirir; ağın kapalı olduğu bir derleme
 * ortamında build tamamen çuvallar.
 *
 * Google Fonts'a `<link>` de atılmıyor — atılamıyor. Uygulamanın
 * güvenlik başlığı `style-src 'self'` ve `font-src 'self'` diyor;
 * harici font yüklemek için bu politikayı gevşetmek gerekirdi.
 * Güvenlik politikasını gevşetmek insan onayı gerektiren bir karardır
 * ve bir tasarım denemesi için alınmaz.
 *
 * Bunun yerine iki aile kendi sunucumuzda: Space Grotesk ve Inter,
 * latin + latin-ext altkümelerine kırpılıp `/public/fonts` altına
 * alındı (toplam 175 kB). Bu, `<link>` yaklaşımının amacını
 * (derlemenin ağa bağımlı olmaması) zaten karşılıyor; üstüne bir DNS
 * ve TLS turu daha az, üçüncü tarafa giden istek yok.
 *
 * Yüklemeler kök düzene değil buraya bağlanır: panel rotalarının
 * (öğrenci, eğitmen, veli, yönetim) bu iki aileye ihtiyacı yok.
 *
 * RENKLER: yeni bir palet üretilmedi. Değişkenler kurumun mevcut marka
 * paletine bağlanır — logodan türetilen teal, turuncu ve zümrüt. Tek
 * kaynak `packages/config` içindeki `marketingTokens`; buradaki değerler
 * onun birebir karşılığıdır.
 */
export default function SinemaLayout({ children }: { children: ReactNode }) {
  return <div className="scrub-site">{children}</div>;
}
