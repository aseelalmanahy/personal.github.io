# Implementation Gates: Personal Portfolio Website

**Purpose**: Evidence log for the validation gates defined in [plan.md](../plan.md#implementation-phases)
(V-criteria per phase, gates G1–G16, success criteria, manual gates).
**Feature**: [spec.md](../spec.md) · **Tasks**: [tasks.md](../tasks.md)

Result values: PASS · FAIL · PENDING · N/A (with reason).

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
| V2.1 | Stylelint 0; no colour literal outside tokens.css | PENDING | | |
| V2.2 | axe 0 violations light + dark | PENDING | | |
| V2.3 | contrast.test.js | PENDING | | |
| V2.4 | SC-001 hero above the fold at 375×667 | PENDING | | |
| V2.5 | No theme flash | PENDING | | |
| V2.6 | Focus outlines ≥ 2px; targets ≥ 44×44 | PENDING | | |
| V2.7 | No overflow at 320px | PENDING | | |
| V2.8 | Load CLS ≤ 0.05 | PENDING | | |
| V2.9 | Manual visual review (375, 1440, both themes) | PENDING | | |

## Phase 3 — Mobile-First Responsive Grid & Timeline Styles

| ID | Criterion | Result | Evidence | Date |
|---|---|---|---|---|
| V3.1 | SC-004 viewport matrix, both themes, 3 engines | PENDING | | |
| V3.2 | 400% zoom / 200% font size | PENDING | | |
| V3.3 | projects.spec | PENDING | | |
| V3.4 | Timeline layout, labels, marker shapes, highlight parity | PENDING | | |
| V3.5 | Nav height and layouts | PENDING | | |
| V3.6 | FR-023a headings/focus never under the bar | PENDING | | |
| V3.7 | axe at 375 & 1024, both themes | PENDING | | |
| V3.8 | Print emulation | PENDING | | |
| V3.9 | Manual screenshot matrix | PENDING | | |

## Phase 4 — Vanilla JS Modules

| ID | Criterion | Result | Evidence | Date |
|---|---|---|---|---|
| V4.1 | ESLint 0; unit tests pass | PENDING | | |
| V4.2 | Theme toggle e2e (SC-008) | PENDING | | |
| V4.3 | Theme motion / reduced motion | PENDING | | |
| V4.4 | Copy email e2e | PENDING | | |
| V4.5 | Menu e2e | PENDING | | |
| V4.6 | Keyboard walkthrough (SC-006 automated) | PENDING | | |
| V4.7 | 0 console errors / CSP violations | PENDING | | |
| V4.8 | JS ≤ 30 KB compressed | PENDING | | |
| V4.9 | Manual screen-reader announcements | PENDING | | |

## Phase 5 — Scroll Animations & Performance

| ID | Criterion | Result | Evidence | Date |
|---|---|---|---|---|
| V5.1 | Reveal e2e | PENDING | | |
| V5.2 | Scroll-spy | PENDING | | |
| V5.3 | Smooth scroll | PENDING | | |
| V5.4 | One render-blocking stylesheet; `?v=` URLs; CSP on dist | PENDING | | |
| V5.5 | Budgets + Lighthouse thresholds (SC-005) | PENDING | | |
| V5.6 | 0 broken links (SC-010) | PENDING | | |
| V5.7 | Share preview metadata + 1200×630 image | PENDING | | |
| V5.8 | 0 `CONTENT:` markers | PENDING | | |
| V5.9 | CI verify → deploy wiring | PENDING | | |
| V5.10 | Final SC table + manual gates | PENDING | | |

## Gates G1–G16 (cumulative)

| Gate | Rule | Result | Evidence |
|---|---|---|---|
| G1 | spec.md unchanged below header | PENDING | |
| G2 | Everything traces to an FR/US | PENDING | |
| G3 | Plain-language visitor text, no dev artefacts | PENDING | |
| G4 | All sections complete | PENDING | |
| G5 | No unresolved decisions; 0 `CONTENT:` at launch | PENDING | |
| G6 | Each FR has a passing check | PENDING | |
| G7 | SCs measured with numbers | PENDING | |
| G8 | SCs verified in real browsers | PENDING | |
| G9 | Acceptance scenarios automated | PENDING | |
| G10 | Edge cases automated | PENDING | |
| G11 | Scope bounded (no forms, résumé, 3rd-party) | PENDING | |
| G12 | Deps justified; runtime deps zero | PENDING | |
| G13 | FR rows ticked with evidence | PENDING | |
| G14 | Primary flows demonstrable | PENDING | |
| G15 | SC-001–SC-010 met | PENDING | |
| G16 | No internal/implementation details leak onto the page | PENDING | |

## Success Criteria

| SC | Result | Evidence |
|---|---|---|
| SC-001 | PENDING | |
| SC-002 | PENDING | Usability check (manual) |
| SC-003 | PENDING | |
| SC-004 | PENDING | |
| SC-005 | PENDING | |
| SC-006 | PENDING | |
| SC-007 | PENDING | |
| SC-008 | PENDING | |
| SC-009 | PENDING | Privacy review (manual) |
| SC-010 | PENDING | |

## Manual gates

| Gate | Result | Reviewer | Date | Notes |
|---|---|---|---|---|
| Screen-reader smoke test (NVDA + Firefox; VoiceOver iOS) | PENDING | | | |
| Visual review (6 widths × 2 themes) | PENDING | | | |
| Privacy review (FR-015, SC-009) | PENDING | | | |
| Usability check (SC-002, 5 participants) | PENDING | | | |
| JS-disabled walkthrough & print preview | PENDING | | | |
