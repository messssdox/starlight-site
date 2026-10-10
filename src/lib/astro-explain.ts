// Plain-English working for the birth chart, using the reader's own birth details,
// in the same "how your reading was calculated" style as the numerology breakdowns.

import { SIGNS, PLANET_BY_ID, ASPECTS, HOUSES, type PointId } from "../data/astrology.ts";
import { formatDegree, formatHours, formatOffset, separation, type Chart } from "./astrology.ts";
import { formatCoords, type Place } from "./place.ts";

export interface ChartBreakdown {
  id: string;
  title: string;
  intro: string;
  steps: string[];
  result: string;
  note?: string;
  /** Library articles that go deeper, by collection id (category/slug). */
  articles: { id: string; label: string }[];
}

export interface BirthMoment {
  date: string;
  /** "14:30", or empty when the visitor did not give one. */
  time: string;
  /** The birthplace, when found. */
  place: Place | null;
  /** The time zone used, and how far ahead of UTC it was. */
  timeZone: string;
  offsetMinutes: number;
  /** True when we guessed the time zone from the visitor's device. */
  zoneFromDevice: boolean;
}

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const longDate = (iso: string) => {
  const [y, m, d] = iso.split("-").map(Number);
  return `${d} ${MONTHS[m - 1]} ${y}`;
};
const utcText = (d: Date) => `${String(d.getUTCHours()).padStart(2, "0")}:${String(d.getUTCMinutes()).padStart(2, "0")} UTC on ${longDate(d.toISOString().slice(0, 10))}`;
const name = (id: PointId) => PLANET_BY_ID[id].name;
const at = (lon: number) => {
  const i = Math.floor(lon / 30);
  return `${formatDegree(lon - i * 30)} ${SIGNS[i].name}`;
};
export const ordinal = (n: number) => `${n}${n % 10 === 1 && n !== 11 ? "st" : n % 10 === 2 && n !== 12 ? "nd" : n % 10 === 3 && n !== 13 ? "rd" : "th"}`;

/** "Mars is 103.4° along the zodiac: 3 whole signs (90°) plus 13.4°, so 13°24′ Cancer." */
export function signLine(label: string, lon: number): string {
  const whole = Math.floor(lon / 30);
  const passed = SIGNS.slice(0, whole).map((s) => s.name);
  const left = lon - whole * 30;
  const counted = whole === 0
    ? `That is within the first 30°, so it is in Aries`
    : `Take away ${whole} whole sign${whole > 1 ? "s" : ""} of 30° (${whole > 3 ? `${passed[0]} to ${passed[whole - 1]}` : passed.join(", ")}) and ${left.toFixed(1)}° is left, so it is in ${SIGNS[whole].name}`;
  return `${label} was ${lon.toFixed(1)}° along the zodiac. ${counted}: ${at(lon)}.`;
}

export function momentBreakdown(m: BirthMoment, chart: Chart): ChartBreakdown {
  const steps = [`Start with your birth date: ${longDate(m.date)}.`];
  if (m.time) steps.push(`Your birth time: ${m.time}.`);
  else steps.push(`You did not give a birth time, so we use 12:00 midday, the middle of the day. Most planets barely move in a day, so their signs are still right.`);
  if (m.place) steps.push(`Your birthplace: ${m.place.label}, at ${formatCoords(m.place.lat, m.place.lon)}, in the ${m.place.timeZone.replace(/_/g, " ")} time zone.`);
  else if (m.zoneFromDevice) steps.push(`You did not give a birthplace, so we assume you were born in the same time zone as this device (${m.timeZone.replace(/_/g, " ")}).`);
  steps.push(
    `On that day clocks there were ${formatOffset(m.offsetMinutes)}${m.offsetMinutes ? " (this includes any summer time)" : ""}.`,
    `Astronomers measure every position in UTC, the world's standard clock, so your birth moment becomes ${utcText(chart.utc)}.`,
  );
  return {
    id: "how-birth-moment",
    title: "Your birth moment",
    intro: "A birth chart is a map of the sky at the exact moment you were born, so the first job is to pin that moment down.",
    steps,
    result: `Your chart is drawn for ${utcText(chart.utc)}.`,
    articles: [{ id: "start-here/what-you-need-for-a-reading", label: "What you need for a reading" }],
  };
}

