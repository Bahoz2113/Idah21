import { NextResponse } from "next/server";
import { getEmailProvider } from "@cezeri/email";
import { isLocale } from "@/lib/i18n/config";
import { basvuruNo, parseBasvuru, validate, type KayitBasvurusu } from "@/lib/kayit/schema";
import { pdfLogo } from "@/lib/kayit/logo";
import { kayitPdfUret } from "@/lib/kayit/pdf";
import { programAdiTr, programSecenekleri } from "@/lib/kayit/programlar";
import { contact, org } from "@/lib/seo/site";

/**
 * KAYIT FORMU UÇ NOKTASI.
 *
 * Akış: doğrula → PDF üret → merkeze e-postayla gönder → PDF'i tarayıcıya
 * da geri ver. Veli formu doldurduğunda hem merkezin gelen kutusunda
 * imzalanmaya hazır bir belge olur hem velinin elinde kendi kopyası kalır.
 *
 * NEDEN SUNUCUDA PDF. Tarayıcıda üretilseydi belgenin içeriğini istemci
 * belirlerdi; merkeze gelen kâğıdın forma uyduğunun hiçbir garantisi
 * olmazdı. Sözleşme metni ve düzen sunucuda, tek yerde durur.
 *
 * "GÖNDERİLDİ" YALANI YOK. SMTP yapılandırılmamışsa uç nokta 503 döner ve
 * arayüz veliyi WhatsApp'a yönlendirir. Sessizce başarılı dönseydi veli
 * kaydını yaptığını sanır, merkeze hiçbir şey ulaşmazdı — bu formda en
 * pahalı hata budur.
 */

// nodemailer ve pdf-lib Node çalışma zamanı ister; Edge'de çalışmaz.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Kaba oran sınırı — aynı IP'den arka arkaya gönderimi frenler.
 *
 * Bellekte tutulur ve sunucusuz ortamda her örnek kendi sayacını taşır;
 * bu yüzden kesin bir kota DEĞİL, tek örnek üzerinden gelen sel akınına
 * karşı ilk baraj. Gerçek koruma bot tuzağı ve zorunlu alanlardır.
 */
const PENCERE_MS = 60_000;
const PENCERE_LIMIT = 3;
const sayac = new Map<string, { adet: number; sifirla: number }>();

function oranAsildi(ip: string): boolean {
  const simdi = Date.now();
  const kayit = sayac.get(ip);
  if (!kayit || simdi > kayit.sifirla) {
    sayac.set(ip, { adet: 1, sifirla: simdi + PENCERE_MS });
    return false;
  }
  kayit.adet += 1;
  // Harita sınırsız büyümesin: pencere dolduğunda eski kayıtlar süpürülür.
  if (sayac.size > 500) {
    for (const [k, v] of sayac) if (simdi > v.sifirla) sayac.delete(k);
  }
  return kayit.adet > PENCERE_LIMIT;
}

