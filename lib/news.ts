export interface NewsItem {
  id: string;
  title: string;
  description: string;
  link: string;
  pubDate: string;
  image: string | null;
  source: string;
  category: string;
}

function stripHTML(html: string): string {
  if (!html) return "";
  return html
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/gi, "$1") // Extract CDATA content first
    .replace(/&amp;/g, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&rsquo;/g, "'")
    .replace(/&lsquo;/g, "'")
    .replace(/&ldquo;/g, '"')
    .replace(/&rdquo;/g, '"')
    .replace(/&hellip;/g, "...")
    .replace(/&nbsp;/g, " ")
    .replace(/<[^>]*>/g, "") // Remove all HTML tags AFTER unescaping
    .replace(/\n+/g, " ")
    .replace(/\s+/g, " ") // Collapse multiple spaces
    .trim();
}

function extractTag(xml: string, tag: string): string {
  const cdataPattern = new RegExp(`<${tag}(?:[^>]*)><!\\[CDATA\\[([\\s\\S]*?)\\]\\]><\\/${tag}>`, "i");
  const cdataMatch = cdataPattern.exec(xml);
  if (cdataMatch) return cdataMatch[1].trim();

  const normalPattern = new RegExp(`<${tag}(?:[^>]*)>([\\s\\S]*?)<\\/${tag}>`, "i");
  const normalMatch = normalPattern.exec(xml);
  return normalMatch ? normalMatch[1].trim() : "";
}

function extractImageFromItem(item: string): string | null {
  // Try media:content or media:thumbnail (standard RSS extensions)
  const mediaContent = item.match(/<(?:media:content|content)[^>]*url="([^"]*(?:jpg|jpeg|png|webp|gif)[^"]*)"/i);
  if (mediaContent) return mediaContent[1];

  const mediaThumbnail = item.match(/<(?:media:thumbnail|thumbnail)[^>]*url="([^"]*(?:jpg|jpeg|png|webp|gif)[^"]*)"/i);
  if (mediaThumbnail) return mediaThumbnail[1];

  // Try standard enclosure
  const enclosure = item.match(/<enclosure[^>]*url="([^"]*)"[^>]*type="image/i);
  if (enclosure) return enclosure[1];

  // Try finding an img tag in the description or content
  const imgTag = item.match(/<img[^>]*src="([^"]*(?:jpg|jpeg|png|webp)[^"]*)"/i);
  if (imgTag) return imgTag[1];

  // Fallback to any URL that looks like an image in an attribute
  const anyImageUrl = item.match(/url="([^"]*(?:jpg|jpeg|png|webp|gif)[^"]*)"/i);
  if (anyImageUrl) return anyImageUrl[1];

  return null;
}

function buildRedditMeta(score: number, comments: number) {
  return `${score.toLocaleString()} upvotes | ${comments.toLocaleString()} comments`;
}

async function fetchANNFeed(): Promise<NewsItem[]> {
  try {
    const res = await fetch("https://www.animenewsnetwork.com/all/rss.xml?ann-edition=us", {
      next: { revalidate: 1800 },
      headers: { "User-Agent": "AnimePrime-News/1.0" },
    });
    if (!res.ok) return [];

    const text = await res.text();
    const items = text.match(/<item>([\s\S]*?)<\/item>/g) || [];

    return items
      .slice(0, 20)
      .map((item, i) => {
        const title = stripHTML(extractTag(item, "title"));
        const link = extractTag(item, "link") || "";
        const description = stripHTML(extractTag(item, "description")).substring(0, 220);
        const pubDate = extractTag(item, "pubDate");
        const image = extractImageFromItem(item);

        return {
          id: `ann-${i}-${Date.now()}`,
          title,
          description: description || "Click to read the full article on Anime News Network.",
          link,
          pubDate,
          image,
          source: "Anime News Network",
          category: "News",
        };
      })
      .filter((item) => item.title && item.link);
  } catch (e) {
    console.error("ANN feed error:", e);
    return [];
  }
}

