# Research: Personal Portfolio Website

**Feature**: `specs/001-portfolio-website` | **Date**: 2026-09-29 | **Plan**: [plan.md](plan.md)

Each entry records a decision, why it was chosen, and what else was considered. Every item that
was open in the plan's Technical Context is resolved here.

---

## R-01 Development tooling and runtime

- **Decision**: Node.js 24 LTS and npm, **development only**. Dev dependencies:
  Prettier (format), ESLint 9 flat config with `@eslint/js` + `globals` (JS lint),
  Stylelint 16 + `stylelint-config-standard` (CSS lint), `html-validate` (HTML validation),
  `@playwright/test` + `@axe-core/playwright` (end-to-end + accessibility), `@lhci/cli`
  (Lighthouse CI), `linkinator` (link check), `lightningcss` (CSS bundle/minify at build),
  `http-server` (local static preview). Unit tests use Node's built-in `node:test` runner (no
  dependency). Versions are the latest stable at implementation time, locked in
  `package-lock.json`.
- **Rationale**: Covers every CI gate named in the constitution (format, lint, HTML validity,
  links, axe, Lighthouse) with mainstream, well-maintained tools. Playwright gives real
  Chromium/Firefox/WebKit runs, viewport and colour-scheme emulation, JS-disabled contexts, and
  clipboard permissions — all needed by the spec's acceptance scenarios. Nothing ships to
  visitors.
- **Alternatives considered**: pa11y-ci (cannot easily scan both themes or JS-off states);
  Jest/Vitest (unnecessary — `node:test` covers pure-function tests); Cypress (no WebKit);
  no tooling at all (violates Principle IV and the quality-gate rules).

## R-02 Applying the saved theme without a flash (FR-029)

- **Decision**: A tiny (< 400 bytes) **inline classic script in `<head>`**, placed before the
  stylesheet link, that (a) swaps `html.no-js` → `html.js` and (b) reads the saved theme from
  storage inside `try/catch` and sets `data-theme` on `<html>`. It is allowed by CSP via its
  SHA-256 hash; `tools/check-csp.mjs` recomputes the hash and fails CI if the meta tag and the
  script drift apart.
- **Rationale**: Any deferred or module script runs after first paint, so a visitor whose saved
  choice differs from their device setting would see the wrong theme flash. An inline blocking
  script is the only zero-request way to set the attribute before paint. Constitution v2.1.0
  Principle I ("Theme bootstrap exception") permits exactly this script: one inline classic
  script in `<head>`, under 1 KB, CSP-hashed, verified in CI — `check-csp.mjs` also fails if it
  reaches 1 KB.
- **Alternatives considered**: external blocking `<script src>` in head (extra render-blocking
  request on first load, still violates "modules only"); CSS-only device preference (cannot
  honour a saved explicit choice — violates FR-031); cookie + server rendering (no server on
  GitHub Pages).

## R-03 Theme CSS strategy

- **Decision**: All colours are custom properties in `css/tokens.css`. Light values are set on
  `:root`; dark values are declared **twice, identically** — once in
  `@media (prefers-color-scheme: dark) { :root:not([data-theme="light"]) { … } }` and once in
  `:root[data-theme="dark"] { … }` (plain CSS cannot share one declaration block between a
  media-query rule and a top-level rule). `tests/unit/contrast.test.js` asserts the two dark
  blocks are identical so they cannot drift. An `@media print { :root { … } }` block in the
  same file re-declares the light values so printing is always light. `color-scheme` is set to
  match so native controls and scrollbars follow. Two `<meta name="theme-color">` tags (one per
  `media`) tint mobile browser chrome; after a toggle, `theme.js` updates them with the value
  of `--color-bg` read via `getComputedStyle` (no colour literals in JS — Principle III).
- **Rationale**: With scripting unavailable, the page follows the device preference
  automatically (edge case "Scripting unavailable"). With a saved choice, `data-theme` wins. No
  duplicated component CSS — components only reference tokens.
- **Alternatives considered**: separate light/dark stylesheets (extra request, harder to keep in
  sync); `light-dark()` CSS function (clean, but cannot be overridden by a saved choice without
  also toggling `color-scheme`, and adds complexity for no gain here).

## R-04 Theme toggle semantics (FR-030)

