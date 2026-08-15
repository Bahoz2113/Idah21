// ══════════════════════════════════════════════════════════════════
// CEZERİ DESIGN OPERATING SYSTEM — Kurumsal Tasarım Token'ları
// Robotik baykuş DNA: bilgelik · gözlem · yapay zeka · mühendislik · güven
// Bu token'lar web (Tailwind) + mobil (NativeWind) + tüm CEZERİ projelerinde ortak.
// Detay & kurallar: /docs/CEZERI_DESIGN_OS.md
// ══════════════════════════════════════════════════════════════════
export const tokens = {
  colors: {
    // ——— Ana marka (mavi ışık) ———
    // Eski isimler (lacivert/mavi/turkuaz/vurgu) korunur ki mevcut 200+ kullanım
    // otomatik yeni premium değerlere geçsin.
    lacivert:     "#173A58",  // Primary Dark — header, sidebar zemini, koyu yüzeyler
    mavi:         "#2B6EA8",  // Primary Blue — birincil aksiyon, link, aktif alan
    turkuaz:      "#63B6F2",  // Primary Light — ikincil vurgu, hover, aura, çizgi
    beyaz:        "#FFFFFF",
    vurgu:        "#F2A531",  // Accent Amber — baykuş gözü: CTA vurgu, aktif işaret
    vurguKoyu:    "#C97A16",  // Accent Dark — amber hover/gölge

    // ——— Semantik yüzey & metin ———
    bgLight:      "#F8FAFC",
    surface:      "#FFFFFF",
    surface2:     "#F4F7FA",
    border:       "#E7EDF4",
    textPrimary:  "#0F172A",
    textSecondary:"#64748B",
    textMuted:    "#94A3B8",

    // ——— Dark mode (siyah DEĞİL — deep blue-gray) ———
    darkBg:       "#0F1720",
    darkSurface:  "#172231",
    darkText:     "#FFFFFF",
    darkText2:    "#A8B3C2",

    // ——— Durum renkleri ———
    success:      "#2FBF71",
    warning:      "#FFB020",
    danger:       "#F04438",
    info:         "#3297FF",
  },

  gradients: {
    primary:  "linear-gradient(135deg, #2B6EA8 0%, #63B6F2 100%)",
    darkTech: "linear-gradient(135deg, #173A58 0%, #2B6EA8 100%)",
    accent:   "linear-gradient(135deg, #F2A531 0%, #FFCC66 100%)",
    glass:    "linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.03) 100%)",
  },

  radius: { sm: 12, md: 16, lg: 20, xl: 24 },

  shadow: {
    xs:   "0 1px 2px rgba(15,23,42,0.04)",
    sm:   "0 2px 8px rgba(15,23,42,0.05)",
    md:   "0 6px 20px rgba(15,23,42,0.06)",
    lg:   "0 12px 32px rgba(15,23,42,0.08)",
    glow: "0 0 24px rgba(99,182,242,0.18)",
  },

  motion: { duration: "250ms", ease: "cubic-bezier(0.33, 1, 0.68, 1)" },
} as const;

// ══════════════════════════════════════════════════════════════════
// MARKETING SURFACE TOKENS — public tanıtım sitesi (Mali Kontrol paleti)
//
// DİKKAT: Bunlar yukarıdaki `tokens` setinden AYRIDIR ve onu ezmez.
// Yönetim paneli (admin/teacher/parent/student) mavi-amber `tokens` setini
// kullanmaya devam eder; bu petrol yeşili/turuncu set YALNIZCA kök rotadaki
// tanıtım deneyiminde geçerlidir. İki seti karıştırmayın.
// ══════════════════════════════════════════════════════════════════
export const marketingTokens = {
  colors: {
    // ——— Dominant: koyu petrol yeşili / teal ———
    teal:        "#0F4C5C",  // Primary — sistem başlıkları, navigasyon, derinlik
    tealDeep:    "#0D5C63",  // Primary alt tonu — katman ayrımı
    tealSoft:    "#1B6E7E",  // Hover / aktif kenar

    // ——— Aksent: dinamik turuncu ———
    orange:      "#FF8C00",  // Fırlatma butonları, odak noktaları
    orangeDeep:  "#F57C00",  // Hover / basılı hâl

    // ——— İkincil aksent: zümrüt ———
    emerald:     "#10B981",  // Başarı metrikleri, onay durumları
    emeraldDeep: "#00B894",

    // ——— Koyu zemin (derin petrol siyahı) ———
    base:        "#0A191D",  // Ana koyu zemin
    baseAlt:     "#0D1F23",  // İkincil koyu yüzey

    // ——— Aydınlık yüzeyler ———
    white:       "#FFFFFF",  // Siber beyaz
    ice:         "#F2F8F8",  // Buzul teal tonu — kart zemini
  },

  gradients: {
    hero:    "linear-gradient(160deg, #0A191D 0%, #0F4C5C 55%, #0D5C63 100%)",
    launch:  "linear-gradient(135deg, #FF8C00 0%, #F57C00 100%)",
    signal:  "linear-gradient(135deg, #10B981 0%, #00B894 100%)",
    hangar:  "linear-gradient(135deg, rgba(15,76,92,0.55) 0%, rgba(10,25,29,0.85) 100%)",
    glass:   "linear-gradient(135deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.02) 100%)",
  },

  // Gerçek fotoğraf/video üstüne uygulanan görsel bütünlük filtresi
  grade: {
    tint:     "rgba(15,76,92,0.38)",
    shadow:   "rgba(10,25,29,0.55)",
    vignette: "radial-gradient(ellipse at center, transparent 42%, rgba(10,25,29,0.72) 100%)",
  },

  shadow: {
    lift:  "0 18px 48px rgba(10,25,29,0.38)",
    glow:  "0 0 32px rgba(255,140,0,0.28)",
    ring:  "0 0 0 1px rgba(255,255,255,0.08)",
  },

  motion: { duration: "600ms", ease: "cubic-bezier(0.16, 1, 0.3, 1)" },
} as const;
