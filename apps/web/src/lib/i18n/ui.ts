import type { Locale } from "./config";

/**
 * ARAYÜZ DİZELERİ — düğmeler, etiketler, durum metinleri, ekran okuyucu
 * açıklamaları.
 *
 * Sayfanın ANLATISI burada değil; o `lib/i18n/content` altında durur. Bu
 * dosya yalnızca çerçeveyi taşır: "Yükleniyor", "Haberi oku", "yeni
 * sekmede açılır" gibi kısa ve tekrar eden parçalar.
 *
 * Ayrı tutulmalarının sebebi pratik: çerçeve nadiren değişir ve
 * çevirisi mekaniktir; anlatı sık değişir ve çevirisi editoryal karar
 * ister. Aynı dosyada dursalardı her metin düzeltmesi bütün çeviri
 * dosyalarını kirletirdi.
 *
 * TÜR GÜVENLİĞİ. `UiStrings` Türkçe sözlükten türetilir. Bir dile yeni
 * anahtar eklenip diğerlerine eklenmezse derleme hata verir — eksik
 * çeviri sessizce yayına çıkamaz.
 */

const tr = {
  // ── Gezinme
  navAria: "Ana gezinme",
  menuOpen: "Menüyü aç",
  menuClose: "Menüyü kapat",
  toTop: "sayfanın başına dön",
  skipToContent: "İçeriğe geç",
  logoAlt: "logosu",
  languageLabel: "Dil",
  languageAria: "Site dilini değiştir",

  // ── Hero
  heroEyebrow: "Yapay Zekâ ve Robotik Kodlama Teknoloji Üssü",
  heroHeadlineTop: "HAYAL ET, KODLA,",
  heroHeadlineBottom: "GELECEĞİ TASARLA.",
  heroLoading: "Yükleniyor",
  heroScrollHint: "Geleceği keşfetmek için kaydırın",

  // ── Bölüm çerçevesi
  stop: "DURAK",

  // ── Eğitim kataloğu
  searchesFor: "Bu eğitim şu aramalarda",
  endOfTerm: "Dönem sonunda öğrenci",
  ageRange: "yaş",

  // ── Müfredat
  curriculumPrograms: "Müfredat programları",
  curriculumTools: "Kullanılan araç ve bileşenler",
  weeks: "hafta",
  curriculumTotalPre: "Dört programda toplam",
  curriculumTotalPost:
    "ders haftası. Program içerikleri yaş grubuna ve sınıf seviyesine göre eğitmen tarafından uyarlanır.",

  // ── Medya
  mediaPending: "Medya aktarımı bekleniyor.",
  mediaSoon: "Yakında",
  mediaPrev: "Önceki medya",
  mediaNext: "Sonraki medya",
  mediaClose: "Kapat",
  conceptTag: "KONSEPT",

  // ── Basın
  pressNewsAndPapers: "HABER VE GAZETE",
  pressSocial: "SOSYAL MEDYA",
  pressRead: "Haberi oku",
  pressVideo: "Video kaydı",
  pressArchiveCredit: "CEZERİ ROBOTECH arşivi",
  pressEmpty:
    "Basın bağlantıları hazırlanıyor. Yayınlanan haber, röportaj ve etkinlik haberlerimiz burada kaynağıyla birlikte listelenecek.",
  pressPhotoNote:
    "Kartlardaki fotoğraflar CEZERİ ROBOTECH arşivinden dosya fotoğraflarıdır; haberlerin kendi görselleri ilgili yayınlara aittir.",

  // ── İletişim
  contactEmailCta: "E-posta Gönder",
  contactDirections: "Yol tarifi al — yeni sekmede harita uygulamasında açılır",
  newTab: "(yeni sekmede açılır)",
  contactHeading: "İletişim",
  followUs: "BİZİ TAKİP EDİN",

  // ── Marka sekansı
  brandSequenceAlt:
    "CEZERİ ROBOTECH robotik baykuş amblemi, dişli çarklardan oluşan mekanik bir bütüne dönüşürken",
  brandSequenceNote: "Marka sekansı · yapay zeka ile üretilmiş konsept görsel",

  // ── Davet
  ctaPrimary: "Kayıt ve Bilgi Talep Edin",
  ctaSecondary: "E-posta Gönderin",

  // ── Altbilgi
  rightsReserved: "Tüm hakları saklıdır.",
} as const;

/**
 * Anahtar kümesi Türkçe sözlükten türer, değer tipi `string`'e genişler.
 * `typeof tr` doğrudan kullanılsaydı `as const` yüzünden her alan kendi
 * Türkçe metnine sabitlenir ve İngilizce karşılığı "atanamaz" hatası
 * verirdi. Bu biçim eksik anahtarı yakalamayı sürdürür.
 */
