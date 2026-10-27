import { formatVisibility, formatWind } from "../utils/format";

function WeatherDetails({ weather, units }) {
  const details = [
    { label: "Humidity", value: `${weather.main.humidity}%` },
    { label: "Wind", value: formatWind(weather.wind.speed, units) },
    { label: "Pressure", value: `${weather.main.pressure} hPa` },
    { label: "Visibility", value: formatVisibility(weather.visibility, units) },
  ];

  return (
    <dl className="weather-details">
      {details.map(({ label, value }) => (
        <div className="detail-item" key={label}>
          <dt>{label}</dt>
          <dd>{value}</dd>
        </div>
      ))}
    </dl>
  );
}

export default WeatherDetails;
