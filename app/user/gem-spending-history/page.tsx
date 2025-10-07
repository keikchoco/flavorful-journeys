"use client";
import { useState } from "react";

interface Transaction {
  date: string;
  item: string;
  currency: string;
  price: string;
  transactionId: string;
  imageUrl?: string;
}

export default function UserGemSpendingHistoryPage() {
  const [transactions] = useState<Transaction[]>([
    {
      date: "2025-10-01",
      item: "Chef Hat Upgrade",
      currency: "GEMS",
      price: "150",
      transactionId: "TXN-9823",
      imageUrl: "/assets/chef-hat.png",
    },
    {
      date: "2025-09-22",
      item: "Kitchen Skin",
      currency: "GEMS",
      price: "300",
      transactionId: "TXN-2745",
      imageUrl: "/assets/kitchen-skin.png",
    },
  ]);

  const [previewImage, setPreviewImage] = useState<string | null>(null);

  return (
    <div className="bg-[#E5E5E5] rounded-xl shadow-lg p-8 md:p-12 mb-20">
      <h1 className="text-2xl md:text-3xl font-bold mb-8 text-[#1B1B1B]">
        Gem Spending History
      </h1>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse rounded-xl overflow-hidden">
          <thead className="bg-[#77dd76] text-[#1B1B1B]">
            <tr>
              <th className="py-3 px-4 text-left">Date</th>
              <th className="py-3 px-4 text-left">Item</th>
              <th className="py-3 px-4 text-left">Currency</th>
              <th className="py-3 px-4 text-left">Price</th>
              <th className="py-3 px-4 text-left">Transaction ID</th>
              <th className="py-3 px-4 text-left">View</th>
            </tr>
          </thead>

          <tbody>
            {transactions.map((t, i) => (
              <tr
                key={t.transactionId}
                className={`${
                  i % 2 === 0 ? "bg-[#f9f9f9]" : "bg-[#e8f7e9]"
                } border-b border-gray-200`}
              >
                <td className="py-3 px-4">{t.date}</td>
                <td className="py-3 px-4">{t.item}</td>
                <td className="py-3 px-4">{t.currency}</td>
                <td className="py-3 px-4">{t.price}</td>
                <td className="py-3 px-4">{t.transactionId}</td>
                <td className="py-3 px-4">
                  {t.imageUrl ? (
                    <button
                      onClick={() => setPreviewImage(t.imageUrl!)}
                      className="bg-[#007BFF] text-white px-4 py-2 rounded-lg hover:scale-105 hover:bg-[#fa9130] transition-transform"
                    >
                      View
                    </button>
                  ) : (
                    <span className="text-gray-500">N/A</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Image Modal */}
      {previewImage && (
        <div className="fixed inset-0 bg-black/75 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl relative flex justify-center items-center">
            <button
              onClick={() => setPreviewImage(null)}
              className="absolute top-2 right-3 text-2xl font-bold text-[#1B1B1B] hover:scale-110 transition-transform"
            >
              &times;
            </button>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={previewImage}
              alt="Item Preview"
              className="max-w-[500px] max-h-[500px] object-contain rounded-lg"
            />
          </div>
        </div>
      )}
    </div>
  );
}
