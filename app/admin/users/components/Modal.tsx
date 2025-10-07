import React from 'react';

interface ModalProps {
  children: React.ReactNode;
  onClose: () => void;
}

export function Modal({ children, onClose }: ModalProps) {
  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 p-4"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-[#1b1b1b] text-[#E5E5E5] rounded-lg max-w-xl w-full p-6 relative">
        <div>{children}</div>
        <button
          aria-label="Close modal"
          onClick={onClose}
          className="absolute right-4 top-4 text-[#E5E5E5] opacity-80 hover:opacity-100"
        >
          ✕
        </button>
      </div>
    </div>
  );
}