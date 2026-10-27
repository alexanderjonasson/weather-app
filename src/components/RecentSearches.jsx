function RecentSearches({ places, onSelect, onClear }) {
  if (places.length === 0) {
    return <div className="recent-searches" />;
  }

  return (
    <div className="recent-searches">
      <span className="recent-label">Recent</span>

      <ul className="recent-list">
        {places.map((place) => (
          <li key={place.name}>
            <button
              type="button"
              className="recent-button"
              onClick={() => onSelect(place)}>
              {place.name}
            </button>
          </li>
        ))}
      </ul>

      <button type="button" className="clear-button" onClick={onClear}>
        Clear
      </button>
    </div>
  );
}

export default RecentSearches;
