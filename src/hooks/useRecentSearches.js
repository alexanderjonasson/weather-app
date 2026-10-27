import { useCallback } from "react";
import { useStoredState } from "./useStoredState";

const STORAGE_KEY = "weather-app:recent-searches";
const MAX_RECENT = 5;

export function useRecentSearches() {
  const [stored, setStored] = useStoredState(STORAGE_KEY, []);
  const recent = Array.isArray(stored) ? stored : [];

  const addRecent = useCallback(
    (place) => {
      setStored((current) => {
        const list = Array.isArray(current) ? current : [];
        const others = list.filter((item) => item.name !== place.name);

        return [place, ...others].slice(0, MAX_RECENT);
      });
    },
    [setStored],
  );

  function clearRecent() {
    setStored([]);
  }

  return { recent, addRecent, clearRecent };
}
