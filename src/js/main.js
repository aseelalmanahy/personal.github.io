import { initNav } from './nav.js';
import { initScrollSpy } from './scroll-spy.js';
import { initThemeToggle } from './theme.js';

for (const init of [initThemeToggle, initNav, initScrollSpy]) {
  try {
    init();
  } catch {
    // Each feature is isolated so one failure cannot disable the others; the page itself
    // never depends on scripting (FR-035).
  }
}
