import "server-only";
import { createCipheriv, createDecipheriv, randomBytes } from "node:crypto";
import { getEnv } from "@/lib/env";

/**
 * X access/refresh tokenlarini veritabanina yazmadan once sifrelemek icin.
 * AES-256-GCM: her sifrelemede rastgele IV, sonuc [iv(12) | authTag(16) | ciphertext]
 * olarak tek bir Buffer'da saklanir (x_accounts.access_token_encrypted bytea).
 * Token duz metni asla loglanmaz, hata mesajina yazilmaz (master prompt md. 23).
 */
const ALGO = "aes-256-gcm";

function getKey(): Buffer {
  const key = Buffer.from(getEnv().TOKEN_ENCRYPTION_KEY, "base64");
  if (key.length !== 32) {
    throw new Error("TOKEN_ENCRYPTION_KEY 32 byte (base64) olmali");
  }
  return key;
}

export function encryptToken(plaintext: string): Buffer {
  const iv = randomBytes(12);
  const cipher = createCipheriv(ALGO, getKey(), iv);
  const ciphertext = Buffer.concat([cipher.update(plaintext, "utf8"), cipher.final()]);
  const authTag = cipher.getAuthTag();
  return Buffer.concat([iv, authTag, ciphertext]);
}

export function decryptToken(encrypted: Buffer): string {
  const iv = encrypted.subarray(0, 12);
  const authTag = encrypted.subarray(12, 28);
  const ciphertext = encrypted.subarray(28);
  const decipher = createDecipheriv(ALGO, getKey(), iv);
  decipher.setAuthTag(authTag);
  const plaintext = Buffer.concat([decipher.update(ciphertext), decipher.final()]);
  return plaintext.toString("utf8");
}

/**
 * PostgREST uzerinden bytea kolonlari JSON'da "\x<hex>" bicimindeki metin
 * olarak gidip gelir (ham Buffer JSON'a serilestirilemez). Bu iki yardimci
 * encryptToken/decryptToken ciktisini bu bicime cevirir.
 */
export function bufferToPgBytea(buf: Buffer): string {
  return `\\x${buf.toString("hex")}`;
}

export function pgByteaToBuffer(value: string): Buffer {
  return Buffer.from(value.replace(/^\\x/, ""), "hex");
}
