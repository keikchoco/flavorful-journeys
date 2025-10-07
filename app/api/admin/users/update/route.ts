import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, adminDatabase } from '@/lib/firebase-admin';

export async function POST(request: NextRequest) {
  try {
    const { idToken, userId, action } = await request.json();

    if (!idToken || !userId || !action) {
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

    // Update user based on action
    const userRef = adminDatabase.ref(`users/${userId}`);
    
    switch (action) {
      case 'enable':
        await userRef.update({ enabled: true });
        break;
      case 'disable':
        await userRef.update({ enabled: false });
        break;
      case 'delete':
        // Actually delete the user from Firebase Auth and Database
        try {
          // Delete from Firebase Auth first
          await adminAuth.deleteUser(userId);
          // Then remove from database
          await userRef.remove();
        } catch (authError: any) {
          // If user doesn't exist in Auth, still remove from database
          if (authError.code === 'auth/user-not-found') {
            await userRef.remove();
          } else {
            throw authError;
          }
        }
        break;
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    return NextResponse.json({ 
      success: true,
      message: `User ${action}d successfully`
    });

  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json({ 
      error: 'Failed to update user'
    }, { status: 500 });
  }
}