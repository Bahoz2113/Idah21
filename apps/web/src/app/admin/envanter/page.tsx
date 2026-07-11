"use client";
import { ExportButtons } from "@/components/ExportButtons";
import { useState } from "react";
import { trpc } from "@cezeri/trpc";

export default function AdminEnvanterPage(): JSX.Element {
  const utils    = trpc.useUtils();
  const items    = trpc.inventory.list.useQuery();
  const classes  = trpc.lookup.classes.useQuery();
  const create   = trpc.inventory.create.useMutation({ onSuccess: () => utils.inventory.list.invalidate() });
  const remove   = trpc.inventory.delete.useMutation({ onSuccess: () => utils.inventory.list.invalidate() });
  const assign   = trpc.inventory.assign.useMutation({ onSuccess: () => utils.inventory.list.invalidate() });
  const ret      = trpc.inventory.returnItem.useMutation({ onSuccess: () => utils.inventory.list.invalidate() });

  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", category: "", totalQty: 1 });
  const [assignForm, setAssignForm] = useState<Record<string, { classId: string; qty: number }>>({});
  const [expand, setExpand] = useState<Record<string, boolean>>({});

  const list = (items.data ?? []) as any[];
  const classList = (classes.data ?? []) as any[];

  return (
    <div className="p-4 sm:p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold text-lacivert">Envanter</h1>
        <div className="flex gap-2">
          <ExportButtons
            title="Envanter Listesi"
            headers={["Malzeme", "Kategori", "Toplam", "Depoda", "Dışarıda"]}
            rows={(items.data as any[] ?? []).map((i: any) => [i.name, i.category??"-", i.totalQty, i.totalQty-Number(i.assignedQty??0), Number(i.assignedQty??0)])}
          />
          <button onClick={() => setShowForm(!showForm)} className="bg-mavi text-white px-4 py-2 rounded-lg text-sm font-semibold">+ Malzeme Ekle</button>
        </div>
      </div>

      {showForm && (
        <div className="bg-white border rounded-xl p-4 mb-4 space-y-3">
          <input className="border p-2 rounded-lg w-full text-sm" placeholder="Malzeme adı *" value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} />
          <div className="flex gap-2">
            <input className="border p-2 rounded-lg flex-1 text-sm" placeholder="Kategori (örn: Elektronik)" value={form.category} onChange={(e) => setForm({...form, category: e.target.value})} />
            <input type="number" min={0} className="border p-2 rounded-lg w-24 text-sm" placeholder="Adet" value={form.totalQty} onChange={(e) => setForm({...form, totalQty: Number(e.target.value)})} />
          </div>
          <div className="flex gap-2">
            <button onClick={() => { if(form.name){create.mutate(form);setForm({name:"",category:"",totalQty:1});setShowForm(false);}}} className="bg-mavi text-white px-4 py-2 rounded-lg text-sm">Kaydet</button>
            <button onClick={() => setShowForm(false)} className="bg-gray-100 px-4 py-2 rounded-lg text-sm">İptal</button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {list.map((item: any) => {
          const assigned    = Number(item.assignedQty ?? 0);
          const available   = item.totalQty - assigned;
          const assignments = Array.isArray(item.assignments) ? item.assignments : [];
          const af          = assignForm[item.id] ?? { classId: "", qty: 1 };

          return (
            <div key={item.id} className="bg-white border rounded-xl overflow-hidden">
              <div className="p-4 flex items-center gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-lacivert">{item.name}</span>
                    {item.category && <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">{item.category}</span>}
                  </div>
                  <div className="flex gap-3 text-xs mt-1">
                    <span className="text-gray-500">Toplam: <b>{item.totalQty}</b></span>
                    <span className="text-amber-600">Dışarıda: <b>{assigned}</b></span>
                    <span className={available > 0 ? "text-green-600" : "text-red-500"}>Depoda: <b>{available}</b></span>
                  </div>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button onClick={() => setExpand({...expand,[item.id]:!expand[item.id]})} className="text-xs px-2 py-1 rounded bg-gray-100">{expand[item.id]?"▲":"▼ Detay"}</button>
                  <button onClick={() => { if(confirm("Sil?")) remove.mutate({id:item.id}); }} className="text-xs px-2 py-1 rounded bg-red-50 text-red-500">Sil</button>
                </div>
              </div>

              {expand[item.id] && (
                <div className="border-t px-4 pb-4 pt-3 bg-gray-50 space-y-3">
                  {assignments.length > 0 && (
                    <div className="space-y-1">
                      <p className="text-xs font-semibold text-gray-500">Sınıflardaki Durum</p>
                      {assignments.map((a: any) => (
                        <div key={a.id} className="flex items-center gap-2 text-sm">
                          <span className="text-lacivert">{a.className ?? "Sınıf yok"}</span>
                          <span className="text-gray-400">—</span>
                          <span className="font-semibold text-amber-600">{a.qty} adet</span>
                          <button onClick={() => ret.mutate({assignmentId: a.id})} className="ml-auto text-xs text-green-600 border border-green-300 px-2 py-0.5 rounded">İade Al</button>
                        </div>
                      ))}
                    </div>
                  )}

                  {available > 0 && (
                    <div className="space-y-2">
                      <p className="text-xs font-semibold text-gray-500">Sınıfa Ver</p>
                      <div className="flex gap-2">
                        <select className="flex-1 border p-2 rounded-lg text-sm" value={af.classId}
                          onChange={(e) => setAssignForm({...assignForm,[item.id]:{...af,classId:e.target.value}})}>
                          <option value="">Sınıf seç…</option>
                          {classList.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                        <input type="number" min={1} max={available} className="w-16 border p-2 rounded-lg text-sm" value={af.qty}
                          onChange={(e) => setAssignForm({...assignForm,[item.id]:{...af,qty:Number(e.target.value)}})} />
                        <button onClick={() => {
                          if(af.classId && af.qty > 0){
                            assign.mutate({itemId:item.id,classId:af.classId,qty:af.qty});
                            setAssignForm({...assignForm,[item.id]:{classId:"",qty:1}});
                          }
                        }} className="bg-mavi text-white px-3 rounded-lg text-sm">Ver</button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
        {!list.length && <p className="text-gray-400 text-sm text-center py-8">Henüz malzeme yok.</p>}
      </div>
    </div>
  );
}
