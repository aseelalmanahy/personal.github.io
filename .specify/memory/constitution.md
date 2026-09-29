<!--
Sync Impact Report
- Version change: 2.0.1 → 2.1.0 (MINOR: bounded exception added to Principles I and VI; scope of
  Principle III and Best Practice 6 clarified). Resolves /speckit-analyze findings C1 and C4 for
  specs/001-portfolio-website.
- Modified principles:
  - I. Vanilla Web Platform Architecture — new "Theme bootstrap exception": exactly one inline,
    CSP-hashed (SHA-256) classic script under 1 KB in <head> to prevent theme flash; JSON-LD
    data blocks explicitly not scripts
  - III. Warm Minimalist Aesthetics — colour-token rule scoped to standard stylesheets and
    scripts; scripts read colours via getComputedStyle; theme-color metas, standalone SVGs, and
    dev-only templates may hold literals that match the tokens
  - VI. Lightning-Fast GitHub Pages Delivery — "all scripts MUST be modules" now references the
    Principle I exception
- Modified sections:
  - Web Platform Best Practices — #6 Design tokens aligned with Principle III scope
- Added/removed sections: none
- Templates requiring updates: none — templates read the constitution at runtime
- Dependent artifacts to sync (outside this command): specs/001-portfolio-website/plan.md
  (Constitution Check + Complexity Tracking row), research.md R-02, CLAUDE.md version reference
- Follow-up TODOs: none

Earlier amendments (retained for review until committed):
- 2.0.0 → 2.0.1 (PATCH): Principle V section order — Experience Timeline before Projects.
- Version change: 1.1.0 → 2.0.0 (MAJOR: principles redefined and consolidated, hosting fixed to
  GitHub Pages, scope narrowed to a single page)
- Modified principles:
  - I. Content First, Simplicity Always → V. Focused Single-Page Scope (content-first rules kept;
    scope now fixed to five sections)
  - II. Accessible to Everyone → IV. Code Quality & Accessibility (NON-NEGOTIABLE) (merged with
    formatter/linter rules from old V; zero automated violations now required)
  - III. Fast by Default → VI. Lightning-Fast GitHub Pages Delivery (budgets tightened; GitHub
    Pages deployment rules added)
  - IV. Privacy & Security → VII. Privacy & Security (adapted to GitHub Pages: CSP via meta tag,
    no forms, no third-party requests by default)
  - V. Maintainable & Verifiable → folded into IV and Development Workflow & Quality Gates;
    content now lives in HTML rather than JSON rendered by JavaScript
  - VI. Clean, Modular Code → I. Vanilla Web Platform Architecture (ES6+ modules, semantic HTML,
    no frameworks or UI libraries)
- Added principles:
  - II. Mobile-First Responsive Design
  - III. Warm Minimalist Aesthetics
- Added sections:
  - Web Platform Best Practices (20 numbered, testable practices)
- Modified sections:
  - Technical Constraints — hosting fixed to GitHub Pages; source must be servable without a
    build step
  - Development Workflow & Quality Gates — CI gate list and manual viewport/keyboard checks made
    explicit
- Removed sections: none
- Templates requiring updates: none — templates read the constitution at runtime
- Follow-up TODOs:
  - CLAUDE.md still says the constitution is an unfilled template; update it when the plan
    records tooling commands
-->

# Personal Portfolio Website Constitution

## Core Principles

### I. Vanilla Web Platform Architecture

- The site MUST be built with HTML5, CSS3, and ES6+ JavaScript only. Frameworks, UI libraries,
  and component kits (React, Vue, Svelte, jQuery, Alpine, Bootstrap, Tailwind, etc.),
  TypeScript, and CSS preprocessors (Sass, Less) MUST NOT be used.
- Markup MUST be semantic: native elements (`header`, `nav`, `main`, `section`, `article`,
  `ol`, `time`, `footer`, `button`, `a`) are used for their meaning before any ARIA is added.
- JavaScript MUST be written as native ES modules (`import`/`export`) loaded with
  `<script type="module">`, one responsibility per module, with no global variables and no
  inline event handlers.
- Structure, presentation, and behaviour MUST stay separate: no inline `style` attributes;
  inline `<script>`/`<style>` blocks only where a measured performance need is documented in
  the plan, except for the single theme bootstrap script defined below.
