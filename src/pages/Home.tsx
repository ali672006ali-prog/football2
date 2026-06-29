import { useState, useEffect } from "react";
import { useMatches } from "../hooks/useMatches";
import MatchCard from "../components/match/MatchCard";
import MatchDetail from "../components/match/MatchDetail";
import SearchBar from "../components/ui/SearchBar";
import SkeletonCard from "../components/ui/SkeletonCard";
import ErrorState from "../components/ui/ErrorState";
import { Activity, RefreshCw, Filter, Calendar } from "lucide-react";
import { COMPETITION_MAP } from "../utils/helpers";

export default function Home() {
  const { matches, loading, error, refresh } = useMatches("today");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCompCode, setSelectedCompCode] = useState<string>("ALL");
  const [showOnlyLive, setShowOnlyLive] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState<any | null>(null);

  // Filter logic
  const filteredMatches = matches.filter((match) => {
    // 1. Search Query filter (by home team, away team, competition, status)
    const homeName = (match.homeTeam?.name || "").toLowerCase();
    const awayName = (match.awayTeam?.name || "").toLowerCase();
    const compName = (match.competition?.name || "").toLowerCase();
    const status = (match.status || "").toLowerCase();
    const query = searchQuery.toLowerCase();

    const matchesQuery =
      homeName.includes(query) ||
      awayName.includes(query) ||
      compName.includes(query) ||
      status.includes(query);

    // 2. Competition filter
    const matchesComp = selectedCompCode === "ALL" || match.competition?.code === selectedCompCode;

    // 3. Live filter
    const matchesLive = !showOnlyLive || ["IN_PLAY", "PAUSED"].includes(match.status);

    return matchesQuery && matchesComp && matchesLive;
  });

  // Get active competition codes in today's matches list to build dynamic filters
  const availableCompCodes = Array.from(
    new Set(matches.map((m) => m.competition?.code).filter(Boolean))
  ) as string[];

  return (
    <div className="page-container home-page" id="home-page">
      {/* Hero Banner / Headline */}
      <div className="home-hero">
        <div className="hero-content">
          <span className="hero-tag">
            <Activity className="text-live animate-pulse" size={14} /> Real-Time Football Tracker
          </span>
          <h1 className="hero-title">Live Scores & Match Schedules</h1>
          <p className="hero-subtitle">
            Track live action, match-day schedules, and in-depth analytics across Europe's top divisions.
          </p>
        </div>
      </div>

      {/* Control Bar: Search & Refreshes */}
      <div className="control-bar-grid">
        <SearchBar
          query={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search team, league, or status (e.g., 'Chelsea', 'Premier', 'live')..."
        />

        <div className="control-actions">
          {/* Live Only Filter */}
          <button
            className={`live-toggle-btn ${showOnlyLive ? "active" : ""}`}
            onClick={() => setShowOnlyLive(!showOnlyLive)}
            id="live-toggle-btn"
          >
            <span className={`live-indicator-dot ${showOnlyLive ? "live" : ""}`}></span>
            <span>Live Only</span>
          </button>

          {/* Refresh Action */}
          <button className="refresh-action-btn" onClick={refresh} title="Manual Refresh">
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Competition Filter Pills */}
      <div className="comp-pills-scroll">
        <div className="comp-pills-wrapper">
          <button
            className={`comp-pill-btn ${selectedCompCode === "ALL" ? "active" : ""}`}
            onClick={() => setSelectedCompCode("ALL")}
          >
            All Leagues
          </button>
          {availableCompCodes.map((code) => {
            const label = COMPETITION_MAP[code]?.name || code;
            return (
              <button
                key={code}
                className={`comp-pill-btn ${selectedCompCode === code ? "active" : ""}`}
                onClick={() => setSelectedCompCode(code)}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Content Section */}
      {loading && filteredMatches.length === 0 ? (
        <div className="cards-grid" id="matches-loading">
          {Array.from({ length: 6 }).map((_, idx) => (
            <SkeletonCard key={idx} />
          ))}
        </div>
      ) : error ? (
        <ErrorState message={error} onRetry={refresh} />
      ) : filteredMatches.length === 0 ? (
        <div className="no-data-card" id="no-matches-found">
          <Calendar size={32} className="text-muted mb-2" />
          <p className="no-data-text">No matches found matching your filters.</p>
          <p className="no-data-subtext">Try clearing search or picking another league filter.</p>
        </div>
      ) : (
        <div className="cards-grid" id="matches-grid">
          {filteredMatches.map((match) => (
            <MatchCard key={match.id} match={match} onSelect={setSelectedMatch} />
          ))}
        </div>
      )}

      {/* Dynamic Overlay Detail modal */}
      {selectedMatch && (
        <MatchDetail match={selectedMatch} onClose={() => setSelectedMatch(null)} />
      )}
    </div>
  );
}
