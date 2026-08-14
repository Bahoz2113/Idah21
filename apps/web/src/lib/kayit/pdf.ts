import fontkit from "@pdf-lib/fontkit";
import { PDFDocument, rgb, type PDFFont, type PDFPage, type PDFImage } from "pdf-lib";
import { kayitStrings } from "@/lib/i18n/kayit";
import { contact, org } from "@/lib/seo/site";
import { pdfFontBold, pdfFontRegular } from "./fonts";
import type { KayitBasvurusu } from "./schema";

/**
 * KAYIT FORMU PDF ÜRETİCİSİ.
 *
 * Çıktı, kurucunun kâğıt formunun doldurulmuş hâlidir: aynı bölüm sırası,
 * aynı madde metinleri, en sonda ıslak imza için boş bırakılmış alan.
 * Amaç kurucunun çıktı alıp imzalatabilmesi olduğu için düzen ekranda değil
 * A4'te doğru olacak biçimde ölçülendi.
 *
 * BELGE DİLİ TÜRKÇE. Form dört dilde doldurulabilir ama PDF her zaman
 * Türkçe düzenlenir. İki sebep:
 *   1. İmzalanan belge kurumun kayıt dilinde olmalı; eğitmenin ve muhasebenin
 *      okuyamadığı bir sözleşme arşivde işe yaramaz.
 *   2. `pdf-lib` Arapça METİN ŞEKİLLENDİRME (harf birleştirme ve sağdan sola
 *      sıralama) yapmaz. Arapça bir PDF harfleri kopuk ve ters sırada
 *      basardı — okunaksız bir sözleşme, olmayan bir sözleşmeden kötüdür.
 * Velinin kendi dilinde okuduğu metin ekranda durur; `governingNote` hangi
 * metnin esas olduğunu her dilde söyler.
 *
 * VELİNİN YAZDIĞI DEĞERLER. Ad, adres ve açıklamalar velinin klavyesinden
 * gelir ve Arap harfleri içerebilir. Gömülü font bunları kodlayamaz, bu
 * yüzden `guvenliMetin` desteklenmeyen karakterleri temizler ve yerine bir
 * not düşer. HAM DEĞER KAYBOLMAZ: e-posta gövdesi tüm alanları olduğu gibi
 * taşır (HTML her yazıyı doğru çizer), PDF yalnızca basılabilir kayıttır.
 */

const A4 = { w: 595.28, h: 841.89 };
const KENAR = 48;
const GENISLIK = A4.w - KENAR * 2;

const SIYAH = rgb(0.06, 0.1, 0.11);
const GRI = rgb(0.42, 0.46, 0.48);
const CIZGI = rgb(0.78, 0.81, 0.82);
const TURUNCU = rgb(1, 0.55, 0);

/** Gömülü fontun kodlayabildiği karakterler dışındakileri ayıklar. */
function guvenliMetin(font: PDFFont, ham: string): { metin: string; kirpildi: boolean } {
  let kirpildi = false;
  let cikti = "";
  for (const ch of ham) {
    if (ch === "\n" || ch === "\r") {
      cikti += " ";
      continue;
    }
    try {
      font.encodeText(ch);
      cikti += ch;
    } catch {
      kirpildi = true;
    }
  }
  return { metin: cikti.replace(/\s+/g, " ").trim(), kirpildi };
}

/**
 * `2015-04-12` → `12.04.2015`.
 *
 * Tarih girdisi tarayıcıdan ISO biçiminde gelir; kâğıda basılan belge ise
 * Türkçe okunur. Ham hâliyle bırakılsaydı imzalanacak formda gün ve ay
 * ters okunabilirdi — `2015-04-12` bir okuru 4 Aralık'a da götürebilir.
 */
function trTarih(iso: string): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  return m ? `${m[3]}.${m[2]}.${m[1]}` : iso;
}

/** Metni verilen genişliğe göre satırlara böler. */
function satirla(font: PDFFont, metin: string, boyut: number, genislik: number): string[] {
  if (!metin) return [""];
  const kelimeler = metin.split(" ");
  const satirlar: string[] = [];
  let aktif = "";

  for (const k of kelimeler) {
    const aday = aktif ? `${aktif} ${k}` : k;
    if (font.widthOfTextAtSize(aday, boyut) <= genislik) {
      aktif = aday;
      continue;
    }
    if (aktif) satirlar.push(aktif);
    // Tek başına sığmayan kelime (uzun e-posta, adres) karakter karakter kırılır.
    if (font.widthOfTextAtSize(k, boyut) > genislik) {
      let parca = "";
      for (const ch of k) {
        if (font.widthOfTextAtSize(parca + ch, boyut) > genislik) {
          satirlar.push(parca);
          parca = ch;
        } else parca += ch;
      }
      aktif = parca;
    } else aktif = k;
  }
  if (aktif) satirlar.push(aktif);
  return satirlar;
}

