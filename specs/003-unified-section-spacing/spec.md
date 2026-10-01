# Feature Specification: Unified Section Spacing

**Feature Branch**: `003-unified-section-spacing`

**Created**: 2026-10-01

**Status**: Released 2026-10-01 (live, verified)

**Input**: User description: "Update the design tokens and component layouts to unify vertical
section spacing: (1) establish a single design token in tokens.css for vertical section gaps
(e.g. '--section-spacing-vertical: 3.5rem;' or an optimal fluid spacing system); (2) apply it
consistently across all major section wrappers (Intro, Experience, Interests, Contact),
eliminating uneven padding-top, padding-bottom, or margin-top drifts; (3) run 'npm run verify'
so mobile responsive tests pass and Lighthouse stays at 100."

Baseline measured on 2026-10-01 (visible gap from one block of content to the next):

| Width | Header → Intro | Between sections | Contact → footer |
|---|---|---|---|
| 320–375 px | 32 px | 96 px | 48 px |
| 768 px | 46 px | 123 px | 61 px |
| 1440 px | 72 px | 192 px | 96 px |

Three different rhythms: the gap between sections is double the per-section spacing (the
bottom space of one section stacks on the top space of the next), the Intro has its own smaller
top offset, and the space before the footer is half the gap between sections.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - An even reading rhythm (Priority: P1)

A visitor scrolls the page on a phone, tablet, or desktop. Every major block (Intro,
Experience, Interests, Contact) starts the same distance below the content above it, from the
top bar down to the footer, so the page reads as one calm, consistent column with no oversized
holes.

**Why this priority**: Uneven gaps make the page feel unfinished and, on desktop, leave nearly
200 px of empty space between sections.

**Independent Test**: At 320, 375, 768, 1024, and 1440 px, measure the gap from the top bar to
the Intro, between each pair of sections, and from Contact to the footer; all gaps at one width
are equal.

**Acceptance Scenarios**:

1. **Given** any width from 320 to 2560 px, **When** the page is viewed, **Then** the gaps from
   the top bar to the Intro, between consecutive sections, and from Contact to the footer are
   equal (within 1 px).
2. **Given** a phone (320–375 px), **When** the page is viewed, **Then** that gap is at least
   56 px (3.5 rem); **given** a wide desktop, **Then** it is at most 80 px (5 rem), growing
   smoothly in between.
3. **Given** a desktop at 1024 × 768 or 1440 × 900, **When** the page loads, **Then** the
   education cards still start within the first screen (existing requirement).

### Edge Cases

- **Enlarged text (200%) and 400% zoom**: the gap scales with text size and never causes
  horizontal scrolling or overlap.
- **Deep links and navigation**: section headings still land just below the fixed top bar.
- **Not-found page**: uses the same spacing value for consistency.
- **Scripting unavailable**: spacing is identical (no script involvement).

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The design system MUST define exactly one value for the vertical spacing between
  major page sections, and every section MUST take its spacing from it; no section may define
  its own top or bottom spacing.
- **FR-002**: The visible gap from the top bar to the Intro, between consecutive sections, and
  from the last section to the footer MUST be equal at any given screen width.
- **FR-003**: The spacing MUST be fluid: at least 3.5 rem on narrow screens, at most 5 rem on
  wide screens, growing smoothly with the screen width and scaling with the visitor's text size.
- **FR-004**: The not-found page MUST use the same spacing value.
- **FR-005**: Content, order, colours, and behaviour MUST be unchanged; only vertical spacing
  between sections changes.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: At each of 320, 375, 768, 1024, and 1440 px the five measured gaps differ by no
  more than 1 px (baseline: up to 160 px difference at 1440 px).
- **SC-002**: The largest gap on a wide desktop drops from 192 px to at most 80 px.
- **SC-003**: Every existing automated check passes, including all mobile responsive checks, and
  Lighthouse stays at 100 in all four categories.
- **SC-004**: The education cards remain visible on the first screen at 1024 × 768 and
  1440 × 900.

## Assumptions

- "Gap" means the visible distance between the last content of one block and the first content
  of the next (a section heading's accent bar counts as content).
- A fluid value (3.5 rem → 5 rem) is preferred over a fixed 3.5 rem so wide screens keep a
  generous rhythm while phones stay compact.
- Spacing inside sections (between a heading and its text, between cards) is out of scope.
- Constitution v5.0.0 is unchanged: design values live as custom properties in the tokens file
  (Principle IV, Best Practice 6).
