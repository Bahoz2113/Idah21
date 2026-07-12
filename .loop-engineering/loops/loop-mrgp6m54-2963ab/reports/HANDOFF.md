# Handoff — loop-mrgp6m54-2963ab (2026-07-12 mola)

## Durum: T3 diagnose aşamasında, ac2 henüz PASS değil. İki optimizasyon denendi, ikisi de total TTFD'yi düşürmedi.

## Ölçüm altyapısı (hazır, yarın tekrar kullanılabilir)
- Playwright runner: `<scratchpad>/ttfd-runner/measure.mjs` (izole kurulum, repo'ya dokunmuyor).
- Auth: seed admin PASSIVE + AUTH_JWT_SECRET eksikti → **apps/web/.env.local'e AUTH_JWT_SECRET eklendi** (server restart gerekli). Giriş: admin `muhammed21idah@gmail.com` (ADMIN), her girişte e-posta OTP → dev log'a düşüyor (ConsoleEmailProvider).
- Çalıştırma: dev server aç (`pnpm --filter @cezeri/web dev`), tarayıcıda giriş yap, `ceos_at` çerezini al, `CEOS_AT=<jwt> N=20 node measure.mjs`.
- Runner: gerçek instrumentation (markNavStart/measureTTFD/markDetailMount) kullanır, her koşuda students.get cache'i silip cold zorlar, seg1/seg2 ayrıştırır.

## Bulgular (kanıtlar evidence/ altında)
- **ac1 baseline (PASS):** cold TTFD medyan = **730 ms** (n=20).
- **Prefetch (onMouseEnter/onFocus + staleTime 60s):** after medyan 721ms (dwell 350) ve 722ms (dwell 1500). **İyileşme yok** → veri fetch'i tık-öncesi hazır olsa bile TTFD düşmüyor.
- **Profilleme:** seg1 (nav+route+mount) = **~20ms**, seg2 (mount→veri hazır) = **~680ms**. Darboğaz net: `students.get` isteği.
- **Server timing (dev log):** `students.get` handler **~520ms**, `students.list` (tek sorgu) **~300ms** → **Supabase base round-trip latency'si ~300ms/sorgu**. Client seg2 ≈ 520ms server + ~200ms client overhead.
- **Query parallelization (students.get: 4 alt-sorgu Promise.all):** total TTFD değişmedi (~724-840ms). Alt-sorgular baskın değilmiş; asıl yük ağır include'lu `student.findFirst` + baz latency.

## Yarın için hipotez adayları (sıradaki deney)
1. **student.findFirst include'larını hafiflet / böl** — parents→parent, ageGroup, class, mediaConsent join'leri; tek ağır sorgu ~300-500ms olabilir. Ölç, gerekirse parçala/paralelleştir.
2. **Handler içi mikro-timing** ekle (her prisma çağrısı ne kadar sürüyor) → asıl pahalı sorguyu kesinleştir.
3. **Base latency Supabase kaynaklı ise** (~300ms/round-trip) → prod'da bölge/pool farkı; dev ölçümü prod'u yansıtmayabilir. Prod-build ölçümü değerlendir.
4. Prefetch kodu prod'da (route-prefetch açık) yine de faydalı olabilir; ama asıl kazanç server sorgu süresinde.

## Kod durumu (working tree, henüz commit yok)
- KALICI + doğrulandı: **Sınav Sonucu Ekle** özelliği (students.addQuizResult + hook + UI). Test kaydı: A.Yasin Sevim'de `[TEST] Playwright Doğrulama` (silme UI yok — istenirse temizlenecek).
- İYİLEŞTİRME (düşük risk, kanıt bekliyor): students.get Promise.all; useStudent staleTime; liste hover prefetch.
- TEMİZLENECEK (ölçüm-only, commit öncesi kaldır): perf-ttfd.ts, Provider __qc, list onMouseDown, detay markDetailMount/measureTTFD useEffect'leri.
- ENV: apps/web/.env.local'e AUTH_JWT_SECRET eklendi (kök .env.local'e de bir tane eklenmişti — kullanılmıyor, temizlenebilir).
