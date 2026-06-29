import { Award, User, HelpCircle } from "lucide-react";
import { getCountryFlag } from "../../utils/helpers";

interface TopScorersProps {
  scorers: any[];
  loading: boolean;
  error: boolean;
  theme?: "gold" | "slate";
}

export default function TopScorers({ scorers, loading, error, theme = "slate" }: TopScorersProps) {
  const isGold = theme === "gold";

  if (loading) {
    return (
      <div className="scorers-loading-container" id="scorers-loading">
        <div className="skeleton-table shimmer"></div>
      </div>
    );
  }

  if (error || !scorers || scorers.length === 0) {
    return (
      <div className="no-data-card" id="scorers-no-data">
        <HelpCircle size={32} className="text-muted mb-2" />
        <p className="no-data-text">No top scorers data currently available.</p>
      </div>
    );
  }

  return (
    <div className={`scorers-container ${isGold ? "wc-scorers-border" : ""}`} id="scorers-section">
      <div className="scorers-header">
        <Award className={isGold ? "text-gold animate-pulse" : "text-blue"} size={20} />
        <h2 className="scorers-title">Top Goalscorers</h2>
      </div>

      <div className="scorers-table-wrapper">
        <table className="scorers-table">
          <thead>
            <tr>
              <th className="rank-col">Rank</th>
              <th className="text-left">Player</th>
              <th className="text-left">Team</th>
              <th className="text-center">Matches</th>
              <th className="text-right goal-col">Goals</th>
            </tr>
          </thead>
          <tbody>
            {scorers.slice(0, 15).map((row: any, idx: number) => {
              const player = row.player || {};
              const team = row.team || {};
              const position = idx + 1;

              // Give custom badges to top 3
              let rankBadge = <span className="rank-text">{position}</span>;
              if (position === 1) rankBadge = <span className={`rank-badge rank-gold ${isGold ? "pulse-gold" : ""}`}>1st</span>;
              else if (position === 2) rankBadge = <span className="rank-badge rank-silver">2nd</span>;
              else if (position === 3) rankBadge = <span className="rank-badge rank-bronze">3rd</span>;

              return (
                <tr key={player.id || idx} className={`scorer-row ${position <= 3 ? "top-scorer" : ""}`}>
                  <td className="rank-cell">{rankBadge}</td>
                  <td className="player-cell text-left">
                    <div className="player-info">
                      <div className="player-avatar">
                        <User size={14} className="text-muted" />
                      </div>
                      <div className="player-meta">
                        <span className="player-name font-bold">{player.name}</span>
                        {player.nationality && (
                          <span className="player-nationality">
                            {getCountryFlag(player.nationality)} {player.nationality}
                          </span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="team-cell text-left">
                    <div className="team-meta-inline">
                      {team.crest ? (
                        <img
                          src={team.crest}
                          alt={team.name}
                          className="team-crest-mini"
                          referrerPolicy="no-referrer"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = "none";
                          }}
                        />
                      ) : null}
                      <span className="team-label">{team.shortName || team.name}</span>
                    </div>
                  </td>
                  <td className="matches-cell text-center">{row.playedMatches ?? "-"}</td>
                  <td className="goals-cell text-right font-bold text-live">{row.goals}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
