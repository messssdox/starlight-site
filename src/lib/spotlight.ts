// "Meet yourself": the spotlight at the top of a solo reading. One portrait woven from the
// Sun, Moon and personal planets, the Life Path and the Chinese animal, with every paragraph
// mixing the systems. Quick Glance is one paragraph (about 150 words), First Timers adds
// headed paragraphs (about 400) and the Full Deep Dive goes further (about 700).
// Wordings are picked from the birth date, so the same person always reads the same and
// two people with the same signs rarely do. The writing rules (plain words, no sayings,
// astrology terms explained the first time, every section opening on a detail of the
// person) are checked in tests/style.test.ts.

import { SIGNS, PLANET_BY_ID, type Sign, type Element as WesternElement, type Modality } from "../data/astrology.ts";
import { PLACEMENTS } from "../data/placements.ts";
import { NUMBER_MEANINGS, NUMBER_FAMILIES, LIFE_PATH_DEEP } from "../data/numbers.ts";
import { PROFILES } from "../data/zodiac.ts";
import { SIGN_PARTS, ANIMAL_PARTS } from "../data/pairs.ts";
import { LINK_FEEL } from "../data/synastry.ts";
import { ANIMAL_SIDES } from "../data/pair-spotlight.ts";
import {
  SIGN_SPOT, SUN_MOON_MIX, SAME_SIGN, LIFE_PATH_SPOT, SUN_FAMILY, ANIMAL_SPOT, YEAR_ELEMENT_TWIST, EAST_WEST, ANIMAL_POLARITY,
  ELEMENT_LEADS, ELEMENT_MISSING, MODALITY_LEADS, STELLIUM, VENUS_MARS, MERCURY_SUN, PY_SHORT, SUN_MOON_MODE, MOON_COPE,
  MIND_WAY, VENUS_WAY, MARS_WAY, LIFE_PATH_WAY, ANIMAL_WAY,
} from "../data/spotlight.ts";
import { lifePath, birthday, personalYear } from "./numerology.ts";
import { chineseSign, secretFriendOf } from "./chinese.ts";
import { signLink, PAIR_PLANETS, type PersonalSigns } from "./synastry.ts";
import { picker, cap, lcFirst, an, fill, listOf } from "./wording.ts";

export type SpotlightTier = "glance" | "first" | "deep";

