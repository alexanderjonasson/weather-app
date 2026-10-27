# Weather App

A weather app built with React and Vite. Search for a city (with autocomplete) or use your current location to see the current weather and a forecast for the next three days.

By [Alexander Jonasson](https://github.com/alexanderjonasson).

## Features

- City search with suggestions as you type (debounce and aborted requests)
- Weather for your current location via the browser's geolocation
- Temperature, "feels like", conditions, humidity, wind, pressure, visibility, and sunrise and sunset in the city's local time
- Forecast for the next three days (high/low temperature)
- Switch between °C and °F, remembered between visits
- Recent searches, saved in `localStorage`
- The background changes with the type of weather
- Clear error messages (unknown city, invalid API key, too many requests, no internet connection)
- Responsive design and keyboard support in the search field (arrow keys, Enter, Escape)
- Unit tests for the formatting and forecast logic

## Tech stack

- React 19 (hooks)
- Vite
- [OpenWeather API](https://openweathermap.org/api) (Current Weather, 5 Day Forecast, Geocoding)
- Oxlint
- Node.js built-in test runner (`node --test`)

## Getting started

You need Node.js and a free API key from [OpenWeather](https://openweathermap.org/api).

```bash
git clone https://github.com/alexanderjonasson/weather-app.git
cd weather-app
npm install
```

Create a `.env` file based on `.env.example` and add your key:

```
VITE_OPENWEATHER_API_KEY=your_key_here
```

Start the development server:

```bash
npm run dev
```

Other commands: `npm run build`, `npm run preview`, `npm run lint` and `npm test`.

## Project structure

```
src/
  api/weather.js               Requests to OpenWeather and error handling
  utils/format.js              Time/date and unit formatting, weather classes, forecast grouping
  utils/format.test.js         Tests for the formatting and forecast logic
  utils/geolocation.js         Gets the user's position
  utils/storage.js             Safe localStorage helpers
  hooks/useWeather.js          State and searches for weather and forecast
  hooks/useCitySuggestions.js  Debounce and aborting for city suggestions
  hooks/useStoredState.js      State that is saved to localStorage
  hooks/useRecentSearches.js   Recent searches (max five, no duplicates)
  components/
    SearchForm.jsx             Search field with city suggestions (combobox)
    RecentSearches.jsx         Quick links to recent searches
    UnitToggle.jsx             °C / °F switch
    WeatherCard.jsx            The main card
    WeatherDetails.jsx         Humidity, wind, pressure and visibility
    ForecastList.jsx           The three-day forecast
  App.jsx                      Puts the app together
```

## About the API key

The app runs entirely in the browser, and every `VITE_` variable ends up in the public JavaScript bundle. That means anyone who opens the published site can read the key. The key is free and tied to an account without payment details, but for a real product the requests should go through your own backend or a serverless function that keeps the key secret.

## Possible improvements

- A serverless function as a proxy for the API requests
- Hourly forecast
- Saved favourite cities
- Migrate to TypeScript
