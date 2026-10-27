import assert from "node:assert/strict";
import { describe, test } from "node:test";
import {
  capitalize,
  convertTemperature,
  formatDate,
  formatDegrees,
  formatForecastDay,
  formatTemperature,
  formatTime,
  formatVisibility,
  formatWind,
  getThreeDayForecast,
  getWeatherClass,
} from "./format.js";

describe("capitalize", () => {
  test("capitalizes the first letter only", () => {
    assert.equal(capitalize("light rain"), "Light rain");
    assert.equal(capitalize(""), "");
  });
});

describe("getWeatherClass", () => {
  test("maps OpenWeather condition ids to a class", () => {
    assert.equal(getWeatherClass(211), "weather-thunder");
    assert.equal(getWeatherClass(301), "weather-rain");
    assert.equal(getWeatherClass(502), "weather-rain");
    assert.equal(getWeatherClass(601), "weather-snow");
    assert.equal(getWeatherClass(741), "weather-mist");
    assert.equal(getWeatherClass(800), "weather-clear");
    assert.equal(getWeatherClass(803), "weather-clouds");
    assert.equal(getWeatherClass(0), "weather-default");
  });
});

describe("formatTime and formatDate", () => {
  test("shifts the time to the city's local time", () => {
    assert.equal(formatTime(0, 0), "00:00");
    assert.equal(formatTime(0, 3600), "01:00");
    assert.equal(formatTime(0, -5 * 3600), "19:00");
  });

  test("the date can roll over to the next or previous day", () => {
    assert.match(formatDate(0, 0), /1 January 1970/);
    assert.match(formatDate(23 * 3600, 2 * 3600), /2 January 1970/);
    assert.match(formatDate(3600, -2 * 3600), /31 December 1969/);
  });

  test("formats a forecast day as a weekday", () => {
    assert.equal(formatForecastDay("2024-01-01"), "Monday");
  });
});

describe("temperature, wind and visibility", () => {
  test("converts Celsius to Fahrenheit", () => {
    assert.equal(convertTemperature(0, "imperial"), 32);
    assert.equal(convertTemperature(100, "imperial"), 212);
    assert.equal(convertTemperature(21, "metric"), 21);
  });

  test("formats temperatures with and without the unit", () => {
    assert.equal(formatTemperature(20.4, "metric"), "20°C");
    assert.equal(formatTemperature(20, "imperial"), "68°F");
    assert.equal(formatDegrees(-3.6, "metric"), "-4°");
  });

  test("converts wind speed from m/s", () => {
    assert.equal(formatWind(10, "metric"), "36 km/h");
    assert.equal(formatWind(10, "imperial"), "22 mph");
  });

  test("formats visibility and handles missing data", () => {
    assert.equal(formatVisibility(10000, "metric"), "10 km");
    assert.equal(formatVisibility(2500, "metric"), "2.5 km");
    assert.equal(formatVisibility(10000, "imperial"), "6.2 mi");
    assert.equal(formatVisibility(undefined, "metric"), "–");
  });
});

describe("getThreeDayForecast", () => {
  const START = Date.UTC(2024, 0, 1) / 1000;
  const THREE_HOURS = 3 * 3600;

  function buildForecast(timezone) {
    const list = Array.from({ length: 40 }, (_, index) => ({
      dt: START + index * THREE_HOURS,
      main: { temp: index },
      weather: [{ icon: `icon-${index}`, description: `desc-${index}` }],
    }));

    return { city: { timezone }, list };
  }

  test("skips today and returns the next three days", () => {
    const days = getThreeDayForecast(buildForecast(0));

    assert.equal(days.length, 3);
    assert.deepEqual(
      days.map((day) => day.date),
      ["2024-01-02", "2024-01-03", "2024-01-04"],
    );
  });

  test("calculates min and max temperature for each day", () => {
    const [firstDay] = getThreeDayForecast(buildForecast(0));

    assert.equal(firstDay.minTemp, 8);
    assert.equal(firstDay.maxTemp, 15);
  });

  test("uses the entry closest to midday for icon and description", () => {
    const [firstDay] = getThreeDayForecast(buildForecast(0));

    assert.equal(firstDay.icon, "icon-12");
    assert.equal(firstDay.description, "desc-12");
  });

  test("groups days by the city's local time", () => {
    const [firstDay] = getThreeDayForecast(buildForecast(6 * 3600));

    assert.equal(firstDay.date, "2024-01-02");
    assert.equal(firstDay.minTemp, 6);
    assert.equal(firstDay.maxTemp, 13);
  });
});
