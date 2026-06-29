export interface Team {
  id: number;
  name: string;
  shortName: string;
  tla: string;
  crest: string;
}

export interface Competition {
  id: number;
  name: string;
  code: string;
  emblem: string;
  type: string;
}

// Fallback Standings Data
export const FALLBACK_STANDINGS: Record<string, any> = {
  PL: {
    competition: { id: 2021, name: "Premier League", code: "PL", emblem: "https://crests.thefootballco.com/PL.png" },
    standings: [
      {
        stage: "REGULAR_SEASON",
        type: "TOTAL",
        table: [
          { position: 1, team: { id: 64, name: "Liverpool FC", shortName: "Liverpool", tla: "LIV", crest: "https://crests.thefootballco.com/64.png" }, playedGames: 38, won: 26, draw: 8, lost: 4, points: 86, goalsFor: 84, goalsAgainst: 36, goalDifference: 48 },
          { position: 2, team: { id: 65, name: "Manchester City FC", shortName: "Man City", tla: "MCI", crest: "https://crests.thefootballco.com/65.png" }, playedGames: 38, won: 25, draw: 9, lost: 4, points: 84, goalsFor: 96, goalsAgainst: 38, goalDifference: 58 },
          { position: 3, team: { id: 57, name: "Arsenal FC", shortName: "Arsenal", tla: "ARS", crest: "https://crests.thefootballco.com/57.png" }, playedGames: 38, won: 26, draw: 5, lost: 7, points: 83, goalsFor: 91, goalsAgainst: 29, goalDifference: 62 },
          { position: 4, team: { id: 61, name: "Chelsea FC", shortName: "Chelsea", tla: "CHE", crest: "https://crests.thefootballco.com/61.png" }, playedGames: 38, won: 20, draw: 10, lost: 8, points: 70, goalsFor: 77, goalsAgainst: 63, goalDifference: 14 },
          { position: 5, team: { id: 73, name: "Tottenham Hotspur FC", shortName: "Tottenham", tla: "TOT", crest: "https://crests.thefootballco.com/73.png" }, playedGames: 38, won: 20, draw: 6, lost: 12, points: 66, goalsFor: 74, goalsAgainst: 61, goalDifference: 13 },
          { position: 6, team: { id: 66, name: "Manchester United FC", shortName: "Man United", tla: "MUN", crest: "https://crests.thefootballco.com/66.png" }, playedGames: 38, won: 18, draw: 6, lost: 14, points: 60, goalsFor: 57, goalsAgainst: 58, goalDifference: -1 }
        ]
      }
    ]
  },
  PD: {
    competition: { id: 2014, name: "La Liga", code: "PD", emblem: "https://crests.thefootballco.com/PD.png" },
    standings: [
      {
        stage: "REGULAR_SEASON",
        type: "TOTAL",
        table: [
          { position: 1, team: { id: 86, name: "Real Madrid CF", shortName: "Real Madrid", tla: "RMA", crest: "https://crests.thefootballco.com/86.png" }, playedGames: 38, won: 29, draw: 8, lost: 1, points: 95, goalsFor: 87, goalsAgainst: 26, goalDifference: 61 },
          { position: 2, team: { id: 78, name: "FC Barcelona", shortName: "Barcelona", tla: "FCB", crest: "https://crests.thefootballco.com/78.png" }, playedGames: 38, won: 26, draw: 7, lost: 5, points: 85, goalsFor: 79, goalsAgainst: 44, goalDifference: 35 },
          { position: 3, team: { id: 250, name: "Girona FC", shortName: "Girona", tla: "GIR", crest: "https://crests.thefootballco.com/250.png" }, playedGames: 38, won: 25, draw: 6, lost: 7, points: 81, goalsFor: 85, goalsAgainst: 46, goalDifference: 39 },
          { position: 4, team: { id: 79, name: "Atlético Madrid", shortName: "Atleti", tla: "ATM", crest: "https://crests.thefootballco.com/79.png" }, playedGames: 38, won: 24, draw: 4, lost: 10, points: 76, goalsFor: 70, goalsAgainst: 43, goalDifference: 27 }
        ]
      }
    ]
  },
  BL1: {
    competition: { id: 2002, name: "Bundesliga", code: "BL1", emblem: "https://crests.thefootballco.com/BL1.png" },
    standings: [
      {
        stage: "REGULAR_SEASON",
        type: "TOTAL",
        table: [
          { position: 1, team: { id: 12, name: "Bayer 04 Leverkusen", shortName: "Leverkusen", tla: "B04", crest: "https://crests.thefootballco.com/12.png" }, playedGames: 34, won: 28, draw: 6, lost: 0, points: 90, goalsFor: 89, goalsAgainst: 24, goalDifference: 65 },
          { position: 2, team: { id: 11, name: "VfB Stuttgart", shortName: "Stuttgart", tla: "VFB", crest: "https://crests.thefootballco.com/11.png" }, playedGames: 34, won: 23, draw: 4, lost: 7, points: 73, goalsFor: 78, goalsAgainst: 39, goalDifference: 39 },
          { position: 3, team: { id: 5, name: "FC Bayern München", shortName: "Bayern", tla: "FCB", crest: "https://crests.thefootballco.com/5.png" }, playedGames: 34, won: 23, draw: 3, lost: 8, points: 72, goalsFor: 94, goalsAgainst: 45, goalDifference: 49 },
          { position: 4, team: { id: 4, name: "Borussia Dortmund", shortName: "Dortmund", tla: "BVB", crest: "https://crests.thefootballco.com/4.png" }, playedGames: 34, won: 18, draw: 9, lost: 7, points: 63, goalsFor: 68, goalsAgainst: 43, goalDifference: 25 }
        ]
      }
    ]
  },
  SA: {
    competition: { id: 2019, name: "Serie A", code: "SA", emblem: "https://crests.thefootballco.com/SA.png" },
    standings: [
      {
        stage: "REGULAR_SEASON",
        type: "TOTAL",
        table: [
          { position: 1, team: { id: 108, name: "FC Internazionale Milano", shortName: "Inter", tla: "INT", crest: "https://crests.thefootballco.com/108.png" }, playedGames: 38, won: 29, draw: 7, lost: 2, points: 94, goalsFor: 89, goalsAgainst: 22, goalDifference: 67 },
          { position: 2, team: { id: 98, name: "AC Milan", shortName: "Milan", tla: "MIL", crest: "https://crests.thefootballco.com/98.png" }, playedGames: 38, won: 22, draw: 9, lost: 7, points: 75, goalsFor: 76, goalsAgainst: 49, goalDifference: 27 },
          { position: 3, team: { id: 109, name: "Juventus FC", shortName: "Juventus", tla: "JUV", crest: "https://crests.thefootballco.com/109.png" }, playedGames: 38, won: 19, draw: 14, lost: 5, points: 71, goalsFor: 54, goalsAgainst: 31, goalDifference: 23 },
          { position: 4, team: { id: 104, name: "La Fiorentina", shortName: "Fiorentina", tla: "FIO", crest: "https://crests.thefootballco.com/104.png" }, playedGames: 38, won: 19, draw: 12, lost: 7, points: 69, goalsFor: 62, goalsAgainst: 40, goalDifference: 22 }
        ]
      }
    ]
  },
  CL: {
    competition: { id: 2001, name: "UEFA Champions League", code: "CL", emblem: "https://crests.thefootballco.com/CL.png" },
    standings: [
      {
        stage: "GROUP_STAGE",
        type: "TOTAL",
        group: "GROUP_A",
        table: [
          { position: 1, team: { id: 86, name: "Real Madrid CF", shortName: "Real Madrid", tla: "RMA", crest: "https://crests.thefootballco.com/86.png" }, playedGames: 6, won: 6, draw: 0, lost: 0, points: 18, goalsFor: 16, goalsAgainst: 7, goalDifference: 9 },
          { position: 2, team: { id: 108, name: "FC Internazionale Milano", shortName: "Inter", tla: "INT", crest: "https://crests.thefootballco.com/108.png" }, playedGames: 6, won: 3, draw: 3, lost: 0, points: 12, goalsFor: 8, goalsAgainst: 5, goalDifference: 3 },
          { position: 3, team: { id: 109, name: "Juventus FC", shortName: "Juventus", tla: "JUV", crest: "https://crests.thefootballco.com/109.png" }, playedGames: 6, won: 1, draw: 2, lost: 3, points: 5, goalsFor: 4, goalsAgainst: 8, goalDifference: -4 }
        ]
      }
    ]
  },
  WC: {
    competition: { id: 2000, name: "FIFA World Cup", code: "WC", emblem: "https://crests.thefootballco.com/WC.png" },
    standings: [
      {
        stage: "GROUP_STAGE",
        type: "TOTAL",
        group: "GROUP_A",
        table: [
          { position: 1, team: { id: 762, name: "Argentina", shortName: "Argentina", tla: "ARG", crest: "https://crests.thefootballco.com/762.png" }, playedGames: 3, won: 3, draw: 0, lost: 0, points: 9, goalsFor: 8, goalsAgainst: 1, goalDifference: 7 },
          { position: 2, team: { id: 770, name: "France", shortName: "France", tla: "FRA", crest: "https://crests.thefootballco.com/770.png" }, playedGames: 3, won: 2, draw: 0, lost: 1, points: 6, goalsFor: 6, goalsAgainst: 3, goalDifference: 3 },
          { position: 3, team: { id: 764, name: "Brazil", shortName: "Brazil", tla: "BRA", crest: "https://crests.thefootballco.com/764.png" }, playedGames: 3, won: 1, draw: 1, lost: 1, points: 4, goalsFor: 4, goalsAgainst: 4, goalDifference: 0 },
          { position: 4, team: { id: 773, name: "Morocco", shortName: "Morocco", tla: "MAR", crest: "https://crests.thefootballco.com/773.png" }, playedGames: 3, won: 0, draw: 1, lost: 2, points: 1, goalsFor: 2, goalsAgainst: 9, goalDifference: -7 }
        ]
      },
      {
        stage: "GROUP_STAGE",
        type: "TOTAL",
        group: "GROUP_B",
        table: [
          { position: 1, team: { id: 759, name: "Germany", shortName: "Germany", tla: "GER", crest: "https://crests.thefootballco.com/759.png" }, playedGames: 3, won: 2, draw: 1, lost: 0, points: 7, goalsFor: 7, goalsAgainst: 2, goalDifference: 5 },
          { position: 2, team: { id: 765, name: "Portugal", shortName: "Portugal", tla: "POR", crest: "https://crests.thefootballco.com/765.png" }, playedGames: 3, won: 2, draw: 0, lost: 1, points: 6, goalsFor: 5, goalsAgainst: 3, goalDifference: 2 },
          { position: 3, team: { id: 772, name: "Spain", shortName: "Spain", tla: "ESP", crest: "https://crests.thefootballco.com/772.png" }, playedGames: 3, won: 1, draw: 1, lost: 1, points: 4, goalsFor: 4, goalsAgainst: 4, goalDifference: 0 },
          { position: 4, team: { id: 768, name: "USA", shortName: "USA", tla: "USA", crest: "https://crests.thefootballco.com/768.png" }, playedGames: 3, won: 0, draw: 0, lost: 3, points: 0, goalsFor: 1, goalsAgainst: 8, goalDifference: -7 }
        ]
      }
    ]
  }
};

