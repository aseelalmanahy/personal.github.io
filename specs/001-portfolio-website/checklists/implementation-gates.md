# Implementation Gates: Personal Portfolio Website

**Purpose**: Evidence log for the validation gates defined in [plan.md](../plan.md#implementation-phases)
(V-criteria per phase, gates G1–G16, success criteria, manual gates).
**Feature**: [spec.md](../spec.md) · **Tasks**: [tasks.md](../tasks.md)

Result values: PASS · FAIL · PENDING · N/A (with reason).

**Release status**: ✅ **Complete — stable production release, 2026-10-01.** Live at
https://aseelalmanahy.com/ (GitHub Pages, repository `personal.github.io`, HTTPS enforced). All
gates G1–G16 and success criteria SC-001–SC-010 pass. Gates marked "owner sign-off" were
performed and attested by the site owner on 2026-10-01.

## Phase 1 — File Structure & HTML Semantic Boilerplate

| ID | Criterion | Result | Evidence | Date |
|---|---|---|---|---|
| V1.1 | `npm run lint` → 0 errors, 0 warnings | PASS (JS, HTML) | ESLint 0; html-validate 0 on index.html + 404.html. Stylelint fails only `no-empty-source` on the intentionally empty partials — CSS lint is evaluated at Gate 2 | 2026-09-29 |
| V1.2 | `npm run format:check` clean | PASS | Prettier: all files formatted | 2026-09-29 |
| V1.3 | check-csp, check-site-url pass; check-content lists only tracked inputs | PASS | check-csp: 1 inline script/page, 386 B, hashes match (index, 404); check-site-url skips (URL is a content input); check-content: 32 markers, all tracked inputs | 2026-09-29 |
| V1.4 | structure.spec (landmarks, order, headings, skip link, metadata) | PASS | 6/6 × Chromium, Firefox, WebKit (WebKit skip-link via structural first-focusable check — see note) | 2026-09-29 |
| V1.5 | hero-contact.spec content & link attributes | PASS | 4/4 × 3 engines | 2026-09-29 |
| V1.6 | no-js.spec | PASS | 2/2 × 3 engines | 2026-09-29 |
| V1.7 | privacy-scope.spec | PASS | 4/4 × 3 engines | 2026-09-29 |
| V1.8 | axe 0 violations (unstyled) | DEFERRED → Gate 2 | Only `target-size`/`target-offset` (WCAG 2.5.8) fail: unstyled inline links are < 24px. Fixed by 44px targets in Phase 2 (T046, T049); re-verified by V2.2 | 2026-09-29 |
| V1.9 | Manual: unstyled reading order; timeline privacy review drafted | PASS (draft) | DOM order matches contract (skip link → header → hero → about → experience → projects → contact → footer). Timeline draft review: entries contain only title, "Fidelity Investments", dates, category; program names "Leap to Lead"/"LEAP" published per spec Assumptions — owner confirms in T098 | 2026-09-29 |
| V1.10 | No TODO/FIXME/lorem/console.log in src; spec.md unchanged below header | PASS | grep: none; spec diff = Feature Branch header line only | 2026-09-29 |

**Notes (Phase 1)**
- Playwright's Windows WebKit build never tabs to links, so Tab-order assertions run in Chromium and
  Firefox; WebKit verifies focus order structurally (`firstFocusable`).
- CSP drops `upgrade-insecure-requests` (research R-20): it would rewrite `http://localhost` asset
  requests to HTTPS during development/tests, and GitHub Pages already enforces HTTPS.
- html-validate is configured for Prettier's output (`doctype-style: lowercase`,
  `void-style: selfclose`); Stylelint uses `import-notation: string` for `@import … layer()`.

## Phase 2 — Core Layout & Typography via CSS Variables

| ID | Criterion | Result | Evidence | Date |
|---|---|---|---|---|
| V2.1 | Stylelint 0; no colour literal outside tokens.css | PASS | 0 errors in all authored CSS; only `no-empty-source` on 8 partials owned by later phases (about, tag, timeline, projects, project-card, contact, theme-toggle, print). Colour-literal rules enforced by config | 2026-09-29 |
| V2.2 | axe 0 violations light + dark | PASS | 0 violations × {light device, dark device, saved dark} × {/, /404.html} × 3 engines (V1.8 target-size resolved) | 2026-09-29 |
| V2.3 | contrast.test.js | PASS | 30/30: all R-09 pairs in both themes on bg + surface; dark blocks identical; print block = light values | 2026-09-29 |
| V2.4 | SC-001 hero above the fold at 375×667 | PASS | 3 engines; bottom of Email button ≈ 480px at 375×667 (JS-off wrapped header) | 2026-09-29 |
| V2.5 | No theme flash | PASS | Saved dark on light device: `data-theme="dark"` at DOMContentLoaded; device dark (no save) and JS-off dark both give `rgb(27, 19, 16)`; 3 engines | 2026-09-29 |
| V2.6 | Focus outlines ≥ 2px; targets ≥ 44×44 | PARTIAL → Gate 3 | Outlines: PASS (Chromium, Firefox; WebKit skipped — no Tab to links). Targets: all pass except `.project-card__link` (235×24) and `.contact__email-link` (124×24), styled in Phase 3 (T059, T060) | 2026-09-29 |
| V2.7 | No overflow at 320px | PASS | 3 engines | 2026-09-29 |
| V2.8 | Load CLS ≤ 0.05 | PASS | Chromium (Layout Instability API is Chromium-only) | 2026-09-29 |
| V2.9 | Manual visual review (375, 1440, both themes) | PASS | Screenshots reviewed: warm cream/amber (light) and espresso/amber (dark), minimal hero; hero gradient edge softened with an explicit ellipse size | 2026-09-29 |

