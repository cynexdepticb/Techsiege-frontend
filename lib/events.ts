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
};

// Replace the placeholder details and fees here when the event brief is ready.
export const EVENTS: EventDefinition[] = [
  { slug: "hackathon", number: "01", name: "Hackathon", shortName: "Hackathon", category: "Build", tagline: "Ideas are easy. Execution is everything.", hook: "Build something worth shipping.", description: "A focused build arena for teams ready to turn a sharp idea into a working experience.", accent: "#42e8c7", softAccent: "rgba(66,232,199,.14)", details: ["Format and duration to be announced", "Team size to be announced", "Entry fee to be announced"] },
  { slug: "ctf", number: "02", name: "CTF", shortName: "CTF", category: "Defend", tagline: "Every system has a weakness. Find it.", hook: "Read the system. Break the pattern.", description: "A capture-the-flag arena for curious minds who see vulnerabilities as invitations to investigate.", accent: "#ff8a5b", softAccent: "rgba(255,138,91,.14)", details: ["Challenge categories to be announced", "Individual or team format to be announced", "Entry fee to be announced"] },
  { slug: "circuit-breaker", number: "03", name: "Circuit Breaker", shortName: "Circuit Breaker", category: "Engineer", tagline: "Think fast. Wire smart. Make it work.", hook: "Make the right connection.", description: "A hands-on engineering challenge where quick decisions, clean thinking, and resilient circuits meet.", accent: "#d7ef61", softAccent: "rgba(215,239,97,.14)", details: ["Challenge format to be announced", "Equipment details to be announced", "Entry fee to be announced"] },
  { slug: "crack-the-code", number: "04", name: "Crack the Code", shortName: "Crack the Code", category: "Solve", tagline: "The clock is ticking. Can you find the answer?", hook: "Solve under pressure.", description: "A timed problem-solving face-off for people who enjoy the clean click of a hard problem giving way.", accent: "#b89cff", softAccent: "rgba(184,156,255,.14)", details: ["Difficulty bands to be announced", "Individual or team format to be announced", "Entry fee to be announced"] },
  { slug: "e-sports", number: "05", name: "E-sports", shortName: "E-sports", category: "Compete", tagline: "Queue up. Lock in. Take the win.", hook: "Bring the squad. Own the moment.", description: "A live competitive bracket built for focus, teamwork, and the kind of finish people remember.", accent: "#ff6fae", softAccent: "rgba(255,111,174,.14)", details: ["Game titles to be announced", "Bracket and team size to be announced", "Entry fee to be announced"] },
];

export function getEvent(slug: string) { return EVENTS.find((event) => event.slug === slug); }
