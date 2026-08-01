# KANIT — F7 · Gerçek tarayıcı doğrulaması

**Loop:** `loop-msanwgg6-82a100` · **Tarih:** 2026-08-01
**Araç:** Playwright 1.62.1 + Chromium 1194 (headless)
**status: pass — 13/13**

---

## Ham çıktı

```
PASS  AC6 mobil-390 yatay taşma yok
PASS  AC6 tablet-768 yatay taşma yok
PASS  AC6 masaustu-1440 yatay taşma yok
PASS  AC6 genis-2560 yatay taşma yok
PASS  AC1 toplam scroll uzunluğu > 8 viewport            27.0 viewport katı
PASS  AC1 S04 tırmanış sayacı scroll'a tepki veriyor      000 → 046
PASS  AC1 S05 yatay ray scroll'a tepki veriyor            matrix(…,0,0) → matrix(…,-731.96,0)
PASS  AC1 WebGL canvas oluştu                             1 canvas
PASS  AC4 reduced-motion: h1 okunabilir                   "Cezeri Robotech, Batman'da yazılım…"
PASS  AC4 reduced-motion: satırlar taşınmamış             0 taşınmış span
PASS  AC4 klavye ile form doldurulabiliyor                4 clearance GRANTED
PASS  AC4 odak halkası görünür                            rgb(255, 111, 0)
PASS  AC13 /sss soru biçimli H2 sayısı                    6 / 6

13/13 geçti
```

**Kritik olan:** AC1 satırları scroll'un gerçekten *sürdüğünü* kanıtlıyor —
statik bir sayfa değil. Tırmanış sayacı `000→046` değişti, yatay ray 732 piksel
kaydı, WebGL context oluştu.

---

## Testin ortaya çıkardığı gerçek kusurlar (düzeltildi)

### 1. Klavye odağı görünmüyordu — erişilebilirlik hatası
Yaş grubu ve görev seçimindeki radio girdileri `sr-only`. Bu doğru ve erişilebilir
bir kalıp (klavye ve ekran okuyucu çalışır) **ama** odak halkası 1px'lik gizli
girdiye çiziliyordu; klavyeyle gezen kullanıcı hangi seçenekte olduğunu göremiyordu.
→ Etikete `has-[:focus-visible]:outline` eklendi. Doğrulandı: `rgb(255,111,0)`.

### 2. Manşet kadraj dışına taşıyordu — masaüstü
`t-display-xl` tavanı 12.5rem idi; 1440×900'de 4 satırlık manşetin ilk satırı
ekranın üstünden taşıyordu. Ekran görüntüsüyle görüldü.
→ Tavan 7.25rem'e, vw katsayısı 6.4'e çekildi.

### 3. Dişliler kendi renk kuralımızı ihlal ediyordu
Turuncu nokta ışık `intensity 9` + `emissive 0.12` ile dişliler kahverengiye
dönüyor ve kadrajın yarısını kaplıyordu — planın "ignition %5" kuralının açık ihlali.
→ Turuncu ışık 2.4'e, emissive 0.02'ye indirildi; dişliler sağa kaydırılıp
kamera 13 birime çekildi; canvas opaklığı %70 → %45.

### 4. Türkçe `İ` noktası maske tarafından kırpılabiliyordu
`.line-mask` `overflow: hidden` + `line-height: 0.9` birleşimi, üst işaretli
büyük harflerde (İ, Ğ, Ş) noktayı kesme riski taşıyordu.
→ `padding-top: 0.1em` + eşit negatif `margin-top` eklendi: baş boşluğu açıldı,
düzen değişmedi.

### 5. Kilometre taşı kartında metin taşıyordu
`t-display-l` 30rem'lik kart için fazla büyüktü.
→ Karta özel sabit ölçek verildi.

---

## Ekran görüntüleri
`scratchpad/shots/` altında: 4 kırılımda hero + masaüstünde S03/S04/S05/S07 +
`reduced-motion.png` + `form-klavye.png` + `sss.png` (tam sayfa).

Görsel inceleme sonucu: hero'da tipografi oturdu, dişliler arka planda kaldı,
turuncu yalnızca vurguda; hangar sahnesinde uyarı şeridi, ekipman etiketleri ve
CTA doğru; galeride kilometre taşı kartı diziyi turuncu zeminle bölüyor.

---

## Not — test altyapısı proje bağımlılığı DEĞİL
Playwright, `cezeri-launchpad`'in `package.json`'ına eklenmedi; scratchpad'e
kuruldu. Proje bağımlılık listesi yalnızca çalışma zamanında gereken paketleri
içerir.

Bu tur sırasında `pnpm add` kök dizinde çalıştırılarak `Idah21/package.json`
yanlışlıkla değiştirildi; `git checkout` ile geri alındı ve doğrulandı.

---

## Kalan
**AC3 (Lighthouse Perf ≥90 / A11y ≥95, LCP <2.5s)** — bu ortamda Lighthouse
çalıştırılamadı; gerçek dağıtım sonrası ölçülecek. Yapısal ön koşullar hazır:
tüm rotalar statik, three.js ayrı chunk'ta ve içerik katmanına hiç inmiyor.
