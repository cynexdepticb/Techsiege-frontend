# TechSiege/26 Website — Content Summary

## Purpose

TechSiege/26 is presented as a campus-wide competition festival at AIET,
Mangaluru, in 2026. The public website introduces five separate event arenas.
Each arena has its own page and will eventually have its own rules, entry fee,
eligibility requirements, and registration workflow.

The current visual direction is **Arcade / Game Night**: event selection screens,
player-status labels, mission details, cyan grid lines, yellow/orange arcade
accents, monospace HUD text, and challenge-terminal states.

## Global website content

- Brand: TECHSIEGE//26
- Location label: AIET / MANGALURU / 2026
- Primary headline: **Five ways to show up.**
- Supporting message: TechSiege is a campus-wide series of build, solve,
  defend, engineer, and compete arenas.
- Primary navigation: Event select
- Homepage CTA: Select your event
- Event index label: Player 01 / 05
- Footer: TECHSIEGE/26 and Event details opening soon

## Page map

### / — Main landing page

The landing page acts as the event-selection screen.

It contains:

- Arcade-themed header with the TechSiege/26 wordmark.
- Player 01 / Online status indicator.
- Hero label for AIET, Mangaluru, and 2026.
- Main headline: Five ways to show up.
- Introductory copy explaining the five competition arenas.
- Select your event CTA that scrolls to the event section.
- Event-select panel listing all five events with event number, event name,
  event accent color, and a START hover state.
- Programme section titled Choose your arena.
- Individual event cards with level number, event category, short description,
  Details coming soon, and Press enter to view.
- Three-step explanation:
  1. Pick — choose an arena.
  2. Read — understand the rules.
  3. Enter — register separately for that event.

### /events/hackathon — Hackathon event page

- Category: Build
- Hook: Make something that earns its place in the world.
- Description: A focused build arena for teams with a sharp problem, a working
  idea, and the nerve to ship.
- Pending details: format and duration, team size, and entry fee.
- CTA: Registration opens soon
- Mission status: Pending brief

### /events/ctf — CTF event page

- Category: Defend
- Hook: Find the crack before someone else does.
- Description: A capture-the-flag arena for curious minds who see systems as
  puzzles and failure as a clue.
- Pending details: challenge categories, individual or team format, and entry fee.
- CTA: Registration opens soon
- Mission status: Pending brief

### /events/circuit-breaker — Circuit Breaker event page

- Category: Engineer
- Hook: Put your intuition under voltage.
- Description: A hands-on engineering challenge where quick decisions, clean
  thinking, and resilient circuits meet.
- Pending details: challenge format, equipment details, and entry fee.
- CTA: Registration opens soon
- Mission status: Pending brief

### /events/crack-the-code — Crack the Code event page

- Category: Solve
- Hook: The answer is hiding in plain sight.
- Description: A timed problem-solving face-off for people who enjoy the clean
  click of a hard problem giving way.
- Pending details: difficulty bands, individual or team format, and entry fee.
- CTA: Registration opens soon
- Mission status: Pending brief

### /events/e-sports — E-sports event page

- Category: Compete
- Hook: Bring the squad. Own the moment.
- Description: A live competitive bracket built for focus, teamwork, and the
  kind of finish people remember.
- Pending details: game titles, bracket and team size, and entry fee.
- CTA: Registration opens soon
- Mission status: Pending brief

## Registration pages

Each event has a separate registration-terminal route:

- /events/hackathon/register
- /events/ctf/register
- /events/circuit-breaker/register
- /events/crack-the-code/register
- /events/e-sports/register

Every registration page currently contains:

- Event number and event name
- Registration terminal label
- Access not ready heading
- Message explaining that the event has its own fee, rules, and eligibility
- Status badge: Status: offline
- Status badge: Fee: pending
- Link back to the relevant event mission page

These are intentionally placeholder states. They must be replaced with real
forms before public registration opens.

## Shared page elements

### Header

The shared header is used on the homepage, event pages, and registration pages.
It contains:

- TECHSIEGE//26 logo treatment
- Player 01 / Online label on larger screens
- Event select link back to the homepage event index

### Event data source

All event content is centralized in lib/events.ts. Each event currently defines:

- slug
- event number
- full and short names
- category
- hook
- description
- accent colors
- placeholder detail strings

When the final briefs arrive, update this file first. The event pages and cards
consume the same data automatically.

## Pending information required before registration opens

For each event, the following content is still required:

- Official event description
- Date and time
- Venue or room
- Eligibility rules
- Individual/team participation format
- Minimum and maximum team size
- Entry fee
- Payment instructions or payment gateway
- Registration form fields
- Registration deadline
- Event rules
- Prize details
- Contact person or support email
- Confirmation and ticket process

The project currently lists five events even though the earlier brief mentioned
six. A sixth event name and content still need to be provided.

## Technical structure

- Frontend app: Next.js under frontend/
- Backend app: sibling backend/ service
- Public frontend routes are UI-only.
- The old single-event /register and /admin frontend pages were removed.
- The old single-hackathon landing components were removed.
- TypeScript currently passes for the frontend.
