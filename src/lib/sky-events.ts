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
import { SIGNS, type Sign, type PlanetId } from "../data/astrology.ts";
import { NUMBER_MEANINGS, PERSONAL_YEAR_THEMES } from "../data/numbers.ts";
import { universalYear } from "./numerology.ts";
import {
  PLANET_THEMES, SIGN_STAY, SIGN_STYLE, SIGN_AREA, NEW_MOON_IDEAS, RETRO, RETRO_INTRO, STATION_NOTE,
  NEW_MOON_INTRO, NUMBER_DATES, PORTAL_WHY, PLANET_SHORT, STARLIGHT_BIRTHDAY, FULL_MOON_INTRO, SOLAR_ECLIPSE_INTRO, LUNAR_ECLIPSE_INTRO, ECLIPSE_KIND, SEASON_DETAIL,
} from "../data/sky-meanings.ts";

export type SkyKind = "moon" | "eclipse" | "season" | "retrograde" | "ingress" | "number";

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
  /** The longer "What this means" text: paragraphs, some with a short heading such as "Good for". */
  detail: { h?: string; p: string }[];
  /** The planet involved, for sign changes and retrogrades. */
  planet?: PlanetId;
  /** When this phase ends (the next sign change, or the planet turning direct), if it is within the list. */
  until?: Date;
  /** What `until` marks, such as "In Scorpio until" or "Retrograde until". */
  untilLabel?: string;
  /** For retrogrades: true when the planet moves forward again, false when it starts going backwards. */
  direct?: boolean;
  /** A whole-day event (the numerology dates), shown without a time. */
  allDay?: boolean;
  /** A lesser numerology date: shown under the "Numerology dates" filter but not under "Everything". */
  minor?: boolean;
}

const opposite = (sign: Sign) => SIGNS[(SIGNS.indexOf(sign) + 6) % 12];

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

/** Plain-English headlines for a planet going retrograde and moving forward again. */
const RETRO_HEADLINES: Partial<Record<PlanetId, [string, string]>> = {
  mercury: ["slow down and double-check", "communication and plans get easier"],
  venus: ["time to rethink love and money", "love and money move forward"],
  mars: ["energy turns inward", "drive and momentum return"],
  jupiter: ["growth turns inward", "growth and opportunity pick up"],
  saturn: ["time to review your commitments", "hard work starts to pay off again"],
  uranus: ["change happens on the inside", "change and breakthroughs speed up"],
  neptune: ["dreams come into focus", "dreams and intuition flow outward again"],
  pluto: ["deep change works below the surface", "deep change comes out into the open"],
};

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
        ? { kind: "moon", at: at(found), icon: "○", title: `Full Moon in ${sign.name}`, note: `The Moon is fully lit and feelings run high. What began around the last New Moon comes to a head, especially around ${SIGN_AREA[sign.id]}: a time to finish, celebrate and let go.`, link: "/library/events/full-moon-names", detail: fullMoonDetail(sign) }
        : { kind: "moon", at: at(found), icon: "●", title: `New Moon in ${sign.name}`, note: `The Moon is dark and a new cycle begins. Plans and wishes started now, especially around ${SIGN_AREA[sign.id]}, have the next two weeks to grow.`, link: "/library/moon-sky/moon-phases", detail: newMoonDetail(sign) });
      t = found.AddDays(1);
    }
  }
  nameFullMoons(out.filter((e) => e.title.startsWith("Full")), start, end);
  return out;
}

function newMoonDetail(sign: Sign) {
  return [
    { p: NEW_MOON_INTRO },
    { h: `In ${sign.name}`, p: `The fresh start falls in the area of ${SIGN_AREA[sign.id]}, with ${sign.name}'s ${SIGN_STYLE[sign.id]} mood.` },
    { h: "Intentions to set", p: `${NEW_MOON_IDEAS[sign.id][0].toUpperCase()}${NEW_MOON_IDEAS[sign.id].slice(1)}. Write them down within a day or two, then watch how they grow by the Full Moon about two weeks later.` },
  ];
}

