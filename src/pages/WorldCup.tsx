import { useState, useEffect } from "react";
import { API } from "../services/api";
import WCHero from "../components/worldcup/WCHero";
import GroupGrid from "../components/worldcup/GroupGrid";
import Bracket from "../components/worldcup/Bracket";
import TopScorers from "../components/worldcup/TopScorers";
import ErrorState from "../components/ui/ErrorState";
import { RefreshCw, Trophy } from "lucide-react";

export default function WorldCup() {
  const [standings, setStandings] = useState<any[]>([]);
  const [matches, setMatches] = useState<any[]>([]);
  const [scorers, setScorers] = useState<any[]>([]);

  const [loadingGroups, setLoadingGroups] = useState(true);
  const [loadingMatches, setLoadingMatches] = useState(true);
  const [loadingScorers, setLoadingScorers] = useState(true);

  const [errorGroups, setErrorGroups] = useState(false);
  const [errorMatches, setErrorMatches] = useState(false);
  const [errorScorers, setErrorScorers] = useState(false);

  const loadWorldCupData = async () => {
    // 1. Fetch Group Standings
    setLoadingGroups(true);
    setErrorGroups(false);
    try {
      const data = await API.getWorldCupGroups();
      setStandings(data.standings || []);
    } catch (err) {
      console.error("Failed to load WC Groups", err);
      setErrorGroups(true);
    } finally {
      setLoadingGroups(false);
    }

    // 2. Fetch Knockout Matches
    setLoadingMatches(true);
    setErrorMatches(false);
    try {
      const data = await API.getWorldCupMatches();
      setMatches(data.matches || []);
    } catch (err) {
      console.error("Failed to load WC Matches", err);
      setErrorMatches(true);
    } finally {
      setLoadingMatches(false);
    }

    // 3. Fetch Top Scorers
    setLoadingScorers(true);
    setErrorScorers(false);
    try {
      const data = await API.getWorldCupScorers();
      setScorers(data.scorers || []);
    } catch (err) {
      console.error("Failed to load WC Scorers", err);
      setErrorScorers(true);
    } finally {
      setLoadingScorers(false);
    }
  };

  useEffect(() => {
    loadWorldCupData();
  }, []);

  return (
    <div className="page-container worldcup-page" id="worldcup-page">
      {/* Golden Hero Banner */}
      <WCHero />

      {/* Main Refresh Button */}
      <div className="wc-actions-row">
        <button className="refresh-action-btn gold-btn" onClick={loadWorldCupData}>
          <RefreshCw size={16} className={loadingGroups || loadingMatches || loadingScorers ? "animate-spin" : ""} />
          <span>Sync Tournament Data</span>
        </button>
      </div>

      <div className="wc-page-content-grid">
        {/* Section 1: Group Standings */}
        <section className="wc-grid-section">
          <GroupGrid standings={standings} loading={loadingGroups} error={errorGroups} />
        </section>

        {/* Section 2: Knockout Bracket */}
        <section className="wc-grid-section">
          <Bracket matches={matches} loading={loadingMatches} />
        </section>

        {/* Section 3: Top Scorers */}
        <section className="wc-grid-section">
          <TopScorers scorers={scorers} loading={loadingScorers} error={errorScorers} theme="gold" />
        </section>
      </div>
    </div>
  );
}
