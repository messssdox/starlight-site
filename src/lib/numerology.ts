// Pythagorean numerology. Every function returns the answer AND the steps,
// so the site can show visitors exactly how each number was worked out.

export const MASTER_NUMBERS = [11, 22, 33];

export interface Result {
  value: number;
  /** Human-readable working, one line per step, e.g. "1 + 9 + 9 + 0 = 19". */
  steps: string[];
}

const digitSum = (n: number) => String(n).split("").reduce((s, d) => s + Number(d), 0);

/** Add the digits together until one digit is left, stopping early at 11, 22 or 33. */
export function reduce(n: number, keepMasters = true): Result {
  const steps: string[] = [];
  let v = n;
  while (v > 9 && !(keepMasters && MASTER_NUMBERS.includes(v))) {
    const next = digitSum(v);
    steps.push(`${String(v).split("").join(" + ")} = ${next}`);
    v = next;
  }
  return { value: v, steps };
}

/** Pythagorean letter values: A, J, S = 1; B, K, T = 2; ... I, R = 9. */
export function letterValue(ch: string): number {
  const c = ch.toUpperCase().charCodeAt(0);
  if (c < 65 || c > 90) return 0;
  return ((c - 65) % 9) + 1;
}

const VOWELS = new Set(["A", "E", "I", "O", "U"]);
const lettersOf = (name: string) =>
  name
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "") // é becomes e
    .toUpperCase()
    .replace(/[^A-Z]/g, "")
    .split("");

/** Life Path: reduce the day, month and year separately, then add them and reduce again. */
export function lifePath(date: string): Result {
  const [y, m, d] = date.split("-").map(Number);
  const day = reduce(d);
  const month = reduce(m);
  const year = reduce(y);
  const total = day.value + month.value + year.value;
  const final = reduce(total);
  return {
    value: final.value,
    steps: [
      `Day ${d}${day.steps.length ? ": " + day.steps.join(", then ") : ""} → ${day.value}`,
      `Month ${m}${month.steps.length ? ": " + month.steps.join(", then ") : ""} → ${month.value}`,
      `Year ${y}: ${year.steps.join(", then ")} → ${year.value}`,
      `${day.value} + ${month.value} + ${year.value} = ${total}`,
      ...final.steps,
    ],
  };
}

function nameNumber(name: string, pick: (ch: string) => boolean, label: string): Result {
  const letters = lettersOf(name).filter(pick);
  if (letters.length === 0) return { value: 0, steps: [`No ${label} in the name`] };
  const values = letters.map(letterValue);
  const total = values.reduce((s, v) => s + v, 0);
  const final = reduce(total);
  return {
    value: final.value,
    steps: [
      letters.map((l, i) => `${l}=${values[i]}`).join(" "),
      `${values.join(" + ")} = ${total}`,
      ...final.steps,
    ],
  };
}

/** Expression (Destiny): every letter of the full birth name. */
export const expression = (name: string) => nameNumber(name, () => true, "letters");
/** Soul Urge (Heart's Desire): vowels only. */
export const soulUrge = (name: string) => nameNumber(name, (c) => VOWELS.has(c), "vowels");
/** Personality: consonants only. */
export const personality = (name: string) => nameNumber(name, (c) => !VOWELS.has(c), "consonants");

/** Birthday number: the day of birth, reduced. */
export function birthday(date: string): Result {
  const d = Number(date.slice(8, 10));
  const r = reduce(d);
  return { value: r.value, steps: [`Day of birth: ${d}`, ...r.steps] };
}

/** Personal Year: birth day + birth month + the current year, reduced (masters not kept). */
export function personalYear(date: string, currentYear: number): Result {
  const [, m, d] = date.split("-").map(Number);
  const day = reduce(d, false).value;
  const month = reduce(m, false).value;
  const year = reduce(currentYear, false).value;
  const total = day + month + year;
  const final = reduce(total, false);
  return {
    value: final.value,
    steps: [`Birth day ${d} → ${day}, birth month ${m} → ${month}, year ${currentYear} → ${year}`, `${day} + ${month} + ${year} = ${total}`, ...final.steps],
  };
}

/** Maturity: Life Path + Expression, reduced. */
export function maturity(date: string, name: string): Result {
  const lp = lifePath(date).value;
  const ex = expression(name).value;
  const r = reduce(lp + ex);
  return { value: r.value, steps: [`Life Path ${lp} + Expression ${ex} = ${lp + ex}`, ...r.steps] };
}

/** Universal Year: the digits of the calendar year added together (2026 → 1). */
export function universalYear(year: number): Result {
  return reduce(year, false);
}
