import { adminAuth, adminDatabase } from './firebase-admin';

export async function checkUserIsAdmin(idToken: string): Promise<boolean> {
  try {
    // Verify the Firebase ID token
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    const userId = decodedToken.uid;

    // Check if user exists in admins collection in Realtime Database
    const adminRef = adminDatabase.ref(`admins/${userId}`);
    const snapshot = await adminRef.once('value');
    
    // If user doesn't exist in admins collection, they are NOT admin
    if (!snapshot.exists()) {
      return false;
    }
    
    // If user exists in admins collection, check if value is explicitly true
    const adminValue = snapshot.val();
    return adminValue === true;
  } catch (error) {
    console.error('Error checking admin status:', error);
    return false;
  }
}

export async function getUserFromToken(idToken: string) {
  try {
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    return decodedToken;
  } catch (error) {
    console.error('Error verifying token:', error);
    return null;
  }
}