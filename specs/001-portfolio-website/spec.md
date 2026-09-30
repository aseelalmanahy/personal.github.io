# Feature Specification: Personal Portfolio Website

**Feature Branch**: `001-portfolio-website`

**Created**: 2026-09-29

**Status**: Draft — amended 2026-09-30 (narrative content structure; Interests section; email
removed, LinkedIn primary; four-tier skills; Experience
narrative revised; em dashes removed; hero links and Projects removed; Hero and About Me merged
into one intro, four sections; see Clarifications)

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

**Amendment input (2026-09-30)**: "Update the project specification and tasks to reflect a
narrative-driven content structure: About Me uses a new paragraph framing mentorship as a
vehicle for personal growth and sharing accumulated technical experience; the Experience
section eliminates the vertical timeline, individual role listings, and chronological position
blocks in favour of a single, highly polished narrative focusing on full-stack competencies,
cloud experience, architectural growth, and technical leadership capability; GitHub and
LinkedIn links are set to the owner's profiles; tasks and the page are regenerated while
maintaining Lighthouse scores."

**Amendment input (2026-09-30, Interests)**: "Inject a Hobbies/Interests section: a new section
titled 'Interests' right after the narrative Experience block and before the Contact section; a
clean, accessible, non-animated grid list of five items — Cooking, Reading Books, Weightlifting,
Cycling, and Skiing; pure semantic HTML with embedded lightweight inline icons for each hobby,
no external icon libraries or heavy web fonts, keeping the performance guidelines."

**Amendment input (2026-09-30, contact)**: "Remove email contact paths: completely remove the
email link, the 'Copy Email' script modules, and the FR-021a fallback logic; refocus the Contact
section text to state that the best and primary way to reach out or connect is directly via
LinkedIn; remove stale email test assertions; keep Lighthouse at 100 across all metrics."

**Amendment input (2026-09-30, skills)**: "Overhaul the Skills section to use a structured, 4-tier
grid that highlights full-lifecycle engineering capabilities — Languages: Java,
TypeScript/JavaScript, C/C++, C#, SQL, Python; Frameworks & Security: Spring Boot, Angular,
Flask, Hibernate, Spring Data JPA, RESTful APIs, OAuth2, JWT; Cloud & DevOps: AWS (EC2, Lambda,
S3), Docker, Kubernetes, Jenkins, uDeploy, Git/GitLab/Bitbucket; Quality & Methodology:
Test-Driven Development (TDD), JUnit, Karate, SonarQube, Splunk, Datadog, Scrum/Kanban/SAFe,
Architecture Grooming — with a lean, responsive layout on mobile, tablet, and desktop. Contact
copy states LinkedIn is the primary and best channel to reach out, connect, or initiate
professional discussions."

**Amendment input (2026-09-30, narrative)**: "Replace the Experience narrative paragraph text
word-for-word with this corrected version" (the text now in FR-011), "then run 'npm run verify'
to confirm that all cross-browser tests continue to pass."

**Amendment input (2026-09-30, polish and projects)**: "Remove all long em-dashes across the
entire codebase (About Me, Experience, and Projects), replacing them with commas, semicolons, or
natural sentence breaks. Eliminate redundant link elements: GitHub and LinkedIn are placed only
in the hero and the contact section, without intermediate repetition. Remove the dashed
placeholder card and restructure Projects into a grid of 2–3 featured repository highlights
displaying core competencies (e.g. 'Enterprise Microservices', 'Cloud Architecture', and
'Algorithmic Systems') with unique tags and direct code anchors. Run 'npm run verify'."

**Amendment input (2026-09-30, five sections)**: "Remove the GitHub and LinkedIn profile
buttons/links from the Hero section; the Hero focuses purely on the greeting and professional
summary statement. Completely remove the 'Projects' section, all related CSS modules, grid rules,
and its navigation link. The Contact footer is now the exclusive location for the GitHub and
LinkedIn buttons, the single destination for professional outreach and code inspection. Update
task definitions (analysis findings I1, I2, I3, I5, I7) and documentation for the 5-section
layout (Hero, About Me, Experience, Interests, Contact). Run 'npm run verify'."

