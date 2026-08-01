# ARAŞTIRMA — CEZERİ ROBOTECH · Haber Envanteri + SEO/GEO Stratejisi

**Loop:** `loop-msanwgg6-82a100`
**Tarih:** 2026-08-01
**Yöntem:** Web arama (WebSearch). **Kısıt:** Bu ortamın ağ politikası Türk haber sitelerine
doğrudan HTTP erişimini engelliyor (proxy CONNECT 403). Bu yüzden aşağıdaki veriler
arama motoru sonuç özetlerinden toplanmıştır; **yayına girmeden önce kaynak sayfadan
birebir teyit edilmelidir.**

---

## 1. GITHUB REPO ENVANTERİ

Hesapta erişilebilir **tek repo var**:

| Repo | Görünürlük | Son push | Not |
|---|---|---|---|
| `Bahoz2113/Idah21` | public | 2026-08-01 | Education OS monorepo + bu loop sistemi |

→ SEO için devralınacak hazır bir repo **yok**. Altyapı sıfırdan kurulacak.

### Kullanılabilir açık kaynak paketler (değerlendirme)

| Repo | ⭐ | Karar | Gerekçe |
|---|---|---|---|
| `google/schema-dts` | 1.2k | ✅ **KULLAN** | Schema.org JSON-LD için tipli TypeScript. Yapısal veriyi derleme zamanında doğrular; elle yazılan JSON-LD'deki sessiz hataları önler. Google'ın kendi paketi. |
| `iamvishnusankar/next-sitemap` | 3.7k | ❌ **KULLANMA** | Next 15'te `app/sitemap.ts` ve `app/robots.ts` **yerleşik**. Ek bağımlılık gereksiz. |
| `garmeeh/next-seo` | 8.5k | ❌ **KULLANMA** | App Router'ın yerleşik Metadata API'si bu paketin işini görüyor. Pages Router dönemi çözümü. |
| `llms.txt` üreticileri | 0–1 | ❌ **KULLANMA** | GitHub'daki tüm `llms.txt` generator'ları terk edilmiş, 0-1 yıldızlı oyuncak projeler. `llms.txt` düz markdown — elle yazmak hem daha doğru hem sıfır bağımlılık. |

**Sonuç:** Tek yeni bağımlılık `schema-dts` (dev-dependency, runtime maliyeti sıfır).

---

## 2. DOĞRULANMIŞ HABER ENVANTERİ

### ✅ D1 — Batman'ın ilk VTOL İHA uçuşu ve model roket fırlatışı
**Ne:** Yazılım Mühendisi **Metin Özer**'in kurucusu olduğu **Cezeri Robotech**,
Batman'da **ilk VTOL İHA uçuşunu ve model roket fırlatışını** gerçekleştirdi.
**Nerede:** "Yediiki Robot ve Teknoloji Yarışması" kapsamında
**Organizasyon:** Batman Valiliği · 29–30 Nisan · 19 Mayıs Spor Salonu · saat 10:00
**Kaynaklar:** ilkha.com · batmangazetesi.com.tr · batmanrehbergazetesi.com · malatyaensonhaber.com · batmansonsoz.net
**SEO değeri:** ★★★★★ — "Batman'da ilk" ifadesi benzersiz, alıntılanabilir ve
rakipsiz bir konumlandırma. Ana manşet adayı.

### ✅ D2 — BESO protokolü (kurumsal güvenilirlik)
**Ne:** Batman Esnaf ve Sanatkârlar Odası Başkanı **Mehmet Sıddık Çiftçi**, ticaret
dünyasının dijitalleşmesi için **Cezeri Robotech ile protokol imzaladı.**
**İçerik:** BESO'ya kayıtlı tüm üyelere yazılım, yapay zekâ destekli çözümler ve
danışmanlık hizmetlerinde özel indirim + **çocukların yapay zekâ, yazılım, teknoloji
ve dijitalleşme alanlarında eğitim alma imkânı.**
**Tarih:** Nisan 2025
**Kaynaklar:** batmangazetesi.com.tr · batmanyon.com
**SEO değeri:** ★★★★★ — Resmî bir meslek odasıyla protokol = E-E-A-T'de
"Authoritativeness" kanıtı. Ayrıca `beso.org.tr`'den backlink potansiyeli.

