# Feature Specification: Personal Portfolio Website

**Feature Branch**: N/A — the repository is not yet under git; feature directory is
`specs/001-portfolio-website`

**Created**: 2026-09-29

**Status**: Draft

**Input**: User description: "Create a technical specification for a single-page personal
portfolio website for Aseel Almanahy, a Full Stack Software Engineer. Hero section (greeting
"Hi, I'm Aseel.", professional statement, warm cream/amber vibe, buttons to GitHub, LinkedIn,
and Email); About Me (BS Computer Science, UMass Lowell; MBA in Project Management candidate,
LSU Shreveport; skills grouped as Languages — Java, C/C++, SQL, Python — and Tools/Frameworks —
Git, SpringBoot, Angular, AWS); Experience Timeline (clean, vertical, interactive; Fidelity
Investments roles — Full Stack Software Engineer, Associate Full Stack Software Engineer, Leap to
Lead Reverse Mentor, LEAP Program Mentor — with dates and high-level titles; strict privacy
guardrail on internal enterprise details); Projects (minimalist grid of placeholder cards with
title, short description, tech tags, GitHub link, live demo link); UI (accessible dark/light
toggle with smooth transitions, smooth-scrolling section navigation, mobile-first fluid layouts
for phone, tablet, and desktop)."

## Clarifications

### Session 2026-09-29

- Q: What should interacting with a timeline entry do? → A: Entries highlight on hover, touch,
  and keyboard focus, and animate gently into view as the visitor scrolls (no animation when
  reduced motion is preferred). Entries show title, organization, dates, and category only.
- Q: Section order (constitution vs. request)? → A: Hero, About Me, Experience Timeline,
  Projects, Contact Links; constitution amended to v2.0.1 to match.
- Q: How are placeholder project cards handled on the live site? → A: Launch with a single
  friendly "coming soon" card in the project-card style; the full card design is built and
  ready to fill with real projects.
- Q: How should the email address be displayed? → A: Visible address plus an email link, with
  a "Copy email" button that confirms the copy visually and to screen readers.
- Q: Should the theme control be two-state or include a "follow device" option? → A:
  Two-state toggle (Light ⇄ Dark); starts from the device preference, explicit choice is
  remembered.
