const REDUCED_MOTION = '(prefers-reduced-motion: reduce)';
// A huge top margin treats every entry already scrolled past as intersecting, so a fast jump
// down the page can never leave an entry hidden (edge case "scrolling fast past the timeline").
const OBSERVER_OPTIONS = { rootMargin: '100000px 0px 0px 0px', threshold: 0.15 };

/**
 * Whether the scroll-in animation should run at all.
 * @param {{ hasObserver: boolean, prefersReducedMotion: boolean }} capabilities
 * @returns {boolean}
 */
export function shouldReveal({ hasObserver, prefersReducedMotion }) {
  return hasObserver && !prefersReducedMotion;
}

/**
 * Whether an element starting at `rectTop` is still below the visible viewport.
 * @param {number} rectTop
 * @param {number} viewportHeight
 * @returns {boolean}
 */
export function isBelowViewport(rectTop, viewportHeight) {
  return rectTop >= viewportHeight;
}

/**
 * Hides timeline entries that are below the fold and fades them in as they arrive
 * (FR-013, FR-013a). Entries are visible by default; only this script can hide them, and only
 * after it has set up the observer that will reveal them again.
 * @param {Document} [doc]
 */
export function initReveal(doc = globalThis.document) {
  const view = doc.defaultView;
  const capabilities = {
    hasObserver: 'IntersectionObserver' in view,
    prefersReducedMotion: view.matchMedia(REDUCED_MOTION).matches,
  };
  if (!shouldReveal(capabilities)) return;

  const pending = [...doc.querySelectorAll('.timeline__entry')].filter((entry) =>
    isBelowViewport(entry.getBoundingClientRect().top, view.innerHeight),
  );
  const observer = new view.IntersectionObserver((records) => {
    for (const record of records) {
      if (!record.isIntersecting) continue;
      record.target.dataset.reveal = 'visible';
      observer.unobserve(record.target);
    }
  }, OBSERVER_OPTIONS);

  for (const entry of pending) {
    entry.dataset.reveal = 'pending';
    observer.observe(entry);
  }
}
