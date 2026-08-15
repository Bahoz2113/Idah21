// ══════════════════════════════════════════════════════════════════
// CEZERİ ROBOTECH — TANITIM SİTESİ TEK GERÇEK KAYNAĞI
//
// Bu dosyadaki veri HEM görünür DOM'a HEM JSON-LD schema'ya beslenir.
// Google ve AI motorları, structured data ile sayfada görünen içeriğin
// birbirini tutmasını bekler; iki yerde ayrı ayrı yazılırsa uyumsuzluk
// cezası alınır. Bu yüzden içerik DEĞİŞİKLİĞİ SADECE BURADA yapılır.
// ══════════════════════════════════════════════════════════════════

/**
 * Kanonik site kökü.
 *
 * Öncelik sırası:
 *   1. NEXT_PUBLIC_SITE_URL — elle tanımlanan gerçek domain (production)
 *   2. VERCEL_URL — deployment'ın kendi adresi (preview)
 *   3. Sabit varsayılan
 *
 * (2) neden var: preview deployment'ta (1) tanımlı olmayabilir. O durumda
 * schema'daki 31 düğümün medya adresleri ve canonical, henüz yayında olmayan
 * bir domaini gösterir — preview'da hiçbir görsel/video URL'i çözülmez ve
 * structured data test araçları kırık çıkar. VERCEL_URL kullanmak preview'u
 * kendi içinde tutarlı kılar; Vercel preview'lara zaten `noindex` verdiği
 * için arama motoru tarafında bir risk oluşmaz.
 */
function resolveSiteUrlDefault(): string {
  return "https://cezerirobotech.com";
}

function resolveSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/$/, "");

  // VERCEL_URL yedeği YALNIZCA preview içindir. Production derlemesinde de
  // bu değişken tanımlıdır ve yedek oradan devreye girince robots.txt'nin
  // Host/Sitemap satırları geçici deployment adresini gösterdi (ölçüldü:
  // canlı robots.txt Google'ı idah21-*.vercel.app'e yönlendiriyordu — SEO
  // için zehir). Production'da kanonik domain sabittir; ortam değişkenine
  // bakılmaz.
  if (process.env.VERCEL_ENV === "production") return resolveSiteUrlDefault();

  const vercelHost = process.env.NEXT_PUBLIC_VERCEL_URL ?? process.env.VERCEL_URL;
  if (vercelHost) return `https://${vercelHost.replace(/\/$/, "")}`;

  return resolveSiteUrlDefault();
}

export const SITE_URL = resolveSiteUrl();

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
// İLETİŞİM KANALLARI
//
// Ziyaretçi bu kanallara tek dokunuşla ulaşır. `sameAs` alanına giren
// Instagram profili aynı zamanda bir SEO varlık sinyalidir: arama motorları
// kurumun sosyal profilini schema üzerinden doğrulayınca bilgi panelini
// (Knowledge Panel) daha güvenle oluşturur.
// ──────────────────────────────────────────────────────────────────

export const channels = {
  instagram: {
    handle: "@cezerirobotech",
    url: "https://www.instagram.com/cezerirobotech/",
    label: "Instagram",
    hint: "Atölye kareleri, proje paylaşımları ve duyurular",
  },
  whatsapp: {
    // wa.me formatı ülke kodu dahil, işaret ve boşluksuz numara ister.
    url: `https://wa.me/${contact.phoneE164.replace(/\D/g, "")}`,
    label: "WhatsApp",
    hint: "Kayıt, ders programı ve fiyat bilgisi için anında yazın",
  },
  maps: {
    url: contact.mapsPlaceUrl,
    label: "Google Maps",
    hint: "Belde Mahallesi'ndeki üssümüze yol tarifi alın",
  },
} as const;

/** Schema.org `sameAs` — kurumun doğrulanabilir dış profilleri. */
export const sameAs: readonly string[] = [channels.instagram.url];

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
    a: "Başlangıç için CEZERİ ROBOTECH'in ücretsiz tanışma atölyesine katılabilirsiniz. Öğrencinin yaşı ve ilgi alanı belirlendikten sonra uygun hangar patikası önerilir. Kayıt için 0540 662 72 72 numarasını arayabilir, aynı numaradan WhatsApp ile yazabilir veya Instagram'dan @cezerirobotech hesabına mesaj gönderebilirsiniz.",
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
    a: "Dersler haftalık düzende, okul saatleri dışına ve hafta sonuna planlanır. Her hangar modülü dönemlik ilerler ve dönem sonunda öğrenci kendi projesini teslim eder. Güncel gün ve saat seçenekleri için 0540 662 72 72 numarasından WhatsApp ile bilgi alabilirsiniz.",
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
  { id: "esik", label: "Üs" },
  { id: "egitimler", label: "Eğitimlerimiz" },
  { id: "mufredat", label: "Müfredatımız" },
  { id: "atolye", label: "Atölye" },
  { id: "biz-kimiz", label: "Biz Kimiz" },
  { id: "basin", label: "Basında Biz" },
  { id: "sss", label: "SSS" },
  { id: "kayit", label: "Online Kayıt" },
  { id: "iletisim", label: "İletişim" },
] as const;

