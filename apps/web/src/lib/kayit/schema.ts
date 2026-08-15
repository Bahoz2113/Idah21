/**
 * KAYIT VE KABUL FORMU — alan tanımları ve doğrulama.
 *
 * TEK KAYNAK. Aynı modül hem tarayıcıdaki forma hem sunucudaki uç noktaya
 * hizmet eder. İki yerde ayrı ayrı yazılsalardı er ya da geç ayrışırlardı:
 * tarayıcı bir alanı zorunlu sayarken sunucu boş kabul eder ve eksik form
 * PDF'e basılırdı.
 *
 * SUNUCU DOĞRULAMASI ZORUNLUDUR. Tarayıcıdaki kontrol yalnızca kullanıcıya
 * kolaylıktır; uç nokta herkese açıktır ve doğrudan istek atılabilir.
 * `validate()` sunucuda da çağrılır.
 *
 * KVKK — ÖZEL NİTELİKLİ VERİ. Alerji, hastalık ve fobi bilgisi 6698 sayılı
 * kanunun 6. maddesi kapsamında SAĞLIK VERİSİDİR ve işlenmesi için genel
 * sözleşme onayından AYRI bir açık rıza gerekir. Bu yüzden `saglikRiza`
 * ayrı bir onay kutusudur; sözleşme onayına gömülmedi. Aynı gerekçeyle
 * fotoğraf/video kullanımı da açık bir itiraz alanı taşır — kâğıt formda
 * "itirazınız varsa belirtiniz" diye geçen madde burada işaretlenebilir
 * bir seçime dönüştürüldü.
 */

export type OdemeTuru = "pesin" | "taksitli";

export type KayitBasvurusu = {
  // 1 — Genel bilgiler
  ogrenciAd: string;
  dogumTarihi: string;
  veliAd: string;
  telefon: string;
  eposta: string;
  adres: string;

  // 2 — Program detayları
  programlar: string[];
  baslangicTarihi: string;
  bitisTarihi: string;

  // 3 — Ödeme bilgileri
  odemeTuru: OdemeTuru;
  /** Velinin ödemeyi yapacağı gün — takvimden seçilir (ISO tarih). */
  odemeGunu: string;
  toplamTutar: string;
  taksitPlani: string;

  // 4 — Öğrenciye özel bilgiler
  alerjiVar: boolean;
  alerjiDetay: string;
  hastalikVar: boolean;
  hastalikDetay: string;
  fobiVar: boolean;
  fobiDetay: string;

  // 8 — Fotoğraf ve video kullanımı
  medyaItiraz: boolean;
  medyaItirazDetay: string;

  // 11 — Onay ve kabul
  sartlarOnay: boolean;
  saglikRiza: boolean;

  /** Bot tuzağı. Gerçek kullanıcı görmez; dolu gelirse istek sessizce düşer. */
  website?: string;
};

export const BOS_BASVURU: KayitBasvurusu = {
  ogrenciAd: "",
  dogumTarihi: "",
  veliAd: "",
  telefon: "",
  eposta: "",
  adres: "",
  programlar: [],
  baslangicTarihi: "",
  bitisTarihi: "",
  odemeTuru: "pesin",
  odemeGunu: "",
  toplamTutar: "",
  taksitPlani: "",
  alerjiVar: false,
  alerjiDetay: "",
  hastalikVar: false,
  hastalikDetay: "",
  fobiVar: false,
  fobiDetay: "",
  medyaItiraz: false,
  medyaItirazDetay: "",
  sartlarOnay: false,
  saglikRiza: false,
  website: "",
};

/** Doğrulama hatası anahtarları — metin karşılıkları dil sözlüğünde. */
export type HataAnahtari =
  | "zorunlu"
  | "telefonGecersiz"
  | "epostaGecersiz"
  | "tarihGecersiz"
  | "programSecilmedi"
  | "detayGerekli"
  | "onayGerekli"
  | "cokUzun";

export type Hatalar = Partial<Record<keyof KayitBasvurusu, HataAnahtari>>;

/** Alan başına üst sınır — hem PDF düzenini hem e-postayı korur. */
const SINIR: Partial<Record<keyof KayitBasvurusu, number>> = {
  ogrenciAd: 80,
  veliAd: 80,
  telefon: 32,
  eposta: 120,
  adres: 300,
  toplamTutar: 40,
  taksitPlani: 300,
  alerjiDetay: 400,
  hastalikDetay: 400,
  fobiDetay: 400,
  medyaItirazDetay: 400,
};

const TELEFON = /^[0-9 ()+\-.]{10,32}$/;
const EPOSTA = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const TARIH = /^\d{4}-\d{2}-\d{2}$/;

function gecerliTarih(v: string): boolean {
  if (!TARIH.test(v)) return false;
  const d = new Date(`${v}T00:00:00Z`);
  return !Number.isNaN(d.getTime()) && v === d.toISOString().slice(0, 10);
}

/**
 * Formu doğrular. Boş nesne dönerse form geçerlidir.
 *
 * Doğum tarihi için üst sınır BUGÜN: gelecekte doğmuş bir öğrenci kaydı
 * veri girişi hatasıdır ve kâğıda basıldığında fark edilmesi zordur.
 */
