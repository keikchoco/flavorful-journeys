"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/contexts/AuthContext";
import { useBugReportActions } from "./hooks/useBugReportActions";
import { CloseReportModal } from "./components/CloseReportModal";
import { BugModal } from "./components/BugModal";

export default function AdminBugReportsPage() {
  const [showCloseModal, setShowCloseModal] = useState(false);
  const [selectedReport, setSelectedReport] = useState<BugReport | null>(null);

  const handleOpenCloseModal = (report: BugReport) => {
    setSelectedReport(report);
    setShowCloseModal(true);
  };

  const handleDeleteReport = async (reportId: string) => {
    const confirmed = confirm("Are you sure you want to delete this report?");
    if (!confirmed) return;

    try {
      const idToken = await user?.getIdToken();
      const res = await fetch("/api/admin/bug-reports/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken, reportId }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setReports((prev) => prev.filter((r) => r.id !== reportId));
        alert("Bug report deleted successfully.");
      } else {
        alert(data.error || "Failed to delete bug report.");
      }
    } catch (err) {
      console.error("Error deleting report:", err);
      alert("Something went wrong.");
    }
  };


  const confirmCloseReport = async () => {
    if (!selectedReport) return;
    const result = await closeReport(selectedReport.id);
    if (result.success) {
      alert("Report closed successfully!");
      setReports(prev =>
        prev.map(r =>
          r.id === selectedReport.id ? { ...r, status: "Resolved" } : r
        )
      );
    } else {
      alert(`Failed to close report: ${result.error}`);
    }
    setShowCloseModal(false);
    setSelectedReport(null);
  };
  interface BugReport {
    id: string;
    userId: string;
    username?: string;
    email?: string;
    category: string;
    description: string;
    status: "Pending" | "In Progress" | "Resolved";
    dateCreated: string;
  }
  const { user, isAdmin, adminLoading, loading } = useAuthContext();
  const router = useRouter();
  const { closeReport } = useBugReportActions(); // ✅ import your hook here

  const [reports, setReports] = useState<BugReport[]>([]);
  const [loadingReports, setLoadingReports] = useState(true);
  const [filter, setFilter] = useState<
    "all" | "latest" | "oldest" | "pending" | "resolved"
  >("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const searchInputRef = useRef<HTMLInputElement | null>(null);

  const handleClose = async (reportId: string) => {
    const confirmed = confirm("Are you sure you want to close this report?");
    if (!confirmed) return;

    const result = await closeReport(reportId);
    if (result.success) {
      alert("Report closed successfully!");
      setReports((prev) =>
        prev.map((r) =>
          r.id === reportId ? { ...r, status: "Resolved" as any } : r
        )
      );
    } else {
      alert(`Failed to close report: ${result.error || "Unknown error"}`);
    }
  };

  // Redirect non-admins
  useEffect(() => {
    if (!loading && !adminLoading && user && !isAdmin) {
      router.replace("/user/dashboard");
    }
  }, [user, isAdmin, adminLoading, loading, router]);

  // Load reports when verified
  useEffect(() => {
    if (!loading && !adminLoading && user && isAdmin) {
      loadReports();
    }
  }, [loading, adminLoading, user, isAdmin]);

  const loadReports = async () => {
    setLoadingReports(true);
    try {
      if (!user) throw new Error("No user found");

      const idToken = await user.getIdToken();
      const response = await fetch("/api/admin/bug-reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      });

      const data = await response.json();
      if (response.ok && data.success) setReports(data.reports || []);
      else setReports([]);
    } catch (error) {
      console.error("Error fetching bug reports:", error);
      setReports([]);
    }
    setLoadingReports(false);
  };

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

  // Ctrl+F shortcut
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

  const filteredReports = useMemo(() => {
    let filtered = reports;

    // Filter by search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      filtered = filtered.filter((r) => {
        const email = (r.email ?? "").toString().toLowerCase();
        const category = (r.category ?? "").toString().toLowerCase();
        const description = (r.description ?? "").toString().toLowerCase();
        const id = (r.id ?? "").toString().toLowerCase();
        return (
          email.includes(q) ||
          category.includes(q) ||
          description.includes(q) ||
          id.includes(q)
        );
      });
    }

    // Sort/filter by dropdown
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
            new Date(a.dateCreated).getTime() - new Date(b.dateCreated).getTime()
        );
      case "pending":
        return filtered.filter((r) => r.status === "Pending");
      case "resolved":
        return filtered.filter((r) => r.status === "Resolved");
      default:
        return filtered;
    }
  }, [filter, reports, searchQuery]);

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  if (loading || adminLoading)
    return (
      <div className="p-10 text-center">
        <h1 className="text-2xl mb-4">Loading...</h1>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-700 mx-auto"></div>
      </div>
    );

  if (!isAdmin)
    return (
      <div className="p-10 text-center">
        <h1 className="text-2xl mb-4">Access Denied</h1>
        <p>You don’t have permission to access this page.</p>
      </div>
    );

  return (
    <div className="relative h-fit overflow-y-auto p-6 sm:p-10">
      <div className="bg-[#E5E5E5] rounded-xl p-8 shadow-lg text-[#1B1B1B]">
        {/* Header */}
        <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <h1 className="text-3xl font-bold font-[PixterDisplay] select-none">
            Bug Reports
          </h1>

          <div className="flex items-center gap-3 select-none">
            {/* Sort/Filter Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen((p) => !p)}
                className="flex items-center gap-2 border-2 border-[#1B1B1B] px-4 py-2 rounded-md font-[PixterDisplay]"
              >
                Filter: <span className="font-semibold capitalize">{filter}</span>
                <span className="text-sm">▼</span>
              </button>
              <ul
                className={`absolute left-0 mt-2 w-40 bg-white border border-gray-300 rounded-md shadow-md transition-all duration-200 origin-top z-10 ${dropdownOpen
                  ? "opacity-100 translate-y-0 scale-100"
                  : "opacity-0 translate-y-2 scale-95 pointer-events-none"
                  }`}
              >
                {["all", "latest", "oldest", "open", "resolved"].map((f) => (
                  <li
                    key={f}
                    onClick={() => {
                      setFilter(f as any);
                      setDropdownOpen(false);
                    }}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer font-[PixterDisplay]"
                  >
                    {f.charAt(0).toUpperCase() + f.slice(1)}
                  </li>
                ))}
              </ul>
            </div>

            <button
              onClick={loadReports}
              disabled={loadingReports}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-md text-sm font-semibold"
            >
              {loadingReports ? "Loading..." : "Refresh"}
            </button>
          </div>
        </div>

        {/* Search bar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1 max-w-md">
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search by title, user, email, or status..."
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
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm sm:text-base">
            <thead className="bg-[#77DD76] text-[#1B1B1B] select-none">
              <tr>
                {/* <th className="px-4 py-3 text-left font-[PixterDisplay]">User</th> */}
                <th className="px-4 py-3 text-left font-[PixterDisplay]">Email</th>
                <th className="px-4 py-3 text-left font-[PixterDisplay]">Date</th>
                <th className="px-4 py-3 text-left font-[PixterDisplay]">Category</th>
                {/* <th className="px-4 py-3 text-left font-[PixterDisplay]">Description</th> */}
                <th className="px-4 py-3 text-left font-[PixterDisplay]">Status</th>
                <th className="px-4 py-3 text-left font-[PixterDisplay]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loadingReports ? (
                <tr>
                  <td colSpan={6} className="px-4 py-6 text-center text-gray-500">
                    <div className="flex items-center justify-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-500"></div>
                      Loading reports...
                    </div>
                  </td>
                </tr>
              ) : filteredReports.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-6 text-center text-gray-500">
                    {searchQuery.trim()
                      ? "No reports match your search."
                      : "No bug reports found."}
                  </td>
                </tr>
              ) : (
                filteredReports.map((r, i) => (
                  <tr
                    key={r.id}
                    className={`${i % 2 === 0 ? "bg-[#e8f7e9]" : "bg-[#f9f9f9]"
                      } font-[PixterDisplay]`}
                  >
                    {/* <td className="px-4 py-3">{r.username}</td> */}
                    <td className="px-4 py-3">{r.email}</td>
                    <td className="px-4 py-3">{formatDate(r.dateCreated)}</td>
                    <td className="px-4 py-3 font-semibold">{r.category}</td>
                    {/* <td className="px-4 py-3 truncate max-w-xs">{r.description}</td> */}
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${r.status === "Resolved"
                          ? "bg-green-100 text-green-700"
                          : r.status === "Pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-green-100 text-green-700"
                          }`}
                      >
                        {r.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 flex gap-2">
                      {/* View button */}
                      <button
                        onClick={() => setSelectedReport(r)} // open a view modal
                        className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-xs"
                      >
                        View
                      </button>

                      {/* Close button */}
                      {r.status !== "Resolved" && (
                        <button
                          onClick={() => handleOpenCloseModal(r)}
                          className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded-md text-xs"
                        >
                          Close
                        </button>
                      )}
                    </td>
                  </tr>

                ))
              )}
            </tbody>
          </table>
          <BugModal
            isOpen={!!selectedReport && !showCloseModal}
            report={selectedReport}
            onClose={() => setSelectedReport(null)}
            onCloseReport={() => handleOpenCloseModal(selectedReport!)}
          />

          <CloseReportModal
            isOpen={showCloseModal}
            onClose={() => {
              setShowCloseModal(false);
              setSelectedReport(null);
            }}
            onConfirm={confirmCloseReport}
          />
        </div>
      </div>
    </div>
  );
}