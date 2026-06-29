import React, { useState, useEffect } from "react";
import { X, Trash2, Coins, Ticket, Clock, History, RotateCcw, AlertTriangle, CheckCircle2, TrendingUp, HelpCircle } from "lucide-react";
import { PlacedBet, BetSelection } from "../../hooks/useBetting";

interface BettingSlipDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  balance: number;
  slip: BetSelection[];
  activeBets: PlacedBet[];
  settledBets: PlacedBet[];
  onRemoveFromSlip: (matchId: number) => void;
  onClearSlip: () => void;
  onPlaceBet: (stake: number, asParlay: boolean) => { success: boolean; error?: string };
  onResetBalance: () => void;
  matches: any[];
}

export default function BettingSlipDrawer({
  isOpen,
  onClose,
  balance,
  slip,
  activeBets,
  settledBets,
  onRemoveFromSlip,
  onClearSlip,
  onPlaceBet,
  onResetBalance,
  matches,
}: BettingSlipDrawerProps) {
  const [activeTab, setActiveTab] = useState<"slip" | "active" | "history">("slip");
  const [stake, setStake] = useState<string>("");
  const [asParlay, setAsParlay] = useState<boolean>(false);
  const [slipError, setSlipError] = useState<string | null>(null);
  const [slipSuccess, setSlipSuccess] = useState<boolean>(false);

  // If slip changes and parlay is selected with only 1 item, fallback to single
  useEffect(() => {
    if (slip.length <= 1) {
      setAsParlay(false);
    }
  }, [slip.length]);

  if (!isOpen) return null;

  // Compute parlay combined odds
  const parlayOdds = parseFloat(
    slip.reduce((acc, item) => acc * item.odds, 1).toFixed(2)
);

  const numStake = parseFloat(stake) || 0;
  const totalOddsMultiplier = asParlay ? parlayOdds : 1;
  const potentialPayout = asParlay
    ? parseFloat((numStake * parlayOdds).toFixed(2))
    : parseFloat(slip.reduce((acc, item) => acc + (numStake / slip.length) * item.odds, 0).toFixed(2));

  const handlePlaceBet = (e: React.FormEvent) => {
    e.preventDefault();
    setSlipError(null);
    setSlipSuccess(false);

    if (!stake || numStake <= 0) {
      setSlipError("Please enter a stake amount.");
      return;
    }

    if (numStake > balance) {
      setSlipError("Insufficient virtual cash balance.");
      return;
    }

    const res = onPlaceBet(numStake, asParlay);
    if (res.success) {
      setSlipSuccess(true);
      setStake("");
      // Clear success badge after 4 seconds
      setTimeout(() => setSlipSuccess(false), 4000);
    } else {
      setSlipError(res.error || "Failed to place bet.");
    }
  };

  const addPresetStake = (amount: number) => {
    setStake((prev) => {
      const current = parseFloat(prev) || 0;
      return (current + amount).toFixed(0);
    });
  };

  const setMaxStake = () => {
    setStake(balance.toFixed(0));
  };

  // Find active score from current matches list
  const getMatchCurrentScore = (matchId: number) => {
    const matchObj = matches.find((m) => Number(m.id) === Number(matchId));
    if (!matchObj) return null;
    if (["SCHEDULED", "TIMED"].includes(matchObj.status)) return "VS";
    return `${matchObj.score?.fullTime?.home ?? 0} - ${matchObj.score?.fullTime?.away ?? 0}`;
  };

  // Find active match minute or status
  const getMatchCurrentStatus = (matchId: number) => {
    const matchObj = matches.find((m) => Number(m.id) === Number(matchId));
    if (!matchObj) return "";
    if (matchObj.status === "FINISHED") return "FT";
    if (matchObj.status === "PAUSED") return "HT";
    if (matchObj.minute) return `${matchObj.minute}'`;
    return matchObj.status;
  };

  return (
    <div className="betting-slip-overlay" id="betting-slip-overlay">
      <div className="betting-slip-drawer" id="betting-slip-drawer">
        {/* Drawer Header */}
        <div className="drawer-header border-b border-[#2a3a4a] p-4 flex items-center justify-between bg-[#141f2d]">
          <div className="flex items-center gap-2">
            <Ticket className="text-[#f59e0b] animate-pulse" size={20} />
            <h3 className="font-display font-bold text-base text-[#f0f4f8] tracking-tight">GOALFLUX SPORTSBOOK</h3>
          </div>
          <button className="text-[#94a3b8] hover:text-[#f0f4f8] transition-all p-1" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Balance Panel */}
        <div className="balance-bar bg-[#0c141d] px-4 py-3 border-b border-[#2a3a4a]/50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Coins className="text-[#f59e0b]" size={16} />
            <span className="text-xs text-[#94a3b8] font-medium">Virtual Play Balance:</span>
            <span className="text-sm font-mono font-bold text-[#f59e0b]">${balance.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          </div>
          <button
            onClick={onResetBalance}
            className="text-[10px] text-[#94a3b8] hover:text-[#ef4444] transition-all flex items-center gap-1 bg-[#1a2533] px-2 py-1 rounded border border-[#2a3a4a]/50"
            title="Reset to $1,000 Starting Cash"
          >
            <RotateCcw size={10} />
            <span>Reset</span>
          </button>
        </div>

        {/* Tab Selection */}
        <div className="drawer-tabs flex bg-[#141f2d] border-b border-[#2a3a4a]">
          <button
            onClick={() => setActiveTab("slip")}
            className={`flex-1 py-3 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all relative ${
              activeTab === "slip" ? "text-[#f59e0b]" : "text-[#94a3b8] hover:text-[#f0f4f8]"
            }`}
          >
            <Ticket size={14} />
            <span>Bet Slip</span>
            {slip.length > 0 && (
              <span className="bg-[#f59e0b] text-black text-[9px] font-bold w-4.5 h-4.5 rounded-full flex items-center justify-center">
                {slip.length}
              </span>
            )}
            {activeTab === "slip" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#f59e0b]" />}
          </button>

          <button
            onClick={() => setActiveTab("active")}
            className={`flex-1 py-3 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all relative ${
              activeTab === "active" ? "text-[#f59e0b]" : "text-[#94a3b8] hover:text-[#f0f4f8]"
            }`}
          >
            <Clock size={14} />
            <span>Live / Active</span>
            {activeBets.length > 0 && (
              <span className="bg-red-500 text-white text-[9px] font-bold w-4.5 h-4.5 rounded-full flex items-center justify-center animate-pulse">
                {activeBets.length}
              </span>
            )}
            {activeTab === "active" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#f59e0b]" />}
          </button>

          <button
            onClick={() => setActiveTab("history")}
            className={`flex-1 py-3 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all relative ${
              activeTab === "history" ? "text-[#f59e0b]" : "text-[#94a3b8] hover:text-[#f0f4f8]"
            }`}
          >
            <History size={14} />
            <span>History</span>
            {settledBets.length > 0 && (
              <span className="bg-slate-700 text-white text-[9px] font-bold w-4.5 h-4.5 rounded-full flex items-center justify-center">
                {settledBets.length}
              </span>
            )}
            {activeTab === "history" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#f59e0b]" />}
          </button>
        </div>

        {/* Drawer Body Area */}
        <div className="drawer-body flex-1 overflow-y-auto p-4 bg-[#0f1923]">
          
          {/* SLIP TAB */}
          {activeTab === "slip" && (
            <div className="flex flex-col h-full">
              {slipSuccess && (
                <div className="mb-4 bg-emerald-950/40 border border-emerald-500/30 rounded p-3 text-xs text-emerald-400 flex items-start gap-2">
                  <CheckCircle2 size={16} className="text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-emerald-300">Bet Placed Successfully!</p>
                    <p className="text-[11px] opacity-90 mt-0.5">Your virtual simulation wager is active. Track its performance in the Live tab.</p>
                  </div>
                </div>
              )}

              {slip.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center py-16 text-muted">
                  <Ticket size={36} className="text-[#2a3a4a] mb-3" />
                  <p className="text-sm font-semibold text-[#f0f4f8]">Your slip is empty</p>
                  <p className="text-xs text-[#94a3b8] max-w-[200px] mt-1">Select odds for any match to build your single or parlay ticket.</p>
                </div>
              ) : (
                <div className="flex-1 flex flex-col gap-3">
                  <div className="flex items-center justify-between text-xs text-[#94a3b8]">
                    <span>Selections ({slip.length})</span>
                    <button onClick={onClearSlip} className="text-rose-400 hover:text-rose-300 flex items-center gap-1.5 transition-all">
                      <Trash2 size={12} />
                      <span>Clear Slip</span>
                    </button>
                  </div>

                  {/* Selections List */}
                  <div className="flex flex-col gap-2 max-h-[350px] overflow-y-auto pr-1">
                    {slip.map((item) => (
                      <div key={item.matchId} className="bg-[#1a2533] p-3 rounded border border-[#2a3a4a] flex items-start justify-between gap-2 hover:border-[#3b82f6]/30 transition-all">
                        <div className="flex-1 min-w-0">
                          <span className="text-[10px] text-[#94a3b8] font-medium tracking-wider uppercase font-mono">{item.competitionName}</span>
                          <h4 className="text-xs font-semibold text-[#f0f4f8] truncate mt-0.5">{item.homeTeam} vs {item.awayTeam}</h4>
                          <p className="text-xs text-[#94a3b8] mt-1">{item.marketName}</p>
                          <div className="flex items-center gap-1.5 mt-1">
                            <span className="text-xs text-[#f59e0b] font-bold bg-[#f59e0b]/10 px-1.5 py-0.5 rounded">{item.selectionName}</span>
                            <span className="text-xs text-[#94a3b8]">@</span>
                            <span className="text-xs font-mono font-bold text-[#f0f4f8]">{item.odds.toFixed(2)}</span>
                          </div>
                        </div>
                        <button
                          onClick={() => onRemoveFromSlip(item.matchId)}
                          className="text-[#94a3b8] hover:text-rose-400 p-1 rounded hover:bg-[#0f1923] transition-all"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Parlay/Combo Toggle */}
                  {slip.length > 1 && (
                    <div className="bg-[#141f2d] p-3 rounded border border-[#2a3a4a] mt-2">
                      <label className="flex items-center justify-between cursor-pointer">
                        <div className="flex flex-col">
                          <span className="text-xs font-bold text-[#f0f4f8]">Combined Parlay</span>
                          <span className="text-[10px] text-[#94a3b8] mt-0.5">Combine all selections into a single parlay ticket</span>
                        </div>
                        <input
                          type="checkbox"
                          checked={asParlay}
                          onChange={(e) => setAsParlay(e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="relative w-10 h-6 bg-[#2a3a4a] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#f59e0b]" />
                      </label>
                      {asParlay && (
                        <div className="mt-3 pt-2.5 border-t border-[#2a3a4a]/40 flex items-center justify-between text-xs">
                          <span className="text-[#94a3b8]">Combo Multiplier Odds:</span>
                          <span className="font-mono font-bold text-[#f59e0b]">{parlayOdds.toFixed(2)}x</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Stake input Form */}
                  <form onSubmit={handlePlaceBet} className="mt-auto border-t border-[#2a3a4a] pt-4 flex flex-col gap-3">
                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-[#94a3b8] font-semibold">Stake Amount:</span>
                        {slip.length > 1 && !asParlay && (
                          <span className="text-[10px] text-[#94a3b8]">(${ (numStake / slip.length).toFixed(2) } per Single bet)</span>
                        )}
                      </div>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94a3b8] font-semibold text-sm">$</span>
                        <input
                          type="number"
                          placeholder="0.00"
                          value={stake}
                          onChange={(e) => setStake(e.target.value)}
                          className="w-full bg-[#141f2d] border border-[#2a3a4a] focus:border-[#f59e0b] focus:outline-none rounded-lg py-2.5 pl-8 pr-16 font-mono text-sm font-bold text-[#f0f4f8]"
                          min="1"
                          step="any"
                        />
                        <button
                          type="button"
                          onClick={setMaxStake}
                          className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#f59e0b]/10 text-[#f59e0b] text-[10px] font-bold px-2 py-1 rounded border border-[#f59e0b]/20 hover:bg-[#f59e0b]/20 transition-all"
                        >
                          MAX
                        </button>
                      </div>
                    </div>

                    {/* Presets Grid */}
                    <div className="grid grid-cols-4 gap-1.5">
                      <button type="button" onClick={() => addPresetStake(10)} className="bg-[#1a2533] hover:bg-[#223042] text-xs py-1.5 rounded text-[#94a3b8] border border-[#2a3a4a] transition-all">+$10</button>
                      <button type="button" onClick={() => addPresetStake(50)} className="bg-[#1a2533] hover:bg-[#223042] text-xs py-1.5 rounded text-[#94a3b8] border border-[#2a3a4a] transition-all">+$50</button>
                      <button type="button" onClick={() => addPresetStake(100)} className="bg-[#1a2533] hover:bg-[#223042] text-xs py-1.5 rounded text-[#94a3b8] border border-[#2a3a4a] transition-all">+$100</button>
                      <button type="button" onClick={() => setStake("250")} className="bg-[#1a2533] hover:bg-[#223042] text-xs py-1.5 rounded text-[#94a3b8] border border-[#2a3a4a] transition-all">$250</button>
                    </div>

                    {/* Cost / Payout Summary */}
                    <div className="bg-[#141f2d] p-3 rounded border border-[#2a3a4a] flex flex-col gap-1.5 text-xs">
                      <div className="flex justify-between">
                        <span className="text-[#94a3b8]">Total Cost:</span>
                        <span className="font-mono text-[#f0f4f8]">${numStake.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                      </div>
                      <div className="flex justify-between border-t border-[#2a3a4a]/40 pt-1.5 font-semibold">
                        <span className="text-[#94a3b8]">Est. Payout:</span>
                        <span className="font-mono text-[#10b981]">${potentialPayout.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                      </div>
                    </div>

                    {slipError && (
                      <div className="bg-rose-950/40 border border-rose-500/30 rounded p-2.5 text-[11px] text-rose-400 flex items-center gap-1.5">
                        <AlertTriangle size={14} className="text-rose-400 shrink-0" />
                        <span>{slipError}</span>
                      </div>
                    )}

                    <button
                      type="submit"
                      className="w-full bg-[#f59e0b] hover:bg-[#d97706] disabled:bg-[#2a3a4a] disabled:text-[#94a3b8] text-black font-bold py-3 rounded-lg transition-all text-sm flex items-center justify-center gap-2"
                      disabled={numStake <= 0 || numStake > balance}
                    >
                      <Coins size={16} />
                      <span>Place Simulated Wager (${numStake.toFixed(2)})</span>
                    </button>
                  </form>
                </div>
              )}
            </div>
          )}

          {/* ACTIVE / LIVE TAB */}
          {activeTab === "active" && (
            <div className="flex flex-col gap-3">
              {activeBets.length === 0 ? (
                <div className="text-center py-16 text-muted">
                  <Clock size={36} className="text-[#2a3a4a] mb-3 mx-auto" />
                  <p className="text-sm font-semibold text-[#f0f4f8]">No active bets</p>
                  <p className="text-xs text-[#94a3b8] max-w-[200px] mx-auto mt-1">Place wagers to track live scores and automated settlements.</p>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {activeBets.map((bet) => (
                    <div key={bet.id} className="bg-[#141f2d] rounded-lg border border-[#2a3a4a] overflow-hidden">
                      {/* Bet Ticket Top Bar */}
                      <div className="bg-[#1a2533] px-3 py-2 border-b border-[#2a3a4a]/50 flex items-center justify-between">
                        <span className="text-[10px] font-bold text-[#94a3b8] font-mono tracking-wider">TICKET: {bet.id.toUpperCase()}</span>
                        <span className="text-[10px] bg-red-950/40 text-red-400 border border-red-500/30 px-1.5 py-0.5 rounded flex items-center gap-1 font-mono">
                          <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-ping shrink-0" />
                          LIVE TRACK
                        </span>
                      </div>

                      {/* Bet Selections inside */}
                      <div className="p-3 flex flex-col gap-2.5">
                        {bet.selections.map((sel) => {
                          const currentScore = getMatchCurrentScore(sel.matchId);
                          const currentStatus = getMatchCurrentStatus(sel.matchId);
                          return (
                            <div key={sel.matchId} className="border-l-2 border-[#3b82f6] pl-2.5 py-0.5">
                              <div className="flex items-center justify-between">
                                <span className="text-[9px] text-[#94a3b8] font-medium tracking-wide uppercase">{sel.competitionName}</span>
                                {currentScore && (
                                  <div className="flex items-center gap-1 text-[10px] font-mono bg-[#0f1923] px-1.5 py-0.5 rounded text-[#f0f4f8]">
                                    <span className="text-[#f59e0b]">{currentScore}</span>
                                    {currentStatus && <span className="text-muted border-l border-[#2a3a4a] pl-1">{currentStatus}</span>}
                                  </div>
                                )}
                              </div>
                              <h5 className="text-xs font-semibold text-[#f0f4f8] mt-0.5">{sel.homeTeam} vs {sel.awayTeam}</h5>
                              <div className="flex items-center justify-between mt-1 flex-wrap gap-1">
                                <span className="text-xs text-[#94a3b8]">{sel.marketName}: <strong className="text-[#f59e0b]">{sel.selectionName}</strong></span>
                                <span className="text-xs font-mono font-semibold text-[#f0f4f8]">@{sel.odds.toFixed(2)}</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Ticket Footer details */}
                      <div className="bg-[#0c141d] p-3 border-t border-[#2a3a4a]/50 flex items-center justify-between text-xs">
                        <div>
                          <span className="text-[#94a3b8]">Stake:</span>
                          <span className="font-mono font-bold text-[#f0f4f8] ml-1">${bet.stake.toFixed(2)}</span>
                        </div>
                        <div>
                          <span className="text-[#94a3b8]">Est. Win:</span>
                          <span className="font-mono font-bold text-[#10b981] ml-1">${bet.potentialPayout.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* BET HISTORY TAB */}
          {activeTab === "history" && (
            <div className="flex flex-col gap-3">
              {settledBets.length === 0 ? (
                <div className="text-center py-16 text-muted">
                  <History size={36} className="text-[#2a3a4a] mb-3 mx-auto" />
                  <p className="text-sm font-semibold text-[#f0f4f8]">No settled history</p>
                  <p className="text-xs text-[#94a3b8] max-w-[200px] mx-auto mt-1">Schedules that end will settle here with automated outcomes.</p>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {settledBets.map((bet) => {
                    const isWin = bet.status === "WON";
                    const isVoid = bet.status === "VOID";
                    const netWin = isWin ? (bet.potentialPayout - bet.stake) : isVoid ? 0 : -bet.stake;

                    return (
                      <div key={bet.id} className={`bg-[#141f2d] rounded-lg border overflow-hidden ${
                        isWin ? "border-emerald-500/30" : isVoid ? "border-slate-500/30" : "border-rose-500/20"
                      }`}>
                        {/* Header status */}
                        <div className={`px-3 py-2 border-b flex items-center justify-between ${
                          isWin ? "bg-emerald-950/20 border-emerald-500/20" : isVoid ? "bg-slate-800/20 border-slate-700/20" : "bg-rose-950/10 border-rose-950/20"
                        }`}>
                          <span className="text-[10px] font-bold text-[#94a3b8] font-mono">ID: {bet.id.toUpperCase()}</span>
                          <span className={`text-[9px] font-bold font-mono px-2 py-0.5 rounded ${
                            isWin ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/25" :
                            isVoid ? "bg-slate-700/30 text-slate-300 border border-slate-600/30" :
                            "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                          }`}>
                            {bet.status}
                          </span>
                        </div>

                        {/* Selections inside */}
                        <div className="p-3 flex flex-col gap-2.5 bg-[#0f1923]/40">
                          {bet.selections.map((sel) => {
                            const finalScore = bet.finalScores?.[sel.matchId] || "FT";
                            return (
                              <div key={sel.matchId} className="border-l border-[#2a3a4a] pl-2.5 py-0.5">
                                <div className="flex items-center justify-between">
                                  <span className="text-[9px] text-[#94a3b8] uppercase font-mono">{sel.competitionName}</span>
                                  <span className="text-[9px] font-mono text-[#f59e0b] bg-[#1a2533] px-1.5 py-0.5 rounded">Result: {finalScore}</span>
                                </div>
                                <h5 className="text-xs font-semibold text-[#f0f4f8] mt-0.5">{sel.homeTeam} vs {sel.awayTeam}</h5>
                                <p className="text-xs text-[#94a3b8] mt-1">
                                  {sel.marketName}: <strong className="text-[#f0f4f8]">{sel.selectionName}</strong> <span className="text-[10px] font-mono font-semibold">@{sel.odds.toFixed(2)}</span>
                                </p>
                              </div>
                            );
                          })}
                        </div>

                        {/* Summary panel */}
                        <div className="bg-[#0c141d] p-3 border-t border-[#2a3a4a]/40 flex items-center justify-between text-xs">
                          <div className="flex flex-col">
                            <span className="text-[10px] text-[#94a3b8]">Wager details</span>
                            <span className="text-[#94a3b8] mt-0.5">Stake: <strong className="text-[#f0f4f8] font-mono">${bet.stake.toFixed(2)}</strong></span>
                          </div>
                          <div className="text-right">
                            <span className="text-[10px] text-[#94a3b8]">Net Outcome</span>
                            <p className={`font-mono font-bold text-xs mt-0.5 ${
                              isWin ? "text-emerald-400" : isVoid ? "text-slate-300" : "text-rose-400"
                            }`}>
                              {netWin >= 0 ? "+" : ""}${netWin.toFixed(2)}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
