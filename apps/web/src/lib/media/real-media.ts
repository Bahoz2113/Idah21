// ══════════════════════════════════════════════════════════════════
// GERÇEK MEDYA MANIFESTİ — Atölye & Saha Deneyimi galerisi
//
// Kurumun Batman atölyesinde ve saha uçuş/fırlatma testlerinde çekilmiş
// GERÇEK fotoğraf ve videoları buradan yönetilir. Dosyalar
// `public/assets/real-media/` altındadır.
//
// TASARIM KARARI — neden manifest:
// Dizini otomatik taramak yerine açık kayıt tutuyoruz. Sebep: her varlığın
// `alt` metni SEO'nun taşıyıcısıdır ve dosya adından türetilemez; ayrıca
// `width`/`height` bilinmeden CLS (düzen kayması) sıfırlanamaz. Manifest bu
// iki alanı ZORUNLU kılar — eksikse TypeScript derlemede durdurur.
//
// Manifest boşken sayfa çökmez: galeri "yakında" iskeletine düşer.
//
// KAYNAK NOTU: Buradaki her varlık kurumun kendi çekimidir. Yapay zeka ile
// üretilmiş marka görselleri (baykuş amblemi, sinematik sekans) KASITLI
// olarak bu listede DEĞİLDİR — `public/assets/brand/` altında ayrı durur.
// "Gerçek atölye deneyimi" vaadi, üretilmiş görsellerle karışmamalıdır.
// ══════════════════════════════════════════════════════════════════

export type MediaCategory =
  | "atolye"      // Atölye içi çalışma
  | "3d-baski"    // 3D yazıcı / üretim
  | "drone"       // İHA / VTOL
  | "saha"        // Saha uçuş / fırlatma testi
  | "robotik"     // Robotik çalışmaları
  | "ekip"        // Ekip / etkinlik
  | "ziyaret";    // Kuruma yapılan resmî ziyaretler

/** Bento ızgarasında kapladığı alan. */
export type MediaSpan = "normal" | "wide" | "tall" | "hero";

/**
 * Varlığın kaynağı.
 *
 * `documentary` — kurumun kendi atölyesinde/sahasında çekilmiş gerçek kayıt.
 * `generated`   — henüz çekimi olmayan bir disiplini temsil eden, yapay zeka
 *                 ile üretilmiş konsept görsel.
 *
 * Bu ayrım kozmetik değil: bölümün başlığı "Simülasyon Değil. Gerçek Atölye."
 * diyor. Üretilmiş bir kare, gerçek çekimlerle ayrımsız sunulursa o cümle
 * yanlış beyan hâline gelir. Bu yüzden `generated` varlıklar kartın üstünde
 * görünür bir "konsept" etiketi taşır ve schema'da da ayrı işaretlenir.
 *
 * Gerçek çekim geldiğinde: dosyayı değiştir, `source` alanını sil. Etiket
 * kendiliğinden kaybolur.
 */
export type MediaSource = "documentary" | "generated";

type MediaBase = {
  id: string;
  /** SEO taşıyıcısı. Anahtar kelime içermeli, dosya adı tekrarı OLMAMALI. */
  alt: string;
  /** Kart üstünde ve lightbox'ta görünen kısa açıklama. */
  caption: string;
  category: MediaCategory;
  span?: MediaSpan;
  /** Belirtilmezse `documentary` kabul edilir. */
  source?: MediaSource;
  /**
   * Bölüm kapalıyken ana ekranda görünen kayıt.
   *
   * Galeri büyüdükçe sayfayı şişirmesin diye açılışta yalnızca öne çıkan
   * kayıtlar çizilir; gerisi "tümünü gör" ile açılır. Üçü de VİDEO seçildi:
   * duran bir kare atölyenin ne yaptığını anlatmaz, hareket anlatır.
   */
  oneCikan?: boolean;
  /** Gerçek piksel boyutu — CLS'i sıfırlamak için zorunlu. */
  width: number;
  height: number;
};

export type RealImage = MediaBase & {
  kind: "image";
  src: string;
};

