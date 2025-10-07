"use client";
import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuthContext } from "@/contexts/AuthContext";
import Image from "next/image";
import logo from "@/public/assets/logo.png";
import Link from "next/link";

export default function UserNavigation() {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuthContext();

  const handleLogout = async () => {
    const { error } = await logout();
    if (!error) {
      router.push("/");
    }
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 transition-colors duration-300 bg-black/70 backdrop-blur-md shadow-md select-none">
      <div className="max-w-[1800px] mx-auto px-6 py-3 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Image
            src={logo}
            alt="Logo"
            className="h-[50px] w-auto object-contain"
          />
        </div>

        <ul className="hidden md:flex gap-6 text-white text-lg">
          <li>
            <Link 
              href="/user/dashboard" 
              className={pathname === "/user/dashboard" ? "text-[#77dd76] cursor-default" : "hover:text-[#77dd76]"}
            >
              Dashboard
            </Link>
          </li>
          <li>
            <Link 
              href="/user/topup-history" 
              className={pathname === "/user/topup-history" ? "text-[#77dd76] cursor-default" : "hover:text-[#77dd76]"}
            >
              Top Up History
            </Link>
          </li>
          <li>
            <Link 
              href="/user/gem-spending-history" 
              className={pathname === "/user/gem-spending-history" ? "text-[#77dd76] cursor-default" : "hover:text-[#77dd76]"}
            >
              Gem Spending History
            </Link>
          </li>
          <li>
            <Link 
              href="/user/account-settings" 
              className={pathname === "/user/account-settings" ? "text-[#77dd76] cursor-default" : "hover:text-[#77dd76]"}
            >
              Account Settings
            </Link>
          </li>
        </ul>

        <button
          onClick={handleLogout}
          className="rounded-full border-2 border-white text-white px-6 py-2 text-lg transition-all hover:bg-[#fa9130] hover:border-[#fa9130]"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
