import { NextResponse } from "next/server";
import { AGE_GROUPS, MISSIONS } from "@/lib/content";

export const runtime = "nodejs";

/** Basit bellek içi hız sınırı. Tek örnek için yeterli; ölçeklenirse KV'ye taşınır. */
const hits = new Map<string, { count: number; resetAt: number }>();
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = hits.get(ip);
  if (!entry || now > entry.resetAt) {
    hits.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }
  entry.count += 1;
  return entry.count > MAX_PER_WINDOW;
}

const AGE_SET = new Set<string>(AGE_GROUPS);
const MISSION_SET = new Set<string>(MISSIONS.map((m) => m.value));

function bad(error: string) {
  return NextResponse.json({ ok: false, error }, { status: 400 });
}

export async function POST(request: Request) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

  if (rateLimited(ip)) {
    return NextResponse.json(
      { ok: false, error: "Çok fazla deneme. Lütfen daha sonra tekrar deneyin." },
      { status: 429 },
    );
  }

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return bad("Geçersiz istek gövdesi.");
  }

  // Bal küpü: doluysa bot demektir. Başarı döndürüp sessizce yut.
  if (typeof body.sirket === "string" && body.sirket.length > 0) {
    return NextResponse.json({ ok: true });
  }

  const str = (v: unknown) => (typeof v === "string" ? v.trim() : "");

  const adaySoyad = str(body.adaySoyad);
  const veliSoyad = str(body.veliSoyad);
  const yasGrubu = str(body.yasGrubu);
  const gorev = str(body.gorev);
  const telefon = str(body.telefon);
  const eposta = str(body.eposta);

  if (adaySoyad.length < 2) return bad("Aday adı en az 2 karakter olmalı.");
  if (veliSoyad.length < 2) return bad("Veli adı en az 2 karakter olmalı.");
  if (!AGE_SET.has(yasGrubu)) return bad("Geçersiz yaş grubu.");
  if (!MISSION_SET.has(gorev)) return bad("Geçersiz görev seçimi.");
  if (!/^[\d\s+()-]{10,20}$/.test(telefon)) return bad("Geçersiz telefon numarası.");
  if (eposta && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(eposta))
    return bad("Geçersiz e-posta adresi.");

  const application = {
    adaySoyad,
    veliSoyad,
    yasGrubu,
    gorev,
    telefon,
    eposta: eposta || null,
    receivedAt: new Date().toISOString(),
  };

  // TODO(kullanıcı): APPLY_WEBHOOK_URL tanımlanınca başvuru oraya iletilir.
  // Tanımlı değilse başvuru yalnızca sunucu günlüğüne düşer — veri tabanı yok,
  // kişisel veri kalıcı olarak saklanmaz (KVKK).
  const webhook = process.env.APPLY_WEBHOOK_URL;
  if (webhook) {
    try {
      await fetch(webhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(application),
      });
    } catch {
      return NextResponse.json(
        { ok: false, error: "Başvuru iletilemedi. Lütfen telefonla ulaşın." },
        { status: 502 },
      );
    }
  } else {
    console.info("[apply] webhook tanımsız, başvuru:", {
      ...application,
      telefon: "***",
    });
  }

  return NextResponse.json({ ok: true });
}
