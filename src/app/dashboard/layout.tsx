import Link from "next/link";
import ThemeToggle from "../../components/ThemeToggle";
import UserNav from "../../components/dashboard/user-nav";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0F172A] transition-colors duration-500">
      <nav className="border-b border-gray-100 dark:border-slate-800 bg-white/80 dark:bg-[#0F172A]/80 backdrop-blur-xl px-8 py-4 sticky top-0 z-50">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="flex items-center gap-2 group">
              <div className="relative w-8 h-8 group-hover:scale-110 transition-transform">
                <img src="/logo.png" alt="HostFlow" className="w-full h-full object-contain" />
              </div>
              <span className="text-xl font-black tracking-tighter text-[#008489]">HostFlow</span>
            </Link>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <ThemeToggle />
            <div className="h-6 w-[1px] bg-gray-100 dark:border-slate-800 mx-1 sm:mx-2" />
            <UserNav />
          </div>
        </div>
      </nav>
      {children}
    </div>
  );
}