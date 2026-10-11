// "Meet the two of you": the spotlight at the top of a relationship reading. The pair read as
// one, from both people's Suns, Moons and planets, Life Paths and Chinese animals together:
// what you bring each other, where you click, where you rub and your story together, then one
// Do and one Don't for each of you (picked from the Start and stop tips in pair-reading.ts).
// Wordings are picked from both birth dates, so the same pair always reads the same and two
// pairs with the same signs rarely do. Signs and animals are never joined into one name.

import type { Sign } from "../data/astrology.ts";
import type { Tone } from "../data/synastry.ts";
import { LINK_FEEL } from "../data/synastry.ts";
import { NUMBER_FAMILIES, NUMBER_MEANINGS } from "../data/numbers.ts";
import { SIGN_SPOT, LIFE_PATH_SPOT } from "../data/spotlight.ts";
import { LINK_PHRASE, YEAR_PACE } from "../data/pair-reading.ts";
import {
  PAIR_NOUN, PAIR_ADJ, SUN_GIVES, ANIMAL_SIDES, ANIMAL_VERB, CLICK_PLANET, RUB_PLANET, HANDLE, MOON_MEET, SAME_MOON,
  ANIMAL_CLICK, ANIMAL_RUB, ELEMENT_FEED, ELEMENT_CHECK, FAMILY_CLICK, SAME_LIFE_PATH, FAMILY_RUB, NO_CLICK, NO_RUB,
  STORY, STORY_TONE, MOON_OPPOSITE, MOON_GIVES, CLICK_USE, VENUS_SHOWS, YEAR_STORY,
} from "../data/pair-spotlight.ts";
import { pairUp, signLink, type PersonalSigns, type PlanetPair } from "./synastry.ts";
import type { Comparison } from "./compat.ts";
import type { StartStop } from "./pair-reading.ts";

export interface PairSpotlightInput {
  /** Both birth dates and the relationship id: together they choose the wording. */
  seed: string;
  tone: Tone;
  mine: PersonalSigns;
  theirs: PersonalSigns;
  c: Comparison;
  /** The other person as an object: "Sam" or "your partner". Already escaped for HTML. */
  them: string;
  /** Both people's Start and stop tips, from pairReading. */
  startStop: { me: StartStop; them: StartStop };
}

export interface DoDont { do: string; dont: string }

export interface PairSpotlightText {
  /** "The Earth Dog with the Fire Goat" */
  names: string;
  /** "the Steady Flame" */
  title: string;
  /** Short chips: "Leo and Aries Suns", "Life Paths 3 and 8". */
  facts: string[];
  sections: { heading: string; text: string }[];
  closing: string;
  doDont: { me: DoDont; them: DoDont };
}

/** FNV-1a, so a seed and a salt give the same pick every time. */
function hash(s: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 0x01000193);
  return h >>> 0;
}

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
const an = (word: string) => (/^[AEIOU]/i.test(word) ? `an ${word}` : `a ${word}`);
const poss = (who: string) => (who.endsWith("s") ? `${who}'` : `${who}'s`);
const fill = (t: string, vars: Record<string, string>) => t.replace(/\{(\w+)\}/g, (m, k) => vars[k] ?? m);
const keyOf = (a: string, b: string) => [a, b].sort().join("|");
const famOf = (n: number) => NUMBER_FAMILIES.find((f) => f.members.includes(n))!.name;
const kw = (n: number) => NUMBER_MEANINGS[n].keyword.replace(/^The /, "");

type Side = "sun" | "mercury" | "venus" | "mars";
const SIDES: Side[] = ["sun", "mercury", "venus", "mars"];

