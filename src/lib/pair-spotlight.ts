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
import { YEAR_PACE } from "../data/pair-reading.ts";
import {
  PAIR_NOUN, PAIR_ADJ, SUN_GIVES, ANIMAL_SIDES, ANIMAL_VERB, CLICK_PLANET, RUB_PLANET, HANDLE, MOON_MEET, SAME_MOON,
  ANIMAL_CLICK, ANIMAL_RUB, ELEMENT_FEED, ELEMENT_CHECK, ELEMENT_TRAIT, FAMILY_CLICK, SAME_LIFE_PATH, FAMILY_RUB, NO_CLICK, NO_RUB,
  STORY, STORY_TONE, TITLE_LINE, CLICK_SAME, MOON_OPPOSITE, MOON_GIVES, VENUS_SHOWS, CLICK_USE, YEAR_STORY,
} from "../data/pair-spotlight.ts";
import { PY_SHORT } from "../data/spotlight.ts";
import { picker, cap, an, fill, lcFirst, listOf } from "./wording.ts";
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

const poss = (who: string) => (who.endsWith("s") ? `${who}'` : `${who}'s`);
const keyOf = (a: string, b: string) => [a, b].sort().join("|");
const famOf = (n: number) => NUMBER_FAMILIES.find((f) => f.members.includes(n))!.name;
const kw = (n: number) => NUMBER_MEANINGS[n].keyword.replace(/^The /, "");

type Side = "sun" | "mercury" | "venus" | "mars";

/** How two signs sit, in plain words for the spotlight (no "square" or "trine"). */
const PLAIN_LINK: Record<PlanetPair["link"], string> = {
  same: "are the same sign",
  neighbour: "sit side by side",
  sextile: "sit two signs apart, a friendly angle",
  square: "sit at a tense angle",
  trine: "share the {element} element",
  quincunx: "have little in common",
  opposite: "sit opposite each other",
};
const keywords = (s: Sign) => listOf(s.keywords.split(", "));
const keyword1 = (s: Sign) => s.keywords.split(", ")[0];
/** The second keyword, for the other person when both share a Sun sign. */
const keyword2 = (s: Sign) => s.keywords.split(", ")[1];
const plural = (animal: string) => (animal === "Ox" ? "Oxen" : `${animal}s`);
const SIDES: Side[] = ["sun", "mercury", "venus", "mars"];

