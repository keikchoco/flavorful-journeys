"use client";
import { useState } from "react";
import Image from "next/image";
import gems from "@/public/assets/gems.png";

export default function UserDashboardPage() {
  const [username, setUsername] = useState("Loading...");
  const [gemsCount, setGemsCount] = useState("Loading...");
  const [totalAmount, setTotalAmount] = useState("Loading...");
  const [lastItem, setLastItem] = useState("Loading...");

  return (
    <div className="bg-[#E5E5E5] rounded-xl shadow-lg p-8 md:p-12 mb-20">
      <h1 className="text-2xl md:text-3xl font-bold mb-8">
        Welcome Back, <span>{username}</span>
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <div className="flex justify-between items-center bg-[#70a2e4] text-[#1B1B1B] rounded-xl p-6">
          <div>
            <h2 className="text-3xl font-bold">GEMS</h2>
            <p className="text-4xl">{gemsCount}</p>
          </div>
          <Image src={gems} alt="Gems" className="w-[70px] h-[70px] object-contain" />
        </div>

        <div className="flex justify-between items-center bg-[#77dd76] text-[#1B1B1B] rounded-xl p-6">
          <div>
            <h2 className="text-3xl font-bold">TOTAL TOPUP</h2>
            <p className="text-4xl">{totalAmount}</p>
          </div>
        </div>

        <div className="flex justify-between items-center bg-[rgb(216,78,78)] text-[#1B1B1B] rounded-xl p-6">
          <div>
            <h2 className="text-3xl font-bold">LAST PURCHASED</h2>
            <p className="text-4xl">{lastItem}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