- **Decision**: A `<button type="button">` with the constant accessible name "Dark theme" and
  `aria-pressed="true|false"` (pressed = dark). A sun/moon SVG is decorative
  (`aria-hidden="true"`). The button ships with the `hidden` attribute and is revealed by
  JavaScript.
- **Rationale**: `aria-pressed` on a button is the simplest correctly-announced two-state toggle
  ("Dark theme, toggle button, pressed"). Hiding it until JS runs satisfies "hidden rather than
  shown non-functional".
- **Alternatives considered**: `role="switch"` (equivalent but less consistently announced on
  older screen readers); changing the label on each click ("Switch to light") — confusing when
  paired with a state.

## R-05 Smooth theme transition (FR-031)

- **Decision**: When the visitor toggles, JS sets a transient `data-theme-switching` attribute
  on `<html>` for 300ms. Only while it is present, and only inside
  `@media (prefers-reduced-motion: no-preference)`, colour-related properties
  (`background-color`, `color`, `border-color`, `fill`, `stroke`, `outline-color`) transition
  over `--duration-theme` (250ms).
- **Rationale**: Transitions happen exactly when the theme changes, never on first load or
  unrelated hovers, and are skipped for reduced-motion visitors.
- **Alternatives considered**: permanent colour transitions on all elements (animates on page
  load and interferes with hover states); View Transitions API (support not uniform across the
  full browser matrix at planning time; progressive-enhancement fallback would still need this
  approach).

## R-06 Preference storage

- **Decision**: `localStorage` key `theme` with values `"light"` or `"dark"`; absence means
  "follow device". All reads/writes go through `js/storage.js`, which wraps every call in
  `try/catch` and degrades to in-memory state.
- **Rationale**: Visitor-local, no cookies, no network (Principle VII). Satisfies SC-008 and the
  "storage blocked" edge case.
- **Alternatives considered**: cookies (sent nowhere useful on a static host, adds consent
  questions); `sessionStorage` (would not persist across visits — violates FR-031).

## R-07 CSS architecture and delivery

- **Decision**: Source CSS is split by concern under `src/css/` and composed by
  `src/css/main.css` using `@import url(…) layer(name)` with the layer order
  `tokens, reset, base, layout, components, utilities`. Class names follow **BEM**
  (`block__element--modifier`). For production, `tools/build.mjs` uses **Lightning CSS** to
  bundle `main.css` and its imports into a **single minified stylesheet** in `dist/`. A
  separate `print.css` loads with `media="print"` (non-blocking) and contains layout/visibility
  rules only — print colours live in `tokens.css` (R-03). Stylelint forbids colour literals
  (`color-no-hex`, `color-named: never`, colour functions disallowed) in every file except
  `tokens.css`. The projects grid (`.projects__grid`, `.projects__item`) has its own BEM block
  file `components/projects.css`, separate from `components/project-card.css`.
