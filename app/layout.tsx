import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import Script from "next/script";
import Navigation from "@/components/Navigation";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://www.animeprime.fun"),
  title: {
    default: "AnimeNews | Real-time Anime News & Database",
    template: "%s | AnimeNews",
  },
  verification: {
    other: {
      monetag: "358a4b170de493ebc6c6a0268fd7b45f",
    },
  },
  description: "The ultimate destination for anime fans. Real-time news, airing countdowns, and a massive anime database.",
  keywords: ["anime news", "anime database", "airing anime", "seasonal anime", "manga news", "anime streaming"],
  authors: [{ name: "AnimeNews Team" }],
  creator: "AnimeNews",
  publisher: "AnimeNews",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://www.animeprime.fun", // Official domain
    siteName: "AnimeNews",
    title: "AnimeNews | Real-time Anime News & Database",
    description: "The ultimate destination for anime fans. Real-time news, airing countdowns, and a massive anime database.",
    images: [
      {
        url: "/og-image.jpg", // User should add this file
        width: 1200,
        height: 630,
        alt: "AnimeNews",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AnimeNews | Real-time Anime News & Database",
    description: "The ultimate destination for anime fans. Real-time news, airing countdowns, and a massive anime database.",
    images: ["/og-image.jpg"],
    creator: "@animeprime",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Only enable when you have a real ID to avoid errors */}
        {process.env.NEXT_PUBLIC_ADSENSE_ID && (
          <Script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADSENSE_ID}`}
            crossOrigin="anonymous"
            strategy="lazyOnload"
          />
        )}
      </head>
      <body className={inter.className}>
        <Navigation />
        <main className="pt-16 pb-20">
          {children}
        </main>
        
        <footer className="py-12 border-t border-white/5 bg-black/50 overflow-hidden relative z-50">
          <div className="container mx-auto px-6 md:px-12 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-left">
              <Link href="/" className="text-xl font-bold text-gradient tracking-tighter">
                ANIME<span className="text-white">PRIME</span>
              </Link>
              <p className="text-gray-600 text-xs mt-2 italic">Your premium anime news source.</p>
            </div>
            <div className="flex flex-wrap justify-center gap-8 text-[11px] font-bold text-gray-500 uppercase tracking-widest">
              <Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-primary transition-colors">Terms of Service</Link>
              <Link href="/explore" className="hover:text-primary transition-colors">Database</Link>
            </div>
            <div className="text-center md:text-right">
              <p className="text-gray-600 text-[10px] uppercase tracking-widest mb-1">&copy; {new Date().getFullYear()} ANIMEPRIME</p>
              <p className="text-[9px] text-gray-700">All data provided by Jikan API, AniList, and ANN.</p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
