interface StatusBadgeProps {
  status: string;
  minute?: number | null;
}

export default function StatusBadge({ status, minute }: StatusBadgeProps) {
  let badgeClass = "badge-scheduled";
  let label = status;

  switch (status) {
    case "IN_PLAY":
      badgeClass = "badge-live animate-pulse-badge";
      label = minute ? `${minute}'` : "LIVE";
      break;
    case "PAUSED":
      badgeClass = "badge-paused";
      label = "HT"; // Halftime
      break;
    case "FINISHED":
      badgeClass = "badge-finished";
      label = "FT"; // Fulltime
      break;
    case "SCHEDULED":
    case "TIMED":
      badgeClass = "badge-scheduled";
      label = "SCHEDULED";
      break;
    case "POSTPONED":
      badgeClass = "badge-paused";
      label = "POSTPONED";
      break;
    default:
      badgeClass = "badge-finished";
      label = status;
  }

  return (
    <span className={`status-badge ${badgeClass}`} id={`status-badge-${status}`}>
      {label}
    </span>
  );
}
