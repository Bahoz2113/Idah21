"use client";
import { useState } from "react";
import Link from "next/link";
import { OwlMark } from "@/components/OwlMark";

const ROLE_ROUTE: Record<string, string> = {
  ADMIN: "/admin/dashboard", TEACHER: "/teacher/dashboard",
  PARENT: "/parent/dashboard", STUDENT: "/student/dashboard",
};

type Step = "email" | "password" | "verify";

export default function IlkKurulumPage(): JSX.Element {
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function checkEmail() {
    setError(""); setBusy(true);
    try {
      const res = await fetch("/api/auth/setup/start", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!data.ok) { setError(data.error ?? "Bir hata oluştu."); setBusy(false); return; }
      setStep("password");
    } catch { setError("Bağlantı hatası."); }
    setBusy(false);
  }

  async function setNewPassword() {
    setError("");
    if (password.length < 8) return setError("Şifre en az 8 karakter olmalı.");
    if (password !== password2) return setError("Şifreler eşleşmiyor.");
    setBusy(true);
    try {
      const res = await fetch("/api/auth/setup/set-password", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!data.ok) { setError(data.error ?? "Bir hata oluştu."); setBusy(false); return; }
      setStep("verify");
    } catch { setError("Bağlantı hatası."); }
    setBusy(false);
  }

  async function verifyCode() {
    if (code.length < 6) return;
    setError(""); setBusy(true);
    try {
      const res = await fetch("/api/auth/setup/verify", {
        method: "POST", headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, code }),
      });
      const data = await res.json();
      if (!data.ok) { setError(data.error ?? "Kod hatalı."); setBusy(false); return; }
      window.location.href = ROLE_ROUTE[data.role] ?? "/admin/dashboard";
    } catch { setError("Bağlantı hatası."); setBusy(false); }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-lacivert p-4">
      <div className="bg-white rounded-2xl w-full max-w-sm shadow-xl overflow-hidden">
        <div className="bg-lacivert px-6 py-6 flex flex-col items-center">
          <div className="w-16 h-16 rounded-2xl bg-white/95 flex items-center justify-center p-1.5 shadow-czr-md mx-auto"><OwlMark size={52} /></div>
          <div className="mt-2 text-xl font-extrabold tracking-tight">
            <span className="text-white">CZR</span> <span className="text-vurgu">CEOS</span>
          </div>
          <div className="text-xs text-white/50 mt-1">İlk Kurulum</div>
        </div>

        <div className="p-6 space-y-3">
          {step === "email" && (
            <>
              <p className="text-sm text-gray-500 text-center">
                Yöneticinizin sisteme kaydettiği e-posta adresinizi girin.
              </p>
              <input className="border p-3 rounded-lg w-full text-sm" type="email" placeholder="ornek@cezeri.com"
                value={email} onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && checkEmail()} />
              <button onClick={checkEmail} disabled={!email || busy}
                className="w-full bg-mavi text-white py-3 rounded-lg font-semibold disabled:opacity-40">
                {busy ? "Kontrol ediliyor…" : "Devam Et →"}
              </button>
            </>
          )}

          {step === "password" && (
            <>
              <p className="text-sm text-gray-500 text-center">Hesabınız için bir şifre belirleyin.</p>
              <input className="border p-3 rounded-lg w-full text-sm" type="password" placeholder="Yeni şifre (en az 8 karakter)"
                autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} />
              <input className="border p-3 rounded-lg w-full text-sm" type="password" placeholder="Şifreyi tekrar girin"
                autoComplete="new-password" value={password2} onChange={(e) => setPassword2(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && setNewPassword()} />
              <button onClick={setNewPassword} disabled={!password || !password2 || busy}
                className="w-full bg-mavi text-white py-3 rounded-lg font-semibold disabled:opacity-40">
                {busy ? "Kaydediliyor…" : "Şifreyi Kaydet →"}
              </button>
            </>
          )}

          {step === "verify" && (
            <>
              <div className="text-center">
                <div className="text-3xl mb-2">📧</div>
                <p className="text-sm text-gray-600"><b>{email}</b> adresine 6 haneli doğrulama kodu gönderdik.</p>
              </div>
              <input className="border-2 p-3 rounded-lg w-full text-center text-2xl tracking-[0.5em] font-bold" maxLength={6}
                inputMode="numeric" value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                onKeyDown={(e) => e.key === "Enter" && verifyCode()} />
              <button onClick={verifyCode} disabled={code.length < 6 || busy}
                className="w-full bg-turkuaz text-lacivert py-3 rounded-lg font-bold disabled:opacity-40">
                {busy ? "Doğrulanıyor…" : "Kurulumu Tamamla ✓"}
              </button>
            </>
          )}

          {error && <p className="text-sm text-center p-2 rounded bg-red-50 text-red-500">{error}</p>}

          <p className="text-center text-sm text-gray-400 pt-2">
            <Link href="/login" className="text-mavi font-semibold">← Giriş sayfasına dön</Link>
          </p>
        </div>
      </div>
    </main>
  );
}
