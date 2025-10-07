import React from 'react';
import { Modal } from './Modal';
import { User } from '../hooks/useUserActions';

interface PasswordDisplayModalProps {
  isOpen: boolean;
  user: User | null;
  password: string;
  onClose: () => void;
  isNewUser?: boolean;
}

export function PasswordDisplayModal({ isOpen, user, password, onClose, isNewUser = false }: PasswordDisplayModalProps) {
  if (!isOpen || !user) return null;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(password);
    alert('Password copied to clipboard!');
  };

  return (
    <Modal onClose={onClose}>
      <h3 className="text-xl font-semibold mb-4">
        {isNewUser ? 'User Created Successfully' : 'Password Reset Complete'}
      </h3>
      <p className="mb-4">
        {isNewUser ? 'Temporary password for new user' : 'New password generated for'}{' '}
        <strong>{user.name || 'Unknown User'}</strong> ({user.email || 'No email'}):
      </p>
      <div className="bg-gray-100 p-4 rounded-lg mb-4 text-center">
        <code className="text-lg font-mono font-bold text-blue-600">{password}</code>
      </div>
      <p className="text-sm text-gray-600 mb-4">
        {isNewUser 
          ? 'Please provide this temporary password to the new user. They should change it upon first login.'
          : 'Please provide this password to the user. They should change it upon next login.'
        }
      </p>
      <div className="flex justify-end gap-3">
        <button 
          onClick={copyToClipboard}
          className="px-4 py-2 rounded bg-blue-600 text-white font-semibold"
        >
          Copy Password
        </button>
        <button 
          onClick={onClose} 
          className="px-4 py-2 rounded bg-[#77dd76] text-[#1B1B1B] font-semibold"
        >
          Close
        </button>
      </div>
    </Modal>
  );
}