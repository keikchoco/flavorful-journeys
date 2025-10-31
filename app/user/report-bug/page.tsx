"use client";
import { useState, useEffect } from "react";
import AdminRedirect from "@/components/AdminRedirect";
import { useAuthContext } from "@/contexts/AuthContext";

interface BugReport {
  id: string;
  date: string;
  category: string;
  description: string;
  status: string;
}

export default function UserBugReportPage() {
  const { user, loading } = useAuthContext();
  const [reports, setReports] = useState<BugReport[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && user) {
      loadBugReports();
    }
  }, [user, loading]);

  const loadBugReports = async () => {
    if (!user) return;
    try {
      setDataLoading(true);
      const idToken = await user.getIdToken();
      const res = await fetch("/api/user/report-bug", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      });

      const result = await res.json();
      if (result.success) setReports(result.reports || []);
      else setError(result.error || "Failed to load bug reports");
    } catch (err) {
      setError("Error loading bug reports");
    } finally {
      setDataLoading(false);
    }
  };

  const submitBug = async () => {
    if (!description.trim()) {
      alert("Please describe the bug.");
      return;
    }

    try {
      setSubmitting(true);
      if (!user) {
        alert("Please log in first.");
        return;
      }
      const idToken = await user!.getIdToken();
      const res = await fetch("/api/user/report-bug", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          idToken,
          title: category || "Uncategorized",
          description,
        }),
      });

      const result = await res.json();
      if (result.success) {
        setDescription("");
        setCategory("");
        loadBugReports();
      } else alert(result.error || "Failed to submit bug");
    } catch {
      alert("Error submitting bug report.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading)
    return (
      <div className="text-center py-20">
        <p className="text-xl">Loading bug report system...</p>
      </div>
    );

  if (!user)
    return (
      <div className="text-center py-20">
        <h1 className="text-2xl font-bold mb-4">Please Log In</h1>
        <p>You need to be logged in to report a bug.</p>
      </div>
    );

  return (
    <>
      <AdminRedirect />
      <div className="bg-[#E5E5E5] rounded-xl shadow-lg p-8 md:p-12 mb-20">
        <h1 className="text-2xl md:text-3xl font-bold mb-6">Report a Bug</h1>

        <div className="flex flex-col gap-4 mb-8 ">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="p-3 rounded-md border border-gray-400 rounded-lg"
          >
            <option value="">Select Category</option>
            <option value="UI">UI / Interface</option>
            <option value="Gameplay">Gameplay</option>
            <option value="Performance">Performance</option>
            <option value="Other">Other</option>
          </select>

          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={5}
            placeholder="Describe the bug here..."
            className="p-3 rounded-md border resize-none border-gray-400 rounded-lg"
          />

          <button
            onClick={submitBug}
            disabled={submitting}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-md font-semibold transition"
          >
            {submitting ? "Submitting..." : "Submit Bug Report"}
          </button>
        </div>

        <h2 className="text-xl font-bold mb-4">Your Previous Reports</h2>

        {dataLoading ? (
          <p>Loading...</p>
        ) : reports.length === 0 ? (
          <p>No bug reports found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse rounded-xl overflow-hidden">
              <thead className="bg-[#77dd76] text-[#1B1B1B]">
                <tr>
                  <th className="py-3 px-4 text-left">Date</th>
                  <th className="py-3 px-4 text-left">Category</th>
                  <th className="py-3 px-4 text-left">Description</th>
                  <th className="py-3 px-4 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {reports.map((r, i) => (
                  <tr
                    key={r.id}
                    className={`${i % 2 === 0 ? "bg-[#f9f9f9]" : "bg-[#e8f7e9]"
                      } border-b border-gray-200`}
                  >
                    <td className="py-3 px-4">
                      {r.date ? new Date(r.date).toLocaleString() : "N/A"}
                    </td>
                    <td className="py-3 px-4">{r.category}</td>
                    <td className="py-3 px-4">{r.description}</td>
                    <td className="py-3 px-4 font-medium">{r.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