- **Theme bootstrap exception**: exactly one inline classic `<script>` is permitted in `<head>`,
  placed before the stylesheet, whose sole purpose is to apply the saved or device theme before
  first paint so the wrong theme never flashes. It MUST be under 1 KB, MUST be allowed by a
  SHA-256 hash in the Content Security Policy (never `'unsafe-inline'`), MUST NOT fetch, import,
  or render content, and MUST be verified by an automated hash check in CI. No other inline or
  non-module script is covered by this exception. Non-executable data blocks (e.g.
  `type="application/ld+json"`) are not scripts for the purposes of this principle.
- Reusable UI patterns (cards, timeline entries, contact links) MUST share one CSS component
  definition rather than being styled ad hoc per instance.
- The simplest approach that meets a requirement MUST be chosen; any runtime third-party code
  MUST be justified in the plan's Complexity Tracking table.

**Rationale**: The browser platform already provides everything a static portfolio needs. Zero
framework code means nothing to upgrade, nothing to break, and the fastest possible load.

### II. Mobile-First Responsive Design

- Styles MUST be authored for the smallest viewport first; larger layouts are layered on with
  `min-width` media queries only (no `max-width` overrides of desktop styles).
- The page MUST render correctly, with no horizontal scrolling, at every width from 320px to
  2560px, and MUST be verified at minimum at 320px, 375px, 768px, 1024px, and 1440px.
- Layouts MUST use fluid techniques (Grid, Flexbox, `clamp()`, relative units); fixed pixel
  widths larger than 320px MUST NOT be applied to content containers.
- Content MUST remain usable at 200% browser zoom and at 400% zoom (reflow) without loss of
  information or function.

**Rationale**: Most first visits to a portfolio come from a shared link opened on a phone.
Designing up from mobile guarantees the constrained case works rather than hoping it degrades.

### III. Warm Minimalist Aesthetics

- The visual design MUST be minimalist and modern: generous whitespace, a clear typographic
  hierarchy, and no decoration that does not aid comprehension.
- The palette MUST be warm and welcoming, defined as colour roles: soft cream backgrounds and
  surfaces, warm amber accents for emphasis and interactive states, and cozy dark tones (deep
  espresso/charcoal browns) for text and contrast areas. Exact values are chosen in the plan.
