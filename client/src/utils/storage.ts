// Safe localStorage access helpers.

export function getStoredItem<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function setStoredItem<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Ignore storage quota or disabled storage errors
  }
}

export function removeStoredItem(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch {
    // Ignore storage errors
  }
}
