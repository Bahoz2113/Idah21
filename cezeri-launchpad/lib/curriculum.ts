/**
 * MÜFREDAT — dört program, ~169 hafta.
 *
 * Her hafta bir TEMA taşır. Animasyonlar tema düzeyinde bağlanır: 18 tema,
 * 18 animasyon. Hafta başına animasyon ne mümkün ne de gerekliydi.
 * Ayrıntı: artifacts/mufredat-ve-animasyon-plani.md
 */

export type ThemeId =
  | "devre"      // devre temeli & LED
  | "direnc"     // direnç, potansiyometre, parlaklık
  | "lehim"      // lehim / havya
  | "isik"       // ışık sensörü (LDR)
  | "ses"        // ses sensörü & buzzer
  | "su"         // su / yağmur / nem
  | "sicaklik"   // sıcaklık sensörü
  | "mesafe"     // ultrasonik mesafe
  | "transistor" // transistör & anahtarlama
  | "motor"      // motor, servo, hareket
  | "jenerator"  // jeneratör & enerji dönüşümü
  | "depolama"   // akü, kapasitör
  | "statik"     // statik elektrik
  | "uretim"     // 3D kalem / modelleme / baskı
  | "dron"       // dron eğitimi
  | "blok"       // blok kodlama (ScratchJr)
  | "ekran"      // ekran & haberleşme
  | "robot";     // robot kol & mobil robot

export const THEME_LABEL: Readonly<Record<ThemeId, string>> = {
  devre: "Devre & LED",
  direnc: "Direnç & Parlaklık",
  lehim: "Lehim",
  isik: "Işık Sensörü",
  ses: "Ses & Buzzer",
  su: "Su & Nem Sensörü",
  sicaklik: "Sıcaklık Sensörü",
  mesafe: "Mesafe Ölçümü",
  transistor: "Transistör",
  motor: "Motor & Servo",
  jenerator: "Jeneratör & Enerji",
  depolama: "Enerji Depolama",
  statik: "Statik Elektrik",
  uretim: "3B Tasarım & Baskı",
  dron: "Dron",
  blok: "Blok Kodlama",
  ekran: "Ekran & Haberleşme",
  robot: "Robotik",
};

/** [hafta no, tema, başlık, açıklama] */
type W = readonly [number, ThemeId, string, string];

export interface Week {
  readonly no: number;
  readonly theme: ThemeId;
  readonly title: string;
  readonly body: string;
}

export interface Term {
  readonly title: string;
  readonly from: number;
  readonly to: number;
}

export interface Program {
  readonly slug: string;
  readonly title: string;
  readonly shortTitle: string;
  readonly ageRange: string;
  readonly weekCount: number;
  readonly lead: string;
  /** GEO: soru biçimli başlık + tek başına anlamlı cevap */
  readonly question: string;
  readonly answer: string;
  readonly terms?: readonly Term[];
  readonly weeks: readonly Week[];
}

const toWeeks = (rows: readonly W[]): Week[] =>
  rows.map(([no, theme, title, body]) => ({ no, theme, title, body }));

