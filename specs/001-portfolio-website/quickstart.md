# Quickstart & Validation Guide: Personal Portfolio Website

**Feature**: `specs/001-portfolio-website` | **Plan**: [plan.md](plan.md)

How to run the site locally and prove it meets the spec. Commands become available once
Implementation Phase 1 has created `package.json` and the tool configs.

## Prerequisites

- Node.js 24 LTS and npm (development only — nothing Node-related ships to visitors)
- Git, with the repository initialised and work on branch `001-portfolio-website`
- Playwright browsers: `npx playwright install --with-deps chromium firefox webkit`
- For manual checks: NVDA (Windows) and an iPhone with VoiceOver, or equivalents

## Setup and run

```bash
npm ci
```

```bash
npm start
```

`npm start` serves `src/` as-is at `http://localhost:8080` (no build needed — constitution
Principle VI). `npm run preview` builds and serves `dist/` at `http://localhost:8081`, the exact
files that deploy.

## Validation commands

| Command | Checks | Must report |
|---|---|---|
| `npm run format:check` | Prettier | no files changed |
| `npm run lint` | ESLint + Stylelint + html-validate | 0 errors, 0 warnings |
| `npm run check:static` | CSP hash, site URL consistency, `CONTENT:` placeholder count, budgets (after build) | all pass; placeholder count reported (must be 0 before launch) |
| `npm run test:unit` | `node --test tests/unit` | all pass |
| `npm run build` | bundle/minify CSS, cache-bust, copy to `dist/` | exits 0; size table printed |
| `npm run test:e2e` | Playwright on `dist/`, Chromium + Firefox + WebKit | all pass, 0 console errors |
| `npm run test:lighthouse` | Lighthouse CI (mobile) on `dist/` | Perf ≥ 95, A11y = 100, BP ≥ 95, SEO ≥ 95; LCP ≤ 2.0s; CLS ≤ 0.05; TBT ≤ 200ms |
| `npm run check:links` | linkinator on `dist/` (skips LinkedIn and the site's own origin, which only exists after deploy) | 0 broken links |
| `npm run verify` | all of the above in order | exit 0 — this is the CI gate |

## Scenario walkthroughs

Automated specs live in `tests/e2e/`; the steps below are the human-readable equivalents used
for manual confirmation at each phase gate. Details of expected markup are in
[contracts/](contracts/), entity rules in [data-model.md](data-model.md).

### US1 — Meet Aseel and get in touch

1. Emulate 375 × 667. Load `/`. **Expect**: "Hi, I'm Aseel." and the full statement visible
   without scrolling, and no links or buttons in the hero (SC-001, FR-005).
2. Open the menu and choose Contact. **Expect**: Contact is reached in 2 interactions.
3. At Contact, **Expect**: the text says LinkedIn is the best and primary way to reach
   out; "Connect on LinkedIn" is the first, primary button and "GitHub profile" the second; no
   email address, email link, or copy button anywhere on the page.

### US2 — Review background and experience

1. Read the intro. **Expect**: greeting, statement, then the biography (spec FR-008) verbatim, both degrees with
   status, skills in four tiers (Languages; Frameworks & Security; Cloud & DevOps; Quality &
   Methodology) — 1 column on phones, 2 on tablets, 4 on wide desktops.
2. Scroll to Experience. **Expect**: one narrative paragraph (spec FR-011) verbatim, at a
   comfortable reading width with a drop cap and amber rule; no timeline, roles, dates, or
   employer name; no animation.

### US3 — Explore projects *(removed 2026-09-30)*

No Projects section; code is reached through "GitHub profile" in Contact.

### US5 — Get to know Aseel beyond work

1. Choose "Interests" in the navigation. **Expect**: the heading lands just below the bar and
   "Interests" is marked as the current link.
2. **Expect**: five items in order — Cooking, Reading Books, Weightlifting, Cycling, Skiing —
   each with an amber icon; 1 column at 320px, 2 at 375px, all 5 in a row on desktop; nothing
   animates or reacts to hover.
3. **Screen reader** (NVDA + Firefox, VoiceOver iOS): the section is announced as "Interests",
   then "list, 5 items"; each item is read by its label only — icons are silent; no item is
   announced as a link or button.

### US4 — Navigate and choose a theme

1. From any scroll position, choose each nav link. **Expect**: smooth scroll (instant with
   reduced motion), heading fully below the bar, focus on the section, current link marked.
2. At 375px: open Menu, press Escape. **Expect**: menu closes, focus back on Menu button.
3. With device set to dark, first visit. **Expect**: dark theme with no light flash.
4. Toggle to light, reload. **Expect**: light persists; toggle announces "not pressed".

### Edge cases

| Scenario | How | Expect |
|---|---|---|
| Scripting off | Playwright `javaScriptEnabled: false`, or browser setting | All content and links present; theme follows device; theme toggle and Menu button hidden |
| Storage blocked | Private window with storage disabled / e2e stub that throws | Toggle works for the visit; no console errors |
| Device theme changes | Switch OS/emulated scheme with no saved choice | Page follows; with a saved choice it doesn't |
| 320px & 400% zoom | 1280px window at 400% zoom (= 320 CSS px) | No horizontal scroll; long words and URLs wrap |
| 2560px | Wide viewport | Content centred at comfortable width |
| Deep link | Open `/#experience` directly | Heading visible below bar; narrative visible |
| Keyboard under bar | Tab through whole page | Focused element never hidden by the bar |
| Print | Print preview | Light scheme, legible, link URLs shown |

## Manual gates (recorded in the PR description)

- **Screen reader smoke test**: NVDA + Firefox and VoiceOver on iOS — landmarks, headings,
  toggle state, menu state, Experience narrative read as one paragraph,
  Interests read as a list of five items with silent icons.
- **Visual review**: screenshots at 320, 375, 768, 1024, 1440, 2560 in light and dark.
- **Privacy review (FR-015, SC-009)**: reviewer confirms every word inside `#experience` (and
  the whole page) contains no internal application or system names, architecture descriptions,
  proprietary tools, team or department names, client information, or non-public metrics.
  Record reviewer, date, and result.
- **Usability check (SC-002)**: 5 participants, two tasks (open LinkedIn to get in touch; open GitHub). Pass =
  ≥ 4 complete each task in ≤ 30s.

## Content inputs (must be complete before first deploy)

`npm run check:static` reports the remaining `CONTENT:` markers.

- [x] ~~Role start/end months~~ — no longer needed (timeline removed 2026-09-30)
- [x] GitHub profile URL — `https://github.com/aseelalmanahy` (2026-09-30)
- [x] LinkedIn profile URL — `https://www.linkedin.com/in/aseel-almanahy-97342b109/` (2026-09-30)
- [x] ~~Public email address~~ — no longer needed: email removed 2026-09-30; LinkedIn is the primary contact
- [x] About Me introduction approved (spec FR-008, 2026-09-30)
- [x] Site URL / repository name — `aseelalmanahy.github.io` → `https://aseelalmanahy.github.io/` (2026-09-30); confirm
  before the GitHub repository is created (T094); the name sets the 404 `<base href>`

## Launch checklist

- [ ] `npm run verify` passes locally and in CI
- [ ] All manual gates recorded
- [ ] Content inputs complete (0 `CONTENT:` markers)
- [ ] GitHub Pages source = GitHub Actions; "Enforce HTTPS" enabled
- [ ] Live URL spot-check on a real phone in both themes
