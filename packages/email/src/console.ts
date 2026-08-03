import type { ContactLead, EmailProvider } from "./index";

/**
 * SMTP yapılandırılmamışken kullanılan geliştirme sağlayıcısı.
 * Kodu gerçekten e-posta olarak GÖNDERMEZ — sunucu loguna yazar.
 * Bu sayede SMTP kurulmadan da akış test edilebilir, ama production'da
 * SMTP_HOST tanımlanmadan bırakılırsa bu durum loglarda açıkça görünür.
 */
export class ConsoleEmailProvider implements EmailProvider {
  private log(kind: string, email: string, code: string) {
    // eslint-disable-next-line no-console
    console.warn(
      `\n[EMAIL - SMTP YAPILANDIRILMAMIŞ] ${kind}\n  Alıcı: ${email}\n  Kod:   ${code}\n  (Gerçek e-posta gönderilmedi — SMTP_HOST env değişkenini ayarlayın.)\n`
    );
  }
  async sendEmailVerificationCode(email: string, code: string) { this.log("Hesap doğrulama", email, code); }
  async sendLoginVerificationCode(email: string, code: string)  { this.log("Giriş doğrulama", email, code); }
  async sendPasswordResetCode(email: string, code: string)      { this.log("Şifre sıfırlama", email, code); }
  async sendSecurityAlert(email: string, message: string) {
    // eslint-disable-next-line no-console
    console.warn(`\n[EMAIL - SMTP YAPILANDIRILMAMIŞ] Güvenlik uyarısı\n  Alıcı: ${email}\n  Mesaj: ${message}\n`);
  }

  async sendContactLead(to: string, lead: ContactLead) {
    // Başvuru KAYBOLMAMALI: SMTP yokken bile tam kayıt loga düşer ki
    // yapılandırma eksikliği fark edilene kadar gelen talep izlenebilsin.
    // eslint-disable-next-line no-console
    console.warn(
      `\n[EMAIL - SMTP YAPILANDIRILMAMIŞ] Yeni başvuru (gönderilmedi)\n` +
        `  Alıcı:    ${to}\n` +
        `  Veli:     ${lead.parentName}\n` +
        `  Telefon:  ${lead.phone}\n` +
        `  E-posta:  ${lead.email ?? "—"}\n` +
        `  Yaş:      ${lead.studentAge}\n` +
        `  İlgi:     ${lead.interest}\n` +
        `  Mesaj:    ${lead.message ?? "—"}\n` +
        `  (SMTP_HOST env değişkenini ayarlayın.)\n`,
    );
  }
}
