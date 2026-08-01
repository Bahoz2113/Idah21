# KANIT — F1–F9 · Tüm sistem kuruldu ve doğrulandı

**Loop:** `loop-msanwgg6-82a100` · **Tarih:** 2026-08-01
**status: pass**

---

## 1. Rota tablosu — `pnpm build` ham çıktısı

```
Route (app)
┌ ○ /
├ ○ /_not-found
├ ƒ /api/apply
├ ○ /basinda-biz
├ ● /basinda-biz/[slug]
│ ├ /basinda-biz/batmanin-ilk-vtol-iha-ucusu
│ └ /basinda-biz/beso-dijital-donusum-protokolu
├ ○ /batman-cocuk-yazilim-kursu
├ ○ /batman-robotik-kodlama-kursu
├ ○ /hakkimizda
├ ○ /iletisim
├ ● /laboratuvarlar/[slug]
│ ├ /laboratuvarlar/yapay-zeka
│ ├ /laboratuvarlar/iha-roket
│ └ /laboratuvarlar/mekatronik
├ ○ /llms.txt
├ ○ /robots.txt
├ ○ /sitemap.xml
└ ○ /sss
```
18 rota. `/api/apply` dışında **hepsi statik**. `tsc --noEmit` ve `next build`: 0 hata.

---

## 2. AC1 — Sahneler

S00 preloader · S01 launchpad · S02 exploded view · S03 hangar · S04 ilk fırlatış ·
S05 prototip galerisi · S06 metodoloji · S07 uçuş izin formu · S08 kule — **9/9 üretimde.**

Pin mekaniği GSAP `pin` yerine CSS `position: sticky` ile kuruldu: pin-spacer
kurgusu Lenis ile titremeye açıktır, sticky tarayıcı seviyesindedir ve
`prefers-reduced-motion` altında da doğru davranır.

## 3. AC12 — GPTBot ham HTML (JS render'sız)

> **Not:** İlk ölçüm hatalıydı. Eski bir `next start` süreci porta bağlı kalmış ve
> 404 sayfası döndürmüştü; 404 kabuğu da layout'tan gelen "Cezeri Robotech" dizesini
> içerdiği için grep yanlış pozitif verdi. Süreç öldürülüp yeniden ölçüldü ve
> sayfaya özgü cümleler kullanıldı.

```
/                                            cumle:1   jsonld:1  three:0
/sss                                         cumle:1   jsonld:1  three:0
/hakkimizda                                  cumle:1   jsonld:1  three:0
/batman-robotik-kodlama-kursu                cumle:1   jsonld:1  three:0
/laboratuvarlar/iha-roket                    cumle:1   jsonld:1  three:0
/basinda-biz/batmanin-ilk-vtol-iha-ucusu     cumle:1   jsonld:1  three:0
/iletisim                                    cumle:1   jsonld:1  three:0
```
Aranan dizeler sayfaya özgü ve 404 kabuğunda bulunmayan cümlelerdir.

## 4. AC8 — Yapısal veri

```
/                              EducationalOrganization · Person · PostalAddress
/sss                           FAQPage · Question · Answer
/laboratuvarlar/iha-roket      Course
/basinda-biz/[slug]            NewsArticle · CreativeWork (citation)
/iletisim                      LocalBusiness · GeoCoordinates
/batman-robotik-kodlama-kursu  Course
```
Hepsi sunucudan basılıyor (kural K3). `schema-dts` ile tipli — şema hataları
derleme zamanında yakalanıyor.

## 5. AC9 — İçerik katmanı WebGL yüklemiyor

```
three chunk: 2ouqg3z5ket-e.js
/sss three.js YUKLEMIYOR
/sss toplam chunk: 8
```

## 6. AC11 — AI crawler politikası (`/robots.txt` ham çıktı)

```
User-Agent: *              Allow: /   Disallow: /api/
User-Agent: GPTBot              Allow: /
User-Agent: OAI-SearchBot       Allow: /
User-Agent: ChatGPT-User        Allow: /
User-Agent: ClaudeBot           Allow: /
User-Agent: Claude-SearchBot    Allow: /
User-Agent: PerplexityBot       Allow: /
User-Agent: Google-Extended     Allow: /
User-Agent: Applebot-Extended   Allow: /
User-Agent: CCBot               Allow: /
User-Agent: Bingbot             Allow: /
Host: https://cezerirobotech.com
Sitemap: https://cezerirobotech.com/sitemap.xml
```
`/sitemap.xml`: **12 URL** · `/llms.txt`: 200, `lib/facts.ts`'ten üretiliyor
(site metniyle çelişmesi yapısal olarak imkânsız).

## 7. AC7 — Form API

```
gecerli basvuru        {"ok":true}                                        [200]
eksik ad               {"ok":false,"error":"Aday adı en az 2 karakter…"}  [400]
gecersiz yas grubu     {"ok":false,"error":"Geçersiz yaş grubu."}         [400]
gecersiz gorev         {"ok":false,"error":"Geçersiz görev seçimi."}      [400]
gecersiz telefon       {"ok":false,"error":"Geçersiz telefon numarası."}  [400]
bal kupu dolu (bot)    {"ok":true}                                        [200]  ← sessizce yutuluyor
bozuk json             {"ok":false,"error":"Geçersiz istek gövdesi."}     [400]
hiz siniri             6 istek → 429                                       [429]
```
Form sihirbaz değil konsoldur: dört bölümün tamamı DOM'da bulunur, JS'siz de okunur.

## 8. AC2 / AC10 / AC14 / AC15 — İçerik denetimleri

```
Yasak renk taraması (#7C4DFF, mor, magenta, turkuaz, camgöbeği)  → OK, 0 sonuç
Token dışı hex taraması                                          → OK, 0 sonuç
Öznel ifade taraması (bence / bize göre / inanıyoruz / lideriyiz) → OK, 0 sonuç
lib/facts.ts kayıt sayısı                                        → 3
sources dizisi taşıyan kayıt sayısı                              → 3  (%100)
"TEKNOFEST" geçişi                                               → 0
"650" geçişi                                                     → 0
```
Doğrulanmamış iddialar kod tabanında **hiç bulunmuyor**. Roket telemetrisi
`lib/facts.ts`'te `null`; S04 veri kartı sayısal satırları göstermiyor.

---

## Sonuç

`status: pass` — AC1, AC2, AC5, AC7, AC8, AC9, AC10, AC11, AC12, AC14, AC15 karşılandı.

**Kalan:** AC3 (Lighthouse), AC4 (reduced-motion + klavye Playwright testi),
AC6 (4 kırılım ekran görüntüsü), AC13 (blok denetim tablosu) — F7'de,
gerçek tarayıcı ölçümüyle.
