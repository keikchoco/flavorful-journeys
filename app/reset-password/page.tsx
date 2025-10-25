"use client";
import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import axios from "axios";
import Image from "next/image";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import hero from "@/public/assets/Loading Screen2.png";
import logo from "@/public/assets/logo.png";

export default function ResetPasswordPage() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const uid = searchParams.get("uid") || "";
    const token = searchParams.get("token") || "";

    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        if (!uid || !token) setError("Invalid reset link.");
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
                setTimeout(() => router.push("/login"), 2000);
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
                <div className="grid grid-cols-1 md:grid-cols-2 w-[90%] md:w-[70%] lg:w-[60%] rounded-2xl overflow-hidden shadow-xl xl:aspect-[4/2]">
                    {/* Left Side */}
                    <div className="flex flex-col justify-center bg-white p-10 md:p-16">
                        <h2 className="text-center text-2xl font-bold mb-10 text-[#1B1B1B]">
                            Reset Password
                        </h2>

                        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
                        {success && (
                            <p className="text-green-600 text-center mb-4">
                                Password reset successfully! Redirecting...
                            </p>
                        )}

                        {!success && (
                            <div className="space-y-5">
                                {/* New Password */}
                                <div className="relative">
                                    <input
                                        type={showNewPassword ? "text" : "password"}
                                        placeholder="New Password"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        className="w-full border border-gray-400 text-black rounded-xl px-4 py-3 pr-10 focus:outline-none focus:border-[#fa9130]"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowNewPassword(!showNewPassword)}
                                        className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-[#fa9130]"
                                        tabIndex={-1}
                                    >
                                        {showNewPassword ? <EyeOffIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                                    </button>
                                </div>

                                {/* Confirm Password */}
                                <div className="relative">
                                    <input
                                        type={showConfirmPassword ? "text" : "password"}
                                        placeholder="Confirm Password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="w-full border border-gray-400 text-black rounded-xl px-4 py-3 pr-10 focus:outline-none focus:border-[#fa9130]"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-[#fa9130]"
                                        tabIndex={-1}
                                    >
                                        {showConfirmPassword ? <EyeOffIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                                    </button>
                                </div>

                                <button
                                    onClick={handleReset}
                                    disabled={loading}
                                    className="w-full bg-[#fa9130] hover:bg-[#ad6421] text-[#1B1B1B] hover:text-white py-3 rounded-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? "Resetting..." : "Reset Password"}
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Right Side */}
                    <div className="flex flex-col justify-evenly items-center bg-[#77dd76] p-10">
                        <Image src={logo} alt="Logo" width={250} height={250} className="object-contain" />
                        <h2 className="text-center text-[#1B1B1B] text-lg font-medium">
                            Secure your account and continue your flavorful journey!
                        </h2>
                    </div>
                </div>
            </section>
        </main>
    );
}
