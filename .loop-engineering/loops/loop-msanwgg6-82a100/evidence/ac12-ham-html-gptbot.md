# KANIT — AC12 · GPTBot ham HTML'de olgusal içeriği görüyor

**Loop:** `loop-msanwgg6-82a100` · **Faz:** F0 · **Tarih:** 2026-08-01
**status: pass**

---

## Kabul kriteri
> AC12 — `curl -A "GPTBot"` ile alınan **ham HTML'de** (JS render'sız) her olgusal
> cümle bulunuyor.

## Neden kritik
`artifacts/geo-optimizasyon-spec.md` §2: AI crawler'ları karmaşık JavaScript render
etmez. React + WebGL bir sitede metin istemcide üretilirse ChatGPT / Perplexity /
Gemini **boş sayfa görür** ve tüm GEO çalışması geçersiz olur.

Bu kanıt, GEO kurallarının (K1–K6) F0'dan itibaren fiilen uygulandığını gösterir.

---

## Yöntem
```bash
pnpm build && pnpm start          # üretim sunucusu, port 3100
curl -s -A "GPTBot" http://127.0.0.1:3100/ > raw.html
```
Yanıt boyutu: **18 208 bayt**

## Ham çıktı — olgusal cümle taraması

```
Batman'ın ilk VTOL İHA uçuşunu             1 eşleşme
yazılım, yapay zekâ ve havacılık          16 eşleşme
Yediiki Robot ve Teknoloji                 2 eşleşme
Metin Özer                                 2 eşleşme
EducationalOrganization                    2 eşleşme
batmangazetesi|ilkha  (kaynak linkleri)    3 eşleşme
```
**Hiçbiri 0 değil** → geçer.

## Ham çıktı — olgusal `<h1>`

```html
<h1 class="mt-10 max-w-2xl font-body text-lg leading-relaxed text-ash md:text-xl">
Cezeri Robotech, Batman&#x27;da yazılım, yapay zekâ ve havacılık alanlarında
eğitim veren bir öğrenme merkezidir.
```
GEO kuralı G3 uygulandı: sinematik manşet `aria-hidden` bir `<p>`, semantik `<h1>`
ise olgusal cümle. `<h1>` = meta description = JSON-LD `description` (birebir aynı).

## Ham çıktı — JSON-LD (sunucudan basıldı, K3)

```json
{"@context":"https://schema.org","@type":"EducationalOrganization",
"name":"Cezeri Robotech",
"description":"Cezeri Robotech, Batman'da yazılım, yapay zekâ ve havacılık alanlarında eğitim veren bir öğrenme merkezidir.",
"founder":{"@type":"Person","name":"Metin Özer"},
"address":{"@type":"PostalAddress","addressLocality":"Batman","addressCountry":"TR"},
"sameAs":["https://www.instagram.com/cezerirobotech/","https://www.tiktok.com/@cezeri.robotech"]}
```

---

## Ek doğrulama — WebGL izolasyonu (K4 ön ölçümü)

```
En büyük JS chunk'lar:
   866.1 KB  .next/static/chunks/2ouqg3z5ket-e.js   ← three.js buraya izole
   222.2 KB  .next/static/chunks/1kr2_gs-lj723.js
   191.8 KB  .next/static/chunks/05kmjeupss_5h.js

three.js (WebGLRenderer) bulunduğu chunk : 2ouqg3z5ket-e.js
İlk HTML içinde "WebGLRenderer" eşleşmesi : 0
```

three.js **ilk HTML yükünde yok**; yalnızca `SceneMount` sınırının arkasından
(`next/dynamic`, `ssr:false`) istemcide yükleniyor. Metin ise sunucudan geliyor.
Ayrışma amaçlandığı gibi çalışıyor.

---

## Sonuç
`status: pass` — AC12 karşılandı. GEO mimarisi F0'dan itibaren doğrulanabilir
durumda; her sonraki fazda aynı komutla tekrar ölçülecek.
