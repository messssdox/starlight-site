// A sun sign and a Chinese zodiac animal read together, such as "The Cancer Horse".
//
// The two wheels follow the same shape: on both, friends share a colour and sit four places
// apart, and the clash sits directly opposite. So the pair's friends are the friendly sign and
// the friendly animal four places on (and eight places on), the secret friend is the sign two
// places on with the animal's secret friend, and the clash is the opposite sign with the
// opposite animal.
import { MakeTime } from "astronomy-engine";
import { SIGNS, type Sign, type SignId } from "../data/astrology.ts";
import { ANIMALS, PROFILES, animalById, type Animal } from "../data/zodiac.ts";
import { SIGN_PARTS, ANIMAL_PARTS, ELEMENT_BLEND, type SignPart } from "../data/pairs.ts";
import { secretFriendOf, clashOf } from "./chinese.ts";
import { longitudeOf, signOf } from "./astrology.ts";

export const signById = (id: string): Sign => {
  const s = SIGNS.find((x) => x.id === id);
  if (!s) throw new Error(`Unknown sign: ${id}`);
  return s;
};
const signIndex = (id: string) => SIGNS.findIndex((s) => s.id === id);
const signAt = (i: number) => SIGNS[((i % 12) + 12) % 12];

/** The sign the Sun was in at midday (UTC) on a date. Someone born on a cusp day can change it. */
export function sunSignOn(iso: string): Sign {
  return signOf(longitudeOf("sun", MakeTime(new Date(`${iso}T12:00:00Z`)))).sign;
}

export type SignAspect = "same" | "trine" | "sextile" | "square" | "opposite" | "neutral";

/** How sign `b` sits with sign `a`, counted in whole signs. */
export function signAspect(a: SignId, b: SignId): SignAspect {
  const d = (signIndex(b) - signIndex(a) + 12) % 12;
  if (d === 0) return "same";
  if (d === 4 || d === 8) return "trine";
  if (d === 2 || d === 10) return "sextile";
  if (d === 3 || d === 9) return "square";
  if (d === 6) return "opposite";
  return "neutral";
}

export interface PairMatch { sign: Sign; animal: Animal }

/** The pair's two friends, secret friend and clash, each a sign and an animal together. */
export function pairMatches(signId: SignId, animalId: string): { friends: PairMatch[]; secret: PairMatch; clash: PairMatch } {
  const s = signIndex(signId);
  const a = animalById(animalId).index;
  return {
    friends: [4, 8].map((k) => ({ sign: signAt(s + k), animal: ANIMALS[(a + k) % 12] })),
    secret: { sign: signAt(s + 2), animal: secretFriendOf(animalId) },
    clash: { sign: signAt(s + 6), animal: clashOf(animalId) },
  };
}

const cap = (t: string) => t[0].toUpperCase() + t.slice(1);
/** "Cancer's", "Aries'" */
export const poss = (name: string) => (name.endsWith("s") ? `${name}'` : `${name}'s`);
const article = (word: string) => (/^[AEIOU]/.test(word) ? "an" : "a");

export interface PairProfile {
  sign: Sign;
  animal: Animal;
  part: SignPart;
  title: string;
  tags: string[];
  summary: string;
  strengths: string;
  watchOut: string;
  love: string;
  work: string;
  careers: string;
  wellbeing: string;
  /** Western element sentence and how it meets the animal's element; the Chinese element is filled in by the page as a link. */
  elementSign: string;
  elementBlend: string;
  luckyNumbers: number[];
  luckyColours: string[];
  luckyFlowers: string[];
}

/** Every line of the reveal panel, written for the sign and the animal together. */
export function pairProfile(signId: SignId, animalId: string): PairProfile {
  const sign = signById(signId);
  const animal = animalById(animalId);
  const sp = SIGN_PARTS[signId];
  const ap = ANIMAL_PARTS[animalId];
  const prof = PROFILES[animalId];
  const A = animal.name;
  const careers = [...sp.careers, ...prof.careers.replace(/\.$/, "").split(", ").slice(0, 2).map((c) => c.toLowerCase())];
  const firstTrait = cap(sign.keywords.split(", ")[0]);
  return {
    sign, animal, part: sp,
    title: `The ${sign.name} ${A}`,
    tags: [firstTrait, ...animal.traits.slice(0, 2)].filter((t, i, xs) => xs.indexOf(t) === i),
    summary: `${sp.you}, and like the ${A} you are ${ap.you}.`,
    strengths: `${cap(poss(sign.name))} ${sp.strengths}, with the ${A}'s ${ap.strengths}.`,
    watchOut: `${cap(poss(sign.name))} ${sp.watchOut}, and the ${A}'s ${ap.watchOut}.`,
    love: `Like ${sign.name} you are ${sp.love}, and like the ${A} you ${ap.love}.`,
    work: `You do best where ${sp.work} meets ${ap.work}.`,
    careers: `${[...new Set(careers)].join(", ")}.`,
    wellbeing: `You need ${sp.wellbeing} for your ${sign.name} side and ${ap.wellbeing} for your ${A} side.`,
    elementSign: `${sign.name} is ${article(sign.element)} ${sign.element} sign, and the ${A}'s own element is`,
    elementBlend: ELEMENT_BLEND[sign.element][animal.element].replace("{A}", A),
    luckyNumbers: [...new Set([...prof.luckyNumbers, sp.luckyNumber])].sort((x, y) => x - y),
    luckyColours: [...new Set([sp.luckyColour, ...prof.luckyColours.slice(0, 2)])],
    luckyFlowers: [sp.luckyFlower, prof.luckyFlowers[0]],
  };
}
