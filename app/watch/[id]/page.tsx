import { getAnimeDetails, getAnimeEpisodes } from "@/lib/jikan";
import { Play, Share2, Heart, Download, TrendingUp, Info } from "lucide-react";
import Link from "next/link";
import { Metadata } from "next";
import AnimePlayer from "@/components/AnimePlayer";

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const anime = await getAnimeDetails(params.id);
  return {
    title: `Watch ${anime.data.title} Online FREE | ANIMEPRIME`,
    description: `Stream ${anime.data.title} in HD with Sub & Dub. ${anime.data.synopsis?.substring(0, 150)}...`,
  };
}

export default async function WatchPage({ params }: { params: { id: string } }) {
  const anime = await getAnimeDetails(params.id);
  const episodes = await getAnimeEpisodes(params.id);
  const data = anime.data;

  return (
    <div className="container mx-auto px-6 md:px-12 py-8">
      {/* Main Interactive Player & Episode List */}
      <AnimePlayer animeId={params.id} initialEpisodes={episodes} />

      {/* About Section */}
      <div className="mt-12 flex flex-col md:flex-row gap-8 items-start lg:w-2/3">
        <img 
          src={data.images.jpg.large_image_url} 
          alt={data.title}
          className="w-48 rounded-2xl shadow-2xl"
        />
        <div>
          <h1 className="text-4xl font-bold mb-4 tracking-tight">{data.title}</h1>
          <div className="flex flex-wrap gap-2 mb-6">
            {data.genres.map((g: any) => (
              <span key={g.name} className="px-3 py-1 glass rounded-full text-[10px] font-bold uppercase tracking-wider text-primary">
                {g.name}
              </span>
            ))}
          </div>
          <p className="text-gray-400 leading-relaxed text-sm">
            {data.synopsis}
          </p>
        </div>
      </div>
    </div>
  );
}
