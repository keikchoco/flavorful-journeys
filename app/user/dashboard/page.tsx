"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import AdminRedirect from "@/components/AdminRedirect";
import { useAuthContext } from "@/contexts/AuthContext";
import gems from "@/public/assets/gems.png";

export default function UserDashboardPage() {
  const { user, loading } = useAuthContext();
  const [dashboardData, setDashboardData] = useState({
    username: "Loading...",
    gemsCount: "Loading...",
    totalTopup: "Loading...",
    lastPurchasedItem: "Loading..."
  });
  const [dataLoading, setDataLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);


  useEffect(() => {
    if (!loading && user) {
      loadDashboardData();
    }
  }, [user, loading]);

  const loadDashboardData = async () => {
    if (!user) return;
    
    try {
      setDataLoading(true);
      setError(null);
      
      const idToken = await user.getIdToken();
      
      const response = await fetch('/api/user/dashboard', {
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
        setDashboardData({
          username: result.data.username,
          gemsCount: result.data.gemsCount.toLocaleString(),
          totalTopup: `$${result.data.totalTopup}`,
          lastPurchasedItem: result.data.lastPurchasedItem
        });
      } else {
        setError(result.error || 'Failed to load dashboard data');
      }
    } catch (error) {
      console.error('Dashboard loading error:', error);
      setError(error instanceof Error ? error.message : 'Failed to load dashboard data');
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
          <p className="text-xl">Loading dashboard...</p>
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
          <p className="text-lg">You need to be logged in to view your dashboard.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <AdminRedirect />
      <div className="bg-[#E5E5E5] rounded-xl shadow-lg p-8 md:p-12 mb-20">
        <h1 className="text-2xl md:text-3xl font-bold mb-8">
          Welcome Back, <span>{dashboardData.username}</span>
        </h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            <p>{error}</p>
            <button 
              onClick={loadDashboardData} 
              className="mt-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
            >
              Retry
            </button>
          </div>
        )}



      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <div className="flex justify-between items-center bg-[#70a2e4] text-[#1B1B1B] rounded-xl p-6">
          <div>
            <h2 className="text-3xl font-bold">GEMS</h2>
            {dataLoading ? (
              <div className="h-10 bg-black/10 rounded animate-pulse mt-2"></div>
            ) : (
              <p className="text-4xl">{dashboardData.gemsCount}</p>
            )}
          </div>
          <Image src={gems} alt="Gems" className="w-[70px] h-[70px] object-contain" />
        </div>

        <div className="flex justify-between items-center bg-[#77dd76] text-[#1B1B1B] rounded-xl p-6">
          <div>
            <h2 className="text-3xl font-bold">TOTAL TOPUP</h2>
            {dataLoading ? (
              <div className="h-10 bg-black/10 rounded animate-pulse mt-2"></div>
            ) : (
              <p className="text-4xl">{dashboardData.totalTopup}</p>
            )}
          </div>
        </div>

        <div className="flex justify-between items-center bg-[rgb(216,78,78)] text-[#1B1B1B] rounded-xl p-6">
          <div>
            <h2 className="text-3xl font-bold">LAST PURCHASED</h2>
            {dataLoading ? (
              <div className="h-10 bg-black/10 rounded animate-pulse mt-2"></div>
            ) : (
              <p className="text-4xl break-words">{dashboardData.lastPurchasedItem}</p>
            )}
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
