/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect } from "react";

export default function AdCard() {
  useEffect(() => {
    try {
      ((window as any).adsbygoogle =
        (window as any).adsbygoogle || []).push({});
    } catch (err) {}
  }, []);

  return (
    <div className="mx-5 mt-2 overflow-hidden rounded-[20px] border border-slate-300 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
      <div className="border-b border-slate-200 px-4 py-2 dark:border-slate-700">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
          Sponsored
        </p>
      </div>

      <div className="flex min-h-[120px] items-center justify-center p-2">
        <ins
          className="adsbygoogle"
          style={{ display: "block", width: "100%" }}
          data-ad-client="ca-pub-5590321516536916"
          data-ad-slot="2254489201"
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      </div>
    </div>
  );
}