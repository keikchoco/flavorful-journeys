"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Edit, Trash2, Filter } from "lucide-react";

type Skin = {
  id: number;
  name: string;
  price: number;
  currency: "Coins" | "Gems";
  rarity: string;
};

export default function AdminShopPage() {
  const [skins, setSkins] = useState<Skin[]>([
    { id: 1, name: "Crimson Blade", price: 1200, currency: "Gems", rarity: "Epic" },
    { id: 2, name: "Golden Fury", price: 950, currency: "Coins", rarity: "Rare" },
    { id: 3, name: "Azure Edge", price: 780, currency: "Coins", rarity: "Uncommon" },
    { id: 4, name: "Shadow Strike", price: 1500, currency: "Gems", rarity: "Legendary" },
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showFilter, setShowFilter] = useState(false);

  const [selectedFilter, setSelectedFilter] = useState("All");
  const [selectedSkin, setSelectedSkin] = useState<Skin | null>(null);

  const [newSkin, setNewSkin] = useState({
    name: "",
    price: "",
    currency: "Gems",
    rarity: "",
  });

  const openEditModal = (skin: Skin) => {
    setSelectedSkin(skin);
    setShowEditModal(true);
  };

  const openDeleteModal = (skin: Skin) => {
    setSelectedSkin(skin);
    setShowDeleteModal(true);
  };

  const handleAddSkin = () => {
    if (!newSkin.name || !newSkin.price || !newSkin.rarity) return;
    const newEntry: Skin = {
      id: skins.length + 1,
      name: newSkin.name,
      price: Number(newSkin.price),
      currency: newSkin.currency as "Coins" | "Gems",
      rarity: newSkin.rarity,
    };
    setSkins([...skins, newEntry]);
    setNewSkin({ name: "", price: "", currency: "Gems", rarity: "" });
    setShowAddModal(false);
  };

  const handleEditSkin = () => {
    if (!selectedSkin) return;
    setSkins((prev) =>
      prev.map((skin) => (skin.id === selectedSkin.id ? selectedSkin : skin))
    );
    setShowEditModal(false);
  };

  const handleDeleteSkin = () => {
    if (!selectedSkin) return;
    setSkins((prev) => prev.filter((skin) => skin.id !== selectedSkin.id));
    setShowDeleteModal(false);
  };

  const filteredSkins =
    selectedFilter === "All"
      ? skins
      : skins.filter((skin) => skin.rarity === selectedFilter);

  return (
    <motion.div
      className="p-10 text-[#1b1b1b]"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Shop Management</h1>

        <div className="flex items-center gap-4">
          <div className="relative">
            <button
              onClick={() => setShowFilter(!showFilter)}
              className="bg-[#fa9130] hover:bg-[#ad6421] text-white rounded-xl px-4 py-2 flex items-center gap-2 transition-all"
            >
              <Filter className="w-5 h-5" />
              {selectedFilter === "All" ? "Filter" : selectedFilter}
            </button>

            <AnimatePresence>
              {showFilter && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg p-3 w-48 z-20"
                >
                  <p className="font-semibold mb-2">Filter by Rarity:</p>
                  <ul className="space-y-1 text-sm">
                    {["All", "Common", "Uncommon", "Rare", "Epic", "Legendary"].map(
                      (rarity) => (
                        <li
                          key={rarity}
                          onClick={() => {
                            setSelectedFilter(rarity);
                            setShowFilter(false);
                          }}
                          className={`cursor-pointer hover:text-[#fa9130] ${
                            selectedFilter === rarity ? "text-[#fa9130] font-semibold" : ""
                          }`}
                        >
                          {rarity}
                        </li>
                      )
                    )}
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="bg-[#77dd76] hover:bg-[#4ca54b] text-[#1b1b1b] font-bold px-5 py-2 rounded-xl flex items-center gap-2 transition-all"
          >
            <Plus className="w-5 h-5" />
            Add Item
          </button>
        </div>
      </div>

      <div className="bg-white/90 rounded-xl shadow-lg overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-[#fa9130] text-[#1b1b1b]">
            <tr>
              <th className="p-4">Skin Name</th>
              <th className="p-4">Price</th>
              <th className="p-4">Currency</th>
              <th className="p-4">Rarity</th>
              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredSkins.map((skin) => (
              <tr key={skin.id} className="border-t hover:bg-gray-100 transition-all">
                <td className="p-4">{skin.name}</td>
                <td className="p-4">₱{skin.price.toLocaleString()}</td>
                <td className="p-4">{skin.currency}</td>
                <td className="p-4">{skin.rarity}</td>
                <td className="p-4 text-center">
                  <button
                    onClick={() => openEditModal(skin)}
                    className="text-blue-500 hover:text-blue-700 mr-3"
                  >
                    <Edit className="w-5 h-5 inline" />
                  </button>
                  <button
                    onClick={() => openDeleteModal(skin)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="w-5 h-5 inline" />
                  </button>
                </td>
              </tr>
            ))}
            {filteredSkins.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="p-6 text-center text-gray-500 italic bg-gray-50"
                >
                  No skins found for this rarity.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
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
              <h2 className="text-xl font-bold mb-4">Add New Skin</h2>

              <input
                type="text"
                placeholder="Skin Name"
                value={newSkin.name}
                onChange={(e) => setNewSkin({ ...newSkin, name: e.target.value })}
                className="w-full mb-3 border rounded-lg px-3 py-2"
              />
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
                  setNewSkin({ ...newSkin, currency: e.target.value as "Coins" | "Gems" })
                }
                className="w-full mb-3 border rounded-lg px-3 py-2"
              >
                <option value="Coins">Coins</option>
                <option value="Gems">Gems</option>
              </select>
              <select
                value={newSkin.rarity}
                onChange={(e) => setNewSkin({ ...newSkin, rarity: e.target.value })}
                className="w-full mb-4 border rounded-lg px-3 py-2"
              >
                <option value="">Select Rarity</option>
                <option>Common</option>
                <option>Uncommon</option>
                <option>Rare</option>
                <option>Epic</option>
                <option>Legendary</option>
              </select>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddSkin}
                  className="px-4 py-2 rounded-lg bg-[#77dd76] hover:bg-[#4ca54b]"
                >
                  Add
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Modal */}
      <AnimatePresence>
        {showEditModal && selectedSkin && (
          <motion.div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
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
              <h2 className="text-xl font-bold mb-4">Edit Skin</h2>

              <input
                type="text"
                value={selectedSkin.name}
                onChange={(e) =>
                  setSelectedSkin({ ...selectedSkin, name: e.target.value })
                }
                className="w-full mb-3 border rounded-lg px-3 py-2"
              />
              <input
                type="number"
                value={selectedSkin.price}
                onChange={(e) =>
                  setSelectedSkin({ ...selectedSkin, price: Number(e.target.value) })
                }
                className="w-full mb-3 border rounded-lg px-3 py-2"
              />
              <select
                value={selectedSkin.currency}
                onChange={(e) =>
                  setSelectedSkin({
                    ...selectedSkin,
                    currency: e.target.value as "Coins" | "Gems",
                  })
                }
                className="w-full mb-3 border rounded-lg px-3 py-2"
              >
                <option value="Coins">Coins</option>
                <option value="Gems">Gems</option>
              </select>
              <select
                value={selectedSkin.rarity}
                onChange={(e) =>
                  setSelectedSkin({ ...selectedSkin, rarity: e.target.value })
                }
                className="w-full mb-4 border rounded-lg px-3 py-2"
              >
                <option>Common</option>
                <option>Uncommon</option>
                <option>Rare</option>
                <option>Epic</option>
                <option>Legendary</option>
              </select>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleEditSkin}
                  className="px-4 py-2 rounded-lg bg-[#fa9130] hover:bg-[#ad6421] text-white"
                >
                  Save
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Modal */}
      <AnimatePresence>
        {showDeleteModal && selectedSkin && (
          <motion.div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-2xl shadow-xl p-8 w-[90%] md:w-[400px] text-center"
            >
              <h2 className="text-xl font-bold mb-4">Delete Skin</h2>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete{" "}
                <span className="font-semibold">{selectedSkin.name}</span>?
              </p>

              <div className="flex justify-center gap-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteSkin}
                  className="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
