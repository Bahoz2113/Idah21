"use client";
import { useState } from "react";
import Link from "next/link";
import { trpc } from "@cezeri/trpc";
import { useRealtimeAll } from "@cezeri/features";

type Role = "ADMIN"|"TEACHER"|"PARENT"|"STUDENT";

const ROLE_LABEL: Record<Role, string>  = { ADMIN:"Yönetici", TEACHER:"Eğitmen", PARENT:"Veli", STUDENT:"Öğrenci" };
const ROLE_COLOR: Record<Role, string>  = { ADMIN:"bg-vurgu/10 text-vurgu", TEACHER:"bg-mavi/10 text-mavi", PARENT:"bg-turkuaz/10 text-turkuaz", STUDENT:"bg-gray-100 text-gray-600" };

const EMPTY_FORM = { firstName: "", lastName: "", email: "", role: "TEACHER" as "ADMIN" | "TEACHER" };

export default function AdminKullanicilarPage(): JSX.Element {
  useRealtimeAll();
  const utils = trpc.useUtils();
  const users = trpc.adminUsers.list.useQuery();

  const precreate    = trpc.adminUsers.precreate.useMutation({
    onSuccess: () => { utils.adminUsers.list.invalidate(); setForm(EMPTY_FORM); setShowForm(false); },
  });
  const changeRole       = trpc.adminUsers.changeRole.useMutation({ onSuccess: () => utils.adminUsers.list.invalidate() });
  const deactivate       = trpc.adminUsers.deactivate.useMutation({ onSuccess: () => utils.adminUsers.list.invalidate() });
  const activate          = trpc.adminUsers.activate.useMutation({ onSuccess: () => utils.adminUsers.list.invalidate() });
  const deleteUser        = trpc.adminUsers.delete.useMutation({ onSuccess: () => utils.adminUsers.list.invalidate() });
  const forcePasswordReset = trpc.adminUsers.forcePasswordReset.useMutation({ onSuccess: () => utils.adminUsers.list.invalidate() });
  const unlockAccount      = trpc.adminUsers.unlockAccount.useMutation({ onSuccess: () => utils.adminUsers.list.invalidate() });

  const [filter, setFilter] = useState<Role|"ALL">("ALL");
  const [confirmDelete, setConfirmDelete] = useState<string|null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);

  const list = users.data?.filter((u: any) => filter === "ALL" || u.role === filter) ?? [];

  return (
    <div className="p-4 sm:p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <h1 className="text-xl font-bold text-lacivert">Kullanıcı Yönetimi</h1>
        <div className="flex gap-2">
          <Link href="/admin/kullanicilar/guvenlik" className="text-xs px-3 py-2 rounded-lg border border-gray-300 text-gray-600 font-semibold">
            🛡️ Güvenlik Logları
          </Link>
          <button onClick={() => setShowForm(!showForm)}
            className="text-xs px-3 py-2 rounded-lg bg-mavi text-white font-semibold">
            {showForm ? "Vazgeç" : "+ Yeni Kullanıcı"}
          </button>
        </div>
      </div>

      {/* Yeni admin/eğitmen ön kaydı */}
      {showForm && (
        <div className="bg-white border rounded-xl p-4 mb-4 space-y-3">
          <p className="text-xs text-gray-500">
            Kullanıcı burada ön kayıt edilir; şifresi YOKTUR. Kendisi <b>/ilk-kurulum</b> sayfasından
            e-postasını girip şifresini belirleyecek ve e-posta doğrulama koduyla hesabını aktive edecektir.
          </p>
          <div className="grid sm:grid-cols-2 gap-3">
            <input className="border p-2 rounded-lg text-sm" placeholder="Ad"
              value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} />
            <input className="border p-2 rounded-lg text-sm" placeholder="Soyad"
              value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} />
            <input className="border p-2 rounded-lg text-sm sm:col-span-2" type="email" placeholder="E-posta"
              value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            <select className="border p-2 rounded-lg text-sm bg-white sm:col-span-2"
              value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value as "ADMIN" | "TEACHER" })}>
              <option value="TEACHER">Eğitmen</option>
              <option value="ADMIN">Yönetici</option>
            </select>
          </div>
          {precreate.error && <p className="text-xs text-red-500">{precreate.error.message}</p>}
          <button
            disabled={!form.firstName || !form.lastName || !form.email || precreate.isPending}
            onClick={() => precreate.mutate(form)}
            className="w-full bg-mavi text-white py-2.5 rounded-lg text-sm font-semibold disabled:opacity-40">
            {precreate.isPending ? "Oluşturuluyor…" : "Kullanıcıyı Ön Kaydet"}
          </button>
        </div>
      )}

      {/* Filtre */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {(["ALL","ADMIN","TEACHER","PARENT","STUDENT"] as const).map((r) => (
          <button key={r} onClick={() => setFilter(r)}
            className={`px-3 py-1 rounded-full text-xs font-semibold border transition ${filter === r ? "bg-lacivert text-white border-lacivert" : "border-gray-300 text-gray-500"}`}>
            {r === "ALL" ? `Tümü (${users.data?.length ?? 0})` : `${ROLE_LABEL[r as Role]} (${users.data?.filter((u: any)=>u.role===r).length??0})`}
          </button>
        ))}
      </div>

      <div className="space-y-2">
        {list.map((u: any) => (
          <div key={u.id} className={`bg-white border rounded-xl p-3 flex items-center gap-3 flex-wrap ${u.status === "PASSIVE" ? "opacity-50" : ""}`}>
            <div className="w-10 h-10 rounded-full bg-lacivert text-white flex items-center justify-center font-bold shrink-0">
              {(u.firstName?.[0] ?? u.email?.[0] ?? "?").toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-lacivert truncate flex items-center gap-2 flex-wrap">
                {u.firstName} {u.lastName}
                {u.status === "PASSIVE" && <span className="text-xs text-red-500">(Pasif)</span>}
                {u.status !== "PASSIVE" && !u.setupComplete && <span className="text-xs text-amber-600">(Kurulum bekleniyor)</span>}
              </p>
              <p className="text-xs text-gray-500">{u.email}{u.lastLoginAt ? ` · Son giriş: ${new Date(u.lastLoginAt).toLocaleString("tr-TR")}` : ""}</p>
            </div>
            <span className={`text-xs font-semibold px-2 py-1 rounded-full shrink-0 ${ROLE_COLOR[u.role as Role]}`}>
              {ROLE_LABEL[u.role as Role]}
            </span>
            <div className="flex gap-1 shrink-0 flex-wrap">
              <select value={u.role}
                onChange={(e) => changeRole.mutate({ userId: u.id, role: e.target.value as Role })}
                className="text-xs border rounded px-1 py-0.5 bg-gray-50">
                {(["ADMIN","TEACHER","PARENT","STUDENT"] as Role[]).map(r => (
                  <option key={r} value={r}>{ROLE_LABEL[r]}</option>
                ))}
              </select>
              {u.status === "ACTIVE"
                ? <button onClick={() => deactivate.mutate({ userId: u.id })}
                    className="text-xs px-2 py-1 rounded bg-amber-50 text-amber-600 border border-amber-300">Pasif Et</button>
                : <button onClick={() => activate.mutate({ userId: u.id })}
                    className="text-xs px-2 py-1 rounded bg-green-50 text-green-600 border border-green-300">Aktif Et</button>
              }
              {u.setupComplete && (
                <button onClick={() => { if (confirm(`${u.firstName} ${u.lastName} için şifre sıfırlansın mı? Kullanıcı bir sonraki girişte /ilk-kurulum'dan yeni şifre belirleyecek.`)) forcePasswordReset.mutate({ userId: u.id }); }}
                  className="text-xs px-2 py-1 rounded bg-blue-50 text-blue-600 border border-blue-200">Şifreyi Sıfırla</button>
              )}
              <button onClick={() => unlockAccount.mutate({ userId: u.id })}
                className="text-xs px-2 py-1 rounded bg-gray-50 text-gray-500 border border-gray-200">Kilidi Aç</button>
              {confirmDelete === u.id ? (
                <div className="flex gap-1">
                  <button onClick={() => { deleteUser.mutate({ userId: u.id, confirm: true }); setConfirmDelete(null); }}
                    className="text-xs px-2 py-1 rounded bg-red-500 text-white">Evet, Sil</button>
                  <button onClick={() => setConfirmDelete(null)}
                    className="text-xs px-2 py-1 rounded bg-gray-200">İptal</button>
                </div>
              ) : (
                <button onClick={() => setConfirmDelete(u.id)}
                  className="text-xs px-2 py-1 rounded bg-red-50 text-red-500 border border-red-200">Sil</button>
              )}
            </div>
          </div>
        ))}
        {!list.length && <p className="text-gray-400 text-sm">Kullanıcı yok.</p>}
      </div>
    </div>
  );
}