export function validate(f: KayitBasvurusu): Hatalar {
  const h: Hatalar = {};
  const bos = (v: string) => v.trim().length === 0;

  for (const [alan, sinir] of Object.entries(SINIR) as [keyof KayitBasvurusu, number][]) {
    const deger = f[alan];
    if (typeof deger === "string" && deger.length > sinir) h[alan] = "cokUzun";
  }

  if (bos(f.ogrenciAd)) h.ogrenciAd = "zorunlu";
  if (bos(f.veliAd)) h.veliAd = "zorunlu";
  if (bos(f.adres)) h.adres = "zorunlu";

  if (bos(f.telefon)) h.telefon = "zorunlu";
  else if (!TELEFON.test(f.telefon.trim())) h.telefon = "telefonGecersiz";

  // E-posta isteğe bağlıdır — kâğıt formda yok. Yazıldıysa geçerli olmalı.
  if (!bos(f.eposta) && !EPOSTA.test(f.eposta.trim())) h.eposta = "epostaGecersiz";

  if (bos(f.dogumTarihi)) h.dogumTarihi = "zorunlu";
  else if (!gecerliTarih(f.dogumTarihi) || f.dogumTarihi > new Date().toISOString().slice(0, 10))
    h.dogumTarihi = "tarihGecersiz";

  // Program listesi bilgilendirme amaçlıdır (kurucunun kararı):
  // veli işaretlemez, programlar kayıt sırasında merkezde belirlenir.
  // Bu yüzden burada seçim aranmaz.

  if (!bos(f.baslangicTarihi) && !gecerliTarih(f.baslangicTarihi))
    h.baslangicTarihi = "tarihGecersiz";
  if (!bos(f.bitisTarihi) && !gecerliTarih(f.bitisTarihi)) h.bitisTarihi = "tarihGecersiz";

  // Taksitli seçildiyse plan alanı boş bırakılamaz; kâğıt formda da öyle.
  if (f.odemeTuru === "taksitli" && bos(f.taksitPlani)) h.taksitPlani = "zorunlu";

  // Ödeme günü: geçmiş bir gün seçmek veri girişi hatasıdır. ISO biçimi
  // sözlük sıralı olduğu için dize karşılaştırması tarih karşılaştırmasıdır.
  if (bos(f.odemeGunu)) h.odemeGunu = "zorunlu";
  else if (!gecerliTarih(f.odemeGunu)) h.odemeGunu = "tarihGecersiz";
  else if (f.odemeGunu < new Date().toISOString().slice(0, 10)) h.odemeGunu = "tarihGecersiz";

  // "Evet" işaretlenip detay boş bırakılırsa kayıt eksik kalır ve eğitmen
  // sahada bilgisiz kalır. Sağlık alanlarında bunun bedeli yüksektir.
  if (f.alerjiVar && bos(f.alerjiDetay)) h.alerjiDetay = "detayGerekli";
  if (f.hastalikVar && bos(f.hastalikDetay)) h.hastalikDetay = "detayGerekli";
  if (f.fobiVar && bos(f.fobiDetay)) h.fobiDetay = "detayGerekli";
  if (f.medyaItiraz && bos(f.medyaItirazDetay)) h.medyaItirazDetay = "detayGerekli";

  if (!f.sartlarOnay) h.sartlarOnay = "onayGerekli";
  // Sağlık verisi girilmediyse açık rıza da aranmaz.
  if ((f.alerjiVar || f.hastalikVar || f.fobiVar) && !f.saglikRiza) h.saglikRiza = "onayGerekli";

  return h;
}

/**
 * Gelen ham gövdeyi güvenli bir başvuruya çevirir.
 *
 * Uç nokta herkese açık; gövdenin şekli hakkında hiçbir varsayım
 * yapılmıyor. Beklenmeyen alanlar düşürülür, tipi yanlış olanlar
 * varsayılana iner. `JSON.parse` sonucunu doğrudan kullanmak, tek bir
 * `null` alanda sunucuyu düşürmeye yeter.
 */
export function parseBasvuru(raw: unknown): KayitBasvurusu {
  const o = (raw ?? {}) as Record<string, unknown>;
  const s = (k: string) => (typeof o[k] === "string" ? (o[k] as string).trim() : "");
  const b = (k: string) => o[k] === true;

  return {
    ogrenciAd: s("ogrenciAd"),
    dogumTarihi: s("dogumTarihi"),
    veliAd: s("veliAd"),
    telefon: s("telefon"),
    eposta: s("eposta"),
    adres: s("adres"),
    programlar: Array.isArray(o.programlar)
      ? (o.programlar as unknown[]).filter((x): x is string => typeof x === "string").slice(0, 20)
      : [],
    baslangicTarihi: s("baslangicTarihi"),
    bitisTarihi: s("bitisTarihi"),
    odemeTuru: o.odemeTuru === "taksitli" ? "taksitli" : "pesin",
    odemeGunu: s("odemeGunu"),
    toplamTutar: s("toplamTutar"),
    taksitPlani: s("taksitPlani"),
    alerjiVar: b("alerjiVar"),
    alerjiDetay: s("alerjiDetay"),
    hastalikVar: b("hastalikVar"),
    hastalikDetay: s("hastalikDetay"),
    fobiVar: b("fobiVar"),
    fobiDetay: s("fobiDetay"),
    medyaItiraz: b("medyaItiraz"),
    medyaItirazDetay: s("medyaItirazDetay"),
    sartlarOnay: b("sartlarOnay"),
    saglikRiza: b("saglikRiza"),
    website: s("website"),
  };
}

/**
 * Başvuru numarası — kâğıt üstünde ve e-postada aynı kaydı işaret eder.
 * Tarih + kısa rastgele son ek; kişisel veri taşımaz.
 */
export function basvuruNo(d = new Date()): string {
  const p = (n: number) => String(n).padStart(2, "0");
  const gun = `${d.getFullYear()}${p(d.getMonth() + 1)}${p(d.getDate())}`;
  const ek = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `CR-${gun}-${ek}`;
}
