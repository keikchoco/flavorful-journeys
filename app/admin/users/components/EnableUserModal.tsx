import React from 'react';
import { Modal } from './Modal';
import { User } from '../hooks/useUserActions';

interface EnableUserModalProps {
  isOpen: boolean;
  user: User | null;
  onClose: () => void;
  onConfirm: () => void;
}

export function EnableUserModal({ isOpen, user, onClose, onConfirm }: EnableUserModalProps) {
  if (!isOpen || !user) return null;

  return (
    <Modal onClose={onClose}>
      <h3 className="text-xl font-semibold mb-4">Enable This User</h3>
      <p className="mb-6">This user (<strong>{user.email || 'Unknown User'}</strong>) will now be able to log in.</p>
      <div className="flex justify-end gap-3">
        <button 
          onClick={onClose} 
          className="px-4 py-2 rounded border"
        >
          Cancel
        </button>
        <button 
          onClick={onConfirm} 
          className="px-4 py-2 rounded bg-green-600 text-white font-semibold"
        >
          Enable User
        </button>
      </div>
    </Modal>
  );
}