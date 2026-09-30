# Implementation Plan: Personal Portfolio Website

**Branch**: `001-portfolio-website` |
**Date**: 2026-09-29, amended 2026-09-30 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `specs/001-portfolio-website/spec.md`

## Amendment 2026-09-30 — narrative content structure

The owner replaced the Experience timeline with one verbatim narrative paragraph (spec FR-011–
FR-015), fixed the About Me text (FR-008), and supplied the GitHub and LinkedIn URLs (FR-006).
Constitution v2.1.1 renames the required section to "Experience". Design deltas:

- **Removed**: timeline markup, `components/timeline.css`, `js/reveal.js` and its tests, the
  `data-reveal` state, `--duration-reveal`, and the role-date content inputs (research R-15 and
  R-16 are superseded; implementation Phase 3/5 steps that built them are historical).
- **Added**: `components/experience.css` — a single narrative block with a readable measure,
  serif drop cap, and amber rule (research R-27); privacy/structure tests for the narrative.
- **Unchanged**: section order and ids (`#experience` keeps its nav link), theme, menu,
  copy-email, scroll-spy, build, and budgets. Lighthouse targets are unchanged.
- Tasks: `tasks.md` Phase 8 (T104–T117) applies the amendment.

## Summary

Build a single-page, static portfolio for Aseel Almanahy — Hero, About Me, Experience
(narrative), Projects, Contact Links — in hand-written HTML5, CSS3 (custom-property design
tokens, cascade layers, BEM), and native ES modules, hosted on GitHub Pages. All content lives in
HTML so the page is complete without JavaScript; JavaScript only adds the two-state theme toggle
(with a no-flash head bootstrap), copy-email button, mobile menu, and current-section indicator. Quality is enforced by a single `npm run verify` gate (Prettier,
ESLint, Stylelint, html-validate, unit tests, Playwright + axe in three engines, Lighthouse CI,
link check) that must pass before GitHub Actions deploys `dist/`. Work proceeds in five
sequential implementation phases, each ending in a validation gate derived from the 16-item spec
quality checklist (G1–G16). Technical decisions and alternatives are in
[research.md](research.md).

## Technical Context

**Language/Version**: HTML5 (WHATWG Living Standard), CSS3 (custom properties, `@layer`,
`clamp()`, Grid/Flexbox), JavaScript ES2022 native modules. Development tooling runs on
Node.js 24 LTS.

**Primary Dependencies**: None at runtime. Dev-only: Prettier, ESLint 9 (`@eslint/js`,
`globals`), Stylelint 16 (`stylelint-config-standard`), html-validate, `@playwright/test`,
`@axe-core/playwright`, `@lhci/cli`, linkinator, lightningcss, http-server (research R-01).

**Storage**: Visitor's `localStorage`, one key (`theme`) — see
[contracts/behaviour.md](contracts/behaviour.md). No server storage.

**Testing**: `node:test` (unit, pure helpers); Playwright on Chromium, Firefox, WebKit
(end-to-end, viewport matrix, JS-off, reduced motion, colour scheme) with axe WCAG 2.2 AA
scans; Lighthouse CI (mobile); html-validate; linkinator; custom static checks in `tools/`.

**Target Platform**: Last two major versions of Chrome, Edge, Firefox, Safari (desktop, iOS,
Chrome for Android); static hosting on GitHub Pages over HTTPS.

**Project Type**: Static single-page website (plus `404.html`).

**Performance Goals**: Lighthouse mobile — Performance ≥ 95, Accessibility 100, Best Practices
≥ 95, SEO ≥ 95; LCP ≤ 2.0s, CLS ≤ 0.05, INP ≤ 200ms (TBT ≤ 200ms as lab proxy).

**Constraints**: HTML + CSS + JS ≤ 100 KB compressed (JS ≤ 30 KB); total initial weight
≤ 300 KB; one render-blocking stylesheet in production; no third-party requests (CSP
`default-src 'none'`); WCAG 2.2 AA in both themes; no horizontal scroll 320–2560px and at 400%
zoom; source directly servable without a build.

**Scale/Scope**: 1 page + 404; 5 sections; 2 education entries; 2 skill groups (8 skills);
1 experience narrative; 0 projects at launch (grid designed for ~12); 6 JS modules; 15 CSS
partials. Expected size: HTML ≈ 4 KB, CSS ≈ 6 KB, JS ≈ 3 KB (gzip).

All previously open questions are resolved in research.md (R-01 – R-26); none remain.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

Constitution v2.1.0 (re-checked after the `/speckit-analyze` remediation of 2026-09-29).

