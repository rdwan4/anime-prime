import Link from "next/link";
import AnimeCard from "@/components/AnimeCard";
import { Search, SlidersHorizontal, Sparkles, Flame, Trophy } from "lucide-react";
import { searchAnimeAdvanced } from "@/lib/jikan";
import { averageScore, stripHtmlTags, truncateText } from "@/lib/format";

export const metadata = {
  title: "Search Results | AnimeNews",
  description: "Search for your favorite anime series, movies, and franchises.",
};

export default async function SearchResults({
  searchParams,
}: {
  searchParams: { q?: string; type?: string; status?: string };
}) {
  const query = searchParams.q || "";
  const type = searchParams.type || "";
  const status = searchParams.status || "";
  const results = query ? await searchAnimeAdvanced({ query, type, status, limit: 24 }) : { data: [] };
  const animeList = results.data || [];
  const scoredAverage = averageScore(animeList);
  const airingCount = animeList.filter((anime: any) => anime.status === "Currently Airing").length;
  const movieCount = animeList.filter((anime: any) => anime.type === "Movie").length;

  const filters = [
    { href: `/search?q=${encodeURIComponent(query)}&type=tv`, label: "TV" },
    { href: `/search?q=${encodeURIComponent(query)}&type=movie`, label: "Movies" },
    { href: `/search?q=${encodeURIComponent(query)}&status=airing`, label: "Airing" },
    { href: `/search?q=${encodeURIComponent(query)}&status=complete`, label: "Finished" },
  ];

  return (
    <div className="container mx-auto px-6 py-12 md:px-12">
      <div className="mb-12 grid gap-6 xl:grid-cols-[minmax(0,1.25fr)_380px]">
        <div className="glass-card rounded-3xl p-8">
          <h1 className="flex items-center gap-3 text-3xl font-bold">
            <Search className="h-8 w-8 text-primary" />
            {query ? `Search results for "${query}"` : "Discover More Anime"}
          </h1>
          <p className="mt-3 max-w-2xl leading-7 text-gray-400">
            Search by title, then refine by format or release status so the results stay useful instead of overwhelming.
          </p>

          <form action="/search" className="mt-6 grid gap-3 md:grid-cols-[minmax(0,1fr)_160px_180px_auto]">
            <input
              name="q"
              defaultValue={query}
              placeholder="Search for a series, movie, or franchise"
              className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm outline-none transition-colors placeholder:text-gray-500 focus:border-primary/40"
            />
            <select
              name="type"
              defaultValue={type}
              className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none focus:border-primary/40"
            >
              <option value="">All formats</option>
              <option value="tv">TV</option>
              <option value="movie">Movie</option>
              <option value="ova">OVA</option>
              <option value="special">Special</option>
            </select>
            <select
              name="status"
              defaultValue={status}
              className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none focus:border-primary/40"
            >
              <option value="">Any status</option>
              <option value="airing">Currently Airing</option>
              <option value="complete">Finished</option>
              <option value="upcoming">Upcoming</option>
            </select>
            <button className="rounded-2xl bg-primary px-6 py-3 text-sm font-bold text-white transition-transform hover:scale-[1.02]">
              Search
            </button>
          </form>
        </div>

        <div className="glass-card rounded-3xl p-8">
          <div className="mb-4 flex items-center gap-2 text-primary">
            <SlidersHorizontal className="h-5 w-5" />
            <span className="text-xs font-bold uppercase tracking-[0.18em]">Result snapshot</span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-2xl border border-white/5 bg-white/5 p-4">
              <p className="text-2xl font-black">{animeList.length}</p>
              <p className="mt-1 text-xs uppercase tracking-[0.18em] text-gray-400">Matches</p>
            </div>
            <div className="rounded-2xl border border-white/5 bg-white/5 p-4">
              <p className="text-2xl font-black">{scoredAverage ? `${scoredAverage}/10` : "--"}</p>
              <p className="mt-1 text-xs uppercase tracking-[0.18em] text-gray-400">Avg score</p>
            </div>
            <div className="rounded-2xl border border-white/5 bg-white/5 p-4">
              <p className="text-2xl font-black">{airingCount}</p>
              <p className="mt-1 text-xs uppercase tracking-[0.18em] text-gray-400">Airing now</p>
            </div>
            <div className="rounded-2xl border border-white/5 bg-white/5 p-4">
              <p className="text-2xl font-black">{movieCount}</p>
              <p className="mt-1 text-xs uppercase tracking-[0.18em] text-gray-400">Movies</p>
            </div>
          </div>
        </div>
      </div>

      {query && (
        <div className="mb-10 flex flex-wrap gap-3">
          {filters.map((filter) => (
            <Link
              key={filter.label}
              href={filter.href}
              className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-gray-300 transition-colors hover:border-primary/30 hover:text-white"
            >
              {filter.label}
            </Link>
          ))}
        </div>
      )}

      {animeList.length > 0 ? (
        <>
          <div className="mb-8">
            <h2 className="text-2xl font-bold">Best matches</h2>
            <p className="mt-1 text-gray-500">Found {animeList.length} results</p>
          </div>

          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {animeList.map((anime: any) => (
              <AnimeCard
                key={anime.mal_id}
                id={anime.mal_id}
                title={anime.title}
                image={anime.images.jpg.large_image_url}
                intro={truncateText(stripHtmlTags(anime.synopsis), 110)}
                rating={anime.score}
                episodes={anime.episodes}
                type={anime.type}
              />
            ))}
          </div>
        </>
      ) : (
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
          <div className="glass-card rounded-3xl px-8 py-16 text-center">
            <Search className="mx-auto mb-6 h-24 w-24 opacity-20" />
            <p className="text-xl font-bold">{query ? "No exact matches yet" : "Start with a title you love"}</p>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-gray-400">
              Try franchise names, alternative spellings, or broader terms like cyberpunk, sports, or romance movie.
            </p>
          </div>

          <div className="space-y-4">
            <Link href="/explore?type=top" className="glass-card block rounded-3xl p-6">
              <Trophy className="mb-3 h-6 w-6 text-yellow-400" />
              <h3 className="text-lg font-bold">Browse top-rated anime</h3>
              <p className="mt-2 text-sm leading-6 text-gray-400">Use the ranked catalog when you want the safest starting points.</p>
            </Link>
            <Link href="/season" className="glass-card block rounded-3xl p-6">
              <Flame className="mb-3 h-6 w-6 text-pink-500" />
              <h3 className="text-lg font-bold">See what is airing now</h3>
              <p className="mt-2 text-sm leading-6 text-gray-400">Jump into this season’s most active conversation instead of searching blind.</p>
            </Link>
            <Link href="/news" className="glass-card block rounded-3xl p-6">
              <Sparkles className="mb-3 h-6 w-6 text-primary" />
              <h3 className="text-lg font-bold">Catch up on current news</h3>
              <p className="mt-2 text-sm leading-6 text-gray-400">Follow release windows, announcements, and fan chatter in one stream.</p>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
