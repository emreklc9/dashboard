import { NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth/session";
import { calculateProfileCompletion } from "@/lib/profile/completion";
import { MOCK_ACTIVE_TASKS } from "@/lib/profile/mockTasks";
import { getProfileByUserId, updateProfileByUserId } from "@/lib/profile/store";
import type { ProfilePatch } from "@/lib/profile/types";

export async function GET() {
  const user = await getServerSession();
  if (!user) {
    return NextResponse.json({ success: false, message: "Oturum gerekli." }, { status: 401 });
  }

  const profile = getProfileByUserId(user.id);
  const completion = calculateProfileCompletion(profile);

  return NextResponse.json({
    success: true,
    profile,
    completion,
    activeTasks: MOCK_ACTIVE_TASKS,
  });
}

export async function PATCH(request: Request) {
  const user = await getServerSession();
  if (!user) {
    return NextResponse.json({ success: false, message: "Oturum gerekli." }, { status: 401 });
  }

  try {
    const body = (await request.json()) as ProfilePatch;
    const profile = updateProfileByUserId(user.id, body);
    if (!profile) {
      return NextResponse.json({ success: false, message: "Profil güncellenemedi." }, { status: 400 });
    }

    const completion = calculateProfileCompletion(profile);
    return NextResponse.json({ success: true, profile, completion });
  } catch {
    return NextResponse.json({ success: false, message: "Geçersiz istek." }, { status: 400 });
  }
}
