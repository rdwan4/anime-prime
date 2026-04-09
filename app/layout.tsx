import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import Script from "next/script";
import { Search, Play, User, Menu } from "lucide-react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Premium Anime | Watch Anime Online",
  description: "Experience anime in high definition with premium streaming features.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-YOUR_ADSENSE_ID"
          crossOrigin="anonymous"
          strategy="lazyOnload"
        />
      </head>
      <body className={inter.className}>
        <nav className="fixed top-0 w-full z-50 glass h-16 flex items-center justify-between px-6 md:px-12">
          <div className="flex items-center gap-8">
            <Link href="/" className="text-2xl font-bold text-gradient tracking-tighter">
              ANIME<span className="text-white">PRIME</span>
            </Link>
            <div className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-400">
              <Link href="/" className="hover:text-primary transition-colors">Home</Link>
              <Link href="/explore" className="hover:text-primary transition-colors">Explore</Link>
              <Link href="/trending" className="hover:text-primary transition-colors">Trending</Link>
              <Link href="/genres" className="hover:text-primary transition-colors">Genres</Link>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <form action="/search" className="hidden md:flex items-center bg-white/5 border border-white/10 rounded-full px-4 py-1.5 focus-within:border-primary/50 transition-all">
              <Search className="w-4 h-4 text-gray-400" />
              <input 
                name="q"
                type="text" 
                placeholder="Search anime..." 
                className="bg-transparent border-none focus:ring-0 text-sm ml-2 w-48 placeholder:text-gray-500 outline-none"
              />
            </form>
            <button className="hidden sm:flex items-center gap-2 bg-primary/20 text-primary border border-primary/30 px-4 py-1.5 rounded-full text-xs font-bold hover:bg-primary hover:text-white transition-all">
              GO VIP
            </button>
            <button className="p-2 hover:bg-white/5 rounded-full transition-colors">
              <User className="w-5 h-5" />
            </button>
            <button className="md:hidden p-2 hover:bg-white/5 rounded-full transition-colors">
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </nav>
        <main className="pt-16 pb-20">
          {children}
        </main>
        
        <footer className="py-12 border-t border-white/5 bg-black/50 overflow-hidden relative z-50">
          <div className="container mx-auto px-6 md:px-12 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-left">
              <Link href="/" className="text-xl font-bold text-gradient tracking-tighter">
                ANIME<span className="text-white">PRIME</span>
              </Link>
              <p className="text-gray-600 text-xs mt-2 italic">Your premium anime streaming experience.</p>
            </div>
            <div className="flex flex-wrap justify-center gap-8 text-[11px] font-bold text-gray-500 uppercase tracking-widest">
              <Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link>
              <Link href="/dmca" className="hover:text-primary transition-colors">DMCA</Link>
              <Link href="/terms" className="hover:text-primary transition-colors">Terms & Service</Link>
              <Link href="/explore" className="hover:text-primary transition-colors">Directory</Link>
            </div>
            <div className="text-center md:text-right">
              <p className="text-gray-600 text-[10px] uppercase tracking-widest mb-1">&copy; 2026 ANIMEPRIME</p>
              <p className="text-[9px] text-gray-700">All media hosted on third-party servers.</p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
