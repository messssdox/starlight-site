// The sky calendar: the notable events of the coming months, worked out in the browser from
// Astronomy Engine so the list always rolls forward from today. It covers new and full Moons,
// solar and lunar eclipses, the solstices and equinoxes, planets turning retrograde and direct,
// and planets moving into a new sign. The Moon's own sign changes (every two or three days)
// are left out because they would crowd the list.

import {
  MakeTime, SearchMoonPhase, SearchLunarEclipse, NextLunarEclipse, SearchGlobalSolarEclipse, NextGlobalSolarEclipse,
  Seasons, EclipseKind, type AstroTime,
} from "astronomy-engine";
import { longitudeOf, signOf } from "./astrology.ts";
import type { Sign, PlanetId } from "../data/astrology.ts";

export type SkyKind = "moon" | "eclipse" | "season" | "retrograde" | "ingress";

export interface SkyEvent {
  kind: SkyKind;
  at: Date;
  /** A short headline, such as "Full Moon in Aries". */
  title: string;
  /** One plain-English line on what it means. */
  note: string;
  /** A symbol to show beside it. */
  icon: string;
  /** A Library article that explains more, when there is one. */
  link?: string;
}

const DAY = 86_400_000;
const NAMES: Record<PlanetId, string> = {
  sun: "the Sun", moon: "the Moon", mercury: "Mercury", venus: "Venus", mars: "Mars",
  jupiter: "Jupiter", saturn: "Saturn", uranus: "Uranus", neptune: "Neptune", pluto: "Pluto",
};
const cap = (s: string) => s[0].toUpperCase() + s.slice(1);
const at = (t: AstroTime) => t.date;

/** The planets whose sign changes are listed (the Sun to Pluto, without the Moon). */
const INGRESS_PLANETS: PlanetId[] = ["sun", "mercury", "venus", "mars", "jupiter", "saturn", "uranus", "neptune", "pluto"];
/** The planets that can turn retrograde. */
const RETRO_PLANETS: PlanetId[] = ["mercury", "venus", "mars", "jupiter", "saturn", "uranus", "neptune", "pluto"];

const INGRESS_NOTES: Record<PlanetId, string> = {
  sun: "A new star-sign season begins.",
  moon: "",
  mercury: "Thinking, talking and travel take on this sign's style.",
  venus: "Love, money and pleasure take on this sign's style.",
  mars: "Drive and energy take on this sign's style.",
  jupiter: "A year-long theme of growth and luck shifts here.",
  saturn: "A few years' lesson in hard work and limits shifts here.",
  uranus: "A generation-long theme of change shifts here.",
  neptune: "A generation-long theme of dreams and ideals shifts here.",
  pluto: "A generation-long theme of deep change shifts here.",
};
const RETRO_NOTES: Partial<Record<PlanetId, [string, string]>> = {
  mercury: ["A time to slow down, double-check plans and revisit old ideas.", "Plans and messages flow more easily again."],
  venus: ["A time to rethink love, money and what you value.", "Love and money matters move forward again."],
  mars: ["Energy turns inward; review before you push ahead.", "Drive and momentum return."],
};
const RETRO_DEFAULT: [string, string] = ["A slower, reflective phase for this planet's themes.", "This planet's themes move forward again."];

/** Traditional full Moon names by month; the Harvest and Hunter's Moons are worked out from the equinox. */
const MOON_NAMES = ["Wolf", "Snow", "Worm", "Pink", "Flower", "Strawberry", "Buck", "Sturgeon", "Corn", "Hunter's", "Beaver", "Cold"];

function moonPhases(start: Date, end: Date): SkyEvent[] {
  const out: SkyEvent[] = [];
  for (const [phase, full] of [[0, false], [180, true]] as const) {
    let t: AstroTime | null = MakeTime(start);
    while (t) {
      const found: AstroTime | null = SearchMoonPhase(phase, t, 40);
      if (!found || found.date >= end) break;
      const sign = signOf(longitudeOf("moon", found)).sign;
      out.push(full
        ? { kind: "moon", at: at(found), icon: "○", title: `Full Moon in ${sign.name}`, note: "A time when things come to a head: finish, celebrate and let go.", link: "/library/events/full-moon-names" }
        : { kind: "moon", at: at(found), icon: "●", title: `New Moon in ${sign.name}`, note: "A fresh start: a good moment to set intentions.", link: "/library/moon-sky/moon-phases" });
      t = found.AddDays(1);
    }
  }
  nameFullMoons(out.filter((e) => e.title.startsWith("Full")), start, end);
  return out;
}

