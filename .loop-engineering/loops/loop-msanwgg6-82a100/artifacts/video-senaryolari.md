# VİDEO SENARYOLARI — CEZERİ ROBOTECH "LAUNCHPAD"
### Gemini Omni ile üretim için çekim senaryoları ve prompt'ları

**Loop:** `loop-msanwgg6-82a100` · **Tarih:** 2026-08-01
**Üretim aracı:** Gemini Omni (kullanıcı üretecek) · **Higgsfield video bağımlılığı kalktı**

---

## 0. ÖNCE OKU — 8 ZORUNLU KURAL

Bu videolar dekoratif değil; **scroll'a bağlı sahnelerin arkasında** çalışacaklar.
Aşağıdaki kurallar estetik tercih değil, teknik zorunluluk:

| # | Kural | Neden |
|---|---|---|
| **1** | **Yüz yok, insan yok, çocuk yok** | `CLAUDE.md` KVKK kuralı. Silüet bile riskli — tamamen kaçın. |
| **2** | **Yazı yok, logo yok, rakam yok** | AI video modelleri bozuk/uydurma yazı üretir. Kadrajda hiçbir metin olmayacak. |
| **3** | **Ses önemsiz** | Site sesi ayrı ve varsayılan kapalı. Omni ses üretirse sorun değil, ben sileceğim. |
| **4** | **Yavaş ve sürekli hareket** | Scroll'a bağlanacak. Ani kesme, sarsıntı, hızlı kamera = kullanıcı midesi bulanır. |
| **5** | **Negatif alan bırak** | Videonun üstüne metin gelecek. Her senaryoda **nereye metin geleceği** yazıyor — orası sakin ve koyu kalmalı. |
| **6** | **Palet disiplini** | Lacivert `#1A237E` + kömür `#121212` + turuncu `#FF6F00`. **Mor, magenta, turkuaz, neon camgöbeği YASAK.** |
| **7** | **Döngü (loop) uyumu** | Videolar sonsuz dönecek. Her senaryoda "loop stratejisi" yazıyor — ona göre üret. |
| **8** | **Varyant üret** | Her prompt için **3–4 varyant** al, en iyisini seç. İlk çıktı nadiren en iyisidir. |

---

## 1. ORTAK STİL KİTABI (her prompt'un sonuna eklenecek)

Tüm klipler tek bir filmden çıkmış gibi görünmeli. **Bu bloğu her prompt'un sonuna
aynen yapıştır:**

```
STYLE: Cinematic, anamorphic widescreen, shot on ARRI Alexa with vintage
anamorphic primes. Subtle 35mm film grain. High contrast, deep crushed blacks,
protected highlights. Volumetric atmosphere and haze. Shallow depth of field.

COLOR GRADE: Strictly limited palette — deep midnight navy blue (#1A237E) and
charcoal black (#121212) dominate the frame. Intense ignition orange (#FF6F00)
appears ONLY as light sources, flame, or status LEDs. No other hues.

MOTION: Slow, continuous, mechanically steady. No handheld shake, no whip pans,
no cuts. Single continuous take.

NEGATIVE: no people, no faces, no children, no hands, no crowds, no text,
no letters, no numbers, no logos, no watermarks, no subtitles, no captions,
no purple, no magenta, no teal, no cyan, no neon pink, no cartoon, no anime,
no videogame CGI look, no fast cuts, no camera shake, no lens dirt,
no stock-footage look, no smiling, no vlog aesthetic.
```

---

# ÇEKİRDEK KLİPLER (4 adet — zorunlu)

---

## 🎬 V1 — `v1-launch` · FIRLATMA
### Sahne S01 (Hero / Launchpad) arka planı

| Özellik | Değer |
|---|---|
| **Süre** | 10 sn |
| **En-boy** | 16:9 (tercihen 3840×2160, min 2560×1440) |
| **Yerleşim** | Hero'nun arkasında, `opacity 0.35`, dişli→İHA morph'unun altında |
| **Kompozisyon** | Roket **sol üçte bir** dikey hattında. **Merkez ve sağ alt = negatif alan** (manşet oraya gelecek, koyu ve sakin kalmalı) |
| **Loop stratejisi** | Roket kadrajdan çıkar → son 2 sn **sürüklenen duman sütunu**nda dinlenir. Bu son 2 sn ilk 2 sn'ye çapraz geçiş yapacak. **Bunu prompt'ta özellikle iste.** |

