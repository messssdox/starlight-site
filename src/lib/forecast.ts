// Daily, weekly, monthly and yearly forecasts for each Chinese zodiac animal.
//
// These follow the traditional Chinese almanac: every day, month and year has its own animal
// (and every day its own element). How that animal sits with yours on the wheel sets the tone:
// a secret friend's day is the brightest, a friend's day is easy, a clash day asks for care.
// The day's element then lifts or dampens it a little. Everything is worked out from the date,
// so the same animal on the same day always gets the same forecast, for everyone.
import { ANIMALS, ELEMENTS, PROFILES, animalById, type Animal, type Element } from "../data/zodiac.ts";
import { LUNAR_NEW_YEAR } from "../data/lunar-new-year.ts";
import { relationBetween, animalOfZodiacYear, elementOfZodiacYear, friendsOf, secretFriendOf, clashOf, type Relation } from "./chinese.ts";
import { MakeTime } from "astronomy-engine";
import { SIGNS, type Sign, type SignId, type PlanetId } from "../data/astrology.ts";
import { longitudeOf, signOf } from "./astrology.ts";
import { signAspect, type SignAspect } from "./pair.ts";
import { retrogradeNow } from "./sky-events.ts";

const STEM_ELEMENTS: Element[] = ["Wood", "Wood", "Fire", "Fire", "Earth", "Earth", "Metal", "Metal", "Water", "Water"];
/** 7 January 2000 was a Jia Zi day (Wood Rat), the first day of the 60-day cycle. */
const JIA_ZI = Date.UTC(2000, 0, 7);
const DAY_MS = 86_400_000;

export type Tone = "bright" | "steady" | "careful";
export type Topic = "love" | "work" | "money" | "wellbeing";

const daysFromJiaZi = (iso: string) => Math.round((Date.UTC(+iso.slice(0, 4), +iso.slice(5, 7) - 1, +iso.slice(8, 10)) - JIA_ZI) / DAY_MS);
const mod = (n: number, m: number) => ((n % m) + m) % m;

/** The animal and element ruling a day in the traditional calendar. `iso` is YYYY-MM-DD. */
export function dayPillar(iso: string): { animal: Animal; element: Element } {
  const n = daysFromJiaZi(iso);
  return { animal: ANIMALS[mod(n, 12)], element: STEM_ELEMENTS[mod(n, 10)] };
}

/**
 * The animal ruling most of a calendar month. Chinese solar months start around the 4th to 8th
 * of each month: the Tiger month starts in early February, the Rabbit in early March, and so on.
 * `month` is 1 to 12.
 */
export const monthAnimal = (month: number): Animal => ANIMALS[mod(month, 12)];

/** The zodiac year (starting at Lunar New Year) that a date falls in. */
export function zodiacYearAt(iso: string): number {
  const y = +iso.slice(0, 4);
  return LUNAR_NEW_YEAR[y] && iso < LUNAR_NEW_YEAR[y] ? y - 1 : y;
}

const RELATION_SCORE: Record<Relation, number> = { secret: 5, friend: 4, same: 3, neutral: 3, clash: 1 };

/** Stars out of 5 for an animal on a day: the day animal's relation, nudged by the day's element. */
export function dayScore(id: string, iso: string): number {
  const self = animalById(id);
  const day = dayPillar(iso);
  let s = RELATION_SCORE[relationBetween(id, day.animal.id)];
  const mine = ELEMENTS[self.element];
  if (day.element === mine.fedBy || day.element === self.element) s += 1;
  if (day.element === mine.controlledBy) s -= 1;
  return Math.max(1, Math.min(5, s));
}

const toneOf = (score: number): Tone => (score >= 4 ? "bright" : score === 3 ? "steady" : "careful");

/** A small, stable hash so the wording varies from day to day but never on reload. */
function hash(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  return h >>> 0;
}
const pick = <T>(xs: T[], seed: string): T => xs[hash(seed) % xs.length];

