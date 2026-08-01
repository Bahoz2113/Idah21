# MÜFREDAT DÜZENLEMESİ VE ANİMASYON PLANI

**Loop:** `loop-msanwgg6-82a100` · **Tarih:** 2026-08-01 · **Faz:** F10

---

## 0. ELDEKİ MÜFREDAT — DÖRT PROGRAM, ~165 HAFTA

| Kod | Program | Hafta | Kaynak |
|---|---|---|---|
| **P1** | İlkokul Atölye — Elektrik, Enerji ve Statik | 59 | mesajda |
| **P2** | Ortaokul+ Elektronik — Devre, Lehim, Sensör | 26 | mesajda |
| **P3** | Ortaokul+ Yazılım — ScratchJr (1-15) + mBlock (16-31) | 31 | mesajda |
| **P4** | Arduino İleri — 4 dönem, bitirme projeli | 49 | `Müfredat_Açıklamalı.docx` |

**Toplam 165 hafta.** Bu sayı animasyon stratejisini belirliyor: hafta başına
animasyon imkânsız ve gereksiz. Bunun yerine **tekrar eden temalar** çıkarıldı;
her tema bir animasyon alıyor ve o temaya ait tüm haftalar aynı animasyonu
kullanıyor.

---

## 1. TEMA ÇIKARIMI

165 haftanın tamamı **18 temaya** indi. Frekans, o temanın kaç haftada geçtiğini
gösterir — animasyon yatırımının nereye yapılacağını bu belirledi.

| # | Tema | Frekans | Nerede geçiyor |
|---|---|---|---|
| T01 | Devre temeli & LED | 12 | P1:1-3 · P2:1 · P3:16-17 · P4:1-2 |
| T02 | Direnç, potansiyometre, parlaklık | 9 | P1:2,20 · P2:1,2,4,7,12 · P3:18 · P4:5 |
| T03 | **Lehim / havya** | 8 | P2:5,9,14,17,19,21,24,26 |
| T04 | Işık sensörü (LDR) | 5 | P1:44 · P2:13 · P3:19 · P4:9 |
| T05 | Ses sensörü & buzzer | 5 | P1:8 · P2:16,23 · P3:— · P4:6,9 |
| T06 | Su / yağmur / nem sensörü | 11 | P1:14-16,18,22 · P2:18 · P3:26-28 · P4:14-15 |
| T07 | Sıcaklık sensörü | 3 | P2:20 · P3:21,24 |
| T08 | Ultrasonik mesafe | 4 | P3:22 · P4:11,12,17 |
| T09 | Transistör & anahtarlama | 6 | P1:9,16,19,20,23 · P3:25 |
| T10 | Motor, servo, hareket | 9 | P1:24,25 · P3:23,31 · P4:15-17,20,33 |
| T11 | **Jeneratör & enerji dönüşümü** | 13 | P1:26-34,37-39,47-49 |
| T12 | Enerji depolama (akü, kapasitör) | 5 | P1:33,34,45,46 |
| T13 | **Statik elektrik** | 10 | P1:50-59 |
| T14 | **3D kalem / modelleme / baskı** | 11 | P1:13,35,54 · P2:6,15,25 · P4:25-28,33 |
| T15 | **Dron eğitimi** | 6 | P1:4,21,43 · P2:3,10,22 |
| T16 | Blok kodlama (ScratchJr) | 15 | P3:1-15 |
| T17 | Ekran & haberleşme (LCD/OLED/I2C/IR/BT) | 8 | P3:30 · P4:18,19,20,21,30,31 |
| T18 | Robot kol & mobil robot | 7 | P4:22-24,34-36 |

---

## 2. 🔴 KRİTİK KARAR — HANGİ TEMA VİDEO, HANGİSİ SVG

**AI video soyut kavramları üretemez.** Kling'e "for döngüsü" dedirtemezsin;
çıkan şey anlamsız görüntü olur. Buna karşılık fiziksel olayları çok iyi üretir.

Bu yüzden temalar ikiye ayrıldı:

### 🎬 KLING VİDEOSU — fiziksel, gözle görülür olaylar
Gerçek dünyada olan, kamerayla çekilebilecek şeyler. **8 yeni klip.**

### ✏️ SVG ANİMASYONU — soyut, mantıksal kavramlar
Döngü, koşul, değişken, PWM, veri akışı. **Bunları ben kodlayacağım — senden
hiçbir şey istemiyorum.** Diyagram, bu konularda videodan *daha iyi* anlatır:
net, sonsuz döngülü, birkaç KB, ve içerik katmanının hız bütçesini bozmuyor.

### ♻️ ZATEN ELİMİZDE OLAN
| Tema | Mevcut klip |
|---|---|
| T15 Dron | `v2-uav` ✅ |
| T18 Robot kol | `v4-mech` ✅ |
| T01 Lab ortamı (genel) | `v3-lab` ✅ |

