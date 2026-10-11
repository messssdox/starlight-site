// The parts of a relationship reading written from both people's data together: planet
// pairs with both signs named, both animals, both Life Paths and both Personal Years.
// Where a combination has two wordings, one is picked from both birth dates, so the same
// pair always reads the same and different pairs rarely match.

import { hash } from "./wording.ts";
import { SIGN_SPOT } from "../data/spotlight.ts";
import { PLANET_BY_ID, type Sign } from "../data/astrology.ts";
import { PAIR_TITLES, PAIR_SHORT, type PairPlanet, type Tone } from "../data/synastry.ts";
import { NUMBER_FAMILIES, NUMBER_MEANINGS } from "../data/numbers.ts";
import {
  ELEMENT_MEET, MODALITY_MEET, LINK_PHRASE, MOON_NEEDS, VENUS_VALUES, MERCURY_TALK, MARS_TRAPS, START_FIT, STOP_FIT,
  TIP_CARE, TIP_EASY, TIP_ANIMAL, ANIMAL_MIX, FAMILY_MIX, YEAR_PACE, YEAR_MIX, YEAR_STEP, YEAR_TURN,
} from "../data/pair-reading.ts";
import { pairUp, signLink, type PersonalSigns, type PlanetPair } from "./synastry.ts";
import { LINK_FEEL } from "../data/synastry.ts";
import type { Comparison } from "./compat.ts";
import { birthday } from "./numerology.ts";
import { elementLine, lifePathPairLine, yearTogetherLine } from "./compat.ts";
import type { Kind } from "../data/relationships.ts";

export interface PairInput {
  /** Both birth dates and the relationship id: together they choose the wording. */
  seed: string;
  /** Your birth date and theirs, as YYYY-MM-DD. */
  dates: [string, string];
  tone: Tone;
  mine: PersonalSigns;
  theirs: PersonalSigns;
  c: Comparison;
  /** The other person as an object: "Sam" or "your partner". Already escaped for HTML. */
  them: string;
  /** This kind of bond's own wording for the wheel and the numbers, and its tips. */
  kind: Kind;
}

export interface StartStop { start: string[]; stop: string }

export interface PairText {
  pairs: PlanetPair[];
  easiest?: PlanetPair;
  hardest?: PlanetPair;
  /** The harmony panel's sentences, with <strong> titles. */
  harmony: string;
  click: string[];
  care: string[];
  /** For each planet, how the two signs' elements and modalities meet. */
  planetMix: Record<PairPlanet, string>;
  /** Both animals: the wheel in this bond's voice, the Sun signs, and a trait from each. */
  animals: string;
  /** Both year elements. */
  elements: string;
  numbers: string;
  year: string;
  startStop: { me: StartStop; them: StartStop };
  tips: string[];
}


const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
const lcFirst = (s: string) => s.charAt(0).toLowerCase() + s.slice(1);
const poss = (who: string) => (who === "you" ? "your" : who.endsWith("s") ? `${who}'` : `${who}'s`);
const fill = (t: string, vars: Record<string, string>) => t.replace(/\{(\w+)\}/g, (m, k) => vars[k] ?? m);
const keyOf = (a: string, b: string) => [a, b].sort().join("|");

/** The care links, as a verb from your Mars to the other's Moon. */
const STOP_LINK: Partial<Record<PlanetPair["link"], string>> = { square: "is at a tense angle to", opposite: "sits opposite", quincunx: "has little in common with" };

const WHEEL: Record<Comparison["relation"], string> = {
  secret: "secret friends", friend: "in the same friend group", same: "the same animal", neutral: "neither friends nor rivals", clash: "opposite each other",
};