- In standard stylesheets and scripts (the site's CSS and JavaScript), every colour MUST be
  referenced through a CSS custom property; hard-coded colour values outside the design-token
  file MUST NOT appear. Scripts that need a colour value MUST read it from the tokens at runtime
  (e.g. `getComputedStyle`). Contexts that cannot reference CSS custom properties — HTML
  `theme-color` meta tags, standalone SVG files such as favicons, and dev-only image templates
  that never ship as stylesheets — MAY contain literal values, which MUST match the token file.
- Aesthetic choices MUST NOT override accessibility: every text/background and UI/background
  pairing MUST meet the contrast ratios in Principle IV, in every theme offered.
- A dark theme honouring `prefers-color-scheme` SHOULD be offered using the same token names;
  if offered, it MUST meet the same contrast rules.
- Motion MUST be subtle and purposeful (short fades or transforms) and never required to
  understand content.

**Rationale**: A consistent, warm visual identity makes the site feel personal and approachable,
while token-driven colour keeps that identity consistent and easy to adjust.

### IV. Code Quality & Accessibility (NON-NEGOTIABLE)

- The site MUST conform to WCAG 2.2 Level AA with zero violations reported by automated axe
  scans, and MUST pass a manual keyboard-only and screen-reader smoke test before release.
- The site MUST be fully operable by keyboard with a visible focus indicator on every
  interactive element, and MUST respect `prefers-reduced-motion`.
- All content and navigation MUST remain available if JavaScript fails or is disabled.
- Code MUST be linting-ready and pass, with zero errors and zero warnings: Prettier
  (formatting), ESLint (JavaScript), Stylelint (CSS), and an HTML validator. Shared editor
  settings MUST be defined in `.editorconfig`.
- CSS MUST be organised by concern (tokens, reset/base, layout, components, utilities) and
  follow one naming convention (e.g. BEM) chosen in the plan. Design tokens (colour, spacing,
  type scale, radii, shadows, motion durations) MUST be CSS custom properties on `:root`.
- Functions SHOULD be small and single-purpose (guideline: under ~40 lines) with intention-
  revealing names. Dead code, commented-out code, and `console.log` debugging MUST NOT be
  merged. Comments explain *why*, not *what*; exported functions carry a short JSDoc comment.

**Rationale**: A portfolio is a public sample of its author's craft. Accessible, consistently
formatted, lint-clean code is itself part of what the site demonstrates.

### V. Focused Single-Page Scope

- The site MUST be a single static page (`index.html`) containing exactly these sections, in
  order: Hero (friendly greeting and one-line introduction), About Me, Experience Timeline,
  Projects, and Contact Links. A custom `404.html` is the only additional page permitted.
- Every element on the page MUST serve the owner's content; features outside the five sections
  (blog, CMS, comments, e-commerce, dashboards) require a constitution amendment.
- Content MUST live directly in the HTML so it is indexable and readable without JavaScript;
  JavaScript MUST NOT be the source of any primary content.
- In-page navigation MUST use anchor links to section `id`s so every section is deep-linkable.

**Rationale**: A tightly bounded scope keeps the site finishable, fast, and maintainable by one
person, and keeps visitors focused on what matters.

### VI. Lightning-Fast GitHub Pages Delivery

- The site MUST be deployable to GitHub Pages as static files with no server-side runtime,
  database, or build step required to serve it.
- Lighthouse (mobile profile) MUST score ≥ 95 for Performance, Best Practices, and SEO, and
  100 for Accessibility.
- Core Web Vitals targets: LCP ≤ 2.0s, CLS ≤ 0.05, INP ≤ 200ms on a simulated mid-range mobile
  device.
- Performance budgets (compressed): HTML + CSS + JS ≤ 100 KB, of which JS ≤ 30 KB; total
  initial page weight including above-the-fold images ≤ 300 KB. Exceeding a budget MUST be
  justified in the plan.
- At most one render-blocking stylesheet is permitted; all scripts MUST be modules (deferred by
  default) or loaded after first render, except the single CSP-hashed theme bootstrap script
  permitted by Principle I (under 1 KB, in `<head>`).

**Rationale**: GitHub Pages is free, reliable, and HTTPS-by-default, but it serves files as-is.
Speed must therefore come from shipping very little, not from server tricks.

### VII. Privacy & Security

- No third-party tracking, advertising, or fingerprinting scripts. Analytics, if ever added,
  MUST be cookieless, collect no personal data, be disclosed on the page, and be approved by
  amendment.
- The page MUST NOT make runtime requests to third-party origins (fonts, CDNs, widgets) unless
  justified in the plan's Complexity Tracking table; all assets are self-hosted.
- Because GitHub Pages cannot set custom HTTP headers, a Content Security Policy and referrer
  policy MUST be set via `<meta>` tags, and HTTPS MUST be enforced in repository settings.
- Secrets (API keys, tokens) MUST never be committed to the repository or shipped to the client.
- Contact is provided through links only (e.g. `mailto:`, professional profiles); no form that
  collects visitor data may be added without an amendment. Contact details exposed MUST be ones
  the owner has deliberately chosen to publish.

**Rationale**: Visitors trust the site with their attention and the owner trusts it with their
identity; neither should be compromised for convenience.

## Technical Constraints

- Hosting: GitHub Pages, deployed from the `main` branch via a GitHub Actions workflow, with
  HTTPS enforced. A custom domain is optional.
- The repository source MUST be directly servable as-is; an optional minification step in the
  deploy workflow is permitted provided the output remains plain HTML, CSS, and JavaScript.
- Development-only tooling (Prettier, ESLint, Stylelint, HTML validator, axe/pa11y, Lighthouse
  CI, link checker, a local static server) is permitted and MUST NOT ship to visitors.
- Tooling choices MUST be made in `/speckit-plan` and recorded in `CLAUDE.md` together with the
  real format, lint, test, and preview commands.
- Supported browsers: the last two major versions of evergreen browsers (Chrome, Edge, Firefox,
  Safari, including iOS Safari and Chrome for Android).

## Web Platform Best Practices

The following 20 practices apply to every change. Each is verifiable by inspection or tooling.

1. **Document basics**: `<!doctype html>`, `<html lang="…">`, `<meta charset="utf-8">`, and a
   viewport meta of `width=device-width, initial-scale=1` that never disables zoom.
2. **Landmarks and headings**: one `header`, `nav`, `main`, and `footer`; each content section
   is a `section` with an `id` and a heading; exactly one `h1` and no skipped heading levels.
3. **Skip link**: the first focusable element is a "Skip to main content" link targeting `main`.
4. **Progressive enhancement**: JavaScript only enhances (menu toggle, active-section
   highlighting, theme switch); the page is complete and navigable without it.
5. **Module hygiene**: a single entry module imports feature modules; modules export pure,
   testable functions and attach listeners via `addEventListener` only.
6. **Design tokens**: colours, spacing scale, type scale, radii, shadows, z-index layers, and
   motion durations are defined once as custom properties in a dedicated tokens file; the
   site's stylesheets and scripts consume them and never repeat their literal values (see
   Principle III for the non-CSS contexts that may).
