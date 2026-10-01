# Validation Exceptions (permanent)

**Feature**: [spec.md](spec.md) FR-005 · **Recorded**: 2026-10-01

The W3C Nu HTML Checker reports two warnings on https://aseelalmanahy.com/ that are **false
positives** and are kept by design. Do not "fix" them by weakening the Content Security Policy or
removing the elements.

| # | Checker message | Element | Why it is safe | Why it stays |
|---|---|---|---|---|
| 1 | "Inline script violates Content Security Policy (meta tag): blocked by "script-src" directive (missing 'unsafe-inline' or nonce/hash)" | Inline theme bootstrap in `<head>` (< 1 KB) | The CSP allows it by its exact SHA-256 hash (`script-src 'self' 'sha256-…'`). The checker does not compute hashes; browsers do. `tools/check-csp.mjs` verifies the hash in src and dist, and every e2e test fails on any CSP violation | Constitution Principle I "theme bootstrap exception": it applies the saved theme before first paint so the page never flashes the wrong theme |
| 2 | Same message | `<script type="application/ld+json">` structured data | A JSON-LD block is data, not executable script; CSP `script-src` does not apply to it and browsers never run it | Describes the owner (name, job title, profile links) to search engines; constitution Principle I states data blocks are not scripts |

## Notes

- Checking an uploaded copy of a page (instead of the live URL) adds further "Resource violates
  Content Security Policy" warnings for `css/…` and `js/…`: an uploaded document has no origin, so
  `'self'` cannot match. These do not occur for the live URL.
- If the CSP or the bootstrap changes, update this file and run `node tools/check-csp.mjs --write`.
