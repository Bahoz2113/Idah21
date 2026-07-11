/**
 * SMS katmanı — Twilio ile gerçek SMS, yoksa konsola yazar
 */

export function generateOTP(): string {
  return String(Math.floor(100000 + Math.random() * 900000));
}

export async function sendOTP(phone: string, code: string): Promise<void> {
  const hasCredentials =
    process.env.TWILIO_ACCOUNT_SID &&
    process.env.TWILIO_AUTH_TOKEN &&
    process.env.TWILIO_PHONE_NUMBER &&
    process.env.NEXT_PUBLIC_TWILIO_ENABLED === "true";

  if (!hasCredentials) {
    // Dev mod — konsola yaz
    console.log(`\n📱 [DEV] SMS OTP [${phone}]: ${code}\n`);
    return;
  }

  try {
    // Twilio trial hesabı: sadece onaylı numaralara SMS gönderebilir
    // Production'a geçince bu kısıtlama kalkar
    const twilio = (await import("twilio")).default;
    const client = twilio(
      process.env.TWILIO_ACCOUNT_SID!,
      process.env.TWILIO_AUTH_TOKEN!
    );
    await client.messages.create({
      body: `CEZERİ ROBOTECH doğrulama kodunuz: ${code}\nBu kodu kimseyle paylaşmayın. 10 dakika geçerlidir.`,
      from: process.env.TWILIO_PHONE_NUMBER!,
      to: phone,
    });
    console.log(`✅ SMS gönderildi: ${phone}`);
  } catch (err: any) {
    // Trial hesapta onaysız numaraya gönderim başarısız olur
    // Geliştirme için kodu konsola yaz
    console.error(`⚠️ SMS gönderilemedi (${phone}):`, err.message);
    console.log(`📱 [FALLBACK] OTP kodu: ${code}`);
  }
}
