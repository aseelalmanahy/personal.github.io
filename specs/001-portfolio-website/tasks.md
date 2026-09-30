---

description: "Task list for the personal portfolio website (001-portfolio-website)"
---

# Tasks: Personal Portfolio Website

**Input**: Design documents from `specs/001-portfolio-website/`

**Prerequisites**: [plan.md](plan.md), [spec.md](spec.md), [research.md](research.md),
[data-model.md](data-model.md), [contracts/](contracts/), [quickstart.md](quickstart.md)

**Tests**: Included. The plan defines a validation gate per phase (V1.x–V5.x, G1–G16) and the
constitution requires automated checks, so test tasks are written **before** the implementation
tasks in each phase and must fail first.

**Organization**: Phases follow the five sequential **Implementation Phases** requested for the
plan (HTML → tokens/typography → responsive layout → JS modules → animation/performance), each
closing with its validation gate. Every story-specific task carries a `[US#]` label, and the
[Story Slices](#story-slices) section lists the tasks that deliver each user story so stories can
still be verified independently.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies on incomplete tasks)
- **[Story]**: US1 Meet & contact (P1) · US2 Background & experience (P2) · US3 Projects (P3) ·
  US4 Navigation & theme (P4) · US5 Interests (P5)
- Plan step references appear as `(P1.4)`; validation criteria as `V2.3`

## Path Conventions

- Deployable site: `src/` (served as-is); build output: `dist/` (git-ignored)
- Tests: `tests/unit/` (node:test), `tests/e2e/` (Playwright), `tests/helpers/`
- Dev scripts: `tools/`; CI: `.github/workflows/ci.yml`
- All e2e specs import `test`/`expect` from `tests/helpers/fixtures.js` (never directly from
  `@playwright/test`) so console-error and CSP-violation checks apply everywhere

---

## Phase 1: Setup (Tooling & Repository)

**Purpose**: Repository, dev tooling, and test harness that every later gate depends on
(plan P1.1, P1.2, P1.8 partial)

- [X] T001 Initialise git at the repo root with `git init -b main`, commit the existing Spec Kit files, then create and switch to branch `001-portfolio-website`; update only the `**Feature Branch**` header line of `specs/001-portfolio-website/spec.md` to `` `001-portfolio-website` `` (header metadata edits are allowed by gate G1); add `.gitignore` containing `node_modules/`, `dist/`, `test-results/`, `playwright-report/`, `.lighthouseci/` (P1.1)
- [X] T002 [P] Create `.editorconfig` at the repo root: `root = true`; `[*]` charset utf-8, end_of_line lf, indent_style space, indent_size 2, insert_final_newline true, trim_trailing_whitespace true; `[*.md]` trim_trailing_whitespace false (P1.1)
- [X] T003 Create `package.json` at the repo root: `"name": "aseel-portfolio"`, `"private": true`, `"type": "module"`, `"engines": { "node": ">=24" }`, **no `dependencies` key**; scripts: `start` = `http-server src -p 8080 -c-1`, `preview` = `npm run build && http-server dist -p 8081 -c-1`, `format` = `prettier --write .`, `format:check` = `prettier --check .`, `lint` = `npm run lint:js && npm run lint:css && npm run lint:html`, `lint:js` = `eslint . --max-warnings 0`, `lint:css` = `stylelint "src/**/*.css" --max-warnings 0`, `lint:html` = `html-validate "src/**/*.html"`, `test:unit` = `node --test tests/unit/`, `build` = `node tools/build.mjs`, `test:e2e` = `playwright test`, `test:lighthouse` = `lhci autorun`, `check:links` = `linkinator dist --recurse --skip "linkedin\\.com"`, `check:static` = `node tools/check-csp.mjs && node tools/check-site-url.mjs && node tools/check-content.mjs && node tools/check-budgets.mjs`, `verify` = `npm run format:check && npm run lint && npm run test:unit && npm run build && npm run check:static && npm run test:e2e && npm run test:lighthouse && npm run check:links`; then run `npm install -D prettier eslint @eslint/js globals stylelint stylelint-config-standard html-validate @playwright/test @axe-core/playwright @lhci/cli linkinator lightningcss http-server` to create `package-lock.json` (research R-01)
- [X] T004 [P] Create `.prettierrc.json` (`{ "singleQuote": true, "printWidth": 100 }`) and `.prettierignore` listing `dist/`, `node_modules/`, `package-lock.json`, `playwright-report/`, `test-results/`, `.lighthouseci/`, `.specify/`, `.claude/`, `.github/skills/`, `specs/`
- [X] T005 [P] Create `eslint.config.js` (flat config): `@eslint/js` recommended for all `*.js`/`*.mjs`; `src/js/**` → `globals.browser`, `sourceType: 'module'`, rules `no-console: 'error'`, `no-implicit-globals: 'error'`, `max-lines-per-function: ['error', { max: 40, skipBlankLines: true, skipComments: true }]`, `eqeqeq: 'error'`, `no-var: 'error'`, `prefer-const: 'error'`; `tools/**` → `globals.node`, `no-console: 'off'`; `tests/**` → `globals.node` + `globals.browser`; ignore `dist/`, `node_modules/`, `playwright-report/`, `.lighthouseci/`
- [X] T006 [P] Create `.stylelintrc.json`: extends `stylelint-config-standard`; `selector-class-pattern` = `^[a-z][a-z0-9]*(-[a-z0-9]+)*(__[a-z0-9]+(-[a-z0-9]+)*)?(--[a-z0-9]+(-[a-z0-9]+)*)?$` (BEM); `selector-max-id: 0`; `declaration-no-important: true`; `color-no-hex: true`; `color-named: "never"`; `function-disallowed-list: ["rgb", "rgba", "hsl", "hsla", "hwb", "lab", "lch", "oklab", "oklch", "color"]`; an `overrides` entry for `src/css/tokens.css` that turns off `color-no-hex` and `function-disallowed-list`, and one for `src/css/utilities.css` that turns off `declaration-no-important` (research R-07)
- [X] T007 [P] Create `.htmlvalidate.json` extending `html-validate:recommended`; if a rule rejects the single inline theme-bootstrap `<script>` or the JSON-LD block, disable only that rule and add a `"//"` note citing constitution Principle I "Theme bootstrap exception" and research R-19
- [X] T008 [P] Create `playwright.config.js`: `testDir: 'tests/e2e'`, `fullyParallel: true`, `retries: process.env.CI ? 1 : 0`, reporters `list` + `html` (open: never), `use.baseURL: 'http://localhost:8081'`, projects `chromium`, `firefox`, `webkit` (desktop devices), `webServer: { command: 'npx http-server dist -p 8081 -c-1 --silent', url: 'http://localhost:8081', reuseExistingServer: !process.env.CI }`
- [X] T009 [P] Create `lighthouserc.json`: `ci.collect.staticDistDir: "./dist"`, `numberOfRuns: 3`; `ci.assert.assertions`: `categories:performance` ≥ 0.95, `categories:accessibility` = 1, `categories:best-practices` ≥ 0.95, `categories:seo` ≥ 0.95, `largest-contentful-paint` maxNumericValue 2000, `cumulative-layout-shift` maxNumericValue 0.05, `total-blocking-time` maxNumericValue 200 (all `error`); `ci.upload.target: "filesystem"`, `outputDir: ".lighthouseci"` (no public upload — Principle VII)
- [X] T010 Create the `src/` tree from plan.md → Project Structure: empty `src/.nojekyll`; directories `src/css/components/`, `src/js/`, `src/assets/`; every CSS partial listed in the plan as an empty file; `src/css/main.css` containing `@layer tokens, reset, base, layout, components, utilities;` followed by `@import url("tokens.css") layer(tokens);`, `reset.css` → `reset`, `base.css` → `base`, `layout.css` → `layout`, each `components/*.css` → `components` (button, site-header, theme-toggle, hero, section, about, tag, timeline, projects, project-card, contact, site-footer — in that order), `utilities.css` → `utilities`; empty `src/css/print.css`; empty module `src/js/main.js` (P1.3)
- [X] T011 [P] Create `tools/build.mjs` (minimal version): delete `dist/`, then `fs.cp('src', 'dist', { recursive: true })`; exit non-zero on error (P1.8). Also create stub `tools/check-budgets.mjs` that prints "budget check not implemented yet (T077)" and exits 0, so `npm run check:static` runs from Phase 1 onward; T077 replaces it
- [X] T012 [P] Create `tests/helpers/fixtures.js`: export `test` extended from `@playwright/test` with an auto fixture that records `console` messages of type `error`/`warning`, `pageerror` events, and `securitypolicyviolation` events (via `page.addInitScript` listener pushing to `window.__cspViolations`), and fails the test in teardown if any were recorded; re-export `expect`
- [X] T013 [P] Create `tests/helpers/page-utils.js` exporting: `hasHorizontalOverflow(page)` (`scrollWidth > innerWidth` or any visible element — excluding `.visually-hidden` — whose `getBoundingClientRect().right > innerWidth + 1`); `isObscuredByHeader(page, locator)` (element rect top < `.site-header` rect bottom while header is sticky); `tabOrder(page, maxSteps)` (presses Tab and returns an array of `{ tag, text, href }` for the focused element); `layoutShiftScore(page)` (sum of `layout-shift` entries without recent input via `PerformanceObserver`, buffered); `runAxe(page)` (AxeBuilder with tags `wcag2a`, `wcag2aa`, `wcag21a`, `wcag21aa`, `wcag22aa`; returns violations)
- [X] T014 [P] Create `specs/001-portfolio-website/checklists/implementation-gates.md`: one section per implementation phase (1–5) with a table of that phase's validation criteria copied from plan.md (ID, criterion, result, evidence/link, date) followed by a G1–G16 table (gate, result, evidence); plus a final "Success Criteria" table SC-001–SC-010 and a "Manual gates" table (screen reader, visual review, privacy review, usability check)

**Checkpoint**: `npm ci`, `npm run format:check`, `npm run lint:js` run without errors on the empty tree.

---

## Phase 2: Implementation Phase 1 — File Structure & HTML Semantic Boilerplate

**Goal**: A complete, valid, accessible, **unstyled** page containing all real content, the
404 page, root files, and the static checks (plan P1.3–P1.9).

**Independent Test**: `npm run build && npx playwright test tests/e2e/structure.spec.js tests/e2e/hero-contact.spec.js tests/e2e/no-js.spec.js tests/e2e/privacy-scope.spec.js tests/e2e/a11y.spec.js` passes in all three engines against the unstyled page.

### Tests for Implementation Phase 1 (write first, confirm they fail)

