# KANIT — AC5 · Build ve tip denetimi sıfır hata

**Loop:** `loop-msanwgg6-82a100` · **Faz:** F0 · **Tarih:** 2026-08-01
**status: pass**

---

## Kabul kriteri
> AC5 — `next build` + `tsc --noEmit` sıfır hata (strict)

## Ortam
```
node    v22.22.2
pnpm    9.0.0 (çalışan: v10.33.0)
disk    30G boş
```

## Sürüm kararı — PLANDAN SAPMA (gerekçeli)

Plan `Next 15 + Tailwind 3 + TS 5` öngörüyordu. npm'den doğrulanan güncel sürümler
farklıydı; F0'ın amacı zaten "riskli sürüm üçlüsünü önce doğrula" idi.

| Paket | Planda | Kurulan | Gerekçe |
|---|---|---|---|
| next | 15.x | **16.2.12** | 15 artık güncel değil; 16 stabil ve React 19 ile uyumlu |
| react / react-dom | 19.x | **19.2.8** | plan ile aynı |
| @react-three/fiber | v9 | **9.7.0** | React 19 hedefli sürüm — ana risk buydu |
| @react-three/drei | v10 | **10.7.7** | R3F 9 ile uyumlu |
| three | ^0.17x | **0.185.1** | güncel |
| gsap | 3.13 | **3.15.0** | güncel |
| lenis | 1.3 | **1.3.25** | plan ile aynı |
| tailwindcss | **3.4** | **4.3.3** | ⚠️ **Bilinçli sapma.** Ayrı repo olduğu için `Idah21` ile sürüm eşleştirme gerekçesi ortadan kalktı. TW4'ün CSS-first `@theme` yapısı token sistemimize doğrudan oturuyor — token'lar `globals.css` içinde tek yerde tanımlı. |
| typescript | 5.x | **5.9.3** | ⚠️ TS **7.0.2** mevcut ama Next tooling ile kenar durum riski var; 5.9.3 tercih edildi |
| schema-dts | 2.0.0 | **2.0.0** | plan ile aynı |

**Düzeltilen hata:** `@types/react-dom@19.2.8` npm'de yok (yayınlanan en yüksek 19.2.4).
`@types/react` 19.2.18, `@types/three` 0.185.3 olarak düzeltildi.

---

## Ham çıktı — `pnpm typecheck`

```
> cezeri-launchpad@0.1.0 typecheck /home/user/Idah21/cezeri-launchpad
> tsc --noEmit
```
Çıktı boş → **0 hata.** (`strict: true` etkin)

## Ham çıktı — `pnpm build`

```
▲ Next.js 16.2.12 (Turbopack)

  Creating an optimized production build ...
✓ Compiled successfully in 4.1s
  Running TypeScript ...
  Finished TypeScript in 3.5s ...
  Collecting page data using 3 workers ...
✓ Generating static pages using 3 workers (3/3) in 136ms
  Finalizing page optimization ...

Route (app)
┌ ○ /
└ ○ /_not-found

○  (Static)  prerendered as static content
```

**İki rota da `○ (Static)` — tam prerender.** GEO kuralı K4'ün ön koşulu sağlandı.

---

## Sonuç
`status: pass` — AC5 karşılandı. Ana risk (R3F v9 + React 19 + Next 16 + TS strict)
**hatasız doğrulandı**, plan B'ye (Next 14 + R3F v8) düşmeye gerek kalmadı.
