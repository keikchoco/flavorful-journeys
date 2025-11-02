import { NextResponse } from "next/server";
import { adminAuth, adminDatabase } from "@/lib/firebase-admin";

export async function POST(req: Request) {
    try {
        const { email, password, username } = await req.json();

        // ✅ 1. Check if email is already registered
        let existingUserByEmail = null;
        try {
            existingUserByEmail = await adminAuth.getUserByEmail(email);
        } catch (error) {
            // getUserByEmail throws if user not found — that’s okay
        }

        if (existingUserByEmail) {
            return NextResponse.json(
                { error: "Email is already in use." },
                { status: 400 }
            );
        }

        // ✅ 2. Check if username already exists in Realtime Database
        const usernameSnapshot = await adminDatabase
            .ref("users")
            .orderByChild("username")
            .equalTo(username)
            .once("value");

        if (usernameSnapshot.exists()) {
            return NextResponse.json(
                { error: "Username is already taken." },
                { status: 400 }
            );
        }

        // ✅ 3. Create the new user
        const userRecord = await adminAuth.createUser({
            email,
            password,
            displayName: username,
        });

        const uid = userRecord.uid;

        // ✅ 4. Store additional info in Realtime Database
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