// ══════════════════════════════════════════════════════════════
// P1 — İLKOKUL ATÖLYE (59 hafta)
// ══════════════════════════════════════════════════════════════
const P1: readonly W[] = [
  [1, "devre", "Elektrik devresi ve akım", "Basit elektrik devresini kurar ve elektrik akımının oluşumunu açıklar. (LED Yakma Etkinliği)"],
  [2, "direnc", "Direnç", "Direncin elektrik devresindeki görevini öğrenir; akımı sınırlayarak devrenin güvenli çalışmasını açıklar. (Direnç ve LED Etkinliği)"],
  [3, "devre", "LED'i tanıyalım", "LED'in yapısını ve çalışma prensibini açıklar. Doğru bağlantı yönünü öğrenerek devrede güvenli kullanımını uygular. (Paralel LED'ler Etkinliği)"],
  [4, "dron", "Dron eğitimi", "Dronların temel çalışma prensiplerini ve güvenli uçuş tekniklerini öğrenir."],
  [5, "devre", "İletkenlik test aleti", "İletken ve yalıtkan maddeleri ayırt eder. İletkenlik test devresini kurarak farklı malzemeleri test eder. (Buton ve LED Etkinliği)"],
  [6, "devre", "Yalıtkanlık test aleti", "Yalıtkan maddelerin özelliklerini tanır. Farklı malzemeleri test ederek elektriği iletmeyen maddeleri belirler. (Yaya Geçidi Etkinliği)"],
  [7, "devre", "Oto sağ sol sinyali", "Araçlarda sinyal sisteminin çalışma prensibini öğrenir. Devreyi kurarak sinyal lambalarının doğru çalışmasını uygular. (El Feneri Etkinliği)"],
  [8, "ses", "Polis sireni", "Polis sireni devresinin çalışma prensibini öğrenir ve devreyi kurarak sirenin doğru çalışmasını uygular. (Buton ve Buzzer Etkinliği)"],
  [9, "transistor", "Transistör", "Transistörün yapısını ve görevini öğrenir. Devrede anahtarlama ve akım kontrolünü uygulamalı olarak açıklar. (Robot Gözü Etkinliği)"],
  [10, "ses", "Deprem alarmı", "Deprem alarmı devresinin çalışma prensibini öğrenir; sarsıntı anında sesli ve ışıklı uyarı sistemini uygular. (Karton Ev Aydınlatma Etkinliği)"],
  [11, "devre", "İğne iplik oyunu", "İletkenlik prensibini eğlenceli bir uygulama ile öğrenir. Devreyi kurarak dikkat ve el becerisini geliştirir. (Işıklı Kalp Etkinliği)"],
  [12, "ses", "Rüzgâr alarmı", "Rüzgâr alarmı devresinin çalışma prensibini öğrenir; rüzgâr etkisinde sesli ve ışıklı uyarı sistemini uygular. (Renkli LED'ler ve Direnç Etkinliği)"],
  [13, "uretim", "3D kalem", "3D kalem kullanarak üç boyutlu basit tasarımlar ve nesneler üretir."],
  [14, "su", "Su elektriği iletir mi?", "Suyun elektrik iletkenliği hakkında bilgi edinir. Farklı su türlerini test ederek elektrik iletimini gözlemler. (Okul Zili Etkinliği)"],
  [15, "su", "Limonlu su deneyi", "Limonlu suyun elektrik iletkenliğini gözlemler. Farklı sıvıları karşılaştırarak iletkenlik özelliklerini değerlendirir. (Ambulans Ses ve Işık Etkinliği)"],
  [16, "su", "Su deneyi — transistörlü", "Transistörlü su devresinin çalışma prensibini öğrenir. Su iletkenliğini transistör kullanarak uygulamalı gözlemler. (Işıklı Okul Çantası Etkinliği)"],
  [17, "isik", "Hırsız alarmı", "Hırsız alarmı devresinin çalışma prensibini öğrenir; izinsiz girişte sesli uyarı sistemini uygular. (Robotik Araç Etkinliği)"],
  [18, "su", "Yağmur alarmı", "Su iletkenliğiyle tetiklenen transistör devreyi tamamlar ve LED yakarak ışıklı uyarı verir."],
  [19, "transistor", "İnsan vücudunun elektriği iletimi", "İnsan vücudunun iletkenliğiyle transistörün beyz ucu tetiklenerek küçük akım yükseltilir ve LED yakılır."],
  [20, "direnc", "Karbon reosta", "Grafit yüzeydeki temas mesafesiyle değişen direnç, transistörün beyz akımını ve LED'in parlaklığını kontrol eder."],
  [21, "dron", "Dron eğitimi", "Dron kumandası kullanımını ve temel manevra tekniklerini pratik eder."],
  [22, "su", "Su deposu seviye ikazı", "Yükselen suyun iletkenliğiyle tetiklenen transistör devreyi tamamlar ve LED'i yakarak deponun dolduğunu haber verir."],
  [23, "transistor", "Dokunmatik disko ışıkları", "Dokunmatik uçlara temas edildiğinde transistör tetiklenir; artan gerilime göre LED'ler sırayla yanarak ışık efekti oluşturur."],
  [24, "motor", "DC motor — doğru akım motoru", "Anahtar ve buton kapandığında devreye verilen doğru akım enerjisiyle DC motor dönerek pervaneyi çalıştırır."],
  [25, "motor", "Motor dönüş yönünü değiştirelim", "Motorun (+) ve (−) uçlarına ters voltaj verilerek motorun ve pervanenin dönüş yönü tersine değiştirilir."],
  [26, "jenerator", "Jeneratör", "Jeneratör kolunun çevrilmesiyle elde edilen mekanik enerji elektrik enerjisine dönüştürülerek LED'in yanması sağlanır."],
  [27, "jenerator", "Jeneratörün akım yönünü değiştirelim", "Jeneratör kolunun çevrilme yönüne göre akımın yönü değişir ve buna bağlı olarak farklı renklerdeki LED'ler yanar."],
  [28, "jenerator", "Jeneratörün motor olarak çalıştırılması", "Devreden verilen elektrik enerjisi jeneratör modülünde mekanik enerjiye dönüşerek kolun dönmesini sağlar."],
  [29, "jenerator", "Dişli kutusu — dönüş hızı", "Dişli sistemi ile motorun yüksek hızı, jeneratör kolunda düşük hıza fakat yüksek torka dönüştürülür."],
  [30, "jenerator", "Bisiklet dinamosu", "Jeneratörün dönme hızı arttıkça voltaj yükselir ve farklı çalışma voltajına sahip LED'ler sırayla daha parlak yanar."],
  [31, "jenerator", "Motor ve jeneratör", "Jeneratörün ürettiği elektrikle motor döner; kolun çevrilme yönüne göre pervanenin yönü değişir."],
  [32, "jenerator", "Rüzgâr türbini", "Rüzgârın etkisiyle dönen pervane elektrik üretir ve üretilen bu enerjiyle LED yanar."],
  [33, "depolama", "Akü — süper kapasitör", "Süper kapasitör elektrik enerjisini depolayarak pil bağlantısı kesilse bile LED'in bir süre daha yanmasını sağlar."],
  [34, "depolama", "Oto şarj dinamosu", "Jeneratörün çevrilmesiyle üretilen elektrik enerjisi aküyü şarj eder ve depolanan bu enerjiyle LED yanar."],
  [35, "uretim", "3D kalem", "3D kalem ile elektronik devrelere uygun muhafaza veya gövde parçaları tasarlar."],
  [36, "ses", "Mekanik kollu siren", "Jeneratörle şarj edilen akü yeterli voltaja ulaştığında siren çalmaya başlar ve akü boşalana kadar devam eder."],
  [37, "jenerator", "Rüzgâr enerjisinin depolanması", "Rüzgârla dönen türbinin ürettiği elektrik aküde depolanır ve bu enerjiyle LED çalıştırılır."],
  [38, "jenerator", "Güneş enerjili LED lamba", "Güneş paneli ışığı elektriğe dönüştürür; ışık miktarına bağlı olarak LED daha parlak veya zayıf yanar."],
  [39, "jenerator", "Güneş enerjisinin depolanması", "Güneş panelinin ürettiği elektrik aküde depolanır; akü doldukça sarı LED'in parlaklığı artar."],
  [40, "isik", "Sabah alarmı — pilli", "Güneş doğduğunda panelin ürettiği elektrik transistörü tetikler ve siren çalmaya başlar."],
  [41, "isik", "Akülü sabah alarmı", "Güneş paneli transistörü tetikler ve önceden şarj edilen aküdeki enerjiyle siren çalmaya başlar."],
  [42, "isik", "Lüksmetre — şarjlı", "Güneş paneline düşen ışık miktarına göre LED'in parlaklığı değişir; ışık şiddeti arttıkça LED daha parlak yanar."],
  [43, "dron", "Dron eğitimi", "Dron ile belirlenen bir parkurda hedef noktaya uçuş pratikleri gerçekleştirilir."],
  [44, "isik", "Gece lambası", "Hava karardığında otomatik olarak yeşil LED yanar, ortam aydınlandığında ise LED sönerek tasarruf sağlar."],
  [45, "depolama", "Akü şarj durumu göstergesi", "Aküdeki voltaj seviyesine göre farklı renklerdeki LED'ler yanarak şarj durumunu gösterir."],
  [46, "depolama", "Jeneratör ve akü — LED göstergeli", "Jeneratör çevrilerek akü şarj edilir; biriken enerji miktarı ve voltaj seviyesi LED göstergeler üzerinden takip edilir."],
  [47, "jenerator", "Elektronik anemometre", "Rüzgârın pervaneyi döndürmesiyle üretilen elektrik, rüzgâr şiddetine bağlı olarak farklı renklerdeki LED'leri sırayla yakar."],
  [48, "jenerator", "Gün ışığı seviye göstergesi", "Gün ışığı arttıkça panelin ürettiği voltaj yükselir ve LED'ler sırayla yanarak ışık seviyesini gösterir."],
  [49, "jenerator", "Güneş enerjili şarjlı vantilatör", "Güneş paneli aküyü şarj eder; butona basıldığında aküdeki enerjiyle vantilatör motoru döner."],
  [50, "statik", "Saç dikleştirme", "Sürtünmeyle yüklenen balon, statik elektrik sayesinde zıt yüklü saçları kendine doğru çekerek dikleştirir."],
  [51, "statik", "Duvara yapışan balon", "Sürtünmeyle negatif yüklenen balon, duvardaki pozitif yükleri çekerek duvara yapışır."],
  [52, "statik", "Birbirini iten balonlar", "Sürtünmeyle aynı (negatif) yükle yüklenen iki balon, aynı yükler birbirini ittiği için birbirinden uzaklaşır."],
  [53, "statik", "Su bükme", "Sürtünmeyle yüklenen cisim, nötr sudaki zıt yükleri çekerek akan suyun yönünü büker."],
  [54, "uretim", "3D kalem", "3D kalem ile özgün bir proje modeli veya yaratıcı bir yapı oluşturur."],
  [55, "statik", "Tuz ve karabiber ayırma", "Sürtünmeyle yüklenen balon karışıma yaklaştırıldığında daha hafif olan karabiber taneleri balona yapışarak tuzdan ayrılır."],
  [56, "statik", "Kâğıt çekme", "Sürtünmeyle yüklenen plastik boru veya balon, statik elektrik sayesinde küçük kâğıt parçalarını kendine çeker."],
  [57, "statik", "Kutu yuvarlama oyunu", "Sürtünmeyle yüklenen balon, alüminyum kutudaki zıt yükleri çekerek kutuyu kendisine doğru yuvarlar."],
  [58, "statik", "Statik elektrikle dönen pervane", "Sürtünmeyle yüklenen plastik boru pervaneye yaklaştırıldığında, statik elektriğin çekim gücüyle pervane dönmeye başlar."],
  [59, "statik", "Elektroskop", "Yüklü cisim elektroskoba yaklaştırıldığında iletken yapraklar aynı yükle yüklenip birbirini iterek açılır ve cismin yüklü olduğunu gösterir."],
];

