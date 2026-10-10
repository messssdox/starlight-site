import { ANIMALS, SECRET_FRIENDS, animalById, type Animal, type Element } from "../data/zodiac.ts";
import { LUNAR_NEW_YEAR } from "../data/lunar-new-year.ts";

const YEAR_ELEMENTS: Element[] = ["Metal", "Metal", "Water", "Water", "Wood", "Wood", "Fire", "Fire", "Earth", "Earth"];

/** The animal of a zodiac year (the year that starts at that Lunar New Year). 1900, 1912 ... 2020 are Rat years. */
export function animalOfZodiacYear(year: number): Animal {
  const i = (((year - 1900) % 12) + 12) % 12;
  return ANIMALS[i];
}

/** The element of a zodiac year, from its last digit (0 and 1 are Metal, 2 and 3 Water, and so on). */
export function elementOfZodiacYear(year: number): Element {
  return YEAR_ELEMENTS[((year % 10) + 10) % 10];
}

export function yinYangOfZodiacYear(year: number): "Yin" | "Yang" {
  return year % 2 === 0 ? "Yang" : "Yin";
}

/**
 * The zodiac year a birth date belongs to. Someone born before that year's
 * Lunar New Year belongs to the previous animal: 20 January 1990 is a Snake (1989).
 * `date` is an ISO date string, YYYY-MM-DD.
 */
export function zodiacYearOf(date: string): number {
  const year = Number(date.slice(0, 4));
  const lny = LUNAR_NEW_YEAR[year];
  if (!lny) return year; // outside 1900 to 2100: fall back to the calendar year
  return date < lny ? year - 1 : year;
}

export interface ChineseSign {
  zodiacYear: number;
  animal: Animal;
  element: Element;
  yinYang: "Yin" | "Yang";
}

export function chineseSign(date: string): ChineseSign {
  const zodiacYear = zodiacYearOf(date);
  return {
    zodiacYear,
    animal: animalOfZodiacYear(zodiacYear),
    element: elementOfZodiacYear(zodiacYear),
    yinYang: yinYangOfZodiacYear(zodiacYear),
  };
}

export const friendsOf = (id: string): Animal[] => {
  const a = animalById(id);
  return ANIMALS.filter((x) => x.group === a.group && x.id !== id);
};

export const secretFriendOf = (id: string): Animal => {
  const p = SECRET_FRIENDS.find((s) => s.pair.includes(id));
  if (!p) throw new Error(`No secret friend for ${id}`);
  return animalById(p.pair[0] === id ? p.pair[1] : p.pair[0]);
};

export const clashOf = (id: string): Animal => ANIMALS[(animalById(id).index + 6) % 12];

export type Relation = "same" | "friend" | "secret" | "clash" | "neutral";

export function relationBetween(a: string, b: string): Relation {
  if (a === b) return "same";
  if (clashOf(a).id === b) return "clash";
  if (secretFriendOf(a).id === b) return "secret";
  if (friendsOf(a).some((x) => x.id === b)) return "friend";
  return "neutral";
}

/** Years of a given animal within a range, for the wheel's year rings. */
export function yearsOf(id: string, from = 1924, to = 2043): number[] {
  const out: number[] = [];
  for (let y = from; y <= to; y++) if (animalOfZodiacYear(y).id === id) out.push(y);
  return out;
}
