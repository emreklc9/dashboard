import { NextResponse } from "next/server";
import { authenticateUser } from "@/lib/auth/users";
import { createSessionToken, setSessionCookie } from "@/lib/auth/session";
import { SESSION_MAX_AGE_SEC } from "@/lib/auth/constants";
import { verifyToken } from "@/lib/auth/jwt";
import type { SessionPayload } from "@/lib/auth/types";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { email?: string; password?: string };
    const email = body.email?.trim() ?? "";
    const password = body.password ?? "";

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "E-posta ve şifre gerekli." },
        { status: 400 }
      );
    }

    const user = authenticateUser(email, password);
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Geçersiz e-posta veya şifre." },
        { status: 401 }
      );
    }

    const token = await createSessionToken(user);
    const payload = await verifyToken<SessionPayload>(token);
    const expiresAt = payload
      ? new Date(payload.exp * 1000).toISOString()
      : new Date(Date.now() + SESSION_MAX_AGE_SEC * 1000).toISOString();

    const response = NextResponse.json({
      success: true,
      user,
      expiresAt,
      sessionHours: SESSION_MAX_AGE_SEC / 3600,
    });

    setSessionCookie(response, token);
    return response;
  } catch {
    return NextResponse.json(
      { success: false, message: "Giriş işlemi başarısız." },
      { status: 500 }
    );
  }
}