// ══════════════════════════════════════════════════════════════
// P2 — ORTAOKUL VE SONRASI ELEKTRONİK (26 hafta)
// ══════════════════════════════════════════════════════════════
const P2: readonly W[] = [
  [1, "direnc", "Direnç kontrollü lamba deneyi", "Direncin akıma etkisini gözlemlemek için direnç kullanarak bir lambanın yanmasını sağlar."],
  [2, "direnc", "Seri bağlı dirençler deneyi", "Dirençleri arka arkaya (seri) bağlayıp devre üzerindeki toplam direnci ve lambanın durumunu inceler."],
  [3, "dron", "Dron eğitimi", "Dronların temel çalışma prensiplerini ve güvenli uçuş tekniklerini öğrenir."],
  [4, "direnc", "Paralel bağlı dirençler deneyi", "Dirençleri yan yana (paralel) bağlayarak devredeki akım paylaşımını test eder."],
  [5, "lehim", "Lehim kullanımı — dirençli LED yakma", "Havyayla tanışıp LED'e direnç lehimleyerek devre elemanlarını birleştirmeyi öğrenir."],
  [6, "uretim", "3D kalem", "3D kalem kullanarak üç boyutlu basit tasarımlar ve nesneler üretir."],
  [7, "direnc", "Paralel bağlı lambalar deneyi", "Lambaları paralel bağlayıp voltajın ve parlaklığın değişimini gözlemler."],
  [8, "direnc", "Akım ve gerilim ölçüm deneyi", "Multimetre kullanarak devredeki akım (Amper) ve gerilimi (Volt) ölçer."],
  [9, "lehim", "Lehim kullanımı — multimetre", "Ölçüm cihazlarıyla çalışmayı kolaylaştıracak lehimli devre bağlantıları yapar."],
  [10, "dron", "Dron eğitimi", "Dron kumandası kullanımını ve temel manevra tekniklerini pratik eder."],
  [11, "transistor", "Dokunmatik lamba deneyi", "İnsan dokunuşuyla tetiklenen (dokunmatik) bir lamba devresi kurar."],
  [12, "direnc", "Lamba parlaklığı ayarlama deneyi", "Potansiyometre kullanarak lambanın ışık şiddetini (parlaklığını) ayarlamayı öğrenir."],
  [13, "isik", "Otomatik sokak lambası deneyi", "LDR (ışık sensörü) kullanarak karanlıkta otomatik yanan sokak lambası yapar."],
  [14, "lehim", "Lehim kullanımı — sokak lambası", "Tasarlanan sokak lambası devresini havya kullanarak kalıcı bir kart üzerine lehimler."],
  [15, "uretim", "3D kalem", "3D kalem ile elektronik devrelere uygun muhafaza veya gövde parçaları tasarlar."],
  [16, "ses", "Müzik ritmine duyarlı lamba", "Mikrofondan aldığı ses ve müzik ritmine göre yanıp sönen bir lamba devresi kurar."],
  [17, "lehim", "Lehim kullanımı — ritme duyarlı lambalar", "Müzik ritmine duyarlı devrenin bileşenlerini lehimleyerek sağlamlaştırır."],
  [18, "su", "Yağmur alarmı deneyi", "Su/yağmur sensörü ile damlaları algılayan ve sesli/ışıklı uyarı veren bir alarm yapar."],
  [19, "lehim", "Lehim kullanımı — yağmur alarmı", "Yağmur alarmı devresinin lehimleme işlemlerini gerçekleştirerek tamamlar."],
  [20, "sicaklik", "Aşırı sıcaklık uyarı deneyi", "Sıcaklık sensörü (NTC/LM35) ile ortam ısındığında uyarı veren bir devre kurar."],
  [21, "lehim", "Lehim kullanımı — yangın sensörü", "Alev/yangın sensörü kullanarak yapılan uyarı sistemini lehimleyip hazır hale getirir."],
  [22, "dron", "Dron eğitimi", "Dron ile belirlenen bir parkurda hedef noktaya uçuş pratikleri gerçekleştirir."],
  [23, "ses", "El çırpma ile lamba yakma deneyi", "Ses sensörü kullanarak el çırpma sesiyle açılıp kapanan bir lamba devresi yapar."],
  [24, "lehim", "Lehim kullanımı — ambulans lambaları", "Kırmızı ve mavi LED'lerle ambulans çakar lambası devresi tasarlayıp lehimler."],
  [25, "uretim", "3D kalem", "3D kalem ile özgün bir proje modeli veya yaratıcı bir yapı oluşturur."],
  [26, "lehim", "Lehim kullanımı — hırsız alarmı", "LDR ve lazer/hareket sensörü kombinasyonuyla çalışan hırsız alarmını lehimleyip projeyi bitirir."],
];

