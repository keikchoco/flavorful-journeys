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
    
    const topupHistory = [];

    if (transactionsSnapshot.exists()) {
      const transactions = transactionsSnapshot.val();
      
      // Process transactions and filter for topups/gem purchases
      for (const [transactionId, transaction] of Object.entries(transactions)) {
        const txn = transaction as any;
        
        // Include only "Gem" type transactions (topups/gem purchases)
        if (txn.type === 'Gem') {
          const price = txn.price || txn.gems || 0; // Use price, fallback to gems for backward compatibility
          const gems = txn.gems || txn.amount || 0; // Use gems, fallback to amount for backward compatibility
          
          if (price && gems) {
            // Format the date and time from timestamp or ISO string
            let formattedDate = 'Unknown Date';
            if (txn.dateCreated) {
              formattedDate = new Date(txn.dateCreated).toLocaleString();
            } else if (txn.createdAt) {
              formattedDate = new Date(txn.createdAt).toLocaleString();
            }

            topupHistory.push({
              id: transactionId,
              date: formattedDate,
              amount: `$${price.toFixed(2)}`, // Show price instead of amount
              gems: gems.toString(),
              transactionId: transactionId,
              rawDate: txn.dateCreated || new Date(txn.createdAt || 0).getTime()
            });
          }
        }
      }

      // Sort by date (most recent first)
      topupHistory.sort((a, b) => b.rawDate - a.rawDate);
    }

    return NextResponse.json({ 
      success: true,
      topupHistory: topupHistory
    });

  } catch (error) {
    console.error('Topup history API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch topup history' },
      { status: 500 }
    );
  }
}