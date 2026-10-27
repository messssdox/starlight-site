// Plain-English working for every result in a reading, using the reader's own numbers,
// so each reading teaches how it was calculated as it goes. Every step says what we do
// and, in plain words, why; each card ends with what the result means for the reader.

import { reduce, letterValue, MASTER_NUMBERS, personalYear, challenges, lifePath, expression } from "./numerology.ts";
import { chineseSign, friendsOf, secretFriendOf, clashOf } from "./chinese.ts";
import { ANIMALS, GROUPS, ELEMENTS } from "../data/zodiac.ts";
import { LUNAR_NEW_YEAR } from "../data/lunar-new-year.ts";
import { NUMBER_MEANINGS, CHALLENGE_MEANINGS, PERSONAL_YEAR_THEMES } from "../data/numbers.ts";

export interface Step {
  /** What we do, with the reader's numbers. */
  text: string;
  /** Why we do it, or what the number stands for, in plain words. */
  why?: string;
}

export interface Breakdown {
  /** Anchor id, so each number on the reading can link to its working. */
  id: string;
  title: string;
  /** One sentence on what this result is. */
  intro: string;
  steps: Step[];
  /** A short plain description shown instead of numbered steps (the name numbers use this). */
  summary?: string;
  /** Letter chips for the name numbers: the letter, its value, and whether it counts here. */
  letters?: { letter: string; value: number; counted: boolean; wordStart: boolean }[];
  /** Show the chips as letters only, without each letter's number. */
  lettersOnly?: boolean;
  result: string;
  /** What the result means for the reader, under a warm, personal heading. */
  meaning?: { title: string; text: string };
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

const WHY_REDUCE = "Adding a number's digits together is called reducing. Numerology works with the core numbers 1 to 9, and reducing boils a bigger number down to its core while keeping a trace of every digit in it.";
const WHY_MASTER = "11, 22 and 33 are master numbers. Numerologists see them as stronger, more intense versions of 2, 4 and 6, so they are kept whole instead of being reduced.";
const WHY_ALREADY = "It is already one of the core numbers from 1 to 9, so there is nothing to reduce.";

/** One reduction as a step: "Day 14: 1 + 4 = 5." */
function reduceStep(label: string, n: number, keepMasters: boolean, why?: string): { step: Step; value: number } {
  const r = reduce(n, keepMasters);
  if (r.steps.length === 0) {
    const master = n > 9;
    return { step: { text: `${label} ${n} stays ${r.value}.`, why: master ? WHY_MASTER : WHY_ALREADY }, value: r.value };
  }
  const master = keepMasters && MASTER_NUMBERS.includes(r.value);
  return {
    step: { text: `${label} ${n}: ${r.steps.join(", then ")}.`, why: master ? `${why ? why + " " : ""}We stop at ${r.value}: ${WHY_MASTER}` : why },
    value: r.value,
  };
}

/** Reducing a final total, with the reason for each pass. */
function finalSteps(total: number, keepMasters: boolean): Step[] {
  const r = reduce(total, keepMasters);
  if (r.steps.length === 0) {
    if (total > 9) return [{ text: `${total} is a master number, so it stays ${total}.`, why: `Master numbers are never reduced, so ${total} is your final number. It carries a stronger, more intense form of the energy of ${total === 11 ? 2 : total === 22 ? 4 : 6}.` }];
    return [];
  }
  return r.steps.map((s, i) => {
    const last = i === r.steps.length - 1;
    const v = Number(s.split("= ")[1]);
    const why =
      last && keepMasters && MASTER_NUMBERS.includes(v)
        ? `We stop at ${v}: ${WHY_MASTER}`
        : i === 0
          ? "The total has more than one digit, so we reduce it to find the core number underneath."
          : "Still more than one digit, so we reduce once more.";
    return { text: `Add the digits: ${s}.`, why };
  });
}

const numberMeaning = (title: string, v: number) => {
  const m = NUMBER_MEANINGS[v];
  return m ? { title, text: `${m.keyword}. ${m.gentle}` } : undefined;
};

export function lifePathBreakdown(date: string): Breakdown {
  const [y, m, d] = date.split("-").map(Number);
  const day = reduceStep("Day", d, true);
  const month = reduceStep("Month", m, true);
  const year = reduceStep("Year", y, true, "We reduce the year on its own too, so your day, month and year each get an equal say.");
  const total = day.value + month.value + year.value;
  const value = reduce(total).value;
  return {
    id: "how-life-path",
    title: "Life Path",
    intro: "Your Life Path is the most important number in numerology. It describes the road you walk through life, and it comes from your full birth date.",
    steps: [
      { text: `Start with your birth date: ${longDate(date)}.`, why: "Your birth date never changes, so numerology reads it as the blueprint you were born with." },
      { text: "Reduce the day, the month and the year separately.", why: WHY_REDUCE },
      day.step,
      month.step,
      year.step,
      { text: `Add the three together: ${day.value} + ${month.value} + ${year.value} = ${total}.`, why: "This blends the energy of your day, month and year into one number." },
      ...finalSteps(total, true),
    ],
    result: `Your Life Path is ${value}.`,
    meaning: numberMeaning(`Life on the path of a ${value}`, value),
    articles: [
      { id: "numerology/life-path-number", label: "The Life Path number" },
      { id: "numerology/master-numbers", label: "Master numbers" },
    ],
  };
}

type NameKind = "expression" | "soul" | "personality";
const VOWELS = new Set(["A", "E", "I", "O", "U"]);
const NAME_INFO: Record<NameKind, { title: string; intro: string; uses: string; which: Step; counts: (l: string) => boolean; meaning: (v: number) => string }> = {
  expression: {
    title: "Expression",
    intro: "Your Expression number shows your natural talents and the way you tend to go about things. It uses every letter of your full birth name.",
    uses: "Every letter of your full birth name is used.",
    which: { text: "Every letter counts.", why: "Your whole name is everything you were given at birth, so all of it shapes your talents." },
    counts: () => true,
    meaning: (v) => `Your natural gifts as an Expression ${v}`,
  },
  soul: {
    title: "Soul Urge",
    intro: "Your Soul Urge shows what your heart wants most. It uses only the vowels in your name.",
    uses: "Only the vowels are used: A, E, I, O and U.",
    which: { text: "Only the vowels count: A, E, I, O and U. (Starlight treats Y as a consonant.)", why: "Vowels are the soft, open sounds that carry your voice, so numerology links them to your inner self and your heart's desires." },
    counts: (l) => VOWELS.has(l),
    meaning: (v) => `What your heart longs for as a Soul Urge ${v}`,
  },
  personality: {
    title: "Personality",
    intro: "Your Personality number shows the side of you others meet first. It uses only the consonants in your name.",
    uses: "Only the consonants are used: every letter that isn't a vowel.",
    which: { text: "Only the consonants count: every letter that is not A, E, I, O or U.", why: "Consonants are the firmer sounds that give a name its outline, so numerology links them to the face you show the world." },
    counts: (l) => !VOWELS.has(l),
    meaning: (v) => `How the world first sees you as a Personality ${v}`,
  },
};

const wordsOf = (name: string) =>
  name
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toUpperCase()
    .split(/[^A-Z]+/)
    .filter(Boolean);

/**
 * The name numbers, kept brief: which letters are used, those letters lit up in the reader's
 * own name, and the result. No sums, so the working never feels like a maths lesson.
 */
export function nameBreakdown(name: string, kind: NameKind): Breakdown {
  const info = NAME_INFO[kind];
  const words = wordsOf(name);
  const letters = words.flatMap((w) => w.split("").map((l, i) => ({ letter: l, value: letterValue(l), counted: info.counts(l), wordStart: i === 0 })));
  const picked = letters.filter((l) => l.counted);
  const total = picked.reduce((s, l) => s + l.value, 0);
  const value = reduce(total).value;
  const none = picked.length === 0;
  return {
    id: `how-${kind}`,
    title: info.title,
    intro: info.intro,
    summary: none ? `${info.uses} Your name has none, so this number is 0.` : `${info.uses} They are lit up in your name below.`,
    steps: [],
    letters,
    lettersOnly: true,
    result: `Your ${info.title} number is ${value}.`,
    meaning: none ? undefined : numberMeaning(info.meaning(value), value),
    articles: [{ id: "numerology/your-name-numbers", label: "Your name numbers" }],
  };
}

/** Birthday number: simply the day of the month you were born. */
export function birthdayBreakdown(date: string): Breakdown {
  const d = Number(date.slice(8, 10));
  const day = reduceStep("Day", d, true);
  return {
    id: "how-birthday",
    title: "Birthday",
    intro: "Your Birthday number comes only from the day of the month you were born. Numerologists read it as a special gift or talent you carry.",
    steps: [{ text: `You were born on the ${d}${ordinal(d)}.`, why: "The day is the most personal part of your birth date, so it gets a number of its own." }, ...(d > 9 ? [day.step] : [])],
    result: `Your Birthday number is ${day.value}.`,
    meaning: numberMeaning(`The gift of a Birthday ${day.value}`, day.value),
    articles: [],
  };
}

/** Maturity: Life Path plus Expression, the person you grow into. */
export function maturityBreakdown(date: string, name: string): Breakdown {
  const lp = lifePath(date).value;
  const ex = expression(name).value;
  const total = lp + ex;
  const value = reduce(total).value;
  return {
    id: "how-maturity",
    title: "Maturity",
    intro: "Your Maturity number shows who you grow into. It tends to come through more strongly from your late thirties onwards.",
    steps: [{ text: `Add your Life Path and your Expression: ${lp} + ${ex} = ${total}.`, why: "It joins the road you walk with the talents you bring to it." }, ...finalSteps(total, true)],
    result: `Your Maturity number is ${value}.`,
    meaning: numberMeaning(`Growing into a ${value}`, value),
    articles: [],
  };
}

/** Universal Year: the calendar year's own number, the same for everyone. */
export function universalYearBreakdown(year: number): Breakdown {
  const r = reduce(year, false);
  return {
    id: "how-universal-year",
    title: `Universal Year ${year}`,
    intro: "The Universal Year is the calendar year's own number. It is the same for everyone, like the weather of the year.",
    steps: [{ text: `Add the digits of ${year}: ${r.steps.join(", then ")}.` }],
    result: `${year} is a Universal Year ${r.value}.`,
    articles: [],
  };
}

const ordinal = (n: number) => (n % 10 === 1 && n !== 11 ? "st" : n % 10 === 2 && n !== 12 ? "nd" : n % 10 === 3 && n !== 13 ? "rd" : "th");

/** The four Challenge Numbers, worked out from the birth date by subtraction. */
export function challengesBreakdown(date: string): Breakdown {
  const [y, m, d] = date.split("-").map(Number);
  const c = challenges(date);
  const day = reduceStep("Day", d, false);
  const month = reduceStep("Month", m, false);
  const year = reduceStep("Year", y, false);
  const diff = (label: string, a: number, an: string, b: number, bn: string, v: number, why: string): Step => ({
    text: `${label}: the gap between your ${an} (${a}) and your ${bn} (${b}). ${Math.max(a, b)} − ${Math.min(a, b)} = ${v}.`,
    why,
  });
  const main = CHALLENGE_MEANINGS[c.third];
  return {
    id: "how-challenges",
    title: "Challenge Numbers",
    intro: "Your Challenge Numbers show the lessons you are working through. Like your Life Path, they come from your birth date, but they use subtraction instead of addition.",
    steps: [
      { text: `Reduce the day, month and year of ${longDate(date)} to single digits.`, why: `${WHY_REDUCE} Challenges use only the single digits, so even 11 and 22 are reduced here.` },
      day.step,
      month.step,
      year.step,
      diff("First Challenge (early life)", c.month, "month", c.day, "day", c.first, "We subtract because a challenge is about a gap: the distance between two parts of you that need to learn to work together. The bigger the gap, the bigger the lesson."),
      diff("Second Challenge (middle years)", c.day, "day", c.year, "year", c.second, "The day and the year are compared next, for the lesson that tends to come up in the middle of life."),
      diff("Third Challenge, your main one (all through life)", c.first, "First Challenge", c.second, "Second Challenge", c.third, "This one comes from the first two challenges together, which is why it is the deepest lesson and stays with you for life."),
      diff("Fourth Challenge (later life)", c.month, "month", c.year, "year", c.fourth, "The month and the year make the last pair, for the lesson that grows stronger later in life."),
      { text: "Because we always subtract, a challenge can only be 0 to 8.", why: "A 0 means two parts of you are already in balance, so you get to choose which lesson to work on." },
    ],
    result: `Your challenges are ${c.first}, ${c.second}, ${c.third} and ${c.fourth}. Your main challenge is ${c.third}.`,
    meaning: { title: `Growing through your main challenge: ${main.keyword}`, text: main.text },
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
  const day = reduceStep("Birth day", d, false);
  const month = reduceStep("Birth month", m, false);
  const yr = reduceStep("This year,", year, false, "The current year is what changes your number from one year to the next.");
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
      { text: `Use your birth day and month with the current year, ${year}.`, why: "Your birthday is fixed, and the year moves on. Adding them shows how this year's energy meets your own. Personal Years follow a nine-year cycle, so only the numbers 1 to 9 are used and even 11 and 22 are reduced." },
      day.step,
      month.step,
      yr.step,
      { text: `Add them together: ${day.value} + ${month.value} + ${yr.value} = ${total}.` },
      ...finalSteps(total, false),
      {
        text: `Starlight counts Personal Years from 1 January. Your Personal Year ${value} began on 1 January ${year}, and your next one, a Personal Year ${next}, starts on 1 January ${year + 1}.`,
        why: "Each new year moves you one step on through the cycle, from 1 to 9 and then back to 1.",
      },
    ],
    result: `You are in a Personal Year ${value}.`,
    meaning: { title: `What your Personal Year ${value} holds for you`, text: PERSONAL_YEAR_THEMES[value] },
    note: `Do Personal Years change on your birthday? Some numerologists say yes and count each Personal Year from birthday to birthday. Starlight uses 1 January because it is the most common method. ${birthdayNote}`,
    articles: [{ id: "numerology/personal-year-number", label: "Your Personal Year number" }],
  };
}

