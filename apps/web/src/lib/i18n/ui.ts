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
  telemetryAria: "Kurum telemetrisi",

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
  ctaPrimaryShort: "Hemen Ara",
  ctaSecondary: "E-posta Gönderin",


  // ── Bölüm adları (gezinme + altbilgi)
  sectionLabels: {
    esik: "Üs",
    egitimler: "Eğitimlerimiz",
    mufredat: "Müfredatımız",
    atolye: "Atölye",
    "biz-kimiz": "Biz Kimiz",
    basin: "Basında Biz",
    sss: "SSS",
    kayit: "Kayıt",
    iletisim: "İletişim",
  },

  // ── Altbilgi
  // ── İletişim künyesi
  contactAddress: "Adres",
  contactPhone: "Telefon",
  contactEmail: "E-posta",
  contactHours: "Çalışma Saatleri",
  hoursWeekdays: "Pazartesi – Cuma",
  hoursSaturday: "Cumartesi",

  // ── Harita
  directionsCta: "Yol Tarifi Al",
  mapAria: "{city} şehir merkezindeki CEZERİ ROBOTECH üssünün konumunu gösteren şematik harita",
  mapBaseLabel: "{city} ÜSSÜ",
  coordNorth: "K",
  coordEast: "D",

  // ── Müfredat (ek)
  modules: "modül",
  weekLabel: "{n}. hafta",

  // ── Medya (ek)
  mediaCategoryAria: "Medya kategorisi",
  mediaAll: "Tümü",
  mediaPlayAction: "videoyu oynat",
  mediaZoomAction: "görseli büyüt",
  mediaSeconds: "sn",
  mediaPendingBody: "Atölye ve saha çekimleri yüklendiğinde bu galeri otomatik olarak dolar.",

  schemaAudience: "Çocuklar ve gençler",
  schemaHome: "Ana Sayfa",

  rightsReserved: "Tüm hakları saklıdır.",
} as const;

/**
 * Anahtar kümesi Türkçe sözlükten türer, değer tipi `string`'e genişler.
 * `typeof tr` doğrudan kullanılsaydı `as const` yüzünden her alan kendi
 * Türkçe metnine sabitlenir ve İngilizce karşılığı "atanamaz" hatası
 * verirdi. Bu biçim eksik anahtarı yakalamayı sürdürür.
 */
export type UiStrings = {
  [K in keyof typeof tr]: (typeof tr)[K] extends object
    ? { [S in keyof (typeof tr)[K]]: string }
    : string;
};

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
  telemetryAria: "Organisation telemetry",

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
  ctaPrimaryShort: "Call Now",
  ctaSecondary: "Send an Email",


  sectionLabels: {
    esik: "The Base",
    egitimler: "Our Courses",
    mufredat: "Curriculum",
    atolye: "Workshop",
    "biz-kimiz": "Who We Are",
    basin: "In the Press",
    sss: "FAQ",
    kayit: "Enrolment",
    iletisim: "Contact",
  },

  contactAddress: "Address",
  contactPhone: "Phone",
  contactEmail: "Email",
  contactHours: "Opening Hours",
  hoursWeekdays: "Monday – Friday",
  hoursSaturday: "Saturday",

  directionsCta: "Get Directions",
  mapAria: "Schematic map showing the location of the CEZERİ ROBOTECH base in central {city}",
  mapBaseLabel: "{city} BASE",
  coordNorth: "N",
  coordEast: "E",

  modules: "modules",
  weekLabel: "week {n}",

  mediaCategoryAria: "Media category",
  mediaAll: "All",
  mediaPlayAction: "play the video",
  mediaZoomAction: "enlarge the image",
  mediaSeconds: "s",
  mediaPendingBody: "This gallery fills automatically once the workshop and field footage is uploaded.",

  schemaAudience: "Children and teenagers",
  schemaHome: "Home",

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
  telemetryAria: "Telemetriya saziyê",

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
  ctaPrimaryShort: "Niha Bigere",
  ctaSecondary: "E-name bişîne",


  sectionLabels: {
    esik: "Bareger",
    egitimler: "Perwerdehiyên me",
    mufredat: "Müfredat",
    atolye: "Atolye",
    "biz-kimiz": "Em Kî Ne",
    basin: "Di Çapemeniyê de",
    sss: "Pirsên Pir Tên Kirin",
    kayit: "Tomarkirin",
    iletisim: "Têkilî",
  },

  contactAddress: "Navnîşan",
  contactPhone: "Telefon",
  contactEmail: "E-name",
  contactHours: "Saetên Xebatê",
  hoursWeekdays: "Duşem – În",
  hoursSaturday: "Şemî",

  directionsCta: "Rê Werbigire",
  mapAria: "Nexşeya şematîk a ku cihê baregeha CEZERÎ ROBOTECH li navenda bajarê {city} nîşan dide",
  mapBaseLabel: "BAREGEHA {city}",
  coordNorth: "N",
  coordEast: "E",

  modules: "modul",
  weekLabel: "hefteya {n}",

  mediaCategoryAria: "Kategoriya medyayê",
  mediaAll: "Hemû",
  mediaPlayAction: "vîdyoyê bilîze",
  mediaZoomAction: "wêneyê mezin bike",
  mediaSeconds: "ç",
  mediaPendingBody: "Dema ku tomarên atolye û qadê bên barkirin ev galerî bixweber tije dibe.",

  schemaAudience: "Zarok û ciwan",
  schemaHome: "Rûpela Sereke",

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
  telemetryAria: "بيانات المركز",

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
  ctaPrimaryShort: "اتصل الآن",
  ctaSecondary: "أرسل بريدًا إلكترونيًا",


  sectionLabels: {
    esik: "القاعدة",
    egitimler: "برامجنا",
    mufredat: "المنهج",
    atolye: "الورشة",
    "biz-kimiz": "من نحن",
    basin: "في الصحافة",
    sss: "الأسئلة الشائعة",
    kayit: "التسجيل",
    iletisim: "التواصل",
  },

  contactAddress: "العنوان",
  contactPhone: "الهاتف",
  contactEmail: "البريد الإلكتروني",
  contactHours: "ساعات العمل",
  hoursWeekdays: "الاثنين – الجمعة",
  hoursSaturday: "السبت",

  directionsCta: "احصل على الاتجاهات",
  mapAria: "خريطة تخطيطية تُظهر موقع قاعدة CEZERİ ROBOTECH في وسط مدينة {city}",
  mapBaseLabel: "قاعدة {city}",
  coordNorth: "N",
  coordEast: "E",

  modules: "وحدات",
  weekLabel: "الأسبوع {n}",

  mediaCategoryAria: "فئة الوسائط",
  mediaAll: "الكل",
  mediaPlayAction: "تشغيل الفيديو",
  mediaZoomAction: "تكبير الصورة",
  mediaSeconds: "ث",
  mediaPendingBody: "سيمتلئ هذا المعرض تلقائيًا فور رفع تسجيلات الورشة والميدان.",

  schemaAudience: "الأطفال واليافعون",
  schemaHome: "الصفحة الرئيسية",

  rightsReserved: "جميع الحقوق محفوظة.",
};

const dictionaries: Record<Locale, UiStrings> = { tr, en, ku, ar };

export function ui(locale: Locale): UiStrings {
  return dictionaries[locale];
}
