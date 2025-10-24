"use client";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import axios from "axios";
import Image from "next/image";
import hero from "@/public/assets/Loading Screen2.png";
import logo from "@/public/assets/logo.png";

export default function VerifyOtpPage() {
    const router = useRouter();

    const searchParams = useSearchParams();

    // Retrieve registration info from URL params
    const username = searchParams.get("username") || "";
    const email = searchParams.get("email") || "";
    const password = searchParams.get("password") || "";

    // States
    const [otp, setOtp] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [cooldown, setCooldown] = useState(0); // 60s cooldown

    // Auto redirect if missing required params
    useEffect(() => {
        if (!email || !password || !username) {
            router.push("/register");
        }
    }, [email, password, username, router]);

    // Countdown timer effect
    useEffect(() => {
        if (cooldown <= 0) return;
        const interval = setInterval(() => setCooldown((prev) => prev - 1), 1000);
        return () => clearInterval(interval);
    }, [cooldown]);

    // Handle OTP verification
    const handleVerify = async () => {
        if (!otp.trim()) {
            setError("Please enter the OTP sent to your email.");
            return;
        }

        setError("");
        setLoading(true);
        try {
            const res = await axios.post("/api/register/verify-otp", { email, otp });

            if (res.status === 200) {
                setSuccess(true);

                // Register user after successful OTP
                await axios.post("/api/register", { username, email, password });

                setTimeout(() => {
                    router.push("/login");
                }, 2000);
            } else {
                setError("Invalid OTP. Please try again.");
            }
        } catch (err: any) {
            setError(err.response?.data?.error || "Failed to verify OTP.");
        } finally {
            setLoading(false);
        }
    };

    // Handle resend OTP
    const handleResendOtp = async () => {
        if (cooldown > 0) return;

        try {
            setError("");
            setCooldown(60);
            await axios.post("/api/register/send-otp", { email });
        } catch (err: any) {
            setError("Failed to resend OTP. Please try again later.");
            setCooldown(0);
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
                            VERIFY YOUR EMAIL
                        </h2>

                        <p className="text-center text-sm mb-6 text-gray-600">
                            Enter the 6-digit OTP sent to <strong>{email}</strong>
                        </p>

                        <input
                            type="text"
                            maxLength={6}
                            placeholder="Enter OTP"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            className="w-full text-center border border-gray-400 rounded-xl px-4 py-3 text-black/70 text-lg tracking-widest focus:outline-none focus:border-[#fa9130] hover:border-[#77dd76]"
                        />
                        <button
                            onClick={handleVerify}
                            disabled={loading}
                            className="w-full mt-6 bg-[#fa9130] hover:bg-[#ad6421] text-[#1B1B1B] hover:text-white transition-all rounded-xl py-3 font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? "Verifying..." : "Verify OTP"}
                        </button>

                        {/* Resend and Change Email Buttons */}
                        <div className="flex justify-between items-center mt-6">
                            <button
                                onClick={() => router.push("/register")}
                                className="text-sm text-[#fa9130] hover:text-[#ad6421] transition-all"
                            >
                                ← Change Email
                            </button>

                            <button
                                onClick={handleResendOtp}
                                disabled={cooldown > 0}
                                className={`text-sm font-medium ${cooldown > 0
                                    ? "text-gray-400 cursor-not-allowed"
                                    : "text-[#77dd76] hover:text-[#5dbb5b]"
                                    } transition-all`}
                            >
                                {cooldown > 0
                                    ? `Resend OTP in ${cooldown}s`
                                    : "Resend OTP"}
                            </button>
                        </div>

                        {error && (
                            <p className="text-red-500 text-center text-sm mt-4">{error}</p>
                        )}

                        {success && (
                            <p className="text-green-600 text-center text-sm mt-4">
                                OTP verified successfully! Redirecting...
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
                            Almost there! Confirm your OTP to start your flavorful journey 🍽️
                        </h2>
                    </div>
                </div>
            </section>
        </main >
    );
}
