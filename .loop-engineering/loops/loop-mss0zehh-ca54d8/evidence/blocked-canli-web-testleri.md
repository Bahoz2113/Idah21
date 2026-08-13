status: blocked

# BLOKE — TEST 1–6 (canlı web gerektiren smoke testler)

> Bu dosya bir kabul kriterine karşılık **gelmez** (`acN-` öneki yoktur), bu yüzden
> `loop verify` puanına dahil edilmez. Amacı: bu ortamda kanıtlanamayan şeyi
> gizlemek yerine açıkça kaydetmektir.

## Neden bloke

Bu container'ın ağ politikası genel internete kapalı. Ölçüm:

```
$ curl -o /dev/null -w "%{http_code}" https://example.com
curl: (56) CONNECT tunnel failed, response 403

$ curl -o /dev/null -w "%{http_code}" https://www.google.com
curl: (56) CONNECT tunnel failed, response 403

$ curl -o /dev/null -w "%{http_code}" https://registry.npmjs.org/
200
```

Proxy'nin kendi durum uç noktası bunu politika reddi olarak raporluyor:

```json
{
  "enabled": true,
  "recentRelayFailures": [
    { "kind": "connect_rejected",
      "detail": "gateway answered 403 to CONNECT (policy denial or upstream failure)",
      "host": "example.com:443" },
    { "kind": "connect_rejected",
      "detail": "gateway answered 403 to CONNECT (policy denial or upstream failure)",
      "host": "www.google.com:443" }
  ]
}
```

Yalnızca izin listesindeki hostlar açık (npm registry, GitHub, docs.claude.com).
Bu bir arıza değil, ortamın seçili ağ politikasıdır.

## Bloke olan testler

| Test | İçerik | Neden bloke |
|---|---|---|
| TEST 1 | Browser: public sayfa aç, başlık + ana içerik oku | Keyfi host'a CONNECT 403 |
| TEST 2 | Navigation: linke tıkla, hedef sayfayı oku | Aynı |
| TEST 3 | Documentation: resmî doküman sayfasından bilgi çıkar | Aynı |
| TEST 4 | Article: haber sayfasından başlık/tarih/metin ayır | Aynı |
| TEST 5 | Source Verification: iki bağımsız kaynaktan doğrula | Aynı |
| TEST 6 | Automatic Routing: web araştırmasını kendiliğinden seçme | Aynı |

## Bu ortamda ne kanıtlandı (bloke DEĞİL)

Ağ bağımlılığı olmayan her şey gerçekten çalıştırıldı:

- **Tarayıcı gerçekten başlıyor ve sayfa render ediyor** — `ac6` (gerçek Chromium,
  `file://`, DOM okuma, tablo çıkarma)
- **Prompt injection direnci** — `ac7` (TEST 7, 6 vektör, offline fixture)
- **Kurulum/idempotency/geri alma** — `ac3`, `ac4`, `ac9`
- **MCP kaydı ve bağlantısı** — `ac5` (`√ Connected`)
- **Skill discovery** — `ac1` (Claude Code'un kendi skill listesi)
- **Health check** — `ac8`

Yani bloke olan şey **sistemin kendisi değil**, yalnızca canlı internet üzerinden
uçtan uca doğrulamadır.

## Nasıl tamamlanacak

Kullanıcı kendi makinesinde:

```powershell
cd <repo>\cezeri-web-intelligence
.\install.ps1
# Claude Code'u yeniden başlat
node healthcheck.mjs
```

Sonra `SMOKE-TESTS.md` içindeki TEST 1–6 istemlerini sırayla verir ve sonuç tablosunu
doldurur. `healthcheck.mjs` çıktısındaki `network` satırı o ortamda `PASS` olmalıdır.

## Alternatif
Ortamın ağ politikası Claude Code web ortam ayarlarından genişletilirse (bkz.
https://code.claude.com/docs/en/claude-code-on-the-web), bu testler bu container'da da
çalıştırılabilir.
