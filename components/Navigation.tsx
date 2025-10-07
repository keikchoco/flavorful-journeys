"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navigation() {
  const pathname = usePathname();

  return (
    <nav
      className={`fixed w-full top-0 z-50 transition-all bg-black/70 backdrop-blur-md shadow-md select-none text-white/90 text-lg`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Image src="/assets/logo.png" alt="logo" width={56} height={56} />
        </div>

        <ul className="hidden md:flex items-center gap-8 text-lg">
          <li>
            <Link 
              href="/" 
              className={pathname === "/" ? "text-yellow-400 cursor-default" : "hover:text-yellow-400 transition-colors"}
            >
              Home
            </Link>
          </li>
          <li>
            <a href="#media" className="hover:text-yellow-400 transition-colors">
              Media
            </a>
          </li>
          <li>
            <Link 
              href="/faq" 
              className={pathname === "/faq" ? "text-yellow-400 cursor-default" : "hover:text-yellow-400 transition-colors"}
            >
              FAQs
            </Link>
          </li>
          <li>
            <a href="#about" className="hover:text-yellow-400 transition-colors">
              About
            </a>
          </li>
        </ul>

        <div className="flex items-center gap-4">
          <Link
            href="/login"
            className="bg-yellow-500 hover:bg-yellow-600 text-black px-4 py-2 rounded-md text-lg transition-colors hover:cursor-pointer"
          >
            Login
          </Link>
        </div>
      </div>
    </nav>
  );
}