export function planetsBreakdown(chart: Chart): ChartBreakdown {
  const planets = chart.points.filter((p) => p.id !== "lilith");
  const sun = planets[0];
  return {
    id: "how-planets",
    title: "Your planets' signs",
    intro: "Picture the zodiac as a 360° circle around the Earth, split into twelve signs of 30° each, starting with Aries at 0°. For each planet we find how far round the circle it was, then which 30° slice that is.",
    steps: [
      `We use Astronomy Engine, a free, accurate set of astronomy formulas, to work out where each planet appeared from Earth at your birth moment.`,
      `For example, ${signLine("your Sun", sun.lon)}`,
      ...planets.slice(1).map((p) => signLine(name(p.id), p.lon) + (p.retrograde ? ` It was retrograde, seeming to move backwards from where we stand on Earth.` : "")),
    ],
    result: `Your Sun is in ${sun.sign.name} and your Moon is in ${planets[1].sign.name}.`,
    note: "Starlight uses the tropical zodiac, where 0° Aries is the spring equinox. It is the zodiac used by most Western astrology sites, so your signs should match theirs.",
    articles: [
      { id: "planets/the-planets-in-your-chart", label: "The planets in your chart" },
      { id: "sun-moon-rising/sun-sign", label: "Your Sun sign" },
      { id: "sun-moon-rising/moon-sign", label: "Your Moon sign" },
      { id: "moon-sky/retrograde-planets", label: "Retrograde planets" },
    ],
  };
}

export function risingBreakdown(chart: Chart, place: Place): ChartBreakdown | null {
  const a = chart.angles;
  if (!a) return null;
  const lonHours = place.lon / 15;
  return {
    id: "how-rising",
    title: "Your Rising sign and Midheaven",
    intro: "As the Earth spins, every sign rises over the eastern horizon in turn, about one every two hours. Your Rising sign is the one coming up at the moment and place you were born.",
    steps: [
      `First we need the "star clock" (sidereal time), which tracks the turning of the sky rather than the Sun. At ${utcText(chart.utc)} it read ${formatHours((a.lst - lonHours + 24) % 24)} at Greenwich, near London.`,
      `Your birthplace is ${Math.abs(place.lon).toFixed(2)}° ${place.lon >= 0 ? "east" : "west"} of Greenwich. Every 15° is one hour, so ${place.lon >= 0 ? "add" : "take away"} ${formatHours(Math.abs(lonHours))}. The star clock where you were born read ${formatHours(a.lst)}.`,
      `Turn that into an angle (one hour is 15°): the sky had turned ${a.ramc.toFixed(1)}°.`,
      `The point of the zodiac highest overhead, the Midheaven, follows from that angle and the ${a.obliquity.toFixed(2)}° tilt of Earth's axis: ${a.mc.lon.toFixed(1)}°, which is ${at(a.mc.lon)}.`,
      `The point rising in the east also depends on how far north or south you were born, ${Math.abs(place.lat).toFixed(2)}° ${place.lat >= 0 ? "north" : "south"}. It works out to ${a.asc.lon.toFixed(1)}°, which is ${at(a.asc.lon)}.`,
    ],
    result: `Your Rising sign is ${a.asc.sign.name}, and your Midheaven is in ${a.mc.sign.name}.`,
    note: "For the curious, the formulas are: Midheaven = atan2(sin RAMC, cos RAMC × cos ε) and Ascendant = atan2(cos RAMC, −(sin RAMC × cos ε + tan φ × sin ε)), where RAMC is the angle above, ε is Earth's tilt and φ is your latitude. A birth time even 5 minutes out can move the Rising degree by a degree or more, so it is worth checking your birth certificate.",
    articles: [{ id: "sun-moon-rising/rising-sign", label: "Your Rising sign" }, { id: "sun-moon-rising/your-big-three", label: "Your Big Three" }],
  };
}

