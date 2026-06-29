import { AlertCircle } from "lucide-react";

interface BracketProps {
  matches: any[];
  loading: boolean;
}

export default function Bracket({ matches, loading }: BracketProps) {
  if (loading) {
    return (
      <div className="shimmer-bracket shimmer" id="bracket-loading">
        <div className="shimmer-block" style={{ height: "300px" }}></div>
      </div>
    );
  }

  // Filter knockout stage matches
  const knockoutStages = ["ROUND_OF_16", "QUARTER_FINALS", "SEMI_FINALS", "FINAL"];
  const koMatches = matches?.filter((m: any) => knockoutStages.includes(m.stage)) || [];

  if (koMatches.length === 0) {
    return (
      <div className="no-knockout-data-container" id="no-knockout-data">
        <div className="no-data-card gold-border">
          <AlertCircle className="text-gold" size={24} />
          <p className="no-data-text font-bold">No knockout data available.</p>
          <p className="no-data-subtext">The knockout bracket will populate once the group stage concludes.</p>
        </div>
      </div>
    );
  }

  // Group matches by stage
  const roundOf16 = koMatches.filter((m: any) => m.stage === "ROUND_OF_16");
  const quarters = koMatches.filter((m: any) => m.stage === "QUARTER_FINALS");
  const semis = koMatches.filter((m: any) => m.stage === "SEMI_FINALS");
  const final = koMatches.filter((m: any) => m.stage === "FINAL");

  const renderMatchNode = (match: any) => {
    const homeTeam = match.homeTeam || {};
    const awayTeam = match.awayTeam || {};
    const score = match.score || {};

    return (
      <div key={match.id} className="bracket-match-node">
        <div className="bracket-team home">
          <span className="bracket-team-name">{homeTeam.shortName || homeTeam.name || "TBD"}</span>
          <span className="bracket-team-score">{score.fullTime?.home ?? "-"}</span>
        </div>
        <div className="bracket-team away">
          <span className="bracket-team-name">{awayTeam.shortName || awayTeam.name || "TBD"}</span>
          <span className="bracket-team-score">{score.fullTime?.away ?? "-"}</span>
        </div>
        <div className="bracket-node-meta">
          <span>{match.status === "FINISHED" ? "FT" : "TBD"}</span>
        </div>
      </div>
    );
  };

  return (
    <div className="bracket-section-container" id="bracket-section">
      <h2 className="wc-section-title text-gold">Knockout Phase Bracket</h2>
      
      <div className="bracket-viewport">
        <div className="bracket-scroller">
          {/* Round of 16 */}
          {roundOf16.length > 0 && (
            <div className="bracket-column">
              <h3 className="bracket-column-title">Round of 16</h3>
              <div className="bracket-nodes-list">
                {roundOf16.map(renderMatchNode)}
              </div>
            </div>
          )}

          {/* Quarter Finals */}
          {quarters.length > 0 && (
            <div className="bracket-column">
              <h3 className="bracket-column-title">Quarter Finals</h3>
              <div className="bracket-nodes-list">
                {quarters.map(renderMatchNode)}
              </div>
            </div>
          )}

          {/* Semi Finals */}
          {semis.length > 0 && (
            <div className="bracket-column">
              <h3 className="bracket-column-title">Semi Finals</h3>
              <div className="bracket-nodes-list">
                {semis.map(renderMatchNode)}
              </div>
            </div>
          )}

          {/* Final */}
          {final.length > 0 && (
            <div className="bracket-column final-column">
              <h3 className="bracket-column-title text-gold">Final</h3>
              <div className="bracket-nodes-list">
                {final.map(renderMatchNode)}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
