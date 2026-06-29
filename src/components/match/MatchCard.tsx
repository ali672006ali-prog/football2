import React from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, Trophy, ChevronRight, BarChart2 } from "lucide-react";
import StatusBadge from "../ui/StatusBadge";
import { formatMatchTime, formatMatchDate } from "../../utils/helpers";

interface MatchCardProps {
  match: any;
  onSelect?: (match: any) => void;
  key?: any;
}

export default function MatchCard({ match, onSelect }: MatchCardProps) {
  const navigate = useNavigate();

  const homeTeam = match.homeTeam || {};
  const awayTeam = match.awayTeam || {};
  const score = match.score || {};
  const competition = match.competition || {};

  // Status-based colors
  const isFinished = match.status === "FINISHED";
  const isLive = ["IN_PLAY", "PAUSED"].includes(match.status);

  const handleHomeTeamClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (homeTeam.id) navigate(`/team/${homeTeam.id}`);
  };

  const handleAwayTeamClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (awayTeam.id) navigate(`/team/${awayTeam.id}`);
  };

  return (
    <div
      className={`match-card ${isLive ? "live-border" : ""}`}
      id={`match-card-${match.id}`}
      onClick={() => onSelect && onSelect(match)}
    >
      {/* Match Header */}
      <div className="match-card-header">
        <div className="comp-info">
          {competition.emblem ? (
            <img
              src={competition.emblem}
              alt={competition.name}
              className="comp-emblem"
              referrerPolicy="no-referrer"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          ) : (
            <Trophy size={14} className="text-muted" />
          )}
          <span className="comp-name">{competition.name}</span>
        </div>
        <StatusBadge status={match.status} minute={match.minute} />
      </div>

      {/* Teams & Scores */}
      <div className="match-card-body">
        <div className="team-row" onClick={handleHomeTeamClick} title="View team schedule">
          <div className="team-meta">
            {homeTeam.crest ? (
              <img
                src={homeTeam.crest}
                alt={homeTeam.name}
                className="team-crest"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = `https://placehold.co/40x40/1a2533/f0f4f8?text=${encodeURIComponent(
                    homeTeam.shortName || homeTeam.name || "T"
                  )}`;
                }}
              />
            ) : (
              <div className="team-crest-placeholder">{(homeTeam.name || "H").charAt(0)}</div>
            )}
            <span className={`team-name ${score.winner === "HOME" ? "font-bold" : ""}`}>
              {homeTeam.shortName || homeTeam.name}
            </span>
          </div>
          {!["SCHEDULED", "TIMED"].includes(match.status) && (
            <span className={`team-score ${score.winner === "HOME" ? "score-winner" : ""}`}>
              {score.fullTime?.home ?? 0}
            </span>
          )}
        </div>

        <div className="team-row" onClick={handleAwayTeamClick} title="View team schedule">
          <div className="team-meta">
            {awayTeam.crest ? (
              <img
                src={awayTeam.crest}
                alt={awayTeam.name}
                className="team-crest"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = `https://placehold.co/40x40/1a2533/f0f4f8?text=${encodeURIComponent(
                    awayTeam.shortName || awayTeam.name || "T"
                  )}`;
                }}
              />
            ) : (
              <div className="team-crest-placeholder">{(awayTeam.name || "A").charAt(0)}</div>
            )}
            <span className={`team-name ${score.winner === "AWAY" ? "font-bold" : ""}`}>
              {awayTeam.shortName || awayTeam.name}
            </span>
          </div>
          {!["SCHEDULED", "TIMED"].includes(match.status) && (
            <span className={`team-score ${score.winner === "AWAY" ? "score-winner" : ""}`}>
              {score.fullTime?.away ?? 0}
            </span>
          )}
        </div>
      </div>

      {/* Match Footer */}
      <div className="match-card-footer">
        <div className="match-details-meta">
          <span className="match-time-badge">{formatMatchTime(match.utcDate)}</span>
          <span className="match-date-badge">{formatMatchDate(match.utcDate)}</span>
          {match.venue && (
            <span className="match-venue" title={match.venue}>
              <MapPin size={12} />
              <span>{match.venue}</span>
            </span>
          )}
        </div>

        {onSelect && (
          <button className="match-stats-trigger-btn">
            <BarChart2 size={14} />
            <span>Stats</span>
            <ChevronRight size={14} />
          </button>
        )}
      </div>
    </div>
  );
}
