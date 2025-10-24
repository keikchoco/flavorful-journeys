import React, { useState } from 'react';
import { Modal } from './Modal';
import { User } from '../hooks/useUserActions';

interface DisableUserModalProps {
  isOpen: boolean;
  user: User | null;
  onClose: () => void;
  onConfirm: (reason: string) => void;
}

export function DisableUserModal({ isOpen, user, onClose, onConfirm }: DisableUserModalProps) {
  const [reason, setReason] = useState("");

  if (!isOpen || !user) return null;

  const handleConfirm = () => {
    if (!reason.trim()) {
      alert("Please provide a reason for disabling this user.");
      return;
    }
    onConfirm(reason.trim());
  };

  return (
    <Modal onClose={onClose}>
      <h3 className="text-xl font-semibold mb-4">Disable This User</h3>
      <p className="mb-4">
        This user (<strong>{user.email || 'Unknown User'}</strong>) will not be able to log in.
      </p>

      <label className="block mb-2 font-medium">
        Reason for disabling:
      </label>
      <textarea
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        placeholder="Enter reason (required)"
        className="w-full p-2 border border-gray-300 rounded-md mb-6 resize-none h-24"
      />

      <div className="flex justify-end gap-3">
        <button
          onClick={onClose}
          className="px-4 py-2 rounded border"
        >
          Cancel
        </button>
        <button
          onClick={handleConfirm}
          className="px-4 py-2 rounded bg-red-600 text-white font-semibold"
        >
          Disable User
        </button>
      </div>
    </Modal>
  );
}
