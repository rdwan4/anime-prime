import { MetadataRoute } from 'next';
import { getTopAnime, getTrendingAnime } from '@/lib/jikan';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://www.animeprime.fun';

  // Static routes
  const staticRoutes = [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/news`,
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/season`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/explore`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
  ];

  try {
    // Fetch top and trending anime to include in sitemap
    const [topAnime, trendingAnime] = await Promise.all([
      getTopAnime(50),
      getTrendingAnime(),
    ]);

    const topAnimeData = topAnime.data || [];
    const trendingAnimeData = trendingAnime.data || [];

    // Combine and deduplicate by ID
    const allAnime = [...topAnimeData, ...trendingAnimeData];
    const uniqueAnimeMap = new Map();
    
    for (const anime of allAnime) {
      if (!uniqueAnimeMap.has(anime.mal_id)) {
        uniqueAnimeMap.set(anime.mal_id, anime);
      }
    }

    const dynamicRoutes = Array.from(uniqueAnimeMap.values()).map((anime) => ({
      url: `${baseUrl}/anime/${anime.mal_id}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    }));

    return [...staticRoutes, ...dynamicRoutes] as MetadataRoute.Sitemap;
  } catch (error) {
    console.error('Error generating sitemap:', error);
    return staticRoutes as MetadataRoute.Sitemap;
  }
}
