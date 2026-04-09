"use client";

import { useState } from "react";
import { Play, Share2, Heart, Download, Info } from "lucide-react";

export default function AnimePlayer({ animeId, initialEpisodes }: { animeId: string, initialEpisodes: any }) {
  const [currentEpisode, setCurrentEpisode] = useState(1);
  const [currentServer, setCurrentServer] = useState("Server 1");
  const [adOpened, setAdOpened] = useState(false);

  const triggerAd = () => {
    if (!adOpened) {
      // Replace this URL with your Pop-Under ad link from Adsterra/PopAds
      window.open("https://your-ad-network-link.com", "_blank");
      setAdOpened(true);
    }
  };

  const handleServerChange = (name: string) => {
    triggerAd();
    setCurrentServer(name);
  };

  const handleEpisodeChange = (id: number) => {
    triggerAd();
    setCurrentEpisode(id);
  };

  const servers = [
    { name: "Server 1", url: (id: string, ep: number) => `https://vidsrc.xyz/embed/anime/${id}/${ep}` },
    { name: "Server 2", url: (id: string, ep: number) => `https://vidsrc.me/embed/anime/${id}/${ep}` },
    { name: "Server 3", url: (id: string, ep: number) => `https://www.animesrc.xyz/embed/anime/${id}/${ep}` },
    { name: "Server 4", url: (id: string, ep: number) => `https://autoembed.to/anime/mal/${id}/${ep}` },
  ];

  const activeServer = servers.find(s => s.name === currentServer) || servers[0];

  const openDirect = () => {
    window.open(activeServer.url(animeId, currentEpisode), "_blank");
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Left Column: Player */}
      <div className="flex-1">
        <div className="aspect-video w-full rounded-2xl overflow-hidden bg-black border border-white/5 relative glass shadow-2xl">
          <iframe 
            src={activeServer.url(animeId, currentEpisode)} 
            className="w-full h-full border-0"
            allowFullScreen
            referrerPolicy="no-referrer"
          />
        </div>

        {/* Server Selector */}
        <div className="mt-8 glass-card rounded-2xl p-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="bg-primary/10 border border-primary/20 p-4 rounded-xl flex-1 text-sm text-primary-foreground/80">
              <p className="font-bold">Watching <span className="text-primary font-black">Episode {currentEpisode}</span></p>
              <p className="mt-1 opacity-70">If one server is down, try another or use Direct Stream.</p>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {servers.map((s) => (
                <button 
                  key={s.name}
                  onClick={() => handleServerChange(s.name)}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${currentServer === s.name ? 'bg-primary text-white shadow-lg' : 'glass hover:bg-white/10 text-gray-400'}`}
                >
                  {s.name}
                </button>
              ))}
              <button 
                onClick={() => { triggerAd(); openDirect(); }}
                className="px-4 py-2 rounded-lg text-xs font-bold bg-white/5 text-yellow-500 border border-yellow-500/20 hover:bg-yellow-500 hover:text-black transition-all"
              >
                Direct Stream ↗
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column: Episodes */}
      <div className="w-full lg:w-96">
        <div className="glass-card rounded-2xl p-6 h-[600px] flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold">Episodes</h3>
            <span className="text-xs text-gray-500">{initialEpisodes.data?.length || 0} Total</span>
          </div>
          
          <div className="flex-1 overflow-y-auto pr-2 space-y-2 custom-scrollbar">
            {initialEpisodes.data?.map((ep: any) => (
              <button 
                key={ep.mal_id}
                onClick={() => handleEpisodeChange(ep.mal_id)}
                className={`w-full text-left p-3 rounded-xl border transition-all text-sm flex items-center justify-between ${currentEpisode === ep.mal_id ? 'bg-primary/20 border-primary/40 text-primary' : 'hover:bg-white/5 border-transparent text-gray-500'}`}
              >
                <div className="flex items-center gap-3">
                  <span className="font-bold opacity-50">{ep.mal_id}</span>
                  <span className="font-medium line-clamp-1">{ep.title || `Episode ${ep.mal_id}`}</span>
                </div>
                {currentEpisode === ep.mal_id && <span className="bg-primary px-2 py-0.5 rounded text-[10px] text-white">Playing</span>}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
