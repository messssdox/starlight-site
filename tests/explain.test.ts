import { test } from "node:test";
import assert from "node:assert/strict";
import { type Breakdown, lifePathBreakdown, nameBreakdown, personalYearBreakdown, chineseBreakdowns, longDate } from "../src/lib/explain.ts";

const texts = (b: Breakdown) => b.steps.map((s) => s.text);

test("long dates read naturally", () => {
  assert.equal(longDate("1990-03-14"), "14 March 1990");
});

test("Life Path working uses the reader's own date", () => {
  const b = lifePathBreakdown("1990-03-14");
  assert.ok(texts(b).includes("Day 14: 1 + 4 = 5."));
  assert.ok(texts(b).includes("Month 3 stays 3."));
  assert.ok(texts(b).includes("Add the three together: 5 + 3 + 1 = 9."));
  assert.equal(b.result, "Your Life Path is 9.");
});

test("Life Path working explains master numbers", () => {
  const b = lifePathBreakdown("1991-11-09");
  assert.equal(b.result, "Your Life Path is 22.");
  assert.ok(b.steps.some((s) => s.text === "22 is a master number, so it stays 22." && s.why?.startsWith("Master numbers are never reduced")));
  assert.equal(b.meaning!.title, "Life on the path of a 22");
  assert.ok(b.meaning!.text.startsWith("The Master Builder."));
});

test("name working is brief: which letters, lit up, no sums", () => {
  const b = nameBreakdown("Grace Ellen Hart", "expression");
  assert.equal(b.steps.length, 0);
  assert.ok(b.lettersOnly);
  assert.ok(b.summary!.startsWith("Every letter of your full birth name is used."));
  assert.ok(!/=/.test(b.summary!));
  assert.equal(b.result, "Your Expression number is 3.");
  const soul = nameBreakdown("John", "soul");
  assert.equal(soul.result, "Your Soul Urge number is 6.");
  assert.equal(soul.letters!.filter((l) => l.counted).length, 1);
});

test("Personal Year counts from 1 January and notes the birthday method", () => {
  const before = personalYearBreakdown("1990-03-14", "2026-02-01");
  assert.equal(before.result, "You are in a Personal Year 9.");
  assert.ok(before.steps.at(-1)!.text.includes("began on 1 January 2026"));
  assert.ok(before.steps.at(-1)!.text.includes("a Personal Year 1, starts on 1 January 2027"));
  // before the birthday, the birthday school is still on last year's number (2025: 5 + 3 + 9 = 17 -> 8)
  assert.ok(before.note!.includes("Personal Year 8 from 14 March 2025 until your birthday on 14 March 2026"));
  const after = personalYearBreakdown("1990-03-14", "2026-10-10");
  assert.ok(after.note!.includes("also be in a Personal Year 9, running from 14 March 2026"));
});

test("Chinese working explains Lunar New Year and the count from the Rat", () => {
  const [animal, element] = chineseBreakdowns("1990-01-20");
  assert.equal(animal.result, "You are a Snake.");
  assert.ok(texts(animal).some((s) => s.includes("born before it") && s.includes("1989")));
  assert.ok(texts(animal).includes("Count 5 places on from the Rat: Rat, Ox, Tiger, Rabbit, Dragon, Snake."));
  assert.ok(texts(element).includes("1989 ends in 9, so your year element is Earth."));
  assert.equal(chineseBreakdowns("1984-06-01")[0].steps.at(-1)!.text, "A remainder of 0 means a full number of cycles, so you land back on the Rat.");
});

test("Challenge Numbers subtract the reduced day, month and year", async () => {
  const { challenges } = await import("../src/lib/numerology.ts");
  const { challengesBreakdown } = await import("../src/lib/explain.ts");
  // 14 March 1990: day 5, month 3, year 1; first 2, second 4, third 2, fourth 2
  assert.deepEqual(challenges("1990-03-14"), { first: 2, second: 4, third: 2, fourth: 2, day: 5, month: 3, year: 1 });
  // 29 November 1985: day 11 -> 2, month 11 -> 2, year 1985 -> 5; first 0, second 3, third 3, fourth 3
  const c = challenges("1985-11-29");
  assert.deepEqual([c.first, c.second, c.third, c.fourth], [0, 3, 3, 3]);
  const b = challengesBreakdown("1990-03-14");
  assert.ok(texts(b).some((s) => s.startsWith("Second Challenge") && s.endsWith("5 − 1 = 4.")));
  assert.equal(b.result, "Your challenges are 2, 4, 2 and 2. Your main challenge is 2.");
});

test("Birthday, Maturity and Universal Year working", async () => {
  const { birthdayBreakdown, maturityBreakdown, universalYearBreakdown } = await import("../src/lib/explain.ts");
  assert.equal(birthdayBreakdown("1990-03-14").result, "Your Birthday number is 5.");
  assert.ok(texts(birthdayBreakdown("1990-03-14")).includes("You were born on the 14th."));
  assert.equal(birthdayBreakdown("1990-03-22").result, "Your Birthday number is 22.");
  assert.ok(texts(birthdayBreakdown("1990-03-01")).includes("You were born on the 1st."));
  // Life Path 9 + Expression 3 = 12 -> 3
  assert.equal(maturityBreakdown("1990-03-14", "Grace Ellen Hart").result, "Your Maturity number is 3.");
  assert.equal(universalYearBreakdown(2026).result, "2026 is a Universal Year 1.");
});

test("the full numerology reading is grouped, most important first", async () => {
  const { numbersReading } = await import("../src/lib/numbers-ui.ts");
  const html = numbersReading({ date: "1990-03-14", name: "Grace Ellen Hart", tier: "first", articles: new Set(), today: "2026-10-27", noNameHint: "HINT" });
  const at = (s: string) => html.indexOf(s);
  for (const s of ["Start here", "Worth reading", "Extra detail", "Life Path", "Expression", "Soul Urge", "Birthday", "Personality", "Personal Year 2026", "Challenges", "Maturity", "Universal Year 2026", "Your main road in life"]) assert.ok(at(s) >= 0, s);
  assert.ok(at("Start here") < at("Soul Urge") && at("Soul Urge") < at("Worth reading") && at("Worth reading") < at(">Birthday<") && at("Personal Year 2026") < at("Extra detail"));
  assert.ok(!html.includes("HINT"));
  const noName = numbersReading({ date: "1990-03-14", name: "", tier: "first", articles: new Set(), today: "2026-10-27", noNameHint: "HINT" });
  assert.ok(noName.includes("HINT") && noName.includes(">Birthday<") && noName.includes("Challenges") && !noName.includes(">Soul Urge<"));
});
