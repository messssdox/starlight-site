import { test } from "node:test";
import assert from "node:assert/strict";
import { sunSignOn, pairMatches, pairProfile, signAspect } from "../src/lib/pair.ts";
import { pairMonthlyForecast, pairYearlyForecast } from "../src/lib/forecast.ts";
import { SIGNS } from "../src/data/astrology.ts";
import { ANIMALS } from "../src/data/zodiac.ts";

test("sun sign from a birth date", () => {
  assert.equal(sunSignOn("1990-07-01").id, "cancer");
  assert.equal(sunSignOn("2001-03-20").id, "pisces");
  assert.equal(sunSignOn("2001-03-21").id, "aries");
  assert.equal(sunSignOn("1985-12-25").id, "capricorn");
});

test("sign aspects count whole signs", () => {
  assert.equal(signAspect("cancer", "scorpio"), "trine");
  assert.equal(signAspect("cancer", "virgo"), "sextile");
  assert.equal(signAspect("cancer", "libra"), "square");
  assert.equal(signAspect("cancer", "capricorn"), "opposite");
  assert.equal(signAspect("cancer", "leo"), "neutral");
});

test("a pair's friends, secret friend and clash come from both wheels", () => {
  const m = pairMatches("cancer", "horse");
  assert.deepEqual(m.friends.map((f) => `${f.sign.id} ${f.animal.id}`), ["scorpio dog", "pisces tiger"]);
  assert.equal(`${m.secret.sign.id} ${m.secret.animal.id}`, "virgo goat");
  assert.equal(`${m.clash.sign.id} ${m.clash.animal.id}`, "capricorn rat");
  // the friend sign always shares the element, the friend animal always shares the group
  for (const s of SIGNS) for (const a of ANIMALS) {
    const p = pairMatches(s.id, a.id);
    for (const f of p.friends) {
      assert.equal(f.sign.element, s.element);
      assert.equal(f.animal.group, a.group);
    }
  }
});

test("every pair reads as one sentence per line, with no gaps", () => {
  for (const s of SIGNS) for (const a of ANIMALS) {
    const p = pairProfile(s.id, a.id);
    assert.equal(p.title, `The ${s.name} ${a.name}`);
    for (const line of [p.summary, p.strengths, p.watchOut, p.love, p.work, p.careers, p.wellbeing, p.elementBlend]) {
      assert.match(line, /^[A-Z].*\.$/);
      assert.doesNotMatch(line, /undefined|\{A\}/);
    }
  }
});

test("pair forecasts stay in range and are the same on reload", () => {
  const a = pairMonthlyForecast("cancer", "horse", "2026-10-10");
  assert.deepEqual(a, pairMonthlyForecast("cancer", "horse", "2026-10-10"));
  assert.ok(a.stars >= 1 && a.stars <= 5);
  assert.equal(a.topics.length, 4);
  assert.match(a.topics[0].text, /^Venus is in /);
  const y = pairYearlyForecast("leo", "rat", "2026-10-10");
  assert.ok(y.stars >= 1 && y.stars <= 5);
  assert.match(y.jupiter, /^Jupiter, the planet of luck, is in /);
  for (const m of [...y.bestMonths, ...y.careMonths]) assert.ok(m >= 1 && m <= 12);
});
