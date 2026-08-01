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

## F6 — Video entegrasyonu (2026-08-01, tamamlandı)

Videolar **Kling** ile üretildi (Gemini Omni yerine). 6 dosya geldi: 4 farklı
sahne + mekatronik ve İHA için birer yedek varyant. Hepsi 1920×1080, 24 fps,
8 sn, H.264 + AAC. Filigran yok.

**Kaynak tespiti:** dosya adları zaman damgalıydı; her videodan orta kare
çıkarılıp kontak sayfası oluşturularak sahneler eşlendi. İlk eşlemede alfabetik
sıralama ile kontak numaraları karıştırıldı ve `v3-lab` yanlış kaynağı aldı;
kontrol karesinde yakalandı ve düzeltildi.

**Varyant seçimi** — şartnamedeki negatif alan kuralına göre:
- Mekatronik: A varyantı (sol yarı tamamen siyah) seçildi, B elendi.
- İHA: B varyantı (İHA daha sağda, sol yarı daha temiz) seçildi, A elendi.

**İşleme:**
| İş | Ayrıntı |
|---|---|
| Ses | Silindi — 4/4 çıktıda ses akışı yok |
| Ölçek | 1920×1080 → 1600×900 (lanczos) |
| **Kesintisiz döngü** | Kuyruk (7–8 sn) baştaki 1 sn'ye karıştırıldı → 7 sn sorunsuz dönen klip. İlk/son kare karşılaştırmasıyla doğrulandı. |
| **v1 aynalandı** | Duman sütunu solda, manşet de solda kalıyordu. `hflip` ile sütun sağa geçti; manşetin arkası temiz gece gökyüzü oldu. |
| **v3 yazı temizliği** | 3B yazıcı ekranında AI'ın uydurduğu bozuk yazı vardı ("yazı yok" kuralının ihlali). Bölgesel `boxblur` uygulandı — turuncu parıltı korundu, harf formları odak dışı ekrana dönüştü. `delogo` yerine bulanıklık tercih edildi: parıltıyı öldürmüyor. |
| Çıktı | WebM (VP9) + MP4 (H.264) + WebP poster |

**Boyutlar:** en büyük klip 546 KB WebM — hedef klip başına <2.5 MB idi.

**Oynatma:** `AutoVideo` bileşeni IntersectionObserver ile yalnızca görünürken
oynatır; üç hangar videosu aynı anda kod çözmez. `prefers-reduced-motion`
altında video hiç oynatılmaz, poster karesi kalır (AC4).

Video entegrasyonundan sonra tarayıcı paketi yeniden çalıştırıldı: **13/13 geçti.**

## Ayrıntı
`detay-sistem-kurulumu.md`, `detay-ham-html-gptbot.md`, `detay-tarayici-dogrulamasi.md`
