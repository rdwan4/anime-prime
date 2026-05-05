import { getTrendingAnime, getTopAnime, getTopCharacters, getRecentReviews, getGenres } from "@/lib/jikan";
import { getAllNews } from "@/lib/news";
import { getCurrentlyAiring } from "@/lib/anilist";
import AnimeCard from "@/components/AnimeCard";
import NewsCard from "@/components/NewsCard";
import Link from "next/link";
import { Info, Sparkles, Flame, Newspaper, PlayCircle, Users, Star, Tags, CalendarDays, Tv } from "lucide-react";
import { stripHtmlTags, truncateText } from "@/lib/format";
import { Metadata } from "next";
import AdPlacement from "@/components/AdPlacement";

export const metadata: Metadata = {
  title: "Home",
  description: "Explore trending anime, real-time news headlines, and broadcast countdowns on AnimeNews.",
};

export const dynamic = "force-dynamic";

function formatCompact(value: number) {
  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

export default async function Home() {
  const [trending, topAllTime, news, airingList, topChars, reviews, genres] = await Promise.allSettled([
    getTrendingAnime(),
    getTopAnime(6),
    getAllNews(),
    getCurrentlyAiring(12),
    getTopCharacters(20),
    getRecentReviews(),
    getGenres(),
  ]);

  const trendingData = trending.status === "fulfilled" ? (trending.value?.data || []) : [];
  const topAllTimeData = topAllTime.status === "fulfilled" ? (topAllTime.value?.data || []) : [];
  const newsData = news.status === "fulfilled" ? (news.value || []) : [];
  const airingData = airingList.status === "fulfilled" ? (airingList.value || []) : [];
  const charsData = topChars.status === "fulfilled" ? (topChars.value?.data || []) : [];
  const reviewsData = reviews.status === "fulfilled" ? (reviews.value?.data || []) : [];
  const genresData = genres.status === "fulfilled" ? (genres.value?.data || []) : [];

  const hero = trendingData[0];
  const featuredNews = newsData.slice(0, 3);
  const recentNews = newsData.slice(3, 11);
  const topAverageScore =
    topAllTimeData.length > 0
      ? (topAllTimeData.reduce((sum: number, anime: any) => sum + (anime.score || 0), 0) / topAllTimeData.length).toFixed(1)
      : null;

  const coverageCards = [
    {
      label: "Trending titles",
      value: formatCompact(trendingData.length || 0),
      detail: "Live cards sourced from Jikan trending data.",
      icon: Flame,
    },
    {
      label: "Broadcast countdowns",
      value: formatCompact(airingData.length || 0),
      detail: "Current releases with episode timing from AniList.",
      icon: CalendarDays,
    },
    {
      label: "Fresh headlines",
      value: formatCompact(newsData.length || 0),
      detail: "Industry and community news pulled into one feed.",
      icon: Newspaper,
    },
    {
      label: "Genre entry points",
      value: formatCompact(genresData.length || 0),
      detail: "Fast filters for browsing the catalog by taste.",
      icon: Tags,
    },
  ];

  return (
    <div className="min-h-screen">
      {hero && (
        <div className="relative h-[85vh] w-full overflow-hidden">
          <img
            src={hero.trailer?.images?.maximum_image_url || hero.images?.jpg?.large_image_url}
            alt={hero.title}
            className="absolute inset-0 h-full w-full scale-105 object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/60 to-transparent" />

          <div className="container relative z-10 mx-auto flex h-full flex-col justify-center px-6 pt-20 md:px-12">
            <div className="mb-6 flex items-center gap-3">
              <span className="flex items-center gap-2 rounded-full border border-primary/30 bg-primary/20 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-primary backdrop-blur-md">
                <Flame className="h-4 w-4 animate-pulse text-orange-500" /> Global Trending Now
              </span>
            </div>
            <h1 className="mb-6 max-w-5xl text-6xl font-black uppercase leading-[0.85] tracking-tighter text-white drop-shadow-2xl md:text-8xl">
              {hero.title}
            </h1>
            <p className="mb-6 max-w-2xl line-clamp-3 text-lg font-medium leading-relaxed text-gray-300 opacity-90 md:text-xl">
              {hero.synopsis}
            </p>

            <div className="mb-10 flex flex-wrap gap-3 text-xs font-bold uppercase tracking-[0.18em] text-white/90">
              {hero.score && (
                <span className="rounded-full border border-yellow-400/30 bg-yellow-500/15 px-4 py-2 text-yellow-200">
                  Score {hero.score}
                </span>
              )}
              {hero.type && (
                <span className="rounded-full border border-white/15 bg-white/8 px-4 py-2">
                  Format {hero.type}
                </span>
              )}
              {hero.status && (
                <span className="rounded-full border border-white/15 bg-white/8 px-4 py-2">
                  Status {hero.status}
                </span>
              )}
              {hero.year && (
                <span className="rounded-full border border-white/15 bg-white/8 px-4 py-2">
                  Year {hero.year}
                </span>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-5">
              <Link
                href={`/anime/${hero.mal_id}`}
                className="flex items-center gap-3 rounded-full bg-white px-10 py-4 font-black text-black shadow-2xl transition-all hover:scale-105 hover:bg-primary hover:text-white"
              >
                <Info className="h-5 w-5" />
                EXPLORE NOW
              </Link>
              {hero.trailer?.url && (
                <a
                  href={hero.trailer.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="glass flex items-center gap-3 rounded-full border border-white/20 px-10 py-4 font-bold text-white transition-all hover:bg-white/10"
                >
                  <PlayCircle className="h-5 w-5" />
                  PREVIEW TRAILER
                </a>
              )}
            </div>
          </div>
        </div>
      )}

      {reviewsData?.length > 0 && (
        <div className="ticker-wrap border-y border-white/5 bg-primary/10 py-3 backdrop-blur-md">
          <div className="ticker-content flex items-center gap-16">
            {reviewsData.map((review: any, i: number) => (
              <div key={`rev1-${i}`} className="group flex cursor-default items-center gap-4 whitespace-nowrap text-[10px] font-bold">
                <div className="flex items-center gap-1 rounded border border-yellow-500/20 bg-yellow-500/20 px-2 py-0.5 text-yellow-500">
                  <Star className="h-3 w-3 fill-yellow-500" /> {review?.score ?? "--"}
                </div>
                <span className="uppercase tracking-tighter text-white transition-colors group-hover:text-primary">
                  {review?.entry?.title ?? "Unknown Title"}
                </span>
                <span className="font-medium italic text-gray-500 opacity-60">
                  "{review?.review?.substring(0, 60) ?? "No review text available"}..."
                </span>
              </div>
            ))}
            {reviewsData.map((review: any, i: number) => (
              <div key={`rev2-${i}`} className="group flex cursor-default items-center gap-4 whitespace-nowrap text-[10px] font-bold">
                <div className="flex items-center gap-1 rounded border border-yellow-500/20 bg-yellow-500/20 px-2 py-0.5 text-yellow-500">
                  <Star className="h-3 w-3 fill-yellow-500" /> {review?.score ?? "--"}
                </div>
                <span className="uppercase tracking-tighter text-white transition-colors group-hover:text-primary">
                  {review?.entry?.title ?? "Unknown Title"}
                </span>
                <span className="font-medium italic text-gray-500 opacity-60">
                  "{review?.review?.substring(0, 60) ?? "No review text available"}..."
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="container relative z-20 mx-auto mt-16 space-y-24 px-6 pb-20 md:px-12">
        <section className="space-y-8">
          <div className="flex items-center gap-3">
            <Tv className="h-6 w-6 text-primary" />
            <div>
              <h2 className="text-2xl font-bold uppercase tracking-tight">Platform Snapshot</h2>
              <p className="mt-1 max-w-2xl text-sm leading-relaxed text-gray-400">
                AnimePrime tracks what is airing now, what fans are talking about, and which catalog titles are still dominating the conversation.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
            {coverageCards.map((card) => {
              const Icon = card.icon;

              return (
                <div key={card.label} className="glass-card rounded-3xl p-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/15 text-primary">
                    <Icon className="h-6 w-6" />
                  </div>
                  <p className="text-3xl font-black tracking-tighter">{card.value}</p>
                  <h3 className="mt-2 text-sm font-bold uppercase tracking-[0.18em] text-white/90">{card.label}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-gray-400">{card.detail}</p>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="glass-card rounded-3xl p-6 lg:col-span-2">
              <div className="mb-3 flex items-center gap-2 text-primary">
                <Sparkles className="h-5 w-5" />
                <span className="text-xs font-bold uppercase tracking-[0.2em]">What makes this useful</span>
              </div>
              <h3 className="text-2xl font-black tracking-tight">A fast read on anime, not just a list of posters.</h3>
              <p className="mt-4 max-w-3xl text-sm leading-7 text-gray-300">
                The project blends live trend signals, airing countdowns, review snippets, and cross-source news so a visitor can jump from discovery into context without leaving the site.
              </p>
            </div>

            <div className="glass-card rounded-3xl p-6">
              <div className="mb-2 flex items-center gap-2 text-yellow-400">
                <Star className="h-5 w-5 fill-yellow-400" />
                <span className="text-xs font-bold uppercase tracking-[0.2em]">Top list signal</span>
              </div>
              <p className="text-3xl font-black tracking-tighter">{topAverageScore ? `${topAverageScore}/10` : "--"}</p>
              <p className="mt-2 text-sm leading-relaxed text-gray-400">
                Average score across the featured all-time titles on the homepage.
              </p>
            </div>
          </div>
        </section>

        <section>
          <div className="mb-8 flex items-center gap-3">
            <Tags className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-bold uppercase tracking-tight">Popular Genres</h2>
          </div>
          <div className="flex flex-wrap gap-3">
            {genresData?.slice(0, 15).map((genre: any) => (
              <Link
                key={genre.mal_id}
                href={`/explore?genre=${genre.mal_id}`}
                className="glass-card rounded-2xl px-6 py-3 text-sm font-bold transition-all hover:bg-primary hover:text-white"
              >
                {genre.name}
              </Link>
            ))}
          </div>
        </section>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          <section className="lg:col-span-8">
            <div className="section-heading mb-8 flex items-center justify-between">
              <h2 className="flex items-center gap-3 text-2xl font-bold uppercase tracking-tight">
                <Newspaper className="h-6 w-6 text-primary" /> Industry Updates
              </h2>
              <Link href="/news" className="rounded-full bg-primary/10 px-4 py-2 text-sm font-bold text-primary hover:underline">
                Explore All News
              </Link>
            </div>

            <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
              {featuredNews.map((item) => (
                <NewsCard key={item.id} item={item} featured />
              ))}
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {recentNews.map((item) => (
                <NewsCard key={item.id} item={item} />
              ))}
            </div>
          </section>

          <section className="lg:col-span-4">
            <div className="section-heading mb-8 flex items-center justify-between">
              <h2 className="flex items-center gap-3 text-2xl font-bold uppercase tracking-tight">
                <Sparkles className="h-6 w-6 text-pink-500" /> Broadcasts
              </h2>
            </div>
            <div className="glass-card relative overflow-hidden rounded-3xl p-6 shadow-2xl">
              <div className="absolute right-0 top-0 -mr-16 -mt-16 h-32 w-32 rounded-full bg-primary/10 blur-3xl" />
              <div className="relative z-10 flex flex-col gap-6">
                {airingData.slice(0, 6).map((anime) => (
                  <Link key={anime.idMal || anime.id} href={`/anime/${anime.idMal}`} className="group flex items-center gap-4">
                    <div className="relative h-20 w-16 flex-shrink-0 overflow-hidden rounded-xl shadow-lg transition-transform group-hover:scale-105">
                      <img src={anime.coverImage.large} alt={anime.title.romaji} className="h-full w-full object-cover" />
                    </div>
                    <div>
                      <h4 className="line-clamp-2 text-sm font-bold leading-tight transition-colors group-hover:text-primary">
                        {anime.title.romaji || anime.title.english}
                      </h4>
                      <p className="mt-1 text-xs text-gray-400">
                        {anime.studios?.nodes?.[0]?.name || "Studio pending"} | {anime.episodes ? `${anime.episodes} eps planned` : "Episode count TBA"}
                      </p>
                      {anime.nextAiringEpisode && (
                        <p className="mt-1.5 inline-block rounded-md bg-pink-600 px-2 py-0.5 text-xs font-black uppercase tracking-tighter text-white">
                          EP {anime.nextAiringEpisode.episode} | IN {Math.floor(anime.nextAiringEpisode.timeUntilAiring / 86400)}D
                        </p>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
              <Link
                href="/season"
                className="mt-10 block w-full rounded-2xl border border-white/5 bg-white/5 py-4 text-center text-sm font-black uppercase tracking-widest transition-all hover:bg-primary"
              >
                Full Airing Chart
              </Link>
            </div>
          </section>
        </div>

        <AdPlacement zoneId="236566" format="banner" />

        <section>
          <div className="section-heading mb-8 flex items-center justify-between">
            <h2 className="text-2xl font-bold uppercase tracking-tight">Legendary Anime</h2>
            <Link
              href="/explore?type=top"
              className="text-xs font-bold uppercase tracking-widest opacity-50 transition-opacity hover:opacity-100"
            >
              View Complete List
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {topAllTimeData.map((anime: any) => (
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
        </section>

        <section className="-mx-6 border-y border-primary/10 bg-primary/5 px-6 py-20 md:-mx-12 md:px-12">
          <div className="mb-10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Users className="h-8 w-8 text-primary" />
              <h2 className="text-3xl font-black uppercase tracking-tighter">Iconic Characters</h2>
            </div>
          </div>
          <div className="scroll-x flex gap-8 pb-4">
            {charsData.slice(0, 15).map((char: any) => (
              <div key={char.mal_id} className="group w-40 flex-shrink-0 cursor-pointer text-center">
                <div className="relative mb-4 h-56 w-40 overflow-hidden rounded-3xl shadow-2xl transition-transform group-hover:scale-105">
                  <img src={char.images.jpg.image_url} alt={char.name} className="h-full w-full object-cover transition-opacity group-hover:opacity-80" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                </div>
                <h4 className="line-clamp-1 text-sm font-bold tracking-tight transition-colors group-hover:text-primary">{char.name}</h4>
                <p className="mt-1 text-[10px] font-black uppercase text-gray-500">Favorites {char.favorites.toLocaleString()}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