**Anlatı:** Gece. Yayla. Sessizlik. Ateşleme. Turuncu, laciverti yarıyor.
Kamera roketi bırakmıyor — yukarı, yukarı. Geride kıvrılan bir duman sütunu kalıyor.

### PROMPT
```
Cinematic wide shot, night launch of a small solid-fuel amateur rocket from a
rocky highland plateau. The rocket sits in the left third of the frame.

Ignition: a brilliant ignition-orange exhaust flame erupts at the base, throwing
a thick white-grey smoke column outward across the ground. The rocket lifts and
accelerates vertically. Camera tilts slowly upward, tracking the ascent on a long
telephoto lens, with faint heat shimmer distorting the air near the flame.

Environment: deep midnight navy night sky, faint scattered stars, distant dark
mountain ridgeline as a low silhouette. The smoke column is lit from within by
the orange flame, glowing volumetrically.

Framing note: keep the center and lower-right of the frame dark, empty and calm —
no bright elements there.

Ending: in the final 2 seconds the rocket has left the frame and the camera
settles, holding on the slowly drifting, glowing smoke column against the navy
sky. End the shot in a calm, near-static state that could seamlessly blend back
into the opening frame.

[ORTAK STİL KİTABI BURAYA]
```

**Kabul kriteri:** Merkez üçte bir koyu mu? Turuncu sadece alevde mi? Son 2 sn sakin mi?

---

## 🎬 V2 — `v2-uav` · İHA GEÇİŞİ
### Sahne S03-B (Hangar B — UAV & Rocket Dynamics) kapısının arkası

| Özellik | Değer |
|---|---|
| **Süre** | 8 sn |
| **En-boy** | 16:9 |
| **Yerleşim** | Hangar kapısı açılınca arkasında oynar, kapanınca donar |
| **Kompozisyon** | İHA **sağ üçte bir**de, alçak açı. **Sol yarı = negatif alan** (lab başlığı ve ekipman satırı oraya gelecek) |
| **Loop stratejisi** | Yatay uçuş = doğal loop. **Sabit hız, sabit yükseklik** iste; başlangıç ve bitiş gökyüzü aynı tonda olsun → kesintisiz döner |

**Anlatı:** Mavi saat. İHA alçaktan geçiyor. Sadece turuncu seyir LED'i yanıp sönüyor.
Kamera onu takip ediyor, ona yetişmeye çalışmıyor.

### PROMPT
```
Low-angle tracking shot of a small black quadcopter UAV flying steadily at low
altitude, seen from below against the sky. The drone occupies the right third of
the frame and moves horizontally at a constant speed and constant altitude.

The drone is a dark silhouette; a single ignition-orange navigation LED pulses
slowly on its underside. Propellers spin with visible motion blur.

Environment: blue hour just after sunset. Deep navy blue sky grading to darker
navy at the top. A thin band of dark terrain silhouette along the very bottom
edge. Fine dust particles drift through the air, catching the last light.

Camera: telephoto lens, smooth lateral tracking that matches the drone's speed,
strong lens compression, shallow depth of field with the sky softly out of focus.

Framing note: keep the entire left half of the frame open, dark and uncluttered.

Motion note: absolutely constant velocity and altitude from first frame to last,
with identical sky tone at the start and the end, so the clip can loop seamlessly.

[ORTAK STİL KİTABI BURAYA]
```

**Kabul kriteri:** Sol yarı boş mu? İlk ve son kare gökyüzü tonu aynı mı?

---

## 🎬 V3 — `v3-lab` · YAPAY ZEKÂ LABORATUVARI
### Sahne S03-A (Hangar A — AI & Deep Learning Lab) kapısının arkası