// ══════════════════════════════════════════════════════════════
// P3 — ORTAOKUL VE ÜSTÜ YAZILIM (31 hafta)
// ══════════════════════════════════════════════════════════════
const P3: readonly W[] = [
  [1, "blok", "ScratchJr uygulamasına giriş", "ScratchJr'ın genel tanıtımı yapılır. Sahneye arka plan ve karakter ekleme, karakterleri hareket ettirme uygulamalı öğrenilir."],
  [2, "blok", "Karakter oluşturma ve özelleştirme", "Çizim araçlarıyla kendi karakterlerini çizme, renk değiştirme ve kendi seslerini kaydederek karaktere ses ekleme öğrenilir."],
  [3, "blok", "Döngü bloğu", "Karakterlerin belirlenen hareketleri sürekli tekrarlamasını sağlayan sonsuz döngü bloğunun kullanımı öğrenilir."],
  [4, "blok", "Belirli sayıda tekrar bloğu", "Belirli bir komut dizisini istenilen sayıda çalıştırmayı sağlayan tekrar bloklarının mantığı kavranır."],
  [5, "blok", "Dünyaya yolculuk", "Uzay aracının Ay'dan Dünya'ya gelişini konu alan animasyon tasarlanır; mesafe ve yön komutlarıyla hareket blokları pekiştirilir."],
  [6, "blok", "Akvaryum tasarımı", "Farklı deniz canlılarının bağımsız olarak yüzdüğü bir su altı animasyonu ile çoklu karakter yönetimi ve paralel kodlama öğrenilir."],
  [7, "blok", "Okul gezisi", "Birkaç farklı sahne oluşturulur ve sahneler arası otomatik geçiş kodlaması öğretilir."],
  [8, "blok", "Dans partisi", "Birden fazla karakterin sırayla sahneye geldiği senaryo ile mesaj gönderme/alma ve zamanlama blokları kullanılır."],
  [9, "blok", "Bisiklet ve araba kontrolü", "Sahneye eklenen bisiklet ve araçların ileri-geri hareketleri dokunma ve yön kontrol bloklarıyla kontrol edilir."],
  [10, "blok", "Meyve toplama oyunu", "Ağaçtan düşen meyvelerin sepetle toplandığı ilk etkileşimli oyun tasarlanır; algılama ve temel oyun mantığı öğrenilir."],
  [11, "blok", "Trafikte karşıdan karşıya geçme", "Karakteri güvenle karşıya geçirirken yön kavramları, sıralı komut verme ve temel algoritma mantığı öğrenilir."],
  [12, "blok", "Bir kap su, bir kap mama", "Sokak hayvanlarına yardım temalı animasyonla hareket blokları çalışılırken empati ve paylaşma değerleri pekiştirilir."],
  [13, "blok", "Yaralı hayvanlara yardım", "Olay sıralaması ve senaryo tabanlı kodlama ile hem algoritmik düşünme hem sosyal sorumluluk bilinci geliştirilir."],
  [14, "blok", "Labirent oyunu", "Karakteri doğru komut adımlarıyla labirentin çıkışına ulaştırma; planlama, problem çözme ve deneme-yanılma becerileri güçlendirilir."],
  [15, "blok", "Pacman oyunu", "Hareket, zamanlama, tekrar ve oyun mantığı birleştirilerek daha karmaşık algoritmalar oluşturulur."],
  [16, "devre", "mBlock'a giriş ve LED yakma", "mBlock arayüzü tanıtılır; kart üzerindeki LED'in yakılıp söndürülmesi (Blink) uygulamalı öğretilir."],
  [17, "devre", "Buton ile LED kontrolü", "LED'in bir buton aracılığıyla kontrolü gerçekleştirilir; dijital giriş-çıkış işlemleri kavranır."],
  [18, "direnc", "Potansiyometre ile LED kontrolü", "Potansiyometreden alınan analog veriler okunarak LED'in parlaklığı kontrol edilir; değişken kullanımı kavranır."],
  [19, "isik", "LDR ile otomatik aydınlatma", "Ortamın karanlık/aydınlık durumuna göre LED kontrolü yapılır; koşullu ifadeler (eğer/ise) uygulanır."],
  [20, "direnc", "RGB LED kullanımı", "Kırmızı, yeşil ve mavi renklerin karışımıyla farklı renkler elde edilir; PWM mantığı kullanılır."],
  [21, "sicaklik", "LM35 ile sıcaklık ölçümü", "LM35 sensörüyle ortam sıcaklığı ölçülür ve analog veriler santigrat dereceye dönüştürülerek yorumlanır."],
  [22, "mesafe", "HC-SR04 ultrasonik mesafe sensörü", "Ultrasonik sensörün çalışma prensibi öğrenilir; mesafe verilerinin park sensörü gibi projelerde kullanımı gösterilir."],
  [23, "motor", "Servo motor kontrolü", "Servo motorun çalışma prensibi tanıtılarak belirlenen açılarda (0°-180°) döndürülmesi sağlanır."],
  [24, "sicaklik", "DHT11 ile sıcaklık ve nem ölçümü", "DHT11 sensörüyle sıcaklık ve nem değerleri okunur; dijital verilerin görüntülenmesi ve analizi yapılır."],
  [25, "transistor", "Röle modülü kullanımı", "Rölenin çalışma mantığı tanıtılır; harici cihazların güvenli şekilde anahtarlanması öğretilir."],
  [26, "su", "Toprak nem sensörü ve otomatik sulama", "Toprağın kuruluk/ıslaklık seviyesi ölçülür; sensör verilerine göre çalışan temel otomatik sulama modeli geliştirilir."],
  [27, "su", "Su seviyesi ölçüm sensörü", "Su seviye sensörüyle kaptaki sıvı miktarı ölçülür; verilerin otomasyon ve güvenlik projelerinde kullanımı gösterilir."],
  [28, "su", "Yağmur sensörü kullanımı", "Yüzeydeki iletkenlik değişimine bağlı yağış tespiti yapılır; akıllı ev sistemlerine yönelik kontrol uygulamaları geliştirilir."],
  [29, "mesafe", "MZ80 kızılötesi engel sensörü", "Belirli mesafedeki nesnelerin varlığı algılanır; temassız algılama ve engel tanıyan robotların temel mantığı aktarılır."],
  [30, "ekran", "I2C modüllü LCD ekran", "I2C protokolüyle 16×2 LCD ekrana metin yazdırılır; sensör verilerinin ekranda anlık gösterimi sağlanır."],
  [31, "motor", "L298N ile DC motor kontrolü", "L298N sürücü kartıyla DC motorların yönü ve hızı kontrol edilir; temel mobil robot tasarımına adım atılır."],
];

