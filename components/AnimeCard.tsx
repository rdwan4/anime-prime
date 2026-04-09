import Link from "next/link";
import { Star, Play } from "lucide-react";

interface AnimeCardProps {
  id: number;
  title: string;
  image: string;
  rating: number;
  episodes: number;
  type: string;
}

export default function AnimeCard({ id, title, image, rating, episodes, type }: AnimeCardProps) {
  return (
    <Link href={`/watch/${id}`} className="group relative block aspect-[2/3] rounded-xl overflow-hidden glass-card">
      <img 
        src={image} 
        alt={title}
        className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
      
      <div className="absolute top-2 right-2 flex items-center gap-1 bg-black/60 backdrop-blur-md px-2 py-1 rounded-md text-[10px] font-bold text-yellow-50">
        <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
        {rating || "N/A"}
      </div>

      <div className="absolute top-2 left-2 bg-primary/80 backdrop-blur-md px-2 py-1 rounded-md text-[10px] font-bold">
        {type}
      </div>

      <div className="absolute bottom-0 p-4 w-full">
        <h3 className="font-bold text-sm line-clamp-1 group-hover:text-primary transition-colors">{title}</h3>
        <div className="flex items-center gap-2 mt-1 text-[10px] text-gray-400">
          <span>{episodes || "?"} Episodes</span>
          <span className="w-1 h-1 bg-gray-600 rounded-full" />
          <div className="flex items-center gap-1 text-primary">
            <Play className="w-2 h-2 fill-current" />
            Watch Now
          </div>
        </div>
      </div>
    </Link>
  );
}
