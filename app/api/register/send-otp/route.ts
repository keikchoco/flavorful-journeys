import { NextResponse } from "next/server";
import { adminAuth, adminDatabase } from "@/lib/firebase-admin";
import axios from "axios";

function sanitizeEmail(email: string) {
  return email.replace(/[.#$[\]@]/g, "_");
}

export async function POST(req: Request) {
  try {
    const { email, username } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // ✅ 1. Check if email already exists in Firebase Auth
    try {
      await adminAuth.getUserByEmail(email);
      return NextResponse.json(
        { error: "Email is already in use by another account." },
        { status: 400 }
      );
    } catch (err: any) {
      if (err.code !== "auth/user-not-found") throw err;
    }

    // ✅ 2. Check if username is already taken
    if (username) {
      const usersRef = adminDatabase.ref("users");
      const snapshot = await usersRef
        .orderByChild("username")
        .equalTo(username)
        .get();

      if (snapshot.exists()) {
        return NextResponse.json(
          { error: "Username is already taken by another user." },
          { status: 400 }
        );
      }
    }

    // ✅ 3. Generate OTP and save it
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const safeEmail = sanitizeEmail(email);
    const otpRef = adminDatabase.ref(`otps/${safeEmail}`);

    await otpRef.set({
      otp,
      createdAt: Date.now(),
    });

    // ✅ 4. Send OTP email
    await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      {
        sender: { name: "Flavorful Journeys", email: process.env.BREVO_SENDER },
        to: [{ email }],
        subject: "Your OTP Code",
        htmlContent: `<p>Your OTP code is <b>${otp}</b>. It expires in 5 minutes.</p>`,
      },
      {
        headers: {
          "api-key": process.env.BREVO_API_KEY!,
          "Content-Type": "application/json",
        },
      }
    );

    return NextResponse.json({ message: "OTP sent successfully!" });
  } catch (error: any) {
    console.error("Error sending OTP:", error);
    return NextResponse.json({ error: "Failed to send OTP" }, { status: 500 });
  }
}
