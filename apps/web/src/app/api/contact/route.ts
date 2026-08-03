import { NextResponse } from "next/server";
import { getEmailProvider, type ContactLead } from "@cezeri/email";
import { contact, disciplines } from "@/lib/seo/site";

/**
 * "Aday Mühendis Uçuş İzin Formu" başvuru uç noktası.
 *
 * Bu rota herkese açıktır — kimlik doğrulaması yoktur. Bu yüzden savunma
 * katmanları burada zorunludur: gövde boyutu sınırı, alan doğrulaması,
 * bal küpü (honeypot) ve IP başına hız sınırı.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_BODY_BYTES = 8 * 1024;
const RATE_LIMIT = { windowMs: 10 * 60 * 1000, max: 5 };

/**
 * Bellek içi hız sınırlayıcı.
 *
 * SINIR: Süreç belleğinde tutulur; birden fazla sunucu örneğinde (veya
 * serverless'ta soğuk başlangıç sonrası) sayaç sıfırlanır. Bu, spam'i
 * tamamen durdurmaz ama otomatik gönderimin maliyetini anlamlı ölçüde
 * artırır. Kalıcı koruma gerekirse Redis/Upstash tabanlı bir sayaç veya
 * kenar (edge) katmanında hız sınırı gerekir.
 */
const hits = new Map<string, { count: number; resetAt: number }>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = hits.get(ip);

  if (!entry || now > entry.resetAt) {
    hits.set(ip, { count: 1, resetAt: now + RATE_LIMIT.windowMs });

    // Map'in sınırsız büyümesini engelle: süresi dolmuş kayıtları temizle.
    if (hits.size > 5000) {
      for (const [key, value] of hits) if (now > value.resetAt) hits.delete(key);
    }
    return false;
  }

  entry.count += 1;
  return entry.count > RATE_LIMIT.max;
}

/**
 * Girdiyi normalize eder.
 *
 * Kontrol karakterleri (CR/LF dahil) e-posta başlığı enjeksiyonu ve log
 * kirletme için kullanılabilir; boşluğa çevrilerek etkisizleştirilir.
 * Kod noktası üzerinden filtreleme, kaynak dosyaya ham kontrol karakteri
 * gömme riskini de ortadan kaldırır.
 */
function clean(value: unknown, maxLen: number): string {
  if (typeof value !== "string") return "";

  let out = "";
  for (const ch of value) {
    const code = ch.codePointAt(0) ?? 0;
    out += code < 0x20 || code === 0x7f ? " " : ch;
  }

  return out.replace(/\s+/g, " ").trim().slice(0, maxLen);
}

const PHONE_RE = /^[0-9+\s()-]{10,20}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const VALID_INTERESTS = new Set<string>([
  ...disciplines.map((d) => d.title),
  "Henüz emin değilim",
]);

export async function POST(req: Request): Promise<NextResponse> {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "unknown";

  if (rateLimited(ip)) {
    return NextResponse.json(
      { ok: false, error: "Çok fazla deneme yapıldı. Lütfen bir süre sonra tekrar deneyin." },
      { status: 429 },
    );
  }

  const raw = await req.text();
  if (raw.length > MAX_BODY_BYTES) {
    return NextResponse.json({ ok: false, error: "İstek gövdesi çok büyük." }, { status: 413 });
  }

  let body: Record<string, unknown>;
  try {
    body = JSON.parse(raw) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ ok: false, error: "Geçersiz istek." }, { status: 400 });
  }

  // Bal küpü: gerçek kullanıcıya görünmeyen alan doldurulmuşsa gönderen bottur.
  // Bota başarı döndürmek, hata görüp yeniden denemesini engeller.
  if (clean(body.website, 100) !== "") {
    return NextResponse.json({ ok: true });
  }

  const lead: ContactLead = {
    parentName: clean(body.parentName, 80),
    phone: clean(body.phone, 20),
    email: clean(body.email, 120) || undefined,
    studentAge: clean(body.studentAge, 10),
    interest: clean(body.interest, 80),
    message: clean(body.message, 1000) || undefined,
  };

  const errors: string[] = [];
  if (lead.parentName.length < 2) errors.push("Ad soyad gerekli.");
  if (!PHONE_RE.test(lead.phone)) errors.push("Geçerli bir telefon numarası girin.");
  if (lead.email && !EMAIL_RE.test(lead.email)) errors.push("Geçerli bir e-posta adresi girin.");

  const age = Number(lead.studentAge);
  if (!Number.isInteger(age) || age < 5 || age > 18) {
    errors.push("Öğrenci yaşı 5-18 aralığında olmalı.");
  }
  if (!VALID_INTERESTS.has(lead.interest)) errors.push("Geçerli bir ilgi alanı seçin.");

  if (errors.length > 0) {
    return NextResponse.json({ ok: false, error: errors.join(" ") }, { status: 422 });
  }

  try {
    await getEmailProvider().sendContactLead(contact.email, lead);
  } catch (err) {
    // Hata detayı istemciye SIZDIRILMAZ (SMTP host/kullanıcı bilgisi içerebilir).
    // eslint-disable-next-line no-console
    console.error("[contact] Başvuru iletilemedi:", err);
    return NextResponse.json(
      {
        ok: false,
        error: `Başvuru şu anda iletilemedi. Lütfen ${contact.phoneDisplay} numarasından bize ulaşın.`,
      },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