// ══════════════════════════════════════════════════════════════
// P4 — ARDUINO İLERİ (53 hafta, 4 dönem)
// ══════════════════════════════════════════════════════════════
const P4: readonly W[] = [
  [1, "devre", "Arduino dünyasına giriş", "Arduino geliştirme ortamı tanıtılır, kart bağlanarak ilk temel kod yazılır ve LED yakıp söndürme (Blink) gerçekleştirilir."],
  [2, "devre", "Devre kurulum temelleri", "Breadboard üzerindeki akım hatları öğrenilerek direnç hesabı ile çoklu LED kontrolü sağlanır."],
  [3, "transistor", "Karar yapıları (if-else)", "Dokunmatik sensörden alınan veriler eşliğinde programlamanın temel karar yapısı olan if-else komutları uygulanır."],
  [4, "ekran", "Haberleşme temelleri — serial port", "Arduino ile bilgisayar arasındaki çift yönlü veri iletişimi sağlanarak seri monitör üzerinden bilgi alışverişi yapılır."],
  [5, "direnc", "Analog okuma ve PWM", "Potansiyometre yardımıyla analog sinyaller okunur ve PWM çıkışları kullanılarak LED parlaklığı ayarlanır."],
  [6, "ses", "Ses ve girdi — buzzer ve buton", "Dijital buton girdileriyle tetiklenen buzzer üzerinden farklı frekanslarda sesler ve basit melodiler üretilir."],
  [7, "devre", "LED yarışı oyunu", "Öğrenilen mantıksal kontroller birleştirilerek eğlenceli ve rekabetçi bir refleks oyunu tasarlanır."],
  [8, "isik", "Çevresel algılama — LDR ve mikrofon", "Çevredeki ışık ve ses şiddetini ölçen analog sensörlerin devreye entegrasyonu ve kodlanması öğrenilir."],
  [9, "blok", "Diziler ve döngüler", "Kod tekrarını önleyen döngü yapıları ve veri listeleme sağlayan diziler kullanılarak gelişmiş ışık animasyonları yapılır."],
  [10, "mesafe", "Ultrasonik mesafe sensörü mantığı", "Ses dalgalarının yansıma prensibiyle çalışan ultrasonik sensörün mantığı kavranır ve mesafe hesaplaması yapılır."],
  [11, "mesafe", "Araç park sensörü yapımı", "Mesafe verilerine bağlı olarak buzzer ve LED'lerin uyarı frekansını değiştirdiği pratik bir park sistemi kurulur."],
  [12, "blok", "Rastgelelik — random metodu", "Programa şans faktörü katmak için rastgele sayı üreten fonksiyonların kullanımı öğretilir."],
  [13, "devre", "Dönem sonu değerlendirmesi", "İlk dönem boyunca işlenen elektronik devre kurulumu ve temel programlama konularını kapsayan değerlendirme yapılır."],
  [14, "motor", "Kütüphane mantığı ve servo temelleri", "Harici kütüphane ekleme mantığı ve servo motorun çalışma prensibi anlatılır."],
  [15, "motor", "Servo ile açı kontrolü ve bariyer", "Servo motorun belirli açılara hassas şekilde döndürülmesi sağlanarak otomatik bariyer uygulaması yapılır."],
  [16, "robot", "Otomatik açılan çöp kutusu — 1", "Mesafe sensöründen gelen el yaklaşma verisiyle servo motoru tetikleyerek kapak açma mekanizması tasarlanır."],
  [17, "robot", "Otomatik açılan çöp kutusu — 2", "Mekanik entegrasyon tamamlanıp kod optimizasyonları yapılarak sistemin kararlı çalışması sağlanır."],
  [18, "motor", "Joystick modülü ve eksen okuma", "Çift eksenli joystick modülünün analog yapısı incelenerek yatay ve dikey hareket verileri okunur."],
  [19, "motor", "Joystick ile servo hassas kontrolü", "Joystick kollarının konumu ile servo motorun açısı eşzamanlı olarak kontrol edilir."],
  [20, "mesafe", "Joystick ve mesafe sensörüyle manuel tarama", "Çevresel verileri manuel toplamak amacıyla joystick ve mesafe sensörü birlikte çalıştırılır."],
  [21, "su", "Röle, su pompası ve toprak nem sensörü", "Düşük voltajlı Arduino ile yüksek akım çeken su pompalarının röle aracılığıyla nasıl kontrol edileceği öğrenilir."],
  [22, "su", "Otomatik bitki sulama sistemi", "Toprak nem sensöründen alınan kuru bilgisiyle röle tetiklenerek su pompasının otomatik devreye girmesi sağlanır."],
  [23, "ses", "Titreşim sensörü ile deprem dedektörü", "Ani sarsıntıları algılayan titreşim sensörü (SW-420) ile erken uyarı ve güvenlik alarm mekanizması kodlanır."],
  [24, "ekran", "LCD ekran kullanımı", "Karakter tabanlı LCD ekranların kablolama ve kütüphane yapısı öğrenilerek ekrana metin yazdırılır."],
  [25, "ekran", "Ekran ve hareket", "Anlık sensör verileri ve motor konumları eşzamanlı olarak LCD ekran üzerinden takip edilir."],
  [26, "ekran", "Kızılötesi (IR) alıcı ve kumanda", "Kızılötesi sinyallerin alıcı göz ile okunması ve kumanda tuşlarının kod karşılıklarının çözümlenmesi sağlanır."],
  [27, "ekran", "Kumandayla LCD ve LED kontrolü", "Uzaktan kumanda yardımıyla kablosuz olarak LED'ler açılır ve ekrana istenilen metinler gönderilir."],
  [28, "ekran", "Dönem sonu değerlendirmesi", "İkinci dönemde öğrenilen motorlar, sensörler, ekranlar ve otomasyon sistemlerine yönelik kapsamlı sınav yapılır."],
  [29, "ekran", "Oyun programlama 1 — dinozor oyunu", "Grafik ve karakter mantığı kullanılarak LCD ekran üzerinde engellerden zıplama temelli klasik oyun kurgulanır."],
  [30, "ekran", "Oyun programlama 2 — uzay gemisi", "Kullanıcı girdileriyle hareket eden nesnelerin ekrandaki diğer unsurlarla etkileşime girdiği interaktif oyun kodlanır."],
  [31, "robot", "Çoklu servo ve robot kol mekaniği", "Birden fazla servo motorun bir arada çalışarak eklemli mekanik yapılar oluşturma prensipleri incelenir."],
  [32, "robot", "Robot kol montajı ve kodlaması — 1", "Robot kolun mekanik parçaları birleştirilerek temel eksen hareketleri ve kalibrasyon kodları yazılır."],
  [33, "robot", "Robot kol montajı ve kodlaması — 2", "Hassas konumlandırma ve nesne kavrama (kıskaç) fonksiyonları eklenerek robot kolun operasyonel yeteneği artırılır."],
  [34, "robot", "Akıllı ev projesi — 1", "Farklı oda ve güvenlik senaryolarını içeren akıllı ev sisteminin ilk entegrasyon adımları atılır."],
  [35, "robot", "Akıllı ev projesi — 2", "Projenin tüm elektronik bileşenleri bir araya getirilerek toplu testleri ve optimizasyonları tamamlanır."],
  [36, "uretim", "3D modellemeye giriş", "Tinkercad/Fusion 360'ın temel araçları tanıtılır ve milimetrik ölçülendirme mantığı kavranır."],
  [37, "uretim", "3D tasarım pratikleri", "Elektronik bileşenlerin birebir oturabileceği özel montaj yuvaları ve kutu tasarımları oluşturulur."],
  [38, "uretim", "İleri seviye 3D tasarım", "Vidaya ihtiyaç duymayan geçmeli sistemler, menteşeler ve hareketli mekanik parçalar tasarlanır."],
  [39, "uretim", "Dilimleme (slicer) ve baskı", "Tasarlanan modellerin 3D yazıcının anlayacağı dilimleme parametrelerine dönüştürülme süreçleri öğrenilir."],
  [40, "uretim", "3D tasarım pratikleri — özgün model", "Öğrencilerin öğrendikleri modelleme tekniklerini pekiştirmek için kendi özgün tasarımlarını bağımsız çizmesi sağlanır."],
  [41, "uretim", "Dönem sonu değerlendirmesi", "Oyun kodlama mantığı, mekanik robotik sistemler ve 3D tasarım aşamalarını içeren teorik ve pratik sınav yapılır."],
  [42, "ekran", "Bluetooth modülü (HC-05)", "Bluetooth teknolojisinin kablosuz seri haberleşme mantığı ve akıllı telefonlarla eşleşme süreçleri anlatılır."],
  [43, "ekran", "Mobil kontrol", "Telefon ekranındaki arayüzden gönderilen komutlarla uzaktaki cihazların kablosuz olarak denetlenmesi sağlanır."],
  [44, "ekran", "OLED ekran kullanımı", "Yüksek çözünürlüklü 0.96 inç OLED ekranlar üzerinden detaylı grafiklerin ve dinamik metinlerin çizdirilmesi öğrenilir."],
  [45, "direnc", "RGB renk karıştırma", "Farklı renk kanallarının analog olarak harmanlanmasıyla kişiselleştirilebilir ambiyans aydınlatma sistemleri tasarlanır."],
  [46, "motor", "L298N motor sürücü", "Yüksek güçlü DC motorların yön ve hız ayarlarını yapabilmek için motor sürücü entegrasyonu gerçekleştirilir."],
  [47, "robot", "Mini mobil robot — 1", "İki tekerlekli mobil robot şasisine sensörler eklenerek otonom sürüş temelleri atılır."],
  [48, "robot", "Mini mobil robot — 2", "Robotun çevresel engelleri algılayıp yön değiştiren akıllı algoritmaları geliştirilir."],
  [49, "robot", "Mini mobil robot — 3", "Temizlik veya engelden kaçış mekanizmaları tam kapasite çalıştırılarak saha testleri tamamlanır."],
  [50, "uretim", "Yıl sonu projesi — tasarım ve baskı", "Öğrencilerin sene boyunca edindikleri birikimle tasarladıkları bitirme projelerinin 3D baskı üretimi gerçekleştirilir."],
  [51, "robot", "Yıl sonu projesi — kodlama ve entegrasyon", "Donanım devreleri üretilen fiziksel gövdelerle entegre edilir ve yazılımları karta yüklenir."],
  [52, "robot", "Yıl sonu projesi — test ve hata ayıklama", "Ortaya çıkan projelerin olası hataları giderilir, kod kararlılığı ve mekanik sağlamlığı test edilir."],
  [53, "robot", "Yıl sonu projesi — sunum", "Tamamlanan özgün projelerin topluluk önünde savunulması ve sergilenmesi için sunum materyalleri hazırlanır."],
];

