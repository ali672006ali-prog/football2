import React, { useState, useEffect, createContext, useContext } from "react";

export interface BetSelection {
  matchId: number;
  homeTeam: string;
  awayTeam: string;
  competitionName: string;
  marketId: number;
  marketName: string;
  selectionId: string; // e.g. "home", "draw", "away", "yes", "no", "over", "under"
  selectionName: string; // e.g. "Real Madrid", "Draw", "Over 2.5"
  odds: number;
}

export interface PlacedBet {
  id: string;
  selections: BetSelection[];
  isParlay: boolean;
  stake: number;
  odds: number; // Multiplied odds if parlay, or single odds
  potentialPayout: number;
  status: "ACTIVE" | "WON" | "LOST" | "VOID";
  placedAt: string;
  settledAt?: string;
  initialScores?: Record<number, string>; // matchId -> score text when placed
  finalScores?: Record<number, string>; // matchId -> score text when settled
}

interface BettingContextType {
  balance: number;
  slip: BetSelection[];
  activeBets: PlacedBet[];
  settledBets: PlacedBet[];
  addToSlip: (selection: BetSelection) => void;
  removeFromSlip: (matchId: number) => void;
  clearSlip: () => void;
  placeBet: (stake: number, asParlay: boolean) => { success: boolean; error?: string };
  resetBalance: () => void;
  settleBets: (allMatches: any[]) => void;
}

const BettingContext = createContext<BettingContextType | null>(null);

const STARTING_BALANCE = 1000;

