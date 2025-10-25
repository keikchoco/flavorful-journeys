// /api/request-password-reset.ts
import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, adminDatabase } from '@/lib/firebase-admin';
import crypto from 'crypto';
import axios from 'axios';

export async function POST(request: NextRequest) {
    const { email } = await request.json();
    if (!email) return NextResponse.json({ error: 'Email is required' }, { status: 400 });

    try {
        // Get user by email
        const user = await adminAuth.getUserByEmail(email);
        const userId = user.uid;

        // Generate reset token
        const resetToken = crypto.randomBytes(32).toString('hex');
        const expiresAt = Date.now() + 3600_000; // 1 hour

        // Save token in database
        await adminDatabase.ref(`passwordResets/${userId}`).set({ resetToken, expiresAt });

        // Send email with reset link
        const resetLink = `https://flavorfuljourneys.fil-byte.com/reset-password?token=${resetToken}&uid=${userId}`;

        await axios.post(
            'https://api.brevo.com/v3/smtp/email',
            {
                sender: { name: 'Flavorful Journeys', email: process.env.BREVO_SENDER },
                to: [{ email }],
                subject: 'Reset Your Password',
                htmlContent: `<p>Hello,</p>
                    <p>Click the link below to reset your password:</p>
                    <a href="${resetLink}">${resetLink}</a>
                    <p>This link expires in 1 hour.</p>`
            },
            {
                headers: { 'api-key': process.env.BREVO_API_KEY!, 'Content-Type': 'application/json' }
            }
        );

        return NextResponse.json({ success: true, message: 'Check your email to reset your password.' });
    } catch (error: any) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to send reset email' }, { status: 500 });
    }
}
