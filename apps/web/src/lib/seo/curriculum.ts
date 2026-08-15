/**
 * MÜFREDAT — dört programın haftalık ders planı.
 *
 * Kaynak, kurumun kendi müfredat belgeleridir; içerik olduğu gibi
 * aktarılmıştır, özetlenmemiştir. Toplam 165 hafta.
 *
 * Neden bu kadar ayrıntı sayfada duruyor:
 *   • Veli "ne öğretiyorsunuz" sorusunun cevabını hafta hafta görür;
 *     bir eğitim kurumunun verebileceği en somut güven işareti budur.
 *   • Arama tarafında bu metin çok sayıda uzun kuyruklu sorguyla
 *     eşleşir ("Arduino röle modülü eğitimi", "ScratchJr döngü bloğu",
 *     "transistör deneyi çocuk"), çünkü gerçek ders adları geçiyor.
 *   • `Syllabus` şeması bu ağacı birebir yansıtır — sayfada görünmeyen
 *     hiçbir şey şemaya yazılmaz.
 *
 * Yapı üç katmanlı: program → modül → hafta. Modül katmanı olmadan
 * 59 haftalık bir liste okunamaz hâle gelirdi; haftalar tematik
 * kümelerine ayrıldı ve her kümeye ne öğretildiğini söyleyen bir
 * cümle konuldu.
 */

export type CurriculumWeek = {
  /** Belgede geçen hafta numarası. */
  no: number;
  title: string;
  detail: string;
};

export type CurriculumModule = {
  title: string;
  /** Modülün ne kazandırdığı — haftaların üstünde tek cümle. */
  summary: string;
  weeks: readonly CurriculumWeek[];
};

export type CurriculumProgram = {
  id: string;
  code: string;
  title: string;
  /** Katalogdaki eğitim kategorisiyle bağ (disciplines[].id). */
  relatedDisciplines: readonly string[];
  ages: string;
  level: "Başlangıç" | "Orta" | "İleri";
  totalWeeks: number;
  /** "Answer-first" tanım — yanıt motorlarının alıntılayacağı paragraf. */
  answer: string;
  /** Programda fiilen kullanılan araç ve bileşenler. */
  tools: readonly string[];
  modules: readonly CurriculumModule[];
};

