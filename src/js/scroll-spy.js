const SECTION_IDS = ['about', 'experience', 'interests', 'contact'];

/**
 * The section to mark as current: among intersecting sections, the one whose top has most
 * recently entered the watched band (smallest non-negative top); if every one started above
 * the band, the latest of them (the section being read).
 * @param {Array<{ target: { id: string }, isIntersecting: boolean,
 *   boundingClientRect: { top: number } }>} entries
 * @returns {string | null}
 */
export function pickActiveSection(entries) {
  const visible = entries.filter((entry) => entry.isIntersecting);
  if (visible.length === 0) return null;
  const tops = visible.map((entry) => ({ id: entry.target.id, top: entry.boundingClientRect.top }));
  const entering = tops.filter(({ top }) => top >= 0).sort((a, b) => a.top - b.top);
  if (entering.length > 0) return entering[0].id;
  return tops.sort((a, b) => b.top - a.top)[0].id;
}

function markCurrent(doc, id) {
  for (const link of doc.querySelectorAll('.nav__link')) {
    if (id && link.hash === `#${id}`) link.setAttribute('aria-current', 'true');
    else link.removeAttribute('aria-current');
  }
}

/**
 * Marks the nav link of the section in the upper part of the viewport with
 * `aria-current="true"` (FR-026). No link is marked while the hero is in view.
 * @param {Document} [doc]
 */
export function initScrollSpy(doc = globalThis.document) {
  const view = doc.defaultView;
  const sections = SECTION_IDS.map((id) => doc.getElementById(id)).filter(Boolean);
  const header = doc.querySelector('.site-header');
  if (!('IntersectionObserver' in view) || sections.length === 0 || !header) return;

  const intersecting = new Set();
  const observer = new view.IntersectionObserver(
    (records) => {
      for (const record of records) {
        if (record.isIntersecting) intersecting.add(record.target);
        else intersecting.delete(record.target);
      }
      // Re-measure live so sections that did not change state still compare correctly.
      const current = [...intersecting].map((target) => ({
        target,
        isIntersecting: true,
        boundingClientRect: target.getBoundingClientRect(),
      }));
      markCurrent(doc, pickActiveSection(current));
    },
    // Watch the band between the bottom of the bar and 45% down the viewport.
    { rootMargin: `-${Math.round(header.offsetHeight)}px 0px -55% 0px` },
  );
  for (const section of sections) observer.observe(section);
}
