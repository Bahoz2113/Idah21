# GEO/AEO OPTİMİZASYON SPEC — seowins.io metodolojisinin CEZERİ ROBOTECH'e uyarlanması

**Loop:** `loop-msanwgg6-82a100` · **Tarih:** 2026-08-01 · **Plan v3 eki**

> **Kaynak kısıtı (dürüstlük notu):** Bu ortamın ağ politikası `seowins.io`'ya doğrudan
> erişimi engelliyor (proxy CONNECT 403). Analiz, sitenin makalelerinin arama sonucu
> özetlerinden + bağımsız kaynaklardan (Princeton GEO makalesi, Yotpo, Frase, xSeek)
> çapraz doğrulanarak yapıldı. Metodolojinin **özü** güvenilir; her bir "15 teknik"in
> tam listesi elde edilemedi.

---

## 1. KAYNAK ANALİZİ — seowins.io ne yapıyor?

**Kimlik:** Hridoy Rehman tarafından kurulmuş, **150+ kanıtlanmış SEO/AI SEO stratejisi**
veritabanı. 2018'den beri SEO, 2023'ten beri AI SEO odaklı. Ürünler: strateji veritabanı,
`/toolbox`, `/seo-checklist` (160+ madde), `/consultation`, `seowins.agency`.

**Yapısal olarak dikkat çeken:** Site kendi öğrettiği şeyi uyguluyor —
platform bazlı ayrı rehber sayfaları (`/tips/gemini-seo/`, `/tips/chatgpt-seo/`,
`/tips/perplexity-seo/`), başlıkta **sayı + yıl** kalıbı ("15 Techniques", "14 Strategies"),
soru biçimli H2'ler. Bu kalıbın kendisi kopyalanmaya değer.

### Metodolojinin çekirdeği (çapraz doğrulanmış)

| İlke | Ne diyor |
|---|---|
| **GEO ≠ SEO** | "GEO, sıralama için değil **özetlenmek** için optimizasyondur." Ölçüt sıra değil, **alıntılanma**. |
| **Gemini, Google indeksinden besleniyor** | Klasik SEO'yu güçlendirmek doğrudan Gemini görünürlüğünü artırır. İkisi ayrı iş değil. |
| **Tazelik** | Eskimiş sayfalar AI cevaplarında görünmez. Perplexity **son 30 günde yayınlanan** içeriği belirgin şekilde daha çok alıntılıyor. |
| **Netlik > anahtar kelime** | Keyword stuffing zarar veriyor; bağlamsal olarak zengin cümleler AI'ın anlamı çözmesini sağlıyor. |
| **Yapısal içerik** | Yeterince yapılandırılmış ve güvenilir içerik kaynak olarak gösteriliyor. |

### Princeton GEO araştırması (ACM KDD 2024) — sayısal dayanak
5 içerik müdahalesi alıntılanma oranını **%30–41 artırıyor**:

| Teknik | Etki |
|---|---|
| **Kaynak gösterme** (inline citation) | +%30–40 |
| **İstatistik ekleme** (somut rakam) | +%32–40 |
| **Alıntı ekleme** (tırnak içinde beyan) | +%28–41 |
| **Akıcılık optimizasyonu** | pozitif |
| **Otoriter ses** (öznel ifadelerin temizlenmesi) | pozitif |

> ⚠️ **Dürüst uyarı:** Princeton'ın 2025 **SAGEO** takip çalışması, gerçek üretim
> ortamındaki (reranking + gürültü içeren) retrieval hatlarında bu etkilerin
> **daha küçük** olduğunu buldu. Teknikler çalışıyor, ama "+%40" laboratuvar tavanı.

### Platform farkları (kritik — bütçe buraya göre dağıtılır)

| Motor | Kaynak gösterme oranı | Sonuç |
|---|---|---|
| **Perplexity** | **%97** | En yüksek ROI. Öncelik burası. |
| **Gemini** | Google indeksine bağlı | Klasik SEO + `Google-Extended` izni |
| **ChatGPT** | **%16** | En zor. Marka bilinirliği ve üçüncü taraf geçişleri belirleyici. |

**Ek bulgu:** Başlık ve H2'lerde **görünür yıl sinyali** alıntılanma oranını ~%30 artırıyor.

---

## 2. 🔴 EN KRİTİK BULGU — MİMARİMİZİ DOĞRUDAN ETKİLİYOR

> **"AI crawler'ları (GPTBot gibi) karmaşık JavaScript render etmez; hızı önceler.
> SSS şeman veya fiyat tablon istemci tarafı JS ile enjekte ediliyorsa, AI crawler
> boş sayfa görür."**

