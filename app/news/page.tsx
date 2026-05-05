import Link from "next/link";
import { getAllNews } from "@/lib/news";
import NewsCard from "@/components/NewsCard";
import { Newspaper, Radio, Users, Sparkles } from "lucide-react";
import { Metadata } from "next";
import AdPlacement from "@/components/AdPlacement";

export const metadata: Metadata = {
  title: "Anime News Feed",
  description: "One stream for industry announcements, headlines, and community momentum. Stay updated with the latest from ANN and Reddit.",
  keywords: ["anime news", "ANN headlines", "reddit anime", "manga news", "industry updates"],
  openGraph: {
    title: "Anime News Feed | AnimeNews",
    description: "One stream for industry announcements, headlines, and community momentum.",
    type: "website",
  },
};

export const dynamic = "force-dynamic";

export default async function NewsPage({
  searchParams,
}: {
  searchParams: { category?: string; source?: string };
}) {
  const news = await getAllNews();
  const category = searchParams.category || "";
  const source = searchParams.source || "";
  const filteredNews = news.filter((item) => {
    if (category && item.category !== category) return false;
    if (source && item.source !== source) return false;
    return true;
  });
  const topStory = filteredNews[0];
  const categoryCounts = Array.from(new Set(news.map((item) => item.category))).map((value) => ({
    value,
    count: news.filter((item) => item.category === value).length,
  }));
  const sourceCounts = Array.from(new Set(news.map((item) => item.source))).map((value) => ({
    value,
    count: news.filter((item) => item.source === value).length,
  }));

  return (
    <div className="container mx-auto px-6 py-12 md:px-12">
      <div className="mb-12 grid gap-6 xl:grid-cols-[minmax(0,1.25fr)_360px]">
        <div className="glass-card rounded-3xl p-8">
          <h1 className="flex items-center gap-3 text-4xl font-black tracking-tighter">
            <Newspaper className="h-8 w-8 text-primary" />
            Anime News Feed
          </h1>
          <p className="mt-3 max-w-2xl text-lg leading-8 text-gray-400">
            One stream for industry announcements, ANN headlines, and community momentum so visitors can move from discovery into context quickly.
          </p>
        </div>

        <div className="glass-card rounded-3xl p-8">
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-2xl border border-white/5 bg-white/5 p-4">
              <p className="text-2xl font-black">{filteredNews.length}</p>
              <p className="mt-1 text-xs uppercase tracking-[0.18em] text-gray-400">Stories</p>
            </div>
            <div className="rounded-2xl border border-white/5 bg-white/5 p-4">
              <p className="text-2xl font-black">{categoryCounts.length}</p>
              <p className="mt-1 text-xs uppercase tracking-[0.18em] text-gray-400">Categories</p>
            </div>
            <div className="rounded-2xl border border-white/5 bg-white/5 p-4">
              <p className="text-2xl font-black">{sourceCounts.length}</p>
              <p className="mt-1 text-xs uppercase tracking-[0.18em] text-gray-400">Sources</p>
            </div>
            <div className="rounded-2xl border border-white/5 bg-white/5 p-4">
              <p className="text-2xl font-black">{news.filter((item) => item.category.includes("Community")).length}</p>
              <p className="mt-1 text-xs uppercase tracking-[0.18em] text-gray-400">Community</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-10 flex flex-wrap gap-3">
        <Link href="/news" className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-gray-300 transition-colors hover:border-primary/30 hover:text-white">
          All news
        </Link>
        {categoryCounts.map((entry) => (
          <Link
            key={entry.value}
            href={`/news?category=${encodeURIComponent(entry.value)}`}
            className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-gray-300 transition-colors hover:border-primary/30 hover:text-white"
          >
            {entry.value} ({entry.count})
          </Link>
        ))}
      </div>

      {topStory && (
        <section className="mb-12 grid gap-6 xl:grid-cols-[minmax(0,1.1fr)_340px]">
          <NewsCard item={topStory} featured />
          <div className="space-y-4">
            <div className="glass-card rounded-3xl p-6">
              <div className="mb-2 flex items-center gap-2 text-primary">
                <Radio className="h-5 w-5" />
                <span className="text-xs font-bold uppercase tracking-[0.18em]">Sources in rotation</span>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {sourceCounts.map((entry) => (
                  <Link
                    key={entry.value}
                    href={`/news?source=${encodeURIComponent(entry.value)}`}
                    className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs font-bold text-gray-300 transition-colors hover:border-primary/30 hover:text-white"
                  >
                    {entry.value} {entry.count}
                  </Link>
                ))}
              </div>
            </div>

            <div className="glass-card rounded-3xl p-6">
              <div className="mb-3 flex items-center gap-2 text-pink-400">
                <Users className="h-5 w-5" />
                <span className="text-xs font-bold uppercase tracking-[0.18em]">Reading modes</span>
              </div>
              <p className="text-sm leading-7 text-gray-400">
                Filter down to straight industry reporting, keep an eye on community chatter, or bounce between both to see how people are reacting in real time.
              </p>
            </div>
          </div>
        </section>
      )}

      <div className="mb-8 flex items-center gap-3">
        <Sparkles className="h-5 w-5 text-primary" />
        <h2 className="text-2xl font-bold tracking-tight">Latest stories</h2>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredNews.slice(topStory ? 1 : 0).map((item, index) => (
          <div key={item.id} className="contents">
            <NewsCard item={item} featured />
            {(index + 1) % 8 === 0 && (
              <div className="md:col-span-2 lg:col-span-3 xl:col-span-4">
                <AdPlacement zoneId="236566" format="banner" />
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredNews.length === 0 && (
        <div className="py-20 text-center text-gray-500">
          <Newspaper className="mx-auto mb-4 h-16 w-16 opacity-20" />
          <p>Failed to load news feeds. Please try again later.</p>
        </div>
      )}
    </div>
  );
}
