# Kayıt ve Kabul Formu — kurulum ve işleyiş

Tanıtım sitesindeki **Kayıt** bölümü (`/#kayit`), kâğıt "Kayıt ve Kabul
Formu"nun çevrimiçi hâlidir. Veli formu doldurup gönderdiğinde:

1. Sunucu formu **yeniden doğrular** (tarayıcıdaki kontrol yalnızca kolaylıktır).
2. Doldurulmuş formun **PDF'i sunucuda üretilir** — kâğıt formla aynı bölümler,
   aynı sözleşme maddeleri, en altta ıslak imza için boş bırakılmış alan.
3. PDF **merkeze e-postayla** gönderilir; e-postanın gövdesinde velinin yazdığı
   tüm alanlar ham hâliyle de yer alır.
4. Aynı PDF **veliye de iner** ve ekranda başvuru numarası gösterilir.

Kayıt, atölyede ıslak imza alınınca kesinleşir. PDF bunun için basılır.

---

## Çalışması için gereken ortam değişkenleri

Bunlar tanımlı değilken uç nokta **503 döner** ve arayüz veliyi WhatsApp'a
yönlendirir. Sessizce "gönderildi" demez — bu bilinçli bir karardır.

| Değişken | Zorunlu | Açıklama |
|---|---|---|
| `SMTP_HOST` | evet | Örn. `smtp.gmail.com`. Tanımlı değilse e-posta gönderimi kapalıdır. |
| `SMTP_PORT` | hayır | Varsayılan `587`. |
| `SMTP_SECURE` | hayır | 465 numaralı port kullanılıyorsa `true`. |
| `SMTP_USER` | evet | Gönderen hesabın adresi. |
| `SMTP_PASS` | evet | **Uygulama şifresi** — hesabın kendi şifresi değil. |
| `SMTP_FROM` | hayır | Görünen gönderen, örn. `"CEZERİ ROBOTECH" <kayit@cezerirobotech.com>`. |
| `KAYIT_ALICI` | hayır | Formların düşeceği adres. Tanımsızsa `lib/seo/site.ts` içindeki kurum e-postası kullanılır. |

### Gmail ile kullanım

Gmail, hesabın kendi şifresiyle SMTP bağlantısı kabul etmez. Sırasıyla:

1. Google hesabında **iki adımlı doğrulamayı** açın.
2. Google Hesabı → Güvenlik → **Uygulama şifreleri**'nden yeni bir şifre üretin.
3. Bu 16 haneli şifreyi `SMTP_PASS` olarak verin:

```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=cezerirobotech@gmail.com
SMTP_PASS=<uygulama-sifresi>
SMTP_FROM="CEZERİ ROBOTECH" <cezerirobotech@gmail.com>
KAYIT_ALICI=cezerirobotech@gmail.com
```

Vercel'de: proje → Settings → Environment Variables. Değişkenler **Production**
ve **Preview** ortamlarının ikisine de eklenmeli, sonra yeniden dağıtım yapılmalı.

> Bu değerler depoya İŞLENMEZ. Uygulama şifresi bir sırdır; `.env` dosyası
> `.gitignore` altındadır ve öyle kalmalıdır.

---

## WhatsApp neden PDF taşımıyor?

Bir web sayfası `wa.me` bağlantısıyla WhatsApp'a yalnızca **metin**
geçirebilir; dosya iliştiremez. Aynı sınır `mailto:` için de geçerlidir. Bu bir
eksik uygulama değil, platformun kendi sınırıdır.

Bu yüzden akış şöyle kuruldu:

- **PDF** → e-postayla merkeze (tam belge, imzalanmaya hazır).
- **WhatsApp düğmesi** → özet bilgiyi metin olarak açar (anında haber).
- Veli isterse indirdiği PDF'i sohbete kendi ekleyebilir.

Arayüzde bu durum açıkça yazılıdır; gizlenmedi.

---

## Belge dili neden hep Türkçe?

Form dört dilde doldurulabilir ama **PDF her zaman Türkçe** üretilir:

1. İmzalanan belge kurumun kayıt dilinde olmalıdır; eğitmenin ve muhasebenin
   okuyamadığı bir sözleşme arşivde işe yaramaz.
2. PDF kitaplığı **Arapça metin şekillendirme** (harf birleştirme, sağdan sola
   sıralama) yapmaz. Arapça bir PDF harfleri kopuk ve ters sırada basardı.

Velinin kendi dilinde okuduğu sözleşme metni **ekranda** durur ve her dilde
"Türkçe metin esastır" notu görünür.

Velinin yazdığı değerler (ad, adres) Arap harfleri içerirse PDF'in yazı takımı
bunları kodlayamaz ve temizler; belgeye bu durumu bildiren bir not düşülür.
**Ham değer kaybolmaz** — e-posta gövdesi tüm alanları olduğu gibi taşır.

---

## KVKK notu

Form; alerji, hastalık ve fobi bilgisi topluyor. Bunlar 6698 sayılı kanunun
6. maddesi kapsamında **özel nitelikli kişisel veridir** ve işlenmeleri için
genel sözleşme onayından **ayrı bir açık rıza** gerekir.

Bu yüzden:

- Sağlık alanlarından biri doldurulduğunda **ayrı bir onay kutusu** çıkar.
- O onay verilmeden form gönderilemez (hem tarayıcıda hem sunucuda kontrol edilir).
- Sağlık verisi girilmediyse bu onay hiç sorulmaz.

Fotoğraf/video kullanımı da açık bir itiraz seçeneğine dönüştürüldü; kâğıt
formda "itirazınız varsa belirtiniz" diye serbest bırakılmıştı.

---

## Bakım

| Ne değişti | Nereye dokunulur |
|---|---|
| Sözleşme maddesi metni | `apps/web/src/lib/i18n/kayit.ts` — dört dilde birden |
| Form alanı eklendi/çıkarıldı | `apps/web/src/lib/kayit/schema.ts`, sonra form ve PDF |
| Seçilebilir program listesi | Kendiliğinden gelir: `lib/seo/site.ts` (disiplinler) + `lib/seo/curriculum.ts` (programlar) |
| PDF düzeni | `apps/web/src/lib/kayit/pdf.ts` |
| PDF yazı takımı karakter kümesi | `apps/web/src/lib/kayit/fonts.ts` — `fontTools.subset` ile yeniden üretilir |

### Bilinen açık

Müfredat programlarının adları (`Blok Tabanlı Kodlama…` vb.) henüz yalnızca
Türkçe; diğer dillerde de Türkçe görünürler. Olmayan bir çeviriyi uydurmak
yerine kaynaktaki ad gösteriliyor.
