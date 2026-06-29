import { useState } from "react";
import { useMatches } from "../hooks/useMatches";
import MatchCard from "../components/match/MatchCard";
import MatchDetail from "../components/match/MatchDetail";
import SkeletonCard from "../components/ui/SkeletonCard";
import ErrorState from "../components/ui/ErrorState";
import SearchBar from "../components/ui/SearchBar";
import { Activity, RefreshCw } from "lucide-react";

export default function Live() {
  const { matches, loading, error, refresh } = useMatches("live");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMatch, setSelectedMatch] = useState<any | null>(null);

  // Filter local search results
  const filteredMatches = matches.filter((match) => {
    const home = (match.homeTeam?.name || "").toLowerCase();
    const away = (match.awayTeam?.name || "").toLowerCase();
    const comp = (match.competition?.name || "").toLowerCase();
    const query = searchQuery.toLowerCase();

    return home.includes(query) || away.includes(query) || comp.includes(query);
  });

  return (
    <div className="page-container live-page" id="live-page">
      <div className="page-header-row">
        <div className="page-title-section">
          <div className="flex items-center gap-2">
            <Activity className="text-live animate-pulse" size={24} />
            <h1 className="page-title">Live Scores</h1>
          </div>
          <p className="page-subtitle">Real-time action on the pitch</p>
        </div>

        <button className="refresh-action-btn" onClick={refresh} title="Manual Refresh">
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          <span>Refresh</span>
        </button>
      </div>

      <SearchBar
        query={searchQuery}
        onChange={setSearchQuery}
        placeholder="Filter current live games..."
      />

      {loading && filteredMatches.length === 0 ? (
        <div className="cards-grid" id="live-loading">
          {Array.from({ length: 3 }).map((_, idx) => (
            <SkeletonCard key={idx} />
          ))}
        </div>
      ) : error ? (
        <ErrorState message={error} onRetry={refresh} />
      ) : filteredMatches.length === 0 ? (
        <div className="no-data-card" id="no-live-games">
          <div className="live-indicator-dot"></div>
          <p className="no-data-text font-bold">No live matches in play right now.</p>
          <p className="no-data-subtext">Check the main Matches dashboard for today's upcoming schedules.</p>
        </div>
      ) : (
        <div className="cards-grid" id="live-grid">
          {filteredMatches.map((match) => (
            <MatchCard key={match.id} match={match} onSelect={setSelectedMatch} />
          ))}
        </div>
      )}

      {selectedMatch && (
        <MatchDetail match={selectedMatch} onClose={() => setSelectedMatch(null)} />
      )}
    </div>
  );
}