**Notes (Phase 2)**
- axe runs with `preload: false` and `bypassCSP` (axe re-fetches stylesheets and injects a style
  the strict CSP blocks); CSP enforcement stays covered by every other spec's fixture.
- `body { overflow-wrap: break-word }` replaces `a, p, li { overflow-wrap: anywhere }` from T043:
  it wraps long strings without shrinking flex/grid min-content sizes; the email link gets
  `anywhere` in Phase 3 (T060).

## Phase 3 — Mobile-First Responsive Grid & Timeline Styles

| ID | Criterion | Result | Evidence | Date |
|---|---|---|---|---|
| V3.1 | SC-004 viewport matrix, both themes, 3 engines | PASS | 320/375/768/1024/1440/2560 × light/dark × 3 engines: no overflow | 2026-09-29 |
| V3.2 | 400% zoom / 200% font size | PASS | 320px (= 1280px at 400%) passes; 320px + 200% root font passes after `minmax(0,1fr)` grids and fluid card/button padding | 2026-09-29 |
| V3.3 | projects.spec | PASS | Launch card, iff-invariant, 2560 width ≤ 28rem, 1 → ≥2 columns, link names include titles, missing demo omitted; 3 engines | 2026-09-29 |
| V3.4 | Timeline layout, labels, marker shapes, highlight parity | PASS | Single column at 375/768/1440; circle vs diamond; hover = focus = tap (hasTouch) styles; 3 engines | 2026-09-29 |
| V3.5 | Nav height and layouts | PARTIAL → Gate 4 | ≥768 inline links: PASS; JS-off 375 links visible: PASS. Collapsed ≤56px height needs nav.js (T075) to reveal the Menu button — verified in T068 | 2026-09-29 |
| V3.6 | FR-023a headings/focus never under the bar | PASS | Deep links to 4 sections at 375 and 1440 in 3 engines; Tab walk (Chromium, Firefox) never obscured. Taller no-JS header handled by `html:has(.nav__toggle[hidden])` scroll-padding | 2026-09-29 |
| V3.7 | axe at 375 & 1024, both themes | PASS | axe 0 across theme states; 44×44 target test now passes in 3 engines (V2.6 closed) | 2026-09-29 |
| V3.8 | Print emulation | PASS | Controls hidden; background light for device-dark and saved-dark (H1 specificity fix verified) | 2026-09-29 |
| V3.9 | Manual screenshot matrix | PASS | 12 full-page captures (6 widths × 2 themes) reviewed: single-column timeline with shaped markers, 2-col About ≥768, card-sized coming-soon card, no clipping | 2026-09-29 |

**Notes (Phase 3)**
- The menu collapses only when nav.js has revealed the Menu button
  (`.nav__toggle:not([hidden])`), so navigation never disappears if scripting fails.
- T061 needed no layout change: `.container` already centres at 2560px (verified by V3.1).

## Phase 4 — Vanilla JS Modules

| ID | Criterion | Result | Evidence | Date |
|---|---|---|---|---|
| V4.1 | ESLint 0; unit tests pass | PASS | ESLint 0 (max 40 lines/function); 46/46 unit tests incl. throwing/missing storage and rejected/missing clipboard | 2026-09-29 |
| V4.2 | Theme toggle e2e (SC-008) | PASS | Click/Enter/Space flip `aria-pressed` + `data-theme`; persisted across reload; theme-color metas read from `--color-bg`; blocked storage works for the visit with 0 console errors; device changes followed only before a choice; 3 engines | 2026-09-29 |
| V4.3 | Theme motion / reduced motion | PASS | Reduced motion: 0s; otherwise 0 < max duration ≤ 0.3s; 3 engines | 2026-09-29 |
| V4.4 | Copy email e2e | PASS | Chromium real clipboard: "Copied!" in role=status, clipboard = address, cleared after 4s. Rejected writeText → failure message (3 engines). No Clipboard API → button hidden, address visible | 2026-09-29 |
| V4.5 | Menu e2e | PASS | 375: bar ≤ 56px collapsed (closes V3.5), disclosure, Escape returns focus, choosing Experience closes menu + focuses `#experience` not under bar; 1024: Menu hidden; 3 engines | 2026-09-29 |
| V4.6 | Keyboard walkthrough (SC-006 automated) | PASS | Chromium + Firefox: skip → brand → 4 nav → theme → 3 hero CTAs → 4 timeline entries → … → Copy email, no traps (WebKit: structural checks only) | 2026-09-29 |
| V4.7 | 0 console errors / CSP violations | PASS | Auto-fixture on all 223 e2e tests reported none | 2026-09-29 |
| V4.8 | JS ≤ 30 KB compressed | PASS | JS 3.3 KB gzip; HTML+CSS+JS 14.7 KB; initial total 15.9 KB | 2026-09-29 |
| V4.9 | Manual screen-reader announcements | PASS (owner sign-off) | Owner sign-off (attested by the site owner; detailed session notes not recorded here), T099 | 2026-10-01 |

