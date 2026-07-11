"use client";
import { useState } from "react";
import Link from "next/link";
import { OwlMark } from "@/components/OwlMark";
import { useRouter } from "next/navigation";

type Step = "email" | "reset";

export default function SifremiUnuttumPage(): JSX.Element {
  const router = useRouter();
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [busy, setBusy] = useState(false);

  async function requestCode() {
    setError(""); setBusy(true);
    try {
      await fetch("/api/auth/password-reset/request", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      // Anti-enumeration: kullanıcı var/yok fark etmeksizin her zaman bu adıma geçilir
      setInfo("Eğer bu e-posta sistemde kayıtlıysa, bir doğrulama kodu gönderildi.");
      setStep("reset");
    } catch { setError("Bağlantı hatası."); }
    setBusy(false);
  }

  async function confirmReset() {
    setError("");
    if (password.length < 8) return setError("Şifre en az 8 karakter olmalı.");
    if (password !== password2) return setError("Şifreler eşleşmiyor.");
    if (code.length < 6) return setError("6 haneli kodu girin.");
    setBusy(true);
    try {
      const res = await fetch("/api/auth/password-reset/verify", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code, newPassword: password }),
      });
      const data = await res.json();
      if (!data.ok) { setError(data.error ?? "Bir hata oluştu."); setBusy(false); return; }
      router.push("/login?reset=1");
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
          <div className="text-xs text-white/50 mt-1">Şifremi Unuttum</div>
        </div>

        <div className="p-6 space-y-3">
          {step === "email" && (
            <>
              <p className="text-sm text-gray-500 text-center">E-posta adresinizi girin, size bir doğrulama kodu gönderelim.</p>
              <input className="border p-3 rounded-lg w-full text-sm" type="email" placeholder="ornek@cezeri.com"
                value={email} onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && requestCode()} />
              <button onClick={requestCode} disabled={!email || busy}
                className="w-full bg-mavi text-white py-3 rounded-lg font-semibold disabled:opacity-40">
                {busy ? "Gönderiliyor…" : "Kod Gönder →"}
              </button>
            </>
          )}

          {step === "reset" && (
            <>
              {info && <p className="text-sm text-center p-2 rounded bg-blue-50 text-blue-700">{info}</p>}
              <input className="border-2 p-3 rounded-lg w-full text-center text-2xl tracking-[0.5em] font-bold" maxLength={6}
                inputMode="numeric" placeholder="000000" value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))} />
              <input className="border p-3 rounded-lg w-full text-sm" type="password" placeholder="Yeni şifre (en az 8 karakter)"
                autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} />
              <input className="border p-3 rounded-lg w-full text-sm" type="password" placeholder="Şifreyi tekrar girin"
                autoComplete="new-password" value={password2} onChange={(e) => setPassword2(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && confirmReset()} />
              <button onClick={confirmReset} disabled={busy}
                className="w-full bg-turkuaz text-lacivert py-3 rounded-lg font-bold disabled:opacity-40">
                {busy ? "Kaydediliyor…" : "Şifreyi Sıfırla ✓"}
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
