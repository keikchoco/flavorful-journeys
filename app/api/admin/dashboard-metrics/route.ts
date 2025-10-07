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

    // Fetch total players from users collection
    const usersRef = adminDatabase.ref('users');
    const usersSnapshot = await usersRef.once('value');
    
    let totalPlayers = 0;
    if (usersSnapshot.exists()) {
      const usersData = usersSnapshot.val();
      totalPlayers = Object.keys(usersData).length;
    }

    // Fetch total income from transactions collection
    const transactionsRef = adminDatabase.ref('transactions');
    const transactionsSnapshot = await transactionsRef.once('value');
    
    let totalIncome = 0;
    if (transactionsSnapshot.exists()) {
      const transactionsData = transactionsSnapshot.val();
      Object.values(transactionsData).forEach((transaction: any) => {
        if (transaction.amount && typeof transaction.amount === 'number') {
          totalIncome += transaction.amount;
        }
      });
    }

    return NextResponse.json({ 
      totalPlayers,
      totalIncome,
      success: true 
    });

  } catch (error) {
    console.error('Error fetching dashboard metrics:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch dashboard metrics',
      totalPlayers: 0,
      totalIncome: 0 
    }, { status: 500 });
  }
}