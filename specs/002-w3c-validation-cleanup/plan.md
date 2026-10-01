# Implementation Plan: W3C Validation Clean-up

**Branch**: `002-w3c-validation-cleanup` | **Date**: 2026-10-01 | **Spec**: [spec.md](spec.md)

## Summary

Remove the W3C checker's 29 "trailing slash on void elements" notes by post-processing the
published HTML in `tools/build.mjs`, guard it with an e2e regression test, and record the two
remaining Content Security Policy warnings as permanent, documented exceptions
([validation-exceptions.md](validation-exceptions.md)).

## Technical Context

- **Change point**: `tools/build.mjs` → `versionHtml()` writes each `dist/*.html` through
  `stripVoidSlashes()`, which rewrites `<area|base|br|col|embed|hr|img|input|link|meta|source|track|wbr … />`
  to `<… >`. SVG shapes (`<path/>`, `<circle/>`, …) are foreign content and untouched.
- **Source stays as-is**: Prettier keeps writing `/>` in `src/`; html-validate (`void-style:
  selfclose`) keeps linting the source. Only the published output changes (spec Assumptions).
- **CSP**: the inline theme bootstrap is not a void element, so its SHA-256 hash is unchanged;
  `check-csp` verifies src and dist.

## Constitution Check (v5.0.0)

| Principle | Result | Note |
|---|---|---|
| I Vanilla platform | PASS | No new dependency; build step only |
| IV Code quality & a11y | PASS | Adds a regression test; no markup semantics change |
| VI GitHub Pages delivery | PASS | `src/` remains directly servable; dist slightly smaller |
| VII Privacy & security | PASS | CSP unchanged; the two warnings are accepted exceptions |

## Validation

- `tests/e2e/structure.spec.js`: no void element with `/>` in `dist/index.html` or
  `dist/404.html`; SVG self-closing shapes in dist equal those in src.
- `npm run verify` exit 0; Lighthouse 1.00 ×4.
- W3C Nu checker on the live home page after deploy: 0 errors, 0 info notes, ≤ 2 documented
  warnings.