---

## 3. ANİMASYON EŞLEME TABLOSU

| Tema | Tür | Varlık | Durum |
|---|---|---|---|
| T01 Devre & LED | 🎬 | `c01-breadboard` | **üretilecek** |
| T02 Direnç & parlaklık | ✏️ | `svg-resistor` | ben kodlayacağım |
| T03 Lehim | 🎬 | `c02-solder` | **üretilecek** |
| T04 Işık sensörü | 🎬 | `c03-ldr` | **üretilecek** |
| T05 Ses sensörü | ✏️ | `svg-sound` | ben kodlayacağım |
| T06 Su / nem | 🎬 | `c04-water` | **üretilecek** |
| T07 Sıcaklık | ✏️ | `svg-temp` | ben kodlayacağım |
| T08 Ultrasonik mesafe | ✏️ | `svg-ultrasonic` | ben kodlayacağım |
| T09 Transistör | ✏️ | `svg-transistor` | ben kodlayacağım |
| T10 Motor & servo | 🎬 | `c05-motor` | **üretilecek** |
| T11 Jeneratör & enerji | 🎬 | `c06-generator` | **üretilecek** |
| T12 Enerji depolama | ✏️ | `svg-battery` | ben kodlayacağım |
| T13 Statik elektrik | 🎬 | `c07-static` | **üretilecek** |
| T14 3D kalem & baskı | 🎬 | `c08-3dprint` | **üretilecek** |
| T15 Dron | ♻️ | `v2-uav` | hazır |
| T16 Blok kodlama | ✏️ | `svg-blocks` | ben kodlayacağım |
| T17 Ekran & haberleşme | ✏️ | `svg-data` | ben kodlayacağım |
| T18 Robot kol & mobil robot | ♻️ | `v4-mech` | hazır |

**Senden istenen: 8 klip.** Gerisi bende.

---

## 4. KLING SENARYOLARI

### Ortak kurallar (video şartnamesindekiyle aynı)
1. **İnsan yok, yüz yok, EL YOK.** Eller özellikle: AI el üretimi bozuk çıkıyor
   ve KVKK açısından da gereksiz risk. Alet tek başına, sehpada veya masada dursun.
2. **Yazı yok, rakam yok, logo yok, marka yok.**
3. Ses önemsiz, ben sileceğim.
4. **Yavaş, sürekli hareket.** Ani kesme yok.
5. **Palet:** kömür `#121212` + lacivert `#1A237E` + turuncu `#FF6F00`.
   Turuncu yalnızca ışık/LED/kıvılcım olarak. Mor, magenta, turkuaz YASAK.
6. **Kompozisyon:** özne **sağ üçte bir**de, **sol yarı koyu ve boş** — metin oraya gelecek.
7. **8 saniye**, 16:9, 1080p. Loop'u ben ayarlayacağım.
8. Her prompt için **3 varyant** üret, en iyisini gönder.

### Ortak stil kuyruğu — her prompt'un sonuna yapıştır
```
STYLE: Cinematic macro tabletop cinematography, shot on a macro lens, shallow
depth of field, subtle 35mm film grain, high contrast, deep crushed blacks.
Dark charcoal background. Volumetric haze catching the light.

COLOR GRADE: Strictly limited palette — charcoal black (#121212) and deep navy
blue (#1A237E) dominate. Ignition orange (#FF6F00) appears ONLY as light: LEDs,
glowing metal, sparks, indicator lamps. No other hues.

MOTION: Slow, continuous, mechanically steady. Locked-off or very slow dolly.
No handheld shake, no cuts. Single continuous take.

NEGATIVE: no people, no faces, no hands, no fingers, no arms, no text, no
letters, no numbers, no logos, no watermarks, no purple, no magenta, no teal,
no cyan, no cartoon, no CGI videogame look, no fast cuts, no camera shake,
no bright white studio lighting, no daylight.
```

---

## 🎬 C01 — `c01-breadboard` · DEVRE TEMELİ VE LED
**Tema T01** · 12 haftada kullanılacak · P1:1-3, P2:1, P3:16-17, P4:1-2

```
Extreme macro shot of a solderless breadboard on a dark workbench. Jumper wires
in muted colours run between the rows. A single red LED sits in the board.

Action: the LED slowly brightens from completely dark to full ignition-orange
glow, holds for a beat, then dims back down — a slow, deliberate breathing pulse,
repeating twice across the shot. The glow spills softly onto the surrounding
breadboard holes and wire ends.

Composition: the breadboard and LED occupy the right two thirds of the frame.
The left third is deep shadow, empty, out of focus.

Camera: locked-off macro, very shallow depth of field, focus on the LED.

[ORTAK STİL KUYRUĞU]
```

