# Plan — optimization: CZR CEOS ogrenci detay ekrani prefetch performans

## Objective
Admin ogrenci detay ekraninin (apps/web `/admin/ogrenciler/[id]`) acilis gecis suresini,
liste ekranindan hover/focus prefetch ile azalt. Hedef: **TTFD medyani (N=20) baseline'a
gore >=%30 dusuk**, regresyonsuz. Contract v2, olcum = kod ici instrumentation.

## Kok neden (design tespiti)
- `ogrenciler/page.tsx` → detaya `<Link>` var ama **prefetch yok**.
- `[id]/page.tsx` mount'ta `useStudent(id)` = `trpc.students.get.useQuery` **cold** calisir → "Yukleniyor…" spinner → algilanan gecikme.
- Liste zaten `trpc.useUtils()` tutuyor → `utils.students.get.prefetch({id})` temiz cozum.

## Task graph

```
T0 checkpoint ──► T1 baseline (bench) ──► T2 implement ──► T3 verify ──► T4 score+learn
                       │                                        │
                   evidence/ac1                          evidence/ac2, ac3
```

### T0 — Checkpoint (owner: orchestrator)  [risky-change oncesi]
- `loop checkpoint loop-mrgp6m54-2963ab` → state+contract snapshot.
- Cikti: checkpoints/ altinda snapshot. Rollback hedefi.
- Gecis sarti: snapshot yazildi.

### T1 — Baseline olc (owner: verifier)  [bagimlilik: T0]
- Detay ekranina performance.mark('nav-start') (liste tik ani) + useStudent data geldiginde performance.measure('ttfd') enstrumantasyonu ekle (gecici, sadece olcum).
- Sabit ogrenci id, `next dev`, warm server. N=20 kosu, medyan ms hesapla.
- **Evidence:** `evidence/ac1-baseline.md` — status: pass, ham 20 olcum + medyan + ortam.
- Gecis sarti: ac1 evidence pass, baseline medyani state'e yazildi.

### T2 — Prefetch uygula (owner: implementer)  [bagimlilik: T1]
- `ogrenciler/page.tsx`: her ogrenci satirinda `<Link>` / satir uzerine `onMouseEnter` + `onFocus` → `utils.students.get.prefetch({ id: s.id })`.
- `useStudents.ts` / RQ konfig: `students.get` icin makul `staleTime` (or. 30–60 sn) → prefetch cache'i tik anina kadar taze kalsin.
- Enstrumantasyonu (T1) production-etkisiz tut veya olcum-guard'li birak (A5).
- Cikti: degisen dosyalar, kisa diff aciklamasi decisions.jsonl'e.
- Gecis sarti: build + lint temiz, degisiklik in_scope disina cikmiyor.

### T3 — Dogrula (owner: verifier — BAGIMSIZ)  [bagimlilik: T2]
- **ac2:** T1 ile ozdes olcum, prefetch acikken. N=20 medyan. `(base-after)/base >= 0.30` mu? → `evidence/ac2-after.md`.
- **ac3:** `pnpm --filter @cezeri/web lint` + tsc typecheck temiz; detay sekmeleri (Profil/Degerlendirme/Sinavlar/Notlar), veri gorunumu ve mutasyonlar (evaluation submit, teacher note) davranisi degismemis → `evidence/ac3-no-regression.md`.
- Gecis sarti: ac2 & ac3 status: pass. Aksi halde RETRY (max 2) → strateji degistir.

### T4 — Puanla ve ogren (owner: scorer, memory-curator)  [bagimlilik: T3]
- `loop score` ≥ target (80); rubric: iyilesme % + regresyon yoklugu + kanit butunlugu.
- `loop verify` PASS + `loop report`.
- Ogrenim: prefetch+staleTime paterni `memory/` altina (hassas veri/ham log yok).

## Test stratejisi (Gate B)
- Bu repoda calisan otomatik test paketi yok (bkz. active-assumptions A1).
- **Benchmark:** kod ici TTFD olcumu, N=20 medyan, baseline vs after ayni ortam.
- **Regresyon guard'i:** `next lint` + tsc typecheck + manuel davranis kontrolu (sekme/mutasyon).

## Bagimliliklar
- tRPC v11 + @tanstack/react-query v5 (`utils.students.get.prefetch` API'si).
- `next dev` calisir durumda, seed'li en az 1 ogrenci (sabit id).
- Backend `students.get` router imzasi SABIT (out_of_scope).

## Rollback plani
- T0 checkpoint → sorun halinde `loop rollback loop-mrgp6m54-2963ab <checkpointId>`.
- Kod tarafi: degisiklikler tek commit/branch; prefetch geri alinabilir, enstrumantasyon silinebilir.
- ac2 hedefe ulasmaz + no_measurable_improvement → stop_condition; contract revize veya loop kapat.

## Owner ozeti
| Task | Owner | Cikti |
|------|-------|-------|
| T0 | orchestrator | checkpoint |
| T1 | verifier | evidence/ac1-baseline.md |
| T2 | implementer | prefetch kodu + diff |
| T3 | verifier (bagimsiz) | evidence/ac2-after.md, ac3-no-regression.md |
| T4 | scorer, memory-curator | score, report, memory |
