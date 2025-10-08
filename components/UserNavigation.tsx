"use client";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuthContext } from "@/contexts/AuthContext";
import { usePrefetchedNavigation } from "@/hooks/usePrefetchedNavigation";
import Image from "next/image";
import logo from "@/public/assets/logo.png";
import Link from "next/link";

interface UserNavigationProps {
  onLogout?: () => void;
}

export default function UserNavigation({ onLogout }: UserNavigationProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuthContext();
  const [loadingPath, setLoadingPath] = useState<string | null>(null);
  const { navigateWithPrefetch, isNavigating } = usePrefetchedNavigation({
    onLoadingStateChange: (loading) => {
      if (!loading) {
        setLoadingPath(null);
      }
    }
  });

  const handleLogout = async () => {
    if (onLogout) {
      onLogout();
    } else {
      const { error } = await logout();
      if (!error) {
        router.push("/");
      }
    }
  };

  const handleNavigation = async (path: string, e: React.MouseEvent) => {
    e.preventDefault();
    
    // Don't navigate if we're already on this page
    if (pathname === path) {
      return;
    }

    setLoadingPath(path);
    await navigateWithPrefetch(path);
  };

  const NavLink = ({ href, children, className }: { href: string; children: React.ReactNode; className?: string }) => {
    const isActive = pathname === href;
    const isLoading = loadingPath === href;
    
    return (
      <a
        href={href}
        onClick={(e) => handleNavigation(href, e)}
        className={`${className} ${isLoading ? 'opacity-50 cursor-wait' : ''} transition-all duration-200`}
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
            {children}
          </span>
        ) : (
          children
        )}
      </a>
    );
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
            <NavLink 
              href="/user/dashboard" 
              className={pathname === "/user/dashboard" ? "text-[#77dd76] cursor-default" : "hover:text-[#77dd76]"}
            >
              Dashboard
            </NavLink>
          </li>
          <li>
            <NavLink 
              href="/user/topup-history" 
              className={pathname === "/user/topup-history" ? "text-[#77dd76] cursor-default" : "hover:text-[#77dd76]"}
            >
              Top Up History
            </NavLink>
          </li>
          <li>
            <NavLink 
              href="/user/spending-history" 
              className={pathname === "/user/spending-history" ? "text-[#77dd76] cursor-default" : "hover:text-[#77dd76]"}
            >
              Spending History
            </NavLink>
          </li>
          <li>
            <NavLink 
              href="/user/account-settings" 
              className={pathname === "/user/account-settings" ? "text-[#77dd76] cursor-default" : "hover:text-[#77dd76]"}
            >
              Account Settings
            </NavLink>
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
