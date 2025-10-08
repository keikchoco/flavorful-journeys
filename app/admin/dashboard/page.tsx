"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/contexts/AuthContext";

export default function AdminDashboardPage() {
  const { user, isAdmin, adminLoading, loading } = useAuthContext();
  const router = useRouter();
  
  // State for dashboard metrics
  const [totalPlayers, setTotalPlayers] = useState<number | null>(null);
  const [totalIncome, setTotalIncome] = useState<number | null>(null);
  const [metricsLoading, setMetricsLoading] = useState(true);

  useEffect(() => {
    // If not loading and user is not admin, redirect to user dashboard
    // Note: isAdmin defaults to false if user is not in admin collection
    if (!loading && !adminLoading && user && !isAdmin) {
      router.replace('/user/dashboard');
    }
  }, [user, isAdmin, adminLoading, loading, router]);

  // Fetch dashboard metrics when admin is verified
  useEffect(() => {
    if (!loading && !adminLoading && user && isAdmin) {
      fetchDashboardMetrics();
    }
  }, [loading, adminLoading, user, isAdmin]);

  const fetchDashboardMetrics = async () => {
    setMetricsLoading(true);
    
    try {
      // Get the user's ID token for admin verification
      if (!user) {
        throw new Error('No user found');
      }

      const idToken = await user.getIdToken();

      // Fetch metrics from API route using Firebase Admin SDK
      const response = await fetch('/api/admin/dashboard-metrics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ idToken }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setTotalPlayers(data.totalPlayers || 0);
        setTotalIncome(data.totalIncome || 0);
      } else {
        console.error('API Error:', data.error);
        setTotalPlayers(0);
        setTotalIncome(0);
      }

    } catch (error) {
      console.error('Error fetching dashboard metrics:', error);
      setTotalPlayers(0);
      setTotalIncome(0);
    }
    
    setMetricsLoading(false);
  };

  // Show loading while checking auth and admin status
  if (loading || adminLoading) {
    return (
      <section className="bg-[#E5E5E5] rounded-xl p-10 shadow-xl">
        <div className="text-center text-[#1b1b1b]">
          <h1 className="text-2xl mb-4">Loading...</h1>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1b1b1b] mx-auto"></div>
        </div>
      </section>
    );
  }

  // Show access denied if not admin
  if (!isAdmin) {
    return (
      <section className="bg-[#E5E5E5] rounded-xl p-10 shadow-xl">
        <div className="text-center text-[#1b1b1b]">
          <h1 className="text-2xl mb-4">Access Denied</h1>
          <p>You don't have permission to access this page.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-[#E5E5E5] rounded-xl p-10 shadow-xl">
      <h1 className="text-3xl font-bold mb-8 text-[#1b1b1b] select-none">Welcome Back, Admin</h1>

      <div className="flex flex-col sm:flex-row gap-6">
        <div className="flex-1 bg-[#fa9130] text-[#1b1b1b] p-6 rounded-lg">
          <h2 className="text-2xl mb-2">Total Players</h2>
          <p className="text-5xl font-bold">
            {metricsLoading ? (
              <span className="animate-pulse">Loading...</span>
            ) : (
              totalPlayers?.toLocaleString() || '0'
            )}
          </p>
        </div>

        <div className="flex-1 bg-[#70a2e4] text-[#1b1b1b] p-6 rounded-lg">
          <h2 className="text-2xl mb-2">Total Income</h2>
          <p className="text-5xl font-bold">
            {metricsLoading ? (
              <span className="animate-pulse">Loading...</span>
            ) : (
              `$${totalIncome?.toLocaleString(undefined, { 
                minimumFractionDigits: 2, 
                maximumFractionDigits: 2 
              }) || '0.00'}`
            )}
          </p>
        </div>
      </div>
    </section>
  );
}
