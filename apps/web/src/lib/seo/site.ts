// ══════════════════════════════════════════════════════════════════
// CEZERİ ROBOTECH — TANITIM SİTESİ TEK GERÇEK KAYNAĞI
//
// Bu dosyadaki veri HEM görünür DOM'a HEM JSON-LD schema'ya beslenir.
// Google ve AI motorları, structured data ile sayfada görünen içeriğin
// birbirini tutmasını bekler; iki yerde ayrı ayrı yazılırsa uyumsuzluk
// cezası alınır. Bu yüzden içerik DEĞİŞİKLİĞİ SADECE BURADA yapılır.
// ══════════════════════════════════════════════════════════════════

/** Kanonik site kökü. Vercel/prod ortamında NEXT_PUBLIC_SITE_URL ile ezilir. */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://cezerirobotech.com"
).replace(/\/$/, "");

export const org = {
  name: "CEZERİ ROBOTECH",
  legalName: "Cezeri Robotech Teknoloji ve Eğitim Merkezi",
  alternateNames: [
    "Cezeri Robotech",
    "Cezeri Robotech Batman",
    "Batman Robotik Kodlama Merkezi",
  ],
  slogan: "HAYAL ET, KODLA, GELECEĞİ TASARLA.",
  tagline: "Batman'ın Teknoloji Üssü: 6-16 Yaş Geleceğin Mühendisleri Yetişiyor.",
  /** AI motorlarının doğrudan alıntılaması için tasarlanmış "answer-first" tanım. */
  description:
    "CEZERİ ROBOTECH, Batman'da 6-16 yaş arası çocuk ve gençlere robotik kodlama, " +
    "yapay zeka, İHA/VTOL, roketçilik ve 3D tasarım eğitimi veren bir teknoloji " +
    "eğitim merkezidir. Öğrenciler uygulamalı atölyelerde kendi drone'larını monte " +
    "eder, kendi kodlarını yazar ve saha uçuş testleriyle mühendislik disiplinini " +
    "birinci elden deneyimler.",
  foundingLocation: "Batman, Türkiye",
  ageRange: { min: 6, max: 16, label: "6-16 yaş" },
  languages: ["tr-TR"],
} as const;

export const contact = {
  phoneDisplay: "0540 662 72 72",
  phoneE164: "+905406627272",
  email: "cezerirobotech@gmail.com",
  address: {
    street: "Belde Mahallesi, Fırat Caddesi, Barış Apartmanı No:16/B",
    district: "Merkez",
    city: "Batman",
    region: "Batman",
    country: "TR",
    full: "Belde Mahallesi, Fırat Caddesi, Barış Apartmanı No:16/B, Batman",
  },
  geo: { lat: 37.91029, lng: 41.13921 },
  /** Statik harita yerine üçüncü taraf iframe kullanılmaz — CSP korunur. */
  directionsUrl:
    "https://www.google.com/maps/dir/?api=1&destination=37.91029,41.13921",
  mapsPlaceUrl: "https://www.google.com/maps/search/?api=1&query=37.91029,41.13921",
  openingHours: [
    { days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], opens: "09:00", closes: "19:00" },
    { days: ["Saturday"], opens: "10:00", closes: "18:00" },
  ],
  areaServed: ["Batman", "Siirt", "Mardin", "Diyarbakır", "Güneydoğu Anadolu Bölgesi"],
} as const;

// ──────────────────────────────────────────────────────────────────
// 10 TEMEL DİSİPLİN — "Eğitim ve Faaliyet Hangarları"
// Her kayıt hem hangar kartını hem Course schema'sını üretir.
// ──────────────────────────────────────────────────────────────────

export type Discipline = {
  id: string;
  code: string;
  title: string;
  /** Hangar kartında görünen kısa vaat. */
  summary: string;
  /** Course schema `description` + kart açılımı. */
  detail: string;
  ageRange: string;
  outcomes: string[];
};