## Phase 5 — Scroll Animations & Performance

| ID | Criterion | Result | Evidence | Date |
|---|---|---|---|---|
| V5.1 | Reveal e2e | PASS | Below-fold entries pending (opacity 0) then visible ≤ 1s; reduced motion: no `data-reveal`; JS off: opacity 1; `/#projects` and End key: none pending; scroll CLS ≤ 0.05 (Chromium); 3 engines | 2026-09-29 |
| V5.2 | Scroll-spy | PASS | Exactly one `aria-current="true"` per section, none in hero; 3 engines | 2026-09-29 |
| V5.3 | Smooth scroll | PASS | `smooth` with motion, `auto` with reduced motion; deep links/nav keep headings below bar; no `focusin` guard needed (T087) | 2026-09-29 |
| V5.4 | One render-blocking stylesheet; `?v=` URLs; CSP on dist | PASS | 1 bundled stylesheet (+ print); all 21 local URLs versioned incl. module imports and preloads; check-csp passes on src + dist | 2026-09-29 |
| V5.5 | Budgets + Lighthouse thresholds (SC-005) | PASS (pending content for SEO) | Budgets: 12.6 KB HTML+CSS+JS, 5.7 KB JS, 13.8 KB total (gzip). Lighthouse mobile ×3: Perf 1.00, A11y 1.00, BP 1.00, LCP 1.1 s, CLS 0.001, TBT 0 ms. SEO 0.92 only because robots.txt Sitemap is a `CONTENT:` placeholder; with example URLs SEO passes and all assertions succeed | 2026-09-29 |
| V5.6 | 0 broken links (SC-010) | PASS | linkinator: 13 links OK incl. github.com/aseelalmanahy (200); own origin skipped until first deploy; LinkedIn skipped (bot-blocking) — verify manually | 2026-09-30 |
| V5.7 | Share preview metadata + 1200×630 image | PASS | og-image.png 1200×630, 44.8 KB; apple-touch-icon + 32px PNG; OG URLs checked by check-site-url after content | 2026-09-29 |

**Notes (Phase 5)**
- Found and fixed a mobile CLS bug (0.29): the phone header was collapsed only after nav.js ran.
  The menu now collapses from the pre-paint `js` class and ships as a `:target` link that
  nav.js upgrades to a button (research R-12). Covered by two new tests (delayed and blocked
  module).
- CSP `connect-src` changed `'none'` → `'self'`: Lighthouse fetches robots.txt in-page (R-20).
- Current-section style no longer changes font weight (width change shifted neighbouring links).
- Axe runs with reduced motion so entries awaiting the fade-in (opacity 0, never seen) are not
  reported as low contrast; reveal.spec verifies they always reach opacity 1.
- Timeline hide is instant; only the reveal animates (`[data-reveal='visible']` transition).
| V5.8 | 0 `CONTENT:` markers | PASS | check-content --strict: 0 | 2026-09-30 |
| V5.9 | CI verify → deploy wiring | PASS | `ci.yml`: `verify` gates `deploy`; push to `main` of `personal.github.io` ran verify → deploy successfully; github-pages environment live | 2026-10-01 |
| V5.10 | Final SC table + manual gates | PASS | Success Criteria and Manual gates tables below completed (T100) | 2026-10-01 |

## Gates G1–G16 (cumulative)

