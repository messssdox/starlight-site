// Compatibility between two people: the zodiac wheel, the five elements, Life Path
// families and this year's Personal Years, plus a simple harmony score with its working.

import { lifePath, personalYear } from "./numerology.ts";
import { chineseSign, relationBetween, type Relation, type ChineseSign } from "./chinese.ts";
import { ELEMENTS, type Element } from "../data/zodiac.ts";
import { NUMBER_FAMILIES, NUMBER_MEANINGS, PERSONAL_YEAR_THEMES } from "../data/numbers.ts";
import type { Breakdown } from "./explain.ts";

export type ElementRelation = "same" | "iFeed" | "theyFeed" | "iGuide" | "theyGuide";

/** Pictures for the five-element cycles, so each pairing is easy to imagine. */
const FEEDS_IMAGE: Record<Element, string> = {
  Wood: "Wood feeds Fire, as logs keep a fire burning",
  Fire: "Fire feeds Earth, as ash enriches the soil",
  Earth: "Earth feeds Metal, as the ground holds ore",
  Metal: "Metal feeds Water, as dew gathers on cool metal",
  Water: "Water feeds Wood, as rain makes trees grow",
};
const CONTROLS_IMAGE: Record<Element, string> = {
  Wood: "Wood holds Earth in place, as roots bind the soil",
  Fire: "Fire shapes Metal, as a forge softens iron",
  Earth: "Earth holds Water back, as a riverbank guides the stream",
  Metal: "Metal trims Wood, as shears prune a tree",
  Water: "Water calms Fire, as rain cools a flame",
};

export function elementRelation(mine: Element, theirs: Element): ElementRelation {
  if (mine === theirs) return "same";
  if (ELEMENTS[mine].feeds === theirs) return "iFeed";
  if (ELEMENTS[theirs].feeds === mine) return "theyFeed";
  if (ELEMENTS[mine].controls === theirs) return "iGuide";
  return "theyGuide";
}

export function elementLine(mine: Element, theirs: Element, them: string): string {
  switch (elementRelation(mine, theirs)) {
    case "same":
      return `You are both ${mine}, so you share the same basic energy. You understand each other's needs, and can amplify each other's moods, good and bad.`;
    case "iFeed":
      return `${FEEDS_IMAGE[mine]}. Your ${mine} naturally nourishes ${them}'s ${theirs}: you tend to encourage and support them.`;
    case "theyFeed":
      return `${FEEDS_IMAGE[theirs]}. ${cap(them)}'s ${theirs} naturally nourishes your ${mine}: they tend to encourage and support you.`;
    case "iGuide":
      return `${CONTROLS_IMAGE[mine]}. Your ${mine} keeps ${them}'s ${theirs} in check: you may find yourself steering or guiding them. Used gently, that brings structure; used too hard, it can feel like pressure.`;
    case "theyGuide":
      return `${CONTROLS_IMAGE[theirs]}. ${cap(them)}'s ${theirs} keeps your ${mine} in check: they may steer or challenge you. That can feel limiting, or it can help you grow.`;
  }
}

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
const familyOf = (n: number) => NUMBER_FAMILIES.find((f) => f.members.includes(n));
/** "fresh starts" from "A year of fresh starts. ..." */
export const yearTheme = (n: number) => (PERSONAL_YEAR_THEMES[n].match(/^A year of ([^.]+)\./)?.[1] ?? "");

// Points for the harmony score. Each part can add up to its maximum; the total is out of 5.
const CHINESE_POINTS: Record<Relation, number> = { secret: 2, friend: 2, same: 1.5, neutral: 1, clash: 0.5 };
const ELEMENT_POINTS: Record<ElementRelation, number> = { iFeed: 1.5, theyFeed: 1.5, same: 1, iGuide: 0.5, theyGuide: 0.5 };
const NUMBER_POINTS = { same: 1.5, different: 0.75 };

export interface Comparison {
  me: { lifePath: number; sign: ChineseSign; personalYear: number };
  them: { lifePath: number; sign: ChineseSign; personalYear: number };
  relation: Relation;
  element: ElementRelation;
  sameFamily: boolean;
  /** 1 to 5, in half steps. */
  harmony: number;
  points: { chinese: number; element: number; numbers: number };
}

export function compare(myDate: string, theirDate: string, year: number): Comparison {
  const person = (d: string) => ({ lifePath: lifePath(d).value, sign: chineseSign(d), personalYear: personalYear(d, year).value });
  const me = person(myDate);
  const them = person(theirDate);
  const relation = relationBetween(me.sign.animal.id, them.sign.animal.id);
  const element = elementRelation(me.sign.element, them.sign.element);
  const fam = familyOf(me.lifePath);
  const sameFamily = !!fam && fam === familyOf(them.lifePath);
  const points = { chinese: CHINESE_POINTS[relation], element: ELEMENT_POINTS[element], numbers: sameFamily ? NUMBER_POINTS.same : NUMBER_POINTS.different };
  const raw = points.chinese + points.element + points.numbers;
  const harmony = Math.min(5, Math.max(1, Math.round(raw * 2) / 2));
  return { me, them, relation, element, sameFamily, harmony, points };
}