// Fallback Scorers Data
export const FALLBACK_SCORERS: Record<string, any> = {
  PL: {
    competition: { id: 2021, name: "Premier League", code: "PL" },
    scorers: [
      { player: { name: "Erling Haaland" }, team: { shortName: "Man City" }, goals: 18, assists: 5 },
      { player: { name: "Mohamed Salah" }, team: { shortName: "Liverpool" }, goals: 14, assists: 8 },
      { player: { name: "Cole Palmer" }, team: { shortName: "Chelsea" }, goals: 13, assists: 9 },
      { player: { name: "Bukayo Saka" }, team: { shortName: "Arsenal" }, goals: 12, assists: 7 },
      { player: { name: "Ollie Watkins" }, team: { shortName: "Aston Villa" }, goals: 11, assists: 10 }
    ]
  },
  PD: {
    competition: { id: 2014, name: "La Liga", code: "PD" },
    scorers: [
      { player: { name: "Artem Dovbyk" }, team: { shortName: "Girona" }, goals: 24, assists: 8 },
      { player: { name: "Alexander Sørloth" }, team: { shortName: "Villarreal" }, goals: 23, assists: 6 },
      { player: { name: "Jude Bellingham" }, team: { shortName: "Real Madrid" }, goals: 19, assists: 6 },
      { player: { name: "Robert Lewandowski" }, team: { shortName: "Barcelona" }, goals: 19, assists: 8 }
    ]
  },
  BL1: {
    competition: { id: 2002, name: "Bundesliga", code: "BL1" },
    scorers: [
      { player: { name: "Harry Kane" }, team: { shortName: "Bayern" }, goals: 36, assists: 8 },
      { player: { name: "Serhou Guirassy" }, team: { shortName: "Stuttgart" }, goals: 28, assists: 2 },
      { player: { name: "Lois Openda" }, team: { shortName: "RB Leipzig" }, goals: 24, assists: 7 }
    ]
  },
  SA: {
    competition: { id: 2019, name: "Serie A", code: "SA" },
    scorers: [
      { player: { name: "Lautaro Martínez" }, team: { shortName: "Inter" }, goals: 24, assists: 4 },
      { player: { name: "Dušan Vlahović" }, team: { shortName: "Juventus" }, goals: 16, assists: 3 },
      { player: { name: "Victor Osimhen" }, team: { shortName: "Napoli" }, goals: 15, assists: 3 }
    ]
  },
  CL: {
    competition: { id: 2001, name: "Champions League", code: "CL" },
    scorers: [
      { player: { name: "Kylian Mbappé" }, team: { shortName: "Real Madrid" }, goals: 8, assists: 2 },
      { player: { name: "Harry Kane" }, team: { shortName: "Bayern" }, goals: 8, assists: 3 },
      { player: { name: "Erling Haaland" }, team: { shortName: "Man City" }, goals: 6, assists: 1 }
    ]
  },
  WC: {
    competition: { id: 2000, name: "World Cup", code: "WC" },
    scorers: [
      { player: { name: "Lionel Messi" }, team: { shortName: "Argentina" }, goals: 7, assists: 3 },
      { player: { name: "Kylian Mbappé" }, team: { shortName: "France" }, goals: 8, assists: 2 },
      { player: { name: "Julián Álvarez" }, team: { shortName: "Argentina" }, goals: 4, assists: 1 },
      { player: { name: "Olivier Giroud" }, team: { shortName: "France" }, goals: 4, assists: 0 }
    ]
  }
};
