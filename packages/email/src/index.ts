/**
 * EmailProvider — soyut e-posta gönderim arayüzü.
 * SMTP ile başlar; ileride Resend/SendGrid eklenmek istenirse
 * bu interface'i implemente eden yeni bir sınıf yazılıp
 * getEmailProvider() içinde seçilmesi yeterlidir. Uygulamanın
 * geri kalanı hiçbir zaman nodemailer/Resend'i doğrudan bilmez.
 */
/** Tanıtım sitesindeki "Aday Mühendis Uçuş İzin Formu" başvurusu. */
export interface ContactLead {
  parentName: string;
  phone: string;
  email?: string;
  studentAge: string;
  interest: string;
  message?: string;
}

export interface EmailProvider {
  sendEmailVerificationCode(email: string, code: string, fullName?: string): Promise<void>;
  sendLoginVerificationCode(email: string, code: string, fullName?: string): Promise<void>;
  sendPasswordResetCode(email: string, code: string, fullName?: string): Promise<void>;
  sendSecurityAlert(email: string, message: string, fullName?: string): Promise<void>;
  /** Başvuruyu kuruma iletir. `to` kurumsal alıcı adresidir. */
  sendContactLead(to: string, lead: ContactLead): Promise<void>;
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
