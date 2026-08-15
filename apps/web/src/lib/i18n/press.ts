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

type PressText = { title: string; summary?: string; imageAlt?: string };
type PressTextMap = Record<string, PressText>;

const en: PressTextMap = {
  "https://www.batmantarafsiz.com/nasiroglu-robotik-kodlama-atolyesini-ziyaret-etti/": {
    title: "Nasıroğlu visited the robotics coding workshop",
    summary:
      "Batman MP Ferhat Nasıroğlu toured the robotics coding workshop and examined the students' projects.",
    imageAlt:
      "Batman MP Ferhat Nasıroğlu examining the showcase of student projects at the CEZERİ ROBOTECH workshop",
  },
  "https://batmandemokrathaber.com/serkan-ramanlidan-cezeri-roboteche-ziyaret-gelecegi-insa-eden-genclerimizin-yanindayiz/": {
    title: "Serkan Ramanlı visits Cezeri Robotech: ⁦\"We stand with the young people building the future\"⁩",
    summary:
      "Batman MP Serkan Ramanlı visited the workshop and voiced his support for the students' technology work.",
    imageAlt:
      "Batman MP Serkan Ramanlı receiving a robotics training kit from an instructor at the CEZERİ ROBOTECH workshop",
  },
  "https://www.batmantarafsiz.com/yediiki-robot-ve-teknoloji-yarismasi-basladi/": {
    title: "YEDİİKİ Robot and Technology Competition has begun",
    summary:
      "Opening of the YEDİİKİ Robot and Technology Competition held under the auspices of the Batman Governorship; Governor Ekrem Canalp toured the project stands.",
    imageAlt:
      "Governor of Batman Ekrem Canalp examining the CEZERİ ROBOTECH students' model aircraft at the YEDİİKİ Robot and Technology Competition",
  },
  "https://www.batmansonsoz.net/mobil/haber/esnaf-odasi-robotech-le-anlasti-90483.html": {
    title: "Chamber of Tradesmen signs with Robotech",
    summary:
      "Under the protocol signed with the Batman Chamber of Tradesmen and Craftsmen, chamber members and their children receive discounted technology training.",
    imageAlt:
      "Signing moment of the technology education protocol between CEZERİ ROBOTECH and the Batman Chamber of Tradesmen and Craftsmen",
  },
  "https://batmanrehbergazetesi.com/dijital-dolandiricilik-her-gecen-gun-artiyor": {
    title: "Digital fraud is rising by the day",
    summary:
      "An awareness warning against card-data theft, SMS traps and AI-assisted fraud. Cybersecurity awareness is one of the workshop's ten training tracks.",
    imageAlt:
      "CEZERİ ROBOTECH IT specialist giving a press statement on cybercrime and digital fraud",
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
    imageAlt:
      "Parlamenterê Batmanê Ferhat Nasiroglu vîtrîna projeyên xwendekaran li atolyeya CEZERÎ ROBOTECH dinirxîne",
  },
  "https://batmandemokrathaber.com/serkan-ramanlidan-cezeri-roboteche-ziyaret-gelecegi-insa-eden-genclerimizin-yanindayiz/": {
    title: "Serdana Serkan Ramanli bo Cezerî Robotech: ⁦\"Em li kêleka ciwanên ku pêşerojê ava dikin in\"⁩",
    summary:
      "Parlamenterê Batmanê Serkan Ramanli serdana atolyeyê kir û peyama piştgiriyê da xebatên teknolojiyê yên ciwanan.",
    imageAlt:
      "Parlamenterê Batmanê Serkan Ramanli li atolyeya CEZERÎ ROBOTECH seta perwerdehiya robotîkê ji perwerdekar werdigire",
  },
  "https://www.batmantarafsiz.com/yediiki-robot-ve-teknoloji-yarismasi-basladi/": {
    title: "Pêşbaziya Robot û Teknolojiyê ya YEDIÎKÎ dest pê kir",
    summary:
      "Vekirina Pêşbaziya Robot û Teknolojiyê ya YEDIÎKÎ ku di bin banê Waliyê Batmanê de hat lidarxistin; Walî Ekrem Canalp standên projeyan geriya.",
    imageAlt:
      "Waliyê Batmanê Ekrem Canalp balafira modelê ya xwendekarên CEZERÎ ROBOTECH di Pêşbaziya YEDIÎKÎ de dinirxîne",
  },
  "https://www.batmansonsoz.net/mobil/haber/esnaf-odasi-robotech-le-anlasti-90483.html": {
    title: "Odeya Esnafan bi Robotech re li hev kir",
    summary:
      "Di çarçoveya protokola ku bi Odeya Esnaf û Pîşekarên Batmanê re hat îmzekirin de, endamên odeyê û zarokên wan bi daşikandinê ji perwerdehiyên teknolojiyê sûd werdigirin.",
    imageAlt:
      "Kêliya îmzekirina protokola perwerdehiya teknolojiyê di navbera CEZERÎ ROBOTECH û Odeya Esnaf û Pîşekarên Batmanê de",
  },
  "https://batmanrehbergazetesi.com/dijital-dolandiricilik-her-gecen-gun-artiyor": {
    title: "Sextekariya dîjîtal roj bi roj zêde dibe",
    summary:
      "Hişyariya haydariyê li dijî dizîna daneyên kartê, xefikên SMS û rêbazên sextekariyê yên bi piştgiriya zîrekiya sûnî. Haydariya ewlehiya sîber yek ji deh serikên perwerdehiyê yên atolyeyê ye.",
    imageAlt:
      "Pisporê IT yê CEZERÎ ROBOTECH derbarê sûcên sîber û sextekariya dîjîtal de daxuyaniyê dide çapemeniyê",
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
    imageAlt:
      "نائب باتمان فرحات ناصر أوغلو يتفقد واجهة مشاريع الطلاب في ورشة جزري روبوتيك",
  },
  "https://batmandemokrathaber.com/serkan-ramanlidan-cezeri-roboteche-ziyaret-gelecegi-insa-eden-genclerimizin-yanindayiz/": {
    title: "زيارة سركان رامانلي لجزري روبوتيك: ⁦\"نقف مع شبابنا الذين يبنون المستقبل\"⁩",
    summary:
      "نائب باتمان سركان رامانلي زار الورشة وعبّر عن دعمه لأعمال الشباب التقنية.",
    imageAlt:
      "نائب باتمان سركان رامانلي يتسلّم طقم تدريب الروبوتات من المدرب في ورشة جزري روبوتيك",
  },
  "https://www.batmantarafsiz.com/yediiki-robot-ve-teknoloji-yarismasi-basladi/": {
    title: "انطلاق مسابقة يدي إيكي للروبوتات والتقنية",
    summary:
      "افتتاح مسابقة يدي إيكي للروبوتات والتقنية المنظّمة برعاية ولاية باتمان؛ الوالي أكرم جان ألب تجوّل بين أجنحة المشاريع.",
    imageAlt:
      "والي باتمان أكرم جان ألب يتفقد الطائرة النموذجية لطلاب جزري روبوتيك في مسابقة يدي إيكي",
  },
  "https://www.batmansonsoz.net/mobil/haber/esnaf-odasi-robotech-le-anlasti-90483.html": {
    title: "غرفة الحرفيين توقّع اتفاقًا مع روبوتيك",
    summary:
      "بموجب البروتوكول الموقّع مع غرفة الحرفيين والصنّاع في باتمان، يستفيد أعضاء الغرفة وأبناؤهم من التدريبات التقنية بأسعار مخفّضة.",
    imageAlt:
      "لحظة توقيع بروتوكول التعليم التقني بين جزري روبوتيك وغرفة الحرفيين والصنّاع في باتمان",
  },
  "https://batmanrehbergazetesi.com/dijital-dolandiricilik-her-gecen-gun-artiyor": {
    title: "الاحتيال الرقمي يتزايد يومًا بعد يوم",
    summary:
      "تحذير توعوي من سرقة بيانات البطاقات وفخاخ الرسائل النصية وأساليب الاحتيال المدعومة بالذكاء الاصطناعي. الوعي بالأمن السيبراني أحد مسارات التدريب العشرة في الورشة.",
    imageAlt:
      "خبير تقنية المعلومات في جزري روبوتيك يدلي بتصريح صحفي عن الجرائم السيبرانية والاحتيال الرقمي",
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
      ...(p.imageAlt ? { imageAlt: ceviri.imageAlt ?? p.imageAlt } : {}),
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
