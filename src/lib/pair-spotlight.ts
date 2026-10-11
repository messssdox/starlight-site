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
  STORY, STORY_TONE, MOON_OPPOSITE, MOON_GIVES, CLICK_USE, YEAR_STORY, CLICK_USE_SCENE, HANDLE_SCENE,
  MOON_SCENE, ANIMAL_SCENE_CLICK, ANIMAL_SCENE_RUB, ELEMENT_SCENE_FEED, ELEMENT_SCENE_CHECK, FAMILY_SCENE_CLICK, FAMILY_SCENE_RUB, EVENING,
} from "../data/pair-spotlight.ts";
import { PY_SHORT } from "../data/spotlight.ts";
import { PLANET_IMAGE, SCENES, ANIMAL_IMAGE, LIFE_PATH_IMAGE, YEAR_ELEMENT_IMAGE, type SceneKind } from "../data/images.ts";
import { picker, cap, an, fill, lcFirst } from "./wording.ts";
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
const SIDES: Side[] = ["sun", "mercury", "venus", "mars"];

export function pairSpotlight({ seed, tone, mine, theirs, c, them, startStop }: PairSpotlightInput): PairSpotlightText {
  const P = picker(seed);
  const idx = (salt: string) => P.n(2, salt);
  const pick = <T>(list: readonly T[], salt: string): T => P.one(list, salt);
  const their = poss(them);
  const Them = cap(them);
  const otherIs = `${them} is`;
  // everyday moments for both people: yours first, then theirs, never the same one twice
  const KIND: Record<"sun" | "moon" | "mercury" | "venus" | "mars", SceneKind> = { sun: "evening", moon: "upset", mercury: "chat", venus: "treat", mars: "task" };
  const scenes = (planet: keyof typeof KIND, salt: string, kind: SceneKind = KIND[planet]) => ({
    sceneA: () => pick(SCENES[kind][mine.signs[planet].id], `${salt}-a`),
    sceneB: () => pick(SCENES[kind][theirs.signs[planet].id], `${salt}-b`),
  });
  // the tips use each planet's own kind of moment; the rest are spread over the other kinds,
  // so even two people with the same signs never run out of fresh moments
  const TIP_SCENE: Record<string, [keyof typeof KIND, SceneKind]> = {
    sun: ["sun", "evening"], moon: ["moon", "upset"], mercury: ["mercury", "chat"], venus: ["venus", "treat"], mars: ["mars", "task"],
    animal: ["mercury", "chat"], family: ["mars", "task"], element: ["mercury", "chat"], none: ["mercury", "chat"],
  };

  const S1 = mine.signs.sun, S2 = theirs.signs.sun;
  const M1 = mine.signs.moon, M2 = theirs.signs.moon;
  const n1 = c.me.lifePath, n2 = c.them.lifePath;
  const A1 = c.me.sign.animal, A2 = c.them.sign.animal;
  const El1 = c.me.sign.element, El2 = c.them.sign.element;

  // header: both Chinese names, then the pair's own title from both Suns and both Life Paths
  const names = El1 === El2 && A1.id === A2.id ? `Two ${El1} ${A1.name}s` : `The ${El1} ${A1.name} with the ${El2} ${A2.name}`;
  const noun = pick(PAIR_NOUN[keyOf(S1.element, S2.element)], "noun");
  const title = `the ${pick(PAIR_ADJ[keyOf(famOf(n1), famOf(n2))], "adj")} ${noun.name}`;
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
    `On the Chinese side, your ${A1.name}'s ${side1.quality[idx("q1")]} ${verbs[vAt]} the ${side2.soft[idx("s2")]} in ${their} ${A2.name}, and in return ${their} ${side2.quality[idx("q2")]} ${verbs[1 - vAt]} your ${side1.soft[idx("s1")]}.`,
    fill(pick(EVENING, "evening"), { them, otherIs, ...scenes("sun", "evening") }),
  ];

  // where you click and where you rub: planets, Moons, animals, year elements and Life Paths
  const pairs = pairUp(mine, theirs);
  const byPlanet = Object.fromEntries(pairs.map((p) => [p.planet, p])) as Record<PlanetPair["planet"], PlanetPair>;
  const linkOf = (p: PlanetPair) => LINK_PHRASE[p.link].replace("{element}", p.mine.element);
  const planetLine = (table: typeof CLICK_PLANET, p: PlanetPair, salt: string) =>
    fill(pick(table[p.planet as Side], salt), {
      a: p.mine.name, b: p.theirs.name, their, them, otherIs, link: linkOf(p),
      imgA: () => pick(PLANET_IMAGE[p.planet as Side][p.mine.id], `${salt}-img-a`), imgB: () => pick(PLANET_IMAGE[p.planet as Side][p.theirs.id], `${salt}-img-b`),
      ...scenes(p.planet as Side, `${salt}-scene`),
    });
  // prefer a same-sign or trine for the click and a square or opposite for the rub, then the order of the planets
  const rank = (p: PlanetPair) => ["same", "trine", "square", "opposite"].includes(p.link) ? 0 : 1;
  const easy = SIDES.map((s) => byPlanet[s]).filter((p) => p.feel === "easy").sort((a, b) => rank(a) - rank(b))[0];
  const hard = SIDES.map((s) => byPlanet[s]).filter((p) => p.feel === "care").sort((a, b) => rank(a) - rank(b))[0];

  const moonFeel = LINK_FEEL[signLink(M1, M2)];
  const moonScenes = scenes("moon", "moon-scene");
  const moonVars = { a: M1.name, b: M2.name, their, them, otherIs, anA: an(M1.name), uA: moonScenes.sceneA, uB: moonScenes.sceneB };
  const moonLine = fill(pick([
    ...(M1.id === M2.id ? SAME_MOON : signLink(M1, M2) === "opposite" ? MOON_OPPOSITE : MOON_MEET[keyOf(M1.element, M2.element)]),
    ...MOON_SCENE,
  ], "moon"), moonVars);

  const animalVars = {
    A1: A1.name, A2: A2.name, their, rel: c.relation === "secret" ? "secret friends" : c.relation === "same" ? "two of a kind" : "friends",
    imgA: () => pick(ANIMAL_IMAGE[A1.id], "animal-img-a"), imgB: () => pick(ANIMAL_IMAGE[A2.id], "animal-img-b"),
  };
  const giver = c.element === "iFeed" || c.element === "iGuide";
  const elVars = giver
    ? { Who1: "Your", who1: "your", who2: their, E1: El1, E2: El2 }
    : { Who1: cap(their), who1: their, who2: "your", E1: El2, E2: El1 };
  const elImgs = { imgE1: () => pick(YEAR_ELEMENT_IMAGE[elVars.E1], "el-img-1"), imgE2: () => pick(YEAR_ELEMENT_IMAGE[elVars.E2], "el-img-2") };
  const sameFamily = famOf(n1) === famOf(n2);
  const lpVars = { n1: String(n1), n2: String(n2), family: famOf(n1), f1: L1.flavour[idx("lp-f1")], f2: L2.flavour[idx("lp-f2")], img1: () => pick(LIFE_PATH_IMAGE[n1], "lp-img-1"), img2: () => pick(LIFE_PATH_IMAGE[n2], "lp-img-2") };

  const clicks: [string, keyof typeof CLICK_USE][] = [];
  if (easy) clicks.push([planetLine(CLICK_PLANET, easy, "click"), easy.planet as Side]);
  if (moonFeel !== "care") clicks.push([moonLine, "moon"]);
  if (ANIMAL_CLICK[c.relation]) clicks.push([fill(pick([...ANIMAL_CLICK[c.relation]!, ...ANIMAL_SCENE_CLICK], "animal-click"), animalVars), "animal"]);
  if (n1 === n2) clicks.push([fill(pick(SAME_LIFE_PATH, "lp-click"), lpVars), "family"]);
  else if (sameFamily) clicks.push([fill(pick([...FAMILY_CLICK[famOf(n1)], ...FAMILY_SCENE_CLICK], "lp-click"), lpVars), "family"]);
  if (c.element === "iFeed" || c.element === "theyFeed") clicks.push([fill(pick([...ELEMENT_FEED, ...ELEMENT_SCENE_FEED], "el-click"), { ...elVars, ...elImgs }), "element"]);
  const click = clicks.slice(0, 2).map(([t]) => t);
  if (click.length < 2) {
    // and never deny the one click there is: no Life Paths line after a Life Path click, no animals after an animal one
    const only = clicks[0]?.[1];
    const none = fill(pick(only === "animal" ? NO_CLICK.lifePaths : only === "family" ? NO_CLICK.animals : [...NO_CLICK.lifePaths, ...NO_CLICK.animals], "no-click"), {
      them, otherIs, ...scenes("venus", "no-click"),
      // name the planets that did not click: the Suns, unless the one click is the Suns
      pairOf: clicks[0]?.[1] === "sun" ? `your ${M1.name} and ${M2.name} Moons` : `your ${S1.name} and ${S2.name} Suns`,
      n1: String(n1), n2: String(n2), A1: A1.name, A2: A2.name, their,
    });
    click.push(click.length ? none : none.replace(/^Beyond that, your/, "Your"));
  }
  const useKey = clicks.length ? clicks[0][1] : "none";
  const sceneOf = (key: string) => scenes(TIP_SCENE[key][0], `${key}-tip`, TIP_SCENE[key][1]);
  const use = fill(pick(CLICK_USE_SCENE[useKey], "use"), { them, their, otherIs, ...sceneOf(useKey) });
  click.push(clicks.length ? `${pick(["Make the most of it:", "To build on it:", "Use it:"], "use-open")} ${lcFirst(use)}` : use);

  const rubs: [string, keyof typeof HANDLE][] = [];
  if (hard) rubs.push([planetLine(RUB_PLANET, hard, "rub"), hard.planet as Side]);
  if (moonFeel === "care") rubs.push([moonLine, "moon"]);
  if (c.relation === "clash") rubs.push([fill(pick([...ANIMAL_RUB, ...ANIMAL_SCENE_RUB], "animal-rub"), animalVars), "animal"]);
  if (!sameFamily) rubs.push([fill(pick([...FAMILY_RUB[keyOf(famOf(n1), famOf(n2))], ...FAMILY_SCENE_RUB], "lp-rub"), lpVars), "family"]);
  if (c.element === "iGuide" || c.element === "theyGuide") rubs.push([fill(pick([...ELEMENT_CHECK, ...ELEMENT_SCENE_CHECK], "el-rub"), { ...elVars, ...elImgs }), "element"]);
  const rub = rubs.slice(0, 2);
  const handleOf = (key: keyof typeof HANDLE) => fill(pick(HANDLE_SCENE[key], "handle"), { them, their, otherIs, ...sceneOf(key) });
  const rubText = rub.length
    ? [...rub.map(([t]) => t), `${pick(["How to handle it:", "What helps:", "The fix:"], "handle-open")} ${lcFirst(handleOf(rub[0][1]))}`]
    : [fill(pick(NO_RUB, "no-rub"), { them, otherIs, ...scenes("mars", "no-rub") }), handleOf("none")];

  // your story together: both hearts, both animals, both Life Paths and what the title means
  const sp1 = SIGN_SPOT[S1.id], sp2 = SIGN_SPOT[S2.id];
  const heart1 = sp1.heart[idx("heart-me")], heart2 = sp2.heart[idx("heart-them")];
  const story = [
    fill(pick(STORY, "story"), {
      heart1, heart2, aHeart1: an(heart1), aHeart2: an(heart2), S1: S1.name, S2: S2.name, their,
      El1, El2, A1: A1.name, A2: A2.name, n1: String(n1), n2: String(n2), kw1: kw(n1), kw2: kw(n2),
    }),
    `${pick(["That is what makes you", "That makes you", "Together that makes you"], "title-open")} ${title}: ${noun.means}.`,
    fill(pick(YEAR_STORY[YEAR_PACE[c.me.personalYear] === YEAR_PACE[c.them.personalYear] ? YEAR_PACE[c.me.personalYear] : "mixed"], "year"), {
      py1: String(c.me.personalYear), py2: String(c.them.personalYear), them, their,
      s1: pick(PY_SHORT[c.me.personalYear], "py-1"), s2: pick(PY_SHORT[c.them.personalYear], "py-2"),
    }),
  ].join(" ");
  const closing = fill(pick(STORY_TONE[tone], "tone"), { noun: noun.name.toLowerCase() });

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