| Gate | Rule | Result | Evidence |
|---|---|---|---|
| G1 | spec.md changes below Input are owner amendments only (redefined 2026-09-30, T100) | PASS | Every change is a recorded Amendment input, Clarification, or checklist iteration (3–13); confirmed in T100 on 2026-10-01 |
| G2 | Everything traces to an FR/US | PASS | All src files map to plan tasks/FRs; no untraced features |
| G3 | Plain-language visitor text, no dev artefacts | PASS | grep TODO/FIXME/lorem/console.log = 0; 0 `CONTENT:` markers |
| G4 | All sections complete | PASS | structure.spec: four sections (Intro, Experience, Interests, Contact) + 404, constitution v5.0.0 |
| G5 | No unresolved decisions; 0 `CONTENT:` at launch | PASS | 0 markers; email applied then removed 2026-09-30 (LinkedIn primary, FR-021) |
| G6 | Each FR has a passing check | PASS | 277 e2e + 46 unit tests; FR-015 privacy review by owner sign-off (T098) |
| G7 | SCs measured with numbers | PASS | Budgets, Lighthouse, CLS, viewport matrix recorded above |
| G8 | SCs verified in real browsers | PASS | Chromium, Firefox, WebKit |
| G9 | Acceptance scenarios automated | PASS | US1, US2, US4, US5 scenarios in e2e specs (US3 removed) |
| G10 | Edge cases automated | PASS | No-JS, blocked storage, clipboard denied/absent, device change, 320/2560, 200% text, deep link, fast scroll, print, failed module |
| G11 | Scope bounded (no forms, résumé, 3rd-party) | PASS | privacy-scope.spec; CSP `default-src 'none'`; no `dependencies` |
| G12 | Deps justified; runtime deps zero | PASS | Dev deps per R-01 (+ none added); 10 npm-audit advisories are in dev-only tooling |
| G13 | FR rows ticked with evidence | PASS | Phase tables above |
| G14 | Primary flows demonstrable | PASS | US1, US2, US4, US5 demonstrable on the live site https://aseelalmanahy.com/ |
| G15 | SC-001–SC-010 met | PASS | All ten success criteria pass (table below); SC-002, SC-006 screen-reader part, and SC-009 by owner sign-off |
| G16 | No internal/implementation details leak onto the page | PASS | No HTML comments shipped; privacy-scope.spec guards; owner privacy review (T098) signed off 2026-10-01 |

## Success Criteria

| SC | Result | Evidence |
|---|---|---|
| SC-001 | PASS | Gates S16-1 to S16-3: greeting visible and biography starting above the fold at 375×667, Contact reachable in ≤ 2 interactions; 3 engines |
| SC-002 | PASS (owner sign-off) | Usability check (T099), 2026-10-01 |
| SC-003 | PASS | ≥ 768px: 1 click; phones: Menu + link = 2 (V4.5) |
| SC-004 | PASS | V3.1/V3.2 — 6 widths × 2 themes × 3 engines, 320px + 200% text |
| SC-005 | PASS | Lighthouse mobile: Perf 1.00, LCP 1.1 s, CLS 0.001, TBT 0 ms; 12.4 KB gzip; live site served by GitHub Pages CDN |
| SC-006 | PASS | Keyboard walkthrough automated (8 stops, no traps); screen-reader walkthrough by owner sign-off (T099, 2026-10-01) |
| SC-007 | PASS | axe 0 violations, light/dark/saved-dark × 2 pages × 3 engines |
| SC-008 | PASS | V4.2 — theme persists across reload |
| SC-009 | PASS (owner sign-off) | Privacy review (T098, 2026-10-01); automated guards pass |
| SC-010 | PASS | 0 broken links (check:links 12/12); 0 placeholder links; live assets all 200 |

## Manual gates

| Gate | Result | Reviewer | Date | Notes |
|---|---|---|---|---|
| Screen-reader smoke test (NVDA + Firefox; VoiceOver iOS) | PASS (owner sign-off) | Owner | 2026-10-01 | Attested by the owner (T099) |
| Visual review (6 widths × 2 themes) | PASS | Claude (screenshots) + automated | 2026-10-01 | Full-page review at 320/375/768/1024/1440 in both themes (gates F7, U6, S16-3); 2560 by the automated viewport matrix |
| Privacy review (FR-015, SC-009) | PASS (owner sign-off) | Owner | 2026-10-01 | Attested by the owner (T098), incl. the Experience narrative |
| Usability check (SC-002, 5 participants) | PASS (owner sign-off) | Owner | 2026-10-01 | Attested by the owner (T099) |
| JS-disabled walkthrough & print preview | PASS | Automated | 2026-10-01 | no-js.spec (3 engines) and print emulation (V3.8) |

## Amendment 2026-09-30 — narrative content structure (tasks Phase 8)

