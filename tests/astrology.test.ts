import { test } from "node:test";
import assert from "node:assert/strict";
import { birthChart, signOf, formatDegree, localToUtc, formatOffset, signChangesDuring, findAspects, houseOf, type PointPosition } from "../src/lib/astrology.ts";
import { signLine } from "../src/lib/astro-explain.ts";
import { pickPlace, splitPlace } from "../src/lib/place.ts";
import { PLACEMENTS } from "../src/data/placements.ts";
import { SIGNS, PLANETS } from "../src/data/astrology.ts";

// Reference values from the Swiss Ephemeris, the library most astrology sites use.
// Planets: Sun to Pluto, then mean Lilith. Houses: Placidus cusps 1 to 12.
const CASES = [
  { utc: Date.UTC(1879, 2, 14, 10, 50), lat: 48.4, lon: 10.0,
    planets: [353.51, 254.53, 3.14, 16.99, 296.91, 327.48, 4.19, 151.29, 37.87, 54.73], lilith: 27.98,
    cusps: [101.65, 118.62, 137.81, 162.84, 198.33, 243.11, 281.65, 298.62, 317.81, 342.84, 18.33, 63.11] },
  { utc: Date.UTC(1990, 6, 1, 11, 0), lat: 53.48, lon: -2.24,
    planets: [99.36, 206.5, 97.81, 67.65, 22.34, 109.4, 292.99, 277.53, 283.3, 225.13], lilith: 236.74,
    cusps: [174.5, 197.21, 226.47, 262.65, 299.76, 330.4, 354.5, 17.21, 46.47, 82.65, 119.76, 150.4] },
  { utc: Date.UTC(2001, 11, 25, 3, 30), lat: -33.87, lon: 151.21,
    planets: [273.4, 28.61, 284.79, 268.54, 341.86, 101.59, 69.79, 322.15, 307.21, 255.79], lilith: 343.92,
    cusps: [23.07, 51.4, 82.51, 115.46, 148.02, 177.65, 203.07, 231.4, 262.51, 295.46, 328.02, 357.65] },
  { utc: Date.UTC(1965, 1, 20, 22, 15), lat: 40.71, lon: -74.01,
    planets: [332.08, 215.67, 329.44, 319.51, 174.65, 48.9, 336.92, 163.27, 230.01, 165.37], lilith: 284.8,
    cusps: [148.7, 171.6, 199.66, 232.77, 267.86, 300.39, 328.7, 351.6, 19.66, 52.77, 87.86, 120.39] },
];
const near = (a: number, b: number, tol: number, what: string) => {
  const d = Math.abs(((a - b + 540) % 360) - 180);
  assert.ok(d <= tol, `${what}: got ${a.toFixed(3)}, expected ${b} (off by ${d.toFixed(3)}°)`);
};

test("planets, Lilith, Rising and Placidus houses match the Swiss Ephemeris", () => {
  for (const c of CASES) {
    const chart = birthChart(new Date(c.utc), { lat: c.lat, lon: c.lon });
    c.planets.forEach((lon, i) => near(chart.points[i].lon, lon, 0.02, `${new Date(c.utc).toISOString()} ${chart.points[i].id}`));
    near(chart.points[10].lon, c.lilith, 0.15, "lilith"); // Meeus's mean formula, within a few arcminutes
    assert.equal(chart.houses!.system, "placidus");
    c.cusps.forEach((cusp, i) => near(chart.houses!.cusps[i], cusp, 0.02, `house ${i + 1}`));
    near(chart.angles!.asc.lon, c.cusps[0], 0.02, "ascendant");
    near(chart.angles!.mc.lon, c.cusps[9], 0.02, "midheaven");
  }
});

test("Einstein's chart: Sun in Pisces, Moon in Sagittarius, Cancer rising, Uranus retrograde", () => {
  const chart = birthChart(new Date(CASES[0].utc), { lat: 48.4, lon: 10 });
  const by = Object.fromEntries(chart.points.map((p) => [p.id, p]));
  assert.equal(by.sun.sign.name, "Pisces");
  assert.equal(by.moon.sign.name, "Sagittarius");
  assert.equal(chart.angles!.asc.sign.name, "Cancer");
  assert.equal(by.uranus.retrograde, true);
  assert.equal(by.mars.retrograde, false);
  assert.equal(by.sun.house, 10);
});

test("signs are 30° slices starting at Aries", () => {
  assert.equal(signOf(0).sign.name, "Aries");
  assert.equal(signOf(103.4).sign.name, "Cancer");
  assert.equal(formatDegree(signOf(103.4).degree), "13°24′");
  assert.equal(signOf(359.99).sign.name, "Pisces");
  assert.equal(signOf(-10).sign.name, "Pisces");
  assert.equal(formatDegree(29.999), "30°00′");
});

