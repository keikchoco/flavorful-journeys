"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Image from "next/image";
import hero from "@/public/assets/Loading Screen2.png";
import logo from "@/public/assets/logo.png";

export default function ForgotPasswordPage() {
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async () => {
        if (!email.trim()) {
            setError("Please enter your email address.");
            return;
        }

        setError("");
        setLoading(true);
        try {
            const res = await axios.post("/api/request-password-reset", { email });

            if (res.data.success) {
                setSuccess(true);
            } else {
                setError(res.data.error || "Failed to send reset email.");
            }
        } catch (err: any) {
            setError(err.response?.data?.error || "Failed to send reset email.");
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
                        <h2 className="text-center text-2xl font-bold mb-6 text-[#1B1B1B]">
                            FORGOT PASSWORD
                        </h2>

                        {!success ? (
                            <>
                                <p className="text-center text-sm mb-6 text-gray-600">
                                    Enter your email address to receive a password reset link.
                                </p>

                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full border border-gray-400 rounded-xl px-4 py-3 text-black/70 text-lg focus:outline-none focus:border-[#fa9130] hover:border-[#77dd76]"
                                />

                                <button
                                    onClick={handleSubmit}
                                    disabled={loading}
                                    className="w-full mt-6 bg-[#fa9130] hover:bg-[#ad6421] text-[#1B1B1B] hover:text-white transition-all rounded-xl py-3 font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? "Sending..." : "Send Reset Email"}
                                </button>

                                {error && (
                                    <p className="text-red-500 text-center text-sm mt-4">{error}</p>
                                )}
                            </>
                        ) : (
                            <p className="text-green-600 text-center text-sm mt-4">
                                Check your email for the password reset instructions.
                            </p>
                        )}
                    </div>

                    {/* Right Side */}
                    <div className="flex flex-col justify-evenly items-center bg-[#77dd76] p-10">
                        <Image
                            src={logo}
                            alt="Logo"
                            width={250}
                            height={250}
                            className="object-contain"
                        />
                        <h2 className="text-center text-[#1B1B1B] text-lg font-medium">
                            Reset your password and continue your flavorful journey 🍽️
                        </h2>
                    </div>
                </div>
            </section>
        </main>
    );
}