export interface SpotlightInput {
  /** Birth date, YYYY-MM-DD. */
  date: string;
  signs: PersonalSigns;
  tier: SpotlightTier;
  /** The year for the Personal Year. */
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

const firstSentence = (s: string) => s.split(/(?<=\.)\s/)[0].replace(/\.?$/, ".");
const noStop = (s: string) => s.replace(/\.$/, "");
const COUNT = ["", "", "", "Three", "Four", "All five"];
const ordinal = (n: number) => `${n}${n % 10 === 1 && n !== 11 ? "st" : n % 10 === 2 && n !== 12 ? "nd" : n % 10 === 3 && n !== 13 ? "rd" : "th"}`;
const PLANET_NAME = { sun: "Sun", moon: "Moon", mercury: "Mercury", venus: "Venus", mars: "Mars" } as const;

export function spotlight({ date, signs, tier, year }: SpotlightInput): SpotlightText {
  const P = picker(date);
  const idx = (salt: string) => P.n(2, salt);
  const pick = <T>(list: readonly T[], salt: string): T => P.one(list, salt);

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
  const deep = tier === "deep";
  const glance = tier === "glance";
  const kwOf = (sign: Sign) => listOf(sign.keywords.split(", "));

  // "your personal planets" is explained the first time it appears, and only then
  let ppSaid = false;
  const pp = () => {
    if (ppSaid) return "your personal planets";
    ppSaid = true;
    return "your personal planets (the Sun, Moon, Mercury, Venus and Mars)";
  };

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

  // the core: Sun, how its modality meets the Moon's, then the Moon itself
  const coreAt = idx("core");
  const coreLine = fill(pick([
    "Your Sun sign, which describes your core personality, is {Sun}: you are {core}.",
    "With the Sun, the centre of your personality, in {Sun}, you are {core}.",
    "As {aSun} by Sun sign, the part of your chart that describes who you are at heart, you are {core}.",
    "The Sun shows your core character, and yours is in {Sun}, so you are {core}.",
    "Being born with the Sun in {Sun}, the sign that describes your core self, makes you {core}.",
  ], "core-open"), { aSun: an(sun.name), Sun: sun.name, core: S.core[coreAt] });
  const modeLine = sun.id === moon.id ? "" : fill(pick(SUN_MOON_MODE[`${sun.modality}|${moon.modality}`], "mode"), { S: sun.name, M: moon.name });
  const needAt = idx("need");
  const moonLine = sun.id === moon.id
    ? fill(pick(SAME_SIGN, "same"), { Sun: sun.name, kw: kwOf(sun) })
    : `${pick(["Beneath that, your", "Emotionally, your", "In private, your", "Underneath, your"], "moon-open")} ${moon.name} Moon${pick([", the sign for your emotional life,", ", which shapes your feelings,", " (your emotional side)", ", which governs how you feel,"], "moon-gloss")} ${M.need[needAt]}, ${pick(SUN_MOON_MIX[`${sun.element}|${moon.element}`], "mix")}.`;
  const moonCope = fill(pick([
    "When something goes wrong, your {M} Moon tends to {x}.",
    "On a hard day, a Moon in {M} means you {x}.",
    "After a setback, your {M} Moon prefers to {x}.",
    "Under stress, with the Moon in {M}, you will usually {x}.",
  ], "cope"), { M: moon.name, x: pick(MOON_COPE[moon.id], "cope-way") });

  const lpLine = fill(pick([
    "Life Path {n}, the number numerology takes from your full birth date, adds {flavour}: {call}.",
    "Your Life Path, worked out from your full date of birth, is {n}, {Keyword}, and it brings {flavour}: {call}.",
    "Then there is your Life Path, the number from adding up your birth date, which is {n}, with {flavour}: {call}.",
    "In numerology, the digits of your birth date add up to Life Path {n}, which brings {flavour}, because {call}.",
  ], "lp-open"), { n: String(lp), Keyword: NUMBER_MEANINGS[lp].keyword.replace(/^The /, "the "), flavour: L.flavour[idx("flavour")], call: L.call[idx("call")] });
  const masterLine = lp > 9 ? fill(pick([
    "{n} is a master number, one that numerology leaves unreduced, which strengthens {flavour}.",
    "As a master number, which numerology does not reduce to a single digit, {n} also brings {flavour}.",
  ], "master"), { n: String(lp), flavour: L.flavour[1 - idx("flavour")] }) : "";
  const animalLine = `${pick(["As", "Born"], "animal-open") === "As" ? `As ${an(El)} ${Animal} in Chinese astrology` : `Born in ${an(El)} ${Animal} year`}, you carry ${A.spirit[idx("spirit")]}, ${pick(YEAR_ELEMENT_TWIST[El], "twist")}.`;
  const sunGift = S.gift[idx("gift")];
  const lpEdge = L.edge[idx("lp-edge")];

  const facts = [
    `${sun.glyph} ${sun.name} Sun`,
    `${PLANET_BY_ID.moon.glyph} ${moon.name} Moon${signs.unsure.moon ? "?" : ""}`,
    ...(signs.rising ? [`AC ${signs.rising.name} Rising`] : []),
    `Life Path ${lp}`,
    `${El} ${Animal}`,
  ];

  const focus = crowded
    ? fill(pick(STELLIUM, "stellium"), { Count: COUNT[bySign[crowded.id]], count: COUNT[bySign[crowded.id]].toLowerCase(), Sign: crowded.name, native: SIGN_SPOT[crowded.id].native, pp: pp() })
    : leadEl ? fill(pick(ELEMENT_LEADS[leadEl], "lead"), { pp: pp() }) : "";

  if (glance) {
    const giftEdge = fill(pick([
      "Your {Sun} strength is {gift}; the challenge your Life Path {n} sets is {edge}.",
      "Where you shine is {gift}, while your Life Path {n} asks you to work on {edge}.",
      "At your best you are {gift}; the harder lesson of Life Path {n} is {edge}.",
      "{Sun} gives you a talent for {gift}, and Life Path {n} adds a challenge: {edge}.",
    ], "gift-edge"), { gift: sunGift, edge: lpEdge, Sun: sun.name, n: String(lp) });
    return { title, facts, gifts: [], edges: [], closing: "", sections: [{ text: [coreLine, moonLine, focus || moonCope, lpLine, animalLine, giftEdge].filter(Boolean).join(" ") }] };
  }

  // First Timers and Full Deep Dive: headed paragraphs
  const rising = signs.rising
    ? fill(pick([
        "With {R} Rising, the sign on the eastern horizon when you were born, people first meet someone {g}.",
        "Your Rising sign, which shapes first impressions, is {R}, so people first see someone {g}.",
      ], "rising"), { R: signs.rising.name, g: lcFirst(PLACEMENTS.rising[signs.rising.id].glance) })
    : "";
  const unsureMoon = signs.unsure.moon
    ? `Your Moon moved from ${signs.unsure.moon.from.name} into ${signs.unsure.moon.to.name} on the day you were born, so add your birth time in the birth chart below to be sure which is yours.`
    : "";
  const modePlanets = leadMode ? PAIR_PLANETS.filter((p) => signs.signs[p].modality === leadMode).map((p) => PLANET_NAME[p]) : [];
  const core = [
    coreLine,
    // to keep each tier to its length, the coping line gives way to a crowded or leading element, or to an unsure Moon
    moonLine, focus || unsureMoon ? "" : moonCope, modeLine, unsureMoon, rising, focus,
    deep ? missingEl.slice(0, 1).map((e) => fill(pick([
      "With no {El} among {pp}, {clause}.",
      "{El} is absent from {pp}; as a result, {clause}.",
      "Since {El} is missing from {pp}, {clause}.",
    ], `missing-${e}`), { El: e, clause: pick(ELEMENT_MISSING[e], `missing-clause-${e}`), pp: pp() })).join(" ") : "",
    deep && leadMode && !unsureMoon ? fill(pick(MODALITY_LEADS[leadMode], "mode-lead"), modePlanets.length === 5 ? { planets: "your five personal planets", Planets: "Your five personal planets" } : { planets: `your ${listOf(modePlanets)}`, Planets: `Your ${listOf(modePlanets)}` }) : "",
  ];

  const vmFeel = LINK_FEEL[signLink(venus, mars)];
  // Mercury, Venus and Mars each open with a different frame, so the three lines never echo each other
  const frame = P.n(4, "act-frame");
  const at = <T>(list: readonly T[], k: number): T => list[(frame + k) % list.length];
  const act = [
    fill(at([
      "Mercury, your planet of thinking and talking, is in {Mer}, so you {mind}.",
      "Your Mercury, which governs how you think and talk, is in {Mer}, and you {mind}.",
      "Mercury rules thinking and communication, and in {Mer} it makes you {mind}.",
      "In {Mer}, Mercury, the planet of the mind, has you {mind}.",
    ], 0), { Mer: mercury.name, mind: SIGN_SPOT[mercury.id].mind[idx("mind")] }),
    fill(pick(["In practice, you {x}.", "Day to day, you {x}.", "At work and at home, you {x}."], "mind-way"), { x: pick(MIND_WAY[mercury.id], "mind-way-x") }),
    fill(at([
      "Venus, your planet of love and pleasure, is in {V}, so you {love}.",
      "Your Venus, which governs love and what you enjoy, is in {V}, and you {love}.",
      "Venus rules affection, and in {V} it means you {love}.",
      "In {V}, Venus, the planet of relationships, has you {love}.",
    ], 1), { V: venus.name, love: SIGN_SPOT[venus.id].love[idx("love")] }),
    fill(pick(["In close relationships, you {x}.", "With the people you love, you {x}.", "As a partner or friend, you {x}."], "venus-way"), { x: pick(VENUS_WAY[venus.id], "venus-way-x") }),
    fill(at([
      "Mars, your planet of drive, is in {M}, so when you want something you {drive}.",
      "Your Mars, which governs how you go after things, is in {M}, and you {drive}.",
      "Mars rules energy and action, and in {M} it leads you to {drive}.",
      "In {M}, Mars, the planet of action, has you {drive}.",
    ], 2), { M: mars.name, drive: SIGN_SPOT[mars.id].drive[idx("drive")] }),
    fill(pick(["When there is work to do, you {x}.", "On a task, you {x}.", "Given a goal, you {x}."], "mars-way"), { x: pick(MARS_WAY[mars.id], "mars-way-x") }),
    deep ? fill(pick([
      "Your {kV} {V} Venus and {kM} {M} Mars meet here: {clause}.",
      "Comparing your {kV} {V} Venus with your {kM} {M} Mars, {clause}.",
      "Venus in {V} makes your affections {kV} and Mars in {M} makes your drive {kM}, and {clause}.",
    ], "vm-open"), { V: venus.name, M: mars.name, kV: venus.keywords.split(", ")[0], kM: mars.keywords.split(", ")[0], clause: pick(VENUS_MARS[vmFeel], "vm") }) : "",
    deep ? fill(pick(mercury.id === sun.id ? MERCURY_SUN.same : MERCURY_SUN.other, "mer"), {
      Sun: sun.name, Mer: mercury.name, kw: kwOf(mercury), aKw: an(mercury.keywords.split(", ").slice(0, 2).join(", ")),
    }) : "",
  ];

  const family = NUMBER_FAMILIES.find((f) => f.members.includes(lp))!;
  const bd = birthday(date);
  const day = Number(date.slice(8, 10));
  const py = personalYear(date, year).value;
  const bdSpot = LIFE_PATH_SPOT[bd.value] ?? L;
  const path = [
    lpLine,
    masterLine,
    deep ? fill(pick(["In daily life, you {x}.", "As a Life Path {n}, you {x}.", "Practically, this means you {x}."], "lp-way"), { n: String(lp), x: pick(LIFE_PATH_WAY[lp], "lp-way-x") }) : "",
    deep ? fill(pick([
      "Your {Sun} Sun and Life Path {n} {clause}, and your greatest strength on this path is {strength}.",
      "Together, your {El} Sun and your {n} {clause}, and they point to your main strength: {strength}.",
      "Put your {Sun} Sun beside Life Path {n} and they {clause}; the strength in that is {strength}.",
    ], "family"), { Sun: sun.name, El: sun.element, n: String(lp), clause: SUN_FAMILY[`${sun.element}|${family.name}`], strength: L.strength }) : "",
    deep ? fill(pick([
      "Your birthday number, from the day of the month you were born, is {b} (the {day}), {kw}, which adds {flav}.",
      "Being born on the {day} gives you birthday number {b}, {kw}, and with it {flav}.",
      "Numerology also reads the day of the month: the {day} makes birthday number {b}, {kw}, adding {flav}.",
    ], "bday"), { day: ordinal(day), b: String(bd.value), kw: NUMBER_MEANINGS[bd.value].keyword.replace(/^The /, "the "), flav: bdSpot.flavour[bd.value === lp ? 1 - idx("flavour") : idx("bday-flav")] }) : "",
    fill(pick([
      "Numerology gives each year of your life its own number, and {year} is your Personal Year {py}: a year of {short}.",
      "Your Personal Year number, which changes every 1 January, is {py} for {year}, so expect {short}.",
      "{year} brings you Personal Year {py}, a yearly number worked out from your birthday, which points to {short}.",
      "For {year}, your Personal Year, a number taken from your birthday and the year itself, is {py}: a time for {short}.",
    ], "py"), { year: String(year), py: String(py), short: pick(PY_SHORT[py], "py-short") }),
  ];

  const secret = secretFriendOf(cn.animal.id);
  const yy = cn.yinYang.toLowerCase();
  const yyGloss = yy === "yang" ? "the active, outgoing half of the yin and yang pair" : "the receptive, reflective half of the yin and yang pair";
  const animal = [
    animalLine,
    deep ? fill(pick(EAST_WEST[`${El}|${sun.element}`], "east-west"), { Sun: sun.name, aSun: an(sun.name), Animal }) : "",
    deep ? fill(pick([
      "Like many people born in a year of the {Animal}, you {x}.",
      "In everyday life, your {Animal} side means you {x}.",
      "The {Animal} also shows in your habits: you {x}.",
    ], "animal-way"), { Animal, x: pick(ANIMAL_WAY[cn.animal.id], "animal-way-x") }) : "",
    !deep ? fill(pick([
      "Your {Animal} year is {yy}, {gloss}, so you {p}.",
      "Chinese astrology counts your year as {yy}, {gloss}, which means you {p}.",
      "Because your {Animal} year is {yy}, {gloss}, you {p}.",
    ], "yy"), { yy, gloss: yyGloss, Animal, p: pick(ANIMAL_POLARITY[cn.animal.id], "yy-p") }) : "",
    deep ? fill(pick([
      "Your secret friend on the Chinese wheel, the animal traditionally paired with yours for quiet support, is the {X}, which offers the {q} you sometimes need.",
      "On the Chinese wheel, the {X} is your secret friend, an animal said to be a natural ally of the {Animal}, and its {q} balances yours.",
      "Chinese astrology pairs each animal with a secret friend for mutual support, and yours is the {X}, whose {q} complements your {Animal}.",
    ], "secret"), { X: secret.name, Animal, q: ANIMAL_SIDES[secret.id].quality[idx("sq")] }) : "",
  ];

  const sections: SpotlightText["sections"] = [
    { heading: "At your core", text: core.filter(Boolean).join(" ") },
    { heading: "How you think, love and act", text: act.filter(Boolean).join(" ") },
    { heading: "Your path", text: path.filter(Boolean).join(" ") },
    { heading: `Your ${Animal}`, text: animal.filter(Boolean).join(" ") },
  ];

  if (deep) {
    // love and work: Venus and the Moon together, then where your number and animal shine
    const deepLp = LIFE_PATH_DEEP[lp];
    const fields = deepLp.thrivesIn.slice(0, 2).map(lcFirst);
    const roles = PROFILES[cn.animal.id].careers.replace(/\.$/, "").split(", ").slice(0, 2).map(lcFirst);
    sections.push({
      heading: "In love and at work",
      text: [
        fill(pick([
          "With Venus in {V}, you {love}, and whoever you love should know your {Mo} Moon {need}.",
          "Venus in {V} means you {love}, while your {Mo} Moon {need}.",
          "In love you {love}, thanks to Venus in {V}, and the right person understands that your {Mo} Moon {need}.",
        ], "love-deep"), { V: venus.name, Mo: moon.name, love: SIGN_SPOT[venus.id].love[1 - idx("love")], need: M.need[1 - needAt] }),
        fill(pick([
          "At work, your {M} Mars wants a place where you can {drive}, and your {Animal} enjoys {aw}.",
          "Work suits your Life Path {n} and {M} Mars when you can {drive}, ideally {aw}.",
          "Give your {M} Mars room to {drive}, and your {Animal} side {aw}, and work feels right.",
        ], "work"), { n: String(lp), M: mars.name, Animal, aw: ANIMAL_PARTS[cn.animal.id].work, drive: SIGN_SPOT[mars.id].drive[1 - idx("drive")] }),
        fill(pick(["Paths that suit both your {n} and your {Animal} include {fields}, or roles such as {roles}.", "Both your {n} and your {Animal} would enjoy {fields}, or work as {roles}."], "paths"), { n: String(lp), Animal, fields: fields.join(", "), roles: roles.map(an).join(" or ") }),
      ].join(" "),
    });
    // looking after yourself: the animal's wellbeing with what recharges the Moon, and the Life Path's practice beside Mars
    sections.push({
      heading: "Looking after yourself",
      text: [
        fill(pick([
          "Your {Animal} side does well with {aw}, and your {Mo} Moon recharges with {mw}.",
          "The {Animal} in you needs {aw}, while your {Mo} Moon recharges with {mw}.",
          "Look after the {Animal} in you with {aw}, and your {Mo} Moon with {mw}.",
        ], "wellbeing"), { Animal, aw: ANIMAL_PARTS[cn.animal.id].wellbeing, Mo: moon.name, mw: SIGN_PARTS[moon.id].wellbeing }),
        fill(pick([
          "With Mars in {M}, watch out for {trap}, and as practice for your {n} path, {growth}.",
          "Try this for your Life Path {n}: {growth}, and with your {M} Mars, watch out for {trap}.",
        ], "growth"), { n: String(lp), growth: lcFirst(noStop(firstSentence(deepLp.growth))), M: mars.name, trap: SIGN_SPOT[mars.id].trap }),
      ].join(" "),
    });
  }

  const animalGift = A.gift;
  const moonEdge = M.edge[idx("moon-edge")];
  const heart = M.heart[idx("heart")];
  const adj = S.title[1 - titleAt].toLowerCase();
  const closing = fill(pick([
    "In short, you are {aAdj} {Sun} with {aHeart} {Moon} Moon, {aEl} {Animal} by birth year and a Life Path {n}, the {lpWord}.",
    "Taken together: {aAdj} {Sun} Sun, {aHeart} {Moon} Moon, the instincts of {aEl} {Animal} and the path of the {lpWord}.",
    "Altogether, that makes you {aAdj} {Sun} with {aHeart} {Moon} Moon, born in {aEl} {Animal} year, walking Life Path {n}.",
  ], "closing"), { aAdj: an(adj), aEl: an(El), Animal, aHeart: an(heart), Moon: moon.name, Sun: sun.name, lpWord, n: String(lp) });

  if (!deep) {
    sections.push({
      heading: "Meeting yourself",
      text: [
        fill(pick([
          "Your {Sun} strength is {gift}, and your {Animal} adds {aGift}.",
          "With the Sun in {Sun}, you are at your best {gift}, and your {Animal} brings {aGift}.",
          "Your clearest {Sun} gift is {gift}, and the {Animal} in you adds {aGift}.",
        ], "gifts"), { gift: sunGift, Animal, aGift: animalGift, Sun: sun.name }),
        fill(pick([
          "The challenges are {e1}, which your {Moon} Moon finds hard, and {e2}, which Life Path {n} asks of you.",
          "Where you will grow most: {e1} for your {Moon} Moon, and {e2} on your {n} path.",
          "Your {Moon} Moon is working on {e1}, and your {n} path on {e2}.",
        ], "edges"), { e1: moonEdge, e2: lpEdge, Moon: moon.name, n: String(lp) }),
      ].join(" "),
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