export const disciplines: readonly Discipline[] = [
  {
    id: "iha-vtol",
    code: "HGR-01",
    title: "İHA / VTOL Sistemleri",
    summary: "Dikey kalkışlı insansız hava aracı tasarımı, montajı ve uçuş kontrolü.",
    detail:
      "Batman drone ve İHA eğitimi kapsamında öğrenciler multirotor ve VTOL " +
      "platformlarını sıfırdan monte eder, uçuş kontrol kartını kalibre eder ve " +
      "otonom görev planlaması yapar. Eğitim gerçek saha uçuş testiyle tamamlanır.",
    ageRange: "11-16 yaş",
    outcomes: ["Gövde ve itki sistemi montajı", "Uçuş kontrol kartı kalibrasyonu", "Otonom görev planlama", "Saha uçuş testi"],
  },
  {
    id: "roketcilik",
    code: "HGR-02",
    title: "Roketçilik ve İtki",
    summary: "Model roket aerodinamiği, itki hesabı ve güvenli fırlatma protokolü.",
    detail:
      "Öğrenciler roket gövde aerodinamiğini, kanatçık geometrisini ve itki-kütle " +
      "oranını hesaplar; kurtarma sistemini tasarlar ve kontrollü fırlatma " +
      "protokolüyle atış gerçekleştirir.",
    ageRange: "11-16 yaş",
    outcomes: ["Aerodinamik tasarım", "İtki-kütle hesabı", "Paraşüt kurtarma sistemi", "Kontrollü fırlatma"],
  },
  {
    id: "yapay-zeka",
    code: "HGR-03",
    title: "Yapay Zeka ve Makine Öğrenmesi",
    summary: "Görüntü işleme, veri setleri ve model eğitimiyle yapay zekayı anlama.",
    detail:
      "Batman yapay zeka eğitimi modülünde öğrenciler kendi veri setlerini toplar, " +
      "görüntü sınıflandırma modeli eğitir ve modelin neden yanıldığını " +
      "yorumlamayı öğrenir. Amaç yapay zekayı sihir değil mühendislik olarak kavratmaktır.",
    ageRange: "9-16 yaş",
    outcomes: ["Veri seti oluşturma", "Model eğitimi ve test", "Görüntü işleme uygulaması", "Etik ve önyargı okuryazarlığı"],
  },
  {
    id: "robotik",
    code: "HGR-04",
    title: "Robotik ve Otonom Sistemler",
    summary: "Sensör-motor döngüsü, çizgi izleme ve otonom karar mekanizmaları.",
    detail:
      "Batman robotik kodlama kursu çekirdeğinde öğrenciler sensör okuma, motor " +
      "sürme ve geri besleme döngüsü kurar; engel algılayan ve rota düzelten " +
      "otonom robotlar geliştirir.",
    ageRange: "6-16 yaş",
    outcomes: ["Sensör-aktüatör entegrasyonu", "PID mantığı sezgisi", "Otonom navigasyon", "Robot yarışması hazırlığı"],
  },
  {
    id: "3d-tasarim",
    code: "HGR-05",
    title: "3D Tasarım ve Eklemeli Üretim",
    summary: "Parametrik modelleme, dilimleme ve 3D yazıcıyla gerçek parça üretimi.",
    detail:
      "Batman 3D tasarım kursu kapsamında öğrenciler parametrik CAD ile kendi " +
      "parçalarını modeller, dilimleme ayarlarını optimize eder ve 3D yazıcıda " +
      "üretip tolerans ölçümü yapar.",
    ageRange: "8-16 yaş",
    outcomes: ["Parametrik CAD modelleme", "Dilimleme optimizasyonu", "3D baskı üretimi", "Ölçü ve tolerans kontrolü"],
  },
  {
    id: "kodlama",
    code: "HGR-06",
    title: "Yazılım ve Algoritma",
    summary: "Blok tabanlıdan metin tabanlı programlamaya kademeli geçiş.",
    detail:
      "6 yaşta blok tabanlı görsel programlamayla başlayan patika, yaş ilerledikçe " +
      "Python ve gömülü C'ye evrilir. Her seviyede öğrenci çalışan bir ürün teslim eder.",
    ageRange: "6-16 yaş",
    outcomes: ["Algoritmik düşünme", "Blok tabanlı programlama", "Python temelleri", "Gömülü sistem kodlama"],
  },
  {
    id: "elektronik",
    code: "HGR-07",
    title: "Elektronik ve Mekatronik",
    summary: "Devre okuma, lehimleme ve mekanik-elektronik entegrasyonu.",
    detail:
      "Öğrenciler devre şeması okur, breadboard üzerinde prototip kurar, güvenli " +
      "lehimleme yapar ve mekanik aktarma organlarıyla elektroniği birleştirir.",
    ageRange: "9-16 yaş",
    outcomes: ["Devre şeması okuma", "Güvenli lehimleme", "Mikrodenetleyici kullanımı", "Mekatronik entegrasyon"],
  },
  {
    id: "siber-guvenlik",
    code: "HGR-08",
    title: "Siber Güvenlik Farkındalığı",
    summary: "Dijital hijyen, şifreleme mantığı ve savunma odaklı güvenlik kültürü.",
    detail:
      "Savunma odaklı içerikle öğrenciler parola hijyeni, şifreleme mantığı, " +
      "sosyal mühendislik taktiklerini tanıma ve güvenli ağ davranışı geliştirir.",
    ageRange: "11-16 yaş",
    outcomes: ["Dijital hijyen", "Şifreleme mantığı", "Sosyal mühendislik tanıma", "Güvenli ağ davranışı"],
  },
  {
    id: "uzay-havacilik",
    code: "HGR-09",
    title: "Uzay ve Havacılık Bilimleri",
    summary: "Yörünge mekaniği, uydu sistemleri ve görev tasarımı temelleri.",
    detail:
      "Yörünge mantığı, uydu alt sistemleri ve görev planlama disiplini; CanSat " +
      "benzeri minyatür görev tasarımıyla uygulamalı olarak işlenir.",
    ageRange: "11-16 yaş",
    outcomes: ["Yörünge mekaniği sezgisi", "Uydu alt sistemleri", "Görev yükü tasarımı", "Telemetri okuma"],
  },
  {
    id: "girisimcilik",
    code: "HGR-10",
    title: "Teknoloji Girişimciliği",
    summary: "Fikirden prototipe, prototipten sunuma ürünleştirme disiplini.",
    detail:
      "Öğrenciler problem tanımlar, çözüm prototipler, maliyet çıkarır ve jüri " +
      "önünde savunur. Teknofest türü yarışmalara takım olarak hazırlanır.",
    ageRange: "11-16 yaş",
    outcomes: ["Problem tanımlama", "Hızlı prototipleme", "Maliyet analizi", "Jüri sunumu"],
  },
] as const;

