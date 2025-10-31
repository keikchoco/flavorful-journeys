import { NextResponse } from "next/server";
import { adminAuth, adminDatabase } from "@/lib/firebase-admin";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { idToken } = body as { idToken?: string };

    if (!idToken) {
      return NextResponse.json(
        { success: false, error: "Missing ID token" },
        { status: 400 }
      );
    }

    // Verify token
    const decoded = await adminAuth.verifyIdToken(idToken);
    if (!decoded) {
      return NextResponse.json(
        { success: false, error: "Invalid ID token" },
        { status: 401 }
      );
    }

    // Require admin claim (adjust to your app's claim key if different)
    // const isAdmin = decoded.admin === true || decoded.role === "admin";
    // if (!isAdmin) {
    //   return NextResponse.json(
    //     { success: false, error: "Unauthorized — Admin access only" },
    //     { status: 403 }
    //   );
    // }

    // Fetch all bug reports from RTDB
    const snapshot = await adminDatabase.ref("bugReports").once("value");
    if (!snapshot.exists()) {
      return NextResponse.json({ success: true, reports: [] });
    }

    const bugReports = snapshot.val() as Record<string, any>;
    const reports: any[] = [];

    // Collect unique userIds (skip falsy)
    const userIdSet = new Set<string>();
    Object.values(bugReports).forEach((r: any) => {
      if (r?.userId) userIdSet.add(r.userId);
    });
    const userIds = Array.from(userIdSet);

    // Fetch users in parallel
    const userFetches = userIds.map(async (uid) => {
      const userSnap = await adminDatabase.ref(`users/${uid}`).once("value");
      return { uid, info: userSnap.val() || {} };
    });
    const userDataArray = await Promise.all(userFetches);

    const userMap: Record<string, any> = {};
    userDataArray.forEach(({ uid, info }) => {
      userMap[uid] = info;
    });

    // Helper to normalize date -> ISO string
    const toISO = (r: any) => {
      const candidates = [r.dateCreated, r.date, r.createdAt, r.timestamp];
      for (const c of candidates) {
        if (!c && c !== 0) continue;
        if (typeof c === "string") {
          // try parse
          const d = new Date(c);
          if (!isNaN(d.getTime())) return d.toISOString();
        }
        if (typeof c === "number") {
          const d = new Date(c);
          if (!isNaN(d.getTime())) return d.toISOString();
        }
      }
      return new Date().toISOString();
    };

    // Map status to expected values if necessary
    const mapStatus = (s: any) => {
      if (!s) return "Open";
      const str = String(s);
      if (["open", "Open", "pending", "Pending"].includes(str)) return "Pending";
      if (["inprogress", "in progress", "In Progress", "InProgress"].includes(str)) return "In Progress";
      if (["resolved", "Resolved"].includes(str)) return "Resolved";
      return str;
    };

    // Build final reports array matching client BugReport shape
    Object.entries(bugReports).forEach(([id, report]: [string, any]) => {
      const userInfo = userMap[report.userId] || {};
      reports.push({
        id,
        userId: report.userId || "",
        username: userInfo.username || userInfo.name || "Unknown User",
        email: userInfo.email || "",
        dateCreated: toISO(report),
        category: report.category || "General",
        description: report.description || "",
        status: mapStatus(report.status),
      });
    });

    // Sort newest first
    reports.sort(
      (a, b) => new Date(b.dateCreated).getTime() - new Date(a.dateCreated).getTime()
    );

    return NextResponse.json({ success: true, reports });
  } catch (err: any) {
    console.error("Error in /api/admin/bug-reports:", err);
    return NextResponse.json(
      { success: false, error: err?.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}