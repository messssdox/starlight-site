import { test } from "node:test";
import assert from "node:assert/strict";
import { pairReading, type PairText } from "../src/lib/pair-reading.ts";
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

function reading(d1: string, d2: string, kind = 0): PairText {
  const [kindId, tone] = KINDS_BY_TONE[kind];
  return pairReading({
    seed: `${d1}|${d2}|${kindId}`,
    dates: [d1, d2],
    tone,
    mine: personalSigns(d1, "", "UTC"),
    theirs: personalSigns(d2, "", "UTC"),
    c: compare(d1, d2, 2026),
    them: "Sam",
    kind: KINDS[kindId as keyof typeof KINDS],
  });
}

/** Every piece of text a reader sees, section by section. */
const sections = (r: PairText): Record<string, string> => ({
  harmony: r.harmony,
  "planet by planet": Object.values(r.planetMix).join(" "),
  "animals and elements": `${r.animals} ${r.elements}`,
  numbers: `${r.numbers} ${r.year}`,
  "start and stop (you)": [...r.startStop.me.start, r.startStop.me.stop].join(" "),
  "start and stop (them)": [...r.startStop.them.start, r.startStop.them.stop].join(" "),
  tips: r.tips.join(" "),
});

test("no two different pairs get the same text in any pair-built section", () => {
  const seen = new Map<string, string>();
  const clashes: string[] = [];
  const pairs = new Set<string>();
  for (let i = 0; i < 1000; i++) {
    const d1 = randomDate(), d2 = randomDate(), kind = Math.floor(rand() * 4);
    const id = `${d1} + ${d2}`;
    if (pairs.has(id)) continue;
    pairs.add(id);
    for (const [name, text] of Object.entries(sections(reading(d1, d2, kind)))) {
      const key = `${name}::${text}`;
      const other = seen.get(key);
      if (other && other !== id) clashes.push(`${name}: ${other} and ${id}`);
      else seen.set(key, id);
    }
  }
  assert.deepEqual(clashes, [], `Matching text for different pairs:\n${clashes.join("\n")}`);
});

test("the same person gets different Start and stop tips with two different people", () => {
  const me = "1988-04-12";
  const rand2 = rng(7);
  for (let i = 0; i < 100; i++) {
    const a = new Date(Date.UTC(1950, 0, 1) + Math.floor(rand2() * 2e12)).toISOString().slice(0, 10);
    const b = new Date(Date.UTC(1950, 0, 1) + Math.floor(rand2() * 2e12)).toISOString().slice(0, 10);
    if (a === b) continue;
    const ra = reading(me, a), rb = reading(me, b);
    assert.notDeepEqual(ra.startStop.me, rb.startStop.me, `${me} with ${a} and with ${b}`);
  }
});

test("the same pair always reads the same", () => {
  assert.deepEqual(reading("1990-07-15", "1992-01-03"), reading("1990-07-15", "1992-01-03"));
});

test("pair text has no gaps, leftover placeholders or broken grammar for the reader", () => {
  for (let i = 0; i < 200; i++) {
    const r = reading(randomDate(), randomDate(), i % 4);
    const all = [r.harmony, ...r.click, ...r.care, ...Object.values(r.planetMix), r.animals, r.elements, r.numbers, r.year,
      ...r.startStop.me.start, r.startStop.me.stop, ...r.startStop.them.start, r.startStop.them.stop, ...r.tips];
    for (const t of all) {
      assert.ok(t.trim(), "empty line");
      assert.doesNotMatch(t, /\{\w+\}|undefined|NaN|\byou's\b|(?<!of )\byou is\b|\s{2,}|\.\./, t);
    }
  }
});
