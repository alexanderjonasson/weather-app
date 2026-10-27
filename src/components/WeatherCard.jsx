import {
  capitalize,
  formatDate,
  formatTemperature,
  formatTime,
  getWeatherClass,
  getWeatherIconUrl,
} from "../utils/format";
import ForecastList from "./ForecastList";
import WeatherDetails from "./WeatherDetails";

function getStatusMessage(loading, error, weather) {
  if (loading) {
    return "Loading the weather";
  }

  if (!error && weather) {
    return `Showing the weather for ${weather.name}`;
  }

  return "";
}

function WeatherCard({ weather, forecast, loading, error, units }) {
  const weatherClass =
    weather ? getWeatherClass(weather.weather[0].id) : "weather-default";

  let content;

  if (loading) {
    content = <h1>Loading the weather...</h1>;
  } else if (error) {
    content = (
      <p className="error-message" role="alert">
        {error}
      </p>
    );
  } else if (weather) {
    const [condition] = weather.weather;

    content = (
      <>
        <h1 className="city-name">{weather.name}</h1>

        <p className="temperature">
          {formatTemperature(weather.main.temp, units)}
        </p>

        <p className="feels-like">
          Feels like {formatTemperature(weather.main.feels_like, units)}
        </p>

        <p className="weather-description">
          {capitalize(condition.description)}
        </p>

        <img
          className="weather-icon"
          src={getWeatherIconUrl(condition.icon)}
          alt={condition.description}
        />

        <WeatherDetails weather={weather} units={units} />

        <div className="sun-times">
          <p>🌅 Sunrise {formatTime(weather.sys.sunrise, weather.timezone)}</p>

          <p>🌇 Sunset {formatTime(weather.sys.sunset, weather.timezone)}</p>
        </div>

        <p className="date">
          {capitalize(formatDate(weather.dt, weather.timezone))}
        </p>

        {forecast.length > 0 && (
          <ForecastList forecast={forecast} units={units} />
        )}
      </>
    );
  } else {
    content = <h1>Search for a city</h1>;
  }

  return (
    <div className={`card ${weatherClass}`}>
      {/* Not visible, but read out by screen readers */}
      <p className="visually-hidden" role="status">
        {getStatusMessage(loading, error, weather)}
      </p>

      {content}
    </div>
  );
}

export default WeatherCard;
