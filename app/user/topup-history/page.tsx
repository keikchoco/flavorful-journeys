"use client";
import { useState, useEffect } from "react";
import { useAuthContext } from "@/contexts/AuthContext";

type Transaction = {
  id: string;
  date: string;
  amount: string;
  gems: string;
  transactionId: string;
};

export default function TopupHistoryPage() {
  const { user, loading } = useAuthContext();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && user) {
      loadTopupHistory();
    }
  }, [user, loading]);

  const loadTopupHistory = async () => {
    if (!user) return;
    
    try {
      setDataLoading(true);
      setError(null);
      
      const idToken = await user.getIdToken();
      
      const response = await fetch('/api/user/topup-history', {
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
        setTransactions(result.topupHistory);
      } else {
        setError(result.error || 'Failed to load topup history');
      }
    } catch (error) {
      console.error('Topup history loading error:', error);
      setError(error instanceof Error ? error.message : 'Failed to load topup history');
    } finally {
      setDataLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background layers */}
      <div
        className="fixed inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/assets/Loading Screen2.png')" }}
      />
      <div className="fixed inset-0 bg-[#8d4e1b]/30" />

      {/* Scrollable content */}
      <div className="relative z-10 h-screen overflow-y-auto px-4 sm:px-8 md:px-20 py-24">
        <section className="mx-auto max-w-5xl bg-[#E5E5E5] text-[#1B1B1B] rounded-xl p-10 flex flex-col gap-8">
          <h1 className="text-3xl sm:text-4xl font-bold">Top Up History</h1>

          {/* Loading State */}
          {loading && (
            <div className="text-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1B1B1B] mx-auto mb-4"></div>
              <p className="text-xl">Loading your account...</p>
            </div>
          )}

          {/* Not Logged In */}
          {!loading && !user && (
            <div className="text-center py-20">
              <h2 className="text-2xl font-bold mb-4">Please Log In</h2>
              <p className="text-lg">You need to be logged in to view your topup history.</p>
            </div>
          )}

          {/* Logged In User Content */}
          {!loading && user && (
            <>
              {/* Error Message */}
              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                  <p>{error}</p>
                  <button 
                    onClick={loadTopupHistory} 
                    className="mt-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
                  >
                    Retry
                  </button>
                </div>
              )}

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full border-collapse bg-white rounded-lg overflow-hidden text-left">
                  <thead className="bg-[#77dd76] text-[#1B1B1B] font-semibold">
                    <tr>
                      <th className="px-6 py-3 text-base">Date</th>
                      <th className="px-6 py-3 text-base">Amount</th>
                      <th className="px-6 py-3 text-base">Gems</th>
                      <th className="px-6 py-3 text-base">Transaction ID</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dataLoading ? (
                      // Loading rows
                      Array.from({ length: 3 }).map((_, i) => (
                        <tr key={i} className="bg-[#f9f9f9]">
                          <td className="px-6 py-3">
                            <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                          </td>
                          <td className="px-6 py-3">
                            <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                          </td>
                          <td className="px-6 py-3">
                            <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                          </td>
                          <td className="px-6 py-3">
                            <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                          </td>
                        </tr>
                      ))
                    ) : transactions.length === 0 ? (
                      // No transactions message
                      <tr>
                        <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                          <div className="flex flex-col items-center">
                            <p className="text-lg font-semibold mb-2">No topup history found</p>
                            <p className="text-sm">Your topup transactions will appear here once you make a purchase.</p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      // Actual transactions
                      transactions.map((t, i) => (
                        <tr
                          key={t.id}
                          className={`${
                            i % 2 === 0 ? "bg-[#f9f9f9]" : "bg-[#e8f7e9]"
                          } hover:bg-[#fa9130]/20 transition`}
                        >
                          <td className="px-6 py-3">{t.date}</td>
                          <td className="px-6 py-3 font-semibold">{t.amount}</td>
                          <td className="px-6 py-3 text-blue-600 font-semibold">{t.gems} gems</td>
                          <td className="px-6 py-3 font-mono text-sm">{t.transactionId}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Refresh Button */}
              {!dataLoading && transactions.length > 0 && (
                <div className="text-center">
                  <button
                    onClick={loadTopupHistory}
                    disabled={dataLoading}
                    className="bg-[#77dd76] hover:bg-[#4ca54b] text-[#1B1B1B] px-6 py-2 rounded font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    Refresh
                  </button>
                </div>
              )}
            </>
          )}
        </section>
      </div>
    </div>
  );
}
