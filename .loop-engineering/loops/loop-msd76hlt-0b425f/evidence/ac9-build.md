# AC9 — Build hatasız, sunucu 200 dönüyor
status: pass
verified_at: 2026-08-03T12:54:31Z
method: test_run

## Build
```
 ✓ Compiled successfully
build exit code: 0
```

## Çalışan sunucu — uç nokta yanıtları
```
200  /
200  /login
200  /robots.txt
200  /sitemap.xml
200  /llms.txt
200  /opengraph-image
```

## İletişim API doğrulama davranışı
```
geçerli başvuru      -> 200
geçersiz yaş (44)    -> 422
geçersiz JSON        -> 400
bal küpü dolu (bot)  -> 200  (bota kasıtlı 200)
```

## Tarayıcı doğrulaması (Playwright, Chromium)
1440x900 masaüstü ve 390x844 mobil: konsol hatası yok, yatay taşma 0 px.