**Bu bizim için hayati.** Planlanan site React + Three.js + GSAP — yani ağır bir
istemci uygulaması. Eğer metinler JS ile üretilir veya animasyon için DOM'dan
sökülürse, **ChatGPT/Perplexity/Gemini siteyi bomboş görür.** Tüm GEO çalışması boşa gider.

### → Bunun getirdiği zorunlu kod kuralları

| # | Kural | Gerekçe |
|---|---|---|
| **K1** | Tüm metin **sunucuda render edilir** (RSC / SSG). Hiçbir olgusal cümle istemcide üretilmez. | Crawler JS çalıştırmaz |
| **K2** | GSAP/SplitText **var olan DOM'u animasyonlar**, metni üretmez. Satır maskesi `<span>` sarmalama ile yapılır, `innerHTML` yazımıyla değil. | Metin ilk HTML'de bulunmalı |
| **K3** | JSON-LD `<script type="application/ld+json">` olarak **sunucudan** basılır. `useEffect` içinde asla. | Şema görünmez olur |
| **K4** | `/` dışındaki tüm rotalar **tam statik** (`export const dynamic = 'force-static'`). WebGL import edilmez. | Hız + render garantisi |
| **K5** | Sahne metinleri `opacity:0` ile başlasa bile DOM'da **var** olur; `display:none` veya koşullu mount **yasak**. | Gizli ≠ yok; ama kaldırılmış = yok |
| **K6** | Doğrulama: `curl` ile alınan **ham HTML** içinde her olgusal cümle aranabilir olacak. | AC12 kanıtı |

**Doğrulama komutu (AC12):**
```bash
curl -sA "GPTBot" https://cezerirobotech.com/ | grep -c "Batman'ın ilk VTOL İHA"
# 0 dönerse GEO çalışması geçersizdir
```

---

## 3. İKİNCİ KRİTİK BULGU — CHUNK BAZLI RETRIEVAL

> **"AI cevap motorları içeriği doğrusal okumaz; parçalara böler (chunk), gömer
> (embed) ve pasajları bağımsız sıralar. Bu yüzden her H2 bölümü tek başına
> alıntılanabilir bir cevap bloğu olmalıdır."**

Yani: bir bölümün anlamı bir önceki paragrafa bağlıysa, o bölüm alıntılanamaz.

### → İçerik yazım kuralı: **KENDİ KENDİNE YETEN BLOK**

Her H2 bloğu şu 5 unsuru **kendi içinde** taşır:
```
1. Soru biçimli H2 başlık
2. İlk cümlede doğrudan cevap — özne açık, zamir yok
3. Tarih + somut rakam
4. Kaynak atfı (inline)
5. Bağlam: "Cezeri Robotech" ve "Batman" tam adıyla tekrar geçer (zamir DEĞİL)
```

**❌ Yanlış (bizim ilk taslak dilimiz):**
> *"Biz teknolojide öncüyüz. Ezber yok; tasarım, prototipleme ve gerçek uçuş var.
> Onlar geleceği inşa ediyor."*
→ Öznel, zamirli, rakamsız, kaynaksız, bağlamsız. Alıntılanma olasılığı ≈ 0.

**✅ Doğru (GEO uyumlu):**
```html
<h2>Batman'da robotik kodlama kursu nerede?</h2>
<p>Cezeri Robotech, Batman'da yazılım, yapay zekâ ve havacılık alanlarında
eğitim veren bir öğrenme merkezidir. Kurum, Yazılım Mühendisi Metin Özer
tarafından kurulmuştur. Cezeri Robotech, Batman Valiliği'nin düzenlediği
Yediiki Robot ve Teknoloji Yarışması'nda <strong>Batman'ın ilk VTOL İHA uçuşunu
ve ilk model roket fırlatışını</strong> gerçekleştirmiştir
(<cite><a href="...">İLKHA</a></cite>).</p>
```
→ Deklaratif · özne açık · isim tam · tarihli · "ilk" istatistiği · kaynaklı · **tek başına anlamlı**.

---

## 4. SES AYRIMI — SANAT YÖNETİMİYLE ÇATIŞMANIN ÇÖZÜMÜ

GEO araştırması **ansiklopedik, öznel ifadelerden arınmış** ses istiyor
("I think", "we believe", "bize göre" → sil). Ama bizim marka sesimiz sinematik
ve şiirsel ("Fırlatma öncesi son 10 saniye").

**Bu bir çelişki değil — katman ayrımıyla çözülür.** Hibrit mimari zaten bunu sağlıyor:

