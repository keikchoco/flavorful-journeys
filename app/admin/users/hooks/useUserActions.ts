import { useState } from 'react';
import { useAuthContext } from '@/contexts/AuthContext';

/** User type for database structure */
export type User = {
  id: string;
  name: string;
  email: string;
  enabled: boolean;
};

export function useUserActions() {
  const { user } = useAuthContext();
  
  // Generate random 8-character password
  const generateRandomPassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let password = '';
    for (let i = 0; i < 8; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  };

  const resetUserPassword = async (selectedUser: User): Promise<{ success: boolean; password?: string; error?: string }> => {
    if (!user) return { success: false, error: 'No user authenticated' };
    
    try {
      const newPassword = generateRandomPassword();
      const idToken = await user.getIdToken();
      
      const response = await fetch('/api/admin/users/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          idToken, 
          userId: selectedUser.id,
          email: selectedUser.email,
          newPassword: newPassword
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        return { success: true, password: newPassword };
      } else {
        return { success: false, error: data.error };
      }
    } catch (error) {
      console.error('Error resetting password:', error);
      return { success: false, error: 'Failed to reset password' };
    }
  };

  const disableUser = async (selectedUser: User): Promise<{ success: boolean; error?: string }> => {
    if (!user) return { success: false, error: 'No user authenticated' };
    
    try {
      const idToken = await user.getIdToken();
      
      const response = await fetch('/api/admin/users/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          idToken, 
          userId: selectedUser.id,
          action: 'disable'
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        return { success: true };
      } else {
        return { success: false, error: data.error };
      }
    } catch (error) {
      console.error('Error disabling user:', error);
      return { success: false, error: 'Failed to disable user' };
    }
  };

  const enableUser = async (selectedUser: User): Promise<{ success: boolean; error?: string }> => {
    if (!user) return { success: false, error: 'No user authenticated' };
    
    try {
      const idToken = await user.getIdToken();
      
      const response = await fetch('/api/admin/users/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          idToken, 
          userId: selectedUser.id,
          action: 'enable'
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        return { success: true };
      } else {
        return { success: false, error: data.error };
      }
    } catch (error) {
      console.error('Error enabling user:', error);
      return { success: false, error: 'Failed to enable user' };
    }
  };

  const deleteUser = async (selectedUser: User): Promise<{ success: boolean; error?: string }> => {
    if (!user) return { success: false, error: 'No user authenticated' };
    
    try {
      const idToken = await user.getIdToken();
      
      const response = await fetch('/api/admin/users/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          idToken, 
          userId: selectedUser.id,
          action: 'delete'
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        return { success: true };
      } else {
        return { success: false, error: data.error };
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      return { success: false, error: 'Failed to delete user' };
    }
  };

  const createUser = async (name: string, email: string): Promise<{ success: boolean; userId?: string; password?: string; error?: string }> => {
    if (!user) return { success: false, error: 'No user authenticated' };
    
    try {
      const idToken = await user.getIdToken();
      
      const response = await fetch('/api/admin/users/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          idToken, 
          name: name.trim(),
          email: email.trim()
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        return { success: true, userId: data.userId, password: data.tempPassword };
      } else {
        return { success: false, error: data.error };
      }
    } catch (error) {
      console.error('Error creating user:', error);
      return { success: false, error: 'Failed to create user' };
    }
  };

  return {
    resetUserPassword,
    disableUser,
    enableUser,
    deleteUser,
    createUser
  };
}