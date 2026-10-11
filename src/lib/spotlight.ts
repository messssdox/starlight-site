// "Meet yourself": the spotlight at the top of a solo reading. One portrait woven from the
// Sun, Moon and personal planets, the Life Path and the Chinese animal, with every paragraph
// mixing the systems. Quick Glance is one paragraph (about 150 words), First Timers adds
// headed paragraphs (about 400) and the Full Deep Dive goes further (about 700).
// Wordings are picked from the birth date, so the same person always reads the same and
// two people with the same signs rarely do.

import { SIGNS, PLANET_BY_ID, type Sign, type Element as WesternElement, type Modality } from "../data/astrology.ts";
import { PLACEMENTS } from "../data/placements.ts";
import { NUMBER_MEANINGS, NUMBER_FAMILIES, LIFE_PATH_DEEP } from "../data/numbers.ts";
import { PROFILES } from "../data/zodiac.ts";
import { SIGN_PARTS, ANIMAL_PARTS } from "../data/pairs.ts";
import { LINK_FEEL } from "../data/synastry.ts";
import { ANIMAL_SIDES } from "../data/pair-spotlight.ts";
import { PLANET_IMAGE, SCENES, ANIMAL_IMAGE, LIFE_PATH_IMAGE } from "../data/images.ts";
import {
  SIGN_SPOT, SUN_MOON_MIX, SAME_SIGN, LIFE_PATH_SPOT, SUN_FAMILY, ANIMAL_SPOT, YEAR_ELEMENT_TWIST, EAST_WEST, ANIMAL_POLARITY,
  ELEMENT_LEADS, ELEMENT_MISSING, MODALITY_LEADS, STELLIUM, VENUS_MARS, MERCURY_SUN, PY_SHORT,
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

// Frames for the everyday pictures. {S} is the sign, {img} a picture and {scene} an everyday moment.
const SUN_PICTURE = {
  explain: [
    "Your Sun sign is the you everyone sees, and {aS} Sun is {img}.",
    "Your Sun is the side of you people meet first, and yours is {img}.",
    "Think of your {S} Sun as the you on show: {img}.",
    "Your Sun is who you are at heart, and on a free evening yours has you {scene}.",
    "Your Sun shows in how you spend your own time: as {aS}, you're probably {scene}.",
  ],
  plain: [
    "Picture {img}: that is your {S} Sun.",
    "If your {S} Sun were a thing, it would be {img}.",
    "In everyday terms, your {S} side is {img}.",
    "On a free evening you're probably {scene}.",
    "Catch you on a night off and you're likely {scene}.",
    "Left to your own devices, you'll be {scene}.",
  ],
};
const MOON_PICTURE = {
  explain: [
    "Your Moon is the private you that close friends see, and {aS} Moon is {img}.",
    "Your Moon is how you feel and cope, and yours is {img}.",
    "Your Moon shows on a bad day: yours has you {scene}.",
    "The Moon is your inner world, and after a rough day your {S} Moon has you {scene}.",
  ],
  plain: [
    "Your {S} Moon is {img}.",
    "Emotionally, you are {img}.",
    "On the inside you're {img}, which is your {S} Moon all over.",
    "After a rough day, you're the one {scene}.",
    "When things go wrong, you'll likely be {scene}.",
    "Give you a hard week and you'll end up {scene}.",
  ],
};
const PICTURE: Record<"mercury" | "venus" | "mars", string[]> = {
  mercury: ["Your mind works like {img}.", "Your {S} Mercury is {img}.", "In the group chat you're the one {scene}.", "When you text, you're {scene}.", "Message you and you'll be {scene}."],
  venus: ["Your {S} Venus is {img}.", "Your love style is {img}.", "When you love people, you show it by {scene}.", "Your idea of a treat for the people you love is {scene}.", "To you, love looks like {scene}."],
  mars: ["Your {S} Mars is {img}.", "You go after things like {img}.", "Give you a job to do and you'll be {scene}.", "When something needs doing, you're {scene}.", "Hand you a project and you're {scene}."],
};

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
  const deep = tier === "deep", first = tier === "first";

  // a picture or an everyday moment for a planet, never the same one twice in a reading
  const scenesFor = { sun: SCENES.evening, moon: SCENES.upset, mercury: SCENES.chat, venus: SCENES.treat, mars: SCENES.task } as const;
  const picture = (planet: keyof typeof PLANET_NAME, frames: string[], salt: string) => {
    const sign = signs.signs[planet];
    const frame = pick(frames, `${salt}-frame`);
    return fill(frame, {
      S: sign.name, aS: an(sign.name),
      img: frame.includes("{img}") ? pick(PLANET_IMAGE[planet][sign.id], `${salt}-img`) : "",
      scene: frame.includes("{scene}") ? pick(scenesFor[planet][sign.id], `${salt}-scene`) : "",
    });
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

  // people with plenty of an element, for the element a chart is missing: "the friend who ..."
  const friendsWith = (e: WesternElement) => SIGNS.filter((x) => x.element === e)
    .flatMap((x) => [...PLANET_IMAGE.sun[x.id], ...PLANET_IMAGE.moon[x.id]])
    .filter((t) => /^(the friend|the one|the person|someone|the grandparent)\b/.test(t));

  const focus = crowded
    ? fill(pick(STELLIUM, "stellium"), { Count: COUNT[bySign[crowded.id]], count: COUNT[bySign[crowded.id]].toLowerCase(), Sign: crowded.name, native: SIGN_SPOT[crowded.id].native })
    : leadEl ? pick(ELEMENT_LEADS[leadEl], "lead") : "";

  // the core: Sun, then Moon and how the two meet
  const coreAt = idx("core");
  const coreLine = fill(pick([
    "At your core you are {aSun}: {core}.",
    "Your {Sun} Sun is the heart of you: {core}.",
    "The heart of you is pure {Sun}: {core}.",
    "Being {aSun} makes you {core}.",
    "First and foremost you are {aSun}, {core}.",
  ], "core-open"), { aSun: an(sun.name), Sun: sun.name, core: S.core[coreAt] });
  const needAt = idx("need");
  const moonLine = sun.id === moon.id
    ? fill(pick(SAME_SIGN, "same"), { Sun: sun.name, img: pick(PLANET_IMAGE.moon[moon.id], "same-img") })
    : `${pick(["Underneath, your", "Inside, your", "Beneath that, your", "Deeper down, your"], "moon-open")} ${moon.name} Moon ${M.need[needAt]}, ${pick(SUN_MOON_MIX[`${sun.element}|${moon.element}`], "mix")}.`;
  const sunPic = picture("sun", first ? SUN_PICTURE.explain : SUN_PICTURE.plain, "sun");
  const moonPic = picture("moon", first ? MOON_PICTURE.explain : MOON_PICTURE.plain, "moon");

  const lpLine = fill(pick([
    "Life Path {n} adds {flavour}: {call}.",
    "Your Life Path {n}, {Keyword}, brings {flavour}: {call}.",
    "Then there is your Life Path, {n}, with {flavour}: {call}.",
    "Your numbers add {flavour}, because as a Life Path {n}, {call}.",
  ], "lp-open"), { n: String(lp), Keyword: NUMBER_MEANINGS[lp].keyword.replace(/^The /, "the "), flavour: L.flavour[idx("flavour")], call: L.call[idx("call")] });
  const animalLine = `${pick(["As", "Born"], "animal-open") === "As" ? `As ${an(El)} ${Animal}` : `Born ${an(El)} ${Animal}`}, you carry ${A.spirit[idx("spirit")]}, ${pick(YEAR_ELEMENT_TWIST[El], "twist")}.`;
  const sunGift = S.gift[idx("gift")];
  const loveLine = fill(pick([
    "When it comes to the heart, you {love}.",
    "With Venus in {V}, you {love}.",
    "In love, your {V} Venus means you {love}.",
    "Romance-wise, you {love}.",
    "Your Venus is in {V}, so you {love}.",
  ], "love-open"), { love: SIGN_SPOT[venus.id].love[idx("love")], V: venus.name });
  const eastWest = fill(pick(EAST_WEST[`${El}|${sun.element}`], "east-west"), { Sun: sun.name, Animal });
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
      "Your gift is {gift}, and your growing edge is {edge}.",
      "You shine at {gift}, and you grow most by {edge}.",
      "You shine at {gift}; you grow by {edge}.",
      "Your {Sun} gift is {gift}; your Life Path {n} lesson is {edge}.",
    ], "gift-edge"), { gift: sunGift, edge: lpEdge, Sun: sun.name, n: String(lp) });
    return { title, facts, gifts: [], edges: [], closing: "", sections: [{ text: [coreLine, sunPic, moonLine, moonPic, focus, lpLine, animalLine, giftEdge].filter(Boolean).join(" ") }] };
  }

  // First Timers and Full Deep Dive: headed paragraphs
  const rising = signs.rising
    ? fill(pick([
        "And with {R} Rising, people first meet someone {g}.",
        "With {R} Rising, the first impression you give is {g}.",
      ], "rising"), { R: signs.rising.name, g: lcFirst(PLACEMENTS.rising[signs.rising.id].glance) })
    : "";
  const unsureMoon = signs.unsure.moon
    ? `Your Moon moved from ${signs.unsure.moon.from.name} into ${signs.unsure.moon.to.name} on the day you were born, so add your birth time in the birth chart below to be sure which is yours.`
    : "";
  const modePlanets = leadMode ? PAIR_PLANETS.filter((p) => signs.signs[p].modality === leadMode).map((p) => PLANET_NAME[p]) : [];
  const core = [
    sunPic, coreLine,
    moonLine, moonPic, unsureMoon, rising, focus,
    deep ? missingEl.slice(0, 1).map((e) => fill(pick([
      "With no {El} among your personal planets, {clause}, and {friend} is good to have around.",
      "Your personal planets skip {El} entirely: {clause}, which is why {friend} is so good for you.",
      "There is no {El} in your five personal planets, meaning {clause}; keep close {friend}.",
    ], `missing-${e}`), { El: e, clause: pick(ELEMENT_MISSING[e], `missing-clause-${e}`), friend: pick(friendsWith(e), `missing-friend-${e}`) })).join(" ") : "",
    deep && leadMode ? fill(pick(MODALITY_LEADS[leadMode], "mode"), { planets: `your ${listOf(modePlanets)}`, Planets: `Your ${listOf(modePlanets)}` }) : "",
  ];

  const vmFeel = LINK_FEEL[signLink(venus, mars)];
  const act = [
    fill(pick(first ? [
      "Mercury, your planet of thinking and talking, is in {Mer}, so you {mind}.",
      "Your Mercury (how you think and talk) is in {Mer}: you {mind}.",
      "Mercury rules how you think, and in {Mer} it means you {mind}.",
      "Your thinking planet, Mercury, sits in {Mer}, so you {mind}.",
    ] : [
      "When it comes to talking, you {mind}.",
      "Your mind shows itself quickly: you {mind}.",
      "With Mercury in {Mer}, you {mind}.",
    ], "mind-open"), { Mer: mercury.name, mind: SIGN_SPOT[mercury.id].mind[idx("mind")] }),
    picture("mercury", PICTURE.mercury, "mercury"),
    first ? fill(pick([
      "Venus, your planet of love and pleasure, is in {V}, so you {love}.",
      "Your Venus (how you love and what you enjoy) is in {V}: you {love}.",
      "Venus rules how you love, and in {V} it means you {love}.",
      "Your love planet, Venus, sits in {V}, so you {love}.",
    ], "venus-open"), { V: venus.name, love: SIGN_SPOT[venus.id].love[idx("love")] }) : loveLine,
    picture("venus", PICTURE.venus, "venus"),
    fill(pick(first ? [
      "Mars, your planet of drive, is in {M}, so when you want something you {drive}.",
      "Your Mars (how you go after things) is in {M}: you {drive}.",
      "Mars rules your drive, and in {M} it means you {drive}.",
      "Your action planet, Mars, sits in {M}, so you {drive}.",
    ] : [
      "And when you want something, you {drive}.",
      "Going after what you want, you {drive}.",
      "With Mars in {M}, you {drive}.",
    ], "drive-open"), { M: mars.name, drive: SIGN_SPOT[mars.id].drive[idx("drive")] }),
    picture("mars", PICTURE.mars, "mars"),
    deep ? fill(pick([
      "Your Venus in {V} is {vImg} and your Mars in {M} is {mImg}, {clause}.",
      "Picture {vImg} beside {mImg}: that is your {V} Venus with your {M} Mars, {clause}.",
      "Put your {V} Venus ({vImg}) next to your {M} Mars ({mImg}), {clause}.",
    ], "vm-open"), { V: venus.name, M: mars.name, vImg: pick(PLANET_IMAGE.venus[venus.id], "vm-v"), mImg: pick(PLANET_IMAGE.mars[mars.id], "vm-m"), clause: pick(VENUS_MARS[vmFeel], "vm") }) : "",
    deep ? fill(pick(mercury.id === sun.id ? MERCURY_SUN.same : MERCURY_SUN.other, "mer"), {
      Sun: sun.name, Mer: mercury.name, aKw: an(mercury.keywords.split(", ").slice(0, 2).join(", ")), chat: pick(SCENES.chat[mercury.id], "mer-chat"),
    }) : "",
  ];

  const family = NUMBER_FAMILIES.find((f) => f.members.includes(lp))!;
  const bd = birthday(date);
  const day = Number(date.slice(8, 10));
  const py = personalYear(date, year).value;
  const lpImg = pick(LIFE_PATH_IMAGE[lp], "lp-img");
  const path = [
    lpLine,
    fill(pick([
      "Picture {img}: that is the {n} path.",
      "A Life Path {n} is {img}.",
      "If your number were a thing, it would be {img}.",
    ], "lp-pic"), { n: String(lp), img: lpImg }),
    deep ? fill(pick([
      "Your {Sun} Sun and Life Path {n} {clause}, and your greatest strength on this path is {strength}.",
      "Together, your {El} Sun and your {n} {clause}, which is where {strength} comes from.",
      "Put your {Sun} Sun beside Life Path {n} and they {clause}; the strength in that is {strength}.",
    ], "family"), { Sun: sun.name, El: sun.element, n: String(lp), clause: SUN_FAMILY[`${sun.element}|${family.name}`], strength: L.strength }) : "",
    deep ? fill(pick([
      "Your birth day, the {day}, also gives you birthday number {b}, {kw}, a little like {img}.",
      "Being born on the {day} adds birthday number {b}, {kw}, with something of {img} about it.",
      "There is your birthday number too: the {day} makes {b}, {kw}, as steady in you as {img}.",
    ], "bday"), { day: ordinal(day), b: String(bd.value), kw: NUMBER_MEANINGS[bd.value].keyword.replace(/^The /, "the "), img: pick(LIFE_PATH_IMAGE[bd.value] ?? LIFE_PATH_IMAGE[lp], "bday-img") }) : "",
    fill(pick([
      "{year} is a Personal Year {py} for you: a year of {short}.",
      "In {year} you are in a Personal Year {py}, so expect {short}.",
      "Your Personal Year number for {year} is {py}, which points to {short}.",
      "{year} brings you a Personal Year {py}, a time for {short}.",
    ], "py"), { year: String(year), py: String(py), short: pick(PY_SHORT[py], "py-short") }),
  ];

  const secret = secretFriendOf(cn.animal.id);
  const animal = [
    animalLine,
    deep ? eastWest : "",
    fill(pick([
      "Day to day, the {Animal} in you is {img}.",
      "Your {Animal} side is {img}.",
      "Picture {img}: that is your {Animal} at work.",
    ], "animal-pic"), { Animal, img: pick(ANIMAL_IMAGE[cn.animal.id], "animal-img") }),
    first ? fill(pick([
      "As a {yy} {Animal}, you {p}.",
      "Yours is a {yy} year, so you {p}.",
      "Your {Animal} is {yy}, which means you {p}.",
    ], "yy"), { yy: cn.yinYang.toLowerCase(), Animal, p: pick(ANIMAL_POLARITY[cn.animal.id], "yy-p") }) : "",
    deep ? fill(pick([
      "Your secret friend on the wheel is the {X}, {img}, quietly bringing out your best.",
      "Your secret friend is the {X}: think of {img}, always on your side.",
      "The {X} is your secret friend on the wheel, the one with the {q} you sometimes need.",
    ], "secret"), { X: secret.name, img: pick(ANIMAL_IMAGE[secret.id], "secret-img"), q: ANIMAL_SIDES[secret.id].quality[idx("sq")] }) : "",
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
          "Your {V} Venus means you {love}, while underneath, your {Mo} Moon {need}.",
          "In love you {love}, thanks to Venus in {V}, and the person for you understands that your {Mo} Moon {need}.",
        ], "love-deep"), { V: venus.name, Mo: moon.name, love: SIGN_SPOT[venus.id].love[1 - idx("love")], need: M.need[1 - needAt] }),
        fill(pick([
          "At work, your {M} Mars wants a place where you can {drive}, and your {Animal} enjoys {aw}.",
          "Your Life Path {n} and {M} Mars want work where you can {drive}, ideally {aw}.",
          "Give your {M} Mars room to {drive}, and your {Animal} side {aw}, and work feels right.",
        ], "work"), { n: String(lp), M: mars.name, Animal, aw: ANIMAL_PARTS[cn.animal.id].work, drive: SIGN_SPOT[mars.id].drive[1 - idx("drive")] }),
        fill(pick(["Paths that suit both your {n} and your {Animal} include {fields}, or roles such as {roles}.", "Your {n} and your {Animal} would both enjoy {fields}, or work as {roles}."], "paths"), { n: String(lp), Animal, fields: fields.join(", "), roles: roles.join(" or ") }),
      ].join(" "),
    });
    // looking after yourself: the animal's wellbeing with what recharges the Moon, and the Life Path's practice beside Mars
    sections.push({
      heading: "Looking after yourself",
      text: [
        fill(pick([
          "For your {Animal} side, {aw} help, and your {Mo} Moon recharges with {mw}.",
          "Your {Animal} needs {aw}, while your {Mo} Moon recharges with {mw}.",
          "Look after the {Animal} in you with {aw}, and your {Mo} Moon with {mw}.",
        ], "wellbeing"), { Animal, aw: ANIMAL_PARTS[cn.animal.id].wellbeing, Mo: moon.name, mw: SIGN_PARTS[moon.id].wellbeing }),
        fill(pick([
          "One practice for your {n} path, with Mars in {M}: {growth}, so you avoid {trap}.",
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
    "In short: {aAdj} {El} {Animal} with {aHeart} {Moon} heart, walking the path of the {lpWord}.",
    "Put it all together: {aAdj} {Sun} with {aHeart} {Moon} heart, {El} {Animal} spirit and the soul of the {lpWord}.",
    "So that is you: {aAdj} {Sun} Sun, {aHeart} {Moon} heart, {El} {Animal} instincts and {aLp} path.",
  ], "closing"), { aAdj: an(adj), El, Animal, aHeart: an(heart), Moon: moon.name, Sun: sun.name, lpWord, aLp: an(`${lpWord}'s`) });

  if (!deep) {
    sections.push({
      heading: "Meeting yourself",
      text: [
        fill(pick([
          "Your greatest gift is {gift}, and your {Animal} adds {aGift}.",
          "You are at your best {gift}, with your {Animal} bringing {aGift}.",
          "Your {Sun} gift is {gift}, and the {Animal} in you adds {aGift}.",
        ], "gifts"), { gift: sunGift, Animal, aGift: animalGift, Sun: sun.name }),
        fill(pick([
          "Your growing edges are {e1}, and {e2}.",
          "Where you grow most: {e1}, and {e2}.",
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

