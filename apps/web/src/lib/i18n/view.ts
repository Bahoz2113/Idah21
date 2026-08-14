import type { Locale } from "./config";
import { content } from "./content";
import { ui } from "./ui";
import { channels, contact, disciplines, legacy, metrics } from "@/lib/seo/site";

/**
 * DİLE GÖRE GÖRÜNÜM KATMANI.
 *
 * İki tür veri var ve karıştırılmamaları gerekiyor:
 *
 *   YAPI — disiplin kimliği, hangar kodu (`HGR-01`), sayaç değeri (10),
 *   WhatsApp adresi, Instagram kullanıcı adı. Bunlar dilden bağımsızdır;
 *   `lib/seo/site.ts` içinde TEK kopya durur.
 *
 *   METİN — başlık, özet, ipucu, kazanım. Bunlar dört dilde ayrı ayrı
 *   `lib/i18n/content/*` içinde durur.
 *
 * Bu dosya ikisini birleştirir. Alternatifi, her dilin kendi tam kaydını
 * taşımasıydı: o zaman bir kurs kodu değiştiğinde dört dosyada birden
 * düzeltmek gerekirdi ve biri unutulduğunda hata sessiz olurdu — Arapça
 * sayfada eski kod görünür, kimse fark etmezdi.
 *
 * EŞLEŞTİRME SIRAYLA DEĞİL KİMLİKLE. Disiplinler `id` üzerinden eşleşir,
 * sıra değişse bile doğru metni bulur. Metrik, miras ve SSS listeleri
 * sırayla eşleşir ama `Content` tipi uzunluklarını demet olarak sabitler,
 * bu yüzden kayma derlemede yakalanır.
 */

/**
 * Arapçada rakamlar Hindî-Arabî biçimde yazılır. İçerik metinleri zaten
 * öyle yazıldı; yaş aralığı gibi YAPIDAN gelen sayıların da aynı yazıyı
 * kullanması gerekiyor, yoksa aynı cümlede iki farklı rakam sistemi
 * görünür. Diğer üç dilde dizge olduğu gibi döner.
 */
const ARABIC_DIGITS = "٠١٢٣٤٥٦٧٨٩";
export function localeDigits(locale: Locale, value: string): string {
  if (locale !== "ar") return value;
  return value.replace(/[0-9]/g, (d) => ARABIC_DIGITS[Number(d)]);
}

/**
 * Yaş aralığı kaydı `"11-16 yaş"` biçiminde tutulur; sayılar yapıdan,
 * birim kelimesi dilden gelir. Metnin tamamını dört dile kopyalamak yerine
 * sayıyı ayıklıyoruz — bir disiplinin yaş alt sınırı değiştiğinde tek
 * yerde düzelir.
 */
export function ageRangeLabel(locale: Locale, raw: string): string {
  const bounds = raw.match(/\d+/g);
  if (!bounds || bounds.length < 2) return raw;
  return `${localeDigits(locale, `${bounds[0]}-${bounds[1]}`)} ${ui(locale).ageRange}`;
}

export type LocalizedDiscipline = {
  id: string;
  code: string;
  title: string;
  summary: string;
  detail: string;
  ageRange: string;
  outcomes: readonly string[];
};

export function localizedDisciplines(locale: Locale): readonly LocalizedDiscipline[] {
  const text = content(locale).disciplines;
  return disciplines.map((d) => {
    const t = text[d.id as keyof typeof text];
    return {
      id: d.id,
      code: d.code,
      ageRange: ageRangeLabel(locale, d.ageRange),
      title: t.title,
      summary: t.summary,
      detail: t.detail,
      outcomes: t.outcomes,
    };
  });
}

export function localizedMetrics(locale: Locale) {
  const text = content(locale).metrics;
  return metrics.map((m, i) => ({
    value: m.value,
    suffix: m.suffix,
    label: text[i].label,
    hint: text[i].hint,
  }));
}

export function localizedLegacy(locale: Locale) {
  const text = content(locale).legacy;
  // `era` de çeviriden gelir: "1206" her dilde sayı ama "Bugün" ve "Yarın"
  // kelimedir. Yıl için Arapça rakam dönüşümü metnin kendi içinde yapıldı.
  return legacy.map((_, i) => text[i]);
}

export function localizedFaqs(locale: Locale) {
  return content(locale).faqs;
}

export function localizedChannels(locale: Locale) {
  const hints = content(locale).channels;
  return {
    whatsapp: {
      url: channels.whatsapp.url,
      label: channels.whatsapp.label,
      value: contact.phoneDisplay,
      hint: hints.whatsappHint,
    },
    instagram: {
      url: channels.instagram.url,
      label: channels.instagram.label,
      value: channels.instagram.handle,
      hint: hints.instagramHint,
    },
    maps: {
      url: channels.maps.url,
      label: channels.maps.label,
      value: contact.address.city,
      hint: hints.mapsHint,
    },
  };
}
