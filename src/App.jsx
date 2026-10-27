import { useEffect, useState } from "react";
import "./App.css";
import RecentSearches from "./components/RecentSearches";
import SearchForm from "./components/SearchForm";
import UnitToggle from "./components/UnitToggle";
import WeatherCard from "./components/WeatherCard";
import { useCitySuggestions } from "./hooks/useCitySuggestions";
import { useRecentSearches } from "./hooks/useRecentSearches";
import { useStoredState } from "./hooks/useStoredState";
import { useWeather } from "./hooks/useWeather";

function App() {
  const [city, setCity] = useState("");
  const [units, setUnits] = useStoredState("weather-app:units", "metric");

  const {
    weather,
    forecast,
    loading,
    error,
    searchByCity,
    searchByCoordinates,
    searchByCurrentLocation,
  } = useWeather();

  const { suggestions, requestSuggestions, clearSuggestions } =
    useCitySuggestions();

  const { recent, addRecent, clearRecent } = useRecentSearches();

  useEffect(() => {
    if (weather?.name) {
      addRecent({
        name: weather.name,
        lat: weather.coord.lat,
        lon: weather.coord.lon,
      });
    }
  }, [weather, addRecent]);

  function handleCityChange(value) {
    setCity(value);
    requestSuggestions(value);
  }

  function handleSubmit() {
    clearSuggestions();
    searchByCity(city);
  }

  function handleSuggestionSelect(suggestion) {
    setCity(suggestion.name);
    clearSuggestions();
    searchByCoordinates(suggestion.lat, suggestion.lon);
  }

  function handleRecentSelect(place) {
    setCity(place.name);
    clearSuggestions();
    searchByCoordinates(place.lat, place.lon);
  }

  function handleLocationClick() {
    clearSuggestions();
    searchByCurrentLocation();
  }

  return (
    <main className="container">
      <SearchForm
        city={city}
        suggestions={suggestions}
        onCityChange={handleCityChange}
        onSubmit={handleSubmit}
        onSelectSuggestion={handleSuggestionSelect}
      />

      <button
        type="button"
        className="location-button"
        onClick={handleLocationClick}>
        📍 Use my location
      </button>

      <div className="options-row">
        <RecentSearches
          places={recent}
          onSelect={handleRecentSelect}
          onClear={clearRecent}
        />

        <UnitToggle units={units} onChange={setUnits} />
      </div>

      <WeatherCard
        weather={weather}
        forecast={forecast}
        loading={loading}
        error={error}
        units={units}
      />
    </main>
  );
}

export default App;
