import { ANIME } from "@consumet/extensions";

// Initialize the Hianime (formerly Zoro/Aniwatch) provider from Consumet
const hianime = new ANIME.Hianime();

/**
 * Search Aniwatch for an anime.
 */
export async function searchAniwatch(query: string) {
  try {
    const results = await hianime.search(query);
    return results;
  } catch (error) {
    console.error("Failed to search Aniwatch:", error);
    throw error;
  }
}

/**
 * Fetch detailed information for an anime from Aniwatch given its ID
 * (e.g., "shingeki-no-kyojin-season-3-part-2-113")
 */
export async function getAniwatchDetails(id: string) {
  try {
    const details = await hianime.fetchAnimeInfo(id);
    return details;
  } catch (error) {
    console.error("Failed to fetch Aniwatch details:", error);
    throw error;
  }
}

/**
 * Fetch the direct streaming links explicitly from Aniwatch/Zoro servers.
 * @param episodeId - The episode ID format retrieved from getAniwatchDetails
 */
export async function getAniwatchStream(episodeId: string) {
  try {
    // This fetches the direct video URLs from 3rd party providers like Megacloud that Aniwatch uses
    const streamSources = await hianime.fetchEpisodeSources(episodeId);
    return streamSources;
  } catch (error) {
    console.error("Failed to fetch stream sources:", error);
    throw error;
  }
}

/**
 * Get Top Airing Anime directly from Aniwatch's home page rankings
 */
export async function getAniwatchTopAiring() {
  try {
    const topAiring = await hianime.fetchTopAiring();
    return topAiring;
  } catch (error) {
    console.error("Failed to fetch top airing:", error);
    throw error;
  }
}
