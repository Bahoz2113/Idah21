# CEZERİ ROBOTECH — Launchpad

Scroll'a bağlı sinematik tek sayfa deneyim + indekslenebilir içerik katmanı.

> **Not:** Bu proje `Idah21` monorepo'sunun **parçası değildir.** pnpm workspace
> yalnızca `apps/*` ve `packages/*` alır; bu klasör bağımsızdır ve ayrı bir repoya
> taşınmak üzere burada geliştirilmektedir (GitHub App'in repo oluşturma yetkisi yok).

## Stack
Next 16 (App Router) · React 19 · React Three Fiber 9 · GSAP 3 · Lenis · Tailwind 4 · TypeScript 5.9

## Komutlar
```bash
pnpm install --ignore-workspace
pnpm dev         # http://localhost:3100
pnpm build
pnpm typecheck
```

## Mimari kuralları (ihlal edilemez)

**GEO render kuralları** — AI crawler'ları JS render etmez:
- **K1** Tüm metin sunucuda render edilir. Hiçbir olgusal cümle istemcide üretilmez.
- **K2** GSAP var olan DOM'u animasyonlar, metni üretmez. `innerHTML` yazımı yasak.
- **K3** JSON-LD sunucudan basılır, `useEffect` içinde asla.
- **K4** `/` dışındaki rotalar tam statik ve three.js import etmez.
- **K5** Sahne metinleri `opacity:0` olabilir ama DOM'da kalır. Koşullu mount yasak.
- **K6** Doğrulama: `curl -A "GPTBot" <url> | grep "<olgusal cümle>"` → 0 dönemez.

**Olgu kuralı** — `lib/facts.ts` tek kaynaktır. Sitedeki her olgusal iddia oradan
gelir ve en az bir kaynak taşır. Kaynaksız iddia eklenmez.

**Renk oranı** — void %80 · navy %15 · ignition %5. Turuncu sadece ateşleme anıdır.

## Durum
- [x] F0 — bootstrap, sürüm doğrulama, token + font + HUD iskeleti
- [x] F1 — S00 preloader + S08 footer
- [x] F2 — S01 hero + S02 exploded view
- [x] F3 — S03 hangar + S04 ilk fırlatış
- [x] F4 — S05 galeri + S06 metodoloji
- [x] F5 — S07 uçuş izin formu
- [x] F6 — medya entegrasyonu (Gemini Omni video + Nano Banana görsel)
- [x] F7 — performans + erişilebilirlik
- [x] F8 — SEO/GEO altyapısı
- [x] F9 — içerik katmanı