export const PROGRAMS: readonly Program[] = [
  {
    slug: "ilkokul-atolye",
    title: "İlkokul Atölye — Elektrik, Enerji ve Statik",
    shortTitle: "İlkokul Atölye",
    ageRange: "7-12 yaş",
    weekCount: P1.length,
    lead: "Elektriğin ne olduğunu anlatmakla başlamıyoruz; ilk derste devreyi kurup lambayı yakıyoruz. 59 hafta boyunca akım, direnç, transistör, jeneratör, güneş ve rüzgâr enerjisi ile statik elektrik deneyleri yapılıyor.",
    question: "Batman'da ilkokul öğrencileri için robotik ve elektronik atölyesi var mı?",
    answer:
      "Cezeri Robotech, Batman'da ilkokul öğrencilerine yönelik 59 haftalık bir elektrik ve enerji atölyesi yürütür. Program; devre kurulumu, direnç, transistör, jeneratör, güneş ve rüzgâr enerjisi ile statik elektrik deneylerini kapsar ve her hafta uygulamalı bir deneyle işlenir.",
    weeks: toWeeks(P1),
  },
  {
    slug: "elektronik",
    title: "Elektronik — Devre, Lehim ve Sensörler",
    shortTitle: "Elektronik",
    ageRange: "Ortaokul ve üzeri",
    weekCount: P2.length,
    lead: "Havyayı eline alan öğrenci, tasarladığı devreyi kalıcı karta lehimliyor. 26 hafta boyunca direnç hesabından sensörlü alarm sistemlerine kadar her proje hem kuruluyor hem lehimleniyor.",
    question: "Batman'da ortaokul öğrencileri için elektronik kursu nerede?",
    answer:
      "Cezeri Robotech, Batman'da ortaokul ve üzeri öğrencilere 26 haftalık bir elektronik programı sunar. Program; seri ve paralel direnç, multimetre ile ölçüm, LDR, ses ve yağmur sensörleri ile lehimleme uygulamalarını kapsar.",
    weeks: toWeeks(P2),
  },
  {
    slug: "yazilim",
    title: "Yazılım — ScratchJr'dan Fiziksel Programlamaya",
    shortTitle: "Yazılım",
    ageRange: "Ortaokul ve üzeri",
    weekCount: P3.length,
    lead: "İlk 15 hafta blok tabanlı kodlama ile algoritma mantığı kuruluyor; ardından aynı mantık mBlock ile gerçek donanıma taşınıyor. Ekrandaki karakter, sonunda masadaki motora dönüşüyor.",
    question: "Batman'da çocuklar için kodlama kursu müfredatı nasıl?",
    answer:
      "Cezeri Robotech'in 31 haftalık yazılım programı iki bölümden oluşur. İlk 15 hafta ScratchJr ile blok tabanlı kodlama, döngü, koşul ve oyun tasarımını kapsar. Kalan 16 hafta mBlock ile Arduino üzerinde sensör okuma, PWM, servo motor ve LCD ekran uygulamalarını içerir.",
    terms: [
      { title: "ScratchJr — Blok Tabanlı Kodlama", from: 1, to: 15 },
      { title: "mBlock — Fiziksel Programlama", from: 16, to: 31 },
    ],
    weeks: toWeeks(P3),
  },
  {
    slug: "arduino-ileri",
    title: "Arduino İleri — Dört Dönem, Bitirme Projeli",
    shortTitle: "Arduino İleri",
    ageRange: "Lise ve üzeri",
    weekCount: P4.length,
    lead: "Dört dönemlik tam bir mühendislik hattı: temel programlamadan robot kola, 3B modellemeden kablosuz kontrole. Yıl sonunda her öğrenci kendi gövdesini tasarlayıp basıyor, devresini kurup kodunu yazıyor ve projesini savunuyor.",
    question: "Batman'da ileri seviye Arduino ve robotik eğitimi var mı?",
    answer:
      "Cezeri Robotech, Batman'da dört dönemlik ileri seviye bir Arduino programı yürütür. Program; temel programlama ve sensörler, motor ve ekran teknolojileri, oyun tasarımı ile robot kol mekaniği, ve kablosuz kontrol ile mobil robotik konularını kapsar. Program, öğrencinin kendi tasarladığı bitirme projesiyle tamamlanır.",
    terms: [
      { title: "1. Dönem — Temel Elektronik ve Programlama Mantığı", from: 1, to: 13 },
      { title: "2. Dönem — Hareket, Motorlar ve Ekran Teknolojileri", from: 14, to: 28 },
      { title: "3. Dönem — Oyun Tasarımı, Mekanik Sistemler ve 3B Modelleme", from: 29, to: 41 },
      { title: "4. Dönem — Kablosuz Kontrol, Robotik ve Bitirme Projeleri", from: 42, to: 53 },
    ],
    weeks: toWeeks(P4),
  },
];

export function getProgram(slug: string): Program | undefined {
  return PROGRAMS.find((p) => p.slug === slug);
}

export const TOTAL_WEEKS = PROGRAMS.reduce((n, p) => n + p.weekCount, 0);
