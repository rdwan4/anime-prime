import { searchAnime } from "@/lib/jikan";
import AnimeCard from "@/components/AnimeCard";
import { Search } from "lucide-react";

export default async function SearchResults({
  searchParams,
}: {
  searchParams: { q: string };
}) {
  const query = searchParams.q || "";
  const results = query ? await searchAnime(query) : { data: [] };

  return (
    <div className="container mx-auto px-6 md:px-12 py-12">
      <div className="mb-12">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <Search className="text-primary w-8 h-8" />
          {query ? `Search results for "${query}"` : "Discover More Anime"}
        </h1>
        <p className="text-gray-500 mt-2">Found {results.data.length} results</p>
      </div>

      {results.data.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {results.data.map((anime: any) => (
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
      ) : (
        <div className="text-center py-40 opacity-20">
          <Search className="w-24 h-24 mx-auto mb-6" />
          <p className="text-xl">Try searching for your favorite series</p>
        </div>
      )}
    </div>
  );
}
