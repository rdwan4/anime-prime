import Link from "next/link";
import { Star, Clock } from "lucide-react";
import SmallCountdown from "@/components/SmallCountdown";

interface AnimeCardProps {
  id: number;
  title: string;
  image: string;
  intro?: string;
  rating?: number | null;
  episodes?: number | null;
  type?: string;
  nextEpisode?: number | null;
  timeUntilAiring?: number | null;
}

export default function AnimeCard({ id, title, image, intro, rating, episodes, type, nextEpisode, timeUntilAiring }: AnimeCardProps) {
  const isAiringNow = timeUntilAiring !== undefined && timeUntilAiring !== null;

  return (
    <Link href={`/anime/${id}`} className="group relative block aspect-[2/3] overflow-hidden rounded-xl glass-card card-hover-lift">
      <img
        src={image} 
        alt={title}
        className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/45 to-transparent" />
      
      {rating && (
        <div className="absolute top-2 right-2 flex items-center gap-1 bg-black/60 backdrop-blur-md px-2 py-1 rounded-md text-[10px] font-bold text-yellow-50">
          <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
          {rating}
        </div>
      )}

      {type && (
        <div className="absolute top-2 left-2 bg-primary/80 backdrop-blur-md px-2 py-1 rounded-md text-[10px] font-bold">
          {type}
        </div>
      )}

      <div className="absolute bottom-0 w-full p-2 sm:p-3">
        <div className="rounded-xl bg-black/40 p-2.5 backdrop-blur-md">
          <h3 className="line-clamp-2 text-xs sm:text-sm font-bold leading-snug transition-colors group-hover:text-primary">{title}</h3>
        {intro && (
          <p className="mt-1.5 hidden text-[10px] leading-relaxed text-gray-300/90 sm:line-clamp-2 xl:line-clamp-3">
            {intro}
          </p>
        )}
        <div className="mt-2 flex flex-wrap items-center gap-1.5 text-[9px] sm:text-[10px] text-gray-300">
          {episodes ? <span>{episodes} eps</span> : <span>TBA eps</span>}
          {isAiringNow && nextEpisode ? (
            <SmallCountdown timeUntilAiring={timeUntilAiring} episode={nextEpisode} />
          ) : (
            <div className="flex items-center gap-1 font-bold text-primary uppercase tracking-wider">
              More Info
            </div>
          )}
        </div>
        </div>
      </div>
    </Link>
  );
}
