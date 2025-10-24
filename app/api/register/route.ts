import { NextResponse } from "next/server";
import { adminAuth, adminDatabase } from "@/lib/firebase-admin";

export async function POST(req: Request) {
    try {
        const { email, password, username } = await req.json();

        // 1️⃣ Create user in Firebase Authentication
        const userRecord = await adminAuth.createUser({
            email,
            password,
            displayName: username,
        });

        const uid = userRecord.uid;

        // 2️⃣ Store additional info in Realtime Database
        await adminDatabase.ref(`users/${uid}`).set({
            coins: 0,
            currentStoryLevel: 1,
            email,
            gems: 0,
            enabled: true,
            disabledReason: "",
            termsAndConditions: false,
            userId: uid,
            username,
        });

        return NextResponse.json({ success: true, uid }, { status: 200 });
    } catch (error: any) {
        console.error("Registration error:", error);
        return NextResponse.json(
            { error: error.message || "Failed to register user" },
            { status: 500 }
        );
    }
}