function fullMoonDetail(sign: Sign) {
  const sun = opposite(sign);
  return [
    { p: FULL_MOON_INTRO },
    { h: `In ${sign.name}`, p: `With the Moon in ${sign.name} and the Sun opposite in ${sun.name}, it lights up a balancing act between ${SIGN_AREA[sign.id]} (${sign.name}) and ${SIGN_AREA[sun.id]} (${sun.name}).` },
    { h: "Good for", p: "Celebrating how far you have come, finishing things off, and letting go of what you no longer need. Sleep can be lighter and moods bigger, so be gentle with yourself and others." },
  ];
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
      note: `Earth's shadow falls across the Full Moon${kind === "Total" ? " and it can turn a coppery red" : kind === "Partial" ? " and darkens part of it" : " and dims it slightly"}. Astrologers read it as a powerful ending: something around ${SIGN_AREA[sign.id]} wraps up or comes into the open over the following months.`, link: "/library/moon-sky/eclipses",
      detail: [
        { p: LUNAR_ECLIPSE_INTRO },
        { p: ECLIPSE_KIND[`${kind} lunar`] },
        { h: `In ${sign.name}`, p: `The turning point centres on ${SIGN_AREA[sign.id]}. Something here may reach a natural end or come into the open.` },
        { h: "Good for", p: "Letting go and taking stock. Feelings can be intense, so give yourself room and avoid big reactions in the moment." },
      ] });
  }
  for (let e = SearchGlobalSolarEclipse(start); e.peak.date < end; e = NextGlobalSolarEclipse(e.peak)) {
    const kind = e.kind === EclipseKind.Total ? "Total" : e.kind === EclipseKind.Annular ? "Annular" : "Partial";
    const sign = signOf(longitudeOf("sun", e.peak)).sign;
    out.push({ kind: "eclipse", at: at(e.peak), icon: "◑", title: `${kind} solar eclipse in ${sign.name}`,
      note: `The Moon passes in front of the Sun${kind === "Total" ? " and blocks it completely where the shadow falls" : kind === "Annular" ? ", leaving a ring of fire where the shadow falls" : " and covers part of it"}. Astrologers read it as a powerful new start: a door opens around ${SIGN_AREA[sign.id]}, often unexpectedly.`, link: "/library/moon-sky/eclipses",
      detail: [
        { p: SOLAR_ECLIPSE_INTRO },
        { p: ECLIPSE_KIND[`${kind} solar`] },
        { h: `In ${sign.name}`, p: `The new chapter opens around ${SIGN_AREA[sign.id]}.` },
        { h: "Good for", p: "Noticing which doors open. Tradition says not to force big plans on the day itself: let things settle, then act in the days after." },
      ] });
  }
  return out;
}

