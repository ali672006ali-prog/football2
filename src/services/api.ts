const get = async (path: string) => {
  const r = await fetch(path);
  if (!r.ok) {
    throw new Error("API Error " + r.status);
  }
  return r.json();
};

export const API = {
  getLiveMatches: () => get("/api/matches?status=IN_PLAY"),

  getTodayMatches: () => get("/api/matches"),

  getMatchesByComp: (code: string) =>
    get(`/api/competitions/${code}/matches?status=IN_PLAY,PAUSED,FINISHED,SCHEDULED`),

  getStandings: (code: string) => get(`/api/competitions/${code}/standings`),

  getTopScorers: (code: string) => get(`/api/competitions/${code}/scorers`),

  getWorldCupMatches: () => get("/api/competitions/WC/matches"),

  getWorldCupGroups: () => get("/api/competitions/WC/standings"),

  getWorldCupScorers: () => get("/api/competitions/WC/scorers"),

  getTeamMatches: (id: string | number) =>
    get(`/api/teams/${id}/matches?status=SCHEDULED,IN_PLAY,FINISHED`)
};
