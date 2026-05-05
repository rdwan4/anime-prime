import { ListFilter, ChevronLeft, ChevronRight, Calendar, Star, History, Flame, Tags } from "lucide-react";
import Link from "next/link";
import AnimeCard from "@/components/AnimeCard";
import { getAnimeByGenre } from "@/lib/jikan";
import { averageScore, formatCompactNumber, stripHtmlTags, truncateText } from "@/lib/format";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Database & Explore | AnimePrime",
  description: "Explore our massive anime database by genre, format, season, and ranking.",
};

export default async function ExplorePage({
  searchParams,
}: {
  searchParams: { page?: string; type?: string; genre?: string };
}) {
  const page = parseInt(searchParams.page || "1", 10) || 1;
  const type = searchParams.type || "top";
  const genre = searchParams.genre ? parseInt(searchParams.genre, 10) : null;

  let animeList: any[] = [];
  let title = "Top Rated of All Time";
  let description = "The highest-rated anime masterpieces.";
  let Icon = Star;

  if (genre) {
    try {
      const genreResults = await getAnimeByGenre(genre, page);
      animeList = genreResults.data || [];
    } catch (e) {
      console.error("Genre fetch error:", e);
      animeList = [];
    }
    title = "Genre Picks";
    description = "A focused list of high-scoring titles for the genre you selected from the homepage.";
    Icon = Tags;
  } else {
    let apiUrl = `https://api.jikan.moe/v4/top/anime?page=${page}&limit=24`;

    if (type === "upcoming") {
      apiUrl = `https://api.jikan.moe/v4/seasons/upcoming?page=${page}&limit=24`;
      title = "Upcoming Releases";
      description = "Next season's most highly anticipated anime.";
      Icon = Calendar;
    } else if (type === "old") {
      apiUrl = `https://api.jikan.moe/v4/anime?start_date=1980-01-01&end_date=2005-12-31&order_by=score&sort=desc&page=${page}&limit=24`;
      title = "Golden Age Classics";
      description = "The highest-rated retro anime from the '80s, '90s, and early '00s.";
      Icon = History;
    } else if (type === "airing") {
      apiUrl = `https://api.jikan.moe/v4/seasons/now?page=${page}&limit=24`;
      title = "Currently Airing";
      description = "What's broadcasting in Japan right now.";
      Icon = Flame;
    }

    try {
      const res = await fetch(apiUrl, { next: { revalidate: 3600 } });
      if (res.ok) {
        const data = await res.json();
        animeList = data.data || [];
      } else {
        animeList = [];
      }
    } catch (error) {
      console.error("Explore page fetch error:", error);
      animeList = [];
    }
  }

  const previousHref = genre
    ? `/explore?genre=${genre}&page=${Math.max(1, page - 1)}`
    : `/explore?type=${type}&page=${Math.max(1, page - 1)}`;
  const nextHref = genre ? `/explore?genre=${genre}&page=${page + 1}` : `/explore?type=${type}&page=${page + 1}`;
  const scoredAverage = averageScore(animeList);
  const movieCount = animeList.filter((anime: any) => anime.type === "Movie").length;
  const tvCount = animeList.filter((anime: any) => anime.type === "TV").length;
  const featured = animeList.slice(0, 3);

  return (
    <div className="container mx-auto px-6 py-12 md:px-12">
      <div className="mb-12 grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_360px]">
        <div className="glass-card rounded-3xl p-8">
          <h1 className="flex items-center gap-3 text-4xl font-black tracking-tighter shadow-sm">
            <ListFilter className="h-8 w-8 text-primary" />
            Anime Database
          </h1>
          <p className="mt-3 max-w-2xl text-lg leading-8 text-gray-400">
            Move between canon classics, active seasonal titles, and genre-led discovery without losing the broader context of what you are browsing.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="glass-card rounded-3xl p-5">
            <p className="text-2xl font-black">{formatCompactNumber(animeList.length)}</p>
            <p className="mt-1 text-xs uppercase tracking-[0.18em] text-gray-400">Entries shown</p>
          </div>
          <div className="glass-card rounded-3xl p-5">
            <p className="text-2xl font-black">{scoredAverage ? `${scoredAverage}/10` : "--"}</p>
            <p className="mt-1 text-xs uppercase tracking-[0.18em] text-gray-400">Avg score</p>
          </div>
          <div className="glass-card rounded-3xl p-5">
            <p className="text-2xl font-black">{tvCount}</p>
            <p className="mt-1 text-xs uppercase tracking-[0.18em] text-gray-400">TV series</p>
          </div>
          <div className="glass-card rounded-3xl p-5">
            <p className="text-2xl font-black">{movieCount}</p>
            <p className="mt-1 text-xs uppercase tracking-[0.18em] text-gray-400">Movies</p>
          </div>
        </div>
      </div>

      <div className="mb-10 flex flex-wrap items-center gap-4 border-b border-white/10 pb-6">
        <Link
          href="/explore?type=top"
          className={`rounded-full px-5 py-2.5 text-xs font-bold uppercase tracking-wider transition-colors ${
            !genre && type === "top" ? "bg-primary text-white shadow-xl shadow-primary/20" : "glass text-gray-400 hover:bg-white/10"
          }`}
        >
          Top Rated
        </Link>
        <Link
          href="/explore?type=airing"
          className={`rounded-full px-5 py-2.5 text-xs font-bold uppercase tracking-wider transition-colors ${
            !genre && type === "airing" ? "bg-pink-600 text-white shadow-xl shadow-pink-600/20" : "glass text-gray-400 hover:bg-white/10"
          }`}
        >
          Airing Now
        </Link>
        <Link
          href="/explore?type=upcoming"
          className={`rounded-full px-5 py-2.5 text-xs font-bold uppercase tracking-wider transition-colors ${
            !genre && type === "upcoming" ? "bg-blue-600 text-white shadow-xl shadow-blue-600/20" : "glass text-gray-400 hover:bg-white/10"
          }`}
        >
          Upcoming
        </Link>
        <Link
          href="/explore?type=old"
          className={`rounded-full px-5 py-2.5 text-xs font-bold uppercase tracking-wider transition-colors ${
            !genre && type === "old" ? "bg-amber-600 text-white shadow-xl shadow-amber-600/20" : "glass text-gray-400 hover:bg-white/10"
          }`}
        >
          Golden Age
        </Link>
        {genre && (
          <Link href="/explore?type=top" className="rounded-full bg-primary px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white">
            Clear Genre Filter
          </Link>
        )}
      </div>

      <div className="mb-8 flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
        <div>
          <h2 className="flex items-center gap-3 text-2xl font-bold">
            <Icon className="h-6 w-6 text-primary" />
            {title}
          </h2>
          <p className="mt-1 text-gray-500">{description}</p>
        </div>

        <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-2">
          <Link href={previousHref} className={`rounded-xl p-2 transition-all ${page <= 1 ? "pointer-events-none opacity-20" : "text-white hover:bg-primary"}`}>
            <ChevronLeft />
          </Link>
          <span className="px-4 text-sm font-bold tracking-widest">PAGE {page}</span>
          <Link href={nextHref} className="rounded-xl p-2 text-white shadow-lg transition-all hover:bg-primary">
            <ChevronRight />
          </Link>
        </div>
      </div>

      {featured.length > 0 && (
        <section className="mb-12 grid gap-4 lg:grid-cols-3">
          {featured.map((anime: any, index: number) => (
            <Link key={anime.mal_id} href={`/anime/${anime.mal_id}`} className="glass-card rounded-3xl p-6">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Featured pick {index + 1}</p>
              <h3 className="mt-3 text-xl font-black tracking-tight">{anime.title_english || anime.title}</h3>
              <p className="mt-3 text-sm leading-7 text-gray-400">
                {anime.synopsis ? `${anime.synopsis.slice(0, 140)}...` : "Open the detail page for full cast, stats, and recommendations."}
              </p>
              <div className="mt-4 flex flex-wrap gap-2 text-xs font-bold uppercase tracking-[0.18em] text-gray-300">
                {anime.type && <span>{anime.type}</span>}
                {anime.score && <span>Score {anime.score}</span>}
                {anime.year && <span>{anime.year}</span>}
              </div>
            </Link>
          ))}
        </section>
      )}

      {animeList.length > 0 ? (
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {animeList.map((anime: any) => (
            <AnimeCard
              key={anime.mal_id}
              id={anime.mal_id}
              title={anime.title_english || anime.title}
              image={anime.images.jpg.large_image_url}
              intro={truncateText(stripHtmlTags(anime.synopsis), 110)}
              rating={anime.score}
              episodes={anime.episodes}
              type={anime.type}
            />
          ))}
        </div>
      ) : (
        <div className="py-20 text-center text-gray-500">
          <p>No results found for this category or page.</p>
        </div>
      )}

      {animeList.length > 0 && (
        <div className="mt-20 flex justify-center">
          <div className="flex items-center gap-6 rounded-3xl border border-primary/20 bg-primary/10 p-4">
            <Link
              href={previousHref}
              className={`glass rounded-full px-6 py-2 text-xs font-bold uppercase tracking-tighter transition-all hover:bg-primary ${
                page <= 1 ? "pointer-events-none opacity-30" : ""
              }`}
            >
              Previous
            </Link>
            <span className="font-black text-primary">PAGE {page}</span>
            <Link
              href={nextHref}
              className="rounded-full bg-primary px-6 py-2 text-xs font-bold uppercase tracking-tighter text-white shadow-xl shadow-primary/20 transition-all hover:scale-105"
            >
              Next Page
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
