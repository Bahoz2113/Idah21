import type { Locale } from "./config";
import { press, type PressItem } from "@/lib/seo/site";

/**
 * BASIN SÖZLÜĞÜ — haber başlıkları ve özetleri dört dilde.
 *
 * Haberlerin kendisi Türkçe yayınlardır ve bağlantı Türkçe sayfaya gider;
 * burada çevrilen, ZİYARETÇİYE haberin ne olduğunu anlatan başlık ve
 * özettir. Kaynak adları (Batman Tarafsız vb.) özel isimdir, çevrilmez.
 * Kayıt anahtarı URL'dir: aynı haber iki kez eklenirse çeviri de aynı
 * kayda düşer, sıradan bağımsızdır.
 *
 * Çevirisi eksik kayıt Türkçesiyle görünür; `eksikBasinCevirileri()`
 * denetimde kullanılır.
 */

type PressText = { title: string; summary?: string };
type PressTextMap = Record<string, PressText>;

const en: PressTextMap = {
  "https://www.batmantarafsiz.com/nasiroglu-robotik-kodlama-atolyesini-ziyaret-etti/": {
    title: "Nasıroğlu visited the robotics coding workshop",
    summary:
      "Batman MP Ferhat Nasıroğlu toured the robotics coding workshop and examined the students' projects.",
  },
  "https://batmandemokrathaber.com/serkan-ramanlidan-cezeri-roboteche-ziyaret-gelecegi-insa-eden-genclerimizin-yanindayiz/": {
    title: "Serkan Ramanlı visits Cezeri Robotech: ⁦\"We stand with the young people building the future\"⁩",
    summary:
      "Batman MP Serkan Ramanlı visited the workshop and voiced his support for the students' technology work.",
  },
  "https://www.batmantarafsiz.com/yediiki-robot-ve-teknoloji-yarismasi-basladi/": {
    title: "YEDİİKİ Robot and Technology Competition has begun",
    summary:
      "Opening of the YEDİİKİ Robot and Technology Competition held under the auspices of the Batman Governorship; Governor Ekrem Canalp toured the project stands.",
  },
  "https://www.batmansonsoz.net/mobil/haber/esnaf-odasi-robotech-le-anlasti-90483.html": {
    title: "Chamber of Tradesmen signs with Robotech",
    summary:
      "Under the protocol signed with the Batman Chamber of Tradesmen and Craftsmen, chamber members and their children receive discounted technology training.",
  },
  "https://batmanrehbergazetesi.com/dijital-dolandiricilik-her-gecen-gun-artiyor": {
    title: "Digital fraud is rising by the day",
    summary:
      "An awareness warning against card-data theft, SMS traps and AI-assisted fraud. Cybersecurity awareness is one of the workshop's ten training tracks.",
  },
  "https://x.com/fnasiroglu/status/1961125439042191731": {
    title: "Workshop visit post",
    summary: "The MP's post on X about his workshop visit.",
  },
  "https://www.instagram.com/reel/DXuKouMCHNG/": {
    title: "YEDİİKİ Robot and Technology Competition — video",
    summary: "Instagram reel from the competition opening.",
  },
  "https://www.instagram.com/p/DN6GDDziCRZ/": { title: "Workshop post" },
  "https://www.instagram.com/p/DJ_4QJNILUr/": { title: "Workshop post" },
};

const ku: PressTextMap = {
  "https://www.batmantarafsiz.com/nasiroglu-robotik-kodlama-atolyesini-ziyaret-etti/": {
    title: "Nasiroglu serdana atolyeya kodkirina robotîk kir",
    summary:
      "Parlamenterê Batmanê Ferhat Nasiroglu atolyeya kodkirina robotîk geriya û projeyên xwendekaran nirxand.",
  },
  "https://batmandemokrathaber.com/serkan-ramanlidan-cezeri-roboteche-ziyaret-gelecegi-insa-eden-genclerimizin-yanindayiz/": {
    title: "Serdana Serkan Ramanli bo Cezerî Robotech: ⁦\"Em li kêleka ciwanên ku pêşerojê ava dikin in\"⁩",
    summary:
      "Parlamenterê Batmanê Serkan Ramanli serdana atolyeyê kir û peyama piştgiriyê da xebatên teknolojiyê yên ciwanan.",
  },
  "https://www.batmantarafsiz.com/yediiki-robot-ve-teknoloji-yarismasi-basladi/": {
    title: "Pêşbaziya Robot û Teknolojiyê ya YEDIÎKÎ dest pê kir",
    summary:
      "Vekirina Pêşbaziya Robot û Teknolojiyê ya YEDIÎKÎ ku di bin banê Waliyê Batmanê de hat lidarxistin; Walî Ekrem Canalp standên projeyan geriya.",
  },
  "https://www.batmansonsoz.net/mobil/haber/esnaf-odasi-robotech-le-anlasti-90483.html": {
    title: "Odeya Esnafan bi Robotech re li hev kir",
    summary:
      "Di çarçoveya protokola ku bi Odeya Esnaf û Pîşekarên Batmanê re hat îmzekirin de, endamên odeyê û zarokên wan bi daşikandinê ji perwerdehiyên teknolojiyê sûd werdigirin.",
  },
  "https://batmanrehbergazetesi.com/dijital-dolandiricilik-her-gecen-gun-artiyor": {
    title: "Sextekariya dîjîtal roj bi roj zêde dibe",
    summary:
      "Hişyariya haydariyê li dijî dizîna daneyên kartê, xefikên SMS û rêbazên sextekariyê yên bi piştgiriya zîrekiya sûnî. Haydariya ewlehiya sîber yek ji deh serikên perwerdehiyê yên atolyeyê ye.",
  },
  "https://x.com/fnasiroglu/status/1961125439042191731": {
    title: "Parvekirina serdana atolyeyê",
    summary: "Parvekirina parlamenterî ya li ser X derbarê serdana atolyeyê de.",
  },
  "https://www.instagram.com/reel/DXuKouMCHNG/": {
    title: "Pêşbaziya Robot û Teknolojiyê ya YEDIÎKÎ — vîdyo",
    summary: "Tomara reel a Instagramê ji vekirina pêşbaziyê.",
  },
  "https://www.instagram.com/p/DN6GDDziCRZ/": { title: "Parvekirina atolyeyê" },
  "https://www.instagram.com/p/DJ_4QJNILUr/": { title: "Parvekirina atolyeyê" },
};

