'use client';

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return <div className="w-10 h-10" />; 

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="p-2.5 rounded-xl bg-gray-50 dark:bg-slate-800 border border-gray-100 dark:border-slate-700 text-[#484848] dark:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-700 transition-all group"
      aria-label="Toggle Theme"
    >
      {theme === "dark" ? (
        <Sun size={18} className="group-hover:rotate-45 transition-transform" />
      ) : (
        <Moon size={18} className="group-hover:-rotate-12 transition-transform" />
      )}
    </button>
  );
}