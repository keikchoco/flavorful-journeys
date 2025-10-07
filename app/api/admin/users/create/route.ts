import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, adminDatabase } from '@/lib/firebase-admin';

export async function POST(request: NextRequest) {
  try {
    const { idToken, name, email } = await request.json();

    if (!idToken || !name || !email) {
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

    // Generate a random temporary password
    const generateRandomPassword = () => {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      let password = '';
      for (let i = 0; i < 8; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return password;
    };

    const tempPassword = generateRandomPassword();

    // Create user in Firebase Auth
    const userRecord = await adminAuth.createUser({
      email: email.trim(),
      displayName: name.trim(),
      password: tempPassword,
    });

    // Add user to Realtime Database
    const userRef = adminDatabase.ref(`users/${userRecord.uid}`);
    await userRef.set({
      name: name.trim(),
      email: email.trim(),
      enabled: true,
      createdAt: new Date().toISOString(),
      createdBy: adminUserId,
      needsPasswordReset: true
    });

    return NextResponse.json({ 
      success: true,
      message: 'User created successfully',
      userId: userRecord.uid,
      tempPassword: tempPassword
    });

  } catch (error: any) {
    console.error('Error creating user:', error);
    
    let errorMessage = 'Failed to create user';
    if (error.code === 'auth/email-already-exists') {
      errorMessage = 'Email already exists';
    } else if (error.code === 'auth/invalid-email') {
      errorMessage = 'Invalid email address';
    }
    
    return NextResponse.json({ 
      error: errorMessage
    }, { status: 500 });
  }
}