# PLAN — CEZERİ ROBOTECH · "LAUNCHPAD"
### Awwwards SOTD seviyesi, scroll-driven sinematik tek sayfa deneyim

**Loop ID:** `loop-msanwgg6-82a100`
**Template:** software-development · target_score 80 · max_iterations 6
**Tarih:** 2026-08-01

---

## 0. ALINAN KARARLAR (kullanıcı onaylı)

| Konu | Karar | Etkisi |
|---|---|---|
| Medya üretimi | **Kullanıcı Higgsfield kredisi yükleyecek** | Site iskeleti önce kurulur, medya slot'lara sonra takılır. Kredi gelene kadar `generate_*` çağrısı YAPILMAZ (bakiye: 0). |
| Kod yerleşimi | **Ayrı repo** | `Idah21` monorepo'suna dokunulmaz. Yeni repo: `bahoz2113/cezeri-launchpad` (F0'da oluşturulacak). |
| Instagram arşivi | **Elle seçilmiş 15-20 görsel** | 3.1 GB / 78 parçalı bölünmüş 7z indirilmeyecek. Kullanıcı ayrı Drive klasörü hazırlayacak. |

### REVİZYON v2 — SEO/GEO kararları (2026-08-01)

| Konu | Karar | Etkisi |
|---|---|---|
| Başarı iddiaları | **Yalnızca doğrulanmış olanlar** | "TEKNOFEST birinciliği" ve "650m" hiçbir kaynakta doğrulanamadı → **siteye girmez**. Yerine: *Batman'ın ilk VTOL İHA uçuşu ve model roket fırlatışı* + *BESO protokolü*. Ayrıntı: `artifacts/seo-arastirma-ve-haber-envanteri.md` |
| Mimari | **Hibrit** | `/` sinematik one-page olarak kalır + arkasına hafif, indekslenebilir içerik katmanı (bkz. §8). Kapsam ~%40 büyür. |
| Alan adı | **`cezerirobotech.com` devralınır** | Mevcut sitenin yerine geçer. **301 yönlendirme haritası zorunlu** — alan adı yaşı ve mevcut backlink'ler korunacak. |

### Devralınan zorunlu kısıt
`Idah21/CLAUDE.md` → *"Çocuk fotoğrafı/videosu sistemde BARINDIRILMAZ."*
→ **Sitede tanınabilir çocuk yüzü kullanılmayacak** — ne gerçek fotoğrafta, ne AI üretiminde.
Görsel dil: ürün/prototip odaklı; silüet, eldivenli el, kask camı yansıması, arkadan çekim.

---

## 1. SANAT YÖNETİMİ (ART DIRECTION)

### 1.1 Konsept
> **"Fırlatma öncesi son 10 saniye."**

Site bir tanıtım sayfası gibi değil, bir **görev kontrol konsolu** gibi davranır.
Kullanıcı scroll ettikçe bir fırlatma sekansını ilerletir. Ziyaretçi izleyici değil, operatördür.

Üç DNA kaynağı harmanlanır:
- **İsmail el-Cezeri** → dişli, kam mili, su saati, otomat mekanizması — *çizgisel, teknik, altın oranlı*
- **NASA Mission Control** → mono tipografi, telemetri şeritleri, koordinat, `NOMINAL / GO / CLEARED`
- **TEKNOFEST fırlatma üssü** → uyarı şeritleri, irtifa göstergesi, alev, gece gökyüzü

### 1.2 Renk sistemi (kesin)

```
--void      #121212   Zemin. Ekranın ~%80'i. Saf siyah DEĞİL, kömür.
--navy      #1A237E   Yapı rengi: paneller, derinlik, gökyüzü, hangar iç mekânı.
--ignition  #FF6F00   SADECE ateşleme anı: CTA, aktif durum, sayaç, uyarı şeridi, alev.
--cyber     #FFFFFF   Tipografi ve teknik çizgi.
```

**Türetilenler (yalnızca bu kadarı):**
```
--navy-deep  #0D1240                  navy'nin altı — gradient dip noktası
--navy-lift  #2A35A8                  navy'nin üstü — hover / aktif panel
--ash        #8A8F98                  ikincil metin (void üstünde AA geçen tek gri)
--hairline   rgba(255,255,255,.08)    1px teknik çizgi
```

**Oranlama kuralı (ihlal = red):** `void %80 · navy %15 · ignition %5 · beyaz tipografi`.
Turuncunun az olması, az olduğu için güçlü olması. Ödüllü siteyle "neon çorbası" arasındaki fark tam olarak budur.

