# DURAĞAN GÖRSEL ŞARTNAMESİ — CEZERİ ROBOTECH "LAUNCHPAD"
### Nano Banana (Gemini 2.5 Flash Image) ile üretim

**Loop:** `loop-msanwgg6-82a100` · **Tarih:** 2026-08-01
**Üretim aracı:** Nano Banana (kullanıcı üretecek) · **Higgsfield bağımlılığı tamamen kalktı**

---

## 0. EN ÖNEMLİ ŞEY — REFERANS ZİNCİRİ İŞ AKIŞI

Nano Banana'nın diğer modellerden en büyük farkı: **referans görsel verip tutarlılık
koruyabilmesi.** Bunu kullanmazsak 6 ürün kartı 6 farklı stüdyodan çekilmiş gibi görünür
ve galeri dağılır. Kullanırsak tek bir çekim gününden çıkmış gibi olur.

### Sıralama — buna harfiyen uy

**ADIM 1 — Master görseli üret.** `G1 (roket)` prompt'unu çalıştır. Işık, arka plan
ve kadraj beğenene kadar tekrar et. **Bu görsel tüm serinin anayasasıdır** — acele etme.

**ADIM 2 — Kalan 5 ürünü master'a bağla.** G2–G6 için master'ı **referans görsel olarak
ekle** ve prompt'un başına şunu yapıştır:

```
Using the attached reference image as the exact visual standard: match its
seamless pure black background, its single hard key light from the upper left,
its ignition-orange rim light from the lower right, its camera height, its lens
compression, its shallow depth of field, and its film grain — precisely.

Change ONLY the subject. The new subject is:
```
…ve devamına o ürünün tarifini yaz.

**ADIM 3 — Ortam görselleri ayrı seri.** L1–L3 farklı bir görsel dil (mekân, geniş açı).
Kendi içlerinde tutarlı olmaları yeterli — L1'i master yapıp L2, L3'ü ona bağla.

> **Not:** Nano Banana konuşarak düzeltmeye çok iyi cevap veriyor. Görsel %80 doğruysa
> baştan üretme — *"arka planı tamamen siyah yap, sağ alttaki turuncu ışığı güçlendir,
> gövdedeki yazıyı kaldır"* de. Genelde tek turda düzeliyor.

---

## 1. HERKESE UYAN 6 KURAL

| # | Kural | Neden |
|---|---|---|
| **1** | **İnsan yok, yüz yok, el yok** | `CLAUDE.md` KVKK kuralı |
| **2** | **Yazı yok, logo yok, marka yok, rakam yok** | Model uydurma yazı basar; gövdede sahte marka istemiyoruz |
| **3** | **Palet:** kömür `#121212` + lacivert `#1A237E` + turuncu `#FF6F00` | Mor/magenta/turkuaz **yasak** |
| **4** | **Turuncu yalnızca ışık** — LED, kenar ışığı, alev | Boya olarak değil. Turuncu az olacak ki güçlü olsun |
| **5** | **Amatör/öğrenci yapımı görünsün** | Cilalı endüstriyel ürün değil: görünür vida, 3D baskı katman izi, kablo bandı, çizik. **Gerçeklik, mükemmellikten değerli.** |
| **6** | **En yüksek çözünürlük** | Nano Banana ~1K veriyor; ben upscale edeceğim, sen en büyüğünü ver |

---

# BÖLÜM A — PROTOTİP GALERİSİ (6 görsel)
### Sahne S05 · yatay scroll galeri kartları

**En-boy:** 3:4 dikey · **Hedef:** 1200×1600 · **Arka plan:** kesintisiz saf siyah

---

## 🖼 G1 — `g1-rocket` · MASTER GÖRSEL ⭐
> **Bu görseli önce ve en iyi haliyle üret. Diğer 5'i buna bağlayacaksın.**

