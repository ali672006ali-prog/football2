import { NavLink } from "react-router-dom";
import { Trophy, Flame, Calendar, Compass } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="app-navbar" id="app-navbar">
      <div className="navbar-container">
        <NavLink to="/" className="navbar-logo flex items-center gap-2">
          <div className="w-8 h-8 bg-[#f59e0b] rounded flex items-center justify-center font-bold text-black text-xl">G</div>
          <span className="text-xl font-bold tracking-tight text-[#f0f4f8]">GOALFLUX</span>
        </NavLink>

        <div className="navbar-links">
          <NavLink
            to="/"
            className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
            id="nav-link-home"
          >
            <Calendar size={18} />
            <span>Matches</span>
          </NavLink>

          <NavLink
            to="/competitions"
            className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
            id="nav-link-competitions"
          >
            <Compass size={18} />
            <span>Leagues</span>
          </NavLink>

          <NavLink
            to="/worldcup"
            className={({ isActive }) => (isActive ? "nav-link active wc-link" : "nav-link wc-link")}
            id="nav-link-wc"
          >
            <Trophy className="text-gold" size={18} />
            <span className="text-gold font-bold">World Cup</span>
          </NavLink>
        </div>
      </div>
    </nav>
  );
}
