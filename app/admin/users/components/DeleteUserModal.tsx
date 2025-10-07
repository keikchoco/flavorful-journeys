import React from 'react';
import { Modal } from './Modal';
import { User } from '../hooks/useUserActions';

interface DeleteUserModalProps {
  isOpen: boolean;
  user: User | null;
  onClose: () => void;
  onConfirm: () => void;
}

export function DeleteUserModal({ isOpen, user, onClose, onConfirm }: DeleteUserModalProps) {
  if (!isOpen || !user) return null;

  return (
    <Modal onClose={onClose}>
      <h3 className="text-xl font-semibold mb-4">Delete User</h3>
      <p className="mb-4">
        Are you sure you want to delete <strong>{user.name || 'Unknown User'}</strong> ({user.email || 'No email'})?
        <br />
        <span className="text-red-600 font-semibold">This action cannot be undone.</span>
      </p>
      <div className="flex justify-end gap-3">
        <button 
          onClick={onClose} 
          className="px-4 py-2 rounded border"
        >
          Cancel
        </button>
        <button 
          onClick={onConfirm} 
          className="px-4 py-2 rounded bg-red-600 text-white font-semibold"
        >
          Delete User
        </button>
      </div>
    </Modal>
  );
}