export function housesBreakdown(chart: Chart): ChartBreakdown | null {
  const h = chart.houses;
  if (!h) return null;
  const placidus = h.system === "placidus";
  return {
    id: "how-houses",
    title: "Your houses",
    intro: "The houses split the sky around your birthplace into twelve areas of life. Where the signs show how a planet acts, the houses show where in life it shows up.",
    steps: [
      `The 1st house begins at your Rising sign (${at(h.cusps[0])}) and the 10th at your Midheaven (${at(h.cusps[9])}). The 7th and 4th begin exactly opposite them.`,
      placidus
        ? `The houses in between use the Placidus system, the most widely used. It takes the time each degree spends travelling from the horizon to the top of the sky and divides it into thirds. That is why your houses are not all the same size.`
        : `You were born so far north or south that some degrees never rise or set, so the usual Placidus system does not work there. Instead we use Equal houses: twelve slices of 30° each, starting at your Rising sign.`,
      ...h.cusps.map((c, i) => `The ${ordinal(i + 1)} house (${HOUSES[i].area}) begins at ${at(c)}.`),
      `Each planet sits in the house whose start it has passed but whose next house it has not reached.`,
    ],
    result: `Your houses use the ${placidus ? "Placidus" : "Equal"} system.`,
    articles: [{ id: "houses-aspects/the-twelve-houses", label: "The twelve houses" }, { id: "houses-aspects/how-to-read-a-birth-chart", label: "How to read a birth chart" }],
  };
}

export function aspectsBreakdown(chart: Chart): ChartBreakdown {
  const pos = (id: PointId) => chart.points.find((p) => p.id === id)!.lon;
  const steps = [
    `Aspects are the angles between planets. We measure the shortest way round the circle between every pair of planets.`,
    `If that angle is close to 0°, 60°, 90°, 120° or 180°, the pair forms an aspect. "Close" is allowed to be a few degrees out, called the orb: ${ASPECTS.map((a) => `${a.orb}° for a ${a.name.toLowerCase()}`).join(", ")}.`,
    ...chart.aspects.map((h) => {
      const asp = ASPECTS.find((a) => a.id === h.aspect)!;
      return `${name(h.a)} (${pos(h.a).toFixed(1)}°) and ${name(h.b)} (${pos(h.b).toFixed(1)}°) are ${separation(pos(h.a), pos(h.b)).toFixed(1)}° apart, ${h.orb.toFixed(1)}° from an exact ${asp.name.toLowerCase()} (${asp.angle}°).`;
    }),
  ];
  return {
    id: "how-aspects",
    title: "Your aspects",
    intro: "Planets talk to each other through the angles between them. Some angles are easy and helpful, others are tense and push you to grow.",
    steps,
    result: chart.aspects.length ? `We found ${chart.aspects.length} aspects. The closer to exact, the stronger the aspect.` : `We found no major aspects within the usual orbs.`,
    articles: [{ id: "houses-aspects/the-major-aspects", label: "The major aspects" }],
  };
}

export function lilithBreakdown(chart: Chart): ChartBreakdown {
  const l = chart.points.find((p) => p.id === "lilith")!;
  return {
    id: "how-lilith",
    title: "Your Dark Moon Lilith",
    intro: "The Moon's path around the Earth is an oval, not a circle. Dark Moon Lilith is the point where that oval is farthest from Earth.",
    steps: [
      `That farthest point slowly drifts round the whole zodiac, once about every 8 years and 10 months.`,
      `We use its average (mean) position, the version most astrology sites use, worked out from a formula by the astronomer Jean Meeus.`,
      signLine("On your birth day, Lilith", l.lon),
    ],
    result: `Your Dark Moon Lilith is in ${l.sign.name}.`,
    articles: [{ id: "planets/dark-moon-lilith", label: "Dark Moon Lilith" }],
  };
}
