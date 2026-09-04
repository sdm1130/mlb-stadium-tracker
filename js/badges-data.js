/*
  Badge definitions. Each badge has:
    id, name, desc, check(ctx) -> boolean   (ctx = { visitedStadiums: [stadium,...], gameCount })
  Icon is either:
    icon: "🏆"                              — an emoji glyph, or
    monogram: "AL", chipColor: "#..."       — a colored monogram chip (used for league/division badges)
*/

const WEST_COAST_STATES = ["CA", "WA", "OR"];
const EAST_COAST_STATES = ["NY", "MA", "MD", "PA", "FL", "DC", "NJ"];

const BADGES = [
  {
    id: "first-park",
    icon: "🥉",
    name: "First Ballpark",
    desc: "Visit your first MLB ballpark.",
    check: ctx => ctx.visitedStadiums.length >= 1
  },
  {
    id: "five-parks",
    icon: "🥈",
    name: "Five Parks",
    desc: "Visit 5 different ballparks.",
    check: ctx => ctx.visitedStadiums.length >= 5
  },
  {
    id: "ten-parks",
    icon: "🥇",
    name: "Ten Parks",
    desc: "Visit 10 different ballparks.",
    check: ctx => ctx.visitedStadiums.length >= 10
  },
  {
    id: "fifteen-parks",
    icon: "🏆",
    name: "Halfway There",
    desc: "Visit 15 different ballparks.",
    check: ctx => ctx.visitedStadiums.length >= 15
  },
  {
    id: "twenty-parks",
    icon: "🎖️",
    name: "Twenty Parks",
    desc: "Visit 20 different ballparks.",
    check: ctx => ctx.visitedStadiums.length >= 20
  },
  {
    id: "all-parks",
    icon: "🏅",
    name: "Ballpark Legend",
    desc: "Visit all 30 MLB ballparks.",
    check: ctx => ctx.visitedStadiums.length >= 30
  },
  {
    id: "al-east",
    monogram: "ALE",
    chipColor: "#1D4ED8",
    name: "AL East Explorer",
    desc: "Visit every ballpark in the AL East.",
    check: ctx => divisionComplete(ctx, "AL East")
  },
  {
    id: "al-central",
    monogram: "ALC",
    chipColor: "#C2410C",
    name: "AL Central Explorer",
    desc: "Visit every ballpark in the AL Central.",
    check: ctx => divisionComplete(ctx, "AL Central")
  },
  {
    id: "al-west",
    monogram: "ALW",
    chipColor: "#0F766E",
    name: "AL West Explorer",
    desc: "Visit every ballpark in the AL West.",
    check: ctx => divisionComplete(ctx, "AL West")
  },
  {
    id: "nl-east",
    monogram: "NLE",
    chipColor: "#B3261E",
    name: "NL East Explorer",
    desc: "Visit every ballpark in the NL East.",
    check: ctx => divisionComplete(ctx, "NL East")
  },
  {
    id: "nl-central",
    monogram: "NLC",
    chipColor: "#A16207",
    name: "NL Central Explorer",
    desc: "Visit every ballpark in the NL Central.",
    check: ctx => divisionComplete(ctx, "NL Central")
  },
  {
    id: "nl-west",
    monogram: "NLW",
    chipColor: "#6D28D9",
    name: "NL West Explorer",
    desc: "Visit every ballpark in the NL West.",
    check: ctx => divisionComplete(ctx, "NL West")
  },
  {
    id: "al-complete",
    monogram: "AL",
    chipColor: "#0C2340",
    name: "American League Champ",
    desc: "Visit all 15 American League ballparks.",
    check: ctx => leagueComplete(ctx, "AL")
  },
  {
    id: "nl-complete",
    monogram: "NL",
    chipColor: "#0C2340",
    name: "National League Champ",
    desc: "Visit all 15 National League ballparks.",
    check: ctx => leagueComplete(ctx, "NL")
  },
  {
    id: "coast-to-coast",
    icon: "🌎",
    name: "Coast to Coast",
    desc: "Visit a ballpark on the West Coast and the East Coast.",
    check: ctx => {
      const states = ctx.visitedStadiums.map(s => s.state);
      return states.some(s => WEST_COAST_STATES.includes(s)) &&
             states.some(s => EAST_COAST_STATES.includes(s));
    }
  },
  {
    id: "five-states",
    icon: "🧭",
    name: "Road Tripper",
    desc: "Visit ballparks in 5 different states.",
    check: ctx => new Set(ctx.visitedStadiums.map(s => s.state)).size >= 5
  },
  {
    id: "roof-collector",
    icon: "🏟️",
    name: "Roof Collector",
    desc: "Visit an open-air park, a dome, and a retractable-roof park.",
    check: ctx => {
      const roofs = new Set(ctx.visitedStadiums.map(s => s.roofType));
      const hasOpen = [...roofs].some(r => r.includes("Open"));
      const hasDome = [...roofs].some(r => r.includes("Dome"));
      const hasRetractable = [...roofs].some(r => r.includes("Retractable"));
      return hasOpen && hasDome && hasRetractable;
    }
  },
  {
    id: "ten-games",
    icon: "🎟️",
    name: "Season Ticket Holder",
    desc: "Log 10 games attended.",
    check: ctx => ctx.gameCount >= 10
  },
  {
    id: "old-school",
    icon: "🕰️",
    name: "History Buff",
    desc: "Visit a ballpark that opened before 1970.",
    check: ctx => ctx.visitedStadiums.some(s => s.opened < 1970)
  },
  {
    id: "brand-new",
    icon: "🆕",
    name: "Grand Opening",
    desc: "Visit a ballpark that opened in 2010 or later.",
    check: ctx => ctx.visitedStadiums.some(s => s.opened >= 2010)
  }
];

function divisionComplete(ctx, division) {
  const total = STADIUMS.filter(s => s.division === division).length;
  const visited = ctx.visitedStadiums.filter(s => s.division === division).length;
  return total > 0 && visited >= total;
}

function leagueComplete(ctx, league) {
  const total = STADIUMS.filter(s => s.league === league).length;
  const visited = ctx.visitedStadiums.filter(s => s.league === league).length;
  return total > 0 && visited >= total;
}
