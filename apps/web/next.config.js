/** @type {import('next').NextConfig} */
const securityHeaders = [
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-XSS-Protection", value: "1; mode=block" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=()" },
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob: https://*.supabase.co",
      "font-src 'self'",
      "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://api.anthropic.com",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join("; "),
  },
];

module.exports = {
  reactStrictMode: true,
  // TEK DOSYALIK ÖNİZLEME PAKETİ İÇİN KAÇIŞ KAPISI. Normal derlemede
  // görüntü iyileştirici açıktır. Paket derlemesinde `next/image`
  // çalışma anında `/_next/image?...` adresleri üretir ve bu adresler
  // tek dosyaya gömülemez; `unoptimized` ile hem sunucu hem istemci
  // orijinal `/assets/...` yolunu basar, o yol da data URI'ye çevrilir.
  // Üretim derlemesi bu bayrak OLMADAN alınır.
  images: { unoptimized: process.env.CEZERI_STATIK_PAKET === "1" },
  experimental: {
    serverComponentsExternalPackages: ["@prisma/client", "prisma"],
    outputFileTracingIncludes: {
      "/api/**/*": [
        "./src/generated/client/**/*",
        "../../packages/database/src/generated/client/**/*",
      ],
    },
  },
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  transpilePackages: [
    "@cezeri/api", "@cezeri/auth", "@cezeri/config", "@cezeri/database",
    "@cezeri/trpc", "@cezeri/features", "@cezeri/ai", "@cezeri/email",
  ],
  async headers() {
    return [{ source: "/(.*)", headers: securityHeaders }];
  },
  async redirects() {
    // Tanıtım sayfasının iki alternatif düzeni (`/alternatif`, `/sinema`)
    // değerlendirme için yayındaydı; kurucu sinema düzenini seçince ikisi de
    // kaldırıldı ve o düzen kök rotaya taşındı. Kalıcı yönlendirme veriyoruz
    // çünkü adresler paylaşılmış olabilir. Yönlendirme OLMASAYDI bu yollar
    // middleware'in kimlik kontrolüne düşer ve ziyaretçi tanıtım sayfası
    // yerine giriş ekranına atılırdı (ölçüldü: 307 → /login).
    return [
      { source: "/alternatif", destination: "/", permanent: true },
      { source: "/sinema", destination: "/", permanent: true },
      // Turkce kanonik dildir ve oneksiz yayinlanir. `/tr` yazan ziyaretci
      // ve tarayici koke gitmeli; yonlendirme olmasa middleware'in kimlik
      // kontrolune duser ve giris ekraniyla karsilasirdi.
      { source: "/tr", destination: "/", permanent: true },
      { source: "/tr/:path*", destination: "/", permanent: true },
    ];
  },
  async rewrites() {
    return [];
  },
};
