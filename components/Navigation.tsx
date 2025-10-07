"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed w-full top-0 z-50 transition-all bg-black/70 backdrop-blur-md shadow-md select-none`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Image src="/assets/logo.png" alt="logo" width={56} height={56} />
        </div>

        <ul className="hidden md:flex items-center gap-8 text-sm">
          <li>
            <a href="#top" className="text-yellow-400">
              Home
            </a>
          </li>
          <li>
            <a href="#media" className="hover:text-yellow-400 transition-colors">
              Media
            </a>
          </li>
          <li>
            <Link href="/support" className="hover:text-yellow-400 transition-colors">
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
          <button
            onClick={() => (window.location.href = "/login")}
            className="bg-yellow-500 hover:bg-yellow-600 text-black px-4 py-2 rounded-md text-xs transition-colors hover:cursor-pointer"
          >
            Login
          </button>
        </div>
      </div>
    </nav>
  );
}
