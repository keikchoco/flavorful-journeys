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

    // Get user transactions
    const transactionsRef = adminDatabase.ref('transactions');
    const transactionsSnapshot = await transactionsRef.orderByChild('userId').equalTo(userId).once('value');
    
    const spendingHistory = [];

    if (transactionsSnapshot.exists()) {
      const transactions = transactionsSnapshot.val();
      
      // Process transactions and filter for item purchases (spending history)
      for (const [transactionId, transaction] of Object.entries(transactions)) {
        const txn = transaction as any;
        
        // Include only "Item" type transactions (spending on items)
        if (txn.type === 'Item') {
          // Format the date and time from timestamp or ISO string
          let formattedDate = 'Unknown Date';
          if (txn.dateCreated) {
            formattedDate = new Date(txn.dateCreated).toLocaleString();
          } else if (txn.createdAt) {
            formattedDate = new Date(txn.createdAt).toLocaleString();
          }

          spendingHistory.push({
            id: transactionId,
            date: formattedDate,
            item: txn.item || 'Unknown Item',
            currency: 'GEMS',
            price: txn.price?.toString() || txn.amount?.toString() || '0',
            transactionId: transactionId,
            rawDate: txn.dateCreated || new Date(txn.createdAt || 0).getTime()
          });
        }
      }

      // Sort by date (most recent first)
      spendingHistory.sort((a: any, b: any) => b.rawDate - a.rawDate);
    }

    return NextResponse.json({ 
      success: true,
      spendingHistory: spendingHistory
    });

  } catch (error) {
    console.error('Spending history API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch spending history' },
      { status: 500 }
    );
  }
}