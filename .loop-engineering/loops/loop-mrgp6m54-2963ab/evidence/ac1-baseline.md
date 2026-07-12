# Evidence — ac1: Baseline TTFD

- **Loop:** loop-mrgp6m54-2963ab · **Task:** T1
- **status: pass**
- **Metrik:** TTFD (liste-tik → detay `useStudent` verisi hazır), ms
- **Yöntem:** Playwright headless, repo instrumentation (`markNavStart`/`measureTTFD`), her koşudan önce `students.get` cache'i silinip **cold** zorlandı. N=20, medyan.
- **Kod durumu:** prefetch **KAPALI** (baseline). Ölçüm ADMIN oturumu (`ceos_at`) enjekte edilerek yapıldı.
- **Ortam:** `next dev` localhost:3000 · sabit öğrenci `32298213-210b-4422-89f5-df475f5abf68` · runner: scratchpad/ttfd-runner/measure.mjs
- **Tarih:** 2026-07-11

## Sonuç
```
BASELINE MEDIAN TTFD = 730.15 ms   (n=20)
```

## Ham veri (ms)
```
[4451.90, 1339.50, 721.20, 729.10, 1433.90, 725.30, 724.20, 826.20,
 732.00, 721.40, 733.30, 721.60, 727.70, 731.20, 731.20, 726.50,
 722.70, 725.30, 731.80, 737.80]
median = 730.15
```

## Not
- İlk koşu (4451.9ms) dev-server JIT/route-compile ısınma outlier'ı; medyan bundan etkilenmez (bu yüzden medyan seçildi).
- Steady-state ~720–740ms; bu, detay `students.get` **cold fetch** maliyetinin baskın olduğunu ve prefetch'in bu maliyeti kritik yoldan kaldırma potansiyelini doğrular.
- T3 "after" ölçümü **aynı runner + aynı öğrenci** ile yapılacak; hedef `(730.15 - after)/730.15 >= 0.30` → after medyanı **≤ 511 ms** olmalı.
