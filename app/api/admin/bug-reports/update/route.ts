import { NextResponse } from "next/server";
import { adminAuth, adminDatabase } from "@/lib/firebase-admin";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { idToken, reportId, status } = body;

    if (!idToken || !reportId || !status) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    const decoded = await adminAuth.verifyIdToken(idToken);
    const userId = decoded.uid;


    const reportRef = adminDatabase.ref(`bugReports/${reportId}`);
    const snapshot = await reportRef.once("value");

    if (!snapshot.exists()) {
      return NextResponse.json(
        { success: false, error: "Bug report not found" },
        { status: 404 }
      );
    }

    // ✅ Update status
    await reportRef.update({
      status,
      updatedBy: userId,
      updatedAt: Date.now(),
    });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Error in /api/admin/bug-reports/update:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
