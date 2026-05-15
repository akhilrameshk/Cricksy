/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useTheme } from "../providers";

function FooterAd() {
  useEffect(() => {
    try {
      (window as any).adsbygoogle =
        (window as any).adsbygoogle || [];
      (window as any).adsbygoogle.push({});
    } catch {}
  }, []);

  return (
    <ins
      className="adsbygoogle"
      style={{ display: "block" }}
      data-ad-client="ca-pub-5590321516536916"
      data-ad-slot="2254489201"
      data-ad-format="auto"
      data-full-width-responsive="true"
    />
  );
}

export default function Footer() {
  useTheme(); // Ensure theme provider is available for styling context
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-20 border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-gradient-to-r dark:from-slate-900 dark:to-slate-800 transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Ads Section */}
        <div className="py-8 border-b border-slate-200 dark:border-slate-700">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Ad Slot 1 */}
            <div className="bg-gray-100 dark:bg-slate-800 rounded-lg p-4">
              <FooterAd />
            </div>

            {/* Ad Slot 2 */}
            <div className="bg-gray-100 dark:bg-slate-800 rounded-lg p-4">
              <FooterAd />
            </div>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 py-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 flex items-center justify-center">
                <i className="fa-solid fa-cricket text-white"></i>
              </div>
              <span className="font-bold text-lg bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
                Tournament
              </span>
            </Link>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Professional cricket tournament management platform
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <i className="fa-solid fa-link text-orange-500"></i>
              Quick Links
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/tournaments"
                  className="text-gray-600 dark:text-gray-400 hover:text-orange-600 dark:hover:text-orange-400 transition text-sm"
                >
                  Tournaments
                </Link>
              </li>
              <li>
                <Link
                  href="/players"
                  className="text-gray-600 dark:text-gray-400 hover:text-orange-600 dark:hover:text-orange-400 transition text-sm"
                >
                  Players
                </Link>
              </li>
              <li>
                <Link
                  href="/matches"
                  className="text-gray-600 dark:text-gray-400 hover:text-orange-600 dark:hover:text-orange-400 transition text-sm"
                >
                  Matches
                </Link>
              </li>
            </ul>
          </div>

          {/* Features */}
          <div>
            <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <i className="fa-solid fa-star text-orange-500"></i>
              Features
            </h3>
            <ul className="space-y-2">
              <li>
                <span className="text-gray-600 dark:text-gray-400 text-sm flex items-center gap-2">
                  <i className="fa-solid fa-check text-emerald-500"></i>
                  Live Scoring
                </span>
              </li>
              <li>
                <span className="text-gray-600 dark:text-gray-400 text-sm flex items-center gap-2">
                  <i className="fa-solid fa-check text-emerald-500"></i>
                  Tournament Management
                </span>
              </li>
              <li>
                <span className="text-gray-600 dark:text-gray-400 text-sm flex items-center gap-2">
                  <i className="fa-solid fa-check text-emerald-500"></i>
                  Player Statistics
                </span>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <i className="fa-solid fa-headset text-orange-500"></i>
              Support
            </h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="mailto:support@tournament.com"
                  className="text-gray-600 dark:text-gray-400 hover:text-orange-600 dark:hover:text-orange-400 transition text-sm"
                >
                  support@tournament.com
                </a>
              </li>
              <li>
                <span className="text-gray-600 dark:text-gray-400 text-sm">Available 24/7</span>
              </li>
              <li className="pt-2">
                <div className="flex gap-3">
                  <a
                    href="#"
                    className="w-8 h-8 rounded-full bg-gray-200 dark:bg-slate-700 flex items-center justify-center text-gray-700 dark:text-gray-300 hover:bg-orange-500 hover:text-white transition"
                  >
                    <i className="fa-brands fa-facebook-f text-sm"></i>
                  </a>
                  <a
                    href="#"
                    className="w-8 h-8 rounded-full bg-gray-200 dark:bg-slate-700 flex items-center justify-center text-gray-700 dark:text-gray-300 hover:bg-orange-500 hover:text-white transition"
                  >
                    <i className="fa-brands fa-twitter text-sm"></i>
                  </a>
                  <a
                    href="#"
                    className="w-8 h-8 rounded-full bg-gray-200 dark:bg-slate-700 flex items-center justify-center text-gray-700 dark:text-gray-300 hover:bg-orange-500 hover:text-white transition"
                  >
                    <i className="fa-brands fa-instagram text-sm"></i>
                  </a>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-slate-200 dark:border-slate-700 pt-8">
          {/* Bottom Footer */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              &copy; {currentYear} Tournament Management. All rights reserved.
            </p>
            <div className="flex gap-6">
              <Link
                href="#"
                className="text-sm text-gray-600 dark:text-gray-400 hover:text-orange-600 dark:hover:text-orange-400 transition"
              >
                Privacy Policy
              </Link>
              <Link
                href="#"
                className="text-sm text-gray-600 dark:text-gray-400 hover:text-orange-600 dark:hover:text-orange-400 transition"
              >
                Terms of Service
              </Link>
              <Link
                href="#"
                className="text-sm text-gray-600 dark:text-gray-400 hover:text-orange-600 dark:hover:text-orange-400 transition"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}