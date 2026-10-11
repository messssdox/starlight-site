// The words behind the Cosmic calendar (the /sky page): what each planet governs, how each sign colours it,
// what a retrograde is and how it tends to feel, and what the Moon's phases, eclipses and
// seasons mean. src/lib/sky-events.ts puts these together into the "What this means" text.

import type { PlanetId, SignId } from "./astrology.ts";

/** What each planet governs, finishing the sentence "Mercury rules …". */
export const PLANET_THEMES: Record<PlanetId, string> = {
  sun: "your core self, your energy and what you put in the spotlight",
  moon: "feelings, moods, comfort and what makes you feel safe",
  mercury: "thinking, talking, writing, technology, short trips and plans",
  venus: "love, friendship, beauty, pleasure and money",
  mars: "drive, courage, desire, anger and getting things done",
  jupiter: "growth, luck, opportunity, learning and generosity",
  saturn: "responsibility, hard work, limits, time and lasting achievements",
  uranus: "sudden change, freedom, invention and the unexpected",
  neptune: "dreams, imagination, spirituality, compassion and illusion",
  pluto: "power, deep transformation, endings and rebirth",
};

/** How long a planet usually spends in one sign. */
export const SIGN_STAY: Record<PlanetId, string> = {
  sun: "about a month",
  moon: "two to three days",
  mercury: "about three weeks, longer when it turns retrograde",
  venus: "about four weeks, or four months when it turns retrograde",
  mars: "about six weeks, or up to seven months when it turns retrograde",
  jupiter: "about a year",
  saturn: "about two and a half years",
  uranus: "about seven years",
  neptune: "about fourteen years",
  pluto: "between twelve and thirty years",
};

/** How a planet behaves in each sign. */
export const SIGN_STYLE: Record<SignId, string> = {
  aries: "bold, fast and direct, acting first and thinking later",
  taurus: "slow, steady and practical, wanting comfort and things that last",
  gemini: "curious, chatty and restless, hungry for ideas and variety",
  cancer: "caring, protective and emotional, led by feelings and home",
  leo: "warm, proud and generous, wanting to shine and be seen",
  virgo: "careful, helpful and precise, sorting, fixing and improving",
  libra: "charming, fair and diplomatic, seeking balance and partnership",
  scorpio: "intense, private and deep, all or nothing",
  sagittarius: "adventurous, honest and hopeful, aiming for the horizon",
  capricorn: "patient, ambitious and disciplined, building for the long term",
  aquarius: "original, independent and forward-thinking, breaking the mould",
  pisces: "dreamy, gentle and intuitive, compassionate with soft edges",
};

/** The part of life each sign looks after (its natural house). */
export const SIGN_AREA: Record<SignId, string> = {
  aries: "you, your image and new beginnings",
  taurus: "money, possessions, comfort and self-worth",
  gemini: "conversations, learning, neighbours and short trips",
  cancer: "home, family, roots and feeling safe",
  leo: "creativity, romance, fun and children",
  virgo: "daily routines, work and health",
  libra: "partnerships, marriage and fairness",
  scorpio: "intimacy, trust, shared money and transformation",
  sagittarius: "travel, study, beliefs and the big picture",
  capricorn: "career, ambitions and reputation",
  aquarius: "friends, groups, causes and hopes for the future",
  pisces: "rest, dreams, spirituality and letting go",
};

/** Good intentions to set at a New Moon in each sign. */
export const NEW_MOON_IDEAS: Record<SignId, string> = {
  aries: "starting a brave project, putting yourself first and getting moving",
  taurus: "building savings, treating your body kindly and slowing down",
  gemini: "learning something new, reaching out and writing things down",
  cancer: "nesting, family time and looking after your feelings",
  leo: "creative projects, romance and making time to play",
  virgo: "healthy habits, decluttering and getting organised",
  libra: "partnerships, making peace and making your space beautiful",
  scorpio: "deepening trust, sorting shared money and letting go of what is finished",
  sagittarius: "planning a trip, starting a course and saying yes to adventure",
  capricorn: "career goals, long-term plans and steady discipline",
  aquarius: "friendships, community and trying something different",
  pisces: "rest, creativity, spiritual practice and forgiveness",
};

export interface RetroMeaning {
  /** How often and for how long. */
  rhythm: string;
  /** How it tends to feel. */
  feels: string;
  /** What it is good for. */
  goodFor: string;
  /** What to go easy on. */
  goEasy: string;
  /** What changes when it turns direct. */
  direct: string;
}

