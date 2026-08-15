# AC5 — Marketing paleti uygulandı, panel tokenları korundu
status: pass
verified_at: 2026-08-03T12:53:52Z
method: regression_check (git diff)

## packages/config/src/tokens.ts — mevcut token değerleri değişti mi?
Yalnızca EKLEME yapıldı; `tokens` nesnesinin hiçbir satırı silinmedi/değiştirilmedi:
```
56	0	packages/config/src/tokens.ts
  (format: eklenen  silinen  dosya — silinen 0 olmalı)
```

## Panel mavisi hâlâ yürürlükte mi?
```
12:    lacivert:     "#173A58",  // Primary Dark — header, sidebar zemini, koyu yüzeyler
13:    mavi:         "#2B6EA8",  // Primary Blue — birincil aksiyon, link, aktif alan
16:    vurgu:        "#F2A531",  // Accent Amber — baykuş gözü: CTA vurgu, aktif işaret
```

## Marketing paleti eklendi mi?
```
72:    teal:        "#0F4C5C",  // Primary — sistem başlıkları, navigasyon, derinlik
77:    orange:      "#FF8C00",  // Fırlatma butonları, odak noktaları
81:    emerald:     "#10B981",  // Başarı metrikleri, onay durumları
85:    base:        "#0A191D",  // Ana koyu zemin
```

Marketing renkleri Tailwind'e ayrı `czr-*` ad alanı altında eklendi;
mevcut sınıf adlarının hiçbiri yeniden tanımlanmadı.
