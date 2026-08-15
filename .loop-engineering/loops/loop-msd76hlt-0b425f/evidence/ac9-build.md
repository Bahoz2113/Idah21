# AC9 — Build hatasız, sunucu 200 dönüyor
status: pass
verified_at: 2026-08-03T17:32:14Z
method: test_run

## Build
```
 ✓ Compiled successfully
build exit code: 0
┌ ○ /                                    15.9 kB         103 kB
```

## Çalışan sunucu — uç nokta yanıtları
```
200  /
200  /login
200  /robots.txt
200  /sitemap.xml
200  /llms.txt
200  /opengraph-image
404  /api/contact  (form kaldırıldı — 404 beklenen)
```

## İletişim kanalı bağlantıları
Başvuru formu kullanıcı talebiyle kaldırıldı; yerine üç doğrudan kanal geldi.
```
https://wa.me/905406627272
https://www.instagram.com/cezerirobotech/
https://www.google.com/maps/dir/?api=1
https://www.google.com/maps/dir/?api=1&destination=37.91029,41.13921
https://www.google.com/maps/search/?api=1
https://www.google.com/maps/search/?api=1&query=37.91029,41.13921
```

## Tarayıcı doğrulaması (Playwright, Chromium)
```
1440x900 masaüstü : konsol hatası yok
390x844  mobil    : konsol hatası yok, scrollWidth 390 = clientWidth 390 (yatay taşma 0)
```
