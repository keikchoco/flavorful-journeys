"use client";
import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import axios from "axios";
import Image from "next/image";
import hero from "@/public/assets/Loading Screen2.png";

export default function ResetPasswordPage() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const uid = searchParams.get("uid") || "";
    const token = searchParams.get("token") || "";

    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        if (!uid || !token) {
            setError("Invalid reset link.");
        }
    }, [uid, token]);

    const handleReset = async () => {
        if (!newPassword || !confirmPassword) {
            setError("Please enter all fields.");
            return;
        }
        if (newPassword !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        setError("");
        setLoading(true);

        try {
            const res = await axios.post("/api/reset-password", { uid, token, newPassword });

            if (res.data.success) {
                setSuccess(true);
                setTimeout(() => router.push("/login"), 2000); // redirect to login
            } else {
                setError(res.data.error || "Failed to reset password.");
            }
        } catch (err: any) {
            setError(err.response?.data?.error || "Failed to reset password.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="relative min-h-screen flex flex-col select-none">
            {/* Background */}
            <section className="relative w-full h-screen overflow-hidden">
                <Image
                    src={hero}
                    alt="Hero Background"
                    fill
                    className="object-cover opacity-80 z-10 select-none"
                    priority
                />
                <div className="absolute inset-0 bg-[#8d4e1b]/30 z-20" />
            </section>

            {/* Foreground content */}
            <section className="absolute inset-0 flex justify-center items-center z-30">
                <div className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-md">
                    <h2 className="text-2xl font-bold mb-6 text-center text-[#1B1B1B]">
                        Reset Password
                    </h2>

                    {error && <p className="text-red-500 text-center mb-4">{error}</p>}
                    {success && <p className="text-green-600 text-center mb-4">Password reset successfully! Redirecting...</p>}

                    {!success && (
                        <>
                            <input
                                type="password"
                                placeholder="New Password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="w-full border border-gray-400 rounded-xl px-4 py-3 mb-4 text-black focus:outline-none focus:border-[#fa9130]"
                            />
                            <input
                                type="password"
                                placeholder="Confirm Password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full border border-gray-400 rounded-xl px-4 py-3 mb-4 text-black focus:outline-none focus:border-[#fa9130]"
                            />
                            <button
                                onClick={handleReset}
                                disabled={loading}
                                className="w-full bg-[#fa9130] hover:bg-[#ad6421] text-[#1B1B1B] hover:text-white py-3 rounded-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? "Resetting..." : "Reset Password"}
                            </button>
                        </>
                    )}
                </div>
            </section>
        </main>
    );
}
