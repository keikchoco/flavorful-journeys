"use client";
import { useState, useEffect } from "react";
import AdminRedirect from "@/components/AdminRedirect";
import { useAuthContext } from "@/contexts/AuthContext";

interface Transaction {
  id: string;
  date: string;
  item: string;
  currency: string;
  price: string;
  transactionId: string;
}

export default function UserSpendingHistoryPage() {
  const { user, loading } = useAuthContext();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && user) {
      loadSpendingHistory();
    }
  }, [user, loading]);

  const loadSpendingHistory = async () => {
    if (!user) return;
    
    try {
      setDataLoading(true);
      setError(null);
      
      const idToken = await user.getIdToken();
      
      const response = await fetch('/api/user/spending-history', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ idToken }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();

      if (result.success) {
        setTransactions(result.spendingHistory || []);
      } else {
        setError(result.error || 'Failed to load spending history');
      }
    } catch (error) {
      console.error('Spending history loading error:', error);
      setError(error instanceof Error ? error.message : 'Failed to load spending history');
    } finally {
      setDataLoading(false);
    }
  };

  // Show loading state while authentication is being checked
  if (loading) {
    return (
      <div className="bg-[#E5E5E5] rounded-xl shadow-lg p-8 md:p-12 mb-20">
        <div className="text-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1B1B1B] mx-auto mb-4"></div>
          <p className="text-xl">Loading spending history...</p>
        </div>
      </div>
    );
  }

  // Show message if user is not authenticated
  if (!user) {
    return (
      <div className="bg-[#E5E5E5] rounded-xl shadow-lg p-8 md:p-12 mb-20">
        <div className="text-center py-20">
          <h1 className="text-2xl font-bold mb-4">Please Log In</h1>
          <p className="text-lg">You need to be logged in to view your spending history.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <AdminRedirect />
      <div className="bg-[#E5E5E5] rounded-xl shadow-lg p-8 md:p-12 mb-20">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-[#1B1B1B] select-none">
            Spending History
          </h1>
          <button
            onClick={loadSpendingHistory}
            disabled={dataLoading}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-md text-sm font-semibold select-none hover:cursor-pointer transition"
          >
            {dataLoading ? "Loading..." : "Refresh"}
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-md">
            Error: {error}
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full border-collapse rounded-xl overflow-hidden">
            <thead className="bg-[#77dd76] text-[#1B1B1B] select-none">
              <tr>
                <th className="py-3 px-4 text-left">Date & Time</th>
                <th className="py-3 px-4 text-left">Item</th>
                <th className="py-3 px-4 text-left">Currency</th>
                <th className="py-3 px-4 text-left">Price</th>
                <th className="py-3 px-4 text-left">Transaction ID</th>
              </tr>
            </thead>

            <tbody>
              {dataLoading ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-gray-500">
                    <div className="flex items-center justify-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-500"></div>
                      Loading spending history...
                    </div>
                  </td>
                </tr>
              ) : transactions.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-gray-500">
                    No spending history found. You haven't purchased any items yet.
                  </td>
                </tr>
              ) : (
                transactions.map((t, i) => (
                  <tr
                    key={t.id}
                    className={`${
                      i % 2 === 0 ? "bg-[#f9f9f9]" : "bg-[#e8f7e9]"
                    } border-b border-gray-200`}
                  >
                    <td className="py-3 px-4">{t.date}</td>
                    <td className="py-3 px-4">{t.item}</td>
                    <td className="py-3 px-4">{t.currency}</td>
                    <td className="py-3 px-4">{t.price}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">{t.transactionId}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}