export const RETRO_INTRO =
  "A retrograde is an optical illusion. As Earth overtakes another planet (or is overtaken by it), that planet seems to slip backwards against the stars for a while, like a car you pass on the motorway seeming to drift back. Astrologers read it as the planet's themes turning inward: a time to review, repeat and redo rather than to launch.";

export const STATION_NOTE =
  "Just before it changes direction a planet seems to stand still (astrologers call this its station), so the few days around the change are often when its themes are felt most strongly.";

export const RETRO: Partial<Record<PlanetId, RetroMeaning>> = {
  mercury: {
    rhythm: "Mercury turns retrograde three or four times a year, for about three weeks each time.",
    feels: "It is famous for crossed wires: delays, lost messages, technology playing up, travel hiccups and plans that change. People from the past often get back in touch.",
    goodFor: "Anything with \"re\" in front of it: review, revise, reconnect, repair, rest and finish old jobs.",
    goEasy: "Signing big contracts, buying new gadgets or launching something new without double-checking the details.",
    direct: "Messages, plans and travel start flowing again. Give it a week or two to pick up speed before you make big decisions (the \"shadow\" period).",
  },
  venus: {
    rhythm: "Venus turns retrograde about every eighteen months, for about six weeks.",
    feels: "Old feelings and old flames can resurface. You may question a relationship, your spending or your style, and what you really value.",
    goodFor: "Honest talks about what you want, reconnecting with people you love, and sorting out money.",
    goEasy: "Rushing into a new relationship, dramatic makeovers and big luxury purchases.",
    direct: "Love and money matters move forward again, often with a clearer sense of what and who you value.",
  },
  mars: {
    rhythm: "Mars turns retrograde about every two years, for around two and a half months.",
    feels: "Energy can feel low or frustrated, projects stall, and old arguments flare up again.",
    goodFor: "Finishing what you started, planning your strategy, rest and steady training.",
    goEasy: "Picking fights, risky physical stunts and forcing things that will not move.",
    direct: "Drive and momentum return, and plans that stalled can move ahead.",
  },
  jupiter: {
    rhythm: "Jupiter turns retrograde once a year, for about four months.",
    feels: "Growth turns inward. You may rethink your beliefs, your plans to expand, or where you have been overdoing things.",
    goodFor: "Inner growth, study and reviewing where luck has come from and where you have overstretched.",
    goEasy: "Overpromising or taking on more than you can manage.",
    direct: "Opportunities open up outwardly again, and plans to grow can go ahead.",
  },
  saturn: {
    rhythm: "Saturn turns retrograde once a year, for about four and a half months.",
    feels: "Old responsibilities come back for review. The foundations of your life get tested to see what is solid.",
    goodFor: "Fixing weak spots, finishing commitments and being honest about your limits.",
    goEasy: "Shortcuts and avoiding duties; they tend to come back round.",
    direct: "Hard work starts to show results again, and you can build on what proved solid.",
  },
  uranus: {
    rhythm: "Uranus is retrograde for about five months every year, so it is felt mostly as background.",
    feels: "Restlessness turns inward. Quiet changes brew beneath the surface before they show.",
    goodFor: "Thinking about where you want more freedom, and trying new ideas privately.",
    goEasy: "Sudden, reckless changes made just to break free.",
    direct: "Changes that were brewing are more likely to break through into the open.",
  },
  neptune: {
    rhythm: "Neptune is retrograde for about five months every year, so it is felt mostly as background.",
    feels: "The rose-tinted glasses come off. Illusions fade and you see situations more clearly.",
    goodFor: "Creative and spiritual reflection, and honest reality checks.",
    goEasy: "Escapism, and ignoring red flags.",
    direct: "Dreams and inspiration flow outward again, ready to be turned into something real.",
  },
  pluto: {
    rhythm: "Pluto is retrograde for about five months every year, so it is felt mostly as background.",
    feels: "Deep inner work. Old power struggles and buried feelings can rise up to be dealt with.",
    goodFor: "Therapy, decluttering and honest self-examination.",
    goEasy: "Control battles and holding on to what needs to end.",
    direct: "Inner changes start to show in your outer life.",
  },
};

export const NEW_MOON_INTRO =
  "At a New Moon the Moon sits between Earth and the Sun, so its lit side faces away from us and it disappears from the night sky. It starts the Moon's 29½-day cycle, which makes it the classic time for fresh starts.";

export const FULL_MOON_INTRO =
  "At a Full Moon the Sun and Moon sit on opposite sides of Earth, so the Moon's whole face is lit. Feelings tend to run high, and whatever began around the New Moon two weeks earlier often comes to a head.";