export function pairReading(input: PairInput): PairText {
  const { seed, tone, mine, theirs, c, them, kind } = input;
  const pick = <T>(list: readonly T[], salt: string): T => list[hash(`${seed}|${salt}`) % list.length];
  const their = poss(them);
  const pairs = pairUp(mine, theirs);
  const title = (p: PairPlanet) => PAIR_TITLES[p][tone];
  const pName = (p: PairPlanet) => PLANET_BY_ID[p].name;

  /** "your Leo Sun and Sam's Aries Sun share Fire" */
  const linkLine = (p: PlanetPair) =>
    `your ${p.mine.name} ${pName(p.planet)} and ${their} ${p.theirs.name} ${pName(p.planet)} ${LINK_PHRASE[p.link].replace("{element}", p.mine.element)}`;

  const click: string[] = [], care: string[] = [];
  for (const p of pairs) {
    if (p.feel === "easy") click.push(`<strong>${title(p.planet)}:</strong> ${linkLine(p)}, so ${PAIR_SHORT[p.planet].easy}.`);
    if (p.feel === "care") care.push(`<strong>${title(p.planet)}:</strong> ${linkLine(p)}, so ${PAIR_SHORT[p.planet].care}.`);
  }
  const A1 = c.me.sign.animal.name, A2 = c.them.sign.animal.name;
  if (c.relation === "friend" || c.relation === "secret") click.push(`<strong>Your animals:</strong> the ${A1} and ${A2} are ${c.relation === "secret" ? "secret friends" : "in the same friend group"} on the zodiac wheel.`);
  if (c.relation === "clash") care.push(`<strong>Your animals:</strong> the ${A1} and ${A2} sit opposite each other on the wheel.`);
  if (c.element === "iFeed" || c.element === "theyFeed") click.push(`<strong>Your elements:</strong> ${c.element === "iFeed" ? `your ${c.me.sign.element} feeds ${their} ${c.them.sign.element}` : `${their} ${c.them.sign.element} feeds your ${c.me.sign.element}`}.`);
  if (c.element === "iGuide" || c.element === "theyGuide") care.push(`<strong>Your elements:</strong> ${c.element === "iGuide" ? `your ${c.me.sign.element} keeps ${their} ${c.them.sign.element} in check` : `${their} ${c.them.sign.element} keeps your ${c.me.sign.element} in check`}.`);
  if (c.sameFamily) click.push(`<strong>Your Life Paths:</strong> ${c.me.lifePath} and ${c.them.lifePath} share a family, so you want similar things from life.`);
  if (c.me.personalYear === c.them.personalYear) click.push(`<strong>This year:</strong> you are both in a Personal Year ${c.me.personalYear}, moving in step.`);

  // harmony: the easiest and hardest planet pairs, with both signs named
  const easiest = pairs.find((p) => p.link === "trine" || p.link === "same") ?? pairs.find((p) => p.feel === "easy");
  const hardest = pairs.find((p) => p.link === "square") ?? pairs.find((p) => p.feel === "care");
  const nEasy = pairs.filter((p) => p.feel === "easy").length, nCare = pairs.filter((p) => p.feel === "care").length;
  const count = pick([
    `Of your five planet pairs, ${nEasy} flow easily and ${nCare} need care.`,
    `${cap(String(nEasy))} of your five planet pairs come easily, and ${nCare} ask for a little more care.`,
  ], "count");
  const harmony = [
    easiest ? `Your easiest link is <strong>${lcFirst(title(easiest.planet))}</strong>: ${linkLine(easiest)}.` : "",
    hardest ? `Your biggest lesson is <strong>${lcFirst(title(hardest.planet))}</strong>: ${linkLine(hardest)}.` : "",
    count,
    pick([
      `On the Chinese side, your ${A1} and ${their} ${A2} are ${WHEEL[c.relation]}, and your Life Paths ${c.me.lifePath} and ${c.them.lifePath} ${c.sameFamily ? "share a family" : "come from different families"}.`,
      `Your ${A1} and ${their} ${A2} are ${WHEEL[c.relation]} on the wheel, and Life Paths ${c.me.lifePath} and ${c.them.lifePath} ${c.sameFamily ? "share a family" : "come from different families"}.`,
    ], "wheel"),
  ].filter(Boolean).join(" ");

  // planet by planet: how the two signs' elements and ways of acting meet
  const planetMix = {} as Record<PairPlanet, string>;
  for (const p of pairs) {
    const a = `your ${p.mine.name}`, b = `${their} ${p.theirs.name}`;
    const vars = (x: Sign, y: Sign, key: "element" | "modality") =>
      x[key] === y[key] ? { A: a, B: b } : { [x[key]]: a, [y[key]]: b };
    const el = fill(pick(ELEMENT_MEET[keyOf(p.mine.element, p.theirs.element)], `el-${p.planet}`), vars(p.mine, p.theirs, "element"));
    const mo = fill(pick(MODALITY_MEET[keyOf(p.mine.modality, p.theirs.modality)], `mo-${p.planet}`), vars(p.mine, p.theirs, "modality"));
    planetMix[p.planet] = `${cap(el)} ${cap(mo)}`;
  }

  // animals: a trait from each, and how they meet on the wheel
  const t1 = pick(c.me.sign.animal.traits, "t1").toLowerCase(), t2 = pick(c.them.sign.animal.traits, "t2").toLowerCase();
  const S1 = mine.signs.sun.name, S2 = theirs.signs.sun.name;
  const animals = [
    kind.chinese[c.relation].replaceAll("{me}", A1).replaceAll("{them}", A2),
    pick([
      `With your Sun signs added, your ${A1} has ${/^[AEIOU]/.test(S1) ? "an" : "a"} ${S1} Sun and ${their} ${A2} has ${/^[AEIOU]/.test(S2) ? "an" : "a"} ${S2} Sun.`,
      `Read alongside your Sun signs, your ${A1} shines through ${/^[AEIOU]/.test(S1) ? "an" : "a"} ${S1} Sun, and ${their} ${A2} through ${/^[AEIOU]/.test(S2) ? "an" : "a"} ${S2} Sun.`,
    ], "sunanimal"),
    `The ${c.me.sign.element} ${A1}'s ${t1} side and the ${c.them.sign.element} ${A2}'s ${t2} side ${fill(pick(ANIMAL_MIX[c.relation], "animals"), { them })}.`,
  ].join(" ");

  // numbers: what each Life Path brings, and how the families meet
  const famOf = (n: number) => NUMBER_FAMILIES.find((f) => f.members.includes(n))!;
  const brings = (n: number) => lcFirst((NUMBER_MEANINGS[n]?.essence ?? "").replace(/\.$/, ""));
  const lpMine = c.me.lifePath, lpTheirs = c.them.lifePath;
  const bd1 = birthday(input.dates[0]).value, bd2 = birthday(input.dates[1]).value;
  const kw = (n: number) => (NUMBER_MEANINGS[n]?.keyword ?? "").replace(/^The /, "the ");
  const masters = [lpMine, lpTheirs].filter((n) => n > 9);
  const numbers = [
    lifePathPairLine(lpMine, lpTheirs, them),
    c.sameFamily ? kind.numbers.same : kind.numbers.different,
    lpMine === lpTheirs
      ? `You both bring the ${brings(lpMine)} energy of the ${lpMine}.`
      : `Your ${lpMine} brings something ${brings(lpMine)}, and ${their} ${lpTheirs} brings something ${brings(lpTheirs)}.`,
    pick(FAMILY_MIX[keyOf(famOf(lpMine).name, famOf(lpTheirs).name)], "family"),
    fill(pick([
      "Day to day, your birthday number {b1}, {k1}, meets {their} {b2}, {k2}.",
      "Your birthday numbers add a little more: your {b1} is {k1} and {their} {b2} is {k2}.",
    ], "birthday"), { b1: String(bd1), b2: String(bd2), k1: kw(bd1), k2: kw(bd2), their }),
    masters.length ? `${masters.length === 2 ? "Both Life Paths are master numbers" : `Life Path ${masters[0]} is a master number`}, so this bond can carry a sense of bigger purpose. Keep it grounded in everyday kindness.` : "",
  ].filter(Boolean).join(" ");

  // this year: whether both years point outward or inward, and where you sit in the cycle
  const py1 = c.me.personalYear, py2 = c.them.personalYear;
  const pace = YEAR_PACE[py1] === YEAR_PACE[py2] ? YEAR_PACE[py1] : "mixed";
  const gap = (py2 - py1 + 9) % 9;
  const year = [
    yearTogetherLine(py1, py2, them),
    pick(YEAR_MIX[pace], "year"),
    (py1 === 9 && py2 === 1) || (py1 === 1 && py2 === 9) ? pick(YEAR_TURN, "turn") : gap === 1 || gap === 8 ? pick(YEAR_STEP, "step") : "",
  ].filter(Boolean).join(" ");

  // start and stop: start from the other's Moon, Venus and Mercury signs, stop from your own Mars,
  // each with why it fits the two of you
  // {Your}/{your} name whose planets these are, so the other person's box says "Sam's Leo Moon"
  const startStop = (self: PersonalSigns, other: PersonalSigns, who: string, selfName: string, side: string): StartStop => {
    const theirP = poss(who), yourP = poss(selfName);
    const vars = { them: who, their: theirP, Their: cap(theirP), your: yourP, Your: cap(yourP) };
    // the same salt on both sides, with the other person's list turned by one, so the two boxes never give the same reason
    const turn = <T>(list: T[]) => (side === "them" ? [...list.slice(1), list[0]] : list);
    // your own planet's way, as a full predicate, so the reason names what you actually do:
    // what the Moon needs, or the style of Venus and Mercury from the sign's keywords
    const own = (planet: "moon" | "venus" | "mercury", salt: string) => {
      const sign = self.signs[planet];
      // when you share the sign, the other person's box takes the other wording, so the two boxes differ
      const shared = side === "them" && sign.id === other.signs[planet].id;
      if (planet === "moon") return SIGN_SPOT[sign.id].need[(hash(`${seed}|me-own-moon`) + (shared ? 1 : 0)) % 2];
      const [k1, k2] = sign.keywords.split(", ").slice(shared ? 1 : 0);
      const a = /^[aeiou]/i.test(k1) ? "an" : "a";
      // Venus and Mercury say it differently, so one sign behind both never reads twice
      return planet === "venus" ? `loves in ${a} ${k1}, ${k2} way` : `has ${a} ${k1}, ${k2} way of talking`;
    };
    const fit = (planet: "moon" | "venus" | "mercury") => {
      const link = signLink(self.signs[planet], other.signs[planet]);
      return fill(pick(turn(START_FIT[LINK_FEEL[link]]), "fit"), {
        ...vars, mine: self.signs[planet].name, theirs: other.signs[planet].name, planet: pName(planet), own: own(planet, `${side}-own-${planet}`),
      });
    };
    const marsMoon = signLink(self.signs.mars, other.signs.moon);
    const why = fill(pick(turn(STOP_FIT[LINK_FEEL[marsMoon]]), "stopfit"), {
      ...vars, mars: self.signs.mars.name, moon: other.signs.moon.name, link: STOP_LINK[marsMoon] ?? "meets",
    });
    // the advice for a shared sign moves one along on the other person's side
    const ask = (table: Record<string, string[]>, planet: "moon" | "venus" | "mercury") => {
      const list = table[other.signs[planet].id];
      const shared = self.signs[planet].id === other.signs[planet].id;
      const at = hash(`${seed}|${shared ? "me" : side}-${planet}`) + (shared && side === "them" ? 1 : 0);
      return `${fill(list[at % list.length], vars)} ${fit(planet)}`;
    };
    return {
      start: [ask(MOON_NEEDS, "moon"), ask(VENUS_VALUES, "venus"), ask(MERCURY_TALK, "mercury")],
      stop: `${pick(turn(MARS_TRAPS[self.signs.mars.id]), "mars").replace(/[.!]$/, "")}, because ${why}`,
    };
  };

  // tips: from your hardest and easiest planet pairs, your animals, and this kind of bond
  const tipVars = (p: PlanetPair) => ({ a: p.mine.name, b: p.theirs.name, them, their });
  const article = /^[AEIOU]/.test(A2) ? "an" : "a";
  const tips = [
    hardest ? fill(pick(TIP_CARE[hardest.planet], "tip-care"), tipVars(hardest)) : "",
    easiest ? fill(pick(TIP_EASY[easiest.planet], "tip-easy"), tipVars(easiest)) : "",
    fill(pick(TIP_ANIMAL[c.relation], "tip-animal"), { me: A1, other: A2, their, them, article }),
    pick(kind.tips, "tip-kind"),
  ].filter(Boolean);

  return {
    pairs, easiest, hardest, harmony, click, care, planetMix, animals, numbers, year, tips,
    elements: elementLine(c.me.sign.element, c.them.sign.element, them),
    startStop: { me: startStop(mine, theirs, them, "you", "me"), them: startStop(theirs, mine, "you", them, "them") },
  };
}
