# AC10 — CSP değişmedi, dış kaynak isteği eklenmedi
status: pass
verified_at: 2026-08-03T12:55:14Z
method: regression_check

## next.config.js (CSP ve güvenlik başlıklarının kaynağı) değişti mi?
```

(çıktı boş => dosya HİÇ değişmedi)
```

## Çalışan sunucudan dönen CSP başlığı
```
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; st
yle-src 'self' 'unsafe-inline'; img-src 'self' data: blob: https://*.supabase.co; font-src 'self
'; connect-src 'self' https://*.supabase.co wss://*.supabase.co https://api.anthropic.com; frame
-ancestors 'none'; base-uri 'self'; form-action 'self'
```

## Sayfanın yüklediği kaynaklar — hepsi kendi origin'inden mi?
Ölçüm yalnızca gerçek kaynak yüklemelerini sayar (script src, stylesheet,
img/video/iframe/source src, preload). `<a href>` bağlantıları ve
`rel="canonical"` kaynak yüklemesi değildir, bu yüzden kapsam dışıdır.
```
toplam kaynak yüklemesi: 11
  script: /_next/static/chunks/7f7c90a3-b7733eb8ed1c2e5e.js
  script: /_next/static/chunks/9336-515736718c7637f3.js
  script: /_next/static/chunks/main-app-e331ac2239fdc5dc.js
  script: /_next/static/chunks/6169-407fe712180bc134.js
  script: /_next/static/chunks/app/page-21a759ec33b37a6f.js
  script: /_next/static/chunks/2689-ffb4a7a018145198.js
  script: /_next/static/chunks/app/layout-2e34ba648bba185e.js
  script: /_next/static/chunks/polyfills-42372ed130431b0a.js
  script: /_next/static/chunks/webpack-6e67839058846fd3.js
  stylesheet: /_next/static/css/3b94b6897ef83a3e.css
  preload: /_next/static/chunks/webpack-6e67839058846fd3.js

DIŞ HOST kaynağı : YOK
iframe sayısı    : 0
```

Harita, üçüncü taraf iframe yerine sıfır-istek SVG olarak uygulandı; yol tarifi
yalnızca kullanıcı tıkladığında dış harita uygulamasında açılır. Font, `next/font`
ile dış kaynaktan çekilmek yerine sistem font yığınıyla karşılanır — `font-src 'self'`
kısıtı korunur. Analitik/izleyici eklenmedi.
