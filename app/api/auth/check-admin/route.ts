import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, adminDatabase } from '@/lib/firebase-admin';

export async function POST(request: NextRequest) {
  try {
    const { idToken } = await request.json();

    if (!idToken) {
      return NextResponse.json({ 
        isAdmin: false, 
        error: 'No token provided',
        reason: 'missing_token'
      }, { status: 400 });
    }

    // Verify the Firebase ID token
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    const userId = decodedToken.uid;

    // Check if user exists in admins collection in Realtime Database
    const adminRef = adminDatabase.ref(`admins/${userId}`);
    const snapshot = await adminRef.once('value');
    
    let isAdmin = false;
    let reason = 'not_in_admin_collection';
    
    if (snapshot.exists()) {
      const adminValue = snapshot.val();
      if (adminValue === true) {
        isAdmin = true;
        reason = 'admin_verified';
      } else {
        reason = 'admin_value_not_true';
      }
    }

    return NextResponse.json({ 
      isAdmin, 
      userId, 
      email: decodedToken.email,
      reason,
      adminValue: snapshot.exists() ? snapshot.val() : null
    });

  } catch (error) {
    console.error('Error checking admin status:', error);
    return NextResponse.json({ 
      isAdmin: false, 
      error: 'Invalid token or server error',
      reason: 'token_verification_failed'
    }, { status: 401 });
  }
}