### ✅ D3 — Kurumsal kimlik
- **Kurucu:** Metin Özer — Yazılım Mühendisi / Bilgisayar Bilimleri Uzmanı (LinkedIn doğrulanabilir)
- **Tanım:** "Yazılım ve Yapay Zekâ Öğrenme Merkezi"; ağırlık **havacılık**, yanında yapay zekâ ve robotik
- **Faaliyet:** yazılım, yapay zekâ destekli çözümler, danışmanlık, çocuk/genç eğitimi
- **Mevcut site:** `cezerirobotech.com` *(bu ortamdan erişilemedi — 403)*
- **Sosyal:** Instagram `@cezerirobotech` · TikTok `@cezeri.robotech` · LinkedIn (Metin Özer)

### ✅ D4 — Bölgesel ekosistem bağlamı
Batman'da "Yediiki Robot ve Teknoloji Yarışması" düzenli bir etkinlik (2026 için
`yediiki.com.tr` aktif). Batman merkezli takımlar TEKNOFEST roket yarışmalarına
katılıyor. Bu, "Batman = teknoloji üssü" anlatısını destekleyen gerçek bir zemin.

---

## 3. 🔴 DOĞRULANAMAYAN İDDİALAR — YAYINA GİREMEZ

Brief'te verilen iki iddianın **hiçbir kaynakta karşılığı bulunamadı**:

### ❌ İ1 — "TEKNOFEST Birinciliği"
Aramalarda çıkan TEKNOFEST dereceleri **başka kurumlara** ait:
| Bulunan | Kime ait |
|---|---|
| TEKNOFEST 2020 Tarım Teknolojileri, 763 başvuru içinde 9. | *Cezeri takımı* (eski adı Hezarfen) — Cezeri Robotech DEĞİL |
| TEKNOFEST Otonom Araç, Özgün Kategori 4.'lük | *Siirt Üniversitesi Cezeri Otonom Takımı* — Cezeri Robotech DEĞİL |
| TEKNOFEST 2026 yarı final | *Cizre İsmail Ebul-iz BİLSEM* — Cezeri Robotech DEĞİL |

"Cezeri" adı Türkiye'de çok yaygın kullanılıyor (Baykar Cezeri uçan araba, Cezeri YZR
A.Ş./İstanbul, TİKA Cezeri Laboratuvarı Beyrut, çok sayıda öğrenci takımı).
**Bu isim karışıklığı hem SEO hem doğruluk açısından ana risk.**

### ❌ İ2 — "650 m irtifa testi"
Bulunan tek irtifa rakamı **2.740 m** ve o da TEKNOFEST'te birincilik için yarışan
**farklı bir takıma** ait. Cezeri Robotech ile ilişkilendiren kaynak yok.

### Neden bu iddialar siteye konulamaz
1. **Doğruluk:** TEKNOFEST dereceleri kamuya açık ve doğrulanabilir. Yanlış derece
   iddiası tespit edilebilir bir iddiadır.
2. **SEO'ya zarar verir:** Google'ın E-E-A-T ve spam politikaları doğrulanamayan
   başarı iddialarını cezalandırır. Rakip veya gazeteci kontrolünde geri teper.
3. **GEO'ya zarar verir:** Kullanıcı ChatGPT/Perplexity'ye sorduğunda model kaynakları
   çapraz kontrol eder; desteklenmeyen iddia **alıntılanmaz, çürütülür.**
4. **Gerek yok:** D1 ("Batman'ın ilki") ve D2 (resmî oda protokolü) zaten daha güçlü,
   daha benzersiz ve **doğrulanabilir** konumlandırmalar.

