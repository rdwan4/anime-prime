"use client";

import { NewsItem, timeAgo } from "@/lib/news";
import { ExternalLink, Clock } from "lucide-react";
import { useState } from "react";

const SOURCE_COLORS: Record<string, string> = {
  "Anime News Network": "bg-red-500/20 text-red-400 border-red-500/30",
  "r/anime": "bg-orange-500/20 text-orange-400 border-orange-500/30",
  "r/anime News": "bg-orange-500/20 text-orange-400 border-orange-500/30",
  "Industry News": "bg-blue-500/20 text-blue-400 border-blue-500/30",
};

const CATEGORY_GRADIENTS: Record<string, string> = {
  News: "from-red-900/40 to-red-950/60",
  "Industry News": "from-blue-900/40 to-blue-950/60",
  Community: "from-orange-900/40 to-orange-950/60",
  "Community News": "from-purple-900/40 to-purple-950/60",
};

interface NewsCardProps {
  item: NewsItem;
  featured?: boolean;
}

function NewsFallback({ gradient, compact = false }: { gradient: string; compact?: boolean }) {
  return (
    <div
      className={`flex items-center justify-center bg-gradient-to-br ${gradient} ${
        compact ? "h-16 w-16 rounded-lg flex-shrink-0" : "h-28"
      }`}
    >
      <span className={`${compact ? "text-[10px]" : "text-sm"} font-bold uppercase tracking-[0.3em] opacity-40`}>News</span>
    </div>
  );
}

export default function NewsCard({ item, featured = false }: NewsCardProps) {
  const [imgError, setImgError] = useState(false);
  const badgeClass = SOURCE_COLORS[item.source] || "bg-primary/20 text-primary border-primary/30";
  const gradient = CATEGORY_GRADIENTS[item.category] || "from-gray-900/40 to-gray-950/60";

  if (featured) {
    return (
      <a
        href={item.link}
        target="_blank"
        rel="noopener noreferrer"
        className="glass-card group relative block overflow-hidden rounded-2xl border border-white/5 transition-all duration-300 hover:-translate-y-1 hover:border-primary/30"
      >
        {item.image && !imgError ? (
          <div className="relative h-52 overflow-hidden">
            <img
              src={item.image}
              alt={item.title}
              onError={() => setImgError(true)}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
          </div>
        ) : (
          <NewsFallback gradient={gradient} />
        )}
        <div className="p-5">
          <div className="mb-3 flex items-center gap-2">
            <span className={`rounded-full border px-2 py-0.5 text-[9px] font-black uppercase tracking-widest ${badgeClass}`}>
              {item.source}
            </span>
            <span className="flex items-center gap-1 text-[10px] text-gray-600">
              <Clock className="h-3 w-3" />
              {timeAgo(item.pubDate)}
            </span>
          </div>
          <h3 className="mb-2 line-clamp-2 text-sm font-bold leading-snug transition-colors group-hover:text-primary">{item.title}</h3>
          <p className="line-clamp-2 text-[11px] leading-relaxed text-gray-500">{item.description}</p>
        </div>
      </a>
    );
  }

  return (
    <a
      href={item.link}
      target="_blank"
      rel="noopener noreferrer"
      className="glass-card group flex items-start gap-4 rounded-xl border border-white/5 p-4 transition-all duration-300 hover:border-primary/20 hover:bg-white/5"
    >
      {item.image && !imgError ? (
        <img
          src={item.image}
          alt={item.title}
          onError={() => setImgError(true)}
          className="h-16 w-16 flex-shrink-0 rounded-lg object-cover transition-transform group-hover:scale-105"
        />
      ) : (
        <NewsFallback gradient={gradient} compact />
      )}
      <div className="min-w-0 flex-1">
        <div className="mb-1.5 flex items-center gap-2">
          <span className={`rounded border px-1.5 py-0.5 text-[8px] font-black uppercase tracking-widest ${badgeClass}`}>
            {item.source}
          </span>
          <span className="text-[10px] text-gray-600">{timeAgo(item.pubDate)}</span>
        </div>
        <h3 className="line-clamp-2 text-xs font-bold leading-snug transition-colors group-hover:text-primary">{item.title}</h3>
      </div>
      <ExternalLink className="mt-1 h-4 w-4 flex-shrink-0 text-gray-700 transition-colors group-hover:text-primary" />
    </a>
  );
}
