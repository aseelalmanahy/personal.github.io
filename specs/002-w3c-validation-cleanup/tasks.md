# Tasks: W3C Validation Clean-up

**Feature**: [spec.md](spec.md) · **Plan**: [plan.md](plan.md)

## Phase 1: Tests first

- [X] T001 [US1] Add regression tests to `tests/e2e/structure.spec.js`: no HTML void element with a trailing slash in `dist/index.html` and `dist/404.html` (FR-001, FR-004); SVG self-closing shapes in dist equal those in src (FR-002); confirm the page tests fail before the change

## Phase 2: Implementation

- [X] T002 [US1] Add `stripVoidSlashes()` to `tools/build.mjs` and apply it to every published page in `versionHtml()` (FR-001, FR-003)
- [X] T003 Confirm `node tools/check-csp.mjs` still matches (CSP hash unchanged) and check the built pages with the W3C checker (0 errors, 0 trailing-slash notes)
- [X] T004 [US2] Record the two CSP warnings as permanent exceptions in `validation-exceptions.md`; reference it from `CLAUDE.md` (FR-005)

## Phase 3: Release

- [X] T005 Run `npm run verify` (exit 0, Lighthouse 1.00 ×4) and record results in `checklists/implementation-gates.md`
- [X] T006 Merge to `main`, push, and record the live W3C checker result (FR-006, SC-001, SC-002)
