// Every special word on the site, with a short plain-English definition.
// Any of these words inside a page area marked data-glossary becomes tappable,
// and the definition pops up. Add a term here and it works everywhere.

export interface Term {
  id: string;
  term: string;
  /** Other ways the word appears in text, e.g. plurals. */
  aliases?: string[];
  definition: string;
  /** The full explainer article, once it exists. */
  article?: string;
}

export const GLOSSARY: Term[] = [
  { id: "life-path", term: "Life Path number", aliases: ["Life Path"], definition: "The most important number in numerology, worked out from your full birth date. It describes the main lesson and direction of your life.", article: "/numerology#life-path" },
  { id: "expression", term: "Expression number", aliases: ["Destiny number"], definition: "A number from every letter of your full birth name. It describes your natural talents and how you express yourself." },
  { id: "soul-urge", term: "Soul Urge number", aliases: ["Heart's Desire"], definition: "A number from the vowels in your name. It describes what you want most deep down." },
  { id: "personality", term: "Personality number", definition: "A number from the consonants in your name. It describes the side of you other people see first." },
  { id: "personal-year", term: "Personal Year", aliases: ["Personal Years"], definition: "Your number for the current year, from your birth day and month plus this year. It moves through a 9-year cycle of beginnings, growth and completion." },
  { id: "universal-year", term: "Universal Year", definition: "The number of the calendar year for everyone, made by adding its digits (2026 makes 1)." },
  { id: "master-number", term: "master number", aliases: ["master numbers"], definition: "The numbers 11, 22 and 33. They are not reduced to a single digit because they are believed to carry extra intensity and potential." },
  { id: "friend-group", term: "friend group", aliases: ["friend groups", "Three Harmonies", "San He"], definition: "Three Chinese zodiac animals that sit four places apart on the wheel and share the same colour. Traditionally they understand and support each other.", article: "/library/chinese-zodiac/friend-groups-secret-friends-and-clashes" },
  { id: "secret-friend", term: "secret friend", aliases: ["secret friends", "Six Harmonies", "Liu He"], definition: "Each Chinese zodiac animal has one hidden ally, shown by a matching colour on the inner ring. The bond is quiet, loyal and often unexpected.", article: "/library/chinese-zodiac/friend-groups-secret-friends-and-clashes" },
  { id: "clash", term: "clash", aliases: ["clashes", "clash year", "Six Clashes", "Liu Chong"], definition: "Two animals directly opposite each other on the wheel. Their energies pull in opposite directions, which can bring friction, or growth if handled with care.", article: "/library/chinese-zodiac/friend-groups-secret-friends-and-clashes" },
  { id: "ben-ming-nian", term: "Ben Ming Nian", definition: "The year of your own animal, which comes round every 12 years. Traditionally a year of change, when people take extra care and often wear red for luck." },
  { id: "lunar-new-year", term: "Lunar New Year", definition: "The start of the Chinese zodiac year, on a new Moon between 21 January and 20 February. Your animal depends on whether you were born before or after it." },
  { id: "yin-yang", term: "yin and yang", aliases: ["yin", "yang", "yin/yang"], definition: "The two complementary forces in Chinese thought. Yang is active, bright and outward; yin is receptive, calm and inward. Every animal is one or the other." },
  { id: "fire-element", term: "Fire Element", aliases: ["Fire element"], definition: "In Chinese astrology, the energy of warmth, passion and action. In Western astrology, the signs Aries, Leo and Sagittarius, known for enthusiasm and courage." },
  { id: "water-element", term: "Water Element", aliases: ["Water element"], definition: "In Chinese astrology, the energy of wisdom, flow and adaptability. In Western astrology, Cancer, Scorpio and Pisces, known for feeling and intuition." },
  { id: "wood-element", term: "Wood Element", aliases: ["Wood element"], definition: "In Chinese astrology, the energy of growth, kindness and new beginnings, like a tree reaching for light." },
  { id: "metal-element", term: "Metal Element", aliases: ["Metal element"], definition: "In Chinese astrology, the energy of strength, clarity and determination, like a polished blade." },
  { id: "earth-element", term: "Earth Element", aliases: ["Earth element"], definition: "In Chinese astrology, the energy of stability and nourishment. In Western astrology, Taurus, Virgo and Capricorn, known for being practical and grounded." },
  { id: "lunar-phase", term: "Lunar Phase", aliases: ["Moon phase", "Moon phases", "lunar phases"], definition: "How much of the Moon we see lit by the Sun, from new Moon (dark) to full Moon (bright) and back, over about 29.5 days." },
  { id: "rising-sign", term: "Rising sign", aliases: ["Ascendant"], definition: "The zodiac sign rising on the eastern horizon at the moment you were born. It shapes first impressions and needs your birth time and place." },
  { id: "transit", term: "transit", aliases: ["transits"], definition: "Where a planet is in the sky right now, compared with where it was when you were born. Transits describe the energy of the moment for you." },
  { id: "retrograde", term: "retrograde", definition: "When a planet seems to move backwards across the sky because of how Earth overtakes it. Traditionally a time to review rather than start." },
  { id: "lilith", term: "Dark Moon Lilith", aliases: ["Lilith", "Black Moon Lilith"], definition: "The point where the Moon's orbit is farthest from Earth. In astrology it represents your raw, untamed side and what you refuse to compromise." },
  { id: "synastry", term: "synastry", definition: "Comparing two birth charts to see how two people's planets connect, harmonise or challenge each other." },
];
