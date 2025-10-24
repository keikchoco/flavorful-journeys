"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import axios from "axios";
import logo from "@/public/assets/logo.png";
import hero from "@/public/assets/Loading Screen2.png";

export default function RegisterPage() {
  const router = useRouter();

  // States
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const saved = sessionStorage.getItem("registerData");
    if (saved) {
      const { username, email, password, confirmPassword } = JSON.parse(saved);
      setUsername(username || "");
      setEmail(email || "");
      setPassword(password || "");
      setConfirmPassword(confirmPassword || "");
    }
  }, []);

  // Validation
  const validateInputs = () => {
    // Username validation
    if (username.trim().length < 3) {
      setError("Username must be at least 3 characters long!");
      return false;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Invalid email format!");
      return false;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return false;
    }

    if (!/[a-z]/.test(password)) {
      setError("Password must include at least one lowercase letter.");
      return false;
    }

    if (!/[A-Z]/.test(password)) {
      setError("Password must include at least one uppercase letter.");
      return false;
    }

    if (!/\d/.test(password)) {
      setError("Password must include at least one number.");
      return false;
    }

    if (!/[\W_]/.test(password)) {
      setError("Password must include at least one special character.");
      return false;
    }

    // Confirm password
    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return false;
    }

    setError("");
    return true;
  };


  const handleRegister = async () => {
    setError("");
    if (!validateInputs()) return;

    setLoading(true);
    try {
      // Send OTP request to backend (Node API using Nodemailer)
      const res = await axios.post("/api/register/send-otp", { email });
      if (res.status === 200) {

        sessionStorage.setItem(
          "registerData",
          JSON.stringify({ username, email, password, confirmPassword })
        );
        
        router.push(
          `/verify-otp?username=${encodeURIComponent(username)}&email=${encodeURIComponent(
            email
          )}&password=${encodeURIComponent(password)}`
        );
      } else {
        setError("Failed to send OTP. Please try again.");
      }
    } catch (err: any) {
      setError(err.response?.data?.error || "An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen flex flex-col select-none">
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

      <section className="absolute inset-0 flex justify-center items-center z-30">
        <div className="grid grid-cols-1 md:grid-cols-2 w-[90%] md:w-[70%] lg:w-[60%] rounded-2xl overflow-hidden shadow-xl xl:aspect-[4/2]">
          {/* Left Side */}
          <div className="flex flex-col justify-center bg-white p-10 md:p-16">
            <h2 className="text-center text-2xl font-bold mb-10 text-[#1B1B1B]">
              CREATE AN ACCOUNT
            </h2>

            <div className="space-y-5">
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full border border-gray-400 rounded-xl px-4 py-2 text-black/70 focus:outline-none focus:border-[#fa9130] hover:border-[#77dd76]"
              />

              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-gray-400 rounded-xl px-4 py-2 text-black/70 focus:outline-none focus:border-[#fa9130] hover:border-[#77dd76]"
              />

              {/* Password Field */}
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border border-gray-400 rounded-xl px-4 py-2 pr-10 text-black/70 focus:outline-none focus:border-[#fa9130] hover:border-[#77dd76]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-[#fa9130]"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOffIcon className="w-5 h-5" />
                  ) : (
                    <EyeIcon className="w-5 h-5" />
                  )}
                </button>
              </div>

              <input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full border border-gray-400 rounded-xl px-4 py-2 text-black/70 focus:outline-none focus:border-[#fa9130] hover:border-[#77dd76]"
              />

              <button
                onClick={handleRegister}
                disabled={loading}
                className="w-full bg-[#fa9130] hover:bg-[#ad6421] text-[#1B1B1B] hover:text-white transition-all rounded-xl py-3 font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Sending OTP..." : "Register"}
              </button>

              <div className="text-sm text-[#1b1b1b] text-center">
                Already have an account?{" "}
                <a
                  href="/login"
                  className="text-sm text-[#fa9130] hover:text-[#ad6421] transition-all"
                >
                  Sign In
                </a>
              </div>

              {error && (
                <h3 className="text-red-500 text-center text-base">{error}</h3>
              )}
            </div>
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
              Verify your email to begin your flavorful journey!
            </h2>
          </div>
        </div>
      </section>
    </main>
  );
}