export type RealVideo = MediaBase & {
  kind: "video";
  /** PC'de oynatılan YATAY (1280×720) kopya. */
  src: string;
  /**
   * Telefonda oynatılan DİKEY kopya — kaynak çekimlerin orijinal kadrajı.
   *
   * Kurucunun kararı: "PC için yatay, ama mobilde dik formatta görünmeli."
   * Yatay kopya dikey kareyi bulanık zeminle kadraja alır; telefon dikey
   * tutulurken o kadraj küçük bir şerit olarak kalıyordu. Oynatıcı
   * (`VideoModal`) ekran ölçüsüne göre bu ikisinden birini seçer.
   * Alan isteğe bağlı: yalnızca yatay çekilmiş kayıtların (ör. Vali
   * ziyareti) dikey kopyası yoktur, her ekranda yatay oynar.
   */
  dikeySrc?: string;
  dikeyWidth?: number;
  dikeyHeight?: number;
  /**
   * Poster zorunlu. Galeri kartı YALNIZCA posteri yükler; video dosyası
   * ancak kullanıcı kartı açtığında indirilir. Postersiz bir video, altı
   * kartlık bir ızgarada megabaytlarca gereksiz indirme demektir.
   */
  poster: string;
  /** Poster görselinin boyutu (video kadrajından farklı olabilir). */
  posterWidth: number;
  posterHeight: number;
  /** Saniye cinsinden süre. */
  durationSec: number;
};

export type RealMediaItem = RealImage | RealVideo;

// ──────────────────────────────────────────────────────────────────
// KAYITLAR
// ──────────────────────────────────────────────────────────────────

