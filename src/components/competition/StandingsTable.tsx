import { Trophy, HelpCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface StandingsTableProps {
  standings: any[];
  loading: boolean;
  error: boolean;
}

export default function StandingsTable({ standings, loading, error }: StandingsTableProps) {
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="standings-loading" id="standings-loading">
        <div className="skeleton-table-header shimmer"></div>
        {Array.from({ length: 8 }).map((_, idx) => (
          <div key={idx} className="skeleton-table-row shimmer" style={{ height: "45px", margin: "8px 0" }}></div>
        ))}
      </div>
    );
  }

  // Find the primary/total standing table (type TOTAL)
  const totalStanding = standings?.find((s: any) => s.type === "TOTAL") || standings?.[0];
  const table = totalStanding?.table || [];

  if (error || table.length === 0) {
    return (
      <div className="no-data-card" id="standings-no-data">
        <HelpCircle size={32} className="text-muted mb-2" />
        <p className="no-data-text">No standings data currently available for this competition.</p>
      </div>
    );
  }

  const handleTeamClick = (teamId: number) => {
    if (teamId) {
      navigate(`/team/${teamId}`);
    }
  };

  return (
    <div className="standings-table-container" id="standings-table-section">
      <div className="table-responsive">
        <table className="standings-table">
          <thead>
            <tr>
              <th className="pos-col">Pos</th>
              <th className="text-left team-col-header">Club</th>
              <th className="stats-col text-center">P</th>
              <th className="stats-col text-center d-none-sm">W</th>
              <th className="stats-col text-center d-none-sm">D</th>
              <th className="stats-col text-center d-none-sm">L</th>
              <th className="stats-col text-center">GD</th>
              <th className="pts-col text-center font-bold">Pts</th>
              <th className="form-col text-center d-none-md">Form</th>
            </tr>
          </thead>
          <tbody>
            {table.map((row: any) => {
              const team = row.team || {};
              const position = row.position;
              const totalTeams = table.length;

              // Highlight classes based on position
              let highlightClass = "";
              if (position === 1) {
                highlightClass = "row-champion";
              } else if (position > 1 && position <= 4) {
                highlightClass = "row-ucl";
              } else if (position > totalTeams - 3) {
                highlightClass = "row-relegation";
              }

              // Render form bubbles
              const formList = row.form ? row.form.split(",") : [];

              return (
                <tr
                  key={team.id}
                  className={`standing-row ${highlightClass}`}
                  onClick={() => handleTeamClick(team.id)}
                  title={`View ${team.name} schedule`}
                >
                  <td className="pos-cell">
                    <span className="pos-badge">{position}</span>
                  </td>
                  <td className="team-cell text-left">
                    <div className="team-identity">
                      {team.crest ? (
                        <img
                          src={team.crest}
                          alt={team.name}
                          className="standing-crest"
                          referrerPolicy="no-referrer"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = `https://placehold.co/30x30/1a2533/f0f4f8?text=${encodeURIComponent(
                              team.shortName || team.name || "T"
                            )}`;
                          }}
                        />
                      ) : null}
                      <span className="team-fullname d-none-xs">{team.name}</span>
                      <span className="team-shortname d-show-xs">{team.shortName || team.name}</span>
                    </div>
                  </td>
                  <td className="text-center">{row.playedGames}</td>
                  <td className="text-center d-none-sm">{row.won}</td>
                  <td className="text-center d-none-sm">{row.draw}</td>
                  <td className="text-center d-none-sm">{row.lost}</td>
                  <td className="text-center font-mono">
                    {row.goalDifference > 0 ? `+${row.goalDifference}` : row.goalDifference}
                  </td>
                  <td className="text-center font-bold pts-cell">{row.points}</td>
                  <td className="text-center d-none-md form-cell">
                    <div className="form-bubbles-container">
                      {formList.slice(0, 5).map((f: string, i: number) => {
                        let fClass = "form-draw";
                        if (f === "W") fClass = "form-win";
                        if (f === "L") fClass = "form-loss";
                        return (
                          <span key={i} className={`form-bubble ${fClass}`}>
                            {f}
                          </span>
                        );
                      })}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Legend / Info guide */}
      <div className="table-legend-container">
        <div className="legend-item">
          <span className="legend-color champion"></span>
          <span className="legend-text">1st (Champion)</span>
        </div>
        <div className="legend-item">
          <span className="legend-color ucl"></span>
          <span className="legend-text">Top 4 (Champions League)</span>
        </div>
        <div className="legend-item">
          <span className="legend-color relegation"></span>
          <span className="legend-text">Bottom 3 (Relegation Zone)</span>
        </div>
      </div>
    </div>
  );
}