```
Studio product photograph of a small amateur-built model rocket standing
vertically, centered, against a seamless pure black background.

The rocket is student-built, not industrial: a matte charcoal-grey composite
body tube about one metre tall, four laser-cut plywood fins with visible grain
and slightly imperfect edges, a smooth dark nose cone, a visible seam line where
the payload bay separates, small hex screws, and a faint scuff on one fin.

Lighting: one hard key light from the upper left rakes down the body, producing
a bright specular line along the tube and sharp fin shadows. A narrow
ignition-orange rim light from the lower right traces the opposite edge of the
rocket. Everything else falls to pure black. Faint navy blue ambient fill in the
deepest shadows.

Camera: slightly below eye level looking gently up, 85mm lens, shallow depth of
field with the nose cone softly falling out of focus, subtle 35mm film grain.

Aspect ratio 3:4, vertical.

NEGATIVE: no people, no faces, no hands, no text, no letters, no numbers, no
logos, no brand marks, no flags, no purple, no magenta, no teal, no cyan, no
cartoon, no CGI videogame look, no white background, no gradient backdrop,
no reflective floor, no props.
```

**Kabul kriteri:** Arka plan gerçekten saf siyah mı? Gövdede yazı var mı? Turuncu sadece kenar ışığında mı? Öğrenci yapımı hissi var mı?

---

## 🖼 G2 — `g2-rover` · GEZGİN ROBOT
> ⚠️ G1'i referans ekle + Adım 2 bloğunu başa yapıştır.

```
The new subject is: a small six-wheeled exploration rover built by students.
An open aluminium extrusion chassis, six knobbly rubber wheels on visible rocker
suspension arms, exposed wiring bundled with cable ties, a small camera module
on a short mast, and a 3D-printed electronics enclosure with clearly visible
layer lines. One ignition-orange status LED glows on the enclosure.

The rover sits at a three-quarter angle, wheels on an invisible ground plane.

Aspect ratio 3:4, vertical.
```

---

## 🖼 G3 — `g3-uav` · İHA / GÖZCÜ
> ⚠️ G1 referanslı.

```
The new subject is: a student-built quadcopter drone shown at a three-quarter
angle, slightly from above.

A carbon-fibre X-frame with visible weave, four brushless motors with exposed
windings, four black propellers, a flight controller board with pin headers
visible, a battery strapped on with a velcro band, and antenna wires trailing
from the rear. One ignition-orange navigation LED glows beneath the front arm.
The build is neat but clearly hand-assembled.

Aspect ratio 3:4, vertical.
```

---

## 🖼 G4 — `g4-arm` · ROBOT KOL / 6-DOF
> ⚠️ G1 referanslı.

```
The new subject is: a six-axis desktop robotic arm in a partially extended pose,
reaching upward and to the left.

Machined aluminium joints alternating with 3D-printed charcoal-grey links that
show visible print layer lines. Servo horns, exposed screws, and a ribbon cable
running along the arm. A small two-finger gripper at the end. One
ignition-orange LED glows on the base servo housing.

Aspect ratio 3:4, vertical.
```

---

## 🖼 G5 — `g5-linefollower` · ÇİZGİ İZLEYEN
> ⚠️ G1 referanslı.

```
The new subject is: a small line-following robot, photographed from a low
three-quarter angle.

A bare printed circuit board chassis with visible copper traces and through-hole
solder joints, two small geared motors with rubber wheels, a caster ball at the
front, a row of infrared sensors mounted on a downward-facing bracket, and a
battery pack held on with an elastic band. Two ignition-orange LEDs glow on the
board edge.

Aspect ratio 3:4, vertical.
```

---

## 🖼 G6 — `g6-pcb` · KENDİ TASARIMIMIZ (PCB)
> ⚠️ G1 referanslı.

```
The new subject is: a bare custom-designed printed circuit board floating at a
steep angle, filling most of the frame.

Dark navy blue solder mask, gold-plated pads and traces catching the key light,
a microcontroller chip, several capacitors and resistors, a row of pin headers,
and visible copper trace routing. Fine dust and a single fingerprint smudge on
the surface. One ignition-orange LED lit near the edge.

Macro framing, very shallow depth of field, the far edge of the board falling
out of focus.

Aspect ratio 3:4, vertical.
```

---

# BÖLÜM B — LABORATUVAR ORTAMLARI (3 görsel)
### Hangar arka planı (S03) + içerik sayfası hero'su

**En-boy:** 16:9 · **Hedef:** 2560×1440
**Çift görev:** Hem hangar kapısı arkasında (video yedeği) hem `/laboratuvarlar/*` sayfası hero'su

> **Kompozisyon kuralı:** Metin **sol yarıya** gelecek. Sol yarı koyu, sakin ve detaysız kalmalı.

