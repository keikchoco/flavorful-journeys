import { NextResponse } from "next/server";
import { adminAuth, adminDatabase } from "@/lib/firebase-admin";

export async function POST(req: Request) {
  try {
    const { idToken } = await req.json();
    if (!idToken) {
      return NextResponse.json({ success: false, error: "Missing ID token" }, { status: 400 });
    }

    const decoded = await adminAuth.verifyIdToken(idToken);
    const userId = decoded.uid;

    // ✅ Update flag in Realtime Database
    await adminDatabase.ref(`users/${userId}`).update({
      needsPasswordReset: false,
    });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Error updating password flag:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
