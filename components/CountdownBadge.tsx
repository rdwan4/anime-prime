"use client";

import { useEffect, useState } from "react";
import { Clock } from "lucide-react";

interface CountdownBadgeProps {
  timeUntilAiring: number;
  episode: number;
}

export default function CountdownBadge({ timeUntilAiring, episode }: CountdownBadgeProps) {
  const [timeLeft, setTimeLeft] = useState(timeUntilAiring);

  useEffect(() => {
    if (timeLeft <= 0) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft]);

  const d = Math.floor(timeLeft / 86400);
  const h = Math.floor((timeLeft % 86400) / 3600);
  const m = Math.floor((timeLeft % 3600) / 60);
  const s = timeLeft % 60;

  if (timeLeft <= 0) {
    return (
      <div className="absolute bottom-0 left-0 right-0 bg-green-500/90 px-2 py-1.5 text-center backdrop-blur-sm">
        <span className="text-[9px] font-black uppercase tracking-widest text-white">Live Now</span>
      </div>
    );
  }

  const displayTime = d > 0 ? `${d}d ${h}h` : h > 0 ? `${h}h ${m}m` : `${m}m ${s}s`;

  return (
    <div className="absolute bottom-0 left-0 right-0 bg-black/80 px-2 py-1.5 backdrop-blur-sm">
      <div className="flex items-center justify-center gap-1">
        <Clock className="h-2.5 w-2.5 text-primary" />
        <span className="text-[9px] font-black uppercase tracking-wide text-primary">
          EP {episode} | {displayTime}
        </span>
      </div>
    </div>
  );
}
