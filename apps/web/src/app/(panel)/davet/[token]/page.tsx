"use client";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { trpc } from "@cezeri/trpc";
import { createBrowserClient } from "@cezeri/auth";

const ROLE_ROUTE: Record<string, string> = {
  ADMIN: "/admin/dashboard", TEACHER: "/teacher/dashboard",
  PARENT: "/parent/dashboard", STUDENT: "/student/dashboard",
};

export default function DavetPage(): JSX.Element {
  const { token } = useParams<{ token: string }>();
  const router    = useRouter();
  const [phone, setPhone]   = useState("");
  const [pass,  setPass]    = useState("");
  const [pass2, setPass2]   = useState("");
  const [error, setError]   = useState("");
  const [busy,  setBusy]    = useState(false);

  const inv    = trpc.invitations.getByToken.useQuery({ token }, { retry: false });
  const accept = trpc.invitations.accept.useMutation();

  async function handleSubmit() {
    if (pass !== pass2) { setError("Şifreler eşleşmiyor."); return; }
    setError(""); setBusy(true);
    try {
      const res = await accept.mutateAsync({ token, phone, password: pass });
      // Otomatik giriş
      const digits = phone.replace(/\D/g, "");
      const normalizedPhone = digits.startsWith("0") ? `+90${digits.slice(1)}` : digits.startsWith("5") ? `+90${digits}` : `+${digits}`;
      const email = `${normalizedPhone.replace("+", "")}@cezeri.local`;
      const sb = createBrowserClient();
      const { data } = await sb.auth.signInWithPassword({ email, password: pass });
      if (data.session) {
        window.location.href = ROLE_ROUTE[res.role] ?? "/login";
      } else {
        router.push("/login?registered=1");
      }
    } catch (e: any) { setError(e.message); }
    setBusy(false);
  }

  if (inv.isLoading) return (
    <main className="min-h-screen bg-lacivert flex items-center justify-center">
      <p className="text-white">Yükleniyor…</p>
    </main>
  );

  if (inv.isError) return (
    <main className="min-h-screen bg-lacivert flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-8 max-w-sm w-full text-center">
        <div className="text-4xl mb-3">❌</div>
        <h1 className="font-bold text-lacivert text-lg">Geçersiz Davet</h1>
        <p className="text-gray-500 text-sm mt-2">Bu davet linki geçersiz veya süresi dolmuş.</p>
        <a href="/login" className="mt-4 block text-mavi font-semibold">Giriş sayfasına git →</a>
      </div>
    </main>
  );

  const data = inv.data;
  const isReset = data?.type === "reset";

  return (
    <main className="min-h-screen bg-lacivert flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-sm shadow-xl overflow-hidden">
        <div className="bg-lacivert px-6 py-5 text-center">
          <div className="text-2xl font-bold text-white">CEZERİ <span className="text-turkuaz">OS</span></div>
          <div className="text-xs text-white/60 mt-0.5">
            {isReset ? "Şifre Sıfırlama" : "Hesap Oluştur"}
          </div>
        </div>

        <div className="p-6 space-y-4">
          <div className="bg-turkuaz/10 rounded-xl p-4 text-center">
            <p className="text-sm text-lacivert">
              Merhaba <strong>{data?.firstName} {data?.lastName}</strong>! 👋
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {isReset
                ? "Yeni şifrenizi belirleyin."
                : `CEZERİ ROBOTECH'e ${data?.role === "TEACHER" ? "eğitmen" : "veli"} olarak davet edildiniz.`}
            </p>
          </div>

          <div>
            <label className="text-xs text-gray-500 mb-1 block">Cep Telefonu</label>
            <div className="flex border rounded-lg overflow-hidden">
              <span className="bg-gray-100 px-3 flex items-center text-sm text-gray-500 border-r">🇹🇷 +90</span>
              <input className="flex-1 p-3 outline-none text-sm" placeholder="5XX XXX XX XX"
                inputMode="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
            </div>
          </div>

          <div>
            <label className="text-xs text-gray-500 mb-1 block">Şifre (min 8 karakter)</label>
            <input className="border p-3 rounded-lg w-full text-sm" type="password"
              placeholder="••••••••" value={pass} onChange={(e) => setPass(e.target.value)} />
          </div>

          <div>
            <label className="text-xs text-gray-500 mb-1 block">Şifre Tekrar</label>
            <input className={`border p-3 rounded-lg w-full text-sm ${
              pass2 && pass2 !== pass ? "border-red-400" : pass2 && pass2 === pass ? "border-green-400" : ""
            }`}
              type="password" placeholder="••••••••"
              value={pass2} onChange={(e) => setPass2(e.target.value)} />
          </div>

          <button onClick={handleSubmit}
            disabled={!phone || !pass || pass !== pass2 || pass.length < 8 || busy}
            className="w-full bg-mavi text-white py-3 rounded-lg font-bold disabled:opacity-40">
            {busy ? "İşleniyor…" : isReset ? "Şifremi Güncelle ✓" : "Hesabımı Oluştur ✓"}
          </button>

          {error && <p className="text-sm text-center text-red-500 bg-red-50 p-2 rounded">{error}</p>}
        </div>
      </div>
    </main>
  );
}
