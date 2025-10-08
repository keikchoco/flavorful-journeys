"use client";

import { motion } from "framer-motion";
import { Link, Upload } from "lucide-react";
import Image from "next/image";

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

interface EditSkinModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedSkin: Skin | null;
  setSelectedSkin: (skin: Skin) => void;
  imageUploadMode: "url" | "file";
  setImageUploadMode: (mode: "url" | "file") => void;
  uploadingImage: boolean;
  operationLoading: boolean;
  handleEditFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleEditSkin: () => void;
  generateDocumentName: (name: string) => string;
}

export default function EditSkinModal({
  isOpen,
  onClose,
  selectedSkin,
  setSelectedSkin,
  imageUploadMode,
  setImageUploadMode,
  uploadingImage,
  operationLoading,
  handleEditFileChange,
  handleEditSkin,
  generateDocumentName,
}: EditSkinModalProps) {
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
        className="bg-white rounded-2xl shadow-xl p-8 w-[90%] md:w-[800px] max-h-[90vh] overflow-y-auto"
      >
        <h2 className="text-xl font-bold mb-4">Edit Skin</h2>

        <div className="grid grid-cols-2 gap-4">
          {/* Image Preview */}
          {selectedSkin.imageUrl && (
            <div className="mt-3">
              <Image
                src={selectedSkin.imageUrl}
                alt="Preview"
                width={512}
                height={512}
                className="w-full h-full rounded-lg object-cover border"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
            </div>
          )}

          <div>
            <input
              type="text"
              placeholder="Skin Name"
              value={selectedSkin.name}
              onChange={(e) =>
                setSelectedSkin({ ...selectedSkin, name: e.target.value })
              }
              className="w-full mb-1 border rounded-lg px-3 py-2"
            />
            {selectedSkin.name && (
              <p className="text-sm text-gray-600 mb-3">
                Document name:{" "}
                <code className="bg-gray-100 px-1 rounded">
                  {generateDocumentName(selectedSkin.name)}
                </code>
              </p>
            )}

            <input
              type="number"
              placeholder="Price"
              value={selectedSkin.price}
              onChange={(e) =>
                setSelectedSkin({
                  ...selectedSkin,
                  price: Number(e.target.value),
                })
              }
              className="w-full mb-3 border rounded-lg px-3 py-2"
            />

            <select
              value={selectedSkin.currency}
              onChange={(e) =>
                setSelectedSkin({ ...selectedSkin, currency: e.target.value })
              }
              className="w-full mb-3 border rounded-lg px-3 py-2"
            >
              <option value="coins">Coins</option>
              <option value="gems">Gems</option>
            </select>

            <select
              value={selectedSkin.tier}
              onChange={(e) =>
                setSelectedSkin({ ...selectedSkin, tier: e.target.value })
              }
              className="w-full mb-4 border rounded-lg px-3 py-2"
            >
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
                  onClick={() => setImageUploadMode("url")}
                  className={`px-3 py-1 rounded-lg text-sm flex items-center gap-1 ${
                    imageUploadMode === "url"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-gray-700"
                  }`}
                >
                  <Link size={14} />
                  URL
                </button>
                <button
                  type="button"
                  onClick={() => setImageUploadMode("file")}
                  className={`px-3 py-1 rounded-lg text-sm flex items-center gap-1 ${
                    imageUploadMode === "file"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-gray-700"
                  }`}
                >
                  <Upload size={14} />
                  Upload
                </button>
              </div>

              {imageUploadMode === "url" ? (
                <input
                  type="url"
                  placeholder="Image URL"
                  value={selectedSkin.imageUrl}
                  onChange={(e) =>
                    setSelectedSkin({
                      ...selectedSkin,
                      imageUrl: e.target.value,
                    })
                  }
                  className="w-full border rounded-lg px-3 py-2"
                />
              ) : (
                <div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleEditFileChange}
                    className="w-full border rounded-lg px-3 py-2"
                    disabled={uploadingImage}
                  />
                  {uploadingImage && (
                    <p className="text-sm text-blue-500 mt-1">
                      Uploading image...
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-3 col-span-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
              disabled={operationLoading}
            >
              Cancel
            </button>
            <button
              onClick={handleEditSkin}
              disabled={operationLoading || uploadingImage}
              className="px-4 py-2 rounded-lg bg-[#fa9130] hover:bg-[#ad6421] text-white disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {operationLoading ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