const ar: PressTextMap = {
  "https://www.batmantarafsiz.com/nasiroglu-robotik-kodlama-atolyesini-ziyaret-etti/": {
    title: "ناصر أوغلو زار ورشة برمجة الروبوتات",
    summary:
      "نائب باتمان فرحات ناصر أوغلو تجوّل في ورشة برمجة الروبوتات واطّلع على مشاريع الطلاب.",
  },
  "https://batmandemokrathaber.com/serkan-ramanlidan-cezeri-roboteche-ziyaret-gelecegi-insa-eden-genclerimizin-yanindayiz/": {
    title: "زيارة سركان رامانلي لجزري روبوتيك: ⁦\"نقف مع شبابنا الذين يبنون المستقبل\"⁩",
    summary:
      "نائب باتمان سركان رامانلي زار الورشة وعبّر عن دعمه لأعمال الشباب التقنية.",
  },
  "https://www.batmantarafsiz.com/yediiki-robot-ve-teknoloji-yarismasi-basladi/": {
    title: "انطلاق مسابقة يدي إيكي للروبوتات والتقنية",
    summary:
      "افتتاح مسابقة يدي إيكي للروبوتات والتقنية المنظّمة برعاية ولاية باتمان؛ الوالي أكرم جان ألب تجوّل بين أجنحة المشاريع.",
  },
  "https://www.batmansonsoz.net/mobil/haber/esnaf-odasi-robotech-le-anlasti-90483.html": {
    title: "غرفة الحرفيين توقّع اتفاقًا مع روبوتيك",
    summary:
      "بموجب البروتوكول الموقّع مع غرفة الحرفيين والصنّاع في باتمان، يستفيد أعضاء الغرفة وأبناؤهم من التدريبات التقنية بأسعار مخفّضة.",
  },
  "https://batmanrehbergazetesi.com/dijital-dolandiricilik-her-gecen-gun-artiyor": {
    title: "الاحتيال الرقمي يتزايد يومًا بعد يوم",
    summary:
      "تحذير توعوي من سرقة بيانات البطاقات وفخاخ الرسائل النصية وأساليب الاحتيال المدعومة بالذكاء الاصطناعي. الوعي بالأمن السيبراني أحد مسارات التدريب العشرة في الورشة.",
  },
  "https://x.com/fnasiroglu/status/1961125439042191731": {
    title: "منشور عن زيارة الورشة",
    summary: "منشور النائب على منصة إكس حول زيارته للورشة.",
  },
  "https://www.instagram.com/reel/DXuKouMCHNG/": {
    title: "مسابقة يدي إيكي للروبوتات والتقنية — فيديو",
    summary: "مقطع ريلز على إنستغرام من افتتاح المسابقة.",
  },
  "https://www.instagram.com/p/DN6GDDziCRZ/": { title: "منشور من الورشة" },
  "https://www.instagram.com/p/DJ_4QJNILUr/": { title: "منشور من الورشة" },
};

const CEVIRILER: Partial<Record<Locale, PressTextMap>> = { en, ku, ar };

/** Basın listesi + dil: başlık ve özet seçilen dile döner, gerisi aynı. */
export function localizedPress(locale: Locale): readonly PressItem[] {
  const harita = CEVIRILER[locale];
  if (!harita) return press;
  return press.map((p) => {
    const ceviri = harita[p.url];
    if (!ceviri) return p;
    return {
      ...p,
      title: ceviri.title,
      ...(p.summary ? { summary: ceviri.summary ?? p.summary } : {}),
    };
  });
}

/** Denetim: çevirisi eksik kayıtlar. */
export function eksikBasinCevirileri(): string[] {
  const eksik: string[] = [];
  for (const [dil, harita] of Object.entries(CEVIRILER)) {
    for (const p of press) if (!harita[p.url]) eksik.push(`${dil}:${p.url}`);
  }
  return eksik;
}