function seasons(start: Date, end: Date): SkyEvent[] {
  const out: SkyEvent[] = [];
  for (let y = start.getUTCFullYear(); y <= end.getUTCFullYear(); y++) {
    const s = Seasons(y);
    const list: [AstroTime, string, string][] = [
      [s.mar_equinox, "March equinox", "Day and night are equal; spring begins in the north. The Sun enters Aries, the astrological new year: a natural time for fresh starts."],
      [s.jun_solstice, "June solstice", "The longest day in the north and the shortest in the south. The Sun enters Cancer: a time to celebrate the light and focus on home and family."],
      [s.sep_equinox, "September equinox", "Day and night are equal; autumn begins in the north. The Sun enters Libra: a time for balance, gratitude and relationships."],
      [s.dec_solstice, "December solstice", "The shortest day in the north and the longest in the south. From here the light returns. The Sun enters Capricorn: a time to rest, reflect and plan ahead."],
    ];
    for (const [t, title, note] of list) {
      if (t.date >= start && t.date < end) out.push({ kind: "season", at: at(t), icon: "☀︎", title, note, link: "/library/events/solstices-and-equinoxes", detail: [{ p: SEASON_DETAIL[title] }] });
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

function ingressDetail(id: PlanetId, from: Sign, to: Sign, back: boolean) {
  const name = cap(NAMES[id]);
  const out: { h?: string; p: string }[] = [
    { p: `${name} rules ${PLANET_THEMES[id]}. While it travels through ${to.name}, these take on a ${to.name} style: ${SIGN_STYLE[to.id]}.` },
  ];
  if (id === "sun") out[0] = { p: `${to.name} season begins. The Sun is your core self and energy, so for the next month everyone feels a little of ${to.name}'s mood: ${SIGN_STYLE[to.id]}.` };
  if (back) out.push({ p: `${name} is retrograde, so it has slipped back out of ${from.name} into ${to.name} for a while. It is a chance to finish business from its last visit here before it moves on for good.` });
  out.push({ h: "Where you may notice it", p: `In matters of ${SIGN_AREA[to.id]}. If you are a ${to.name} Sun or Rising, it is passing through your own sign, so its themes feel especially personal.` });
  out.push({ h: "How long", p: `${name} usually stays in a sign for ${SIGN_STAY[id]}.` });
  return out;
}

function retroDetail(id: PlanetId, sign: Sign, back: boolean) {
  const r = RETRO[id]!;
  const name = cap(NAMES[id]);
  if (!back) return [
    { p: `${name} has finished its retrograde: it stops seeming to drift backwards across the sky and moves forward again (astrologers say it "turns direct"). ${STATION_NOTE}` },
    { h: "What changes", p: r.direct },
    { p: `${name} rules ${PLANET_THEMES[id]}.` },
  ];
  return [
    { p: RETRO_INTRO },
    { p: `${name} rules ${PLANET_THEMES[id]}. ${r.rhythm}` },
    { h: "How it tends to feel", p: r.feels },
    { h: "Good for", p: r.goodFor },
    { h: "Go easy on", p: r.goEasy },
    { h: `In ${sign.name}`, p: `The review centres on ${SIGN_AREA[sign.id]}.` },
  ];
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
        out.push({ kind: "ingress", at: new Date(when), icon: now.glyph, planet: id,
          title: `${cap(NAMES[id])} ${back ? "moves back into" : "enters"} ${now.name}`,
          note: back
            ? `${cap(NAMES[id])} slips back into ${now.name} for a while to finish business there, so matters of ${SIGN_AREA[now.id]} come up again.`
            : id === "sun" ? `${now.name} season begins. For about a month everyone feels a little of its mood: ${SIGN_STYLE[now.id]}.`
            : `For ${SIGN_STAY[id].split(",")[0]}, ${PLANET_SHORT[id]} turn towards ${SIGN_AREA[now.id]}.`,
          detail: ingressDetail(id, prev, now, back) });
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
        const [slow, forward] = RETRO_HEADLINES[id]!;
        out.push({ kind: "retrograde", at: new Date(when), icon: back ? "℞" : "⟳", planet: id, detail: retroDetail(id, sign, back),
          title: back ? `${cap(NAMES[id])} goes retrograde: ${slow}` : `${cap(NAMES[id])} moves forward again: ${forward}`,
          note: back ? `${RETRO[id]!.feels} In ${sign.name}, it centres on ${SIGN_AREA[sign.id]}.` : `${RETRO[id]!.direct}`, direct: !back, link: id === "mercury" ? "/library/events/mercury-retrograde-survival-guide" : "/library/moon-sky/retrograde-planets" });
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
  // How long each sign visit and each retrograde lasts, when its end falls within the list.
  for (const p of planets) {
    const next = planets.find((q) => q.planet === p.planet && q.kind === p.kind && q.at > p.at);
    if (p.kind === "ingress" && next) { p.until = next.at; p.untilLabel = `In ${p.title.split(" ").pop()} until`; }
    if (p.kind === "retrograde" && !p.direct && next) { p.until = next.at; p.untilLabel = "Retrograde until"; }
  }
  return [...moons, ...ecl, ...seasons(start, end), ...planets, ...numberDates(start, end)].sort((a, b) => a.at.getTime() - b.at.getTime());
}

/** Starlight went live on 10 October 2026. */
const LAUNCH_YEAR = 2026;
const ORDINAL = ["", "first", "second", "third", "fourth", "fifth", "sixth", "seventh", "eighth", "ninth", "tenth"];

/**
 * The numerology dates: the repeating "portal" dates 1/1 to 12/12, the master-number dates
 * (22/2, 22/11, 29/11) and the mirror dates (11/1, 1/11), written day/month as in the UK.
 * The six best known (1/1, 22/2, 8/8, 10/10, 11/11, 12/12) are headline dates, shown
 * everywhere; the rest appear under the "Numerology dates" filter. They are whole days in
 * the visitor's own time zone, starting at local midnight, and today's date is included.
 */
function numberDates(start: Date, end: Date): SkyEvent[] {
  const out: SkyEvent[] = [];
  const today = new Date(start.getFullYear(), start.getMonth(), start.getDate());
  for (let y = start.getFullYear(); y <= end.getFullYear(); y++) {
    for (const [key, p] of Object.entries(NUMBER_DATES)) {
      const [d, m] = key.split("/").map(Number);
      const at = new Date(y, m - 1, d);
      if (at < today || at >= end) continue;
      const ev: SkyEvent = {
        kind: "number", at, allDay: true, minor: !p.headline, icon: "✧", title: `${key} · ${p.name}`, note: p.note,
        detail: [...p.detail.map((x) => ({ ...x })), { ...PORTAL_WHY }], link: "/numerology",
      };
      if (key === "1/1") {
        const uy = universalYear(y);
        ev.title = `1/1 · Universal Year ${uy.value} begins`;
        ev.note = `${y} adds up to ${uy.value}: ${NUMBER_MEANINGS[uy.value].keyword}.`;
        ev.detail = [{ p: `${y} is a Universal Year ${uy.value} (${uy.steps.join(", then ")}). ${PERSONAL_YEAR_THEMES[uy.value]}` }, ...ev.detail];
      }
      if (key === "8/8") { ev.until = new Date(y, 7, 12); ev.untilLabel = "The Lion's Gate stays open until"; }
      if (key === "10/10" && y > LAUNCH_YEAR) {
        const age = y - LAUNCH_YEAR;
        ev.title = `10/10 · Starlight's ${ORDINAL[age] ?? `${age}th`} birthday`;
        ev.icon = "✦";
        ev.note = STARLIGHT_BIRTHDAY;
      }
      out.push(ev);
    }
  }
  return out;
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
