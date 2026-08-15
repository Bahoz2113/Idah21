"use client";
import { ExportButtons } from "@/components/ExportButtons";
import { useState } from "react";
import { trpc } from "@cezeri/trpc";

export default function AdminProjelerPage(): JSX.Element {
  const utils    = trpc.useUtils();
  const projects = trpc.institutionProjects.list.useQuery();
  const create   = trpc.institutionProjects.create.useMutation({ onSuccess: () => utils.institutionProjects.list.invalidate() });
  const remove   = trpc.institutionProjects.delete.useMutation({ onSuccess: () => utils.institutionProjects.list.invalidate() });
  const addTask  = trpc.institutionProjects.addTask.useMutation({ onSuccess: () => utils.institutionProjects.list.invalidate() });
  const toggle   = trpc.institutionProjects.toggleTask.useMutation({ onSuccess: () => utils.institutionProjects.list.invalidate() });
  const delTask  = trpc.institutionProjects.deleteTask.useMutation({ onSuccess: () => utils.institutionProjects.list.invalidate() });

  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", description: "", startDate: "", endDate: "" });
  const [newTask, setNewTask] = useState<Record<string, string>>({});
  const [expand, setExpand]   = useState<Record<string, boolean>>({});

  const list = (projects.data ?? []) as any[];

  return (
    <div className="p-4 sm:p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold text-lacivert">Projeler</h1>
        <div className="flex gap-2">
          <ExportButtons
            title="Projeler"
            headers={["Proje Adı", "Açıklama", "Başlangıç", "Bitiş", "Durum"]}
            rows={list.map((p: any) => { const tasks=Array.isArray(p.tasks)?p.tasks:[]; const done=tasks.filter((t: any)=>t.done).length; return [p.name, p.description??"-", p.startDate?new Date(p.startDate).toLocaleDateString("tr-TR"):"-", p.endDate?new Date(p.endDate).toLocaleDateString("tr-TR"):"-", done===tasks.length&&tasks.length>0?"Tamamlandı":"Devam Ediyor"]; })}
          />
          <button onClick={() => setShowForm(!showForm)} className="bg-mavi text-white px-4 py-2 rounded-lg text-sm font-semibold">+ Yeni Proje</button>
        </div>
      </div>

      {showForm && (
        <div className="bg-white border rounded-xl p-4 mb-4 space-y-3">
          <input className="border p-2 rounded-lg w-full text-sm" placeholder="Proje adı *" value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} />
          <textarea className="border p-2 rounded-lg w-full text-sm" rows={2} placeholder="Açıklama" value={form.description} onChange={(e) => setForm({...form, description: e.target.value})} />
          <div className="flex gap-2">
            <div className="flex-1"><label className="text-xs text-gray-500">Başlangıç</label><input type="date" className="border p-2 rounded-lg w-full text-sm" value={form.startDate} onChange={(e) => setForm({...form, startDate: e.target.value})} /></div>
            <div className="flex-1"><label className="text-xs text-gray-500">Bitiş</label><input type="date" className="border p-2 rounded-lg w-full text-sm" value={form.endDate} onChange={(e) => setForm({...form, endDate: e.target.value})} /></div>
          </div>
          <div className="flex gap-2">
            <button onClick={() => { if(form.name) { create.mutate(form); setForm({name:"",description:"",startDate:"",endDate:""}); setShowForm(false); }}} className="bg-mavi text-white px-4 py-2 rounded-lg text-sm">Kaydet</button>
            <button onClick={() => setShowForm(false)} className="bg-gray-100 px-4 py-2 rounded-lg text-sm">İptal</button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {list.map((p: any) => {
          const tasks = Array.isArray(p.tasks) ? p.tasks : [];
          const done = tasks.filter((t: any) => t.done).length;
          return (
            <div key={p.id} className="bg-white border rounded-xl overflow-hidden">
              <div className="p-4 flex items-start gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-semibold text-lacivert">{p.name}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${done===tasks.length&&tasks.length>0?"bg-green-100 text-green-700":"bg-amber-100 text-amber-700"}`}>
                      {done===tasks.length&&tasks.length>0?"✓ Tamamlandı":"Devam Ediyor"}
                    </span>
                  </div>
                  {p.description && <p className="text-sm text-gray-500 mt-1">{p.description}</p>}
                  <div className="flex gap-3 text-xs text-gray-400 mt-1 flex-wrap">
                    {p.startDate && <span>📅 {new Date(p.startDate).toLocaleDateString("tr-TR")}</span>}
                    {p.endDate && <span>🏁 {new Date(p.endDate).toLocaleDateString("tr-TR")}</span>}
                    {tasks.length>0 && <span>✓ {done}/{tasks.length}</span>}
                  </div>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button onClick={() => setExpand({...expand,[p.id]:!expand[p.id]})} className="text-xs px-2 py-1 rounded bg-gray-100">{expand[p.id]?"▲":"▼ Görevler"}</button>
                  <button onClick={() => { if(confirm("Sil?")) remove.mutate({id:p.id}); }} className="text-xs px-2 py-1 rounded bg-red-50 text-red-500">Sil</button>
                </div>
              </div>

              {expand[p.id] && (
                <div className="border-t px-4 pb-4 pt-3 space-y-2 bg-gray-50">
                  {tasks.map((t: any) => (
                    <div key={t.id} className="flex items-center gap-2">
                      <input type="checkbox" checked={t.done} onChange={(e) => toggle.mutate({taskId:t.id,done:e.target.checked})} className="w-4 h-4 accent-mavi" />
                      <span className={`flex-1 text-sm ${t.done?"line-through text-gray-400":"text-lacivert"}`}>{t.title}</span>
                      <button onClick={() => delTask.mutate({taskId:t.id})} className="text-xs text-red-400">✕</button>
                    </div>
                  ))}
                  <div className="flex gap-2 mt-2">
                    <input className="flex-1 border p-2 rounded-lg text-sm" placeholder="Yeni görev…"
                      value={newTask[p.id]??""} onChange={(e) => setNewTask({...newTask,[p.id]:e.target.value})}
                      onKeyDown={(e) => { if(e.key==="Enter"&&newTask[p.id]){addTask.mutate({projectId:p.id,title:newTask[p.id]});setNewTask({...newTask,[p.id]:""});}}} />
                    <button onClick={() => { if(newTask[p.id]){addTask.mutate({projectId:p.id,title:newTask[p.id]});setNewTask({...newTask,[p.id]:""});}}} className="bg-mavi text-white px-3 rounded-lg text-sm">+</button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
        {!list.length && <p className="text-gray-400 text-sm text-center py-8">Henüz proje yok. + Yeni Proje ile ekleyin.</p>}
      </div>
    </div>
  );
}
