import { NextResponse } from 'next/server';
import { adminAuth, adminDatabase } from '@/lib/firebase-admin';

export async function POST(request: Request) {
  try {
    const { idToken } = await request.json();

    if (!idToken) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    // Verify Firebase Auth token
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    const uid = decodedToken.uid;

    // Check if user is admin
    const adminRef = adminDatabase.ref(`admins/${uid}`);
    const adminSnapshot = await adminRef.once('value');

    if (!adminSnapshot.exists()) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    // Fetch all transactions
    const transactionsRef = adminDatabase.ref('transactions');
    const transactionsSnapshot = await transactionsRef.once('value');
    
    if (!transactionsSnapshot.exists()) {
      return NextResponse.json({ 
        success: true, 
        transactions: [] 
      });
    }

    const transactionsData = transactionsSnapshot.val();
    
    // Fetch all users for mapping
    const usersRef = adminDatabase.ref('users');
    const usersSnapshot = await usersRef.once('value');
    
    const usersData = usersSnapshot.exists() ? usersSnapshot.val() : {};

    // Process transactions and add user data
    const transactions = [];
    
    for (const [transactionId, transaction] of Object.entries(transactionsData)) {
      const txn = transaction as any;
      
      // Find user data by userId
      const userData = usersData[txn.userId] || { name: 'Unknown User', username: 'Unknown User', email: 'unknown@example.com' };
      
      transactions.push({
        id: transactionId,
        userId: txn.userId,
        amount: txn.amount || 0,
        dateCreated: txn.dateCreated,
        price: txn.price || txn.gems || 0, // Use price if available, fallback to gems for backward compatibility
        item: txn.item || '',
        type: txn.type || 'Gem', // Default to 'Gem' for backward compatibility
        // Add user information
        username: userData.username || userData.name || 'Unknown User',
        userEmail: userData.email || 'unknown@example.com'
      });
    }

    // Sort by dateCreated (newest first)
    transactions.sort((a, b) => {
      const dateA = new Date(a.dateCreated || 0).getTime();
      const dateB = new Date(b.dateCreated || 0).getTime();
      return dateB - dateA;
    });

    return NextResponse.json({ 
      success: true, 
      transactions 
    });

  } catch (error) {
    console.error('Error fetching transactions:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch transactions' 
    }, { status: 500 });
  }
}