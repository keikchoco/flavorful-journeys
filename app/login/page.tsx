"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import logo from "@/public/assets/logo.png";
import hero from "@/public/assets/Loading Screen2.png";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    setError("");
    setLoading(true);
    
    if (!email || !password) {
      setError("Please enter both email and password");
      setLoading(false);
      return;
    }

    const { user, error: loginError } = await login(email, password);
    
    if (loginError) {
      setError(loginError);
      setLoading(false);
      return;
    }

    if (user) {
      // Check if user is admin (you can customize this logic)
      if (email === "admin@flavorfuljourneys.com") {
        router.push("/admin/dashboard");
      } else {
        router.push("/user/dashboard");
      }
    }
    
    setLoading(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSignIn();
  };

  return (
    <main className="relative min-h-screen flex flex-col">
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
              FLAVORFUL JOURNEYS
            </h2>

            <div className="space-y-5">
              <input
                id="txtEmail"
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full border border-gray-400 focus:text-black/90 text-black/40 rounded-xl px-4 py-2 focus:outline-none focus:border-[#fa9130] hover:border-[#77dd76] placeholder-black/40"
              />

              {/* Password Input with Toggle */}
              <div className="relative">
                <input
                  id="txtPassword"
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="w-full border border-gray-400 focus:text-black/90 text-black/40 rounded-xl px-4 py-2 pr-10 focus:outline-none focus:border-[#fa9130] hover:border-[#77dd76] placeholder-black/40"
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

              <button
                onClick={handleSignIn}
                disabled={loading}
                className="w-full bg-[#fa9130] hover:bg-[#ad6421] text-[#1B1B1B] hover:text-white hover:cursor-pointer transition-all rounded-xl py-3 font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Signing In..." : "Sign In"}
              </button>

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
              Start your cooking journey today!
            </h2>
          </div>
        </div>
      </section>
    </main>
  );
}
