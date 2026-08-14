/**
 * İÇERİK SÖZLÜĞÜ — TÜRKÇE (kaynak dil).
 *
 * Sayfanın ANLATISI burada durur: kurum tanımı, on disiplinin metinleri,
 * SSS, bölüm başlıkları, miras kayıtları, metrikler. Çerçeve dizeleri
 * (düğmeler, durum metinleri) ayrı dosyada — `lib/i18n/ui.ts`.
 *
 * BU DOSYA KAYNAKTIR. Diğer üç dil tipini buradan alır; buraya eklenen
 * bir alan öbürlerine eklenmezse derleme durur. Metin düzeltmesi önce
 * burada yapılır, sonra çevirilere yansıtılır.
 *
 * BAŞLIKLARIN ÜÇ PARÇASI. Bölüm başlıkları tasarımda iki renklidir:
 * bir kısmı beyaz, vurgulu kelime turuncu. JSX olarak yazılsalardı
 * çevrilemezlerdi. Bu yüzden üç düz metne bölündüler — `titleLead`,
 * `titleAccent`, `titleTail`. Vurgulanan parça her dilde aynı yerde
 * olmak zorunda değil; Arapçada cümlenin sonuna, Kürtçede ortasına
 * düşebilir. Kullanılmayan parça boş bırakılır.
 */

