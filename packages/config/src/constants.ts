// Yaş grupları
export const AGE_GROUPS = [
  { key: "minikler",    name: "Minikler",    minAge: 6,  maxAge: 8,  tone: "oyunlaştırılmış, metaforlu" },
  { key: "yildizlar",   name: "Yıldızlar",   minAge: 9,  maxAge: 11, tone: "temel elektronik mantığı, sade" },
  { key: "kasifler",    name: "Kaşifler",    minAge: 11, maxAge: 14, tone: "devre, direnç, akım, yön kavramları" },
  { key: "muhendisler", name: "Mühendisler", minAge: 14, maxAge: 18, tone: "diyot mantığı, voltaj, direnç hesabı, Arduino" },
] as const;

export type Role = "ADMIN" | "TEACHER" | "PARENT" | "STUDENT";

// Öğrenci değerlendirme kriterleri (1-10) — aylık gelişim grafiğinin temeli
export const EVALUATION_CRITERIA = [
  { key: "electronics_interest", label: "Elektroniğe ilgi" },
  { key: "coding_interest",      label: "Kodlamaya ilgi" },
  { key: "design_interest",      label: "3D tasarıma ilgi" },
  { key: "project_interest",     label: "Projelere ilgi" },
  { key: "algorithmic_thinking", label: "Algoritmik düşünme" },
  { key: "logical_thinking",     label: "Mantıksal düşünme" },
  { key: "coding_skill",         label: "Kod yazma becerisi" },
  { key: "problem_solving",      label: "Problem çözme" },
  { key: "project_management",   label: "Proje yönetimi" },
  { key: "focus",                label: "Odaklanma" },
  { key: "creativity",           label: "Yaratıcılık ve özgünlük" },
  { key: "teamwork",             label: "Takım çalışması" },
  { key: "communication",        label: "İletişim" },
  { key: "leadership",           label: "Liderlik" },
  { key: "responsibility",       label: "Sorumluluk" },
  { key: "presentation",         label: "Sunum becerisi" },
  { key: "technical_curiosity",  label: "Teknik merak" },
  { key: "application_skill",    label: "Uygulama becerisi" },
] as const;

// Materyal tipleri (çocuk görseli YOK)
export const MATERIAL_TYPES = [
  { key: "PDF",          label: "PDF" },
  { key: "PPT",          label: "Sunum" },
  { key: "ARDUINO_CODE", label: "Arduino Kodu" },
  { key: "CIRCUIT",      label: "Devre Şeması" },
  { key: "MODEL_3D",     label: "3D Model" },
  { key: "STL",          label: "STL" },
  { key: "NOTE",         label: "Ders Notu" },
  { key: "LINK",         label: "Harici Bağlantı" },
] as const;