---

## 🎬 C02 — `c02-solder` · LEHİM / HAVYA
**Tema T03** · 8 haftada kullanılacak · P2:5,9,14,17,19,21,24,26

> ⚠️ Elsiz çekim: havya bir tutucuda duruyor, kart altında. Bu hem AI'ın el
> hatasını hem KVKK riskini ortadan kaldırıyor.

```
Extreme macro shot of a soldering iron resting in its metal stand, its tip
glowing faint ignition-orange from the heat, positioned just above a small
circuit board on a dark workbench.

Action: a thin wisp of white solder smoke drifts slowly upward through the frame,
curling in the light. A bead of molten solder on the board catches the light and
slowly cools, its surface dulling from bright to matte. Faint heat shimmer rises
from the iron tip.

Composition: the iron and board sit in the right two thirds. The left third is
pure dark negative space with drifting smoke only.

Camera: locked-off macro, extremely shallow depth of field.

[ORTAK STİL KUYRUĞU]
```

---

## 🎬 C03 — `c03-ldr` · IŞIK SENSÖRÜ (LDR)
**Tema T04** · 5 haftada kullanılacak · P1:44, P2:13, P3:19, P4:9

```
Extreme macro shot of a light-dependent resistor — a small round sensor with a
visible zigzag serpentine track on its face — mounted on a dark circuit board.

Action: the scene begins dimly lit. A soft pool of light slowly sweeps across
the sensor face from right to left, as if a lamp were passing overhead. As the
light reaches the sensor, a small ignition-orange LED beside it fades OFF. As
the light passes and darkness returns, the orange LED slowly glows back ON.
The cycle reads clearly as: light arrives → lamp turns off; darkness → lamp turns on.

Composition: sensor and LED in the right two thirds, left third dark and empty.

Camera: locked-off macro, shallow depth of field.

[ORTAK STİL KUYRUĞU]
```

---

## 🎬 C04 — `c04-water` · SU / YAĞMUR / NEM SENSÖRÜ
**Tema T06** · 11 haftada kullanılacak · P1:14-16,18,22 · P2:18 · P3:26-28 · P4:14-15

```
Extreme macro shot of a rain sensor board — a flat plate with interlocking
copper comb traces — lying at a slight angle on a dark surface.

Action: single water droplets fall slowly into frame from above and land on the
copper traces, spreading into small beads that bridge the gaps between them. As
each droplet bridges the traces, a small ignition-orange indicator LED at the
edge of the board pulses once, brighter with each new drop. Slow motion.

Composition: the sensor board occupies the right two thirds; the left third is
dark empty space where droplets fall through shadow.

Camera: locked-off macro, very shallow depth of field, droplets catching a rim light.

[ORTAK STİL KUYRUĞU]
```

---

## 🎬 C05 — `c05-motor` · MOTOR VE PERVANE
**Tema T10** · 9 haftada kullanılacak · P1:24,25 · P3:23,31 · P4:15-17,20,33

```
Extreme macro shot of a small DC motor mounted on a dark bench, with a two-blade
propeller attached to its shaft.

Action: the propeller starts completely still, then begins to rotate slowly,
accelerating smoothly until the blades blur into a disc, holds at speed, then
decelerates back to a full stop — and after a beat, begins rotating in the
OPPOSITE direction, repeating the same acceleration curve. The direction reversal
is the point of the shot and must be clearly readable.

A small ignition-orange LED on the motor housing glows steadily throughout.

Composition: motor and propeller in the right two thirds, left third dark.

Camera: locked-off macro, shallow depth of field.

[ORTAK STİL KUYRUĞU]
```

---

## 🎬 C06 — `c06-generator` · JENERATÖR VE ENERJİ DÖNÜŞÜMÜ
**Tema T11** · 13 haftada kullanılacak (en yüksek frekans) · P1:26-34,37-39,47-49

```
Macro shot of a small hand-crank generator connected by two thin wires to a
single LED, on a dark workbench.

Action: the generator's crank handle begins to rotate slowly on its own,
gradually speeding up. As the rotation speed increases, the connected LED
brightens proportionally from completely dark to a strong ignition-orange glow.
The rotation then slows and the LED dims back down in step with it. The direct
link between rotation speed and light output is the point of the shot.

Composition: the generator sits at the right, the LED slightly left of it, and
the far left third of the frame is dark empty space.

Camera: slow dolly-in, shallow depth of field.

[ORTAK STİL KUYRUĞU]
```

---

## 🎬 C07 — `c07-static` · STATİK ELEKTRİK
**Tema T13** · 10 haftada kullanılacak · P1:50-59

> Müfredattaki "su bükme" deneyi seçildi: statik elektriği en görsel anlatan
> deney ve elsiz çekilebilir.

