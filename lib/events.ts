export type EventStatus = "open" | "closing-soon" | "full";

export const EVENT_STATUS_LABELS: Record<EventStatus, string> = {
  open: "Registrations open",
  "closing-soon": "Closing soon",
  full: "Full",
};

export type EventTimelineItem = {
  time: string;
  activity: string;
  instruction?: string;
};

export type EventCoordinator = {
  name: string;
  phone?: string;
};

export type FestDefinition = {
  name: string;
  tagline: string;
  startDate: string;
  endDate: string;
  venue: string;
  address: string;
  mapLink: string;
  organizer: string;
  contactEmail: string;
  whatsappLink: string;
  registrationDeadline: string;
  prizePool: string;
  about: string;
  schedule: { id: string; label: string; date: string; entries: { time: string; eventId: string; activity: string }[] }[];
  faq: { question: string; answer: string }[];
};

export type EventDefinition = {
  id: string;
  slug: string;
  number: string;
  name: string;
  shortName: string;
  accentColor: string;
  softAccent: string;
  categoryLabel: string;
  tagline: string;
  plainDescription: string;
  eligibility: string;
  skillLevel: string;
  format: string;
  teamSize: string;
  minTeamSize: number;
  maxTeamSize: number;
  fee: string;
  prize: string;
  deadline: string;
  status: EventStatus;
  rules: string[];
  judgingCriteria: string[];
  timeline: EventTimelineItem[];
  coordinators: EventCoordinator[];
  gameName?: string;
  hook: string;
  details: string[];
  registrationIntro: string;
  registrationTracks: boolean;
  eventDate?: string;
};

// Replace bracketed values only when the corresponding official brief is confirmed.
export const FEST: FestDefinition = {
  name: "Techsiege 2026",
  tagline: "Five ways to show up. Five arenas. Zero room to play safe.",
  startDate: "2026-11-17T09:00:00+05:30",
  endDate: "2026-11-18T18:00:00+05:30",
  venue: "Alva's Institute of Engineering and Technology",
  address: "Alva's Institute of Engineering and Technology, Mijar, Moodbidri",
  mapLink: "https://maps.app.goo.gl/HbmCMgmncAud9Az37",
  organizer: "CSE (IoT, Cybersecurity and Blockchain Technology)",
  contactEmail: "cynex.depticb@gmail.com",
  whatsappLink: "https://wa.me/917349097923",
  registrationDeadline: "12 Nov",
  prizePool: "₹85,000",
  about: "Techsiege brings builders, problem-solvers, engineers, and competitors together at Alva's Institute of Engineering and Technology for a focused campus competition festival.",
  schedule: [
    { id: "day-1", label: "Day 1", date: "17 Nov", entries: [{ time: "11:00 AM", eventId: "hackathon", activity: "Hackathon arena" }] },
    { id: "day-2", label: "Day 2", date: "18 Nov", entries: [{ time: "10:30 AM", eventId: "ctf", activity: "CTF arena" }, { time: "10:30 AM", eventId: "circuit-breaker", activity: "Circuit Breaker arena" }, { time: "10:30 AM", eventId: "crack-the-code", activity: "Crack the Code arena" }, { time: "10:30 AM", eventId: "e-sports", activity: "E-sports arena" }] },
  ],
  faq: [
    { question: "Can I join multiple events?", answer: "Yes, if the individual event schedules do not overlap. [CONFIRM] final scheduling before registering for more than one arena." },
    { question: "Can students from other colleges participate?", answer: "Yes, registrations are open to students from other colleges. [CONFIRM] any event-specific eligibility notes in the mission brief." },
    { question: "Is accommodation provided?", answer: "Accommodation is limited and allocated on a priority basis. Please contact the organisers for availability and further details." },
    { question: "Will there be certificates?", answer: "Yes. Certificates will be provided to participants." },
    { question: "What should I bring?", answer: "Bring your college ID card, laptop, charger, and any other essentials you need to work through the event without interruption." },
    { question: "What if I do not have a team?", answer: "Make one. Collaborating with people brings out the best in us—find your crew and enter the arena together." },
    { question: "Are refreshments provided?", answer: "Yes. Refreshments will be provided during the fest." },
    { question: "How do I pay?", answer: "Use the UPI QR code in the registration form, enter the transaction ID, and upload the payment receipt for verification." },
  ],
};