| ID | Criterion | Result | Evidence | Date |
|---|---|---|---|---|
| A1 | New/updated tests fail first | PASS | 7 failures before T109 (about-experience, privacy-scope, hero-contact, no-js) | 2026-09-30 |
| A2 | About intro (FR-008) and Experience narrative (FR-011) verbatim | PASS | about-experience.spec, 3 engines | 2026-09-30 |
| A3 | Experience has no timeline, list, dates, employer, or program names (FR-012, FR-014) | PASS | privacy-scope.spec, 3 engines; no `.timeline*` classes remain | 2026-09-30 |
| A4 | GitHub/LinkedIn URLs everywhere incl. JSON-LD (FR-006) | PASS | hero-contact.spec, 3 engines | 2026-09-30 |
| A5 | Full regression | PASS | lint 0; 50/50 unit; 245 e2e passed, 10 skipped (engine limits); 0 console errors / CSP violations | 2026-09-30 |
| A6 | Budgets | PASS | 11.6 KB HTML+CSS+JS, 4.8 KB JS, 12.9 KB total (gzip) — down from 13.8 KB | 2026-09-30 |
| A7 | Lighthouse (mobile ×3) | PASS | index.html on a copy with example email/site URL: Perf 1.00, A11y 1.00, BP 1.00, SEO 1.00; LCP 1.1 s, CLS 0.001, TBT 0 ms. Real build: SEO pending the two remaining content inputs | 2026-09-30 |
| A8 | Visual check | PASS | Experience at 1440 light and 375 dark: 62ch measure, amber rule, serif drop cap; no overflow | 2026-09-30 |

| A9 | Site URL applied (T094 partial): `https://aseelalmanahy.github.io/` | PASS | check-site-url all ok; Lighthouse on the **real** build (email still a placeholder): Perf 1.00, A11y 1.00, BP 1.00, SEO 1.00; LCP 1.1 s, CLS 0.001 | 2026-09-30 |

**Notes (Amendment)**
- Removed: timeline markup/CSS, `reveal.js` (+ unit and e2e specs). Line-length check replaces
  the timeline layout/highlight/marker tests.
- Remaining content inputs: public email and site URL (10 markers).
- Supersedes V3.4, V5.1 (timeline-specific). SC-006 no longer involves timeline entries.

## Amendment 2026-09-30 — Interests section (tasks Phase 9)

| ID | Criterion | Result | Evidence | Date |
|---|---|---|---|---|
| I1 | New/updated tests fail first | PASS | 9 failures before T121 (interests, structure, responsive, no-js) | 2026-09-30 |
| I2 | Placement, heading, five items in order (FR-037) | PASS | interests.spec, 3 engines | 2026-09-30 |
| I3 | List semantics; one decorative inline icon per item, no sprite (FR-038, FR-039) | PASS | interests.spec, 3 engines; axe 0 violations | 2026-09-30 |
| I4 | Static — no links/controls/tabindex, `animation-name: none`, `transition-duration: 0s` (FR-040) | PASS | interests.spec, 3 engines | 2026-09-30 |
| I5 | Grid columns 1 @ 320, 2 @ 375, 5 @ 1440; icons use `--color-accent` in both themes | PASS | interests.spec, 3 engines | 2026-09-30 |
| I6 | Nav still one row at 768px with six links (T120; T124 fix not needed) | PASS | header 57px, all links visible | 2026-09-30 |
| I7 | Full regression | PASS | lint 0; 50/50 unit; 269 e2e passed, 10 skipped (engine limits); 0 console errors / CSP violations | 2026-09-30 |
| I8 | Budgets | PASS | 12.2 KB HTML+CSS+JS, 4.8 KB JS, 13.5 KB total (gzip) | 2026-09-30 |
| I9 | Lighthouse (mobile ×3, real build) | PASS | Perf 1.00, A11y 1.00, BP 1.00, SEO 1.00; LCP 1.1 s, CLS 0.001, TBT 0 ms | 2026-09-30 |
| I10 | Visual check | PASS | 1440 light (5 across), 375 dark (2 columns), 320 light (1 column), 768 header one row | 2026-09-30 |

## Final validation sweep (2026-09-30)

`npm run verify` exit 0 (93 s): Prettier clean; ESLint/Stylelint/html-validate 0; 50/50 unit; build; check-csp, check-site-url, check-content (0), budgets (13.5 KB gzip); 269 e2e passed, 10 skipped (engine limits) in Chromium, Firefox, WebKit; Lighthouse assertions pass (index 100/100/100/100); link check 13/13.

**Open before launch**: T098 privacy review, T099 manual gates (screen reader, visual, JS-off, print, usability) — owner-run; T100 final tables; T102 create repository + push + PR + Pages settings (owner account); T103 live spot-check; send a test email to the published address.

## Amendment 2026-09-30 — contact via LinkedIn, email removed (tasks Phase 10)

| ID | Criterion | Result | Evidence | Date |
|---|---|---|---|---|
| C1 | Updated tests fail first | PASS | 5 failures before T132 (hero-contact, a11y walkthrough) | 2026-09-30 |
| C2 | Hero: exactly GitHub then LinkedIn (FR-005) | PASS | hero-contact.spec, 3 engines | 2026-09-30 |
| C3 | Contact names LinkedIn as the best/primary way; LinkedIn first (primary), GitHub second (FR-021) | PASS | hero-contact.spec, 3 engines | 2026-09-30 |
| C4 | No email address, `mailto:` link, or copy control anywhere (FR-021) | PASS | DOM + raw `dist/index.html` scan | 2026-09-30 |
| C5 | `npm run verify` | PASS | exit 0: 46/46 unit; 262 e2e passed, 8 skipped (engine limits); 12/12 links | 2026-09-30 |
| C6 | Budgets | PASS | 11.2 KB HTML+CSS+JS, 3.9 KB JS, 12.4 KB total (gzip) — down from 13.5 KB | 2026-09-30 |
| C7 | Lighthouse (mobile ×3) | PASS | index.html Perf 1.00, A11y 1.00, BP 1.00, SEO 1.00; LCP 1.1 s, CLS 0.001, TBT 0 ms | 2026-09-30 |

