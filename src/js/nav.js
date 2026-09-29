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
 * Replaces the no-JS "Menu" link (#nav-menu, opened by :target) with an identically styled
 * disclosure button, moving its children so the box does not change size (no layout shift).
 */
function upgradeToggle(doc, link) {
  const view = doc.defaultView;
  const button = doc.createElement('button');
  button.type = 'button';
  button.className = link.className;
  button.setAttribute('aria-controls', link.hash.slice(1));
  button.setAttribute('aria-expanded', String(view.location.hash === link.hash));
  button.append(...link.childNodes);
  link.replaceWith(button);
  // The button now owns the open state; drop a #nav-menu hash so :target cannot override it.
  if (view.location.hash === link.hash) {
    view.history.replaceState(null, '', view.location.pathname + view.location.search);
  }
  return button;
}

/**
 * Wires the mobile menu disclosure and moves focus to the section a nav link points at
 * (FR-024, FR-025).
 * @param {Document} [doc]
 */
export function initNav(doc = globalThis.document) {
  const menuLink = doc.querySelector('a.nav__toggle');
  if (!menuLink) return;
  const toggle = upgradeToggle(doc, menuLink);
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
}
