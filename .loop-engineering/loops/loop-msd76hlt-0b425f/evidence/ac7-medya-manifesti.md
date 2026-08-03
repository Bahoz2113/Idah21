# AC7 — Gerçek medya manifesti tip güvenli, boşken sayfa çalışıyor
status: pass
verified_at: 2026-08-03T12:54:31Z
method: build + test_run

## Manifest boş durumda
```
79:export const realMedia: readonly RealMediaItem[] = [];
82:export const hasRealMedia = realMedia.length > 0;
```

## Sayfa boş manifestle hatasız render ediliyor mu?
```
GET / -> 200
Medya aktarımı bekleniyor — iskelet durumu DOM'da
7 adet planlanan çekim yuvası render edildi
```
Playwright konsol hatası: yok.

## Tip zorlaması
`RealImage` ve `RealVideo` tiplerinde `alt`, `width`, `height` ZORUNLU;
video için `poster` ve `durationSec` de zorunlu. Eksik alan derlemede durdurur.

## Teslim rehberi
`apps/web/public/assets/real-media/README.md` — 10 çekimlik dosya listesi,
teknik gereksinimler, KVKK/veli rızası uyarısı ve örnek kayıt formatı.
