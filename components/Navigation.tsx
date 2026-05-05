"use client";

import Link from "next/link";
import { Search, User, Menu, X, Newspaper, CalendarDays, TrendingUp, Zap } from "lucide-react";
import { useState } from "react";
import { usePathname } from "next/navigation";

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const links = [
    { href: "/", label: "Home", icon: <TrendingUp className="w-4 h-4" /> },
    { href: "/news", label: "News Feed", icon: <Newspaper className="w-4 h-4" /> },
    { href: "/season", label: "This Season", icon: <CalendarDays className="w-4 h-4" /> },
    { href: "/explore", label: "Database", icon: <Search className="w-4 h-4" /> },
  ];

  return (
    <>
      <nav className="fixed top-0 w-full z-50 glass h-16 flex items-center justify-between px-6 md:px-12">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/30 group-hover:rotate-12 transition-transform duration-300 flex-shrink-0">
              <Zap className="text-white fill-white w-6 h-6" />
            </div>
            <span className="text-2xl font-black tracking-tighter text-white uppercase italic group-hover:text-primary transition-colors whitespace-nowrap ml-1">
              Anime<span className="text-primary">News</span>
            </span>
          </Link>
          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-400">
            {links.map(link => (
              <Link 
                key={link.href} 
                href={link.href} 
                className={`flex items-center gap-1.5 transition-colors ${pathname === link.href ? 'text-primary' : 'hover:text-primary'}`}
              >
                {link.icon}
                {link.label}
              </Link>
            ))}
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
          <button className="p-2 hover:bg-white/5 rounded-full transition-colors hidden sm:block">
            <User className="w-5 h-5" />
          </button>
          <button onClick={() => setIsOpen(!isOpen)} className="md:hidden p-2 hover:bg-white/5 rounded-full transition-colors">
            {isOpen ? <X className="w-5 h-5 text-white" /> : <Menu className="w-5 h-5 text-white" />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="fixed inset-0 top-16 z-40 bg-black/95 backdrop-blur-xl md:hidden px-6 py-8">
          <form action="/search" className="flex items-center bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus-within:border-primary/50 transition-all mb-8">
            <Search className="w-5 h-5 text-gray-400" />
            <input 
              name="q"
              type="text" 
              placeholder="Search anime..." 
              className="bg-transparent border-none focus:ring-0 text-base ml-3 w-full placeholder:text-gray-500 outline-none text-white"
            />
          </form>
          <div className="flex flex-col gap-6 text-lg font-bold">
            {links.map(link => (
              <Link 
                key={link.href} 
                href={link.href} 
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 transition-colors ${pathname === link.href ? 'text-primary' : 'text-gray-300 hover:text-white'}`}
              >
                {link.icon}
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
