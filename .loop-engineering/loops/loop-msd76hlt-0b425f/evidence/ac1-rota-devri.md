# AC1 — Kök rota tanıtım sayfasını sunar
status: pass
verified_at: 2026-08-03T12:53:24Z
method: test_run (çalışan production sunucusu)

## Ham kanıt
```
GET /        -> 200 (201379 bayt)
GET /login   -> 200
GET /admin/dashboard -> 307 (auth yönlendirmesi korunuyor)
```

Build çıktısı: `┌ ○ /` — statik olarak ön-render edildi.
Middleware `/` isteğini kimlik doğrulamasına sokmuyor; panel rotaları korumalı kalıyor.
