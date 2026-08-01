// ─────────────────────────────────────────────────────────────
// Admin Session Token — HMAC-SHA256 Signed
//
// Why not JWT? Next.js Edge middleware cannot use Node.js crypto.
// This uses the Web Crypto API (available on Edge) to sign and
// verify tokens without a DB call in middleware.
//
// Token format:  base64url(payload) + "." + base64url(signature)
// Payload:       JSON of AdminSessionPayload
// Secret:        ADMIN_SESSION_SECRET env var (min 32 chars)
// ─────────────────────────────────────────────────────────────

import type { AdminSessionPayload } from "../domain/admin-user.types";
import { ADMIN_CONFIG } from "../config";

// ── Helpers ────────────────────────────────────────────────────

function b64url(buf: ArrayBuffer): string {
  return Buffer.from(buf)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");
}

function b64urlToBuffer(str: string): ArrayBuffer {
  const padded = str.replace(/-/g, "+").replace(/_/g, "/");
  const bin = atob(padded);
  const buf = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) buf[i] = bin.charCodeAt(i);
  return buf.buffer;
}

async function getKey(secret: string): Promise<CryptoKey> {
  const enc = new TextEncoder();
  return crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

// ── Public API ─────────────────────────────────────────────────

/**
 * Sign an AdminSessionPayload and return a compact token string.
 * Called after a successful admin login.
 */
export async function signAdminToken(
  payload: AdminSessionPayload
): Promise<string> {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error("ADMIN_SESSION_SECRET must be at least 32 characters");
  }

  const enc = new TextEncoder();
  const payloadStr = b64url(enc.encode(JSON.stringify(payload)).buffer as ArrayBuffer);
  const key = await getKey(secret);
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(payloadStr));
  return `${payloadStr}.${b64url(sig)}`;
}

/**
 * Verify a token string and return the payload.
 * Returns null if the signature is invalid or the token is expired.
 * Edge-runtime safe — uses Web Crypto only.
 */
export async function verifyAdminToken(
  token: string
): Promise<AdminSessionPayload | null> {
  try {
    const secret = process.env.ADMIN_SESSION_SECRET;
    if (!secret || secret.length < 32) return null;

    const [payloadStr, sigStr] = token.split(".");
    if (!payloadStr || !sigStr) return null;

    const enc = new TextEncoder();
    const key = await getKey(secret);
    const valid = await crypto.subtle.verify(
      "HMAC",
      key,
      b64urlToBuffer(sigStr),
      enc.encode(payloadStr)
    );
    if (!valid) return null;

    const dec = new TextDecoder();
    const payload: AdminSessionPayload = JSON.parse(
      dec.decode(b64urlToBuffer(payloadStr))
    );

    // Check expiry
    if (payload.exp < Math.floor(Date.now() / 1000)) return null;

    return payload;
  } catch {
    return null;
  }
}

/**
 * Build the AdminSessionPayload for a given admin user.
 * iat = now, exp = now + sessionDurationMs
 */
export function buildSessionPayload(
  admin: Pick<
    import("../domain/admin-user.types").AdminUser,
    "id" | "email" | "name" | "role"
  >
): AdminSessionPayload {
  const now = Math.floor(Date.now() / 1000);
  return {
    adminId: admin.id,
    email: admin.email,
    name: admin.name,
    role: admin.role,
    iat: now,
    exp: now + Math.floor(ADMIN_CONFIG.sessionDurationMs / 1000),
  };
}