const TOPIC_LINES: Record<Topic, Record<Tone, string[]>> = {
  love: {
    bright: [
      "Warm words land well. Say the thing you have been meaning to say.",
      "A good time to make plans together or reach out to someone you miss.",
      "Charm comes easily. If you are single, say yes to the invitation.",
      "Small kindnesses go a long way, and someone notices your effort.",
    ],
    steady: [
      "Keep things simple and honest. A relaxed evening beats a grand gesture.",
      "Listen more than you talk and you will learn something sweet.",
      "Nothing dramatic, which is no bad thing. Enjoy the calm.",
      "A good time to sort out small practical things together.",
    ],
    careful: [
      "Tempers can run short, so count to ten before you reply.",
      "Don't read too much into a short message. Ask instead of guessing.",
      "Give each other a little space and things settle by themselves.",
      "Leave old arguments alone for now. They won't be solved today.",
    ],
  },
  work: {
    bright: [
      "Ideas you share now get a good hearing, so pitch it.",
      "A good moment to start something new or ask for what you want.",
      "Teamwork pays, and someone is ready to back you.",
      "You get more done than you expect, so aim a little higher.",
    ],
    steady: [
      "Steady progress on what is already in front of you is the win.",
      "Tidy up loose ends. It clears space for what comes next.",
      "Good for routine tasks, planning and checking details.",
      "Stick to the plan and keep promises small and doable.",
    ],
    careful: [
      "Double-check emails and figures before you send them.",
      "Not the moment to push hard or start a confrontation. Let it wait.",
      "Delays are likely, so build in extra time.",
      "Keep your head down and stay out of office politics.",
    ],
  },
  money: {
    bright: [
      "A good time to sort out your finances or ask about that rise.",
      "Luck with bargains and small wins, so keep your eyes open.",
      "Money spent on learning or good tools pays you back.",
      "Generosity comes back to you in an unexpected way.",
    ],
    steady: [
      "Neither lucky nor unlucky. Stick to your budget.",
      "A good time to check your subscriptions and bills.",
      "Save first, spend second.",
      "Practical buys are fine. Leave the big ones for a brighter day.",
    ],
    careful: [
      "Avoid impulse buys and big money decisions.",
      "Don't lend what you can't afford to lose.",
      "Read the small print before you sign anything.",
      "Keep your purse closed and your plans flexible.",
    ],
  },
  wellbeing: {
    bright: [
      "Energy is high, so move, dance or get outside.",
      "A great time to begin a new healthy habit.",
      "Good company recharges you. See your friends.",
      "Use your energy well and you'll sleep soundly.",
    ],
    steady: [
      "Balance is the key: eat well and take short breaks.",
      "A walk and an early night keep you on track.",
      "Drink water and stretch. Small things count.",
      "Steady routines serve you well.",
    ],
    careful: [
      "Rest is not lazy. Protect your energy.",
      "Take care on the move and don't rush.",
      "Stress can build, so breathe slowly and step outside.",
      "Go gently, and say no to one thing too many.",
    ],
  },
};

const TOPICS: Topic[] = ["love", "work", "money", "wellbeing"];
const topicLines = (tone: Tone, seed: string) =>
  TOPICS.map((t) => ({ topic: t, text: pick(TOPIC_LINES[t][tone], `${seed}:${t}`) }));

const HEADLINE: Record<Relation, string> = {
  secret: "A secret friend's {unit}: quiet help arrives",
  friend: "A friend's {unit}: things flow your way",
  same: "Your own animal's {unit}: be yourself, gently",
  neutral: "An even {unit}: what you put in comes back",
  clash: "A clash {unit}: slow down and pick your battles",
};

/** One plain sentence on what the ruling animal means for yours. */
function relationLine(rel: Relation, self: Animal, other: Animal, when: string): string {
  switch (rel) {
    case "secret": return `The ${other.name} is the ${self.name}'s secret friend, so ${when} brings quiet support and help from unexpected places.`;
    case "friend": return `The ${other.name} is in the ${self.name}'s friend group, so ${when} feels easy and things tend to go your way.`;
    case "same": return `The ${self.name} feels very much at home ${when}, though too much of the same energy can make you restless or stubborn.`;
    case "neutral": return `The ${other.name} is neither friend nor rival to the ${self.name}, so ${when} is shaped by what you put in.`;
    case "clash": return `The ${other.name} sits opposite the ${self.name} on the wheel, so ${when} can bring friction, changes of plan or tiredness.`;
  }
}

/** How the day's element meets the animal's own element. */
function elementLine(self: Animal, el: Element): string {
  const mine = ELEMENTS[self.element];
  if (el === self.element) return `The day shares the ${self.name}'s own element, ${el}, which steadies you.`;
  if (el === mine.fedBy) return `The day's ${el} feeds the ${self.name}'s ${self.element}, giving you an extra lift.`;
  if (el === mine.controlledBy) return `The day's ${el} keeps the ${self.name}'s ${self.element} in check, so you may feel a little held back.`;
  if (el === mine.feeds) return `The ${self.name}'s ${self.element} feeds the day's ${el}, so you give out a lot. Pace yourself.`;
  return `The ${self.name}'s ${self.element} keeps the day's ${el} in check, so you feel in control.`;
}