export type UiStrings = { [K in keyof typeof tr]: string };

const en: UiStrings = {
  navAria: "Main navigation",
  menuOpen: "Open menu",
  menuClose: "Close menu",
  toTop: "back to top",
  skipToContent: "Skip to content",
  logoAlt: "logo",
  languageLabel: "Language",
  languageAria: "Change site language",

  heroEyebrow: "Artificial Intelligence and Robotic Coding Technology Base",
  heroHeadlineTop: "IMAGINE, CODE,",
  heroHeadlineBottom: "DESIGN THE FUTURE.",
  heroLoading: "Loading",
  heroScrollHint: "Scroll to explore the future",

  stop: "STOP",

  searchesFor: "This course answers searches for",
  endOfTerm: "By the end of term the student",
  ageRange: "years",

  curriculumPrograms: "Curriculum programmes",
  curriculumTools: "Tools and components used",
  weeks: "weeks",
  curriculumTotalPre: "Four programmes, a total of",
  curriculumTotalPost:
    "teaching weeks. Programme content is adapted by the instructor to the age group and school level.",

  mediaPending: "Media transfer pending.",
  mediaSoon: "Coming soon",
  mediaPrev: "Previous media",
  mediaNext: "Next media",
  mediaClose: "Close",
  conceptTag: "CONCEPT",

  pressNewsAndPapers: "NEWS AND PRESS",
  pressSocial: "SOCIAL MEDIA",
  pressRead: "Read the article",
  pressVideo: "Video record",
  pressArchiveCredit: "CEZERİ ROBOTECH archive",
  pressEmpty:
    "Press links are being prepared. Published news, interviews and event coverage will be listed here together with their sources.",
  pressPhotoNote:
    "The photographs on these cards are file photos from the CEZERİ ROBOTECH archive; the images belonging to each article remain the property of the publication concerned.",

  contactEmailCta: "Send an Email",
  contactDirections: "Get directions — opens in your map app in a new tab",
  newTab: "(opens in a new tab)",
  contactHeading: "Contact",
  followUs: "FOLLOW US",

  brandSequenceAlt:
    "The CEZERİ ROBOTECH robotic owl emblem assembling into a mechanical whole made of gear wheels",
  brandSequenceNote: "Brand sequence · concept image generated with artificial intelligence",

  ctaPrimary: "Request Enrolment and Information",
  ctaSecondary: "Send an Email",

  rightsReserved: "All rights reserved.",
};

const ku: UiStrings = {
  navAria: "Gerîna sereke",
  menuOpen: "Menüyê veke",
  menuClose: "Menüyê bigire",
  toTop: "vegere serê rûpelê",
  skipToContent: "Biçe naverokê",
  logoAlt: "logo",
  languageLabel: "Ziman",
  languageAria: "Zimanê malperê biguhêre",

  heroEyebrow: "Baregeha Teknolojiyê ya Zîrekiya Sûnî û Kodkirina Robotîk",
  heroHeadlineTop: "XEYAL BIKE, KOD BIKE,",
  heroHeadlineBottom: "PAŞEROJÊ SÊWIRÎNE.",
  heroLoading: "Tê barkirin",
  heroScrollHint: "Ji bo keşfa paşerojê bişemitîne",

  stop: "RAWESTGEH",

  searchesFor: "Ev perwerde ji bo van lêgerînan e",
  endOfTerm: "Di dawiya demsalê de xwendekar",
  ageRange: "salî",

  curriculumPrograms: "Bernameyên müfredatê",
  curriculumTools: "Amûr û pêkhateyên bikaranîn",
  weeks: "hefte",
  curriculumTotalPre: "Di çar bernameyan de bi tevahî",
  curriculumTotalPost:
    "hefteyên dersê. Naveroka bernameyê ji aliyê mamoste ve li gorî koma temenî û asta dibistanê tê guncandin.",

  mediaPending: "Veguhastina medyayê tê benda kirin.",
  mediaSoon: "Nêzîk",
  mediaPrev: "Medyaya berê",
  mediaNext: "Medyaya pêş",
  mediaClose: "Bigire",
  conceptTag: "KONSEPT",

  pressNewsAndPapers: "NÛÇE Û ROJNAME",
  pressSocial: "MEDYAYA CIVAKÎ",
  pressRead: "Nûçeyê bixwîne",
  pressVideo: "Tomarê vîdyoyê",
  pressArchiveCredit: "Arşîva CEZERÎ ROBOTECH",
  pressEmpty:
    "Girêdanên çapemeniyê tên amadekirin. Nûçe, hevpeyvîn û çalakiyên me yên weşandî dê li vir bi çavkaniya xwe re bên rêzkirin.",
  pressPhotoNote:
    "Wêneyên li ser van kartan ji arşîva CEZERÎ ROBOTECH in; wêneyên nûçeyan bi xwe yên weşanên têkildar in.",

  contactEmailCta: "E-name bişîne",
  contactDirections: "Rê werbigire — di sepana nexşeyê de di tabeke nû de vedibe",
  newTab: "(di tabeke nû de vedibe)",
  contactHeading: "Têkilî",
  followUs: "ME BIŞOPÎNE",

  brandSequenceAlt:
    "Amblema kundê robotîk a CEZERÎ ROBOTECH dema ku dibe tevahiyeke mekanîk a ji çerxên diranî",
  brandSequenceNote: "Rêzeya markayê · wêneyê konseptê yê bi zîrekiya sûnî hatiye çêkirin",

  ctaPrimary: "Tomarkirin û Agahî Bixwaze",
  ctaSecondary: "E-name bişîne",

  rightsReserved: "Hemû maf parastî ne.",
};