export function pairSpotlight({ seed, tone, mine, theirs, c, them, startStop }: PairSpotlightInput): PairSpotlightText {
  const P = picker(seed);
  const idx = (salt: string) => P.n(2, salt);
  const pick = <T>(list: readonly T[], salt: string): T => P.one(list, salt);
  const their = poss(them);
  const Them = cap(them);

  const S1 = mine.signs.sun, S2 = theirs.signs.sun;
  const M1 = mine.signs.moon, M2 = theirs.signs.moon;
  const V1 = mine.signs.venus, V2 = theirs.signs.venus;
  const n1 = c.me.lifePath, n2 = c.them.lifePath;
  const A1 = c.me.sign.animal, A2 = c.them.sign.animal;
  const El1 = c.me.sign.element, El2 = c.them.sign.element;

  // header: both Chinese names, then the pair's own title from both Suns and both Life Paths
  const names = El1 === El2 && A1.id === A2.id ? `Two ${El1} ${plural(A1.name)}` : `The ${El1} ${A1.name} with the ${El2} ${A2.name}`;
  const noun = pick(PAIR_NOUN[keyOf(S1.element, S2.element)], "noun");
  const adj = pick(PAIR_ADJ[keyOf(famOf(n1), famOf(n2))], "adj");
  const title = `the ${adj} ${noun}`;
  const facts = [
    S1.id === S2.id ? `${S1.glyph} Both ${S1.name} Suns` : `${S1.glyph}${S2.glyph} ${S1.name} and ${S2.name} Suns`,
    M1.id === M2.id ? `Both ${M1.name} Moons` : `${M1.name} and ${M2.name} Moons`,
    n1 === n2 ? `Both Life Path ${n1}` : `Life Paths ${n1} and ${n2}`,
  ];

  // what you bring each other: each Sun and Life Path as a gift to the other, both Moons, both animals and both Venuses
  const L1 = LIFE_PATH_SPOT[n1], L2 = LIFE_PATH_SPOT[n2];
  const side1 = ANIMAL_SIDES[A1.id], side2 = ANIMAL_SIDES[A2.id];
  const verbs = ANIMAL_VERB[c.relation];
  const vAt = idx("verb");
  // when both people share a sign, each takes a different wording
  const other = (a: Sign, b: Sign, at: number, salt: string) => (a.id === b.id ? 1 - at : idx(salt));
  // a shared Moon or Venus sign is said once, so the tips can use the other two wordings
  const mgMe = idx("mg-me"), mgThem = M1.id === M2.id ? mgMe : idx("mg-them");
  const shMe = idx("sh-me"), shThem = V1.id === V2.id ? shMe : idx("sh-them");
  const givesMe = idx("gives-me"), givesThem = other(S1, S2, givesMe, "gives-them");
  const flMe = idx("flavour-me"), flThem = n1 === n2 ? 1 - flMe : idx("flavour-them");
  const qAt1 = idx("q1"), qAt2 = idx("q2");
  const bring = [
    fill(pick([
      "Your {S} Sun brings {them} {gives}, and your Life Path {n}, the number from your birth date, adds {flavour}.",
      "From your {S} Sun, {them} gets {gives}, along with {flavour} from your Life Path {n}, the number numerology takes from a birth date.",
    ], "bring-me"), { them, gives: SUN_GIVES[S1.id][givesMe], S: S1.name, flavour: L1.flavour[flMe], n: String(n1) }),
    fill(pick([
      "{Them} brings you {gives}, from {anS} Sun, plus {flavour} from Life Path {n}.",
      "In return, {their} {S} Sun gives you {gives}, and Life Path {n} adds {flavour}.",
    ], "bring-them"), { Them, their, anS: an(S2.name), gives: SUN_GIVES[S2.id][givesThem], S: S2.name, flavour: L2.flavour[flThem], n: String(n2) }),
    fill(pick(M1.id === M2.id ? [
      "You both have the Moon, which governs feelings, in {M1}, so each of you offers the other {g1}.",
      "Emotionally, your Moons are both in {M1}, so {g1} flows both ways.",
    ] : [
      "Emotionally, your {M1} Moon gives {them} {g1}, and {their} {M2} Moon gives you {g2}.",
      "The Moon governs feelings, and {their} {M2} Moon offers you {g2}, while your {M1} Moon offers {them} {g1}.",
    ], "moon-gives"), { M1: M1.name, M2: M2.name, them, their, g1: MOON_GIVES[M1.id][mgMe], g2: MOON_GIVES[M2.id][mgThem] }),
    A1.id === A2.id
      ? `On the Chinese side, you were both born in ${an(A1.name)} year${El1 === El2 ? "" : `, ${an(El1)} one for you and ${an(El2)} one for ${them}`}, so you start from the same animal nature.`
      : `On the Chinese side, your ${A1.name}'s ${side1.quality[qAt1]} ${verbs[vAt]} the ${side2.soft[idx("s2")]} in ${their} ${A2.name}, and in return ${their} ${side2.quality[qAt2]} ${verbs[1 - vAt]} your ${side1.soft[idx("s1")]}.`,
    fill(pick(V1.id === V2.id ? [
      "You both have Venus, the planet of affection, in {V1}, so you both show care through {sh1}.",
      "Both of you have Venus in {V1}, so care comes through {sh1} on both sides.",
    ] : [
      "Your {V1} Venus shows care through {sh1}, and {their} {V2} Venus through {sh2}.",
      "Venus, the planet of affection, shows how each of you cares: through {sh1} for your {V1} Venus, and {sh2} for {their} {V2} one.",
      "With Venus in {V2}, {them} shows care through {sh2}, while your {V1} Venus favours {sh1}.",
    ], "venus"), { V1: V1.name, V2: V2.name, them, their, sh1: VENUS_SHOWS[V1.id][shMe], sh2: VENUS_SHOWS[V2.id][shThem] }),
  ];

  // where you click and where you rub: planets, Moons, animals, year elements and Life Paths
  const pairs = pairUp(mine, theirs);
  const byPlanet = Object.fromEntries(pairs.map((p) => [p.planet, p])) as Record<PlanetPair["planet"], PlanetPair>;
  const linkOf = (p: PlanetPair) => PLAIN_LINK[p.link].replace("{element}", p.mine.element);
  // each planet's own way, as a clause: "think quickly and say things plainly"
  // the tips take the other wording, so they add to the click or rub line rather than repeat it
  const wayOf = (p: PlanetPair, sign: Sign, side: string, other: boolean) => {
    const spot = SIGN_SPOT[sign.id];
    // the other person takes the other wording when you share the sign
    const base = side === "b" && p.mine.id === p.theirs.id ? 1 - idx(`${p.planet}-x-a`) : idx(`${p.planet}-x-${side}`);
    const at = other ? 1 - base : base;
    return p.planet === "mercury" ? spot.mind[at] : p.planet === "venus" ? spot.love[at] : spot.drive[at];
  };
  const planetVars = (p: PlanetPair, tip = false) => ({
    a: p.mine.name, b: p.theirs.name, their, Their: cap(their), them, Them, link: linkOf(p),
    kwA: keywords(p.mine), kwB: keywords(p.theirs), kwA1: keyword1(p.mine), kwB1: keyword1(p.theirs),
    xA: p.planet === "sun" ? "" : wayOf(p, p.mine, "a", tip), xB: p.planet === "sun" ? "" : wayOf(p, p.theirs, "b", tip),
  });
  const planetLine = (table: typeof CLICK_PLANET, p: PlanetPair, salt: string) =>
    fill(pick((p.link === "same" ? CLICK_SAME : table)[p.planet as Side], salt), planetVars(p));
  // prefer a same-sign or trine for the click and a square or opposite for the rub, then the order of the planets
  const rank = (p: PlanetPair) => ["same", "trine", "square", "opposite"].includes(p.link) ? 0 : 1;
  const easy = SIDES.map((s) => byPlanet[s]).filter((p) => p.feel === "easy").sort((a, b) => rank(a) - rank(b))[0];
  const hard = SIDES.map((s) => byPlanet[s]).filter((p) => p.feel === "care").sort((a, b) => rank(a) - rank(b))[0];

  const moonFeel = LINK_FEEL[signLink(M1, M2)];
  const moonLine = fill(pick(
    M1.id === M2.id ? SAME_MOON : signLink(M1, M2) === "opposite" ? MOON_OPPOSITE : MOON_MEET[keyOf(M1.element, M2.element)],
    "moon"), { a: M1.name, b: M2.name, their, anA: an(M1.name), mkA: keyword1(M1), aMkA: an(keyword1(M1)), mkB: keyword1(M2) });

  const animalVars = {
    A1: A1.name, A2: A2.name, A1s: plural(A1.name), their,
    qA: side1.quality[1 - qAt1], qB: side2.quality[1 - qAt2], softA: side1.soft[idx("soft-a")], softB: side2.soft[idx("soft-b")],
  };
  const giver = c.element === "iFeed" || c.element === "iGuide";
  const elVars = giver
    ? { Who1: "Your", who1: "your", who2: their, E1: El1, E2: El2 }
    : { Who1: cap(their), who1: their, who2: "your", E1: El2, E2: El1 };
  const elAll = { ...elVars, t1: ELEMENT_TRAIT[elVars.E1], t2: ELEMENT_TRAIT[elVars.E2] };
  const sameFamily = famOf(n1) === famOf(n2);
  // the click and rub lines take the other wording of each flavour, and the tips each Life Path's strength, so nothing repeats the opening
  const lpVars = { n1: String(n1), n2: String(n2), f1: L1.flavour[1 - flMe], f2: L2.flavour[1 - flThem], s1: L1.strength, kw1: kw(n1), kw2: kw(n2) };
  const lpTip = { f1: L1.strength, f2: L2.strength };

  const clicks: [string, keyof typeof CLICK_USE][] = [];
  if (easy) clicks.push([planetLine(CLICK_PLANET, easy, "click"), easy.planet as Side]);
  if (moonFeel !== "care") clicks.push([moonLine, "moon"]);
  if (ANIMAL_CLICK[c.relation]) clicks.push([fill(pick(ANIMAL_CLICK[c.relation]!, "animal-click"), animalVars), "animal"]);
  if (n1 === n2) clicks.push([fill(pick(SAME_LIFE_PATH, "lp-click"), lpVars), "family"]);
  else if (sameFamily) clicks.push([fill(pick(FAMILY_CLICK[famOf(n1)], "lp-click"), lpVars), "family"]);
  if (c.element === "iFeed" || c.element === "theyFeed") clicks.push([fill(pick(ELEMENT_FEED, "el-click"), elAll), "element"]);
  const click = clicks.slice(0, 2).map(([t]) => t);
  if (click.length < 2) {
    // and never deny the one click there is: no Life Paths line after a Life Path click, no animals after an animal one
    const only = clicks[0]?.[1];
    const none = fill(pick(only === "animal" ? NO_CLICK.lifePaths : only === "family" ? NO_CLICK.animals : [...NO_CLICK.lifePaths, ...NO_CLICK.animals], "no-click"), {
      // name the planets that did not click: the Suns, unless the one click is the Suns
      pairOf: clicks[0]?.[1] === "sun" ? `your ${M1.name} and ${M2.name} Moons` : `your ${S1.name} and ${S2.name} Suns`,
      n1: String(n1), n2: String(n2), kw1: kw(n1), kw2: kw(n2), A1: A1.name, A2: A2.name, their, qA: animalVars.qA, qB: animalVars.qB,
    });
    click.push(click.length ? none : none.replace(/^Beyond that, your/, "Your"));
  }

  // the tip for the strongest click and the fix for the main rub, each built from the signs behind it
  const tipVars = (key: keyof typeof CLICK_USE, p?: PlanetPair) => ({
    them, their,
    ...(p ? planetVars(p, true) : {}),
    ...(key === "moon" ? { a: M1.name, b: M2.name, gA: MOON_GIVES[M1.id][2], gB: MOON_GIVES[M2.id][1 - mgThem], needA: SIGN_SPOT[M1.id].need[idx("need-a")], needB: SIGN_SPOT[M2.id].need[idx("need-b")] } : {}),
    showsA: VENUS_SHOWS[V1.id][2], showsB: VENUS_SHOWS[V2.id][1 - shThem],
    S1: S1.name, S2: S2.name, sunA: keyword1(S1), sunB: keyword1(S2),
    A1: A1.name, A2: A2.name, qA: side1.quality[qAt1], qB: side2.quality[qAt2], softA: animalVars.softA, softB: animalVars.softB,
    ...lpTip, t1: elAll.t1, t2: elAll.t2,
  });
  const useKey = clicks.length ? clicks[0][1] : "none";
  const use = fill(pick(CLICK_USE[useKey], "use"), tipVars(useKey, useKey === easy?.planet ? easy : undefined));
  click.push(clicks.length ? `${pick(["To make the most of it,", "To build on it,", "To use it well,"], "use-open")} ${lcFirst(use)}` : use);

  const rubs: [string, keyof typeof HANDLE][] = [];
  if (hard) rubs.push([planetLine(RUB_PLANET, hard, "rub"), hard.planet as Side]);
  if (moonFeel === "care") rubs.push([moonLine, "moon"]);
  if (c.relation === "clash") rubs.push([fill(pick(ANIMAL_RUB, "animal-rub"), animalVars), "animal"]);
  if (!sameFamily) rubs.push([fill(pick(FAMILY_RUB[keyOf(famOf(n1), famOf(n2))], "lp-rub"), lpVars), "family"]);
  if (c.element === "iGuide" || c.element === "theyGuide") rubs.push([fill(pick(ELEMENT_CHECK, "el-rub"), elAll), "element"]);
  const rub = rubs.slice(0, 2);
  const handleKey = rub.length ? rub[0][1] : "none";
  const handle = fill(pick(HANDLE[handleKey], "handle"), tipVars(handleKey, handleKey === hard?.planet ? hard : undefined));
  const rubText = rub.length
    ? [...rub.map(([t]) => t), `${pick(["To handle it,", "To ease it,", "In practice,"], "handle-open")} ${lcFirst(handle)}`]
    : [fill(pick(NO_RUB, "no-rub"), { S1: S1.name, S2: S2.name, M1: M1.name, M2: M2.name, n1: String(n1), n2: String(n2), A1: A1.name, A2: A2.name }), handle];

  // your story together: both Suns, both animals, both Life Paths, where the title comes from and the year
  const sp1 = SIGN_SPOT[S1.id], sp2 = SIGN_SPOT[S2.id];
  const heartMe = idx("heart-me"), heart1 = sp1.heart[heartMe], heart2 = sp2.heart[other(S1, S2, heartMe, "heart-them")];
  const story = [
    fill(pick(STORY, "story"), {
      heart1, heart2, aHeart1: an(heart1), aHeart2: an(heart2), S1: S1.name, S2: S2.name, their,
      El1, El2, aEl1: an(El1), aEl2: an(El2), A1: A1.name, A2: A2.name, n1: String(n1), n2: String(n2), kw1: kw(n1), kw2: kw(n2),
    }),
    fill(pick(TITLE_LINE, "title-line"), {
      title, Title: cap(title), Noun: noun, Adj: adj,
      els: S1.element === S2.element ? `${S1.element} for both Suns` : `${S1.element} and ${S2.element}`,
      lps: n1 === n2 ? `a shared Life Path ${n1}` : `Life Paths ${n1} and ${n2}`,
    }),
    fill(pick(YEAR_STORY[YEAR_PACE[c.me.personalYear] === YEAR_PACE[c.them.personalYear] ? YEAR_PACE[c.me.personalYear] : "mixed"], "year"), {
      py1: String(c.me.personalYear), py2: String(c.them.personalYear), them, their,
      s1: pick(PY_SHORT[c.me.personalYear], "py-1"), s2: pick(PY_SHORT[c.them.personalYear], "py-2"),
    }),
  ].join(" ");
  const k2 = S1.id === S2.id ? keyword2(S2) : keyword1(S2);
  const closing = fill(pick(STORY_TONE[tone], "tone"), {
    S1: S1.name, S2: S2.name, M1: M1.name, M2: M2.name, their, them, kw1: kw(n1), kw2: kw(n2),
    k1: keyword1(S1), k2: k2, aK1: an(keyword1(S1)), aK2: an(k2),
  });

  // one Do and one Don't each: the Start that takes the most effort (else one picked), and the Stop
  const doOf = (ss: StartStop, self: PersonalSigns, other: PersonalSigns, salt: string): DoDont => {
    const planets = ["moon", "venus", "mercury"] as const;
    const effort = planets.findIndex((p) => LINK_FEEL[signLink(self.signs[p], other.signs[p])] === "care");
    return { do: ss.start[effort >= 0 ? effort : P.n(3, salt)].trim(), dont: ss.stop.trim() };
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