---

## 🖼 L1 — `l1-ai-lab` · YAPAY ZEKÂ LABORATUVARI ⭐ *(bu serinin master'ı)*

```
Wide interior photograph of a dark, empty technology laboratory at night.
Completely unoccupied — no people anywhere in the frame.

On the right side: a workbench with several computer monitors, out of focus,
casting a soft deep navy blue glow across the room. A 3D printer sits mid-print
on the bench, one ignition-orange status LED glowing on its frame. Matte metal
surfaces, coiled cables, a soldering station, scattered components.

The left half of the room recedes into deep shadow — empty, quiet, almost black.

Atmosphere: faint haze in the air catches the monitor glow in soft volumetric
beams. Deep crushed blacks, high contrast, cinematic.

Camera: wide angle, eye level, symmetrical and calm. Subtle 35mm film grain.

Aspect ratio 16:9.

NEGATIVE: no people, no faces, no hands, no text, no letters, no numbers, no
logos, no signage, no posters on walls, no purple, no magenta, no teal, no cyan,
no bright overhead fluorescent lighting, no white walls, no cartoon, no CGI look.
```

---

## 🖼 L2 — `l2-uav-lab` · İHA & ROKET ATÖLYESİ
> ⚠️ L1'i referans ekle: *"Match the reference image's lighting, atmosphere, colour grade and mood exactly. Same dark empty laboratory feel."*

```
The new scene is: a workshop for rocketry and unmanned aircraft, at night, empty
of people.

On the right: a long workbench with a partially assembled model rocket lying
horizontally on a cradle, fins detached beside it, a drone frame in pieces, coils
of wire, and a small telemetry radio with an ignition-orange LED lit. On the wall
behind, dark pegboard with hand tools in silhouette.

The left half of the frame is deep shadow and empty floor.

Aspect ratio 16:9.
```

---

## 🖼 L3 — `l3-mechatronics` · MEKATRONİK ATÖLYESİ
> ⚠️ L1 referanslı.

```
The new scene is: a mechatronics and 3D prototyping workshop at night, empty of
people.

On the right: a bank of three 3D printers, one mid-print with its nozzle
illuminated and an ignition-orange status LED glowing. Finished charcoal-grey
printed parts arranged on a shelf. A small CNC machine in the background,
out of focus. Fine plastic dust on surfaces.

The left half of the frame is deep shadow and empty.

Aspect ratio 16:9.
```

---

# BÖLÜM C — TEKİL GÖRSELLER (2 adet)

## 🖼 C1 — `c1-gears` · CEZERİ MEKANİZMASI
**En-boy:** 1:1 · **Kullanım:** S00 preloader arkası, S08 footer, `/hakkimizda` hero

```
Extreme macro photograph of an antique brass and steel gear mechanism from a
medieval Islamic automaton, against a pure black background.

Interlocking toothed brass wheels of different sizes mesh together with visible
precision. Aged brass with deep patina, fine scratches, hand-filed tooth edges,
a trace of dust settled in the grooves. A steel axle and a small iron pin.

Lighting: a single hard warm key light from the left creating long raking
shadows across the teeth; a faint deep navy blue fill from the right separates
the mechanism from the black. One small area catches an ignition-orange
reflection.

Camera: macro lens, extremely shallow depth of field, the rearmost gear falling
softly out of focus. Subtle film grain.

Aspect ratio 1:1.

NEGATIVE: no people, no hands, no text, no letters, no numbers, no arabic
calligraphy, no logos, no purple, no magenta, no teal, no cyan, no clock face,
no watch, no gold jewellery look, no CGI render look.
```

> ⚠️ **Dikkat:** "Islamic automaton" tarifi modeli hat sanatı/süsleme eklemeye
> itebiliyor. Kadrajda yazı çıkarsa *"remove all calligraphy and ornament,
> keep only bare mechanical gears"* diyerek düzelt.

---

## 🖼 C2 — `c2-og` · SOSYAL PAYLAŞIM KARTI
**En-boy:** 1.91:1 · **Hedef:** 1200×630 · **Kullanım:** WhatsApp/Twitter/LinkedIn önizlemesi

> Bu görselin üstüne **yazıyı ben koyacağım** (kod ile, keskin ve doğru tipografi).
> Senden sadece **temiz zemin** istiyorum.

