/** Survivor 51 remaining after Ep 1. First boot: Aaliyah Puglia (Toka) 6-2 vs Jenna, Day 3. */
export const SEASON = {
  number: 51,
  title: "The Open Era",
  premiere: "2026-09-23",
  nextEpisode: { number: 2, title: "Weaponized Honesty", airs: "Wed Sep 30, 2026 8pm ET" },
  location: "Mamanuca Islands, Fiji",
  prize: "$1,000,000",
  firstBoot: {
    name: "Aaliyah Puglia",
    age: 24,
    hometown: "Gloucester City, NJ / Providence, RI",
    occupation: "Chef",
    tribe: "Toka",
    votes: "6-2 vs Jenna Doore",
    day: 3,
  },
};

export const SCORING = {
  surviveEpisode: 8,
  idolFound: 15,
  idolPlayedCorrectly: 12,
  advantageFound: 10,
  individualImmunity: 12,
  tribeImmunity: 3,
  rewardWin: 4,
  votesAgainst: -2,
  shotInTheDark: 1,
  lastStandingBonus: 50,
  soleSurvivor: 40,
};

const S = { survived: true, tribeImm: true, idol: 0, adv: 0, votes: 0 };
const T = { survived: true, tribeImm: false, idol: 0, adv: 0, votes: 0 };

export const CASTAWAYS = [
  { id: "alexis", name: "Alexis Levine", age: 34, home: "Atlanta, GA", job: "Criminal defense attorney", tribe: "Savu", status: "active", facts: ["Savu won first immunity. Has not attended Tribal."], week1: { ...S } },
  { id: "ana", name: "Ana Sani", age: 34, home: "Toronto, ON", job: "Voice actress", tribe: "Savu", status: "active", facts: ["Voice actress (Strawberry Shortcake). Bonded with fellow Canadian Kilby before the split."], week1: { ...S } },
  { id: "brady", name: "Brady Booker", age: 27, home: "Knoxville, TN", job: "Pro wrestler", tribe: "Toka", status: "active", facts: ["Former WWE NXT wrestler. Majority voter vs Aaliyah. Early ally of Devin."], week1: { ...T } },
  { id: "carter", name: "Carter Krull", age: 24, home: "Sioux Falls, SD", job: "Livestock farmer", tribe: "Savu", status: "active", facts: ["Iowa/SD farmer. Safe after Savu immunity."], week1: { ...S } },
  { id: "cristian", name: "Cristian Chavez", age: 26, home: "Salt Lake City, UT", job: "Head of HR", tribe: "Savu", status: "active", facts: ["Season 47 alternate. Mr. Congeniality at Utah State."], week1: { ...S } },
  { id: "kilby", name: "Danny Kilby", age: 30, home: "London, ON", job: "Game designer", tribe: "Toka", status: "active", facts: ["Negotiated starting gear vs Kristin. Voted Aaliyah."], week1: { ...T } },
  { id: "devin", name: "Devin Way", age: 33, home: "Los Angeles, CA", job: "Actor", tribe: "Toka", status: "active", facts: ["Grey's Anatomy actor. Voted Jenna in the 2-vote minority."], week1: { ...T } },
  { id: "eric", name: "Eric Macksoud", age: 34, home: "Windsor Locks, CT", job: "Mental health counselor", tribe: "Savu", status: "active", facts: ["Safe on Savu after first immunity."], week1: { ...S } },
  { id: "jelly", name: "Angelica Jelly Loblack", age: 29, home: "Bloomington, IN", job: "Sociology professor", tribe: "Toka", status: "active", facts: ["Pregame five with Aaliyah/Devin. Voted Jenna (minority)."], week1: { ...T } },
  { id: "jenna", name: "Jenna Doore", age: 30, home: "Toledo, OH", job: "Wedding photographer", tribe: "Toka", status: "active", facts: ["Received 2 votes. Played Shot in the Dark, not safe. Survived 6-2."], week1: { survived: true, tribeImm: false, idol: 0, adv: 0, votes: 2, sitd: true } },
  { id: "kristin", name: "Kristin Flickinger", age: 49, home: "Santa Barbara, CA", job: "Crisis management", tribe: "Savu", status: "active", facts: ["Oldest castaway. Negotiated gear for Savu. Close with Sharonda."], week1: { ...S } },
  { id: "lewis", name: "Lewis Kelly", age: 28, home: "Corozal, PR", job: "Farmer", tribe: "Toka", status: "active", facts: ["Irish farmer in PR. Volunteered for Exile. Missed first IC/Tribal. Failed mast-chop idol."], week1: { survived: true, tribeImm: false, idol: 0, adv: 0, votes: 0, exile: true } },
  { id: "linnea", name: "Linnea Capobianco", age: 25, home: "Jersey City, NJ", job: "Entrepreneur", tribe: "Savu", status: "active", facts: ["NJ entrepreneur. Safe on Savu."], week1: { ...S } },
  { id: "maggie", name: "Maggie Nestor", age: 40, home: "Charles Town, WV", job: "Farmer", tribe: "Toka", status: "active", facts: ["WV farmer. Majority voter vs Aaliyah."], week1: { ...T } },
  { id: "mike", name: "Mike Pinsky", age: 32, home: "New York City, NY", job: "Baseball executive", tribe: "Toka", status: "active", facts: ["Yankees baseball ops. Majority voter at first Tribal."], week1: { ...T } },
  { id: "ori", name: "Ori Jean-Charles", age: 27, home: "Spring Valley, NY", job: "Personal trainer", tribe: "Savu", status: "active", facts: ["Model/fitness coach. Pregame ties across the tribe split."], week1: { ...S } },
  { id: "patt", name: "Patt Cannaday", age: 33, home: "Washington, DC", job: "Federal prosecutor", tribe: "Toka", status: "active", facts: ["Federal prosecutor. Aligned with Jenna. Voted Aaliyah."], week1: { ...T } },
  { id: "rob", name: "Rob Antonson", age: 40, home: "Cumberland, RI", job: "Airline gate agent", tribe: "Savu", status: "active", facts: ["JetBlue gate agent. Found a no-strings idol in a Savu tree on Day 3, good to Final 5."], week1: { survived: true, tribeImm: true, idol: 1, adv: 0, votes: 0 } },
  { id: "sharonda", name: "Sharonda Cox", age: 34, home: "Richmond, KY", job: "Resident OBGYN", tribe: "Savu", status: "active", facts: ["OBGYN resident. Connected with Kristin on the beach."], week1: { ...S } },
  { id: "thienan", name: "Thien An Nguyen", age: 24, home: "Fort Worth, TX", job: "Medical student", tribe: "Toka", status: "active", facts: ["Medical student. Voted Aaliyah with Toka majority."], week1: { ...T } },
];

export function scoreCastaway(c) {
  const w = c.week1 || {};
  let pts = 0;
  if (w.survived) pts += SCORING.surviveEpisode;
  if (w.tribeImm) pts += SCORING.tribeImmunity;
  if (w.idol) pts += SCORING.idolFound * w.idol;
  if (w.adv) pts += SCORING.advantageFound * w.adv;
  if (w.votes) pts += SCORING.votesAgainst * w.votes;
  if (w.sitd) pts += SCORING.shotInTheDark;
  return pts;
}
