// Small helpers the spotlights share for picking and joining wording. Everything is picked by
// hashing a seed (the birth dates) with a salt, so the same person always reads the same, and
// a reading never uses the same picture or everyday moment twice.

/** FNV-1a with a final mix, so a seed and a salt give the same pick every time. */
export function hash(s: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 0x01000193);
  // stir the bits (MurmurHash3's finish), so small numbers like "% 2" are as varied as big ones
  h = Math.imul(h ^ (h >>> 16), 0x85ebca6b);
  h = Math.imul(h ^ (h >>> 13), 0xc2b2ae35);
  return (h ^ (h >>> 16)) >>> 0;
}

export const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
export const lcFirst = (s: string) => s.charAt(0).toLowerCase() + s.slice(1);
export const an = (word: string) => (/^[AEIOU]/i.test(word) ? `an ${word}` : `a ${word}`);
/** Fills {placeholders}. A value can be a function, which is only called when its placeholder is used,
 * so a picture or moment is only picked (and marked as used) when the wording needs it. */
export const fill = (t: string, vars: Record<string, string | (() => string)>) =>
  t.replace(/\{(\w+)\}/g, (m, k) => {
    const v = vars[k];
    return v === undefined ? m : typeof v === "function" ? v() : v;
  });
/** "Sun, Moon and Mars" */
export const listOf = (xs: string[]) => (xs.length < 2 ? xs.join("") : `${xs.slice(0, -1).join(", ")} and ${xs[xs.length - 1]}`);

export interface Picker {
  /** One item from the list for this salt, skipping any this reading has already used. */
  one<T>(list: readonly T[], salt: string): T;
  /** A number from 0 to n - 1 for this salt. */
  n(n: number, salt: string): number;
}

export function picker(seed: string): Picker {
  const used = new Set<unknown>();
  return {
    one<T>(list: readonly T[], salt: string): T {
      const start = hash(`${seed}|${salt}`) % list.length;
      for (let i = 0; i < list.length; i++) {
        const item = list[(start + i) % list.length];
        if (!used.has(item)) {
          used.add(item);
          return item;
        }
      }
      return list[start];
    },
    n: (n, salt) => hash(`${seed}|${salt}`) % n,
  };
}
