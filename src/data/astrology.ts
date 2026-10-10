// The facts behind a Western astrology reading: the twelve signs, what each planet
// governs, the twelve houses and the five major aspects. The planet-in-sign meanings
// live in placements-personal.ts and placements-outer.ts.

import { PERSONAL_PLACEMENTS } from "./placements-personal.ts";
import { OUTER_PLACEMENTS } from "./placements-outer.ts";

export type SignId =
  | "aries" | "taurus" | "gemini" | "cancer" | "leo" | "virgo"
  | "libra" | "scorpio" | "sagittarius" | "capricorn" | "aquarius" | "pisces";

export type Element = "Fire" | "Earth" | "Air" | "Water";
export type Modality = "Cardinal" | "Fixed" | "Mutable";

export interface Sign {
  id: SignId;
  name: string;
  /** The symbol, with \uFE0E so phones show it as text rather than a coloured emoji. */
  glyph: string;
  element: Element;
  modality: Modality;
  /** Modern ruling planet. */
  ruler: string;
  /** Three words that sum the sign up. */
  keywords: string;
}

/** In zodiac order, starting at 0° (Aries). Each sign covers 30°. */
export const SIGNS: Sign[] = [
  { id: "aries", name: "Aries", glyph: "♈\uFE0E", element: "Fire", modality: "Cardinal", ruler: "Mars", keywords: "bold, direct, pioneering" },
  { id: "taurus", name: "Taurus", glyph: "♉\uFE0E", element: "Earth", modality: "Fixed", ruler: "Venus", keywords: "steady, sensual, loyal" },
  { id: "gemini", name: "Gemini", glyph: "♊\uFE0E", element: "Air", modality: "Mutable", ruler: "Mercury", keywords: "curious, quick, sociable" },
  { id: "cancer", name: "Cancer", glyph: "♋\uFE0E", element: "Water", modality: "Cardinal", ruler: "the Moon", keywords: "caring, protective, intuitive" },
  { id: "leo", name: "Leo", glyph: "♌\uFE0E", element: "Fire", modality: "Fixed", ruler: "the Sun", keywords: "warm, proud, creative" },
  { id: "virgo", name: "Virgo", glyph: "♍\uFE0E", element: "Earth", modality: "Mutable", ruler: "Mercury", keywords: "practical, careful, helpful" },
  { id: "libra", name: "Libra", glyph: "♎\uFE0E", element: "Air", modality: "Cardinal", ruler: "Venus", keywords: "fair, charming, harmonious" },
  { id: "scorpio", name: "Scorpio", glyph: "♏\uFE0E", element: "Water", modality: "Fixed", ruler: "Pluto", keywords: "intense, private, transforming" },
  { id: "sagittarius", name: "Sagittarius", glyph: "♐\uFE0E", element: "Fire", modality: "Mutable", ruler: "Jupiter", keywords: "adventurous, honest, hopeful" },
  { id: "capricorn", name: "Capricorn", glyph: "♑\uFE0E", element: "Earth", modality: "Cardinal", ruler: "Saturn", keywords: "ambitious, disciplined, patient" },
  { id: "aquarius", name: "Aquarius", glyph: "♒\uFE0E", element: "Air", modality: "Fixed", ruler: "Uranus", keywords: "original, independent, humane" },
  { id: "pisces", name: "Pisces", glyph: "♓\uFE0E", element: "Water", modality: "Mutable", ruler: "Neptune", keywords: "dreamy, compassionate, imaginative" },
];

export const ELEMENT_MEANING: Record<Element, string> = {
  Fire: "Fire brings enthusiasm, courage and a spark that gets things started.",
  Earth: "Earth brings patience, common sense and a gift for making things real.",
  Air: "Air brings ideas, conversation and the ability to see things from many sides.",
  Water: "Water brings feeling, intuition and a deep sense of what others need.",
};

export const MODALITY_MEANING: Record<Modality, string> = {
  Cardinal: "Cardinal signs start things: they take the lead and get the ball rolling.",
  Fixed: "Fixed signs keep things going: they are steady, loyal and hard to shift.",
  Mutable: "Mutable signs adapt: they are flexible and good at handling change.",
};

export type PlanetId = "sun" | "moon" | "mercury" | "venus" | "mars" | "jupiter" | "saturn" | "uranus" | "neptune" | "pluto";
export type PointId = PlanetId | "lilith";

export interface Planet {
  id: PointId;
  name: string;
  glyph: string;
  /** What it governs, in a few words, e.g. "passion and action". */
  governs: string;
  /** Two or three plain sentences on what this planet does in a chart. */
  about: string;
  /** How long it spends in each sign, so readers know why outer planets are shared by a generation. */
  pace: string;
  /** Library article that goes deeper, by collection id. */
  article?: string;
}

