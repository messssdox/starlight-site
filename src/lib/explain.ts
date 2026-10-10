// Plain-English working for every result in a reading, using the reader's own numbers,
// so each reading teaches how it was calculated as it goes.

import { reduce, letterValue, MASTER_NUMBERS, personalYear, challenges } from "./numerology.ts";
import { chineseSign, friendsOf, secretFriendOf, clashOf } from "./chinese.ts";
import { ANIMALS } from "../data/zodiac.ts";
import { LUNAR_NEW_YEAR } from "../data/lunar-new-year.ts";

export interface Breakdown {
  /** Anchor id, so each number on the reading can link to its working. */
  id: string;
  title: string;
  /** One sentence on what this result is. */
  intro: string;
  steps: string[];
  /** Letter chips for the name numbers: the letter, its value, and whether it counts here. */
  letters?: { letter: string; value: number; counted: boolean; wordStart: boolean }[];
  result: string;
  /** A short aside, such as the other school of thought. */
  note?: string;
  /** Library articles that go deeper, by collection id (category/slug). */
  articles: { id: string; label: string }[];
}

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

/** 1990-03-14 → 14 March 1990 */
export function longDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  return `${d} ${MONTHS[m - 1]} ${y}`;
}

const masterNote = (v: number) => (MASTER_NUMBERS.includes(v) ? `${v} is a master number, so we keep it as it is instead of adding its digits.` : "");

/** "Day 14: 1 + 4 = 5" or "Month 3: already a single digit, so it stays 3" */
function reduceLine(label: string, n: number, keepMasters = true): { line: string; value: number } {
  const r = reduce(n, keepMasters);
  if (r.steps.length === 0) {
    const why = n > 9 ? "a master number, so it stays" : "already a single digit, so it stays";
    return { line: `${label} ${n}: ${why} ${r.value}.`, value: r.value };
  }
  const tail = keepMasters && MASTER_NUMBERS.includes(r.value) ? ` (a master number, so we stop there)` : "";
  return { line: `${label} ${n}: ${r.steps.join(", then ")}${tail}.`, value: r.value };
}

/** The steps that reduce a final total, each as its own line. */
function finalLines(total: number, keepMasters = true): string[] {
  const r = reduce(total, keepMasters);
  const lines = r.steps.map((s) => `Add the digits again: ${s}.`);
  const m = keepMasters ? masterNote(r.value) : "";
  if (m) lines.push(m);
  return lines;
}

export function lifePathBreakdown(date: string): Breakdown {
  const [y, m, d] = date.split("-").map(Number);
  const day = reduceLine("Day", d);
  const month = reduceLine("Month", m);
  const year = reduceLine("Year", y);
  const total = day.value + month.value + year.value;
  const value = reduce(total).value;
  return {
    id: "how-life-path",
    title: "Life Path",
    intro: "Your Life Path is the most important number in numerology. It comes from your full birth date.",
    steps: [
      `Start with your birth date: ${longDate(date)}.`,
      `Shrink the day, the month and the year down separately by adding their digits.`,
      day.line,
      month.line,
      year.line,
      `Add the three results together: ${day.value} + ${month.value} + ${year.value} = ${total}.`,
      ...finalLines(total),
    ],
    result: `Your Life Path is ${value}.`,
    articles: [
      { id: "numerology/life-path-number", label: "The Life Path number" },
      { id: "numerology/master-numbers", label: "Master numbers" },
    ],
  };
}

type NameKind = "expression" | "soul" | "personality";
const VOWELS = new Set(["A", "E", "I", "O", "U"]);
const NAME_INFO: Record<NameKind, { title: string; intro: string; which: string; counts: (l: string) => boolean }> = {
  expression: {
    title: "Expression",
    intro: "Your Expression number shows your natural talents. It uses every letter of your full birth name.",
    which: "Every letter counts.",
    counts: () => true,
  },
  soul: {
    title: "Soul Urge",
    intro: "Your Soul Urge shows what your heart wants most. It uses only the vowels in your name.",
    which: "Only the vowels count: A, E, I, O and U. (Starlight treats Y as a consonant.)",
    counts: (l) => VOWELS.has(l),
  },
  personality: {
    title: "Personality",
    intro: "Your Personality number shows the side of you others meet first. It uses only the consonants in your name.",
    which: "Only the consonants count: every letter that is not A, E, I, O or U.",
    counts: (l) => !VOWELS.has(l),
  },
};

const wordsOf = (name: string) =>
  name
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toUpperCase()
    .split(/[^A-Z]+/)
    .filter(Boolean);

