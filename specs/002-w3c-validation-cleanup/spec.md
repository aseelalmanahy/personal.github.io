# Feature Specification: W3C Validation Clean-up

**Feature Branch**: `002-w3c-validation-cleanup`

**Created**: 2026-10-01

**Status**: Released 2026-10-01 (live: 0 errors, 0 notes, 2 documented warnings)

**Input**: User description: "https://validator.w3.org/nu/?doc=https%3A%2F%2Faseelalmanahy.com%2F"

The owner ran the W3C Nu HTML Checker on the live site. Result on 2026-10-01: **0 errors**, 29
informational notes ("Trailing slash on void elements has no effect and interacts badly with
unquoted attribute values") and 2 warnings ("Inline script violates Content Security Policy
(meta tag)") on lines 12 and 54. This feature makes the published page report a clean result,
explaining any warning that is a deliberate, documented exception.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - A clean report from the W3C checker (Priority: P1)

A recruiter, peer, or the owner runs the W3C checker on aseelalmanahy.com to judge the quality
of the work. The report shows no errors and none of the formatting notes about void elements,
so the result reads as clean, professional markup.

**Why this priority**: The owner publicly links a hand-written site as evidence of craft; a
noisy validator report undercuts that, even when nothing is broken.

**Independent Test**: Validate the published home page and 404 page; confirm 0 errors and 0
"trailing slash on void elements" notes.

**Acceptance Scenarios**:

1. **Given** the published home page, **When** it is checked by the W3C Nu HTML Checker,
   **Then** it reports 0 errors and 0 informational notes about trailing slashes on void
   elements.
2. **Given** the published 404 page, **When** it is checked, **Then** the same holds.
3. **Given** the change is published, **When** a visitor uses the site, **Then** nothing they
   see or do changes: same content, layout, theme behaviour, links, and scores.

---

### User Story 2 - Remaining warnings are understood, not surprising (Priority: P2)

Someone reading the checker report sees at most the two security-policy warnings, and the
project documentation explains why they are expected and safe.

**Why this priority**: The two warnings are false positives the checker cannot resolve: one
script is permitted by its exact fingerprint (a check the checker does not perform), and the
other block is data for search engines, not runnable code. Removing either would harm the site
(a flash of the wrong theme, or weaker search results).

**Independent Test**: Read the project's validation notes and confirm both warnings are
listed with the reason and the evidence that browsers enforce the policy without violations.

**Acceptance Scenarios**:

1. **Given** the checker report, **When** any warning remains, **Then** it is one of the two
   documented security-policy warnings (theme bootstrap; search-engine data block) and no other.
2. **Given** a browser loads the page, **When** its security policy is enforced, **Then** no
   policy violation occurs (existing automated guarantee).

### Edge Cases

- **Inline vector graphics** (icons drawn inside the page): their self-closing shapes are
  meaningful in that markup language and MUST stay unchanged; only HTML void elements change.
- **Source files vs. published files**: the editable source may keep the formatter's style;
  the requirement applies to the published pages visitors and checkers receive.
- **Future edits**: a new tag written in the old style must not reintroduce the notes in the
  published pages.
- **Checker unavailable**: the automated test suite must verify the outcome without depending
  on the external checker being online.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The published home page and 404 page MUST contain no HTML void element written
  with a trailing slash (for example `<meta … />` or `<link … />`).
- **FR-002**: Self-closing syntax inside embedded vector graphics MUST be preserved exactly.
- **FR-003**: Visible content, document structure, attributes and their values, and behaviour
  of the published pages MUST be unchanged apart from FR-001.
- **FR-004**: The automated quality gate MUST fail if a published page contains a void element
  with a trailing slash.
- **FR-005**: The theme bootstrap and the search-engine data block MUST remain, with the existing
  security policy unchanged; the project documentation MUST record the two checker warnings as
  known, accepted exceptions with their reasons.
- **FR-006**: The W3C checker result for the live home page MUST be recorded after publication
  (errors, notes, warnings).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: The W3C checker reports 0 errors and 0 trailing-slash notes for the live home page
  (down from 29 notes).
- **SC-002**: At most 2 warnings remain, both of them the documented security-policy exceptions.
- **SC-003**: Every existing automated check still passes, and Lighthouse scores stay at 100 in
  all four categories.
- **SC-004**: A visitor notices no difference: the same pages, at the same speed, with no new
  errors in the browser.

## Assumptions

- The checker's informational notes, not errors, are the target; the site already reports 0
  errors.
- The two security-policy warnings cannot be removed without either weakening the security
  policy (constitution Principle VII) or dropping the theme bootstrap that the constitution
  explicitly permits (Principle I); they are accepted and documented instead.
- The change applies to the published output; the hand-edited source may keep the formatter's
  conventions, so editing and linting stay as they are.
- Owner content and the constitution (v5.0.0) are unchanged; this is a quality-only change.
