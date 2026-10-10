// The birth chart: where the Sun, Moon, planets and Dark Moon Lilith were at the moment
// of birth, the Rising sign and Midheaven, the twelve houses and the aspects between planets.
// Positions come from Astronomy Engine and are tropical (the zodiac most Western sites use).

import { MakeTime, GeoVector, Ecliptic, EclipticGeoMoon, SunPosition, SiderealTime, e_tilt, type AstroTime } from "astronomy-engine";
import { SIGNS, ASPECTS, type Sign, type PointId, type PlanetId, type AspectId } from "../data/astrology.ts";

const RAD = Math.PI / 180;
const norm = (deg: number) => ((deg % 360) + 360) % 360;
const sind = (d: number) => Math.sin(d * RAD);
const cosd = (d: number) => Math.cos(d * RAD);
const tand = (d: number) => Math.tan(d * RAD);
const atan2d = (y: number, x: number) => Math.atan2(y, x) / RAD;

export const PLANET_ORDER: PlanetId[] = ["sun", "moon", "mercury", "venus", "mars", "jupiter", "saturn", "uranus", "neptune", "pluto"];
const BODY: Record<PlanetId, string> = {
  sun: "Sun", moon: "Moon", mercury: "Mercury", venus: "Venus", mars: "Mars",
  jupiter: "Jupiter", saturn: "Saturn", uranus: "Uranus", neptune: "Neptune", pluto: "Pluto",
};

export interface SignPosition {
  /** Degrees along the zodiac, 0 to 360, counted from 0° Aries. */
  lon: number;
  sign: Sign;
  /** Degrees into the sign, 0 to 30. */
  degree: number;
}

/** 103.4° → 13.4° into the fourth sign, Cancer. */
export function signOf(lon: number): SignPosition {
  const l = norm(lon);
  const i = Math.floor(l / 30);
  return { lon: l, sign: SIGNS[i], degree: l - i * 30 };
}

/** 13.4 → "13°24′" */
export function formatDegree(degree: number): string {
  let d = Math.floor(degree);
  let m = Math.round((degree - d) * 60);
  if (m === 60) { d += 1; m = 0; }
  return `${d}°${String(m).padStart(2, "0")}′`;
}

/** Where a planet appears along the zodiac as seen from Earth. */
export function longitudeOf(id: PointId, time: AstroTime): number {
  if (id === "sun") return SunPosition(time).elon;
  if (id === "moon") return EclipticGeoMoon(time).lon;
  if (id === "lilith") return meanLilith(time);
  return Ecliptic(GeoVector(BODY[id] as never, time, true)).elon;
}

/**
 * Mean Dark Moon Lilith: the average position of the Moon's apogee, the point of its
 * orbit farthest from Earth. This is the version most astrology sites use. The formula
 * is the Moon's mean perigee from Jean Meeus, Astronomical Algorithms, plus 180°.
 */
export function meanLilith(time: AstroTime): number {
  const T = time.tt / 36525;
  const perigee = 83.3532465 + 4069.0137287 * T - 0.01032 * T * T - (T * T * T) / 80053 + (T ** 4) / 18999000;
  return norm(perigee + 180);
}

export interface PointPosition extends SignPosition {
  id: PointId;
  /** Seems to move backwards from Earth's point of view. */
  retrograde: boolean;
  /** Which house it falls in, when the birth time and place are known. */
  house?: number;
}

export interface Angles {
  /** Local sidereal time in hours: the "star clock" at the birthplace. */
  lst: number;
  /** The same as an angle: how far the sky has turned, in degrees. */
  ramc: number;
  /** The tilt of Earth's axis on that day. */
  obliquity: number;
  asc: SignPosition;
  mc: SignPosition;
}

/** The Ascendant (Rising) and Midheaven for a moment and place. Longitude is east-positive. */
export function anglesAt(time: AstroTime, lat: number, lon: number): Angles {
  const lst = (((SiderealTime(time) + lon / 15) % 24) + 24) % 24;
  const ramc = lst * 15;
  const eps = e_tilt(time).tobl;
  const mc = norm(atan2d(sind(ramc), cosd(ramc) * cosd(eps)));
  const asc = norm(atan2d(cosd(ramc), -(sind(ramc) * cosd(eps) + tand(lat) * sind(eps))));
  return { lst, ramc, obliquity: eps, asc: signOf(asc), mc: signOf(mc) };
}

