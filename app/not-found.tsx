import Link from "next/link";
import { Search, Home, Compass } from "lucide-react";

export default function NotFound() {
  return (
    <div className="container mx-auto px-6 py-24 md:px-12 flex flex-col items-center justify-center min-h-[70vh] text-center">
      <div className="mb-8 relative">
        <h1 className="text-9xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white/20 to-transparent">
          404
        </h1>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl font-bold tracking-widest uppercase">Page Not Found</span>
        </div>
      </div>
      
      <p className="max-w-md text-gray-400 leading-relaxed mb-10">
        It looks like this anime has been erased from the database, or the link you followed is broken.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
        <Link 
          href="/" 
          className="flex items-center justify-center gap-2 bg-primary text-white font-bold px-8 py-3 rounded-2xl hover:scale-105 transition-transform shadow-lg shadow-primary/25"
        >
          <Home className="w-5 h-5" />
          Return Home
        </Link>
        <Link 
          href="/explore" 
          className="flex items-center justify-center gap-2 glass border border-white/10 text-white font-bold px-8 py-3 rounded-2xl hover:bg-white/5 transition-colors"
        >
          <Compass className="w-5 h-5" />
          Browse Database
        </Link>
      </div>

      <form action="/search" className="mt-12 flex items-center bg-white/5 border border-white/10 rounded-full px-4 py-2 w-full max-w-sm focus-within:border-primary/50 transition-all">
        <Search className="w-5 h-5 text-gray-400" />
        <input 
          name="q"
          type="text" 
          placeholder="Search for something else..." 
          className="bg-transparent border-none focus:ring-0 text-sm ml-3 w-full placeholder:text-gray-500 outline-none text-white"
        />
      </form>
    </div>
  );
}
