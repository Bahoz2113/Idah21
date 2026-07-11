# CEZERİ Education OS — Deploy Rehberi

## Lokal Kurulum

```bash
pnpm install
pnpm db:generate
pnpm db:demo      # Demo kullanıcıları Supabase Auth'a yükler
pnpm dev          # http://localhost:3000
```

## Demo Giriş Bilgileri (şifre: Cezeri2026!)

| Rol | Telefon |
|-----|---------|
| Admin | +905000000001 |
| Öğretmen | +905000000002 |
| Veli | +905000000003 |
| Öğrenci | +905000000004 |

## Vercel Deploy

```bash
npm install -g vercel
vercel login
vercel --prod
```

Sorularda:
- Set up? → Y
- Which scope? → hesabını seç
- Link to existing? → N
- Name? → cezeri-education-os
- Directory? → . (nokta)

Deploy bittikten sonra Vercel dashboard'dan env değişkenlerini ekle:
- NEXT_PUBLIC_APP_URL → https://xxx.vercel.app ile güncelle

## Twilio Trial Hesabı Notu

Trial hesapta sadece onaylı numaralara SMS gönderilir.
Twilio Console → Verified Caller IDs → kendi numaranı ekle.
Veya hesabı upgrade et (aylık ~$15).

## Roller

- **Admin**: Tam yetki, kullanıcı yönetimi, silme
- **Öğretmen**: Kendi sınıfları, yoklama, değerlendirme, ders notu
- **Veli**: Sadece kendi çocuğu, devam, raporlar
- **Öğrenci**: Sadece kendi dersleri, quizler
