import { useState } from "react";
import { getCountryName } from "../utils/format";

function formatLocation(suggestion) {
  const country = getCountryName(suggestion.country);

  return suggestion.state ? `${suggestion.state}, ${country}` : country;
}

function SearchForm({
  city,
  suggestions,
  onCityChange,
  onSubmit,
  onSelectSuggestion,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const showSuggestions = isOpen && suggestions.length > 0;
  const activeSuggestion = showSuggestions ? suggestions[activeIndex] : null;

  function closeSuggestions() {
    setIsOpen(false);
    setActiveIndex(-1);
  }

  function handleChange(event) {
    onCityChange(event.target.value);
    setIsOpen(true);
    setActiveIndex(-1);
  }

  function handleSelect(suggestion) {
    closeSuggestions();
    onSelectSuggestion(suggestion);
  }

  function handleSubmit(event) {
    event.preventDefault();
    closeSuggestions();
    onSubmit();
  }

  function handleKeyDown(event) {
    if (event.key === "Escape") {
      closeSuggestions();
      return;
    }

    if (!showSuggestions) {
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((index) => (index + 1) % suggestions.length);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((index) =>
        index <= 0 ? suggestions.length - 1 : index - 1,
      );
    } else if (event.key === "Enter" && activeSuggestion) {
      event.preventDefault();
      handleSelect(activeSuggestion);
    }
  }

  return (
    <form className="weather-form" onSubmit={handleSubmit}>
      <div className="input-wrapper">
        <label htmlFor="city-input" className="visually-hidden">
          Search for a city
        </label>

        <input
          id="city-input"
          type="text"
          className="city-input"
          placeholder="Search for a city"
          value={city}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onBlur={closeSuggestions}
          autoComplete="off"
          role="combobox"
          aria-autocomplete="list"
          aria-expanded={showSuggestions}
          aria-controls={showSuggestions ? "city-suggestions" : undefined}
          aria-activedescendant={
            activeSuggestion ? `suggestion-${activeIndex}` : undefined
          }
        />

        {/* onMouseDown below keeps focus in the input when clicking the list */}
        {showSuggestions && (
          <ul
            id="city-suggestions"
            className="suggestions"
            role="listbox"
            aria-label="City suggestions"
            onMouseDown={(event) => event.preventDefault()}>
            {suggestions.map((suggestion, index) => (
              <li
                key={`${suggestion.lat}-${suggestion.lon}`}
                id={`suggestion-${index}`}
                className="suggestion-item"
                role="option"
                aria-selected={index === activeIndex}
                onClick={() => handleSelect(suggestion)}>
                <span className="suggestion-name">{suggestion.name}</span>

                <span className="suggestion-location">
                  {formatLocation(suggestion)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <button type="submit" className="search-button">
        Show weather
      </button>
    </form>
  );
}

export default SearchForm;
