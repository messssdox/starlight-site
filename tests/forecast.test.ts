import { test } from "node:test";
import assert from "node:assert/strict";
import { dayPillar, monthAnimal, dailyForecast, weeklyForecast, monthlyForecast, yearlyForecast, animalHours, zodiacYearAt } from "../src/lib/forecast.ts";
import { animalById } from "../src/data/zodiac.ts";

test("day animals and elements follow the 60-day cycle", () => {
  assert.equal(dayPillar("2000-01-07").animal.id, "rat"); // Jia Zi, a Wood Rat day
  assert.equal(dayPillar("2000-01-07").element, "Wood");
  assert.equal(dayPillar("2000-01-01").animal.id, "horse"); // Wu Wu, an Earth Horse day
  assert.equal(dayPillar("2000-01-01").element, "Earth");
  assert.equal(dayPillar("1949-10-01").animal.id, "rat"); // a Jia Zi day
  assert.equal(dayPillar("1949-10-01").element, "Wood");
  assert.equal(dayPillar("2000-01-08").animal.id, "ox");
});

test("month animals start with the Tiger in February", () => {
  assert.equal(monthAnimal(2).id, "tiger");
  assert.equal(monthAnimal(10).id, "dog");
  assert.equal(monthAnimal(12).id, "rat");
  assert.equal(monthAnimal(1).id, "ox");
});

test("zodiac year changes at Lunar New Year", () => {
  assert.equal(zodiacYearAt("2026-02-16"), 2025);
  assert.equal(zodiacYearAt("2026-02-17"), 2026);
});

test("animal hours", () => {
  assert.equal(animalHours(animalById("rat")), "11pm to 1am");
  assert.equal(animalHours(animalById("horse")), "11am to 1pm");
  assert.equal(animalHours(animalById("ox")), "1am to 3am");
});

test("forecasts are stable and well formed", () => {
  const a = dailyForecast("dog", "2026-10-10");
  assert.deepEqual(a, dailyForecast("dog", "2026-10-10"));
  assert.ok(a.stars >= 1 && a.stars <= 5);
  assert.equal(a.topics.length, 4);

  const w = weeklyForecast("dog", "2026-10-10");
  assert.equal(w.days.length, 7);
  assert.equal(w.days[0].date, "2026-10-05"); // the Monday
  assert.equal(w.days[6].date, "2026-10-11");

  const m = monthlyForecast("dragon", "2026-10-10");
  assert.equal(m.animal.id, "dog");
  assert.equal(m.relation, "clash");
  assert.ok(m.careDays.every((d) => dayPillar(d).animal.id === "dog"));
  assert.ok(m.careDays.length >= 2);

  const y = yearlyForecast("rat", "2026-10-10");
  assert.equal(y.animal.id, "horse");
  assert.equal(y.relation, "clash");
  assert.deepEqual(yearlyForecast("goat", "2026-10-10").relation, "secret");
  assert.equal(yearlyForecast("horse", "2026-10-10").relation, "same");
});

test("every animal gets a forecast every day of a year", () => {
  for (const id of ["rat", "ox", "tiger", "rabbit", "dragon", "snake", "horse", "goat", "monkey", "rooster", "dog", "pig"]) {
    for (let d = 1; d <= 365; d += 7) {
      const iso = new Date(Date.UTC(2027, 0, d)).toISOString().slice(0, 10);
      const f = dailyForecast(id, iso);
      assert.ok(f.headline && f.intro.every(Boolean) && f.topics.every((t) => t.text));
    }
  }
});
