import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, adminDatabase } from '@/lib/firebase-admin';

export async function POST(request: NextRequest) {
  try {
    const { idToken, userId, action, reason } = await request.json();

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
        // await adminAuth.updateUser(userId, { disabled: false });
        await userRef.update({
          enabled: true,
          disabledReason: null,
          disabledAt: null,
        });
        break;
      case 'disable':
        // await adminAuth.updateUser(userId, { disabled: true });
        await userRef.update({
          enabled: false,
          disabledReason: reason || 'No reason provided',
          disabledAt: new Date().toISOString(),
        });
        break;
      case 'delete':
        try {
          // Remove user from Firebase Auth
          await adminAuth.deleteUser(userId).catch((authError: any) => {
            if (authError.code !== 'auth/user-not-found') throw authError;
          });

          // Remove user from admins node if exists
          const userAdminRef = adminDatabase.ref(`admins/${userId}`);
          const userAdminSnapshot = await userAdminRef.once('value');
          if (userAdminSnapshot.exists()) {
            await userAdminRef.remove();
          }

          // Remove user from users node
          await userRef.remove();

        } catch (authError: any) {
          console.error('Error deleting user:', authError);
          return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 });
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