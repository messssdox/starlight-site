import { test } from "node:test";
import assert from "node:assert/strict";
import { lifePathBreakdown, nameBreakdown, personalYearBreakdown, chineseBreakdowns, longDate } from "../src/lib/explain.ts";

test("long dates read naturally", () => {
  assert.equal(longDate("1990-03-14"), "14 March 1990");
});

test("Life Path working uses the reader's own date", () => {
  const b = lifePathBreakdown("1990-03-14");
  assert.ok(b.steps.includes("Day 14: 1 + 4 = 5."));
  assert.ok(b.steps.includes("Month 3: already a single digit, so it stays 3."));
  assert.ok(b.steps.includes("Add the three results together: 5 + 3 + 1 = 9."));
  assert.equal(b.result, "Your Life Path is 9.");
});

test("Life Path working explains master numbers", () => {
  const b = lifePathBreakdown("1991-11-09");
  assert.equal(b.result, "Your Life Path is 22.");
  assert.ok(b.steps.some((s) => s.startsWith("22 is a master number")));
});

test("name working adds word by word", () => {
  const b = nameBreakdown("Grace Ellen Hart", "expression");
  assert.ok(b.steps.includes("GRACE: G 7 + R 9 + A 1 + C 3 + E 5 = 25."));
  assert.ok(b.steps.includes("Add the words together: 25 + 21 + 20 = 66."));
  assert.equal(b.result, "Your Expression number is 3.");
  const soul = nameBreakdown("John", "soul");
  assert.equal(soul.result, "Your Soul Urge number is 6.");
  assert.equal(soul.letters!.filter((l) => l.counted).length, 1);
});

test("Personal Year counts from 1 January and notes the birthday method", () => {
  const before = personalYearBreakdown("1990-03-14", "2026-02-01");
  assert.equal(before.result, "You are in a Personal Year 9.");
  assert.ok(before.steps.at(-1)!.includes("began on 1 January 2026"));
  assert.ok(before.steps.at(-1)!.includes("a Personal Year 1, starts on 1 January 2027"));
  // before the birthday, the birthday school is still on last year's number (2025: 5 + 3 + 9 = 17 -> 8)
  assert.ok(before.note!.includes("Personal Year 8 from 14 March 2025 until your birthday on 14 March 2026"));
  const after = personalYearBreakdown("1990-03-14", "2026-10-10");
  assert.ok(after.note!.includes("also be in a Personal Year 9, running from 14 March 2026"));
});

test("Chinese working explains Lunar New Year and the count from the Rat", () => {
  const [animal, element] = chineseBreakdowns("1990-01-20");
  assert.equal(animal.result, "You are a Snake.");
  assert.ok(animal.steps.some((s) => s.includes("born before it") && s.includes("1989")));
  assert.ok(animal.steps.includes("Count 5 places on from the Rat: Rat, Ox, Tiger, Rabbit, Dragon, Snake."));
  assert.ok(element.steps.includes("1989 ends in 9, so your year element is Earth."));
  assert.equal(chineseBreakdowns("1984-06-01")[0].steps.at(-1), "A remainder of 0 means a full number of cycles, so you land back on the Rat.");
});
