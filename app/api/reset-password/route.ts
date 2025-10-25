// /api/reset-password.ts
import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, adminDatabase } from '@/lib/firebase-admin';

export async function POST(request: NextRequest) {
    try {
        const { uid, token, newPassword } = await request.json();

        if (!uid || !token || !newPassword) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Get token data from Firebase
        const snapshot = await adminDatabase.ref(`passwordResets/${uid}`).once('value');
        const data = snapshot.val();

        if (!data) {
            return NextResponse.json({ error: 'Invalid or expired token' }, { status: 400 });
        }

        const { resetToken, expiresAt } = data;

        if (resetToken !== token || Date.now() > expiresAt) {
            return NextResponse.json({ error: 'Invalid or expired token' }, { status: 400 });
        }

        // Update user password in Firebase Auth
        await adminAuth.updateUser(uid, { password: newPassword });

        // Delete the token so it can't be reused
        await adminDatabase.ref(`passwordResets/${uid}`).remove();

        return NextResponse.json({ success: true, message: 'Password reset successfully' });
    } catch (error: any) {
        console.error('Reset password error:', error);
        return NextResponse.json({ error: 'Failed to reset password' }, { status: 500 });
    }
}
