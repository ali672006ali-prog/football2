/**
 * Helper to format ISO date string to readable time (HH:MM)
 */
export function formatMatchTime(dateString: string): string {
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return "";
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false });
  } catch {
    return "";
  }
}

/**
 * Helper to format ISO date string to a readable date (e.g., "June 29, 2026")
 */
export function formatMatchDate(dateString: string): string {
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return "";
    return d.toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" });
  } catch {
    return "";
  }
}

/**
 * Check if a match is live based on its status
 */
export function isLiveStatus(status: string): boolean {
  return ["IN_PLAY", "PAUSED"].includes(status);
}

/**
 * Map competition codes to clean names and background colors or emojis
 */
export const COMPETITION_MAP: Record<string, { name: string; logoUrl?: string; color: string }> = {
  PL: { name: "Premier League", color: "#3d195b" },
  PD: { name: "La Liga", color: "#ee2527" },
  BL1: { name: "Bundesliga", color: "#d20515" },
  SA: { name: "Serie A", color: "#007a87" },
  FL1: { name: "Ligue 1", color: "#dae025" },
  CL: { name: "Champions League", color: "#0a1f44" },
  WC: { name: "World Cup", color: "#f59e0b" }
};

/**
 * Map country names to flags (using unicode emojis)
 */
export function getCountryFlag(countryName: string): string {
  const flags: Record<string, string> = {
    "England": "🇬🇧",
    "Spain": "🇪🇸",
    "Germany": "🇩🇪",
    "Italy": "🇮🇹",
    "France": "🇫🇷",
    "Europe": "🇪🇺",
    "World": "🌐",
    "USA": "🇺🇸",
    "Canada": "🇨🇦",
    "Mexico": "🇲🇽",
    "Argentina": "🇦🇷",
    "Brazil": "🇧🇷",
    "France Team": "🇫🇷",
    "Germany Team": "🇩🇪",
    "Portugal": "🇵🇹",
    "Belgium": "🇧🇪",
    "Croatia": "🇭🇷",
    "Netherlands": "🇳🇱",
    "Uruguay": "🇺🇾",
    "Japan": "🇯🇵",
    "Morocco": "🇲🇦",
    "Switzerland": "🇨🇭",
    "Spain Team": "🇪🇸"
  };

  return flags[countryName] || "🏳️";
}