**→ KARAR BEKLİYOR:** Kullanıcı belge/haber linki sunarsa iddialar eklenir.
Sunamazsa D1 + D2 üzerinden kurgulanır.

---

## 4. 🔴 MİMARİ ÇATIŞMA: TEK SAYFA vs. ARAMA GÖRÜNÜRLÜĞÜ

Onaylanan plan **tek sayfa (one-page)** sinematik deneyim.
Hedef ise **"tüm aramalarda en üstte"**.

**Bu ikisi doğrudan çelişiyor.** Bir sayfa, tek bir birincil sorgu kümesi için
sıralanır. "Batman robotik kodlama kursu", "Batman yapay zekâ eğitimi", "Batman İHA
takımı", "Batman yaz kodlama okulu" — bunların her biri **ayrı bir sayfa** ister.
Ayrıca ağır WebGL'li bir sayfa, Core Web Vitals'ta hafif bir metin sayfasıyla
yarışamaz.

### Önerilen çözüm — HİBRİT MİMARİ
```
/                        ← Sinematik one-page (marka, dönüşüm, "vay be" etkisi)
                            Ağır, WebGL, scroll-driven. Marka sorguları için.

/laboratuvarlar/yapay-zeka        ┐
/laboratuvarlar/iha-roket         │  Hafif, hızlı, metin ağırlıklı,
/laboratuvarlar/mekatronik        │  her biri tek bir sorgu kümesini hedefler.
/programlar/[yas-grubu]           │  WebGL YOK. LCP < 1.2s.
/batman-robotik-kodlama-kursu     ┘

/basinda-biz             ← Haber arşivi (D1, D2 ve gelecek haberler)
/basinda-biz/[slug]      ← Her haber için ayrı sayfa + Article JSON-LD
/sss                     ← FAQPage JSON-LD (AEO/GEO'nun ana yakıtı)
/hakkimizda              ← Kurucu, kuruluş, misyon (E-E-A-T)
```
One-page deneyim bozulmaz — sadece **arkasına indekslenebilir bir içerik katmanı**
eklenir. Awwwards jürisi `/`'e bakar, Google ve LLM'ler kataloğu okur.

---

## 5. SEO / GEO UYGULAMA PLANI

### 5.1 Teknik temel (Next 15 yerleşik)
- `app/sitemap.ts` — tüm rotalar, `lastModified`, `changeFrequency`
- `app/robots.ts` — aşağıdaki AI crawler politikası ile
- Her rotada `generateMetadata` — benzersiz title/description/canonical/OG
- `next/image` AVIF + LQIP · font `display: swap` · `dynamic(ssr:false)` ile WebGL izolasyonu
- Türkçe `lang="tr"`, `hreflang` (ileride `en` eklenirse hazır)

### 5.2 Yapısal veri (JSON-LD, `schema-dts` ile tipli)
| Şema | Nerede | Neden |
|---|---|---|
| `EducationalOrganization` + `LocalBusiness` | `/` | Batman adresi, `geo` koordinat, `openingHours`, `founder: Metin Özer`, `sameAs: [Instagram, TikTok, LinkedIn]` |
| `Course` | her program sayfası | Google "Kurslar" zengin sonucu |
| `FAQPage` | `/sss` + her lab sayfası | **AEO'nun ana yakıtı** — LLM'ler soru-cevap bloklarını doğrudan alıntılar |
| `Article` / `NewsArticle` | `/basinda-biz/[slug]` | Haber alıntılarının entity'e bağlanması |
| `VideoObject` | fırlatma videoları | Video zengin sonucu |
| `Event` | yarışma/tanıtım günleri | Etkinlik zengin sonucu |
| `BreadcrumbList` | alt sayfalar | Sonuçta kırıntı navigasyonu |

**Entity tutarlılığı kuralı:** Kurum adı, adres, kurucu adı sitede, Instagram bio'sunda,
Google Business Profile'da ve tüm haberlerde **birebir aynı** yazılacak. Knowledge
Graph'ta tek bir varlık oluşmasının şartı budur — ve "Cezeri" isim karmaşasından
ayrışmanın tek yolu.

