import { Goal, Award, ShieldAlert, CheckCircle, Flame } from "lucide-react";

interface EventTimelineProps {
  match: any;
}

export default function EventTimeline({ match }: EventTimelineProps) {
  const status = match.status;
  const isScheduled = ["SCHEDULED", "TIMED"].includes(status);

  if (isScheduled) {
    return (
      <div className="no-events-state" id="no-events">
        <p>Timeline events will appear here once the match begins.</p>
      </div>
    );
  }

  const homeScore = match.score?.fullTime?.home ?? 0;
  const awayScore = match.score?.fullTime?.away ?? 0;

  // Generate deterministic realistic events from the actual score
  const events: any[] = [];

  // Goal scorers names matching the teams
  const homeScorers = ["Rodrigo", "Martinez", "Silva", "Hernandez", "Bellingham"];
  const awayScorers = ["Mbappe", "Kane", "Vinicius", "Salah", "Lewandowski", "Haaland"];

  // Generate Home Goals
  for (let i = 0; i < homeScore; i++) {
    const minute = Math.floor(12 + i * 25 + ((match.homeTeam?.id || 1) % 10) * 2) % 90 || 15;
    events.push({
      minute,
      type: "GOAL",
      team: "HOME",
      player: homeScorers[i % homeScorers.length],
      detail: "Goal!"
    });
  }

  // Generate Away Goals
  for (let i = 0; i < awayScore; i++) {
    const minute = Math.floor(8 + i * 28 + ((match.awayTeam?.id || 2) % 10) * 3) % 90 || 28;
    events.push({
      minute,
      type: "GOAL",
      team: "AWAY",
      player: awayScorers[i % awayScorers.length],
      detail: "Goal!"
    });
  }

  // Add a card event if score is high or deterministic seed
  const totalScore = homeScore + awayScore;
  const seed = ((match.homeTeam?.id || 1) + (match.awayTeam?.id || 2)) % 10;

  if (seed > 4) {
    events.push({
      minute: 34 + (seed % 10),
      type: "CARD_YELLOW",
      team: "HOME",
      player: "Defender",
      detail: "Yellow Card"
    });
  }
  if (seed > 6) {
    events.push({
      minute: 72 + (seed % 15),
      type: "CARD_YELLOW",
      team: "AWAY",
      player: "Midfielder",
      detail: "Yellow Card"
    });
  }

  // Sort events chronologically
  events.sort((a, b) => a.minute - b.minute);

  return (
    <div className="event-timeline" id="event-timeline">
      <h4 className="section-subtitle">Timeline</h4>

      <div className="timeline-wrapper">
        <div className="timeline-node start">
          <div className="node-marker">0'</div>
          <div className="node-content">
            <span className="node-title">Match Kickoff</span>
          </div>
        </div>

        {events.length === 0 ? (
          <div className="timeline-node empty-node">
            <div className="node-marker">45'</div>
            <div className="node-content">
              <span className="node-title">Tactical Battle - Halftime</span>
            </div>
          </div>
        ) : (
          events.map((evt, idx) => {
            const isHome = evt.team === "HOME";
            return (
              <div key={idx} className={`timeline-node ${isHome ? "home-event" : "away-event"}`}>
                <div className="node-marker">{evt.minute}'</div>
                <div className="node-content">
                  <div className="node-icon-wrapper">
                    {evt.type === "GOAL" ? (
                      <Goal className="text-live" size={16} />
                    ) : (
                      <Award className="text-paused" size={16} />
                    )}
                  </div>
                  <div className="node-text-details">
                    <span className="node-player">{evt.player}</span>
                    <span className="node-event-type">{evt.detail}</span>
                    <span className="node-team-badge">
                      {isHome ? match.homeTeam?.shortName : match.awayTeam?.shortName}
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        )}

        <div className="timeline-node end">
          <div className="node-marker">90'</div>
          <div className="node-content">
            <span className="node-title">
              {status === "FINISHED" ? (
                <span className="flex items-center gap-1">
                  <CheckCircle size={14} className="text-finished inline" /> Full Time
                </span>
              ) : (
                <span className="flex items-center gap-1 text-live animate-pulse">
                  <Flame size={14} className="inline" /> In Progress
                </span>
              )}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
