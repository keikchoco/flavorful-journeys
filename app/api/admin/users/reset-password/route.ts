import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, adminDatabase } from '@/lib/firebase-admin';
import axios from 'axios';

export async function POST(request: NextRequest) {
  try {
    const { idToken, userId, email, newPassword } = await request.json();

    if (!idToken || !userId || !newPassword) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Verify the Firebase ID token and check if user is admin
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    const adminUserId = decodedToken.uid;

    // Check if user is admin
    const adminRef = adminDatabase.ref(`admins/${adminUserId}`);
    const adminSnapshot = await adminRef.once('value');

    if (!adminSnapshot.exists() || adminSnapshot.val() !== true) {
      return NextResponse.json({ error: 'Access denied - not an admin' }, { status: 403 });
    }

    // Update user password in Firebase Auth
    await adminAuth.updateUser(userId, { password: newPassword });

    // Update user record in database
    const userRef = adminDatabase.ref(`users/${userId}`);
    await userRef.update({
      passwordResetAt: new Date().toISOString(),
      passwordResetBy: adminUserId,
      needsPasswordReset: true
    });

    // Send password email using Brevo
    await axios.post(
      'https://api.brevo.com/v3/smtp/email',
      {
        sender: { name: 'Flavorful Journeys', email: process.env.BREVO_SENDER },
        to: [{ email }],
        subject: 'Your Password Has Been Reset',
        htmlContent: `<p>Hello,</p>
                      <p>Your password has been reset by an admin. Your new password is: <b>${newPassword}</b></p>
                      <p>Please log in and change it as soon as possible.</p>`
      },
      {
        headers: {
          'api-key': process.env.BREVO_API_KEY!,
          'Content-Type': 'application/json'
        }
      }
    );

    return NextResponse.json({
      success: true,
      message: 'Password reset successfully and email sent'
    });

  } catch (error: any) {
    console.error('Error resetting password:', error);

    let errorMessage = 'Failed to reset password';
    if (error.code === 'auth/user-not-found') {
      errorMessage = 'User not found';
    } else if (error.code === 'auth/invalid-password') {
      errorMessage = 'Invalid password format';
    }

    return NextResponse.json({
      error: errorMessage
    }, { status: 500 });
  }
}
