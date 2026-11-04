export type EventDefinition = {
  slug: string;
  number: string;
  name: string;
  shortName: string;
  category: string;
  tagline: string;
  hook: string;
  description: string;
  accent: string;
  softAccent: string;
  details: string[];
  registrationIntro: string;
  registrationTracks: boolean;
};

// Replace the placeholder details and fees here when the event brief is ready.
export const EVENTS: EventDefinition[] = [
  { slug: "hackathon", number: "01", name: "Hackathon", shortName: "Hackathon", category: "Build", tagline: "Ideas are easy. Execution is everything.", hook: "Build something worth shipping.", description: "A focused build arena for teams ready to turn a sharp idea into a working experience.", accent: "#42e8c7", softAccent: "rgba(66,232,199,.14)", details: ["Team size: 2–4 members", "24-hour offline build", "Entry fee: ₹600 per team"], registrationIntro: "Bring a team, choose a problem space, and build an agentic system that earns its place in the world.", registrationTracks: true },
  { slug: "ctf", number: "02", name: "CTF", shortName: "CTF", category: "Defend", tagline: "Every system has a weakness. Find it.", hook: "Read the system. Break the pattern.", description: "A capture-the-flag arena for curious minds who see vulnerabilities as invitations to investigate.", accent: "#ff8a5b", softAccent: "rgba(255,138,91,.14)", details: ["Team size: 2–4 members", "Challenge categories announced soon", "Entry fee: ₹600 per team"], registrationIntro: "Assemble the sharpest eyes in the room. Your team will register now and receive the final challenge brief before the arena opens.", registrationTracks: false },
  { slug: "circuit-breaker", number: "03", name: "Circuit Breaker", shortName: "Circuit Breaker", category: "Engineer", tagline: "Think fast. Wire smart. Make it work.", hook: "Make the right connection.", description: "A hands-on engineering challenge where quick decisions, clean thinking, and resilient circuits meet.", accent: "#d7ef61", softAccent: "rgba(215,239,97,.14)", details: ["Team size: 2–4 members", "Hardware details announced soon", "Entry fee: ₹600 per team"], registrationIntro: "Get your crew on the grid. Tell us who is entering the engineering arena and we’ll send the confirmed brief to your team lead.", registrationTracks: false },
  { slug: "crack-the-code", number: "04", name: "Crack the Code", shortName: "Crack the Code", category: "Solve", tagline: "The clock is ticking. Can you find the answer?", hook: "Solve under pressure.", description: "A timed problem-solving face-off for people who enjoy the clean click of a hard problem giving way.", accent: "#b89cff", softAccent: "rgba(184,156,255,.14)", details: ["Team size: 2–4 members", "Timed problem-solving arena", "Entry fee: ₹600 per team"], registrationIntro: "Lock in your solving squad. Registration reserves your team’s place while the final difficulty bands and rules are prepared.", registrationTracks: false },
  { slug: "e-sports", number: "05", name: "E-sports", shortName: "E-sports", category: "Compete", tagline: "Queue up. Lock in. Take the win.", hook: "Bring the squad. Own the moment.", description: "A live competitive bracket built for focus, teamwork, and the kind of finish people remember.", accent: "#ff6fae", softAccent: "rgba(255,111,174,.14)", details: ["Team size: 2–4 members", "Game title announced soon", "Entry fee: ₹600 per team"], registrationIntro: "Bring the squad. Register your roster now and we’ll follow up with the game title, bracket rules, and match schedule.", registrationTracks: false },
];

export function getEvent(slug: string) { return EVENTS.find((event) => event.slug === slug); }