### 5.3 GEO / AEO — LLM görünürlüğü
> **Gerçek:** ChatGPT/Claude/Gemini/Perplexity'de "sıralama" diye bir şey yok.
> Ölçüt **alıntılanma (citation)**. Optimize edilecek şey sıra değil, alıntılanabilirlik.

- **`/llms.txt`** ve **`/llms-full.txt`** — kurum özeti, programlar, doğrulanmış
  başarılar, iletişim; sade markdown. Elle yazılacak (paket yok).
- **`robots.txt`'te AI crawler'lara açık izin:**
  `GPTBot`, `OAI-SearchBot`, `ChatGPT-User` (OpenAI) · `ClaudeBot`, `Claude-SearchBot`
  (Anthropic) · `PerplexityBot` · `Google-Extended` (Gemini) · `Applebot-Extended` ·
  `Bingbot` · `CCBot`
  ⚠️ **`Google-Extended`'ı engellemek = Gemini'de hiç görünmemek.** Çoğu sitenin
  farkında olmadan yaptığı hata.
- **Alıntılanabilir cümle yapısı:** Her önemli olgu **tek cümlede, öznesi açık,
  tarihli ve rakamlı** yazılacak.
  ✅ *"Cezeri Robotech, 2025'te Batman'da ilk VTOL İHA uçuşunu ve model roket
  fırlatışını gerçekleştirdi."*
  ❌ *"Biz teknolojide öncüyüz ve birçok başarıya imza attık."*
- **Soru başlıklı içerik:** `<h2>Batman'da robotik kodlama kursu nerede?</h2>` +
  hemen altında 2-3 cümlelik net cevap. LLM'ler bu kalıbı doğrudan alır.
- **Üçüncü taraf tutarlılığı:** Haber sitelerindeki mevcut geçişler (ilkha, Batman
  Gazetesi, Batman Yön, batmansonsoz) zaten LLM eğitim/arama korpusunda. Sitedeki
  ifadeler bu haberlerle **çelişmemeli** — çelişki alıntılanmayı öldürür.

### 5.4 Yerel SEO (Batman)
**Hedef sorgu kümesi:**
`batman robotik kodlama kursu` · `batman yazılım kursu çocuk` · `batman yapay zeka eğitimi` ·
`batman stem atölye` · `batman İHA roket takımı` · `batman kodlama kursu fiyat` ·
`batman çocuk teknoloji kursu` · `batman drone eğitimi`

**Site dışı (kullanıcının yapması gerekenler — kod ile çözülemez):**
1. **Google Business Profile** — kategori "Eğitim merkezi", fotoğraf, gönderi, yorum. *Yerel sıralamada tek en büyük faktör.*
2. **NAP tutarlılığı** — ad/adres/telefon her yerde birebir aynı
3. **Yerel backlink** — BESO (`beso.org.tr`), Batman Valiliği etkinlik sayfaları,
   yerel haber siteleri. D1 ve D2 zaten bu kapıları açmış durumda.
4. **Instagram içi arama** ayrı bir alan: bio'da anahtar kelime, alt-text, konum etiketi.

---

## 6. SONRAKİ ADIMLAR

| # | İş | Bağımlılık |
|---|---|---|
| 1 | TEKNOFEST + 650m iddialarının belgelenmesi | **Kullanıcı** |
| 2 | Hibrit mimari onayı (one-page + içerik katmanı) | **Kullanıcı** |
| 3 | Gerçek NAP verisi: tam adres, telefon, e-posta, çalışma saatleri | **Kullanıcı** |
| 4 | `cezerirobotech.com` mevcut site durumu — devralınacak mı, alan adı taşınacak mı? | **Kullanıcı** |
| 5 | Haber kaynaklarının birebir teyidi ve `/basinda-biz` içeriğine dönüştürülmesi | Claude |
| 6 | JSON-LD + sitemap + robots + llms.txt uygulaması | Claude (F0/F1) |