/** Adds the traditional name, such as "the Hunter's Moon", to each full Moon. */
function nameFullMoons(fulls: SkyEvent[], start: Date, end: Date) {
  // The Harvest Moon is the full Moon nearest the September equinox, and the Hunter's Moon follows it.
  // When the Harvest Moon falls in early October, the September full Moon is the Corn Moon.
  const harvest = new Set<SkyEvent>();
  for (let y = start.getUTCFullYear(); y <= end.getUTCFullYear(); y++) {
    const eq = Seasons(y).sep_equinox.date.getTime();
    const near = fulls.filter((f) => Math.abs(f.at.getTime() - eq) < 20 * DAY);
    near.sort((a, b) => Math.abs(a.at.getTime() - eq) - Math.abs(b.at.getTime() - eq));
    if (near[0]) harvest.add(near[0]);
  }
  fulls.forEach((f, i) => {
    let name = MOON_NAMES[f.at.getUTCMonth()];
    if (harvest.has(f)) name = "Harvest";
    else if (i > 0 && harvest.has(fulls[i - 1])) name = "Hunter's";
    f.title += ` · the ${name} Moon`;
  });
}

function eclipses(start: Date, end: Date): SkyEvent[] {
  const out: SkyEvent[] = [];
  for (let e = SearchLunarEclipse(start); e.peak.date < end; e = NextLunarEclipse(e.peak)) {
    const kind = e.kind === EclipseKind.Total ? "Total" : e.kind === EclipseKind.Partial ? "Partial" : "Penumbral";
    const sign = signOf(longitudeOf("moon", e.peak)).sign;
    out.push({ kind: "eclipse", at: at(e.peak), icon: "◐", title: `${kind} lunar eclipse in ${sign.name}`,
      note: "A powerful full Moon: endings and revelations, often over the following months.", link: "/library/moon-sky/eclipses" });
  }
  for (let e = SearchGlobalSolarEclipse(start); e.peak.date < end; e = NextGlobalSolarEclipse(e.peak)) {
    const kind = e.kind === EclipseKind.Total ? "Total" : e.kind === EclipseKind.Annular ? "Annular" : "Partial";
    const sign = signOf(longitudeOf("sun", e.peak)).sign;
    out.push({ kind: "eclipse", at: at(e.peak), icon: "◑", title: `${kind} solar eclipse in ${sign.name}`,
      note: "A powerful new Moon: a door opens for a new chapter.", link: "/library/moon-sky/eclipses" });
  }
  return out;
}

function seasons(start: Date, end: Date): SkyEvent[] {
  const out: SkyEvent[] = [];
  for (let y = start.getUTCFullYear(); y <= end.getUTCFullYear(); y++) {
    const s = Seasons(y);
    const list: [AstroTime, string, string][] = [
      [s.mar_equinox, "March equinox", "Day and night are equal; spring begins in the north. The Sun enters Aries."],
      [s.jun_solstice, "June solstice", "The longest day in the north and the shortest in the south. The Sun enters Cancer."],
      [s.sep_equinox, "September equinox", "Day and night are equal; autumn begins in the north. The Sun enters Libra."],
      [s.dec_solstice, "December solstice", "The shortest day in the north and the longest in the south. The Sun enters Capricorn."],
    ];
    for (const [t, title, note] of list) {
      if (t.date >= start && t.date < end) out.push({ kind: "season", at: at(t), icon: "☀︎", title, note, link: "/library/events/solstices-and-equinoxes" });
    }
  }
  return out;
}