/** The traditional two-hour slot each animal rules: the Rat 11pm to 1am, the Ox 1am to 3am, and so on. */
export function animalHours(a: Animal): string {
  const h = (x: number) => { const v = mod(x, 24); return v === 0 ? "midnight" : v === 12 ? "noon" : v < 12 ? `${v}am` : `${v - 12}pm`; };
  const start = 23 + 2 * a.index;
  return `${h(start)} to ${h(start + 2)}`;
}

/** The animals whose days and hours suit this one best, secret friend first. */
export const luckyAnimals = (id: string): Animal[] => [secretFriendOf(id), ...friendsOf(id)];

export interface DayForecast {
  date: string;
  animal: Animal;
  element: Element;
  relation: Relation;
  stars: number;
  headline: string;
  intro: string[];
  topics: { topic: Topic; text: string }[];
  luckyColour: string;
  luckyNumber: number;
  luckyHours: string;
}

export function dailyForecast(id: string, iso: string): DayForecast {
  const self = animalById(id);
  const day = dayPillar(iso);
  const rel = relationBetween(id, day.animal.id);
  const stars = dayScore(id, iso);
  const helper = luckyAnimals(id).find((a) => a.index >= 4 && a.index <= 10) ?? secretFriendOf(id); // hours you are likely awake, 7am to 9pm
  return {
    date: iso,
    animal: day.animal,
    element: day.element,
    relation: rel,
    stars,
    headline: HEADLINE[rel].replace("{unit}", "day"),
    intro: [
      `Today is ${/^[AEIOU]/.test(day.element) ? "an" : "a"} ${day.element} ${day.animal.name} day. ${relationLine(rel, self, day.animal, "today")}`,
      elementLine(self, day.element),
    ],
    topics: topicLines(toneOf(stars), `${id}:${iso}`),
    luckyColour: ELEMENTS[ELEMENTS[self.element].fedBy].colourName,
    luckyNumber: pick(PROFILES[id].luckyNumbers, `${id}:${iso}:n`),
    luckyHours: `${animalHours(helper)} (the ${helper.name}'s hours)`,
  };
}

const addDays = (iso: string, n: number) => new Date(Date.UTC(+iso.slice(0, 4), +iso.slice(5, 7) - 1, +iso.slice(8, 10)) + n * DAY_MS).toISOString().slice(0, 10);

export interface WeekForecast {
  days: { date: string; animal: Animal; stars: number; relation: Relation }[];
  stars: number;
  headline: string;
  intro: string[];
  topics: { topic: Topic; text: string }[];
  best: string;
  care: string;
}

/** The week from Monday to Sunday that contains `iso`. */
export function weeklyForecast(id: string, iso: string): WeekForecast {
  const self = animalById(id);
  const weekday = mod(new Date(`${iso}T12:00:00Z`).getUTCDay() - 1, 7); // Monday = 0
  const monday = addDays(iso, -weekday);
  const days = Array.from({ length: 7 }, (_, k) => {
    const date = addDays(monday, k);
    const p = dayPillar(date);
    return { date, animal: p.animal, stars: dayScore(id, date), relation: relationBetween(id, p.animal.id) };
  });
  const avg = days.reduce((t, d) => t + d.stars, 0) / 7;
  const stars = Math.round(avg);
  const best = days.reduce((a, b) => (b.stars > a.stars ? b : a));
  const care = days.reduce((a, b) => (b.stars < a.stars ? b : a));
  const clashDay = days.find((d) => d.relation === "clash");
  const tone = toneOf(stars);
  const headline = tone === "bright" ? "A week with the wind behind you" : tone === "steady" ? "A balanced week: steady wins" : "A week to go gently";
  const intro = [
    `Each day has its own animal, and this week the ${self.name} meets ${days.filter((d) => d.stars >= 4).length} supportive ${days.filter((d) => d.stars >= 4).length === 1 ? "day" : "days"}.`,
    clashDay
      ? `Watch ${weekdayName(clashDay.date)}: it is a ${clashDay.animal.name} day, the ${self.name}'s clash, so keep plans light.`
      : `There is no clash day this week, so you can plan with confidence.`,
  ];
  return {
    days, stars, headline, intro,
    topics: topicLines(tone, `${id}:week:${monday}`),
    best: best.date,
    care: care.stars < best.stars ? care.date : "",
  };
}