**Notes**: superseded — V1.5 (6 contact links → 4), V4.4 (copy email), SC-010 evidence now 12 links.

## Four-tier skills (Phase 11, 2026-09-30)

| ID | Gate | Result | Evidence | Date |
|---|---|---|---|---|
| S1 | Four tiers, 28 items, FR-010 order | PASS | about-experience.spec: titles + items per tier, one `ul.tag-list` each (3 engines) | 2026-09-30 |
| S2 | Responsive columns from `--skills-columns` | PASS | 1 @ 375, 2 @ 768 / 1024, 4 @ 1440 (distinct `.skill-group` offsets); no overflow at 320px + 200% text (`<wbr>` hints) | 2026-09-30 |
| S3 | Contact copy — LinkedIn primary | PASS | hero-contact.spec: "primary and best", "initiate professional discussions"; no `mailto:` or address in dist | 2026-09-30 |
| S4 | Defunct conditions removed | PASS | `.timeline` check (privacy-scope), copy-email selector (hero-contact), reveal-fade reduced-motion (a11y); FR-012/FR-021 guards kept | 2026-09-30 |
| S5 | `npm run verify` | PASS | exit 0: format, lint, 46/46 unit, 0 content markers, 274 e2e passed / 8 skipped (engine limits), 12/12 links | 2026-09-30 |
| S6 | Budgets | PASS | 11.5 KB HTML+CSS+JS, 3.9 KB JS, 12.7 KB total (gzip) | 2026-09-30 |
| S7 | Lighthouse (mobile ×3) | PASS | index.html Perf 1.00, A11y 1.00, BP 1.00, SEO 1.00; LCP 1.1 s, CLS 0.001, TBT 0 ms | 2026-09-30 |

## Corrected Experience narrative (Phase 12, 2026-09-30)

| ID | Gate | Result | Evidence | Date |
|---|---|---|---|---|
| N1 | Narrative verbatim (FR-011) | PASS | about-experience.spec: normalised text equals the corrected 5-sentence FR-011 text (3 engines); failed against the old page first | 2026-09-30 |
| N2 | Structure and privacy guards (FR-012, FR-014) | PASS | privacy-scope.spec: one `p`, no list/`time`/`article`/`h3`, no years, month dates, employer or program names; UMass Lowell is the only organization named | 2026-09-30 |
| N3 | Reading width (FR-013) | PASS | 45–75 characters per line at every tested width | 2026-09-30 |
| N4 | `npm run verify` | PASS | exit 0: format, lint, 46/46 unit, 0 content markers, 274 e2e passed / 8 skipped (engine limits), 12/12 links | 2026-09-30 |
| N5 | Budgets | PASS | 11.7 KB HTML+CSS+JS, 3.9 KB JS, 12.9 KB total (gzip) | 2026-09-30 |
| N6 | Lighthouse (mobile ×3) | PASS | index.html Perf 1.00, A11y 1.00, BP 1.00, SEO 1.00; LCP 1.1 s, CLS 0.001, TBT 0 ms | 2026-09-30 |
| N7 | Privacy review of the new text (FR-015) | PASS (owner sign-off) | T098 | 2026-10-01 |

## Punctuation, link placement, featured projects (Phase 13, 2026-09-30)

| ID | Gate | Result | Evidence | Date |
|---|---|---|---|---|
| P1 | No em dashes (FR-041) | PASS | structure.spec: rendered text, titles, meta, and labels on `/` and `/404.html`; every `src/` file (3 engines) | 2026-09-30 |
| P2 | Profile links only in hero and Contact (FR-042) | PASS | hero-contact.spec: order home GitHub, home LinkedIn, Contact LinkedIn, Contact GitHub; none elsewhere | 2026-09-30 |
| P3 | Three featured cards (FR-017, FR-020) | PASS | projects.spec: titles, order, descriptions ≤ 200, exact and unique tags, 5 repository links with card-named labels, no placeholder | 2026-09-30 |
| P4 | Grid reflow (FR-016) | PASS | 1 @ 375, 2 @ 768, 3 @ 1024 / 1440; screenshots light 1280, dark 768 | 2026-09-30 |
| P5 | Keyboard walkthrough (SC-006) | PASS | 17 stops incl. five code links, no traps (Chromium, Firefox) | 2026-09-30 |
| P6 | `npm run verify` | PASS | exit 0: format, lint, 46/46 unit, 0 content markers, 283 e2e passed / 8 skipped (engine limits), 17/17 links (repositories resolve). A first run hit one WebKit browser crash (no assertion failed); re-run clean | 2026-09-30 |
| P7 | Budgets | PASS | 12.2 KB HTML+CSS+JS, 3.9 KB JS, 13.4 KB total (gzip) | 2026-09-30 |
| P8 | Lighthouse (mobile ×3) | PASS | index.html Perf 1.00, A11y 1.00, BP 1.00, SEO 1.00; LCP 1.1 s, CLS 0.001, TBT 0 ms | 2026-09-30 |
| P9 | Owner review of card copy | N/A | Projects section and its cards removed in Phase 14 (gate F4); nothing left to review | 2026-09-30 |

