// Two birth charts side by side: the Sun, Moon, Mercury, Venus and Mars of each person,
// and how their signs meet. Used by the relationship reading.

import { birthChart, localToUtc, signChangesDuring } from "./astrology.ts";
import { SIGNS, type Sign } from "../data/astrology.ts";
import { LINK_BY_DISTANCE, LINK_FEEL, type PairPlanet, type SignLink } from "../data/synastry.ts";

export const PAIR_PLANETS: PairPlanet[] = ["sun", "moon", "mercury", "venus", "mars"];

/** How two signs meet, from how far apart they sit on the zodiac. */
export function signLink(a: Sign, b: Sign): SignLink {
  const d = Math.abs(SIGNS.indexOf(a) - SIGNS.indexOf(b));
  return LINK_BY_DISTANCE[Math.min(d, 12 - d)];
}

export interface PersonalSigns {
  signs: Record<PairPlanet, Sign>;
  /** Planets whose sign changed during the birth day, when no birth time is known. */
  unsure: Partial<Record<PairPlanet, { from: Sign; to: Sign }>>;
}

/** The five personal planets for a birth date, at the birth time if known, else midday. */
export function personalSigns(date: string, time: string, timeZone: string): PersonalSigns {
  const { utc } = localToUtc(date, time || "12:00", timeZone);
  const chart = birthChart(utc);
  const signs = Object.fromEntries(PAIR_PLANETS.map((id) => [id, chart.points.find((p) => p.id === id)!.sign])) as Record<PairPlanet, Sign>;
  const unsure: PersonalSigns["unsure"] = {};
  if (!time) {
    const changes = signChangesDuring(localToUtc(date, "00:00", timeZone).utc, localToUtc(date, "23:59", timeZone).utc);
    for (const c of changes) if ((PAIR_PLANETS as string[]).includes(c.id)) unsure[c.id as PairPlanet] = { from: c.from, to: c.to };
  }
  return { signs, unsure };
}

export interface PlanetPair {
  planet: PairPlanet;
  mine: Sign;
  theirs: Sign;
  link: SignLink;
  feel: "easy" | "care" | "mixed";
}

export function pairUp(me: PersonalSigns, them: PersonalSigns): PlanetPair[] {
  return PAIR_PLANETS.map((planet) => {
    const link = signLink(me.signs[planet], them.signs[planet]);
    return { planet, mine: me.signs[planet], theirs: them.signs[planet], link, feel: LINK_FEEL[link] };
  });
}

/** Venus in one chart against Mars in the other. */
export function chemistryOf(venus: Sign, mars: Sign): "easy" | "magnetic" | "spark" | "slow" {
  const link = signLink(venus, mars);
  if (link === "same" || link === "trine" || link === "sextile") return "easy";
  if (link === "opposite") return "magnetic";
  if (link === "square") return "spark";
  return "slow";
}