export function BettingProvider({ children }: { children: React.ReactNode }) {
  const [balance, setBalance] = useState<number>(() => {
    const saved = localStorage.getItem("goalflux_bet_balance");
    return saved ? parseFloat(saved) : STARTING_BALANCE;
  });

  const [slip, setSlip] = useState<BetSelection[]>(() => {
    const saved = localStorage.getItem("goalflux_bet_slip");
    return saved ? JSON.parse(saved) : [];
  });

  const [activeBets, setActiveBets] = useState<PlacedBet[]>(() => {
    const saved = localStorage.getItem("goalflux_bet_active");
    return saved ? JSON.parse(saved) : [];
  });

  const [settledBets, setSettledBets] = useState<PlacedBet[]>(() => {
    const saved = localStorage.getItem("goalflux_bet_settled");
    return saved ? JSON.parse(saved) : [];
  });

  // Sync state to local storage
  useEffect(() => {
    localStorage.setItem("goalflux_bet_balance", balance.toString());
  }, [balance]);

  useEffect(() => {
    localStorage.setItem("goalflux_bet_slip", JSON.stringify(slip));
  }, [slip]);

  useEffect(() => {
    localStorage.setItem("goalflux_bet_active", JSON.stringify(activeBets));
  }, [activeBets]);

  useEffect(() => {
    localStorage.setItem("goalflux_bet_settled", JSON.stringify(settledBets));
  }, [settledBets]);

  // Add selection to slip (only one selection per match to prevent contradictory parlays)
  const addToSlip = (selection: BetSelection) => {
    setSlip((prev) => {
      // Filter out any existing selection for this exact same match
      const filtered = prev.filter((item) => item.matchId !== selection.matchId);
      const updated = [...filtered, selection];
      return updated;
    });
  };

  // Remove selection from slip
  const removeFromSlip = (matchId: number) => {
    setSlip((prev) => prev.filter((item) => item.matchId !== matchId));
  };

  // Clear entire slip
  const clearSlip = () => {
    setSlip([]);
  };

  // Place a bet (Single bets for each item, or a combined Parlay)
  const placeBet = (stake: number, asParlay: boolean = false): { success: boolean; error?: string } => {
    if (slip.length === 0) {
      return { success: false, error: "Your betting slip is empty." };
    }
    if (stake <= 0) {
      return { success: false, error: "Please enter a valid stake amount." };
    }
    if (balance < stake) {
      return { success: false, error: "Insufficient balance." };
    }

    const nowStr = new Date().toISOString();

    if (asParlay) {
      // Parlay: single bet combining all selections with multiplied odds
      const combinedOdds = parseFloat(
        slip.reduce((acc, item) => acc * item.odds, 1).toFixed(2)
      );
      const potentialPayout = parseFloat((stake * combinedOdds).toFixed(2));

      const newBet: PlacedBet = {
        id: "bet_" + Math.random().toString(36).substring(2, 11),
        selections: [...slip],
        isParlay: true,
        stake,
        odds: combinedOdds,
        potentialPayout,
        status: "ACTIVE",
        placedAt: nowStr,
      };

      setBalance((b) => parseFloat((b - stake).toFixed(2)));
      setActiveBets((prev) => [newBet, ...prev]);
    } else {
      // Singles: Place a separate bet for each selection using a portion of the stake
      const singleStake = parseFloat((stake / slip.length).toFixed(2));
      
      const newBets: PlacedBet[] = slip.map((item) => {
        const potentialPayout = parseFloat((singleStake * item.odds).toFixed(2));
        return {
          id: "bet_" + Math.random().toString(36).substring(2, 11),
          selections: [item],
          isParlay: false,
          stake: singleStake,
          odds: item.odds,
          potentialPayout,
          status: "ACTIVE",
          placedAt: nowStr,
        };
      });

      setBalance((b) => parseFloat((b - stake).toFixed(2)));
      setActiveBets((prev) => [...newBets, ...prev]);
    }

    // Clear the slip after placing
    setSlip([]);
    return { success: true };
  };

  // Reset virtual bank balance
  const resetBalance = () => {
    setBalance(STARTING_BALANCE);
    setActiveBets([]);
    setSettledBets([]);
    setSlip([]);
  };

  // Settle active bets based on actual matches scores
  const settleBets = (allMatches: any[]) => {
    if (activeBets.length === 0 || allMatches.length === 0) return;

    const matchesMap = new Map<number, any>();
    allMatches.forEach((m) => matchesMap.set(Number(m.id), m));

    let balanceAwarded = 0;
    const stillActive: PlacedBet[] = [];
    const newlySettled: PlacedBet[] = [];

    activeBets.forEach((bet) => {
      let allSettled = true;
      let anyLoss = false;
      let anyVoid = false;

      const settledSelections = bet.selections.map((sel) => {
        const matchObj = matchesMap.get(Number(sel.matchId));
        if (!matchObj) {
          allSettled = false;
          return { ...sel, settledStatus: "PENDING" };
        }

        const isFinished = matchObj.status === "FINISHED";
        if (!isFinished) {
          allSettled = false;
          return { ...sel, settledStatus: "PENDING" };
        }

        // Determine if this specific selection won
        const homeScore = matchObj.score?.fullTime?.home ?? 0;
        const awayScore = matchObj.score?.fullTime?.away ?? 0;
        let won = false;

        if (sel.marketId === 59) {
          if (sel.selectionId === "home" && homeScore > awayScore) won = true;
          else if (sel.selectionId === "draw" && homeScore === awayScore) won = true;
          else if (sel.selectionId === "away" && homeScore < awayScore) won = true;
        } else if (sel.marketId === 69) {
          const btts = homeScore > 0 && awayScore > 0;
          if (sel.selectionId === "yes" && btts) won = true;
          else if (sel.selectionId === "no" && !btts) won = true;
        } else if (sel.marketId === 25) {
          const totalGoals = homeScore + awayScore;
          if (sel.selectionId === "over" && totalGoals > 2.5) won = true;
          else if (sel.selectionId === "under" && totalGoals < 2.5) won = true;
        } else if (sel.marketId === 72) {
          if (sel.selectionId === "home_draw" && homeScore >= awayScore) won = true;
          else if (sel.selectionId === "home_away" && homeScore !== awayScore) won = true;
          else if (sel.selectionId === "draw_away" && homeScore <= awayScore) won = true;
        } else if (sel.marketId === 48) {
          if (homeScore === awayScore) {
            anyVoid = true;
          } else if (sel.selectionId === "home" && homeScore > awayScore) won = true;
          else if (sel.selectionId === "away" && homeScore < awayScore) won = true;
        }

        if (!won && !anyVoid) {
          anyLoss = true;
        }

        return { ...sel, settledStatus: won ? "WON" : anyVoid ? "VOID" : "LOST" };
      });

      if (allSettled) {
        let betFinalStatus: "WON" | "LOST" | "VOID" = "WON";
        let payout = 0;

        if (anyLoss) {
          betFinalStatus = "LOST";
        } else if (anyVoid && !bet.isParlay) {
          betFinalStatus = "VOID";
          payout = bet.stake;
        } else if (anyVoid && bet.isParlay) {
          const validSelections = settledSelections.filter((s) => s.settledStatus !== "VOID");
          if (validSelections.length === 0) {
            betFinalStatus = "VOID";
            payout = bet.stake;
          } else {
            const newOdds = parseFloat(
              validSelections.reduce((acc, item) => acc * item.odds, 1).toFixed(2)
            );
            payout = parseFloat((bet.stake * newOdds).toFixed(2));
            betFinalStatus = "WON";
          }
        } else {
          payout = bet.potentialPayout;
        }

        const completedBet: PlacedBet = {
          ...bet,
          status: betFinalStatus,
          settledAt: new Date().toISOString(),
          finalScores: bet.selections.reduce((acc, sel) => {
            const m = matchesMap.get(Number(sel.matchId));
            if (m) {
              acc[sel.matchId] = `${m.score?.fullTime?.home ?? 0}-${m.score?.fullTime?.away ?? 0}`;
            }
            return acc;
          }, {} as Record<number, string>),
        };

        newlySettled.push(completedBet);
        if (betFinalStatus === "WON" || betFinalStatus === "VOID") {
          balanceAwarded += payout;
        }
      } else {
        stillActive.push(bet);
      }
    });

    if (newlySettled.length > 0) {
      setBalance((b) => parseFloat((b + balanceAwarded).toFixed(2)));
      setActiveBets(stillActive);
      setSettledBets((prev) => [...newlySettled, ...prev]);
    }
  };

  return (
    <BettingContext.Provider
      value={{
        balance,
        slip,
        activeBets,
        settledBets,
        addToSlip,
        removeFromSlip,
        clearSlip,
        placeBet,
        resetBalance,
        settleBets,
      }}
    >
      {children}
    </BettingContext.Provider>
  );
}

export function useBetting() {
  const context = useContext(BettingContext);
  if (!context) {
    throw new Error("useBetting must be used within a BettingProvider");
  }
  return context;
}
