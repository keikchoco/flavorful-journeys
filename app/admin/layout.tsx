import AdminNavigation from "@/components/AdminNavigation";
import Image from "next/image";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative h-screen overflow-hidden bg-[#1b1b1b] text-[#1b1b1b] font-[PixterDisplay]">
      {/* Background */}
      <div className="fixed inset-0">
        <Image
          src="/assets/Loading Screen2.png"
          alt="Background"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-[#8d4e1b]/30" />
      </div>

      {/* Sidebar Navigation */}
      <AdminNavigation />

      {/* Main Content */}
      <div className="ml-[300px] relative z-10 h-full overflow-y-auto p-10 sm:p-16">
        {children}
      </div>
    </div>
  );
}
