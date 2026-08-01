# KANIT — Kabul kriteri 1: "Tüm testler geçiyor"

status: pass

**Loop:** `loop-msanwgg6-82a100` · **Tarih:** 2026-08-01

## Ölçümler

| Kontrol | Sonuç |
|---|---|
| `tsc --noEmit` (strict) | **0 hata** |
| `next build` | **✓ 18 rota**, `/api/apply` dışında hepsi statik |
| Playwright tarayıcı paketi (Chromium) | **13/13 geçti** |
| Form API senaryoları | **8/8** doğru davranış |
| İçerik denetim taramaları | **4/4** temiz (0 sonuç) |

## Playwright ham çıktı

```
PASS  AC6 mobil-390 / tablet-768 / masaustu-1440 / genis-2560 yatay taşma yok
PASS  AC1 toplam scroll uzunluğu > 8 viewport            27.0 viewport katı
PASS  AC1 S04 tırmanış sayacı scroll'a tepki veriyor      000 → 046
PASS  AC1 S05 yatay ray scroll'a tepki veriyor            0 → -731.96 px
PASS  AC1 WebGL canvas oluştu                             1 canvas
PASS  AC4 reduced-motion: h1 okunabilir
PASS  AC4 reduced-motion: satırlar taşınmamış             0 taşınmış span
PASS  AC4 klavye ile form doldurulabiliyor                4 clearance GRANTED
PASS  AC4 odak halkası görünür                            rgb(255, 111, 0)
PASS  AC13 /sss soru biçimli H2 sayısı                    6 / 6
13/13 geçti
```

## Form API ham çıktı

```
gecerli basvuru        {"ok":true}                                        [200]
eksik ad               {"ok":false,"error":"Aday adı en az 2 karakter…"}  [400]
gecersiz yas grubu     {"ok":false,"error":"Geçersiz yaş grubu."}         [400]
gecersiz gorev         {"ok":false,"error":"Geçersiz görev seçimi."}      [400]
gecersiz telefon       {"ok":false,"error":"Geçersiz telefon numarası."}  [400]
bal kupu dolu (bot)    {"ok":true}                                        [200]
bozuk json             {"ok":false,"error":"Geçersiz istek gövdesi."}     [400]
hiz siniri (6. istek)                                                     [429]
```

## Ayrıntı
- `detay-f0-build.md` — sürüm doğrulaması ve F0 build
- `detay-tarayici-dogrulamasi.md` — Playwright paketi ve bulunan 5 kusur