export function nameBreakdown(name: string, kind: NameKind): Breakdown {
  const info = NAME_INFO[kind];
  const words = wordsOf(name);
  const letters = words.flatMap((w) => w.split("").map((l, i) => ({ letter: l, value: letterValue(l), counted: info.counts(l), wordStart: i === 0 })));
  const wordLines: string[] = [];
  const wordTotals: number[] = [];
  for (const w of words) {
    const picked = w.split("").filter(info.counts);
    if (picked.length === 0) continue;
    const vals = picked.map(letterValue);
    const sum = vals.reduce((s, v) => s + v, 0);
    wordTotals.push(sum);
    wordLines.push(`${w}: ${picked.map((l, i) => `${l} ${vals[i]}`).join(" + ")} = ${sum}.`);
  }
  const total = wordTotals.reduce((s, v) => s + v, 0);
  const value = reduce(total).value;
  const steps = [
    `Each letter has a number from 1 to 9: A, J and S are 1; B, K and T are 2; and so on around to I and R, which are 9.`,
    info.which,
    ...wordLines,
  ];
  if (wordTotals.length > 1) steps.push(`Add the words together: ${wordTotals.join(" + ")} = ${total}.`);
  steps.push(...finalLines(total));
  return {
    id: `how-${kind}`,
    title: info.title,
    intro: info.intro,
    steps: wordTotals.length ? steps : [info.which, `Your name has no letters of this kind, so this number is 0.`],
    letters,
    result: `Your ${info.title} number is ${value}.`,
    articles: [{ id: "numerology/your-name-numbers", label: "Your name numbers" }],
  };
}

/** The four Challenge Numbers, worked out from the birth date by subtraction. */
export function challengesBreakdown(date: string): Breakdown {
  const [y, m, d] = date.split("-").map(Number);
  const c = challenges(date);
  const day = reduceLine("Day", d, false);
  const month = reduceLine("Month", m, false);
  const year = reduceLine("Year", y, false);
  const diff = (label: string, a: number, an: string, b: number, bn: string, v: number) =>
    `${label}: take the smaller from the larger of your ${an} (${a}) and your ${bn} (${b}). ${Math.max(a, b)} − ${Math.min(a, b)} = ${v}.`;
  return {
    id: "how-challenges",
    title: "Challenge Numbers",
    intro: "Your Challenge Numbers show the lessons you are working through. Like your Life Path, they come from your birth date, but they use subtraction instead of addition.",
    steps: [
      `Shrink the day, month and year of ${longDate(date)} to single digits. Master numbers are not kept here.`,
      day.line,
      month.line,
      year.line,
      diff("First Challenge (early life)", c.month, "month", c.day, "day", c.first),
      diff("Second Challenge (middle years)", c.day, "day", c.year, "year", c.second),
      diff("Third Challenge, the main one (all through life)", c.first, "First Challenge", c.second, "Second Challenge", c.third),
      diff("Fourth Challenge (later life)", c.month, "month", c.year, "year", c.fourth),
      `Because we always subtract, a challenge can only be 0 to 8. A 0 means you get to choose your lesson.`,
    ],
    result: `Your challenges are ${c.first}, ${c.second}, ${c.third} and ${c.fourth}. Your main challenge is ${c.third}.`,
    articles: [{ id: "numerology/challenge-numbers", label: "Challenge Numbers" }],
  };
}

/** Today's date as YYYY-MM-DD in the visitor's own time zone. */
export function todayIso(now = new Date()): string {
  const p = (n: number) => String(n).padStart(2, "0");
  return `${now.getFullYear()}-${p(now.getMonth() + 1)}-${p(now.getDate())}`;
}

/**
 * Personal Year. Starlight counts it from 1 January, the most widely used method.
 * The working also says which number the reader would have if they counted from their birthday instead.
 */
export function personalYearBreakdown(date: string, today: string): Breakdown {
  const [, m, d] = date.split("-").map(Number);
  const year = Number(today.slice(0, 4));
  const day = reduceLine("Birth day", d, false);
  const month = reduceLine("Birth month", m, false);
  const yr = reduceLine("This year,", year, false);
  const total = day.value + month.value + yr.value;
  const value = personalYear(date, year).value;
  const next = personalYear(date, year + 1).value;

  // The birthday school: the Personal Year for calendar year Y runs from the birthday in Y.
  const mmdd = date.slice(5);
  const birthdayPassed = today.slice(5) >= mmdd;
  const startYear = birthdayPassed ? year : year - 1;
  const bdValue = personalYear(date, startYear).value;
  // a 29 February birthday falls on 1 March in other years
  const birthdayIn = (y: number) => longDate(mmdd === "02-29" && !(y % 4 === 0 && (y % 100 !== 0 || y % 400 === 0)) ? `${y}-03-01` : `${y}-${mmdd}`);
  const bdStart = birthdayIn(startYear);
  const bdNext = birthdayIn(startYear + 1);
  const birthdayNote =
    bdValue === value
      ? `Counted that way, you would also be in a Personal Year ${bdValue}, running from ${bdStart} until your birthday on ${bdNext}.`
      : `Counted that way, you would be in a Personal Year ${bdValue} from ${bdStart} until your birthday on ${bdNext}.`;

  return {
    id: "how-personal-year",
    title: `Personal Year ${year}`,
    intro: "Your Personal Year shows where you are in numerology's nine-year cycle, and the theme this year brings.",
    steps: [
      `Use your birth day and month with the current year, ${year}. Master numbers are not kept for Personal Years.`,
      day.line,
      month.line,
      yr.line,
      `Add them together: ${day.value} + ${month.value} + ${yr.value} = ${total}.`,
      ...finalLines(total, false),
      `Starlight counts Personal Years from 1 January. Your Personal Year ${value} began on 1 January ${year}, and your next one, a Personal Year ${next}, starts on 1 January ${year + 1}.`,
    ],
    result: `You are in a Personal Year ${value}.`,
    note: `Do Personal Years change on your birthday? Some numerologists say yes and count each Personal Year from birthday to birthday. Starlight uses 1 January because it is the most common method. ${birthdayNote}`,
    articles: [{ id: "numerology/personal-year-number", label: "Your Personal Year number" }],
  };
}

