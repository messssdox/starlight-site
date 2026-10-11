import { test } from "node:test";
import assert from "node:assert/strict";
import { spotlight, spotlightWords, type SpotlightTier } from "../src/lib/spotlight.ts";
import { pairSpotlight, type PairSpotlightText } from "../src/lib/pair-spotlight.ts";
import { pairReading } from "../src/lib/pair-reading.ts";
import { personalSigns } from "../src/lib/synastry.ts";
import { compare } from "../src/lib/compat.ts";
import { KINDS } from "../src/data/relationships.ts";
import { PLANET_IMAGE, SCENES, ANIMAL_IMAGE, LIFE_PATH_IMAGE } from "../src/data/images.ts";
import type { Tone } from "../src/data/synastry.ts";

// The user wants every reading to read as its own: no stock one-liners shared across people.
// These tests read many random people and pairs sentence by sentence and fail when a sentence,
// or a sentence with only the sign, animal, element and number names swapped, turns up in too
// many readings. A sentence can only repeat when two people share the same placements and the
// same wording is picked, so the limits are a small share of readings, not zero.

function rng(seed: number) {
  return () => ((seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0) / 2 ** 32);
}
const rand = rng(424242);
const randomDate = () => {
  const t = Date.UTC(1945, 0, 1) + Math.floor(rand() * (Date.UTC(2012, 0, 1) - Date.UTC(1945, 0, 1)));
  return new Date(t).toISOString().slice(0, 10);
};

const SIGN = /\b(Aries|Taurus|Gemini|Cancer|Leo|Virgo|Libra|Scorpio|Sagittarius|Capricorn|Aquarius|Pisces)\b/g;
const ANIMAL = /\b(Rat|Ox|Tiger|Rabbit|Dragon|Snake|Horse|Goat|Monkey|Rooster|Dog|Pig)(s|'s)?\b/g;
const ELEMENT = /\b(Fire|Earth|Air|Water|Wood|Metal)\b/g;
/** The sentence with every name swapped for a blank, so "Your Leo Sun" and "Your Libra Sun" match. */
const frameOf = (s: string) => s.replace(SIGN, "_").replace(ANIMAL, "_").replace(ELEMENT, "_").replace(/\b\d+(st|nd|rd|th|s)?\b/g, "_").replace(/\bSam('s)?\b/g, "_");
// the only sentence allowed to repeat: a practical note asking for a birth time
const HELPER = /^Your Moon moved from/;
const sentences = (t: string) => t.split(/(?<=[.!?])\s+/).map((s) => s.trim()).filter((s) => s.split(" ").length > 3 && !HELPER.test(s));

function check(name: string, texts: string[], maxShare: number, maxFrameShare: number) {
  const exact = new Map<string, number>(), frames = new Map<string, number>();
  for (const t of texts) {
    for (const s of new Set(sentences(t))) exact.set(s, (exact.get(s) ?? 0) + 1);
    for (const s of new Set(sentences(t).map(frameOf))) frames.set(s, (frames.get(s) ?? 0) + 1);
  }
  const over = (m: Map<string, number>, share: number) =>
    [...m].filter(([, c]) => c / texts.length > share).sort((a, b) => b[1] - a[1]).map(([s, c]) => `${((100 * c) / texts.length).toFixed(1)}%  ${s}`);
  assert.deepEqual(over(exact, maxShare), [], `${name}: sentences in more than ${maxShare * 100}% of readings`);
  assert.deepEqual(over(frames, maxFrameShare), [], `${name}: sentence frames in more than ${maxFrameShare * 100}% of readings`);

  // two random readings should share almost no sentences word for word
  let shared = 0, total = 0;
  for (let i = 0; i + 1 < texts.length; i += 2) {
    const a = sentences(texts[i]), b = new Set(sentences(texts[i + 1]));
    shared += a.filter((s) => b.has(s)).length;
    total += a.length;
  }
  assert.ok(shared / total < 0.01, `${name}: two readings share ${((100 * shared) / total).toFixed(2)}% of sentences`);
}

const N = 1000;
const TIERS: SpotlightTier[] = ["glance", "first", "deep"];

test("no stock sentences repeat across many people's Meet yourself spotlights", () => {
  for (const tier of TIERS) {
    const texts: string[] = [];
    for (let i = 0; i < N; i++) {
      const d = randomDate();
      const s = spotlight({ date: d, tier, year: 2026, signs: personalSigns(d, "", "Europe/London") });
      texts.push([...s.sections.map((x) => x.text), s.closing].join(" "));
    }
    check(`Meet yourself (${tier})`, texts, 0.03, 0.04);
  }
});

const KINDS_BY_TONE: [string, Tone][] = [["love", "love"], ["friend", "friends"], ["parent", "family"], ["colleague", "work"]];
function pair(d1: string, d2: string, kind: number): PairSpotlightText {
  const [kindId, tone] = KINDS_BY_TONE[kind];
  const seed = `${d1}|${d2}|${kindId}`;
  const mine = personalSigns(d1, "", "UTC"), theirs = personalSigns(d2, "", "UTC"), c = compare(d1, d2, 2026);
  const pr = pairReading({ seed, dates: [d1, d2], tone, mine, theirs, c, them: "Sam", kind: KINDS[kindId as keyof typeof KINDS] });
  return pairSpotlight({ seed, tone, mine, theirs, c, them: "Sam", startStop: pr.startStop });
}

test("no stock sentences repeat across many pairs' spotlights, Dos and Don'ts", () => {
  const spots: string[] = [], dos: string[] = [];
  for (let i = 0; i < N; i++) {
    const s = pair(randomDate(), randomDate(), i % 4);
    spots.push([...s.sections.map((x) => x.text), s.closing].join(" "));
    dos.push([s.doDont.me.do, s.doDont.me.dont, s.doDont.them.do, s.doDont.them.dont].join(" "));
  }
  check("Meet the two of you", spots, 0.03, 0.04);
  check("Do and Don't", dos, 0.03, 0.04);
});

test("a reading never uses the same picture or everyday moment twice", () => {
  const all = [
    ...Object.values(PLANET_IMAGE).flatMap((t) => Object.values(t).flat()),
    ...Object.values(SCENES).flatMap((t) => Object.values(t).flat()),
    ...Object.values(ANIMAL_IMAGE).flat(), ...Object.values(LIFE_PATH_IMAGE).flat(),
  ];
  // the pieces themselves are all different, so a repeat can only come from picking one twice
  assert.equal(new Set(all).size, all.length, "the same picture or moment is written twice");
  for (let i = 0; i < 300; i++) {
    const d = randomDate();
    const texts = [
      spotlightWords(spotlight({ date: d, tier: "deep", year: 2026, signs: personalSigns(d, "", "Europe/London") })),
      Object.values(pair(d, randomDate(), i % 4).sections).map((x) => x.text).join(" "),
    ];
    for (const text of texts) {
      const twice = all.filter((p) => text.split(p).length > 2);
      assert.deepEqual(twice, [], `${d}: ${twice.join(" | ")}`);
    }
  }
});
