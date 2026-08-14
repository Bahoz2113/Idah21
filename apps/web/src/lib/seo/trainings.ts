/**
 * EĞİTİM KATALOĞU — arama ve yanıt motorları için kategori derinliği.
 *
 * `disciplines` (site.ts) her kategorinin ne olduğunu söyler. Bu dosya
 * onun ÜSTÜNE arama katmanını koyar:
 *
 *   answer   → "answer-first" tanım. Üretken arama motorları (Google AI
 *              Overviews, ChatGPT, Gemini, Perplexity, Copilot) bağlamdan
 *              koparıp alıntılayabileceği, kendi kendine yeterli bir
 *              paragraf arar. Cümle "X nedir" sorusunun cevabıyla başlar.
 *   keywords → gerçek arama ifadeleri. Tek tek kelime değil, insanların
 *              yazdığı öbekler; coğrafya ile çaprazlanmış hâlleri dahil.
 *   faq      → kategoriye özel soru-cevap. FAQPage şemasını besler ve
 *              sohbet tabanlı motorların doğrudan alıntıladığı biçimdir.
 *   social   → tek cümlelik paylaşım metni (OG/Twitter description,
 *              Instagram/X/LinkedIn/Reddit paylaşımı).
 *
 * Hepsi sayfada GÖRÜNÜR metindir. Kullanıcının görmediği bir şeyi şemaya
 * yazmak hem Google'ın yapılandırılmış veri politikasına aykırıdır hem de
 * yanıt motorlarında güven kaybettirir.
 */

/**
 * Hizmet coğrafyası.
 *
 * Batman merkezli bir kurumun gerçekçi erişim alanı: kendi ilçeleri,
 * bir saatlik yol mesafesindeki Diyarbakır hattı ve Güneydoğu'nun
 * komşu illeri. Yerel arama (local SEO) ve `areaServed` şeması bu
 * listeden üretilir.
 *
 * `alt` alanı yerel/tarihî adları taşır — insanlar aramada bunları da
 * yazar (İluh = Batman merkezinin eski adı, Amed = Diyarbakır).
 */
export type ServiceArea = {
  name: string;
  type: "City" | "AdministrativeArea";
  parent?: string;
  alt?: string[];
};

export const serviceArea: readonly ServiceArea[] = [
  { name: "Batman", type: "City", alt: ["İluh", "Batman merkez"] },
  { name: "Beşiri", type: "AdministrativeArea", parent: "Batman" },
  { name: "Gercüş", type: "AdministrativeArea", parent: "Batman" },
  { name: "Hasankeyf", type: "AdministrativeArea", parent: "Batman" },
  { name: "Kozluk", type: "AdministrativeArea", parent: "Batman" },
  { name: "Sason", type: "AdministrativeArea", parent: "Batman" },
  { name: "Diyarbakır", type: "City", alt: ["Amed"] },
  { name: "Silvan", type: "AdministrativeArea", parent: "Diyarbakır" },
  { name: "Bismil", type: "AdministrativeArea", parent: "Diyarbakır" },
  { name: "Ergani", type: "AdministrativeArea", parent: "Diyarbakır" },
  { name: "Çınar", type: "AdministrativeArea", parent: "Diyarbakır" },
  { name: "Kulp", type: "AdministrativeArea", parent: "Diyarbakır" },
  { name: "Hani", type: "AdministrativeArea", parent: "Diyarbakır" },
  { name: "Mardin", type: "City" },
  { name: "Siirt", type: "City" },
  { name: "Bitlis", type: "City" },
  { name: "Van", type: "City" },
  { name: "Bingöl", type: "City" },
] as const;

/** Şema ve metin üretiminde kullanılan düz isim listesi. */
export const serviceAreaNames: readonly string[] = serviceArea.flatMap((a) => [
  a.name,
  ...(a.alt ?? []),
]);

export type TrainingSeo = {
  /** Kategoriye karşılık gelen `disciplines[].id`. */
  id: string;
  /** Eskiden 3B sahnedeki animasyonu seçerdi; o sahne kaldırıldı, alan artık kullanılmıyor. */
  fx: FxKind;
  /** Kategori kapak görseli — katalogda açıldığında görünür. */
  cover: string;
  /** Yanıt motorlarının alıntılayacağı, kendi kendine yeterli tanım. */
  answer: string;
  /** Gerçek arama ifadeleri — coğrafya çaprazları dahil. */
  keywords: readonly string[];
  /** Kategoriye özel soru-cevap; FAQPage şemasını besler. */
  faq: readonly { q: string; a: string }[];
  /** Tek cümlelik paylaşım metni (OG/Twitter/sosyal). */
  social: string;
};