export const weekdayName = (iso: string) => new Date(`${iso}T12:00:00Z`).toLocaleDateString("en-GB", { weekday: "long", timeZone: "UTC" });

export interface MonthForecast {
  month: number;
  year: number;
  animal: Animal;
  relation: Relation;
  stars: number;
  headline: string;
  intro: string[];
  topics: { topic: Topic; text: string }[];
  bestDays: string[];
  careDays: string[];
}

export function monthlyForecast(id: string, iso: string): MonthForecast {
  const self = animalById(id);
  const year = +iso.slice(0, 4);
  const month = +iso.slice(5, 7);
  const ma = monthAnimal(month);
  const rel = relationBetween(id, ma.id);
  const length = new Date(Date.UTC(year, month, 0)).getUTCDate();
  const dates = Array.from({ length }, (_, k) => `${iso.slice(0, 8)}${String(k + 1).padStart(2, "0")}`);
  const monthName = new Date(Date.UTC(year, month - 1, 15)).toLocaleDateString("en-GB", { month: "long", timeZone: "UTC" });
  return {
    month, year, animal: ma, relation: rel,
    stars: RELATION_SCORE[rel],
    headline: HEADLINE[rel].replace("{unit}", "month"),
    intro: [
      `In the Chinese calendar, most of ${monthName} is the ${ma.name}'s month (it starts around the 4th to the 8th). ${relationLine(rel, self, ma, "this month")}`,
    ],
    topics: topicLines(toneOf(RELATION_SCORE[rel]), `${id}:month:${year}-${month}`),
    bestDays: dates.filter((d) => dayScore(id, d) === 5),
    careDays: dates.filter((d) => dayPillar(d).animal.id === clashOf(id).id),
  };
}

export interface YearForecast {
  zodiacYear: number;
  animal: Animal;
  element: Element;
  relation: Relation;
  stars: number;
  headline: string;
  intro: string[];
  bestMonths: number[];
  careMonths: number[];
}

const YEAR_TEXT: Record<Relation, (s: Animal, y: Animal) => string> = {
  secret: (s, y) => `The ${y.name} is the ${s.name}'s secret friend, which makes this one of your best years: doors open, people help and effort is rewarded. Say yes to good opportunities.`,
  friend: (s, y) => `The ${y.name} is in the ${s.name}'s friend group, so this is a supportive year. Plans you start now have a good chance of lasting, and friendships deepen.`,
  same: () => `This is your Ben Ming Nian, your own animal's year. Tradition says it brings big changes and asks for care: wear something red for luck, look after your health, and don't rush major decisions.`,
  neutral: (s, y) => `The ${y.name} is neither friend nor rival to the ${s.name}, so this is an even year. What you build with steady effort stays built.`,
  clash: (s, y) => `The ${y.name} sits opposite the ${s.name}, so this year clashes with the Tai Sui, the year's guardian. Expect changes and the odd setback. Go steadily, avoid big risks and lean on your friend animals.`,
};

/** The zodiac year containing `iso`, and which months in it suit this animal best. */
export function yearlyForecast(id: string, iso: string): YearForecast {
  const self = animalById(id);
  const zy = zodiacYearAt(iso);
  const ya = animalOfZodiacYear(zy);
  const rel = relationBetween(id, ya.id);
  const months = Array.from({ length: 12 }, (_, k) => k + 1);
  const good = luckyAnimals(id).map((a) => a.id);
  const el = elementOfZodiacYear(zy);
  return {
    zodiacYear: zy, animal: ya, element: el, relation: rel,
    stars: rel === "same" ? 2 : RELATION_SCORE[rel],
    headline: rel === "same" ? "Your own animal's year: a year of change" : HEADLINE[rel].replace("{unit}", "year"),
    intro: [YEAR_TEXT[rel](self, ya)],
    bestMonths: months.filter((m) => good.includes(monthAnimal(m).id)),
    careMonths: months.filter((m) => monthAnimal(m).id === clashOf(id).id),
  };
}

// ---------------------------------------------------------------------------------------------
// Sign and animal together. The animal side comes from the Chinese calendar, as above. The sign
// side comes from where the planets really are (Astronomy Engine, as the Sky now page uses): how
// the sign each planet is in sits with your sun sign. A friendly sign lifts a topic, a sign at
// odds with yours asks for care.

