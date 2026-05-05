"use client";

import { useEffect, useState } from "react";
import { Clock } from "lucide-react";

interface SmallCountdownProps {
  timeUntilAiring: number;
  episode: number;
}

export default function SmallCountdown({ timeUntilAiring, episode }: SmallCountdownProps) {
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
      <div className="flex items-center gap-1 rounded bg-green-500/10 px-1.5 py-0.5 font-bold text-green-400">
        <Clock className="h-3 w-3" />
        Live Now
      </div>
    );
  }

  const displayTime = d > 0 ? `${d}d ${h}h` : h > 0 ? `${h}h ${m}m` : `${m}m ${s}s`;

  return (
    <div className="flex items-center gap-1 rounded bg-green-500/10 px-1.5 py-0.5 font-bold text-green-400">
      <Clock className="h-3 w-3" />
      EP {episode} in {displayTime}
    </div>
  );
}
