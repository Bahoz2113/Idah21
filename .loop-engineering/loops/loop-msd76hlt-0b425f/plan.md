# PLAN — CEZERİ ROBOTECH Tanıtım Deneyimi

Loop: `loop-msd76hlt-0b425f`
Objective: Awwwards seviyesi, scroll-driven, tek sayfa tanıtım deneyimi + SEO/GEO mimarisi.

## Onaylanan Kararlar (kullanıcı)

| Konu | Karar |
|---|---|
| Rota | Kök rota `/` — panel girişi `/login`'de kalır |
| Gerçek medya | Kullanıcı gönderecek → manifest + zarif iskelet, dosya listesi teslim edilir |
| Harita | Statik harita + yol tarifi derin linki (CSP gevşetilmez) |
| Hero 3D | Hibrit: CSS/SVG ilk kare (LCP), R3F lazy yükleme |

## Kapsam

### In scope
- `apps/web` içinde public tanıtım sayfası (RSC, statik)
- SEO/GEO katmanı: JSON-LD `@graph`, robots, sitemap, OG image, llms.txt
- Marketing tasarım tokenları (panel tokenlarına DOKUNULMAZ)
- Gerçek medya manifest sistemi + galeri bileşenleri
- İletişim formu (client-side doğrulama + API rotası)

### Out of scope
- Production deploy (permissions.yaml: never_auto_execute)
- CSP güvenlik politikası gevşetme
- `packages/config` mevcut token değerlerinin değiştirilmesi
- Veritabanı migration

## Kabul Kriterleri

| ID | Kriter | Doğrulama |
|---|---|---|
| AC1 | `/` tanıtım sayfasını sunar, `/login` panel girişi olarak çalışır | build + rota kontrolü |
| AC2 | JSON-LD `@graph` geçerli: EducationalOrganization, LocalBusiness+GeoCoordinates, 10× Course, FAQPage, WebSite, BreadcrumbList | schema doğrulama scripti |
| AC3 | Semantic HTML: tek `h1`, hiyerarşik `h2/h3`, `section`/`article` yapısı | file_check |
| AC4 | robots.ts AI botlarına açık (GPTBot, ClaudeBot, PerplexityBot, Google-Extended), sitemap.ts + llms.txt mevcut | file_check |
| AC5 | Marketing paleti (teal/turuncu/emerald) uygulanmış, panel tokenları değişmemiş | git diff kontrolü |
| AC6 | Hero LCP elemanı server-rendered metin; R3F `next/dynamic` + `ssr:false` + görünürlük tetikli | file_check |
| AC7 | Gerçek medya manifest'i tip güvenli; varlık yokken sayfa hatasız iskelet gösterir | build + tip kontrolü |
| AC8 | 10 disiplin + FAQ içeriği tek kaynaktan (`lib/seo/site.ts`) hem DOM'a hem schema'ya beslenir | file_check |
| AC9 | `pnpm --filter @cezeri/web build` hatasız tamamlanır | test_run |
| AC10 | CSP değişmemiş; dış kaynak isteği yok (font/harita/analitik self-hosted veya link) | git diff + file_check |

## Uygulama Sırası

1. Tokenlar + Tailwind + global CSS (marketing katmanı)
2. `lib/seo/site.ts` — tek gerçek kaynak veri
3. `lib/seo/schema.ts` — JSON-LD üreticiler
4. robots / sitemap / opengraph-image / llms.txt
5. Marketing bileşenleri (8 bölüm)
6. Gerçek medya manifest + galeri bileşenleri
7. R3F hero sahnesi (lazy)
8. Rota devri: `page.tsx` + middleware
9. Build + kanıt üretimi + skorlama

## Riskler

| Risk | Azaltma |
|---|---|
| R3F bundle LCP'yi bozar | `ssr:false` + IntersectionObserver + reduced-motion/deviceMemory guard |
| Gerçek medya yok | Manifest boşken iskelet; sayfa hatasız |
| Google Font build-time indirme başarısız | Sistem font yığınına düşen fallback |
| Root layout TRPCProvider ek JS | Marketing sayfası tamamen RSC kalır; provider paint'i bloklamaz |
| Site domain'i bilinmiyor | `NEXT_PUBLIC_SITE_URL` env, fallback ile |