```
Cinematic wide banner image. A small amateur rocket ascends diagonally from the
lower left toward the upper right, leaving a thin glowing ignition-orange exhaust
trail and a soft smoke wisp behind it.

Background: deep midnight navy sky grading to charcoal black at the edges, faint
scattered stars, a very low dark mountain ridgeline silhouette along the bottom.

Composition: the rocket and its trail occupy only the lower-left diagonal. The
entire upper-right two thirds of the frame is calm, dark, empty negative space
with no detail — reserved for text that will be added later.

Cinematic colour grade, high contrast, subtle film grain.

Aspect ratio 1.91:1, wide banner.

NEGATIVE: no people, no faces, no text, no letters, no numbers, no logos, no
watermarks, no purple, no magenta, no teal, no cyan, no busy detail in the upper
right, no bright sky, no daylight.
```

---

# 2. ÜRETMENE GEREK OLMAYAN ŞEYLER

Bunları isteme, boşuna uğraşma:

| Ne | Neden gerekmez |
|---|---|
| **Mobil fallback poster'ları (S01, S02, S04)** | Bunlar WebGL sahnelerinin yerine geçecek. **En doğru yol, sahneleri kurduktan sonra gerçek ekran görüntüsünü almak** — o zaman geçiş görünmez olur. AI görseli asla birebir uymaz. Ben F2/F3'te hallederim. |
| **Kilometre taşı kartı (S05)** | Turuncu zemin + tipografi. Kod ile yapılacak, görsel değil. |
| **Hangar kapısı / uyarı şeridi dokusu** | CSS ile üretilecek. |
| **İkon, logo, favicon** | AI ile üretilmez; vektör olarak çizilecek. |
| **Dişli/roket/İHA 3D modelleri** | Sahnelerde prosedürel olarak kod içinde üretiliyor. |

---

# 3. ÖNCELİK SIRASI

Hepsini birden üretme. Sıra şu:

| Öncelik | Görseller | Neden |
|---|---|---|
| **1** | **G1 (master roket)** | Tüm ürün serisinin anayasası. Bu doğru olmadan diğerlerine geçme. |
| **2** | G2–G6 (kalan 5 ürün) | Referans zinciriyle hızlı gider |
| **3** | **L1 (master lab)** → L2, L3 | Hem hangar hem içerik sayfası hero'su — çift görev |
| **4** | C2 (OG kartı) | Site paylaşıldığı anda gerekli |
| **5** | C1 (dişliler) | Preloader ve footer; en son |

**Toplam: 11 görsel.**

---

# 4. TESLİM ŞARTNAMESİ

| Konu | Şart |
|---|---|
| **Format** | PNG veya JPG — ham çıktı, optimize etme |
| **Çözünürlük** | Elde edebildiğin en yüksek |
| **Dosya adı** | `g1-rocket.png`, `g2-rover.png`, `l1-ai-lab.png`, `c1-gears.png`, `c2-og.png` … |
| **Varyant** | Kararsız kaldığında `g1-rocket-a.png` / `-b.png` gönder, ben seçerim |

### Ben ne yapacağım
1. Arka plan temizliği (gerekirse siyah zemini tam `#121212`'ye oturtma)
2. Renk kalibrasyonu — turuncunun tam `#FF6F00`, lacivertin `#1A237E` olması
3. Upscale → AVIF + WebP çift çıktı, `next/image` ile responsive srcset
4. LQIP blur placeholder üretimi
5. **Alt-text yazımı** — bunu ciddiye alacağım: hem erişilebilirlik hem GEO için
   her görselin alt metni olgusal ve tarifsel olacak

---

# 5. PLANA ETKİSİ

| Önce | Şimdi |
|---|---|
| Görseller Higgsfield GPT Image 2'ye bağlıydı (kredi 0) | **Nano Banana ile üretilecek** |
| Higgsfield hem video hem görsel için gerekliydi | **Higgsfield bağımlılığı tamamen kalktı** — kredi hiç gelmese de site eksiksiz tamamlanır |
| F6 (medya) kritik yolda | F6 tamamen kritik yol dışında; F0–F5 ve F8–F9 medyasız tamamlanır, medya geldiğinde slot'lara takılır |
