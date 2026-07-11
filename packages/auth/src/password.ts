import bcrypt from "bcryptjs";

// Maliyet faktörü 12: güvenlik/performans dengesi (OWASP önerisi 10-12 arası)
const SALT_ROUNDS = 12;

export async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, SALT_ROUNDS);
}

export async function verifyPassword(plain: string, hash: string): Promise<boolean> {
  if (!hash) return false;
  return bcrypt.compare(plain, hash);
}

/** Şifre politikası: min 8 karakter, en az 1 harf + 1 rakam */
export function validatePasswordStrength(pw: string): string | null {
  if (pw.length < 8) return "Şifre en az 8 karakter olmalı";
  if (!/[a-zA-Z]/.test(pw)) return "Şifre en az bir harf içermeli";
  if (!/[0-9]/.test(pw)) return "Şifre en az bir rakam içermeli";
  return null;
}