test("the working spells out the sign maths", () => {
  assert.equal(signLine("Mars", 103.4), "Mars was 103.4° along the zodiac. Take away 3 whole signs of 30° (Aries, Taurus, Gemini) and 13.4° is left, so it is in Cancer: 13°24′ Cancer.");
  assert.match(signLine("Venus", 12), /first 30°, so it is in Aries/);
});

test("local birth times become UTC, including summer time", () => {
  assert.equal(localToUtc("1990-07-01", "12:00", "Europe/London").utc.toISOString(), "1990-07-01T11:00:00.000Z");
  assert.equal(localToUtc("1990-01-01", "12:00", "Europe/London").utc.toISOString(), "1990-01-01T12:00:00.000Z");
  assert.equal(localToUtc("2001-12-25", "14:30", "Australia/Sydney").utc.toISOString(), "2001-12-25T03:30:00.000Z");
  assert.equal(localToUtc("1965-02-20", "17:15", "America/New_York").offsetMinutes, -300);
  assert.equal(formatOffset(60), "UTC+1");
  assert.equal(formatOffset(-330), "UTC-5:30");
  assert.equal(formatOffset(0), "UTC");
});

test("without a birth time, a Moon that changes sign that day is flagged", () => {
  // the Moon moved from Scorpio into Sagittarius on 2 January 2000
  const changes = signChangesDuring(new Date(Date.UTC(2000, 0, 2, 0, 0)), new Date(Date.UTC(2000, 0, 2, 23, 59)));
  const moon = changes.find((c) => c.id === "moon");
  assert.ok(moon);
  assert.equal(moon!.from.name, "Scorpio");
  assert.equal(moon!.to.name, "Sagittarius");
  // and the hour it happened, to the minute (the Swiss Ephemeris gives 21:32 UTC)
  assert.equal(moon!.at.toISOString().slice(11, 16), "21:32");
});

test("aspects pick the nearest angle within its orb", () => {
  const p = (id: string, lon: number) => ({ id, lon }) as PointPosition;
  // Sun-Moon 120° exactly; Sun-Mars 186°, 6° from an opposition; Moon-Mars 66°, too far from a sextile (5°)
  const hits = findAspects([p("sun", 10), p("moon", 130), p("mars", 196), p("lilith", 10)]);
  assert.deepEqual(hits.map((h) => `${h.a}-${h.aspect}-${h.b}`), ["sun-trine-moon", "sun-opposition-mars"]);
});

test("houses wrap round 0° Aries", () => {
  const cusps = [350, 20, 50, 80, 110, 140, 170, 200, 230, 260, 290, 320];
  assert.equal(houseOf(355, cusps), 1);
  assert.equal(houseOf(5, cusps), 1);
  assert.equal(houseOf(21, cusps), 2);
  assert.equal(houseOf(345, cusps), 12);
});

test("near the poles, houses fall back to Equal", () => {
  const chart = birthChart(new Date(Date.UTC(1990, 5, 21, 12)), { lat: 69.65, lon: 18.96 });
  assert.equal(chart.houses!.system, "equal");
  assert.equal(Math.round(chart.houses!.cusps[1] - chart.houses!.cusps[0] + 360) % 360, 30);
});

test("every planet, Lilith and the Rising sign has a meaning for every sign", () => {
  for (const id of [...PLANETS.map((p) => p.id), "rising"] as const) {
    for (const s of SIGNS) {
      const m = PLACEMENTS[id][s.id];
      assert.ok(m?.glance && m.text.length > 80, `${id} in ${s.name}`);
    }
  }
});

test("birthplaces: the country narrows the match", () => {
  assert.deepEqual(splitPlace(" Manchester , US "), { town: "Manchester", hints: ["us"] });
  const hits = [
    { name: "Manchester", latitude: 53.48, longitude: -2.24, timezone: "Europe/London", country: "United Kingdom", country_code: "GB", admin1: "England" },
    { name: "Manchester", latitude: 42.99, longitude: -71.45, timezone: "America/New_York", country: "United States", country_code: "US", admin1: "New Hampshire" },
  ];
  assert.equal(pickPlace(hits, [])!.timeZone, "Europe/London");
  assert.equal(pickPlace(hits, ["us"])!.timeZone, "America/New_York");
  assert.equal(pickPlace(hits, ["new hampshire"])!.label, "Manchester, New Hampshire, United States");
  assert.equal(pickPlace(hits, ["uk"])!.label, "Manchester, England, United Kingdom");
  assert.equal(pickPlace([], []), null);
});