const ar: UiStrings = {
  navAria: "التنقل الرئيسي",
  menuOpen: "فتح القائمة",
  menuClose: "إغلاق القائمة",
  toTop: "العودة إلى أعلى الصفحة",
  skipToContent: "تخطَّ إلى المحتوى",
  logoAlt: "شعار",
  languageLabel: "اللغة",
  languageAria: "تغيير لغة الموقع",

  heroEyebrow: "قاعدة تقنية للذكاء الاصطناعي والبرمجة الروبوتية",
  heroHeadlineTop: "تخيَّل، برمِج،",
  heroHeadlineBottom: "صمِّم المستقبل.",
  heroLoading: "جارٍ التحميل",
  heroScrollHint: "مرِّر لاكتشاف المستقبل",

  stop: "محطة",

  searchesFor: "هذا البرنامج يجيب عن عمليات البحث التالية",
  endOfTerm: "في نهاية الفصل يكون الطالب قد",
  ageRange: "سنة",

  curriculumPrograms: "برامج المنهج",
  curriculumTools: "الأدوات والمكوّنات المستخدمة",
  weeks: "أسبوعًا",
  curriculumTotalPre: "أربعة برامج بمجموع",
  curriculumTotalPost:
    "أسبوعًا دراسيًا. يكيّف المدرّب محتوى البرنامج حسب الفئة العمرية والمستوى الدراسي.",

  mediaPending: "بانتظار نقل الوسائط.",
  mediaSoon: "قريبًا",
  mediaPrev: "الوسائط السابقة",
  mediaNext: "الوسائط التالية",
  mediaClose: "إغلاق",
  conceptTag: "تصوّر",

  pressNewsAndPapers: "الأخبار والصحافة",
  pressSocial: "وسائل التواصل",
  pressRead: "اقرأ الخبر",
  pressVideo: "تسجيل مصوّر",
  pressArchiveCredit: "أرشيف CEZERİ ROBOTECH",
  pressEmpty:
    "يجري إعداد روابط الصحافة. ستُدرج هنا الأخبار والمقابلات وتغطية الفعاليات المنشورة مع مصادرها.",
  pressPhotoNote:
    "الصور الظاهرة على هذه البطاقات مأخوذة من أرشيف CEZERİ ROBOTECH؛ أما صور الأخبار نفسها فهي ملك للجهات الناشرة.",

  contactEmailCta: "أرسل بريدًا إلكترونيًا",
  contactDirections: "احصل على الاتجاهات — يفتح في تطبيق الخرائط في تبويب جديد",
  newTab: "(يفتح في تبويب جديد)",
  contactHeading: "التواصل",
  followUs: "تابعنا",

  brandSequenceAlt:
    "شعار البومة الآلية لـ CEZERİ ROBOTECH وهو يتشكّل من التروس ليصبح كتلة ميكانيكية متكاملة",
  brandSequenceNote: "تسلسل العلامة · صورة تصوّرية أُنتجت بالذكاء الاصطناعي",

  ctaPrimary: "اطلب التسجيل والمعلومات",
  ctaSecondary: "أرسل بريدًا إلكترونيًا",

  rightsReserved: "جميع الحقوق محفوظة.",
};

const dictionaries: Record<Locale, UiStrings> = { tr, en, ku, ar };

export function ui(locale: Locale): UiStrings {
  return dictionaries[locale];
}