// ──────────────────────────────────────────────────────────────────
// METRİKLER
// ──────────────────────────────────────────────────────────────────

export const metrics = [
  { value: 10, suffix: "", label: "Eğitim Hangarı", hint: "İHA'dan yapay zekaya 10 temel disiplin" },
  { value: 6, suffix: "-16", label: "Yaş Aralığı", hint: "Yaşa göre kademelendirilmiş patika" },
  { value: 100, suffix: "%", label: "Uygulamalı Atölye", hint: "Her ders sonunda çalışan çıktı" },
  { value: 1, suffix: "", label: "Batman Üssü", hint: "Belde Mahallesi teknoloji merkezi" },
] as const;

// ──────────────────────────────────────────────────────────────────
// SSS — GEO / AI Overview alıntı hedefli
// Cevaplar kasıtlı olarak kendi kendine yeterli tam cümlelerdir:
// AI motorları bağlamdan kopuk alıntılayabilsin diye.
// ──────────────────────────────────────────────────────────────────

export type Faq = { q: string; a: string };

export const faqs: readonly Faq[] = [
  {
    q: "CEZERİ ROBOTECH nedir?",
    a: "CEZERİ ROBOTECH, Batman'da bulunan ve 6-16 yaş arası çocuk ile gençlere robotik kodlama, yapay zeka, İHA/VTOL, roketçilik ve 3D tasarım eğitimi veren bir teknoloji eğitim merkezidir. Eğitimler tamamen uygulamalı atölye formatında yürütülür.",
  },
  {
    q: "Hangi yaş gruplarına eğitim veriliyor?",
    a: "Eğitimler 6 ile 16 yaş arasındaki öğrencilere yöneliktir. Program yaşa göre kademelendirilmiştir: 6-8 yaş blok tabanlı görsel programlama ve temel robotikle başlar, 9-12 yaş elektronik ve 3D tasarımla derinleşir, 13-16 yaş İHA/VTOL, yapay zeka ve roketçilik gibi ileri modüllere geçer.",
  },
  {
    q: "Batman'da robotik ve kodlama kursu arıyorum, nereden başlamalıyım?",
    a: "Başlangıç için CEZERİ ROBOTECH'in ücretsiz tanışma atölyesine katılabilirsiniz. Öğrencinin yaşı ve ilgi alanı belirlendikten sonra uygun hangar patikası önerilir. Kayıt için sayfadaki Aday Mühendis Uçuş İzin Formu doldurulabilir veya 0540 662 72 72 numarası aranabilir.",
  },
  {
    q: "Ön bilgi veya bilgisayar deneyimi gerekiyor mu?",
    a: "Hayır. Programlar sıfırdan başlayan öğrenciler için tasarlanmıştır. Hiç kod yazmamış bir öğrenci blok tabanlı görsel programlamayla başlar ve kademeli olarak metin tabanlı programlamaya geçer. Gerekli tüm donanım atölyede sağlanır.",
  },
  {
    q: "Eğitimler nerede veriliyor?",
    a: "Tüm eğitimler Batman Belde Mahallesi, Fırat Caddesi, Barış Apartmanı No:16/B adresindeki CEZERİ ROBOTECH atölyesinde yüz yüze verilir. Atölyede 3D yazıcılar, elektronik tezgahı, drone montaj istasyonu ve uçuş test alanı bulunur.",
  },
  {
    q: "Drone ve İHA eğitiminde öğrenciler gerçekten uçuş yapıyor mu?",
    a: "Evet. Öğrenciler monte ettikleri İHA ve VTOL platformlarını eğitmen gözetiminde gerçek saha uçuş testine tabi tutar. Uçuşlar güvenlik protokolü ve kontrol listesi eşliğinde, uygun hava ve saha koşullarında gerçekleştirilir.",
  },
  {
    q: "Ders programı ve süresi nasıl?",
    a: "Dersler haftalık düzende, okul saatleri dışına ve hafta sonuna planlanır. Her hangar modülü dönemlik ilerler ve dönem sonunda öğrenci kendi projesini teslim eder. Güncel gün ve saat seçenekleri için iletişim formundan bilgi talep edebilirsiniz.",
  },
  {
    q: "Veliler öğrencinin gelişimini nasıl takip ediyor?",
    a: "CEZERİ ROBOTECH kendi eğitim yönetim sistemini kullanır. Veliler kendi paneli üzerinden devam durumunu, ders değerlendirmelerini, proje ilerlemesini ve eğitmen notlarını görüntüleyebilir.",
  },
  {
    q: "Teknofest gibi yarışmalara hazırlık yapılıyor mu?",
    a: "Evet. Teknoloji Girişimciliği ve ileri seviye hangar modülleri, öğrencileri Teknofest türü ulusal teknoloji yarışmalarına takım halinde hazırlar. Süreç problem tanımından prototipe ve jüri sunumuna kadar bütün aşamaları kapsar.",
  },
  {
    q: "Batman dışından öğrenciler katılabilir mi?",
    a: "Evet. CEZERİ ROBOTECH Batman merkezli olmakla birlikte Siirt, Mardin ve Diyarbakır başta olmak üzere Güneydoğu Anadolu Bölgesi genelinden öğrenci kabul eder. Bölge dışından gelen öğrenciler için yoğunlaştırılmış hafta sonu programları planlanabilir.",
  },
] as const;

