import { getTrendingAnime, getTopAnime, getUpcomingAnime } from "@/lib/jikan";
import AnimeCard from "@/components/AnimeCard";
import Link from "next/link";
import { Play, Info, TrendingUp } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function Home() {
  const trending = await getTrendingAnime();
  const topAllTime = await getTopAnime();
  const upcoming = await getUpcomingAnime();
  const hero = trending.data[0];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative h-[85vh] w-full overflow-hidden">
        <img 
          src={hero.images.jpg.large_image_url} 
          alt={hero.title}
          className="absolute inset-0 w-full h-full object-cover scale-105 blur-[1px] opacity-50"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/10 to-transparent" />

        <div className="container mx-auto px-6 md:px-12 h-full flex flex-col justify-center relative z-10">
          <div className="flex items-center gap-2 mb-4">
            <span className="bg-primary/20 text-primary px-3 py-1 rounded-full text-[10px] font-bold border border-primary/30 uppercase tracking-widest">
              Featured This Week
            </span>
          </div>
          <h1 className="text-5xl md:text-8xl font-black max-w-4xl leading-[0.9] mb-6 tracking-tighter uppercase">
            {hero.title}
          </h1>
          <p className="text-gray-300 max-w-xl text-lg mb-8 line-clamp-3 leading-relaxed font-medium">
            {hero.synopsis}
          </p>
          <div className="flex items-center gap-4">
            <Link href={`/watch/${hero.mal_id}`} className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-8 py-4 rounded-xl font-bold transition-all hover:scale-105 shadow-xl shadow-primary/20">
              <Play className="w-5 h-5 fill-current" />
              Watch Now
            </Link>
            <button className="flex items-center gap-2 glass px-8 py-4 rounded-xl font-bold hover:bg-white/10 transition-all">
              <Info className="w-5 h-5" />
              More Info
            </button>
          </div>
        </div>
      </div>

      {/* Grid Sections */}
      <div className="container mx-auto px-6 md:px-12 -mt-20 relative z-20 space-y-20">
        {/* Trending Section */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/20 rounded-lg"><TrendingUp className="w-6 h-6 text-primary" /></div>
              <h2 className="text-2xl font-bold">Currently Airing</h2>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-6">
            {trending.data.slice(0, 8).map((anime: any) => (
              <AnimeCard key={anime.mal_id} id={anime.mal_id} title={anime.title} image={anime.images.jpg.large_image_url} rating={anime.score} episodes={anime.episodes} type={anime.type} />
            ))}
          </div>
        </section>

        {/* Top All Time Section */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-500/20 rounded-lg"><TrendingUp className="w-6 h-6 text-yellow-500" /></div>
              <h2 className="text-2xl font-bold">Top Rated All Time</h2>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-6">
            {topAllTime.data.map((anime: any) => (
              <AnimeCard key={anime.mal_id} id={anime.mal_id} title={anime.title} image={anime.images.jpg.large_image_url} rating={anime.score} episodes={anime.episodes} type={anime.type} />
            ))}
          </div>
        </section>

        {/* Upcoming Section */}
        <section>
          <div className="flex items-center justify-between mb-8">
             <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/20 rounded-lg"><TrendingUp className="w-6 h-6 text-blue-500" /></div>
              <h2 className="text-2xl font-bold">Coming Soon</h2>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-6">
            {upcoming.data.map((anime: any) => (
              <AnimeCard key={anime.mal_id} id={anime.mal_id} title={anime.title} image={anime.images.jpg.large_image_url} rating={anime.score} episodes={anime.episodes} type={anime.type} />
            ))}
          </div>
        </section>
      </div>

    </div>
  );
}
