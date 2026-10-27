// localStorage can be unavailable (private mode, blocked site data), so
// every read and write is wrapped and falls back to the default value.
export function readStorage(key, fallback) {
  try {
    const stored = localStorage.getItem(key);

    return stored === null ? fallback : JSON.parse(stored);
  } catch {
    return fallback;
  }
}

export function writeStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Not saving is fine, the app still works
  }
}
