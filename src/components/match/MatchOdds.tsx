import { useState, useEffect, useRef } from "react";
import { Play, TrendingUp, Lock, RefreshCw, Layers } from "lucide-react";
import { BetSelection } from "../../hooks/useBetting";

interface MatchOddsProps {
  match: any;
  slipSelections: BetSelection[];
  onAddToSlip: (selection: BetSelection) => void;
  onRemoveFromSlip: (matchId: number) => void;
}

// Deterministic seed helper based on match ID so that matches have consistent but distinct baseline odds
function getMatchBaseSeeds(matchId: number) {
  const seed = (matchId * 9301 + 49297) % 233280;
  const factor = seed / 233280; // value between 0 and 1
  
  if (factor < 0.35) {
    // Strong Home Team (e.g. Real Madrid, Man City)
    return { homeSeed: 1.45, drawSeed: 4.20, awaySeed: 6.50 };
  } else if (factor < 0.65) {
    // Tight even match (e.g. Chelsea vs Tottenham)
    return { homeSeed: 2.35, drawSeed: 3.20, awaySeed: 2.80 };
  } else {
    // Strong Away Team
    return { homeSeed: 5.50, drawSeed: 3.80, awaySeed: 1.65 };
  }
}

export default function MatchOdds({ match, slipSelections, onAddToSlip, onRemoveFromSlip }: MatchOddsProps) {
  const [activeTab, setActiveTab] = useState<"all" | "popular" | "goals" | "specials">("popular");
  const [fluctuationTick, setFluctuationTick] = useState(0);
  const previousOddsRef = useRef<Record<string, number>>({});
  const [oddsTrend, setOddsTrend] = useState<Record<string, "up" | "down" | "flat">>({});

  const isLive = ["IN_PLAY", "PAUSED"].includes(match.status);
  const isFinished = match.status === "FINISHED";
  const homeName = match.homeTeam?.shortName || match.homeTeam?.name || "Home";
  const awayName = match.awayTeam?.shortName || match.awayTeam?.name || "Away";
  const competitionName = match.competition?.name || "League";

  // Trigger odds fluctuation tick every 8 seconds for live matches
  useEffect(() => {
    if (!isLive) return;
    const interval = setInterval(() => {
      setFluctuationTick((t) => t + 1);
    }, 8000);
    return () => clearInterval(interval);
  }, [isLive]);

  // Compute live odds based on base seeds, match state (elapsed time, scores) and fluctuation tick
  const computeOdds = () => {
    const seeds = getMatchBaseSeeds(match.id);
    const homeGoals = match.score?.fullTime?.home ?? 0;
    const awayGoals = match.score?.fullTime?.away ?? 0;
    const elapsed = match.minute ?? 0;

    // Use a small deterministic noise based on the tick and match id
    const getFluctuation = (key: string) => {
      if (!isLive) return 1.0;
      const seedVal = (match.id + fluctuationTick + key.charCodeAt(0)) % 100;
      // Fluctuate between -4% and +4%
      return 1.0 + (seedVal - 50) / 1250;
    };

    let homeOdds = seeds.homeSeed;
    let drawOdds = seeds.drawSeed;
    let awayOdds = seeds.awaySeed;

    if (isLive) {
      // Adjust odds based on goals and match minute
      const goalDiff = homeGoals - awayGoals;
      const timeFactor = elapsed / 90;

      if (goalDiff > 0) {
        // Home team is leading
        const gapMult = 1 + goalDiff * 1.5;
        homeOdds = Math.max(1.02, seeds.homeSeed / gapMult - timeFactor * 0.4);
        drawOdds = seeds.drawSeed * (1 + goalDiff) + timeFactor * 5.0;
        awayOdds = seeds.awaySeed * gapMult * (1 + timeFactor * 3.0);
      } else if (goalDiff < 0) {
        // Away team is leading
        const gapMult = 1 + Math.abs(goalDiff) * 1.5;
        awayOdds = Math.max(1.02, seeds.awaySeed / gapMult - timeFactor * 0.4);
        drawOdds = seeds.drawSeed * (1 + Math.abs(goalDiff)) + timeFactor * 5.0;
        homeOdds = seeds.homeSeed * gapMult * (1 + timeFactor * 3.0);
      } else {
        // It's a draw, as time passes, the odds of a draw decrease, home/away increase
        drawOdds = Math.max(1.15, seeds.drawSeed - timeFactor * 1.8);
        homeOdds = seeds.homeSeed + timeFactor * 1.5;
        awayOdds = seeds.awaySeed + timeFactor * 1.5;
      }

      // Add actual live noise
      homeOdds *= getFluctuation("home");
      drawOdds *= getFluctuation("draw");
      awayOdds *= getFluctuation("away");
    }

    // Round to 2 decimal places
    const fHome = parseFloat(Math.max(1.01, homeOdds).toFixed(2));
    const fDraw = parseFloat(Math.max(1.01, drawOdds).toFixed(2));
    const fAway = parseFloat(Math.max(1.01, awayOdds).toFixed(2));

    // Secondary markets odds calculation
    // 1. Both Teams To Score (BTTS)
    let bttsYes = 1.80;
    let bttsNo = 1.95;
    if (homeGoals > 0 && awayGoals > 0) {
      bttsYes = 1.00; // Guaranteed win
      bttsNo = 999.00; // Impossible
    } else {
      const totalGoals = homeGoals + awayGoals;
      const timeFactor = elapsed / 90;
      if (isLive) {
        if (totalGoals === 0 && elapsed > 70) {
          bttsYes = 4.50 * getFluctuation("by");
          bttsNo = 1.18 * getFluctuation("bn");
        } else {
          bttsYes = 2.10 * getFluctuation("by");
          bttsNo = 1.65 * getFluctuation("bn");
        }
      }
    }
    const fBttsYes = parseFloat(bttsYes.toFixed(2));
    const fBttsNo = parseFloat(bttsNo.toFixed(2));

    // 2. Over/Under 2.5 Goals
    let overOdds = 1.90;
    let underOdds = 1.85;
    const currentGoals = homeGoals + awayGoals;
    if (currentGoals >= 3) {
      overOdds = 1.00;
      underOdds = 999.00;
    } else {
      const timeFactor = elapsed / 90;
      if (isLive) {
        if (currentGoals === 2) {
          overOdds = 1.35 * getFluctuation("o");
          underOdds = 3.10 * getFluctuation("u");
        } else if (currentGoals === 1) {
          if (elapsed > 60) {
            overOdds = 2.80 * getFluctuation("o");
            underOdds = 1.40 * getFluctuation("u");
          } else {
            overOdds = 1.70 * getFluctuation("o");
            underOdds = 2.05 * getFluctuation("u");
          }
        } else {
          // 0 goals
          if (elapsed > 40) {
            overOdds = 3.50 * getFluctuation("o");
            underOdds = 1.28 * getFluctuation("u");
          } else {
            overOdds = 2.20 * getFluctuation("o");
            underOdds = 1.62 * getFluctuation("u");
          }
        }
      }
    }
    const fOver = parseFloat(overOdds.toFixed(2));
    const fUnder = parseFloat(underOdds.toFixed(2));

    // 3. Double Chance (1X, 12, X2)
    // 1X is Home Win or Draw. Odds are lower than single odds.
    const f1X = parseFloat((1 / (1 / fHome + 1 / fDraw) * 1.08).toFixed(2));
    const f12 = parseFloat((1 / (1 / fHome + 1 / fAway) * 1.08).toFixed(2));
    const fX2 = parseFloat((1 / (1 / fDraw + 1 / fAway) * 1.08).toFixed(2));

    // 4. Draw No Bet (Home, Away) - Draw returns stake
    const fDnbHome = parseFloat((fHome * (1 - 1 / fDraw)).toFixed(2));
    const fDnbAway = parseFloat((fAway * (1 - 1 / fDraw)).toFixed(2));

    return {
      home: fHome,
      draw: fDraw,
      away: fAway,
      bttsYes: fBttsYes,
      bttsNo: fBttsNo,
      over25: fOver,
      under25: fUnder,
      dc1X: f1X,
      dc12: f12,
      dcX2: fX2,
      dnbHome: Math.max(1.05, isNaN(fDnbHome) ? 1.5 : fDnbHome),
      dnbAway: Math.max(1.05, isNaN(fDnbAway) ? 2.5 : fDnbAway),
    };
  };

  const odds = computeOdds();

  // Handle visual trend analysis (green rising vs red falling indicators)
  useEffect(() => {
    const nextTrends: Record<string, "up" | "down" | "flat"> = {};
    const prev = previousOddsRef.current;

    Object.entries(odds).forEach(([key, val]) => {
      const prevVal = prev[key];
      if (prevVal !== undefined && prevVal !== val) {
        nextTrends[key] = val > prevVal ? "up" : "down";
        // Clear trends after 3 seconds
        setTimeout(() => {
          setOddsTrend((t) => ({ ...t, [key]: "flat" }));
        }, 3000);
      } else {
        nextTrends[key] = prev[key] ? (oddsTrend[key] || "flat") : "flat";
      }
    });

    previousOddsRef.current = odds;
    setOddsTrend(nextTrends);
  }, [fluctuationTick, match.status, match.minute, match.score?.fullTime?.home]);

  // Check if a specific outcome is already selected in the slip
  const isSelected = (marketId: number, selectionId: string) => {
    return slipSelections.some(
      (item) => item.matchId === match.id && item.marketId === marketId && item.selectionId === selectionId
    );
  };

  const handleOddsClick = (
    marketId: number,
    marketName: string,
    selectionId: string,
    selectionName: string,
    val: number
  ) => {
    if (isFinished) return; // Matches already completed cannot be bet on
    
    const isAlreadySelected = isSelected(marketId, selectionId);
    if (isAlreadySelected) {
      onRemoveFromSlip(match.id);
    } else {
      onAddToSlip({
        matchId: match.id,
        homeTeam: homeName,
        awayTeam: awayName,
        competitionName,
        marketId,
        marketName,
        selectionId,
        selectionName,
        odds: val,
      });
    }
  };

  // Status check for locks
  const isMarketSuspended = (marketId: number) => {
    if (isFinished) return true;
    
    const homeGoals = match.score?.fullTime?.home ?? 0;
    const awayGoals = match.score?.fullTime?.away ?? 0;
    const totalGoals = homeGoals + awayGoals;
    const elapsed = match.minute ?? 0;

    // Suspend odds if match is basically over (90th minute onwards or very high score gap)
    if (isLive && elapsed >= 89) return true;

    if (marketId === 69) {
      // BTTS: Already settled if both scored, suspend "No"
      return homeGoals > 0 && awayGoals > 0;
    }
    if (marketId === 25) {
      // Over/Under 2.5: Already settled if 3+ goals
      return totalGoals >= 3;
    }
    return false;
  };

  // Filter markets list by category
  const renderPopularMarket = () => (
    <div className="odds-market-card" id={`market-popular-${match.id}`}>
      <div className="market-header flex items-center justify-between mb-3 border-b border-[#2a3a4a] pb-2">
        <div className="flex items-center gap-2">
          <TrendingUp size={16} className="text-[#f59e0b]" />
          <span className="font-semibold text-sm text-[#f0f4f8]">Fulltime Result (1x2)</span>
        </div>
        <span className="text-xs text-[#94a3b8] bg-[#0f1923] px-2 py-0.5 rounded">ID: 59</span>
      </div>

      {isMarketSuspended(59) ? (
        <div className="flex items-center justify-center py-4 bg-[#0c141d] rounded text-xs text-[#94a3b8] gap-1.5 border border-[#2a3a4a] border-dashed">
          <Lock size={12} className="text-[#ef4444]" />
          <span>Market Suspended / Locked</span>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-2">
          {/* Home Win */}
          <button
            onClick={() => handleOddsClick(59, "Fulltime Result", "home", homeName, odds.home)}
            className={`odds-btn p-2.5 rounded text-center flex flex-col items-center justify-center transition-all ${
              isSelected(59, "home")
                ? "bg-[#f59e0b] text-black font-semibold"
                : "bg-[#0f1923] hover:bg-[#223042] text-[#f0f4f8]"
            } ${oddsTrend.home === "up" ? "border border-emerald-500 bg-emerald-950/20" : ""} ${
              oddsTrend.home === "down" ? "border border-rose-500 bg-rose-950/20" : ""
            }`}
          >
            <span className="text-xs opacity-75 mb-1 truncate max-w-full font-sans">1 ({homeName})</span>
            <span className="text-sm font-mono font-bold">{odds.home.toFixed(2)}</span>
          </button>

          {/* Draw */}
          <button
            onClick={() => handleOddsClick(59, "Fulltime Result", "draw", "Draw", odds.draw)}
            className={`odds-btn p-2.5 rounded text-center flex flex-col items-center justify-center transition-all ${
              isSelected(59, "draw")
                ? "bg-[#f59e0b] text-black font-semibold"
                : "bg-[#0f1923] hover:bg-[#223042] text-[#f0f4f8]"
            } ${oddsTrend.draw === "up" ? "border border-emerald-500 bg-emerald-950/20" : ""} ${
              oddsTrend.draw === "down" ? "border border-rose-500 bg-rose-950/20" : ""
            }`}
          >
            <span className="text-xs opacity-75 mb-1 font-sans">X (Draw)</span>
            <span className="text-sm font-mono font-bold">{odds.draw.toFixed(2)}</span>
          </button>

          {/* Away Win */}
          <button
            onClick={() => handleOddsClick(59, "Fulltime Result", "away", awayName, odds.away)}
            className={`odds-btn p-2.5 rounded text-center flex flex-col items-center justify-center transition-all ${
              isSelected(59, "away")
                ? "bg-[#f59e0b] text-black font-semibold"
                : "bg-[#0f1923] hover:bg-[#223042] text-[#f0f4f8]"
            } ${oddsTrend.away === "up" ? "border border-emerald-500 bg-emerald-950/20" : ""} ${
              oddsTrend.away === "down" ? "border border-rose-500 bg-rose-950/20" : ""
            }`}
          >
            <span className="text-xs opacity-75 mb-1 truncate max-w-full font-sans">2 ({awayName})</span>
            <span className="text-sm font-mono font-bold">{odds.away.toFixed(2)}</span>
          </button>
        </div>
      )}
    </div>
  );

  const renderGoalsMarket = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3" id={`market-goals-${match.id}`}>
      {/* Both Teams To Score */}
      <div className="odds-market-card">
        <div className="market-header flex items-center justify-between mb-3 border-b border-[#2a3a4a] pb-2">
          <div className="flex items-center gap-2">
            <Layers size={14} className="text-[#f59e0b]" />
            <span className="font-semibold text-xs text-[#f0f4f8]">Both Teams To Score (BTTS)</span>
          </div>
          <span className="text-xs text-[#94a3b8] bg-[#0f1923] px-2 py-0.5 rounded">ID: 69</span>
        </div>

        {isMarketSuspended(69) ? (
          <div className="flex items-center justify-center py-4 bg-[#0c141d] rounded text-xs text-[#94a3b8] gap-1.5 border border-[#2a3a4a] border-dashed">
            <Lock size={12} className="text-[#ef4444]" />
            <span>Market Suspended (Score {match.score?.fullTime?.home}-{match.score?.fullTime?.away})</span>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleOddsClick(69, "Both Teams To Score", "yes", "BTTS - Yes", odds.bttsYes)}
              className={`odds-btn p-2 rounded text-center flex flex-col justify-center transition-all ${
                isSelected(69, "yes")
                  ? "bg-[#f59e0b] text-black font-semibold"
                  : "bg-[#0f1923] hover:bg-[#223042] text-[#f0f4f8]"
              }`}
            >
              <span className="text-xs opacity-75 mb-0.5">Yes</span>
              <span className="text-sm font-mono font-bold">{odds.bttsYes.toFixed(2)}</span>
            </button>
            <button
              onClick={() => handleOddsClick(69, "Both Teams To Score", "no", "BTTS - No", odds.bttsNo)}
              className={`odds-btn p-2 rounded text-center flex flex-col justify-center transition-all ${
                isSelected(69, "no")
                  ? "bg-[#f59e0b] text-black font-semibold"
                  : "bg-[#0f1923] hover:bg-[#223042] text-[#f0f4f8]"
              }`}
            >
              <span className="text-xs opacity-75 mb-0.5">No</span>
              <span className="text-sm font-mono font-bold">{odds.bttsNo.toFixed(2)}</span>
            </button>
          </div>
        )}
      </div>

      {/* Match Goals Over/Under 2.5 */}
      <div className="odds-market-card">
        <div className="market-header flex items-center justify-between mb-3 border-b border-[#2a3a4a] pb-2">
          <div className="flex items-center gap-2">
            <Layers size={14} className="text-[#f59e0b]" />
            <span className="font-semibold text-xs text-[#f0f4f8]">Total Goals (Over/Under 2.5)</span>
          </div>
          <span className="text-xs text-[#94a3b8] bg-[#0f1923] px-2 py-0.5 rounded">ID: 25</span>
        </div>

        {isMarketSuspended(25) ? (
          <div className="flex items-center justify-center py-4 bg-[#0c141d] rounded text-xs text-[#94a3b8] gap-1.5 border border-[#2a3a4a] border-dashed">
            <Lock size={12} className="text-[#ef4444]" />
            <span>Market Suspended (Already Over 2.5)</span>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleOddsClick(25, "Match Goals", "over", "Over 2.5 Goals", odds.over25)}
              className={`odds-btn p-2 rounded text-center flex flex-col justify-center transition-all ${
                isSelected(25, "over")
                  ? "bg-[#f59e0b] text-black font-semibold"
                  : "bg-[#0f1923] hover:bg-[#223042] text-[#f0f4f8]"
              }`}
            >
              <span className="text-xs opacity-75 mb-0.5">Over 2.5</span>
              <span className="text-sm font-mono font-bold">{odds.over25.toFixed(2)}</span>
            </button>
            <button
              onClick={() => handleOddsClick(25, "Match Goals", "under", "Under 2.5 Goals", odds.under25)}
              className={`odds-btn p-2 rounded text-center flex flex-col justify-center transition-all ${
                isSelected(25, "under")
                  ? "bg-[#f59e0b] text-black font-semibold"
                  : "bg-[#0f1923] hover:bg-[#223042] text-[#f0f4f8]"
              }`}
            >
              <span className="text-xs opacity-75 mb-0.5">Under 2.5</span>
              <span className="text-sm font-mono font-bold">{odds.under25.toFixed(2)}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );

  const renderSpecialsMarket = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3" id={`market-specials-${match.id}`}>
      {/* Double Chance */}
      <div className="odds-market-card">
        <div className="market-header flex items-center justify-between mb-3 border-b border-[#2a3a4a] pb-2">
          <div className="flex items-center gap-2">
            <Layers size={14} className="text-[#f59e0b]" />
            <span className="font-semibold text-xs text-[#f0f4f8]">Double Chance</span>
          </div>
          <span className="text-xs text-[#94a3b8] bg-[#0f1923] px-2 py-0.5 rounded">ID: 72</span>
        </div>

        {isFinished ? (
          <div className="flex items-center justify-center py-4 bg-[#0c141d] rounded text-xs text-[#94a3b8] gap-1.5 border border-[#2a3a4a] border-dashed">
            <Lock size={12} className="text-[#ef4444]" />
            <span>Market Settled</span>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-1.5">
            <button
              onClick={() => handleOddsClick(72, "Double Chance", "home_draw", `Home or Draw (1X)`, odds.dc1X)}
              className={`odds-btn p-1.5 rounded text-center flex flex-col justify-center transition-all ${
                isSelected(72, "home_draw")
                  ? "bg-[#f59e0b] text-black font-semibold"
                  : "bg-[#0f1923] hover:bg-[#223042] text-[#f0f4f8]"
              }`}
            >
              <span className="text-[10px] opacity-75 mb-0.5 truncate">1X (Home/Draw)</span>
              <span className="text-xs font-mono font-bold">{odds.dc1X.toFixed(2)}</span>
            </button>
            <button
              onClick={() => handleOddsClick(72, "Double Chance", "home_away", `Home or Away (12)`, odds.dc12)}
              className={`odds-btn p-1.5 rounded text-center flex flex-col justify-center transition-all ${
                isSelected(72, "home_away")
                  ? "bg-[#f59e0b] text-black font-semibold"
                  : "bg-[#0f1923] hover:bg-[#223042] text-[#f0f4f8]"
              }`}
            >
              <span className="text-[10px] opacity-75 mb-0.5 truncate">12 (Home/Away)</span>
              <span className="text-xs font-mono font-bold">{odds.dc12.toFixed(2)}</span>
            </button>
            <button
              onClick={() => handleOddsClick(72, "Double Chance", "draw_away", `Draw or Away (X2)`, odds.dcX2)}
              className={`odds-btn p-1.5 rounded text-center flex flex-col justify-center transition-all ${
                isSelected(72, "draw_away")
                  ? "bg-[#f59e0b] text-black font-semibold"
                  : "bg-[#0f1923] hover:bg-[#223042] text-[#f0f4f8]"
              }`}
            >
              <span className="text-[10px] opacity-75 mb-0.5 truncate">X2 (Draw/Away)</span>
              <span className="text-xs font-mono font-bold">{odds.dcX2.toFixed(2)}</span>
            </button>
          </div>
        )}
      </div>

      {/* Draw No Bet */}
      <div className="odds-market-card">
        <div className="market-header flex items-center justify-between mb-3 border-b border-[#2a3a4a] pb-2">
          <div className="flex items-center gap-2">
            <Layers size={14} className="text-[#f59e0b]" />
            <span className="font-semibold text-xs text-[#f0f4f8]">Draw No Bet (DNB)</span>
          </div>
          <span className="text-xs text-[#94a3b8] bg-[#0f1923] px-2 py-0.5 rounded">ID: 48</span>
        </div>

        {isMarketSuspended(48) ? (
          <div className="flex items-center justify-center py-4 bg-[#0c141d] rounded text-xs text-[#94a3b8] gap-1.5 border border-[#2a3a4a] border-dashed">
            <Lock size={12} className="text-[#ef4444]" />
            <span>Market Suspended / Locked</span>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleOddsClick(48, "Draw No Bet", "home", `DNB ${homeName}`, odds.dnbHome)}
              className={`odds-btn p-2 rounded text-center flex flex-col justify-center transition-all ${
                isSelected(48, "home")
                  ? "bg-[#f59e0b] text-black font-semibold"
                  : "bg-[#0f1923] hover:bg-[#223042] text-[#f0f4f8]"
              }`}
            >
              <span className="text-xs opacity-75 mb-0.5 truncate">{homeName}</span>
              <span className="text-sm font-mono font-bold">{odds.dnbHome.toFixed(2)}</span>
            </button>
            <button
              onClick={() => handleOddsClick(48, "Draw No Bet", "away", `DNB ${awayName}`, odds.dnbAway)}
              className={`odds-btn p-2 rounded text-center flex flex-col justify-center transition-all ${
                isSelected(48, "away")
                  ? "bg-[#f59e0b] text-black font-semibold"
                  : "bg-[#0f1923] hover:bg-[#223042] text-[#f0f4f8]"
              }`}
            >
              <span className="text-xs opacity-75 mb-0.5 truncate">{awayName}</span>
              <span className="text-sm font-mono font-bold">{odds.dnbAway.toFixed(2)}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="match-odds-container bg-[#1a2533] rounded-lg p-4 border border-[#2a3a4a]" id={`match-odds-${match.id}`}>
      {/* Odds Header with Live Indicator */}
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <h4 className="font-display font-bold text-[#f0f4f8] flex items-center gap-2">
          <Play className="text-[#f59e0b]" size={16} fill="currentColor" />
          <span>Simulation Sportsbook Odds</span>
        </h4>
        {isLive && (
          <span className="text-[10px] bg-red-950/40 text-red-400 border border-red-500/30 px-2 py-0.5 rounded flex items-center gap-1.5 animate-pulse font-mono">
            <RefreshCw size={10} className="animate-spin" />
            Live Floating Odds
          </span>
        )}
        {isFinished && (
          <span className="text-[10px] bg-slate-800 text-[#94a3b8] px-2 py-0.5 rounded font-mono">
            All Markets Settled
          </span>
        )}
      </div>

      {/* Market Category Pills */}
      <div className="flex items-center gap-1.5 mb-4 border-b border-[#2a3a4a]/50 pb-3 overflow-x-auto">
        <button
          onClick={() => setActiveTab("popular")}
          className={`px-3 py-1 text-xs rounded-full font-medium transition-all ${
            activeTab === "popular" ? "bg-[#f59e0b] text-black font-semibold" : "text-[#94a3b8] hover:text-[#f0f4f8]"
          }`}
        >
          Popular
        </button>
        <button
          onClick={() => setActiveTab("goals")}
          className={`px-3 py-1 text-xs rounded-full font-medium transition-all ${
            activeTab === "goals" ? "bg-[#f59e0b] text-black font-semibold" : "text-[#94a3b8] hover:text-[#f0f4f8]"
          }`}
        >
          Goals
        </button>
        <button
          onClick={() => setActiveTab("specials")}
          className={`px-3 py-1 text-xs rounded-full font-medium transition-all ${
            activeTab === "specials" ? "bg-[#f59e0b] text-black font-semibold" : "text-[#94a3b8] hover:text-[#f0f4f8]"
          }`}
        >
          Specials & Draws
        </button>
        <button
          onClick={() => setActiveTab("all")}
          className={`px-3 py-1 text-xs rounded-full font-medium transition-all ${
            activeTab === "all" ? "bg-[#f59e0b] text-black font-semibold" : "text-[#94a3b8] hover:text-[#f0f4f8]"
          }`}
        >
          All ({isFinished ? 1 : 5} Markets)
        </button>
      </div>

      {/* Markets rendering list */}
      <div className="flex flex-col gap-4">
        {(activeTab === "popular" || activeTab === "all") && renderPopularMarket()}
        {(activeTab === "goals" || activeTab === "all") && renderGoalsMarket()}
        {(activeTab === "specials" || activeTab === "all") && renderSpecialsMarket()}
      </div>

      {/* Instructions footer */}
      {!isFinished && (
        <p className="text-[11px] text-[#94a3b8] text-center mt-4 border-t border-[#2a3a4a]/50 pt-3">
          💡 Click any odds box to add to your Bet Slip. Placing bets is 100% free with virtual simulation cash.
        </p>
      )}
    </div>
  );
}