const ELEMENT_DIGITS = "0 and 1 are Metal, 2 and 3 are Water, 4 and 5 are Wood, 6 and 7 are Fire, 8 and 9 are Earth";

export function chineseBreakdowns(date: string): Breakdown[] {
  const cn = chineseSign(date);
  const birthYear = Number(date.slice(0, 4));
  const lny = LUNAR_NEW_YEAR[birthYear];
  const yearLine = !lny
    ? `Your zodiac year is ${cn.zodiacYear}.`
    : date < lny
      ? `The Chinese year starts at Lunar New Year, not 1 January. In ${birthYear} Lunar New Year fell on ${longDate(lny)}. You were born before it, so you belong to the year before: ${cn.zodiacYear}.`
      : `The Chinese year starts at Lunar New Year, not 1 January. In ${birthYear} Lunar New Year fell on ${longDate(lny)}. You were born on or after it, so your zodiac year is ${cn.zodiacYear}.`;
  const diff = cn.zodiacYear - 1900;
  const place = ((diff % 12) + 12) % 12;
  const order = ANIMALS.slice(0, place + 1).map((a) => a.name).join(", ");
  const yearDigit = ((cn.zodiacYear % 10) + 10) % 10;

  const animal: Breakdown = {
    id: "how-animal",
    title: `Your animal: the ${cn.animal.name}`,
    intro: "Your Chinese zodiac animal comes from the year you were born, in the Chinese calendar.",
    steps: [
      `You were born on ${longDate(date)}.`,
      yearLine,
      `The twelve animals take turns, one per year, always in the same order. 1900 was a Rat year, so we count on from there.`,
      `${cn.zodiacYear} − 1900 = ${diff}. Taking away whole cycles of 12 leaves ${place}.`,
      place === 0
        ? `A remainder of 0 means a full number of cycles, so you land back on the Rat.`
        : `Count ${place} ${place === 1 ? "place" : "places"} on from the Rat: ${order}.`,
    ],
    result: `You are a ${cn.animal.name}.`,
    articles: [
      { id: "chinese-zodiac/how-your-animal-is-chosen", label: "How your animal is chosen" },
      { id: `chinese-zodiac/${cn.animal.id}`, label: `The ${cn.animal.name}` },
    ],
  };

  const element: Breakdown = {
    id: "how-element",
    title: `Your element: ${cn.element}`,
    intro: "Each year also has one of the five elements, and is either yin or yang.",
    steps: [
      `The element comes from the last digit of your zodiac year. ${ELEMENT_DIGITS}.`,
      `${cn.zodiacYear} ends in ${yearDigit}, so your year element is ${cn.element}.`,
      `Even years are yang and odd years are yin. ${cn.zodiacYear} is ${cn.zodiacYear % 2 === 0 ? "even" : "odd"}, so it is a ${cn.yinYang.toLowerCase()} year.`,
      `Your ${cn.animal.name} also has its own fixed element, ${cn.animal.element}. The year element is the one that changes, and it is why people call you a ${cn.element} ${cn.animal.name}.`,
    ],
    result: `You are a ${cn.yinYang.toLowerCase()} ${cn.element} ${cn.animal.name}.`,
    articles: [
      { id: "chinese-zodiac/year-elements-and-the-60-year-cycle", label: "Year elements and the 60-year cycle" },
      { id: "elements/the-five-elements-wu-xing", label: "The five elements" },
      { id: "elements/yin-and-yang", label: "Yin and yang" },
    ],
  };

  const friends = friendsOf(cn.animal.id).map((a) => a.name);
  const wheel: Breakdown = {
    id: "how-wheel",
    title: "Your friends and clash on the wheel",
    intro: "The animals sit in a circle, and where they sit shows who gets along.",
    steps: [
      `Friend group: animals four places apart around the wheel form a group of three. Yours is the ${cn.animal.name}, ${friends.join(" and ")}.`,
      `Secret friend: the animals are paired off in six fixed pairs. The ${cn.animal.name}'s partner is the ${secretFriendOf(cn.animal.id).name}.`,
      `Clash: the animal six places away sits directly opposite you. For the ${cn.animal.name} that is the ${clashOf(cn.animal.id).name}.`,
    ],
    result: `Friends: ${friends.join(" and ")}. Secret friend: ${secretFriendOf(cn.animal.id).name}. Clash: ${clashOf(cn.animal.id).name}.`,
    articles: [{ id: "chinese-zodiac/friend-groups-secret-friends-and-clashes", label: "Friend groups, secret friends and clashes" }],
  };

  return [animal, element, wheel];
}
