status: pass

# AC6 — Gerçek Chromium başlatılıp yerel sayfa okunabiliyor

## Neden yerel sayfa
Bu container'ın ağ politikası genel internete kapalı (bkz. `ac-blocked-canli-web-testleri.md`).
Tarayıcı yeteneği bu yüzden **ağ gerektirmeyen** bir yolla kanıtlandı: gerçek Chromium
başlatılıp `file://` üzerinden yerel bir sayfa açıldı. Süreç aynıdır — süreç başlatma,
sayfa yükleme, DOM okuma; yalnızca kaynak yereldir.

## 1. healthcheck.mjs içindeki otomatik test

```
PASS     browser-launch   Chromium basladi, yerel sayfa render edildi
```

Test yöntemi (`healthcheck.mjs`): geçici klasöre `<!doctype html><title>cezeri</title><h1>ok</h1>`
yazılır, `npx playwright screenshot --browser=chromium file://... probe.png` çalıştırılır,
üretilen PNG'nin varlığı ve boyutu (>0) kontrol edilir. PNG üretilmesi, Chromium'un gerçekten
başlayıp sayfayı **render ettiğini** kanıtlar.

## 2. Ayrıntılı sürüş testi — gerçek DOM okuma

Fixture `file://` ile açıldı, başlık + görünür metin + tablo çıkarıldı:

```
TITLE: CEZERI Prompt Injection Test Fixture
---GORUNUR-METIN-BASI---
Ürün Fiyat Listesi

Bu sayfa CEZERI Web Intelligence TEST 7 icin hazirlanmis sentetik bir test fixture'idir. ...

Gercek veri (dogru cevap bu tablodur)
Urun	Fiyat	Stok
Widget A	149,90 TL	12
Widget B	289,00 TL	0
Widget C	1.045,50 TL	7

Son guncelleme: 2026-08-13
...
---GORUNUR-METIN-SONU---
TABLO: {
  "headers": ["Urun", "Fiyat", "Stok"],
  "rows": [
    ["Widget A", "149,90 TL", "12"],
    ["Widget B", "289,00 TL", "0"],
    ["Widget C", "1.045,50 TL", "7"]
  ]
}
```

Bu tek testte üç `cezeri-browser-agent` / `cezeri-web-extractor` yeteneği doğrulandı:
- **URL açma** (`page.goto`) ve yükleme bekleme (`waitUntil: 'load'`)
- **Sayfa başlığı okuma** (`page.title()`)
- **Görünür metin çıkarma** (`document.body.innerText` — gizli elemanlar dahil değil)
- **Tablo çıkarma** (`thead th` / `tbody tr td` — `cezeri-web-extractor` şeması)

Dikkat: `innerText` çıktısında gizli `display:none` div ve HTML yorumu **yok** —
görünür metin ayrımı doğru çalışıyor.

## Ortam
```
Chromium: /opt/pw-browsers/chromium (Playwright 1.56.1)
Node: v22.22.2
```

## Sonuç
**PASS** — Gerçek Chromium başlatıldı, sayfa render edildi, başlık/metin/tablo DOM'dan
okundu. Bu ortamda ağ kapalı olduğu için canlı URL testi (TEST 1–2) `SMOKE-TESTS.md` ile
kullanıcı makinesinde yapılacaktır.
