import { NextResponse } from "next/server";
import { adminDatabase } from "@/lib/firebase-admin";
import axios from "axios";


function sanitizeEmail(email: string) {
  return email.replace(/[.#$[\]@]/g, "_");
}
export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // ✅ Sanitize email for Firebase path
    const safeEmail = sanitizeEmail(email);
    const otpRef = adminDatabase.ref(`otps/${safeEmail}`);

    await otpRef.set({
      otp,
      createdAt: Date.now(),
    });

    // Send OTP email
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