export const curriculum: readonly CurriculumProgram[] = [
  /* ------------------------------------------------------------------ */
  {
    id: "blok-kodlama",
    code: "MFR-01",
    title: "Blok Tabanlı Kodlama: ScratchJr'dan mBlock'a",
    relatedDisciplines: ["kodlama", "robotik", "elektronik"],
    ages: "6-10 yaş",
    level: "Başlangıç",
    totalWeeks: 31,
    answer:
      "Blok tabanlı kodlama programı, okuma yazması henüz gelişmekte olan " +
      "öğrencinin algoritmayı sürükle-bırak bloklarla kurmasıyla başlar ve " +
      "aynı blok mantığının gerçek bir devre kartını sürdüğü noktada biter. " +
      "İlk on beş hafta ScratchJr ile animasyon ve oyun tasarımı, sonraki on " +
      "altı hafta mBlock ile LED, sensör ve motor kontrolüdür. Öğrenci ekranda " +
      "öğrendiği döngüyü, masadaki karta bağlı bir LED'i yakmak için kullanır.",
    tools: [
      "ScratchJr",
      "mBlock",
      "Arduino uyumlu kart",
      "LDR, LM35, DHT11",
      "HC-SR04 ultrasonik sensör",
      "Servo motor, L298N sürücü",
      "I2C LCD ekran",
    ],
    modules: [
      {
        title: "ScratchJr Temelleri",
        summary: "Sahne, karakter ve ilk algoritma blokları.",
        weeks: [
          { no: 1, title: "ScratchJr uygulamasına giriş", detail: "Uygulamanın tanıtımı; sahneye arka plan ve karakter ekleme, karakterleri hareket ettirme." },
          { no: 2, title: "Karakter oluşturma ve özelleştirme", detail: "Çizim araçlarıyla kendi karakterini çizme, renk değiştirme ve kendi sesini kaydederek karaktere ekleme." },
          { no: 3, title: "Döngü bloğu", detail: "Hareketleri sürekli tekrarlayan sonsuz döngü bloğunun kullanımı. Etkinlik: This Is Sand ile tasarım." },
          { no: 4, title: "Belirli sayıda tekrar bloğu", detail: "Bir komut dizisini istenilen sayıda çalıştıran tekrar bloklarının mantığı. Etkinlik: WordArt ile kelime bulutu." },
        ],
      },
      {
        title: "Animasyon ve Sahne Kurgusu",
        summary: "Çoklu karakter, sahne geçişi ve karakterler arası mesajlaşma.",
        weeks: [
          { no: 5, title: "Dünyaya yolculuk", detail: "Uzay aracının Ay'dan Dünya'ya gelişi; doğru mesafe ve yön komutlarıyla hareket blokları pekiştirilir." },
          { no: 6, title: "Akvaryum tasarımı", detail: "Farklı deniz canlılarının bağımsız yüzdüğü su altı animasyonu; çoklu karakter yönetimi ve paralel kodlama." },
          { no: 7, title: "Okul gezisi", detail: "Okul, otobüs, müze gibi birden çok sahne kurulur ve sahneler arası otomatik geçiş kodlanır." },
          { no: 8, title: "Dans partisi", detail: "Karakterlerin sırayla sahneye geldiği senaryo; mesaj gönderme/alma ve zamanlama blokları." },
        ],
      },
      {
        title: "Oyun Tasarımı ve Problem Çözme",
        summary: "Algılama, oyun mantığı ve senaryo tabanlı kodlama.",
        weeks: [
          { no: 9, title: "Bisiklet ve araba kontrolü", detail: "Dokunma ve yön kontrol bloklarıyla araçların ileri-geri hareketi." },
          { no: 10, title: "Meyve toplama oyunu", detail: "Ağaçtan düşen meyvelerin sepetle toplandığı ilk etkileşimli oyun; algılama ve temel oyun mantığı." },
          { no: 11, title: "Trafikte karşıdan karşıya geçme", detail: "Sıralı algoritma ve yön kavramları; aynı zamanda trafik kuralları farkındalığı." },
          { no: 12, title: "Bir kap su, bir kap mama", detail: "Sokak hayvanlarına yardım temalı animasyon; empati ve paylaşma değerleriyle birlikte hareket blokları." },
          { no: 13, title: "Yaralı hayvanlara yardım", detail: "Olay sıralaması ve senaryo tabanlı kodlama; algoritmik düşünme ve sosyal sorumluluk birlikte işlenir." },
          { no: 14, title: "Labirent oyunu", detail: "Karakteri doğru komut adımlarıyla çıkışa ulaştırma; planlama, problem çözme ve deneme-yanılma." },
          { no: 15, title: "Pacman oyunu", detail: "Hareket, zamanlama, tekrar ve oyun mantığı birleştirilerek daha karmaşık algoritma kurulur." },
        ],
      },
      {
        title: "mBlock ile Fiziksel Programlama",
        summary: "Bloklar ekrandan çıkıp gerçek karta bağlanır.",
        weeks: [
          { no: 16, title: "mBlock'a giriş ve LED yakma", detail: "mBlock arayüzü tanıtılır; kart üzerindeki LED'in yakılıp söndürülmesi (Blink)." },
          { no: 17, title: "Buton ile LED kontrolü", detail: "Dijital giriş işlemleri; LED'in buton aracılığıyla kontrolü." },
          { no: 18, title: "Potansiyometre ile LED kontrolü", detail: "Analog giriş ve değişkenler; okunan veriyle LED parlaklığı veya yanıp sönme hızı." },
          { no: 19, title: "LDR ile otomatik aydınlatma", detail: "Sensör verisi okuma ve koşullu ifadeler; ortamın karanlık/aydınlık durumuna göre karar veren sistem." },
          { no: 20, title: "RGB LED kullanımı", detail: "PWM mantığı; kırmızı, yeşil ve mavinin karışımıyla renk elde etme." },
          { no: 21, title: "LM35 ile sıcaklık ölçümü", detail: "Analog sensörler ve veri dönüştürme; okunan değerin santigrat dereceye çevrilmesi." },
          { no: 22, title: "HC-SR04 ultrasonik mesafe sensörü", detail: "Ses dalgalarıyla mesafe ölçümü; park sensörü benzeri projelerde kullanımı." },
        ],
      },
      {
        title: "Sensörler, Motorlar ve Otomasyon",
        summary: "Ölçen, karar veren ve harekete geçen sistemler.",
        weeks: [
          { no: 23, title: "Servo motor kontrolü", detail: "Hassas açı kontrolü; servo motorun 0°-180° arasında döndürülmesi." },
          { no: 24, title: "DHT11 ile sıcaklık ve nem", detail: "Dijital iklim sensörü; ortam verilerinin okunması ve analizi." },
          { no: 25, title: "Röle modülü kullanımı", detail: "Yüksek akım/gerilim kontrolü ve güvenlik; harici cihazların güvenle anahtarlanması." },
          { no: 26, title: "Toprak nem sensörü ve otomatik sulama", detail: "Tarım teknolojileri ve otomasyon; sensör verisine göre çalışan sulama modeli." },
          { no: 27, title: "Su seviyesi ölçüm sensörü", detail: "Sıvı seviye tespiti ve taşma alarmı." },
          { no: 28, title: "Yağmur sensörü", detail: "Yüzeydeki iletkenlik değişimiyle yağış tespiti; akıllı ev kontrol uygulamaları." },
          { no: 29, title: "MZ80 kızılötesi engel sensörü", detail: "Temassız cisim algılama; engel tanıyan robotların temel mantığı." },
          { no: 30, title: "I2C modüllü LCD ekran", detail: "I2C protokolüyle 16x2 ekrana yazdırma; sensör verilerinin anlık gösterimi." },
          { no: 31, title: "L298N ile DC motor kontrolü", detail: "Motor sürücüyle yön ve hız (PWM) kontrolü; mobil robot tasarımına ilk adım." },
        ],
      },
    ],
  },

  /* ------------------------------------------------------------------ */
  {
    id: "temel-elektrik",
    code: "MFR-02",
    title: "Temel Elektrik ve Enerji Atölyesi",
    relatedDisciplines: ["elektronik", "3d-tasarim", "iha-vtol"],
    ages: "6-11 yaş",
    level: "Başlangıç",
    totalWeeks: 59,
    answer:
      "Temel elektrik ve enerji programı, elektriği formülle değil deneyle " +
      "öğretir: öğrenci ilk haftada bir LED yakar, elli dokuzuncu haftada " +
      "rüzgâr türbininin ürettiği enerjiyi aküde depolayıp bir sireni " +
      "çalıştırır. Arada direnç, transistör, jeneratör, güneş paneli ve " +
      "statik elektrik konuları her biri kendi deneyiyle işlenir. Program " +
      "boyunca üç hafta dron eğitimi ve üç hafta 3D kalem çalışması yer alır.",
    tools: [
      "Deney seti, breadboard",
      "Direnç, LED, buton, buzzer",
      "Transistör, LDR, multimetre",
      "DC motor, jeneratör, dişli kutusu",
      "Güneş paneli, süper kapasitör",
      "Rüzgâr türbini modülü",
      "3D kalem",
    ],
    modules: [
      {
        title: "Devre, Akım ve Direnç",
        summary: "Elektriğin nasıl aktığı ve nasıl sınırlandığı.",
        weeks: [
          { no: 1, title: "Elektrik devresi ve akım", detail: "Basit elektrik devresi kurulur ve akımın oluşumu açıklanır. (LED yakma etkinliği)" },
          { no: 2, title: "Direnç", detail: "Direncin devredeki görevi; akımı sınırlayarak devrenin güvenli çalışmasını sağlaması. (Direnç ve LED etkinliği)" },
          { no: 3, title: "LED'i tanıyalım", detail: "LED'in yapısı ve çalışma prensibi; doğru bağlantı yönü ve güvenli kullanım. (Paralel LED'ler etkinliği)" },
          { no: 5, title: "İletkenlik test aleti", detail: "İletken ve yalıtkan maddeleri ayırt etme; test devresi kurarak malzeme sınama. (Buton ve LED etkinliği)" },
          { no: 6, title: "Yalıtkanlık test aleti", detail: "Yalıtkan maddelerin özellikleri; elektriği iletmeyen malzemelerin belirlenmesi. (Yaya geçidi etkinliği)" },
          { no: 7, title: "Oto sağ sol sinyali", detail: "Araçlardaki sinyal sisteminin çalışma prensibi ve devre kurulumu. (El feneri etkinliği)" },
          { no: 8, title: "Polis sireni", detail: "Siren devresinin çalışma prensibi ve kurulumu. (Buton ve buzzer etkinliği)" },
        ],
      },
      {
        title: "Transistör ve Alarm Devreleri",
        summary: "Küçük bir akımın büyük bir akımı yönetmesi.",
        weeks: [
          { no: 9, title: "Transistör", detail: "Transistörün yapısı ve görevi; devrede anahtarlama ve akım kontrolü. (Robot gözü etkinliği)" },
          { no: 10, title: "Deprem alarmı", detail: "Sarsıntı anında sesli ve ışıklı uyarı veren devre. (Karton ev aydınlatma etkinliği)" },
          { no: 11, title: "İğne iplik oyunu", detail: "İletkenlik prensibinin oyunla kavranması; dikkat ve el becerisi. (Işıklı kalp etkinliği)" },
          { no: 12, title: "Rüzgâr alarmı", detail: "Rüzgâr etkisinde sesli ve ışıklı uyarı sistemi. (Renkli LED'ler ve direnç etkinliği)" },
          { no: 14, title: "Su elektriği iletir mi?", detail: "Farklı su türleri test edilerek elektrik iletimi gözlenir. (Okul zili etkinliği)" },
          { no: 15, title: "Limonlu su deneyi", detail: "Farklı sıvıların iletkenliği karşılaştırılır. (Ambulans ses ve ışık etkinliği)" },
          { no: 16, title: "Su deneyi — transistörlü", detail: "Su iletkenliğinin transistörle gözlenmesi. (Işıklı okul çantası etkinliği)" },
          { no: 17, title: "Hırsız alarmı", detail: "İzinsiz girişte sesli uyarı veren devre. (Robotik araç etkinliği)" },
          { no: 18, title: "Yağmur alarmı", detail: "Su iletkenliğiyle tetiklenen transistör devreyi tamamlar ve LED yakarak uyarı verir." },
          { no: 19, title: "İnsan vücudunun elektriği iletmesi", detail: "Vücut iletkenliğiyle transistörün beyz ucu tetiklenir, küçük akım yükseltilerek LED yakılır." },
          { no: 20, title: "Karbon reosta", detail: "Grafit yüzeydeki temas mesafesiyle değişen direnç, LED parlaklığını kontrol eder." },
          { no: 22, title: "Su deposu seviye ikazı", detail: "Yükselen suyun iletkenliğiyle tetiklenen devre, deponun dolduğunu LED ile haber verir." },
          { no: 23, title: "Dokunmatik disko ışıkları", detail: "Dokunmatik uçlara temas edildiğinde artan gerilime göre LED'ler sırayla yanar." },
        ],
      },
      {
        title: "Motor, Jeneratör ve Dişli",
        summary: "Elektriğin harekete, hareketin elektriğe dönüşmesi.",
        weeks: [
          { no: 24, title: "DC motor", detail: "Devreye verilen doğru akım enerjisiyle motor dönerek pervaneyi çalıştırır." },
          { no: 25, title: "Motor dönüş yönünü değiştirelim", detail: "Uçlara ters voltaj verilerek motorun ve pervanenin dönüş yönü tersine çevrilir." },
          { no: 26, title: "Jeneratör", detail: "Kol çevrilerek elde edilen mekanik enerji elektriğe dönüşür ve LED yanar." },
          { no: 27, title: "Jeneratörün akım yönü", detail: "Çevirme yönüne göre akım yönü değişir; farklı renkte LED'ler yanar." },
          { no: 28, title: "Jeneratörün motor olarak çalışması", detail: "Verilen elektrik enerjisi jeneratör modülünde mekanik enerjiye dönüşür." },
          { no: 29, title: "Dişli kutusu ve dönüş hızı", detail: "Dişli sistemiyle yüksek hız, düşük hıza fakat yüksek torka dönüştürülür." },
          { no: 30, title: "Bisiklet dinamosu", detail: "Dönme hızı arttıkça voltaj yükselir; farklı çalışma voltajlı LED'ler sırayla parlar." },
          { no: 31, title: "Motor ve jeneratör", detail: "Jeneratörün ürettiği elektrikle motor döner; yöne göre pervane yönü değişir." },
        ],
      },
      {
        title: "Yenilenebilir Enerji ve Depolama",
        summary: "Rüzgâr, güneş ve aküyle çalışan gerçek sistemler.",
        weeks: [
          { no: 32, title: "Rüzgâr türbini", detail: "Rüzgârla dönen pervane elektrik üretir ve LED yanar. Bataryaların kimyasal enerjiyi depolaması işlenir." },
          { no: 33, title: "Akü ve süper kapasitör", detail: "Süper kapasitör enerjiyi depolayarak pil kesildikten sonra da LED'i bir süre yakar." },
          { no: 34, title: "Oto şarj dinamosu", detail: "Jeneratörle üretilen enerji aküyü şarj eder; depolanan enerjiyle LED yanar." },
          { no: 36, title: "Mekanik kollu siren", detail: "Şarj edilen akü yeterli voltaja ulaştığında siren çalar ve akü boşalana kadar sürer." },
          { no: 37, title: "Rüzgâr enerjisinin depolanması", detail: "Türbinin ürettiği elektrik aküde depolanır ve bu enerjiyle LED çalıştırılır." },
          { no: 38, title: "Güneş enerjili LED lamba", detail: "Panel ışığı elektriğe çevirir; ışık miktarına göre LED daha parlak veya zayıf yanar." },
          { no: 39, title: "Güneş enerjisinin depolanması", detail: "Panelin ürettiği elektrik aküde depolanır; akü doldukça LED parlaklığı artar." },
          { no: 40, title: "Sabah alarmı (pilli)", detail: "Güneş doğduğunda panelin ürettiği elektrik transistörü tetikler ve siren çalar." },
          { no: 41, title: "Akülü sabah alarmı", detail: "Panel transistörü tetikler; önceden şarj edilmiş aküdeki enerjiyle siren çalar." },
          { no: 42, title: "Lüksmetre (şarjlı)", detail: "Panele düşen ışık miktarına göre LED parlaklığı değişir." },
          { no: 44, title: "Gece lambası", detail: "Hava kararınca yeşil LED yanar, aydınlanınca söner ve tasarruf sağlar." },
          { no: 45, title: "Akü şarj durumu göstergesi", detail: "Voltaj seviyesine göre farklı renkte LED'ler yanarak şarj durumunu gösterir." },
          { no: 46, title: "Jeneratör ve akü — LED göstergeli", detail: "Aküde biriken enerji ve voltaj seviyesi LED göstergelerden takip edilir." },
          { no: 47, title: "Elektronik anemometre", detail: "Rüzgâr şiddetine bağlı olarak sırayla farklı renkte LED'ler yanarak hızı gösterir." },
          { no: 48, title: "Gün ışığı seviye göstergesi", detail: "Işık arttıkça panel voltajı yükselir ve LED'ler sırayla yanar." },
          { no: 49, title: "Güneş enerjili şarjlı vantilatör", detail: "Panel aküyü şarj eder; butona basıldığında aküdeki enerjiyle vantilatör döner." },
        ],
      },
      {
        title: "Statik Elektrik",
        summary: "Yük, çekim ve itme kavramlarının gözle görülür deneyleri.",
        weeks: [
          { no: 50, title: "Saç dikleştirme", detail: "Sürtünmeyle yüklenen balon, zıt yüklü saçları kendine çekerek dikleştirir." },
          { no: 51, title: "Duvara yapışan balon", detail: "Negatif yüklenen balon duvardaki pozitif yükleri çekerek yapışır." },
          { no: 52, title: "Birbirini iten balonlar", detail: "Aynı yükle yüklenen iki balon birbirini iterek uzaklaşır." },
          { no: 53, title: "Su bükme", detail: "Yüklenen cisim nötr sudaki zıt yükleri çekerek akan suyun yönünü büker." },
          { no: 55, title: "Tuz ve karabiber ayırma", detail: "Yüklenen balon, daha hafif olan karabiber tanelerini çekerek tuzdan ayırır." },
          { no: 56, title: "Kâğıt çekme", detail: "Yüklenen plastik boru veya balon küçük kâğıt parçalarını çeker." },
          { no: 57, title: "Kutu yuvarlama oyunu", detail: "Yüklenen balon alüminyum kutudaki zıt yükleri çekerek kutuyu yuvarlar." },
          { no: 58, title: "Statik elektrikle dönen pervane", detail: "Yüklenen plastik boru yaklaştırıldığında çekim gücüyle pervane döner." },
          { no: 59, title: "Elektroskop", detail: "Yüklü cisim yaklaştığında iletken yapraklar aynı yükle yüklenip açılır." },
        ],
      },
      {
        title: "Dron ve 3D Kalem Aralıkları",
        summary: "Program boyunca üçer hafta olarak serpiştirilen uygulama blokları.",
        weeks: [
          { no: 4, title: "Dron eğitimi", detail: "Dronların temel çalışma prensipleri ve güvenli uçuş teknikleri." },
          { no: 13, title: "3D kalem", detail: "3D kalem kullanarak üç boyutlu basit tasarımlar ve nesneler üretilir." },
          { no: 21, title: "Dron eğitimi", detail: "Dron kumandası kullanımı ve temel manevra teknikleri." },
          { no: 35, title: "3D kalem", detail: "Elektronik devrelere uygun muhafaza veya gövde parçaları tasarlanır." },
          { no: 43, title: "Dron eğitimi", detail: "Belirlenen parkurda hedef noktaya uçuş pratikleri." },
          { no: 54, title: "3D kalem", detail: "Özgün bir proje modeli veya yaratıcı bir yapı oluşturulur." },
        ],
      },
    ],
  },

  /* ------------------------------------------------------------------ */
  {
    id: "elektronik-lehim",
    code: "MFR-03",
    title: "Elektronik Deney ve Lehim Atölyesi",
    relatedDisciplines: ["elektronik", "iha-vtol", "3d-tasarim"],
    ages: "9-13 yaş",
    level: "Orta",
    totalWeeks: 26,
    answer:
      "Elektronik deney ve lehim atölyesi, breadboard üzerinde kurulan " +
      "devreyi havya ile kalıcı bir karta taşımayı öğretir. Öğrenci direnç " +
      "hesabından multimetreyle ölçüme, LDR'li sokak lambasından yangın " +
      "sensörüne kadar her devreyi önce kurar, sonra lehimleyerek kalıcı " +
      "hâle getirir. Programa üç hafta dron eğitimi ve üç hafta 3D kalem " +
      "çalışması eşlik eder.",
    tools: [
      "Havya ve lehim",
      "Multimetre",
      "Direnç, LED, lamba, potansiyometre",
      "LDR ışık sensörü",
      "Ses ve su sensörü",
      "NTC / LM35 sıcaklık sensörü",
      "3D kalem",
    ],
    modules: [
      {
        title: "Direnç ve Ölçüm Deneyleri",
        summary: "Akımın nasıl bölündüğünü ölçerek görmek.",
        weeks: [
          { no: 1, title: "Direnç kontrollü lamba deneyi", detail: "Direncin akıma etkisini gözlemlemek için direnç kullanarak bir lambanın yanması sağlanır." },
          { no: 2, title: "Seri bağlı dirençler", detail: "Dirençler arka arkaya bağlanarak toplam direnç ve lambanın durumu incelenir." },
          { no: 4, title: "Paralel bağlı dirençler", detail: "Dirençler yan yana bağlanarak devredeki akım paylaşımı test edilir." },
          { no: 7, title: "Paralel bağlı lambalar", detail: "Lambalar paralel bağlanarak voltajın ve parlaklığın değişimi gözlenir." },
          { no: 8, title: "Akım ve gerilim ölçümü", detail: "Multimetre kullanarak devredeki akım (Amper) ve gerilim (Volt) ölçülür." },
        ],
      },
      {
        title: "Sensörlü Devreler",
        summary: "Işığa, sese, suya ve sıcaklığa tepki veren sistemler.",
        weeks: [
          { no: 11, title: "Dokunmatik lamba", detail: "İnsan dokunuşuyla tetiklenen dokunmatik lamba devresi kurulur." },
          { no: 12, title: "Lamba parlaklığı ayarlama", detail: "Potansiyometre kullanarak lambanın ışık şiddeti ayarlanır." },
          { no: 13, title: "Otomatik sokak lambası", detail: "LDR ışık sensörü ile karanlıkta otomatik yanan sokak lambası yapılır." },
          { no: 16, title: "Müzik ritmine duyarlı lamba", detail: "Mikrofondan aldığı ses ve ritme göre yanıp sönen lamba devresi kurulur." },
          { no: 18, title: "Yağmur alarmı", detail: "Su/yağmur sensörüyle damlaları algılayan, sesli ve ışıklı uyarı veren alarm." },
          { no: 20, title: "Aşırı sıcaklık uyarısı", detail: "NTC/LM35 sıcaklık sensörü ile ortam ısındığında uyarı veren devre." },
          { no: 23, title: "El çırpma ile lamba yakma", detail: "Ses sensörü kullanarak el çırpma sesiyle açılıp kapanan lamba devresi." },
        ],
      },
      {
        title: "Lehim Atölyesi",
        summary: "Kurulan her devrenin havyayla kalıcı karta taşınması.",
        weeks: [
          { no: 5, title: "Lehim: dirençli LED yakma", detail: "Havyayla tanışılır; LED'e direnç lehimlenerek devre elemanları birleştirilir." },
          { no: 9, title: "Lehim: multimetre", detail: "Ölçüm cihazlarıyla çalışmayı kolaylaştıracak lehimli devre bağlantıları yapılır." },
          { no: 14, title: "Lehim: sokak lambası", detail: "Tasarlanan sokak lambası devresi kalıcı bir kart üzerine lehimlenir." },
          { no: 17, title: "Lehim: ritme duyarlı lambalar", detail: "Müzik ritmine duyarlı devrenin bileşenleri lehimlenerek sağlamlaştırılır." },
          { no: 19, title: "Lehim: yağmur alarmı", detail: "Yağmur alarmı devresinin lehimleme işlemleri tamamlanır." },
          { no: 21, title: "Lehim: yangın sensörü", detail: "Alev/yangın sensörüyle yapılan uyarı sistemi lehimlenip hazır hâle getirilir." },
          { no: 24, title: "Lehim: ambulans lambaları", detail: "Kırmızı ve mavi LED'lerle ambulans çakar lambası devresi tasarlanıp lehimlenir." },
          { no: 26, title: "Lehim: hırsız alarmı", detail: "LDR ve lazer/hareket sensörü kombinasyonuyla çalışan hırsız alarmı." },
        ],
      },
      {
        title: "Dron ve 3D Kalem Aralıkları",
        summary: "Elektronik haftalarının arasına yerleştirilen uygulama blokları.",
        weeks: [
          { no: 3, title: "Dron eğitimi", detail: "Dronların temel çalışma prensipleri ve güvenli uçuş teknikleri." },
          { no: 6, title: "3D kalem", detail: "3D kalem kullanarak üç boyutlu basit tasarımlar ve nesneler üretilir." },
          { no: 10, title: "Dron eğitimi", detail: "Dron kumandası kullanımı ve temel manevra teknikleri." },
          { no: 15, title: "3D kalem", detail: "Elektronik devrelere uygun muhafaza veya gövde parçaları tasarlanır." },
          { no: 22, title: "Dron eğitimi", detail: "Belirlenen parkurda hedef noktaya uçuş pratikleri." },
          { no: 25, title: "3D kalem", detail: "Özgün bir proje modeli veya yaratıcı bir yapı oluşturulur." },
        ],
      },
    ],
  },

  /* ------------------------------------------------------------------ */
  {
    id: "arduino-robotik",
    code: "MFR-04",
    title: "Arduino ile Robotik ve Kodlama",
    relatedDisciplines: ["kodlama", "robotik", "elektronik", "3d-tasarim", "girisimcilik"],
    ages: "11-16 yaş",
    level: "İleri",
    totalWeeks: 49,
    answer:
      "Arduino ile robotik ve kodlama programı dört döneme yayılır ve metin " +
      "tabanlı programlamayla gerçek donanımı birleştirir. Birinci dönem " +
      "temel elektronik ve programlama mantığı, ikinci dönem motorlar ve " +
      "ekranlar, üçüncü dönem oyun tasarımı, robot kol ve 3D modelleme, " +
      "dördüncü dönem kablosuz kontrol ve bitirme projesidir. Yıl, " +
      "öğrencinin 3D yazıcıda bastığı gövdeye kendi devresini ve kodunu " +
      "yerleştirip projesini sunmasıyla kapanır.",
    tools: [
      "Arduino IDE ve kart",
      "Breadboard, direnç, LED, buzzer",
      "HC-SR04, LDR, mikrofon, SW-420",
      "Servo, DC motor, L298N sürücü",
      "I2C LCD, 0.96\" OLED",
      "IR alıcı, HC-05 Bluetooth",
      "Röle, su pompası, toprak nem sensörü",
      "Tinkercad / Fusion 360, 3D yazıcı",
    ],
    modules: [
      {
        title: "1. Dönem — Temel Elektronik ve Programlama Mantığı",
        summary: "1-13. hafta: ilk kod, ilk devre, ilk karar yapısı.",
        weeks: [
          { no: 1, title: "Arduino dünyasına giriş", detail: "IDE kurulumu, kart tanıma ve ilk LED yakma (Blink)." },
          { no: 2, title: "Devre kurulum temelleri", detail: "Breadboard üzerindeki akım hatları öğrenilerek direnç hesabıyla çoklu LED kontrolü." },
          { no: 3, title: "Karar yapıları (if-else)", detail: "Touch sensörden alınan veriyle if-else komutları ve switch mantığı uygulanır." },
          { no: 4, title: "Haberleşme temelleri", detail: "Serial port kullanımı; Arduino ile bilgisayar arasında çift yönlü veri iletişimi." },
          { no: 5, title: "Analog okuma ve PWM", detail: "Potansiyometreyle analog sinyal okunur, analogWrite ile LED parlaklığı ayarlanır." },
          { no: 6, title: "Ses ve girdi", detail: "Buton girdileriyle tetiklenen buzzer üzerinden farklı frekanslarda basit melodiler." },
          { no: 7, title: "İki kişilik LED yarışı oyunu", detail: "Öğrenilen mantıksal kontroller birleştirilerek rekabetçi bir refleks oyunu tasarlanır." },
          { no: 8, title: "Çevresel algılama", detail: "Optik (LDR) sensör ve ses algılayıcı (mikrofon) devreye entegre edilir ve kodlanır." },
          { no: 9, title: "Diziler ve döngüler", detail: "For/while döngüleri ve diziler kullanılarak gelişmiş LED animasyonları yapılır." },
          { no: 10, title: "Ultrasonik mesafe ölçümü", detail: "HC-SR04'ün ses dalgası yansıma prensibi kavranır ve mesafe hesaplanır." },
          { no: 11, title: "Araç park sensörü projesi", detail: "Mesafe verisine bağlı olarak buzzer ve LED'lerin uyarı frekansı değişir." },
          { no: 12, title: "Rastgelelik (random)", detail: "Programa şans faktörü katan rastgele sayı üreten fonksiyonların kullanımı." },
          { no: 13, title: "Dönem sonu sınavı", detail: "Devre kurulumu ve temel programlama konularını kapsayan değerlendirme." },
        ],
      },
      {
        title: "2. Dönem — Hareket, Motorlar ve Ekran Teknolojileri",
        summary: "13-27. hafta: kütüphaneler, servo, röle ve LCD.",
        weeks: [
          { no: 14, title: "Kütüphane mantığı ve servo temelleri", detail: "Harici kütüphane ekleme mantığı ve servo motor çalışma prensibi." },
          { no: 15, title: "Servo ile açı kontrolü ve bariyer", detail: "Servo motorun hassas açılara döndürülmesiyle otomatik bariyer uygulaması." },
          { no: 16, title: "Otomatik açılan çöp kutusu — 1", detail: "Mesafe sensöründen gelen el yaklaşma verisiyle servo tetiklenerek kapak açılır." },
          { no: 17, title: "Otomatik açılan çöp kutusu — 2", detail: "Mekanik entegrasyon tamamlanır, kod optimize edilerek kararlı çalışma sağlanır." },
          { no: 18, title: "Joystick modülü", detail: "Çift eksenli joystick incelenerek yatay ve dikey hareket verileri okunur." },
          { no: 19, title: "Joystick ile servo kontrolü", detail: "Joystick konumuyla servo açısı eşzamanlı olarak kontrol edilir." },
          { no: 20, title: "Joystick ve mesafe sensörüyle manuel tarama", detail: "Çevresel veriler manuel olarak toplanır." },
          { no: 21, title: "Röle, su pompası ve toprak nem sensörü", detail: "Düşük voltajlı Arduino ile yüksek akım çeken pompaların röleyle kontrolü." },
          { no: 22, title: "Otomatik bitki sulama sistemi", detail: "Toprak nem sensöründen gelen kuru bilgisiyle röle tetiklenir, pompa devreye girer." },
          { no: 23, title: "Deprem / sarsıntı dedektörü", detail: "SW-420 titreşim sensörüyle erken uyarı ve güvenlik alarmı kodlanır." },
          { no: 24, title: "LCD ekran kullanımı", detail: "Karakter tabanlı LCD ekranların kablolaması ve kütüphane yapısı; ekrana metin yazdırma." },
          { no: 25, title: "LCD üzerine anlık veri yazdırma", detail: "Sensör verileri ve motor konumları eşzamanlı olarak ekrandan takip edilir." },
          { no: 26, title: "Kızılötesi (IR) alıcı ve kumanda", detail: "IR sinyallerin okunması ve kumanda tuşlarının kod karşılıklarının çözümlenmesi." },
          { no: 27, title: "Kumandayla LCD ve LED kontrolü", detail: "Uzaktan kumandayla kablosuz LED kontrolü ve ekrana metin gönderme." },
        ],
      },
      {
        title: "3. Dönem — Oyun Tasarımı, Mekanik Sistemler ve 3D Modelleme",
        summary: "25-37. hafta: robot kol, akıllı ev ve 3D tasarım.",
        weeks: [
          { no: 28, title: "Dinozor oyunu", detail: "LCD ekran ve buton ile engellerden zıplama temelli klasik oyun kurgulanır." },
          { no: 29, title: "Uzay gemisi ateş etme oyunu", detail: "Joystick/buton girdileriyle hareket eden nesnelerin etkileşime girdiği oyun kodlanır." },
          { no: 30, title: "Çoklu servo ve robot kol mekaniği", detail: "Birden fazla servonun bir arada çalışarak eklemli mekanik yapı oluşturması." },
          { no: 31, title: "Robot kol montajı ve kodlama — 1", detail: "Mekanik parçalar birleştirilerek temel eksen hareketleri ve kalibrasyon kodları yazılır." },
          { no: 32, title: "Robot kol montajı ve kodlama — 2", detail: "Hassas konumlandırma ve nesne kavrama (kıskaç) fonksiyonları eklenir." },
          { no: 33, title: "Akıllı ev projesi — 1", detail: "Sensörler, ışıklar ve otomatik kapı sistemlerinin ilk entegrasyon adımları." },
          { no: 34, title: "Akıllı ev projesi — 2", detail: "Tüm elektronik bileşenler bir araya getirilerek toplu test ve optimizasyon." },
          { no: 35, title: "3D modellemeye giriş", detail: "Tinkercad / Fusion 360 arayüzü, temel geometrik şekiller ve milimetrik ölçülendirme." },
          { no: 36, title: "3D tasarım pratikleri", detail: "Delik açma, birleştirme, hizalama; Arduino kartı ve sensör yuvası tasarımı." },
          { no: 37, title: "İleri seviye 3D tasarım", detail: "Menteşeler, dişliler ve vida gerektirmeyen geçmeli (interlocking) kutu tasarımları." },
          { no: 38, title: "Dilimleme (slicer) ve baskı", detail: "STL formatı, dolgu oranı, katman yüksekliği ve baskıya gönderme mantığı." },
          { no: 39, title: "Bağımsız 3D tasarım çalışması", detail: "Öğrenciler öğrendikleri modelleme tekniklerini kendi özgün tasarımlarıyla pekiştirir." },
          { no: 40, title: "Dönem sonu sınavı", detail: "Oyun kodlama, mekanik robotik sistemler ve 3D tasarımı içeren teorik ve pratik sınav." },
        ],
      },
      {
        title: "4. Dönem — Kablosuz Kontrol, Robotik ve Bitirme Projesi",
        summary: "37-49. hafta: Bluetooth, mobil robot ve yıl sonu projesi.",
        weeks: [
          { no: 41, title: "Bluetooth modülü (HC-05)", detail: "Kablosuz seri haberleşme mantığı ve akıllı telefonla eşleşme süreçleri." },
          { no: 42, title: "Mobil kontrol", detail: "Telefon arayüzünden gönderilen komutlarla uzaktaki röle ve LED'lerin denetimi." },
          { no: 43, title: "OLED ekran kullanımı", detail: "0.96 inç OLED üzerinde detaylı grafik ve dinamik metin çizdirme." },
          { no: 44, title: "RGB ambiyans aydınlatması", detail: "Renk kanallarının analog harmanlanmasıyla kişiselleştirilebilir aydınlatma." },
          { no: 45, title: "L298N motor sürücü", detail: "Yüksek güçlü DC motorların yön ve hız ayarları için sürücü entegrasyonu." },
          { no: 46, title: "Mini mobil robot — 1", detail: "İki tekerlekli robot şasisine sensörler eklenerek otonom sürüş temelleri atılır." },
          { no: 47, title: "Mini mobil robot — 2", detail: "Robotun çevresel engelleri algılayıp yön değiştiren algoritmaları geliştirilir." },
          { no: 48, title: "Mini mobil robot — 3", detail: "Temizlik veya engelden kaçış mekanizmaları tam kapasite çalıştırılarak saha testleri." },
          { no: 49, title: "Yıl sonu projesi: tasarım ve baskı", detail: "Öğrencilerin bitirme projelerinin gövdeleri 3D yazıcıda basılır ve monte edilir." },
          { no: 50, title: "Yıl sonu projesi: kodlama ve entegrasyon", detail: "Devreler basılan 3D parçalarla birleştirilir ve yazılımları karta yüklenir." },
          { no: 51, title: "Yıl sonu projesi: test ve hata ayıklama", detail: "Olası hatalar giderilir; kod kararlılığı ve mekanik sağlamlık test edilir." },
          { no: 52, title: "Yıl sonu projesi: sunum hazırlığı", detail: "Proje raporu veya sergi posteri hazırlanır, topluluk önünde savunma yapılır." },
        ],
      },
    ],
  },
] as const;

/** Toplam ders haftası — sayfada ve şemada aynı sayı görünsün diye türetilir. */
export const curriculumTotalWeeks = curriculum.reduce((n, p) => n + p.totalWeeks, 0);

export const curriculumById = new Map(curriculum.map((p) => [p.id, p]));