**Amendment input (2026-09-30, unified intro)**: "Restructure the top page layout to eliminate the
large visual gap: combine the Hero greeting, the short summary statement, and the 'About Me'
biographical paragraph into a single, unified introductory header section; remove the separate
'About Me' section heading. Position the two Education degree cards directly beneath the merged
text block to ground the initial landing viewport. The page flow: Unified Intro Header →
Education Cards → Full-Width Skills Grid → Experience Narrative → Interests → Contact Footer.
Ensure the em dash in the biographical paragraph is a comma or semicolon. Run 'npm run
verify'."

## Clarifications

### Session 2026-09-29

- Q: What should interacting with a timeline entry do? → A: Entries highlight on hover, touch,
  and keyboard focus, and animate gently into view as the visitor scrolls (no animation when
  reduced motion is preferred). Entries show title, organization, dates, and category only.
  *(Superseded 2026-09-30: the timeline was replaced by a narrative.)*
- Q: Section order (constitution vs. request)? → A: Hero, About Me, Experience Timeline,
  Projects, Contact Links; constitution amended to v2.0.1 to match. *(The Experience section is
  a narrative since 2026-09-30; order unchanged.)*
- Q: How are placeholder project cards handled on the live site? → A: Launch with a single
  friendly "coming soon" card in the project-card style; the full card design is built and
  ready to fill with real projects. *(Superseded 2026-09-30: three featured project cards
  replace the coming-soon card, FR-020.)*
- Q: How should the email address be displayed? → A: Visible address plus an email link, with
  a "Copy email" button that confirms the copy visually and to screen readers. *(Superseded
  2026-09-30: no email is published.)*
- Q: Should the theme control be two-state or include a "follow device" option? → A:
  Two-state toggle (Light ⇄ Dark); starts from the device preference, explicit choice is
  remembered.
