export function formatCompactNumber(value?: number | null) {
  if (!value) return "Unknown";

  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

export function formatCountdown(seconds?: number | null): string {
  if (seconds === null || seconds === undefined) return "Schedule TBA";
  if (seconds <= 0) return "Aired";

  const d = Math.floor(seconds / 86400);
  const h = Math.floor((seconds % 86400) / 3600);
  const m = Math.floor((seconds % 3600) / 60);

  if (d > 0) return `${d}d ${h}h`;
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}

export function stripHtmlTags(value?: string | null) {
  if (!value) return "";

  return value
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/<\/p>/gi, " ")
    .replace(/<[^>]+>/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function averageScore(items: Array<{ score?: number | null }>) {
  const scoredItems = items.filter((item) => typeof item.score === "number");
  if (scoredItems.length === 0) return null;

  const total = scoredItems.reduce((sum, item) => sum + (item.score || 0), 0);
  return (total / scoredItems.length).toFixed(1);
}

export function truncateText(value?: string | null, maxLength = 140) {
  if (!value) return "";
  if (value.length <= maxLength) return value;
  return `${value.slice(0, maxLength).trim()}...`;
}
