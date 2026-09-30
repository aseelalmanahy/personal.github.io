# Contract: Client Behaviour

The attributes, storage, module interfaces, and timings that CSS, JavaScript, and tests share.
Research references: R-02 – R-06, R-12 – R-17.

## Document-level attributes (`<html>`)

| Attribute | Values | Set by | Consumed by |
|---|---|---|---|
| `class` | `no-js` (shipped) → `js` | inline bootstrap | CSS: under `.js` the phone menu is collapsed from first paint (no layout shift); under `.no-js` links wrap in the bar and anchors get a larger scroll offset |
| `data-theme` | absent \| `light` \| `dark` | bootstrap (saved value), `theme.js` (toggle) | `tokens.css` |
| `data-theme-switching` | present for 300ms after a toggle | `theme.js` | `base.css` colour transitions |

After a toggle, `theme.js` sets both `meta[name="theme-color"]` `content` values to the current
`--color-bg`, read with `getComputedStyle` — JavaScript never contains colour literals
(constitution Principle III). JS-only controls ship with the `hidden` attribute, which
`utilities.css` enforces with `[hidden] { display: none !important; }`.

## Persistence

| Key | Values | Notes |
|---|---|---|
| `localStorage["theme"]` | `"light"` \| `"dark"` | Only key the site writes. Absent = follow device. All access via `storage.js` (never throws). |

No cookies, no network requests, no other storage.

## JS hooks and ARIA states

| Element | Hook | States / attributes managed |
|---|---|---|
| Theme toggle | `button.theme-toggle` | `hidden` removed on init; `aria-pressed` = effective theme is dark |
| Menu control | `a.nav__toggle[href="#nav-menu"]` → `button.nav__toggle` | Ships as a link (opens via `:target` if the module fails); `nav.js` replaces it with a button carrying `aria-expanded` and `aria-controls="nav-menu"`, clearing a `#nav-menu` hash |
| Nav links | `.nav__list a` | `aria-current="true"` on the active section's link |
| Copy button | `[data-js="copy-email"]` | `hidden` removed when Clipboard API exists |
| Copy status | `[data-js="copy-email-status"]` (`role="status"`) | text: "", "Copied!", or "Couldn't copy — please select the address above" |
| Sections | `main > section[id]` | receive focus (`tabindex="-1"`) after nav activation |

CSS may style these states; it must not introduce other JS-set classes.

## Module interfaces (`src/js/`)

Pure helpers are DOM-free and unit-tested; `init*` functions take the document (default
`globalThis.document`) and return nothing.

| Module | Exports |
|---|---|
| `storage.js` | `readPreference(key, store?) → string \| null`; `writePreference(key, value, store?) → boolean` |
| `theme.js` | `resolveEffectiveTheme(saved, prefersDark) → 'light' \| 'dark'`; `nextTheme(effective) → 'light' \| 'dark'`; `initThemeToggle(doc?)` |
| `nav.js` | `shouldCollapse(viewportWidthEm) → boolean`; `initNav(doc?)` (menu disclosure, Escape, close-on-choose, focus target section) |
| `scroll-spy.js` | `pickActiveSection(entries) → id \| null`; `initScrollSpy(doc?)` |
| `copy-email.js` | `copyText(text, clipboard?) → Promise<'success' \| 'error'>`; `statusMessage(result) → string`; `initCopyEmail(doc?)` |
| `main.js` | No exports. Calls each `init*` inside its own `try/catch`. |

## Keyboard behaviour

| Context | Key | Result |
|---|---|---|
| Anywhere (first Tab) | Tab | Focus "Skip to main content" |
| Menu button | Enter / Space | Toggle menu |
| Open menu | Escape | Close menu, focus returns to menu button |
| Nav link | Enter | Scroll to section, focus the section, close menu (phones) |
| Theme toggle | Enter / Space | Switch theme, update `aria-pressed`, persist |
| Copy button | Enter / Space | Copy + status message |

## Timings and motion

| Token | Value | Applies when |
|---|---|---|
| `--duration-theme` | 250ms | `prefers-reduced-motion: no-preference` and `data-theme-switching` present |
| `--duration-ui` | 150ms | hover/focus highlight transitions, motion allowed |
| Copy status lifetime | 4000ms | always |
| `scroll-behavior: smooth` | — | only inside `prefers-reduced-motion: no-preference` |

With `prefers-reduced-motion: reduce`, every duration above is effectively `0` and no entry is
ever animated. (The timeline scroll-in and `reveal.js` were removed on 2026-09-30.)
