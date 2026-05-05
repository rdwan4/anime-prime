const ANILIST_API = 'https://graphql.anilist.co';

export interface AiringAnime {
  id: number;
  idMal: number | null;
  format?: string | null;
  title: { romaji: string; english: string | null };
  coverImage: { large: string; extraLarge: string };
  bannerImage: string | null;
  nextAiringEpisode: {
    airingAt: number;
    episode: number;
    timeUntilAiring: number;
  } | null;
  episodes: number | null;
  averageScore: number | null;
  genres: string[];
  trailer: { id: string; site: string } | null;
  description: string | null;
  status: string;
  season: string | null;
  seasonYear: number | null;
  studios: { nodes: { name: string }[] };
  externalLinks: { url: string; site: string; type: string; color: string | null }[];
  recommendations?: { nodes: any[] };
}

async function anilistQuery<T>(query: string, variables?: Record<string, unknown>): Promise<T | null> {
  try {
    const res = await fetch(ANILIST_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ query, variables }),
      signal: AbortSignal.timeout(15000),
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data?.data ?? null;
  } catch (e) {
    console.error('AniList query error:', e);
    return null;
  }
}

const AIRING_FIELDS = `
  id idMal
  format
  title { romaji english }
  coverImage { large extraLarge }
  bannerImage
  nextAiringEpisode { airingAt episode timeUntilAiring }
  episodes averageScore genres
  trailer { id site }
  description(asHtml: false)
  status season seasonYear
  studios(isMain: true) { nodes { name } }
  externalLinks { url site type color }
`;

export async function getCurrentlyAiring(perPage = 18): Promise<AiringAnime[]> {
  const query = `
    query($perPage: Int) {
      Page(page: 1, perPage: $perPage) {
        media(type: ANIME, status: RELEASING, sort: TRENDING_DESC) {
          ${AIRING_FIELDS}
        }
      }
    }
  `;
  const data = await anilistQuery<{ Page: { media: AiringAnime[] } }>(query, { perPage });
  return data?.Page?.media ?? [];
}

export async function getCurrentSeason(perPage = 24): Promise<AiringAnime[]> {
  const now = new Date();
  const month = now.getMonth() + 1;
  let season = 'WINTER';
  if (month >= 4 && month <= 6) season = 'SPRING';
  else if (month >= 7 && month <= 9) season = 'SUMMER';
  else if (month >= 10 && month <= 12) season = 'FALL';

  const query = `
    query($season: MediaSeason, $year: Int, $perPage: Int) {
      Page(page: 1, perPage: $perPage) {
        media(type: ANIME, season: $season, seasonYear: $year, sort: POPULARITY_DESC) {
          ${AIRING_FIELDS}
        }
      }
    }
  `;
  const data = await anilistQuery<{ Page: { media: AiringAnime[] } }>(query, {
    season,
    year: now.getFullYear(),
    perPage,
  });
  return data?.Page?.media ?? [];
}

export async function getUpcomingSeasonAnilist(perPage = 20): Promise<AiringAnime[]> {
  const now = new Date();
  const month = now.getMonth() + 1;
  const seasons = ['WINTER', 'SPRING', 'SUMMER', 'FALL'];
  let currentIdx = 0;
  if (month >= 4 && month <= 6) currentIdx = 1;
  else if (month >= 7 && month <= 9) currentIdx = 2;
  else if (month >= 10 && month <= 12) currentIdx = 3;

  const nextIdx = (currentIdx + 1) % 4;
  const nextSeason = seasons[nextIdx];
  const nextYear = nextIdx === 0 ? now.getFullYear() + 1 : now.getFullYear();

  const query = `
    query($season: MediaSeason, $year: Int, $perPage: Int) {
      Page(page: 1, perPage: $perPage) {
        media(type: ANIME, season: $season, seasonYear: $year, sort: POPULARITY_DESC, status_not: RELEASING) {
          ${AIRING_FIELDS}
        }
      }
    }
  `;
  const data = await anilistQuery<{ Page: { media: AiringAnime[] } }>(query, { season: nextSeason, year: nextYear, perPage });
  return data?.Page?.media ?? [];
}

export async function getAnimeByMalId(malId: string): Promise<AiringAnime | null> {
  const query = `
    query($malId: Int) {
      Media(idMal: $malId, type: ANIME) {
        ${AIRING_FIELDS}
        recommendations(perPage: 6) {
          nodes {
            mediaRecommendation {
              id idMal
              title { romaji english }
              coverImage { large }
              averageScore
            }
          }
        }
      }
    }
  `;
  const data = await anilistQuery<{ Media: AiringAnime }>(query, { malId: parseInt(malId) });
  return data?.Media ?? null;
}

export function formatCountdown(seconds: number): string {
  if (seconds <= 0) return 'Aired';
  const d = Math.floor(seconds / 86400);
  const h = Math.floor((seconds % 86400) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (d > 0) return `${d}d ${h}h`;
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}
