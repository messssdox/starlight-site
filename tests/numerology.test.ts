import { test } from "node:test";
import assert from "node:assert/strict";
import { lifePath, expression, soulUrge, personality, personalYear, reduce, letterValue, universalYear, universalMonth, universalDay, personalDay } from "../src/lib/numerology.ts";

test("letters use Pythagorean values", () => {
  assert.equal(letterValue("A"), 1);
  assert.equal(letterValue("I"), 9);
  assert.equal(letterValue("J"), 1);
  assert.equal(letterValue("Z"), 8);
});

test("reduce keeps master numbers", () => {
  assert.equal(reduce(29).value, 11);
  assert.equal(reduce(38).value, 11);
  assert.equal(reduce(38, false).value, 2);
  assert.equal(reduce(1990).value, 1);
});

test("Life Path for 14 March 1990 is 9", () => {
  const r = lifePath("1990-03-14");
  assert.equal(r.value, 9);
  assert.equal(r.steps[3], "5 + 3 + 1 = 9");
});

test("Life Path reduces each part first and keeps master totals", () => {
  // day 29 -> 11, month 11, year 1985 -> 23 -> 5; 11 + 11 + 5 = 27 -> 9
  assert.equal(lifePath("1985-11-29").value, 9);
  // day 2, month 9, year 1999 -> 28 -> 10 -> 1; 2 + 9 + 1 = 12 -> 3
  assert.equal(lifePath("1999-09-02").value, 3);
  // day 9, month 11, year 1991 -> 20 -> 2; 9 + 11 + 2 = 22
  assert.equal(lifePath("1991-11-09").value, 22);
});

test("name numbers", () => {
  // JOHN: J1 O6 H8 N5 = 20 -> 2
  assert.equal(expression("John").value, 2);
  assert.equal(soulUrge("John").value, 6);
  assert.equal(personality("John").value, 5); // 1 + 8 + 5 = 14 -> 5
  assert.equal(expression("Zoë").value, expression("Zoe").value);
});

test("Personal Year and Universal Year", () => {
  // 14 March in 2026: 5 + 3 + 1 = 9
  assert.equal(personalYear("1990-03-14", 2026).value, 9);
  assert.equal(universalYear(2026).value, 1);
});

test("Universal Month and Day add up the calendar date, keeping master days", () => {
  assert.equal(universalMonth(2026, 10).value, 11); // 10 + 1 = 11, kept as a master number
  assert.equal(universalMonth(2026, 3).value, 4);
  assert.equal(universalDay(2026, 10, 11).value, 4); // 1+1+1+0+2+0+2+6 = 13, then 4
  assert.equal(universalDay(2026, 10, 29).value, 22); // 2+9+1+0+2+0+2+6 = 22, a master day
});

test("Personal Day needs only the birth day and month", () => {
  // Born 14 March: Personal Year 2026 = 5 + 3 + 1 = 9; October → 9 + 10 = 19 → 1; the 26th → 1 + 26 = 27 → 9
  assert.equal(personalDay(3, 14, 2026, 10, 26).value, 9);
});
