import { NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth/session";
import { changePassword } from "@/lib/profile/store";

export async function POST(request: Request) {
  const user = await getServerSession();
  if (!user) {
    return NextResponse.json({ success: false, message: "Oturum gerekli." }, { status: 401 });
  }

  try {
    const body = (await request.json()) as {
      currentPassword?: string;
      newPassword?: string;
      confirmPassword?: string;
    };

    const currentPassword = body.currentPassword ?? "";
    const newPassword = body.newPassword ?? "";
    const confirmPassword = body.confirmPassword ?? "";

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { success: false, message: "Tüm şifre alanları gerekli." },
        { status: 400 }
      );
    }

    if (newPassword !== confirmPassword) {
      return NextResponse.json(
        { success: false, message: "Yeni şifreler eşleşmiyor." },
        { status: 400 }
      );
    }

    const result = changePassword(user.id, currentPassword, newPassword);
    if (!result.ok) {
      return NextResponse.json({ success: false, message: result.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, message: "Şifre güncellendi (demo)." });
  } catch {
    return NextResponse.json({ success: false, message: "Geçersiz istek." }, { status: 400 });
  }
}