export const PLANETS: Planet[] = [
  { id: "sun", name: "Sun", glyph: "☉", governs: "your core self and life force", about: "The Sun is the heart of your chart: who you are at your core, what makes you feel alive and the person you are growing into. It is the sign people mean when they ask \"what's your star sign?\".", pace: "about a month in each sign", article: "sun-moon-rising/sun-sign" },
  { id: "moon", name: "Moon", glyph: "☽", governs: "your feelings and inner world", about: "The Moon shows your emotional side: what comforts you, how you react when you feel unsure and what you need to feel safe. It is the private you that close friends and family see.", pace: "about two and a half days in each sign", article: "sun-moon-rising/moon-sign" },
  { id: "mercury", name: "Mercury", glyph: "☿", governs: "thinking, learning and talking", about: "Mercury is the messenger. It shows how your mind works, how you learn, how you speak and write, and how you make sense of the world around you.", pace: "about three weeks in each sign", article: "planets/mercury" },
  { id: "venus", name: "Venus", glyph: "♀\uFE0E", governs: "love, beauty and what you value", about: "Venus shows how you love and like to be loved, what you find beautiful, how you make friends and how you treat money and pleasure.", pace: "about four weeks in each sign", article: "planets/venus" },
  { id: "mars", name: "Mars", glyph: "♂\uFE0E", governs: "passion, drive and action", about: "Mars is your engine. It shows how you go after what you want, what fires you up, how you compete and how you handle anger and desire.", pace: "about six weeks in each sign", article: "planets/mars" },
  { id: "jupiter", name: "Jupiter", glyph: "♃", governs: "growth, luck and generosity", about: "Jupiter is the planet of expansion. It shows where life tends to open up for you, where you find faith and optimism, and how you give and grow.", pace: "about a year in each sign", article: "planets/jupiter" },
  { id: "saturn", name: "Saturn", glyph: "♄", governs: "discipline, lessons and maturity", about: "Saturn is the teacher. It shows where you feel tested or held back at first, and where steady effort over many years turns into real mastery.", pace: "about two and a half years in each sign", article: "planets/saturn" },
  { id: "uranus", name: "Uranus", glyph: "♅", governs: "change, freedom and originality", about: "Uranus is the awakener. It shows where you break the rules, think differently and crave freedom. Because it moves so slowly, it also describes your whole generation.", pace: "about seven years in each sign", article: "planets/uranus" },
  { id: "neptune", name: "Neptune", glyph: "♆", governs: "dreams, imagination and spirit", about: "Neptune is the dreamer. It shows where you are inspired, compassionate and spiritual, and also where you can be wishful or easily misled. It describes your generation's ideals.", pace: "about fourteen years in each sign", article: "planets/neptune" },
  { id: "pluto", name: "Pluto", glyph: "♇", governs: "power and transformation", about: "Pluto is the transformer. It shows the deep, slow changes in your life, what you must let go of to be reborn, and the shared themes of your generation.", pace: "twelve to thirty years in each sign", article: "planets/pluto" },
  { id: "lilith", name: "Dark Moon Lilith", glyph: "⚸", governs: "your untamed, uncompromising side", about: "Dark Moon Lilith is not a planet but a point: where the Moon's orbit is farthest from Earth. It shows the raw, wild part of you that will not be tamed, where you may have felt judged, and where you take your power back.", pace: "about nine months in each sign", article: "planets/dark-moon-lilith" },
];

export const PLANET_BY_ID = Object.fromEntries(PLANETS.map((p) => [p.id, p])) as Record<PointId, Planet>;

export interface House {
  n: number;
  /** A few words, e.g. "home and family". */
  area: string;
  about: string;
}

export const HOUSES: House[] = [
  { n: 1, area: "self and appearance", about: "How you come across, your body and the way you start new things. It begins at your Rising sign." },
  { n: 2, area: "money and values", about: "Your income, possessions, self-worth and what you truly value." },
  { n: 3, area: "communication and neighbourhood", about: "How you talk, learn and get around, plus brothers, sisters, neighbours and short trips." },
  { n: 4, area: "home and family", about: "Your roots, your home, your family and the private place you return to. It begins at the very bottom of the chart." },
  { n: 5, area: "creativity, fun and romance", about: "Play, hobbies, dating, children and whatever lets you shine and express yourself." },
  { n: 6, area: "work routines and health", about: "Daily habits, your job, your health and the ways you are of service to others." },
  { n: 7, area: "partnerships", about: "Marriage, close partners and business partners: the people you meet one to one. It begins opposite your Rising sign." },
  { n: 8, area: "intimacy and shared resources", about: "Deep bonds, trust, shared money, inheritance and the big transformations in life." },
  { n: 9, area: "travel, beliefs and big ideas", about: "Long journeys, higher learning, faith, philosophy and the search for meaning." },
  { n: 10, area: "career and reputation", about: "Your public life, ambitions and what you are known for. It begins at the very top of the chart, the Midheaven." },
  { n: 11, area: "friends and hopes", about: "Friendships, groups, communities and your hopes for the future." },
  { n: 12, area: "the hidden and the spiritual", about: "Rest, solitude, dreams, secrets and the quiet inner life, plus what you keep behind the scenes." },
];

export type AspectId = "conjunction" | "sextile" | "square" | "trine" | "opposition";

export interface Aspect {
  id: AspectId;
  name: string;
  glyph: string;
  angle: number;
  /** How far from exact it can be and still count. */
  orb: number;
  /** "blend", "easy" or "tense": the overall flavour. */
  feel: string;
  about: string;
}

export const ASPECTS: Aspect[] = [
  { id: "conjunction", name: "Conjunction", glyph: "☌", angle: 0, orb: 8, feel: "blend", about: "The two planets sit together and act as one, so their energies merge and grow stronger." },
  { id: "sextile", name: "Sextile", glyph: "⚹", angle: 60, orb: 5, feel: "easy", about: "A friendly link that offers opportunities, as long as you reach out and use them." },
  { id: "square", name: "Square", glyph: "□", angle: 90, orb: 7, feel: "tense", about: "A tense link that creates friction. It pushes you to act, and much of your growth comes from it." },
  { id: "trine", name: "Trine", glyph: "△", angle: 120, orb: 7, feel: "easy", about: "A flowing, harmonious link. These two parts of you work together naturally, like a gift." },
  { id: "opposition", name: "Opposition", glyph: "☍", angle: 180, orb: 8, feel: "tense", about: "The two planets face each other across the chart, so you learn to balance two pulls, often through other people." },
];

export interface Placement {
  /** One short phrase for Quick Glance. */
  glance: string;
  /** A few sentences on this planet in this sign. */
  text: string;
}
