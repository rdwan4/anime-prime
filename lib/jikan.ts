const BASE_URL = "https://api.jikan.moe/v4";

async function fetchWithRetry(url: string, options: RequestInit = {}, retries = 3): Promise<Response> {
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(url, {
        ...options,
        signal: options.signal ?? AbortSignal.timeout(12000),
      });
      if (res.ok) return res;
      if (res.status === 429 && i < retries - 1) {
        await new Promise(resolve => setTimeout(resolve, 1500 * (i + 1)));
        continue;
      }
      if (res.status === 404) {
        return { ok: false, status: 404, json: async () => ({ data: null }) } as any;
      }
      throw new Error(`HTTP ${res.status} at ${url}`);
    } catch (e) {
      if (i === retries - 1) {
        console.error(`Jikan API error at ${url}:`, e);
        return { ok: false, status: 500, json: async () => ({ data: null }) } as any;
      }
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
  return { ok: false, status: 500, json: async () => ({ data: null }) } as any;
}

export async function getTrendingAnime() {
  const res = await fetchWithRetry(`${BASE_URL}/top/anime?filter=airing&limit=8`, {
    next: { revalidate: 3600 },
  });
  return res.json();
}

export async function getTopAnime(limit = 12) {
  const res = await fetchWithRetry(`${BASE_URL}/top/anime?limit=${limit}`, {
    next: { revalidate: 86400 },
  });
  return res.json();
}

export async function getUpcomingAnime(limit = 12) {
  const res = await fetchWithRetry(`${BASE_URL}/seasons/upcoming?limit=${limit}`, {
    next: { revalidate: 86400 },
  });
  return res.json();
}

export async function getAnimeDetails(id: string) {
  const res = await fetchWithRetry(`${BASE_URL}/anime/${id}/full`, {
    next: { revalidate: 3600 },
  });
  return res.json();
}

export async function searchAnime(query: string, limit = 24) {
  const res = await fetchWithRetry(`${BASE_URL}/anime?q=${encodeURIComponent(query)}&limit=${limit}`);
  return res.json();
}

export async function searchAnimeAdvanced({
  query,
  type,
  status,
  orderBy = "score",
  sort = "desc",
  limit = 24,
}: {
  query: string;
  type?: string;
  status?: string;
  orderBy?: string;
  sort?: "asc" | "desc";
  limit?: number;
}) {
  const params = new URLSearchParams({
    q: query,
    limit: String(limit),
    order_by: orderBy,
    sort,
  });

  if (type) params.set("type", type);
  if (status) params.set("status", status);

  const res = await fetchWithRetry(`${BASE_URL}/anime?${params.toString()}`, {
    next: { revalidate: 1800 },
  });

  return res.json();
}

export async function getAnimeEpisodes(id: string) {
  const res = await fetchWithRetry(`${BASE_URL}/anime/${id}/episodes`, {
    cache: "no-store",
  });
  return res.json();
}

export async function getAnimeCharacters(id: string) {
  const res = await fetchWithRetry(`${BASE_URL}/anime/${id}/characters`, {
    cache: "no-store",
  });
  return res.json();
}

export async function getAnimeStaff(id: string) {
  const res = await fetchWithRetry(`${BASE_URL}/anime/${id}/staff`, {
    cache: "no-store",
  });
  return res.json();
}

export async function getTopAnimePaginated(page = 1, limit = 24) {
  const res = await fetchWithRetry(`${BASE_URL}/top/anime?page=${page}&limit=${limit}`, {
    next: { revalidate: 3600 },
  });
  return res.json();
}

export async function getScheduleByDay(day: string) {
  const res = await fetchWithRetry(`${BASE_URL}/schedules?filter=${day}&limit=25`, {
    next: { revalidate: 3600 },
  });
  return res.json();
}

export async function getCurrentSeasonAnime(limit = 24) {
  const res = await fetchWithRetry(`${BASE_URL}/seasons/now?limit=${limit}`, {
    next: { revalidate: 3600 },
  });
  return res.json();
}

export async function getAnimeByGenre(genreId: number, page = 1) {
  const res = await fetchWithRetry(
    `${BASE_URL}/anime?genres=${genreId}&order_by=score&sort=desc&limit=24&page=${page}`,
    { next: { revalidate: 86400 } }
  );
  return res.json();
}

export async function getAnimeNews(id: string) {
  const res = await fetchWithRetry(`${BASE_URL}/anime/${id}/news`, {
    next: { revalidate: 3600 },
  });
  return res.json();
}

export async function getTopCharacters(limit = 10) {
  const res = await fetchWithRetry(`${BASE_URL}/top/characters?limit=${limit}`, {
    next: { revalidate: 3600 },
  });
  return res.json();
}

export async function getRecentReviews() {
  const res = await fetchWithRetry(`${BASE_URL}/reviews/anime`, {
    next: { revalidate: 600 },
  });
  return res.json();
}

export async function getGenres() {
  const res = await fetchWithRetry(`${BASE_URL}/genres/anime`, {
    next: { revalidate: 86400 },
  });
  return res.json();
}
