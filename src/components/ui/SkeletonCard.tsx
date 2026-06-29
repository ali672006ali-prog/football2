export default function SkeletonCard() {
  return (
    <div className="skeleton-card" id="skeleton-card">
      <div className="skeleton-header">
        <div className="skeleton-circle shimmer"></div>
        <div className="skeleton-text-short shimmer"></div>
      </div>
      <div className="skeleton-teams">
        <div className="skeleton-team-row">
          <div className="skeleton-circle shimmer"></div>
          <div className="skeleton-text-medium shimmer"></div>
        </div>
        <div className="skeleton-team-row">
          <div className="skeleton-circle shimmer"></div>
          <div className="skeleton-text-medium shimmer"></div>
        </div>
      </div>
      <div className="skeleton-footer">
        <div className="skeleton-text-short shimmer"></div>
        <div className="skeleton-text-tiny shimmer"></div>
      </div>
    </div>
  );
}

export function SkeletonTable() {
  return (
    <div className="skeleton-table" id="skeleton-table">
      <div className="skeleton-table-header shimmer"></div>
      {Array.from({ length: 10 }).map((_, idx) => (
        <div key={idx} className="skeleton-table-row">
          <div className="skeleton-col-tiny shimmer"></div>
          <div className="skeleton-col-circle shimmer"></div>
          <div className="skeleton-col-large shimmer"></div>
          <div className="skeleton-col-medium shimmer"></div>
          <div className="skeleton-col-small shimmer"></div>
        </div>
      ))}
    </div>
  );
}
