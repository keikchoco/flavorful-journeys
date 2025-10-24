import { NextResponse } from 'next/server';
import { adminDatabase } from '@/lib/firebase-admin';

export async function POST(req: Request) {
    try {
        const { email, otp } = await req.json();
        const sanitizedEmail = email.replace(/[.#$[\]@]/g, "_");
        const otpRef = adminDatabase.ref(`otps/${sanitizedEmail}`);
        const snapshot = await otpRef.get();

        if (!snapshot.exists()) {
            return NextResponse.json({ error: "OTP not found or expired." }, { status: 400 });
        }

        const data = snapshot.val();
        const isExpired = Date.now() - data.createdAt > 5 * 60 * 1000; // 5 mins
        if (isExpired) {
            await otpRef.remove();
            return NextResponse.json({ error: "OTP expired." }, { status: 400 });
        }

        if (data.otp !== otp) {
            return NextResponse.json({ error: "Invalid OTP." }, { status: 400 });
        }

        // ✅ OTP is valid
        await otpRef.remove(); // clean up

        return NextResponse.json({ success: true }, { status: 200 });
    } catch (err) {
        console.error("Error verifying OTP:", err);
        return NextResponse.json({ error: "Failed to verify OTP." }, { status: 500 });
    }
}