- Q: What date precision should timeline entries use? → A: Month and year (e.g. "Jun 2022 –
  Present"); no computed duration. *(Superseded 2026-09-30: no dates are published.)*
- Q: Should the navigation bar always stay visible or hide on scroll? → A: Compact bar that
  always stays visible at the top of the viewport.
- Q: Should the site offer a downloadable résumé? → A: No; LinkedIn serves that purpose.
  Résumé download is out of scope for this version.

### Session 2026-09-30 (owner amendment: narrative content structure)

- Q: How should the Experience section present career history? → A: As one polished narrative
  paragraph (text in FR-011) about full-stack competencies, cloud experience, architectural
  growth, and technical leadership. The vertical timeline, individual role listings, dates,
  employer name, and chronological position blocks are removed entirely.
- Q: What is the approved About Me introduction? → A: The owner's text in FR-008, which frames
  mentorship as sharing accumulated experience while sharpening the owner's own leadership.
- Q: Which public profiles do the GitHub and LinkedIn actions open? → A:
  `https://github.com/aseelalmanahy` and
  `https://www.linkedin.com/in/aseel-almanahy-97342b109/` (FR-006).
- Q: What are the repository name and site URL? → A: Repository `aseelalmanahy.github.io`;
  site URL `https://aseelalmanahy.github.io/` (the owner wrote "https://github.io"; GitHub Pages
  serves a repository with that name at `https://aseelalmanahy.github.io/`, so that address is
  used for the canonical link, share previews, and sitemap).
- Q: Where does the new Interests section go, given Projects sits between Experience and
  Contact? → A: Immediately after Experience ("right after the narrative Experience block"),
  so the order is Hero, About Me, Experience, Interests, Projects, Contact Links; constitution
  amended to v2.2.0 to allow the sixth section. *(Superseded 2026-09-30: Projects removed;
  the order is Hero, About Me, Experience, Interests, Contact Links, constitution v3.0.0.)*
  *(Superseded again 2026-09-30: Intro, Experience, Interests, Contact Links, constitution
  v4.0.0.)*
- Q: Which public email address does the page publish? → A: `[email removed]`
  (owner-supplied routing address; an earlier proposal on an unregistered domain was rejected).
  *(Superseded 2026-09-30: email removed from the page.)*
- Q: How do visitors contact Aseel without email? → A: LinkedIn is the best and primary way to
  reach out or connect; the Contact section says so and presents LinkedIn first and most
  prominently, with GitHub as a secondary route. No email address, email link, or copy control
  appears anywhere on the page.
- Q: How are the expanded skills organised and laid out? → A: Four labelled tiers — Languages;
  Frameworks & Security; Cloud & DevOps; Quality & Methodology — with the owner's items in the
  owner's order (FR-010). Skills get their own full-width block under Education: one column on
  phones, two on tablets, and all four side by side on wide desktops.
- Q: The corrected narrative names UMass Lowell, role types, and industry sectors — does that
  conflict with the Experience privacy rules? → A: No. The owner supplied the text word-for-word.
  UMass Lowell is the owner's university and already appears in Education, so it is the one
  organization the narrative may name (FR-012). Role types (Professor's Assistant, Android
  Engineer, Full Stack Engineer) and sectors (healthcare, Financial Services) appear only inside
  the prose, never as a list. The current employer, internal program names, dates, and every
  FR-014 item stay excluded.
- Q: Which em dashes are removed, and what replaces them in the owner's verbatim texts? → A:
  Every em dash in the published pages (visible text, page titles, share metadata) and in the
  site's source, tests, and tools. In FR-008 the dash becomes a semicolon ("important to me; I
  actively…"); in FR-011 a comma ("mentorship, collaborating…"); in the Contact intro a sentence
  break. Page titles use a vertical bar as the separator ("Aseel Almanahy | Full Stack Software
  Engineer"). Planning documents keep their own punctuation.
- Q: Which projects fill the featured grid, given the example competencies? → A: The owner's
  public repositories, three cards: Event-Driven Microservices (order-service and
  e-commerce-store-project), Full-Stack Web Application (booky-frontend and books), and
  Algorithmic Systems (Radix-Calculator). "Cloud Architecture" is not used as a title because no
  public repository contains cloud infrastructure code, and a card must not claim more than its
  code shows; the cloud skills stay in Skills and Experience. "Enterprise" is replaced by
  "Event-Driven", which describes the Kafka-based design accurately. *(Superseded 2026-09-30:
  the Projects section was removed.)*
- Q: Where may the profile links appear? → A: Only in the hero and the Contact section, once each
  (FR-042). Project cards link to repositories, never to the profile, and the page has no other
  profile link. *(Superseded 2026-09-30: only in the Contact section.)*
- Q: With the hero links gone, how do visitors reach Aseel? → A: Through the Contact section,
  the page's final section and the only place with the GitHub and LinkedIn buttons (FR-042). The
  navigation bar links to Contact from every scroll position (SC-003), so the route is one or two
  interactions away; the hero shows only the greeting and statement.
- Q: Where do visitors inspect code now that Projects is gone? → A: Through the GitHub profile
  button in Contact. The page links to no individual repository. Constitution v3.0.0 removes
  Projects from the required sections (Principle V).
- Q: How are the Hero and About Me combined? → A: One intro section, in this order: greeting
  (the page's only h1), professional statement, biography (FR-008), Education (two degree cards),
  Skills (four tiers). "Education" and "Skills" become the intro's sub-headings; there is no
  "About Me" heading anywhere. Constitution v4.0.0 lists four sections: Intro, Experience,
  Interests, Contact Links.
- Q: What happens to the "About" navigation link? → A: It is removed: the intro is the top of
  the page and the site-name link in the bar already returns to it. The bar links to
  Experience, Interests, and Contact.
- Q: Is there still an em dash in the biography? → A: No. It became a semicolon on 2026-09-30
  ("important to me; I actively…", FR-008, FR-041); this amendment confirms it.

## User Scenarios & Testing *(mandatory)*

The primary audience is recruiters, hiring managers, engineering peers, and prospective mentees
who arrive from a shared link (résumé, LinkedIn, email signature) — most often on a phone.

### User Story 1 - Meet Aseel and get in touch (Priority: P1)

A recruiter opens the site from a link. Without scrolling, they see a friendly greeting ("Hi,
I'm Aseel."), the professional statement, and a short biography, with Aseel's two degrees
starting just below; nothing competes for attention. To get in
touch they choose Contact in the navigation bar (or scroll to the end): the Contact Links section
tells them that LinkedIn is the best way to reach out or connect and offers LinkedIn and GitHub,
the only place on the page where either appears.

**Why this priority**: Converting a visit into contact is the site's core purpose. The hero and
contact routes alone are a viable, publishable page.

**Independent Test**: Load the page at a standard phone size, confirm the greeting and statement
are visible without scrolling, reach Contact through the navigation, and activate each action to
confirm it reaches the correct destination.

**Acceptance Scenarios**:

1. **Given** a visitor on a phone-sized screen, **When** the page first loads, **Then** the
   greeting "Hi, I'm Aseel.", the statement "Full Stack Software Engineer specializing in
   scalable systems, robust architectures, and engineering mentorship." are visible without
   scrolling, and the hero contains no links or buttons.
2. **Given** the Contact section, **When** the visitor activates the GitHub or LinkedIn action,
   **Then** Aseel's corresponding public profile opens in a new tab and the visitor is told
   beforehand that it opens in a new tab.
3. **Given** a visitor at the bottom of the page, **When** they reach the Contact Links section,
   **Then** it states that LinkedIn is the best and primary way to reach out or connect, shows
   LinkedIn as the first and most prominent action, and offers GitHub as a second route.
4. **Given** any part of the page, **When** a visitor looks for an email address, **Then** none
   is published — no address, email link, or copy control.

---

### User Story 2 - Review background and experience (Priority: P2)

A hiring manager wants to judge fit. In the intro they read a short biography that shows how
Aseel approaches engineering and mentorship, see education (BS in Computer Science, UMass
Lowell; MBA in Project Management candidate, LSU Shreveport), and scan skills grouped into
four tiers — Languages, Frameworks & Security, Cloud & DevOps, and Quality & Methodology —
that show full-lifecycle engineering capability. In Experience they read one polished narrative that tells the
story of Aseel's technical growth — from teaching and grading core computer science, through
Android engineering in healthcare, to full-stack, microservices, and AWS work in financial
services and healthcare — and of Aseel's mentorship of new engineers.

**Why this priority**: Background and career story are the main evidence a hiring decision rests
on, but they are only useful once the visitor already knows who Aseel is (P1).

**Independent Test**: With only the intro and Experience sections present, a reviewer
can state Aseel's degrees, list the skills per category, and summarise Aseel's experience in
terms of full-stack work, cloud (AWS), architecture, and technical leadership.

**Acceptance Scenarios**:

1. **Given** a visitor in the intro, **When** they read it, **Then** they see the
   introduction from FR-008 verbatim, both education entries with institution, degree, and
   status (completed vs. candidate), and skills presented under the four headings listed in
   FR-010, each with its items in the stated order.
2. **Given** a visitor in Experience, **When** they view it at any screen size, **Then** they
   see the narrative from FR-011 verbatim as flowing prose at a comfortable reading width, with
   no timeline, role list, dates, or employer name (the university from Education is the only
   organization named).
3. **Given** the Experience narrative, **When** its content is reviewed, **Then** it contains no
   internal application names, internal system or architecture descriptions, proprietary tool
   names, team names, or confidential metrics.

---

### User Story 3 - Explore projects *(Removed 2026-09-30)*

The Projects section was removed at the owner's request (constitution v3.0.0). Visitors inspect
code through the GitHub profile button in Contact (FR-042).

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

### User Story 5 - Get to know Aseel beyond work (Priority: P5)

A visitor who has read Aseel's experience wants a sense of the person behind it. In a short
Interests section they see five hobbies at a glance — Cooking, Reading Books, Weightlifting,
Cycling, and Skiing — each with a small, friendly icon.

**Why this priority**: It makes the page warmer and more personal, but it is supporting context
rather than evidence for a hiring decision, so it follows the professional content.

**Independent Test**: Load the page, reach Interests from the navigation, and confirm the five
hobbies appear as a list in the stated order, each with an icon and a visible text label, with
no motion and nothing to click.

**Acceptance Scenarios**:

1. **Given** a visitor scrolling past Experience, **When** they reach Interests, **Then** they
   see the heading "Interests" and exactly five items, in this order: Cooking, Reading Books,
   Weightlifting, Cycling, Skiing.
2. **Given** a screen-reader user, **When** they reach Interests, **Then** it is announced as a
   list of five items, each read by its text label only (icons are not announced).
3. **Given** any screen width from 320px to 2560px, **When** the visitor views Interests,
   **Then** the items form a tidy grid (more columns on wider screens) with no overflow, and
   nothing animates, moves, or responds to hover as if it were clickable.

---

### Edge Cases

- **Scripting unavailable**: all content, all contact links, and in-page navigation still work;
  the theme follows the device preference; only the toggle, menu animation, and current-section
  highlight are absent. The theme toggle is hidden rather than shown non-functional. On
  phone-sized screens the menu cannot collapse, so the navigation links are shown directly and
  the bar may wrap to several rows (exceeding the ~56px collapsed height of FR-023) — all links stay
  visible and usable.
- **Preference storage blocked** (private browsing, storage disabled): the theme toggle still
  works for the current visit; nothing errors.
- **Device theme changes while the page is open**: if the visitor has never chosen a theme, the
  page follows the new device preference; an explicit choice is kept.
- **Very narrow screens (320px) and 400% zoom**: no horizontal scrolling; long words and URLs
  wrap; the menu and cards remain usable.
- **Tabbing through content under the fixed bar**: each focused link or button scrolls into
  view below the bar, never hidden behind it.
- **Landscape phones (short viewports)**: the fixed bar stays compact enough to leave most of
  the screen for content.
- **Very wide screens (up to 2560px)**: content stays within a comfortable reading width and is
  centred; nothing stretches edge to edge in a way that harms readability.
- **Deep link on arrival** (e.g. a shared link to the Experience section): the page opens with
  that section's heading in view, not hidden under the navigation bar.
- **Interests on narrow screens or with enlarged text**: the grid drops to fewer columns (one if
  needed) so labels such as "Weightlifting" and "Reading Books" never overflow or clip.
- **Long narrative on small screens or with enlarged text**: the Experience narrative wraps
  within the viewport at 320px and 400% zoom and stays readable (no clipped or overlapping
  text).
- **External profile unavailable**: failures happen on the external site; this page contains no
  broken internal links.
- **Printing the page**: content prints legibly in a light scheme with link destinations
  readable.

## Requirements *(mandatory)*

### Functional Requirements

**Page structure and scope**

- **FR-001**: The site MUST be a single page containing these sections, in this order: Intro
  (greeting, statement, biography, education, skills), Experience, Interests, Contact Links.
- **FR-002**: Each section MUST be individually linkable so a visitor can share or bookmark a
  link that opens directly at that section.
- **FR-003**: A "not found" page MUST be shown for any unknown address, in the site's style,
  with a link back to the main page.

**Intro**

- **FR-004**: The hero MUST display the greeting "Hi, I'm Aseel." as the page's main heading
  and the statement "Full Stack Software Engineer specializing in scalable systems, robust
  architectures, and engineering mentorship." verbatim.
- **FR-005**: The intro MUST present, in this order, the greeting and statement (FR-004), the
  biography (FR-008), the education cards (FR-009), and the skills grid (FR-010), with
  "Education" and "Skills" as its only sub-headings and no "About Me" heading. It contains no
  links, buttons, or other actions; contact routes live in Contact Links (FR-021, FR-042).
- **FR-005a**: The intro MUST read as one continuous block: no section-sized gap between the
  statement, the biography, and the education cards, and on desktop screens (1024 × 768 and
  larger) the education cards begin within the first screenful.
- **FR-006**: GitHub and LinkedIn actions MUST open Aseel's public profiles —
  `https://github.com/aseelalmanahy` and `https://www.linkedin.com/in/aseel-almanahy-97342b109/`
  — in a new tab and MUST indicate to all users that they open in a new tab. The same two URLs
  are used everywhere the page links to these profiles.
- **FR-007**: *(Removed 2026-09-30 — no email action; see FR-021.)*

**Intro: biography, education, skills**

- **FR-008**: The intro's biography MUST read, verbatim: "I'm a full-stack software
  engineer who loves turning complex problems into reliable, well-structured systems. I studied
  Computer Science at UMass Lowell and am now pursuing an MBA in Project Management at LSU
  Shreveport, pairing engineering depth with strategic delivery know-how. Mentorship is
  incredibly important to me; I actively dedicate time to sharing my industry experience to
  accelerate the growth of other engineers while continuously sharpening my own leadership
  capabilities."
- **FR-009**: The intro MUST list education, directly below the biography: Bachelor of Science in Computer Science, University
  of Massachusetts Lowell (completed); Master of Business Administration in Project Management,
  Louisiana State University Shreveport (candidate / in progress).
- **FR-010**: The intro MUST present technical skills, below education, in four labelled tiers, in this order and
  with exactly these items in this order: **Languages** — Java, TypeScript/JavaScript, C/C++,
  C#, SQL, Python; **Frameworks & Security** — Spring Boot, Angular, Flask, Hibernate, Spring
  Data JPA, RESTful APIs, OAuth2, JWT; **Cloud & DevOps** — AWS (EC2, Lambda, S3), Docker,
  Kubernetes, Jenkins, uDeploy, Git/GitLab/Bitbucket; **Quality & Methodology** — Test-Driven
  Development (TDD), JUnit, Karate, SonarQube, Splunk, Datadog, Scrum/Kanban/SAFe, Architecture
  Grooming. The tiers MUST form a grid: one column on phone-sized screens, two on tablets, and
  four side by side on wide desktop screens, with no overflow (FR-032). Groups MUST be
  readable as lists by assistive technology.

**Experience**

- **FR-011**: The Experience section MUST present this narrative, verbatim, as flowing prose:
  "My engineering journey is rooted in a strong technical foundation, starting as a Professor's
  Assistant and grader at UMass Lowell, where I evaluated complex algorithmic concepts and
  mentored students in core Data Structures in C and Object-Oriented Programming. I built upon
  these fundamentals in industry, working as an Android Engineer in the healthcare sector to
  integrate secure services and optimize user-facing mobile interfaces. Transitioning into
  full-stack engineering, I have evolved into a Full Stack Engineer specialized in building
  robust systems, constructing microservices, and managing cloud infrastructure on AWS within
  high-stakes fields like Financial Services and Healthcare. Beyond the code, I focus on
  bridging the gap between technical execution and organizational strategy. My career is defined
  not just by the systems I build, but by my active involvement in mentorship, collaborating with
  leadership to share technical insights while mentoring new associate software engineers to
  help them onboard smoothly, master best practices, and achieve both technical and personal
  growth."
- **FR-012**: The Experience section MUST NOT contain a timeline, role or position listings,
  job titles as separate items, dates or date ranges, employer or organization names (sole
  exception: the owner's university, UMass Lowell, which Education already publishes), or any
  list structure; it is a single narrative block. Role types and industry sectors may appear
  only within the approved prose.
- **FR-013**: The narrative MUST be laid out for comfortable reading and visual polish: a
  readable line length (about 45–75 characters), typographic emphasis consistent with the warm
  minimalist design, and no interactive behaviour or animation it depends on.
- **FR-013a**: *(Removed 2026-09-30 — applied only to the former timeline animation.)*
- **FR-014**: No text on the page may include internal application or system names,
  descriptions of internal enterprise architecture, proprietary or internal tool names or
  setups, team or department names, client information, or non-public metrics. Experience is
  described only in terms of general technical competencies, role types, industry sectors, and
  leadership and mentorship capability.
- **FR-015**: All published text, including the Experience narrative, MUST pass a written
  privacy review against FR-014 before publication.

**Interests**

- **FR-037**: An "Interests" section MUST follow Experience and list exactly these five items,
  in this order, each with a visible text label: Cooking, Reading Books, Weightlifting,
  Cycling, Skiing.
- **FR-038**: The items MUST be presented as a list (announced as a list of five items by
  assistive technology) laid out as a grid: at least two columns on phone-sized screens where
  space allows and more columns on wider screens (overflow rules: FR-032).
- **FR-039**: Each item MUST show a small decorative icon that is hidden from assistive
  technology, drawn in the theme's colours in both light and dark themes, and delivered with the
  page itself (no icon library, web font, or additional download).
- **FR-040**: The Interests section MUST be static: no animation, no hover or focus effects that
  suggest interactivity, no links or controls, and no reliance on scripting.

**Punctuation and link placement**

- **FR-041**: No em dash (—) may appear in any published text: visible copy, page titles, share
  metadata, or accessible labels. Where the owner's texts used one, it is replaced by a comma,
  semicolon, or sentence break as recorded in Clarifications.
- **FR-042**: The GitHub and LinkedIn profile links MUST appear exactly once each, in the Contact
  section only; no other section (including the hero) links to either profile or to individual
  repositories.

**Projects** *(removed 2026-09-30, constitution v3.0.0)*

- **FR-016**–**FR-020**: *(Removed 2026-09-30: the Projects section, its cards, and their code
  links no longer exist.)*

**Contact Links**

- **FR-021**: The final section MUST state, in plain text, that LinkedIn is the best and primary
  way to reach out, connect, or initiate professional discussions; MUST present LinkedIn as its
  first and most prominent action and GitHub as a secondary action, each with a descriptive
  label; and the page MUST NOT publish an
  email address, email (`mailto:`) link, or copy-to-clipboard control anywhere.
- **FR-021a**: *(Removed 2026-09-30 — the copy-email control and its fallback no longer exist.)*
- **FR-022**: No form that collects visitor data MAY be included; contact happens through
  links only.
- **FR-022a**: The site MUST NOT offer a résumé/CV download. (Placement of the two contact
  routes: FR-042.)

**Navigation**

- **FR-023**: A navigation menu MUST link to every section after the intro (the site name in the
  bar returns to the intro) and MUST sit in a compact bar
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
- **Contact Link**: a route to reach Aseel — type (GitHub, LinkedIn), visible label,
  destination (always opens in a new tab); LinkedIn is the primary route; shown in Contact only.
- **Education Entry**: degree, field, institution, status (completed / candidate).
- **Skill Category**: category name (Languages, Frameworks & Security, Cloud & DevOps,
  Quality & Methodology) and its ordered list of
  skills.
- **Experience Narrative**: one approved paragraph of prose (FR-011); no dates, role list, or
  employer name (the owner's university excepted, FR-012).
- **Interest**: a personal hobby — label (Cooking, Reading Books, Weightlifting, Cycling,
  Skiing) and a decorative icon; ordered; no description or link.
- **Project**: *(removed 2026-09-30 with the Projects section)*

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: On a standard phone screen (375 × 667), 100% of first-time visitors can see Aseel's
  name and professional statement without scrolling, and can reach the Contact actions in no
  more than 2 interactions.
- **SC-002**: In a usability check with at least 5 participants, at least 4 can find and open
  Aseel's LinkedIn profile as the way to get in touch, and open Aseel's GitHub profile, within
  30 seconds each, starting from the top of the page.
- **SC-003**: Any section can be reached from any scroll position in no more than 2
  interactions (e.g. open menu, choose section).
- **SC-004**: Zero instances of horizontal scrolling or clipped content at 320px, 375px, 768px,
  1024px, 1440px, and 2560px widths, and at 400% zoom.
- **SC-005**: The main content is readable within 2 seconds on a mid-range phone over a typical
  mobile connection, and nothing on the page shifts noticeably after it appears.
- **SC-006**: 100% of interactive features (navigation, menu, theme toggle, links) can
  be completed using only a keyboard, and a screen-reader walkthrough announces every
  section, link, and control with a meaningful name.
- **SC-007**: Zero accessibility violations found by an automated WCAG 2.2 AA scan in both light
  and dark themes.
- **SC-008**: A returning visitor sees their previously chosen theme on 100% of visits where
  their browser allows preferences to be saved.
- **SC-009**: A privacy review of all published text finds zero references to internal
  applications, internal architecture, proprietary tools, team names, or non-public metrics.
- **SC-010**: Zero broken or placeholder links on the published page.

## Assumptions

- **Content still to be supplied by Aseel before launch**: none. (Supplied 2026-09-30: GitHub and
  LinkedIn URLs, About Me introduction, Experience narrative, and site URL. Role dates and an
  email address are no longer needed.)
- The site's name/heading uses the first name "Aseel"; the full name "Aseel Almanahy" appears in
  the page title, share previews, and footer.
- No profile photo is included; the hero relies on typography and colour. A photo can be added
  later without changing the structure.
- No email address is published (owner decision 2026-09-30): LinkedIn messaging is the primary
  contact channel, which also keeps the owner's address away from automated collection.
- The intro's About Me content may mention both degrees and skills only; certifications, awards, and a
  detailed work history are out of scope for this version.
- No Projects section (owner decision 2026-09-30): visitors inspect code through the GitHub
  profile linked in Contact.
- A downloadable résumé is out of scope for this version; visitors wanting a full work history
  use the LinkedIn link.
- The Experience narrative names no employer or program (only the owner's university) and
  gives no dates; visitors who want a detailed work history use the LinkedIn link.
- Remembering the theme choice uses only the visitor's own browser storage — no cookies,
  accounts, analytics, or data sent anywhere.
- English only; no internationalization in this version.
- The site is hosted as a static page (per the project constitution); there is no server-side
  processing, contact form, or content management system.
- Supported browsers: current and previous major versions of Chrome, Edge, Firefox, and Safari
  (desktop and mobile).
