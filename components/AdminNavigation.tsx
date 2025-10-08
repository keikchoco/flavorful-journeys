"use client";
import Image from "next/image";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuthContext } from "@/contexts/AuthContext";
import { usePrefetchedNavigation } from "@/hooks/usePrefetchedNavigation";
import Link from "next/link";

export default function AdminNavigation() {
  const [showLogout, setShowLogout] = useState(false);
  const [loadingPath, setLoadingPath] = useState<string | null>(null);
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuthContext();
  const { navigateWithPrefetch, isNavigating } = usePrefetchedNavigation({
    onLoadingStateChange: (loading) => {
      if (!loading) {
        setLoadingPath(null);
      }
    }
  });

  const handleLogout = async () => {
    setShowLogout(false);
    const { error } = await logout();
    if (!error) {
      router.push("/");
    } else {
      console.error("Logout failed:", error);
    }
  };

  const handleNavigation = async (path: string) => {
    setLoadingPath(path);
    await navigateWithPrefetch(path);
  };

  const NavLink = ({ href, children }: { href: string; children: React.ReactNode }) => {
    const isActive = pathname === href;
    const isLoading = loadingPath === href;
    
    if (isActive) {
      return <span className="text-[#77dd76] cursor-default">{children}</span>;
    }
    
    return (
      <button
        onClick={() => handleNavigation(href)}
        className="hover:text-[#77dd76] text-left hover:cursor-pointer"
        disabled={isNavigating}
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            <span className="animate-spin">⟳</span>
            {children}
          </span>
        ) : (
          children
        )}
      </button>
    );
  };

  return (
    <>
      <nav className="fixed top-0 left-0 h-full w-[300px] bg-[#1b1b1b] z-50 flex flex-col justify-between items-center p-6 select-none">
        <div className="flex flex-col items-center space-y-6">
          <Image
            src="/assets/logo.png"
            alt="Logo"
            width={150}
            height={150}
            className="object-contain"
          />
          <ul className="flex flex-col space-y-4 text-[#E5E5E5] text-xl">
            <li>
              <NavLink href="/admin/dashboard">
                Dashboard
              </NavLink>
            </li>
            <li>
              <NavLink href="/admin/users">
                User Management
              </NavLink>
            </li>
            <li>
              <NavLink href="/admin/transactions">
                Transactions
              </NavLink>
            </li>
            <li>
              <NavLink href="/admin/shop">
                Shop Items
              </NavLink>
            </li>
          </ul>
        </div>
        <button
          onClick={() => setShowLogout(true)}
          className="w-full py-2 text-lg border-2 border-[#E5E5E5] text-[#E5E5E5] rounded-full hover:bg-[#77dd76] hover:text-[#1b1b1b] transition-all mb-6 hover:cursor-pointer"
        >
          Logout
        </button>
      </nav>

      {showLogout && (
        <div className="fixed inset-0 bg-black/40 bg-opacity-75 flex items-center justify-center z-50 select-none">
          <div className="bg-[#1b1b1b] text-[#E5E5E5] p-10 rounded-xl shadow-lg text-center">
            <p className="text-2xl mb-6 font-[PixterDisplay]">
              Are you sure you want to logout?
            </p>
            <div className="flex justify-center gap-6">
              <button
                onClick={handleLogout}
                className="bg-[#77dd76] text-[#1b1b1b] px-6 py-3 rounded-lg text-xl hover:scale-105 transition-all hover:cursor-pointer"
              >
                Yes
              </button>
              <button
                onClick={() => setShowLogout(false)}
                className="border-2 border-[#E5E5E5] text-[#E5E5E5] px-6 py-3 rounded-lg text-xl hover:scale-105 transition-all hover:cursor-pointer hover:bg-red-700"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
