const COLLAPSE_BELOW_EM = 48;
// Media-query ems are relative to the browser's initial font size, not the page's.
const MEDIA_EM_PX = 16;

/**
 * Whether the primary navigation collapses behind the Menu button at this width.
 * @param {number} viewportWidthEm
 * @returns {boolean}
 */
export function shouldCollapse(viewportWidthEm) {
  return viewportWidthEm < COLLAPSE_BELOW_EM;
}

function focusTarget(doc, hash) {
  const target = hash ? doc.getElementById(decodeURIComponent(hash.slice(1))) : null;
  if (!target) return;
  // After the default jump starts, move focus without interrupting the (smooth) scroll.
  doc.defaultView.requestAnimationFrame(() => target.focus({ preventScroll: true }));
}

/**
 * Wires the mobile menu disclosure and moves focus to the section a nav link points at
 * (FR-024, FR-025). The list only collapses once this reveals the Menu button (see CSS).
 * @param {Document} [doc]
 */
export function initNav(doc = globalThis.document) {
  const toggle = doc.querySelector('.nav__toggle');
  if (!toggle) return;
  const view = doc.defaultView;
  const isOpen = () => toggle.getAttribute('aria-expanded') === 'true';
  const setOpen = (open) => toggle.setAttribute('aria-expanded', String(open));

  toggle.addEventListener('click', () => setOpen(!isOpen()));
  doc.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape' || !isOpen()) return;
    setOpen(false);
    toggle.focus();
  });
  view.addEventListener('resize', () => {
    if (!shouldCollapse(view.innerWidth / MEDIA_EM_PX)) setOpen(false);
  });
  for (const link of doc.querySelectorAll('.nav__link, .site-header__brand')) {
    link.addEventListener('click', () => {
      setOpen(false);
      focusTarget(doc, link.hash);
    });
  }
  toggle.hidden = false;
}
