import { NextResponse } from 'next/server';
import { adminDatabase, adminAuth } from '@/lib/firebase-admin';

export async function POST(request: Request) {
  try {
    let idToken;
    
    try {
      const body = await request.json();
      idToken = body.idToken;
    } catch (parseError) {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }

    if (!idToken) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    // Verify Firebase Auth token
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    const userId = decodedToken.uid;

    // Get user data from database
    const userRef = adminDatabase.ref(`users/${userId}`);
    const userSnapshot = await userRef.once('value');
    
    let userData = null;
    if (userSnapshot.exists()) {
      userData = userSnapshot.val();
    }

    // Get user data from Firebase Auth as well
    const authUser = await adminAuth.getUser(userId);

    const profile = {
      uid: userId,
      email: authUser.email || userData?.email || '',
      displayName: authUser.displayName || userData?.name || '',
      needsPasswordReset: userData?.needsPasswordReset || false,
      createdAt: userData?.createdAt || authUser.metadata.creationTime,
      lastSignIn: authUser.metadata.lastSignInTime
    };

    return NextResponse.json({ 
      success: true,
      profile: profile
    });

  } catch (error) {
    console.error('Profile API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch profile data' },
      { status: 500 }
    );
  }
}