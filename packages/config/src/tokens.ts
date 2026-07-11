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
