import { test } from "node:test";
import assert from "node:assert/strict";
import { signLink, personalSigns, pairUp, chemistryOf } from "../src/lib/synastry.ts";
import { SIGNS } from "../src/data/astrology.ts";
import { PAIR_LINES, PAIR_TITLES, PAIR_SHORT } from "../src/data/synastry.ts";
import { relationshipById } from "../src/data/relationships.ts";

const sign = (id: string) => SIGNS.find((s) => s.id === id)!;

test("sign links follow the distance round the zodiac", () => {
  assert.equal(signLink(sign("aries"), sign("aries")), "same");
  assert.equal(signLink(sign("aries"), sign("taurus")), "neighbour");
  assert.equal(signLink(sign("aries"), sign("gemini")), "sextile");
  assert.equal(signLink(sign("aries"), sign("cancer")), "square");
  assert.equal(signLink(sign("aries"), sign("leo")), "trine");
  assert.equal(signLink(sign("aries"), sign("virgo")), "quincunx");
  assert.equal(signLink(sign("aries"), sign("libra")), "opposite");
  assert.equal(signLink(sign("pisces"), sign("aries")), "neighbour");
  assert.equal(chemistryOf(sign("leo"), sign("aquarius")), "magnetic");
});

test("two charts pair up planet by planet", () => {
  const a = personalSigns("1990-07-15", "", "Europe/London");
  const b = personalSigns("1992-01-03", "", "Europe/London");
  assert.equal(a.signs.sun.id, "cancer");
  assert.equal(b.signs.sun.id, "capricorn");
  const pairs = pairUp(a, b);
  assert.equal(pairs.length, 5);
  assert.equal(pairs[0].link, "opposite");
});

test("every planet has wording for every link and tone", () => {
  for (const planet of ["sun", "moon", "mercury", "venus", "mars"] as const) {
    assert.equal(Object.keys(PAIR_LINES[planet]).length, 7);
    assert.equal(Object.keys(PAIR_TITLES[planet]).length, 4);
    assert.ok(PAIR_SHORT[planet].easy && PAIR_SHORT[planet].care);
  }
});

test("partner choices and older love links", () => {
  assert.equal(relationshipById("partner-him")?.label, "Partner (him)");
  assert.equal(relationshipById("partner-her")?.label, "Partner (her)");
  assert.equal(relationshipById("partner")?.label, "Partner (them)");
  assert.equal(relationshipById("spouse")?.kind, "love");
  assert.equal(relationshipById("date")?.kind, "love");
});
