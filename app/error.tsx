"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCcw, Home } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="container mx-auto px-6 py-24 md:px-12 flex flex-col items-center justify-center min-h-[60vh] text-center">
      <div className="w-20 h-20 bg-red-500/10 flex items-center justify-center rounded-3xl mb-8">
        <AlertTriangle className="w-10 h-10 text-red-500" />
      </div>
      
      <h1 className="text-3xl font-black tracking-tight mb-4">Something went wrong</h1>
      
      <p className="max-w-md text-gray-400 leading-relaxed mb-10">
        We encountered an unexpected error while loading this page. Our data sources might be temporarily unavailable.
      </p>

      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={() => reset()}
          className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/15 text-white font-bold px-8 py-3 rounded-2xl transition-colors"
        >
          <RefreshCcw className="w-5 h-5" />
          Try Again
        </button>
        <Link 
          href="/" 
          className="flex items-center justify-center gap-2 bg-primary text-white font-bold px-8 py-3 rounded-2xl hover:scale-105 transition-transform shadow-lg shadow-primary/25"
        >
          <Home className="w-5 h-5" />
          Go Home
        </Link>
      </div>
    </div>
  );
}
