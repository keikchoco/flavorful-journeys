"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type Transaction = {
  id: string;
  name: string;
  email: string;
  date: string;
  transactionId: string;
  amount: number;
  gems: number;
};

const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    date: "2025-10-01T09:30:00Z",
    transactionId: "TXN-001",
    amount: 15.5,
    gems: 100,
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane@example.com",
    date: "2025-09-28T15:45:00Z",
    transactionId: "TXN-002",
    amount: 30.0,
    gems: 250,
  },
  {
    id: "3",
    name: "Mark Lee",
    email: "mark@example.com",
    date: "2025-09-25T10:20:00Z",
    transactionId: "TXN-003",
    amount: 8.99,
    gems: 50,
  },
];

export default function AdminTransactionsPage() {
  const [transactions] = useState(MOCK_TRANSACTIONS);
  const [filter, setFilter] = useState<
    "all" | "latest" | "oldest" | "highest" | "lowest"
  >("all");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  // Sorting logic
  const sortedTransactions = useMemo(() => {
    const sorted = [...transactions];
    switch (filter) {
      case "latest":
        return sorted.sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );
      case "oldest":
        return sorted.sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
        );
      case "highest":
        return sorted.sort((a, b) => b.amount - a.amount);
      case "lowest":
        return sorted.sort((a, b) => a.amount - b.amount);
      default:
        return sorted;
    }
  }, [filter, transactions]);

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <div className="relative h-fit overflow-y-auto p-6 sm:p-10">
      <div className="bg-[#E5E5E5] rounded-xl p-8 shadow-lg text-[#1B1B1B]">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <h1 className="text-3xl font-bold mb-4 sm:mb-0 font-[PixterDisplay]">
            Transaction Viewer
          </h1>

          {/* Filter Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen((p) => !p)}
              className="flex items-center gap-2 bg-[#E5E5E5] border-2 border-[#1B1B1B] px-4 py-2 rounded-md font-[PixterDisplay] transition"
            >
              Filter by:{" "}
              <span className="font-semibold capitalize">{filter}</span>
              <span className="text-sm">▼</span>
            </button>

            <ul
              className={`absolute left-0 mt-2 w-40 bg-white border border-gray-300 rounded-md shadow-md overflow-hidden transition-all duration-200 origin-top ${
                dropdownOpen
                  ? "opacity-100 translate-y-0 scale-100"
                  : "opacity-0 translate-y-2 scale-95 pointer-events-none"
              }`}
            >
              {["all", "latest", "oldest", "highest", "lowest"].map((option) => (
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
              ))}
            </ul>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm sm:text-base">
            <thead className="bg-[#77DD76] text-[#1B1B1B]">
              <tr>
                <th className="px-4 py-3 text-left font-[PixterDisplay]">Name</th>
                <th className="px-4 py-3 text-left font-[PixterDisplay]">Email</th>
                <th className="px-4 py-3 text-left font-[PixterDisplay]">Date</th>
                <th className="px-4 py-3 text-left font-[PixterDisplay]">
                  Transaction ID
                </th>
                <th className="px-4 py-3 text-left font-[PixterDisplay]">Amount</th>
                <th className="px-4 py-3 text-left font-[PixterDisplay]">Gems</th>
              </tr>
            </thead>
            <tbody>
              {sortedTransactions.map((t, i) => (
                <tr
                  key={t.id}
                  className={`${
                    i % 2 === 0 ? "bg-[#e8f7e9]" : "bg-[#f9f9f9]"
                  } font-[PixterDisplay]`}
                >
                  <td className="px-4 py-3">{t.name}</td>
                  <td className="px-4 py-3">{t.email}</td>
                  <td className="px-4 py-3">{formatDate(t.date)}</td>
                  <td className="px-4 py-3">{t.transactionId}</td>
                  <td className="px-4 py-3">${t.amount.toFixed(2)}</td>
                  <td className="px-4 py-3">{t.gems}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