| Özellik | Değer |
|---|---|
| **Süre** | 8 sn |
| **En-boy** | 16:9 |
| **Kompozisyon** | 3D yazıcı **sağda**, derinlikte monitör parıltısı. **Sol üçte bir = negatif alan** |
| **Loop stratejisi** | 3D yazıcı hareketi doğası gereği döngüsel — **nozül soldan sağa gidip geri dönsün**, klip başladığı pozisyonda bitsin |

**Anlatı:** Kimse yok. Sadece makineler çalışıyor. Monitör ışığı laciverti boyuyor,
yazıcının durum LED'i turuncu. Bu bir gece vardiyası.

### PROMPT
```
Slow dolly-in through a dark, empty laboratory at night. No people anywhere.

Foreground right: a 3D printer in operation, its nozzle head gliding smoothly
left to right and back along the gantry, extruding a thin filament. A single
ignition-orange status LED glows on the printer frame.

Background: several computer monitors out of focus, casting a soft deep navy
blue glow across the room and reflecting on matte metal surfaces and a workbench
edge. Faint atmospheric haze catches the monitor light in visible volumetric beams.

Camera: very slow dolly-in, macro-leaning framing, shallow depth of field. Focus
rests on the printer nozzle; everything else falls off softly.

Framing note: keep the left third of the frame in deep shadow and free of detail.

Motion note: the printer head must return to its starting position by the final
frame so the clip loops seamlessly.

[ORTAK STİL KİTABI BURAYA]
```

**Kabul kriteri:** Gerçekten insan yok mu? Sol üçte bir karanlık mı? Nozül başladığı yerde bitiyor mu?

---

## 🎬 V4 — `v4-mech` · MEKATRONİK
### Sahne S03-C (Hangar C — Mechatronics & 3D Prototyping) kapısının arkası

| Özellik | Değer |
|---|---|
| **Süre** | 8 sn |
| **En-boy** | 16:9 |
| **Kompozisyon** | Eklem **merkez-sağ**. **Sol yarı karanlık** |
| **Loop stratejisi** | **Mükemmel loop** — kol 30° döner ve başlangıç pozisyonuna geri döner. Bunu net iste. |

**Anlatı:** Makro. Bir eklem. Servo hareket ediyor, duruyor, geri dönüyor.
Mühendisliğin sabrı bu.

### PROMPT
```
Extreme macro shot of a single joint of a robotic arm against a black background.

The joint rotates slowly and precisely about 30 degrees, pauses for a beat, then
rotates smoothly back to its exact starting position. Machined aluminium and
carbon-fibre surfaces with visible tooling marks and fine dust. A small
ignition-orange status LED on the servo housing glows steadily.

Lighting: a single hard key light rakes across the metal from the upper right,
creating a sharp specular highlight along the machined edge. Everything else
falls into deep black. Faint navy blue rim light separates the arm from the
background.

Camera: locked-off macro lens, extremely shallow depth of field, no camera
movement at all. Only the mechanism moves.

Framing note: the joint sits center-right; the entire left half of the frame is
pure black negative space.

Motion note: the arm must end in exactly the same position as it started, for a
perfect seamless loop.

[ORTAK STİL KİTABI BURAYA]
```

**Kabul kriteri:** İlk ve son kare aynı mı? Sol yarı gerçekten siyah mı? Kamera sabit mi?

---

# OPSİYONEL KLİPLER (2 adet — varsa iyi olur)

---

## 🎬 V5 — `v5-apogee` · TEPE NOKTASI *(opsiyonel)*
### Sahne S04 (İlk Fırlatış) — R3F sahnesinin arkasına katman

| Özellik | Değer |
|---|---|
| **Süre** | 8 sn · 16:9 |
| **Loop** | Gerekmez — tek seferlik, scroll tetikli oynar |

```
Upward-looking shot from directly below, tracking a small rocket at the peak of
its flight against a deep navy sky fading to near-black at the top of the frame,
with faint stars becoming visible.

The rocket slows, tips over, and a parachute deploys — the canopy unfurls and
catches the air, filling out in slow motion. The parachute is charcoal grey with
a single ignition-orange band.

Camera: long telephoto, looking straight up, slowly rotating as it tracks the
descent. Thin high-altitude haze.

[ORTAK STİL KİTABI BURAYA]
```