- Q: What date precision should timeline entries use? → A: Month and year (e.g. "Jun 2022 –
  Present"); no computed duration.
- Q: Should the navigation bar always stay visible or hide on scroll? → A: Compact bar that
  always stays visible at the top of the viewport.
- Q: Should the site offer a downloadable résumé? → A: No; LinkedIn serves that purpose.
  Résumé download is out of scope for this version.

## User Scenarios & Testing *(mandatory)*

The primary audience is recruiters, hiring managers, engineering peers, and prospective mentees
who arrive from a shared link (résumé, LinkedIn, email signature) — most often on a phone.

### User Story 1 - Meet Aseel and get in touch (Priority: P1)

A recruiter opens the site from a link. Without scrolling, they see a friendly greeting ("Hi,
I'm Aseel."), the professional statement, and three clear actions: GitHub, LinkedIn, and Email.
They choose one and reach Aseel's profile or start an email. A dedicated Contact Links section
at the end of the page offers the same three routes for visitors who scrolled through
everything.

**Why this priority**: Converting a visit into contact is the site's core purpose. The hero and
contact routes alone are a viable, publishable page.

**Independent Test**: Load the page at a standard phone size, confirm the greeting, statement,
and three actions are visible without scrolling, and activate each action to confirm it reaches
the correct destination.

**Acceptance Scenarios**:

1. **Given** a visitor on a phone-sized screen, **When** the page first loads, **Then** the
   greeting "Hi, I'm Aseel.", the statement "Full Stack Software Engineer specializing in
   scalable systems, robust architectures, and engineering mentorship.", and the GitHub,
   LinkedIn, and Email actions are all visible without scrolling.
2. **Given** the hero is visible, **When** the visitor activates the GitHub or LinkedIn action,
   **Then** Aseel's corresponding public profile opens in a new tab and the visitor is told
   beforehand that it opens in a new tab.
3. **Given** the hero is visible, **When** the visitor activates the Email action, **Then** their
   email application opens with Aseel's address pre-filled as the recipient.
4. **Given** a visitor at the bottom of the page, **When** they reach the Contact Links section,
   **Then** the same three contact routes are available with descriptive labels.

---

### User Story 2 - Review background and experience (Priority: P2)

A hiring manager wants to judge fit. In About Me they read a short introduction, see education
(BS in Computer Science, UMass Lowell; MBA in Project Management candidate, LSU Shreveport), and
scan skills grouped into Languages and Tools/Frameworks. In the Experience Timeline they follow
Aseel's progression at Fidelity Investments — engineering roles and leadership/mentorship roles —
each with dates, presented as a clean vertical timeline they can interact with.

**Why this priority**: Background and career progression are the main evidence a hiring decision
rests on, but they are only useful once the visitor already knows who Aseel is (P1).

**Independent Test**: With only the hero, About Me, and Experience sections present, a reviewer
can state Aseel's degrees, list the skills per category, and name each role with its dates and
whether it is an engineering or leadership role.

**Acceptance Scenarios**:

1. **Given** a visitor in About Me, **When** they read the section, **Then** they see both
   education entries with institution, degree, and status (completed vs. candidate), and skills
   presented under the two headings "Languages" (Java, C/C++, SQL, Python) and
   "Tools/Frameworks" (Git, SpringBoot, Angular, AWS).
2. **Given** a visitor in the Experience Timeline, **When** they view it at any screen size,
   **Then** the four roles appear in a single vertical sequence ordered most recent first, each
   showing role title, organization (Fidelity Investments), and date range.
3. **Given** leadership roles overlap in time with engineering roles, **When** the visitor
   views the timeline, **Then** each entry is labelled as "Engineering" or "Leadership" in text
   (not by colour alone) so overlapping dates are not confusing.
4. **Given** a visitor using a mouse, touch, or keyboard, **When** they hover, tap, or focus a
   timeline entry, **Then** the entry shows the same visible highlight for every input method.
5. **Given** a visitor scrolling down to the timeline, **When** each entry comes into view,
   **Then** it animates gently into place; **and given** the visitor prefers reduced motion,
   **Then** every entry is simply shown, with no animation.
6. **Given** any timeline entry, **When** its content is reviewed, **Then** it contains no
   internal application names, internal system or architecture descriptions, proprietary tool
   names, team names, or confidential metrics.

---

### User Story 3 - Explore projects (Priority: P3)

A peer or technical interviewer wants to see real work. The Projects section shows a
minimalist grid of cards; each card has a project title, a short description, technology tags,
a link to the source repository, and a link to a live demo.

**Why this priority**: Projects deepen credibility, but the site delivers its core value
without them, and the project content itself is still to be supplied.

**Independent Test**: Populate the section with sample cards and confirm each card exposes all
five elements, links resolve correctly, and the grid reflows from one column on a phone to
multiple columns on larger screens.

**Acceptance Scenarios**:

1. **Given** the Projects section, **When** a visitor views a card, **Then** it shows a title,
   a description of no more than ~200 characters, one or more technology tags, a repository
   link, and a live demo link, each link naming the project it belongs to for assistive
   technology users.
2. **Given** a project with no live demo, **When** its card is displayed, **Then** the live
   demo link is omitted rather than shown as broken or inert.
3. **Given** screens of different widths, **When** the visitor views the grid, **Then** cards
   show in one column on phones and in two or more columns on tablets and desktops, with equal
   visual weight and no card overflowing its column.
4. **Given** no real projects have been added yet, **When** a visitor views the Projects
   section, **Then** they see a single friendly "coming soon" card in the same visual style as
   project cards, with no sample titles, fake tags, or links.
5. **Given** the first real project is added, **When** the page is published, **Then** it
   appears as a full project card and the "coming soon" card is removed without any layout
   change.

---

### User Story 4 - Navigate quickly and choose a comfortable theme (Priority: P4)

A visitor uses the navigation menu to jump straight to any section, with a smooth scroll that
lands the section heading fully in view. They switch between a light (warm cream) and dark
(cozy dark) theme; the change fades smoothly and is remembered on their next visit.

**Why this priority**: Navigation and theming improve comfort and speed, but every section is
still reachable by scrolling and the default theme is fully usable without them.

**Independent Test**: From the top of the page, use the menu to reach each section by mouse,
touch, and keyboard; toggle the theme, reload, and confirm the choice persisted.

**Acceptance Scenarios**:

1. **Given** any scroll position, **When** the visitor selects a section in the navigation
   menu, **Then** the page moves to that section, its heading is not hidden behind any fixed
   page chrome, and keyboard focus moves to that section.
2. **Given** the visitor has asked their device to reduce motion, **When** they navigate or
   switch themes, **Then** the jump and theme change happen instantly with no animation.
3. **Given** a phone-sized screen, **When** the visitor opens the navigation menu, **Then** it
   presents all section links in a touch-friendly list that can be opened and closed by touch
   and keyboard, and its open/closed state is announced to screen readers.
4. **Given** a first-time visitor, **When** the page loads, **Then** the theme matches their
   device's light/dark preference, with no flash of the other theme.
5. **Given** the visitor toggles the theme, **When** they return later on the same browser,
   **Then** their chosen theme is applied; the toggle's current state is announced to screen
   readers.
6. **Given** the visitor scrolls through the page, **When** a section is in view, **Then** the
   corresponding navigation link is marked as the current section (visually and to assistive
   technology).

---

### Edge Cases

- **Scripting unavailable**: all content, all contact links, and in-page navigation still work;
  the theme follows the device preference; only the toggle, menu animation, and current-section
  highlight are absent. The theme toggle is hidden rather than shown non-functional. On
  phone-sized screens the menu cannot collapse, so the navigation links are shown directly and
  the bar may wrap to two rows (exceeding the ~56px collapsed height of FR-023) — all links stay
  visible and usable.
- **Preference storage blocked** (private browsing, storage disabled): the theme toggle still
  works for the current visit; nothing errors.
- **Device theme changes while the page is open**: if the visitor has never chosen a theme, the
  page follows the new device preference; an explicit choice is kept.
- **Very narrow screens (320px) and 400% zoom**: no horizontal scrolling; long words, the email
  address, and URLs wrap; the menu and cards remain usable.
- **Tabbing through content under the fixed bar**: each focused link or button scrolls into
  view below the bar, never hidden behind it.
- **Landscape phones (short viewports)**: the fixed bar stays compact enough to leave most of
  the screen for content.
- **Very wide screens (up to 2560px)**: content stays within a comfortable reading width and is
  centred; nothing stretches edge to edge in a way that harms readability.
- **Deep link on arrival** (e.g. a shared link to the Experience section): the page opens with
  that section's heading in view, not hidden under the navigation bar.
- **No email application configured**: the visitor copies the address with the "Copy email"
  button or by selecting the visible text.
- **Clipboard access denied or unsupported**: the copy button reports the failure in words and
  points the visitor to the visible address; nothing else breaks.
- **Overlapping or ongoing roles**: ongoing roles show "Present" as the end date; overlapping
  roles are ordered by start date, most recent first; roles starting in the same month list
  the Engineering role first.
- **Arriving mid-page or scrolling fast past the timeline**: entries already in or above the
  viewport are shown immediately; no entry is ever left invisible.
- **Only the "coming soon" card present**: it sits within the grid without stretching to an
  awkward width on large screens.
- **Project with a missing element** (no demo, no tags): the card stays aligned with its
  neighbours; missing links are omitted, never dead.
- **External profile unavailable**: failures happen on the external site; this page contains no
  broken internal links.
- **Printing the page**: content prints legibly in a light scheme with link destinations
  readable.

## Requirements *(mandatory)*

### Functional Requirements

**Page structure and scope**

- **FR-001**: The site MUST be a single page containing these sections, in this order: Hero,
  About Me, Experience Timeline, Projects, Contact Links.
- **FR-002**: Each section MUST be individually linkable so a visitor can share or bookmark a
  link that opens directly at that section.
- **FR-003**: A "not found" page MUST be shown for any unknown address, in the site's style,
  with a link back to the main page.

**Hero**

- **FR-004**: The hero MUST display the greeting "Hi, I'm Aseel." as the page's main heading
  and the statement "Full Stack Software Engineer specializing in scalable systems, robust
  architectures, and engineering mentorship." verbatim.
- **FR-005**: The hero MUST present three clearly labelled actions — GitHub, LinkedIn, Email —
  styled as buttons, each with a visible text label (icons, if used, are supplementary).
- **FR-006**: GitHub and LinkedIn actions MUST open Aseel's public profiles in a new tab and
  MUST indicate to all users that they open in a new tab.
- **FR-007**: The Email action MUST start a new email to Aseel's chosen public address.

**About Me**

- **FR-008**: About Me MUST include a short introductory paragraph (2–4 sentences) written in a
  warm, first-person voice, consistent with the hero statement.
- **FR-009**: About Me MUST list education: Bachelor of Science in Computer Science, University
  of Massachusetts Lowell (completed); Master of Business Administration in Project Management,
  Louisiana State University Shreveport (candidate / in progress).
- **FR-010**: About Me MUST present technical skills in two labelled groups: Languages (Java,
  C/C++, SQL, Python) and Tools/Frameworks (Git, SpringBoot, Angular, AWS). Groups MUST be
  readable as lists by assistive technology.

**Experience Timeline**

- **FR-011**: The timeline MUST show exactly these Fidelity Investments roles: Full Stack
  Software Engineer; Associate Full Stack Software Engineer; Leap to Lead Reverse Mentor; LEAP
  Program Mentor — each with organization, role title, start date, and end date (or "Present").
  Dates MUST be shown as abbreviated month and year (e.g. "Jun 2022 – Present"), with no
  computed duration, and MUST be exposed as machine-readable dates to assistive technology and
  search engines.
- **FR-012**: Entries MUST be displayed as a single vertical timeline, most recent first, on
  every screen size, and each entry MUST carry a text label of "Engineering" or "Leadership".
- **FR-013**: The timeline MUST be interactive: each entry MUST respond to hover, touch, and
  keyboard focus with the same visible highlight, and entries MUST animate gently into view
  (no longer than ~400ms each) as the visitor scrolls to them. Entries MUST NOT expand or hide
  content; each shows only role title, organization, dates, and category.
- **FR-013a**: The scroll-in animation MUST be skipped entirely when the visitor prefers reduced
  motion, and entries MUST be fully visible if the animation cannot run (e.g. scripting
  unavailable) or when the page is opened directly at or below the timeline.
- **FR-014**: Timeline entries MUST contain only the fields listed in FR-013 (role title,
  organization, dates, category). No entry — and no other text on the page — may include
  internal application or system names, descriptions of internal enterprise architecture,
  proprietary or internal tool names or setups, team or department names, client information,
  or non-public metrics. Elsewhere on the page, experience may be described only in terms of
  general technical competencies (e.g. "full stack development") and leadership achievements
  (e.g. "mentoring engineers and leaders").
- **FR-015**: All timeline content MUST pass a written privacy review against FR-014 before
  publication.

**Projects**

- **FR-016**: Projects MUST be shown as a minimalist grid of cards: one column on phones, two
  or more columns on tablets and desktops.
- **FR-017**: Each card MUST provide: project title, short description (≤ 200 characters), one
  or more technology tags, a repository link, and a live demo link. Link labels MUST identify
  the project (e.g. "Source code for <Project Title>").
- **FR-018**: When a project has no repository or no live demo, the corresponding link MUST be
  omitted; no card may contain a dead or placeholder link on the live site.
- **FR-019**: Cards MUST be structured so that adding, removing, or replacing a project
  requires editing only that project's content, without changing the layout.
- **FR-020**: While no real projects exist, the section MUST show exactly one "coming soon" card
  styled like a project card, containing a short friendly message (e.g. "New projects are on
  the way — follow along on GitHub") and no sample titles, tags, or placeholder links. A link
  to Aseel's GitHub profile MAY be included. This card is exempt from FR-017 and MUST be removed
  once at least one real project is published.

**Contact Links**

- **FR-021**: The final section MUST repeat the three contact routes (GitHub, LinkedIn, Email)
  with descriptive labels and MUST show the email address as readable, selectable text that is
  also an email link.
- **FR-021a**: Next to the visible address, a "Copy email" button MUST copy the address to the
  visitor's clipboard and confirm success with a visible message (e.g. "Copied!") that is also
  announced to screen readers and clears after a few seconds. If copying fails, the message
  MUST tell the visitor to select the address manually. The button MUST be hidden when
  scripting is unavailable; the visible address and email link remain.
- **FR-022**: No form that collects visitor data MAY be included; contact happens through
  links only.
- **FR-022a**: The site MUST NOT offer a résumé/CV download; the hero and Contact Links section
  contain exactly the three contact routes (GitHub, LinkedIn, Email).

**Navigation**

- **FR-023**: A navigation menu MUST link to every main section and MUST sit in a compact bar
  that stays visible at the top of the viewport at every scroll position (no hide-on-scroll
  behaviour). On phone-sized screens, with scripting available, the bar MUST be no taller than
  ~56px (~15% of a 375 × 667 screen at most) while the menu is collapsed (see Edge Cases →
  Scripting unavailable).
- **FR-023a**: The fixed bar MUST never cover the heading of a section reached by navigation or
  deep link, nor the element that currently has keyboard focus.
- **FR-024**: Selecting a navigation link MUST scroll smoothly to the section (instantly when
  the visitor prefers reduced motion), MUST place it as required by FR-023a, and MUST move
  keyboard focus to that section.
- **FR-025**: On phone-sized screens the menu MUST collapse behind a clearly labelled menu
  button whose expanded/collapsed state is exposed to assistive technology; the menu MUST close
  with the Escape key and after a link is chosen.
- **FR-026**: The navigation MUST indicate the section currently in view.
- **FR-027**: A "Skip to main content" link MUST be the first focusable element on the page.

**Theme**

- **FR-028**: The site MUST offer a light theme (soft cream backgrounds, warm amber accents,
  dark warm-brown text) and a dark theme (cozy dark backgrounds, amber accents, cream text).
- **FR-029**: On first visit the theme MUST follow the device's light/dark preference; the page
  MUST NOT briefly display the other theme while loading.
- **FR-030**: A single two-state theme toggle (Light ⇄ Dark) MUST be available in the
  navigation area on every screen size, be operable by mouse, touch, and keyboard, have an
  accessible name, and expose its current state (on/off) to assistive technology. There is no
  separate "follow device" option; the device preference applies only until the visitor makes
  a choice.
- **FR-031**: Switching themes MUST transition smoothly (colour fade no longer than ~300ms),
  MUST be instant when the visitor prefers reduced motion, and the choice MUST be remembered on
  that browser for later visits.

**Responsiveness and accessibility**

- **FR-032**: Layouts MUST be designed for phones first and adapt fluidly to tablets and
  desktops, with no horizontal scrolling at any width from 320px to 2560px and at up to 400%
  zoom.
- **FR-033**: Every interactive element MUST be at least 44×44 CSS pixels, operable by keyboard,
  and show a visible focus indicator.
- **FR-034**: All text and interface elements MUST meet WCAG 2.2 AA contrast in both themes;
  colour MUST never be the only way information is conveyed.
- **FR-035**: All content and links MUST remain available when scripting is unavailable.
- **FR-036**: The page MUST include a descriptive title, summary description, and link-preview
  information (title, description, image) so shared links render a clear preview.

### Key Entities

- **Profile**: the site owner — display name ("Aseel"), full name (Aseel Almanahy), professional
  statement, short introduction.
- **Contact Link**: a route to reach Aseel — type (GitHub, LinkedIn, Email), visible label,
  destination, whether it opens in a new tab.
- **Education Entry**: degree, field, institution, status (completed / candidate).
- **Skill Category**: category name (Languages, Tools/Frameworks) and its ordered list of
  skills.
- **Timeline Entry**: role title, organization, category (Engineering / Leadership), start date
  (month + year), end date (month + year) or "Present". No summary text (see FR-013).
- **Project**: title, short description, technology tags, optional repository link, optional
  live demo link.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: On a standard phone screen (375 × 667), 100% of first-time visitors can see Aseel's
  name, professional statement, and all three contact actions without scrolling.
- **SC-002**: In a usability check with at least 5 participants, at least 4 can start an email
  to Aseel and open Aseel's GitHub profile (or, once projects are published, one project's
  source repository) within 30 seconds each.
- **SC-003**: Any section can be reached from any scroll position in no more than 2
  interactions (e.g. open menu, choose section).
- **SC-004**: Zero instances of horizontal scrolling or clipped content at 320px, 375px, 768px,
  1024px, 1440px, and 2560px widths, and at 400% zoom.
- **SC-005**: The main content is readable within 2 seconds on a mid-range phone over a typical
  mobile connection, and nothing on the page shifts noticeably after it appears.
- **SC-006**: 100% of interactive features (navigation, menu, theme toggle, timeline, cards,
  links) can be completed using only a keyboard, and a screen-reader walkthrough announces every
  section, link, and control with a meaningful name.
- **SC-007**: Zero accessibility violations found by an automated WCAG 2.2 AA scan in both light
  and dark themes.
- **SC-008**: A returning visitor sees their previously chosen theme on 100% of visits where
  their browser allows preferences to be saved.
- **SC-009**: A privacy review of all published text finds zero references to internal
  applications, internal architecture, proprietary tools, team names, or non-public metrics.
- **SC-010**: Zero broken or placeholder links on the published page.

## Assumptions

- **Content still to be supplied by Aseel before launch** (not blocking the spec): start/end
  dates for each of the four roles; GitHub profile URL; LinkedIn profile URL; the public email
  address to publish; the About Me introduction text (a draft will be proposed for approval).
  Real project details are post-launch content that replaces the "coming soon" card.
- The site's name/heading uses the first name "Aseel"; the full name "Aseel Almanahy" appears in
  the page title, share previews, and footer.
- No profile photo is included; the hero relies on typography and colour. A photo can be added
  later without changing the structure.
- The email address is published as plain text, an email link, and a copy button; it is not
  disguised. The owner accepts the resulting exposure to automated collection and SHOULD use an
  address intended for public contact.
- The About Me section may mention both degrees and skills only; certifications, awards, and
  non-Fidelity roles are out of scope for this version.
- A downloadable résumé is out of scope for this version; visitors wanting a full work history
  use the LinkedIn link.
- Mentor-program names ("Leap to Lead", "LEAP") are public-facing program titles the owner is
  comfortable publishing; no program internals are described.
- Remembering the theme choice uses only the visitor's own browser storage — no cookies,
  accounts, analytics, or data sent anywhere.
- English only; no internationalization in this version.
- The site is hosted as a static page (per the project constitution); there is no server-side
  processing, contact form, or content management system.
- Supported browsers: current and previous major versions of Chrome, Edge, Firefox, and Safari
  (desktop and mobile).