export const SOLAR_ECLIPSE_INTRO =
  "A solar eclipse is a New Moon that lines up so exactly with the Sun that the Moon passes in front of it. Astrologers see eclipses as wildcard New Moons: doors open suddenly, and what starts now tends to unfold over the next six months.";

export const LUNAR_ECLIPSE_INTRO =
  "A lunar eclipse is a Full Moon where Earth's shadow falls across the Moon. It is read as an extra-powerful Full Moon: endings, revelations and turning points that play out over the following months.";

export const ECLIPSE_KIND: Record<string, string> = {
  "Total solar": "In a total eclipse the Moon covers the Sun completely along a narrow path, and the day goes dark for a few minutes.",
  "Annular solar": "In an annular eclipse the Moon is a little too far away to cover the Sun fully, leaving a bright \"ring of fire\".",
  "Partial solar": "In a partial eclipse the Moon covers only part of the Sun.",
  "Total lunar": "In a total eclipse the whole Moon sits in Earth's shadow and often turns a coppery red (a \"blood moon\").",
  "Partial lunar": "In a partial eclipse part of the Moon passes through Earth's dark shadow.",
  "Penumbral lunar": "A penumbral eclipse is subtle: the Moon only passes through Earth's faint outer shadow and dims slightly. Astrologers still count it, though it is gentler.",
};

export const SEASON_DETAIL: Record<string, string> = {
  "March equinox": "Day and night are almost exactly equal everywhere on Earth. It is the astrological new year: the Sun enters Aries, the first sign, so it is a natural time for fresh starts. Spring begins in the northern half of the world and autumn in the southern half.",
  "June solstice": "The Sun reaches its highest point of the year in the north, giving the longest day; the south has its shortest. The Sun enters Cancer, turning the focus to home, family and celebrating the light.",
  "September equinox": "Day and night are equal again. The Sun enters Libra, the sign of balance, which makes it a time for gratitude, fairness and relationships. Autumn begins in the north and spring in the south.",
  "December solstice": "The shortest day in the north and the longest in the south, when the light begins to return. The Sun enters Capricorn, a good time to rest, reflect and plan the year ahead.",
};

/**
 * Numerology for the calendar: the energy of each Universal Day number (the whole date
 * added up), which every event inherits from the day it falls on.
 */
export const UNIVERSAL_DAY: Record<number, string> = {
  1: "a day for beginnings, courage and taking the lead",
  2: "a day for patience, partnership and quiet diplomacy",
  3: "a day for joy, creativity and saying what you feel",
  4: "a day for steady work, order and practical progress",
  5: "a day for change, movement and the unexpected",
  6: "a day for home, family, love and taking care",
  7: "a day for reflection, rest and inner wisdom",
  8: "a day for ambition, money matters and personal power",
  9: "a day for endings, letting go and kindness",
  11: "a master day of intuition, inspiration and spiritual insight",
  22: "a master day for turning big dreams into something real",
  33: "a master day of compassion, healing and service",
};

/**
 * The numbers that echo each kind of event. When an event lands on one of its own
 * numbers, the calendar points out that the two line up.
 */
export const NUMBER_ECHOES: { test: (title: string) => boolean; numbers: number[]; why: string }[] = [
  { test: (t) => t.startsWith("New Moon"), numbers: [1, 11], why: "both the New Moon and this number are about fresh starts, so intentions set today carry extra weight" },
  { test: (t) => t.startsWith("Full Moon"), numbers: [9, 33], why: "both the Full Moon and this number are about completion, so it is an especially good day to let go" },
  { test: (t) => /solar eclipse/.test(t), numbers: [1, 8, 11, 22], why: "the number amplifies the eclipse's new chapter, so changes started now can be big ones" },
  { test: (t) => /lunar eclipse/.test(t), numbers: [7, 9, 11], why: "the number deepens the eclipse's endings and revelations, so listen to what comes up" },
  { test: (t) => t.includes("turns retrograde"), numbers: [7, 2], why: "this quiet, inward number suits a retrograde's time of review" },
  { test: (t) => t.includes("turns direct"), numbers: [1, 5, 8], why: "this forward-moving number matches the planet picking up speed again" },
  { test: (t) => / enters /.test(t) || t.includes("moves back into"), numbers: [5], why: "five is the number of change, which suits a planet moving into a new sign" },
  { test: (t) => /equinox/.test(t), numbers: [2, 6], why: "this number of balance and harmony echoes day and night being equal" },
  { test: (t) => /solstice/.test(t), numbers: [1, 9], why: "this number of endings and beginnings echoes the turning point of the year" },
];

