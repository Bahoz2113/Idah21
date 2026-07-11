import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@cezeri/auth";

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json();
    if (!username || !password) {
      return NextResponse.json({ ok: false, message: "Kullanıcı adı ve şifre gerekli" }, { status: 400 });
    }

    const sb = createServiceClient();
    const { data: user, error } = await sb
      .from("users")
      .select("email, status, phone, role")
      .eq("username", username.toLowerCase())
      .single();

    if (error || !user) {
      return NextResponse.json({ ok: false, message: "Kullanıcı bulunamadı" }, { status: 404 });
    }

    if (user.status === "PASSIVE") {
      return NextResponse.json({ ok: false, message: "Hesabınız pasif." }, { status: 403 });
    }

    const email = user.email ?? `${username.toLowerCase()}@cezeri.local`;
    const { data: authData, error: authError } = await sb.auth.signInWithPassword({ email, password });

    if (authError || !authData.session) {
      return NextResponse.json({ ok: false, message: "Kullanıcı adı veya şifre hatalı" }, { status: 401 });
    }

    const phone = user.phone ?? "";
    const phoneMasked = phone.length > 4 ? phone.slice(0, -4).replace(/\d/g, "*") + phone.slice(-4) : phone;

    return NextResponse.json({
      ok: true,
      email,
      phone,
      phoneMasked,
      role: (authData.user?.user_metadata?.role ?? user.role ?? "PARENT").toUpperCase(),
      session: authData.session,
    });
  } catch (err: any) {
    console.error("username-to-email error:", err);
    return NextResponse.json({ ok: false, message: "Sunucu hatası" }, { status: 500 });
  }
}