const RELATION_NAMES: Record<Relation, string> = {
  secret: "secret friends",
  friend: "in the same friend group",
  same: "the same animal",
  neutral: "neither friends nor rivals",
  clash: "opposite each other (a clash)",
};
const ELEMENT_NAMES: Record<ElementRelation, string> = {
  iFeed: "your element feeds theirs",
  theyFeed: "their element feeds yours",
  same: "the same element",
  iGuide: "your element keeps theirs in check",
  theyGuide: "their element keeps yours in check",
};

/** The working behind a compatibility reading, in the same shape as the other cards. */
export function comparisonBreakdown(c: Comparison, them: string): Breakdown {
  const famMe = familyOf(c.me.lifePath);
  const famThem = familyOf(c.them.lifePath);
  const total = c.points.chinese + c.points.element + c.points.numbers;
  return {
    id: "how-compare",
    title: "How we compared you",
    intro: `A compatibility reading puts your chart beside ${them}'s and looks at three things: the zodiac wheel, the five elements and your Life Paths.`,
    steps: [
      {
        text: `Find both animals: you are a ${c.me.sign.animal.name} and ${them} is a ${c.them.sign.animal.name}. On the wheel you are ${RELATION_NAMES[c.relation]}.`,
        why: "Where two animals sit on the wheel shows how naturally they get along: friend groups and secret friends click easily, and opposite animals pull against each other.",
      },
      {
        text: `Compare your year elements: your ${c.me.sign.element} and their ${c.them.sign.element}. That means ${ELEMENT_NAMES[c.element]}.`,
        why: "The five elements feed each other in one cycle (Wood, Fire, Earth, Metal, Water) and keep each other in check in another. Feeding brings support; checking brings challenge and structure.",
      },
      {
        text: `Compare your Life Paths: your ${c.me.lifePath} is one of the ${famMe?.name ?? "numbers"}, and their ${c.them.lifePath} is one of the ${famThem?.name ?? "numbers"}. ${c.sameFamily ? "That is the same family." : "Those are different families."}`,
        why: "Numerologists group Life Paths into three families that share a rhythm: 1, 5 and 7 are independent minds; 2, 4, 8, 11 and 22 are steady builders; 3, 6, 9 and 33 are creative hearts.",
      },
      {
        text: `Score each part: wheel ${c.points.chinese} of 2, elements ${c.points.element} of 1.5, Life Paths ${c.points.numbers} of 1.5. Together that makes ${total} out of 5.`,
        why: "Secret friends and friend groups score highest on the wheel, and clashes lowest. Feeding elements score highest, and a matching number family scores more than a different one.",
      },
      { text: `Round to the nearest half star: ${c.harmony} out of 5.`, why: "The score is only a starting point. Every pairing can work beautifully with care, and every pairing has something to learn." },
    ],
    result: `Your harmony is ${c.harmony} out of 5.`,
    articles: [
      { id: "compatibility/chinese-zodiac-compatibility", label: "Chinese zodiac compatibility" },
      { id: "compatibility/numerology-compatibility", label: "Numerology compatibility" },
      { id: "elements/the-five-elements-wu-xing", label: "The five elements" },
    ],
  };
}

/** One line about how two Life Paths meet, using each number's keyword. */
export function lifePathPairLine(mine: number, theirs: number, them: string): string {
  const a = NUMBER_MEANINGS[mine]?.keyword ?? String(mine);
  const b = NUMBER_MEANINGS[theirs]?.keyword ?? String(theirs);
  if (mine === theirs) return `You are both Life Path ${mine}, ${a}, so you recognise each other's drive and dreams, and also each other's habits.`;
  return `Your Life Path ${mine}, ${a}, meets ${them}'s Life Path ${theirs}, ${b}.`;
}

/** This year for the two of you, from both Personal Years. */
export function yearTogetherLine(mine: number, theirs: number, them: string): string {
  if (mine === theirs) return `You are both in a Personal Year ${mine} this year, a year of ${yearTheme(mine)}, so you are moving through it in step.`;
  return `This year you are in a Personal Year ${mine}, a year of ${yearTheme(mine)}, while ${them} is in a Personal Year ${theirs}, a year of ${yearTheme(theirs)}. Knowing that can explain why you may want different things right now.`;
}