const SIGN_TONE: Record<SignAspect, number> = { same: 1, trine: 1, sextile: 1, neutral: 0, square: -1, opposite: -1 };
const clampStars = (n: number) => Math.max(1, Math.min(5, Math.round(n)));
const at = (iso: string) => MakeTime(new Date(`${iso}T12:00:00Z`));
const planetSign = (id: PlanetId, iso: string) => signOf(longitudeOf(id, at(iso))).sign;

/** "in Scorpio, a fellow Water sign" */
function inSign(mine: Sign, there: Sign): string {
  switch (signAspect(mine.id, there.id)) {
    case "same": return `in ${there.name}, your own sign`;
    case "trine": return `in ${there.name}, a fellow ${there.element} sign`;
    case "sextile": return `in ${there.name}, a friendly sign for you`;
    case "square": return `in ${there.name}, at odds with ${mine.name}`;
    case "opposite": return `in ${there.name}, opposite ${mine.name}`;
    case "neutral": return `in ${there.name}, a quiet sign for you`;
  }
}

const RELATION_SHORT: Record<Relation, (a: Animal) => string> = {
  secret: (a) => `the ${a.name}'s secret friend`,
  friend: (a) => `a friend of the ${a.name}`,
  same: (a) => `the ${a.name}'s own animal`,
  neutral: (a) => `neither friend nor rival to the ${a.name}`,
  clash: (a) => `the ${a.name}'s clash`,
};

/** Which planet speaks for each topic in the sign half of the forecast. */
const TOPIC_PLANET: Record<Topic, PlanetId> = { love: "venus", work: "mars", money: "jupiter", wellbeing: "sun" };
const PLANET_NAME: Record<PlanetId, string> = {
  sun: "The Sun", moon: "The Moon", mercury: "Mercury", venus: "Venus", mars: "Mars",
  jupiter: "Jupiter", saturn: "Saturn", uranus: "Uranus", neptune: "Neptune", pluto: "Pluto",
};

export interface PairMonthForecast extends MonthForecast {
  signStars: number;
  mercuryRetrograde: boolean;
  /** Why each best day and each care day stands out, keyed by date. */
  bestNotes: Record<string, string>;
  careNotes: Record<string, string>;
}

const DAY_RELATION: Record<Relation, string> = {
  secret: "your secret friend",
  friend: "one of your friend animals",
  same: "your own animal",
  neutral: "a calm animal for you",
  clash: "your clash animal",
};

/** This month for a sign and animal together. `iso` is today, which also sets where the planets are. */
export function pairMonthlyForecast(signId: SignId, animalId: string, iso: string): PairMonthForecast {
  const self = animalById(animalId);
  const mine = SIGNS.find((s) => s.id === signId)!;
  const base = monthlyForecast(animalId, iso);
  const signs = Object.fromEntries((["sun", "venus", "mars", "jupiter"] as PlanetId[]).map((p) => [p, planetSign(p, iso)])) as Record<string, Sign>;
  const tone = (p: PlanetId) => SIGN_TONE[signAspect(signId, signs[p].id)];
  const signStars = clampStars(3 + (tone("sun") + tone("venus") + tone("mars") + tone("jupiter")) / 2);
  const stars = clampStars((base.stars + signStars) / 2);
  const t = toneOf(stars);
  const monthName = new Date(Date.UTC(base.year, base.month - 1, 15)).toLocaleDateString("en-GB", { month: "long", timeZone: "UTC" });
  const topics = TOPICS.map((topic) => {
    const p = TOPIC_PLANET[topic];
    const line = pick(TOPIC_LINES[topic][toneOf(clampStars(base.stars + tone(p)))], `${signId}:${animalId}:month:${base.year}-${base.month}:${topic}`);
    return { topic, text: `${PLANET_NAME[p]} is ${inSign(mine, signs[p])}. ${line}` };
  });
  const moonEl = (d: string) => planetSign("moon", d);
  const dates = Array.from({ length: new Date(Date.UTC(base.year, base.month, 0)).getUTCDate() }, (_, k) => `${iso.slice(0, 8)}${String(k + 1).padStart(2, "0")}`);
  const moons = new Map(dates.map((d) => [d, moonEl(d)]));
  const best = dates.filter((d) => dayScore(animalId, d) >= 4 && moons.get(d)!.element === mine.element);
  const opposite = SIGNS[(SIGNS.indexOf(mine) + 6) % 12];
  const bestDays = best.length ? best : base.bestDays;
  const careDays = dates.filter((d) => base.careDays.includes(d) || moons.get(d)!.id === opposite.id);
  const myElement = ELEMENTS[self.element];
  /** "A Rabbit day, one of your friend animals, with Water feeding your Wood." */
  const animalNote = (d: string, withElement = true) => {
    const day = dayPillar(d);
    const el = !withElement ? "" : day.element === self.element ? `, and a ${day.element} day like you`
      : day.element === myElement.fedBy ? `, with ${day.element} feeding your ${self.element}` : "";
    return `${/^[AEIOU]/.test(day.animal.name) ? "An" : "A"} ${day.animal.name} day, ${DAY_RELATION[relationBetween(animalId, day.animal.id)]}${el}.`;
  };
  const moonNote = (d: string) => `The Moon is ${inSign(mine, moons.get(d)!)}.`;
  const bestNotes = Object.fromEntries(bestDays.map((d) => [d, best.length ? `${animalNote(d)} ${moonNote(d)}` : animalNote(d)]));
  const careNotes = Object.fromEntries(careDays.map((d) => [d,
    [base.careDays.includes(d) ? animalNote(d, false) : "", moons.get(d)!.id === opposite.id ? moonNote(d) : ""].filter(Boolean).join(" ")]));
  return {
    ...base,
    stars, signStars,
    headline: t === "bright" ? `A bright month for the ${mine.name} ${self.name}` : t === "steady" ? "A steady month: what you put in comes back" : "A month to go gently and pick your battles",
    intro: [`Most of ${monthName} is the ${base.animal.name}'s month in the Chinese calendar, ${RELATION_SHORT[base.relation](self)}.`],
    topics,
    bestDays,
    careDays,
    bestNotes, careNotes,
    mercuryRetrograde: retrogradeNow(at(iso).date).includes("mercury"),
  };
}

