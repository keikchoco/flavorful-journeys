import React from "react";
import { Modal } from './Modal';

interface BugModalProps {
    isOpen: boolean;
    report: {
        id: string;
        email?: string;
        category: string;
        description: string;
        status: string;
        dateCreated: string;
    } | null;
    onClose: () => void;
    onCloseReport: (id: string) => void;
}

export function BugModal({ isOpen, report, onClose, onCloseReport }: BugModalProps) {
    if (!isOpen || !report) return null;

    return (
        <Modal onClose={onClose}>
            <h3 className="text-xl font-semibold mb-4">Bug Report Details</h3>

            <div className="space-y-2 text-sm">
                <p><strong>Email:</strong> {report.email || "N/A"}</p>
                <p><strong>Category:</strong> {report.category}</p>
                <p><strong>Date:</strong> {new Date(report.dateCreated).toLocaleString()}</p>
                <p><strong>Status:</strong> {report.status}</p>
                <div className="mt-4 p-3 bg-[#2a2a2a] rounded-lg">
                    <p className="whitespace-pre-wrap">{report.description}</p>
                </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
                <button
                    onClick={onClose}
                    className="px-4 py-2 rounded border border-gray-500 text-gray-300 hover:bg-[#2a2a2a]"
                >
                    Close
                </button>
                {report.status !== "Resolved" && (
                    <button
                        onClick={() => onCloseReport(report.id)}
                        className="px-4 py-2 rounded bg-green-600 text-white font-semibold hover:bg-green-700"
                    >
                        Mark Resolved
                    </button>
                )}
            </div>
        </Modal>
    );
}
