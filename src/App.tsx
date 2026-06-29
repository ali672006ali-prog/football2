import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { BettingProvider, useBetting } from "./hooks/useBetting";
import { useMatches } from "./hooks/useMatches";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import Home from "./pages/Home";
import Live from "./pages/Live";
import WorldCup from "./pages/WorldCup";
import Competition from "./pages/Competition";
import Standings from "./pages/Standings";
import Team from "./pages/Team";
import BettingSlipDrawer from "./components/match/BettingSlipDrawer";
import { Ticket } from "lucide-react";

function AppContent() {
  const [isSlipOpen, setIsSlipOpen] = useState(false);
  const { matches } = useMatches("today");
  const {
    balance,
    slip,
    activeBets,
    settledBets,
    removeFromSlip,
    clearSlip,
    placeBet,
    resetBalance,
    settleBets,
  } = useBetting();

  // Automatically settle bets globally whenever match results update
  useEffect(() => {
    if (matches && matches.length > 0) {
      settleBets(matches);
    }
  }, [matches, settleBets]);

  return (
    <div className="app-viewport" id="app-viewport">
      {/* Navigation Bar */}
      <Navbar />

      {/* Core Main Content Screen */}
      <main className="app-main-content" id="app-main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/live" element={<Live />} />
          <Route path="/worldcup" element={<WorldCup />} />
          <Route path="/competitions" element={<Competition />} />
          <Route path="/standings" element={<Standings />} />
          <Route path="/team/:id" element={<Team />} />
        </Routes>
      </main>

      {/* Footer info & status */}
      <Footer />

      {/* Floating Sportsbook Fab button */}
      <button
        onClick={() => setIsSlipOpen(true)}
        className="floating-slip-fab animate-bounce-short"
        id="floating-slip-fab"
        title="Open Betting Slip"
      >
        <Ticket size={24} />
        {slip.length > 0 && (
          <span className="floating-slip-badge animate-pulse">{slip.length}</span>
        )}
      </button>

      {/* Betting Slip Drawer component */}
      <BettingSlipDrawer
        isOpen={isSlipOpen}
        onClose={() => setIsSlipOpen(false)}
        balance={balance}
        slip={slip}
        activeBets={activeBets}
        settledBets={settledBets}
        onRemoveFromSlip={removeFromSlip}
        onClearSlip={clearSlip}
        onPlaceBet={placeBet}
        onResetBalance={resetBalance}
        matches={matches}
      />
    </div>
  );
}

export default function App() {
  return (
    <BettingProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </BettingProvider>
  );
}
