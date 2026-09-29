export const CAST = [
  { id:"alexis", name:"Alexis Levine", age:34, home:"Atlanta, GA", job:"Criminal defense attorney", tribe:"Savu", facts:["Savu won first immunity."], w1:{survived:1, tribeImm:1, idol:0, votes:0} },
  { id:"ana", name:"Ana Sani", age:34, home:"Toronto, ON", job:"Voice actress", tribe:"Savu", facts:["Bonded with Kilby before the split."], w1:{survived:1, tribeImm:1, idol:0, votes:0} },
  { id:"brady", name:"Brady Booker", age:27, home:"Knoxville, TN", job:"Pro wrestler", tribe:"Toka", facts:["Majority voter vs Aaliyah."], w1:{survived:1, tribeImm:0, idol:0, votes:0} },
  { id:"carter", name:"Carter Krull", age:24, home:"Sioux Falls, SD", job:"Livestock farmer", tribe:"Savu", facts:["Safe after Savu immunity."], w1:{survived:1, tribeImm:1, idol:0, votes:0} },
  { id:"cristian", name:"Cristian Chavez", age:26, home:"Salt Lake City, UT", job:"Head of HR", tribe:"Savu", facts:["Season 47 alternate."], w1:{survived:1, tribeImm:1, idol:0, votes:0} },
  { id:"kilby", name:"Danny Kilby", age:30, home:"London, ON", job:"Game designer", tribe:"Toka", facts:["Voted Aaliyah."], w1:{survived:1, tribeImm:0, idol:0, votes:0} },
  { id:"devin", name:"Devin Way", age:33, home:"Los Angeles, CA", job:"Actor", tribe:"Toka", facts:["Voted Jenna in the minority."], w1:{survived:1, tribeImm:0, idol:0, votes:0} },
  { id:"eric", name:"Eric Macksoud", age:34, home:"Windsor Locks, CT", job:"Mental health counselor", tribe:"Savu", facts:["Safe on Savu."], w1:{survived:1, tribeImm:1, idol:0, votes:0} },
  { id:"jelly", name:"Angelica Jelly Loblack", age:29, home:"Bloomington, IN", job:"Sociology professor", tribe:"Toka", facts:["Voted Jenna (minority)."], w1:{survived:1, tribeImm:0, idol:0, votes:0} },
  { id:"jenna", name:"Jenna Doore", age:30, home:"Toledo, OH", job:"Wedding photographer", tribe:"Toka", facts:["2 votes + Shot in the Dark. Survived 6-2."], w1:{survived:1, tribeImm:0, idol:0, votes:2, sitd:1} },
  { id:"kristin", name:"Kristin Flickinger", age:49, home:"Santa Barbara, CA", job:"Crisis management", tribe:"Savu", facts:["Oldest castaway."], w1:{survived:1, tribeImm:1, idol:0, votes:0} },
  { id:"lewis", name:"Lewis Kelly", age:28, home:"Corozal, PR", job:"Farmer", tribe:"Toka", facts:["Exile. Failed idol chop."], w1:{survived:1, tribeImm:0, idol:0, votes:0} },
  { id:"linnea", name:"Linnea Capobianco", age:25, home:"Jersey City, NJ", job:"Entrepreneur", tribe:"Savu", facts:["Safe on Savu."], w1:{survived:1, tribeImm:1, idol:0, votes:0} },
  { id:"maggie", name:"Maggie Nestor", age:40, home:"Charles Town, WV", job:"Farmer", tribe:"Toka", facts:["Voted Aaliyah."], w1:{survived:1, tribeImm:0, idol:0, votes:0} },
  { id:"mike", name:"Mike Pinsky", age:32, home:"New York City, NY", job:"Baseball executive", tribe:"Toka", facts:["Yankees baseball ops."], w1:{survived:1, tribeImm:0, idol:0, votes:0} },
  { id:"ori", name:"Ori Jean-Charles", age:27, home:"Spring Valley, NY", job:"Personal trainer", tribe:"Savu", facts:["Pregame ties across the split."], w1:{survived:1, tribeImm:1, idol:0, votes:0} },
  { id:"patt", name:"Patt Cannaday", age:33, home:"Washington, DC", job:"Federal prosecutor", tribe:"Toka", facts:["Aligned with Jenna."], w1:{survived:1, tribeImm:0, idol:0, votes:0} },
  { id:"rob", name:"Rob Antonson", age:40, home:"Cumberland, RI", job:"Airline gate agent", tribe:"Savu", facts:["Found a no-strings idol Day 3."], w1:{survived:1, tribeImm:1, idol:1, votes:0} },
  { id:"sharonda", name:"Sharonda Cox", age:34, home:"Richmond, KY", job:"Resident OBGYN", tribe:"Savu", facts:["Connected with Kristin."], w1:{survived:1, tribeImm:1, idol:0, votes:0} },
  { id:"thienan", name:"Thien An Nguyen", age:24, home:"Fort Worth, TX", job:"Medical student", tribe:"Toka", facts:["Voted Aaliyah with Toka majority."], w1:{survived:1, tribeImm:0, idol:0, votes:0} }
];

export function pts(c) {
  const w = c.w1 || {};
  return (w.survived ? 8 : 0) + (w.tribeImm ? 3 : 0) + (w.idol || 0) * 15 + (w.votes || 0) * -2 + (w.sitd ? 1 : 0);
}

export const MANAGERS = [
  { id: "you", name: "You" },
  { id: "probst", name: "Come On In" },
  { id: "buffalo", name: "Buffalo Ridge" },
  { id: "cirie", name: "Cirie's Couch" },
  { id: "fire", name: "Firemaking FC" },
  { id: "idol", name: "Idol Hunters" },
  { id: "outwit", name: "Outwit United" },
  { id: "snuff", name: "Snuffed Torches" }
];

export const DEFAULT_ROSTERS = {
  you: ["rob", "brady", "jenna"],
  probst: ["kristin", "devin", "thienan"],
  buffalo: ["patt", "linnea"],
  cirie: ["jelly", "carter"],
  fire: ["lewis", "alexis"],
  idol: ["kilby", "sharonda"],
  outwit: ["ana", "mike", "ori"],
  snuff: ["cristian", "maggie", "eric"]
};
