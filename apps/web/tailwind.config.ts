import type { Config } from "tailwindcss";
import { tokens, marketingTokens } from "@cezeri/config";

const c = tokens.colors;
const m = marketingTokens.colors;

export default {
  content: ["./src/**/*.{ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Marka (eski isimler korunur)
        lacivert: c.lacivert,
        mavi: c.mavi,
        turkuaz: c.turkuaz,
        vurgu: c.vurgu,
        vurguKoyu: c.vurguKoyu,
        // Semantik yüzey/metin
        bgLight: c.bgLight,
        surface: c.surface,
        surface2: c.surface2,
        borderc: c.border,
        textPrimary: c.textPrimary,
        textSecondary: c.textSecondary,
        textMuted: c.textMuted,
        // Dark
        darkBg: c.darkBg,
        darkSurface: c.darkSurface,
        darkText: c.darkText,
        darkText2: c.darkText2,
        // Durum
        success: c.success,
        warning: c.warning,
        danger: c.danger,
        info: c.info,

        // ——— Marketing yüzeyi (yalnızca public tanıtım sayfası) ———
        czr: {
          teal: m.teal,
          "teal-deep": m.tealDeep,
          "teal-soft": m.tealSoft,
          orange: m.orange,
          "orange-deep": m.orangeDeep,
          emerald: m.emerald,
          "emerald-deep": m.emeraldDeep,
          base: m.base,
          "base-alt": m.baseAlt,
          ice: m.ice,
        },
      },
      borderRadius: {
        sm: `${tokens.radius.sm}px`,
        md: `${tokens.radius.md}px`,
        lg: `${tokens.radius.lg}px`,
        xl: `${tokens.radius.xl}px`,
        "2xl": "28px",
      },
      boxShadow: {
        "czr-xs": tokens.shadow.xs,
        "czr-sm": tokens.shadow.sm,
        "czr-md": tokens.shadow.md,
        "czr-lg": tokens.shadow.lg,
        glow: tokens.shadow.glow,
      },
      backgroundImage: {
        "gradient-primary": tokens.gradients.primary,
        "gradient-darktech": tokens.gradients.darkTech,
        "gradient-accent": tokens.gradients.accent,
        "gradient-glass": tokens.gradients.glass,
        // Marketing
        "czr-hero": marketingTokens.gradients.hero,
        "czr-launch": marketingTokens.gradients.launch,
        "czr-signal": marketingTokens.gradients.signal,
        "czr-hangar": marketingTokens.gradients.hangar,
        "czr-glass": marketingTokens.gradients.glass,
        "czr-vignette": marketingTokens.grade.vignette,
      },
      transitionTimingFunction: {
        czr: "cubic-bezier(0.33, 1, 0.68, 1)",
        "czr-cine": marketingTokens.motion.ease,
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "soft-glow": {
          "0%,100%": { boxShadow: "0 0 16px rgba(99,182,242,0.10)" },
          "50%": { boxShadow: "0 0 28px rgba(99,182,242,0.22)" },
        },
        // ——— Marketing hareket seti ———
        "gear-spin": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        "gear-spin-rev": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(-360deg)" },
        },
        "scan-line": {
          "0%": { transform: "translateY(-100%)", opacity: "0" },
          "50%": { opacity: "0.55" },
          "100%": { transform: "translateY(100%)", opacity: "0" },
        },
        "pulse-signal": {
          "0%,100%": { opacity: "0.35", transform: "scale(1)" },
          "50%": { opacity: "1", transform: "scale(1.06)" },
        },
        "hover-drift": {
          "0%,100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
      animation: {
        "fade-up": "fade-up 250ms cubic-bezier(0.33,1,0.68,1)",
        "soft-glow": "soft-glow 3s ease-in-out infinite",
        "gear-spin": "gear-spin 26s linear infinite",
        "gear-spin-rev": "gear-spin-rev 34s linear infinite",
        "scan-line": "scan-line 5s ease-in-out infinite",
        "pulse-signal": "pulse-signal 2.4s ease-in-out infinite",
        "hover-drift": "hover-drift 6s ease-in-out infinite",
      },
    },
  },
  plugins: [],
} satisfies Config;
