import { NextResponse } from 'next/server';
import { adminDatabase, adminAuth } from '@/lib/firebase-admin';

export async function POST(request: Request) {
  try {
    let idToken, newEmail;
    
    try {
      const body = await request.json();
      idToken = body.idToken;
      newEmail = body.newEmail;
    } catch (parseError) {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }

    if (!idToken || !newEmail) {
      return NextResponse.json({ error: 'ID token and new email are required' }, { status: 400 });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newEmail)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
    }

    // Verify Firebase Auth token
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    const userId = decodedToken.uid;

    // Check if email is already in use by another user
    try {
      const existingUser = await adminAuth.getUserByEmail(newEmail);
      if (existingUser.uid !== userId) {
        return NextResponse.json({ error: 'Email is already in use by another account' }, { status: 409 });
      }
    } catch (error: any) {
      // If getUserByEmail throws an error, it means the email doesn't exist, which is good
      if (error.code !== 'auth/user-not-found') {
        throw error;
      }
    }

    // Update email in Firebase Auth
    await adminAuth.updateUser(userId, {
      email: newEmail,
      emailVerified: false // Reset email verification when email changes
    });

    // Update email in database
    const userRef = adminDatabase.ref(`users/${userId}`);
    const userSnapshot = await userRef.once('value');
    
    if (userSnapshot.exists()) {
      await userRef.update({
        email: newEmail,
        updatedAt: new Date().toISOString()
      });
    } else {
      // Create user record if it doesn't exist
      await userRef.set({
        email: newEmail,
        name: decodedToken.name || 'User',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    }

    return NextResponse.json({ 
      success: true,
      message: 'Email updated successfully. Please verify your new email address.'
    });

  } catch (error) {
    console.error('Update email API error:', error);
    return NextResponse.json(
      { error: 'Failed to update email' },
      { status: 500 }
    );
  }
}