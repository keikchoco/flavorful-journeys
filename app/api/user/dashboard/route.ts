import { NextResponse } from 'next/server';
import { auth } from '@/utils/firebase.browser';
import { adminDatabase } from '@/lib/firebase-admin';

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

    // Verify Firebase Auth token on the server side
    const { adminAuth } = await import('@/lib/firebase-admin');
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    const userId = decodedToken.uid;

    // Get user data
    const userRef = adminDatabase.ref(`users/${userId}`);
    const userSnapshot = await userRef.once('value');
    
    let userData;
    if (userSnapshot.exists()) {
      userData = userSnapshot.val();
    } else {
      // Create basic user record if it doesn't exist
      userData = {
        name: decodedToken.name || 'User',
        email: decodedToken.email || '',
        gems: 0,
        createdAt: new Date().toISOString()
      };
      await userRef.set(userData);
    }

    // Get user transactions for total topup calculation
    const transactionsRef = adminDatabase.ref('transactions');
    const transactionsSnapshot = await transactionsRef.orderByChild('userId').equalTo(userId).once('value');
    
    let totalTopup = 0;
    let lastPurchasedItem = 'None';
    let gemsCount = 0;

    if (transactionsSnapshot.exists()) {
      const transactions = transactionsSnapshot.val();
      
      const transactionsList = Object.values(transactions).sort((a: any, b: any) => {
        // Handle both dateCreated (timestamp) and createdAt (ISO string)
        const aTime = a.dateCreated ? a.dateCreated : new Date(a.createdAt || 0).getTime();
        const bTime = b.dateCreated ? b.dateCreated : new Date(b.createdAt || 0).getTime();
        return bTime - aTime;
      });

      // Calculate total topup - since your transactions don't have type field,
      // we'll assume all transactions with amount are topups/purchases
      transactionsList.forEach((txn: any) => {
        // All transactions with amount are considered topups for total calculation
        if (txn.amount && typeof txn.amount === 'number') {
          totalTopup += txn.amount;
        }
      });

      // Get last purchased item
      const lastTransaction = transactionsList[0] as any;
      if (lastTransaction) {
        // Use the item field from your transaction structure
        if (lastTransaction.item) {
          if (lastTransaction.gems) {
            lastPurchasedItem = `${lastTransaction.gems} ${lastTransaction.item}`;
          } else {
            lastPurchasedItem = lastTransaction.item;
          }
        }
      }
    }

    // Calculate current gem balance from transactions and user data
    let calculatedGems = userData.gems || 0;
    
    // If user data doesn't have gems, calculate from transactions
    if (!userData.gems && transactionsSnapshot.exists()) {
      const transactions = transactionsSnapshot.val();
      const transactionsList = Object.values(transactions);
      
      // Sum up all gems from transactions
      transactionsList.forEach((txn: any) => {
        if (txn.gems && typeof txn.gems === 'number') {
          calculatedGems += txn.gems;
        }
      });
    }
    
    gemsCount = calculatedGems;

    const dashboardData = {
      username: userData.name || userData.username || decodedToken.name || 'User',
      email: userData.email || decodedToken.email,
      gemsCount: gemsCount,
      totalTopup: totalTopup.toFixed(2),
      lastPurchasedItem: lastPurchasedItem
    };



    return NextResponse.json({ 
      success: true,
      data: dashboardData
    });

  } catch (error) {
    console.error('Dashboard API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data' },
      { status: 500 }
    );
  }
}