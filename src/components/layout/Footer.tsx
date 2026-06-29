import { Activity, Shield } from "lucide-react";

export default function Footer() {
  return (
    <footer className="app-footer" id="app-footer">
      <div className="footer-container">
        <div className="footer-brand">
          <div className="footer-logo flex items-center gap-2">
            <div className="w-6 h-6 bg-[#f59e0b] rounded flex items-center justify-center font-bold text-black text-sm">G</div>
            <span className="text-md font-bold tracking-tight text-[#f0f4f8]">GOALFLUX</span>
          </div>
          <p className="footer-description">
            Immersive real-time sports updates, live scores, tournament brackets, and premium statistics.
          </p>
        </div>

        <div className="footer-status">
          <div className="status-indicator">
            <span className="status-dot"></span>
            <span className="status-text">Upstream API: Live & Connected</span>
          </div>
          <div className="footer-copyright">
            &copy; {new Date().getFullYear()} GoalFlux Sports Media. Powered by football-data.org.
          </div>
        </div>
      </div>
    </footer>
  );
}