- [X] T015 [P] Write `tests/e2e/structure.spec.js` asserting [contracts/page-structure.md](contracts/page-structure.md): `<html lang="en">`; first head child is `meta[charset]`; viewport meta content exactly `width=device-width, initial-scale=1`; CSP meta exists; the inline bootstrap `<script>` precedes `link[rel=stylesheet]`; body order skip link → `header.site-header` → `main#main` → `footer.site-footer`; `main > section` ids in order `home, about, experience, projects, contact`, each with `tabindex="-1"` and `aria-labelledby` pointing at its heading; exactly one `h1`; heading levels never skip (walk all `h1`–`h6` in document order); first Tab focuses a link with text "Skip to main content" and `href="#main"`; head contains meta description, canonical, `og:title`, `og:description`, `og:url`, `og:image`, `og:image:alt`, `twitter:card=summary_large_image`, two `meta[name=theme-color]` with `media`, `link[rel=icon][type="image/svg+xml"]`, and a `script[type="application/ld+json"]` that parses to `@type: "Person"`; `/404.html` has `h1` "Page not found", a link "Back to the home page", `meta[name=robots][content=noindex]`, and a `base[href]`
- [X] T016 [P] [US1] Write `tests/e2e/hero-contact.spec.js` (content part): `h1` text is exactly `Hi, I'm Aseel.`; hero paragraph text is exactly `Full Stack Software Engineer specializing in scalable systems, robust architectures, and engineering mentorship.`; `#home` contains exactly three links in order GitHub, LinkedIn, Email; GitHub/LinkedIn links have `target="_blank"`, `rel` containing `noopener` and `noreferrer`, and text containing "(opens in a new tab)"; Email link `href` starts with `mailto:`; `#contact .contact__links` contains the same three routes in the same order with the same `href`s (6 route links total across `#home` and `.contact__links`; the coming-soon card's GitHub link is not counted); `#contact .contact__email-link` text equals its `mailto:` address
- [X] T017 [P] Write `tests/e2e/no-js.spec.js` using `test.use({ javaScriptEnabled: false })`: `<html>` keeps class `no-js`; all five sections and their headings are visible; all four nav links are visible; `.theme-toggle`, `.nav__toggle`, and `[data-js="copy-email"]` are not visible; every timeline entry is visible (edge case "Scripting unavailable", FR-035)
- [X] T018 [P] Write `tests/e2e/privacy-scope.spec.js`: exactly four `.timeline__entry`; every entry's element children match only `.timeline__title`, `.timeline__org`, `.timeline__dates`, `.timeline__category` (FR-013, FR-014); no `form`, `input`, `textarea`, or `select` anywhere; no link whose text or `href` matches `/résumé|resume|\bcv\b|\.pdf$/i` (FR-022a); every network request URL during load and full scroll is same-origin; the raw `dist/index.html` text contains no `<!--`; `package.json` (read with `fs`) has no `dependencies` key (G11, G16)
- [X] T019 [P] Write `tests/e2e/a11y.spec.js`: `runAxe` returns zero violations for `/` and `/404.html` with `colorScheme: 'light'` and JS enabled (extended in later phases)

### Implementation for Implementation Phase 1

- [X] T020 Write the `<head>` of `src/index.html` per [page-structure.md](contracts/page-structure.md) items 1–10 on `<html lang="en" class="no-js">`: CSP meta with the policy from research R-20 (placeholder `'sha256-PENDING'`); referrer meta; `<title>Aseel Almanahy — Full Stack Software Engineer</title>`; inline bootstrap script (under 1 KB — constitution Principle I "Theme bootstrap exception") that replaces class `no-js` with `js` on `document.documentElement` and, inside `try { … } catch {}`, reads `localStorage.getItem('theme')` and sets `document.documentElement.dataset.theme` only when the value is `'light'` or `'dark'`, and does nothing else (research R-02); `<link rel="stylesheet" href="css/main.css">`; `<link rel="stylesheet" href="css/print.css" media="print">`; `<script type="module" src="js/main.js"></script>`; meta description = the hero statement; canonical, `og:url`, and `og:image` (`…assets/og-image.png`) using the base `CONTENT:https://<github-username>.github.io/`; `og:type=website`, `og:title`, `og:description`, `og:image:alt`, `twitter:card=summary_large_image`; `<meta name="theme-color" content="#FBF6EE" media="(prefers-color-scheme: light)">` and `content="#1B1310" media="(prefers-color-scheme: dark)"`; `<link rel="icon" href="assets/favicon.svg" type="image/svg+xml">`; JSON-LD `Person` with `name: "Aseel Almanahy"`, `jobTitle: "Full Stack Software Engineer"`, `alumniOf` University of Massachusetts Lowell only and `affiliation` Louisiana State University Shreveport (both `CollegeOrUniversity`; LSU moves to `alumniOf` once the MBA is completed), `sameAs` [GitHub, LinkedIn `CONTENT:` URLs] (P1.4)
- [X] T021 Create `tools/check-csp.mjs`: for `src/index.html` (and `dist/index.html` when it exists) find the first inline `<script>` with no `src` and no `type`, compute `sha256` of its exact text as base64, and compare to the `'sha256-…'` source in the CSP meta; also assert it is the only inline non-JSON-LD script and that its UTF-8 size is < 1024 bytes; print hash and size and exit 1 on any failure; with `--write`, replace the hash in `src/index.html`. Run `node tools/check-csp.mjs --write` to replace `sha256-PENDING` (P1.4, research R-02)
- [X] T022 Add body scaffolding to `src/index.html`: first child `<a class="skip-link" href="#main">Skip to main content</a>`; `<main id="main" tabindex="-1">` with five empty `section` elements `#home`, `#about`, `#experience`, `#projects`, `#contact` in that order, each `tabindex="-1"` and `aria-labelledby` its heading id; `<footer class="site-footer"><p>© 2026 Aseel Almanahy</p></footer>` (P1.5)
- [X] T023 [US4] Add the header to `src/index.html` before `main`: `<header class="site-header">` with brand link `<a class="site-header__brand" href="#home">Aseel Almanahy</a>` and `<nav class="nav" aria-label="Primary">` containing `<button class="nav__toggle" type="button" hidden aria-expanded="false" aria-controls="nav-menu">` (menu icon + text "Menu"), `<ul id="nav-menu" class="nav__list">` with links About `#about`, Experience `#experience`, Projects `#projects`, Contact `#contact` (class `nav__link`), and `<button class="theme-toggle" type="button" hidden aria-pressed="false">` containing sun and moon sprite icons (`aria-hidden="true"`) and `<span class="visually-hidden">Dark theme</span>` (research R-04, R-12)
- [X] T024 [US1] Fill `section#home` in `src/index.html`: `<h1 id="home-title" class="hero__title">Hi, I'm Aseel.</h1>` (straight apostrophe, verbatim FR-004), `<p class="hero__statement">Full Stack Software Engineer specializing in scalable systems, robust architectures, and engineering mentorship.</p>`, and `<div class="hero__actions">` with the three contact links exactly as in [content-blocks.md → Contact link](contracts/content-blocks.md#contact-link-hero-and-contact-section): GitHub (`button button--primary`, external), LinkedIn (`button button--primary`, external), Email (`button button--secondary`, `mailto:CONTENT:address`); external links include the `#external` glyph and `<span class="visually-hidden"> (opens in a new tab)</span>` (FR-005–FR-007)
- [X] T025 [US2] Fill `section#about` in `src/index.html`: `h2#about-title` "About Me"; intro `<p class="about__intro" data-content-status="draft">` with this draft (Profile `intro`: "2–4 sentences, first person, warm tone (FR-008) — content input"): "I'm a full stack software engineer who loves turning complex problems into reliable, well-structured systems. I studied Computer Science at UMass Lowell and am now pursuing an MBA in Project Management at LSU Shreveport, pairing engineering depth with delivery know-how. Mentorship matters to me — I enjoy helping engineers and leaders grow together."; `h3` "Education" + `<ul class="education">` with two items per [content-blocks.md → Education entry](contracts/content-blocks.md#education-entry): "Bachelor of Science in Computer Science" / "University of Massachusetts Lowell" / "Completed" and "Master of Business Administration in Project Management" / "Louisiana State University Shreveport" / "Candidate" (EducationEntry: "exactly two entries (FR-009); status is text, not colour"); `h3` "Skills" + two skill groups per the Skill group pattern: `h4#skills-languages` "Languages" → Java, C/C++, SQL, Python and `h4#skills-tools` "Tools/Frameworks" → Git, SpringBoot, Angular, AWS in that order (SkillCategory: "two categories, each a heading followed by a `ul` (FR-010); no proficiency ratings")
- [X] T026 [US2] Fill `section#experience` in `src/index.html`: `h2#experience-title` "Experience"; `<ol class="timeline">` with four `li.timeline__item` using [content-blocks.md → Timeline entry](contracts/content-blocks.md#timeline-entry-fr-011fr-014) in provisional order (final order set in T095 from real dates, per data-model "by `start` descending; ties broken with `engineering` before `leadership`"): (1) `role-fse` "Full Stack Software Engineer" `--engineering`, end "Present"; (2) `role-l2l-mentor` "Leap to Lead Reverse Mentor" `--leadership`; (3) `role-leap-mentor` "LEAP Program Mentor" `--leadership`; (4) `role-afse` "Associate Full Stack Software Engineer" `--engineering`; organisation "Fidelity Investments" on each; every unknown date is `<time datetime="2000-01" data-content-placeholder>CONTENT: Mon YYYY</time>`; category text "Engineering"/"Leadership". TimelineEntry rule: "Exactly four entries; no other fields — no description, bullets, team, system, tool, or metric text (FR-013, FR-014)"
- [X] T027 [US3] Fill `section#projects` in `src/index.html`: `h2#projects-title` "Projects" and `<ul class="projects__grid">` containing only the coming-soon card from [content-blocks.md → Coming-soon card](contracts/content-blocks.md#coming-soon-card-fr-020) (heading "More projects coming soon", message "New projects are on the way — follow along on GitHub.", GitHub link `CONTENT:` URL). ComingSoonCard rule: "present **iff** the number of Project entries is 0 (FR-020); has no tags, no sample titles, no demo link"
- [X] T028 [US1] Fill `section#contact` in `src/index.html`: `h2#contact-title` "Contact"; one-line invitation paragraph; `<ul class="contact__links">` with the three routes labelled "GitHub profile", "LinkedIn profile", "Email me" (same link patterns as the hero, class `button button--secondary`); then the email paragraph with `a.contact__email-link`, hidden `button[data-js="copy-email"]` "Copy email", and `span.copy-email__status[role="status"][data-js="copy-email-status"]` exactly as in [content-blocks.md](contracts/content-blocks.md#contact-link-hero-and-contact-section) (FR-021, FR-021a, FR-022a: "exactly the three contact routes")
- [X] T029 [P] Create `src/assets/icons.svg`: an SVG sprite (`<svg xmlns="http://www.w3.org/2000/svg">` with `<symbol>` elements, `viewBox="0 0 24 24"`) with ids `github`, `linkedin`, `email`, `sun`, `moon`, `menu`, `external`, all drawn with `currentColor` and no `<title>` (decorative; research R-18) (P1.6)
- [X] T030 [P] Create `src/assets/favicon.svg`: 32×32 viewBox rounded square in cream `#FBF6EE` with a serif "A" in amber `#B45309`, plus an embedded `@media (prefers-color-scheme: dark)` style switching to `#1B1310` background and `#F59E0B` letter (P1.6)
- [X] T031 [P] Create `src/404.html` per [page-structure.md → 404.html](contracts/page-structure.md#404html): same head items 1–7 (its own CSP without a script hash if it has no inline script; reuse the bootstrap and hash if it does), `<base href="/">` (base path from site URL; research R-21), `<meta name="robots" content="noindex">`, title "Page not found — Aseel Almanahy", skip link, header with brand link only, `main` with `h1` "Page not found", one friendly sentence, and link "Back to the home page" → `./` (FR-003)
- [X] T032 [P] Create `src/robots.txt` (`User-agent: *`, `Allow: /`, `Sitemap: CONTENT:https://<github-username>.github.io/sitemap.xml`) and `src/sitemap.xml` (one `<url><loc>` with the same base URL)
- [X] T033 [P] Create `tools/check-site-url.mjs`: read the canonical href from `src/index.html` and assert `og:url` equals it, `og:image` starts with it, `robots.txt` Sitemap = canonical + `sitemap.xml`, `sitemap.xml` `<loc>` = canonical, and `src/404.html` `<base href>` equals the canonical URL's pathname; skip (warn, exit 0) while values still contain `CONTENT:`, fail otherwise (research R-21)
- [X] T034 [P] Create `tools/check-content.mjs`: scan `src/**/*.{html,txt,xml}` for `CONTENT:`, `data-content-placeholder`, and `data-content-status="draft"`; print each with file and line; always exit 0 unless `--strict` is passed and count > 0 (research R-25)
- [X] T035 Run Gate 1 (V1.1–V1.10 in plan.md): `npm run lint`, `npm run format:check`, `node tools/check-csp.mjs`, `node tools/check-site-url.mjs`, `node tools/check-content.mjs`, `npm run build`, the five specs from T015–T019; read the page with CSS disabled (logical order); run `grep -rEn "TODO|FIXME|lorem|console\.log" src` (expect none); confirm `spec.md` unchanged; draft the timeline privacy review (FR-014 list); record everything in `specs/001-portfolio-website/checklists/implementation-gates.md` → Phase 1

**Checkpoint (Gate 1)**: V1.1–V1.10 pass; G1–G6, G9–G13, G16 hold for Phase 1 scope.

---

## Phase 3: Implementation Phase 2 — Core Layout & Typography via CSS Variables

**Goal**: Design tokens (warm cream / amber / cozy dark), global typography, base layout,
header shell, hero, buttons, footer — single-column mobile styling (plan P2.1–P2.6).

**Independent Test**: At 375×667 in both themes, the hero shows greeting, statement, and three
styled buttons without scrolling; axe reports zero violations (light and dark).

### Tests for Implementation Phase 2 (write first, confirm they fail)

- [X] T036 [P] Write `tests/unit/contrast.test.js`: parse `src/css/tokens.css` with regexes to get the light (`:root`) and dark (`:root[data-theme="dark"]`) hex values; implement WCAG relative luminance; assert every pair in research R-09's second table meets its required ratio in both themes (text/surface ≥ 4.5, muted/surface ≥ 4.5, accent/surface ≥ 4.5, on-accent/accent-bg ≥ 4.5, tag-text/tag-bg ≥ 4.5, focus/surface ≥ 3, border/surface ≥ 3, accent-bg/surface ≥ 3) and the same pairs against `--color-bg`; also assert that the dark declarations inside `@media (prefers-color-scheme: dark)` and under `:root[data-theme="dark"]` are identical (same property/value set), and that the `@media print` `:root` block re-declares exactly the light `:root` colour values
- [X] T037 [P] Extend `tests/e2e/a11y.spec.js`: run `runAxe` for `colorScheme` light and dark (`page.emulateMedia`), and for a saved `dark` preference (`addInitScript` setting `localStorage.theme`) — zero violations each (V2.2); Tab through the whole page and assert each focused element has computed `outline-style` ≠ `none` and `outline-width` ≥ 2px; assert every visible `a`, `button` has a bounding box ≥ 44×44 CSS px (FR-033, V2.6)
- [X] T038 [P] [US1] Extend `tests/e2e/hero-contact.spec.js`: at viewport 375×667, `h1`, `.hero__statement`, and the three `.hero__actions` links each have `boundingBox().y + height ≤ 667` (SC-001, V2.4)
- [X] T039 [P] [US4] Create `tests/e2e/nav-theme.spec.js` with no-flash tests: (a) device light + saved `dark` → a `DOMContentLoaded` listener installed via `addInitScript` records `document.documentElement.dataset.theme === 'dark'` and computed `body` background equals `--color-bg` dark value `rgb(27, 19, 16)`; (b) JS disabled + `colorScheme: 'dark'` → body background is the dark value; (c) device dark, nothing saved → dark background and no `data-theme` attribute (FR-029, V2.5)
- [X] T040 [P] Create `tests/e2e/responsive.spec.js` with: at 320px width, `hasHorizontalOverflow` is false (V2.7); `layoutShiftScore` after load ≤ 0.05 (V2.8)

### Implementation for Implementation Phase 2

- [X] T041 Write `src/css/tokens.css` (P2.1, research R-03/R-09/R-10): on `:root` — `color-scheme: light`; colour tokens `--color-bg #FBF6EE`, `--color-surface #F3E9D8`, `--color-text #2B1D14`, `--color-text-muted #5E4B3C`, `--color-accent #A34A06`, `--color-accent-bg #B45309`, `--color-on-accent #FFFBF5`, `--color-focus #8A3B00`, `--color-border #8C7A68`, `--color-tag-bg #F6E3C4`, `--color-tag-text #6B3A0B`, `--shadow-color` warm brown at 10% alpha; spacing `--space-1` 0.25rem, `-2` 0.5rem, `-3` 0.75rem, `-4` 1rem, `-5` 1.5rem, `-6` 2rem, `-7` 3rem, `-8` 4rem, `--space-section: clamp(3rem, 8vw, 6rem)`, `--gutter: clamp(1rem, 4vw, 2rem)`; fonts `--font-sans: system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif`, `--font-serif: "Iowan Old Style", "Palatino Linotype", Palatino, Georgia, serif`; type scale `--text-sm clamp(0.875rem, 0.85rem + 0.1vw, 0.9375rem)`, `--text-base clamp(1rem, 0.95rem + 0.25vw, 1.125rem)`, `--text-lg clamp(1.125rem, 1.05rem + 0.4vw, 1.3125rem)`, `--text-xl clamp(1.375rem, 1.2rem + 0.8vw, 1.75rem)`, `--text-2xl clamp(1.75rem, 1.4rem + 1.6vw, 2.5rem)`, `--text-3xl clamp(2.25rem, 1.6rem + 3.2vw, 4rem)`, `--leading-body 1.6`, `--leading-heading 1.15`; radii `--radius-sm 0.375rem`, `--radius-md 0.75rem`, `--radius-lg 1.25rem`, `--radius-pill 999px`; `--shadow-sm`, `--shadow-md` built from `--shadow-color`; `--z-header 100`, `--z-skip 200`; `--duration-ui 150ms`, `--duration-theme 250ms`, `--duration-reveal 400ms`, `--ease-out cubic-bezier(0.2, 0.7, 0.2, 1)`; `--nav-height 3.5rem`, `--container-max 72rem`, `--measure 65ch`, `--tap-min 2.75rem`; then the dark colour declarations (`color-scheme: dark`; `--color-bg #1B1310`, `--color-surface #2A1F19`, `--color-text #F6ECDF`, `--color-text-muted #CDBBA7`, `--color-accent #F4A340`, `--color-accent-bg #F59E0B`, `--color-on-accent #1B1310`, `--color-focus #FBBF60`, `--color-border #8F7B69`, `--color-tag-bg #3A2A1E`, `--color-tag-text #F7C98A`, darker `--shadow-color`) written **twice, identically** — once in `@media (prefers-color-scheme: dark) { :root:not([data-theme="light"]) { … } }` and once in `:root[data-theme="dark"] { … }` (plain CSS cannot share one block; T036 guards against drift); then `@media print { :root { … } }` re-declaring `color-scheme: light` and all light colour values so print is always light (research R-03); a comment block documents breakpoints `30em / 48em / 64em / 90em` (CSS cannot use custom properties in media queries)
- [X] T042 [P] Write `src/css/reset.css` (P2.2): `*, *::before, *::after { box-sizing: border-box; }`; remove default margins on body, headings, p, lists with classes, figure, blockquote; `img, svg, video { display: block; max-width: 100%; }` (except `.icon`, handled in utilities); `button, input { font: inherit; color: inherit; }`; `ul[class], ol[class] { list-style: none; padding: 0; }`
- [X] T043 Write `src/css/base.css` (P2.3): `html { scroll-padding-top: calc(var(--nav-height) + var(--space-4)); }` and `scroll-behavior: smooth` only inside `@media (prefers-reduced-motion: no-preference)`; `body` background `--color-bg`, colour `--color-text`, `--font-sans`, `--text-base`, `--leading-body`; headings `--font-serif`, `--leading-heading`, sizes h1 `--text-3xl`, h2 `--text-2xl`, h3 `--text-xl`, h4 `--text-lg`; `p { max-width: var(--measure); }`; links colour `--color-accent`, `text-underline-offset: 0.2em`, thicker underline on hover; `:focus-visible { outline: 3px solid var(--color-focus); outline-offset: 3px; }`; `:focus:not(:focus-visible) { outline: none; }`; `::selection` using accent tokens; `a, p, li { overflow-wrap: anywhere; }` for long email/URLs; do **not** add `scroll-margin-top` anywhere (it adds to `scroll-padding-top` and doubles the offset — research R-13); theme transition: inside `@media (prefers-reduced-motion: no-preference)`, `:root[data-theme-switching] *, :root[data-theme-switching] *::before, :root[data-theme-switching] *::after { transition: background-color var(--duration-theme) var(--ease-out), color …, border-color …, fill …, stroke …, outline-color … }` (research R-05)
- [X] T044 [P] Write `src/css/layout.css` (P2.4): `.container { width: min(100% - 2 * var(--gutter), var(--container-max)); margin-inline: auto; }`; `main > section { padding-block: var(--space-section); }`; `.site-header` sticky shell: `position: sticky; top: 0; z-index: var(--z-header); min-height: var(--nav-height);` background `--color-surface`, bottom border `--color-border`; footer spacing
- [X] T045 [P] Write `src/css/utilities.css` (P2.5): first rule `[hidden] { display: none !important; }` so component `display` rules (`.button`, `.nav__toggle`, `.theme-toggle`) can never reveal JS-only controls that ship `hidden` (FR-021a, edge case "Scripting unavailable"); `.visually-hidden` (standard clip pattern, `!important` allowed here only); `.icon { width: 1.25em; height: 1.25em; flex: none; fill: currentColor; display: inline-block; vertical-align: middle; }`
- [X] T046 [P] [US1] Write `src/css/components/button.css` (P2.5): `.button` inline-flex, gap `--space-2`, `min-height: var(--tap-min)`, `min-width: var(--tap-min)`, padding `--space-3 --space-5`, `--radius-pill`, weight 600, no underline, `transition` of background/transform over `--duration-ui` only under `prefers-reduced-motion: no-preference`; `.button--primary` background `--color-accent-bg`, colour `--color-on-accent`; `.button--secondary` transparent background, 2px border `--color-border`, colour `--color-text`; `.button--small` reduced padding but still `min-height: var(--tap-min)`; hover/active states using tokens only
- [X] T047 [P] [US1] Write `src/css/components/hero.css` (P2.5): `#home` padding-block that fits 375×667 (no `100vh`); `.hero__title` `--text-3xl`; `.hero__statement` `--text-lg`, colour `--color-text-muted`, `max-width: 38ch`; `.hero__actions` flex-wrap with gap `--space-3`; a subtle warm decorative accent (e.g. amber underline bar via `::after`) built from tokens only
- [X] T048 [P] Write `src/css/components/section.css` (P2.5): section heading block (`h2` with amber accent rule via `::before`), consistent spacing between heading and content, `.skip-link` hidden off-screen until `:focus`, then fixed top-left above the header (`z-index: var(--z-skip)`), styled as a primary button
- [X] T049 [P] [US4] Write base `src/css/components/site-header.css` (P2.5): `.site-header` inner flex row (brand left, nav right) inside `.container`, height `var(--nav-height)`; `.site-header__brand` serif, `--text-lg`, colour `--color-text`, `min-height: var(--tap-min)` and inline-flex centring; `.nav__list` flex-wrap with gap (no-JS/desktop baseline), `.nav__link` `min-height: var(--tap-min)` inline-flex, colour `--color-text`
- [X] T050 [P] Write `src/css/components/site-footer.css` (P2.5): centred small text in `--color-text-muted`, top border `--color-border`, padding `--space-6`
- [X] T051 Wrap page content in `.container` elements in `src/index.html` (header inner row, each section's inner content, footer) without changing the contract's landmark or section order, then run Gate 2 (V2.1–V2.9): `npm run lint:css`, `npm run test:unit`, `npm run build`, specs T036–T040 in three engines, and a manual screenshot review of the hero at 375 and 1440 in both themes ("minimal, warm, welcoming"); record in `checklists/implementation-gates.md` → Phase 2

**Checkpoint (Gate 2)**: V2.1–V2.9 pass. **US1 is demonstrable end-to-end (MVP content)** —
the copy button remains hidden until Phase 5, which FR-021a allows when scripting is unavailable.

---

## Phase 4: Implementation Phase 3 — Mobile-First Responsive Grid & Timeline Styles

**Goal**: Correct layouts from 320 to 2560px: navigation, About grid, skill tags, vertical
timeline with interaction highlight, projects grid and cards, contact layout, print (plan
P3.1–P3.7).

**Independent Test**: `npx playwright test tests/e2e/responsive.spec.js tests/e2e/projects.spec.js tests/e2e/about-experience.spec.js` passes in three engines; no horizontal overflow at any width in either theme.

### Tests for Implementation Phase 3 (write first, confirm they fail)

- [X] T052 [P] Extend `tests/e2e/responsive.spec.js` (SC-004, V3.1, V3.2, V3.5, V3.8): for widths 320, 375, 768, 1024, 1440, 2560 × `colorScheme` light/dark, `hasHorizontalOverflow` is false; at 320px with `html { font-size: 200% }` injected, no overflow and `.contact__email-link` wraps inside its container; `.site-header` height ≤ 56px at 375 (JS on, menu collapsed); at ≥ 768 all four `.nav__link` visible without opening a menu; with JS disabled at 375 all four links visible; `page.emulateMedia({ media: 'print' })` → `.nav__toggle` and `.theme-toggle` hidden and body background equals light `--color-bg`
- [X] T053 [P] [US2] Write `tests/e2e/about-experience.spec.js` (V3.4): About shows two education items with status texts "Completed" and "Candidate"; skill lists in exact order (Java, C/C++, SQL, Python / Git, SpringBoot, Angular, AWS); at every width the four `.timeline__entry` elements share the same `x` (single column) and appear in DOM order; each has category text "Engineering" or "Leadership"; the `::before` marker of an `--engineering` entry and a `--leadership` entry differ in computed `border-radius` or `transform` (shape, not only colour); computed `background-color`, `border-color`, and `box-shadow` of an entry are identical when hovered, when focused via Tab, and when tapped in a `hasTouch: true` context (`locator.tap()`) (FR-013 hover/touch/focus parity)
- [X] T054 [P] [US3] Write `tests/e2e/projects.spec.js` (V3.3): (a) launch state — exactly one `.project-card--placeholder`, zero `.tag` inside it, no `href` equal to `#` or empty; (b) inject three sample `.projects__item` cards built from [content-blocks.md → Project card](contracts/content-blocks.md#project-card-fr-016fr-019) via `page.evaluate` (one without a demo link) and remove the placeholder — grid has 1 column at 375 (all cards same `x`), ≥ 2 distinct `x` values at 768, 1024, 1440; each card shows title, description, ≥ 1 tag, and its links; every card link's accessible name (`getByRole('link')` name) contains that card's title (FR-017); the card without a demo has no demo link; (c) placeholder alone at 2560 is no wider than 28rem; (d) invariant on the shipped page: `.project-card--placeholder` count is 1 when `.project-card:not(.project-card--placeholder)` count is 0, and 0 otherwise (FR-020)
- [X] T055 [P] [US4] Extend `tests/e2e/nav-theme.spec.js` (FR-023a, V3.6): for each of `#about`, `#experience`, `#projects`, `#contact`, load `/#<id>` and assert the section heading's top ≥ `.site-header` bottom; Tab through the entire page at 375 and 1440 and assert `isObscuredByHeader` is false for every focused element

### Implementation for Implementation Phase 3

- [X] T056 [US4] Extend `src/css/components/site-header.css` (P3.1, research R-12): below `48em` and only under `.js`, `.nav__toggle` is a `--tap-min` square button with the menu icon; `.js .nav__toggle[aria-expanded="false"] + .nav__list { display: none; }`; expanded list is an absolutely positioned full-width panel under the bar (`top: var(--nav-height)`, surface background, border, shadow) with stacked `.nav__link` rows ≥ `--tap-min`; without `.js` the list stays visible and wraps; from `@media (min-width: 48em)` the toggle is hidden (`display: none`) and the list is an inline row; the theme toggle stays in the bar at all widths; landscape phones keep `height: var(--nav-height)`
- [X] T057 [P] [US2] Write `src/css/components/about.css` and `src/css/components/tag.css` (P3.2): `.about__intro` `--text-lg`; education and skills stacked, two columns from `@media (min-width: 48em)` via grid; `.education__item` with `h4` degree, school, and status as muted text; `.skill-group` spacing; `.tag-list` flex-wrap with gap `--space-2`; `.tag` pill (`--radius-pill`) with `--color-tag-bg`/`--color-tag-text`, `--text-sm`, padding `--space-1 --space-3`
- [X] T058 [P] [US2] Write `src/css/components/timeline.css` (P3.3, research R-15): `.timeline` position relative with a vertical 2px line via `::before` in `--color-border` at a fixed left offset; `.timeline__item` padding-left for the marker; `.timeline__entry` surface card (`--color-surface`, `--radius-md`, 1px `--color-border`, padding `--space-5`); marker via `.timeline__entry::before` — `--engineering` circle (`border-radius: 50%`), `--leadership` diamond (`transform: rotate(45deg)`, square), both filled `--color-accent`; `.timeline__title` `--text-lg`; `.timeline__org`, `.timeline__dates` muted; `.timeline__category` pill badge with text; ONE rule `.timeline__entry:hover, .timeline__entry:focus-visible, .timeline__entry:focus-within { … }` changing only `background-color`, `border-color`, `box-shadow` (no layout properties), with transitions over `--duration-ui` only under `prefers-reduced-motion: no-preference`; single column at every width, max width `48rem`
- [X] T059 [P] [US3] Write `src/css/components/projects.css` with `.projects__grid { display: grid; gap: var(--space-5); grid-template-columns: repeat(auto-fill, minmax(min(100%, 18rem), 1fr)); }` and `.projects__item { display: flex; }`, and `src/css/components/project-card.css` (P3.4, research R-07/R-11) with `.project-card` flex column filling height, surface card styling, `.project-card__title`, `.project-card__description` (muted, `--text-base`), `.project-card__links` pushed to bottom (`margin-top: auto`) with links ≥ `--tap-min` tall; `.project-card--placeholder` dashed `--color-border` border and muted heading, `max-width: 28rem`
- [X] T060 [P] [US1] Write `src/css/components/contact.css` (P3.5): `.contact__links` flex-wrap buttons; `.contact__email` flex-wrap row with gap so address, Copy button, and status wrap at 320px; `.contact__email-link` inline-flex `min-height: var(--tap-min)`; `.copy-email__status` muted `--text-sm`, reserved `min-height` so showing a message causes no layout shift
- [X] T061 [P] Update `src/css/layout.css` (P3.6): verify `.container` centring at 2560px; add `@media (min-width: 64em)` larger section spacing; ensure nothing sets widths wider than the container
- [X] T062 [P] Write `src/css/print.css` (P3.7): layout and visibility rules only — **no colour values or colour-token redefinitions** (print colours come from the `@media print` block in `tokens.css`, T041; Principle III); hide `.nav__toggle`, `.theme-toggle`, `.skip-link`, `[data-js="copy-email"]`; `.site-header { position: static; }`; `a[href^="http"]::after { content: " (" attr(href) ")"; }`; avoid page breaks inside `.timeline__entry` and `.project-card`
- [X] T063 Run Gate 3 (V3.1–V3.9): `npm run lint`, `npm run build`, specs T052–T055 plus all earlier specs (no regressions), axe at 375 and 1024 in both themes (add these two widths to `tests/e2e/a11y.spec.js`), and a manual screenshot matrix (6 widths × 2 themes) sign-off; record in `checklists/implementation-gates.md` → Phase 3

**Checkpoint (Gate 3)**: V3.1–V3.9 pass. US2 (minus scroll-in) and US3 are demonstrable.

---

## Phase 5: Implementation Phase 4 — Vanilla JS Modules (Theme Toggle, Copy-to-Clipboard, Menu)

**Goal**: The behaviour layer as isolated ES modules with unit-tested pure helpers, following
[contracts/behaviour.md](contracts/behaviour.md) (plan P4.1–P4.5).

**Independent Test**: `npm run test:unit` and `npx playwright test tests/e2e/nav-theme.spec.js tests/e2e/hero-contact.spec.js` pass in three engines with zero console errors.

### Tests for Implementation Phase 4 (write first, confirm they fail)

- [X] T064 [P] Write `tests/unit/storage.test.js`: `readPreference('theme', store)` returns the stored string; returns `null` when the store's `getItem` throws or `store` is undefined; `writePreference` returns `true` on success and `false` (no throw) when `setItem` throws
- [X] T065 [P] [US4] Write `tests/unit/theme.test.js`: `resolveEffectiveTheme('light', true) === 'light'`; `('dark', false) === 'dark'`; `(null, true) === 'dark'`; `(null, false) === 'light'`; `('bogus', true) === 'dark'`; `nextTheme('light') === 'dark'` and vice versa
- [X] T066 [P] [US1] Write `tests/unit/copy-email.test.js`: `copyText('a@b.c', fakeClipboard)` resolves `'success'` and the fake received the text; resolves `'error'` when `writeText` rejects and when the clipboard is undefined; `statusMessage('success') === 'Copied!'`; `statusMessage('error') === "Couldn't copy — please select the address above"`
- [X] T067 [P] [US4] Write `tests/unit/nav.test.js`: `shouldCollapse(20) === true`, `shouldCollapse(47.99) === true`, `shouldCollapse(48) === false`
- [X] T068 [P] [US4] Extend `tests/e2e/nav-theme.spec.js` (V4.2, V4.3, V4.5): theme toggle visible with JS; click, Enter, and Space each flip `aria-pressed` and `html[data-theme]`; `localStorage.theme` written; reload keeps the theme (SC-008); with `addInitScript` making `localStorage.getItem`/`setItem` throw, toggling still flips the theme and the fixture sees no console errors; with no saved choice, switching `emulateMedia({ colorScheme })` updates the theme and `aria-pressed`, but after a manual toggle it does not; with `reducedMotion: 'reduce'` the computed `transition-duration` of `body` right after toggling is `0s`, otherwise ≤ `0.3s`; at 375 the Menu button is visible, `aria-expanded` goes `false`→`true` on click and the links become visible, Escape closes it and focus returns to the button, choosing "Experience" closes the menu, focuses `#experience`, and its heading is not obscured; at 1024 the Menu button is hidden
- [X] T069 [P] [US1] Extend `tests/e2e/hero-contact.spec.js` (V4.4): Chromium only (`test.skip` for others) with `context.grantPermissions(['clipboard-read', 'clipboard-write'])` — clicking "Copy email" puts the address on the clipboard and `[role=status]` reads "Copied!", then is empty after ~4.5s; all engines with `addInitScript` replacing `navigator.clipboard.writeText` by a rejecting stub → status reads "Couldn't copy — please select the address above"; with `navigator.clipboard` deleted → the button stays hidden
- [X] T070 [P] Extend `tests/e2e/a11y.spec.js` (V4.6): keyboard walkthrough at 1440 — `tabOrder` begins skip link → brand → About → Experience → Projects → Contact → theme toggle → GitHub → LinkedIn → Email, reaches the Copy button and the footer region without a trap, and every `button` is operable with Enter and Space

### Implementation for Implementation Phase 4

- [X] T071 [P] Implement `src/js/storage.js` exporting `readPreference(key, store = globalThis.localStorage)` and `writePreference(key, value, store = globalThis.localStorage)` per [behaviour.md → Module interfaces](contracts/behaviour.md#module-interfaces-srcjs); every storage access inside `try/catch`; short JSDoc on each export (P4.1)
- [X] T072 [US4] Implement `src/js/theme.js` (P4.2, research R-04/R-05): export `resolveEffectiveTheme(saved, prefersDark)` and `nextTheme(effective)`; export `initThemeToggle(doc = globalThis.document)` that finds `.theme-toggle`, removes `hidden`, sets `aria-pressed` from the effective theme (saved value or `matchMedia('(prefers-color-scheme: dark)')`), on click computes `nextTheme`, sets `data-theme-switching` on `<html>` (removed after 300ms), sets `html.dataset.theme`, calls `writePreference('theme', …)` (keeps an in-memory saved value if writing fails), updates `aria-pressed`, and sets every `meta[name=theme-color]` `content` to the value of `getComputedStyle(doc.documentElement).getPropertyValue('--color-bg').trim()` read after the attribute change — **no colour literals in JS** (Principle III); subscribes to the media query `change` event and updates `aria-pressed` only while no preference is saved; short JSDoc on each export (Principle IV)
- [X] T073 [P] [US4] Write `src/css/components/theme-toggle.css` (P4.2): `.theme-toggle` `--tap-min` square, transparent background, `--radius-pill`, colour `--color-text`; show the moon icon when `[aria-pressed="false"]` and the sun icon when `[aria-pressed="true"]`; hover background `--color-tag-bg`
- [X] T074 [US1] Implement `src/js/copy-email.js` (P4.3, research R-17): export `copyText(text, clipboard = globalThis.navigator?.clipboard)` → `Promise<'success' | 'error'>`, `statusMessage(result)`, and `initCopyEmail(doc = globalThis.document)` that returns early unless `navigator.clipboard?.writeText` exists, removes `hidden` from `[data-js="copy-email"]`, reads the address from `.contact__email-link` `href` (strip `mailto:`), writes the status text into `[data-js="copy-email-status"]`, and clears it after 4000ms (restarting the timer on repeat clicks); short JSDoc on each export (Principle IV)
- [X] T075 [US4] Implement `src/js/nav.js` (P4.4, research R-12/R-13): export `shouldCollapse(viewportWidthEm)` (`< 48`) and `initNav(doc = globalThis.document)` that removes `hidden` from `.nav__toggle`, toggles `aria-expanded` on click, closes on Escape (returning focus to the toggle) and after a `.nav__link` is chosen, resets to collapsed when `matchMedia('(min-width: 48em)')` starts matching, and — after a nav or brand link click — lets the default hash navigation happen, then calls `target.focus({ preventScroll: true })` on the target section; short JSDoc on each export (Principle IV)
- [X] T076 [US4] Implement `src/js/main.js` (P4.5, research R-08): import `initThemeToggle`, `initNav`, `initCopyEmail` and call each inside its own `try { … } catch { /* isolated so one feature cannot disable the others */ }` without logging; add `<link rel="modulepreload" href="js/storage.js">`, `js/theme.js`, `js/nav.js`, `js/copy-email.js` to the head of `src/index.html` before the module script
- [X] T077 [P] Replace the stub `tools/check-budgets.mjs` from T011 with the real check (research R-23, Principle VI): gzip (`zlib.gzipSync`, level 9) `dist/index.html`, the stylesheet(s) linked without `media="print"`, and every `dist/js/*.js`; print a table; fail if HTML+CSS+JS > 100 KB, JS > 30 KB, or those plus `assets/icons.svg`, `assets/favicon.svg` > 300 KB; skip with a warning if `dist/` is missing
- [X] T078 Run Gate 4 (V4.1–V4.9): `npm run lint`, `npm run test:unit`, `npm run build`, `node tools/check-budgets.mjs`, the full e2e suite in three engines (fixture must report 0 console errors and 0 CSP violations), and a manual NVDA + Firefox and VoiceOver (iOS) check that toggle state, menu state, and "Copied!" are announced; record in `checklists/implementation-gates.md` → Phase 4

**Checkpoint (Gate 4)**: V4.1–V4.9 pass. US4 scenarios 1–5 and US1 scenario 4 are demonstrable.

---

## Phase 6: Implementation Phase 5 — Scroll Animations & Performance Refinements

**Goal**: Timeline scroll-in, current-section indicator, smooth-scroll verification, share
assets, production build, and Lighthouse targets (plan P5.1–P5.6).

**Independent Test**: `npm run build && npm run check:static && npm run test:e2e && npm run test:lighthouse` pass; Lighthouse meets every Principle VI threshold.

### Tests for Implementation Phase 5 (write first, confirm they fail)

- [X] T079 [P] [US2] Write `tests/unit/reveal.test.js`: `shouldReveal({ hasObserver: true, prefersReducedMotion: false }) === true`; `false` when either flag blocks; `isBelowViewport(900, 800) === true`, `(799, 800) === false`, `(-50, 800) === false`
- [X] T080 [P] [US4] Write `tests/unit/scroll-spy.test.js`: `pickActiveSection` returns the id of the intersecting entry with the smallest non-negative `boundingClientRect.top`, `null` for an empty or non-intersecting list
- [X] T081 [P] [US2] Write `tests/e2e/reveal.spec.js` (V5.1): at 375×667 from the top with motion allowed, timeline entries below the fold have `data-reveal="pending"` and computed opacity 0, and after `scrollIntoViewIfNeeded` each becomes `visible` with opacity 1 within 1s; with `reducedMotion: 'reduce'` no element has `data-reveal`; with JS disabled all entries have opacity 1; loading `/#projects` leaves no entry `pending`; `keyboard.press('End')` then 1s wait leaves no entry `pending`; `layoutShiftScore` after scrolling top-to-bottom ≤ 0.05
- [X] T082 [P] [US4] Extend `tests/e2e/nav-theme.spec.js` (V5.2, V5.3): scrolling each content section into view gives exactly one `.nav__link[aria-current="true"]` pointing at it; at the top (hero) none; computed `scroll-behavior` of `html` is `smooth` with motion allowed and `auto` with `reducedMotion: 'reduce'`
- [X] T083 [P] Extend `tests/e2e/structure.spec.js` (V5.4, V5.7): in `dist/index.html` exactly one `link[rel=stylesheet]` without `media="print"`; every local `href`/`src` for CSS, JS, `modulepreload`, and icons contains `?v=`; `link[rel=apple-touch-icon]` and 32px PNG icon exist; fetching `og:image`'s pathname returns a PNG whose IHDR width/height are 1200×630

### Implementation for Implementation Phase 5

- [X] T084 [US2] Implement `src/js/reveal.js` (P5.1, research R-16): export `shouldReveal({ hasObserver, prefersReducedMotion })`, `isBelowViewport(rectTop, viewportHeight)`, and `initReveal(doc = globalThis.document)` that returns unless `shouldReveal` passes, sets `data-reveal="pending"` only on `.timeline__entry` elements currently below the viewport, and uses one `IntersectionObserver` (threshold 0.15) to set `data-reveal="visible"` and unobserve on intersection; short JSDoc on each export (Principle IV); add to `timeline.css`, inside `@media (prefers-reduced-motion: no-preference)`: `[data-reveal="pending"] { opacity: 0; transform: translateY(1rem); }` and `[data-reveal="visible"] { transition: opacity var(--duration-reveal) var(--ease-out), transform var(--duration-reveal) var(--ease-out); }`
- [X] T085 [US4] Implement `src/js/scroll-spy.js` (P5.2, research R-14): export `pickActiveSection(entries)` and `initScrollSpy(doc = globalThis.document)` observing `#about`, `#experience`, `#projects`, `#contact` with `rootMargin` of `-(nav height)px 0px -55% 0px`, setting `aria-current="true"` on the matching `.nav__link` and removing it from the others (none while the hero is in view); short JSDoc on each export (Principle IV); style `.nav__link[aria-current="true"]` in `site-header.css` with a 2px `--color-accent` underline and `--color-text` weight 600
- [X] T086 Register the new modules in `src/js/main.js` (`initReveal`, `initScrollSpy`, each in its own `try/catch`) and add `modulepreload` links for `js/reveal.js` and `js/scroll-spy.js` in `src/index.html`
- [X] T087 Verify smooth scroll and focus visibility in all three engines (P5.3): run T055 and T082; only if an engine fails the focus-obscured check, add a `focusin` listener in `src/js/nav.js` that calls `scrollIntoView({ block: 'nearest' })` then adjusts by the header height when the focused element's top is under `.site-header` (research R-13)
- [X] T088 [P] Create `tools/og-template.html` (1200×630 layout: cream background, "Aseel Almanahy" serif title, the hero statement, amber accent bar, all colours inline in this dev-only file) and `tools/generate-images.mjs` that uses Playwright Chromium to screenshot it to `src/assets/og-image.png` (1200×630, fail if > 100 KB) and to render `src/assets/favicon.svg` into `src/assets/apple-touch-icon.png` (180×180, cream padding) and `src/assets/favicon-32.png` (32×32); run it and commit the PNGs (P5.4)
- [X] T089 Add `<link rel="icon" href="assets/favicon-32.png" sizes="32x32" type="image/png">` and `<link rel="apple-touch-icon" href="assets/apple-touch-icon.png">` to `src/index.html` and `src/404.html`; confirm `og:image:alt` describes the image
- [X] T090 Complete `tools/build.mjs` (P5.5, research R-07/R-22): clean `dist/`; copy `src/` except `src/css/**` partials; bundle `src/css/main.css` with the `lightningcss` `bundle()` API (`minify: true`, `targets` from `browserslistToTargets` for "last 2 versions" of the supported browsers) to `dist/css/main.css`; minify `src/css/print.css` to `dist/css/print.css`; for every local CSS/JS/SVG/PNG reference in `dist/*.html` (and `import` specifiers inside `dist/js/*.js`) append `?v=` + the first 8 hex chars of the file's SHA-256; leave the inline bootstrap script byte-identical so the CSP hash still matches; print a size table
- [X] T091 Tune performance (P5.6): run `npm run build && npm run test:lighthouse`; fix any failing audit without adding dependencies (e.g. missing `width`/`height`, unused CSS rules, render-blocking resources beyond `main.css`); rerun `node tools/check-budgets.mjs` and `node tools/check-csp.mjs` (now also checks `dist`)
- [X] T092 Run Gate 5a (V5.1–V5.5, V5.7): `npm run verify` minus `check:links` (content markers still present), plus T079–T083 in three engines; record Lighthouse scores, LCP, CLS, TBT, and gzip sizes in `checklists/implementation-gates.md` → Phase 5

**Checkpoint (Gate 5a)**: All automated V5 criteria except link checking and content completeness pass.

---

## Phase 7: Polish, Content & Launch

**Purpose**: CI/CD, real content, final manual gates, and deployment (plan P5.7–P5.8, V5.6,
V5.8–V5.10).

- [X] T093 [P] Create `.github/workflows/ci.yml` (research R-24): triggers `pull_request` and `push` to `main`; `permissions: contents: read, pages: write, id-token: write`; job `verify` on `ubuntu-latest`: `actions/checkout`, `actions/setup-node` (node 24, npm cache), `npm ci`, `npx playwright install --with-deps chromium firefox webkit`, `npm run verify`, upload `playwright-report/` and `.lighthouseci/` as artifacts on failure, then (on success) `actions/configure-pages` and `actions/upload-pages-artifact` with path `dist` — the exact build that was tested; job `deploy` with `needs: verify`, `if: github.event_name == 'push' && github.ref == 'refs/heads/main'`, `environment: github-pages`, single step `actions/deploy-pages` (no checkout, no rebuild — research R-24)
- [X] T094 Collect the content inputs from Aseel listed in [quickstart.md → Content inputs](quickstart.md#content-inputs-must-be-complete-before-first-deploy) — **complete 2026-09-30**: GitHub and LinkedIn URLs, About intro, Experience narrative (Phase 8), site URL `https://aseelalmanahy.github.io/` (repository `aseelalmanahy.github.io`), and public email `[email removed]`. Repository creation moved to T102.
- [X] T095 [US2] **SUPERSEDED 2026-09-30** (timeline removed; no dates are published — see Phase 8). Was: Apply the real role dates in `src/index.html`: set each `<time datetime="YYYY-MM">Mon YYYY</time>` (abbreviated month, e.g. "Jun 2022"; FR-011), remove `data-content-placeholder`, and reorder the `li.timeline__item` elements "by `start` descending; ties broken with `engineering` before `leadership`" (data-model TimelineEntry)
- [X] T096 [US1] Replace every remaining `CONTENT:` value in `src/index.html`, `src/404.html` (`<base href>` = `/`), `src/robots.txt`, and `src/sitemap.xml` — done 2026-09-30 (site URL in commit 072b760; email in the final launch sync); `node tools/check-content.mjs --strict` reports 0 and `node tools/check-site-url.mjs` passes (V5.8)
- [X] T097 Run `npm run build && npm run check:links` (0 broken; LinkedIn skipped and verified manually by opening the profile) and record the result in `specs/001-portfolio-website/checklists/implementation-gates.md` (V5.6)
- [ ] T098 Perform and record the written privacy review (FR-015, SC-009) in `checklists/implementation-gates.md`: reviewer, date, and confirmation that the whole page — especially `#experience` — contains no internal application or system names, architecture descriptions, proprietary tools, team or department names, client information, or non-public metrics
- [ ] T099 Perform and record the manual gates in `checklists/implementation-gates.md`: screen-reader smoke test (NVDA + Firefox; VoiceOver iOS), screenshot review at 320/375/768/1024/1440/2560 in both themes, JS-disabled walkthrough, print preview, and the SC-002 usability check (5 participants; pass = ≥ 4 start an email and open GitHub within 30s each)
- [ ] T100 Fill the final Success Criteria table SC-001–SC-010 and gates G1–G16 in `checklists/implementation-gates.md` with evidence (V5.10); confirm `git diff main -- specs/001-portfolio-website/spec.md` shows no changes below the `**Input**` line — header metadata and the recorded 2026-09-30 owner amendment only (G1)
- [X] T101 Update `CLAUDE.md` if any command, path, or tool changed during implementation, and confirm every command listed there runs
- [ ] T102 Create the public GitHub repository `aseelalmanahy.github.io` (owner action: on github.com, or `gh repo create aseelalmanahy.github.io --public --source . --remote origin` after `gh auth login`), push the branch to `origin`, open a pull request, and confirm the `verify` job is green (V5.9); after merge to `main`, confirm with the owner that repository Settings → Pages → Source is "GitHub Actions" and "Enforce HTTPS" is on, then confirm the `deploy` job published the site
- [ ] T103 Launch spot-check on the live URL (quickstart → Launch checklist): real phone in both themes, share-link preview renders title/description/image, theme persists across visits, all six contact links work; record the result in `specs/001-portfolio-website/checklists/implementation-gates.md`

---

## Phase 8: Amendment — Narrative Content Structure (2026-09-30)

**Goal**: Apply the owner's amendment (spec Session 2026-09-30; plan → Amendment; research
R-27; constitution v2.1.1): verbatim About Me intro (FR-008), a single Experience narrative
replacing the timeline (FR-011–FR-015), and the real GitHub/LinkedIn URLs (FR-006) — keeping
every earlier gate and Lighthouse result.

**Independent Test**: `npm run build && npx playwright test tests/e2e/about-experience.spec.js tests/e2e/privacy-scope.spec.js tests/e2e/hero-contact.spec.js` passes in three engines; the full suite and Lighthouse show no regression.

### Tests for Phase 8 (write first, confirm they fail)

- [X] T104 [P] [US2] Rewrite `tests/e2e/about-experience.spec.js`: About intro text equals spec FR-008 verbatim; education and skills assertions unchanged; `#experience` contains exactly one `.experience__narrative` paragraph whose text equals spec FR-011 verbatim; the narrative's rendered line length is ≤ 75 characters (width ÷ width of one `0` in its font) at 1440px; the narrative is visible and not clipped at 320px; delete the timeline layout, marker-shape, and highlight-parity tests (FR-012, FR-013)
- [X] T105 [P] Update `tests/e2e/privacy-scope.spec.js`: replace the timeline-field test with a narrative-only test — `#experience` has no `ol`, `ul`, `li`, `time`, `article`, or `h3`, exactly one `p`, and its text matches none of `/\b(19|20)\d{2}\b/`, `/\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.? \d{4}\b/`, `/Fidelity|Leap to Lead|LEAP|Present/` (FR-012, FR-014); the whole page contains no `.timeline` element
- [X] T106 [P] [US1] Extend `tests/e2e/hero-contact.spec.js`: every GitHub link (hero, Contact, coming-soon card) has `href="https://github.com/aseelalmanahy"`, every LinkedIn link has `href="https://www.linkedin.com/in/aseel-almanahy-97342b109/"`, and the JSON-LD `sameAs` equals `[github, linkedin]` in that order (FR-006)
- [X] T107 [P] Update `tests/e2e/no-js.spec.js` (assert `.experience__narrative` visible instead of timeline entries) and the keyboard walkthrough in `tests/e2e/a11y.spec.js` (no timeline tab stops: after the hero CTAs the next stop is the coming-soon card's GitHub link)
- [X] T108 [P] Delete `tests/e2e/reveal.spec.js` and `tests/unit/reveal.test.js` (feature removed by FR-013)

### Implementation for Phase 8

- [X] T109 [US2] In `src/index.html`: replace the About intro with spec FR-008 verbatim and remove `data-content-status="draft"`; replace the whole `<ol class="timeline">` with `<p class="experience__narrative">` containing spec FR-011 verbatim, per [content-blocks.md → Experience narrative](contracts/content-blocks.md#experience-narrative-fr-011fr-014-replaces-the-timeline-entry-2026-09-30)
- [X] T110 [US1] In `src/index.html`: set every GitHub `href` (hero, Contact, coming-soon card) to `https://github.com/aseelalmanahy` and every LinkedIn `href` (hero, Contact) to `https://www.linkedin.com/in/aseel-almanahy-97342b109/`; set JSON-LD `sameAs` to both URLs (FR-006)
- [X] T111 [US2] Create `src/css/components/experience.css` per research R-27 (`.experience__narrative`: `--text-lg`, line-height 1.75, `max-width: 62ch`, 3px `--color-accent-bg` left rule with fluid padding, serif `::first-letter` drop cap in `--color-accent`; token colours only); delete `src/css/components/timeline.css`; in `src/css/main.css` replace the timeline import with `experience.css`; in `src/css/print.css` drop `.timeline__entry` from the break-avoid rule
- [X] T112 Remove `src/js/reveal.js`, its import and `initReveal` entry in `src/js/main.js`, and its `modulepreload` link in `src/index.html`
- [X] T113 Run `npm run format`, `npm run lint`, `npm run test:unit`, `npm run build`, `npm run check:static`, and the full e2e suite in Chromium, Firefox, and WebKit; all pass (0 console errors, 0 CSP violations); budgets not exceeded
- [X] T114 Run Lighthouse CI on the build and on a throwaway copy of `dist/` with example values for the two remaining `CONTENT:` inputs (email, site URL); Performance, Accessibility, Best Practices = 1.00 and SEO ≥ 0.95 on the copy; LCP ≤ 2.0 s, CLS ≤ 0.05, TBT ≤ 200 ms
- [X] T115 Visual check of the Experience narrative at 375px and 1440px in both themes (screenshots); record in `specs/001-portfolio-website/checklists/implementation-gates.md` → Amendment table
- [X] T116 Update `specs/001-portfolio-website/checklists/implementation-gates.md` (Amendment table, SC/G tables where evidence changed) and `CLAUDE.md` (content placeholders now: email and site URL only)
- [X] T117 Commit the amendment on branch `001-portfolio-website`

**Checkpoint (Amendment gate)**: T113–T115 pass; no regression in Gates 1–5a.

---

## Phase 9: Amendment — Interests Section (2026-09-30)

**Goal**: Add the owner's Interests section (spec User Story 5, FR-037–FR-040; research R-28;
constitution v2.2.0) between Experience and Projects — a static, accessible grid list of five
hobbies with inline decorative SVG icons — without regressing any existing gate.

**Independent Test**: `npm run build && npx playwright test tests/e2e/interests.spec.js` passes in three engines, and the full suite, budgets, and Lighthouse show no regression.

### Tests for Phase 9 (write first, confirm they fail)

- [X] T118 [P] [US5] Create `tests/e2e/interests.spec.js`: `#interests` follows `#experience` and precedes `#projects`; its `h2` reads "Interests"; `ul.interests__list > li` count is 5 with labels exactly Cooking, Reading Books, Weightlifting, Cycling, Skiing; every item has one inline `svg` with `aria-hidden="true"` and no `<use>`; the section contains no `a`, `button`, `[tabindex]`; computed `animation-name` is `none` and `transition-duration` is `0s` for items; column count (distinct item `x`) is 1 at 320px, 2 at 375px, and 5 at 1440px; icon stroke colour equals `--color-accent` in both themes (FR-037–FR-040)
- [X] T119 [P] Update `tests/e2e/structure.spec.js` section order to `home, about, experience, interests, projects, contact`; update `tests/e2e/responsive.spec.js` and `tests/e2e/no-js.spec.js` to expect five nav links (and `#interests` visible without JS); add `#interests` to the deep-link list and the scroll-spy loop in `tests/e2e/nav-theme.spec.js`; add "Interests" after "Experience" in the keyboard walkthrough in `tests/e2e/a11y.spec.js`
- [X] T120 [P] Add a nav-fit check to `tests/e2e/responsive.spec.js`: at 768px (JS on) the header is one row (height ≤ 57px) with all five nav links visible

### Implementation for Phase 9

- [X] T121 [US5] In `src/index.html`: add `<li><a class="nav__link" href="#interests">Interests</a></li>` after Experience in `#nav-menu`; add `<section id="interests" class="interests" tabindex="-1" aria-labelledby="interests-title">` after `#experience` with `h2#interests-title.section__title` "Interests" and `ul.interests__list` of five `li.interests__item` per [content-blocks.md → Interest item](contracts/content-blocks.md#interest-item-fr-037fr-040-amendment-2026-09-30): inline 24×24 stroke icons (pot, open book, dumbbell, bicycle, skier) with `aria-hidden="true" focusable="false"`, `stroke="currentColor"`, and a `span.interests__label`
- [X] T122 [US5] Add `--size-icon-lg: 1.75rem` to the Layout group of `src/css/tokens.css`; create `src/css/components/interests.css` per research R-28 (auto-fit grid `minmax(min(100%, 9.5rem), 1fr)`, `max-width: 56rem`, surface cards with `--color-tag-bg` border, icon in `--color-accent` at `--size-icon-lg`, centred label; no hover, focus, transition, or animation); import it after `experience.css` in `src/css/main.css`; add `.interests__item` to the print break-avoid rule in `src/css/print.css`
- [X] T123 [US4] Add `'interests'` after `'experience'` in `SECTION_IDS` in `src/js/scroll-spy.js`
- [X] T124 **Not needed** — T120 passed (nav fits one row at 768px). Was: If T120 fails (nav wraps at 768px), fix the header so all links fit one row at ≥ 48em (e.g. tighter `.nav__link` padding at that breakpoint) without shrinking targets below 44×44
- [X] T125 Run `npm run format`, `npm run lint`, `npm run test:unit`, `npm run build`, `npm run check:static`, and the full e2e suite in Chromium, Firefox, and WebKit — all pass with 0 console errors and 0 CSP violations; budgets hold
- [X] T126 Run Lighthouse CI on the build: index.html Performance, Accessibility, Best Practices, SEO = 1.00; LCP ≤ 2.0 s, CLS ≤ 0.05, TBT ≤ 200 ms
- [X] T127 Visual check of Interests at 320px, 375px, and 1440px in both themes (screenshots); record in `specs/001-portfolio-website/checklists/implementation-gates.md`
- [X] T128 Update `specs/001-portfolio-website/checklists/implementation-gates.md` (Interests amendment table) and `CLAUDE.md` (constitution v2.2.0, six sections)
- [X] T129 Commit the amendment on branch `001-portfolio-website`

**Checkpoint (Interests gate)**: T125–T127 pass; no regression in earlier gates.

---

## Phase 10: Amendment — Contact via LinkedIn, Email Removed (2026-09-30)

**Goal**: Remove every email path (hero Email button, Contact "Email me" button, visible address,
Copy-email control and module) and make LinkedIn the stated, primary way to get in touch (spec
FR-005, FR-021, FR-022a; FR-007 and FR-021a removed) without regressing any gate.

**Independent Test**: `npm run verify` exits 0; `hero-contact.spec.js` confirms two hero routes, LinkedIn-first Contact, and no email anywhere.

### Tests for Phase 10 (write first, confirm they fail)

- [X] T130 [P] [US1] Rewrite `tests/e2e/hero-contact.spec.js`: hero has exactly GitHub then LinkedIn (new tab); Contact intro mentions LinkedIn as the best/primary way, links are LinkedIn (`button--primary`) then GitHub (`button--secondary`); no `a[href^="mailto:"]`, no copy control, and no email address or `mailto:` in `dist/index.html`; SC-001 checks four hero targets; delete the copy-email tests
- [X] T131 [P] Update `tests/e2e/a11y.spec.js` keyboard walkthrough (13 stops, "Connect on LinkedIn" before "GitHub profile"), drop the copy-button check from `tests/e2e/no-js.spec.js`, drop the email-wrap assertion from `tests/e2e/responsive.spec.js`, and delete `tests/unit/copy-email.test.js`

### Implementation for Phase 10

- [X] T132 [US1] In `src/index.html`: remove the hero Email button, the Contact "Email me" button, the email paragraph (address, Copy button, status region), and the `js/copy-email.js` modulepreload; set the Contact intro to say the best way to reach out or connect is directly on LinkedIn; order Contact links LinkedIn (`button--primary`, "Connect on LinkedIn") then GitHub (`button--secondary`, "GitHub profile")
- [X] T133 Delete `src/js/copy-email.js` and its registration in `src/js/main.js`; remove the email/copy rules from `src/css/components/contact.css` and `src/css/print.css`; remove the unused `#email` symbol from `src/assets/icons.svg`
- [X] T134 Sync design docs: spec (Session 2026-09-30 contact amendment), plan amendment note and trees, research R-17 superseded, data model (ContactLink, CopyStatus removed), contracts (content-blocks, behaviour), quickstart, and `CLAUDE.md`
- [X] T135 Run `npm run verify` (format, lint, unit, build, static checks, full e2e in three engines, Lighthouse, links) — exit 0; Lighthouse index.html 1.00 in all four categories
- [X] T136 Record the Phase 10 gate in `specs/001-portfolio-website/checklists/implementation-gates.md`
- [X] T137 Commit on branch `001-portfolio-website`

**Checkpoint (Contact gate)**: T135 passes; no regression in earlier gates.

---

## Phase 11: Amendment — Four-Tier Skills & Contact Wording (2026-09-30)

**Goal**: Replace the two skill groups with the owner's four full-lifecycle tiers (spec FR-010)
in a responsive 1/2/4-column grid, sharpen the Contact copy to name LinkedIn the primary channel
to "initiate professional discussions" (FR-021), and remove defunct email/timeline conditions
from the test suite — keeping every gate and Lighthouse at 100.

**Independent Test**: `npm run verify` exits 0; `about-experience.spec.js` confirms four tiers, 28 items in order, and 1/2/2/4 columns at 375/768/1024/1440px.

### Tests for Phase 11 (write first, confirm they fail)

- [X] T138 [P] [US2] In `tests/e2e/about-experience.spec.js`, replace the two-group skills test with a four-tier test (titles and all 28 items in FR-010 order, one `ul.tag-list` per tier) and a column test (1 @ 375, 2 @ 768 and 1024, 4 @ 1440)
- [X] T139 [P] [US1] In `tests/e2e/hero-contact.spec.js`, require the Contact intro to say "primary and best" and "initiate professional discussions"; drop the defunct copy-email selector check (keep the no-`mailto:`/no-address guard for FR-021)
- [X] T140 [P] Remove defunct conditions: the `.timeline` class check in `tests/e2e/privacy-scope.spec.js` (FR-012 structure checks remain) and the reveal-fade reduced-motion setting and comment in `tests/e2e/a11y.spec.js`

### Implementation for Phase 11

- [X] T141 [US2] In `src/index.html`, replace the About two-column grid with stacked `div.about__group` blocks (Education, then Skills) and a `div.skills` of four `.skill-group` tiers (`skills-languages`, `skills-frameworks`, `skills-cloud`, `skills-quality`) with the FR-010 items; add `<wbr />` after each "/" in TypeScript/JavaScript, Git/GitLab/Bitbucket, Scrum/Kanban/SAFe
- [X] T142 [US2] Add `--skills-columns` (1; 2 at 40em; 4 at 75em) to `src/css/tokens.css`; rewrite `src/css/components/about.css` (group spacing, education 2-up ≥ 48em, `.skills` grid from the token, `.skill-group` cards); give `.tag` `max-width: 100%` and `overflow-wrap: anywhere` in `src/css/components/tag.css`
- [X] T143 [US1] Update the Contact intro in `src/index.html`: LinkedIn is the primary and best channel to reach out, connect, or initiate professional discussions
- [X] T144 Sync design docs: spec (FR-010, FR-021, US2, Skill Category, Session 2026-09-30), plan amendment + scale, research R-29, data model, contracts (page-structure outline, content-blocks skill tiers), quickstart
- [X] T145 Run `npm run verify` — exit 0; Lighthouse index.html 1.00 in all four categories; record in `specs/001-portfolio-website/checklists/implementation-gates.md`
- [X] T146 Commit on branch `001-portfolio-website`

**Checkpoint (Skills gate)**: T145 passes; no regression in earlier gates.

---

## Phase 12: Amendment — Corrected Experience Narrative (2026-09-30)

**Goal**: Publish the owner's corrected Experience narrative word-for-word (spec FR-011) with the
FR-012 exception for the owner's university, keeping every gate green.

**Independent Test**: `npm run verify` exits 0; the verbatim-narrative test in `about-experience.spec.js` passes on all three engines.

- [X] T147 [US2] Update `EXPERIENCE_NARRATIVE` in `tests/e2e/about-experience.spec.js` to the corrected FR-011 text; confirm it fails against the old page
- [X] T148 [US2] Replace the `p.experience__narrative` text in `src/index.html` with the corrected FR-011 text, verbatim
- [X] T149 Sync docs: spec (status, amendment input, clarification, US2, FR-011, FR-012, FR-014, Experience Narrative entity, assumption), requirements checklist iteration 7, data model
- [X] T150 Run `npm run verify` (exit 0, Lighthouse 1.00 ×4), record in `checklists/implementation-gates.md`, and commit on `001-portfolio-website`

**Checkpoint (Narrative gate)**: T150 passes; FR-015 privacy review of the new text stays with the owner (T098).

---

## Phase 13: Amendment — Punctuation, Link Placement, Featured Projects (2026-09-30)

**Goal**: Remove every em dash (FR-041), keep profile links only in the hero and Contact
(FR-042), and replace the coming-soon card with three featured repository cards (FR-017,
FR-020), keeping every gate and Lighthouse at 100.

**Independent Test**: `npm run verify` exits 0; `projects.spec.js`, the FR-042 placement test, and the FR-041 punctuation checks pass on all three engines.

### Tests for Phase 13 (write first, confirm they fail)

- [X] T151 [P] [US3] Rewrite `tests/e2e/projects.spec.js` for the three real cards: titles, order, description ≤ 200, exact tags, repository hrefs and labels, unique tags, no placeholder, repo-only links, 1/2/3/3 columns at 375/768/1024/1440px
- [X] T152 [P] [US1] In `tests/e2e/hero-contact.spec.js`, expect two profile links per network and add the FR-042 placement test (hero then Contact, nowhere else)
- [X] T153 [P] Add FR-041 checks to `tests/e2e/structure.spec.js` (rendered text, titles, meta, and labels on `/` and `/404.html`; every `src/` file); update the FR-008/FR-011 constants in `about-experience.spec.js` and the 17-stop keyboard walkthrough in `a11y.spec.js`

### Implementation for Phase 13

- [X] T154 [US3] Replace the coming-soon card in `src/index.html` with the three featured cards; add the `#code` symbol to `src/assets/icons.svg`; delete `.project-card--placeholder` and add the accent top border and link icon gap in `src/css/components/project-card.css`
- [X] T155 Remove em dashes: `src/index.html` (title, `og:title`, About, Experience, Contact), `src/404.html`, CSS comments, `tools/*.mjs`, `package.json`, and e2e describe titles
- [X] T156 Sync docs: spec (status, amendment input, clarifications, US3, edge case, FR-008, FR-011, FR-017, FR-020, FR-041, FR-042, Project entity, SC-002, assumption), requirements checklist iteration 8, data model, contracts, quickstart, plan amendment, research R-30
- [X] T157 Run `npm run verify` (exit 0, Lighthouse 1.00 ×4) and record in `checklists/implementation-gates.md`
- [X] T158 Commit on branch `001-portfolio-website`

**Checkpoint (Polish & projects gate)**: T157 passes; the owner reviews the card copy with T098.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 Setup**: no dependencies.
- **Phase 2 (Impl. Phase 1)**: depends on Setup. Blocks everything after it (all content and
  checks live here).
- **Phase 3 (Impl. Phase 2)**: depends on Gate 1 (T035).
- **Phase 4 (Impl. Phase 3)**: depends on Gate 2 (T051).
- **Phase 5 (Impl. Phase 4)**: depends on Gate 3 (T063). (JS could start after Phase 2, but the
  requested sequence and V3.6 focus tests make Gate 3 the entry condition.)
- **Phase 6 (Impl. Phase 5)**: depends on Gate 4 (T078).
- **Phase 8 Amendment (2026-09-30)**: runs after Gate 5a and before T096–T103 (launch needs the amended content). T104–T108 are parallel; T109–T112 edit shared files, in order; T113–T117 follow.
- **Phase 9 Interests (2026-09-30)**: after Phase 8 and before T096–T103. T118–T120 are parallel; T121–T124 in order; T125–T129 follow.
- **Phase 10 Contact via LinkedIn (2026-09-30)**: after Phase 9 and before T102–T103. T130–T131 parallel; T132–T134 in order; T135–T137 follow.
- **Phase 13 Polish & projects (2026-09-30)**: after Phase 12 and before T098/T102–T103. T151–T153 parallel; T154–T156 in order; T157–T158 follow.
- **Phase 12 Narrative (2026-09-30)**: after Phase 11 and before T098/T102–T103. T147 → T148 → T149 → T150.
- **Phase 11 Skills (2026-09-30)**: after Phase 10 and before T102–T103. T138–T140 parallel; T141–T144 in order; T145–T146 follow.
- **Phase 7 Polish & Launch**: T093 can start after Gate 4; T094 (content) can be requested at
  any time and is the only external blocker; T095–T103 depend on Gate 5a (T092) and T094.

### Key task dependencies

- T021 (CSP hash) after T020; re-run after any change to the bootstrap script.
- T022 → T023–T028 (all edit `src/index.html`; run sequentially).
- T041 (tokens) before T043–T050 and T056–T062 (all reference tokens).
- T071 (storage) before T072 (theme).
- T072, T074, T075 before T076 (main.js imports them); T084, T085 before T086.
- T090 (full build) before T083 and T091 can pass.
- T094 before T095–T097.

### Within Each Phase

- Test tasks first; confirm they fail for the right reason, then implement.
- Tokens → base → layout → components.
- Pure helpers → `init*` wiring → `main.js` registration.
- Close every phase with its gate task and record the result before starting the next phase.

---

## Parallel Opportunities

- **Setup**: T002, T004–T009, T011–T014 in parallel after T001/T003.
- **Phase 2 tests**: T015–T019 together. Implementation: T029–T034 in parallel with the
  sequential `index.html` chain T020–T028.
- **Phase 3**: tests T036–T040 together; T042, T044–T050 in parallel after T041.
- **Phase 4**: tests T052–T055 together; T057–T062 in parallel (T056 edits `site-header.css`
  alone).
- **Phase 5**: tests T064–T070 together; T071, T073, T077 in parallel; T072 → T074/T075 can run
  in parallel with each other → T076.
- **Phase 6**: tests T079–T083 together; T088 in parallel with T084–T087.

### Parallel Example: Phase 5 (JS modules)

```text
# All tests at once:
Task: "Write tests/unit/storage.test.js"
Task: "Write tests/unit/theme.test.js"
Task: "Write tests/unit/copy-email.test.js"
Task: "Write tests/unit/nav.test.js"
Task: "Extend tests/e2e/nav-theme.spec.js (theme + menu)"
Task: "Extend tests/e2e/hero-contact.spec.js (copy email)"

# Then independent implementation files:
Task: "Implement src/js/storage.js"
Task: "Write src/css/components/theme-toggle.css"
Task: "Create tools/check-budgets.mjs"
```

### Parallel Example: Phase 4 (responsive components)

```text
Task: "Write src/css/components/about.css and tag.css"
Task: "Write src/css/components/timeline.css"
Task: "Write src/css/components/project-card.css"
Task: "Write src/css/components/contact.css"
Task: "Write src/css/print.css"
```

---

## Story Slices

Each story can be verified on its own with the listed tests once its tasks are done.

| Story | Tasks | Independent test |
|---|---|---|
| **US1** Meet Aseel & get in touch (P1) 🎯 MVP | T016, T024, T028, T038, T046, T047, T060, T130, T132, T133 (email tasks T066, T069, T074, T096 superseded 2026-09-30) | `hero-contact.spec.js`: verbatim hero text, GitHub and LinkedIn above the fold at 375×667 with new-tab cues, Contact names LinkedIn as the primary way to connect (listed first), no email anywhere |
| **US2** Background & experience (P2) | T025, T057, T104, T105, T109, T111, T138, T141, T142, T147, T148 (timeline tasks T026, T053, T058, T079, T081, T084, T095 superseded 2026-09-30) | `about-experience.spec.js`: verbatim About intro, degrees, four skill tiers (28 items, 1/2/4 columns), one verbatim Experience narrative at ≤ 75 characters per line; `privacy-scope.spec.js`: no timeline, dates, employer, or role list |
| **US3** Explore projects (P3) | T027, T054, T059, T151, T154 | `projects.spec.js`: three featured repository cards (content, order, unique tags, repo-only code links) reflow 1 → 2 → 3 columns |
| **US4** Navigate & choose a theme (P4) | T023, T039, T049, T055, T056, T065, T067, T068, T072, T073, T075, T076, T080, T082, T085 | `nav-theme.spec.js`: no-flash theme, persisted toggle, device-follow rules, reduced motion, mobile menu with Escape, focus to section, headings never under the bar, current-section marking |
| **US5** Interests (P5) | T118, T119, T120, T121, T122, T123 | `interests.spec.js`: placement after Experience, five hobbies in order as a list, one decorative inline icon each, static (no links, motion), 1/2/5 columns at 320/375/1440px, accent-coloured icons in both themes |

Cross-cutting (all stories): T015, T017–T019, T036, T037, T040, T052, T070, T083 and the gate
tasks.

---

## Implementation Strategy

### MVP first (User Story 1)

1. Phase 1 Setup → Phase 2 (all markup) → Gate 1.
2. Phase 3 (tokens, typography, hero, buttons) → Gate 2. US1 now works: styled hero, three
   CTAs above the fold, contact section (copy button still hidden, which FR-021a permits when
   scripting is unavailable).
3. **Stop and validate** `hero-contact.spec.js` + a11y. If an early launch is wanted, jump to
   T090 (build), T093 (CI), T094–T097 (content), then deploy.

### Incremental delivery

1. Gate 3 → US2 (without animation) and US3 layouts complete.
2. Gate 4 → US4 theme/menu and US1 copy email complete.
3. Gate 5a → US2 scroll-in, US4 current-section indicator, performance targets.
4. Phase 7 → real content, manual gates, deploy.

Each gate re-runs every earlier test so a later phase never breaks an earlier story.

---

## Notes

- [P] = different files, no dependencies on incomplete tasks.
- Never invent content values (dates, URLs, email): use `CONTENT:` markers until T094 supplies
  them.
- After any edit to the inline bootstrap script, run `node tools/check-csp.mjs --write`.
- Only `src/css/tokens.css` may contain colour literals; everything else uses `var(--…)`.
- Commit after each task or logical group; stop at any gate to validate.