/**
 * BASINDA BİZ.
 *
 * Yayınlanan haber, röportaj ve etkinlik bağlantıları. Üçüncü taraf
 * doğrulaması olduğu için hem ziyaretçi güveni hem arama motorları
 * açısından kurumun kendi anlattığından farklı bir ağırlık taşır.
 *
 * Bağlantılar geldikçe buraya eklenir; uydurma kayıt girilmez.
 */
export type PressItem = {
  outlet: string;
  title: string;
  url: string;
  /** ISO 8601 (YYYY-MM-DD). Bilinmiyorsa boş bırakılır — uydurulmaz. */
  date?: string;
  summary?: string;
  /** Haberin video kaydı (Instagram reel vb.). */
  video?: string;
  /** Haber sitesi mi, sosyal medya paylaşımı mı — listede ayrışsın diye. */
  kind: "haber" | "sosyal";
  /** Başlığın nereden geldiği: bağımsız arama sonucu mu, URL kısa adı mı. */
  source: "arama" | "slug";
  /**
   * Karta eşlik eden görsel.
   *
   * DİKKAT: bu, haberin KENDİ fotoğrafı değil — yayınların görselleri bize
   * ait değil ve bu ortamdan indirilemiyor. Buraya kendi arşiv fotoğrafımız
   * konur ve kartta "CEZERİ ROBOTECH arşivi" olarak kredilendirilir;
   * gazetecilikteki "dosya fotoğrafı" ne ise odur. Bu yüzden şemadaki
   * NewsArticle düğümüne `image` olarak YAZILMAZ.
   */
  image?: string;
  imageAlt?: string;
  imageWidth?: number;
  imageHeight?: number;
};

/**
 * BASIN KAYITLARI.
 *
 * Kaynak sayfaların hiçbiri bu ortamdan okunamıyor (tüm haber alan adları
 * egress politikasıyla kapalı), bu yüzden her kaydın doğrulanma derecesi
 * `source` alanında açıkça durur:
 *
 *   "arama"  → başlık bağımsız bir arama sonucunun başlığıyla birebir
 *              eşleşti; yayının kendi başlığı olduğu teyitli sayılır.
 *   "slug"   → başlık yalnızca URL kısa adından çözüldü; yayındaki tam
 *              başlıkla küçük farklar olabilir.
 *
 * Tarihler BOŞ. Aramada bazı olayların yılı geçiyor ama hiçbiri bu
 * URL'lerin kendi yayın tarihi olarak doğrulanamadı; yanlış bir
 * `datePublished` yapılandırılmış veriye yazmak, hiç yazmamaktan kötüdür.
 */
/**
 * SIRA GÖRÜNÜRLÜK SIRASIDIR. Ana ekranda ilk ÜÇ haber kartı görünür,
 * gerisi "tümünü gör" ile açılır (bkz. `PressSection`). İlk üç kasıtlı
 * seçildi: iki milletvekili ziyareti ve valinin katıldığı yarışma —
 * kurumu bir okurun gözünde en hızlı doğrulayan üç kayıt.
 */
