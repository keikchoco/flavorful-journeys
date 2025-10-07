"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Edit, Trash2, Filter, Upload, Link, X } from "lucide-react";
import { useAuthContext } from "@/contexts/AuthContext";
import { auth, storage } from "@/utils/firebase.browser";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import Image from "next/image";
import AddSkinModal from "./components/AddSkinModal";
import EditSkinModal from "./components/EditSkinModal";
import DeleteSkinModal from "./components/DeleteSkinModal";

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

export default function AdminShopPage() {
  const { user, isAdmin, adminLoading, loading } = useAuthContext();
  const router = useRouter();
  
  const [skins, setSkins] = useState<Skin[]>([]);
  const [skinsLoading, setSkinsLoading] = useState(true);
  const [operationLoading, setOperationLoading] = useState(false);

  // Redirect non-admin users
  useEffect(() => {
    if (!loading && !adminLoading && user && !isAdmin) {
      router.replace('/user/dashboard');
    }
  }, [user, isAdmin, adminLoading, loading, router]);

  // Load skins when admin is verified
  useEffect(() => {
    if (!loading && !adminLoading && isAdmin) {
      loadSkins();
    }
  }, [isAdmin, adminLoading, loading]);

  const loadSkins = async () => {
    setSkinsLoading(true);
    
    try {
      const user = auth.currentUser;
      if (!user) {
        setSkins([]);
        setSkinsLoading(false);
        return;
      }

      const idToken = await user.getIdToken();
      
      const response = await fetch('/api/admin/skins', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ idToken }),
      });

      if (response.ok) {
        const data = await response.json();
        setSkins(data.skins || []);
      } else {
        console.error('Failed to load skins');
        setSkins([]);
      }
    } catch (error) {
      console.error('Error loading skins:', error);
      setSkins([]);
    }

    setSkinsLoading(false);
  };

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showFilter, setShowFilter] = useState(false);

  const [selectedFilter, setSelectedFilter] = useState("All");
  const [selectedSkin, setSelectedSkin] = useState<Skin | null>(null);

  const [newSkin, setNewSkin] = useState({
    name: "",
    price: "",
    currency: "gems",
    tier: "",
    imageUrl: "",
  });

  // Image upload states
  const [imageUploadMode, setImageUploadMode] = useState<'url' | 'file'>('url');
  const [uploadingImage, setUploadingImage] = useState(false);

  const openEditModal = (skin: Skin) => {
    setSelectedSkin(skin);
    setShowEditModal(true);
  };

  // Convert name to snake_case for document name
  const generateDocumentName = (name: string) => {
    return name
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '_')
      .replace(/[^a-z0-9_]/g, '');
  };

  const handleImageUpload = async (file: File) => {
    if (!file) return;

    try {
      setUploadingImage(true);
      
      // Create a reference to the file in Firebase Storage
      const imageRef = ref(storage, `skins/${Date.now()}_${file.name}`);
      
      // Upload the file
      const snapshot = await uploadBytes(imageRef, file);
      
      // Get the download URL
      const downloadURL = await getDownloadURL(snapshot.ref);
      
      return downloadURL;
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image. Please try again.');
      return null;
    } finally {
      setUploadingImage(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const downloadURL = await handleImageUpload(file);
      if (downloadURL) {
        setNewSkin({ ...newSkin, imageUrl: downloadURL });
      }
    }
  };

  const handleEditFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && selectedSkin) {
      const downloadURL = await handleImageUpload(file);
      if (downloadURL) {
        setSelectedSkin({ ...selectedSkin, imageUrl: downloadURL });
      }
    }
  };

  const handleAddSkin = async () => {
    if (!newSkin.name || !newSkin.price || !newSkin.tier) return;
    
    setOperationLoading(true);
    
    try {
      const user = auth.currentUser;
      if (!user) return;

      const idToken = await user.getIdToken();
      
      const response = await fetch('/api/admin/skins', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          idToken,
          name: newSkin.name,
          documentName: generateDocumentName(newSkin.name),
          price: newSkin.price,
          currency: newSkin.currency,
          tier: newSkin.tier,
          imageUrl: newSkin.imageUrl,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create skin');
      }

      // Reload the skins list
      await loadSkins();
      
      setNewSkin({ name: "", price: "", currency: "gems", tier: "", imageUrl: "" });
      setShowAddModal(false);
    } catch (error) {
      console.error('Error creating skin:', error);
      alert('Failed to create skin. Please try again.');
    } finally {
      setOperationLoading(false);
    }
  };

  const handleEditSkin = async () => {
    if (!selectedSkin) return;
    
    setOperationLoading(true);
    
    try {
      const user = auth.currentUser;
      if (!user) return;

      const idToken = await user.getIdToken();
      
      const response = await fetch('/api/admin/skins', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          idToken,
          id: selectedSkin.id,
          name: selectedSkin.name,
          documentName: generateDocumentName(selectedSkin.name),
          price: selectedSkin.price,
          currency: selectedSkin.currency,
          tier: selectedSkin.tier,
          imageUrl: selectedSkin.imageUrl,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update skin');
      }

      // Reload the skins list
      await loadSkins();
      
      setShowEditModal(false);
    } catch (error) {
      console.error('Error updating skin:', error);
      alert('Failed to update skin. Please try again.');
    } finally {
      setOperationLoading(false);
    }
  };

  const handleDeleteSkin = async () => {
    if (!selectedSkin) return;
    
    setOperationLoading(true);
    
    try {
      const user = auth.currentUser;
      if (!user) return;

      const idToken = await user.getIdToken();
      
      const response = await fetch(`/api/admin/skins?id=${selectedSkin.id}&idToken=${encodeURIComponent(idToken)}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete skin');
      }

      // Reload the skins list
      await loadSkins();
      
      setShowDeleteModal(false);
    } catch (error) {
      console.error('Error deleting skin:', error);
      alert('Failed to delete skin. Please try again.');
    } finally {
      setOperationLoading(false);
    }
  };

  const filteredSkins =
    selectedFilter === "All"
      ? skins
      : skins.filter((skin) => skin.tier === selectedFilter);

  // Show loading while checking auth and admin status
  if (loading || adminLoading) {
    return (
      <div className="relative z-10 p-6 md:p-10">
        <div className="bg-[#E5E5E5] rounded-xl p-6 md:p-10 shadow">
          <div className="text-center text-[#1b1b1b]">
            <h1 className="text-2xl mb-4">Loading...</h1>
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1b1b1b] mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  // Show access denied if not admin
  if (!isAdmin) {
    return (
      <div className="relative z-10 p-6 md:p-10">
        <div className="bg-[#E5E5E5] rounded-xl p-6 md:p-10 shadow">
          <div className="text-center text-[#1b1b1b]">
            <h1 className="text-2xl mb-4">Access Denied</h1>
            <p>You don't have permission to access this page.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative z-10 p-6 md:p-10">
      <div className="bg-[#E5E5E5] rounded-xl p-6 md:p-10 shadow">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-[#1b1b1b]">Shop Management</h1>
          <div className="flex gap-3">
            <div className="relative">
              <button
                onClick={() => setShowFilter(!showFilter)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#fa9130] hover:bg-[#ad6421] text-white transition-colors"
              >
                <Filter size={16} />
                Filter
              </button>
              {showFilter && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border z-50"
                >
                  {["All", "Common", "Uncommon", "Rare", "Epic", "Legendary"].map(
                    (filter) => (
                      <button
                        key={filter}
                        onClick={() => {
                          setSelectedFilter(filter);
                          setShowFilter(false);
                        }}
                        className={`w-full text-left px-4 py-2 hover:bg-gray-100 first:rounded-t-lg last:rounded-b-lg ${
                          selectedFilter === filter ? "bg-[#fa9130] text-white" : ""
                        }`}
                      >
                        {filter}
                      </button>
                    )
                  )}
                </motion.div>
              )}
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#77dd76] hover:bg-[#4ca54b] text-black transition-colors"
            >
              <Plus size={16} />
              Add Item
            </button>
          </div>
        </div>

        {/* Skins List */}
        {skinsLoading ? (
          <div className="text-center text-[#1b1b1b] py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1b1b1b] mx-auto mb-4"></div>
            <p>Loading skins...</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="text-left p-4 font-semibold">Image</th>
                    <th className="text-left p-4 font-semibold">Name</th>
                    <th className="text-left p-4 font-semibold">Document Name</th>
                    <th className="text-left p-4 font-semibold">Price</th>
                    <th className="text-left p-4 font-semibold">Currency</th>
                    <th className="text-left p-4 font-semibold">Tier</th>
                    <th className="text-left p-4 font-semibold">Updated At</th>
                    <th className="text-left p-4 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSkins.map((skin) => (
                    <tr key={skin.id} className="border-b hover:bg-gray-50">
                      <td className="p-4">
                        {skin.imageUrl ? (
                          <Image
                            src={skin.imageUrl}
                            alt={skin.name}
                            width={48}
                            height={48}
                            className="w-12 h-12 rounded-lg object-cover border"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = '/assets/placeholder-image.png';
                            }}
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-lg bg-gray-200 border flex items-center justify-center">
                            <span className="text-gray-400 text-xs">No Image</span>
                          </div>
                        )}
                      </td>
                      <td className="p-4 font-medium">{skin.name}</td>
                      <td className="p-4">
                        <code className="text-sm bg-gray-100 px-2 py-1 rounded text-gray-700">
                          {skin.documentName || generateDocumentName(skin.name)}
                        </code>
                      </td>
                      <td className="p-4">{skin.price}</td>
                      <td className="p-4 capitalize">{skin.currency}</td>
                      <td className="p-4 capitalize">{skin.tier}</td>
                      <td className="p-4 text-sm text-gray-600">
                        {skin.updatedAt ? (
                          <span title={new Date(skin.updatedAt).toLocaleString()}>
                            {new Date(skin.updatedAt).toLocaleDateString()}
                          </span>
                        ) : (
                          <span className="text-gray-400">No data</span>
                        )}
                      </td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => openEditModal(skin)}
                            className="p-2 rounded-lg bg-[#fa9130] hover:bg-[#ad6421] text-white transition-colors"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedSkin(skin);
                              setShowDeleteModal(true);
                            }}
                            className="p-2 rounded-lg bg-red-500 hover:bg-red-600 text-white transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredSkins.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                {selectedFilter === "All" ? "No skins found" : `No ${selectedFilter} skins found`}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modals */}
      <AddSkinModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        newSkin={newSkin}
        setNewSkin={setNewSkin}
        imageUploadMode={imageUploadMode}
        setImageUploadMode={setImageUploadMode}
        uploadingImage={uploadingImage}
        operationLoading={operationLoading}
        handleFileChange={handleFileChange}
        handleAddSkin={handleAddSkin}
        generateDocumentName={generateDocumentName}
      />

      <EditSkinModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        selectedSkin={selectedSkin}
        setSelectedSkin={setSelectedSkin}
        imageUploadMode={imageUploadMode}
        setImageUploadMode={setImageUploadMode}
        uploadingImage={uploadingImage}
        operationLoading={operationLoading}
        handleEditFileChange={handleEditFileChange}
        handleEditSkin={handleEditSkin}
        generateDocumentName={generateDocumentName}
      />

      <DeleteSkinModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        selectedSkin={selectedSkin}
        operationLoading={operationLoading}
        handleDeleteSkin={handleDeleteSkin}
      />
    </div>
  );
}