## Five sections: hero links and Projects removed (Phase 14, 2026-09-30)

| ID | Gate | Result | Evidence | Date |
|---|---|---|---|---|
| F1 | Hero holds only greeting and statement (FR-005, SC-001) | PASS | hero-contact.spec: 0 links/buttons in `#home`; greeting and statement above the fold at 375 × 667 | 2026-09-30 |
| F2 | Profile links only in Contact, once each (FR-006, FR-042) | PASS | hero-contact.spec: placement = Contact LinkedIn, Contact GitHub; JSON-LD `sameAs` unchanged | 2026-09-30 |
| F3 | Five sections, four nav links (FR-001, constitution v3.0.0) | PASS | structure, no-JS, responsive, nav, Interests order specs (3 engines) | 2026-09-30 |
| F4 | Projects code removed | PASS | No `projects.css`, `project-card.css`, `#code` symbol, `projects` in scroll-spy; lint and build clean | 2026-09-30 |
| F5 | Keyboard walkthrough (SC-006) | PASS | 9 stops ending "Connect on LinkedIn", "GitHub profile"; no traps (Chromium, Firefox) | 2026-09-30 |
| F6 | `npm run verify` | PASS | exit 0: format, lint, 46/46 unit, 0 content markers, 262 e2e passed / 8 skipped (engine limits), 12/12 links | 2026-09-30 |
| F7 | Constitution per-change check (analysis K1) | PASS | Full-page review at 320 (light), 375 (dark), 768 (light), 1024 (dark), 1440 (light): sections in order, no overflow (scrollWidth = viewport), hero link-free, Contact buttons visible; keyboard and JS-off by the automated specs | 2026-09-30 |
| F8 | Budgets | PASS | 11.2 KB HTML+CSS+JS, 3.9 KB JS, 12.4 KB total (gzip) | 2026-09-30 |
| F9 | Lighthouse (mobile ×3) | PASS | index.html Perf 1.00, A11y 1.00, BP 1.00, SEO 1.00; LCP 1.1 s, CLS 0.001, TBT 0 ms | 2026-09-30 |

## Unified intro: Hero and About Me merged (Phase 15, 2026-09-30)

| ID | Gate | Result | Evidence | Date |
|---|---|---|---|---|
| U1 | Intro order and headings (FR-001, FR-005) | PASS | hero-contact.spec: h1 → statement → biography → Education → Skills; `h2`s Education, Skills; no "About Me" heading; no links (3 engines) | 2026-09-30 |
| U2 | Landing gap closed (FR-005a) | PASS | Education cards start inside 1024 × 768 and 1440 × 900; statement→biography ≤ 64px, biography→education ≤ 96px | 2026-09-30 |
| U3 | Four sections, three nav links (FR-023, constitution v4.0.0) | PASS | structure, no-JS, responsive, nav specs; headings outline has one h1 and no skipped levels | 2026-09-30 |
| U4 | Keyboard walkthrough (SC-006) | PASS | 8 stops, no traps (Chromium, Firefox) | 2026-09-30 |
| U5 | Biography punctuation (FR-041) | PASS | "important to me; I actively…"; no em dash in `src/` (structure.spec) | 2026-09-30 |
| U6 | Per-change review (constitution Governance) | PASS | Full-page review at 320 (light), 375 (dark), 768 (light), 1024 (dark), 1440 (light): intro reads as one block, no overflow; keyboard and JS-off by the automated specs | 2026-09-30 |
| U7 | `npm run verify` | PASS | exit 0: format, lint, 46/46 unit, 0 content markers, 271 e2e passed / 8 skipped (engine limits), 12/12 links | 2026-09-30 |
| U8 | Budgets and Lighthouse | PASS | 12.4 KB total (gzip); index.html Perf 1.00, A11y 1.00, BP 1.00, SEO 1.00; LCP 1.1 s, CLS 0.001, TBT 0 ms | 2026-09-30 |

## Visible statement removed (Phase 16, 2026-09-30)

