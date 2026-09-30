import { readPreference, writePreference } from './storage.js';

const STORAGE_KEY = 'theme';
const DARK_QUERY = '(prefers-color-scheme: dark)';
const SWITCH_MS = 300;

/**
 * The theme in effect: a valid saved choice wins; otherwise the device preference.
 * @param {string | null} saved
 * @param {boolean} prefersDark
 * @returns {'light' | 'dark'}
 */
export function resolveEffectiveTheme(saved, prefersDark) {
  if (saved === 'light' || saved === 'dark') return saved;
  return prefersDark ? 'dark' : 'light';
}

/**
 * The theme a toggle switches to.
 * @param {'light' | 'dark'} effective
 * @returns {'light' | 'dark'}
 */
export function nextTheme(effective) {
  return effective === 'dark' ? 'light' : 'dark';
}

function applyTheme(doc, theme) {
  const root = doc.documentElement;
  const view = doc.defaultView;
  // Enables the colour transition only for this switch, never on page load (research R-05).
  root.setAttribute('data-theme-switching', '');
  root.dataset.theme = theme;
  // Colours live only in tokens.css (Principle III), so read the new background from there.
  const background = view.getComputedStyle(root).getPropertyValue('--color-bg').trim();
  for (const meta of doc.querySelectorAll('meta[name="theme-color"]')) {
    meta.content = background;
  }
  view.setTimeout(() => root.removeAttribute('data-theme-switching'), SWITCH_MS);
}

/**
 * Reveals and wires the two-state theme toggle (FR-030, FR-031).
 * @param {Document} [doc]
 */
export function initThemeToggle(doc = globalThis.document) {
  const button = doc.querySelector('.theme-toggle');
  if (!button) return;
  const media = doc.defaultView.matchMedia(DARK_QUERY);
  // Kept in memory too, so the toggle still works for this visit when storage is blocked.
  let saved = readPreference(STORAGE_KEY);

  const sync = () => {
    const effective = resolveEffectiveTheme(saved, media.matches);
    button.setAttribute('aria-pressed', String(effective === 'dark'));
  };

  button.addEventListener('click', () => {
    saved = nextTheme(resolveEffectiveTheme(saved, media.matches));
    writePreference(STORAGE_KEY, saved);
    applyTheme(doc, saved);
    sync();
  });
  // Without a saved choice the page follows the device; CSS repaints, this updates the state.
  media.addEventListener('change', sync);

  sync();
  button.hidden = false;
}
