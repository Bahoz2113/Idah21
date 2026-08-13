status: pass

# AC2 — Skill içerikleri master prompt gereksinimlerini kapsıyor

## Doğrulama yöntemi
Master prompt belgesindeki (`CEZERI_CLAUDE_CODE_WEB_INTELLIGENCE_MASTER_PROMPT.docx`)
fonksiyonel gereksinimler 25 başlığa indirildi. Her başlık için ayırt edici işaretler
tanımlandı ve 8 skill dosyasının birleşik metninde arandı (Türkçe normalizasyonlu).

## Ham çıktı

```
VAR    Routing A-H matrisi                (8 isaret)
VAR    Maliyet sirasi                     (5 isaret)
VAR    Fallback (ilk hatada birakma)      (2 isaret)
VAR    Ayni URL tekrar acma yasagi        (1 isaret)
VAR    Otomatik tetikleyiciler            (6 isaret)
VAR    Semantik degerlendirme             (2 isaret)
VAR    Browser: temel yetenekler          (7 isaret)
VAR    Browser: JS bekleme                (3 isaret)
VAR    Browser: cok sayfa / link takibi   (2 isaret)
VAR    Browser secimi                     (3 isaret)
VAR    Opsiyonel oturum modu              (3 isaret)
VAR    Makale alanlari                    (10 isaret)
VAR    Boilerplate ayiklama               (5 isaret)
VAR    Kaynak onceligi                    (5 isaret)
VAR    SO/blog otorite degil              (1 isaret)
VAR    Surum karsilastirma                (5 isaret)
VAR    Dogrulama kurallari                (5 isaret)
VAR    Domain'e kor guven yasagi          (1 isaret)
VAR    Research loop                      (4 isaret)
VAR    Sonsuz dongu yasagi                (2 isaret)
VAR    Extractor alanlari                 (8 isaret)
VAR    JSON/Markdown cikti                (2 isaret)
VAR    Prompt injection korumasi          (3 isaret)
VAR    Yasaklar                           (6 isaret)
VAR    Credential loglamama               (2 isaret)

SONUC: 25/25 gereksinim karsilandi

Her skill'de guvenlik blogu var mi:
  cezeri-article-reader            EVET
  cezeri-browser-agent             EVET
  cezeri-deep-research             EVET
  cezeri-documentation-reader      EVET
  cezeri-orchestrator              EVET
  cezeri-source-verifier           EVET
  cezeri-web-extractor             EVET
  cezeri-web-research              EVET
```

## Gereksinim → skill eşlemesi

| Master prompt gereksinimi | Karşılayan skill |
|---|---|
| A–H yönlendirme matrisi | `cezeri-orchestrator` |
| LOCAL → FETCH → SEARCH → BROWSER → DEEP maliyet sırası | `cezeri-orchestrator` |
| Araç başarısız → alternatife geç, ilk hatada bırakma | `cezeri-orchestrator`, `cezeri-browser-agent` |
| Otomatik tetikleyiciler + semantik değerlendirme | `cezeri-orchestrator` |
| Browser: URL, tıklama, sekme, geri/ileri, scroll, JS bekleme, okuma, form, metin, metadata, screenshot, çok sayfa, link takibi | `cezeri-browser-agent` |
| Browser seçimi (chrome/msedge/chromium) | `cezeri-browser-agent` |
| Opsiyonel oturum modu (extension / user-data-dir / storage-state) | `cezeri-browser-agent` |
| Makale alanları (14 alan) + boilerplate ayıklama | `cezeri-article-reader` |
| Kaynak önceliği (5 kademe), SO/blog otorite değil | `cezeri-documentation-reader` |
| Lockfile/manifest sürüm karşılaştırması | `cezeri-documentation-reader` |
| Birincil kaynak, ikinci bağımsız kaynak, tarih, çelişki, doğrulanamayan | `cezeri-source-verifier` |
| Domain'e körü körüne güvenme | `cezeri-source-verifier` |
| Research loop (10 adım) + sonsuz döngü yasağı | `cezeri-deep-research` |
| Yapılandırılmış çıkarma (12 tür) + JSON/Markdown | `cezeri-web-extractor` |
| Prompt injection koruması | **8/8 skill'de** |
| Yasaklar (CAPTCHA, paywall, bot koruma, credential, cookie/token, robots) | `cezeri-orchestrator`, `cezeri-browser-agent`, diğerleri |

## Not
Bu kontrol içeriğin **varlığını** kanıtlar, davranışsal etkinliğini değil.
Davranışsal doğrulama TEST 7 (AC7, offline — bu ortamda çalıştırıldı) ve TEST 1–6
(`SMOKE-TESTS.md`, ağ gerektirir — kullanıcı makinesinde) ile yapılır.

## Sonuç
**PASS** — 25/25 gereksinim karşılandı; güvenlik bloğu 8/8 skill'de mevcut.
