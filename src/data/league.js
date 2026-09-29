import { CASTAWAYS, scoreCastaway } from "./castaways";

export const MANAGERS = [
  { id: "you", name: "You", handle: "@torch", isYou: true },
  { id: "probst", name: "Come On In", handle: "@probst" },
  { id: "buffalo", name: "Buffalo Ridge", handle: "@bostonrob" },
  { id: "cirie", name: "Cirie's Couch", handle: "@cirie" },
  { id: "fire", name: "Firemaking FC", handle: "@tony" },
  { id: "idol", name: "Idol Hunters", handle: "@russell" },
  { id: "outwit", name: "Outwit United", handle: "@parvati" },
  { id: "snuff", name: "Snuffed Torches", handle: "@coach" },
];

export const ROSTERS = {
  you: ["rob", "brady", "jenna"],
  probst: ["kristin", "devin", "thienan"],
  buffalo: ["patt", "linnea"],
  cirie: ["jelly", "carter"],
  fire: ["lewis", "alexis"],
  idol: ["kilby", "sharonda"],
  outwit: ["ana", "mike", "ori"],
  snuff: ["cristian", "maggie", "eric"],
};

export const MATCHWEEKS = [
  {
    week: 1,
    label: "MW1 · Ep 1 Permanent Uncertainty",
    locked: true,
    fixtures: [
      ["you", "probst"],
      ["buffalo", "cirie"],
      ["fire", "idol"],
      ["outwit", "snuff"],
    ],
  },
  {
    week: 2,
    label: "MW2 · Ep 2 Weaponized Honesty",
    locked: false,
    fixtures: [
      ["you", "buffalo"],
      ["probst", "fire"],
      ["cirie", "outwit"],
      ["idol", "snuff"],
    ],
  },
  {
    week: 3,
    label: "MW3 · Ep 3",
    locked: false,
    fixtures: [
      ["you", "cirie"],
      ["probst", "idol"],
      ["buffalo", "outwit"],
      ["fire", "snuff"],
    ],
  },
];

export function rosterScore(managerId) {
  const ids = ROSTERS[managerId] || [];
  return ids.reduce((sum, id) => {
    const c = CASTAWAYS.find((x) => x.id === id);
    return sum + (c ? scoreCastaway(c) : 0);
  }, 0);
}

export function fixtureResult(a, b) {
  const sa = rosterScore(a);
  const sb = rosterScore(b);
  if (sa > sb) return { winner: a, loser: b, sa, sb, ptsA: 3, ptsB: 0 };
  if (sb > sa) return { winner: b, loser: a, sa, sb, ptsA: 0, ptsB: 3 };
  return { winner: null, loser: null, sa, sb, ptsA: 1, ptsB: 1 };
}

export function table() {
  const rows = MANAGERS.map((m) => ({
    ...m,
    p: 0,
    w: 0,
    d: 0,
    l: 0,
    gf: 0,
    ga: 0,
    gd: 0,
    pts: 0,
    fantasy: rosterScore(m.id),
  }));
  const byId = Object.fromEntries(rows.map((r) => [r.id, r]));

  MATCHWEEKS.filter((mw) => mw.locked).forEach((mw) => {
    mw.fixtures.forEach(([a, b]) => {
      const r = fixtureResult(a, b);
      byId[a].p += 1;
      byId[b].p += 1;
      byId[a].gf += r.sa;
      byId[a].ga += r.sb;
      byId[b].gf += r.sb;
      byId[b].ga += r.sa;
      if (r.winner === a) {
        byId[a].w += 1;
        byId[b].l += 1;
      } else if (r.winner === b) {
        byId[b].w += 1;
        byId[a].l += 1;
      } else {
        byId[a].d += 1;
        byId[b].d += 1;
      }
      byId[a].pts += r.ptsA;
      byId[b].pts += r.ptsB;
    });
  });

  Object.values(byId).forEach((r) => {
    r.gd = r.gf - r.ga;
  });

  return Object.values(byId).sort((a, b) => {
    if (b.pts !== a.pts) return b.pts - a.pts;
    if (b.gd !== a.gd) return b.gd - a.gd;
    if (b.gf !== a.gf) return b.gf - a.gf;
    return b.fantasy - a.fantasy;
  });
}

export const SEED_TRADES = [
  {
    id: "t1",
    from: "probst",
    to: "you",
    offer: ["thienan"],
    ask: ["jenna"],
    status: "open",
    note: "Jenna is radioactive after 2 votes. Take Thien An instead?",
  },
];

export const SEED_CHAT = [
  {
    id: "c1",
    user: "Come On In",
    text: "Torch is snuffed on Aaliyah. Draft board is LIVE. Who lasts?",
    ts: "Wed 10:12 PM",
  },
  {
    id: "c2",
    user: "Idol Hunters",
    text: "Rob already has a clean idol. That's a 15-pt swing in MW1.",
    ts: "Wed 10:18 PM",
  },
  {
    id: "c3",
    user: "Firemaking FC",
    text: "Taking Lewis as a dart throw. Exile means he has zero social capital.",
    ts: "Wed 10:41 PM",
  },
  {
    id: "c4",
    user: "Cirie's Couch",
    text: "Jelly voted in the minority. She's a sell-high before Toka goes back.",
    ts: "Thu 8:02 AM",
  },
];
