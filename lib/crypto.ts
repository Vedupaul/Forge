import crypto from "node:crypto";
import { env } from "@/lib/env";

function getKey() {
  const raw = env.TOKEN_ENCRYPTION_KEY ?? env.AUTH_SECRET;
  if (!raw) {
    throw new Error("TOKEN_ENCRYPTION_KEY or AUTH_SECRET is required for token encryption.");
  }

  if (/^[a-f0-9]{64}$/i.test(raw)) {
    return Buffer.from(raw, "hex");
  }

  const base64 = Buffer.from(raw, "base64");
  if (base64.length === 32) {
    return base64;
  }

  return crypto.createHash("sha256").update(raw).digest();
}

export function encryptSecret(value: string) {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", getKey(), iv);
  const encrypted = Buffer.concat([cipher.update(value, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return [iv.toString("base64"), tag.toString("base64"), encrypted.toString("base64")].join(".");
}

export function decryptSecret(value: string) {
  const [iv, tag, encrypted] = value.split(".");
  if (!iv || !tag || !encrypted) {
    throw new Error("Encrypted value is malformed.");
  }

  const decipher = crypto.createDecipheriv("aes-256-gcm", getKey(), Buffer.from(iv, "base64"));
  decipher.setAuthTag(Buffer.from(tag, "base64"));
  return Buffer.concat([
    decipher.update(Buffer.from(encrypted, "base64")),
    decipher.final(),
  ]).toString("utf8");
}
