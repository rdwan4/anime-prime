import { getCurrentSeason } from "@/lib/anilist";
import AnimeCard from "@/components/AnimeCard";
import LiveCountdownText from "@/components/LiveCountdownText";
import { CalendarDays, Flame, Clock3, Tv2 } from "lucide-react";
import { formatCountdown, formatCompactNumber, stripHtmlTags, truncateText } from "@/lib/format";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Currently Airing Anime | AnimePrime",
  description: "Track the season at a glance: trending shows, broadcast countdowns, and top scores.",
};

export default async function SeasonPage() {
  const anime = await getCurrentSeason(48);
  const upcomingSoon = anime
    .filter((entry) => entry.nextAiringEpisode?.timeUntilAiring !== null && entry.nextAiringEpisode?.timeUntilAiring !== undefined)
    .sort((a, b) => (a.nextAiringEpisode?.timeUntilAiring || 0) - (b.nextAiringEpisode?.timeUntilAiring || 0))
    .slice(0, 5);
  const averageScore =
    anime.filter((entry) => entry.averageScore).length > 0
      ? (
          anime.reduce((sum, entry) => sum + ((entry.averageScore || 0) / 10), 0) /
          anime.filter((entry) => entry.averageScore).length
        ).toFixed(1)
      : null;
  const majorFormatCount = anime.filter((entry) => entry.format === "TV" || entry.format === "MOVIE").length;

  return (
    <div className="container mx-auto px-6 py-12 md:px-12">
      <div className="mb-12 grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_360px]">
        <div className="glass-card rounded-3xl p-8">
          <h1 className="flex items-center gap-3 text-4xl font-black tracking-tighter">
            <CalendarDays className="h-8 w-8 text-pink-500" />
            Currently Airing
          </h1>
          <p className="mt-3 max-w-2xl text-lg leading-8 text-gray-400">
            Track the season at a glance: what is trending, what airs next, and which shows are carrying the highest audience scores right now.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="glass-card rounded-3xl p-5">
            <Flame className="h-5 w-5 text-pink-500" />
            <p className="mt-4 text-2xl font-black">{anime.length}</p>
            <p className="mt-1 text-xs uppercase tracking-[0.18em] text-gray-400">Season entries</p>
          </div>
          <div className="glass-card rounded-3xl p-5">
            <Clock3 className="h-5 w-5 text-primary" />
            <p className="mt-4 text-2xl font-black">{upcomingSoon.length}</p>
            <p className="mt-1 text-xs uppercase tracking-[0.18em] text-gray-400">Airing soon</p>
          </div>
          <div className="glass-card rounded-3xl p-5">
            <Tv2 className="h-5 w-5 text-sky-400" />
            <p className="mt-4 text-2xl font-black">{majorFormatCount}</p>
            <p className="mt-1 text-xs uppercase tracking-[0.18em] text-gray-400">Major TV/Movie</p>
          </div>
          <div className="glass-card rounded-3xl p-5">
            <CalendarDays className="h-5 w-5 text-yellow-400" />
            <p className="mt-4 text-2xl font-black">{averageScore ? `${averageScore}/10` : "--"}</p>
            <p className="mt-1 text-xs uppercase tracking-[0.18em] text-gray-400">Average score</p>
          </div>
        </div>
      </div>

      {upcomingSoon.length > 0 && (
        <section className="mb-12 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {upcomingSoon.map((entry) => (
            <div key={entry.id} className="glass-card rounded-3xl p-5">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Next to air</p>
              <h3 className="mt-3 line-clamp-2 text-lg font-bold">{entry.title.english || entry.title.romaji}</h3>
              <p className="mt-2 text-sm text-gray-400">
                {entry.nextAiringEpisode ? (
                  <LiveCountdownText 
                    timeUntilAiring={entry.nextAiringEpisode.timeUntilAiring} 
                    episode={entry.nextAiringEpisode.episode} 
                  />
                ) : (
                  "Schedule TBA"
                )}
              </p>
              <p className="mt-3 text-xs uppercase tracking-[0.18em] text-gray-500">
                Score {entry.averageScore ? `${(entry.averageScore / 10).toFixed(1)}/10` : "TBA"} · {entry.studios?.nodes?.[0]?.name || "Studio pending"}
              </p>
            </div>
          ))}
        </section>
      )}

      <div className="mb-12">
        <h2 className="flex items-center gap-3 text-4xl font-black tracking-tighter">
          <CalendarDays className="h-8 w-8 text-pink-500" />
          Full Season Grid
        </h2>
        <p className="mt-2 text-lg text-gray-400">
          Tracking {formatCompactNumber(anime.length)} of the most popular anime airing this season, updated in real-time.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6">
        {anime.map((a) => (
          <AnimeCard
            key={a.idMal || a.id}
            id={a.idMal as number}
            title={a.title.english || a.title.romaji}
            image={a.coverImage.large}
            intro={truncateText(stripHtmlTags(a.description), 110)}
            rating={a.averageScore ? +(a.averageScore / 10).toFixed(1) : null}
            nextEpisode={a.nextAiringEpisode?.episode}
            timeUntilAiring={a.nextAiringEpisode?.timeUntilAiring}
            type={a.studios?.nodes?.[0]?.name}
          />
        ))}
      </div>
    </div>
  );
}
