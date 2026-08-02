# CEZERİ ROBOTECH — SANAT YÖNETİMİ / ÇEKİM KURALI

**Durum:** kilitli (v1) · **Tarih:** 2026-08-02
**Kapsam:** Higgsfield ile üretilen tüm atmosfer görselleri ve videoları.

Bu belge, üretilen her karenin **tek bir fotoğrafçının tek günde tek ışıkla çektiği bir seri**
gibi durmasını sağlar. Awwwards değerlendirmesinde "Tasarım" başlığının %40 ağırlığı
tutarlılıktan gelir; rastgele güzel kareler bu puanı almaz.

---

## 1. Kapsam sınırı (PDF Volume 13 — NON-NEGOTIABLE SOURCE RULE)

Burada tanımlanan üretim **yalnızca soyut/atmosfer katmanı** içindir.

| Üretilebilir | Üretilemez |
|---|---|
| Mekanizma, devre, basılı parça, gövde etüdü | Sınıf, atölye, bina, etkinlik |
| Malzeme ve doku çalışmaları | Herhangi bir insan — özellikle çocuk |
| Diyagramatik/geometrik kompozisyonlar | Öğrenci projesi olarak sunulan nesne |
| Marka soyutlamaları | Eğitmen portresi |

Sağ sütundaki her slot `MEDIA_REQUIRED` ile işaretlenir ve gerçek kurum arşivi gelene
kadar tipografik/soyut tasarımla durur. **Sahte sahne kurulmaz.**

---

## 2. Değişmez çekim parametreleri

Aşağıdaki beş madde her promptta birebir tekrarlanır. Serinin imzası bunlar.

**Zemin.** Dikişsiz beyaz stüdyo değil — ince doğal dokulu, hafif alet izli **açık kireçtaşı
levha**. Cezerî'nin coğrafyasına ve el yazması kâğıdına bağlanır; stok fotoğrafın
sahip olmadığı sahiplenilebilir bir yüzey verir.

**Işık.** Soldan, yaklaşık **25° alçak açıdan tek sert ışık**. Uzun, yumuşak kenarlı gölge
sağa düşer. Gölge tarafını kaldıran zayıf bir sekme ışığı var. *Her karede aynı yön.*

**Optik.** 100 mm makro eşdeğeri, f/4. Sığ alan derinliği, ama detayı eritmeyecek kadar.

**Renk.** Alan sıcak nötr kalır. Lacivert `#1A237E` yapısal malzeme olarak bulunur.
Turuncu `#FF6F00` **karede yalnızca bir kez ve küçük** görünür. Az olduğu için güçlü;
baskın olduğu anda ucuzluyor.

**Kadraj.** Nesne aşağıda oturur ve **alt kenarı kırar**. Üst **%55** boş aydınlık taş olarak
kalır — tipografi oraya iner. Ufuk yok, arka plan yok, sadece taş ve düşen ışık.

---

## 3. Yasak listesi

Her prompta negatif olarak eklenir:

```
no people, no text, no logos, no glossy reflections, no lens flare,
no neon, no particles, no holograms, no blue-purple gradient,
no horizon, no sky, no seamless white studio background
```

Gerekçe: ilk brief `#7C4DFF` mor-mavi neon gradyanını ve stok çocuk fotoğrafını açıkça
yasakladı; PDF Volume 1.6 buna glitch, ağır neon ve anlamsız parçacık fırtınasını ekledi.

---

## 4. Prompt iskeleti

```
A single hard low-angle raking light enters from the left at about 25 degrees
across a warm pale limestone slab with fine natural grain; a long soft-edged
shadow falls to the right, a weak bounce lifts the shadow side. 100mm macro
lens at f/4, horizonless frame — only stone and falling light.

Subject: <KONU>. Deep navy (#1A237E) appears as the structural material;
burnt orange (#FF6F00) appears exactly once, small, as <TEK VURGU>.

The subject sits low in the frame and breaks the bottom edge, leaving the
upper fifty-five percent as empty sunlit stone for typography.
Visible texture: <MALZEME DOKUSU>, limestone tooth.

<YASAK LİSTESİ>
```

---

## 5. Modeller ve maliyet

| İş | Model | Ayar | Kredi |
|---|---|---|---|
| Görsel | `gpt_image_2` | 2K / high | 7 |
| Video | `seedance_2_0` | 720p / 8 sn / sessiz | 36 |
| Video | `seedance_2_0` | 1080p / 8 sn / sessiz | 72 |

Video için 720p seçildi: fon döngüsü olarak %45–55 opaklıkta, metnin arkasında
kullanılıyor ve nihai dosya 200–550 KB'a sıkıştırılıyor. 1080p'nin iki katı maliyeti
görünür karşılık üretmiyor.

Eşzamanlılık sınırı: **pro planda aynı anda 4 iş**.

---

## 6. Teslim akışı (ağ kısıtı nedeniyle)

Higgsfield çıktıları `d8j0ntlcm91z4.cloudfront.net` üzerinde tutuluyor ve bu ortamın ağ
geçidi o hosta CONNECT isteğini 403 ile reddediyor (kurum politikası). Dosyalar doğrudan
depoya çekilemiyor.

```
üret (ajan) → indir (kullanıcı, Higgsfield galerisi) → sohbete yükle (kullanıcı) → işle (ajan)
```

Sohbete yüklenen dosyalar diske indiği için `sharp`/`ffmpeg` ile bağlam doldurmadan
işlenebiliyor. Alternatif çözüm: ağ yöneticisinin ilgili hostu izin listesine alması.

---

## 7. Video hareket kuralı

PDF Volume 5.1 hareketin bir nedeni olmasını, Volume 6.6 hero videosunun **sessiz**
olmasını şart koşuyor. Buna göre:

- Kamera hareketi tek eksende, çok yavaş — kaydırma veya hafif yakınlaşma.
- Kesme yok; klip tek çekim.
- 8 saniye üretilir, sonra baş ve son karışımıyla **kusursuz döngüye** indirilir.
- `generate_audio: false` — ses üretilmez.
- Konu hareket eder, kadraj sakin kalır. Metin okunurken göz yormaz.
