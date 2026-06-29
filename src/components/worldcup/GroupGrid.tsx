import { Trophy, HelpCircle } from "lucide-react";
import { getCountryFlag } from "../../utils/helpers";

interface GroupGridProps {
  standings: any[];
  loading: boolean;
  error: boolean;
}

export default function GroupGrid({ standings, loading, error }: GroupGridProps) {
  if (loading) {
    return (
      <div className="group-grid-loading" id="group-grid-loading">
        {Array.from({ length: 4 }).map((_, idx) => (
          <div key={idx} className="loading-group-card shimmer"></div>
        ))}
      </div>
    );
  }

  if (error || !standings || standings.length === 0) {
    return (
      <div className="no-data-card" id="wc-group-no-data">
        <HelpCircle size={32} className="text-muted mb-2" />
        <p className="no-data-text">No World Cup group standings data currently available.</p>
      </div>
    );
  }

  // Filter for GROUP type standings
  const groups = standings.filter((s: any) => s.type === "TOTAL");

  return (
    <div className="group-grid-container" id="group-grid">
      <div className="wc-section-header">
        <Trophy className="text-gold" size={20} />
        <h2 className="wc-section-title">Group Stage Standings</h2>
      </div>

      <div className="groups-grid">
        {groups.map((grp: any, idx: number) => {
          const groupName = grp.group ? grp.group.replace(/_/g, " ") : `Group ${idx + 1}`;
          return (
            <div key={idx} className="group-card">
              <h3 className="group-card-title text-gold">{groupName}</h3>
              <div className="group-table-wrapper">
                <table className="group-table">
                  <thead>
                    <tr>
                      <th>Pos</th>
                      <th className="text-left">Team</th>
                      <th>P</th>
                      <th>GD</th>
                      <th>Pts</th>
                    </tr>
                  </thead>
                  <tbody>
                    {grp.table?.map((row: any) => {
                      const isTopTwo = row.position <= 2;
                      return (
                        <tr key={row.team.id} className={isTopTwo ? "row-qualify" : ""}>
                          <td className="pos-col">{row.position}</td>
                          <td className="team-col text-left">
                            <span className="team-flag">{getCountryFlag(row.team.name)}</span>
                            <span className="team-short-name" title={row.team.name}>
                              {row.team.shortName || row.team.name}
                            </span>
                          </td>
                          <td>{row.playedGames}</td>
                          <td>{row.goalDifference > 0 ? `+${row.goalDifference}` : row.goalDifference}</td>
                          <td className="pts-col font-bold">{row.points}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