- **Rationale**: Separate files keep the code organised (Principle IV, Best Practice 7) and the
  source remains directly servable in a browser (constitution: "no build step required to
  serve"). The optional deploy-time bundling step produces the single render-blocking
  stylesheet Principle VI requires in production. The Stylelint rule automates Principle III's
  "no hard-coded colours outside the token file".
- **Alternatives considered**: one large hand-written file (meets "one stylesheet" but hurts
  maintainability and conflicts with Best Practice 6's "dedicated tokens file"); multiple
  `<link>` tags (several render-blocking requests); Sass (forbidden by constitution).

## R-08 JavaScript module organisation

- **Decision**: One entry module `src/js/main.js` loaded with `<script type="module">`, which
  imports feature modules: `storage.js`, `theme.js`, `nav.js`,
  `scroll-spy.js`. Each feature exports pure, DOM-free helpers (unit-tested) plus one
  `init*()` function that attaches listeners via `addEventListener`. `main.js` calls every
  `init*()` inside its own `try/catch` so one failure cannot disable the others. Submodules are
  hinted with `<link rel="modulepreload">` to avoid an import waterfall. No bundling or
  minification of JS (total well under the 30 KB budget).
- **Rationale**: Matches Principle I (native modules, one responsibility each, no globals) and
  keeps logic testable without a DOM.
- **Alternatives considered**: single script file (mixes responsibilities); bundling with a
  bundler (unnecessary at this size, adds a dependency).

## R-09 Colour palette (Principle III, FR-028, FR-034)

- **Decision**: Token values below. Contrast ratios were computed with the WCAG 2.x relative
  luminance formula during planning.

  | Token | Light | Dark | Use |
  |---|---|---|---|
  | `--color-bg` | `#FBF6EE` soft cream | `#1B1310` espresso | page background |
  | `--color-surface` | `#F3E9D8` warm cream | `#2A1F19` cocoa | cards, header |
  | `--color-text` | `#2B1D14` dark brown | `#F6ECDF` cream | body text |
  | `--color-text-muted` | `#5E4B3C` | `#CDBBA7` | secondary text, dates |
  | `--color-accent` | `#A34A06` deep amber | `#F4A340` amber | links, markers |
  | `--color-accent-bg` | `#B45309` amber | `#F59E0B` amber | primary buttons |
  | `--color-on-accent` | `#FFFBF5` | `#1B1310` | text on buttons |
  | `--color-focus` | `#8A3B00` | `#FBBF60` | focus ring |
  | `--color-border` | `#8C7A68` | `#8F7B69` | meaningful borders |
  | `--color-tag-bg` / `--color-tag-text` | `#F6E3C4` / `#6B3A0B` | `#3A2A1E` / `#F7C98A` | tech/skill tags |

  | Pair (worst case) | Light | Dark | Required |
  |---|---|---|---|
  | text on surface | 13.55 | 13.74 | 4.5 |
  | muted on surface | 6.85 | 8.61 | 4.5 |
  | accent link on surface | 4.93 | 7.76 | 4.5 |
  | button text on button | 4.87 | 8.52 | 4.5 |
  | tag text on tag | 7.47 | 8.94 | 4.5 |
  | focus ring on surface | 6.45 | 9.72 | 3.0 |
  | border on surface | 3.42 | 3.98 | 3.0 |
  | button vs surface (UI) | 4.17 | 7.47 | 3.0 |

- **Rationale**: Every pairing passes WCAG 2.2 AA in both themes with margin. The focus ring is
  always drawn with `outline-offset` so it sits against the page/surface colour, not against
  the amber button (ring-vs-button contrast is low by design and is not the measured pair).
- **Alternatives considered**: brighter amber (`#F59E0B`) in light mode — fails 4.5:1 for text
  on cream; purely decorative borders at lower contrast — kept only where the border carries no
  meaning.

## R-10 Typography

- **Decision**: No web fonts. Body: system sans stack
  (`system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif`).
  Headings: system serif stack for warmth
  (`"Iowan Old Style", "Palatino Linotype", Palatino, Georgia, serif`). Fluid type scale via
  `clamp()` (body `1rem`→`1.125rem`; h1 `2.25rem`→`4rem`), unitless line-height 1.6 body /
  1.15 headings, reading width capped at `65ch`.
- **Rationale**: Zero font bytes and no layout shift from font swaps (supports SC-005 and the
  CLS ≤ 0.05 target); serif headings add the "welcoming" character without downloads.
- **Alternatives considered**: self-hosted WOFF2 display font (≈ 20–40 KB and a preload for
  modest visual gain; can be added later within budget).

## R-11 Breakpoints and layout

- **Decision**: Mobile-first `min-width` queries in `em`: `30em` (480px), `48em` (768px),
  `64em` (1024px), `90em` (1440px). Content container `max-width: 72rem` centred with fluid
  side padding `clamp(1rem, 4vw, 2rem)`. Projects grid:
  `repeat(auto-fill, minmax(min(100%, 18rem), 1fr))` so it is one column on phones, two or more
  from ~`40em`, and a lone "coming soon" card keeps a card width instead of stretching.
  About Me: education and skills stack on phones, side by side from `48em`.
- **Rationale**: `em` queries respect user font-size and zoom; `min(100%, …)` prevents overflow
  at 320px and 400% zoom.
- **Alternatives considered**: container queries for cards (useful but unnecessary with a
  single grid context); fixed column counts per breakpoint (less fluid).

## R-12 Navigation bar and mobile menu (FR-023–FR-027)

- **Decision**: `<header>` fixed to the top (`position: sticky; top: 0` on the header inside
  the document flow) with height token `--nav-height: 3.5rem` (56px). Content: brand link
  "Aseel Almanahy" → `#home`, `<nav aria-label="Primary">` with links About, Experience,
  Projects, Contact, and the theme toggle. Below `48em`, when scripting runs (`html.js`, set
  by the head bootstrap before first paint), the list is collapsed from the first paint and a
  "Menu" control is shown. It ships as `<a class="nav__toggle" href="#nav-menu">`, which opens
  the list through `:target` even if the module fails; `nav.js` replaces it with an identically
  styled `<button aria-expanded aria-controls="nav-menu">` (moving the same child nodes, so no
  layout shift). Escape closes it and returns focus to the button; choosing a link closes it.
  With scripting unavailable (`html.no-js`), the Menu control is not shown and the list wraps
  within the header (spec Edge Cases → "Scripting unavailable"), with a larger
  `scroll-padding-top` so anchors clear the taller bar.
- **Rationale**: Disclosure pattern is the simplest accessible mobile menu; sticky positioning
  avoids a hard-coded body offset and never overlaps content in flow. *Changed during
  implementation*: the first design collapsed the list only after `nav.js` revealed a hidden
  button, which let the page paint with a three-row header and then jump up ~76px on phones
  (CLS 0.29 when the module ran after first paint). Collapsing on the pre-paint `js` class
  removes the shift, and the `:target` fallback keeps navigation working if the module fails
  (constitution IV).
- **Alternatives considered**: `<details>/<summary>` menu (works without JS but cannot be forced
  open on desktop without non-uniform `::details-content` support); off-canvas drawer (more
  code, focus-trap complexity).

## R-13 Keeping headings and focus visible below the bar (FR-023a, FR-024, WCAG 2.4.11)

- **Decision**: `html { scroll-padding-top: calc(var(--nav-height) + 1rem); }` for anchor jumps,
  deep links, and focus scrolling — **only** this; no `scroll-margin-top`, because scroll
  padding and scroll margin add together and would push targets about twice the header height
  below the bar. After a nav link is chosen,
  `nav.js` moves focus to the target section (`tabindex="-1"`) with `preventScroll: true` so
  focus follows the scroll. Playwright verifies that deep links, nav jumps, and Tab focus never
  place the target under the bar in all three engines; if an engine fails the focus case, a
  small `focusin` guard in `nav.js` scrolls the element into the padded area.
- **Rationale**: Native CSS handles the common cases with zero JS; the test proves it and the
  guard is a ready fallback.
- **Alternatives considered**: JS offset calculations for every scroll (more code, jank).

## R-14 Current-section indicator (FR-026)

- **Decision**: `scroll-spy.js` uses `IntersectionObserver` on the four content sections with a
  root margin that ignores the bar and the bottom half of the viewport; the active nav link gets
  `aria-current="true"` and a visible underline style keyed off that attribute.
- **Rationale**: No scroll listeners, no layout thrash; the styling hook is the ARIA state so
  visual and assistive indications cannot diverge.
- **Alternatives considered**: `scroll` event + `getBoundingClientRect` (more work per frame).

## R-15 Timeline structure and interaction (FR-011–FR-013) — SUPERSEDED 2026-09-30 (see R-27)

- **Decision**: `<ol class="timeline">`, most recent first; each `<li>` holds an
  `<article class="timeline__entry" tabindex="0" aria-labelledby="…">` with an `h3` role title,
  organisation, `<time datetime="YYYY-MM">Mon YYYY</time>` start and end (or the text
  "Present"), and a text category badge ("Engineering" / "Leadership"). Markers on the vertical
  line differ by **shape** (circle vs. diamond) as well as colour. The highlight is one rule set
  applied to `:hover`, `:focus-visible`, and `:focus-within`, so every input method gets the
  same visual.
- **Rationale**: `tabindex="0"` is required because FR-013 asks entries themselves to respond to
  keyboard focus; `aria-labelledby` gives each stop a concise name. `<time>` satisfies the
  machine-readable date requirement. Shape + text label means category is never colour-only.
- **Alternatives considered**: non-focusable entries (fails FR-013 for keyboard users); making
  entries links/buttons (they have no action — misleading semantics).

## R-16 Scroll-in animation for timeline entries (FR-013, FR-013a) — SUPERSEDED 2026-09-30 (see R-27)

- **Decision**: `reveal.js` runs only if `IntersectionObserver` exists **and**
  `prefers-reduced-motion: no-preference` matches. It marks only entries that are currently
  **below** the viewport with `data-reveal="pending"`; CSS gives pending entries
  `opacity: 0; transform: translateY(1rem)`. When an entry intersects, the attribute becomes
  `"visible"` and it transitions over 400ms (`--duration-reveal`). Entries already in or above
  the viewport are never hidden.
- **Rationale**: Content is visible by default; hiding happens only after JS proves it can
  un-hide. `opacity`/`transform` do not move layout, so CLS stays at zero. Covers JS-off,
  reduced-motion, deep-link, and fast-scroll edge cases.
- **Alternatives considered**: CSS scroll-driven animations (`animation-timeline: view()`) —
  not supported across the full browser matrix at planning time; hiding entries in CSS by
  default (entries vanish if JS fails — violates FR-013a).

## R-17 Copy-email button (FR-021a) — SUPERSEDED 2026-09-30 (email removed; LinkedIn primary)

- **Decision**: `copy-email.js` reveals the button (shipped `hidden`) only when
  `navigator.clipboard?.writeText` exists. On click it writes the address read from the
  adjacent `mailto:` link, then writes "Copied!" into a `role="status"` live region next to the
  button; on rejection it writes "Couldn't copy — please select the address above". The message
  clears after 4 seconds. No `document.execCommand('copy')` fallback.
- **Rationale**: The async Clipboard API works in every supported browser in a secure context
  (GitHub Pages is HTTPS; `localhost` is secure). Reading the address from the link keeps one
  source of truth. A polite status region announces without stealing focus.
- **Alternatives considered**: `execCommand` fallback (deprecated); toast outside the flow
  (harder to associate with the button for screen readers).

## R-18 Icons

- **Decision**: One local SVG sprite `assets/icons.svg` (GitHub, LinkedIn, sun, moon,
  menu, external-link) referenced with `<svg><use href="assets/icons.svg#id"></use></svg>`,
  always `aria-hidden="true"` next to visible text. Icons use `currentColor`.
- **Rationale**: One cached request for both hero and contact icons; themable via tokens;
  Best Practice 17.
- **Alternatives considered**: inline SVG per use (duplicated bytes); icon font (a11y and
  loading issues).

## R-19 Metadata, SEO, and share previews (FR-036, Best Practice 19)

- **Decision**: `index.html` head includes `title` ("Aseel Almanahy — Full Stack Software
  Engineer"), meta description, canonical URL, Open Graph (`og:type=website`, title,
  description, url, image 1200×630, image alt) and `twitter:card=summary_large_image`, two
  `theme-color` metas, SVG favicon + 32px PNG fallback + 180px `apple-touch-icon`, and a
  JSON-LD `Person` block (name, jobTitle, `alumniOf` UMass Lowell only, `affiliation` LSU
  Shreveport while the MBA is in progress, sameAs profile URLs). `robots.txt` and
  `sitemap.xml` (one URL) at site root. The OG image and PNG icons are generated once from an
  HTML template by `tools/generate-images.mjs` (Playwright screenshot) and committed.
- **Rationale**: Covers FR-036 and Best Practice 19. JSON-LD is a non-executable data block
  (`type="application/ld+json"`): browsers do not run it and CSP `script-src` does not govern
  it, so it is not an "inline script" in the Principle I sense.
- **Alternatives considered**: hand-drawn OG image in an external editor (fine too, but the
  template keeps it on-brand and reproducible).

## R-20 Security headers on GitHub Pages (Principle VII)

- **Decision**: `<meta http-equiv="Content-Security-Policy">` with
  `default-src 'none'; script-src 'self' 'sha256-<theme-bootstrap>'; style-src 'self';
  img-src 'self'; manifest-src 'self'; connect-src 'self'; base-uri 'self';
  form-action 'none'` (no `upgrade-insecure-requests`: it would rewrite local `http://localhost`
  asset requests during development and tests, and GitHub Pages already enforces HTTPS), and
  `<meta name="referrer" content="strict-origin-when-cross-origin">`. External links use
  `rel="noopener noreferrer"`. HTTPS enforced in repository Pages settings.
- **Rationale**: Strictest policy that still allows the page to work; blocks any accidental
  third-party request (enforces "no third-party requests" automatically). `frame-ancestors`
  cannot be set via meta — accepted limitation of GitHub Pages. `connect-src` is `'self'`
  rather than `'none'` (changed during implementation): Lighthouse fetches `robots.txt` from
  inside the page, and `'none'` made its SEO audit fail (0.92 < 0.95); same-origin fetches
  still cannot reach third parties.
- **Alternatives considered**: no CSP (violates Principle VII); `'unsafe-inline'` (defeats CSP).

## R-21 404 page under a project subpath

- **Decision**: `404.html` shares the stylesheet and header styling and contains a link back to
  the main page. Because GitHub Pages serves it for any missing nested path, it includes a
  `<base href="…">` set to the site's base path (`/` for a `<user>.github.io` repository,
  `/<repo>/` for a project repository) so its relative asset paths resolve. The value comes
  from the site URL content input (R-25) and is checked by `tools/check-site-url.mjs`.
- **Rationale**: Keeps relative paths everywhere else (Best Practice 20) while fixing the one
  page that is served from arbitrary depths.
- **Alternatives considered**: fully inline-styled 404 (conflicts with Principle I);
  root-relative paths everywhere (breaks under a project subpath).

## R-22 Cache busting (Best Practice 20)

- **Decision**: `tools/build.mjs` appends `?v=<first 8 chars of content SHA-256>` to CSS, JS
  (including `modulepreload` and module `import` specifiers), sprite, and icon URLs in `dist/`.
  Source files keep clean URLs.
- **Rationale**: GitHub Pages sets short cache lifetimes, but versioned URLs guarantee visitors
  never mix old CSS with new HTML after a deploy.
- **Alternatives considered**: hashed filenames (requires rewriting import graphs more
  invasively); no busting (risk of stale assets).

## R-23 Testing strategy

- **Decision**:
  - **Unit** (`tests/unit`, `node --test`): pure helpers in `storage.js`, `theme.js`,
    `scroll-spy.js` (`reveal.js` and `copy-email.js` removed 2026-09-30).
  - **End-to-end** (`tests/e2e`, Playwright; Chromium, Firefox, WebKit): one spec per user
    story plus cross-cutting specs — `structure`, `hero-contact` (US1), `about-experience`
    (US2), `projects` (US3), `nav-theme` (US4), `responsive` (viewport matrix + zoom),
    `a11y` (axe WCAG 2.2 AA tags in light and dark, JS on and off), `no-js`, `privacy-scope`
    (no third-party requests, no forms, no résumé, Experience is a single narrative).
  - **Static checks**: `html-validate`, ESLint, Stylelint, Prettier, `check-csp`,
    `check-site-url`, `check-budgets`, `linkinator`.
  - **Lab performance**: Lighthouse CI (mobile) against `dist/` with assertions from
    Principle VI; TBT ≤ 200ms is used as the lab proxy for INP.
  - **Manual**: screen-reader smoke test (NVDA + Firefox/Chrome on Windows, VoiceOver on
    iOS), visual review at each viewport in both themes, written privacy review (FR-015),
    5-person usability check (SC-002).
- **Rationale**: Every FR and SC maps to at least one automated or scripted check; manual checks
  are limited to what tools cannot judge.
- **Alternatives considered**: visual regression snapshots (brittle across OS font rendering;
  deferred).

## R-24 CI/CD and hosting

- **Decision**: One GitHub Actions workflow `.github/workflows/ci.yml`: job `verify` (on pull
  requests and pushes) runs `npm ci`, Playwright browser install, `npm run verify`
  (all static checks, unit, build, e2e against `dist/`, Lighthouse CI, link check) and then
  uploads the tested `dist/` with `actions/upload-pages-artifact`; job `deploy` (push to `main`
  only, `needs: verify`) runs only `actions/deploy-pages` on that artifact — no rebuild. Pages source is set
  to "GitHub Actions"; "Enforce HTTPS" on.
- **Rationale**: A failing gate blocks deployment (constitution workflow rule); artifacts deploy
  exactly what was tested.
- **Alternatives considered**: deploy from a branch (`gh-pages`) — deploys untested files unless
  duplicated logic guards it.

## R-25 Content inputs and site URL

- **Decision**: The following are **content inputs** tracked in `quickstart.md` → "Content
  inputs"; the page is built with clearly marked `CONTENT:` placeholders that
  `tools/check-content.mjs` counts and that MUST be zero before the first deploy:
  role start/end months (×4), GitHub URL, LinkedIn URL, public email address, About Me intro
  (draft provided for approval), and site URL/repository name (default assumption:
  `https://<github-username>.github.io/`, base path `/`). The GitHub repository does not exist
  yet; it is created (with the owner's confirmation of name and visibility) when these inputs
  are collected, because its name fixes the site URL and the 404 `<base href>`.
- **Rationale**: Lets all structure, style, behaviour, and tests proceed now while guaranteeing
  nothing placeholder-like reaches production (SC-010).
- **Alternatives considered**: blocking implementation on content (unnecessary delay).

## R-26 Interpreting "validate against the 16 checklist rules"

- **Decision**: The 16 rules are the items in
  [checklists/requirements.md](checklists/requirements.md). They were written to validate the
  *specification*, so the plan translates each into an **implementation gate (G1–G16)** that
  asks the equivalent question of the code produced in each phase (e.g. "Scope is clearly
  bounded" → no out-of-scope features or third-party requests exist in `src/`). The mapping
  table lives in [plan.md](plan.md#validation-gates-g1g16), and every phase lists which gates it
  must pass.
- **Rationale**: Honours the request while keeping each gate objective and checkable.
- **Alternatives considered**: re-running the spec checklist verbatim after each phase (it would
  pass trivially and prove nothing about the code).

## R-27 Experience narrative layout (FR-011–FR-013, amendment 2026-09-30)

- **Decision**: The Experience section holds one `<p class="experience__narrative">` with the
  owner's text verbatim — no list, `<time>`, headings per role, or employer name. It is styled
  as a "long-read" block: `--text-lg` body size, generous line height, measure capped at `62ch`,
  a 3px amber (`--color-accent-bg`) left rule, and a serif drop cap on the first letter
  (`::first-letter`, coloured `--color-accent`, which meets 4.5:1 on both backgrounds). It is
  static: no interaction, no animation, no JavaScript.
- **Rationale**: Presents one cohesive story with visual polish while staying minimal, readable
  at 320px/400% zoom, and fully accessible (a drop cap via `::first-letter` does not change the
  accessible text). Removing the timeline also removes `reveal.js` and its CSS, which lowers
  JS and CSS weight and removes the only below-the-fold animation — Lighthouse targets are
  unaffected or improved.
- **Alternatives considered**: splitting the narrative into four themed paragraphs or adding
  "focus" tags (full-stack, cloud, architecture, leadership) — rejected because the owner asked
  for a single narrative and no extra content; a pull-quote card — heavier visual weight than
  the rest of the minimal page.

## R-28 Interests section (FR-037–FR-040, amendment 2026-09-30)

- **Decision**: `<section id="interests">` after Experience with `<ul class="interests__list">`;
  each `<li class="interests__item">` holds an inline `<svg aria-hidden="true" focusable="false">`
  (24×24 viewBox, `stroke="currentColor"`, no `<style>`/`style` attributes) and a text label.
  Grid: `repeat(auto-fit, minmax(min(100%, 9.5rem), 1fr))` inside `max-width: 56rem`, so 320px
  gets one column, 375px two, and desktop fits all five in one row. Items are quiet cards
  (surface background, tag-coloured border, amber icon) with no hover/focus styling and no
  motion. A `--size-icon-lg` token sizes the icons.
- **Rationale**: The owner asked for embedded inline icons; each icon appears once, so inline SVG
  costs no duplication and no request (unlike the shared sprite used for repeated icons, R-18).
  `currentColor` keeps icons theme-aware without colour literals (Principle III). `auto-fit`
  plus a max width avoids an empty sixth track on wide screens.
- **Alternatives considered**: adding the icons to `icons.svg` (an extra fetch dependency for
  one-off icons, and the owner asked for inline); emoji (inconsistent rendering, announced by
  screen readers); an icon font (forbidden — constitution V and the request).

## R-29 Four-tier skills grid (FR-010, amendment 2026-09-30)

- **Decision**: Skills move out of the About two-column layout into their own full-width block:
  `<div class="skills">` containing four `.skill-group` cards (heading + `ul.tag-list`). The grid
  is `repeat(var(--skills-columns), minmax(0, 1fr))`; `--skills-columns` is a responsive token in
  `tokens.css` (1 by default, 2 from 40em, 4 from 75em). Slash-joined labels get `<wbr>` after
  each slash; `.tag` has `max-width: 100%` and `overflow-wrap: anywhere`.
- **Rationale**: 28 tags do not fit a half-width column; a tier grid keeps them scannable. Driving
  the column count from a token keeps layout configuration with the other design tokens, while
  the selectors stay in the component layer (constitution Best Practices 6–7: tokens file holds
  custom properties only). `<wbr>` gives natural break points without changing the accessible
  text.
- **Alternatives considered**: putting grid classes in `tokens.css` (breaks the tokens → components
  layer order and the "custom properties only" rule); `auto-fit` columns (3 + 1 orphan at
  1024px); abbreviating long labels (changes the owner's wording).

## R-30 Punctuation, link placement, and featured projects (FR-041, FR-042, FR-020)

- **Decision**: Replace em dashes with commas, semicolons, or sentence breaks in copy and a
  vertical bar in page titles; enforce with an e2e check over rendered text and every `src/`
  file. Profile links live only in the hero and Contact. Projects shows three cards built from
  the owner's public repositories (checked 2026-09-30 via the GitHub API: READMEs, dependencies,
  source trees): order-service + e-commerce-store-project (Spring Boot, Kafka, MySQL, Docker
  Compose), booky-frontend + books (Angular 14, Spring Boot, Spring Data JPA), Radix-Calculator
  (Android, Java, SQLite).
- **Rationale**: Every claim on a card is visible in the linked code, so visitors who follow a
  link find what the card describes. Linking repositories rather than the profile removes the
  repetition the owner flagged while keeping direct code access.
- **Alternatives considered**: a "Cloud Architecture" card (no public cloud code to back it);
  linking cards to the GitHub profile (the repetition being removed); keeping `auto-fill` with
  a spanning last card on tablets (breaks equal visual weight, US3 #3).

## R-31 Five-section layout (constitution v3.0.0, amendment 2026-09-30)

- **Decision**: The hero keeps only the greeting and statement; the Projects section, its CSS
  modules, grid rules, nav link, and `#code` icon are deleted; the GitHub and LinkedIn buttons
  exist only in Contact. Visitors reach Contact through the always-visible navigation bar.
- **Rationale**: The owner wants a single, non-repetitive outreach destination and a calmer first
  screen. Removing code rather than hiding it keeps the page weight, tab order (9 stops), and
  maintenance surface minimal.
- **Alternatives considered**: hiding the hero actions on larger screens only (still repetition);
  keeping Projects with repository links (the owner chose GitHub profile access in Contact).

## R-32 Unified intro (constitution v4.0.0, amendment 2026-09-30)

- **Decision**: Move the biography, Education, and Skills into `section#home`; drop the About Me
  section and its nav link; promote Education/Skills to `h2` (degrees and tiers to `h3`) so
  the outline has no skipped levels; size the new `h2`s as sub-headings; reduce the intro's
  top padding.
- **Rationale**: Two stacked sections with full section padding left a screen-high gap between
  the statement and the biography. One section keeps the landing screen full and still gives
  screen-reader users a clean outline (h1 → h2 Education/Skills → h2 Experience…).
- **Alternatives considered**: keeping `section#about` with a visually hidden heading (the gap
  is structural padding, and a hidden landmark heading adds noise); keeping an "About" nav link
  to `#home` (duplicates the site-name link and would mark a current section in the hero).

## R-33 Visible statement removed (constitution v5.0.0, amendment 2026-09-30)

- **Decision**: Delete the statement paragraph and its style; keep the sentence as the summary
  description in page metadata, JSON-LD, and the share image.
- **Rationale**: The owner asked to take the line out of the page; search results and link
  previews still need a summary (FR-036), and no visitor sees it on the page.
- **Alternatives considered**: removing it from metadata as well (leaves previews without a
  summary until the owner supplies new text); hiding it visually (still read by screen readers).

## R-34 Custom domain on GitHub Pages (FR-043, amendment 2026-09-30)

- **Decision**: Keep GitHub Pages hosting and publish `CNAME` = `aseelalmanahy.com`. At the
  registrar (Squarespace Domains) the apex gets GitHub Pages' four A records (185.199.108.153,
  185.199.109.153, 185.199.110.153, 185.199.111.153; AAAA optional) and `www` gets a CNAME to
  `aseelalmanahy.github.io`. In the repository's Pages settings the custom domain is set to
  `aseelalmanahy.com` and "Enforce HTTPS" is turned on once the certificate is issued.
- **Rationale**: The constitution fixes hosting to GitHub Pages; a custom domain changes only
  the public address. GitHub Pages redirects the github.io address and `www` to the apex.
- **Alternatives considered**: hosting on Squarespace (violates Principle VI and cannot serve
  this static build as-is); keeping the github.io address as canonical (not the owner's domain).
- **Status (2026-09-30)**: the domain resolves as a name but has no A records yet and `www` does
  not exist, so DNS setup is still pending (owner action, T102).