export type HouseSystem = "placidus" | "equal";

/**
 * House cusps 1 to 12. Placidus is the system most Western astrologers use: it splits
 * the time each degree takes to travel from the horizon to the top of the sky into thirds.
 * Near the poles some degrees never rise or set, so there we fall back to Equal houses:
 * twelve 30° slices starting at the Rising sign.
 */
export function houseCusps(a: Angles, lat: number): { system: HouseSystem; cusps: number[] } {
  const eps = a.obliquity;
  const asc = a.asc.lon;
  const mc = a.mc.lon;
  const equal = () => ({ system: "equal" as const, cusps: Array.from({ length: 12 }, (_, i) => norm(asc + i * 30)) });
  if (Math.abs(lat) >= 66) return equal();

  // Find the ecliptic degree whose right ascension sits a fraction of its own semi-arc
  // past the Midheaven (above the horizon) or short of the bottom of the chart (below).
  const cusp = (fraction: number, above: boolean): number | null => {
    let lambda = norm(mc + (above ? fraction * 90 : 180 - fraction * 90));
    for (let i = 0; i < 50; i++) {
      const dec = Math.asin(sind(eps) * sind(lambda)) / RAD;
      const x = -tand(lat) * tand(dec);
      if (x < -1 || x > 1) return null;
      const dayArc = Math.acos(x) / RAD;
      const ra = above ? a.ramc + fraction * dayArc : a.ramc + 180 - fraction * (180 - dayArc);
      const next = norm(atan2d(sind(ra), cosd(ra) * cosd(eps)));
      if (Math.abs(((next - lambda + 540) % 360) - 180) < 1e-7) return next;
      lambda = next;
    }
    return lambda;
  };
  const c11 = cusp(1 / 3, true), c12 = cusp(2 / 3, true), c2 = cusp(2 / 3, false), c3 = cusp(1 / 3, false);
  if (c11 === null || c12 === null || c2 === null || c3 === null) return equal();
  const cusps = [asc, c2, c3, norm(mc + 180), norm(c11 + 180), norm(c12 + 180), norm(asc + 180), norm(c2 + 180), norm(c3 + 180), mc, c11, c12];
  return { system: "placidus", cusps };
}

/** Which house (1 to 12) a zodiac degree falls in. */
export function houseOf(lon: number, cusps: number[]): number {
  for (let i = 0; i < 12; i++) {
    const start = cusps[i];
    const span = norm(cusps[(i + 1) % 12] - start);
    if (norm(lon - start) < span) return i + 1;
  }
  return 1;
}

export interface AspectHit {
  a: PlanetId;
  b: PlanetId;
  aspect: AspectId;
  /** The actual angle between them, 0 to 180. */
  separation: number;
  /** How far from exact. */
  orb: number;
}

/** The shortest distance round the circle between two zodiac degrees, 0 to 180. */
export const separation = (x: number, y: number) => {
  const d = Math.abs(norm(x - y));
  return d > 180 ? 360 - d : d;
};

export function findAspects(points: PointPosition[]): AspectHit[] {
  const planets = points.filter((p) => p.id !== "lilith");
  const hits: AspectHit[] = [];
  for (let i = 0; i < planets.length; i++) {
    for (let j = i + 1; j < planets.length; j++) {
      const sep = separation(planets[i].lon, planets[j].lon);
      const best = ASPECTS.map((asp) => ({ asp, orb: Math.abs(sep - asp.angle) }))
        .filter((x) => x.orb <= x.asp.orb)
        .sort((x, y) => x.orb - y.orb)[0];
      if (best) hits.push({ a: planets[i].id as PlanetId, b: planets[j].id as PlanetId, aspect: best.asp.id, separation: sep, orb: best.orb });
    }
  }
  return hits.sort((x, y) => x.orb - y.orb);
}

export interface Chart {
  utc: Date;
  points: PointPosition[];
  aspects: AspectHit[];
  angles?: Angles;
  houses?: { system: HouseSystem; cusps: number[] };
}

