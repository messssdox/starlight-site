import { test } from "node:test";
import assert from "node:assert/strict";
import { skyEvents, retrogradeNow } from "../src/lib/sky-events.ts";

// Reference dates from NASA's eclipse catalogue and published ephemerides (UTC).
const events = skyEvents(new Date(Date.UTC(2026, 9, 10)), new Date(Date.UTC(2027, 9, 10)));
const find = (title: string) => events.find((e) => e.title.startsWith(title));
const sameDay = (d: Date | undefined, y: number, m: number, day: number, what: string) =>
  assert.ok(d && Math.abs(d.getTime() - Date.UTC(y, m - 1, day, 12)) < 36 * 3_600_000, `${what}: got ${d?.toISOString()}`);

test("eclipses land on the right days", () => {
  sameDay(find("Annular solar eclipse in Aquarius")?.at, 2027, 2, 6, "annular solar eclipse");
  sameDay(find("Total solar eclipse in Leo")?.at, 2027, 8, 2, "total solar eclipse");
  sameDay(find("Penumbral lunar eclipse in Virgo")?.at, 2027, 2, 20, "lunar eclipse");
});

test("Mercury's retrograde and the seasons are found", () => {
  sameDay(find("Mercury turns retrograde in Scorpio")?.at, 2026, 10, 24, "Mercury retrograde");
  sameDay(find("Mercury turns direct in Scorpio")?.at, 2026, 11, 13, "Mercury direct");
  sameDay(find("December solstice")?.at, 2026, 12, 21, "solstice");
  sameDay(find("Jupiter enters Virgo")?.at, 2027, 7, 26, "Jupiter ingress");
});

test("an eclipse replaces its full Moon, and the list is in date order", () => {
  assert.ok(!events.some((e) => e.title.startsWith("Full Moon in Virgo") && e.at.getUTCMonth() === 1));
  assert.match(find("Penumbral lunar eclipse in Virgo")!.title, /Snow Moon/);
  for (let i = 1; i < events.length; i++) assert.ok(events[i].at >= events[i - 1].at);
  assert.equal(events.filter((e) => e.title.startsWith("Full Moon")).length + 3, 12); // 12 full Moons, 3 of them eclipses
});

test("Venus is retrograde on 10 October 2026, and Mercury is not", () => {
  const rx = retrogradeNow(new Date(Date.UTC(2026, 9, 10)));
  assert.ok(rx.includes("venus") && rx.includes("saturn"));
  assert.ok(!rx.includes("mercury") && !rx.includes("mars"));
});

test("every entry explains what it means, and retrogrades say when they end", () => {
  for (const e of events) assert.ok(e.detail.length > 0 && e.detail.every((d) => d.p.length > 20), `${e.title} has no detail`);
  const rx = find("Mercury turns retrograde in Scorpio")!;
  sameDay(rx.until, 2026, 11, 13, "Mercury retrograde ends");
  assert.equal(rx.untilLabel, "Retrograde until");
  assert.ok(rx.detail.some((d) => d.h === "Go easy on"));
  const sun = find("The Sun enters Scorpio")!;
  assert.equal(sun.untilLabel, "In Scorpio until");
  sameDay(sun.until, 2026, 11, 22, "Sun leaves Scorpio");
});

test("numerology dates: the 1/1 to 12/12 portals, the Lion's Gate and Starlight's birthday", () => {
  const nums = events.filter((e) => e.kind === "number");
  // From 10 October 2026 to 10 October 2027: 10/10 (launch day itself), 11/11, 12/12, then 1/1 to 9/9
  assert.equal(nums.length, 12);
  assert.ok(nums.every((e) => e.allDay && e.at.getDate() === e.at.getMonth() + 1));
  const gate = nums.find((e) => e.title.includes("Lion's Gate"))!;
  assert.equal(gate.at.getMonth(), 7);
  assert.equal(gate.until!.getDate(), 12);
  assert.ok(nums.some((e) => e.title.startsWith("11/11")));
  const later = skyEvents(new Date(2027, 9, 1), new Date(2027, 10, 1));
  assert.ok(later.some((e) => e.title === "10/10 · Starlight's first birthday"));
});
