import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, adminDatabase } from '@/lib/firebase-admin';

export async function POST(request: NextRequest) {
  try {
    const { idToken } = await request.json();

    if (!idToken) {
      return NextResponse.json({ error: 'No token provided' }, { status: 400 });
    }

    // Verify the Firebase ID token and check if user is admin
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    const userId = decodedToken.uid;

    // Check if user is admin
    const adminRef = adminDatabase.ref(`admins/${userId}`);
    const adminSnapshot = await adminRef.once('value');
    
    if (!adminSnapshot.exists() || adminSnapshot.val() !== true) {
      return NextResponse.json({ error: 'Access denied - not an admin' }, { status: 403 });
    }

    // Fetch users from database
    const usersRef = adminDatabase.ref('users');
    const usersSnapshot = await usersRef.once('value');
    
    let users = [];
    if (usersSnapshot.exists()) {
      const usersData = usersSnapshot.val();
      users = Object.keys(usersData).map(uid => ({
        id: uid,
        name: usersData[uid].name || usersData[uid].displayName || 'Unknown',
        email: usersData[uid].email || 'No email',
        enabled: usersData[uid].enabled !== false, // default to true unless explicitly false
        ...usersData[uid] // include any additional user data
      }));
    }

    return NextResponse.json({ 
      users,
      success: true 
    });

  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch users',
      users: []
    }, { status: 500 });
  }
}