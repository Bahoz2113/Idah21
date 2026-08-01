# KANIT — Kabul kriteri 2: "Yeni özellik kabul kriterlerini karşılıyor"

status: pass

**Loop:** `loop-msanwgg6-82a100` · **Tarih:** 2026-08-01

Plandaki AC1–AC15'in tek tablodaki durumu.

| ID | Kriter | Durum | Kanıt |
|---|---|---|---|
| AC1 | 9 sahne üretimde, pin/scrub çalışıyor | ✅ | Playwright: sayaç 000→046, ray -732px, canvas oluştu |
| AC2 | Palet uyumu, yasak renk yok | ✅ | Tarama 0 sonuç; token dışı hex 0 |
| AC3 | Lighthouse Perf ≥90 / A11y ≥95 | ⏳ | **Bu ortamda ölçülemedi** — dağıtım sonrası |
| AC4 | reduced-motion tam fallback + klavye | ✅ | 0 taşınmış span, 4 GRANTED, odak `rgb(255,111,0)` |
| AC5 | build + tsc 0 hata | ✅ | `detay-f0-build.md` |
| AC6 | 390/768/1440/2560 düzen bozulmuyor | ✅ | 4 kırılımda yatay taşma yok + ekran görüntüleri |
| AC7 | Form doğrulama ve gönderim | ✅ | 8 senaryo, `ac1-tum-testler-geciyor.md` |
| AC8 | Benzersiz metadata + JSON-LD | ✅ | 6 şema tipi doğrulandı |
| AC9 | İçerik katmanında WebGL yok | ✅ | `/sss` three.js chunk yüklemiyor, 8 chunk |
| AC10 | Her iddia doğrulanmış listeye dayanıyor | ✅ | "TEKNOFEST" 0, "650" 0 geçiş |
| AC11 | AI crawler izinleri + llms.txt | ✅ | 11 bot Allow, `Google-Extended` dahil |
| AC12 | GPTBot ham HTML'de olgusal cümleler | ✅ | 7 rotada bulundu, `three:0` |
| AC13 | H2 blokları kendi kendine yetiyor | ✅ | `/sss` 6/6 soru biçimli H2 |
| AC14 | Öznel ifade taraması 0 | ✅ | 0 sonuç |
| AC15 | Her olgunun inline kaynak atfı | ✅ | 3/3 kayıt `sources` taşıyor |

**14/15 karşılandı.** AC3 ortam kısıtı nedeniyle beklemede; yapısal ön koşulları
(tam statik rotalar, izole three.js chunk'ı) sağlanmış durumda.

## F6 — Medya entegrasyonu (2026-08-01, tamamlandı)

Nano Banana ile üretilen **11/11 görsel** teslim alındı ve entegre edildi.
Adlandırma ve oranlar `artifacts/gorsel-senaryolari.md` şartnamesine birebir uydu.

| Denetim | Sonuç |
|---|---|
| Dosya sayısı | 11/11 |
| Oranlar (galeri 3:4, lab 16:9, OG 1.91:1, dişli 1:1) | ✅ tümü uyumlu |
| Yüz / insan | ✅ yok |
| Yazı / logo | ✅ yok |
| Palet (lacivert + turuncu + kömür) | ✅ uyumlu |
| Negatif alan (lab görsellerinde sol yarı karanlık) | ✅ metin okunur |
| C1 dişli görselinde hat sanatı riski | ✅ gerçekleşmedi, saf mekanik |

**İşleme:** 18 MB PNG → **484 KB WebP** (%97 küçülme). Her görsele 16px
gömülü LQIP blur yer tutucu üretildi; `next/image` responsive `sizes` ile
bağlandı. OG kartı tam 1200×630'a kırpıldı ve `openGraph` + `twitter`
metadata'sına bağlandı.

**Düzeltilen kusur:** Galeri kartlarında görsel intrinsic yüksekliği alt bilgi
bloğunu kartın dışına itiyordu. Görsel kutusu `relative min-h-0 flex-1
overflow-hidden` ile sarmalandı; ekran görüntüsüyle doğrulandı.

Medya entegrasyonundan sonra tarayıcı paketi yeniden çalıştırıldı: **13/13 geçti.**

**Video slot'ları (Gemini Omni) hâlâ boş** — `MediaSlot` o slot'larda prosedürel
yer tutucuya düşüyor, site çalışmaya devam ediyor.

## Ayrıntı
`detay-sistem-kurulumu.md`, `detay-ham-html-gptbot.md`, `detay-tarayici-dogrulamasi.md`
