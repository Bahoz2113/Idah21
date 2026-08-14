/**
 * İÇERİK SÖZLÜĞÜ — TÜRKÇE (kaynak dil).
 *
 * Sayfanın ANLATISI burada durur: kurum tanımı, on disiplinin metinleri,
 * SSS, bölüm başlıkları, kurumsal otobiyografi, metrikler. Çerçeve dizeleri
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
    index: "10 — Davet",
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
      lead: "Batman'daki atölyede öğrenciler 3D yazıcı çalıştırır, drone gövdesi monte eder, devre lehimler ve sahada gerçek uçuş testi yapar. Aşağıdaki kareler bu çalışmalardan alınmıştır; henüz kaydı olmayan disiplinler ise 'Konsept' etiketiyle işaretlendi. Karelerdeki öğrencilerin görüntülerinin paylaşılması için velilerinden izin alınmıştır.",
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

  /**
   * BİZ KİMİZ — kurumsal otobiyografi.
   *
   * Kurucunun kendi ağzından yazılmış metin. Birinci çoğul şahıs KORUNUR:
   * "sunuyoruz", "inanıyoruz". Üçüncü şahsa çevirmek metni kurumsal bir
   * tanıtımdan kuru bir tarife düşürürdü.
   *
   * DOĞRULANMAMIŞ VERİ YOK. Öğrenci sayısı, kuruluş yılı, ödül, başarı
   * oranı veya sertifika iddiası bu metinde geçmez; yalnızca kaynağı
   * gösterilebilen olaylar anılır (Yediiki yarışmasındaki VTOL uçuşu ve
   * roket fırlatması, Esnaf Odası ve Petrol-İş iş birlikleri).
   */
  about: {
    eyebrow: "Biz Kimiz",
    titleLead: "Batman'da Doğan,",
    titleAccent: "Geleceği Üreten",
    titleTail: "Bir Teknoloji Üssüyüz",
    lead: "Biz CEZERİ ROBOTECH'iz. Batman'da doğan; merakı bilgiyle, bilgiyi tasarımla, tasarımı ise çalışan bir ürüne dönüştüren bir yapay zekâ, robotik, yazılım ve havacılık teknoloji üssüyüz.",

    photoAlt:
      "CEZERİ ROBOTECH Batman eğitmen kadrosu, kurumun robotik baykuş amblemi önünde",
    photoCaption: "Batman atölyesindeki eğitmen kadromuz",

    identity: [
      "Yola çıkarken kendimize basit ama güçlü bir soru sorduk: Çocuklarımız teknolojinin yalnızca kullanıcısı mı olacak, yoksa onu anlayan, geliştiren ve geleceğe yön veren insanlar mı olacak? CEZERİ ROBOTECH, bu soruya verdiğimiz cevaptır.",
      "Batman'da kurulan merkezimiz; robotik kodlama, yazılım, yapay zekâ, elektronik, 3D tasarım ve üretim, drone, İHA ve havacılık çalışmalarını aynı üretim kültürü içinde buluşturur. Bizim için teknoloji, ekranda izlenen uzak bir dünya değildir. Dokunulan, sökülen, yeniden kurulan, kodlanan, test edilen ve sonunda çalışan gerçek bir üretim alanıdır.",
      "Adımızda taşıdığımız El-Cezerî'nin merakını, mühendislik aklını ve yüzyılları aşan üretme iradesini bugünün çocuklarıyla geleceğe taşımak istiyoruz. Geçmişin büyük bilim ve mühendislik mirasından ilham alırken yüzümüzü yapay zekâya, otonom sistemlere, robotlara ve geleceğin hava teknolojilerine dönüyoruz.",
    ],

    quotes: [
      "Geleceğin başka bir yerde kurulmasını beklemiyoruz. Onu Batman'da, öğrencilerimizle birlikte üretiyoruz.",
      "Bizim için hata başarısızlık değil; düşünmenin, araştırmanın ve gerçek öğrenmenin başlangıcıdır.",
      "Çocuklarımız geleceği yalnızca izlemesin; onu tasarlasın, kodlasın ve üretsin.",
      "Gelecek, onu üretenlerin ellerinde şekilleniyor.",
    ],

    blocks: [
      {
        title: "Teknolojiyi Tüketen Değil, Üreten Bir Nesil",
        body: [
          "Eğitim anlayışımızın merkezinde tek bir hedef vardır: Çocukları teknolojinin pasif tüketicisi olmaktan çıkarıp, kendi fikirlerini gerçeğe dönüştürebilen üreticiler hâline getirmek.",
          "Başta 6-16 yaş arası öğrenciler olmak üzere çocuklara ve gençlere, yaşlarına ve gelişim düzeylerine uygun uygulamalı teknoloji eğitimleri sunuyoruz. Ayrıca dönemsel olarak 18 yaş ve üzeri katılımcılar için sıfırdan başlayan uygulamalı robotik ve kodlama programları düzenliyoruz.",
          "Atölyelerimizde öğrenciler yalnızca bir kodu ezberlemez veya hazır bir modeli tekrar etmez. Bir problemin nasıl tanımlanacağını, çözümün nasıl tasarlanacağını, parçaların nasıl bir araya getirileceğini ve ilk deneme çalışmadığında nasıl yeniden düşünüleceğini öğrenir.",
          "Bir elektronik devre kurar, sensörlerden veri alır, algoritma geliştirir, robot tasarlar, yazılım yazar, 3D model oluşturur, prototip üretir, drone ve uçuş sistemlerini tanır, model roket geliştirir. Fikrini anlatmayı, projesini sunmayı, takım arkadaşlarıyla iş birliği kurmayı ve sonuç kadar sürece de değer vermeyi deneyimler.",
          "Bu nedenle öğrencilerimize yalnızca teknik beceriler değil; problem çözme, analitik düşünme, sabır, odaklanma, sorumluluk, takım çalışması, tasarım bilinci ve üretme cesareti kazandırmayı amaçlıyoruz.",
          "Her çocuğun öğrenme biçiminin, merakının ve ilerleme hızının farklı olduğunu biliyoruz. Bu yüzden eğitimi tek yönlü bir anlatım olarak değil; öğrencinin keşfettiği, soru sorduğu, deney yaptığı ve kendi ürününü ortaya çıkardığı yaşayan bir süreç olarak görüyoruz.",
        ],
      },
      {
        title: "Ders Değil; Atölye, Deneyim ve Gerçek Proje",
        body: [
          "CEZERİ ROBOTECH'te öğrenme, teoriyle başlayıp uygulamayla derinleşir. Robotik kodlama, temel ve ileri yazılım mantığı, yapay zekâ uygulamaları, elektronik, 3D tasarım ve baskı, İHA-drone teknolojileri, havacılık ve model roket çalışmaları birbirinden kopuk başlıklar değildir. Bunların her biri, öğrencinin bir fikri çalışan sisteme dönüştürme yolculuğunun parçasıdır.",
          "Öğrencilerimiz bazen basit bir alarm sistemiyle sensör mantığını keşfeder, bazen bir robotun hareketlerini kodlar, bazen bir 3D modeli tasarlayıp fiziksel ürüne dönüştürür. Bazen de aylar boyunca emek verdikleri bir hava aracının veya roketin gökyüzüyle buluşmasına tanıklık eder.",
          "Bu yaklaşım, çocuklara yalnızca «nasıl yapılır?» sorusunun cevabını vermez. Onları «Daha iyisi nasıl yapılabilir?», «Bu sorun başka hangi yöntemle çözülebilir?» ve «Ben ne üretebilirim?» sorularını sormaya teşvik eder.",
          "Yaz ve bahar dönemi atölyelerimiz, proje çalışmaları ve yarışmalara hazırlık süreçlerimizle öğrencilerimizin teknolojiyle uzun soluklu bir ilişki kurmasını destekliyoruz. TEKNOFEST ve benzeri teknoloji yarışmalarını yalnızca derece alınacak organizasyonlar olarak değil; araştırmayı, proje disiplinini, ekip çalışmasını ve fikirlerini cesaretle sunmayı öğrenebilecekleri gelişim alanları olarak görüyoruz.",
        ],
      },
      {
        title: "Hayalin Çalışan Bir Sisteme Dönüştüğü Yer",
        body: [
          "Biz, çocuklara geleceği anlatmakla yetinmiyoruz; onlara geleceğin bir parçasını kendi elleriyle kurabilecekleri ortamı sağlıyoruz.",
          "Bu anlayışın en görünür örneklerinden biri, 29-30 Nisan 2026 tarihlerinde Batman'da düzenlenen Yediiki Robot ve Teknoloji Yarışması oldu. Robotik ve yapay zekâ projelerinin sergilendiği bu organizasyonda CEZERİ ROBOTECH olarak Batman'da ilk kez VTOL İHA uçuşu ve model roket fırlatma gösterimi gerçekleştirdik.",
          "Bizim için bu uçuş ve fırlatma yalnızca teknik bir gösteri değildi. Batman'da kurulan bir hayalin, mühendislik bilgisiyle ve kararlı bir üretim süreciyle gerçeğe dönüşebileceğinin kanıtıydı. Bir çocuğun gözünde oluşan «Ben de yapabilirim» duygusu, elde edilebilecek en değerli sonuçlardan biridir.",
          "Atölyelerimizde tasarlanan robotlar, elektronik devreler, yapay zekâ uygulamaları, 3D modeller, drone sistemleri ve farklı boylarda geliştirilen model roketler aynı düşüncenin ürünüdür: Öğrenmenin en güçlü yolu üretmektir.",
        ],
      },
      {
        title: "Batman'dan Geleceğe Açılan Bir Merkez",
        body: [
          "CEZERİ ROBOTECH yalnızca eğitim veren bir kurs değildir. Biz; çocukların, gençlerin, mühendislerin, eğitimcilerin, kurumların ve yerel işletmelerin teknoloji etrafında buluşabildiği bir üretim ve gelişim ekosistemi kuruyoruz.",
          "Batman'ın teknoloji kapasitesinin yalnızca kullanıcı sayısıyla değil; kod yazan, robot geliştiren, proje üreten, yapay zekâyı doğru kullanan ve gerçek problemlere çözüm tasarlayan insanlarla büyüyeceğine inanıyoruz. Bu nedenle merkezimizin kapısını yalnızca bugünün derslerine değil, yarının mesleklerine ve henüz adı konulmamış yeni uzmanlık alanlarına açıyoruz.",
          "Çalışmalarımızı yerel bir sorumluluk ve evrensel bir vizyonla yürütüyoruz. Batman'daki çocukların ve gençlerin nitelikli teknoloji eğitimiyle buluşmasını, kendi potansiyellerini keşfetmesini ve ulusal ya da uluslararası üretim ortamlarında özgüvenle yer almasını istiyoruz.",
          "Bizim için Batman yalnızca bulunduğumuz şehir değildir. Başlattığımız dönüşümün merkezi, ilhamımız ve geleceğe verdiğimiz sözün adresidir.",
        ],
      },
      {
        title: "Eğitimden Dijital Dönüşüme",
        body: [
          "Teknolojiye bakışımızı yalnızca çocuk ve gençlik eğitimleriyle sınırlamıyoruz. CEZERİ ROBOTECH aynı zamanda işletmelere ve kurumlara yazılım geliştirme, yapay zekâ destekli çözümler, danışmanlık ve dijital dönüşüm hizmetleri sunar.",
          "Batman Esnaf ve Sanatkârlar Odasıyla gerçekleştirilen iş birliği; yerel işletmelerin dijital dünyaya uyum sağlamasına, verimliliklerini artırmasına ve teknolojiyi daha etkili kullanmasına katkı sunma irademizin somut örneklerinden biridir. Petrol-İş Sendikası Batman Şubesiyle eğitim ve yazılım alanında kurulan iş birliği de teknolojiyi toplumun farklı kesimleri için daha erişilebilir hâle getirme yaklaşımımızı yansıtır.",
          "Çünkü biz, teknolojik dönüşümün yalnızca cihazlarla veya yazılımlarla gerçekleşmediğini biliyoruz. Gerçek dönüşüm; insanın bilgiye erişmesi, yeni beceriler kazanması ve teknolojiyi kendi ihtiyacına uygun bir çözüme dönüştürebilmesiyle başlar.",
          "Bu nedenle bir yandan geleceğin mühendislerini yetiştirirken diğer yandan bugünün işletmelerine geleceğe hazırlanabilecekleri çözümler sunuyoruz.",
        ],
      },
    ],

    valuesTitle: "Bizi Biz Yapan Değerler",
    values: [
      {
        title: "Merak",
        body: "Merak, CEZERİ ROBOTECH'in başlangıç noktasıdır. Çünkü her büyük buluş, doğru soruyu sorma cesaretiyle başlar.",
      },
      {
        title: "Üretim",
        body: "Üretim, eğitimimizin merkezidir. Bir bilginin gerçek değere dönüşmesi için denenmesi, uygulanması ve paylaşılması gerektiğine inanırız.",
      },
      {
        title: "İnsan",
        body: "İnsan, teknolojinin önündedir. Yapay zekâyı, robotları ve yazılımı amaç değil; insanın düşünme, üretme ve sorun çözme gücünü geliştiren araçlar olarak görürüz.",
      },
      {
        title: "Doğallık",
        body: "Doğallık ve samimiyet, iletişimimizin temelidir. Yaptığımız işi abartılı vaatlerle değil; öğrencilerimizin emeği, ortaya çıkan gerçek projeler ve sahadaki çalışmalarımızla anlatırız.",
      },
      {
        title: "Güven",
        body: "Güven, çocuklarla ve ailelerle kurduğumuz ilişkinin vazgeçilmezidir. Öğrencinin merakına saygı duyan, gelişimini önemseyen ve her adımını gerçek öğrenmeyle destekleyen bir ortam oluştururuz.",
      },
      {
        title: "Yerelden Evrensele",
        body: "Yerelden evrensele bakarız. Batman'da üretilen bir fikrin dünyaya ulaşabileceğine; doğru eğitim, kararlı çalışma ve güçlü bir hayalle hiçbir coğrafyanın teknoloji üretiminin dışında kalmayacağına inanırız.",
      },
    ],

    missionTitle: "Misyonumuz",
    mission:
      "Çocukları ve gençleri teknolojinin yalnızca tüketicisi değil; düşünen, tasarlayan, kodlayan ve üreten bireyler olarak yetiştirmek; robotik, yazılım, yapay zekâ, elektronik, 3D üretim ve havacılık alanlarında nitelikli, uygulamalı ve proje tabanlı öğrenme ortamları sunmak; kurumların ve işletmelerin dijital dönüşümüne gerçek ihtiyaçlardan doğan çözümlerle katkıda bulunmaktır.",
    visionTitle: "Vizyonumuz",
    vision:
      "Batman'dan başlayarak Türkiye'nin öncü yapay zekâ, robotik ve havacılık eğitim-üretim merkezlerinden biri olmak; kendi teknolojisini geliştiren, küresel ölçekte proje üretebilen ve insanlığa değer katan yeni nesil mühendislerin, girişimcilerin ve mucitlerin yetişmesine öncülük etmektir.",

    heritageTitle: "Adımızın Hikâyesi",
    heritageLead:
      "Kurumun adı, programlanabilir otomatların ilk sistematik kaydını bırakan İsmail el-Cezerî'den gelir. Bugün aynı disiplin mikrodenetleyici, sensör ve algoritmayla sürüyor.",

    promiseTitle: "Geleceğe Verdiğimiz Söz",
    promise: [
      "Biz, her çocuğun içinde keşfedilmeyi bekleyen bir fikir olduğuna inanıyoruz.",
      "O fikri merakla büyütmek, bilgiyle güçlendirmek, doğru araçlarla buluşturmak ve gerçek bir ürüne dönüşene kadar öğrencinin yanında yürümek için buradayız.",
      "Bir robotun ilk hareketinde, bir kodun ilk kez doğru çalışmasında, bir devrenin ışığında, bir 3D tasarımın fiziksel ürüne dönüşmesinde ve bir roketin gökyüzüne yükseldiği anda aynı heyecanı görüyoruz.",
      "Bu yüzden yalnızca bugünün teknolojisini öğretmiyoruz. Soru soran, çözüm geliştiren, birlikte çalışan, hata yapmaktan korkmayan ve yeniden deneyen bir neslin karakterini inşa ediyoruz.",
    ],
    signOff: "Biz CEZERİ ROBOTECH'iz. Batman'dan doğan bir hayali; bilgiyle, emekle ve teknolojiyle geleceğe taşıyoruz.",
  },

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
 * çıkmazdı. Aynı koruma metrik, kronoloji ve SSS listeleri için de geçerli;
 * SSS'de bir soru düşerse structured data ile görünen metin ayrışırdı.
 */