export const NUMEROLOGY_INTRO =
  "In numerology every date has its own number, the same for everyone. Add up all the digits of the date and keep going until one digit is left (11, 22 and 33 are kept as master numbers). That is the Universal Day, and it colours whatever happens in the sky that day.";

/**
 * The repeating "portal" dates, when the day and month share a number (1/1 to 12/12).
 * Numerology fans treat them as days when that number's energy is doubled.
 */
export const PORTAL_DATES: Record<number, { name: string; note: string; detail: string }> = {
  1: { name: "new beginnings", note: "A doubled 1 on the first day of the year: set your intentions.", detail: "One is the number of beginnings, and on 1/1 it appears twice at the very start of the year. It is the classic day to set intentions, start a habit or take a first brave step." },
  2: { name: "partnership", note: "A doubled 2: a gentle day for love, teamwork and balance.", detail: "Two is the number of partnership and cooperation. On 2/2 it is doubled, which makes it a soft, connecting day: reach out, mend a bridge or simply listen." },
  3: { name: "creativity", note: "A doubled 3: say it, sing it, make something.", detail: "Three is the number of creativity and self-expression, and 3 + 3 makes 6, the number of the heart. A day to share ideas, create freely and enjoy other people's company." },
  4: { name: "foundations", note: "A doubled 4: build something steady.", detail: "Four is the number of foundations, order and hard work. On 4/4 it is doubled, so it is a good day for practical plans, organising and laying groundwork that lasts." },
  5: { name: "change", note: "A doubled 5: welcome a shake-up.", detail: "Five is the number of freedom and change. On 5/5 it is doubled and 5 + 5 makes 10, a fresh cycle. A day to try something new, travel, or let go of a routine that has gone stale." },
  6: { name: "love and home", note: "A doubled 6: care for the people and places you love.", detail: "Six is the number of love, home and responsibility. On 6/6 it is doubled, which makes it a warm day for family, healing and making your space beautiful." },
  7: { name: "inner wisdom", note: "A doubled 7: a lucky, spiritual day for reflection.", detail: "Seven is the number of inner wisdom and spirituality, and many traditions see it as lucky. On 7/7 it is doubled: a day to slow down, meditate, study and trust your intuition." },
  8: { name: "abundance", note: "A doubled 8: abundance and personal power.", detail: "Eight is the number of abundance and power." },
  9: { name: "completion", note: "A doubled 9: finish, forgive and let go.", detail: "Nine is the number of endings and compassion. On 9/9 it is doubled, so it is a day to complete what is unfinished, clear space and forgive, ready for what comes next." },
  10: { name: "a fresh cycle", note: "Ten becomes 1: a new cycle starts.", detail: "Ten is a 1 with a 0 beside it: a new beginning with the whole cycle's wisdom behind it. On 10/10 the energy is doubled, making it a day to start again on a higher level." },
  11: { name: "make a wish", note: "The best-known portal: master number 11, twice over.", detail: "Eleven is a master number of intuition, inspiration and spiritual awakening. On 11/11 it is doubled, and many people make a wish at 11:11. It is the most celebrated numerology date of the year: notice signs, trust your hunches and set heartfelt intentions." },
  12: { name: "reflection", note: "A doubled 12: look back on the year and give thanks.", detail: "Twelve adds up to 3, the number of joy and expression, and on 12/12 it is doubled as the year draws to a close. A day to look back on how far you have come, give thanks and dream about the year ahead." },
};

export const LIONS_GATE = {
  note: "The peak of the Lion's Gate portal: abundance, courage and manifesting.",
  detail: [
    { p: "The Lion's Gate is a yearly \"portal\" from about 26 July to 12 August, peaking on 8/8. The Sun is in Leo, the lion, and the bright star Sirius rises again before dawn after weeks hidden in the Sun's glare. Ancient Egyptians linked Sirius's return with the flooding of the Nile and the start of their new year." },
    { h: "The numbers", p: "Eight is the number of abundance, success and personal power. On 8/8 it is doubled, and an 8 on its side is the sign for infinity, which is why the day is linked with manifesting." },
    { h: "Good for", p: "Setting big goals, money and career intentions, and stepping into your confidence like a lion." },
  ],
};

export const STARLIGHT_BIRTHDAY = "Starlight was born on 10/10/2026. Happy birthday to us, and thank you for visiting.";
