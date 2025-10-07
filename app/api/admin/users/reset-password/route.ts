import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, adminDatabase } from '@/lib/firebase-admin';

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
    await adminAuth.updateUser(userId, {
      password: newPassword
    });

    // Update user record in database
    const userRef = adminDatabase.ref(`users/${userId}`);
    await userRef.update({
      passwordResetAt: new Date().toISOString(),
      passwordResetBy: adminUserId,
      needsPasswordReset: true
    });

    return NextResponse.json({ 
      success: true,
      message: 'Password reset successfully'
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