export const press: readonly PressItem[] = [
  {
    outlet: "Batman Tarafsız",
    title: "Nasıroğlu robotik kodlama atölyesini ziyaret etti",
    url: "https://www.batmantarafsiz.com/nasiroglu-robotik-kodlama-atolyesini-ziyaret-etti/",
    summary:
      "AK Parti Batman Milletvekili Ferhat Nasıroğlu robotik kodlama atölyesini gezerek öğrencilerin projelerini inceledi.",
    // Bu kart artık DOSYA FOTOĞRAFI taşımıyor: kare ziyaretin kendisinden.
    // Öncesinde ilgisiz bir ders fotoğrafı duruyordu ve kredi "arşiv" diyordu;
    // haberin konusu bu ziyaretken okura yanlış bir kare göstermek gereksizdi.
    image: "/assets/real-media/ziyaret-nasiroglu-vitrin-01.webp",
    imageAlt:
      "Batman Milletvekili Ferhat Nasıroğlu CEZERİ ROBOTECH atölyesinde öğrenci projelerinin sergilendiği vitrini inceliyor",
    imageWidth: 1400,
    imageHeight: 933,
    kind: "haber",
    source: "slug",
  },
  {
    outlet: "Batman Demokrat Haber",
    title:
      "Serkan Ramanlı'dan Cezeri Robotech'e ziyaret: \"Geleceği inşa eden gençlerimizin yanındayız\"",
    url: "https://batmandemokrathaber.com/serkan-ramanlidan-cezeri-roboteche-ziyaret-gelecegi-insa-eden-genclerimizin-yanindayiz/",
    summary:
      "Batman Milletvekili Serkan Ramanlı atölyeyi ziyaret etti ve gençlerin teknoloji çalışmalarına destek mesajı verdi.",
    image: "/assets/real-media/ziyaret-ramanli-kit-01.webp",
    imageAlt:
      "Batman Milletvekili Serkan Ramanlı, CEZERİ ROBOTECH atölyesinde eğitmenden robotik eğitim setini teslim alıyor",
    imageWidth: 1400,
    imageHeight: 1050,
    kind: "haber",
    source: "slug",
  },
  {
    outlet: "Batman Tarafsız",
    title: "YEDİİKİ Robot ve Teknoloji Yarışması başladı",
    url: "https://www.batmantarafsiz.com/yediiki-robot-ve-teknoloji-yarismasi-basladi/",
    summary:
      "Batman Valiliği himayesinde düzenlenen YEDİİKİ Robot ve Teknoloji Yarışması'nın açılışı; Batman Valisi Ekrem Canalp proje standlarını gezdi.",
    video: "https://www.instagram.com/reel/DXuKouMCHNG/",
    image: "/assets/real-media/etkinlik-yediiki-vali-01.webp",
    imageAlt:
      "Batman Valisi Ekrem Canalp, YEDİİKİ Robot ve Teknoloji Yarışması'nda CEZERİ ROBOTECH öğrencilerinin model uçağını inceliyor",
    imageWidth: 1366,
    imageHeight: 910,
    kind: "haber",
    source: "slug",
  },
  {
    outlet: "Batman Son Söz",
    title: "Esnaf Odası Robotech'le anlaştı",
    url: "https://www.batmansonsoz.net/mobil/haber/esnaf-odasi-robotech-le-anlasti-90483.html",
    summary:
      "Batman Esnaf ve Sanatkârlar Odası ile imzalanan protokol kapsamında oda üyeleri ve çocukları teknoloji eğitimlerinden indirimli yararlanıyor.",
    image: "/assets/real-media/protokol-esnaf-odasi-01.webp",
    imageAlt:
      "CEZERİ ROBOTECH ile Batman Esnaf ve Sanatkârlar Odası arasındaki teknoloji eğitimi protokolünün imza anı",
    imageWidth: 1080,
    imageHeight: 813,
    kind: "haber",
    source: "slug",
  },
  {
    outlet: "Batman Rehber Gazetesi",
    title: "Dijital dolandırıcılık her geçen gün artıyor",
    url: "https://batmanrehbergazetesi.com/dijital-dolandiricilik-her-gecen-gun-artiyor",
    summary:
      "Kart bilgisi hırsızlığı, SMS tuzakları ve yapay zeka destekli dolandırıcılık yöntemlerine karşı farkındalık uyarısı. Siber güvenlik farkındalığı, atölyedeki on eğitim başlığından biri.",
    image: "/assets/real-media/roportaj-siber-guvenlik-01.webp",
    imageAlt:
      "CEZERİ ROBOTECH bilişim uzmanı, siber suçlar ve dijital dolandırıcılık konusunda basına açıklama yaparken",
    imageWidth: 828,
    imageHeight: 620,
    kind: "haber",
    source: "arama",
  },
  {
    outlet: "X · Ferhat Nasıroğlu",
    title: "Atölye ziyareti paylaşımı",
    url: "https://x.com/fnasiroglu/status/1961125439042191731",
    summary: "Milletvekilinin atölye ziyaretine dair X paylaşımı.",
    kind: "sosyal",
    source: "slug",
  },
  {
    outlet: "Instagram",
    title: "YEDİİKİ Robot ve Teknoloji Yarışması — video",
    url: "https://www.instagram.com/reel/DXuKouMCHNG/",
    summary: "Yarışma açılışından Instagram reel kaydı.",
    kind: "sosyal",
    source: "slug",
  },
  {
    outlet: "Instagram",
    title: "Atölye paylaşımı",
    url: "https://www.instagram.com/p/DN6GDDziCRZ/",
    kind: "sosyal",
    source: "slug",
  },
  {
    outlet: "Instagram",
    title: "Atölye paylaşımı",
    url: "https://www.instagram.com/p/DJ_4QJNILUr/",
    kind: "sosyal",
    source: "slug",
  },
] as const;