/** The whole chart. Pass the birthplace to get the Rising sign and houses too. */
export function birthChart(utc: Date, place?: { lat: number; lon: number }): Chart {
  const time = MakeTime(utc);
  const later = MakeTime(new Date(utc.getTime() + 3600_000));
  const ids: PointId[] = [...PLANET_ORDER, "lilith"];
  const points: PointPosition[] = ids.map((id) => {
    const lon = longitudeOf(id, time);
    const moving = norm(longitudeOf(id, later) - lon);
    const retrograde = id !== "sun" && id !== "moon" && id !== "lilith" && moving > 180;
    return { id, ...signOf(lon), retrograde };
  });
  const chart: Chart = { utc, points, aspects: findAspects(points) };
  if (place) {
    chart.angles = anglesAt(time, place.lat, place.lon);
    chart.houses = houseCusps(chart.angles, place.lat);
    for (const p of points) p.house = houseOf(p.lon, chart.houses.cusps);
  }
  return chart;
}

/**
 * Without a birth time, check the whole day: a fast planet (usually the Moon) can change
 * sign during it. Returns each planet whose sign depends on the hour, with both signs
 * and the moment it changed (to the minute).
 */
export function signChangesDuring(startUtc: Date, endUtc: Date): { id: PointId; from: Sign; to: Sign; at: Date }[] {
  const signAt = (id: PointId, ms: number) => signOf(longitudeOf(id, MakeTime(new Date(ms)))).sign;
  const out: { id: PointId; from: Sign; to: Sign; at: Date }[] = [];
  for (const id of [...PLANET_ORDER, "lilith"] as PointId[]) {
    const from = signAt(id, startUtc.getTime()), to = signAt(id, endUtc.getTime());
    if (from.id === to.id) continue;
    let lo = startUtc.getTime(), hi = endUtc.getTime();
    while (hi - lo > 60_000) {
      const mid = (lo + hi) / 2;
      if (signAt(id, mid).id === from.id) lo = mid; else hi = mid;
    }
    out.push({ id, from, to, at: new Date(hi) });
  }
  return out;
}

/** How many planets fall in each element and each modality (the Sun to Pluto). */
export function balance(points: PointPosition[]) {
  const elements: Record<string, PointId[]> = { Fire: [], Earth: [], Air: [], Water: [] };
  const modalities: Record<string, PointId[]> = { Cardinal: [], Fixed: [], Mutable: [] };
  for (const p of points) {
    if (p.id === "lilith") continue;
    elements[p.sign.element].push(p.id);
    modalities[p.sign.modality].push(p.id);
  }
  return { elements, modalities };
}

// --- Birth time and time zones ------------------------------------------------------

/** How many minutes a time zone was ahead of UTC at a given instant (it changes with daylight saving). */
export function zoneOffsetMinutes(utcMs: number, timeZone: string): number {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone, hourCycle: "h23", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", second: "2-digit",
  }).formatToParts(new Date(utcMs));
  const get = (t: string) => Number(parts.find((p) => p.type === t)!.value);
  const asUtc = Date.UTC(get("year"), get("month") - 1, get("day"), get("hour"), get("minute"), get("second"));
  return Math.round((asUtc - Math.floor(utcMs / 1000) * 1000) / 60000);
}

/** A local clock time in a named time zone ("Europe/London") as a UTC instant. */
export function localToUtc(date: string, time: string, timeZone: string): { utc: Date; offsetMinutes: number } {
  const [y, m, d] = date.split("-").map(Number);
  const [hh, mm] = time.split(":").map(Number);
  const wall = Date.UTC(y, m - 1, d, hh, mm);
  let offset = zoneOffsetMinutes(wall, timeZone);
  const second = zoneOffsetMinutes(wall - offset * 60000, timeZone);
  if (second !== offset) offset = second;
  return { utc: new Date(wall - offset * 60000), offsetMinutes: offset };
}

/** +60 → "UTC+1", -330 → "UTC-5:30", 0 → "UTC" */
export function formatOffset(minutes: number): string {
  if (minutes === 0) return "UTC";
  const sign = minutes > 0 ? "+" : "-";
  const a = Math.abs(minutes);
  return `UTC${sign}${Math.floor(a / 60)}${a % 60 ? ":" + String(a % 60).padStart(2, "0") : ""}`;
}

/** Sidereal hours → "22h 16m" */
export function formatHours(h: number): string {
  let hh = Math.floor(h);
  let mm = Math.round((h - hh) * 60);
  if (mm === 60) { hh = (hh + 1) % 24; mm = 0; }
  return `${hh}h ${String(mm).padStart(2, "0")}m`;
}
