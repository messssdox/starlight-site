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
  { id: "sun-sign", term: "Sun sign", definition: "The sign the Sun was in when you were born: your core self. It is what people usually mean by your star sign." },
  { id: "moon-sign", term: "Moon sign", definition: "The sign the Moon was in when you were born. It describes your feelings, needs and what makes you feel safe." },
  { id: "big-three", term: "Big Three", definition: "Your Sun, Moon and Rising signs together: the three most important parts of a birth chart." },
  { id: "birth-chart", term: "birth chart", aliases: ["natal chart"], definition: "A map of where the Sun, Moon and planets were at the exact moment and place you were born." },
  { id: "midheaven", term: "Midheaven", definition: "The point of the zodiac highest in the sky when you were born. It begins your 10th house and is linked to career and reputation." },
  { id: "house", term: "house", aliases: ["houses"], definition: "One of twelve areas of life in a birth chart, such as home, money or friendships. The house a planet sits in shows where in life its energy shows up." },
  { id: "placidus", term: "Placidus", definition: "The most widely used way of dividing a birth chart into twelve houses. It is based on how long each degree takes to rise to the top of the sky." },
  { id: "aspect", term: "aspect", aliases: ["aspects"], definition: "An angle between two planets in a chart, such as 90° (a square) or 120° (a trine). Aspects show which parts of you work together easily and which clash." },
  { id: "orb", term: "orb", definition: "How many degrees an aspect can be from exact and still count. A tighter orb means a stronger aspect." },
  { id: "tropical-zodiac", term: "tropical zodiac", definition: "The zodiac most Western astrologers use, where 0° Aries is fixed to the spring equinox rather than to the stars." },
  { id: "sidereal-time", term: "sidereal time", definition: "Time measured by the turning of the stars rather than the Sun. It is used to work out which sign was rising when you were born." },
  { id: "transit", term: "transit", aliases: ["transits"], definition: "Where a planet is in the sky right now, compared with where it was when you were born. Transits describe the energy of the moment for you." },
  { id: "retrograde", term: "retrograde", aliases: ["retrogrades"], definition: "When a planet seems to move backwards across the sky because of how Earth overtakes it. Traditionally a time to review rather than start.", article: "/library/moon-sky/retrograde-planets" },
  { id: "direct", term: "turns direct", aliases: ["turning direct", "goes direct"], definition: "When a retrograde planet stops seeming to move backwards and moves forward again. Its themes start flowing outwards again." },
  { id: "station", term: "station", aliases: ["stations", "stationary"], definition: "The few days when a planet seems to stand still in the sky, just before it turns retrograde or moves forward again. Its themes are often felt most strongly then." },
  { id: "shadow-period", term: "shadow period", definition: "The weeks just before and after a retrograde, when a planet passes over the same stretch of sky. Its effects start early and fade slowly." },
  { id: "new-moon", term: "New Moon", aliases: ["new Moon"], definition: "When the Moon sits between Earth and the Sun, so its lit side faces away and it looks dark. The start of the Moon's cycle: a time for fresh starts and intentions." },
  { id: "full-moon", term: "Full Moon", aliases: ["full Moon"], definition: "When Earth sits between the Sun and the Moon, so we see the Moon fully lit. The peak of the Moon's cycle: a time when things come to a head." },
  { id: "solar-eclipse", term: "solar eclipse", aliases: ["solar eclipses"], definition: "When the Moon passes in front of the Sun and blocks some or all of its light. It only happens at a New Moon, and astrologers see it as a powerful new beginning." },
  { id: "lunar-eclipse", term: "lunar eclipse", aliases: ["lunar eclipses"], definition: "When Earth's shadow falls across the Full Moon, dimming it or turning it red. Astrologers see it as a powerful ending or release." },
  { id: "equinox", term: "equinox", aliases: ["equinoxes"], definition: "One of the two days a year (around 20 March and 22 September) when day and night are almost equal everywhere on Earth." },
  { id: "solstice", term: "solstice", aliases: ["solstices"], definition: "The longest or shortest day of the year (around 21 June and 21 December), when the Sun reaches its highest or lowest point." },
  { id: "universal-month", term: "Universal Month", definition: "The number of the calendar month for everyone: the month's number added to the Universal Year." },
  { id: "universal-day", term: "Universal Day", definition: "The number of a date for everyone, made by adding up all the digits of the full date." },
  { id: "personal-day", term: "Personal Day", definition: "Your own number for a date, made from your birth day and month plus the date. It shows how that day's energy feels for you." },
  { id: "portal", term: "portal", aliases: ["portals", "portal date"], definition: "A modern name for a date with repeating numbers, such as 11/11. People treat it as a moment to pause, set an intention or make a wish." },
  { id: "lions-gate", term: "Lion's Gate", definition: "A yearly portal from late July to 12 August, peaking on 8/8, when the Sun is in Leo and the star Sirius rises again before dawn." },
  { id: "lilith", term: "Dark Moon Lilith", aliases: ["Lilith", "Black Moon Lilith"], definition: "The point where the Moon's orbit is farthest from Earth. In astrology it represents your raw, untamed side and what you refuse to compromise." },
  { id: "synastry", term: "synastry", definition: "Comparing two birth charts to see how two people's planets connect, harmonise or challenge each other." },
];
