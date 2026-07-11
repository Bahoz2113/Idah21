# CEZERİ ROBOTECH — Education OS

> **MVP TAMAMLANDI** ✅ — Faz 0-4 (web). Sıradaki: mobil pas + Faz 5 (rozet/portföy/3D).

AI destekli, web + mobil, çok-kiracılı (SaaS'a hazır) eğitim yönetim sistemi.

## Mimari
- **Monorepo:** Turborepo + pnpm
- **Web:** Next.js 14 (App Router) + Tailwind/shadcn — 4 panel (admin/eğitmen/veli/öğrenci)
- **Mobil:** Expo + NativeWind — aynı 4 panel, aynı tRPC API'sini tüketir
- **API:** tRPC 11 (uçtan uca tip güvenliği) + RBAC
- **DB:** PostgreSQL + Prisma (Supabase)
- **Auth:** Supabase Auth + rol bazlı erişim
- **AI:** Claude (varsayılan), soyut provider katmanı (Faz 3)

> **KVKK:** Çocuk fotoğrafı/videosu sistemde BARINDIRILMAZ. Görsel paylaşımı harici/anlık (WhatsApp).

## Paket yapısı
```
apps/web        Next.js (4 panel)
apps/mobile     Expo (4 panel)
packages/config    yaş grupları, roller, tasarım token'ları
packages/database  Prisma şema + client
packages/auth      RBAC matrisi + Supabase + oturum
packages/api       tRPC router + context + izin middleware
```

## Kurulum (lokal)
```bash
pnpm install
cp .env.example .env            # Supabase + Anthropic anahtarlarını doldur
pnpm db:generate                # Prisma client üret
pnpm db:migrate                 # şemayı Supabase'e uygula
pnpm db:seed                    # demo veriler (Faz 0c)
# NOT: Supabase'de 'materials' adında PRIVATE Storage bucket oluştur (materyal yüklemeleri için)
pnpm dev                        # web: http://localhost:3000
```

## RBAC özeti
| Rol | Kapsam |
|---|---|
| ADMIN | Tam erişim |
| TEACHER | Kendi sınıf/öğrencileri; yoklama, ders, değerlendirme, AI |
| PARENT | Yalnızca kendi çocuğu (salt-okur) |
| STUDENT | Yalnızca kendi dersleri, testleri, portföyü |

Sahiplik kapsamı (veli→kendi çocuğu) tRPC resolver'larında `orgId` + sahiplik filtresiyle uygulanır.

## Yol haritası
- [x] Faz 0a — Prisma şeması (34 model)
- [x] Faz 0b — Monorepo + tRPC + RBAC + Auth iskeleti
- [x] Faz 0c — Seed + demo kullanıcılar + LED Yakma örneği
- [x] Faz 1 — Sınıf/öğrenci yönetimi + yoklama (web + mobil aynı hook'lar)
- [x] Faz 2 — Ders takibi + materyal (belge/kod/3B) + 18 kriter değerlendirme + gelişim grafiği
- [x] Faz 3 — TEACHER AI + Quiz (20 soru) + analiz (Claude, soyut sağlayıcı)
- [x] Faz 4 — Veli/öğretmen raporları (AI) + bildirim → **MVP TAMAM** ✅


## Demo girişler (seed sonrası)
Şifre: `Cezeri2026!`
| E-posta | Rol |
|---|---|
| admin@cezeri.local | ADMIN |
| ogretmen@cezeri.local | TEACHER (Metin) |
| veli@cezeri.local | PARENT (Mehmet Yılmaz) |
| ogrenci@cezeri.local | STUDENT (Ahmet Yılmaz, Minikler) |

> Seed, Supabase Auth kullanıcılarını da oluşturur (service role anahtarı gerekir) ve `users` tablosuna aynalar. Idempotent — tekrar çalıştırmak güvenlidir.

## AI (Faz 3)
`.env` içinde `ANTHROPIC_API_KEY` (ve istersen `ANTHROPIC_MODEL`) dolu olmalı. Sağlayıcı `packages/ai/src/provider.ts` içinde soyut — OpenAI/Gemini eklenebilir. Agentlar: teacher (yaşa uyarlı ders), quiz (7/8/5), analysis (zayıflık + öğrenme biçimi).

## Responsive & PWA (her cihazda açılır)
- **Tek kod tabanı** (Next.js web) — Android, iOS, PC, tablet: tarayıcıdan açılır, **"Ana ekrana ekle"** ile uygulama gibi kurulur (standalone).
- **Uygulama kabuğu** (`AppShell`): mobilde **alt sekme** + üst bar, tablet/PC'de **yan menü**. `usePathname` ile aktif sekme, bildirim rozeti, çıkış.
- **Rol-önekli rotalar**: `/admin/*`, `/teacher/*`, `/parent/*`, `/student/*` (eski route-grup `/dashboard` çakışması giderildi). Login `user_metadata.role` ile doğru panele yönlendirir.
- **PWA**: `public/manifest.webmanifest`, `public/sw.js` (network-first, API hariç), ikonlar (192/512/maskable/apple-touch), `viewportFit: cover` (iOS çentik), input `font-size:16px` (iOS oto-zoom engeli), güvenli alan padding'leri.
- Kurulabilir PWA için canlıda **HTTPS** gerekir (Vercel otomatik sağlar).

> Not: `apps/mobile` (Expo) ikinci bir ray olarak duruyor — yalnızca App Store/Play Store vitrini gerekirse geliştirilecek. Birincil çoklu-cihaz stratejisi responsive PWA.

## Real-time Senkronizasyon (Multi-kullanıcı)
`useRealtime` ve `useRealtimeAll` hook'ları Supabase Realtime WebSocket kanalını dinler.
Herhangi bir cihazda (admin, eğitmen vb.) yoklama/öğrenci verisi değiştiğinde, açık olan tüm diğer oturumlar **otomatik olarak** güncellenir — sayfa yenilemek gerekmez.

**Kurulum adımı:** Supabase Dashboard → Database → Replication → `students, classes, attendance, notifications, lessons, student_evaluations` tablolarını etkinleştir.
Ya da `packages/database/prisma/migrations/20260627_realtime/migration.sql` içeriğini SQL editöründe çalıştır.

## Tekrar Öğrenci Engeli
`students.checkDuplicate` endpoint'i Levenshtein mesafesiyle çalışır:
- **Aynı isim + aynı sınıf** → Kesinlikle engellenir, force:true bile geçmez.
- **Birebir aynı isim, farklı sınıf** → Uyarı gösterilir; mevcut öğrencinin veli/sınıf bilgileri gösterilir. Kullanıcı "Yine de Ekle" onayıyla devam edebilir.
- **Benzer isim (≤2 karakter farkı)** → Bilgilendirme gösterilir; otomatik devam eder.

## Güvenlik Mimarisi

| # | Açık | Çözüm |
|---|---|---|
| 1 | Materials path traversal | `materialId` ile DB doğrulama — raw path imzalanmıyor |
| 2 | AI quiz orgId atlanması | `getQuizInOrg()` — ageGroupId→organizationId zinciri |
| 3 | AI prompt injection | Input max uzunluk + tırnak sanitizasyonu |
| 4 | HTTP header eksikliği | CSP, HSTS, X-Frame-Options, Permissions-Policy |
| 5 | CORS kontrolsüz | `ALLOWED_ORIGINS` whitelist + OPTIONS handler |
| 6 | AI rate limiting yok | Sliding window: 10 ders/dk, 5 quiz/dk |
| 7 | KVKK audit log eksik | `auditLog()` — student.create, evaluation.submit |
| 8 | .gitignore zayıf | .env, generated, build dosyaları eklendi |
| 9 | Ödeme modülü | Şemadan + RBAC'tan tamamen kaldırıldı |

**Production ek adımları:**
- Supabase Row Level Security (RLS) politikaları etkinleştir
- `rateLimit.ts`'i Upstash Redis ile değiştir (`@upstash/ratelimit`)
- `NEXT_PUBLIC_APP_URL` env'ini deploy URL'iyle set et (CORS için)
- `ANTHROPIC_API_KEY` Vercel secrets'a ekle (env dosyasına değil)