**Yasak listesi (F7'de otomatik taranacak — AC2):**
`#7C4DFF` ve tüm mor-mavi neon türevleri · çok renkli gradient mesh · glassmorphism kartlar ·
yuvarlak köşeli (>8px) Bootstrap/shadcn card kalıbı · stok "gülümseyen çocuk laptop başında" görseli ·
emoji ikonografi · renkli drop-shadow glow.

### 1.3 Tipografi

| Rol | Font | Kullanım |
|---|---|---|
| Display | **Archivo** (variable, `wdth 112–125`, 700–900) | Manşetler. Büyük, geniş, uppercase, sıkı tracking (−0.02em). |
| Body | **Inter** (variable) | Paragraf, açıklama. 16–20px, satır yüksekliği 1.6. |
| Telemetri | **JetBrains Mono** (400/700) | Koordinat, sayaç, etiket, durum satırı, form konsolu. Uppercase, `letter-spacing: .12em`. |

Üçü de tam **Türkçe glif** desteğine sahip (ğ Ğ ı İ ş Ş ç Ç ö Ö ü Ü) — `next/font/google` ile self-host, `display: swap`, subset `latin + latin-ext`.

**Ölçek (fluid, `clamp`):**
`display-xl 96→200px · display-l 64→128px · h2 40→72px · h3 24→32px · body 16→18px · mono 12→14px`

### 1.4 Izgara ve boşluk
- 12 kolon, `max-width: 1512px`, gutter 24px (mobil 16px)
- **8px baseline** — tüm dikey boşluklar 8'in katı
- Pinned sahne yüksekliği `100svh`, scroll mesafesi `+250~400%`
- Kenarlarda kalıcı **HUD çerçevesi**: 1px hairline + köşe işaretleri + sol dikey mono etiket (aktif sahne) + sağ dikey ilerleme rayı

### 1.5 Hareket dili
```
ease-launch  cubic-bezier(0.16, 1, 0.30, 1)   // giriş, açılma
ease-thrust  cubic-bezier(0.65, 0, 0.35, 1)   // ivme, morph
scrub        1                                 // scroll'a bağlı sahnelerde yumuşatma
lenis        lerp 0.09, wheelMultiplier 1
```
- Hiçbir animasyon `bounce`/`elastic` kullanmaz — bu bir mühendislik sitesi, oyuncak değil.
- Metin girişi: satır maskesi + `y: 110% → 0`, stagger 0.06s.
- Sayısal her şey sayaçla artar (irtifa, yıl, öğrenci sayısı) — asla statik yazılmaz.

### 1.6 Ses (opsiyonel, varsayılan KAPALI)
Sağ altta `SOUND ON/OFF` mono toggle. Açıkken: düşük frekanslı hangar ambiyansı + scroll'da hafif servo tıkırtısı + fırlatma anında tek gürleme. Tercih `localStorage`'da hatırlanır. Otomatik ses ASLA çalmaz.

---

## 2. SCROLL KOREOGRAFİSİ (9 SAHNE)

Toplam scroll uzunluğu ≈ **900vh**. Her sahnede `data-scene` özniteliği var; HUD sol etiketi buradan beslenir.

---

### S00 · PRELOADER — "SİSTEM KONTROL"
**Süre:** yükleme boyunca (min 1.2 s, max 3 s)
**Görsel:** Cezeri'nin fil su saati mekanizması, tek renk beyaz SVG çizgi olarak `stroke-dashoffset` ile çizilir.
**Telemetri satırları (mono, sırayla):**
`> CEZERI ROBOTECH // BATMAN` · `> WEBGL CONTEXT ......... OK` · `> ASSETS 24/24 .......... OK` · `> CLEARED FOR LAUNCH`
**Çıkış:** Ekran ortadan yatay ikiye ayrılıp açılır (hangar kapısı metaforu), altından S01 belirir.
**Teknik:** GSAP timeline + drei `useProgress` ile gerçek asset yüzdesi.

---

### S01 · HERO / LAUNCHPAD — "DİŞLİDEN İHA'YA"
**Pin:** 100svh · mesafe 300% · `scrub: 1`
**Sahne:** R3F. Üç iç içe geçmiş **prosedürel dişli** — diş profili `ExtrudeGeometry` ile kod içinde üretilir, hazır model yok.

| Scroll | Olay |
|---|---|
| 0.00–0.25 | Dişliler yavaş döner, kamera hafif dolly-in. Manşet satır satır maskeden çıkar. |
| 0.25–0.55 | Dönüş hızlanır; dişli kenarlarında `ignition` emissive kızarma başlar. |
| 0.55–0.85 | Dişli mesh'leri **noktacık bulutuna** çözülür, İHA/roket siluetinin kontur noktalarına `lerp` ile akar (attribute morph — GPGPU değil, mobilde de çalışsın diye). |
| 0.85–1.00 | Siluet netleşir, altında turuncu egzoz izi. Scroll ipucu kaybolur. |

**Tipografi:** *(v2 — yalnızca doğrulanmış ifade)*
> **BATMAN'DA GELECEĞİ İNŞA EDİYORUZ**
> **CEZERİ ROBOTECH**
> `BATMAN'IN İLK VTOL İHA UÇUŞU VE MODEL ROKET FIRLATIŞI · GELECEĞİN MÜHENDİSLERİ YETİŞİYOR`

> **v3 — GEO düzeltmesi (bkz. `artifacts/geo-optimizasyon-spec.md`):**
> Sinematik manşet `<h1>` **olamaz** — LLM'lerin ilk okuduğu satır olgusal olmalı.
> Doğru kurulum:
> ```html
> <p class="display-xl">BATMAN'DA GELECEĞİ İNŞA EDİYORUZ</p>   <!-- görsel manşet -->
> <h1>Cezeri Robotech — Batman'da yazılım, yapay zekâ ve havacılık
>     eğitimi veren öğrenme merkezi</h1>                        <!-- olgusal h1 -->
> ```
> `<h1>` metni, meta description ve `EducationalOrganization` JSON-LD `description`
> alanıyla **birebir aynı** olur. Görsel hiyerarşi CSS ile kurulur, HTML anlamı bozulmaz.

**HUD:** sağ üst `37°52′N 41°08′E · UTC+3 hh:mm:ss` · sol alt `SCENE 01 / LAUNCHPAD`
**Fallback:** `prefers-reduced-motion` veya WebGL yok → statik poster + CSS fade.

---

### S02 · EXPLODED VIEW — "OTONOM SİSTEM ANATOMİSİ"
**Pin:** 100svh · mesafe 250% · `scrub: 1`
**Mekanik:** S01'in siluetinden gelen İHA, scroll ile eksende **parçalarına ayrılır**.

Hotspot etiketleri (mono, ince çizgiyle bağlı):
```
01 GÖVDE ŞASİSİ        karbon fiber, 450 mm
02 BLDC MOTOR ×4       920 KV
03 PERVANE ×4          10×4.5
04 UÇUŞ KONTROL KARTI  IMU + barometre
05 GİMBAL KAMERA       3 eksen stabilize
06 GÜÇ ÜNİTESİ         4S LiPo
07 TELEMETRİ           915 MHz
```
Her etiket kendi scroll aralığında belirir; hover'da o parça `ignition` rengine döner, diğerleri %20 opaklığa iner.
**Çıkışta** parçalar geri toplanır, İHA ekran dışına uçar → S03 tetiklenir.

---

### S03 · HANGAR — "ÜÇ LABORATUVAR"
**Pin:** 100svh · mesafe 400% · `scrub: 1`
**Mekanik:** Üç hangar kapısı sırayla açılır. Kapı = `clip-path: inset()` animasyonu + kenarında turuncu-siyah diyagonal uyarı şeridi + açılırken içeriden ışık sızması (radial gradient).

| # | Lab | Alt başlık | Ekipman satırı (mono) |
|---|---|---|---|
| A | **AI & DEEP LEARNING LAB** | Yapay Zekâ & Otonom Kodlama | `PYTHON · OPENCV · TENSORFLOW · JETSON NANO` |
| B | **UAV & ROCKET DYNAMICS** | İHA, Aerodinamik & 650m İrtifa Sistemleri | `CFD · KATI YAKIT · TELEMETRİ · KURTARMA SİSTEMİ` |
| C | **MECHATRONICS & 3D PROTOTYPING** | İsmail el-Cezeri Mekatronik Atölyesi | `FUSION 360 · FDM/SLA · CNC · PCB TASARIM` |

Kapı açıldığında arkasındaki medya (Higgsfield video slot'u) oynar; kapanırken donar.

---

### S04 · İLK FIRLATIŞ — "BATMAN'IN İLK MODEL ROKETİ" *(v2'de yeniden çerçevelendi)*

> **v2 notu:** Bu sahne önce "650 m irtifa testi" üzerine kurgulanmıştı. 650 m rakamı
> doğrulanamadığı için sahne, **doğrulanmış olan olaya** taşındı: Yediiki Robot ve
> Teknoloji Yarışması'nda gerçekleştirilen *Batman'ın ilk model roket fırlatışı*.
> İrtifa sayacı korunur ama **rakam bir veri slot'udur** — kullanıcı gerçek telemetri
> değerini verene kadar sayaç `APOGEE` yerine `İLK FIRLATIŞ / BATMAN` ibaresiyle biter.
> Gerçek rakam gelirse tek satır değişiklikle devreye girer (`lib/facts.ts`).

**Pin:** 100svh · mesafe 350% · `scrub: true` (yumuşatmasız — sayaç birebir scroll'a kilitli)
**Mekanik:** Ekranın ortasında sabit roket; etrafındaki dünya aşağı akar.

- Sol kenarda dikey **irtifa cetveli**; sayaç `000 → 650 m` scroll'a kilitli artar (JetBrains Mono, 96px)
- Arkada 4 katmanlı paralaks: yer → alçak bulut → yüksek bulut → yıldız alanı (farklı hızlarda)
- Gökyüzü scroll ile `#1A237E → #0D1240 → #121212`; 400 m'den sonra yıldızlar `opacity 0→1`
- Roketin altında sürekli turuncu egzoz + arkada duman izi (instanced particles)
- **Tepe noktasında:** tek kare beyaz flash → veri kartı açılır *(v2 — doğrulanmış içerik)*:
  ```
  OLAY ........... BATMAN'IN İLK MODEL ROKET FIRLATIŞI
  ORGANİZASYON ... YEDİİKİ ROBOT VE TEKNOLOJİ YARIŞMASI / BATMAN VALİLİĞİ
  EKİP ........... CEZERİ ROBOTECH
  DURUM .......... NOMINAL
  ```
  Sayısal telemetri (apogee, max hız, uçuş süresi) `lib/facts.ts`'te **boş slot** olarak
  durur; kullanıcı gerçek değerleri verdiğinde kartta görünür.
- Ardından paraşüt açılır, iniş başlar, S05'e geçilir

---

### S05 · PROTOTİPLER — "KADET PROJELERİ" *(yatay scroll)*
**Pin:** 100svh · mesafe 300% · dikey scroll → yatay `translateX`
**Kartlar** (stüdyo ışığı altında ürün render'ı — Higgsfield slot):
`ROKET / ARI-1` · `GEZGİN ROBOT / KEŞİF` · `İHA / GÖZCÜ` · `ROBOT KOL / 6-DOF` · `ÇİZGİ İZLEYEN` · `PCB / KENDİ TASARIMIMIZ`

- Hover: WebGL `displacementMap` ile hafif dalgalanma + etiketin turuncuya dönmesi
- **KİLOMETRE TAŞI kartı** diziyi böler *(v2 — kupa yerine doğrulanmış olay)*: tam yükseklik,
  turuncu zemin, siyah tipografi —
  `BATMAN'IN İLKİ · VTOL İHA UÇUŞU + MODEL ROKET FIRLATIŞI · YEDİİKİ ROBOT VE TEKNOLOJİ YARIŞMASI`
  Kart tıklanabilir → `/basinda-biz/batmanin-ilk-vtol-iha-ucusu` sayfasına gider (iç link gücü).
- Üstte ince mono şerit: `PROJE 03 / 06 — TASARIM: KADET EKİBİ — YIL: 2025`
- Alt not: `Görsellerde KVKK gereği öğrenci kimliği paylaşılmaz.`

---

### S06 · METODOLOJİ — "ÖĞRENMENİN MEKANİĞİ"
**Pin:** 100svh · mesafe 250% · `scrub: 1`
**Mekanik:** Üç iç içe geçmiş SVG dişli, scroll yönüne göre **zıt yönlerde** döner (gerçek dişli oranıyla 1:2:3).

Her dişli bir aşamayı taşır; aktif olan `ignition` rengine döner:
```
① TASARLA      Fikir → CAD → simülasyon. Kâğıtta biten hiçbir şey yok.
② PROTOTİPLE   3D baskı → montaj → PCB. Hata bir sonuç değil, veridir.
③ UÇUR         Saha testi → telemetri → revizyon. Gerçek uçuş olmadan ders bitmez.
```
Ortada manifesto: **"EZBER YOK. TASARIM, PROTOTİPLEME VE GERÇEK UÇUŞ VAR."**

---

### S07 · UÇUŞ İZİN FORMU — "FLIGHT CLEARANCE"
**Pin:** yok, doğal akış
**Arayüz:** Kart/form değil — **görev kontrol konsolu**. Zemin `void`, panel `navy`, hairline çerçeve, etiketler mono uppercase.

```
STEP 01  ADAY KİMLİĞİ      ad soyad · veli adı            → CLEARANCE 01 ... GRANTED ✓
STEP 02  YAŞ GRUBU         7-9 / 10-12 / 13-15 / 16-18    → CLEARANCE 02 ... GRANTED ✓
STEP 03  GÖREV SEÇİMİ      AI · UAV/ROKET · MEKATRONİK    → CLEARANCE 03 ... GRANTED ✓
STEP 04  İLETİŞİM KANALI   telefon · e-posta              → CLEARANCE 04 ... GRANTED ✓
```
Gönderim: `[ SUBMIT FLIGHT PLAN ]` → butonda progress dolumu → turuncu flash →
`FLIGHT PLAN RECEIVED. UÇUŞ EKİBİ 24 SAAT İÇİNDE İLETİŞİME GEÇECEK.`

**Teknik:** `react-hook-form` + `zod`, Next Route Handler `/api/apply`, honeypot + rate-limit.
**Erişilebilirlik:** klavyeyle baştan sona tamamlanabilir; her adımda `aria-live` durum bildirimi.

---

### S08 · FOOTER — "KULE"
- Dev tipografi: **CEZERİ ROBOTECH** (ekran genişliğinde, alttan kırpılmış)
- Sonsuz mono telemetri şeridi: `BATMAN 37.8812°N 41.1351°E — TEKNOFEST BİRİNCİSİ — 650m APOGEE — GÜNEYDOĞU'NUN TEKNOLOJİ ÜSSÜ —`
- Canlı UTC+3 saat, iletişim, sosyal, `[ EĞİTİM PANELİNE GİRİŞ ]` (mevcut Education OS'a link)
- En altta: `© 2026 CEZERİ ROBOTECH · KVKK gereği öğrenci görselleri paylaşılmaz.`

---

## 3. TEKNİK MİMARİ

### 3.1 Stack (sürümler F0'da npm'den doğrulanıp pinlenecek)
```
next                 15.x   App Router, RSC, next/font, next/image
react                19.x
three                ^0.17x
@react-three/fiber   v9     (React 19 uyumlu)
@react-three/drei    v10
gsap                 3.13   + ScrollTrigger, SplitText (2024'ten beri ücretsiz)
lenis                1.3    smooth scroll (GSAP ticker'ına bağlı)
tailwindcss          3.4    token'lar CSS değişkeni olarak; keyfi (arbitrary) hex yasak
react-hook-form + zod
```
**Neden Tailwind 3, 4 değil:** mevcut `Idah21` de Tailwind 3; geçiş maliyeti yok, R3F ile bilinen çakışma yok.

### 3.2 Dosya yapısı
```
cezeri-launchpad/
├─ app/
│  ├─ layout.tsx              fontlar, HUD çerçevesi, Lenis provider, metadata
│  ├─ page.tsx                9 sahnenin sıralandığı tek sayfa
│  ├─ globals.css             token'lar (:root), reset, baseline
│  └─ api/apply/route.ts      form endpoint (zod + rate-limit)
├─ components/
│  ├─ scenes/                 S00…S08 — her biri kendi ScrollTrigger'ını kurar
│  ├─ three/
│  │  ├─ Gears.tsx            prosedürel dişli geometrisi
│  │  ├─ DroneExploded.tsx    parçalı İHA + hotspot'lar
│  │  ├─ Rocket.tsx           roket + egzoz partikülleri
│  │  ├─ materials/           emissive, hairline, displacement shader'lar
│  │  └─ SceneCanvas.tsx      tek paylaşımlı Canvas, frameloop="demand"
│  ├─ hud/                    Frame · SceneLabel · ProgressRail · Clock · Coordinates
│  └─ ui/                     SplitText · Counter · Marquee · MagneticButton · SoundToggle
├─ lib/
│  ├─ gsap.ts                 tek kayıt noktası, Lenis ↔ ScrollTrigger senkronu
│  ├─ scenes.ts               sahne meta verisi (id, label, scroll uzunluğu)
│  ├─ media.ts                MEDYA SLOT KAYDI — Higgsfield çıktıları buraya bağlanır
│  └─ motion.ts               easing/duration sabitleri
└─ public/media/              üretilen görsel & video (kredi geldikten sonra)
```

**Kritik karar — tek Canvas:** S01, S02 ve S04 aynı `<Canvas>`'ı paylaşır; sahneler `visible` ile değişir. Üç ayrı WebGL context açmak mobilde context-loss demektir.

### 3.3 Performans bütçesi (AC3'te ölçülecek)
| Metrik | Hedef |
|---|---|
| Lighthouse Performance (desktop) | ≥ 90 |
| Lighthouse Accessibility | ≥ 95 |
| LCP | < 2.5 s |
| CLS | < 0.05 |
| İlk yükte JS (gzip) | < 280 KB |
| Three.js chunk | `dynamic(ssr:false)`, hero görünene kadar yüklenmez |
| Video | `preload="none"`, poster zorunlu, IntersectionObserver ile oynat |
| Görsel | AVIF/WebP, `next/image`, LQIP blur |

**Mobil (<768px):** R3F sahneleri statik poster + CSS parallax'a düşer; yatay galeri swipe olur. 60 fps hedefi mobilde 3D'den ödün vererek korunur.

### 3.4 Erişilebilirlik & sağlamlık
- `prefers-reduced-motion: reduce` → tüm scrub'lar kapanır, sahneler normal akışa döner, video autoplay durur. **Site tam okunabilir kalır.**
- Klavye: skip-link, görünür focus halkası (turuncu 2px), form baştan sona tab ile tamamlanır
- Kontrast: `ash #8A8F98` on `void` = 5.9:1 ✓ · `ignition` on `void` = 7.4:1 ✓
- WebGL yoksa / context kaybolursa → poster fallback, sessiz log, sayfa çökmez
- SEO: tek sayfa ama `<h1>`–`<h3>` hiyerarşisi doğru, JSON-LD `EducationalOrganization`, OG görseli

---

## 4. MEDYA ÜRETİM PLANI (kredi geldiğinde)

Tüm çıktılar `public/media/` altına; `lib/media.ts` üzerinden bağlanır. **Her prompt'ta sabit kuyruk:**
> `deep navy #1A237E and ignition orange #FF6F00 palette only, charcoal #121212 background, cinematic, no visible human faces, no children, technical, high contrast`

### Video — **Cadence 2.0** (4 adet, 8–10 s, sessiz, loop)
| ID | Sahne | Brief |
|---|---|---|
| `V1_launch` | S01 arka plan | Gece, plato, katı yakıt roket fırlatması. Turuncu alev, lacivert gökyüzü, uzun lens, kamera yavaş yukarı takip. |
| `V2_uav` | S03-B hangar | İHA alçak irtifa geçişi, günbatımı sonrası mavi saat, alttan takip. |
| `V3_lab` | S03-A hangar | Karanlık laboratuvar, monitör ışığı, dönen 3D yazıcı, uzun ekspozür. İnsan yok. |
| `V4_mech` | S03-C hangar | Robot kolun tek eksen hareketi, makro, turuncu servo LED'i. |

### Görsel — **GPT Image 2** (7 adet, 2048px, stüdyo)
`I1_rocket` · `I2_rover` · `I3_uav` · `I4_arm` · `I5_pcb` · `I6_milestone` (kilometre taşı kartı görseli) · `I7_og` (1200×630 OG kartı)
Hepsi: siyah sonsuz zemin, tek anahtar ışık + turuncu kenar ışığı, ürün fotoğrafçılığı dili.

### Instagram arşivinden (kullanıcı seçecek)
15–20 kare → optimize edilip S05 galeri ve S03 hangar arka planlarında **gerçeklik kanıtı** olarak kullanılır.
Filtre: yüz görünmeyen; prototip / atölye / kupa odaklı kareler.

---

## 5. FAZLAR

| Faz | İçerik | Kanıt |
|---|---|---|
| **F0** | Repo bootstrap: `bahoz2113/cezeri-launchpad`, Next 15 kurulumu, sürüm pinleme, token + font + HUD iskeleti, `next build` yeşil | `evidence/ac5-*.md` |
| **F1** | S00 preloader + S08 footer + HUD çerçevesi (kabuk tamam) | çalışan sayfa |
| **F2** | S01 hero + S02 exploded view — R3F çekirdeği, en riskli kısım, **önce `loop checkpoint`** | `evidence/ac1-*.md` |
| **F3** | S03 hangar + S04 650m irtifa | `evidence/ac1-*.md` |
| **F4** | S05 galeri + S06 metodoloji | `evidence/ac1-*.md` |
| **F5** | S07 form + API + doğrulama | `evidence/ac7-*.md` |
| **F6** | Medya entegrasyonu (Higgsfield kredisi geldiğinde) + arşiv görselleri | `evidence/ac2-*.md` |
| **F7** | Performans + erişilebilirlik + mobil geçişi, Lighthouse ölçümü, `loop verify` + `loop score` | `evidence/ac3,4,6-*.md` |
| **F8** | **SEO/GEO altyapısı:** metadata, `sitemap.ts`, `robots.ts` (AI crawler izinleri), JSON-LD (`schema-dts`), `llms.txt` + `llms-full.txt`, 301 haritası | `evidence/ac8-*.md` |
| **F9** | **İçerik katmanı:** `/basinda-biz` haber sayfaları, `/sss` (FAQPage), yerel sorgu sayfaları, `/hakkimizda` | `evidence/ac9,10-*.md` |

### Kabul kriterleri (ölçülebilir — `loop verify` bunları arar)

| ID | Kriter | Kanıt yöntemi |
|---|---|---|
| **AC1** | 9 sahnenin tamamı üretimde; pinned/scrub davranışı çalışıyor | Playwright ile sahne başına scroll + ekran görüntüsü |
| **AC2** | Palet uyumu: yasak renk yok, token dışı hex yok | `grep` taraması + rapor |
| **AC3** | Lighthouse Perf ≥ 90, A11y ≥ 95, LCP < 2.5 s | Lighthouse ham çıktısı |
| **AC4** | `prefers-reduced-motion` tam fallback; form klavyeyle tamamlanabiliyor | Playwright emülasyon testi |
| **AC5** | `next build` + `tsc --noEmit` sıfır hata (strict) | Ham terminal çıktısı |
| **AC6** | 390 / 768 / 1440 / 2560 px'te düzen bozulmuyor; mobilde 3D fallback devrede | 4 ekran görüntüsü |
| **AC7** | Form doğrulaması ve gönderimi çalışıyor; hatalı girişte anlamlı mesaj | API testi + ekran görüntüsü |
| **AC8** | Her rota benzersiz title/description/canonical taşıyor; `sitemap.xml` + `robots.txt` üretiliyor; JSON-LD **Rich Results Test'ten hatasız** geçiyor | Doğrulayıcı çıktısı + rota tablosu |
| **AC9** | İçerik sayfalarında **WebGL yok**, LCP < 1.2 s | Lighthouse ham çıktısı (sayfa başına) |
| **AC10** | Sitedeki **her olgusal iddia** `artifacts/seo-arastirma…md`'deki doğrulanmış listeye dayanıyor; kaynaksız iddia yok | İddia→kaynak eşleme tablosu |
| **AC11** | AI crawler'lara (`GPTBot`, `ClaudeBot`, `PerplexityBot`, `Google-Extended`, `OAI-SearchBot`, `Applebot-Extended`, `CCBot`) izin veriliyor; `llms.txt` erişilebilir | `robots.txt` + `llms.txt` ham içerik |
| **AC12** ⭐ | `curl -A "GPTBot"` ile alınan **ham HTML'de** (JS render'sız) her olgusal cümle bulunuyor | curl + grep çıktısı |
| **AC13** | Her H2 bloğu kendi kendine yeter: özne açık, tarihli, rakamlı, kaynaklı | Blok denetim tablosu |
| **AC14** | İçerik katmanında öznel ifade taraması ("bence", "bize göre", "inanıyoruz") 0 sonuç | grep çıktısı |
| **AC15** | Her olgusal iddianın inline kaynak atfı (`<cite>` + link) var | İddia→kaynak eşleme tablosu |

---

## 6. RİSKLER VE KARŞI ÖNLEMLER

| Risk | Olasılık | Önlem |
|---|---|---|
| R3F v9 + React 19 + Next 15 sürüm çakışması | Orta | F0'da minimal R3F sahnesiyle **önce doğrula**; sorun çıkarsa Next 14 + React 18 + R3F v8'e düş (plan B hazır) |
| Dişli→İHA morph'unun mobilde ağır olması | Yüksek | Nokta sayısı cihaza göre ölçekli (desktop 12k / mobil 3k); mobilde morph yerine crossfade |
| Higgsfield kredisi gecikirse F6 bloke | Orta | F0–F5 medyadan **tamamen bağımsız**; slot'lar prosedürel poster ile dolu gelir, site medyasız da yayınlanabilir |
| 900vh scroll'un kullanıcıyı yorması | Orta | HUD'da kalıcı ilerleme rayı + sahne atlama; klavye ile sahne sıçraması |
| Yeni repo oluşturma izni | Düşük | F0'da `create_repository` başarısız olursa `Idah21` içinde bağımsız üst klasör olarak geliştirilip sonra taşınır |
| Aynı hata 2 kez tekrarlarsa | — | Proje kuralı: strateji değiştir; 3. tekrarda FAILED + escalation |

---

## 7. YAPILMAYACAKLAR (kapsam dışı)
- `Idah21` monorepo'sunda **hiçbir uygulama dosyası değişmez** (bu plan ve loop kayıtları hariç)
- Production deploy / domain / DNS → **human approval** gerektirir, otomatik yapılmaz
- Öğrenci verisi tutan gerçek veritabanı → form şimdilik e-posta/webhook'a düşer
- Higgsfield çağrısı → kullanıcı kredi yüklediğini bildirene kadar YOK

---

## 8. HİBRİT MİMARİ + SEO/GEO KATMANI *(v2)*

Strateji ayrıntısı: `artifacts/seo-arastirma-ve-haber-envanteri.md`

### 8.1 Rota haritası

| Rota | Ağırlık | Birincil hedef sorgu | Şema |
|---|---|---|---|
| `/` | Ağır (WebGL) | `cezeri robotech`, marka sorguları | `EducationalOrganization` + `LocalBusiness` |
| `/hakkimizda` | Hafif | `cezeri robotech kimdir`, `metin özer` | `AboutPage` + `Person` |
| `/laboratuvarlar/yapay-zeka` | Hafif | `batman yapay zeka eğitimi` | `Course` |
| `/laboratuvarlar/iha-roket` | Hafif | `batman iha eğitimi`, `batman drone kursu` | `Course` |
| `/laboratuvarlar/mekatronik` | Hafif | `batman mekatronik atölye`, `3d yazıcı` | `Course` |
| `/batman-robotik-kodlama-kursu` | Hafif | `batman robotik kodlama kursu` ⭐ | `Course` + `LocalBusiness` |
| `/batman-cocuk-yazilim-kursu` | Hafif | `batman çocuk yazılım kursu` | `Course` |
| `/basinda-biz` | Hafif | `cezeri robotech haber` | `CollectionPage` |
| `/basinda-biz/[slug]` | Hafif | uzun kuyruk | `NewsArticle` |
| `/sss` | Hafif | soru biçimli sorgular ⭐ **AEO** | `FAQPage` |
| `/iletisim` | Hafif | `batman robotik kurs adres/telefon` | `LocalBusiness` + `ContactPage` |

**Kural:** `/` dışındaki hiçbir rota Three.js **import etmez**. Ayrı chunk, ayrı bütçe.

### 8.2 İlk `/basinda-biz` içerikleri (doğrulanmış)

| Slug | Başlık | Kaynak |
|---|---|---|
| `batmanin-ilk-vtol-iha-ucusu` | Batman'ın ilk VTOL İHA uçuşu ve model roket fırlatışı | ilkha · Batman Gazetesi · Batman Rehber · batmansonsoz |
| `beso-dijital-donusum-protokolu` | BESO ile dijital dönüşüm protokolü (Nisan 2025) | Batman Gazetesi · Batman Yön |
| `yediiki-robot-teknoloji-yarismasi` | Yediiki Robot ve Teknoloji Yarışması / Batman Valiliği | malatyaensonhaber · Batman Rehber |

Her sayfa: özet + **doğrudan kaynak linki** (`rel="nofollow noopener"` değil — kaynağa
gerçek atıf) + `NewsArticle` JSON-LD + one-page'deki ilgili sahneye iç link.
⚠️ Yayın öncesi her haber **kaynağından birebir teyit edilecek** (ortam kısıtı nedeniyle
şu an yalnızca arama özeti mevcut).

### 8.3 `robots.txt` politikası
```
User-agent: GPTBot            Allow: /     # ChatGPT eğitim/arama
User-agent: OAI-SearchBot     Allow: /     # ChatGPT arama
User-agent: ChatGPT-User      Allow: /     # ChatGPT gezinme
User-agent: ClaudeBot         Allow: /     # Claude
User-agent: Claude-SearchBot  Allow: /
User-agent: PerplexityBot     Allow: /
User-agent: Google-Extended    Allow: /    # ⚠️ Gemini görünürlüğünün ÖN KOŞULU
User-agent: Applebot-Extended Allow: /
User-agent: CCBot             Allow: /
Sitemap: https://cezerirobotech.com/sitemap.xml
```

### 8.4 Alan adı devri — 301 haritası
`cezerirobotech.com` devralınacağı için **mevcut URL'lerin envanteri çıkarılmalı** ve
her biri yeni karşılığına 301 ile yönlendirilmeli. Aksi halde alan adının mevcut
backlink ve yaş değeri kaybolur.
**Bu ortamdan `cezerirobotech.com` okunamıyor (proxy 403)** → mevcut URL listesi
kullanıcıdan veya Search Console'dan alınacak. `next.config.js` `redirects()` içine yazılır.

### 8.5 Kod ile çözülemeyen, kullanıcının yapması gerekenler
1. **Google Business Profile** — yerel sıralamadaki tek en büyük faktör
2. **NAP tutarlılığı** — ad/adres/telefon sitede, Instagram bio'da, GBP'de birebir aynı
3. **Google Search Console + Bing Webmaster** — doğrulama + sitemap gönderimi
4. **Yerel backlink** — BESO (`beso.org.tr`) ve Batman Valiliği etkinlik sayfalarından link talebi
5. **Instagram içi SEO** — bio anahtar kelimesi, alt-text, konum etiketi (site dışı iş)