/** Sayfa akışını yöneten küçük yazıcı: y takibi ve sayfa taşması. */
class Yazici {
  private page: PDFPage;
  private y = A4.h - KENAR;
  readonly pages: PDFPage[] = [];

  constructor(
    private doc: PDFDocument,
    private normal: PDFFont,
    private kalin: PDFFont,
  ) {
    this.page = doc.addPage([A4.w, A4.h]);
    this.pages.push(this.page);
  }

  private yerAc(gereken: number) {
    if (this.y - gereken >= KENAR + 24) return;
    this.page = this.doc.addPage([A4.w, A4.h]);
    this.pages.push(this.page);
    this.y = A4.h - KENAR;
  }

  bosluk(h: number) {
    this.yerAc(h);
    this.y -= h;
  }

  get sayfa() {
    return this.page;
  }
  get imlec() {
    return this.y;
  }

  cizgi(renk = CIZGI) {
    this.yerAc(10);
    this.y -= 6;
    this.page.drawLine({
      start: { x: KENAR, y: this.y },
      end: { x: KENAR + GENISLIK, y: this.y },
      thickness: 0.75,
      color: renk,
    });
    this.y -= 10;
  }

  bolumBasligi(no: string, baslik: string) {
    this.yerAc(34);
    this.y -= 18;
    this.page.drawText(no, {
      x: KENAR,
      y: this.y,
      size: 10,
      font: this.kalin,
      color: TURUNCU,
    });
    this.page.drawText(baslik, {
      x: KENAR + this.kalin.widthOfTextAtSize(no, 10) + 8,
      y: this.y,
      size: 10.5,
      font: this.kalin,
      color: SIYAH,
    });
    this.y -= 6;
    this.page.drawLine({
      start: { x: KENAR, y: this.y },
      end: { x: KENAR + GENISLIK, y: this.y },
      thickness: 1,
      color: TURUNCU,
    });
    this.y -= 12;
  }

  /** Etiket + değer satırı. Değer boşsa kâğıttaki gibi çizgi bırakılır. */
  alan(etiket: string, deger: string) {
    const etiketBoyut = 8.5;
    const degerBoyut = 10;
    const etiketW = 168;
    const degerW = GENISLIK - etiketW;
    const satirlar = deger ? satirla(this.normal, deger, degerBoyut, degerW) : [""];
    const yukseklik = Math.max(16, satirlar.length * 13 + 4);

    this.yerAc(yukseklik);
    const ust = this.y;

    this.page.drawText(etiket, {
      x: KENAR,
      y: ust - 9,
      size: etiketBoyut,
      font: this.normal,
      color: GRI,
    });

    satirlar.forEach((s, i) => {
      const sy = ust - 9 - i * 13;
      if (s) {
        this.page.drawText(s, {
          x: KENAR + etiketW,
          y: sy,
          size: degerBoyut,
          font: this.kalin,
          color: SIYAH,
        });
      } else {
        // Boş alan: elle doldurulabilsin diye kâğıttaki gibi çizgi.
        this.page.drawLine({
          start: { x: KENAR + etiketW, y: sy - 2 },
          end: { x: KENAR + GENISLIK, y: sy - 2 },
          thickness: 0.6,
          color: CIZGI,
        });
      }
    });

    this.y = ust - yukseklik;
  }

  /** Onay kutusu + metin. İşaretliyse kutunun içine çarpı çizilir. */
  kutu(isaretli: boolean, metin: string, boyut = 9) {
    const metinW = GENISLIK - 18;
    const satirlar = satirla(this.normal, metin, boyut, metinW);
    const yukseklik = satirlar.length * 12 + 6;
    this.yerAc(yukseklik);
    const ust = this.y;

    const kx = KENAR;
    const ky = ust - 10;
    this.page.drawRectangle({
      x: kx,
      y: ky,
      width: 9,
      height: 9,
      borderWidth: 0.9,
      borderColor: SIYAH,
    });
    if (isaretli) {
      this.page.drawLine({
        start: { x: kx + 1.6, y: ky + 1.6 },
        end: { x: kx + 7.4, y: ky + 7.4 },
        thickness: 1.3,
        color: SIYAH,
      });
      this.page.drawLine({
        start: { x: kx + 7.4, y: ky + 1.6 },
        end: { x: kx + 1.6, y: ky + 7.4 },
        thickness: 1.3,
        color: SIYAH,
      });
    }

    satirlar.forEach((s, i) => {
      this.page.drawText(s, {
        x: KENAR + 18,
        y: ust - 9 - i * 12,
        size: boyut,
        font: this.normal,
        color: SIYAH,
      });
    });

    this.y = ust - yukseklik;
  }

