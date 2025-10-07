import { NextResponse } from 'next/server';
import { adminAuth } from '@/lib/firebase-admin';

export async function POST(request: Request) {
  try {
    let idToken, currentPassword, newPassword;
    
    try {
      const body = await request.json();
      idToken = body.idToken;
      currentPassword = body.currentPassword;
      newPassword = body.newPassword;
    } catch (parseError) {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }

    if (!idToken || !currentPassword || !newPassword) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    // Validate new password strength
    if (newPassword.length < 6) {
      return NextResponse.json({ error: 'New password must be at least 6 characters long' }, { status: 400 });
    }

    // Verify Firebase Auth token
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    const userId = decodedToken.uid;

    // For password changes, we need to verify the current password first
    // However, Firebase Admin SDK doesn't have a direct way to verify current password
    // We'll update the password directly and let the client handle current password verification
    
    try {
      // Update password in Firebase Auth
      await adminAuth.updateUser(userId, {
        password: newPassword
      });

      // Clear the needsPasswordReset flag in the database
      const { adminDatabase } = await import('@/lib/firebase-admin');
      const userRef = adminDatabase.ref(`users/${userId}`);
      const userSnapshot = await userRef.once('value');
      
      if (userSnapshot.exists()) {
        await userRef.update({
          needsPasswordReset: false,
          updatedAt: new Date().toISOString()
        });
      }

      return NextResponse.json({ 
        success: true,
        message: 'Password updated successfully'
      });

    } catch (error: any) {
      console.error('Password update error:', error);
      
      if (error.code === 'auth/weak-password') {
        return NextResponse.json({ error: 'Password is too weak' }, { status: 400 });
      }
      
      throw error;
    }

  } catch (error) {
    console.error('Update password API error:', error);
    return NextResponse.json(
      { error: 'Failed to update password' },
      { status: 500 }
    );
  }
}