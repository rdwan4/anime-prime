import { getTopAnime } from "@/lib/jikan";
import AnimeCard from "@/components/AnimeCard";
import { ListFilter, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function ExplorePage({
  searchParams,
}: {
  searchParams: { page: string };
}) {
  const page = parseInt(searchParams.page) || 1;
  // Fetching data for the specific page
  const res = await fetch(`https://api.jikan.moe/v4/top/anime?page=${page}&limit=24`, {
    next: { revalidate: 3600 }
  });
  const data = await res.json();

  return (
    <div className="container mx-auto px-6 md:px-12 py-12">
      <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-6">
        <div>
          <h1 className="text-4xl font-bold flex items-center gap-3">
            <ListFilter className="text-primary w-8 h-8" />
            Browse All Anime
          </h1>
          <p className="text-gray-500 mt-2 text-lg">Exploring the world's largest anime collection</p>
        </div>

        {/* Pagination Controls */}
        <div className="flex items-center gap-4 bg-white/5 p-2 rounded-2xl border border-white/10">
          <Link 
            href={`/explore?page=${Math.max(1, page - 1)}`}
            className={`p-2 rounded-xl transition-all ${page <= 1 ? 'opacity-20 cursor-not-allowed' : 'hover:bg-primary text-white'}`}
          >
            <ChevronLeft />
          </Link>
          <span className="font-bold px-4 text-sm tracking-widest">PAGE {page}</span>
          <Link 
            href={`/explore?page=${page + 1}`}
            className="p-2 rounded-xl hover:bg-primary text-white transition-all shadow-lg"
          >
            <ChevronRight />
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
        {data.data?.map((anime: any) => (
          <AnimeCard 
            key={anime.mal_id}
            id={anime.mal_id}
            title={anime.title}
            image={anime.images.jpg.large_image_url}
            rating={anime.score}
            episodes={anime.episodes}
            type={anime.type}
          />
        ))}
      </div>

      {/* Bottom Pagination */}
      <div className="mt-20 flex justify-center">
        <div className="flex items-center gap-6 bg-primary/10 p-4 rounded-3xl border border-primary/20">
          <Link 
            href={`/explore?page=${Math.max(1, page - 1)}`}
            className="text-xs font-bold px-6 py-2 glass rounded-full hover:bg-primary transition-all uppercase tracking-tighter"
          >
            Previous
          </Link>
          <span className="text-primary font-black">PAGE {page}</span>
          <Link 
            href={`/explore?page=${page + 1}`}
            className="text-xs font-bold px-6 py-2 bg-primary text-white rounded-full hover:scale-105 transition-all uppercase tracking-tighter shadow-xl shadow-primary/20"
          >
            Next Page
          </Link>
        </div>
      </div>
    </div>
  );
}
