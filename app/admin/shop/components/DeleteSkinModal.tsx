"use client";

import { motion } from "framer-motion";

type Skin = {
  id: string;
  name: string;
  documentName?: string;
  price: number;
  currency: string;
  tier: string;
  imageUrl: string;
  createdAt?: string;
  updatedAt?: string;
};

interface DeleteSkinModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedSkin: Skin | null;
  operationLoading: boolean;
  handleDeleteSkin: () => void;
}

export default function DeleteSkinModal({
  isOpen,
  onClose,
  selectedSkin,
  operationLoading,
  handleDeleteSkin,
}: DeleteSkinModalProps) {
  if (!isOpen || !selectedSkin) return null;

  return (
    <motion.div
      className="fixed inset-0 bg-black/40 bg-opacity-50 flex items-center justify-center z-[9999]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-2xl shadow-xl p-8 w-[90%] md:w-[400px]"
      >
        <h2 className="text-xl font-bold mb-4 text-center">Delete Skin</h2>
        <p className="text-center mb-6">
          Are you sure you want to delete{" "}
          <span className="font-semibold">{selectedSkin.name}</span>?
        </p>

        <div className="flex justify-center gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
            disabled={operationLoading}
          >
            Cancel
          </button>
          <button
            onClick={handleDeleteSkin}
            disabled={operationLoading}
            className="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {operationLoading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}