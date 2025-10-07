import React from 'react';
import { Modal } from './Modal';
import { User } from '../hooks/useUserActions';

interface ResetPasswordModalProps {
  isOpen: boolean;
  user: User | null;
  onClose: () => void;
  onConfirm: () => void;
}

export function ResetPasswordModal({ isOpen, user, onClose, onConfirm }: ResetPasswordModalProps) {
  if (!isOpen || !user) return null;

  return (
    <Modal onClose={onClose}>
      <h3 className="text-xl font-semibold mb-4">Reset User Password</h3>
      <p className="mb-6">The password for <strong>{user.email || 'Unknown User'}</strong> will be reset to a new random password.</p>
      <div className="flex justify-end gap-3">
        <button 
          onClick={onClose} 
          className="px-4 py-2 rounded border"
        >
          Cancel
        </button>
        <button 
          onClick={onConfirm} 
          className="px-4 py-2 rounded bg-[#77dd76] text-[#1B1B1B] font-semibold"
        >
          Reset Password
        </button>
      </div>
    </Modal>
  );
}