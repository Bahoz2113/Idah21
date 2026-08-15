import "../globals.css";
import type { Metadata, Viewport } from "next";
import { TRPCProvider } from "@/trpc/Provider";
import { PWARegister } from "@/components/PWARegister";

export const metadata: Metadata = {
  title: "CZR CEOS",
  description: "CEZERİ ROBOTECH eğitim yönetim sistemi",
  applicationName: "CZR CEOS",
  manifest: "/manifest.webmanifest",
  appleWebApp: { capable: true, statusBarStyle: "black-translucent", title: "CZR CEOS" },
  icons: { icon: "/favicon-32.png", apple: "/apple-touch-icon.png" },
};

export const viewport: Viewport = {
  themeColor: "#173A58",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

/**
 * PANEL KÖK DÜZENİ.
 *
 * İki kök düzen var: bu ve `(marketing)/layout.tsx`. Sebep tek bir
 * öznitelik: `<html lang>`. Tanıtım sitesi dört dilde yayınlanıyor ve her
 * dilin sayfası kendi dil etiketini — Arapçada ayrıca `dir="rtl"` —
 * taşımak zorunda. Tek bir kök düzen olsaydı `<html>` etiketi bir kez ve
 * sabit yazılırdı; ekran okuyucu Arapça sayfayı Türkçe telaffuz eder,
 * arama motoru dil sinyalini sayfanın kendisinden alamazdı.
 *
 * Panel tek dilli olduğu için burası sabit `tr` kalır.
 */
export default function PanelLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr">
      <body className="bg-gray-50 text-gray-900 antialiased min-h-screen">
        <TRPCProvider>{children}</TRPCProvider>
        <PWARegister />
      </body>
    </html>
  );
}