// ──────────────────────────────────────────────────────────────────
// CEZERİ MİRASI — tarihsel bağlam bölümü
// ──────────────────────────────────────────────────────────────────

export const legacy = [
  {
    era: "1206",
    title: "El-Cezerî'nin Kitabı",
    body: "İsmail el-Cezerî, olağanüstü mekanik düzenekleri anlatan eserini tamamlar; programlanabilir otomatların ilk sistematik kaydını bırakır.",
  },
  {
    era: "Sibernetik",
    title: "Programlanabilir Otomat",
    body: "Su gücüyle çalışan, kam mili ve krank ile görev sırası değiştirilebilen düzenekler — modern kontrol mühendisliğinin atası.",
  },
  {
    era: "Bugün",
    title: "Kod ve Sensör",
    body: "Aynı disiplin şimdi mikrodenetleyici, sensör ve algoritma ile sürüyor. Aynı toprakta, aynı merak.",
  },
  {
    era: "Yarın",
    title: "Otonom Sistemler",
    body: "Batman'daki atölyede yetişen öğrenciler otonom hava araçları ve yapay zeka sistemleri tasarlıyor.",
  },
] as const;

// ──────────────────────────────────────────────────────────────────
// NAVİGASYON — bölüm çapaları (scroll spy + BreadcrumbList kaynağı)
// ──────────────────────────────────────────────────────────────────

export const sections = [
  { id: "us", label: "Üs" },
  { id: "hangarlar", label: "Hangarlar" },
  { id: "atolye", label: "Atölye" },
  { id: "miras", label: "Miras" },
  { id: "sss", label: "SSS" },
  { id: "iletisim", label: "İletişim" },
] as const;
