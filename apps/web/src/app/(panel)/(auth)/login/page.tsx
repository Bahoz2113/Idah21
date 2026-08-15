"use client";
import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { OwlMark } from "@/components/OwlMark";

const ROLE_ROUTE: Record<string, string> = {
  ADMIN: "/admin/dashboard", TEACHER: "/teacher/dashboard",
  PARENT: "/parent/dashboard", STUDENT: "/student/dashboard",
};

function OtpBoxes({ value, onChange, onSubmit }: { value: string; onChange: (v: string) => void; onSubmit: () => void }) {
  return (
    <div className="flex gap-2 justify-center">
      {[0,1,2,3,4,5].map((i) => (
        <input key={i} maxLength={1} type="text" inputMode="numeric"
          className="w-11 h-14 border-2 border-gray-200 rounded-xl text-center text-xl font-bold text-lacivert focus:border-vurgu focus:ring-2 focus:ring-vurgu/20 outline-none transition"
          value={value[i] ?? ""}
          onChange={(e) => {
            const v = e.target.value.replace(/\D/, "");
            const arr = value.split(""); arr[i] = v;
            const next = arr.join("").slice(0, 6);
            onChange(next);
            if (v && i < 5) (document.querySelectorAll("input[maxlength='1']")[i + 1] as HTMLInputElement)?.focus();
            if (next.length === 6) onSubmit();
          }}
          onKeyDown={(e) => {
            if (e.key === "Backspace" && !value[i] && i > 0)
              (document.querySelectorAll("input[maxlength='1']")[i - 1] as HTMLInputElement)?.focus();
          }}
        />
      ))}
    </div>
  );
}

function LoginForm() {
  const params = useSearchParams();
  const [email, setEmail]   = useState("");
  const [password, setPass] = useState("");
  const [step, setStep]     = useState<"credentials" | "otp">("credentials");
  const [otp, setOtp]       = useState("");
  const [error, setError]   = useState("");
  const [info, setInfo]     = useState("");
  const [busy, setBusy]     = useState(false);

  useEffect(() => {
    if (params.get("setup")) setInfo("Kurulum tamamlandı. Şimdi giriş yapabilirsiniz.");
    if (params.get("reset")) setInfo("Şifreniz güncellendi. Yeni şifrenizle giriş yapabilirsiniz.");
  }, [params]);

  async function handleLogin() {
    setError(""); setInfo(""); setBusy(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!data.ok) { setError(data.error ?? "Giriş başarısız."); setBusy(false); return; }
      setStep("otp");
    } catch {
      setError("Bağlantı hatası. Lütfen tekrar deneyin.");
    }
    setBusy(false);
  }

  async function handleOtp(codeOverride?: string) {
    const code = codeOverride ?? otp;
    if (code.length < 6) return;
    setError(""); setBusy(true);
    try {
      const res = await fetch("/api/auth/login/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, code }),
      });
      const data = await res.json();
      if (!data.ok) { setError(data.error ?? "Kod hatalı."); setBusy(false); return; }
      window.location.href = ROLE_ROUTE[data.role] ?? "/admin/dashboard";
    } catch {
      setError("Bağlantı hatası. Lütfen tekrar deneyin.");
      setBusy(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-darktech p-4 relative overflow-hidden">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full bg-turkuaz/10 blur-3xl pointer-events-none" />
      <div className="w-full max-w-sm relative z-10">
        {/* Marka başlık */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-20 h-20 rounded-2xl bg-white/95 flex items-center justify-center p-2 shadow-czr-lg">
            <OwlMark size={64} />
          </div>
          <div className="mt-3 text-2xl font-extrabold tracking-tight">
            <span className="text-white">CZR</span> <span className="text-vurgu">CEOS</span>
          </div>
          <div className="text-xs text-white/50 mt-1 tracking-wide">Eğitim Yönetim Sistemi</div>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-7 space-y-4">
          {step === "credentials" && (
            <>
              <div>
                <h1 className="text-lg font-bold text-lacivert">Giriş yap</h1>
                <p className="text-sm text-gray-400 mt-0.5">E-posta ve şifrenizle devam edin.</p>
              </div>

              <div className="space-y-3">
                <input
                  className="border border-gray-200 p-3 rounded-xl w-full text-sm text-lacivert focus:border-mavi focus:ring-2 focus:ring-mavi/15 outline-none transition"
                  type="email" placeholder="ornek@cezeri.com" autoComplete="username"
                  value={email} onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                />
                <input
                  className="border border-gray-200 p-3 rounded-xl w-full text-sm text-lacivert focus:border-mavi focus:ring-2 focus:ring-mavi/15 outline-none transition"
                  type="password" placeholder="Şifre" autoComplete="current-password"
                  value={password} onChange={(e) => setPass(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                />
              </div>

              <button
                onClick={handleLogin}
                disabled={!email || !password || busy}
                className="w-full bg-mavi text-white py-3 rounded-xl font-semibold disabled:opacity-40 hover:bg-lacivert transition-colors"
              >
                {busy ? "Kontrol ediliyor…" : "Giriş Yap"}
              </button>

              <div className="flex items-center justify-between text-sm pt-1">
                <Link href="/sifremi-unuttum" className="text-gray-400 hover:text-mavi transition-colors">Şifremi unuttum</Link>
                <Link href="/ilk-kurulum" className="text-vurgu font-semibold hover:text-vurguKoyu transition-colors">İlk kurulum →</Link>
              </div>
            </>
          )}

          {step === "otp" && (
            <>
              <div className="text-center">
                <div className="w-12 h-12 mx-auto rounded-full bg-vurgu/10 flex items-center justify-center mb-3">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className="text-vurgu">
                    <path d="M3 8l9 6 9-6M3 6h18v12H3z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h1 className="text-lg font-bold text-lacivert">Doğrulama kodu</h1>
                <p className="text-sm text-gray-400 mt-1">
                  <span className="font-medium text-gray-600">{email}</span> adresine gönderilen 6 haneli kodu girin.
                </p>
              </div>
              <OtpBoxes value={otp} onChange={setOtp} onSubmit={() => handleOtp()} />
              <button onClick={() => handleOtp()} disabled={otp.length < 6 || busy}
                className="w-full bg-vurgu text-white py-3 rounded-xl font-bold disabled:opacity-40 hover:bg-vurguKoyu transition-colors">
                {busy ? "Doğrulanıyor…" : "Doğrula ve Gir"}
              </button>
              <button onClick={() => { setStep("credentials"); setOtp(""); setError(""); }}
                className="text-sm text-gray-400 w-full text-center hover:text-gray-600 transition-colors">
                ← Geri dön
              </button>
            </>
          )}

          {error && <p className="text-sm text-center p-2.5 rounded-lg bg-red-50 text-red-600">{error}</p>}
          {info  && <p className="text-sm text-center p-2.5 rounded-lg bg-green-50 text-green-700">{info}</p>}
        </div>

        <p className="text-center text-xs text-white/30 mt-6">CEZERİ ROBOTECH · Batman</p>
      </div>
    </main>
  );
}

export default function LoginPage(): JSX.Element {
  return (
    <Suspense fallback={<div className="min-h-screen bg-lacivert flex items-center justify-center text-white">Yükleniyor…</div>}>
      <LoginForm />
    </Suspense>
  );
}