async function fetchANNNewsFeed(): Promise<NewsItem[]> {
  try {
    const res = await fetch("https://www.animenewsnetwork.com/news/rss.xml", {
      next: { revalidate: 1800 },
      headers: { "User-Agent": "AnimePrime-News/1.0" },
    });
    if (!res.ok) return [];

    const text = await res.text();
    const items = text.match(/<item>([\s\S]*?)<\/item>/g) || [];

    return items
      .slice(0, 10)
      .map((item, i) => {
        const title = stripHTML(extractTag(item, "title"));
        const link = extractTag(item, "link");
        const description = stripHTML(extractTag(item, "description")).substring(0, 220);
        const pubDate = extractTag(item, "pubDate");
        const image = extractImageFromItem(item);

        return {
          id: `ann-news-${i}-${Date.now()}`,
          title,
          description: description || "Latest anime news from ANN.",
          link,
          pubDate,
          image,
          source: "Anime News Network",
          category: "Industry News",
        };
      })
      .filter((item) => item.title && item.link);
  } catch {
    return [];
  }
}

async function fetchRedditAnimeFeed(): Promise<NewsItem[]> {
  try {
    const res = await fetch("https://www.reddit.com/r/anime/hot.json?limit=25", {
      next: { revalidate: 300 },
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
    });
    if (!res.ok) return [];

    const data = await res.json();
    const posts: any[] = data?.data?.children || [];

    return posts
      .filter((p: any) => p.data.score > 200 && !p.data.is_self)
      .map((p: any) => {
        let image = p.data.preview?.images?.[0]?.source?.url;
        if (image) image = image.replace(/&amp;/g, "&");
        if (!image && p.data.thumbnail?.startsWith("http")) image = p.data.thumbnail;

        return {
          id: `reddit-${p.data.id}`,
          title: p.data.title,
          description: buildRedditMeta(p.data.score, p.data.num_comments),
          link: `https://reddit.com${p.data.permalink}`,
          pubDate: new Date(p.data.created_utc * 1000).toUTCString(),
          image: image || null,
          source: "r/anime",
          category: "Community",
        };
      });
  } catch {
    return [];
  }
}

async function fetchRedditNewsFlairFeed(): Promise<NewsItem[]> {
  try {
    const res = await fetch("https://www.reddit.com/r/anime/search.json?q=flair%3ANews&sort=new&limit=15&restrict_sr=1", {
      next: { revalidate: 300 },
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
    });
    if (!res.ok) return [];

    const data = await res.json();
    const posts: any[] = data?.data?.children || [];

    return posts.map((p: any) => {
      let image = p.data.preview?.images?.[0]?.source?.url;
      if (image) image = image.replace(/&amp;/g, "&");
      if (!image && p.data.thumbnail?.startsWith("http")) image = p.data.thumbnail;

      return {
        id: `reddit-news-${p.data.id}`,
        title: p.data.title,
        description: buildRedditMeta(p.data.score, p.data.num_comments),
        link: `https://reddit.com${p.data.permalink}`,
        pubDate: new Date(p.data.created_utc * 1000).toUTCString(),
        image: image || null,
        source: "r/anime News",
        category: "Community News",
      };
    });
  } catch {
    return [];
  }
}

async function fetchRedditMangaFeed(): Promise<NewsItem[]> {
  try {
    const res = await fetch("https://www.reddit.com/r/manga/hot.json?limit=10", {
      next: { revalidate: 60 },
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
    });
    if (!res.ok) return [];

    const data = await res.json();
    const posts: any[] = data?.data?.children || [];

    return posts
      .filter((p: any) => p.data.score > 100 && !p.data.is_self)
      .slice(0, 5)
      .map((p: any) => ({
        id: `manga-${p.data.id}`,
        title: p.data.title,
        description: buildRedditMeta(p.data.score, p.data.num_comments),
        link: `https://reddit.com${p.data.permalink}`,
        pubDate: new Date(p.data.created_utc * 1000).toUTCString(),
        image: p.data.thumbnail?.startsWith("http") && !p.data.thumbnail.includes("self") ? p.data.thumbnail : null,
        source: "r/manga",
        category: "Community",
      }));
  } catch {
    return [];
  }
}

