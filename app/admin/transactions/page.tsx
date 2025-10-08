"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/contexts/AuthContext";

type Transaction = {
  id: string;
  userId: string;
  username: string;
  userEmail: string;
  dateCreated: string;
  amount: number;
  price: number;
  item: string;
  type: "Gem" | "Item";
};

export default function AdminTransactionsPage() {
  const { user, isAdmin, adminLoading, loading } = useAuthContext();
  const router = useRouter();

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [transactionsLoading, setTransactionsLoading] = useState(true);
  const [filter, setFilter] = useState<
    "all" | "latest" | "oldest" | "highest" | "lowest"
  >("all");
  const [typeFilter, setTypeFilter] = useState<"all" | "Gem" | "Item">("all");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [typeDropdownOpen, setTypeDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const typeDropdownRef = useRef<HTMLDivElement | null>(null);
  const searchInputRef = useRef<HTMLInputElement | null>(null);

  // Redirect non-admin users
  useEffect(() => {
    if (!loading && !adminLoading && user && !isAdmin) {
      router.replace("/user/dashboard");
    }
  }, [user, isAdmin, adminLoading, loading, router]);

  // Load transactions when admin is verified
  useEffect(() => {
    if (!loading && !adminLoading && user && isAdmin) {
      loadTransactions();
    }
  }, [loading, adminLoading, user, isAdmin]);

  const loadTransactions = async () => {
    setTransactionsLoading(true);
    try {
      if (!user) {
        throw new Error("No user found");
      }

      const idToken = await user.getIdToken();

      const response = await fetch("/api/admin/transactions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ idToken }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setTransactions(data.transactions || []);
      } else {
        console.error("API Error:", data.error);
        setTransactions([]);
      }
    } catch (error) {
      console.error("Error fetching transactions:", error);
      setTransactions([]);
    }
    setTransactionsLoading(false);
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
      }
      if (
        typeDropdownRef.current &&
        !typeDropdownRef.current.contains(e.target as Node)
      ) {
        setTypeDropdownOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  // Keyboard shortcut for search (Ctrl+F / Cmd+F)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "f") {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Filtering and sorting logic
  const filteredAndSortedTransactions = useMemo(() => {
    // First filter by search query and type
    let filtered = transactions;

    // Filter by type
    if (typeFilter !== "all") {
      filtered = filtered.filter((transaction) => transaction.type === typeFilter);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter((transaction) => {
        return (
          transaction.username.toLowerCase().includes(query) ||
          transaction.userEmail.toLowerCase().includes(query) ||
          transaction.id.toLowerCase().includes(query) ||
          transaction.item.toLowerCase().includes(query) ||
          transaction.type.toLowerCase().includes(query)
        );
      });
    }

    // Then sort the filtered results
    switch (filter) {
      case "latest":
        return filtered.sort(
          (a, b) =>
            new Date(b.dateCreated).getTime() -
            new Date(a.dateCreated).getTime()
        );
      case "oldest":
        return filtered.sort(
          (a, b) =>
            new Date(a.dateCreated).getTime() -
            new Date(b.dateCreated).getTime()
        );
      case "highest":
        return filtered.sort((a, b) => b.amount - a.amount);
      case "lowest":
        return filtered.sort((a, b) => a.amount - b.amount);
      default:
        return filtered;
    }
  }, [filter, typeFilter, transactions, searchQuery]);

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  // Show loading while checking auth and admin status
  if (loading || adminLoading) {
    return (
      <div className="relative h-fit overflow-y-auto p-6 sm:p-10">
        <div className="bg-[#E5E5E5] rounded-xl p-8 shadow-lg text-[#1B1B1B]">
          <div className="text-center">
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
      <div className="relative h-fit overflow-y-auto p-6 sm:p-10">
        <div className="bg-[#E5E5E5] rounded-xl p-8 shadow-lg text-[#1B1B1B]">
          <div className="text-center">
            <h1 className="text-2xl mb-4">Access Denied</h1>
            <p>You don't have permission to access this page.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-fit overflow-y-auto p-6 sm:p-10">
      <div className="bg-[#E5E5E5] rounded-xl p-8 shadow-lg text-[#1B1B1B]">
        {/* Header */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
            <h1 className="text-3xl font-bold mb-4 sm:mb-0 font-[PixterDisplay] select-none">
              Transaction Viewer
            </h1>

            <div className="flex items-center gap-3 select-none *:hover:cursor-pointer">
              {/* Type Filter Dropdown */}
              <div className="relative" ref={typeDropdownRef}>
                <button
                  onClick={() => setTypeDropdownOpen((p) => !p)}
                  className="flex items-center gap-2 bg-[#E5E5E5] border-2 border-[#1B1B1B] px-4 py-2 rounded-md font-[PixterDisplay] transition hover:cursor-pointer"
                >
                  Type:{" "}
                  <span className="font-semibold">
                    {typeFilter === "all" ? "All Types" : typeFilter === "Gem" ? "Gem Purchases" : "Item Purchases"}
                  </span>
                  <span className="text-sm">▼</span>
                </button>

                <ul
                  className={`absolute left-0 mt-2 w-48 bg-white border border-gray-300 rounded-md shadow-md overflow-hidden transition-all duration-200 origin-top z-10 ${
                    typeDropdownOpen
                      ? "opacity-100 translate-y-0 scale-100"
                      : "opacity-0 translate-y-2 scale-95 pointer-events-none"
                  }`}
                >
                  {[
                    { value: "all", label: "All Types" },
                    { value: "Gem", label: "Gem Purchases" },
                    { value: "Item", label: "Item Purchases" }
                  ].map((option) => (
                    <li
                      key={option.value}
                      onClick={() => {
                        setTypeFilter(option.value as "all" | "Gem" | "Item");
                        setTypeDropdownOpen(false);
                      }}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer font-[PixterDisplay]"
                    >
                      {option.label}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Sort Filter Dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen((p) => !p)}
                  className="flex items-center gap-2 bg-[#E5E5E5] border-2 border-[#1B1B1B] px-4 py-2 rounded-md font-[PixterDisplay] transition hover:cursor-pointer"
                >
                  Sort by:{" "}
                  <span className="font-semibold capitalize">{filter}</span>
                  <span className="text-sm">▼</span>
                </button>

                <ul
                  className={`absolute left-0 mt-2 w-40 bg-white border border-gray-300 rounded-md shadow-md overflow-hidden transition-all duration-200 origin-top z-10 ${
                    dropdownOpen
                      ? "opacity-100 translate-y-0 scale-100"
                      : "opacity-0 translate-y-2 scale-95 pointer-events-none"
                  }`}
                >
                  {["all", "latest", "oldest", "highest", "lowest"].map(
                    (option) => (
                      <li
                        key={option}
                        onClick={() => {
                          setFilter(option as any);
                          setDropdownOpen(false);
                        }}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer font-[PixterDisplay]"
                      >
                        {option.charAt(0).toUpperCase() + option.slice(1)}
                      </li>
                    )
                  )}
                </ul>
              </div>

              {/* Refresh Button */}
              <button
                onClick={loadTransactions}
                disabled={transactionsLoading}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-md text-sm font-semibold"
              >
                {transactionsLoading ? "Loading..." : "Refresh"}
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center select-none">
            <div className="relative flex-1 max-w-md">
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search by username, email, transaction ID, item, or type..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 pl-10 border-2 border-gray-300 rounded-md focus:border-[#77dd76] focus:outline-none font-[PixterDisplay]"
              />
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                🔍
              </div>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              )}
            </div>
            <div className="text-sm text-gray-600 font-[PixterDisplay] flex flex-wrap gap-4">
              {searchQuery && (
                <span>{filteredAndSortedTransactions.length} result(s) found</span>
              )}
              {!searchQuery && (
                <>
                  <span>Total: {filteredAndSortedTransactions.length}</span>
                  {typeFilter === "all" && (
                    <>
                      <span>Gems: {transactions.filter(t => t.type === "Gem").length}</span>
                      <span>Items: {transactions.filter(t => t.type === "Item").length}</span>
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm sm:text-base">
            <thead className="bg-[#77DD76] text-[#1B1B1B] select-none">
              <tr>
                <th className="px-4 py-3 text-left font-[PixterDisplay]">
                  User Name
                </th>
                <th className="px-4 py-3 text-left font-[PixterDisplay]">
                  Email
                </th>
                <th className="px-4 py-3 text-left font-[PixterDisplay]">
                  Date
                </th>
                <th className="px-4 py-3 text-left font-[PixterDisplay]">
                  Type
                </th>
                <th className="px-4 py-3 text-left font-[PixterDisplay]">
                  Item
                </th>
                <th className="px-4 py-3 text-left font-[PixterDisplay]">
                  Amount
                </th>
                <th className="px-4 py-3 text-left font-[PixterDisplay]">
                  Price
                </th>
                <th className="px-4 py-3 text-left font-[PixterDisplay]">
                  Transaction ID
                </th>
              </tr>
            </thead>
            <tbody>
              {transactionsLoading ? (
                <tr>
                  <td
                    colSpan={8}
                    className="px-4 py-6 text-center text-gray-500"
                  >
                    <div className="flex items-center justify-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-500"></div>
                      Loading transactions...
                    </div>
                  </td>
                </tr>
              ) : filteredAndSortedTransactions.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="px-4 py-6 text-center text-gray-500"
                  >
                    {searchQuery.trim()
                      ? "No transactions match your search."
                      : "No transactions found."}
                  </td>
                </tr>
              ) : (
                filteredAndSortedTransactions.map(
                  (t: Transaction, i: number) => (
                    <tr
                      key={t.id}
                      className={`${
                        i % 2 === 0 ? "bg-[#e8f7e9]" : "bg-[#f9f9f9]"
                      } font-[PixterDisplay]`}
                    >
                      <td className="px-4 py-3">{t.username}</td>
                      <td className="px-4 py-3">{t.userEmail}</td>
                      <td className="px-4 py-3">{formatDate(t.dateCreated)}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          t.type === 'Gem' 
                            ? 'bg-blue-100 text-blue-800' 
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {t.type}
                        </span>
                      </td>
                      <td className="px-4 py-3">{t.item || "N/A"}</td>
                      <td className="px-4 py-3">{t.amount}</td>
                      <td className="px-4 py-3">${t.price?.toFixed(2) || "N/A"}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {t.id}
                      </td>
                    </tr>
                  )
                )
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
