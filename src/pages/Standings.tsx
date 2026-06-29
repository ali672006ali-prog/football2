import { useState, useEffect } from "react";
import { API } from "../services/api";
import StandingsTable from "../components/competition/StandingsTable";
import { Trophy, RefreshCw } from "lucide-react";

const LEAGUES = [
  { code: "PL", name: "Premier League" },
  { code: "PD", name: "La Liga" },
  { code: "SA", name: "Serie A" },
  { code: "BL1", name: "Bundesliga" },
  { code: "FL1", name: "Ligue 1" },
  { code: "CL", name: "Champions League" }
];

export default function Standings() {
  const [selectedLeague, setSelectedLeague] = useState("PL");
  const [standings, setStandings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStandings = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await API.getStandings(selectedLeague);
      setStandings(data.standings || []);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to retrieve standings data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStandings();
  }, [selectedLeague]);

  return (
    <div className="page-container standings-page" id="standings-page">
      <div className="page-header-row">
        <div className="page-title-section">
          <div className="flex items-center gap-2">
            <Trophy className="text-gold" size={24} />
            <h1 className="page-title">League Standings</h1>
          </div>
          <p className="page-subtitle">Track league positions and forms across major European tournaments</p>
        </div>

        <button className="refresh-action-btn" onClick={fetchStandings} title="Refresh Table">
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Selector dropdown/tabs */}
      <div className="standings-tabs-header">
        {LEAGUES.map((lg) => (
          <button
            key={lg.code}
            className={`standings-tab-pill ${selectedLeague === lg.code ? "active" : ""}`}
            onClick={() => setSelectedLeague(lg.code)}
          >
            {lg.name}
          </button>
        ))}
      </div>

      <div className="standings-body">
        <StandingsTable standings={standings} loading={loading} error={!!error} />
      </div>
    </div>
  );
}
