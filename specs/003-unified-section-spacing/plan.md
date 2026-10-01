# Implementation Plan: Unified Section Spacing

**Branch**: `003-unified-section-spacing` | **Date**: 2026-10-01 | **Spec**: [spec.md](spec.md)

## Summary

Replace `--space-section` with one token, `--section-spacing-vertical: clamp(3.5rem, 2.5rem + 3vw, 5rem)`
in `src/css/tokens.css`, and apply it one way: every `main > section` gets it as top padding
only, and the last section also gets it as bottom padding. Each boundary (top bar → Intro,
section → section, Contact → footer) is then exactly one token. The Intro's own
`padding-block` override in `hero.css` is removed; the not-found page uses the same token.

## Constitution Check (v5.0.0)

| Principle | Result | Note |
|---|---|---|
| II Mobile-first | PASS | Fluid `clamp()`; rem-based so it scales with text size; no overflow 320–2560 |
| III Warm minimalist | PASS | One rhythm; generous but no 192 px holes |
| IV Code quality | PASS | Design value as a custom property on `:root` (Best Practice 6); Stylelint clean |
| VI Delivery | PASS | CSS-only change; budgets unchanged |

## Measurements

| Width | Before (bar→Intro / between / →footer) | After (all five gaps) |
|---|---|---|
| 320–375 | 32 / 96 / 48 px | 56 px |
| 768 | 46 / 123 / 61 px | 63 px |
| 1024 | 61 / 164 / 82 px | 71 px |
| 1440 | 72 / 192 / 96 px | 80 px |

## Validation

`tests/e2e/spacing.spec.js`: five gaps equal (±1 px) at 320/375/768/1024/1440; ≥ 56 px on
phones, ≤ 80 px on wide desktops; every section's top padding equals the token; 404 uses it.
Existing intro (education cards in first viewport), deep-link, responsive, and a11y specs.
