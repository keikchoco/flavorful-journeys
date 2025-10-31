"use client";
import React from "react";
import { Modal } from "./Modal";

interface CloseReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function CloseReportModal({ isOpen, onClose, onConfirm }: CloseReportModalProps) {
  if (!isOpen) return null;

  return (
    <Modal onClose={onClose}>
      <h2 className="text-xl font-semibold mb-4">Close Bug Report</h2>
      <p className="mb-6 text-sm text-gray-300">
        Are you sure you want to mark this report as <strong>Resolved</strong>?
      </p>
      <div className="flex justify-end gap-3">
        <button
          onClick={onClose}
          className="px-4 py-2 bg-gray-700 hover:bg-gray-800 rounded-md"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md"
        >
          Confirm
        </button>
      </div>
    </Modal>
  );
}
