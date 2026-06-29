import { Trophy, Star, ShieldAlert } from "lucide-react";

export default function WCHero() {
  return (
    <div className="wc-hero-banner" id="wc-hero-banner">
      <div className="wc-hero-overlay"></div>
      <div className="wc-hero-content">
        <div className="wc-hero-badge">
          <Star className="text-gold" size={16} fill="#f59e0b" />
          <span className="text-gold font-bold uppercase tracking-wider text-xs">FIFA World Cup</span>
          <Star className="text-gold" size={16} fill="#f59e0b" />
        </div>
        <h1 className="wc-hero-title">
          WORLD CUP <span className="text-gold">UNITED 2026</span>
        </h1>
        <p className="wc-hero-subtitle">
          The greatest sporting event on Earth, hosted across three vibrant North American nations.
        </p>

        <div className="host-nations-grid">
          <div className="host-card">
            <span className="host-flag">🇺🇸</span>
            <div className="host-info">
              <span className="host-name">United States</span>
              <span className="host-role">Main Host</span>
            </div>
          </div>
          <div className="host-card">
            <span className="host-flag">🇨🇦</span>
            <div className="host-info">
              <span className="host-name">Canada</span>
              <span className="host-role">Host Nation</span>
            </div>
          </div>
          <div className="host-card">
            <span className="host-flag">🇲🇽</span>
            <div className="host-info">
              <span className="host-name">Mexico</span>
              <span className="host-role">Host Nation</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
