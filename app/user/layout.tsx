"use client";
import Image from "next/image";
import hero from "@/public/assets/Loading Screen2.png";
import UserNavigation from "@/components/UserNavigation";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function UserDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
    const router = useRouter();
  const [showModal, setShowModal] = useState(false);

  const handleLogout = () => setShowModal(true);
  const confirmLogout = () => {
    router.push("/");
    setShowModal(false);
  };
  const cancelLogout = () => setShowModal(false);

  return (
    <main className="relative min-h-screen overflow-hidden font-[PixterDisplay] text-[#1B1B1B]">
      {/* Background */}
      <div className="fixed inset-0 -z-10">
        <Image src={hero} alt="Hero Banner" fill className="object-cover" priority />
        <div className="absolute inset-0 bg-[#8d4e1b]/30"></div>
      </div>

      {/* Navigation */}
      <UserNavigation onLogout={handleLogout} />

      {/* Page Content */}
      <section className="relative z-10 h-screen overflow-y-auto pt-[120px] px-6 md:px-20 pb-10">
        {children}
      </section>

      {/* Logout Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/75 flex items-center justify-center z-50">
          <div className="bg-[#1b1b1b] p-10 rounded-xl text-center text-white shadow-xl">
            <p className="text-xl mb-6">Are you sure you want to logout?</p>
            <div className="flex justify-center gap-6">
              <button
                onClick={confirmLogout}
                className="bg-[#77dd76] text-[#1B1B1B] px-6 py-2 rounded-lg text-lg font-bold hover:scale-105 transition-transform"
              >
                Yes
              </button>
              <button
                onClick={cancelLogout}
                className="border-2 border-white px-6 py-2 rounded-lg text-lg hover:scale-105 transition-transform"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
