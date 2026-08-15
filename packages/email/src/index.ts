/**
 * EmailProvider — soyut e-posta gönderim arayüzü.
 * SMTP ile başlar; ileride Resend/SendGrid eklenmek istenirse
 * bu interface'i implemente eden yeni bir sınıf yazılıp
 * getEmailProvider() içinde seçilmesi yeterlidir. Uygulamanın
 * geri kalanı hiçbir zaman nodemailer/Resend'i doğrudan bilmez.
 */
/** Bir e-postaya iliştirilecek dosya. */
export type EmailAttachment = {
  filename: string;
  content: Uint8Array;
  contentType: string;
};

export interface EmailProvider {
  /**
   * Sağlayıcı gerçekten e-posta gönderebiliyor mu?
   *
   * Kayıt formu gibi akışlar için ZORUNLU: SMTP yapılandırılmamışken
   * konsola yazan sağlayıcı devreye girer ve çağıran taraf, hiçbir şey
   * gönderilmediği hâlde "gönderildi" sanır. Veli formu doldurup gider,
   * merkeze hiçbir şey ulaşmaz. Bu bayrak sayesinde uç nokta açık bir
   * hata döndürüp kullanıcıyı WhatsApp'a yönlendirebiliyor.
   */
  readonly canDeliver: boolean;

  /** Serbest biçimli, ek dosya taşıyabilen gönderim. */
  sendDocument(params: {
    to: string;
    subject: string;
    html: string;
    replyTo?: string;
    attachments?: EmailAttachment[];
  }): Promise<void>;

  sendEmailVerificationCode(email: string, code: string, fullName?: string): Promise<void>;
  sendLoginVerificationCode(email: string, code: string, fullName?: string): Promise<void>;
  sendPasswordResetCode(email: string, code: string, fullName?: string): Promise<void>;
  sendSecurityAlert(email: string, message: string, fullName?: string): Promise<void>;
}

export { SmtpEmailProvider } from "./smtp";
export { ConsoleEmailProvider } from "./console";

import { SmtpEmailProvider } from "./smtp";
import { ConsoleEmailProvider } from "./console";

let cached: EmailProvider | null = null;

/**
 * Aktif e-posta sağlayıcısını döndürür.
 * SMTP_HOST tanımlıysa gerçek SMTP kullanılır; tanımlı değilse
 * (yerel geliştirme / henüz yapılandırılmamış prod) kodlar konsola
 * yazdırılır — hiçbir zaman sessizce "gönderildi" yalanı söylemez.
 */
export function getEmailProvider(): EmailProvider {
  if (cached) return cached;
  cached = process.env.SMTP_HOST
    ? new SmtpEmailProvider()
    : new ConsoleEmailProvider();
  return cached;
}