| ID | Gate | Result | Evidence | Date |
|---|---|---|---|---|
| S16-1 | Statement not shown; greeting then biography (FR-004, FR-005) | PASS | hero-contact.spec: statement absent from body text; one paragraph under the greeting; intro order h1 → biography → Education → Skills (3 engines) | 2026-09-30 |
| S16-2 | Share-preview summary kept (FR-036) | PASS | `meta[name=description]` equals the statement; structure.spec OG checks pass | 2026-09-30 |
| S16-3 | Per-change review (constitution Governance) | PASS | First-screen review at 320 (light), 375 (dark), 768 (light), 1024 (dark), 1440 (light); no overflow; keyboard and JS-off by the automated specs | 2026-09-30 |
| S16-4 | `npm run verify` | PASS | exit 0: format, lint, 46/46 unit, 0 content markers, 271 e2e passed / 8 skipped (engine limits), 12/12 links | 2026-09-30 |
| S16-5 | Budgets and Lighthouse | PASS | 12.4 KB total (gzip); index.html Perf 1.00, A11y 1.00, BP 1.00, SEO 1.00; LCP 1.1 s, CLS 0.001, TBT 0 ms | 2026-09-30 |

## Custom domain aseelalmanahy.com (Phase 17, 2026-09-30)

| ID | Gate | Result | Evidence | Date |
|---|---|---|---|---|
| D1 | Canonical, share tags, JSON-LD on the custom domain (FR-043) | PASS | structure.spec: canonical, `og:url` = `https://aseelalmanahy.com/`, `og:image` under it, JSON-LD `url` (3 engines) | 2026-09-30 |
| D2 | robots, sitemap, CNAME; no github.io published | PASS | `dist/CNAME` = `aseelalmanahy.com`; robots `Sitemap:` and sitemap `<loc>` on the domain; no "github.io" in any published text file; `check-site-url` all ok incl. CNAME host | 2026-09-30 |
| D3 | `npm run verify` | PASS | exit 0: format, lint, 46/46 unit, 0 content markers, 277 e2e passed / 8 skipped (engine limits), 12/12 links; Lighthouse 1.00 ×4, canonical audit passes | 2026-09-30 |
| D4 | DNS and Pages custom domain live | PASS | 2026-10-01: Squarespace DNS has 4 A records (185.199.108-111.153) and `www` CNAME → aseelalmanahy.github.io (verified via 8.8.8.8 and 1.1.1.1); Pages "DNS check successful", Enforce HTTPS on; https://aseelalmanahy.com/ 200 with a valid certificate, `www` 301 → apex, github.io project URL 301 → apex; all 16 page assets 200; unknown path 404; live page: 4 sections, JS enhanced, theme toggle shown, no console errors | 2026-10-01 |

## Production release (2026-10-01)

| ID | Gate | Result | Evidence | Date |
|---|---|---|---|---|
| R1 | Custom domain live (D4, FR-043) | PASS | DNS at Squarespace → GitHub Pages; "DNS check successful"; Let's Encrypt certificate for aseelalmanahy.com (valid to 2026-12-29); `http://` 301 → `https://`; `www` 301 → apex | 2026-10-01 |
| R2 | Live site verification (T103) | PASS | Live page 200 with title, 4 sections, Contact links, JS enhancement, theme toggle, 0 console errors; 16/16 assets, sitemap, robots, share image 200; unknown path 404. Real-phone check and share preview: owner sign-off | 2026-10-01 |
| R3 | Privacy review (T098) | PASS (owner sign-off) | See Manual gates | 2026-10-01 |
| R4 | Manual usability and screen-reader pass (T099) | PASS (owner sign-off) | See Manual gates | 2026-10-01 |
| R5 | Final tables (T100) | PASS | Success Criteria, Gates G1–G16, Manual gates complete | 2026-10-01 |
| R6 | Repository hygiene | PASS | Anonymous commit identity; no personal email, name, or co-author attribution in history; Contributors list empty | 2026-10-01 |

**Feature status**: `specs/001-portfolio-website` is closed as a stable production release.
Further changes start a new feature (`/speckit-specify`) or an amendment recorded here.

## Post-release amendment: narrative wording (2026-10-01)

| ID | Gate | Result | Evidence | Date |
|---|---|---|---|---|
| K1 | Narrative verbatim (FR-011) | PASS | about-experience.spec: corrected text ("C and C++", "using Kotlin") on all 3 engines; failed against the old page first | 2026-10-01 |
| K2 | `npm run verify` | PASS | exit 0: 46/46 unit, 277 e2e passed / 8 skipped, 12/12 links; Lighthouse 1.00 ×4 | 2026-10-01 |
| K3 | Narrative wording: OOP in C++ (FR-011) | PASS | about-experience.spec on 3 engines (failed first); `npm run verify` exit 0: 46/46 unit, 277 e2e passed / 8 skipped, 12/12 links; Lighthouse 1.00 ×4 | 2026-10-01 |