async function scrapeImageFromLink(url: string): Promise<string | null> {
  if (!url || !url.startsWith("http")) return null;
  
  try {
    const res = await fetch(url, {
      signal: AbortSignal.timeout(6000), // Slightly longer timeout
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
      },
    });
    if (!res.ok) return null;

    const html = await res.text();
    
    // Check OG image, Twitter image, and high-res icons
    const ogImageMatch =
      html.match(/<meta[^>]*property="og:image"[^>]*content="([^"]*)"/i) ||
      html.match(/<meta[^>]*content="([^"]*)"[^>]*property="og:image"/i) ||
      html.match(/<meta[^>]*name="twitter:image"[^>]*content="([^"]*)"/i) ||
      html.match(/<meta[^>]*content="([^"]*)"[^>]*name="twitter:image"/i);

    if (ogImageMatch) {
      let imageUrl = ogImageMatch[1];
      if (imageUrl.startsWith("//")) imageUrl = "https:" + imageUrl;
      if (imageUrl.startsWith("/")) {
        const urlObj = new URL(url);
        imageUrl = `${urlObj.protocol}//${urlObj.host}${imageUrl}`;
      }
      return imageUrl;
    }

    // Fallback: search for the first large-looking image in the body
    const bodyImgMatch = html.match(/<img[^>]*src="([^"]*(?:large|feature|header|cover)[^"]*(?:jpg|jpeg|png|webp))"/i);
    if (bodyImgMatch) {
      let imageUrl = bodyImgMatch[1];
      if (imageUrl.startsWith("//")) imageUrl = "https:" + imageUrl;
      if (imageUrl.startsWith("/")) {
        const urlObj = new URL(url);
        imageUrl = `${urlObj.protocol}//${urlObj.host}${imageUrl}`;
      }
      return imageUrl;
    }

    return null;
  } catch (e) {
    // Silently fail for image scraping to keep the list loading
    return null;
  }
}

export async function getAllNews(): Promise<NewsItem[]> {
  const [ann, annNews, reddit, redditNews, manga] = await Promise.allSettled([
    fetchANNFeed(),
    fetchANNNewsFeed(),
    fetchRedditAnimeFeed(),
    fetchRedditNewsFlairFeed(),
    fetchRedditMangaFeed(),
  ]);

  const allItems = [
    ...(ann.status === "fulfilled" ? ann.value : []),
    ...(annNews.status === "fulfilled" ? annNews.value : []),
    ...(reddit.status === "fulfilled" ? reddit.value : []),
    ...(redditNews.status === "fulfilled" ? redditNews.value : []),
    ...(manga.status === "fulfilled" ? manga.value : []),
  ];

  const seen = new Set<string>();
  const uniqueItems = allItems.filter((item) => {
    const key = item.title.toLowerCase().substring(0, 40);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  const enrichedItems = await Promise.all(
    uniqueItems.slice(0, 15).map(async (item) => {
      if (!item.image) {
        const scraped = await scrapeImageFromLink(item.link);
        return { ...item, image: scraped };
      }

      return item;
    })
  );

  const finalItems = [...enrichedItems, ...uniqueItems.slice(15)];

  return finalItems.sort((a, b) => {
    const dateA = a.pubDate ? new Date(a.pubDate).getTime() : 0;
    const dateB = b.pubDate ? new Date(b.pubDate).getTime() : 0;
    return dateB - dateA;
  });
}

export function timeAgo(dateStr: string): string {
  try {
    const date = new Date(dateStr);
    const now = Date.now();
    const diff = now - date.getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 60) return `${minutes}m ago`;

    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;

    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  } catch {
    return "";
  }
}