export const realMedia: readonly RealMediaItem[] = [
  // YENİ ÇEKİMLER (Ağustos 2026): Kurucu, yüzleri karartılmış eski
  // kayıtların yerine orijinal videoları gönderdi. Karartılmış altı kayıt
  // (fırlatma-01, mızrak-01, ekip-iha-takım, roket-ekip, LDR dersi, AVM
  // standı) galeriden ve diskten ÇIKARILDI; bulanık yama Awwwards jürisine
  // de ziyaretçiye de özensizlik olarak görünüyordu. Yeni kayıtlar dikey
  // telefon çekimiydi; 1280×720 yatay kadraja alındı (kare ortada, kenarlar
  // bulanık zemin), hafif gürültü temizliği ve netleştirme uygulandı.
  {
    kind: "video",
    id: "saha-roket-firlatma-02",
    oneCikan: true,
    src: "/assets/real-media/saha-roket-firlatma-02.mp4",
    dikeySrc: "/assets/real-media/saha-roket-firlatma-02-dikey.mp4",
    dikeyWidth: 720,
    dikeyHeight: 1280,
    poster: "/assets/real-media/saha-roket-firlatma-02-poster.webp",
    alt: "CEZERİ ROBOTECH öğrencilerinin atölyedeki roket hazırlığından Batman'daki fırlatma anına uzanan model roket testi",
    caption: "Atölyeden fırlatmaya",
    category: "saha",
    span: "hero",
    width: 1280,
    height: 720,
    // Poster BİLEREK dikey (orijinal telefon karesi): hero hücresi 2×2 ve
    // uzundur; yatay posterin bulanık kenar bantları bu kırpımda görünür
    // kalıyordu (ölçüldü). Video yatay, yalnızca kart posteri dikey.
    posterWidth: 720,
    posterHeight: 1280,
    durationSec: 30,
  },
  {
    kind: "video",
    id: "atolye-iha-uretim-01",
    src: "/assets/real-media/atolye-iha-uretim-01-yatay.mp4",
    dikeySrc: "/assets/real-media/atolye-iha-uretim-01.mp4",
    dikeyWidth: 640,
    dikeyHeight: 990,
    poster: "/assets/real-media/atolye-iha-uretim-01-poster.webp",
    alt: "Batman CEZERİ ROBOTECH atölyesinde karbonfiber gövdeli model İHA'nın uçuş elektroniğinin monte edilmesi",
    caption: "İHA gövde ve elektronik montajı",
    category: "atolye",
    span: "tall",
    width: 1280,
    height: 720,
    posterWidth: 800,
    posterHeight: 1238,
    durationSec: 11,
  },
  {
    kind: "video",
    id: "saha-iha-simurgh-01",
    oneCikan: true,
    src: "/assets/real-media/saha-iha-simurgh-01-yatay.mp4",
    dikeySrc: "/assets/real-media/saha-iha-simurgh-01.mp4",
    dikeyWidth: 640,
    dikeyHeight: 1138,
    poster: "/assets/real-media/saha-iha-simurgh-01-poster.webp",
    alt: "CEZERİ ROBOTECH öğrencilerinin ürettiği Simurgh-24 sabit kanatlı İHA'nın ilk kalkış ve uçuş testi",
    caption: "Simurgh-24 uçuş testi",
    category: "drone",
    span: "wide",
    width: 1280,
    height: 720,
    posterWidth: 800,
    posterHeight: 1422,
    durationSec: 10,
  },
  // ── RESMÎ ZİYARETLER VE ETKİNLİK KAYITLARI ───────────────────────
  // Bu kareler kurumun kendi çekimlerinden; basın bölümündeki haberlerin
  // konusu olan ziyaret ve etkinliklerin ta kendisi. Haber kartları da
  // artık dosya fotoğrafı değil, bu karelerden besleniyor.
  //
  // YÜZLER AÇIK. Öğrenci yüzleri önce bulanıklaştırılmıştı; kurucu
  // gerekli izinlerin alındığını bildirdi ve bulanıklık kaldırıldı.
  // Atölye bölümünün giriş metni de buna göre güncellendi — sayfanın
  // "yüzler bulanıklaştırılmıştır" demesi artık doğru olmazdı.
  {
    kind: "image",
    id: "ziyaret-nasiroglu-vitrin-01",
    src: "/assets/real-media/ziyaret-nasiroglu-vitrin-01.webp",
    alt: "Batman Milletvekili Ferhat Nasıroğlu CEZERİ ROBOTECH atölyesinde öğrenci projelerinin sergilendiği vitrini inceliyor",
    caption: "Nasıroğlu ziyareti — proje vitrini",
    category: "ziyaret",
    span: "wide",
    width: 1400,
    height: 933,
  },
  {
    kind: "image",
    id: "ziyaret-nasiroglu-ogrenci-01",
    src: "/assets/real-media/ziyaret-nasiroglu-ogrenci-01.webp",
    alt: "Batman Milletvekili Ferhat Nasıroğlu, CEZERİ ROBOTECH atölyesinde model uçak yapan bir öğrenciyle tokalaşıyor",
    caption: "Nasıroğlu ziyareti — öğrenciyle",
    category: "ziyaret",
    span: "normal",
    width: 1400,
    height: 933,
  },
  {
    kind: "image",
    id: "ziyaret-nasiroglu-grup-01",
    src: "/assets/real-media/ziyaret-nasiroglu-grup-01.webp",
    alt: "Batman Milletvekili Ferhat Nasıroğlu, CEZERİ ROBOTECH ekibi ve bir öğrenciyle atölyedeki proje rafının önünde",
    caption: "Nasıroğlu ziyareti — atölyede",
    category: "ziyaret",
    span: "normal",
    width: 1400,
    height: 933,
  },
  {
    kind: "image",
    id: "ziyaret-ramanli-kit-01",
    src: "/assets/real-media/ziyaret-ramanli-kit-01.webp",
    alt: "Batman Milletvekili Serkan Ramanlı, CEZERİ ROBOTECH atölyesinde eğitmenden robotik eğitim setini teslim alıyor",
    caption: "Ramanlı ziyareti — eğitim seti",
    category: "ziyaret",
    span: "normal",
    width: 1400,
    height: 1050,
  },
  {
    kind: "image",
    id: "ziyaret-ramanli-3d-baski-01",
    src: "/assets/real-media/ziyaret-ramanli-3d-baski-01.webp",
    alt: "Batman Milletvekili Serkan Ramanlı, CEZERİ ROBOTECH atölyesinde çalışan 3D yazıcıyı ve baskı çıktısını inceliyor",
    caption: "Ramanlı ziyareti — 3D yazıcı",
    category: "ziyaret",
    span: "normal",
    width: 1400,
    height: 1050,
  },
  {
    kind: "image",
    id: "ziyaret-ramanli-vitrin-01",
    src: "/assets/real-media/ziyaret-ramanli-vitrin-01.webp",
    alt: "Batman Milletvekili Serkan Ramanlı, CEZERİ ROBOTECH atölyesindeki model uçak ve robotik proje vitrinini geziyor",
    caption: "Ramanlı ziyareti — proje vitrini",
    category: "ziyaret",
    span: "wide",
    width: 1400,
    height: 1050,
  },
  {
    kind: "image",
    id: "ziyaret-ramanli-ekip-01",
    src: "/assets/real-media/ziyaret-ramanli-ekip-01.webp",
    alt: "Batman Milletvekili Serkan Ramanlı ve CEZERİ ROBOTECH ekibi, kurumun robotik baykuş amblemi önünde",
    caption: "Ramanlı ziyareti — ekiple",
    category: "ziyaret",
    span: "normal",
    width: 1400,
    height: 1050,
  },
  {
    kind: "image",
    id: "protokol-esnaf-odasi-01",
    src: "/assets/real-media/protokol-esnaf-odasi-01.webp",
    alt: "CEZERİ ROBOTECH ile Batman Esnaf ve Sanatkârlar Odası arasındaki teknoloji eğitimi protokolünün imza anı",
    caption: "Esnaf Odası protokolü — imza",
    category: "ziyaret",
    span: "wide",
    width: 1080,
    height: 813,
  },
  {
    kind: "image",
    id: "protokol-esnaf-odasi-02",
    src: "/assets/real-media/protokol-esnaf-odasi-02.webp",
    alt: "CEZERİ ROBOTECH ekibi ile Batman Esnaf ve Sanatkârlar Odası yönetimi protokol görüşmesinde",
    caption: "Esnaf Odası protokolü — görüşme",
    category: "ziyaret",
    span: "normal",
    width: 1080,
    height: 810,
  },
  {
    kind: "image",
    id: "etkinlik-yediiki-vali-01",
    src: "/assets/real-media/etkinlik-yediiki-vali-01.webp",
    alt: "Batman Valisi Ekrem Canalp, YEDİİKİ Robot ve Teknoloji Yarışması'nda CEZERİ ROBOTECH öğrencilerinin model uçağını inceliyor",
    caption: "YEDİİKİ — Vali Canalp sahada",
    category: "ekip",
    span: "wide",
    width: 1366,
    height: 910,
  },
  {
    kind: "video",
    id: "etkinlik-yediiki-vali-video-01",
    src: "/assets/real-media/etkinlik-yediiki-vali-video-01.mp4",
    poster: "/assets/real-media/etkinlik-yediiki-vali-video-01-poster.webp",
    alt: "Batman Valisi Ekrem Canalp'ın YEDİİKİ Robot ve Teknoloji Yarışması'nda CEZERİ ROBOTECH standını ziyaret ettiği video kaydı",
    caption: "YEDİİKİ — Vali ziyareti kaydı",
    category: "ekip",
    span: "wide",
    width: 848,
    height: 478,
    posterWidth: 848,
    posterHeight: 478,
    durationSec: 75,
  },
  {
    kind: "image",
    id: "etkinlik-yediiki-takim-01",
    src: "/assets/real-media/etkinlik-yediiki-takim-01.webp",
    alt: "CEZERİ ROBOTECH takımı YEDİİKİ Robot ve Teknoloji Festivali'nde madalyaları ve plaketiyle",
    caption: "YEDİİKİ — takım",
    category: "ekip",
    span: "tall",
    width: 828,
    height: 1472,
  },
  {
    kind: "image",
    id: "atolye-takim-01",
    src: "/assets/real-media/atolye-takim-01.webp",
    alt: "CEZERİ ROBOTECH öğrenci takımı, atölyede kendi yaptıkları model uçak ve drone ile eğitmenlerinin yanında",
    caption: "Takım — atölyede",
    category: "atolye",
    span: "wide",
    width: 1200,
    height: 797,
  },
  {
    kind: "video",
    id: "atolye-calisma-01",
    src: "/assets/real-media/atolye-calisma-01-yatay.mp4",
    dikeySrc: "/assets/real-media/atolye-calisma-01.mp4",
    dikeyWidth: 720,
    dikeyHeight: 1280,
    poster: "/assets/real-media/atolye-calisma-01-poster.webp",
    alt: "CEZERİ ROBOTECH Batman atölyesinde öğrencilerin proje çalışması — video kaydı",
    caption: "Atölye çalışması",
    category: "atolye",
    span: "normal",
    width: 1280,
    height: 720,
    posterWidth: 720,
    posterHeight: 1280,
    durationSec: 20,
  },
  {
    kind: "video",
    id: "atolye-calisma-02",
    src: "/assets/real-media/atolye-calisma-02-yatay.mp4",
    dikeySrc: "/assets/real-media/atolye-calisma-02.mp4",
    dikeyWidth: 478,
    dikeyHeight: 850,
    poster: "/assets/real-media/atolye-calisma-02-poster.webp",
    alt: "CEZERİ ROBOTECH atölyesinde öğrencilerin elektronik ve montaj çalışması — video kaydı",
    caption: "Atölye çalışması",
    category: "atolye",
    span: "normal",
    width: 1280,
    height: 720,
    posterWidth: 478,
    posterHeight: 850,
    durationSec: 15,
  },
  {
    kind: "video",
    id: "atolye-calisma-03",
    src: "/assets/real-media/atolye-calisma-03-yatay.mp4",
    dikeySrc: "/assets/real-media/atolye-calisma-03.mp4",
    dikeyWidth: 478,
    dikeyHeight: 850,
    poster: "/assets/real-media/atolye-calisma-03-poster.webp",
    alt: "CEZERİ ROBOTECH atölyesinde uzun soluklu proje çalışması — video kaydı",
    caption: "Atölye çalışması",
    category: "atolye",
    span: "normal",
    width: 1280,
    height: 720,
    posterWidth: 478,
    posterHeight: 850,
    durationSec: 36,
  },
  {
    kind: "image",
    id: "roportaj-siber-guvenlik-01",
    src: "/assets/real-media/roportaj-siber-guvenlik-01.webp",
    alt: "CEZERİ ROBOTECH bilişim uzmanı, siber suçlar ve dijital dolandırıcılık konusunda basına açıklama yaparken",
    caption: "Siber güvenlik röportajı",
    category: "ekip",
    span: "normal",
    width: 828,
    height: 620,
  },
  {
    kind: "image",
    id: "ekip-egitmenler-01",
    src: "/assets/real-media/ekip-egitmenler-01.webp",
    alt: "CEZERİ ROBOTECH Batman eğitmen kadrosu, kurumun robotik baykuş amblemi önünde",
    caption: "Eğitmen kadrosu",
    category: "ekip",
    span: "normal",
    width: 1200,
    height: 1200,
  },
  {
    kind: "video",
    id: "atolye-dersler-01",
    src: "/assets/real-media/atolye-dersler-01.mp4",
    dikeySrc: "/assets/real-media/atolye-dersler-01-dikey.mp4",
    dikeyWidth: 478,
    dikeyHeight: 850,
    poster: "/assets/real-media/atolye-dersler-01-poster.webp",
    alt: "CEZERİ ROBOTECH atölyesinde devre kurulumundan mini drone uçuşuna ders anları — video kaydı",
    caption: "Atölye dersleri",
    category: "atolye",
    span: "wide",
    width: 1280,
    height: 720,
    posterWidth: 1280,
    posterHeight: 720,
    durationSec: 46,
  },
  {
    kind: "video",
    id: "atolye-tur-01",
    oneCikan: true,
    src: "/assets/real-media/atolye-tur-01-yatay.mp4",
    dikeySrc: "/assets/real-media/atolye-tur-01.mp4",
    dikeyWidth: 640,
    dikeyHeight: 1138,
    poster: "/assets/real-media/atolye-tur-01-poster.webp",
    alt: "CEZERİ ROBOTECH Batman atölyesinin içi: 3D baskı ürünleri, hexacopter drone ve robotik eğitim kitleri",
    caption: "Atölye turu",
    category: "atolye",
    span: "wide",
    width: 1280,
    height: 720,
    posterWidth: 800,
    posterHeight: 1422,
    durationSec: 11,
  },
  {
    kind: "video",
    id: "3d-baski-uretim-01",
    src: "/assets/real-media/3d-baski-uretim-01-yatay.mp4",
    dikeySrc: "/assets/real-media/3d-baski-uretim-01.mp4",
    dikeyWidth: 640,
    dikeyHeight: 1138,
    poster: "/assets/real-media/3d-baski-uretim-01-poster.webp",
    alt: "3D yazıcının turuncu filamentle İHA gövde parçası basması, baskı kafası hareket hâlinde",
    caption: "Baskı sürerken",
    category: "3d-baski",
    span: "wide",
    source: "generated",
    width: 1280,
    height: 720,
    posterWidth: 800,
    posterHeight: 1422,
    durationSec: 8,
  },
  {
    kind: "image",
    id: "robotik-tezgah-01",
    src: "/assets/real-media/robotik-tezgah-01.webp",
    alt: "Ultrasonik sensörlü paletli robotun mikrodenetleyici kartının tezgahta ayarlanması",
    caption: "Robot montaj tezgahı",
    category: "robotik",
    span: "normal",
    source: "generated",
    width: 900,
    height: 1206,
  },
  {
    kind: "video",
    id: "saha-iha-ucus-01",
    src: "/assets/real-media/saha-iha-ucus-01.mp4",
    dikeySrc: "/assets/real-media/saha-iha-ucus-01-dikey.mp4",
    dikeyWidth: 720,
    dikeyHeight: 1280,
    poster: "/assets/real-media/saha-iha-ucus-01-poster.webp",
    alt: "CEZERİ ROBOTECH takımının ürettiği yeşil sabit kanatlı İHA'nın okul sahası üzerindeki uçuş gösterisi ve izleyen öğrenciler",
    caption: "Simurgh sahada — takım ve uçuş",
    category: "drone",
    span: "wide",
    width: 1280,
    height: 720,
    posterWidth: 1280,
    posterHeight: 720,
    durationSec: 24,
  },
  {
    kind: "video",
    id: "robotik-labirent-01",
    src: "/assets/real-media/robotik-labirent-01.mp4",
    dikeySrc: "/assets/real-media/robotik-labirent-01-dikey.mp4",
    dikeyWidth: 720,
    dikeyHeight: 1280,
    poster: "/assets/real-media/robotik-labirent-01-poster.webp",
    alt: "CEZERİ ROBOTECH öğrencilerinin programladığı labirent çözen robotun yarışma parkurundaki koşusu",
    caption: "Labirent robotu yarışta",
    category: "robotik",
    span: "normal",
    width: 1280,
    height: 720,
    posterWidth: 1280,
    posterHeight: 720,
    durationSec: 9,
  },
  {
    kind: "video",
    id: "saha-hava-cekimi-01",
    src: "/assets/real-media/saha-hava-cekimi-01-yatay.mp4",
    dikeySrc: "/assets/real-media/saha-hava-cekimi-01.mp4",
    dikeyWidth: 640,
    dikeyHeight: 954,
    poster: "/assets/real-media/saha-hava-cekimi-01-poster.webp",
    alt: "CEZERİ ROBOTECH roket fırlatma etkinliğinin drone ile çekilmiş havadan görüntüsü ve katılımcı kalabalığı",
    caption: "Etkinlik havadan görüntü",
    category: "saha",
    span: "wide",
    width: 1280,
    height: 720,
    posterWidth: 800,
    posterHeight: 1194,
    durationSec: 9,
  },
  {
    kind: "video",
    id: "atolye-iha-yapim-01",
    src: "/assets/real-media/atolye-iha-yapim-01.mp4",
    dikeySrc: "/assets/real-media/atolye-iha-yapim-01-dikey.mp4",
    dikeyWidth: 478,
    dikeyHeight: 850,
    poster: "/assets/real-media/atolye-iha-yapim-01-poster.webp",
    alt: "CEZERİ ROBOTECH öğrencilerinin köpük gövdeli sabit kanatlı İHA'yı kesiminden montajına kendi elleriyle üretmesi",
    caption: "İHA gövde yapımı",
    category: "atolye",
    span: "normal",
    width: 1280,
    height: 720,
    posterWidth: 1280,
    posterHeight: 720,
    durationSec: 25,
  },
  {
    kind: "video",
    id: "robotik-montaj-01",
    src: "/assets/real-media/robotik-montaj-01-yatay.mp4",
    dikeySrc: "/assets/real-media/robotik-montaj-01.mp4",
    dikeyWidth: 640,
    dikeyHeight: 1138,
    poster: "/assets/real-media/robotik-montaj-01-poster.webp",
    alt: "Paletli robotun servo braketinin tornavidayla ayarlanması ve palet motorlarının test edilmesi",
    caption: "Robot montajı",
    category: "robotik",
    span: "tall",
    source: "generated",
    width: 1280,
    height: 720,
    posterWidth: 800,
    posterHeight: 1422,
    durationSec: 8,
  },
  {
    kind: "image",
    id: "3d-baski-atolye-01",
    src: "/assets/real-media/3d-baski-atolye-01.webp",
    alt: "Atölyedeki 3D baskı istasyonunda üretilen turuncu İHA gövde parçası ve baskı kafası",
    caption: "3D baskı istasyonu",
    category: "3d-baski",
    span: "normal",
    source: "generated",
    width: 900,
    height: 1206,
  },
  {
    kind: "video",
    id: "merkez-tanitim-01",
    src: "/assets/real-media/merkez-tanitim-01.mp4",
    dikeySrc: "/assets/real-media/merkez-tanitim-01-dikey.mp4",
    dikeyWidth: 720,
    dikeyHeight: 1280,
    poster: "/assets/real-media/merkez-tanitim-01-poster.webp",
    alt: "CEZERİ ROBOTECH Batman merkezinin sınıfları, atölye çalışmaları ve saha etkinliklerinden kesitler — tanıtım videosu",
    caption: "Merkezden kareler",
    category: "atolye",
    span: "wide",
    width: 1280,
    height: 720,
    posterWidth: 1280,
    posterHeight: 720,
    durationSec: 43,
  },
  {
    kind: "video",
    id: "robotik-kopek-01",
    src: "/assets/real-media/robotik-kopek-01.mp4",
    dikeySrc: "/assets/real-media/robotik-kopek-01-dikey.mp4",
    dikeyWidth: 560,
    dikeyHeight: 930,
    poster: "/assets/real-media/robotik-kopek-01-poster.webp",
    alt: "CEZERİ ROBOTECH merkezinde dört ayaklı robot köpeğin öğrencilerin ve insansı robotun önünde yürüyüşü",
    caption: "Robot köpek merkezde",
    category: "robotik",
    span: "normal",
    width: 1280,
    height: 720,
    posterWidth: 1280,
    posterHeight: 720,
    durationSec: 3,
  },
  // İKİNCİ PARTİ (Ağustos 2026): kurucunun gönderdiği altı proje videosu.
  // Aynı işlem hattı: 1280×720 yatay kadraj, gürültü temizliği, netleştirme.
  // 3D baskı kategorisi bu partiyle İLK KEZ gerçek çekim taşıyor; "Konsept"
  // etiketli üretilmiş görseller artık yalnız çekimi olmayan açıları dolduruyor.
  {
    kind: "video",
    id: "etkinlik-yediiki-stant-01",
    src: "/assets/real-media/etkinlik-yediiki-stant-01.mp4",
    dikeySrc: "/assets/real-media/etkinlik-yediiki-stant-01-dikey.mp4",
    dikeyWidth: 720,
    dikeyHeight: 1280,
    poster: "/assets/real-media/etkinlik-yediiki-stant-01-poster.webp",
    alt: "CEZERİ ROBOTECH'in YEDİİKİ Robot Yarışması'ndaki standında VR gözlük deneyen ve robotları inceleyen ziyaretçi çocuklar",
    caption: "YEDİİKİ — CEZERİ standı",
    category: "ekip",
    span: "wide",
    width: 1280,
    height: 720,
    posterWidth: 1280,
    posterHeight: 720,
    durationSec: 32,
  },
  {
    kind: "video",
    id: "3d-baski-el-01",
    src: "/assets/real-media/3d-baski-el-01.mp4",
    dikeySrc: "/assets/real-media/3d-baski-el-01-dikey.mp4",
    dikeyWidth: 720,
    dikeyHeight: 1280,
    poster: "/assets/real-media/3d-baski-el-01-poster.webp",
    alt: "CEZERİ ROBOTECH atölyesinde 3D yazıcıyla basılan eklemli el projesinin parçaları ve öğrencilere demonte verilen setin montajı",
    caption: "3D baskı — sihirli el projesi",
    category: "3d-baski",
    span: "wide",
    width: 1280,
    height: 720,
    posterWidth: 1280,
    posterHeight: 720,
    durationSec: 59,
  },
  {
    kind: "video",
    id: "atolye-muhendislik-01",
    src: "/assets/real-media/atolye-muhendislik-01.mp4",
    dikeySrc: "/assets/real-media/atolye-muhendislik-01-dikey.mp4",
    dikeyWidth: 720,
    dikeyHeight: 1280,
    poster: "/assets/real-media/atolye-muhendislik-01-poster.webp",
    alt: "CEZERİ ROBOTECH öğrencilerinin atölye tezgahından saha uçuşuna uzanan mühendislik çalışmaları",
    caption: "Mühendislik bizim işimiz",
    category: "atolye",
    span: "normal",
    width: 1280,
    height: 720,
    posterWidth: 1280,
    posterHeight: 720,
    durationSec: 15,
  },
  {
    kind: "video",
    id: "elektronik-alarm-01",
    src: "/assets/real-media/elektronik-alarm-01.mp4",
    dikeySrc: "/assets/real-media/elektronik-alarm-01-dikey.mp4",
    dikeyWidth: 720,
    dikeyHeight: 1280,
    poster: "/assets/real-media/elektronik-alarm-01-poster.webp",
    alt: "CEZERİ ROBOTECH atölyesinde delikli PCB, transistör ve LDR ile ev tipi hırsız alarmı devresinin kurulup test edilmesi",
    caption: "Hırsız alarmı projesi",
    category: "robotik",
    span: "normal",
    width: 1280,
    height: 720,
    posterWidth: 1280,
    posterHeight: 720,
    durationSec: 37,
  },
  {
    kind: "video",
    id: "yazilim-trafik-01",
    src: "/assets/real-media/yazilim-trafik-01.mp4",
    dikeySrc: "/assets/real-media/yazilim-trafik-01-dikey.mp4",
    dikeyWidth: 720,
    dikeyHeight: 1280,
    poster: "/assets/real-media/yazilim-trafik-01-poster.webp",
    alt: "CEZERİ ROBOTECH öğrencilerinin görüntü işlemeyle araç tanıyan yapay zekâ destekli akıllı trafik ışığı projesi",
    caption: "Yapay zekâlı trafik ışığı",
    category: "robotik",
    span: "wide",
    width: 1280,
    height: 720,
    posterWidth: 1280,
    posterHeight: 720,
    durationSec: 50,
  },
  {
    kind: "video",
    id: "atolye-genc-muhendisler-01",
    src: "/assets/real-media/atolye-genc-muhendisler-01.mp4",
    dikeySrc: "/assets/real-media/atolye-genc-muhendisler-01-dikey.mp4",
    dikeyWidth: 720,
    dikeyHeight: 1280,
    poster: "/assets/real-media/atolye-genc-muhendisler-01-poster.webp",
    alt: "CEZERİ ROBOTECH atölyesinde motor sarımından devre kurulumuna çalışan genç öğrenciler",
    caption: "Yeni nesil mühendisler",
    category: "atolye",
    span: "normal",
    width: 1280,
    height: 720,
    posterWidth: 1280,
    posterHeight: 720,
    durationSec: 23,
  },
];

