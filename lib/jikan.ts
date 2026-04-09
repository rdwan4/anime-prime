const BASE_URL = "https://api.jikan.moe/v4";

async function fetchWithRetry(url: string, options: RequestInit = {}, retries = 3) {
  for (let i = 0; i < retries; i++) {
    const res = await fetch(url, options);
    if (res.ok) return res;
    if (res.status === 429 && i < retries - 1) {
      // Rate limited: wait 1.5 seconds and retry
      await new Promise(resolve => setTimeout(resolve, 1500));
      continue;
    }
    // Don't throw forcefully if it's a 404 (Not Found), let it pass to error boundaries properly or return null-ish
    if (res.status === 404) {
      return { ok: false, status: 404, json: async () => ({ data: null }) } as any; 
    }
    throw new Error(`Failed to fetch: ${res.status} ${res.statusText} at ${url}`);
  }
  throw new Error(`Failed to fetch after ${retries} retries`);
}

export async function getTrendingAnime() {
  const res = await fetchWithRetry(`${BASE_URL}/top/anime?filter=airing&limit=8`, {
    next: { revalidate: 3600 },
  });
  return res.json();
}

export async function getTopAnime() {
  const res = await fetchWithRetry(`${BASE_URL}/top/anime?limit=12`, {
    next: { revalidate: 86400 },
  });
  return res.json();
}

export async function getUpcomingAnime() {
  const res = await fetchWithRetry(`${BASE_URL}/seasons/upcoming?limit=12`, {
    next: { revalidate: 86400 },
  });
  return res.json();
}

export async function getAnimeDetails(id: string) {
  // Use next caching so we don't spam details across generateMetadata and component render
  const res = await fetchWithRetry(`${BASE_URL}/anime/${id}/full`, {
    next: { revalidate: 3600 },
  });
  return res.json();
}

export async function searchAnime(query: string) {
  const res = await fetchWithRetry(`${BASE_URL}/anime?q=${query}&limit=20`);
  return res.json();
}

export async function getAnimeEpisodes(id: string) {
  const res = await fetchWithRetry(`${BASE_URL}/anime/${id}/episodes`, {
    next: { revalidate: 3600 },
  });
  return res.json();
}