7. **CSS architecture**: files or `@layer`s ordered tokens → reset/base → layout → components →
   utilities; low, flat specificity; no `!important` outside utilities; no ID selectors.
8. **Mobile-first queries**: `min-width` media queries in `em`/`rem`, with breakpoints chosen
   where content breaks rather than for specific devices.
9. **Fluid type and rhythm**: `clamp()`-based type and spacing; body text ≥ 1rem; line length
   between 45 and 75 characters; unitless line-height.
10. **Overflow safety**: media is `max-width: 100%`; long words and URLs wrap
    (`overflow-wrap: anywhere` where needed); no element is wider than the viewport.
11. **Touch targets**: interactive elements are at least 44×44 CSS px with adequate spacing.
12. **Focus visibility**: styled with `:focus-visible` at ≥ 3:1 contrast; `outline: none` is
    never used without an equivalent replacement.
13. **Contrast and colour use**: text ≥ 4.5:1 (≥ 3:1 for large text), UI components and focus
    indicators ≥ 3:1; colour is never the sole means of conveying information.
14. **Reduced motion**: animations, transitions, and smooth scrolling are enabled only inside
    `@media (prefers-reduced-motion: no-preference)`.
15. **Responsive images**: AVIF/WebP via `<picture>` with a fallback, `srcset`/`sizes`,
    explicit `width`/`height`, meaningful `alt` (or `alt=""` if decorative), `loading="lazy"`
    and `decoding="async"` below the fold, and `fetchpriority="high"` on the hero image only.
16. **Fonts**: a system font stack by default; any web font is self-hosted WOFF2, subset, at
    most two families, `font-display: swap`, with only the critical file preloaded.
17. **Icons and SVG**: inline SVG or a local sprite; decorative icons use `aria-hidden="true"`;
    icon-only links and buttons have an accessible name.
18. **Links**: link text is descriptive out of context; external links opened in a new tab use
    `rel="noopener noreferrer"` and indicate that they open a new tab.
19. **Metadata and SEO**: unique `title` and meta description, canonical URL, Open Graph and
    Twitter card tags with a share image, favicon set with `apple-touch-icon`, `theme-color`,
    JSON-LD `Person` structured data, `robots.txt`, and `sitemap.xml`.
20. **GitHub Pages hygiene**: a `.nojekyll` file, relative asset paths that work under a
    `/<repo>/` project subpath, a custom `404.html`, lowercase kebab-case filenames, and
    versioned asset URLs (hash or query string) for cache busting.

## Development Workflow & Quality Gates

- Feature work follows the Spec Kit cycle: specify → (clarify) → plan → tasks → implement.
  Review gates after specify and plan are defined in `.specify/workflows/speckit/workflow.yml`.
- Every plan MUST pass the Constitution Check before research and again after design;
  violations MUST be recorded and justified in Complexity Tracking or the design changed.
- Changes MUST be made on a branch and merged only after the CI gate passes. The CI gate MUST
  run: Prettier check, ESLint, Stylelint, HTML validation, internal link check, an axe scan,
  and Lighthouse CI against the budgets in Principle VI. A failing gate MUST block deployment.
- Before a change is considered done, the page MUST be viewed in a browser at the widths listed
  in Principle II, navigated end-to-end by keyboard, and checked with JavaScript disabled.
- Any change adding a new section or interactive component MUST also be smoke-tested with a
  screen reader (NVDA, VoiceOver, or TalkBack).

## Governance

- This constitution supersedes other project practices. Where guidance conflicts, this document
  wins; `CLAUDE.md` holds runtime development guidance and MUST stay consistent with it.
- **Amendments** are made via `/speckit-constitution`, MUST include a Sync Impact Report, and
  take effect once written to `.specify/memory/constitution.md`.
- **Versioning** follows semantic versioning:
  - MAJOR: a principle is removed or redefined in a backward-incompatible way.
  - MINOR: a principle, section, or best practice is added or materially expanded.
  - PATCH: clarifications, wording, or typo fixes.
- **Compliance review**: `/speckit-plan` checks each plan against these principles, and
  `/speckit-analyze` flags conflicts with them as CRITICAL. Principles SHOULD be reviewed at
  least once a year or whenever the hosting or stack changes.

**Version**: 2.1.0 | **Ratified**: 2026-09-25 | **Last Amended**: 2026-09-29
