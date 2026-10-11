import { test } from "node:test";
import assert from "node:assert/strict";
import { spotlight, spotlightWords, type SpotlightTier } from "../src/lib/spotlight.ts";
import { personalSigns } from "../src/lib/synastry.ts";

// a fixed pseudo-random sequence, so the test checks the same people every run
function rng(seed: number) {
  return () => ((seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0) / 2 ** 32);
}
const rand = rng(20261011);
const randomDate = () => {
  const t = Date.UTC(1940, 0, 1) + Math.floor(rand() * (Date.UTC(2015, 0, 1) - Date.UTC(1940, 0, 1)));
  return new Date(t).toISOString().slice(0, 10);
};
const TIERS: SpotlightTier[] = ["glance", "first", "deep"];
const read = (date: string, tier: SpotlightTier, time = "", place?: { lat: number; lon: number }) =>
  spotlight({ date, tier, year: 2026, signs: personalSigns(date, time, "Europe/London", place) });
const words = (date: string, tier: SpotlightTier) => spotlightWords(read(date, tier)).split(/\s+/).length;

test("no two different birth dates get the same spotlight in any tier", () => {
  const dates = new Set<string>();
  while (dates.size < 1500) dates.add(randomDate());
  for (const tier of TIERS) {
    const seen = new Map<string, string>();
    const clashes: string[] = [];
    for (const d of dates) {
      const text = spotlightWords(read(d, tier));
      const other = seen.get(text);
      if (other) clashes.push(`${other} and ${d}`);
      else seen.set(text, d);
    }
    assert.deepEqual(clashes, [], `Matching ${tier} spotlights:\n${clashes.join("\n")}`);
  }
});

test("people born a day, a week or a month apart read differently", () => {
  const day = 86_400_000;
  for (let i = 0; i < 200; i++) {
    const d = randomDate();
    for (const gap of [1, 7, 27, 28]) {
      const other = new Date(Date.parse(d) + gap * day).toISOString().slice(0, 10);
      for (const tier of TIERS) assert.notEqual(spotlightWords(read(d, tier)), spotlightWords(read(other, tier)), `${tier}: ${d} and ${other}`);
    }
  }
});

test("each tier keeps to its length: about 150, 400 and 700 words", () => {
  const range: Record<SpotlightTier, [number, number]> = { glance: [115, 190], first: [320, 480], deep: [560, 800] };
  const totals: Record<SpotlightTier, number> = { glance: 0, first: 0, deep: 0 };
  for (let i = 0; i < 300; i++) {
    const d = randomDate();
    for (const tier of TIERS) {
      const n = words(d, tier);
      totals[tier] += n;
      assert.ok(n >= range[tier][0] && n <= range[tier][1], `${tier} for ${d} has ${n} words`);
    }
  }
  assert.ok(Math.abs(totals.glance / 300 - 150) < 20, `Quick Glance averages ${totals.glance / 300}`);
  assert.ok(Math.abs(totals.first / 300 - 400) < 40, `First Timers averages ${totals.first / 300}`);
  assert.ok(Math.abs(totals.deep / 300 - 700) < 90, `Full Deep Dive averages ${totals.deep / 300}`);
});

test("the same person always reads the same", () => {
  for (const tier of TIERS) assert.deepEqual(read("1990-10-10", tier), read("1990-10-10", tier));
});

test("a birth time and town add the Rising sign", () => {
  const s = read("1990-10-10", "first", "08:30", { lat: 53.48, lon: -2.24 });
  assert.ok(s.facts.some((f) => f.includes("Rising")));
  assert.match(s.sections[0].text, /Rising/);
});

test("spotlight text has no gaps, leftover placeholders, joined sign-animal names or broken grammar", () => {
  for (let i = 0; i < 400; i++) {
    const d = randomDate();
    for (const tier of TIERS) {
      const s = read(d, tier);
      const all = [s.title, ...s.facts, ...s.sections.map((x) => x.text), ...s.gifts, ...s.edges, ...(tier === "glance" ? [] : [s.closing])];
      for (const t of all) {
        assert.ok(t.trim(), `empty line in ${tier} for ${d}`);
        assert.doesNotMatch(t, /\{\w+\}|undefined|NaN|\s{2,}|\.\.|,,|\ba [AEIOU]|\ban [^AEIOUaeiou\s]/, `${tier} for ${d}: ${t}`);
        // the user wants signs and animals kept apart, never "a Libra Horse"
        assert.doesNotMatch(t, /\b(Aries|Taurus|Gemini|Cancer|Leo|Virgo|Libra|Scorpio|Sagittarius|Capricorn|Aquarius|Pisces) (Rat|Ox|Tiger|Rabbit|Dragon|Snake|Horse|Goat|Monkey|Rooster|Dog|Pig)\b/, `${tier} for ${d}: ${t}`);
      }
    }
  }
});
