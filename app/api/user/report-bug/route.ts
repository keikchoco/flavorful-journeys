import { NextResponse } from "next/server";
import { adminAuth, adminDatabase } from "@/lib/firebase-admin";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { idToken, title, description } = body;

    if (!idToken) {
      return NextResponse.json(
        { success: false, error: "Missing ID token" },
        { status: 400 }
      );
    }

    // Verify Firebase token
    const decoded = await adminAuth.verifyIdToken(idToken);
    const userId = decoded.uid;

    // ✅ CASE 1: Load existing reports
    if (!title || !description) {
      const snapshot = await adminDatabase
        .ref("bugReports")
        .orderByChild("userId")
        .equalTo(userId)
        .once("value");

      const reports: any[] = [];
      snapshot.forEach((child) => {
        reports.push({ id: child.key, ...child.val() });
      });

      // Sort newest first
      reports.sort((a, b) => b.date - a.date);

      return NextResponse.json({ success: true, reports });
    }

    // ✅ CASE 2: Submit new report
    const newReportRef = adminDatabase.ref("bugReports").push();
    const newReport = {
      userId,
      date: Date.now(), // ✅ Milliseconds timestamp
      category: title,
      description,
      status: "Pending",
    };

    await newReportRef.set(newReport);

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Error in /api/user/report-bug:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