type Like<T extends readonly unknown[], V> = { readonly [I in keyof T]: V };

/**
 * Demet koruması yalnızca eşlemenin bir TİP PARAMETRESİ üzerinden
 * yapılmasıyla çalışır. `{ [I in keyof typeof tr.about.blocks]: ... }`
 * biçiminde doğrudan yazıldığında TypeScript eşlemeyi homomorfik saymaz
 * ve diziyi sıradan bir nesne gibi gezerek `length` alanını da eşlemeye
 * çalışır (ölçüldü: "Type 'number' is not assignable"). Bu yüzden iç içe
 * demet gerektiren bölüm listesi kendi yardımcısını alıyor.
 */
type BlockList<T extends readonly { body: readonly unknown[] }[]> = {
  readonly [I in keyof T]: { title: string; body: Like<T[I]["body"], string> };
};

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
  about: {
    eyebrow: string;
    titleLead: string;
    titleAccent: string;
    titleTail: string;
    lead: string;
    photoAlt: string;
    photoCaption: string;
    identity: Like<typeof tr.about.identity, string>;
    quotes: Like<typeof tr.about.quotes, string>;
    blocks: BlockList<typeof tr.about.blocks>;
    valuesTitle: string;
    values: Like<typeof tr.about.values, { title: string; body: string }>;
    missionTitle: string;
    mission: string;
    visionTitle: string;
    vision: string;
    heritageTitle: string;
    heritageLead: string;
    promiseTitle: string;
    promise: Like<typeof tr.about.promise, string>;
    signOff: string;
  };
  channels: Record<keyof typeof tr.channels, string>;
};