  madde(metin: string, boyut = 8.5) {
    const metinW = GENISLIK - 14;
    const satirlar = satirla(this.normal, metin, boyut, metinW);
    const yukseklik = satirlar.length * 11 + 3;
    this.yerAc(yukseklik);
    const ust = this.y;

    this.page.drawCircle({ x: KENAR + 3.5, y: ust - 6, size: 1.5, color: TURUNCU });
    satirlar.forEach((s, i) => {
      this.page.drawText(s, {
        x: KENAR + 14,
        y: ust - 9 - i * 11,
        size: boyut,
        font: this.normal,
        color: SIYAH,
      });
    });
    this.y = ust - yukseklik;
  }

  altBaslik(metin: string) {
    this.yerAc(20);
    this.y -= 14;
    this.page.drawText(metin, {
      x: KENAR,
      y: this.y,
      size: 9.5,
      font: this.kalin,
      color: SIYAH,
    });
    this.y -= 6;
  }

  not(metin: string, boyut = 7.5) {
    const satirlar = satirla(this.normal, metin, boyut, GENISLIK);
    const yukseklik = satirlar.length * 10 + 4;
    this.yerAc(yukseklik);
    const ust = this.y;
    satirlar.forEach((s, i) => {
      this.page.drawText(s, {
        x: KENAR,
        y: ust - 8 - i * 10,
        size: boyut,
        font: this.normal,
        color: GRI,
      });
    });
    this.y = ust - yukseklik;
  }

  /** İmza için boş satır — ıslak imza burada atılır. */
  imzaSatiri(etiket: string, genislik = 200) {
    this.yerAc(34);
    this.y -= 24;
    this.page.drawText(etiket, {
      x: KENAR,
      y: this.y,
      size: 9,
      font: this.normal,
      color: SIYAH,
    });
    const x0 = KENAR + this.normal.widthOfTextAtSize(etiket, 9) + 8;
    this.page.drawLine({
      start: { x: x0, y: this.y - 2 },
      end: { x: Math.min(x0 + genislik, KENAR + GENISLIK), y: this.y - 2 },
      thickness: 0.8,
      color: SIYAH,
    });
    this.y -= 10;
  }

  baslik(logo: PDFImage | null, no: string, tarih: string) {
    const ust = this.y;
    if (logo) {
      const boy = 46;
      this.page.drawImage(logo, {
        x: KENAR,
        y: ust - boy,
        width: boy,
        height: boy,
      });
    }
    const x = KENAR + (logo ? 58 : 0);
    this.page.drawText(org.name, {
      x,
      y: ust - 18,
      size: 15,
      font: this.kalin,
      color: SIYAH,
    });
    this.page.drawText("KAYIT VE KABUL FORMU", {
      x,
      y: ust - 34,
      size: 11,
      font: this.kalin,
      color: TURUNCU,
    });
    this.page.drawText(`${contact.address.full}  ·  ${contact.phoneDisplay}`, {
      x,
      y: ust - 46,
      size: 7.5,
      font: this.normal,
      color: GRI,
    });

    const sag = `Başvuru No: ${no}`;
    this.page.drawText(sag, {
      x: KENAR + GENISLIK - this.kalin.widthOfTextAtSize(sag, 8.5),
      y: ust - 18,
      size: 8.5,
      font: this.kalin,
      color: SIYAH,
    });
    const sag2 = `Tarih: ${tarih}`;
    this.page.drawText(sag2, {
      x: KENAR + GENISLIK - this.normal.widthOfTextAtSize(sag2, 8.5),
      y: ust - 31,
      size: 8.5,
      font: this.normal,
      color: GRI,
    });

    this.y = ust - 58;
    this.cizgi(TURUNCU);
  }
}

export type PdfGirdisi = {
  basvuru: KayitBasvurusu;
  no: string;
  /** Seçilen programların Türkçe adları — kimlik değil, okunur ad basılır. */
  programAdlari: string[];
  /** Sayfaya gömülecek logo (PNG). Yoksa başlık logosuz çizilir. */
  logoPng?: Uint8Array | null;
};