export interface PairYearForecast extends YearForecast {
  signStars: number;
  jupiter: string;
  saturn: string;
}

/** The zodiac year for a sign and animal together, with Jupiter (growth) and Saturn (lessons) for the sign. */
export function pairYearlyForecast(signId: SignId, animalId: string, iso: string): PairYearForecast {
  const mine = SIGNS.find((s) => s.id === signId)!;
  const base = yearlyForecast(animalId, iso);
  const jup = planetSign("jupiter", iso);
  const sat = planetSign("saturn", iso);
  const jt = SIGN_TONE[signAspect(signId, jup.id)];
  const st = SIGN_TONE[signAspect(signId, sat.id)];
  const signStars = clampStars(3 + jt + Math.min(0, st));
  const stars = clampStars((base.stars + signStars) / 2);
  const t = toneOf(stars);
  // each month: the month animal's relation, plus how the Sun's sign mid-month meets yours
  const scored = Array.from({ length: 12 }, (_, k) => {
    const m = k + 1;
    const y = m === 1 ? base.zodiacYear + 1 : base.zodiacYear;
    const sun = planetSign("sun", `${y}-${String(m).padStart(2, "0")}-15`);
    return { m, score: RELATION_SCORE[relationBetween(animalId, monthAnimal(m).id)] + SIGN_TONE[signAspect(signId, sun.id)] };
  });
  const byScore = [...scored].sort((a, b) => b.score - a.score || a.m - b.m);
  const sortM = (xs: { m: number }[]) => xs.map((x) => x.m).sort((a, b) => a - b);
  const jupLine = jt > 0 ? "so luck and growth come easily" : jt < 0 ? "so growth comes through stretching yourself" : "so growth comes from steady effort";
  return {
    ...base,
    stars: base.relation === "same" ? Math.min(stars, 3) : stars,
    signStars,
    headline: base.relation === "same" ? base.headline : t === "bright" ? `A good year for the ${mine.name} ${animalById(animalId).name}` : t === "steady" ? "An even year: steady effort stays built" : "A year to go steadily and lean on friends",
    jupiter: `Jupiter, the planet of luck, is ${inSign(mine, jup)}, ${jupLine}.`,
    saturn: `Saturn, the teacher, is ${inSign(mine, sat)}${st < 0 ? ", so expect a few tests of patience" : ""}.`,
    bestMonths: sortM((byScore.filter((x) => x.score >= 5).length >= 2 ? byScore.filter((x) => x.score >= 5) : byScore.filter((x) => x.score >= 4)).slice(0, 3)),
    careMonths: sortM(byScore.filter((x) => x.score <= 2).slice(-2)),
  };
}
