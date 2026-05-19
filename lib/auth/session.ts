import { cookies } from "next/headers";
import type { NextResponse } from "next/server";
import { SESSION_COOKIE_NAME, SESSION_MAX_AGE_SEC } from "./constants";
import { signToken, verifyToken } from "./jwt";
import type { AuthUser, SessionPayload } from "./types";

export async function createSessionToken(user: AuthUser): Promise<string> {
  return signToken(user, SESSION_MAX_AGE_SEC);
}

export async function verifySessionToken(token: string): Promise<SessionPayload | null> {
  const payload = await verifyToken<SessionPayload>(token);
  if (!payload?.email || !payload?.exp) return null;
  return payload;
}

export async function getUserFromToken(token: string | undefined): Promise<AuthUser | null> {
  if (!token) return null;
  const session = await verifySessionToken(token);
  if (!session) return null;
  return {
    id: session.id,
    email: session.email,
    name: session.name,
    role: session.role,
  };
}

export async function getServerSession(): Promise<AuthUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  return getUserFromToken(token);
}

export function setSessionCookie(response: NextResponse, token: string): void {
  response.cookies.set({
    name: SESSION_COOKIE_NAME,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE_SEC,
  });
}

export function clearSessionCookie(response: NextResponse): void {
  response.cookies.set({
    name: SESSION_COOKIE_NAME,
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}

export function getSessionExpiryIso(payload: SessionPayload): string {
  if (typeof payload.exp !== "number" || !Number.isFinite(payload.exp)) {
    return new Date(Date.now() + SESSION_MAX_AGE_SEC * 1000).toISOString();
  }
  return new Date(payload.exp * 1000).toISOString();
}
