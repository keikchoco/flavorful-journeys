"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/contexts/AuthContext";

export default function AdminRedirect() {
  const { isAdmin, adminLoading, user } = useAuthContext();
  const router = useRouter();

  useEffect(() => {
    // Only redirect if we have a user, admin check is done, and user is admin
    if (user && !adminLoading && isAdmin) {
      router.replace('/admin/dashboard');
    }
  }, [user, isAdmin, adminLoading, router]);

  return null; // This component doesn't render anything
}