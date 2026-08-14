import type { EmailAttachment, EmailProvider } from "./index";

/**
 * SMTP yapılandırılmamışken kullanılan geliştirme sağlayıcısı.
 * Kodu gerçekten e-posta olarak GÖNDERMEZ — sunucu loguna yazar.
 * Bu sayede SMTP kurulmadan da akış test edilebilir, ama production'da
 * SMTP_HOST tanımlanmadan bırakılırsa bu durum loglarda açıkça görünür.
 */
export class ConsoleEmailProvider implements EmailProvider {
  readonly canDeliver = false;

  /**
   * Bilerek FIRLATIR, sessizce loglamaz. Doğrulama kodu akışında konsola
   * yazmak yeterlidir çünkü geliştirici kodu logdan okuyabilir; kayıt
   * formunda ise gönderilemeyen bir başvuru kaybolan bir müşteridir.
   * Çağıran taraf bu hatayı yakalayıp kullanıcıya başka bir kanal sunar.
   */
  async sendDocument(params: {
    to: string;
    subject: string;
    html: string;
    replyTo?: string;
    attachments?: EmailAttachment[];
  }): Promise<void> {
    throw new Error(
      `E-posta gonderilemedi: SMTP yapilandirilmamis (SMTP_HOST tanimli degil). ` +
        `Alici: ${params.to}, konu: ${params.subject}.`,
    );
  }

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
}
