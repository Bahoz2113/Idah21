/**
 * PERDE SIRASI — alternatif sayfanın arka plan gösterisi.
 *
 * Ana sayfada arkadaki animasyon KULLANICI seçer: katalogda bir eğitime
 * dokunulunca o disiplinin efekti oynar. Burada tersi olur — gösteri
 * kendi sırasını takip eder. Kaydırdıkça önce roket kalkar, sonra İHA
 * sürüsü geçer, sonra 3D yazıcı basar; on disiplin sırayla sahneye
 * çıkar.
 *
 * Sıra rastgele değil: kurumun en görünür üç çıktısı önce gelir
 * (roketçilik, İHA/VTOL, eklemeli üretim), soyut disiplinler sonra.
 * Ziyaretçi ilk on saniyede ne yapıldığını görür.
 *
 * Her perdenin üç katmanı vardır:
 *   · fx    — prosedürel animasyon (`CategoryFx` içindeki efekt)
 *   · plate — Higgsfield ile üretilmiş sahne görseli
 *   · clip  — varsa, o disiplinin GERÇEK saha/atölye kaydı
 *
 * `clip` yalnızca üç perdede var ve bilerek öyle: elimizde kaydı olan
 * disiplinler bunlar. Olmayan yere temsilî görüntü konmaz.
 */

export type Act = {
  /** `CategoryFx` içindeki efekt kimliği. */
  fx: string;
  /** Perde adı — sahne göstergesinde okunur. */
  title: string;
  /** Higgsfield sahne görseli. */
  plate: string;
  /** Gerçek kayıt (sessiz, döngüde). Yoksa yalnızca görsel oynar. */
  clip?: string;
  /**
   * Kaydın ilk karesi. Video çözülene kadar panel boş kalmasın diye;
   * kodeği desteklemeyen ortamda da kadraj görünür.
   */
  poster?: string;
};

export const SHOW: Act[] = [
  {
    fx: "rocket",
    title: "Roket Fırlatma",
    plate: "/assets/egitim/roketcilik.webp",
    clip: "/assets/real-media/saha-roket-firlatma-01.mp4",
    poster: "/assets/real-media/saha-roket-firlatma-01-poster.webp",
  },
  {
    fx: "drone",
    title: "İHA / VTOL Uçuşu",
    plate: "/assets/egitim/iha-vtol.webp",
    clip: "/assets/real-media/saha-iha-simurgh-01.mp4",
    poster: "/assets/real-media/saha-iha-simurgh-01-poster.webp",
  },
  {
    fx: "print",
    title: "3D Yazıcı Baskısı",
    plate: "/assets/egitim/3d-tasarim.webp",
    clip: "/assets/real-media/3d-baski-uretim-01.mp4",
    poster: "/assets/real-media/3d-baski-uretim-01-poster.webp",
  },
  { fx: "neural", title: "Sinir Ağı", plate: "/assets/egitim/yapay-zeka.webp" },
  {
    fx: "robot",
    title: "Robotik Montaj",
    plate: "/assets/egitim/robotik.webp",
    clip: "/assets/real-media/robotik-montaj-01.mp4",
    poster: "/assets/real-media/robotik-montaj-01-poster.webp",
  },
  { fx: "code", title: "Algoritma", plate: "/assets/egitim/kodlama.webp" },
  { fx: "circuit", title: "Devre ve Lehim", plate: "/assets/egitim/elektronik.webp" },
  { fx: "shield", title: "Siber Güvenlik", plate: "/assets/egitim/siber-guvenlik.webp" },
  { fx: "orbit", title: "Yörünge", plate: "/assets/egitim/uzay-havacilik.webp" },
  { fx: "growth", title: "Girişim", plate: "/assets/egitim/girisimcilik.webp" },
];

/**
 * Scroll ilerlemesinden perde numarası.
 *
 * Gösteri sayfanın TAMAMINA yayılır; perdeler eşit paylaşır. Bölüm
 * sınırlarına bağlanmadı çünkü bölümler farklı yükseklikte: müfredat
 * 165 hafta taşır, SSS bir ekrandır. Eşit paylaşım her perdeye aynı
 * seyir süresini verir.
 */
export function actAt(progress: number): number {
  const i = Math.floor(progress * SHOW.length);
  return Math.min(SHOW.length - 1, Math.max(0, i));
}

/** Perdenin kendi içindeki ilerleme (0 → 1); yavaş yakınlaşma için. */
export function actProgress(progress: number): number {
  const span = 1 / SHOW.length;
  return Math.min(1, Math.max(0, (progress - actAt(progress) * span) / span));
}
