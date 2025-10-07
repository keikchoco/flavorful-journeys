"use client";

import { useState, useEffect } from "react";
import { 
  User, 
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail
} from "firebase/auth";
import { auth } from "@/utils/firebase.browser";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminLoading, setAdminLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      setLoading(false);
      
      // Set/clear session cookies for middleware
      if (user) {
        // Get the ID token for server-side verification
        const token = await user.getIdToken();
        // Store the actual Firebase ID token (not just email)
        document.cookie = `firebase-id-token=${token}; path=/; max-age=3600; secure; samesite=strict`;
        document.cookie = `firebase-user-id=${user.uid}; path=/; max-age=3600; secure; samesite=strict`;
        
        // Check admin status via API
        checkAdminStatus(token);
      } else {
        // Clear cookies and admin status on logout
        document.cookie = 'firebase-id-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
        document.cookie = 'firebase-user-id=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
        setIsAdmin(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const checkAdminStatus = async (token: string) => {
    setAdminLoading(true);
    try {
      const response = await fetch('/api/auth/check-admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ idToken: token }),
      });
      
      const data = await response.json();
      
      // Default to false if user is not in admin collection or any other case
      setIsAdmin(data.isAdmin === true);
      
      // Optional: Log the reason for debugging
      console.log('Admin check result:', {
        isAdmin: data.isAdmin,
        reason: data.reason,
        userId: data.userId
      });
      
    } catch (error) {
      console.error('Error checking admin status:', error);
      // Always default to false on error
      setIsAdmin(false);
    }
    setAdminLoading(false);
  };

  const login = async (email: string, password: string) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      return { user: result.user, error: null };
    } catch (error: any) {
      return { user: null, error: error.message };
    }
  };

  const register = async (email: string, password: string) => {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      return { user: result.user, error: null };
    } catch (error: any) {
      return { user: null, error: error.message };
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      return { error: null };
    } catch (error: any) {
      return { error: error.message };
    }
  };

  const resetPassword = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email);
      return { error: null };
    } catch (error: any) {
      return { error: error.message };
    }
  };

  return {
    user,
    loading,
    isAdmin,
    adminLoading,
    login,
    register,
    logout,
    resetPassword,
    checkAdminStatus
  };
}