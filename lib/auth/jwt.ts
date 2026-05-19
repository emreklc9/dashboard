import { JWT_SECRET } from "./constants";

const encoder = new TextEncoder();

function base64UrlEncode(bytes: Uint8Array): string {
  let binary = "";
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary).replace(/\+/g, "-").replace(/_/g, "/").replace(/=+$/, "");
}

function base64UrlEncodeString(input: string): string {
  return base64UrlEncode(encoder.encode(input));
}

function base64UrlDecode(input: string): string {
  const pad = "=".repeat((4 - (input.length % 4)) % 4);
  const base64 = input.replace(/-/g, "+").replace(/_/g, "/") + pad;
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return new TextDecoder().decode(bytes);
}

async function getHmacKey() {
  return crypto.subtle.importKey(
    "raw",
    encoder.encode(JWT_SECRET),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

async function signSegment(data: string): Promise<string> {
  const key = await getHmacKey();
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(data));
  return base64UrlEncode(new Uint8Array(signature));
}

export async function signToken<T extends object>(
  payload: T,
  expiresInSeconds: number
): Promise<string> {
  const header = { alg: "HS256", typ: "JWT" };
  const now = Math.floor(Date.now() / 1000);
  const body = { ...payload, iat: now, exp: now + expiresInSeconds };

  const encodedHeader = base64UrlEncodeString(JSON.stringify(header));
  const encodedPayload = base64UrlEncodeString(JSON.stringify(body));
  const signingInput = `${encodedHeader}.${encodedPayload}`;
  const signature = await signSegment(signingInput);

  return `${signingInput}.${signature}`;
}

export async function verifyToken<T extends { exp?: number }>(
  token: string
): Promise<T | null> {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;

    const [encodedHeader, encodedPayload, signatureB64] = parts;
    const signingInput = `${encodedHeader}.${encodedPayload}`;

    const pad = "=".repeat((4 - (signatureB64.length % 4)) % 4);
    const sigBinary = atob(signatureB64.replace(/-/g, "+").replace(/_/g, "/") + pad);
    const signature = new Uint8Array(sigBinary.length);
    for (let i = 0; i < sigBinary.length; i++) signature[i] = sigBinary.charCodeAt(i);

    const key = await getHmacKey();
    const valid = await crypto.subtle.verify(
      "HMAC",
      key,
      signature,
      encoder.encode(signingInput)
    );
    if (!valid) return null;

    const payload = JSON.parse(base64UrlDecode(encodedPayload)) as T;
    if (typeof payload.exp === "number" && payload.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}