export const tr = {
  org: {
    slogan: "HAYAL ET, KODLA, GELECEĞİ TASARLA.",
    tagline: "Batman'ın Teknoloji Üssü: 6-16 Yaş Geleceğin Mühendisleri Yetişiyor.",
    description:
      "CEZERİ ROBOTECH, Batman'da 6-16 yaş arası çocuk ve gençlere robotik kodlama, " +
      "yapay zeka, İHA/VTOL, roketçilik ve 3D tasarım eğitimi veren bir teknoloji " +
      "eğitim merkezidir. Öğrenciler uygulamalı atölyelerde kendi drone'larını monte " +
      "eder, kendi kodlarını yazar ve saha uçuş testleriyle mühendislik disiplinini " +
      "birinci elden deneyimler.",
    legalName: "Cezeri Robotech Teknoloji ve Eğitim Merkezi",
    ageRangeLabel: "6-16 yaş",
    foundingLocation: "Batman, Türkiye",
  },

  intro: {
    index: "01 — Yaklaşımımız",
    titleLead: "Geleceği Tüketen Değil,",
    titleAccent: "Tasarlayan",
    titleTail: "Nesiller",
    body: "Öğrenciler burada yalnızca kod yazmayı veya bir robotu çalıştırmayı öğrenmez; düşünmeyi, tasarlamayı, denemeyi, hata yapmayı ve yeniden üretmeyi öğrenir.",
  },

  cta: {
    index: "09 — Davet",
    titleLead: "Geleceği",
    titleAccent: "Birlikte",
    titleTail: "Tasarlayalım",
    lead: "Çocuğunuzun teknoloji yolculuğunu doğru yaşta, doğru rehberlikle ve gerçek projelerle başlatın.",
  },

  metrics: [
    { label: "Eğitim Hangarı", hint: "İHA'dan yapay zekaya 10 temel disiplin" },
    { label: "Yaş Aralığı", hint: "Yaşa göre kademelendirilmiş patika" },
    { label: "Uygulamalı Atölye", hint: "Her ders sonunda çalışan çıktı" },
    { label: "Batman Üssü", hint: "Belde Mahallesi teknoloji merkezi" },
  ],

  legacy: [
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
  ],

  chapters: {
    egitimler: {
      eyebrow: "Eğitimlerimiz",
      titleLead: "On Eğitim, Tek Disiplin:",
      titleAccent: "Çalışan Bir Şey Üret.",
      titleTail: "",
      lead: "CEZERİ ROBOTECH'te eğitim on temel disipline ayrılmıştır: İHA/VTOL sistemleri, roketçilik, yapay zeka ve makine öğrenmesi, robotik kodlama, 3D tasarım ve eklemeli üretim, yazılım ve algoritma, elektronik ve mekatronik, siber güvenlik farkındalığı, uzay ve havacılık bilimleri, teknoloji girişimciliği. Her eğitim, öğrencinin dönem sonunda kendi eliyle ürettiği çalışan bir çıktıyla kapanır.",
    },
    mufredat: {
      eyebrow: "Müfredatımız",
      titleLead: "Hafta Hafta",
      titleAccent: "Ne Öğretiyoruz?",
      titleTail: "",
      lead: "CEZERİ ROBOTECH'te dört ayrı program yürütülür: blok tabanlı kodlama (ScratchJr'dan mBlock'a), temel elektrik ve enerji atölyesi, elektronik deney ve lehim atölyesi, Arduino ile robotik ve kodlama. Aşağıda her programın haftalık ders planı, kullanılan araçlar ve modül yapısı yer alıyor — ne öğrettiğimizi hafta hafta okuyabilirsiniz.",
    },
    atolye: {
      eyebrow: "Atölye ve Saha",
      titleLead: "Simülasyon Değil. Gerçek Atölye.",
      titleAccent: "",
      titleTail: "",
      lead: "Batman'daki atölyede öğrenciler 3D yazıcı çalıştırır, drone gövdesi monte eder, devre lehimler ve sahada gerçek uçuş testi yapar. Aşağıdaki kareler bu çalışmalardan alınmıştır; henüz kaydı olmayan disiplinler ise 'Konsept' etiketiyle işaretlendi. Öğrencilerin yüzleri gizliliğe saygı gereği bulanıklaştırılmıştır.",
    },
    miras: {
      eyebrow: "Cezerî Mirası",
      titleLead: "Sekiz Yüz Yıl Önce Burada",
      titleAccent: "Otomat",
      titleTail: "Vardı.",
      lead: "Kurumun adı, programlanabilir otomatların ilk sistematik kaydını bırakan İsmail el-Cezerî'den gelir. Bugün aynı disiplin mikrodenetleyici, sensör ve algoritmayla sürüyor.",
    },
    basin: {
      eyebrow: "Basında Biz",
      titleLead: "Bizi Başkaları Anlatınca",
      titleAccent: "",
      titleTail: "",
      lead: "Yerel ve ulusal basında çıkan haberler, röportajlar ve etkinlik kayıtları. Kurumun kendi anlattığı değil, üçüncü tarafın doğruladığı kayıt.",
    },
    sss: {
      eyebrow: "Sıkça Sorulan Sorular",
      titleLead: "Merak Edilenler",
      titleAccent: "",
      titleTail: "",
      lead: "Velilerin ve öğrencilerin en sık sorduğu sorular ve net yanıtları.",
    },
    iletisim: {
      eyebrow: "Üs Operasyonları",
      titleLead: "Üsse Bağlan",
      titleAccent: "",
      titleTail: "",
      // Numaranın kendisi metne yazılmaz; `chapters.tsx` sonuna
      // `contact.phoneDisplay` ekler. Numara tek kaynakta durmalı, yoksa
      // değiştiğinde dört dil dosyasında da elle düzeltmek gerekirdi.
      lead: "WhatsApp'tan yazın, Instagram'dan takip edin veya doğrudan atölyeye gelin.",
    },
  },

  disciplines: {
    "iha-vtol": {
      title: "İHA / VTOL Sistemleri",
      summary: "Dikey kalkışlı insansız hava aracı tasarımı, montajı ve uçuş kontrolü.",
      detail:
        "Batman drone ve İHA eğitimi kapsamında öğrenciler multirotor ve VTOL platformlarını sıfırdan monte eder, uçuş kontrol kartını kalibre eder ve otonom görev planlaması yapar. Eğitim gerçek saha uçuş testiyle tamamlanır.",
      outcomes: [
        "Gövde ve itki sistemi montajı",
        "Uçuş kontrol kartı kalibrasyonu",
        "Otonom görev planlama",
        "Saha uçuş testi",
      ],
    },
    roketcilik: {
      title: "Roketçilik ve İtki",
      summary: "Model roket aerodinamiği, itki hesabı ve güvenli fırlatma protokolü.",
      detail:
        "Öğrenciler roket gövde aerodinamiğini, kanatçık geometrisini ve itki-kütle oranını hesaplar; kurtarma sistemini tasarlar ve kontrollü fırlatma protokolüyle atış gerçekleştirir.",
      outcomes: [
        "Aerodinamik tasarım",
        "İtki-kütle hesabı",
        "Paraşüt kurtarma sistemi",
        "Kontrollü fırlatma",
      ],
    },
    "yapay-zeka": {
      title: "Yapay Zeka ve Makine Öğrenmesi",
      summary: "Görüntü işleme, veri setleri ve model eğitimiyle yapay zekayı anlama.",
      detail:
        "Batman yapay zeka eğitimi modülünde öğrenciler kendi veri setlerini toplar, görüntü sınıflandırma modeli eğitir ve modelin neden yanıldığını yorumlamayı öğrenir. Amaç yapay zekayı sihir değil mühendislik olarak kavratmaktır.",
      outcomes: [
        "Veri seti oluşturma",
        "Model eğitimi ve test",
        "Görüntü işleme uygulaması",
        "Etik ve önyargı okuryazarlığı",
      ],
    },
    robotik: {
      title: "Robotik ve Otonom Sistemler",
      summary: "Sensör-motor döngüsü, çizgi izleme ve otonom karar mekanizmaları.",
      detail:
        "Batman robotik kodlama kursu çekirdeğinde öğrenciler sensör okuma, motor sürme ve geri besleme döngüsü kurar; engel algılayan ve rota düzelten otonom robotlar geliştirir.",
      outcomes: [
        "Sensör-aktüatör entegrasyonu",
        "PID mantığı sezgisi",
        "Otonom navigasyon",
        "Robot yarışması hazırlığı",
      ],
    },
    "3d-tasarim": {
      title: "3D Tasarım ve Eklemeli Üretim",
      summary: "Parametrik modelleme, dilimleme ve 3D yazıcıyla gerçek parça üretimi.",
      detail:
        "Batman 3D tasarım kursu kapsamında öğrenciler parametrik CAD ile kendi parçalarını modeller, dilimleme ayarlarını optimize eder ve 3D yazıcıda üretip tolerans ölçümü yapar.",
      outcomes: [
        "Parametrik CAD modelleme",
        "Dilimleme optimizasyonu",
        "3D baskı üretimi",
        "Ölçü ve tolerans kontrolü",
      ],
    },
    kodlama: {
      title: "Yazılım ve Algoritma",
      summary: "Blok tabanlıdan metin tabanlı programlamaya kademeli geçiş.",
      detail:
        "6 yaşta blok tabanlı görsel programlamayla başlayan patika, yaş ilerledikçe Python ve gömülü C'ye evrilir. Her seviyede öğrenci çalışan bir ürün teslim eder.",
      outcomes: [
        "Algoritmik düşünme",
        "Blok tabanlı programlama",
        "Python temelleri",
        "Gömülü sistem kodlama",
      ],
    },
    elektronik: {
      title: "Elektronik ve Mekatronik",
      summary: "Devre okuma, lehimleme ve mekanik-elektronik entegrasyonu.",
      detail:
        "Öğrenciler devre şeması okur, breadboard üzerinde prototip kurar, güvenli lehimleme yapar ve mekanik aktarma organlarıyla elektroniği birleştirir.",
      outcomes: [
        "Devre şeması okuma",
        "Güvenli lehimleme",
        "Mikrodenetleyici kullanımı",
        "Mekatronik entegrasyon",
      ],
    },
    "siber-guvenlik": {
      title: "Siber Güvenlik Farkındalığı",
      summary: "Dijital hijyen, şifreleme mantığı ve savunma odaklı güvenlik kültürü.",
      detail:
        "Savunma odaklı içerikle öğrenciler parola hijyeni, şifreleme mantığı, sosyal mühendislik taktiklerini tanıma ve güvenli ağ davranışı geliştirir.",
      outcomes: [
        "Dijital hijyen",
        "Şifreleme mantığı",
        "Sosyal mühendislik tanıma",
        "Güvenli ağ davranışı",
      ],
    },
    "uzay-havacilik": {
      title: "Uzay ve Havacılık Bilimleri",
      summary: "Yörünge mekaniği, uydu sistemleri ve görev tasarımı temelleri.",
      detail:
        "Yörünge mantığı, uydu alt sistemleri ve görev planlama disiplini; CanSat benzeri minyatür görev tasarımıyla uygulamalı olarak işlenir.",
      outcomes: [
        "Yörünge mekaniği sezgisi",
        "Uydu alt sistemleri",
        "Görev yükü tasarımı",
        "Telemetri okuma",
      ],
    },
    girisimcilik: {
      title: "Teknoloji Girişimciliği",
      summary: "Fikirden prototipe, prototipten sunuma ürünleştirme disiplini.",
      detail:
        "Öğrenciler problem tanımlar, çözüm prototipler, maliyet çıkarır ve jüri önünde savunur. Teknofest türü yarışmalara takım olarak hazırlanır.",
      outcomes: ["Problem tanımlama", "Hızlı prototipleme", "Maliyet analizi", "Jüri sunumu"],
    },
  },

  faqs: [
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
  ],

  channels: {
    instagramHint: "Atölye kareleri, proje paylaşımları ve duyurular",
    whatsappHint: "Kayıt, ders programı ve fiyat bilgisi için anında yazın",
    mapsHint: "Belde Mahallesi'ndeki üssümüze yol tarifi alın",
  },
} as const;

