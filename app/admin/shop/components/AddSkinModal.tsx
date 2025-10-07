"use client";

import { motion } from "framer-motion";
import { Link, Upload } from "lucide-react";
import Image from "next/image";

interface AddSkinModalProps {
  isOpen: boolean;
  onClose: () => void;
  newSkin: {
    name: string;
    price: string;
    currency: string;
    tier: string;
    imageUrl: string;
  };
  setNewSkin: (skin: any) => void;
  imageUploadMode: 'url' | 'file';
  setImageUploadMode: (mode: 'url' | 'file') => void;
  uploadingImage: boolean;
  operationLoading: boolean;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleAddSkin: () => void;
  generateDocumentName: (name: string) => string;
}

export default function AddSkinModal({
  isOpen,
  onClose,
  newSkin,
  setNewSkin,
  imageUploadMode,
  setImageUploadMode,
  uploadingImage,
  operationLoading,
  handleFileChange,
  handleAddSkin,
  generateDocumentName,
}: AddSkinModalProps) {
  if (!isOpen) return null;

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
        className="bg-white rounded-2xl shadow-xl p-8 w-[90%] md:w-[500px] max-h-[90vh] overflow-y-auto"
      >
        <h2 className="text-xl font-bold mb-4">Add New Skin</h2>

        <input
          type="text"
          placeholder="Skin Name"
          value={newSkin.name}
          onChange={(e) => setNewSkin({ ...newSkin, name: e.target.value })}
          className="w-full mb-1 border rounded-lg px-3 py-2"
        />
        {newSkin.name && (
          <p className="text-sm text-gray-600 mb-3">
            Document name: <code className="bg-gray-100 px-1 rounded">{generateDocumentName(newSkin.name)}</code>
          </p>
        )}
        
        <input
          type="number"
          placeholder="Price"
          value={newSkin.price}
          onChange={(e) => setNewSkin({ ...newSkin, price: e.target.value })}
          className="w-full mb-3 border rounded-lg px-3 py-2"
        />
        
        <select
          value={newSkin.currency}
          onChange={(e) =>
            setNewSkin({ ...newSkin, currency: e.target.value })
          }
          className="w-full mb-3 border rounded-lg px-3 py-2"
        >
          <option value="coins">Coins</option>
          <option value="gems">Gems</option>
        </select>
        
        <select
          value={newSkin.tier}
          onChange={(e) => setNewSkin({ ...newSkin, tier: e.target.value })}
          className="w-full mb-4 border rounded-lg px-3 py-2"
        >
          <option value="">Select Tier</option>
          <option value="common">Common</option>
          <option value="uncommon">Uncommon</option>
          <option value="rare">Rare</option>
          <option value="epic">Epic</option>
          <option value="legendary">Legendary</option>
        </select>

        {/* Image Upload Section */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Image</label>
          
          {/* Upload Mode Toggle */}
          <div className="flex gap-2 mb-3">
            <button
              type="button"
              onClick={() => setImageUploadMode('url')}
              className={`px-3 py-1 rounded-lg text-sm flex items-center gap-1 ${
                imageUploadMode === 'url' 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              <Link size={14} />
              URL
            </button>
            <button
              type="button"
              onClick={() => setImageUploadMode('file')}
              className={`px-3 py-1 rounded-lg text-sm flex items-center gap-1 ${
                imageUploadMode === 'file' 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              <Upload size={14} />
              Upload
            </button>
          </div>

          {imageUploadMode === 'url' ? (
            <input
              type="url"
              placeholder="Image URL"
              value={newSkin.imageUrl}
              onChange={(e) => setNewSkin({ ...newSkin, imageUrl: e.target.value })}
              className="w-full border rounded-lg px-3 py-2"
            />
          ) : (
            <div>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full border rounded-lg px-3 py-2"
                disabled={uploadingImage}
              />
              {uploadingImage && (
                <p className="text-sm text-blue-500 mt-1">Uploading image...</p>
              )}
            </div>
          )}

          {/* Image Preview */}
          {newSkin.imageUrl && (
            <div className="mt-3">
              <Image
                src={newSkin.imageUrl}
                alt="Preview"
                width={80}
                height={80}
                className="w-20 h-20 rounded-lg object-cover border"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
            disabled={operationLoading}
          >
            Cancel
          </button>
          <button
            onClick={handleAddSkin}
            disabled={operationLoading || uploadingImage}
            className="px-4 py-2 rounded-lg bg-[#77dd76] hover:bg-[#4ca54b] disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {operationLoading ? "Adding..." : "Add"}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}