export function pairSpotlight({ seed, tone, mine, theirs, c, them, startStop }: PairSpotlightInput): PairSpotlightText {
  const idx = (salt: string) => hash(`${seed}|${salt}`) % 2;
  const pick = <T>(list: readonly T[], salt: string): T => list[hash(`${seed}|${salt}`) % list.length];
  const their = poss(them);
  const Them = cap(them);

  const S1 = mine.signs.sun, S2 = theirs.signs.sun;
  const M1 = mine.signs.moon, M2 = theirs.signs.moon;
  const n1 = c.me.lifePath, n2 = c.them.lifePath;
  const A1 = c.me.sign.animal, A2 = c.them.sign.animal;
  const El1 = c.me.sign.element, El2 = c.them.sign.element;

  // header: both Chinese names, then the pair's own title from both Suns and both Life Paths
  const names = El1 === El2 && A1.id === A2.id ? `Two ${El1} ${A1.name}s` : `The ${El1} ${A1.name} with the ${El2} ${A2.name}`;
  const noun = PAIR_NOUN[keyOf(S1.element, S2.element)][idx("noun")];
  const title = `the ${PAIR_ADJ[keyOf(famOf(n1), famOf(n2))][idx("adj")]} ${noun.name}`;
  const facts = [
    S1.id === S2.id ? `${S1.glyph} Both ${S1.name} Suns` : `${S1.glyph}${S2.glyph} ${S1.name} and ${S2.name} Suns`,
    M1.id === M2.id ? `Both ${M1.name} Moons` : `${M1.name} and ${M2.name} Moons`,
    n1 === n2 ? `Both Life Path ${n1}` : `Life Paths ${n1} and ${n2}`,
  ];

  // what you bring each other: each Sun and Life Path as a gift to the other, then both animals
  const L1 = LIFE_PATH_SPOT[n1], L2 = LIFE_PATH_SPOT[n2];
  const side1 = ANIMAL_SIDES[A1.id], side2 = ANIMAL_SIDES[A2.id];
  const verbs = ANIMAL_VERB[c.relation];
  const vAt = idx("verb");
  const bring = [
    fill(pick([
      "You bring {them} {gives}: that is your {S} Sun at work, with {flavour} from Life Path {n}.",
      "Your {S} Sun brings {them} {gives}, and your Life Path {n} adds {flavour}.",
    ], "bring-me"), { them, gives: SUN_GIVES[S1.id][idx("gives-me")], S: S1.name, flavour: L1.flavour[idx("flavour-me")], n: String(n1) }),
    fill(pick([
      "{Them} brings you {gives}, from {anS} Sun, plus {flavour} from Life Path {n}.",
      "In return, {their} {S} Sun gives you {gives}, and Life Path {n} adds {flavour}.",
    ], "bring-them"), { Them, their, anS: an(S2.name), gives: SUN_GIVES[S2.id][idx("gives-them")], S: S2.name, flavour: L2.flavour[idx("flavour-them")], n: String(n2) }),
    fill(pick([
      "Underneath, your {M1} Moon gives {them} {g1}, and {their} {M2} Moon gives you {g2}.",
      "On the inside, {their} {M2} Moon offers you {g2}, while your {M1} Moon offers {them} {g1}.",
    ], "moon-gives"), { M1: M1.name, M2: M2.name, them, their, g1: MOON_GIVES[M1.id][idx("mg-me")], g2: MOON_GIVES[M2.id][idx("mg-them")] }),
    fill(pick([
      "In how you show care, your {V1} Venus works through {v1}, and {their} {V2} Venus through {v2}.",
      "Your Venus in {V1} shows care through {v1}, while {their} Venus in {V2} shows it through {v2}.",
    ], "venus"), { V1: mine.signs.venus.name, V2: theirs.signs.venus.name, their, v1: VENUS_SHOWS[mine.signs.venus.id][idx("v-me")], v2: VENUS_SHOWS[theirs.signs.venus.id][idx("v-them")] }),
    `On the Chinese side, your ${A1.name}'s ${side1.quality[idx("q1")]} ${verbs[vAt]} the ${side2.soft[idx("s2")]} in ${their} ${A2.name}, and in return ${their} ${side2.quality[idx("q2")]} ${verbs[1 - vAt]} your ${side1.soft[idx("s1")]}.`,
    n1 === n2
      ? `As two ${n1}s, you share ${L1.strength}, so use it together.`
      : fill(pick([
          "Between you, that means {s1} on your side and {s2} on {their}.",
          "Put simply, you add {s1}, and {them} adds {s2}.",
        ], "strengths"), { s1: L1.strength, s2: L2.strength, them, their }),
  ];

  // where you click and where you rub: planets, Moons, animals, year elements and Life Paths
  const pairs = pairUp(mine, theirs);
  const byPlanet = Object.fromEntries(pairs.map((p) => [p.planet, p])) as Record<PlanetPair["planet"], PlanetPair>;
  const linkOf = (p: PlanetPair) => LINK_PHRASE[p.link].replace("{element}", p.mine.element);
  const planetLine = (table: typeof CLICK_PLANET, p: PlanetPair, salt: string) =>
    fill(pick(table[p.planet as Side], salt), { a: p.mine.name, b: p.theirs.name, their, link: linkOf(p) });
  // prefer a same-sign or trine for the click and a square or opposite for the rub, then the order of the planets
  const rank = (p: PlanetPair) => ["same", "trine", "square", "opposite"].includes(p.link) ? 0 : 1;
  const easy = SIDES.map((s) => byPlanet[s]).filter((p) => p.feel === "easy").sort((a, b) => rank(a) - rank(b))[0];
  const hard = SIDES.map((s) => byPlanet[s]).filter((p) => p.feel === "care").sort((a, b) => rank(a) - rank(b))[0];

  const moonFeel = LINK_FEEL[signLink(M1, M2)];
  const moonVars = { a: M1.name, b: M2.name, their };
  const moonLine = M1.id === M2.id
    ? fill(pick(SAME_MOON, "moon"), { ...moonVars, anA: an(M1.name) })
    : signLink(M1, M2) === "opposite"
      ? fill(pick(MOON_OPPOSITE, "moon"), moonVars)
      : fill(pick(MOON_MEET[keyOf(M1.element, M2.element)], "moon"), moonVars);

  const animalVars = { A1: A1.name, A2: A2.name, their };
  const giver = c.element === "iFeed" || c.element === "iGuide";
  const elVars = giver
    ? { Who1: "Your", who1: "your", who2: their, E1: El1, E2: El2 }
    : { Who1: cap(their), who1: their, who2: "your", E1: El2, E2: El1 };
  const sameFamily = famOf(n1) === famOf(n2);
  const lpVars = { n1: String(n1), n2: String(n2) };

  const clicks: [string, keyof typeof CLICK_USE][] = [];
  if (easy) clicks.push([planetLine(CLICK_PLANET, easy, "click"), easy.planet as Side]);
  if (moonFeel !== "care") clicks.push([moonLine, "moon"]);
  if (ANIMAL_CLICK[c.relation]) clicks.push([fill(pick(ANIMAL_CLICK[c.relation]!, "animal-click"), animalVars), "animal"]);
  if (n1 === n2) clicks.push([fill(pick(SAME_LIFE_PATH, "lp-click"), lpVars), "family"]);
  else if (sameFamily) clicks.push([fill(pick(FAMILY_CLICK[famOf(n1)], "lp-click"), lpVars), "family"]);
  if (c.element === "iFeed" || c.element === "theyFeed") clicks.push([fill(pick(ELEMENT_FEED, "el-click"), elVars), "element"]);
  const click = clicks.slice(0, 3).map(([t]) => t);
  if (click.length < 2) {
    // and never deny the one click there is: no Life Paths line after a Life Path click, no animals after an animal one
    const only = clicks[0]?.[1];
    const none = fill(only === "animal" ? NO_CLICK[0] : only === "family" ? NO_CLICK[1] : pick(NO_CLICK, "no-click"), {
      // name the planets that did not click: the Suns, unless the one click is the Suns
      pairOf: clicks[0]?.[1] === "sun" ? `your ${M1.name} and ${M2.name} Moons` : `your ${S1.name} and ${S2.name} Suns`,
      n1: String(n1), n2: String(n2), A1: A1.name, A2: A2.name, their,
    });
    click.push(click.length ? none : none.replace(/^Beyond that, your/, "Your"));
  }
  const use = CLICK_USE[clicks.length ? clicks[0][1] : "none"][idx("use")];
  click.push(clicks.length ? `${pick(["Make the most of it:", "To build on it:"], "use-open")} ${use.charAt(0).toLowerCase()}${use.slice(1)}` : use);

  const rubs: [string, keyof typeof HANDLE][] = [];
  if (hard) rubs.push([planetLine(RUB_PLANET, hard, "rub"), hard.planet as Side]);
  if (moonFeel === "care") rubs.push([moonLine, "moon"]);
  if (c.relation === "clash") rubs.push([fill(pick(ANIMAL_RUB, "animal-rub"), animalVars), "animal"]);
  if (!sameFamily) rubs.push([fill(pick(FAMILY_RUB[keyOf(famOf(n1), famOf(n2))], "lp-rub"), lpVars), "family"]);
  if (c.element === "iGuide" || c.element === "theyGuide") rubs.push([fill(pick(ELEMENT_CHECK, "el-rub"), elVars), "element"]);
  const rub = rubs.slice(0, 2);
  const rubText = rub.length
    ? [...rub.map(([t]) => t), `${pick(["How to handle it:", "What helps:"], "handle-open")} ${HANDLE[rub[0][1]][idx("handle")].charAt(0).toLowerCase()}${HANDLE[rub[0][1]][idx("handle")].slice(1)}`]
    : [pick(NO_RUB, "no-rub"), HANDLE.none[idx("handle")]];

  // your story together: both hearts, both animals, both Life Paths and what the title means
  const sp1 = SIGN_SPOT[S1.id], sp2 = SIGN_SPOT[S2.id];
  const heart1 = sp1.heart[idx("heart-me")], heart2 = sp2.heart[idx("heart-them")];
  const story = [
    fill(pick(STORY, "story"), {
      heart1, heart2, aHeart1: cap(an(heart1)), aHeart2: an(heart2), S1: S1.name, S2: S2.name, their,
      El1, El2, A1: A1.name, A2: A2.name, n1: String(n1), n2: String(n2), kw1: kw(n1), kw2: kw(n2),
    }),
    `${pick(["That is what makes you", "That makes you"], "title-open")} ${title}: ${noun.means}.`,
    fill(pick(YEAR_STORY[YEAR_PACE[c.me.personalYear] === YEAR_PACE[c.them.personalYear] ? YEAR_PACE[c.me.personalYear] : "mixed"], "year"), { py1: String(c.me.personalYear), py2: String(c.them.personalYear) }),
  ].join(" ");
  const closing = pick(STORY_TONE[tone], "tone");

  // one Do and one Don't each: the Start that takes the most effort (else one picked), and the Stop
  const doOf = (ss: StartStop, self: PersonalSigns, other: PersonalSigns, salt: string): DoDont => {
    const planets = ["moon", "venus", "mercury"] as const;
    const effort = planets.findIndex((p) => LINK_FEEL[signLink(self.signs[p], other.signs[p])] === "care");
    return { do: ss.start[effort >= 0 ? effort : hash(`${seed}|${salt}`) % 3].trim(), dont: ss.stop.trim() };
  };

  return {
    names, title, facts, closing,
    sections: [
      { heading: "What you bring each other", text: bring.join(" ") },
      { heading: "Where you click", text: click.join(" ") },
      { heading: "Where you rub", text: rubText.join(" ") },
      { heading: "Your story together", text: story },
    ],
    doDont: { me: doOf(startStop.me, mine, theirs, "do-me"), them: doOf(startStop.them, theirs, mine, "do-them") },
  };
}

/** Every word a reader sees in the spotlight, for counting and comparing. */
export const pairSpotlightWords = (s: PairSpotlightText) =>
  [s.names, s.title, ...s.sections.map((x) => `${x.heading} ${x.text}`), s.closing, s.doDont.me.do, s.doDont.me.dont, s.doDont.them.do, s.doDont.them.dont].join(" ");
