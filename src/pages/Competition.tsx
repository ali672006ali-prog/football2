import { useState, useEffect } from "react";
import { API } from "../services/api";
import CompetitionTabs from "../components/competition/CompetitionTabs";
import StandingsTable from "../components/competition/StandingsTable";
import TopScorers from "../components/worldcup/TopScorers";
import MatchCard from "../components/match/MatchCard";
import MatchDetail from "../components/match/MatchDetail";
import ErrorState from "../components/ui/ErrorState";
import SkeletonCard, { SkeletonTable } from "../components/ui/SkeletonCard";
import { COMPETITION_MAP } from "../utils/helpers";
import { RefreshCw, Trophy, Calendar, Info } from "lucide-react";

const LEAGUES = [
  { code: "PL", name: "Premier League", flag: "🇬🇧" },
  { code: "PD", name: "La Liga", flag: "🇪🇸" },
  { code: "SA", name: "Serie A", flag: "🇮🇹" },
  { code: "BL1", name: "Bundesliga", flag: "🇩🇪" },
  { code: "FL1", name: "Ligue 1", flag: "🇫🇷" },
  { code: "CL", name: "Champions League", flag: "🇪🇺" }
];

export default function Competition() {
  const [activeLeague, setActiveLeague] = useState("PL");
  const [subTab, setSubTab] = useState<"matches" | "standings" | "scorers">("standings");

  // State for data
  const [matches, setMatches] = useState<any[]>([]);
  const [standings, setStandings] = useState<any[]>([]);
  const [scorers, setScorers] = useState<any[]>([]);

  // State for load status
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Selected match for overlay detail
  const [selectedMatch, setSelectedMatch] = useState<any | null>(null);

  const loadData = async (leagueCode: string, tab: "matches" | "standings" | "scorers") => {
    setLoading(true);
    setError(null);
    try {
      if (tab === "matches") {
        const data = await API.getMatchesByComp(leagueCode);
        setMatches(data.matches || []);
      } else if (tab === "standings") {
        const data = await API.getStandings(leagueCode);
        setStandings(data.standings || []);
      } else if (tab === "scorers") {
        const data = await API.getTopScorers(leagueCode);
        setScorers(data.scorers || []);
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || `Failed to retrieve ${tab} data.`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData(activeLeague, subTab);
  }, [activeLeague, subTab]);

  const activeLeagueDetails = COMPETITION_MAP[activeLeague] || { name: "League", color: "#1a2533" };

  return (
    <div className="page-container competition-page" id="competition-page">
      {/* Competitions Selector Row */}
      <div className="league-selector-row">
        {LEAGUES.map((lg) => (
          <button
            key={lg.code}
            className={`league-btn ${activeLeague === lg.code ? "active" : ""}`}
            onClick={() => setActiveLeague(lg.code)}
            style={{
              borderColor: activeLeague === lg.code ? activeLeagueDetails.color : "transparent"
            }}
          >
            <span className="league-btn-flag">{lg.flag}</span>
            <span className="league-btn-name">{lg.name}</span>
          </button>
        ))}
      </div>

      {/* Dynamic League Banner */}
      <div
        className="league-hero-banner"
        style={{
          background: `linear-gradient(135deg, ${activeLeagueDetails.color}cc 0%, #101827 100%)`,
          borderLeft: `5px solid ${activeLeagueDetails.color}`
        }}
      >
        <div className="league-hero-content">
          <div className="league-icon-container">
            <Trophy size={32} style={{ color: activeLeagueDetails.color }} />
          </div>
          <div className="league-meta">
            <h1 className="league-title">{activeLeagueDetails.name}</h1>
            <p className="league-subtitle">Real-time statistics, fixtures, and goalscorer ranks.</p>
          </div>
        </div>

        <button className="refresh-action-btn" onClick={() => loadData(activeLeague, subTab)}>
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Inner Subtabs: Matches / Standings / Scorers */}
      <CompetitionTabs activeTab={subTab} onChange={setSubTab} />

      {/* Main Content Pane */}
      <div className="tab-content-pane">
        {error ? (
          <ErrorState message={error} onRetry={() => loadData(activeLeague, subTab)} />
        ) : subTab === "matches" ? (
          loading ? (
            <div className="cards-grid">
              {Array.from({ length: 6 }).map((_, idx) => (
                <SkeletonCard key={idx} />
              ))}
            </div>
          ) : matches.length === 0 ? (
            <div className="no-data-card">
              <Calendar size={32} className="text-muted mb-2" />
              <p className="no-data-text">No fixtures or matches currently scheduled.</p>
            </div>
          ) : (
            <div className="cards-grid" id="comp-matches-grid">
              {matches.slice(0, 40).map((match) => (
                <MatchCard key={match.id} match={match} onSelect={setSelectedMatch} />
              ))}
            </div>
          )
        ) : subTab === "standings" ? (
          <StandingsTable standings={standings} loading={loading} error={!!error} />
        ) : (
          <TopScorers scorers={scorers} loading={loading} error={!!error} />
        )}
      </div>

      {/* Detail Overlay */}
      {selectedMatch && (
        <MatchDetail match={selectedMatch} onClose={() => setSelectedMatch(null)} />
      )}
    </div>
  );
}