const ELEMENT_DIGITS = "0 and 1 are Metal, 2 and 3 are Water, 4 and 5 are Wood, 6 and 7 are Fire, 8 and 9 are Earth";

export function chineseBreakdowns(date: string): Breakdown[] {
  const cn = chineseSign(date);
  const birthYear = Number(date.slice(0, 4));
  const lny = LUNAR_NEW_YEAR[birthYear];
  const whyLny = "The Chinese calendar follows the Moon, and its year begins at the second new moon after the winter solstice. That lands somewhere between 21 January and 20 February.";
  const yearStep: Step = !lny
    ? { text: `Your zodiac year is ${cn.zodiacYear}.` }
    : date < lny
      ? { text: `In ${birthYear}, Lunar New Year fell on ${longDate(lny)}. You were born before it, so you belong to the year before: ${cn.zodiacYear}.`, why: whyLny }
      : { text: `In ${birthYear}, Lunar New Year fell on ${longDate(lny)}. You were born on or after it, so your zodiac year is ${cn.zodiacYear}.`, why: whyLny };
  const diff = cn.zodiacYear - 1900;
  const place = ((diff % 12) + 12) % 12;
  const order = ANIMALS.slice(0, place + 1).map((a) => a.name).join(", ");
  const yearDigit = ((cn.zodiacYear % 10) + 10) % 10;
  const el = ELEMENTS[cn.element];

  const animal: Breakdown = {
    id: "how-animal",
    title: `Your animal: the ${cn.animal.name}`,
    intro: "Your Chinese zodiac animal comes from the year you were born, in the Chinese calendar.",
    steps: [
      { text: `You were born on ${longDate(date)}.` },
      yearStep,
      { text: "The twelve animals take turns, one per year, always in the same order. 1900 was a Rat year, so we count on from there.", why: "Legend says the order was set by the Great Race, when the animals raced across a river and the Rat finished first by riding on the Ox's back." },
      { text: `${cn.zodiacYear} − 1900 = ${diff}. Taking away whole cycles of 12 leaves ${place}.`, why: "Every 12 years the cycle starts again with the Rat, so only what is left over after whole cycles matters." },
      place === 0
        ? { text: "A remainder of 0 means a full number of cycles, so you land back on the Rat." }
        : { text: `Count ${place} ${place === 1 ? "place" : "places"} on from the Rat: ${order}.` },
    ],
    result: `You are a ${cn.animal.name}.`,
    meaning: { title: `Life as a ${cn.animal.name}`, text: `${cn.animal.traits.join(", ")}. ${cn.animal.summary}` },
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
      { text: `The element comes from the last digit of your zodiac year. ${ELEMENT_DIGITS}.`, why: "The five elements take turns too, each one ruling two years in a row. Twelve animals and five elements line up again every 60 years, so each animal and element pairing comes round once every 60 years." },
      { text: `${cn.zodiacYear} ends in ${yearDigit}, so your year element is ${cn.element}.` },
      { text: `Even years are yang and odd years are yin. ${cn.zodiacYear} is ${cn.zodiacYear % 2 === 0 ? "even" : "odd"}, so it is a ${cn.yinYang.toLowerCase()} year.`, why: "Yang is the bright, outgoing side of life and yin the quiet, inward side. They alternate year by year." },
      { text: `Your ${cn.animal.name} also has its own fixed element, ${cn.animal.element}. The year element is the one that changes, and it is why people call you a ${cn.element} ${cn.animal.name}.` },
    ],
    result: `You are a ${cn.yinYang.toLowerCase()} ${cn.element} ${cn.animal.name}.`,
    meaning: { title: `What ${cn.element} brings to your ${cn.animal.name}`, text: `${el.essence} ${el.personality} Your strengths: ${el.strengths.charAt(0).toLowerCase()}${el.strengths.slice(1)} Watch out for: ${el.watchOut.charAt(0).toLowerCase()}${el.watchOut.slice(1)}` },
    articles: [
      { id: "chinese-zodiac/year-elements-and-the-60-year-cycle", label: "Year elements and the 60-year cycle" },
      { id: "elements/the-five-elements-wu-xing", label: "The five elements" },
      { id: "elements/yin-and-yang", label: "Yin and yang" },
    ],
  };

  const friends = friendsOf(cn.animal.id).map((a) => a.name);
  const group = GROUPS[cn.animal.group];
  const wheel: Breakdown = {
    id: "how-wheel",
    title: "Your friends and clash on the wheel",
    intro: "The animals sit in a circle, and where they sit shows who gets along.",
    steps: [
      { text: `Friend group: animals four places apart around the wheel form a group of three. Yours is the ${cn.animal.name}, ${friends.join(" and ")}.`, why: "Four places apart, the three animals make a triangle on the wheel. They share the same outlook and pace, so they understand each other easily." },
      { text: `Secret friend: the animals are paired off in six fixed pairs. The ${cn.animal.name}'s partner is the ${secretFriendOf(cn.animal.id).name}.`, why: "These pairs balance each other, one yin and one yang, so each quietly gives the other what it lacks." },
      { text: `Clash: the animal six places away sits directly opposite you. For the ${cn.animal.name} that is the ${clashOf(cn.animal.id).name}.`, why: "Opposite animals want opposite things, so they pull against each other. That friction can also help you both grow." },
    ],
    result: `Friends: ${friends.join(" and ")}. Secret friend: ${secretFriendOf(cn.animal.id).name}. Clash: ${clashOf(cn.animal.id).name}.`,
    meaning: { title: `Your people: ${group.name}`, text: group.meaning },
    articles: [{ id: "chinese-zodiac/friend-groups-secret-friends-and-clashes", label: "Friend groups, secret friends and clashes" }],
  };

  return [animal, element, wheel];
}
