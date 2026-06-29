import { Search, X } from "lucide-react";

interface SearchBarProps {
  query: string;
  onChange: (val: string) => void;
  placeholder?: string;
}

export default function SearchBar({ query, onChange, placeholder }: SearchBarProps) {
  return (
    <div className="search-bar-container" id="search-bar-container">
      <div className="search-input-wrapper">
        <Search className="search-icon" size={18} />
        <input
          type="text"
          className="search-input"
          value={query}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder || "Search team, competition, status..."}
        />
        {query && (
          <button className="search-clear-btn" onClick={() => onChange("")} title="Clear search">
            <X size={16} />
          </button>
        )}
      </div>
    </div>
  );
}
