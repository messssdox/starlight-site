// "Meet yourself": the spotlight at the top of a solo reading. One portrait woven from the
// Sun, Moon and personal planets, the Life Path and the Chinese animal, with every paragraph
// mixing the systems. Quick Glance is one paragraph (about 150 words), First Timers adds
// headed paragraphs (about 400) and the Full Deep Dive goes further (about 700).
// Wordings are picked from the birth date, so the same person always reads the same and
// two people with the same signs rarely do.

import { SIGNS, PLANET_BY_ID, type Sign, type Element as WesternElement, type Modality } from "../data/astrology.ts";
import { PLACEMENTS } from "../data/placements.ts";
import { NUMBER_MEANINGS, NUMBER_FAMILIES, PERSONAL_YEAR_THEMES, LIFE_PATH_DEEP } from "../data/numbers.ts";
import { GROUPS, PROFILES } from "../data/zodiac.ts";
import { SIGN_PARTS } from "../data/pairs.ts";
import { LINK_FEEL } from "../data/synastry.ts";
import {
  SIGN_SPOT, SUN_MOON_MIX, SAME_SIGN, LIFE_PATH_SPOT, SUN_FAMILY, ANIMAL_SPOT, YEAR_ELEMENT_TWIST, EAST_WEST, YIN_YANG,
  ELEMENT_LEADS, ELEMENT_MISSING, MODALITY_LEADS, STELLIUM, VENUS_MARS, MERCURY_SUN,
} from "../data/spotlight.ts";
import { lifePath, birthday, personalYear } from "./numerology.ts";
import { chineseSign, friendsOf, secretFriendOf } from "./chinese.ts";
import { signLink, PAIR_PLANETS, type PersonalSigns } from "./synastry.ts";

export type SpotlightTier = "glance" | "first" | "deep";

export interface SpotlightInput {
  /** Birth date, YYYY-MM-DD. */
  date: string;
  signs: PersonalSigns;
  tier: SpotlightTier;
  /** The year for the Personal Year (Full Deep Dive). */
  year: number;
}

export interface SpotlightText {
  /** "the Graceful Creator" */
  title: string;
  /** Short chips: "Libra Sun", "Cancer Moon", "Life Path 3", "Metal Horse". */
  facts: string[];
  sections: { heading?: string; text: string }[];
  /** Full Deep Dive only. */
  gifts: string[];
  edges: string[];
  /** The one-line summing up (First Timers and Full Deep Dive). */
  closing: string;
}

/** FNV-1a, so a seed and a salt give the same pick every time. */
function hash(s: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 0x01000193);
  return h >>> 0;
}

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
const lcFirst = (s: string) => s.charAt(0).toLowerCase() + s.slice(1);
const an = (word: string) => (/^[AEIOU]/i.test(word) ? `an ${word}` : `a ${word}`);
const fill = (t: string, vars: Record<string, string>) => t.replace(/\{(\w+)\}/g, (m, k) => vars[k] ?? m);
const firstSentence = (s: string) => s.split(/(?<=\.)\s/)[0].replace(/\.?$/, ".");
const COUNT = ["", "", "", "Three", "Four", "All five"];
const ordinal = (n: number) => `${n}${n % 10 === 1 && n !== 11 ? "st" : n % 10 === 2 && n !== 12 ? "nd" : n % 10 === 3 && n !== 13 ? "rd" : "th"}`;

