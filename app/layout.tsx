import "./globals.css";
import type { ReactNode } from "react";
import { Press_Start_2P } from "next/font/google";
import { AuthProvider } from "@/contexts/AuthContext";

const press = Press_Start_2P({ subsets: ["latin"], weight: "400" });

export const metadata = {
  title: "Flavorful Journeys",
  description: "1v1 cooking showdown",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="shortcut icon" href="/assets/logo.png" />
      </head>
      <body className={`${press.className} bg-[#0e0901] text-gray-200`}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
