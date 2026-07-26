import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "HEP-SEN Batman — Başkanlık İletişim OS",
  description: "İnsan onaylı, hukuk guard'lı X iletişim yönetim paneli",
  manifest: "/manifest.webmanifest",
};

export const viewport: Viewport = {
  themeColor: "#0f2439",
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr">
      <body className="bg-[#f7f8fa] text-hepsenNavy antialiased">{children}</body>
    </html>
  );
}
