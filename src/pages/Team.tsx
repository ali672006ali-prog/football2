import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { API } from "../services/api";
import MatchCard from "../components/match/MatchCard";
import MatchDetail from "../components/match/MatchDetail";
import ErrorState from "../components/ui/ErrorState";
import SkeletonCard from "../components/ui/SkeletonCard";
import { Calendar, CheckCircle, Flame, ArrowLeft, RefreshCw, Shield } from "lucide-react";

export default function Team() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [matches, setMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [activeSubTab, setActiveSubTab] = useState<"upcoming" | "finished" | "live">("upcoming");
  const [selectedMatch, setSelectedMatch] = useState<any | null>(null);

  const loadTeamMatches = async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const data = await API.getTeamMatches(id);
      setMatches(data.matches || []);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to load team matches.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTeamMatches();
  }, [id]);

  // Find team details (crest and name) from any match in play
  let teamName = "Team Matches";
  let teamCrest = "";
  let teamArea = "";

  if (matches.length > 0) {
    const targetId = Number(id);
    const sampleMatch = matches.find((m) => m.homeTeam?.id === targetId || m.awayTeam?.id === targetId);
    if (sampleMatch) {
      const isHome = sampleMatch.homeTeam?.id === targetId;
      const teamObj = isHome ? sampleMatch.homeTeam : sampleMatch.awayTeam;
      teamName = teamObj?.name || teamName;
      teamCrest = teamObj?.crest || teamCrest;
      teamArea = sampleMatch.area?.name || "";
    }
  }

  // Filter matches by status groups
  const liveMatches = matches.filter((m) => ["IN_PLAY", "PAUSED"].includes(m.status));
  const finishedMatches = matches.filter((m) => m.status === "FINISHED");
  const upcomingMatches = matches.filter((m) => ["SCHEDULED", "TIMED"].includes(m.status));

  // Determine which matches list to render based on subtab
  const currentMatchesList =
    activeSubTab === "live" ? liveMatches : activeSubTab === "finished" ? finishedMatches : upcomingMatches;

  return (
    <div className="page-container team-page" id="team-page">
      {/* Back button */}
      <button className="back-nav-btn" onClick={() => navigate(-1)}>
        <ArrowLeft size={16} />
        <span>Back</span>
      </button>

      {/* Team Header */}
      <div className="team-profile-banner">
        <div className="team-profile-crest-wrapper">
          {teamCrest ? (
            <img
              src={teamCrest}
              alt={teamName}
              className="team-profile-crest"
              referrerPolicy="no-referrer"
              onError={(e) => {
                (e.target as HTMLImageElement).src = `https://placehold.co/100x100/1a2533/f0f4f8?text=${encodeURIComponent(
                  teamName.charAt(0)
                )}`;
              }}
            />
          ) : (
            <div className="team-profile-crest-placeholder">
              <Shield size={48} className="text-muted" />
            </div>
          )}
        </div>

        <div className="team-profile-meta">
          <h1 className="team-profile-name">{teamName}</h1>
          {teamArea && <span className="team-profile-area">{teamArea}</span>}
          <span className="team-profile-indicator">National Squad / Professional Club</span>
        </div>

        <button className="refresh-action-btn" onClick={loadTeamMatches} title="Refresh Matches">
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
        </button>
      </div>

      {/* Matches Subtabs: Live, Upcoming, Finished */}
      <div className="team-matches-tabs" id="team-matches-tabs">
        <button
          className={`team-tab-btn ${activeSubTab === "live" ? "active" : ""}`}
          onClick={() => setActiveSubTab("live")}
        >
          <Flame size={14} className={liveMatches.length > 0 ? "text-live animate-pulse" : ""} />
          <span>Live ({liveMatches.length})</span>
        </button>

        <button
          className={`team-tab-btn ${activeSubTab === "upcoming" ? "active" : ""}`}
          onClick={() => setActiveSubTab("upcoming")}
        >
          <Calendar size={14} />
          <span>Upcoming ({upcomingMatches.length})</span>
        </button>

        <button
          className={`team-tab-btn ${activeSubTab === "finished" ? "active" : ""}`}
          onClick={() => setActiveSubTab("finished")}
        >
          <CheckCircle size={14} />
          <span>Finished ({finishedMatches.length})</span>
        </button>
      </div>

      {/* Matches Grid / Loading / Error states */}
      <div className="team-matches-content">
        {loading && currentMatchesList.length === 0 ? (
          <div className="cards-grid">
            {Array.from({ length: 3 }).map((_, idx) => (
              <SkeletonCard key={idx} />
            ))}
          </div>
        ) : error ? (
          <ErrorState message={error} onRetry={loadTeamMatches} />
        ) : currentMatchesList.length === 0 ? (
          <div className="no-data-card">
            <Calendar size={32} className="text-muted mb-2" />
            <p className="no-data-text">No {activeSubTab} matches found for {teamName}.</p>
          </div>
        ) : (
          <div className="cards-grid">
            {currentMatchesList.map((match) => (
              <MatchCard key={match.id} match={match} onSelect={setSelectedMatch} />
            ))}
          </div>
        )}
      </div>

      {selectedMatch && (
        <MatchDetail match={selectedMatch} onClose={() => setSelectedMatch(null)} />
      )}
    </div>
  );
}
