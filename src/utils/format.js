const regionNames = new Intl.DisplayNames(["en"], { type: "region" });

export function capitalize(text) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export function getCountryName(countryCode) {
  return regionNames.of(countryCode);
}

export function getWeatherIconUrl(iconCode) {
  return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
}

export function getWeatherClass(weatherId) {
  if (weatherId >= 200 && weatherId < 300) {
    return "weather-thunder";
  }

  if (weatherId >= 300 && weatherId < 600) {
    return "weather-rain";
  }

  if (weatherId >= 600 && weatherId < 700) {
    return "weather-snow";
  }

  if (weatherId >= 700 && weatherId < 800) {
    return "weather-mist";
  }

  if (weatherId === 800) {
    return "weather-clear";
  }

  if (weatherId > 800) {
    return "weather-clouds";
  }

  return "weather-default";
}

// Shifts the time to the city's local time, so read the values back as UTC.
function toLocalDate(unixTimestamp, timezoneOffset) {
  return new Date((unixTimestamp + timezoneOffset) * 1000);
}

export function formatTime(unixTimestamp, timezoneOffset) {
  return toLocalDate(unixTimestamp, timezoneOffset).toLocaleTimeString(
    "en-GB",
    {
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "UTC",
    },
  );
}

export function formatDate(unixTimestamp, timezoneOffset) {
  return toLocalDate(unixTimestamp, timezoneOffset).toLocaleDateString(
    "en-GB",
    {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
      timeZone: "UTC",
    },
  );
}

// Groups by day in the city's local time and returns the next three days
export function getThreeDayForecast(forecastData) {
  const { timezone } = forecastData.city;
  const groupedByDay = {};

  forecastData.list.forEach((item) => {
    const localDate = toLocalDate(item.dt, timezone);
    const day = localDate.toISOString().split("T")[0];

    if (!groupedByDay[day]) {
      groupedByDay[day] = [];
    }

    groupedByDay[day].push({ item, localHour: localDate.getUTCHours() });
  });

  const nextThreeDays = Object.keys(groupedByDay).slice(1, 4);

  return nextThreeDays.map((day) => {
    const entries = groupedByDay[day];

    const midday = entries.reduce((closest, entry) =>
      Math.abs(entry.localHour - 12) < Math.abs(closest.localHour - 12) ?
        entry
      : closest,
    ).item;

    const temperatures = entries.map(({ item }) => item.main.temp);

    return {
      date: day,
      minTemp: Math.min(...temperatures),
      maxTemp: Math.max(...temperatures),
      icon: midday.weather[0].icon,
      description: midday.weather[0].description,
    };
  });
}

export function formatForecastDay(dateString) {
  const date = new Date(`${dateString}T12:00:00Z`);

  return capitalize(
    date.toLocaleDateString("en-GB", { weekday: "long", timeZone: "UTC" }),
  );
}

export function convertTemperature(celsius, units) {
  return units === "imperial" ? (celsius * 9) / 5 + 32 : celsius;
}

export function formatTemperature(celsius, units) {
  const symbol = units === "imperial" ? "F" : "C";

  return `${Math.round(convertTemperature(celsius, units))}°${symbol}`;
}

export function formatDegrees(celsius, units) {
  return `${Math.round(convertTemperature(celsius, units))}°`;
}

export function formatWind(metersPerSecond, units) {
  if (units === "imperial") {
    return `${Math.round(metersPerSecond * 2.23694)} mph`;
  }

  return `${Math.round(metersPerSecond * 3.6)} km/h`;
}

export function formatVisibility(meters, units) {
  if (typeof meters !== "number") {
    return "–";
  }

  if (units === "imperial") {
    return `${Math.round(meters / 160.9344) / 10} mi`;
  }

  return `${Math.round(meters / 100) / 10} km`;
}