/** Finds the moment, to within a minute, between lo and hi where test(ms) stops matching test(lo). */
function bisect(lo: number, hi: number, test: (ms: number) => boolean): number {
  const first = test(lo);
  while (hi - lo > 60_000) {
    const mid = (lo + hi) / 2;
    if (test(mid) === first) lo = mid; else hi = mid;
  }
  return hi;
}

const lonAt = (id: PlanetId, ms: number) => longitudeOf(id, MakeTime(new Date(ms)));
/** Daily motion along the zodiac in degrees; negative when retrograde. */
function speed(id: PlanetId, ms: number): number {
  const d = lonAt(id, ms + DAY / 4) - lonAt(id, ms - DAY / 4);
  return ((d + 540) % 360) - 180;
}

/** Sign changes and retrograde stations, found by stepping a day at a time and then narrowing to the minute. */
function planetEvents(start: Date, end: Date): SkyEvent[] {
  const out: SkyEvent[] = [];
  const s = start.getTime(), e = end.getTime();
  for (const id of INGRESS_PLANETS) {
    let prev: Sign = signOf(lonAt(id, s)).sign;
    for (let t = s + DAY; t <= e + DAY; t += DAY) {
      const now = signOf(lonAt(id, Math.min(t, e))).sign;
      if (now.id !== prev.id) {
        const when = bisect(t - DAY, Math.min(t, e), (ms) => signOf(lonAt(id, ms)).sign.id === prev.id);
        const back = speed(id, when) < 0;
        out.push({ kind: "ingress", at: new Date(when), icon: now.glyph,
          title: `${cap(NAMES[id])} ${back ? "moves back into" : "enters"} ${now.name}`,
          note: back ? "A retrograde planet returns to the sign it just left, to finish unfinished business." : INGRESS_NOTES[id] });
        prev = now;
      }
      if (t >= e) break;
    }
  }
  for (const id of RETRO_PLANETS) {
    let prevBack = speed(id, s) < 0;
    for (let t = s + DAY; t < e; t += DAY) {
      const back = speed(id, t) < 0;
      if (back !== prevBack) {
        const when = bisect(t - DAY, t, (ms) => speed(id, ms) < 0);
        const sign = signOf(lonAt(id, when)).sign;
        const [rx, direct] = RETRO_NOTES[id] ?? RETRO_DEFAULT;
        out.push({ kind: "retrograde", at: new Date(when), icon: back ? "℞" : "⟳",
          title: `${cap(NAMES[id])} ${back ? "turns retrograde" : "turns direct"} in ${sign.name}`,
          note: back ? rx : direct, link: id === "mercury" ? "/library/events/mercury-retrograde-survival-guide" : "/library/moon-sky/retrograde-planets" });
        prevBack = back;
      }
    }
  }
  return out;
}

/** Every notable event from start up to (but not including) end, in date order. */
export function skyEvents(start: Date, end: Date): SkyEvent[] {
  // An eclipse is also a new or full Moon, so the two are shown as one event with the Moon's name.
  const ecl = eclipses(start, end);
  const moons = moonPhases(start, end).filter((m) => {
    const e = ecl.find((x) => Math.abs(x.at.getTime() - m.at.getTime()) < DAY / 2);
    if (!e) return true;
    const name = m.title.split(" · ")[1];
    if (name) e.title += ` · ${name}`;
    return false;
  });
  // The solstices and equinoxes already say which sign the Sun enters.
  const planets = planetEvents(start, end).filter((p) => !/^The Sun enters (Aries|Cancer|Libra|Capricorn)$/.test(p.title));
  return [...moons, ...ecl, ...seasons(start, end), ...planets].sort((a, b) => a.at.getTime() - b.at.getTime());
}

/** The same date, `months` months later. */
export function addMonths(d: Date, months: number): Date {
  const out = new Date(d);
  out.setMonth(out.getMonth() + months);
  return out;
}

/** Which planets are retrograde at a given moment (Mercury to Pluto). */
export function retrogradeNow(when: Date): PlanetId[] {
  return RETRO_PLANETS.filter((id) => speed(id, when.getTime()) < 0);
}
