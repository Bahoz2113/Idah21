import nodemailer, { type Transporter } from "nodemailer";
import type { ContactLead, EmailProvider } from "./index";

/**
 * Kullanıcıdan gelen metni HTML gövdesine gömmeden önce kaçırır.
 * Başvuru formu herkese açıktır; kaçırılmamış girdi, e-postayı okuyan
 * kurum çalışanına karşı HTML enjeksiyonu vektörü oluşturur.
 */
function esc(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

const BRAND = "CEZERİ Education OS";

function wrap(title: string, bodyHtml: string): string {
  return `<!doctype html><html lang="tr"><body style="margin:0;padding:0;background:#f4f6f8;font-family:Arial,Helvetica,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="padding:32px 0;">
<tr><td align="center">
<table width="480" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;">
<tr><td style="background:#0f2a4a;padding:20px 32px;">
<span style="color:#fff;font-size:18px;font-weight:bold;">${BRAND}</span>
</td></tr>
<tr><td style="padding:32px;">
<h2 style="margin:0 0 12px;color:#0f2a4a;font-size:20px;">${title}</h2>
${bodyHtml}
</td></tr>
<tr><td style="padding:16px 32px;background:#f4f6f8;color:#8a94a3;font-size:12px;">
Bu e-postayı siz talep etmediyseniz güvenle görmezden gelebilirsiniz. Hiçbir zaman bu kodu telefonla veya mesajla kimseyle paylaşmayın.
</td></tr>
</table>
</td></tr>
</table>
</body></html>`;
}

function codeBlock(code: string): string {
  return `<div style="margin:20px 0;text-align:center;">
<span style="display:inline-block;letter-spacing:8px;font-size:32px;font-weight:bold;color:#0f2a4a;background:#eef2f7;padding:14px 24px;border-radius:8px;">${code}</span>
</div><p style="color:#5b6472;font-size:14px;">Bu kod <b>10 dakika</b> geçerlidir ve yalnızca bir kez kullanılabilir.</p>`;
}

export class SmtpEmailProvider implements EmailProvider {
  private transporter: Transporter;
  private from: string;

  constructor() {
    this.from = process.env.SMTP_FROM ?? `"${BRAND}" <no-reply@cezeri.local>`;
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT ?? 587),
      secure: process.env.SMTP_SECURE === "true",
      auth: process.env.SMTP_USER
        ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
        : undefined,
    });
  }

  private async send(to: string, subject: string, html: string) {
    await this.transporter.sendMail({ from: this.from, to, subject, html });
  }

  async sendEmailVerificationCode(email: string, code: string, fullName?: string) {
    const hi = fullName ? `Merhaba ${fullName},` : "Merhaba,";
    await this.send(
      email,
      "Hesap Doğrulama Kodunuz — CEZERİ Education OS",
      wrap("Hesabınızı doğrulayın", `<p style="color:#5b6472;">${hi}</p><p style="color:#5b6472;">İlk kurulumunuzu tamamlamak için aşağıdaki kodu girin:</p>${codeBlock(code)}`)
    );
  }

  async sendLoginVerificationCode(email: string, code: string, fullName?: string) {
    const hi = fullName ? `Merhaba ${fullName},` : "Merhaba,";
    await this.send(
      email,
      "Giriş Doğrulama Kodunuz — CEZERİ Education OS",
      wrap("Giriş doğrulama kodu", `<p style="color:#5b6472;">${hi}</p><p style="color:#5b6472;">Sisteme giriş yapabilmek için aşağıdaki kodu girin:</p>${codeBlock(code)}`)
    );
  }

  async sendPasswordResetCode(email: string, code: string, fullName?: string) {
    const hi = fullName ? `Merhaba ${fullName},` : "Merhaba,";
    await this.send(
      email,
      "Şifre Sıfırlama Kodunuz — CEZERİ Education OS",
      wrap("Şifre sıfırlama", `<p style="color:#5b6472;">${hi}</p><p style="color:#5b6472;">Şifrenizi sıfırlamak için aşağıdaki kodu girin. Bu isteği siz yapmadıysanız hesabınız için hemen yöneticinize bildirin.</p>${codeBlock(code)}`)
    );
  }

  async sendSecurityAlert(email: string, message: string, fullName?: string) {
    const hi = fullName ? `Merhaba ${fullName},` : "Merhaba,";
    await this.send(
      email,
      "Güvenlik Uyarısı — CEZERİ Education OS",
      wrap("Güvenlik uyarısı", `<p style="color:#5b6472;">${hi}</p><p style="color:#5b6472;">${message}</p>`)
    );
  }

  async sendContactLead(to: string, lead: ContactLead) {
    const rows: [string, string][] = [
      ["Veli / İlgili", lead.parentName],
      ["Telefon", lead.phone],
      ["E-posta", lead.email ?? "—"],
      ["Öğrenci yaşı", lead.studentAge],
      ["İlgi alanı", lead.interest],
      ["Mesaj", lead.message ?? "—"],
    ];

    const table = rows
      .map(
        ([k, v]) =>
          `<tr><td style="padding:8px 12px;color:#8a94a3;font-size:13px;white-space:nowrap;">${esc(k)}</td>` +
          `<td style="padding:8px 12px;color:#0f2a4a;font-size:14px;font-weight:600;">${esc(v)}</td></tr>`,
      )
      .join("");

    await this.send(
      to,
      `Yeni Başvuru: ${lead.parentName} — Aday Mühendis Uçuş İzin Formu`,
      wrap(
        "Yeni aday mühendis başvurusu",
        `<p style="color:#5b6472;">Tanıtım sitesindeki başvuru formundan yeni bir kayıt geldi.</p>
         <table cellpadding="0" cellspacing="0" style="width:100%;border-collapse:collapse;margin-top:12px;">${table}</table>`,
      ),
    );
  }
}