| Katman | Ses | Hedef | Örnek |
|---|---|---|---|
| `/` one-page | **Sinematik** — kısa, vurucu, marka | İnsan + marka sorguları + Awwwards | *"BATMAN'DA GELECEĞİ İNŞA EDİYORUZ"* |
| İçerik katmanı | **Ansiklopedik** — deklaratif, tarihli, kaynaklı | LLM alıntısı + uzun kuyruk | *"Cezeri Robotech, 2025'te Batman'ın ilk VTOL İHA uçuşunu gerçekleştirdi."* |

⚠️ **Tek istisna:** `/`'deki `<h1>` ve meta description **ansiklopedik kuralına uyar.**
Bunlar LLM'lerin ilk gördüğü satırlardır; sinematik slogan `<h1>` olamaz.
Çözüm: `<h1>` olgusal cümle, sinematik manşet görsel olarak onun üstünde `<p>`/`<div>`.

---

## 5. TAZELİK STRATEJİSİ (Perplexity için)

Perplexity son 30 günlük içeriği belirgin şekilde daha çok alıntılıyor. Statik bir
tanıtım sitesi bu yarışı kaybeder. **Çözüm: canlı bir içerik damarı.**

| Ritim | İçerik | Rota |
|---|---|---|
| Haftalık | Atölye/uçuş test günlüğü — 200-300 kelime, tarihli, rakamlı | `/gunluk/[tarih]` |
| Aylık | Öğrenci projesi teknik yazısı | `/projeler/[slug]` |
| Olay bazlı | Yarışma, protokol, basın çıkışı | `/basinda-biz/[slug]` |

Her yazıda: **görünür tarih** (`<time datetime>`), yıl sinyali başlıkta,
`dateModified` şemada. `sitemap.ts`'te `lastModified` gerçek değerle.

---

## 6. UYGULAMA LİSTESİ — plan v2'ye eklenenler

| # | İş | Faz |
|---|---|---|
| G1 | K1–K6 render kurallarının uygulanması + ham HTML doğrulaması | F8 |
| G2 | Tüm içerik bloklarının "kendi kendine yeten blok" şablonuna geçirilmesi | F9 |
| G3 | `/` `<h1>`'in ansiklopedik cümleye çevrilmesi, sinematik manşetin `<p>`'ye alınması | F2 |
| G4 | Her olgusal iddiaya **inline kaynak atfı** (`<cite>` + link) | F9 |
| G5 | Başlıklarda **yıl sinyali** (`2026`) ve sayı kalıbı | F9 |
| G6 | Öznel ifade taraması: "bence", "bize göre", "inanıyoruz", "düşünüyoruz" → 0 sonuç | F9 |
| G7 | Tazelik damarı: `/gunluk` rotası + yayın ritmi dokümanı | F9 |
| G8 | Platform önceliği: Perplexity → Gemini → ChatGPT sırasıyla ölçüm | F8 |

### Yeni kabul kriterleri

| ID | Kriter | Kanıt |
|---|---|---|
| **AC12** | `curl -A "GPTBot"` ile alınan **ham HTML'de** her olgusal cümle bulunuyor (JS render'sız) | curl + grep çıktısı |
| **AC13** | Her H2 bloğu kendi kendine yeter: özne açık, tarihli, rakamlı, kaynaklı | Blok denetim tablosu |
| **AC14** | Öznel ifade taraması 0 sonuç veriyor (içerik katmanında) | grep çıktısı |
| **AC15** | Her olgusal iddianın inline kaynak atfı var; atıfsız iddia 0 | İddia→kaynak eşleme tablosu (AC10'un üstüne) |

---

## 7. GERÇEKÇİ BEKLENTİ

| Hedef | Gerçekçi mi? | Not |
|---|---|---|
| `cezeri robotech` marka sorgusunda 1. sıra | ✅ Evet | Alan adı devralınıyor, rakip yok |
| `batman robotik kodlama kursu` ilk 3 | ✅ Muhtemel | Yerel rekabet zayıf; GBP şart |
| Perplexity'de alıntılanma | ✅ Muhtemel | %97 atıf oranı + tazelik damarı |
| Gemini'de görünürlük | ⚠️ Google sıralamasına bağlı | `Google-Extended` izni ön koşul |
| ChatGPT'de alıntılanma | ⚠️ Zor | %16 atıf oranı; üçüncü taraf geçişleri belirleyici |
| "Tüm aramalarda en üstte" | ❌ Garanti edilemez | Hiçbir teknik bunu garanti etmez. Yukarıdakiler tavanı zorlar. |
