"use client";
import { useState } from "react";

export default function TopupHistoryPage() {

  const transactions = [
    { date: "2025-10-08", amount: "₱500", gems: "50", id: "TXN12345" },
    { date: "2025-09-21", amount: "₱200", gems: "20", id: "TXN67890" },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background layers */}
      <div
        className="fixed inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/assets/Loading Screen2.png')" }}
      />
      <div className="fixed inset-0 bg-[#8d4e1b]/30" />

      {/* Scrollable content */}
      <div className="relative z-10 h-screen overflow-y-auto px-4 sm:px-8 md:px-20 py-24">
        <section className="mx-auto max-w-5xl bg-[#E5E5E5] text-[#1B1B1B] rounded-xl p-10 flex flex-col gap-8">
          <h1 className="text-3xl sm:text-4xl font-bold">Top Up History</h1>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse bg-white rounded-lg overflow-hidden text-left">
              <thead className="bg-[#77dd76] text-[#1B1B1B] font-semibold">
                <tr>
                  <th className="px-6 py-3 text-base">Date</th>
                  <th className="px-6 py-3 text-base">Amount</th>
                  <th className="px-6 py-3 text-base">Gems</th>
                  <th className="px-6 py-3 text-base">Transaction ID</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((t, i) => (
                  <tr
                    key={t.id}
                    className={`${
                      i % 2 === 0 ? "bg-[#f9f9f9]" : "bg-[#e8f7e9]"
                    } hover:bg-[#fa9130]/20 transition`}
                  >
                    <td className="px-6 py-3">{t.date}</td>
                    <td className="px-6 py-3">{t.amount}</td>
                    <td className="px-6 py-3">{t.gems}</td>
                    <td className="px-6 py-3">{t.id}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}
