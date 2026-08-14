import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyAccessToken } from "@cezeri/auth";
import { defaultLocale, locales } from "@/lib/i18n/config";

const ROLE_ROUTES: Record<string, string[]> = {
  "/admin":   ["ADMIN"],
  "/teacher": ["TEACHER", "ADMIN"],
  "/parent":  ["PARENT", "ADMIN"],
  "/student": ["STUDENT", "ADMIN"],
};

// Normalde /admin/* yalnızca ADMIN'e açıktır. Ancak eğitmenin de sınıf ve
// öğrenci detaylarını görüp düzenleyebilmesi için BU alt yollar TEACHER'a da açılır.
// (Kullanıcı yönetimi, güvenlik, envanter vb. yine yalnızca ADMIN'de kalır.)
const TEACHER_ALLOWED_ADMIN_PATHS = ["/admin/siniflar", "/admin/ogrenciler"];

const PUBLIC_PREFIXES = [
  "/login", "/ilk-kurulum", "/sifremi-unuttum", "/register",
  "/api/", "/_next", "/favicon",
  "/icon", "/manifest", "/sw.js", "/apple-touch-icon", "/robots",
  // Public tanıtım sitesi varlıkları ve SEO uç noktaları.
  // Bunlar kimlik doğrulaması ARDINA DÜŞERSE arama motorları ve AI
  // tarayıcıları /login'e yönlendirilir; site indekslenemez.
  "/sitemap", "/llms.txt", "/opengraph-image", "/twitter-image", "/assets/",
  // Kendi sunucumuzdan servis edilen tanıtım fontları. Kimlik doğrulamasının
  // ardına düşerse başlıklar yedek fontla çizilir ve düzen kayar.
  "/fonts/",
];

/** `/en`, `/ku`, `/ar` — sondaki eğik çizgili biçimleriyle birlikte. */
const PUBLIC_LOCALE_PATHS = new Set(
  locales
    .filter((l) => l !== defaultLocale)
    .flatMap((l) => [`/${l}`, `/${l}/`]),
);

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (PUBLIC_PREFIXES.some((p) => pathname.startsWith(p))) return NextResponse.next();
  if (pathname.startsWith("/quiz/")) return NextResponse.next();
  if (pathname === "/") return NextResponse.next();

  // Tanıtım sitesinin dil adresleri (`/en`, `/ku`, `/ar`). Bunlar da kök
  // rota kadar herkese açıktır; kimlik kontrolüne düşerlerse ziyaretçi ve
  // arama motoru giriş ekranına yönlendirilir ve dil sayfaları hiç
  // indekslenmez. Türkçe öneksiz olduğu için listede yok — onu bir üstteki
  // satır zaten karşılıyor.
  if (PUBLIC_LOCALE_PATHS.has(pathname)) return NextResponse.next();

  const token = req.cookies.get("ceos_at")?.value;
  const payload = token ? await verifyAccessToken(token) : null;

  if (!payload) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("redirect", pathname);
    return NextResponse.redirect(url);
  }

  const userRole = String(payload.role ?? "").toUpperCase();

  // Eğitmen, izin verilen /admin alt yollarına (sınıf/öğrenci detayı) erişebilir
  if (
    userRole === "TEACHER" &&
    TEACHER_ALLOWED_ADMIN_PATHS.some((p) => pathname === p || pathname.startsWith(p + "/"))
  ) {
    return NextResponse.next();
  }

  const matchedPrefix = Object.keys(ROLE_ROUTES).find((p) => pathname.startsWith(p));

  if (matchedPrefix) {
    const allowed = ROLE_ROUTES[matchedPrefix];
    if (!allowed.includes(userRole)) {
      const own =
        userRole === "TEACHER" ? "/teacher/dashboard" :
        userRole === "PARENT"  ? "/parent/dashboard"  :
        userRole === "STUDENT" ? "/student/dashboard"  :
        userRole === "ADMIN"   ? "/admin/dashboard"    : "/login";
      return NextResponse.redirect(new URL(own, req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.png|.*\\.webmanifest).*)"],
};