```
Macro shot of a thin, steady stream of water falling from a tap against a dark
background. A charged plastic rod, held in a small clamp stand, sits to the right
of the stream — no hands, only the clamp.

Action: the rod slowly moves closer to the falling water. As it approaches, the
water stream visibly BENDS and curves toward the rod, deflecting from its
vertical fall. The rod then withdraws and the stream slowly straightens back to
vertical. The bending is the point of the shot and must be clearly visible.

Lighting: a hard rim light from the right makes the water stream glow against
the darkness with a faint ignition-orange edge.

Composition: water stream and rod in the right two thirds, left third pure dark.

Camera: locked-off macro, shallow depth of field.

[ORTAK STİL KUYRUĞU]
```

---

## 🎬 C08 — `c08-3dprint` · 3D KALEM VE BASKI
**Tema T14** · 11 haftada kullanılacak · P1:13,35,54 · P2:6,15,25 · P4:25-28,33

```
Extreme macro shot of a 3D printer nozzle extruding molten filament onto a dark
build plate.

Action: the nozzle glides slowly left and right, laying down thin glowing strands
of filament layer by layer. A small object builds up visibly, growing taller with
each pass. The freshly extruded filament glows faint ignition-orange from the
heat and cools to matte charcoal a moment after being laid down.

Composition: the nozzle and the growing object occupy the right two thirds; the
left third is dark, empty build plate receding out of focus.

Camera: locked-off macro at build-plate level, extremely shallow depth of field.

[ORTAK STİL KUYRUĞU]
```

---

## 5. ÜRETİM SIRASI

Frekansa göre — en çok kullanılacak olan önce:

| Sıra | Klip | Kaç haftada kullanılacak |
|---|---|---|
| 1 | `c06-generator` | 13 |
| 2 | `c01-breadboard` | 12 |
| 3 | `c04-water` | 11 |
| 4 | `c08-3dprint` | 11 |
| 5 | `c07-static` | 10 |
| 6 | `c05-motor` | 9 |
| 7 | `c02-solder` | 8 |
| 8 | `c03-ldr` | 5 |

İlk üçü gelse bile müfredat sayfası anlamlı şekilde yayına girebilir; kalanlar
prosedürel yer tutucuda bekler.

---

## 6. BENİM YAPACAKLARIM (senden bir şey gerekmiyor)

### 8 SVG animasyonu
| Varlık | Ne gösterecek |
|---|---|
| `svg-resistor` | Seri ve paralel direnç şeması dönüşümü; potansiyometre süpürgesi hareket ettikçe LED parlaklığı değişir |
| `svg-sound` | Mikrofona gelen ses dalgası; eşik aşılınca LED tetiklenir |
| `svg-temp` | Termometre sütunu yükselir, eşiği geçince alarm ikonu turuncuya döner |
| `svg-ultrasonic` | Sensörden çıkan dalga cisme gider, yansır, döner; geçen süre ölçülür |
| `svg-transistor` | Küçük beyz akımı, büyük kollektör akımını açar — akım kalınlığıyla gösterilir |
| `svg-battery` | Akü hücreleri dolar; kaynak kesilince LED bir süre daha yanmaya devam eder |
| `svg-blocks` | ScratchJr blokları birbirine geçer, döngü bloğu içindekini tekrarlar |
| `svg-data` | Veri paketleri I2C hattı boyunca akar, LCD ekranda karakter belirir |

Hepsi `prefers-reduced-motion` altında **son karesinde donacak** — hareket
kapansa bile diyagram anlamını koruyor.

### Müfredat sayfaları
```
/mufredat                      dört programın özeti + karşılaştırma
/mufredat/ilkokul-atolye       P1 — 59 hafta
/mufredat/elektronik           P2 — 26 hafta
/mufredat/yazilim              P3 — 31 hafta
/mufredat/arduino-ileri        P4 — 49 hafta, 4 dönem
```
- Her hafta kartı; temaya göre animasyon otomatik bağlanır
- `Course` + `Syllabus` + `hasCourseInstance` JSON-LD
- İçerik katmanı kuralı: **WebGL yok**, videolar `IntersectionObserver` ile
  yalnızca görünürken oynar, poster-önce
- Uzun kuyruk hedefi: `batman robotik kursu müfredat`, `çocuklar için arduino
  müfredatı`, `scratchjr ders programı`

---

## 7. TESLİM

Ham MP4, 8 sn, 1080p. Adlandırma:
```
c01-breadboard.mp4   c02-solder.mp4   c03-ldr.mp4       c04-water.mp4
c05-motor.mp4        c06-generator.mp4 c07-static.mp4   c08-3dprint.mp4
```
Kling farklı ad verdiyse olduğu gibi gönder, eşlemesini ben yaparım — geçen
sefer olduğu gibi kontak sayfasıyla tespit ederim.
