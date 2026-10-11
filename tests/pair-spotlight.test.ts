import { test } from "node:test";
import assert from "node:assert/strict";
import { pairSpotlight, pairSpotlightWords, type PairSpotlightText } from "../src/lib/pair-spotlight.ts";
import { pairReading } from "../src/lib/pair-reading.ts";
import { personalSigns } from "../src/lib/synastry.ts";
import { compare } from "../src/lib/compat.ts";
import { KINDS } from "../src/data/relationships.ts";
import type { Tone } from "../src/data/synastry.ts";

// a fixed pseudo-random sequence, so the test checks the same pairs every run
function rng(seed: number) {
  return () => ((seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0) / 2 ** 32);
}
const rand = rng(20261011);
const randomDate = () => {
  const t = Date.UTC(1945, 0, 1) + Math.floor(rand() * (Date.UTC(2012, 0, 1) - Date.UTC(1945, 0, 1)));
  return new Date(t).toISOString().slice(0, 10);
};
const KINDS_BY_TONE: [string, Tone][] = [["love", "love"], ["friend", "friends"], ["parent", "family"], ["colleague", "work"]];

function spot(d1: string, d2: string, kind = 0, them = "Sam"): PairSpotlightText {
  const [kindId, tone] = KINDS_BY_TONE[kind];
  const seed = `${d1}|${d2}|${kindId}`;
  const mine = personalSigns(d1, "", "UTC"), theirs = personalSigns(d2, "", "UTC"), c = compare(d1, d2, 2026);
  const pr = pairReading({ seed, dates: [d1, d2], tone, mine, theirs, c, them, kind: KINDS[kindId as keyof typeof KINDS] });
  return pairSpotlight({ seed, tone, mine, theirs, c, them, startStop: pr.startStop });
}
const words = (s: PairSpotlightText) => pairSpotlightWords(s).split(/\s+/).length;

// "Where you click" and "Where you rub" are a few short lines each, so two pairs with the same
// signs can share them; the whole spotlight, and the parts built from every detail, never repeat
test("no two different pairs get the same spotlight, or the same opening or story", () => {
  const seen = new Map<string, string>();
  const clashes: string[] = [];
  for (let i = 0; i < 1500; i++) {
    const d1 = randomDate(), d2 = randomDate(), kind = Math.floor(rand() * 4);
    const id = `${d1} + ${d2}`;
    const s = spot(d1, d2, kind);
    for (const [name, text] of [["whole", pairSpotlightWords(s)], ...[s.sections[0], s.sections[3]].map((x) => [x.heading, x.text])]) {
      const key = `${name}::${text}`;
      const other = seen.get(key);
      if (other && other !== id) clashes.push(`${name}: ${other} and ${id}`);
      else seen.set(key, id);
    }
  }
  assert.deepEqual(clashes, [], `Matching spotlights for different pairs:\n${clashes.join("\n")}`);
});

test("the same person reads differently with different people", () => {
  const me = "1988-04-12";
  for (let i = 0; i < 200; i++) {
    const a = randomDate(), b = randomDate();
    if (a === b) continue;
    assert.notEqual(spot(me, a).sections[0].text, spot(me, b).sections[0].text, `${me} with ${a} and with ${b}`);
  }
});

test("the spotlight is about 550 words", () => {
  let total = 0;
  for (let i = 0; i < 300; i++) {
    const s = spot(randomDate(), randomDate(), i % 4);
    const n = words(s);
    total += n;
    assert.ok(n >= 420 && n <= 680, `${n} words`);
  }
  assert.ok(Math.abs(total / 300 - 520) < 50, `averages ${total / 300}`);
});

test("the same pair always reads the same", () => {
  assert.deepEqual(spot("1990-07-15", "1992-01-03"), spot("1990-07-15", "1992-01-03"));
});

test("each person gets exactly one Do and one Don't", () => {
  const s = spot("1982-07-20", "1991-03-02");
  for (const d of [s.doDont.me, s.doDont.them]) {
    assert.ok(d.do.length > 20 && d.dont.length > 20);
  }
});

test("spotlight text has no gaps, leftover placeholders, joined sign-animal names or broken grammar", () => {
  for (let i = 0; i < 400; i++) {
    const them = i % 2 ? "Sam" : "your partner";
    const s = spot(randomDate(), randomDate(), i % 4, them);
    const all = [s.names, s.title, ...s.facts, ...s.sections.map((x) => x.text), s.closing, s.doDont.me.do, s.doDont.me.dont, s.doDont.them.do, s.doDont.them.dont];
    for (const t of all) {
      assert.ok(t.trim(), "empty line");
      assert.doesNotMatch(t, /\{\w+\}|undefined|NaN|\byou's\b|\s{2,}|\.\.|,,|\ba [AEIOU]|\ban [^AEIOUaeiou\s]/, t);
      // the user wants signs and animals kept apart, never "a Libra Horse"
      assert.doesNotMatch(t, /\b(Aries|Taurus|Gemini|Cancer|Leo|Virgo|Libra|Scorpio|Sagittarius|Capricorn|Aquarius|Pisces) (Rat|Ox|Tiger|Rabbit|Dragon|Snake|Horse|Goat|Monkey|Rooster|Dog|Pig)\b/, t);
    }
  }
});
