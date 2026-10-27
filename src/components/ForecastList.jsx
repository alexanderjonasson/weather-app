import {
  capitalize,
  formatDegrees,
  formatForecastDay,
  getWeatherIconUrl,
} from "../utils/format";

function ForecastList({ forecast, units }) {
  return (
    <section className="forecast-section">
      <h2>Next days</h2>

      <div className="forecast-grid">
        {forecast.map((day) => (
          <article className="forecast-card" key={day.date}>
            <h3>{formatForecastDay(day.date)}</h3>

            <img
              className="forecast-icon"
              src={getWeatherIconUrl(day.icon)}
              alt={day.description}
            />

            <p className="forecast-temp">
              {formatDegrees(day.maxTemp, units)} /{" "}
              {formatDegrees(day.minTemp, units)}
            </p>

            <p className="forecast-description">
              {capitalize(day.description)}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}

export default ForecastList;
