const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
const BASE_URL = "https://api.openweathermap.org";

const DEFAULT_PARAMS = { units: "metric", lang: "en" };

function getErrorMessage(status, notFoundMessage) {
  if (status === 401) {
    return "The API key is invalid. Check your .env file.";
  }

  if (status === 404) {
    return notFoundMessage;
  }

  if (status === 429) {
    return "Too many requests right now. Wait a moment and try again.";
  }

  return "Something went wrong with the weather service. Try again in a moment.";
}

async function fetchJson(path, params, notFoundMessage, signal) {
  if (!API_KEY) {
    throw new Error("API key missing. Create a .env file, see the README.");
  }

  const query = new URLSearchParams({ ...params, appid: API_KEY });

  let response;

  try {
    response = await fetch(`${BASE_URL}${path}?${query}`, { signal });
  } catch (error) {
    // Aborted requests are passed on so the caller can ignore them
    if (error.name === "AbortError") {
      throw error;
    }

    throw new Error(
      "Couldn't reach the weather service. Check your internet connection.",
    );
  }

  if (!response.ok) {
    throw new Error(getErrorMessage(response.status, notFoundMessage));
  }

  return response.json();
}

export function getWeatherByCity(city, signal) {
  return fetchJson(
    "/data/2.5/weather",
    { ...DEFAULT_PARAMS, q: city },
    "Couldn't find that city.",
    signal,
  );
}

export function getWeatherByCoordinates(latitude, longitude, signal) {
  return fetchJson(
    "/data/2.5/weather",
    { ...DEFAULT_PARAMS, lat: latitude, lon: longitude },
    "Couldn't get the weather for that location.",
    signal,
  );
}

export function getForecastByCoordinates(latitude, longitude, signal) {
  return fetchJson(
    "/data/2.5/forecast",
    { ...DEFAULT_PARAMS, lat: latitude, lon: longitude },
    "Couldn't get the forecast.",
    signal,
  );
}

export function getCitySuggestions(query, signal) {
  return fetchJson(
    "/geo/1.0/direct",
    { q: query, limit: 5 },
    "Couldn't get city suggestions.",
    signal,
  );
}
