/** Site içeriği — one-page sahneleri ve içerik katmanı aynı kaynaktan beslenir. */

export interface Lab {
  readonly slug: string;
  readonly code: string;
  readonly title: string;
  readonly subtitle: string;
  readonly summary: string;
  /** GEO: soru biçimli başlık + tek başına anlamlı cevap (chunk retrieval) */
  readonly question: string;
  readonly answer: string;
  readonly equipment: readonly string[];
  /** İçerik sayfası hero görseli — hafif, WebGL/video yok. */
  readonly mediaSlot: string;
  /** Hangar sahnesi arka plan videosu (yalnızca `/` üzerinde). */
  readonly videoSlot: string;
}

export const LABS: readonly Lab[] = [
  {
    slug: "yapay-zeka",
    code: "A",
    title: "AI & Deep Learning Lab",
    subtitle: "Yapay Zekâ & Otonom Kodlama",
    summary:
      "Görüntü işleme, nesne tanıma ve otonom karar sistemleri üzerine çalışılan laboratuvar.",
    question: "Batman'da yapay zekâ eğitimi nerede veriliyor?",
    answer:
      "Cezeri Robotech, Batman'da çocuklara ve gençlere yapay zekâ ve otonom kodlama eğitimi veren bir öğrenme merkezidir. AI & Deep Learning Lab'de görüntü işleme, nesne tanıma ve otonom karar sistemleri üzerine uygulamalı çalışmalar yapılır.",
    equipment: ["PYTHON", "OPENCV", "TENSORFLOW", "JETSON NANO"],
    mediaSlot: "l1-ai-lab",
    videoSlot: "v3-lab",
  },
  {
    slug: "iha-roket",
    code: "B",
    title: "UAV & Rocket Dynamics",
    subtitle: "İHA, Aerodinamik & İrtifa Sistemleri",
    summary:
      "İnsansız hava aracı tasarımı, katı yakıt roket dinamiği ve telemetri sistemleri.",
    question: "Batman'da İHA ve roket eğitimi var mı?",
    answer:
      "Cezeri Robotech, Batman'da insansız hava aracı ve model roket eğitimi vermektedir. Kurum, Batman Valiliği'nin düzenlediği Yediiki Robot ve Teknoloji Yarışması'nda Batman'ın ilk VTOL İHA uçuşunu ve ilk model roket fırlatışını gerçekleştirmiştir.",
    equipment: ["CFD", "KATI YAKIT", "TELEMETRİ", "KURTARMA SİSTEMİ"],
    mediaSlot: "l2-uav-lab",
    videoSlot: "v2-uav",
  },
  {
    slug: "mekatronik",
    code: "C",
    title: "Mechatronics & 3D Prototyping",
    subtitle: "İsmail el-Cezeri Mekatronik Atölyesi",
    summary:
      "CAD tasarımından 3B baskıya, PCB tasarımından montaja kadar üretim zinciri.",
    question: "Batman'da 3D tasarım ve mekatronik atölyesi nerede?",
    answer:
      "Cezeri Robotech'in mekatronik atölyesinde öğrenciler CAD tasarımı, 3B baskı, PCB tasarımı ve montaj süreçlerini uçtan uca uygular. Atölye, robotik biliminin öncüsü İsmail el-Cezeri'nin adını taşır.",
    equipment: ["FUSION 360", "FDM / SLA", "CNC", "PCB TASARIM"],
    mediaSlot: "l3-mechatronics",
    videoSlot: "v4-mech",
  },
];

export interface Prototype {
  readonly id: string;
  readonly name: string;
  readonly category: string;
  readonly note: string;
  readonly mediaSlot: string;
}

export const PROTOTYPES: readonly Prototype[] = [
  { id: "rocket", name: "Model Roket", category: "İrtifa / Katı Yakıt", note: "Gövde kompozit, kanatçıklar lazer kesim.", mediaSlot: "g1-rocket" },
  { id: "rover", name: "Gezgin Robot", category: "Keşif / 6 Tekerlek", note: "Rocker süspansiyon, 3B baskı gövde.", mediaSlot: "g2-rover" },
  { id: "uav", name: "İHA / Gözcü", category: "Quadcopter", note: "Karbon fiber X-şase, 4S güç ünitesi.", mediaSlot: "g3-uav" },
  { id: "arm", name: "Robot Kol", category: "6 Eksen", note: "Alüminyum eklem, 3B baskı bağlantı.", mediaSlot: "g4-arm" },
  { id: "linefollower", name: "Çizgi İzleyen", category: "Otonom Sürüş", note: "IR sensör dizisi, PID kontrol.", mediaSlot: "g5-linefollower" },
  { id: "pcb", name: "Kendi PCB'miz", category: "Devre Tasarımı", note: "Öğrenci tasarımı, lacivert solder mask.", mediaSlot: "g6-pcb" },
];

export interface DronePart {
  readonly no: string;
  readonly name: string;
  readonly spec: string;
}

export const DRONE_PARTS: readonly DronePart[] = [
  { no: "01", name: "Gövde Şasisi", spec: "karbon fiber, 450 mm" },
  { no: "02", name: "BLDC Motor ×4", spec: "920 KV" },
  { no: "03", name: "Pervane ×4", spec: "10×4.5" },
  { no: "04", name: "Uçuş Kontrol Kartı", spec: "IMU + barometre" },
  { no: "05", name: "Gimbal Kamera", spec: "3 eksen stabilize" },
  { no: "06", name: "Güç Ünitesi", spec: "4S LiPo" },
  { no: "07", name: "Telemetri", spec: "915 MHz" },
];

export interface Stage {
  readonly no: string;
  readonly title: string;
  readonly body: string;
}

export const METHOD_STAGES: readonly Stage[] = [
  { no: "01", title: "Tasarla", body: "Fikir → CAD → simülasyon. Kâğıtta biten hiçbir şey yok." },
  { no: "02", title: "Prototiple", body: "3B baskı → montaj → PCB. Hata bir sonuç değil, veridir." },
  { no: "03", title: "Uçur", body: "Saha testi → telemetri → revizyon. Gerçek uçuş olmadan ders bitmez." },
];

export const AGE_GROUPS = ["7-9", "10-12", "13-15", "16-18"] as const;

export const MISSIONS = [
  { value: "yapay-zeka", label: "Yapay Zekâ & Kodlama" },
  { value: "iha-roket", label: "İHA & Roket" },
  { value: "mekatronik", label: "Mekatronik & 3B Tasarım" },
] as const;