function kacir(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/**
 * E-posta gövdesi.
 *
 * PDF basılabilir kayıttır; bu gövde ise HAM KAYITTIR. Velinin yazdığı her
 * karakter — Arapça ad, Kürtçe adres — burada olduğu gibi görünür. PDF'in
 * yazı takımı bazı karakterleri kodlayamayabilir; e-posta hiçbirini
 * kaybetmez, bu yüzden ikisi birlikte gönderiliyor.
 */
function epostaGovdesi(b: KayitBasvurusu, no: string, programlar: string[], dil: string) {
  const satir = (etiket: string, deger: string) =>
    deger
      ? `<tr><td style="padding:6px 12px 6px 0;color:#5b6472;font-size:13px;vertical-align:top;white-space:nowrap;">${kacir(etiket)}</td><td style="padding:6px 0;color:#0a191d;font-size:14px;font-weight:600;">${kacir(deger)}</td></tr>`
      : "";
  const eh = (v: boolean) => (v ? "Evet" : "Hayır");

  return `<!doctype html><html lang="tr"><body style="margin:0;background:#f4f6f8;font-family:Arial,Helvetica,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="padding:28px 0;"><tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:12px;overflow:hidden;">
<tr><td style="background:#0a191d;padding:18px 28px;">
<span style="color:#fff;font-size:16px;font-weight:bold;">${kacir(org.name)}</span>
<span style="color:#ff8c00;font-size:13px;"> — Yeni Kayıt Başvurusu</span>
</td></tr>
<tr><td style="padding:24px 28px;">
<p style="margin:0 0 4px;color:#5b6472;font-size:13px;">Başvuru No</p>
<p style="margin:0 0 18px;color:#0a191d;font-size:20px;font-weight:bold;">${kacir(no)}</p>
<p style="margin:0 0 18px;color:#5b6472;font-size:13px;">
İmzalanmaya hazır form ekte PDF olarak. Aşağıdaki tablo velinin yazdığı ham kayıttır.
Form <b>${kacir(dil)}</b> dilinde dolduruldu.</p>
<table cellpadding="0" cellspacing="0" width="100%">
${satir("Öğrenci", b.ogrenciAd)}
${satir("Doğum tarihi", b.dogumTarihi)}
${satir("Veli", b.veliAd)}
${satir("Telefon", b.telefon)}
${satir("E-posta", b.eposta)}
${satir("Adres", b.adres)}
${satir("Programlar", programlar.join(", "))}
${satir("Başlangıç", b.baslangicTarihi)}
${satir("Bitiş", b.bitisTarihi)}
${satir("Ödeme", b.odemeTuru === "pesin" ? "Peşin" : "Taksitli")}
${satir("Toplam tutar", b.toplamTutar)}
${satir("Taksit planı", b.taksitPlani)}
${satir("Alerji", `${eh(b.alerjiVar)}${b.alerjiVar ? ` — ${b.alerjiDetay}` : ""}`)}
${satir("Hastalık", `${eh(b.hastalikVar)}${b.hastalikVar ? ` — ${b.hastalikDetay}` : ""}`)}
${satir("Fobi", `${eh(b.fobiVar)}${b.fobiVar ? ` — ${b.fobiDetay}` : ""}`)}
${satir("Medya itirazı", b.medyaItiraz ? `VAR — ${b.medyaItirazDetay}` : "Yok")}
${satir("Şartlar onayı", eh(b.sartlarOnay))}
${satir("Sağlık verisi açık rızası", b.alerjiVar || b.hastalikVar || b.fobiVar ? eh(b.saglikRiza) : "Uygulanmadı")}
</table>
</td></tr>
<tr><td style="padding:14px 28px;background:#f4f6f8;color:#8a94a3;font-size:11px;">
Bu başvuru ${kacir(org.name)} tanıtım sitesindeki kayıt formundan geldi. Islak imza atölyede alınır.
</td></tr>
</table></td></tr></table></body></html>`;
}

export async function POST(req: Request) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "bilinmiyor";

  if (oranAsildi(ip)) {
    return NextResponse.json({ ok: false, hata: "oran" }, { status: 429 });
  }

  let ham: unknown;
  try {
    ham = await req.json();
  } catch {
    return NextResponse.json({ ok: false, hata: "govde" }, { status: 400 });
  }

  const basvuru = parseBasvuru(ham);

  // Bot tuzağı: gizli alan doldurulmuşsa istek bir betiktendir. Başarılı
  // dönüyoruz ki bot hangi kontrole takıldığını öğrenip uyarlamasın.
  if (basvuru.website) {
    return NextResponse.json({ ok: true, no: basvuruNo() });
  }

  const hatalar = validate(basvuru);
  if (Object.keys(hatalar).length > 0) {
    return NextResponse.json({ ok: false, hata: "dogrulama", hatalar }, { status: 422 });
  }

  const gelen = (ham ?? {}) as Record<string, unknown>;
  const dil = typeof gelen.locale === "string" && isLocale(gelen.locale) ? gelen.locale : "tr";

  // Program kimlikleri istemciden gelir; adları SUNUCUDAKİ listeden okunur.
  // İstemcinin gönderdiği adı basmak, forma istediğini yazdırmak demekti.
  const gecerliIdler = new Set(programSecenekleri.map((p) => p.id));
  const secilen = basvuru.programlar.filter((id) => gecerliIdler.has(id));
  if (secilen.length === 0) {
    return NextResponse.json(
      { ok: false, hata: "dogrulama", hatalar: { programlar: "programSecilmedi" } },
      { status: 422 },
    );
  }
  const programAdlari = secilen.map(programAdiTr);
  const no = basvuruNo();

  let pdf: Uint8Array;
  try {
    pdf = await kayitPdfUret({
      basvuru: { ...basvuru, programlar: secilen },
      no,
      programAdlari,
      logoPng: pdfLogo(),
    });
  } catch (e) {
    console.error("[kayit] PDF uretilemedi", e);
    return NextResponse.json({ ok: false, hata: "pdf" }, { status: 500 });
  }

  const posta = getEmailProvider();
  if (!posta.canDeliver) {
    console.error("[kayit] SMTP yapilandirilmamis; basvuru gonderilemedi", no);
    return NextResponse.json({ ok: false, hata: "postaYok" }, { status: 503 });
  }

  const alici = process.env.KAYIT_ALICI ?? contact.email;
  try {
    await posta.sendDocument({
      to: alici,
      replyTo: basvuru.eposta || undefined,
      subject: `Yeni kayıt başvurusu — ${basvuru.ogrenciAd} (${no})`,
      html: epostaGovdesi(basvuru, no, programAdlari, dil),
      attachments: [
        {
          filename: `kayit-formu-${no}.pdf`,
          content: pdf,
          contentType: "application/pdf",
        },
      ],
    });
  } catch (e) {
    console.error("[kayit] E-posta gonderilemedi", no, e);
    return NextResponse.json({ ok: false, hata: "posta" }, { status: 502 });
  }

  // PDF geri veriliyor ki velinin elinde de kendi kopyası kalsın.
  return NextResponse.json({
    ok: true,
    no,
    pdf: Buffer.from(pdf).toString("base64"),
  });
}