export function spotlight({ date, signs, tier, year }: SpotlightInput): SpotlightText {
  const seed = date;
  const idx = (salt: string) => hash(`${seed}|${salt}`) % 2;
  const pick = <T>(list: readonly T[], salt: string): T => list[hash(`${seed}|${salt}`) % list.length];

  const { sun, moon, mercury, venus, mars } = signs.signs;
  const S = SIGN_SPOT[sun.id], M = SIGN_SPOT[moon.id];
  const lp = lifePath(date).value;
  const L = LIFE_PATH_SPOT[lp];
  const lpWord = NUMBER_MEANINGS[lp].keyword.replace(/^The /, "");
  const cn = chineseSign(date);
  const A = ANIMAL_SPOT[cn.animal.id];
  const El = cn.element, Animal = cn.animal.name;
  const titleAt = idx("title");
  const title = `the ${S.title[titleAt]} ${lpWord}`;

  // the personal planets together: a sign holding three or more, and the leading or missing elements
  const five = PAIR_PLANETS.map((p) => signs.signs[p]);
  const tally = <K extends string>(key: (s: Sign) => K) => {
    const t = {} as Record<K, number>;
    for (const s of five) t[key(s)] = (t[key(s)] ?? 0) + 1;
    return t;
  };
  const bySign = tally((s) => s.id);
  const byElement = tally((s) => s.element);
  const byModality = tally((s) => s.modality);
  const crowded = SIGNS.find((s) => (bySign[s.id] ?? 0) >= 3);
  const leadEl = (Object.keys(byElement) as WesternElement[]).find((e) => byElement[e] >= 3);
  const missingEl = (["Fire", "Earth", "Air", "Water"] as WesternElement[]).filter((e) => !byElement[e]);
  const leadMode = (Object.keys(byModality) as Modality[]).find((m) => byModality[m] >= 3);

  const focus = crowded
    ? fill(pick(STELLIUM, "stellium"), { Count: COUNT[bySign[crowded.id]], count: COUNT[bySign[crowded.id]].toLowerCase(), Sign: crowded.name, native: SIGN_SPOT[crowded.id].native })
    : leadEl ? pick(ELEMENT_LEADS[leadEl], "lead") : "";

  // the core: Sun, then Moon and how the two meet
  const coreLine = fill(pick([
    "At your core you are {aSun}: {core}.",
    "Your {Sun} Sun is the heart of you: {core}.",
    "The heart of you is pure {Sun}: {core}.",
  ], "core-open"), { aSun: an(sun.name), Sun: sun.name, core: S.core[idx("core")] });
  const needAt = idx("need");
  const moonLine = sun.id === moon.id
    ? fill(pick(SAME_SIGN, "same"), { Sun: sun.name })
    : `${pick(["Underneath, your", "Inside, your", "Beneath that, your"], "moon-open")} ${moon.name} Moon ${M.need[needAt]}, ${pick(SUN_MOON_MIX[`${sun.element}|${moon.element}`], "mix")}.`;

  const lpLine = fill(pick([
    "Life Path {n} adds {flavour}: {call}.",
    "Your Life Path {n}, {Keyword}, brings {flavour}: {call}.",
  ], "lp-open"), { n: String(lp), Keyword: NUMBER_MEANINGS[lp].keyword.replace(/^The /, "the "), flavour: L.flavour[idx("flavour")], call: L.call[idx("call")] });
  const animalLine = `${pick(["As", "Born"], "animal-open") === "As" ? `As ${an(El)} ${Animal}` : `Born ${an(El)} ${Animal}`}, you carry ${A.spirit[idx("spirit")]}, ${pick(YEAR_ELEMENT_TWIST[El], "twist")}.`;
  const sunGift = S.gift[idx("gift")];
  const loveLine = fill(pick([
    "When it comes to the heart, you {love}.",
    "With Venus in {V}, you {love}.",
  ], "love-open"), { love: SIGN_SPOT[venus.id].love[idx("love")], V: venus.name });
  const eastWest = fill(EAST_WEST[`${El}|${sun.element}`], { Sun: sun.name, Animal });
  const lpEdge = L.edge[idx("lp-edge")];

  const facts = [
    `${sun.glyph} ${sun.name} Sun`,
    `${PLANET_BY_ID.moon.glyph} ${moon.name} Moon${signs.unsure.moon ? "?" : ""}`,
    ...(signs.rising ? [`AC ${signs.rising.name} Rising`] : []),
    `Life Path ${lp}`,
    `${El} ${Animal}`,
  ];

  if (tier === "glance") {
    const giftEdge = fill(pick([
      "Your gift is {gift}. Your growing edge is {edge}.",
      "You shine at {gift}, and you grow most by {edge}.",
    ], "gift-edge"), { gift: sunGift, edge: lpEdge });
    return { title, facts, gifts: [], edges: [], closing: "", sections: [{ text: [coreLine, moonLine, focus, loveLine, lpLine, animalLine, eastWest, giftEdge].filter(Boolean).join(" ") }] };
  }

  // First Timers and Full Deep Dive: headed paragraphs
  const deep = tier === "deep";
  const rising = signs.rising
    ? fill(pick([
        "And with {R} Rising, people first meet someone {g}.",
        "With {R} Rising, the first impression you give is {g}.",
      ], "rising"), { R: signs.rising.name, g: lcFirst(PLACEMENTS.rising[signs.rising.id].glance) })
    : "";
  const unsureMoon = signs.unsure.moon
    ? `Your Moon moved from ${signs.unsure.moon.from.name} into ${signs.unsure.moon.to.name} on the day you were born, so add your birth time in the birth chart below to be sure which is yours.`
    : "";
  const core = [
    deep ? "" : "Your Sun sign is who you are at heart, and your Moon is the private you that close friends see.",
    coreLine,
    deep ? `People who know you well would add that you are ${S.core[1 - idx("core")]}.` : "",
    moonLine, unsureMoon, rising, focus,
    deep ? missingEl.map((e) => ELEMENT_MISSING[e]).join(" ") : "",
    deep && leadMode ? MODALITY_LEADS[leadMode] : "",
  ];

  const vmFeel = LINK_FEEL[signLink(venus, mars)];
  const act = [
    deep ? "" : "Mercury, Venus and Mars are your planets of thinking, loving and doing.",
    fill(pick([
      "With ideas and words, you {mind}. When it comes to the heart, you {love}. And when you want something, you {drive}.",
      "Your mind shows itself quickly: you {mind}. In matters of the heart you {love}, and when you want something you {drive}.",
    ], "act"), { mind: SIGN_SPOT[mercury.id].mind[idx("mind")], love: SIGN_SPOT[venus.id].love[idx("love")], drive: SIGN_SPOT[mars.id].drive[idx("drive")] }),
    fill(pick(VENUS_MARS[vmFeel], "vm"), { V: venus.name, M: mars.name }),
    fill(pick(mercury.id === sun.id ? MERCURY_SUN.same : MERCURY_SUN.other, "mer"), { Sun: sun.name, Mer: mercury.name, aKw: an(mercury.keywords.split(", ").slice(0, 2).join(", ")) }),
  ];

  const family = NUMBER_FAMILIES.find((f) => f.members.includes(lp))!;
  const bd = birthday(date);
  const day = Number(date.slice(8, 10));
  const py = personalYear(date, year).value;
  const path = [
    lpLine,
    deep ? `${firstSentence(LIFE_PATH_DEEP[lp].journey)} Put simply, ${L.call[1 - idx("call")]}.` : "",
    fill(SUN_FAMILY[`${sun.element}|${family.name}`], { n: String(lp) }),
    `Your greatest strength on this path is ${L.strength}.`,
    deep ? `Your birth day, the ${ordinal(day)}, also gives you birthday number ${bd.value}, ${NUMBER_MEANINGS[bd.value].keyword.replace(/^The /, "the ")}: ${NUMBER_MEANINGS[bd.value].essence.toLowerCase()}` : "",
    fill(pick([
      "In {year} you are in a Personal Year {py}: {theme}",
      "{year} is a Personal Year {py} for you: {theme}",
    ], "py"), { year: String(year), py: String(py), theme: lcFirst(deep ? PERSONAL_YEAR_THEMES[py] : firstSentence(PERSONAL_YEAR_THEMES[py])) }),
  ];

  const group = GROUPS[cn.animal.group];
  const friends = friendsOf(cn.animal.id).map((f) => f.name);
  const animal = [
    animalLine,
    eastWest,
    deep ? `Its natural strengths show in you too: ${lcFirst(PROFILES[cn.animal.id].strengths)}` : "",
    pick(YIN_YANG[cn.yinYang], "yy"),
    `Your ${Animal} belongs to ${lcFirst(group.name)}, with the ${friends.join(" and ")}: ${lcFirst(group.meaning.split(". ")[0])}.`,
    deep ? `Your secret friend on the wheel is the ${secretFriendOf(cn.animal.id).name}, a quiet ally who tends to bring out your best.` : "",
  ];

  const sections: SpotlightText["sections"] = [
    { heading: "At your core", text: core.filter(Boolean).join(" ") },
    { heading: "How you think, love and act", text: act.filter(Boolean).join(" ") },
    { heading: "Your path", text: path.filter(Boolean).join(" ") },
    { heading: `Your ${Animal}`, text: animal.filter(Boolean).join(" ") },
  ];

  if (deep) {
    // love and work: the Life Path's needs beside Venus and the Moon, then where your number and animal shine
    const deepLp = LIFE_PATH_DEEP[lp];
    const fields = deepLp.thrivesIn.slice(0, 2).map(lcFirst);
    const roles = PROFILES[cn.animal.id].careers.replace(/\.$/, "").split(", ").slice(0, 2).map(lcFirst);
    sections.push({
      heading: "In love and at work",
      text: [
        firstSentence(deepLp.love),
        `With Venus in ${venus.name} and your Moon in ${moon.name}, you ${SIGN_SPOT[venus.id].love[1 - idx("love")]}. Underneath it all, your heart ${M.need[1 - needAt]}.`,
        firstSentence(deepLp.work),
        `Paths that suit both your ${lp} and your ${Animal} include ${fields.join(", ")}, or roles such as ${roles.join(" or ")}.`,
      ].join(" "),
    });
    // looking after yourself: the animal's wellbeing, what recharges the Moon, and the Life Path's practice
    sections.push({
      heading: "Looking after yourself",
      text: [
        `For your ${Animal} side: ${lcFirst(PROFILES[cn.animal.id].wellbeing)}`,
        `Your ${moon.name} Moon recharges with ${SIGN_PARTS[moon.id].wellbeing}.`,
        `One practice for your ${lp} path: ${lcFirst(deepLp.growth)}`,
      ].join(" "),
    });
  }

  const animalGift = A.gift;
  const moonEdge = M.edge[idx("moon-edge")];
  const heart = M.heart[idx("heart")];
  const adj = S.title[1 - titleAt].toLowerCase();
  const closing = fill(pick([
    "In short: {aAdj} {El} {Animal} with {aHeart} {Moon} heart, walking the path of the {lpWord}.",
    "Put it all together: {aAdj} {Sun} with {aHeart} {Moon} heart, {El} {Animal} spirit and the soul of the {lpWord}.",
  ], "closing"), { aAdj: an(adj), El, Animal, aHeart: an(heart), Moon: moon.name, Sun: sun.name, lpWord });

  if (!deep) {
    sections.push({
      heading: "Meeting yourself",
      text: `Your greatest gift is ${sunGift}, and your ${Animal} adds ${animalGift}. Your growing edges are ${moonEdge}, and ${lpEdge}.`,
    });
    return { title, facts, sections, gifts: [], edges: [], closing };
  }

  return {
    title, facts, sections, closing,
    gifts: [cap(sunGift), cap(animalGift), cap(L.strength)],
    edges: [cap(moonEdge), cap(lpEdge), `Watching out for ${SIGN_SPOT[mars.id].trap}`],
  };
}

/** Every word a reader sees in the spotlight, for counting and comparing. */
export const spotlightWords = (s: SpotlightText) =>
  [s.title, ...s.sections.map((x) => `${x.heading ?? ""} ${x.text}`), ...s.gifts, ...s.edges, s.closing].join(" ");

