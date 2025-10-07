"use client";
import { useState } from "react";

export default function AccountSettingsPage() {
  const [activeSection, setActiveSection] = useState<"email" | "password">("email");

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background layers */}
      <div
        className="fixed inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/assets/Loading Screen2.png')" }}
      />
      <div className="fixed inset-0 bg-[#8d4e1b]/30" />

      {/* Scrollable container */}
      <div className="relative z-10 h-screen overflow-y-auto py-24 px-4 sm:px-8 md:px-20">
        <section className="mx-auto max-w-4xl bg-[#E5E5E5] text-[#1B1B1B] rounded-xl p-10 flex flex-col gap-8">
          {/* Header and toggle */}
          <div className="flex flex-col sm:flex-row justify-between gap-4 sm:items-center">
            <h1 className="text-3xl sm:text-4xl font-bold">Account Settings</h1>
            <div className="flex gap-3">
              <button
                onClick={() => setActiveSection("email")}
                className={`px-5 py-2 rounded-lg font-semibold transition-all ${
                  activeSection === "email"
                    ? "bg-[#fa9130] text-[#1B1B1B]"
                    : "bg-[#fa9130]/80 text-white hover:bg-[#ad6421]"
                }`}
              >
                Change Email
              </button>
              <button
                onClick={() => setActiveSection("password")}
                className={`px-5 py-2 rounded-lg font-semibold transition-all ${
                  activeSection === "password"
                    ? "bg-[#fa9130] text-[#1B1B1B]"
                    : "bg-[#fa9130]/80 text-white hover:bg-[#ad6421]"
                }`}
              >
                Change Password
              </button>
            </div>
          </div>

          {/* Email section */}
          {activeSection === "email" && (
            <div className="flex flex-col gap-6">
              <h2 className="text-2xl font-semibold">
                Current Email Address:{" "}
                <span className="text-[#fa9130]">Loading...</span>
              </h2>
              <h2 className="text-2xl font-semibold">Change Email</h2>
              <div className="flex flex-col gap-4">
                <input
                  type="email"
                  placeholder="New Email Address"
                  className="px-4 py-3 rounded-lg border-2 border-[#1B1B1B] focus:border-[#fa9130] outline-none text-lg"
                />
                <button className="px-5 py-3 bg-[#fa9130] text-[#1B1B1B] rounded-lg font-semibold transition-all hover:bg-[#ad6421] hover:text-white">
                  Save Email
                </button>
              </div>
            </div>
          )}

          {/* Password section */}
          {activeSection === "password" && (
            <div className="flex flex-col gap-6">
              <h2 className="text-2xl font-semibold">Change Password</h2>
              <div className="flex flex-col gap-4">
                <input
                  type="password"
                  placeholder="Current Password"
                  className="px-4 py-3 rounded-lg border-2 border-[#1B1B1B] focus:border-[#fa9130] outline-none text-lg"
                />
                <input
                  type="password"
                  placeholder="New Password"
                  className="px-4 py-3 rounded-lg border-2 border-[#1B1B1B] focus:border-[#fa9130] outline-none text-lg"
                />
                <input
                  type="password"
                  placeholder="Retype New Password"
                  className="px-4 py-3 rounded-lg border-2 border-[#1B1B1B] focus:border-[#fa9130] outline-none text-lg"
                />
                <button className="px-5 py-3 bg-[#fa9130] text-[#1B1B1B] rounded-lg font-semibold transition-all hover:bg-[#ad6421] hover:text-white">
                  Update Password
                </button>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
