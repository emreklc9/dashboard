import { NextResponse } from "next/server";
import { SESSION_COOKIE_NAME } from "@/lib/auth/constants";
import { getUserFromToken, getSessionExpiryIso, verifySessionToken } from "@/lib/auth/session";
import { cookies } from "next/headers";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  const user = await getUserFromToken(token);

  if (!user || !token) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  const payload = await verifySessionToken(token);
  const expiresAt = payload ? getSessionExpiryIso(payload) : null;

  return NextResponse.json({
    authenticated: true,
    user,
    expiresAt,
  });
}