export type FxKind =
  | "rocket"
  | "drone"
  | "neural"
  | "robot"
  | "print"
  | "code"
  | "circuit"
  | "shield"
  | "orbit"
  | "growth";

export const trainingSeo: readonly TrainingSeo[] = [
  {
    id: "iha-vtol",
    cover: "/assets/egitim/iha-vtol.webp",
    fx: "drone",
    answer:
      "İHA/VTOL eğitimi, dikey kalkış yapabilen insansız hava araçlarının gövde " +
      "tasarımını, itki sistemini, uçuş kontrol kartı kalibrasyonunu ve otonom " +
      "görev planlamasını kapsayan uygulamalı bir mühendislik programıdır. " +
      "CEZERİ ROBOTECH Batman'da 11-16 yaş öğrencileri kendi multirotor ve VTOL " +
      "platformlarını sıfırdan monte eder, PID ayarlarını kendi elleriyle yapar " +
      "ve eğitimi gerçek saha uçuş testiyle bitirir. Simülasyon değil, uçan araç.",
    keywords: [
      "Batman drone eğitimi",
      "Batman İHA kursu",
      "çocuklar için drone eğitimi Batman",
      "VTOL eğitimi Güneydoğu",
      "Diyarbakır drone kursu",
      "Siirt İHA eğitimi",
      "Mardin drone atölyesi",
      "insansız hava aracı eğitimi 11-16 yaş",
      "uçuş kontrol kartı kalibrasyonu eğitimi",
      "otonom görev planlama çocuk eğitimi",
    ],
    faq: [
      {
        q: "Drone eğitimine kaç yaşında başlanabilir?",
        a: "İHA/VTOL modülü 11 yaş ve üzeri içindir. Lehimleme ve pervane kalibrasyonu el becerisi ile birlikte temel fizik kavrayışı gerektirir; daha küçük yaş grubu önce robotik ve elektronik modülleriyle başlar.",
      },
      {
        q: "Öğrenci kendi drone'unu yapıyor mu, hazır mı kullanıyor?",
        a: "Kendi yapıyor. Gövde, motor, ESC ve uçuş kartı montajı öğrencinin elinden çıkar; dönem sonunda uçurduğu araç kendi ürettiği araçtır.",
      },
      {
        q: "Uçuş testleri nerede yapılıyor?",
        a: "Batman'da uçuşa uygun açık sahada, eğitmen gözetiminde ve güvenlik protokolüyle yapılır. Saha kayıtlarımız atölye galerisinde yer alır.",
      },
    ],
    social:
      "Batman'da 11-16 yaş öğrenciler kendi VTOL insansız hava aracını sıfırdan monte ediyor ve sahada uçuruyor.",
  },
  {
    id: "roketcilik",
    cover: "/assets/egitim/roketcilik.webp",
    fx: "rocket",
    answer:
      "Roketçilik eğitimi, model roket gövde aerodinamiğini, kanatçık geometrisini, " +
      "itki-kütle oranını ve paraşütlü kurtarma sistemini hesaplayarak kontrollü " +
      "fırlatma yapmayı öğreten uygulamalı bir programdır. CEZERİ ROBOTECH'te " +
      "öğrenciler kendi roketlerini tasarlar, irtifa hesabını yapar ve fırlatmayı " +
      "güvenlik protokolüyle sahada gerçekleştirir. MIZRAK-305 takımımız bu " +
      "programın çıktısıdır.",
    keywords: [
      "Batman roketçilik eğitimi",
      "model roket kursu Batman",
      "çocuklar için roket eğitimi",
      "Teknofest roket takımı Batman",
      "Diyarbakır model roket atölyesi",
      "Bitlis roketçilik kursu",
      "itki kütle oranı eğitimi",
      "paraşüt kurtarma sistemi tasarımı",
      "roket aerodinamiği çocuk eğitimi",
      "Güneydoğu roket yarışması hazırlık",
    ],
    faq: [
      {
        q: "Roket fırlatma güvenli mi?",
        a: "Fırlatmalar açık sahada, eğitmen gözetiminde, kontrollü ateşleme ve güvenlik mesafesi protokolüyle yapılır. Motor seçimi yaş grubuna ve saha koşullarına göre belirlenir.",
      },
      {
        q: "Teknofest gibi yarışmalara hazırlık yapılıyor mu?",
        a: "Evet. Roketçilik modülü yarışma formatına uygun ilerler; takım çalışması, teknik rapor ve tasarım savunması sürecin parçasıdır.",
      },
      {
        q: "Roketi öğrenci mi tasarlıyor?",
        a: "Evet. Gövde oranları, kanatçık geometrisi ve kurtarma sistemi öğrencinin hesabıyla belirlenir; eğitmen doğrular ve güvenlik sınırlarını koyar.",
      },
    ],
    social:
      "Kendi hesabıyla tasarladığı roketi sahada fırlatan 11-16 yaş öğrenciler — Batman'da roketçilik ve itki eğitimi.",
  },
  {
    id: "yapay-zeka",
    cover: "/assets/egitim/yapay-zeka.webp",
    fx: "neural",
    answer:
      "Yapay zeka eğitimi, öğrencinin kendi veri setini toplayıp bir görüntü " +
      "sınıflandırma modeli eğitmesini, modelin neden yanıldığını yorumlamasını ve " +
      "önyargı (bias) kavramını fark etmesini hedefleyen uygulamalı bir programdır. " +
      "CEZERİ ROBOTECH Batman'da 9-16 yaş öğrencilere yapay zekayı sihir olarak " +
      "değil mühendislik olarak öğretir: model eğitilir, test edilir, hatası " +
      "açıklanır. Büyük dil modellerinin (LLM) nasıl çalıştığı da bu modülde " +
      "kavratılır.",
    keywords: [
      "Batman yapay zeka eğitimi",
      "çocuklar için yapay zeka kursu Batman",
      "AI eğitimi Güneydoğu",
      "makine öğrenmesi çocuk eğitimi",
      "LLM nedir çocuklara anlatım",
      "görüntü işleme eğitimi Batman",
      "Diyarbakır yapay zeka atölyesi",
      "Mardin AI kursu",
      "veri seti oluşturma eğitimi",
      "yapay zeka okuryazarlığı 9-16 yaş",
    ],
    faq: [
      {
        q: "Çocuklara yapay zeka nasıl öğretiliyor?",
        a: "Teoriyle değil, veriyle. Öğrenci kendi fotoğraflarından veri seti oluşturur, modeli eğitir ve modelin yanlış tahminlerini inceleyerek nedenini bulur. Kavram, sonucun kendisinden çıkar.",
      },
      {
        q: "Kodlama bilmeyen öğrenci yapay zeka modülüne katılabilir mi?",
        a: "Evet. 9 yaş grubunda görsel araçlarla başlanır; ileri seviyede Python'a geçilir. Kodlama modülü paralel ilerlediğinde geçiş daha hızlı olur.",
      },
      {
        q: "ChatGPT gibi dil modelleri anlatılıyor mu?",
        a: "Evet. Büyük dil modellerinin ne yaptığı, neden uydurabildiği ve nasıl doğrulanması gerektiği modülün okuryazarlık bölümündedir.",
      },
    ],
    social:
      "Batman'da 9-16 yaş öğrenciler kendi veri setini toplayıp yapay zeka modelini eğitiyor — sihir değil, mühendislik.",
  },
  {
    id: "robotik",
    cover: "/assets/egitim/robotik.webp",
    fx: "robot",
    answer:
      "Robotik ve otonom sistemler eğitimi, sensör okuma, motor sürme ve karar " +
      "verme döngüsünü kurarak kendi kendine hareket eden bir robot üretmeyi " +
      "öğretir. CEZERİ ROBOTECH Batman'da öğrenciler çizgi izleyen, engelden " +
      "kaçan ve görev tamamlayan robotlarını monte eder, kodlar ve sahada test " +
      "eder. Robotik kodlama, kurumun çekirdek disiplinidir.",
    keywords: [
      "Batman robotik kodlama kursu",
      "Batman robotik eğitimi",
      "çocuklar için robotik kodlama",
      "Diyarbakır robotik kurs",
      "Siirt robotik kodlama eğitimi",
      "Bitlis robotik atölyesi",
      "çizgi izleyen robot eğitimi",
      "otonom robot yapımı çocuk",
      "Arduino robotik eğitimi Batman",
      "sensör motor döngüsü eğitimi",
    ],
    faq: [
      {
        q: "Robotik kodlama kaç yaşında başlar?",
        a: "6 yaşta blok tabanlı görsel programlama ile başlar; 9 yaştan itibaren mikrodenetleyici ve gerçek sensörlerle devam eder.",
      },
      {
        q: "Öğrenci dönem sonunda ne götürüyor?",
        a: "Kendi monte ettiği ve kendi kodladığı, çalışan bir robot. Her hangar dönem sonunda çalışan bir çıktıyla kapanır.",
      },
      {
        q: "Robot malzemeleri veliye ek maliyet mi?",
        a: "Atölye malzemeleri eğitim kapsamındadır. Öğrencinin kendi projesini eve götürmek istediği durumlar için detayı WhatsApp'tan paylaşıyoruz.",
      },
    ],
    social:
      "Batman'da 6-16 yaş öğrenciler kendi robotunu monte ediyor, kodluyor ve çalıştırıyor.",
  },
  {
    id: "3d-tasarim",
    cover: "/assets/egitim/3d-tasarim.webp",
    fx: "print",
    answer:
      "3D tasarım ve eklemeli üretim eğitimi, bilgisayarda modellenen bir parçanın " +
      "dilimlenerek 3D yazıcıda fiziksel nesneye dönüşmesini baştan sona öğretir. " +
      "CEZERİ ROBOTECH Batman'da öğrenciler ölçülü parça tasarlar, dilimleme " +
      "ayarlarını kendi yapar ve bastığı parçayı kendi drone'unda veya robotunda " +
      "kullanır — tasarım ile üretim arasındaki bağ böyle kurulur.",
    keywords: [
      "Batman 3D tasarım kursu",
      "Batman 3D yazıcı eğitimi",
      "çocuklar için 3D modelleme",
      "eklemeli üretim eğitimi Güneydoğu",
      "Diyarbakır 3D baskı atölyesi",
      "Mardin 3D tasarım kursu",
      "Tinkercad Fusion eğitimi çocuk",
      "3D yazıcı dilimleme eğitimi",
      "parça tasarımı ve üretimi eğitimi",
      "prototipleme atölyesi Batman",
    ],
    faq: [
      {
        q: "3D tasarım için bilgisayar bilgisi gerekiyor mu?",
        a: "Temel bilgisayar kullanımı yeterli. Modelleme, yaş grubuna uygun araçlarla sıfırdan öğretilir.",
      },
      {
        q: "Basılan parçalar nerede kullanılıyor?",
        a: "Öğrencinin kendi projesinde. Drone gövde parçası, robot şasisi veya sensör tutucu olarak basılan parça doğrudan çalışan sisteme takılır.",
      },
    ],
    social:
      "Tasarladığını basan, bastığını kullanan öğrenciler — Batman'da 3D tasarım ve eklemeli üretim eğitimi.",
  },
  {
    id: "kodlama",
    cover: "/assets/egitim/kodlama.webp",
    fx: "code",
    answer:
      "Yazılım ve algoritma eğitimi, blok tabanlı görsel programlamadan metin " +
      "tabanlı kodlamaya kademeli geçişi sağlayan bir patikadır. CEZERİ ROBOTECH " +
      "Batman'da 6 yaşta Scratch benzeri araçlarla başlayan öğrenci, yaş " +
      "ilerledikçe Python'a ve gömülü sistemlerde C'ye geçer. Amaç dil öğretmek " +
      "değil, algoritmik düşünmeyi yerleştirmektir.",
    keywords: [
      "Batman kodlama kursu",
      "Batman çocuk yazılım eğitimi",
      "Python eğitimi çocuklar Batman",
      "Scratch blok kodlama Batman",
      "Diyarbakır çocuk kodlama kursu",
      "Siirt yazılım eğitimi",
      "algoritma eğitimi 6-16 yaş",
      "gömülü sistem C eğitimi çocuk",
      "kodlama patikası yaş gruplarına göre",
      "Güneydoğu yazılım atölyesi",
    ],
    faq: [
      {
        q: "Hangi programlama dili öğretiliyor?",
        a: "Yaşa göre değişir: 6-8 yaş blok tabanlı görsel araçlar, 9-12 yaş Python temelleri, 13-16 yaş Python ileri seviye ve gömülü sistemlerde C.",
      },
      {
        q: "Kodlama dersi için evde bilgisayar şart mı?",
        a: "Hayır. Atölyede her öğrenciye çalışma istasyonu ayrılır; evde tekrar isteyen için ödev yapısı esnektir.",
      },
    ],
    social:
      "Blok tabanlıdan Python'a: Batman'da 6-16 yaş için kademeli yazılım ve algoritma patikası.",
  },
  {
    id: "elektronik",
    cover: "/assets/egitim/elektronik.webp",
    fx: "circuit",
    answer:
      "Elektronik ve mekatronik eğitimi, devre şeması okumayı, breadboard üzerinde " +
      "prototip kurmayı, güvenli lehimlemeyi ve mekanik aktarma organlarını " +
      "elektronikle birleştirmeyi öğretir. CEZERİ ROBOTECH Batman'da öğrenciler " +
      "kendi devresini kurar, ölçer ve hatasını multimetreyle kendisi bulur.",
    keywords: [
      "Batman elektronik eğitimi",
      "çocuklar için lehimleme kursu",
      "mekatronik eğitimi Batman",
      "devre şeması okuma eğitimi",
      "Arduino elektronik atölyesi Batman",
      "Diyarbakır mekatronik kursu",
      "breadboard prototip eğitimi",
      "sensör devresi kurma eğitimi",
      "multimetre kullanımı eğitimi çocuk",
      "Güneydoğu elektronik atölyesi",
    ],
    faq: [
      {
        q: "Lehim çocuklar için güvenli mi?",
        a: "Lehimleme 9 yaş ve üzeri gruplarda, havalandırmalı istasyonda, koruyucu ekipmanla ve eğitmen gözetiminde yapılır.",
      },
      {
        q: "Elektronik modülü robotikten ayrı mı?",
        a: "Ayrı modüldür ama birbirini besler. Robotikte kullanılan devreyi anlamak için elektronik, elektronikte kurulan devreyi çalıştırmak için robotik gerekir.",
      },
    ],
    social:
      "Devreyi kuran, ölçen ve hatasını kendi bulan öğrenciler — Batman'da elektronik ve mekatronik eğitimi.",
  },
  {
    id: "siber-guvenlik",
    cover: "/assets/egitim/siber-guvenlik.webp",
    fx: "shield",
    answer:
      "Siber güvenlik farkındalığı eğitimi, dijital hijyen, güçlü parola ve " +
      "şifreleme mantığı, sosyal mühendislik taktiklerini tanıma ve güvenli ağ " +
      "davranışı üzerine kuruludur. CEZERİ ROBOTECH Batman'da amaç saldırı " +
      "öğretmek değil, savunma refleksi kazandırmaktır — çocuğun kendi hesabını, " +
      "verisini ve ailesini koruyabilmesi.",
    keywords: [
      "Batman siber güvenlik eğitimi",
      "çocuklar için siber güvenlik farkındalığı",
      "dijital güvenlik eğitimi Batman",
      "sosyal mühendislik farkındalık eğitimi",
      "güvenli internet kullanımı eğitimi çocuk",
      "Diyarbakır siber güvenlik kursu",
      "parola güvenliği eğitimi öğrenci",
      "veri gizliliği eğitimi 11-16 yaş",
      "oltalama saldırısı tanıma eğitimi",
      "Güneydoğu siber güvenlik atölyesi",
    ],
    faq: [
      {
        q: "Çocuklara hacking mi öğretiliyor?",
        a: "Hayır. Program savunma odaklıdır: saldırı tekniklerini tanıyıp korunmayı öğretir, uygulama yapmayı değil.",
      },
      {
        q: "Veliler için de bilgilendirme var mı?",
        a: "Dönem içinde velilere yönelik dijital güvenlik bilgilendirmesi yapılır; çocuğun güvenliği evde de sürmezse eğitim eksik kalır.",
      },
    ],
    social:
      "Saldırıyı tanıyan, kendini koruyan öğrenciler — Batman'da savunma odaklı siber güvenlik farkındalığı.",
  },
  {
    id: "uzay-havacilik",
    cover: "/assets/egitim/uzay-havacilik.webp",
    fx: "orbit",
    answer:
      "Uzay ve havacılık bilimleri eğitimi, yörünge mantığını, uydu görevlerini, " +
      "atmosfer katmanlarını ve uçuş fiziğini model ve deneyle kavratır. CEZERİ " +
      "ROBOTECH Batman'da öğrenciler uydu görev senaryosu kurar, haberleşme " +
      "kısıtlarını hesaplar ve havacılığın neden bir mühendislik disiplini " +
      "olduğunu somut örneklerle görür.",
    keywords: [
      "Batman uzay bilimleri eğitimi",
      "havacılık eğitimi çocuklar Batman",
      "uydu eğitimi öğrenci",
      "yörünge mekaniği çocuk anlatımı",
      "Diyarbakır uzay atölyesi",
      "Van havacılık eğitimi",
      "model uydu Cansat eğitimi",
      "atmosfer ve uçuş fiziği eğitimi",
      "uzay teknolojileri farkındalık eğitimi",
      "Güneydoğu havacılık atölyesi",
    ],
    faq: [
      {
        q: "Uzay modülü teorik mi?",
        a: "Hayır. Yörünge ve haberleşme kavramları model uydu ve fırlatma senaryolarıyla, ölçülebilir deneylerle işlenir.",
      },
      {
        q: "Roketçilikten farkı ne?",
        a: "Roketçilik aracı yukarı çıkarmayı, uzay-havacılık modülü yukarıda ne olduğunu ve görevin nasıl planlandığını çalışır. İkisi birbirini tamamlar.",
      },
    ],
    social:
      "Yörüngeyi, uyduyu ve uçuş fiziğini deneyle öğrenen öğrenciler — Batman'da uzay ve havacılık bilimleri.",
  },
  {
    id: "girisimcilik",
    cover: "/assets/egitim/girisimcilik.webp",
    fx: "growth",
    answer:
      "Teknoloji girişimciliği eğitimi, öğrencinin ürettiği teknik çıktıyı bir " +
      "probleme, kullanıcıya ve sunuma bağlamasını öğretir. CEZERİ ROBOTECH " +
      "Batman'da öğrenciler problem tanımı yapar, çözüm önerir, prototipini " +
      "sunar ve teknik fikrini anlatmayı öğrenir — mühendisliğin anlatılamayan " +
      "kısmı eksik kalır.",
    keywords: [
      "Batman teknoloji girişimciliği eğitimi",
      "çocuklar için girişimcilik kursu",
      "öğrenci proje sunumu eğitimi",
      "fikirden prototipe eğitim programı",
      "Diyarbakır girişimcilik atölyesi",
      "Teknofest proje hazırlık Batman",
      "problem tanımı ve çözüm eğitimi",
      "pitch sunum eğitimi öğrenci",
      "genç girişimci programı Güneydoğu",
      "STEM girişimcilik eğitimi 11-16 yaş",
    ],
    faq: [
      {
        q: "Girişimcilik modülü ticaret mi öğretiyor?",
        a: "Hayır. Odak, teknik bir çıktıyı gerçek bir probleme bağlamak ve anlaşılır biçimde sunmaktır. Ticari kurgu yaş grubunun konusu değildir.",
      },
      {
        q: "Sunumlar nerede yapılıyor?",
        a: "Dönem sonu atölye sunumlarında ve katıldığımız etkinliklerde. AVM tanıtım standımızdaki sunumlar bu modülün çıktısıdır.",
      },
    ],
    social:
      "Ürettiğini bir probleme bağlayan ve anlatabilen öğrenciler — Batman'da teknoloji girişimciliği.",
  },
] as const;

/** Kategori kimliğinden SEO kaydına hızlı erişim. */
export const trainingSeoById = new Map(trainingSeo.map((t) => [t.id, t]));

/**
 * Coğrafya cümlesi — kategori metinlerinin altında görünür ve
 * `areaServed` şemasıyla birebir aynı listeyi anlatır.
 */
export const serviceAreaSentence =
  "Batman merkez (İluh) ve Beşiri, Gercüş, Hasankeyf, Kozluk, Sason ilçelerinin yanı sıra " +
  "Diyarbakır (Amed), Silvan, Bismil, Ergani, Çınar, Kulp, Hani ile Mardin, Siirt, Bitlis, " +
  "Van ve Bingöl'den gelen öğrencilere hizmet veriyoruz.";