export async function kayitPdfUret({
  basvuru,
  no,
  programAdlari,
  logoPng,
}: PdfGirdisi): Promise<Uint8Array> {
  const t = kayitStrings("tr");
  const doc = await PDFDocument.create();
  doc.registerFontkit(fontkit);

  const normal = await doc.embedFont(pdfFontRegular(), { subset: true });
  const kalin = await doc.embedFont(pdfFontBold(), { subset: true });

  let logo: PDFImage | null = null;
  if (logoPng) {
    try {
      logo = await doc.embedPng(logoPng);
    } catch {
      logo = null; // Logo çizilemezse form yine de üretilir.
    }
  }

  const y = new Yazici(doc, normal, kalin);
  const tarih = new Date().toLocaleDateString("tr-TR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  let kirpilanVar = false;
  const g = (ham: string) => {
    const { metin, kirpildi } = guvenliMetin(normal, ham);
    if (kirpildi) kirpilanVar = true;
    return metin;
  };

  doc.setTitle(`${org.name} — Kayıt ve Kabul Formu (${no})`);
  doc.setAuthor(org.name);
  doc.setSubject("Kayıt ve Kabul Formu");
  doc.setCreationDate(new Date());

  y.baslik(logo, no, tarih);

  // ── 1
  y.bolumBasligi("1.", t.s1);
  y.alan(t.ogrenciAd, g(basvuru.ogrenciAd));
  y.alan(t.dogumTarihi, trTarih(basvuru.dogumTarihi));
  y.alan(t.veliAd, g(basvuru.veliAd));
  y.alan(t.telefon, g(basvuru.telefon));
  y.alan(t.eposta, g(basvuru.eposta));
  y.alan(t.adres, g(basvuru.adres));

  // ── 2
  y.bolumBasligi("2.", t.s2);
  y.alan(t.programlar, g(programAdlari.join(", ")));
  y.alan(t.baslangicTarihi, trTarih(basvuru.baslangicTarihi));
  y.alan(t.bitisTarihi, trTarih(basvuru.bitisTarihi));

  // ── 3
  y.bolumBasligi("3.", t.s3);
  y.alan(
    t.odemeTuru,
    basvuru.odemeTuru === "pesin" ? `${t.pesin}  ( X )` : `${t.taksitli}  ( X )`,
  );
  y.alan(t.toplamTutar, g(basvuru.toplamTutar));
  y.alan(t.taksitPlani, g(basvuru.taksitPlani));

  // ── 4
  y.bolumBasligi("4.", t.s4);
  y.alan(t.alerjiSoru, basvuru.alerjiVar ? t.evet : t.hayir);
  if (basvuru.alerjiVar) y.alan(t.alerjiDetay, g(basvuru.alerjiDetay));
  y.alan(t.hastalikSoru, basvuru.hastalikVar ? t.evet : t.hayir);
  if (basvuru.hastalikVar) y.alan(t.hastalikDetay, g(basvuru.hastalikDetay));
  y.alan(t.fobiSoru, basvuru.fobiVar ? t.evet : t.hayir);
  if (basvuru.fobiVar) y.alan(t.fobiDetay, g(basvuru.fobiDetay));

  // ── Şartlar (5–10). Numaralandırma kâğıt formla aynı sırayı korur.
  y.bolumBasligi("5–10.", t.sTerms);
  t.terms.forEach((blok, i) => {
    y.altBaslik(`${i + 5}. ${blok.title}`);
    blok.items.forEach((m) => y.madde(m));
  });

  y.bosluk(6);
  y.kutu(
    basvuru.medyaItiraz,
    basvuru.medyaItiraz
      ? `${t.medyaItiraz}: ${g(basvuru.medyaItirazDetay)}`
      : t.medyaItiraz,
  );

  // ── 11
  y.bolumBasligi("11.", t.s11);
  y.kutu(basvuru.sartlarOnay, t.sartlarOnay);
  if (basvuru.alerjiVar || basvuru.hastalikVar || basvuru.fobiVar) {
    y.bosluk(4);
    y.kutu(basvuru.saglikRiza, t.saglikRiza);
    y.not(t.saglikRizaNot);
  }

  y.bosluk(4);
  y.alan(t.veliAd, g(basvuru.veliAd));
  y.imzaSatiri("Tarih:", 160);
  y.imzaSatiri("İmza:", 220);
  y.not(t.imzaNot);

  if (kirpilanVar) {
    y.bosluk(6);
    y.not(
      "NOT: Bazı alanlar bu belgenin yazı takımının kodlayamadığı karakterler içeriyordu ve " +
        "PDF'te temizlendi. Alanların tam hâli forma eşlik eden e-postada yer alır.",
    );
  }

  // Altbilgi — her sayfada sayfa numarası ve başvuru no.
  const toplam = y.pages.length;
  y.pages.forEach((p, i) => {
    const alt = `${no}  ·  Sayfa ${i + 1}/${toplam}  ·  ${org.name}`;
    p.drawText(alt, {
      x: KENAR,
      y: 28,
      size: 7,
      font: normal,
      color: GRI,
    });
  });

  return doc.save();
}