/**
 * Yapı Türkçeden türer, değerler `string`'e genişler.
 *
 * DİZİLER UZUNLUĞUNU KORUR. `Like<T, V>` eşlemeli tip demeti (tuple) olarak
 * korur: Türkçede dört kazanım varsa Arapçada da dört olmak zorundadır,
 * üç yazılırsa derleme durur. Düz `readonly V[]` yazsaydık eksik kazanım
 * sessizce yayına çıkardı — ekranda madde eksik olurdu ama hiçbir uyarı
 * çıkmazdı. Aynı koruma metrik, miras ve SSS listeleri için de geçerli;
 * SSS'de bir soru düşerse structured data ile görünen metin ayrışırdı.
 */
type Like<T extends readonly unknown[], V> = { readonly [I in keyof T]: V };

export type Content = {
  org: Record<keyof typeof tr.org, string>;
  intro: Record<keyof typeof tr.intro, string>;
  cta: Record<keyof typeof tr.cta, string>;
  metrics: Like<typeof tr.metrics, { label: string; hint: string }>;
  legacy: Like<typeof tr.legacy, { era: string; title: string; body: string }>;
  chapters: Record<
    keyof typeof tr.chapters,
    { eyebrow: string; titleLead: string; titleAccent: string; titleTail: string; lead: string }
  >;
  disciplines: {
    [K in keyof typeof tr.disciplines]: {
      title: string;
      summary: string;
      detail: string;
      outcomes: Like<(typeof tr.disciplines)[K]["outcomes"], string>;
    };
  };
  faqs: Like<typeof tr.faqs, { q: string; a: string }>;
  channels: Record<keyof typeof tr.channels, string>;
};
