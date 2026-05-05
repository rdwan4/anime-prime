"use client";

import { useEffect, useState } from "react";

export default function LiveCountdownText({ timeUntilAiring, episode }: { timeUntilAiring: number, episode: number }) {
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
    return <span>Live Now</span>;
  }

  const displayTime = d > 0 ? `${d}d ${h}h` : h > 0 ? `${h}h ${m}m` : `${m}m ${s}s`;

  return <span>Episode {episode} in {displayTime}</span>;
}
