import type { Config } from "tailwindcss";
import { tokens } from "@cezeri/config";

const c = tokens.colors;

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
      },
      transitionTimingFunction: {
        czr: "cubic-bezier(0.33, 1, 0.68, 1)",
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
      },
      animation: {
        "fade-up": "fade-up 250ms cubic-bezier(0.33,1,0.68,1)",
        "soft-glow": "soft-glow 3s ease-in-out infinite",
      },
    },
  },
  plugins: [],
} satisfies Config;
