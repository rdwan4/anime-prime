const BASE_URL = "https://api.jikan.moe/v4";

export async function getTrendingAnime() {
  const res = await fetch(`${BASE_URL}/top/anime?filter=airing&limit=8`, {
    next: { revalidate: 3600 },
  });
  if (!res.ok) throw new Error("Failed to fetch trending anime");
  return res.json();
}

export async function getTopAnime() {
  const res = await fetch(`${BASE_URL}/top/anime?limit=12`, {
    next: { revalidate: 86400 },
  });
  if (!res.ok) throw new Error("Failed to fetch top anime");
  return res.json();
}

export async function getUpcomingAnime() {
  const res = await fetch(`${BASE_URL}/seasons/upcoming?limit=12`, {
    next: { revalidate: 86400 },
  });
  if (!res.ok) throw new Error("Failed to fetch upcoming anime");
  return res.json();
}

export async function getAnimeDetails(id: string) {
  const res = await fetch(`${BASE_URL}/anime/${id}/full`);
  if (!res.ok) throw new Error("Failed to fetch anime details");
  return res.json();
}

export async function searchAnime(query: string) {
  const res = await fetch(`${BASE_URL}/anime?q=${query}&limit=20`);
  if (!res.ok) throw new Error("Failed to fetch search results");
  return res.json();
}

export async function getAnimeEpisodes(id: string) {
  const res = await fetch(`${BASE_URL}/anime/${id}/episodes`);
  if (!res.ok) throw new Error("Failed to fetch episodes");
  return res.json();
}
