import React, { useState } from 'react';
import { Modal } from './Modal';

interface AddUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (name: string, email: string) => void;
}

export function AddUserModal({ isOpen, onClose, onConfirm }: AddUserModalProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (!name.trim() || !email.trim()) {
      alert("Name and email required");
      return;
    }
    onConfirm(name, email);
    setName("");
    setEmail("");
  };

  const handleClose = () => {
    setName("");
    setEmail("");
    onClose();
  };

  return (
    <Modal onClose={handleClose}>
      <h3 className="text-xl font-semibold mb-4">Add New User</h3>
      <div className="flex flex-col gap-3 mb-4">
        <input 
          className="px-3 py-2 rounded border" 
          placeholder="Username" 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
        />
        <input 
          className="px-3 py-2 rounded border" 
          placeholder="Email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
        />
      </div>
      <div className="flex justify-end gap-3">
        <button onClick={handleClose} className="px-4 py-2 rounded border">
          Cancel
        </button>
        <button onClick={handleConfirm} className="px-4 py-2 rounded bg-[#77dd76] text-[#1B1B1B] font-semibold">
          Add User
        </button>
      </div>
    </Modal>
  );
}