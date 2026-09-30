/**
 * Reads a saved preference.
 * @param {string} key
 * @param {Storage} [store] Defaults to `localStorage`.
 * @returns {string | null} The value, or null when missing, blocked, or unavailable.
 */
export function readPreference(key, store) {
  try {
    return (store ?? globalThis.localStorage).getItem(key);
  } catch {
    return null;
  }
}

/**
 * Saves a preference without ever throwing (private browsing and disabled storage are normal).
 * @param {string} key
 * @param {string} value
 * @param {Storage} [store] Defaults to `localStorage`.
 * @returns {boolean} Whether the value was saved.
 */
export function writePreference(key, value, store) {
  try {
    (store ?? globalThis.localStorage).setItem(key, value);
    return true;
  } catch {
    return false;
  }
}
