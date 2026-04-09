"use client";

import { useState } from "react";
import { RefreshCw } from "lucide-react";

export default function AnimePlayer({ animeId, initialEpisodes }: { animeId: string, initialEpisodes: any }) {
  const [currentEpisode, setCurrentEpisode] = useState(1);
  const [currentServer, setCurrentServer] = useState("AutoEmbed-HD");
  const [adOpened, setAdOpened] = useState(false);

  // MONETIZATION: Ad triggers on first interaction
  const triggerAd = () => {
    // Disabled dummy popup
  };

  const handleServerChange = (name: string) => {
    triggerAd();
    setCurrentServer(name);
  };

  const handleEpisodeChange = (id: number) => {
    triggerAd();
    setCurrentEpisode(id);
  };

  // UPDATED & STABLE 2026 SERVERS (MAL Compatible)
  const servers = [
    { name: "AutoEmbed-HD", url: (id: string, ep: number) => `https://autoembed.co/anime/mal/${id}/${ep}` },
    { name: "Ryuk-Node", url: (id: string, ep: number) => `https://player.ryuk.ws/?id=${id}&ep=${ep}` },
    { name: "YugenAnime", url: (id: string, ep: number) => `https://yugenanime.tv/e/${id}/${ep}` }
  ];

  const activeServer = servers.find(s => s.name === currentServer) || servers[0];

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Player Section */}
      <div className="flex-1">
        <div className="aspect-video w-full rounded-2xl overflow-hidden bg-black border border-white/5 relative glass-card shadow-2xl">
          <iframe 
            src={activeServer.url(animeId, currentEpisode)} 
            className="w-full h-full border-0"
            allowFullScreen
            referrerPolicy="no-referrer"
          />
        </div>

        {/* Control Panel */}
        <div className="mt-8 glass-card rounded-2xl p-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="bg-primary/10 border border-primary/20 p-4 rounded-xl flex-1">
              <div className="flex items-center gap-2 mb-1 text-primary text-[10px] font-black uppercase tracking-widest">
                <RefreshCw className="w-3 h-3 animate-spin-slow" />
                Network Optimized
              </div>
              <p className="text-sm font-medium text-gray-300">Watching Episode <span className="text-primary font-black">{currentEpisode}</span></p>
            </div>
            
            <div className="flex flex-wrap gap-2 justify-end items-center">
                <span className="text-[10px] font-bold text-gray-600 uppercase tracking-widest mr-2">Select Server</span>
                {servers.map((s) => (
                  <button 
                    key={s.name}
                    onClick={() => handleServerChange(s.name)}
                    className={`px-4 py-2 rounded-lg text-[10px] font-bold transition-all ${currentServer === s.name ? 'bg-primary text-white shadow-xl shadow-primary/20 scale-105' : 'glass hover:bg-white/10 text-gray-400 border-white/5'}`}
                  >
                    {s.name}
                  </button>
                ))}
            </div>
          </div>
        </div>
      </div>

      {/* Episode List */}
      <div className="w-full lg:w-96">
        <div className="glass-card rounded-2xl p-6 h-[680px] flex flex-col border-white/5 relative bg-black/40">
           <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none rounded-2xl" />
           <div className="relative z-10">
             <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/10">
                <h3 className="font-black uppercase tracking-tighter text-xl text-white">Episodes</h3>
                <span className="text-[10px] bg-primary/20 px-2 py-1 rounded text-primary font-bold uppercase tracking-widest">MAL Sync</span>
             </div>
             
             <div className="overflow-y-auto pr-2 space-y-2 custom-scrollbar h-[550px]">
                {initialEpisodes.data?.map((ep: any, index: number) => {
                  const epNum = ep.mal_id || (index + 1);
                  return (
                    <button 
                      key={index}
                      onClick={() => handleEpisodeChange(epNum)}
                      className={`w-full text-left p-4 rounded-xl border transition-all text-xs flex items-center justify-between group ${currentEpisode === epNum ? 'bg-primary border-primary/40 text-white shadow-lg' : 'hover:bg-white/5 border-white/5 text-gray-400'}`}
                    >
                      <div className="flex items-center gap-4">
                        <span className={`text-sm font-black italic ${currentEpisode === epNum ? 'text-white' : 'text-gray-800'}`}>
                          {epNum < 10 ? `0${epNum}` : epNum}
                        </span>
                        <span className="font-bold line-clamp-1 truncate max-w-[180px]">
                          {ep.title || `Episode ${epNum}`}
                        </span>
                      </div>
                      {currentEpisode === epNum && <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />}
                    </button>
                  );
                })}
             </div>
           </div>
        </div>
      </div>
    </div>
  );
}