/** Galeri gerçek içerikle mi render edilecek, iskeletle mi? */
export const hasRealMedia = realMedia.length > 0;

const CATEGORY_LABELS: Record<MediaCategory, string> = {
  atolye: "Atölye",
  drone: "İHA / VTOL",
  saha: "Saha Testi",
  "3d-baski": "3D Baskı",
  robotik: "Robotik",
  ekip: "Ekip",
  ziyaret: "Ziyaret",
};

/**
 * Filtreler manifest'ten TÜRETİLİR, elle sayılmaz.
 * Elle yazılan bir filtre listesi, varlığı olmayan kategoriler için boş
 * sonuç veren düğmeler üretir — kullanıcı tıklar, hiçbir şey görmez.
 * Türetilmiş liste bu hatayı yapısal olarak imkânsız kılar.
 */
export const mediaFilters: readonly { id: MediaCategory | "tumu"; label: string }[] = [
  { id: "tumu" as const, label: "Tümü" },
  ...(Object.keys(CATEGORY_LABELS) as MediaCategory[])
    .filter((c) => realMedia.some((m) => m.category === c))
    .map((c) => ({ id: c, label: CATEGORY_LABELS[c] })),
];

/** Bento ızgarasında span → Tailwind sınıf eşlemesi. */
export const spanClass: Record<MediaSpan, string> = {
  normal: "sm:col-span-1 sm:row-span-1",
  wide: "sm:col-span-2 sm:row-span-1",
  tall: "sm:col-span-1 sm:row-span-2",
  hero: "sm:col-span-2 sm:row-span-2",
};