---

## 🎬 V6 — `v6-gears` · CEZERİ MEKANİZMASI *(opsiyonel)*
### S00 preloader arkası / S08 footer ambiyansı

| Özellik | Değer |
|---|---|
| **Süre** | 8 sn · 16:9 veya 1:1 |
| **Loop** | **Mükemmel loop zorunlu** — dişli tam tur atmalı |

```
Extreme macro of an antique brass and steel gear mechanism, in the style of a
medieval Islamic automaton, rotating slowly and continuously. Interlocking
toothed wheels mesh with visible precision. Aged brass with patina, fine
scratches, a trace of dust.

Lighting: single warm key light from the left creating long shadows; deep navy
blue fill from the right. Background falls to pure black.

Camera: locked-off macro, no movement. Only the gears turn.

Motion note: the gears must complete exactly one full rotation cycle so the clip
loops perfectly and invisibly.

[ORTAK STİL KİTABI BURAYA]
```

---

# 2. TESLİM ŞARTNAMESİ

Üretilen dosyaları bana bu şekilde ver — gerisini ben hallederim
(sıkıştırma, webm dönüşümü, poster kare çıkarma, `lib/media.ts` bağlantısı).

| Konu | Şart |
|---|---|
| **Format** | MP4 (H.264) — ham çıktı yeterli, optimize etme |
| **Çözünürlük** | Mümkün olan en yüksek (tercihen 4K, min 1440p) |
| **FPS** | 24 veya 30 (hangisi çıkarsa) |
| **Ses** | Umursama, ben sileceğim |
| **Dosya adı** | `v1-launch.mp4`, `v2-uav.mp4`, `v3-lab.mp4`, `v4-mech.mp4`, `v5-apogee.mp4`, `v6-gears.mp4` |
| **Varyantlar** | En iyisini seçtiysen tek dosya; kararsızsan `v1-launch-a.mp4`, `-b.mp4` diye 2-3 tanesini gönder, ben seçerim |
| **Nasıl** | Drive klasörü veya doğrudan yükleme — ikisi de olur |

### Ben ne yapacağım
1. Sesi sileceğim, 8-10 sn'ye trimleyeceğim
2. Loop noktalarını ayarlayıp gerekirse çapraz geçiş ekleyeceğim
3. WebM (VP9) + MP4 (H.264) ikili çıktı, **klip başına < 2.5 MB** hedefi
4. 720p mobil varyant + AVIF poster kare
5. `preload="none"` + IntersectionObserver ile sahnelere bağlayacağım

---

# 3. ÜRETİM SIRASI ÖNERİSİ

En kolaydan zora — ilk ikisi elini ısıtır:

1. **V4 (mekatronik)** — en kontrollü, tek nesne, sabit kamera. Model burada nadiren hata yapar.
2. **V6 (dişliler)** — benzer şekilde basit, ve preloader'da hemen işe yarar.
3. **V3 (lab)** — "insan yok" talimatının tutup tutmadığını burada test edersin.
4. **V2 (İHA)** — loop hassasiyeti başlıyor.
5. **V1 (fırlatma)** — en zoru: alev, duman, kamera takibi, negatif alan. **En çok varyant burada gerekecek.**
6. **V5 (apogee)** — opsiyonel, en son.

---

# 4. PLANA ETKİSİ

| Önce | Şimdi |
|---|---|
| F6 medya fazı Higgsfield kredisine bağlıydı | **Video bağımlılığı kalktı** — Gemini Omni ile üretilecek |
| Higgsfield: 4 video (Cadence 2.0) + 7 görsel (GPT Image 2) | Higgsfield yalnızca **durağan görseller** için gerekli; kredi gelmezse prosedürel render'la da idare edilir |
| F6 kritik yolda | **F6 artık kritik yolda değil** — F0–F5 ve F8–F9 videolar olmadan tamamlanır |
