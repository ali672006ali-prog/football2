import { LayoutGrid, Table, Award, Shield } from "lucide-react";

interface CompetitionTabsProps {
  activeTab: "matches" | "standings" | "scorers";
  onChange: (tab: "matches" | "standings" | "scorers") => void;
}

export default function CompetitionTabs({ activeTab, onChange }: CompetitionTabsProps) {
  return (
    <div className="comp-subtabs-container" id="comp-subtabs-container">
      <button
        className={`comp-subtab-btn ${activeTab === "matches" ? "active" : ""}`}
        onClick={() => onChange("matches")}
        id="subtab-matches"
      >
        <LayoutGrid size={16} />
        <span>Matches</span>
      </button>

      <button
        className={`comp-subtab-btn ${activeTab === "standings" ? "active" : ""}`}
        onClick={() => onChange("standings")}
        id="subtab-standings"
      >
        <Table size={16} />
        <span>Standings</span>
      </button>

      <button
        className={`comp-subtab-btn ${activeTab === "scorers" ? "active" : ""}`}
        onClick={() => onChange("scorers")}
        id="subtab-scorers"
      >
        <Award size={16} />
        <span>Top Scorers</span>
      </button>
    </div>
  );
}
