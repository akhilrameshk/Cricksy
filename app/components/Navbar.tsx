"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "../providers";

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  const navLinks = [
    { href: "/tournaments", label: "Tournaments", icon: "fa-trophy" },
    { href: "/players", label: "Players", icon: "fa-people-group" },
    { href: "/matches", label: "Matches", icon: "fa-baseball" },
  ];

  return (
    <>
      {/* Desktop / Large Screen Header */}
      <nav className="sticky top-0 z-50 hidden border-b border-slate-200 bg-white/90 shadow-lg backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/90 lg:block">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-3 no-underline">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-lime-300 to-emerald-500 shadow-lg shadow-emerald-500/30">
              <i className="fa-solid fa-cricket text-xl text-emerald-950" />
            </div>

            <div>
              <h1 className="text-2xl font-black text-slate-900 dark:text-white">
                Cricksy
              </h1>
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-emerald-500">
                Live Cricket
              </p>
            </div>
          </Link>

          <div className="flex items-center gap-3 rounded-full border border-slate-200 bg-slate-100 p-2 dark:border-slate-800 dark:bg-slate-900">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-full px-5 py-3 text-sm font-bold no-underline transition ${
                  isActive(link.href)
                    ? "bg-gradient-to-r from-lime-300 to-emerald-400 text-emerald-950 shadow-lg"
                    : "text-slate-600 hover:bg-white hover:text-emerald-600 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-emerald-400"
                }`}
              >
                <i className={`fa-solid ${link.icon} mr-2`} />
                {link.label}
              </Link>
            ))}
          </div>

          <button
            onClick={toggleTheme}
            className="rounded-full bg-gradient-to-r from-lime-300 to-emerald-400 px-5 py-3 text-sm font-black text-emerald-950 shadow-lg transition hover:scale-105"
            title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
          >
            <i
              className={`fa-solid ${
                theme === "dark" ? "fa-sun" : "fa-moon"
              } mr-2`}
            />
            {theme === "dark" ? "Light" : "Dark"}
          </button>
        </div>
      </nav>

      {/* Tablet / Mobile Top Header */}
      <nav className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 shadow-md backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/90 lg:hidden">
        <div className="flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2 no-underline">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-lime-300 to-emerald-500">
              <i className="fa-solid fa-cricket text-emerald-950" />
            </div>

            <span className="text-xl font-black text-slate-900 dark:text-white">
              Cricksy
            </span>
          </Link>
        </div>
      </nav>

      {/* Tablet / Mobile Bottom Menu */}
      <div className="fixed bottom-4 left-1/2 z-50 w-[92%] max-w-md -translate-x-1/2 rounded-3xl border border-slate-200 bg-white/90 p-2 shadow-2xl backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/90 lg:hidden">
        <div className="grid grid-cols-4 gap-2">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`flex flex-col items-center justify-center rounded-2xl px-2 py-3 text-xs font-bold no-underline transition ${
                isActive(link.href)
                  ? "bg-emerald-600 text-white dark:bg-emerald-500 dark:text-slate-950"
                  : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-900"
              }`}
            >
              <i className={`fa-solid ${link.icon} mb-1 text-lg`} />
              {link.label}
            </Link>
          ))}

          <button
            onClick={toggleTheme}
            className="flex flex-col items-center justify-center rounded-2xl px-2 py-3 text-xs font-bold text-slate-600 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-900"
            title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
          >
            <i
              className={`fa-solid ${
                theme === "dark" ? "fa-sun text-amber-400" : "fa-moon"
              } mb-1 text-lg`}
            />
            {theme === "dark" ? "Light" : "Dark"}
          </button>
        </div>
      </div>
    </>
  );
}