| Principle / Rule | Gate | Pre-research | Post-design evidence |
|---|---|---|---|
| I. Vanilla Web Platform | HTML/CSS/ES modules only; no frameworks, TS, preprocessors; semantic HTML; no inline handlers/styles | PASS | No runtime deps; BEM CSS; modules per R-08; the one inline theme bootstrap (< 1 KB, CSP-hashed, CI-checked) is permitted by Principle I's "Theme bootstrap exception" (R-02) |
| II. Mobile-First | `min-width` queries only; 320–2560 no h-scroll; 200%/400% zoom | PASS | em breakpoints (R-11); viewport-matrix e2e (V3.1–V3.2) |
| III. Warm Minimalist | Cream/amber/dark roles; all colours via tokens; contrast in every theme; subtle motion | PASS | Palette + contrast table (R-09); Stylelint colour-literal ban outside `tokens.css` (R-07); motion tokens ≤ 400ms |
| IV. Code Quality & A11y | WCAG 2.2 AA, 0 axe violations; keyboard; reduced motion; JS-off; Prettier/ESLint/Stylelint/HTML validator 0 warnings; tokens on `:root` | PASS | `npm run verify` (quickstart); axe in both themes & JS-off (V2.2, V3.7); `.editorconfig` (P1.1) |
| V. Single-Page Scope | Five sections in order Hero, About, Experience, Projects, Contact; only extra page `404.html`; content in HTML; anchor nav | PASS | [contracts/page-structure.md](contracts/page-structure.md); `privacy-scope` e2e |
| VI. GitHub Pages Delivery | Static, no server; Lighthouse thresholds; CWV; budgets; ≤ 1 render-blocking stylesheet; scripts are modules | PASS | Lightning CSS bundles to one stylesheet in `dist/` (R-07); LHCI + `check-budgets` (V5.5); the inline theme bootstrap is the only non-module script, covered by the Principle I exception referenced in Principle VI. Dev-mode `@import` partials are not deployed. |
| VII. Privacy & Security | No trackers; no third-party requests; CSP + referrer via meta; HTTPS; no secrets; links-only contact | PASS | CSP policy (R-20); no forms (FR-022); `privacy-scope` e2e asserts same-origin requests only |
| Technical Constraints | GitHub Pages via Actions; source servable as-is; dev tooling allowed; tooling recorded in `CLAUDE.md`; evergreen browsers | PASS | R-24 workflow; `CLAUDE.md` updated by this plan; Playwright 3 engines |
| Best Practices 1–20 | All apply | PASS | Mapped in phase steps (BP# noted inline) |
| Workflow & Quality Gates | Branch-based; CI gate blocks deploy; manual viewport/keyboard/JS-off/screen-reader checks | PASS | P1.1 creates branch; `ci.yml` `deploy needs verify`; manual gates in quickstart |

**Result**: PASS. No violations; Complexity Tracking is empty. Principle III is satisfied with
colour literals only in `tokens.css` among stylesheets and scripts (`theme.js` reads colours via
`getComputedStyle`; print colours live in `tokens.css`); the literals in `theme-color` metas,
`favicon.svg`, and the dev-only OG template are permitted by Principle III's non-CSS clause.

## Project Structure

### Documentation (this feature)

```text
specs/001-portfolio-website/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output — run & validation guide
├── contracts/
│   ├── page-structure.md
│   ├── content-blocks.md
│   └── behaviour.md
├── checklists/
│   └── requirements.md  # 16-item spec quality checklist (source of gates G1–G16)
└── tasks.md             # Created by /speckit-tasks (not by this command)
```

### Source Code (repository root)

```text
src/                          # Deployable site — servable as-is
├── index.html
├── 404.html
├── robots.txt
├── sitemap.xml
├── .nojekyll
├── css/
│   ├── main.css              # @import partials into layers: tokens, reset, base, layout, components, utilities
│   ├── tokens.css            # ONLY file allowed to contain colour literals
│   ├── reset.css
│   ├── base.css
│   ├── layout.css
│   ├── utilities.css
│   ├── print.css             # media="print", non-blocking
│   └── components/
│       ├── button.css
│       ├── site-header.css   # brand, nav, menu toggle
│       ├── theme-toggle.css
│       ├── hero.css
│       ├── section.css
│       ├── about.css         # education + skill groups
│       ├── tag.css
│       ├── experience.css    # narrative block (replaced timeline.css, 2026-09-30)
│       ├── projects.css      # .projects__grid / .projects__item
│       ├── project-card.css
│       ├── contact.css       # incl. copy-email
│       └── site-footer.css
├── js/
│   ├── main.js               # entry; calls init* in isolated try/catch
│   ├── storage.js
│   ├── theme.js
│   ├── nav.js
│   ├── scroll-spy.js
│   └── copy-email.js
└── assets/
    ├── icons.svg             # sprite: github, linkedin, email, sun, moon, menu, external
    ├── favicon.svg
    ├── favicon-32.png
    ├── apple-touch-icon.png
    └── og-image.png          # 1200×630

tests/
├── unit/                     # node --test
│   ├── storage.test.js
│   ├── theme.test.js
│   ├── copy-email.test.js
│   ├── nav.test.js
│   ├── scroll-spy.test.js
│   └── contrast.test.js      # parses tokens.css, asserts R-09 contrast pairs
├── e2e/                      # Playwright (Chromium, Firefox, WebKit)
│   ├── structure.spec.js
│   ├── hero-contact.spec.js  # US1
│   ├── about-experience.spec.js  # US2
│   ├── projects.spec.js      # US3 (injects sample cards)
│   ├── nav-theme.spec.js     # US4
│   ├── responsive.spec.js    # viewport matrix, zoom, overflow, bar height
│   ├── a11y.spec.js          # axe: light/dark × JS on/off × 375/1024
│   ├── no-js.spec.js
│   └── privacy-scope.spec.js # narrative-only Experience, no forms/résumé, same-origin only
└── helpers/
    └── page-utils.js         # overflow, obscured-by-header, console-error collectors

tools/                        # Dev-only Node scripts
├── build.mjs                 # src → dist: bundle+minify CSS, cache-bust ?v=hash, copy
├── check-csp.mjs             # inline bootstrap hash == CSP meta hash (src and dist)
├── check-site-url.mjs        # canonical, og:url, sitemap, robots, 404 <base> agree
├── check-content.mjs         # counts CONTENT: markers; --strict fails if > 0
├── check-budgets.mjs         # gzip sizes of dist vs Principle VI budgets
├── generate-images.mjs       # og-image + PNG icons via Playwright screenshot
└── og-template.html

.github/workflows/ci.yml      # verify (PR + push) → deploy (main only)
package.json  package-lock.json  eslint.config.js  .stylelintrc.json  .prettierrc.json
.prettierignore  .htmlvalidate.json  playwright.config.js  lighthouserc.json
.editorconfig  .gitignore  CLAUDE.md
```

**Structure Decision**: A single static-site project. `src/` is the deployable root and is
served unmodified in development; `dist/` (git-ignored) is the build output that CI tests and
deploys. Tests and tools sit beside `src/` and never ship.

## Validation Gates (G1–G16)

The user asked that every phase be validated against the 16 checklist rules. Those rules
(in [checklists/requirements.md](checklists/requirements.md)) validate a *specification*, so
each is translated into the equivalent question for the code a phase produces (research R-26).
Every phase must pass the gates marked for it **and must not regress any gate passed earlier**.

| Gate | Checklist rule | Question at the implementation gate | Evidence |
|---|---|---|---|
| G1 | No implementation details (languages, frameworks, APIs) | Did all technical decisions go into plan/research, leaving `spec.md` untouched except its header metadata lines (Feature Branch, Status)? | `git diff main -- specs/001-portfolio-website/spec.md` shows no changes below the `**Input**` line |
| G2 | Focused on user value and business needs | Does every file/feature added trace to an FR or user story, with nothing untraceable? | Phase traceability table filled in PR |
| G3 | Written for non-technical stakeholders | Is all visitor-facing text plain-language and free of developer artefacts? | Review; `grep -rE "TODO\|FIXME\|lorem\|console\.log" src` = 0 |
| G4 | All mandatory sections completed | Are all sections this phase owns complete, with no empty or stub section? | `structure.spec.js` |
| G5 | No [NEEDS CLARIFICATION] markers remain | Are there no unresolved decisions in code? Only tracked `CONTENT:` inputs allowed (0 at launch) | `tools/check-content.mjs` report |
| G6 | Requirements are testable and unambiguous | Does each FR delivered in this phase have ≥ 1 passing automated or documented manual check? | Test report + FR traceability |
| G7 | Success criteria are measurable | Were the SCs this phase touches measured, with numbers recorded? | CI output pasted/linked in PR |
| G8 | Success criteria are technology-agnostic | Were SCs verified from the visitor's side, in real browsers at real viewports? | Playwright runs in 3 engines |
| G9 | All acceptance scenarios are defined | Are in-scope Given/When/Then scenarios automated and passing? | e2e specs per story |
| G10 | Edge cases are identified | Are in-scope edge cases automated (or manual-scripted) and passing? | e2e / quickstart edge table |
| G11 | Scope is clearly bounded | Nothing out of scope: no forms, résumé, analytics, extra pages, frameworks, third-party requests | `privacy-scope.spec.js`; no `dependencies` in `package.json` |
| G12 | Dependencies and assumptions identified | Are new dev deps justified in research, runtime deps zero, content-input list current? | `package.json` diff review; quickstart inputs list |
| G13 | All FRs have clear acceptance criteria | Are this phase's FR rows ticked with evidence? | Traceability table below |
| G14 | User scenarios cover primary flows | Can the stories listed as "demonstrable" for this phase be run end-to-end? | e2e grouped by story |
| G15 | Feature meets measurable outcomes | Are SCs claimed by this phase met, with no regression in earlier ones? (Phase 5: all SC-001–SC-010) | `npm run verify` + manual gates |
| G16 | No implementation details leak into specification | Do no internal or implementation details leak onto the published page (enterprise details, debug text, secrets, source comments)? | Privacy review (FR-015); `privacy-scope.spec.js`; HTML comment scan |

## Implementation Phases

Phases run strictly in order. A phase's code-generation steps start only after the previous
phase's **Exit** conditions hold. Step IDs (P#.#) and validation IDs (V#.#) are referenced by
`/speckit-tasks`.

### Implementation Phase 1 — File Structure & HTML Semantic Boilerplate

**Goal**: A complete, valid, accessible, unstyled page containing all real content, plus the
tooling that will validate every later phase.
**Covers**: FR-001–FR-012, FR-014, FR-017–FR-022a (content/markup parts), FR-027, FR-035,
FR-036 (markup); BP 1–5, 17–20.
**Demonstrable stories**: US1 (content & links, unstyled), US2 (content, unstyled).

Steps:

- **P1.1** `git init` (default branch `main`), create branch `001-portfolio-website`;
  add `.gitignore` (`node_modules/`, `dist/`, `test-results/`, `playwright-report/`,
  `.lighthouseci/`) and `.editorconfig` (UTF-8, LF, 2 spaces, final newline).
- **P1.2** `package.json` (`private`, `"type": "module"`, `engines.node >= 24`, dev deps from
  R-01, scripts from quickstart) and configs: `.prettierrc.json`, `eslint.config.js` (browser
  globals for `src/js`, node for `tools`/`tests`; `no-console: error`,
  `max-lines-per-function: [error, 40]`, `no-implicit-globals`), `.stylelintrc.json` (standard
  + BEM `selector-class-pattern`; `color-no-hex`, `color-named: never`, colour-function ban with
  override for `tokens.css`), `.htmlvalidate.json` (recommended), `playwright.config.js`
  (3 projects; web server serves `dist/`), `lighthouserc.json` (R-23 assertions).
- **P1.3** Create the `src/` tree; root files `.nojekyll`, `robots.txt`, `sitemap.xml`
  ([page-structure contract](contracts/page-structure.md#root-files)). CSS partials created
  empty and imported by `main.css` so every link resolves.
- **P1.4** `index.html` head exactly per [page-structure](contracts/page-structure.md):
  CSP meta, referrer, title, inline bootstrap (R-02) before the stylesheet, module script,
  metadata, JSON-LD. Write `tools/check-csp.mjs` and insert the computed hash.
- **P1.5** Body per contract: skip link, header (brand, nav, Menu and theme buttons shipped
  `hidden`), `main` with the five sections in order and all content from
  [content-blocks](contracts/content-blocks.md): verbatim hero; 3 CTAs; About intro draft;
  2 education entries; 2 skill groups; 4 timeline entries (ordered per data-model); one
  coming-soon card; Contact links, email text, hidden Copy button, status region; footer.
  Unknown values use `CONTENT:` markers only.
- **P1.6** `assets/icons.svg` sprite and `favicon.svg`.
- **P1.7** `404.html` per contract; `tools/check-site-url.mjs`; `tools/check-content.mjs`.
- **P1.8** Minimal `tools/build.mjs` (copy `src` → `dist`) so e2e runs against `dist/`;
  e2e specs `structure`, `hero-contact` (content/attribute assertions), `no-js`,
  `privacy-scope`, `a11y` (light only for now); `tests/helpers/page-utils.js`.
- **P1.9** Confirm the commands recorded in `CLAUDE.md` all run.

Validation criteria:

| ID | Criterion | Gates |
|---|---|---|
| V1.1 | `npm run lint` → 0 errors, 0 warnings (html-validate passes `index.html` and `404.html`) | G6 |
| V1.2 | `npm run format:check` → clean | G3 |
| V1.3 | `check-csp` passes; `check-site-url` passes; `check-content` lists only the inputs in quickstart | G5, G12 |
| V1.4 | `structure.spec`: landmarks and section order/ids match contract; one `h1`; no skipped heading levels; skip link is first focusable; all head metadata present | G4, G6, G13 |
| V1.5 | `hero-contact.spec`: greeting and statement verbatim; 6 contact links with correct `href`, `target`, `rel`, and new-tab cue; email text equals `mailto:` address | G6, G9 |
| V1.6 | `no-js.spec`: all sections, content, and links present with JS disabled; theme, Menu, Copy buttons not rendered | G10 |
| V1.7 | `privacy-scope.spec`: each timeline entry has only title, org, dates, category; no `<form>`; no résumé link; every request same-origin; `package.json` has no `dependencies` | G11, G16 |
| V1.8 | axe (WCAG 2.2 AA tags): 0 violations on the unstyled page | G6 |
| V1.9 | Manual: unstyled page reads top-to-bottom in logical order; privacy review of timeline text drafted | G3, G16 |
| V1.10 | `grep` for TODO/FIXME/lorem/console.log in `src` = 0; `spec.md` unchanged below its header metadata | G1, G3 |

**Exit**: V1.1–V1.10 pass; G1–G6, G9–G13, G16 satisfied for Phase 1 scope.

### Implementation Phase 2 — Core Layout & Typography via CSS Variables

**Goal**: Design tokens and the warm cream / amber / cozy dark palette in both themes, global
typography, base layout, header, hero, buttons, and footer — mobile single-column.
**Covers**: FR-004–FR-005 (visual), FR-028, FR-029, FR-033, FR-034, part of FR-032; BP 6, 7,
9, 11–13, 16.
**Demonstrable stories**: US1 fully (styled hero + contact, SC-001).

Steps:

- **P2.1** `tokens.css`: colour tokens (R-09) with light on `:root`, dark declared identically
  under the media-query and `[data-theme="dark"]` selectors, and light re-declared in
  `@media print` (R-03); `color-scheme`; spacing scale
  (`--space-1`…`--space-8`, 0.25rem base, fluid section gaps); type scale with `clamp()` and
  font stacks (R-10); radii; warm-tinted shadows; z-index layers; durations
  (`--duration-ui/-theme/-reveal`); `--nav-height: 3.5rem`; `--container-max: 72rem`;
  `--measure: 65ch`.
- **P2.2** `reset.css` (box-sizing, margin reset, media `max-width: 100%`, form controls
  inherit font).
- **P2.3** `base.css`: body colours via tokens; heading/body typography; links (accent,
  underline offset); `:focus-visible` 3px `--color-focus` outline with 3px offset;
  `html { scroll-padding-top }`; `scroll-behavior: smooth` only under
  `prefers-reduced-motion: no-preference`; `overflow-wrap: anywhere` for long strings;
  `[data-theme-switching]` colour transitions (R-05).
- **P2.4** `layout.css`: `.container`, section block spacing, sticky header shell, `main`,
  footer.
- **P2.5** Components: `button` (primary/secondary/small; min 44×44), `site-header` base,
  `hero` (fits 375×667 without `100vh` tricks), `section`, `site-footer`, skip link (visible on
  focus); `utilities.css` (`[hidden] { display: none !important; }` so component `display`
  rules never reveal JS-only controls, `.visually-hidden`, `.icon`).
- **P2.6** `main.css` layer order; `print.css` skeleton; `tests/unit/contrast.test.js`.

Validation criteria:

| ID | Criterion | Gates |
|---|---|---|
| V2.1 | `stylelint` → 0; no colour literal outside `tokens.css` | G6, G12 |
| V2.2 | axe → 0 violations in light and dark (`emulateMedia({ colorScheme })`), incl. contrast | G6, G8, G15 (SC-007 partial) |
| V2.3 | `contrast.test.js`: every R-09 pair ≥ its required ratio in both themes | G7 |
| V2.4 | SC-001: at 375×667 in 3 engines, `h1`, statement, and 3 CTAs have `bottom ≤ 667` | G7, G8, G9, G15 |
| V2.5 | No flash: saved `dark` + device light → `data-theme="dark"` at `DOMContentLoaded` and first-frame background = dark token; JS off + device dark → dark tokens | G9, G10 |
| V2.6 | Tab through page: every focusable element shows an outline ≥ 2px; every interactive element's box ≥ 44×44 | G6, G13 |
| V2.7 | At 320px: `document.documentElement.scrollWidth ≤ innerWidth` | G7 |
| V2.8 | Layout shift sum during load ≤ 0.05 (PerformanceObserver) | G7 |
| V2.9 | Manual: hero/typography screenshots at 375 & 1440 in both themes reviewed as "minimal, warm, welcoming" | G3, G14 |

**Exit**: V2.1–V2.9 pass; US1 demonstrable end-to-end; Phase 1 gates not regressed.

### Implementation Phase 3 — Mobile-First Responsive Grid & Timeline Styles

**Goal**: Full responsive behaviour from 320 to 2560px: navigation layouts, About grid, skill
tags, vertical timeline with interaction highlight, projects grid and cards, contact layout,
print styles.
**Covers**: FR-012, FR-013 (highlight), FR-016–FR-020 (visual), FR-021 (layout), FR-023,
FR-023a, FR-025 (layout), FR-032; BP 8–10, 15.
**Demonstrable stories**: US2 fully (except scroll-in), US3 fully.

Steps:

- **P3.1** Header/nav: below `48em` with `.js`, list collapses into a full-width panel under
  the bar (links ≥ 44px) keyed off `aria-expanded`; without `.js` the list wraps visibly;
  from `48em` links sit inline. Bar height = `--nav-height` when collapsed; landscape phones
  keep the same compact bar.
- **P3.2** About: education and skills stacked, two columns from `48em`; `tag`/`tag-list`
  (flex-wrap).
- **P3.3** Timeline: single vertical column at every width; line via `::before` on the list;
  markers differ by shape (circle = Engineering, diamond = Leadership) and colour; entry card,
  dates, category badge; one highlight rule for `:hover`, `:focus-visible`, `:focus-within`
  (background tint, accent border, marker emphasis — no layout-affecting properties).
- **P3.4** Projects: `ul.projects__grid` in `components/projects.css` with
  `repeat(auto-fill, minmax(min(100%, 18rem), 1fr))`; `project-card` in
  `components/project-card.css` (title, description, tag list, links) and `--placeholder`
  modifier; equal-height cards.
- **P3.5** Contact: three routes, email row that wraps at 320px, copy status placement.
- **P3.6** Wide screens: container max width centred; verify 2560px.
- **P3.7** `print.css`: hide header controls, static header, append external URLs (layout and
  visibility only — light print colours come from the `@media print` block in `tokens.css`).

Validation criteria:

| ID | Criterion | Gates |
|---|---|---|
| V3.1 | SC-004: at 320, 375, 768, 1024, 1440, 2560 × light/dark × 3 engines — no horizontal overflow and no visible element's right edge beyond the viewport | G7, G8, G15 |
| V3.2 | 400% zoom (1280px window → 320 CSS px) and 200% root font size at 375: no overflow; email and URLs wrap | G10 |
| V3.3 | `projects.spec` with 3 injected sample cards: 1 column at 375, ≥ 2 at 768+; all five elements present; missing demo link omitted; lone coming-soon card width ≤ one column at 2560 | G9, G10, G14 |
| V3.4 | Timeline: one column and most-recent-first order at all widths; category text present; marker shapes differ; hovered vs focused entry computed styles identical | G6, G9 |
| V3.5 | Nav: header height ≤ 56px at 375 (JS on, collapsed); all links inline at ≥ 768; JS off at 375 all links visible and reachable | G6, G10 |
| V3.6 | FR-023a: deep link to each section → heading top ≥ header bottom; tabbing through the page → no focused element intersects the header | G9, G10 |
| V3.7 | axe → 0 violations at 375 and 1024 in both themes | G6, G15 |
| V3.8 | Print emulation: header controls hidden, light scheme, external URLs visible | G10 |
| V3.9 | Manual: screenshot matrix (6 widths × 2 themes) signed off | G14 |

**Exit**: V3.1–V3.9 pass; US2 (minus animation) and US3 demonstrable; no regressions.

### Implementation Phase 4 — Vanilla JS Modules (Theme Toggle, Copy-to-Clipboard, Menu)

**Goal**: Behaviour layer as isolated ES modules with unit-tested pure helpers.
**Covers**: FR-021a, FR-024, FR-025, FR-029–FR-031, FR-035 (progressive enhancement);
BP 4, 5, 14.
**Demonstrable stories**: US4 scenarios 1–5; US1 scenario 4 (copy).

Steps:

- **P4.1** `storage.js` + tests (working store, throwing store, missing store).
- **P4.2** `theme.js`: `resolveEffectiveTheme`, `nextTheme`, `initThemeToggle` (reveal button,
  sync `aria-pressed`, toggle → set `data-theme`, persist, set `data-theme-switching` for
  300ms, update `theme-color`; follow device changes only while no saved choice) + tests.
  Sun/moon icon swap in `theme-toggle.css` keyed on `aria-pressed`.
- **P4.3** `copy-email.js`: `copyText`, `statusMessage`, `initCopyEmail` (feature-detect,
  reveal, write, status text, 4s clear with timer reset) + tests using a fake clipboard.
- **P4.4** `nav.js`: `shouldCollapse`, `initNav` (reveal Menu button below `48em`,
  `aria-expanded`, Escape closes and returns focus, close on link choice, focus target section
  with `preventScroll`, reset when widening) + tests.
- **P4.5** `main.js` entry with isolated `try/catch` per `init*`; `modulepreload` links.

Validation criteria:

| ID | Criterion | Gates |
|---|---|---|
| V4.1 | ESLint → 0; `npm run test:unit` → all pass; every exported pure helper has tests including failure paths | G6, G13 |
| V4.2 | Theme e2e: click/Enter/Space toggle; `aria-pressed` and `data-theme` flip; reload persists (SC-008); throwing storage → toggle still works and 0 console errors; device change followed only with no saved choice | G9, G10, G15 |
| V4.3 | Theme motion: with reduced motion, computed transition duration is 0 during a switch; otherwise ≤ 300ms | G10 |
| V4.4 | Copy e2e: Chromium with clipboard permission → clipboard equals address and status "Copied!" in `role="status"`, cleared after ~4s; stubbed rejection (all engines) → failure message; JS off → button absent | G9, G10 |
| V4.5 | Menu e2e at 375: button visible; `aria-expanded` false→true; Escape closes and focus returns; choosing a link closes the menu, focuses the section, heading below bar; at 1024 button hidden | G9, G10 |
| V4.6 | Keyboard walkthrough: logical tab order, every control reachable and operable, no traps (SC-006 automated part) | G8, G15 |
| V4.7 | 0 console errors/warnings and 0 `securitypolicyviolation` events across all specs | G11, G16 |
| V4.8 | `check-budgets`: JS ≤ 30 KB compressed | G7 |
| V4.9 | Manual: NVDA and VoiceOver announce toggle state, menu state, and copy status | G8, G14 |

**Exit**: V4.1–V4.9 pass; US4 scenarios 1–5 demonstrable; no regressions.

### Implementation Phase 5 — Scroll Animations & Performance Refinements (and Launch)

**Goal**: Timeline scroll-in, current-section indicator, smooth-scroll polish, share assets,
production build, Lighthouse tuning, CI/CD, and the final launch gate.
**Covers**: FR-013 (animation), FR-013a, FR-015, FR-024 (smooth), FR-026, FR-036 (assets); all
SCs; BP 14, 15, 19, 20.
**Demonstrable stories**: all (US1–US4 complete).

Steps:

- **P5.1** `reveal.js` (R-16) + pending/visible styles in `timeline.css` + unit tests.
- **P5.2** `scroll-spy.js` (R-14) + `aria-current` styling + unit tests.
- **P5.3** Verify smooth scroll and focus-not-obscured in all engines; add the `focusin` guard
  (R-13) only if an engine fails V3.6/V5.3.
- **P5.4** `tools/generate-images.mjs` → `og-image.png` (1200×630, ≤ 100 KB),
  `apple-touch-icon.png`, `favicon-32.png`; wire metadata.
- **P5.5** Complete `tools/build.mjs` (Lightning CSS bundle + minify to one stylesheet,
  `?v=<hash>` cache-busting, copy) and `tools/check-budgets.mjs`.
- **P5.6** Lighthouse CI tuning: one render-blocking stylesheet, `modulepreload`, explicit
  image dimensions, no unused assets.
- **P5.7** `.github/workflows/ci.yml` (`verify` builds, tests, and uploads the tested `dist/`
  as the Pages artifact → `deploy` on `main` only publishes that artifact); create the GitHub
  repository once the owner confirms its name (it fixes the site URL); set Pages source to
  GitHub Actions and enforce HTTPS (manual, repository settings).
- **P5.8** Fill all content inputs; final privacy review; screen-reader, visual, and usability
  gates; merge to `main` and deploy.

Validation criteria:

| ID | Criterion | Gates |
|---|---|---|
| V5.1 | Reveal e2e: from top with motion → below-fold entries `pending` then `visible` once scrolled (≤ 1s); reduced motion → no `data-reveal` set; JS off → all visible; deep link `#projects` and fast scroll to bottom → no entry left `pending`; layout shift during scroll ≤ 0.05 | G9, G10 |
| V5.2 | Scroll-spy: exactly one link has `aria-current="true"` for each content section; none in hero | G9 |
| V5.3 | Smooth scroll: `scroll-behavior: smooth` only with motion allowed; nav jumps keep headings below bar in 3 engines | G9, G10 |
| V5.4 | `dist/index.html` has exactly one render-blocking stylesheet; all local asset URLs carry `?v=`; `check-csp` passes on `dist` | G7 |
| V5.5 | `check-budgets` and Lighthouse CI: HTML+CSS+JS ≤ 100 KB, JS ≤ 30 KB, total ≤ 300 KB; Perf ≥ 95, A11y 100, BP ≥ 95, SEO ≥ 95; LCP ≤ 2.0s; CLS ≤ 0.05; TBT ≤ 200ms (SC-005) | G7, G15 |
| V5.6 | `linkinator` → 0 broken links (LinkedIn skipped for bot-blocking, verified manually) (SC-010) | G15 |
| V5.7 | Share preview: absolute canonical/OG URLs agree (`check-site-url`); `og-image.png` is 1200×630 | G6 |
| V5.8 | `check-content --strict` → 0 `CONTENT:` markers | G5 |
| V5.9 | CI: `verify` green on PR; `deploy` runs only on `main` after `verify` | G11 |
| V5.10 | Final SC table: SC-001–SC-010 each marked pass with evidence; manual gates (screen reader, visual, privacy review FR-015/SC-009, usability SC-002) recorded | G1–G16 |

**Exit (launch)**: V5.1–V5.10 pass and all gates G1–G16 hold.

## Requirement Traceability

| Requirement | Phase(s) | Primary evidence |
|---|---|---|
| FR-001–FR-003 | 1 | V1.4 |
| FR-004–FR-007 | 1, 2 | V1.5, V2.4 |
| FR-008–FR-010 | 1, 3 | V1.4, V3.1 |
| FR-011, FR-012 | 1, 3 | V1.7, V3.4 |
| FR-013, FR-013a | 3, 5 | V3.4, V5.1 |
| FR-014, FR-015 | 1, 5 | V1.7, V5.10 (privacy review) |
| FR-016–FR-020 | 1, 3 | V3.3 |
| FR-021, FR-021a, FR-022, FR-022a | 1, 3, 4 | V1.5, V1.7, V4.4 |
| FR-023, FR-023a | 3 | V3.5, V3.6 |
| FR-024–FR-027 | 1, 4, 5 | V1.4, V4.5, V5.2, V5.3 |
| FR-028–FR-031 | 2, 4 | V2.2, V2.5, V4.2, V4.3 |
| FR-032–FR-035 | 2, 3, 4 | V2.6, V3.1, V3.2, V1.6 |
| FR-036 | 1, 5 | V1.4, V5.7 |
| SC-001 | 2 | V2.4 |
| SC-002 | 5 | Usability check (manual) |
| SC-003 | 4 | V4.5 |
| SC-004 | 3 | V3.1, V3.2 |
| SC-005 | 5 | V5.5 |
| SC-006 | 4, 5 | V4.6, V4.9 |
| SC-007 | 2, 3 | V2.2, V3.7 |
| SC-008 | 4 | V4.2 |
| SC-009 | 1, 5 | V1.7, privacy review |
| SC-010 | 5 | V5.6, V5.8 |

## Risks

| Risk | Mitigation |
|---|---|
| Content inputs (dates, URLs, email) arrive late | `CONTENT:` markers let all phases proceed; `check-content --strict` blocks deploy |
| An engine ignores `scroll-padding` for focus scrolling | V3.6 detects it; `focusin` guard ready (R-13) |
| Clipboard permission cannot be granted in Firefox/WebKit test runs | Real clipboard asserted in Chromium; stubbed API covers success/failure in all engines |
| JS-off narrow header wraps to two rows (> 56px) | Documented in spec Edge Cases → "Scripting unavailable"; FR-023's height limit applies with scripting available and is verified with JS on (V3.5) |
| LinkedIn blocks automated link checks | Skipped in linkinator, verified manually at launch |

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| — none — | The inline theme bootstrap that was previously listed here is now permitted by constitution v2.1.0 Principle I ("Theme bootstrap exception"; referenced by Principle VI). Its constraints — < 1 KB, CSP SHA-256 hash, CI hash/size check — are implemented by `tools/check-csp.mjs` (R-02, T021) | — |
