import { useEffect, useRef, useState } from "react";
import { getCitySuggestions } from "../api/weather";

const DEBOUNCE_MS = 400;
const MIN_QUERY_LENGTH = 3;

export function useCitySuggestions() {
  const [suggestions, setSuggestions] = useState([]);

  // Refs because the timer and the request should not cause a re-render
  const timeoutRef = useRef(null);
  const controllerRef = useRef(null);

  function cancelPending() {
    clearTimeout(timeoutRef.current);
    controllerRef.current?.abort();
  }

  useEffect(() => cancelPending, []);

  function clearSuggestions() {
    cancelPending();
    setSuggestions([]);
  }

  function requestSuggestions(value) {
    cancelPending();

    const query = value.trim();

    if (query.length < MIN_QUERY_LENGTH) {
      setSuggestions([]);
      return;
    }

    timeoutRef.current = setTimeout(async () => {
      const controller = new AbortController();
      controllerRef.current = controller;

      try {
        setSuggestions(await getCitySuggestions(query, controller.signal));
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error(error.message);
        }
      }
    }, DEBOUNCE_MS);
  }

  return { suggestions, requestSuggestions, clearSuggestions };
}