export const EVENTS: EventDefinition[] = [
  {
    id: "hackathon",
    slug: "hackathon",
    number: "01",
    name: "Hackathon",
    shortName: "Hackathon",
    accentColor: "#42e8c7",
    softAccent: "rgba(66,232,199,.14)",
    categoryLabel: "Build",
    tagline: "Ideas are easy. Execution is everything.",
    plainDescription: "A focused build arena for teams ready to turn a sharp idea into a working experience.",
    eligibility: "All branches",
    skillLevel: "[SKILL LEVEL]",
    format: "Team · On-campus",
    eventDate: "18 Nov",
    teamSize: "2–4 members",
    minTeamSize: 2,
    maxTeamSize: 4,
    fee: "₹600 per team",
    prize: "₹40,000",
    deadline: "12 Nov",
    status: "open",
    rules: [
      "Problem statements will be revealed on the event day.",
      "All code, system design, solutions, and ideas must be created by the team itself during the event.",
      "No outside help may be taken.",
      "Use of AI tools is allowed.",
      "Teams must act ethically, respect fellow participants, and avoid plagiarism, harassment, or disruptive behaviour.",
      "All submissions must represent good-faith work. Organizers may review work or disqualify teams for rule violations.",
    ],
    judgingCriteria: [
      "Working prototype",
      "Feasible solution",
      "Appropriate tech stack",
      "Clear explanation",
      "Presentation",
    ],
    timeline: [
      { time: "17 Nov · 11:00 AM", activity: "Checkpoint 1 — launch", instruction: "Read the problem statement, agree on a solution direction, assign team roles, and begin your first working plan." },
      { time: "17 Nov · 05:00 PM", activity: "Checkpoint 2 — working core", instruction: "Show the core user flow or technical proof of concept. Your team should be able to explain the architecture and what already works." },
      { time: "17 Nov · 11:00 PM", activity: "Checkpoint 3 — test and refine", instruction: "Integrate the main pieces, test the critical path, and document the decisions that make your solution feasible." },
      { time: "18 Nov · 05:00 AM", activity: "Checkpoint 4 — demo readiness", instruction: "Prepare the final build, validate the demo flow, and organise the explanation and presentation your team will deliver." },
    ],
    coordinators: [{ name: "Karthik P" }, { name: "Santhosh Gowda" }],
    hook: "Build something worth shipping.",
    details: ["Team size: 2–4 members", "24-hour offline build", "Entry fee: ₹600 per team"],
    registrationIntro: "Bring a team, choose a problem space, and build an agentic system that earns its place in the world.",
    registrationTracks: true,
  },
  {
    id: "ctf",
    slug: "ctf",
    number: "02",
    name: "CTF",
    shortName: "CTF",
    accentColor: "#ff8a5b",
    softAccent: "rgba(255,138,91,.14)",
    categoryLabel: "Defend",
    tagline: "Every system has a weakness. Find it.",
    plainDescription: "A Jeopardy-style capture-the-flag arena with challenges in web security, SOC, cryptography, networking, forensics, OSINT, reverse engineering, and more.",
    eligibility: "All branches",
    skillLevel: "[SKILL LEVEL]",
    format: "Team · On-campus",
    teamSize: "2–4 members",
    minTeamSize: 2,
    maxTeamSize: 4,
    fee: "₹500 per team",
    prize: "₹25,000",
    deadline: "12 Nov",
    status: "open",
    rules: [
      "This is a Jeopardy-style CTF: solve independent challenges, capture flags, and submit them on the official scoreboard.",
      "Only interact with targets, services, files, and infrastructure explicitly provided for this event. Do not attack the event platform, other teams, organisers, or any external system.",
      "Each team must use its own account and submit flags only through the official scoreboard. Sharing flags, solutions, credentials, or hints with other teams is prohibited.",
      "Brute-forcing, denial-of-service activity, automated scanning, or traffic that affects platform availability is not allowed unless a challenge explicitly permits it.",
      "Do not tamper with challenge infrastructure, modify shared files, or attempt to access another team's workspace or account.",
      "Internet research and standard security tools are permitted unless a challenge states otherwise. Follow all organiser instructions and challenge-specific rules.",
      "Organiser decisions on flag validity, scoring, tie-breaks, and disqualification are final. Play fairly and report unintended vulnerabilities to the organisers immediately.",
    ],
    judgingCriteria: [
      "Scoreboard points — challenges are weighted by difficulty and awarded for valid flags.",
      "Challenge coverage — successful work across categories such as web, SOC, cryptography, networking, forensics, OSINT, and reverse engineering.",
      "Accuracy — flags must be submitted correctly through the official platform.",
      "Time to solve — for tied scores, the team that reaches the score first ranks higher.",
      "Fair play — violations of the rules can lead to point deductions or disqualification.",
    ],
    timeline: [],
    coordinators: [{ name: "Shrinidhi V Hegde" }, { name: "Shreyash Talwar" }],
    hook: "Read the system. Break the pattern.",
    details: ["Team size: 2–4 members", "Jeopardy-style security challenges", "Entry fee: ₹500 per team"],
    registrationIntro: "Assemble the sharpest eyes in the room for a Jeopardy-style CTF spanning web, SOC, cryptography, networking, and more.",
    registrationTracks: false,
  },
  {
    id: "circuit-breaker",
    slug: "circuit-breaker",
    number: "03",
    name: "Circuit Breaker",
    shortName: "Circuit Breaker",
    accentColor: "#d7ef61",
    softAccent: "rgba(215,239,97,.14)",
    categoryLabel: "Engineer",
    tagline: "Think fast. Wire smart. Make it work.",
    plainDescription: "A hands-on engineering challenge where quick decisions, clean thinking, and resilient circuits meet.",
    eligibility: "All branches",
    skillLevel: "[SKILL LEVEL]",
    format: "Team · On-campus",
    teamSize: "2 members",
    minTeamSize: 2,
    maxTeamSize: 2,
    fee: "₹200 per team",
    prize: "₹6,000",
    deadline: "12 Nov",
    status: "open",
    rules: [],
    judgingCriteria: [],
    timeline: [],
    coordinators: [{ name: "Chavan Bhat" }, { name: "Roshan Warkar" }],
    hook: "Make the right connection.",
    details: ["Team size: 2 members", "Hardware details announced soon", "Entry fee: ₹200 per team"],
    registrationIntro: "Get your crew on the grid. Tell us who is entering the engineering arena and we’ll send the confirmed brief to your team lead.",
    registrationTracks: false,
  },
  {
    id: "crack-the-code",
    slug: "crack-the-code",
    number: "04",
    name: "Crack the Code",
    shortName: "Crack the Code",
    accentColor: "#b89cff",
    softAccent: "rgba(184,156,255,.14)",
    categoryLabel: "Solve",
    tagline: "The clock is ticking. Can you find the answer?",
    plainDescription: "A timed problem-solving face-off for people who enjoy the clean click of a hard problem giving way.",
    eligibility: "All branches",
    skillLevel: "[SKILL LEVEL]",
    format: "Team · On-campus",
    teamSize: "2 members",
    minTeamSize: 2,
    maxTeamSize: 2,
    fee: "₹200 per team",
    prize: "₹6,000",
    deadline: "12 Nov",
    status: "open",
    rules: [],
    judgingCriteria: [],
    timeline: [],
    coordinators: [{ name: "Arya B Shetty" }],
    hook: "Solve under pressure.",
    details: ["Team size: 2 members", "Timed problem-solving arena", "Entry fee: ₹200 per team"],
    registrationIntro: "Lock in your solving squad. Registration reserves your team’s place while the final difficulty bands and rules are prepared.",
    registrationTracks: false,
  },
  {
    id: "e-sports",
    slug: "e-sports",
    number: "05",
    name: "E-sports",
    shortName: "E-sports",
    accentColor: "#ff6fae",
    softAccent: "rgba(255,111,174,.14)",
    categoryLabel: "Compete",
    tagline: "Queue up. Lock in. Take the win.",
    plainDescription: "A live competitive bracket built for focus, teamwork, and the kind of finish people remember.",
    eligibility: "All branches",
    skillLevel: "[SKILL LEVEL]",
    format: "Team · On-campus",
    teamSize: "2–4 members",
    minTeamSize: 2,
    maxTeamSize: 4,
    fee: "₹200 per team",
    prize: "₹5,000",
    deadline: "12 Nov",
    status: "open",
    rules: [],
    judgingCriteria: [],
    timeline: [],
    coordinators: [{ name: "Nandhishwar" }],
    gameName: "[GAME NAME]",
    hook: "Bring the squad. Own the moment.",
    details: ["Date: 18 Nov", "Team size: 2–4 members", "Game title announced soon", "Entry fee: ₹200 per team"],
    registrationIntro: "Bring the squad. Register your roster now and we’ll follow up with the game title, bracket rules, and match schedule.",
    registrationTracks: false,
  },
];

export function getEvent(slug: string) {
  return EVENTS.find((event) => event.slug === slug);
}
