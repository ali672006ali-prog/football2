import { AlertTriangle, RefreshCw } from "lucide-react";

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export default function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div className="error-state-container" id="error-state">
      <div className="error-card">
        <AlertTriangle size={48} className="error-icon text-orange" />
        <h3 className="error-title">Failed to Load Live Data</h3>
        <p className="error-message">
          {message || "We encountered a rate limit or network issue. The API allows 10 requests per minute. Please try again shortly."}
        </p>
        {onRetry && (
          <button className="error-retry-btn" onClick={onRetry}>
            <RefreshCw size={16} />
            <span>Retry Connection</span>
          </button>
        )}
      </div>
    </div>
  );
}
