import { useEffect, useRef, useState } from "react";
import {
  getForecastByCoordinates,
  getWeatherByCity,
  getWeatherByCoordinates,
} from "../api/weather";
import { getThreeDayForecast } from "../utils/format";
import { getCurrentPosition } from "../utils/geolocation";

async function loadByCoordinates(latitude, longitude, signal) {
  const [weatherData, forecastData] = await Promise.all([
    getWeatherByCoordinates(latitude, longitude, signal),
    getForecastByCoordinates(latitude, longitude, signal),
  ]);

  return { weatherData, forecastData };
}

export function useWeather() {
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // A new search aborts the previous one, so a late response cannot overwrite a newer one
  const controllerRef = useRef(null);

  useEffect(() => {
    return () => controllerRef.current?.abort();
  }, []);

  async function runSearch(load) {
    controllerRef.current?.abort();

    const controller = new AbortController();
    controllerRef.current = controller;

    setLoading(true);
    setError("");

    try {
      const { weatherData, forecastData } = await load(controller.signal);

      setWeather(weatherData);
      setForecast(getThreeDayForecast(forecastData));
    } catch (error) {
      // The aborted search has been replaced by a newer one and should show nothing
      if (error.name === "AbortError") {
        return;
      }

      setWeather(null);
      setForecast([]);
      setError(error.message);
    } finally {
      if (controllerRef.current === controller) {
        setLoading(false);
      }
    }
  }

  function searchByCity(city) {
    const cityName = city.trim();

    if (!cityName) {
      setError("Enter a city.");
      return;
    }

    runSearch(async (signal) => {
      const weatherData = await getWeatherByCity(cityName, signal);
      const forecastData = await getForecastByCoordinates(
        weatherData.coord.lat,
        weatherData.coord.lon,
        signal,
      );

      return { weatherData, forecastData };
    });
  }

  function searchByCoordinates(latitude, longitude) {
    runSearch((signal) => loadByCoordinates(latitude, longitude, signal));
  }

  function searchByCurrentLocation() {
    runSearch(async (signal) => {
      const { coords } = await getCurrentPosition();

      return loadByCoordinates(coords.latitude, coords.longitude, signal);
    });
  }

  return {
    weather,
    forecast,
    loading,
    error,
    searchByCity,
    searchByCoordinates,
    searchByCurrentLocation,
  };
}
