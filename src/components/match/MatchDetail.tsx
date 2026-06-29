import { useState } from "react";
import { X, Calendar, MapPin, Trophy, BarChart2, Clock, Play } from "lucide-react";
import MatchStats from "./MatchStats";
import EventTimeline from "./EventTimeline";
import MatchOdds from "./MatchOdds";
import StatusBadge from "../ui/StatusBadge";
import { formatMatchDate, formatMatchTime } from "../../utils/helpers";
import { useBetting } from "../../hooks/useBetting";

interface MatchDetailProps {
  match: any;
  onClose: () => void;
}

export default function MatchDetail({ match, onClose }: MatchDetailProps) {
  const [activeTab, setActiveTab] = useState<"stats" | "timeline" | "odds">("odds");
  const { slip, addToSlip, removeFromSlip } = useBetting();

  if (!match) return null;

  const homeTeam = match.homeTeam || {};
  const awayTeam = match.awayTeam || {};
  const score = match.score || {};
  const competition = match.competition || {};

  return (
    <div className="match-detail-overlay" id="match-detail-overlay">
      <div className="match-detail-modal">
        {/* Modal Close */}
        <button className="modal-close-btn" onClick={onClose}>
          <X size={20} />
        </button>

        {/* Modal Header / Competition */}
        <div className="modal-comp-header">
          {competition.emblem && (
            <img
              src={competition.emblem}
              alt={competition.name}
              className="modal-comp-emblem"
              referrerPolicy="no-referrer"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          )}
          <div className="modal-comp-meta">
            <h3 className="modal-comp-name">{competition.name}</h3>
            {match.stage && <span className="modal-comp-stage">{match.stage.replace(/_/g, " ")}</span>}
          </div>
        </div>

        {/* Scoreboard */}
        <div className="modal-scoreboard">
          {/* Home */}
          <div className="scoreboard-team home">
            {homeTeam.crest ? (
              <img
                src={homeTeam.crest}
                alt={homeTeam.name}
                className="scoreboard-crest"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = `https://placehold.co/80x80/1a2533/f0f4f8?text=${encodeURIComponent(
                    homeTeam.shortName || homeTeam.name || "T"
                  )}`;
                }}
              />
            ) : (
              <div className="scoreboard-crest-placeholder">{(homeTeam.name || "H").charAt(0)}</div>
            )}
            <h2 className="scoreboard-team-name">{homeTeam.name}</h2>
          </div>

          {/* Scores/Status */}
          <div className="scoreboard-score-info">
            <StatusBadge status={match.status} minute={match.minute} />
            <div className="scoreboard-numbers">
              {["SCHEDULED", "TIMED"].includes(match.status) ? (
                <span className="scoreboard-vs">VS</span>
              ) : (
                <>
                  <span className="score-num">{score.fullTime?.home ?? 0}</span>
                  <span className="score-divider">:</span>
                  <span className="score-num">{score.fullTime?.away ?? 0}</span>
                </>
              )}
            </div>
            {score.halfTime && score.halfTime.home !== null && (
              <span className="scoreboard-halftime">
                HT ({score.halfTime.home} - {score.halfTime.away})
              </span>
            )}
          </div>

          {/* Away */}
          <div className="scoreboard-team away">
            {awayTeam.crest ? (
              <img
                src={awayTeam.crest}
                alt={awayTeam.name}
                className="scoreboard-crest"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = `https://placehold.co/80x80/1a2533/f0f4f8?text=${encodeURIComponent(
                    awayTeam.shortName || awayTeam.name || "T"
                  )}`;
                }}
              />
            ) : (
              <div className="scoreboard-crest-placeholder">{(awayTeam.name || "A").charAt(0)}</div>
            )}
            <h2 className="scoreboard-team-name">{awayTeam.name}</h2>
          </div>
        </div>

        {/* Info Meta */}
        <div className="modal-meta-grid">
          <div className="meta-item">
            <Calendar size={14} className="text-muted" />
            <span>
              {formatMatchDate(match.utcDate)} at {formatMatchTime(match.utcDate)}
            </span>
          </div>
          {match.venue && (
            <div className="meta-item">
              <MapPin size={14} className="text-muted" />
              <span>{match.venue}</span>
            </div>
          )}
          {match.referees && match.referees.length > 0 && (
            <div className="meta-item">
              <Trophy size={14} className="text-muted" />
              <span>Referee: {match.referees.map((r: any) => r.name).join(", ")}</span>
            </div>
          )}
        </div>

        {/* Modal Content Tabs Selector */}
        <div className="flex border-b border-[#2a3a4a] mb-5 bg-[#141f2d] rounded-lg p-1">
          <button
            onClick={() => setActiveTab("odds")}
            className={`flex-1 py-2.5 text-xs font-semibold rounded-md flex items-center justify-center gap-2 transition-all ${
              activeTab === "odds"
                ? "bg-[#f59e0b] text-black font-bold shadow-md"
                : "text-[#94a3b8] hover:text-[#f0f4f8] hover:bg-[#1e293b]/50"
            }`}
          >
            <Play size={14} fill={activeTab === "odds" ? "currentColor" : "none"} />
            <span>Live Betting Odds</span>
            {["IN_PLAY", "PAUSED"].includes(match.status) && (
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            )}
          </button>

          <button
            onClick={() => setActiveTab("stats")}
            className={`flex-1 py-2.5 text-xs font-semibold rounded-md flex items-center justify-center gap-2 transition-all ${
              activeTab === "stats"
                ? "bg-[#f59e0b] text-black font-bold shadow-md"
                : "text-[#94a3b8] hover:text-[#f0f4f8] hover:bg-[#1e293b]/50"
            }`}
          >
            <BarChart2 size={14} />
            <span>Match Statistics</span>
          </button>

          <button
            onClick={() => setActiveTab("timeline")}
            className={`flex-1 py-2.5 text-xs font-semibold rounded-md flex items-center justify-center gap-2 transition-all ${
              activeTab === "timeline"
                ? "bg-[#f59e0b] text-black font-bold shadow-md"
                : "text-[#94a3b8] hover:text-[#f0f4f8] hover:bg-[#1e293b]/50"
            }`}
          >
            <Clock size={14} />
            <span>Live Event Timeline</span>
          </button>
        </div>

        {/* Dynamic Panel Render */}
        <div className="modal-tab-content-area" id="modal-tab-content-area">
          {activeTab === "odds" && (
            <MatchOdds
              match={match}
              slipSelections={slip}
              onAddToSlip={addToSlip}
              onRemoveFromSlip={removeFromSlip}
            />
          )}

          {activeTab === "stats" && (
            <div className="panel-column">
              <MatchStats match={match} />
            </div>
          )}

          {activeTab === "timeline" && (
            <div className="panel-column">
              <EventTimeline match={match} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
