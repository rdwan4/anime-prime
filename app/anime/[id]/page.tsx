import { getAnimeByMalId } from "@/lib/anilist";
import { getAnimeCharacters, getAnimeDetails, getAnimeEpisodes, getAnimeNews, getAnimeStaff } from "@/lib/jikan";
import {
  Star,
  PlayCircle,
  ExternalLink,
  MapPin,
  Tv,
  Clock,
  Newspaper,
  Heart,
  Users,
  Trophy,
  BookOpen,
  CalendarDays,
  BadgeInfo,
  Radio,
  Link2,
  Languages,
  Hash,
  Mic2,
  Clapperboard,
  ListVideo,
} from "lucide-react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import CountdownBadge from "@/components/CountdownBadge";
import AnimeCard from "@/components/AnimeCard";
import NewsCard from "@/components/NewsCard";
import Link from "next/link";
import { NewsItem } from "@/lib/news";
import AdPlacement from "@/components/AdPlacement";

export const dynamic = "force-dynamic";

function formatCompact(value?: number | null) {
  if (!value) return "Unknown";

  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

function joinNames(items?: Array<{ name: string }> | null) {
  return items?.map((item) => item.name).filter(Boolean).join(", ") || "Unknown";
}

function capitalize(value?: string | null) {
  if (!value) return null;
  return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
}

function withFallback(value?: string | number | null) {
  if (value === null || value === undefined || value === "") return "Unknown";
  return value;
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const anime = await getAnimeDetails(params.id);
  if (!anime || !anime.data) return { title: "Anime Not Found" };

  const title = anime.data.title;
  const description = anime.data.synopsis?.substring(0, 160).trim() + "...";
  const image = anime.data.images?.jpg?.large_image_url;

  return {
    title: title,
    description: description,
    openGraph: {
      title: `${title} | AnimePrime`,
      description: description,
      images: image ? [{ url: image }] : [],
      type: "video.tv_show",
    },
    twitter: {
      card: "summary_large_image",
      title: title,
      description: description,
      images: image ? [image] : [],
    },
  };
}

export default async function AnimeDetail({ params }: { params: { id: string } }) {
  const [jikanDataResult, anilistDataResult, newsResult, charactersResult, staffResult, episodesResult] = await Promise.allSettled([
    getAnimeDetails(params.id),
    getAnimeByMalId(params.id),
    getAnimeNews(params.id),
    getAnimeCharacters(params.id),
    getAnimeStaff(params.id),
    getAnimeEpisodes(params.id),
  ]);

  const jikan = jikanDataResult.status === "fulfilled" ? jikanDataResult.value?.data : null;
  const anilist = anilistDataResult.status === "fulfilled" ? anilistDataResult.value : null;
  const rawNews = newsResult.status === "fulfilled" ? newsResult.value?.data?.slice(0, 4) || [] : [];
  
  const news: NewsItem[] = rawNews.map((item: any) => ({
    id: `jikan-news-${item.url}`,
    title: item.title,
    description: item.excerpt || "Read more on MyAnimeList.",
    link: item.url,
    pubDate: item.date,
    image: item.images?.jpg?.image_url || null,
    source: "MyAnimeList",
    category: "News",
  }));

  const characterEntries = charactersResult.status === "fulfilled" ? charactersResult.value?.data?.slice(0, 8) || [] : [];
  const staffEntries = staffResult.status === "fulfilled" ? staffResult.value?.data?.slice(0, 6) || [] : [];
  const episodes = episodesResult.status === "fulfilled" ? episodesResult.value?.data?.slice(0, 8) || [] : [];

  if (!jikan && !anilist) notFound();

  const title = anilist?.title.english || jikan?.title || anilist?.title.romaji || "Unknown Title";
  const banner = anilist?.bannerImage || jikan?.images?.jpg?.large_image_url || jikan?.trailer?.images?.maximum_image_url;
  const cover = anilist?.coverImage?.extraLarge || jikan?.images?.jpg?.large_image_url || banner;
  const synopsis = anilist?.description || jikan?.synopsis || "No synopsis available.";
  const score = anilist?.averageScore ? (anilist.averageScore / 10).toFixed(1) : jikan?.score?.toFixed?.(1) || jikan?.score;
  const seasonLabel =
    (jikan?.season && jikan?.year && `${capitalize(jikan.season)} ${jikan.year}`) ||
    (anilist?.season && anilist?.seasonYear && `${capitalize(anilist.season)} ${anilist.seasonYear}`) ||
    null;
  const titleVariants = Array.from(
    new Set([jikan?.title_japanese, anilist?.title?.romaji, anilist?.title?.english, jikan?.title_english].filter(Boolean))
  ).filter((variant) => variant !== title);
  const displayedGenres = Array.from(
    new Set([...(anilist?.genres || []), ...(jikan?.genres?.map((genre: any) => genre.name) || [])])
  );
  const themeTags = [
    ...(jikan?.themes?.map((theme: any) => theme.name) || []),
    ...(jikan?.demographics?.map((group: any) => group.name) || []),
  ];
  const synonyms = Array.from(new Set([...(jikan?.title_synonyms || []), ...(jikan?.titles?.map((entry: any) => entry.title) || [])])).filter(
    (variant) => variant && variant !== title && !titleVariants.includes(variant)
  );
  const rankingFacts = [
    { label: "Popularity", value: jikan?.popularity ? `#${jikan.popularity}` : "Unknown" },
    { label: "Scored by", value: formatCompact(jikan?.scored_by) },
    { label: "Broadcast", value: withFallback(jikan?.broadcast?.string) },
    { label: "Approved", value: jikan?.approved === true ? "Yes" : jikan?.approved === false ? "No" : "Unknown" },
  ];
  const titleFacts = [
    { label: "English title", value: withFallback(jikan?.title_english || anilist?.title?.english) },
    { label: "Romaji title", value: withFallback(anilist?.title?.romaji || jikan?.title) },
    { label: "Japanese title", value: withFallback(jikan?.title_japanese) },
    { label: "Synonyms", value: synonyms.length > 0 ? synonyms.slice(0, 6).join(", ") : "Unknown" },
  ];
  const openingThemes = jikan?.theme?.openings || [];
  const endingThemes = jikan?.theme?.endings || [];
  const relatedEntries =
    jikan?.relations?.flatMap((relation: any) =>
      (relation.entry || []).map((entry: any) => ({
        relation: relation.relation,
        ...entry,
      }))
    ) || [];
  const quickFacts = [
    { label: "Format", value: withFallback(jikan?.type || anilist?.format) },
    { label: "Episodes", value: withFallback(jikan?.episodes || anilist?.episodes) },
    { label: "Duration", value: withFallback(jikan?.duration) },
    { label: "Source", value: withFallback(jikan?.source) },
    { label: "Rating", value: withFallback(jikan?.rating) },
    { label: "Season", value: withFallback(seasonLabel) },
    { label: "Aired", value: withFallback(jikan?.aired?.string) },
    { label: "Status", value: withFallback(jikan?.status || anilist?.status) },
  ];
  const productionFacts = [
    { label: "Main studio", value: withFallback(anilist?.studios?.nodes?.[0]?.name || jikan?.studios?.[0]?.name) },
    { label: "Producers", value: withFallback(joinNames(jikan?.producers)) },
    { label: "Licensors", value: withFallback(joinNames(jikan?.licensors)) },
    { label: "Japanese title", value: withFallback(jikan?.title_japanese) },
  ];
  const statCards = [
    {
      label: "Community score",
      value: score ? `${score}/10` : "Unknown",
      icon: Star,
      accent: "text-yellow-400",
    },
    {
      label: "Rank",
      value: jikan?.rank ? `#${jikan.rank}` : "Unknown",
      icon: Trophy,
      accent: "text-emerald-400",
    },
    {
      label: "Members",
      value: formatCompact(jikan?.members),
      icon: Users,
      accent: "text-sky-400",
    },
    {
      label: "Favorites",
      value: formatCompact(jikan?.favorites),
      icon: Heart,
      accent: "text-pink-400",
    },
  ];
  const streamingLinks = anilist?.externalLinks?.filter((link: any) => link.type === "STREAMING") || [];
  const background = jikan?.background;

  return (
    <div className="min-h-screen">
      <div className="relative h-[40vh] w-full overflow-hidden">
        {banner && (
          <img
            src={banner}
            alt="Banner"
            className="absolute inset-0 h-full w-full scale-105 object-cover opacity-50 blur-sm"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
      </div>

      <div className="container relative z-10 mx-auto -mt-32 px-6 pb-20 md:px-12">
        <div className="flex flex-col gap-10 md:flex-row">
          <div className="w-full flex-shrink-0 md:w-72">
            <div className="group relative mb-6 aspect-[2/3] overflow-hidden rounded-2xl border border-white/10 shadow-2xl glass-card">
              <img src={cover} alt={title} className="h-full w-full object-cover" />
              {anilist?.nextAiringEpisode && (
                <CountdownBadge timeUntilAiring={anilist.nextAiringEpisode.timeUntilAiring} episode={anilist.nextAiringEpisode.episode} />
              )}
            </div>

            {anilist?.trailer && (
              <a
                href={`https://youtube.com/watch?v=${anilist.trailer.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mb-4 flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 py-3 font-bold text-white shadow-lg shadow-red-600/20 transition-colors hover:bg-red-700"
              >
                <PlayCircle className="h-5 w-5" />
                Watch Trailer
              </a>
            )}

            <div className="glass-card space-y-4 rounded-xl p-5">
              {score && (
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-yellow-500/20 p-2">
                    <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase text-gray-500">Score</p>
                    <p className="text-sm font-medium">{score} / 10</p>
                  </div>
                </div>
              )}
              {(jikan?.status || anilist?.status) && (
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-blue-500/20 p-2">
                    <Tv className="h-4 w-4 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase text-gray-500">Status</p>
                    <p className="text-sm font-medium">{jikan?.status || anilist?.status}</p>
                  </div>
                </div>
              )}
              {(jikan?.episodes || anilist?.episodes) && (
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-purple-500/20 p-2">
                    <Clock className="h-4 w-4 text-purple-500" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase text-gray-500">Episodes</p>
                    <p className="text-sm font-medium">{jikan?.episodes || anilist?.episodes}</p>
                  </div>
                </div>
              )}
              {(anilist?.studios?.nodes?.[0]?.name || jikan?.studios?.[0]?.name) && (
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-green-500/20 p-2">
                    <MapPin className="h-4 w-4 text-green-500" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase text-gray-500">Studio</p>
                    <p className="text-sm font-medium">{anilist?.studios?.nodes?.[0]?.name || jikan?.studios?.[0]?.name}</p>
                  </div>
                </div>
              )}
            </div>

            {streamingLinks.length > 0 && (
              <div className="mt-6">
                <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-gray-400">Official Streams</h3>
                <div className="flex flex-col gap-2">
                  {streamingLinks.map((link: any) => (
                    <a
                      key={link.url}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between rounded-lg border border-white/5 bg-white/5 px-4 py-2.5 text-sm transition-colors hover:border-primary/30 hover:bg-primary/20"
                      style={{ color: link.color || "#fff" }}
                    >
                      <span className="font-bold">{link.site}</span>
                      <ExternalLink className="h-3 w-3 opacity-50" />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="mt-8 flex-1 md:mt-12">
            <h1 className="mb-4 text-4xl font-black tracking-tighter shadow-sm md:text-5xl">{title}</h1>

            {titleVariants.length > 0 && (
              <p className="mb-6 max-w-4xl text-base leading-relaxed text-gray-400">
                Also known as {titleVariants.join(" | ")}
              </p>
            )}

            <div className="mb-6 flex flex-wrap gap-3 text-xs font-bold uppercase tracking-[0.18em] text-white/90">
              {(jikan?.type || anilist?.format) && (
                <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2">{jikan?.type || anilist?.format}</span>
              )}
              {seasonLabel && <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2">{seasonLabel}</span>}
              {jikan?.source && <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2">Source {jikan.source}</span>}
              {jikan?.rating && <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2">{jikan.rating}</span>}
            </div>

            <div className="mb-8 flex flex-wrap gap-2">
              {displayedGenres.map((genre: string) => (
                <span key={genre} className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-bold text-gray-300">
                  {genre}
                </span>
              ))}
            </div>

            <div className="mb-10 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {statCards.map((card) => {
                const Icon = card.icon;

                return (
                  <div key={card.label} className="glass-card rounded-2xl p-5">
                    <div className={`mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-white/5 ${card.accent}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <p className="text-2xl font-black tracking-tighter">{card.value}</p>
                    <p className="mt-2 text-xs font-bold uppercase tracking-[0.18em] text-gray-400">{card.label}</p>
                  </div>
                );
              })}
            </div>

            <div className="grid grid-cols-1 gap-8 xl:grid-cols-[minmax(0,1.45fr)_360px]">
              <div className="space-y-10">
                <div className="prose prose-invert max-w-none prose-p:text-gray-300 prose-p:leading-relaxed">
                  <h3 className="mb-3 flex items-center gap-2 border-b border-white/10 pb-2 text-xl font-bold">
                    <BookOpen className="h-5 w-5 text-primary" />
                    Synopsis
                  </h3>
                  <p dangerouslySetInnerHTML={{ __html: synopsis }} />
                </div>

                {background && (
                  <div className="glass-card rounded-3xl p-6">
                    <h3 className="mb-3 flex items-center gap-2 text-lg font-bold">
                      <BadgeInfo className="h-5 w-5 text-primary" />
                      Production Notes
                    </h3>
                    <p className="text-sm leading-7 text-gray-300">{background}</p>
                  </div>
                )}

                {characterEntries.length > 0 && (
                  <div className="glass-card rounded-3xl p-6">
                    <h3 className="mb-4 flex items-center gap-2 text-lg font-bold">
                      <Mic2 className="h-5 w-5 text-primary" />
                      Cast Highlights
                    </h3>
                    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                      {characterEntries.map((entry: any) => (
                        <div key={entry.character.mal_id} className="rounded-2xl border border-white/5 bg-white/5 p-4">
                          <div className="mb-3 flex items-start gap-3">
                            <div className="relative h-16 w-12 overflow-hidden rounded-lg">
                              <img
                                src={entry.character.images.jpg.image_url}
                                alt={entry.character.name}
                                className="h-full w-full object-cover"
                              />
                            </div>
                            <div className="min-w-0">
                              <p className="line-clamp-2 text-sm font-bold text-white">{entry.character.name}</p>
                              <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.18em] text-primary">{entry.role}</p>
                            </div>
                          </div>
                          {entry.voice_actors?.[0] && (
                            <p className="text-xs leading-6 text-gray-400">
                              Voice: {entry.voice_actors[0].person.name} ({entry.voice_actors[0].language})
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {staffEntries.length > 0 && (
                  <div className="glass-card rounded-3xl p-6">
                    <h3 className="mb-4 flex items-center gap-2 text-lg font-bold">
                      <Clapperboard className="h-5 w-5 text-primary" />
                      Core Staff
                    </h3>
                    <div className="grid gap-4 md:grid-cols-2">
                      {staffEntries.map((entry: any) => (
                        <div key={entry.person.mal_id} className="rounded-2xl border border-white/5 bg-white/5 p-4">
                          <div className="flex items-start gap-3">
                            <div className="relative h-16 w-12 overflow-hidden rounded-lg">
                              <img
                                src={entry.person.images.jpg.image_url}
                                alt={entry.person.name}
                                className="h-full w-full object-cover"
                              />
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-bold text-white">{entry.person.name}</p>
                              <p className="mt-1 text-xs leading-6 text-gray-400">{(entry.positions || []).join(", ") || "Staff"}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {(openingThemes.length > 0 || endingThemes.length > 0) && (
                  <div className="glass-card rounded-3xl p-6">
                    <h3 className="mb-4 flex items-center gap-2 text-lg font-bold">
                      <Radio className="h-5 w-5 text-primary" />
                      Theme Songs
                    </h3>
                    <div className="grid gap-6 md:grid-cols-2">
                      <div>
                        <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-gray-500">Openings</p>
                        <div className="space-y-2">
                          {openingThemes.length > 0 ? (
                            openingThemes.map((theme: string) => (
                              <p key={theme} className="rounded-2xl border border-white/5 bg-white/5 px-4 py-3 text-sm leading-6 text-gray-200">
                                {theme}
                              </p>
                            ))
                          ) : (
                            <p className="text-sm text-gray-400">No opening theme information available.</p>
                          )}
                        </div>
                      </div>
                      <div>
                        <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-gray-500">Endings</p>
                        <div className="space-y-2">
                          {endingThemes.length > 0 ? (
                            endingThemes.map((theme: string) => (
                              <p key={theme} className="rounded-2xl border border-white/5 bg-white/5 px-4 py-3 text-sm leading-6 text-gray-200">
                                {theme}
                              </p>
                            ))
                          ) : (
                            <p className="text-sm text-gray-400">No ending theme information available.</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {news && news.length > 0 && (
                  <div className="mt-12">
                    <h3 className="mb-6 flex items-center gap-2 border-b border-white/10 pb-2 text-xl font-bold">
                      <Newspaper className="h-5 w-5 text-primary" /> Latest Updates
                    </h3>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      {news.map((item) => (
                        <NewsCard key={item.id} item={item} />
                      ))}
                    </div>
                  </div>
                )}

                {anilist?.recommendations?.nodes?.length ? (
                  <div className="mt-12">
                    <h3 className="mb-6 border-b border-white/10 pb-2 text-xl font-bold">If You Liked This</h3>
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4">
                      {anilist.recommendations.nodes.map(
                        (node: any) =>
                          node.mediaRecommendation && (
                            <AnimeCard
                              key={node.mediaRecommendation.idMal}
                              id={node.mediaRecommendation.idMal}
                              title={node.mediaRecommendation.title.english || node.mediaRecommendation.title.romaji}
                              image={node.mediaRecommendation.coverImage.large}
                              rating={node.mediaRecommendation.averageScore ? +(node.mediaRecommendation.averageScore / 10).toFixed(1) : null}
                            />
                          )
                      )}
                    </div>
                  </div>
                ) : null}

                {relatedEntries.length > 0 && (
                  <div className="mt-12">
                    <h3 className="mb-6 flex items-center gap-2 border-b border-white/10 pb-2 text-xl font-bold">
                      <Link2 className="h-5 w-5 text-primary" />
                      Related Titles
                    </h3>
                    <div className="grid gap-4 md:grid-cols-2">
                      {relatedEntries.slice(0, 8).map((entry: any) => (
                        <a
                          key={`${entry.relation}-${entry.mal_id}-${entry.name}`}
                          href={entry.type === "anime" ? `/anime/${entry.mal_id}` : entry.url}
                          target={entry.type === "anime" ? undefined : "_blank"}
                          rel={entry.type === "anime" ? undefined : "noopener noreferrer"}
                          className="glass-card rounded-2xl p-4 transition-colors hover:bg-white/5"
                        >
                          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-primary">{entry.relation}</p>
                          <h4 className="mt-2 text-sm font-bold leading-6 text-white">{entry.name}</h4>
                          <p className="mt-1 text-xs uppercase tracking-[0.18em] text-gray-500">{entry.type}</p>
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {episodes.length > 0 && (
                  <div className="mt-12">
                    <h3 className="mb-6 flex items-center gap-2 border-b border-white/10 pb-2 text-xl font-bold">
                      <ListVideo className="h-5 w-5 text-primary" />
                      Recent Episodes
                    </h3>
                    <div className="grid gap-4 md:grid-cols-2">
                      {episodes.map((episode: any) => (
                        <div key={episode.mal_id} className="glass-card rounded-2xl p-4">
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-primary">Episode {episode.mal_id}</p>
                              <h4 className="mt-2 text-sm font-bold leading-6 text-white">
                                {episode.title || episode.title_japanese || "Untitled episode"}
                              </h4>
                            </div>
                            {episode.score && (
                              <span className="rounded-full border border-yellow-500/30 bg-yellow-500/10 px-2 py-1 text-[10px] font-bold text-yellow-300">
                                {episode.score}/5
                              </span>
                            )}
                          </div>
                          <div className="mt-3 flex flex-wrap gap-3 text-[11px] text-gray-400">
                            {episode.aired && <span>Aired {new Date(episode.aired).toLocaleDateString()}</span>}
                            {episode.filler && <span>Filler</span>}
                            {episode.recap && <span>Recap</span>}
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-5">
                      <Link
                        href={`https://myanimelist.net/anime/${params.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-gray-300 transition-colors hover:border-primary/30 hover:text-white"
                      >
                        Full episode listing
                        <ExternalLink className="h-3 w-3" />
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-6">
                <div className="glass-card rounded-3xl p-6">
                  <h3 className="mb-4 flex items-center gap-2 text-lg font-bold">
                    <CalendarDays className="h-5 w-5 text-primary" />
                    Quick Facts
                  </h3>
                  <div className="space-y-3">
                    {quickFacts.map((fact) => (
                      <div key={fact.label} className="flex items-start justify-between gap-4 border-b border-white/5 pb-3 last:border-b-0 last:pb-0">
                        <span className="text-xs font-bold uppercase tracking-[0.18em] text-gray-500">{fact.label}</span>
                        <span className="max-w-[65%] text-right text-sm text-gray-200">{fact.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <AdPlacement zoneId="236566" format="native" />

                <div className="glass-card rounded-3xl p-6">
                  <h3 className="mb-4 flex items-center gap-2 text-lg font-bold">
                    <Hash className="h-5 w-5 text-primary" />
                    Ranking And Reach
                  </h3>
                  <div className="space-y-3">
                    {rankingFacts.map((fact) => (
                      <div key={fact.label} className="flex items-start justify-between gap-4 border-b border-white/5 pb-3 last:border-b-0 last:pb-0">
                        <span className="text-xs font-bold uppercase tracking-[0.18em] text-gray-500">{fact.label}</span>
                        <span className="max-w-[65%] text-right text-sm text-gray-200">{fact.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="glass-card rounded-3xl p-6">
                  <h3 className="mb-4 flex items-center gap-2 text-lg font-bold">
                    <Languages className="h-5 w-5 text-primary" />
                    Title Variants
                  </h3>
                  <div className="space-y-3">
                    {titleFacts.map((fact) => (
                      <div key={fact.label} className="border-b border-white/5 pb-3 last:border-b-0 last:pb-0">
                        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-gray-500">{fact.label}</p>
                        <p className="mt-1 text-sm leading-6 text-gray-200">{fact.value}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="glass-card rounded-3xl p-6">
                  <h3 className="mb-4 flex items-center gap-2 text-lg font-bold">
                    <MapPin className="h-5 w-5 text-primary" />
                    Production Team
                  </h3>
                  <div className="space-y-3">
                    {productionFacts.map((fact) => (
                      <div key={fact.label} className="border-b border-white/5 pb-3 last:border-b-0 last:pb-0">
                        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-gray-500">{fact.label}</p>
                        <p className="mt-1 text-sm leading-6 text-gray-200">{fact.value}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {themeTags.length > 0 && (
                  <div className="glass-card rounded-3xl p-6">
                    <h3 className="mb-4 flex items-center gap-2 text-lg font-bold">
                      <BadgeInfo className="h-5 w-5 text-primary" />
                      Themes And Audience
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {themeTags.map((tag) => (
                        <span key={tag} className="rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
