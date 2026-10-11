// Wording for "Meet yourself", the spotlight at the top of a solo reading. It weaves the
// Sun, Moon and personal planets, the Life Path and the Chinese animal into one portrait.
// Most pieces have two wordings, and src/lib/spotlight.ts picks one from the birth date,
// so two people with the same signs still read differently.
//
// Clause shapes, so the pieces join into sentences:
//   core    follows "you are a Libra: "            → "fair, charming and ..."
//   need    follows "your Cancer Moon "            → "needs a safe, loving home base ..."
//   mind, love, drive follow "you "                → "weigh every side before you speak"
//   gift, edge, trap are "-ing" phrases            → "making people feel seen"
//   SUN_MOON_MIX clauses start with "so"

import type { Element as WesternElement, Modality, SignId } from "./astrology.ts";
import type { Element as ChineseElement } from "./zodiac.ts";

type Two = [string, string];

export interface SignSpot {
  /** Title words: "the Graceful Creator". */
  title: Two;
  core: Two;
  need: Two;
  /** For the closing line: "a gentle Libra heart". */
  heart: Two;
  /** Mercury in this sign. */
  mind: Two;
  /** Venus in this sign. */
  love: Two;
  /** Mars in this sign. */
  drive: Two;
  /** The Sun's gift. */
  gift: Two;
  /** The Moon's growing edge. */
  edge: Two;
  /** Mars's trap, for the Full Deep Dive. */
  trap: string;
  /** What runs through you when three or more planets share the sign. */
  native: string;
}

export const SIGN_SPOT: Record<SignId, SignSpot> = {
  aries: {
    title: ["Bold", "Fearless"],
    core: ["bold, direct and most alive when you are first through the door", "brave, honest and happiest when there is something new to start"],
    need: ["needs to act on a feeling straight away rather than sit and stew", "needs room to feel things fast and fiercely, then move on"],
    heart: ["fiery", "quick-burning"],
    mind: ["think fast and say it straight, sometimes before the thought is finished", "make up your mind quickly and speak with refreshing honesty"],
    love: ["fall fast and love with your whole chest, wanting someone who can keep up", "love the chase and show it boldly, with no mixed messages"],
    drive: ["charge straight at it and work out the details on the way", "go first, go hard and enjoy the challenge as much as the prize"],
    gift: ["giving everyone around you the courage to begin", "turning a someday idea into a today plan"],
    edge: ["letting a hurt land before you hit back", "slowing down long enough to feel what is underneath the anger"],
    trap: "rushing ahead before anyone else has caught up",
    native: "action",
  },
  taurus: {
    title: ["Steadfast", "Grounded"],
    core: ["calm, loyal and built for the long haul", "steady, sensual and quietly determined to make things last"],
    need: ["needs comfort, routine and people who stay", "needs things you can touch and trust: good food, a soft place to land and a steady hand"],
    heart: ["steady", "loyal"],
    mind: ["think things through slowly and, once decided, rarely budge", "take your time with ideas and trust what you can prove"],
    love: ["love through touch, loyalty and small, solid gestures", "want slow-built, sensual love that you can count on"],
    drive: ["keep going long after everyone else has stopped", "move at your own pace and simply refuse to give up"],
    gift: ["making people feel safe and looked after", "building things that are still standing years later"],
    edge: ["letting change in before it has to force its way", "loosening your grip on what feels safe so something better can arrive"],
    trap: "digging your heels in when a small bend would do",
    native: "loyalty and comfort",
  },
  gemini: {
    title: ["Curious", "Quicksilver"],
    core: ["curious, chatty and endlessly interested in everything", "quick, witty and happiest with a head full of ideas"],
    need: ["needs to talk feelings through before they make sense", "needs variety, conversation and a friend who replies at midnight"],
    heart: ["restless", "lively"],
    mind: ["think in fast, sparkling leaps and can talk to anyone about anything", "learn quickly, ask a hundred questions and love a good debate"],
    love: ["fall for minds first and need a partner who makes you laugh", "love playfully and need conversation as much as romance"],
    drive: ["juggle several plans at once and keep them all moving", "go after things with wit and words rather than force"],
    gift: ["connecting people and ideas that would never otherwise meet", "making any room lighter and more interesting"],
    edge: ["staying with a feeling instead of explaining it away", "letting someone see the serious side under the jokes"],
    trap: "scattering your energy over too many things at once",
    native: "conversation",
  },
  cancer: {
    title: ["Tender", "Devoted"],
    core: ["caring, protective and deeply rooted in the people you love", "warm, intuitive and happiest looking after your own"],
    need: ["needs a safe, loving home base to come back to", "needs to feel wanted and to know the people you love are close"],
    heart: ["tender", "homely"],
    mind: ["remember everything, especially how things made you feel", "think with your feelings and read a room in seconds"],
    love: ["love by caring, feeding and protecting, and you never forget a kindness", "want a love that feels like home, and you give the same back"],
    drive: ["go sideways rather than head-on, but you never let go of what matters", "fight hardest for the people you love"],
    gift: ["making people feel remembered and held", "turning any place into somewhere that feels like home"],
    edge: ["saying what hurt you instead of retreating into your shell", "letting old wounds go so they stop steering new days"],
    trap: "holding on to a hurt long after it has done its job",
    native: "care",
  },
  leo: {
    title: ["Radiant", "Golden"],
    core: ["warm, generous and made to shine", "big-hearted, proud and naturally creative"],
    need: ["needs to feel appreciated and to be told so out loud", "needs warmth, loyalty and a little bit of applause"],
    heart: ["golden", "generous"],
    mind: ["speak with confidence and a flair for telling a story", "think big and say it with warmth and drama"],
    love: ["love loudly and loyally, and want to be adored right back", "give your heart generously and love a grand romantic gesture"],
    drive: ["go after things with pride and plenty of heart", "lead from the front and want to be proud of what you make"],
    gift: ["making everyone around you feel special", "bringing warmth and fun wherever you go"],
    edge: ["knowing your worth even when nobody is clapping", "letting someone else have the spotlight without feeling smaller"],
    trap: "taking it personally when your effort goes unnoticed",
    native: "warmth",
  },
  virgo: {
    title: ["Thoughtful", "Discerning"],
    core: ["helpful, thoughtful and quietly devoted to making things better", "observant, modest and happiest when you are useful"],
    need: ["needs order and a useful job to feel calm", "needs to help, and to feel that things are under control"],
    heart: ["quietly caring", "careful"],
    mind: ["notice every detail and think in clear, practical steps", "analyse carefully and say exactly what you mean"],
    love: ["show love through small, practical acts of care", "love quietly, through attention, effort and remembering the little things"],
    drive: ["work steadily and carefully until it is done properly", "pour your energy into getting the details right"],
    gift: ["noticing what others miss and fixing it before anyone asks", "making life run more smoothly for everyone around you"],
    edge: ["being as kind to yourself as you are to everyone else", "accepting good enough when perfect is costing you your peace"],
    trap: "criticising yourself harder than anyone else ever would",
    native: "being useful",
  },
  libra: {
    title: ["Graceful", "Gracious"],
    core: ["fair, charming and happiest when life feels balanced", "gracious, sociable and a natural peacemaker"],
    need: ["needs harmony, beauty and a partner in crime", "needs calm around you, and finds conflict hard to sit with"],
    heart: ["gentle", "harmonious"],
    mind: ["weigh every side before you speak, and say it with tact", "think in balances and find the fair answer others miss"],
    love: ["love with grace and want a true partnership of equals", "adore romance, beauty and the feeling of being a pair"],
    drive: ["go after things through charm and cooperation rather than force", "work best alongside someone and fight hardest for fairness"],
    gift: ["making people feel seen and heard", "bringing peace to a room that needed it"],
    edge: ["saying what you want, not just what keeps the peace", "choosing for yourself instead of waiting to see what others choose"],
    trap: "agreeing to keep the peace and resenting it later",
    native: "harmony",
  },
  scorpio: {
    title: ["Magnetic", "Deep-souled"],
    core: ["intense, private and loyal to the bone", "deep, determined and unafraid of the truth"],
    need: ["needs total trust before you let anyone in", "needs depth and honesty, and has no time for small talk about feelings"],
    heart: ["deep", "fiercely loyal"],
    mind: ["dig beneath the surface and spot what people are not saying", "think like a detective and keep your cards close"],
    love: ["love intensely and all the way, or not at all", "want a deep, loyal bond with no secrets on either side"],
    drive: ["pursue what you want with quiet, unshakeable focus", "never give up once you have decided, and you play the long game"],
    gift: ["seeing the truth and staying when things get hard", "helping people face what they have been avoiding"],
    edge: ["letting go of a grudge so it stops costing you", "trusting before you have proof, just a little"],
    trap: "keeping score long after it matters",
    native: "depth",
  },
  sagittarius: {
    title: ["Free-spirited", "Adventurous"],
    core: ["adventurous, honest and always looking at the horizon", "optimistic, funny and hungry for the bigger picture"],
    need: ["needs freedom, space and something to look forward to", "needs to know something good is coming, and a bit of room to roam"],
    heart: ["hopeful", "free-roaming"],
    mind: ["think in big ideas and say exactly what you think", "love to learn, teach and argue about the meaning of it all"],
    love: ["love freely and generously, and need a partner who is also an adventure", "want love that feels like a journey, with plenty of laughter"],
    drive: ["aim high and chase the goal with infectious enthusiasm", "go after what you want with optimism and a leap of faith"],
    gift: ["lifting people's spirits and widening their world", "seeing the hopeful way through any mess"],
    edge: ["staying put when feelings get heavy instead of looking for the exit", "following through after the exciting first step"],
    trap: "promising more than there is time to deliver",
    native: "adventure",
  },
  capricorn: {
    title: ["Determined", "Resolute"],
    core: ["ambitious, patient and built to climb", "disciplined, dry-humoured and quietly strong"],
    need: ["needs to feel useful and in control before it can relax", "needs structure and respect, and saves feelings for people who have earned them"],
    heart: ["quietly strong", "reserved"],
    mind: ["think in plans, strategies and long-term goals", "speak carefully and mean every word"],
    love: ["love seriously and show it by building a future together", "take your time to commit, then stay loyal for life"],
    drive: ["climb steadily, one sensible step at a time", "work harder and longer than almost anyone"],
    gift: ["turning big goals into real, lasting results", "being the person everyone can rely on"],
    edge: ["letting yourself rest without having to earn it", "showing your softer side before you feel completely safe"],
    trap: "working through the rest you actually need",
    native: "ambition",
  },
  aquarius: {
    title: ["Original", "Visionary"],
    core: ["original, independent and quietly ahead of your time", "inventive, friendly and true to your own drum"],
    need: ["needs space to be yourself and friends who accept the whole of you", "needs freedom and fresh ideas, and thinks feelings through before sharing them"],
    heart: ["free-thinking", "independent"],
    mind: ["dream up ideas no one else has had yet", "see patterns and possibilities and love a good debate"],
    love: ["need a best friend as much as a lover, and plenty of space", "love in your own unconventional way, loyal but never clingy"],
    drive: ["go after things your own way, often against the crowd", "fight hardest for causes and ideas bigger than yourself"],
    gift: ["seeing a better way that nobody else has thought of", "making outsiders feel they belong"],
    edge: ["letting people close enough to see your feelings", "staying in the room when emotions get messy"],
    trap: "going cool and distant when you are actually hurt",
    native: "originality",
  },
  pisces: {
    title: ["Dreamy", "Intuitive"],
    core: ["dreamy, compassionate and full of imagination", "gentle, intuitive and deeply tuned in to other people"],
    need: ["needs quiet, beauty and time to drift", "needs to feel connected to something bigger, and soaks up every mood around you"],
    heart: ["dreamy", "compassionate"],
    mind: ["think in pictures, feelings and hunches that usually turn out right", "pick up on what is unsaid and express it beautifully"],
    love: ["love with your whole soul and believe in real romance", "give endlessly in love and long for a deep, soulful bond"],
    drive: ["follow your intuition rather than a plan, and it often works", "put your energy into helping, creating and dreaming"],
    gift: ["understanding people without them having to explain", "bringing imagination and kindness into everything"],
    edge: ["keeping firm edges so you do not lose yourself in others", "facing hard things head on rather than drifting away from them"],
    trap: "drifting away from a problem instead of facing it",
    native: "imagination",
  },
};

/** How the Sun's element (who you are) meets the Moon's (what you feel). Keyed "Sun|Moon". */
export const SUN_MOON_MIX: Record<`${WesternElement}|${WesternElement}`, Two> = {
  "Fire|Fire": ["so what you feel and who you are burn as one bright flame", "so your feelings run as hot and honest as the rest of you"],
  "Fire|Earth": ["so behind the bold front sits someone who needs things to feel solid", "so your fire is steadier than people expect"],
  "Fire|Air": ["so your heart is as lively and talkative as your spirit", "so ideas and feelings feed each other and keep you moving"],
  "Fire|Water": ["so the confident face you show hides a heart that feels everything", "so you can seem fearless while feeling far more than you let on"],
  "Earth|Fire": ["so beneath the calm surface burns a quick, passionate heart", "so your steady outside carries a surprisingly fiery inner world"],
  "Earth|Earth": ["so you are grounded through and through, inside and out", "so what people see is exactly what you are: solid all the way down"],
  "Earth|Air": ["so your practical side shares the house with a busy, curious mind", "so you are steady on the outside and buzzing with thoughts within"],
  "Earth|Water": ["so your practical surface protects a soft, feeling heart", "so you look after people with both your hands and your heart"],
  "Air|Fire": ["so your social ease is driven by a passionate, restless heart", "so your ideas come with real fire behind them"],
  "Air|Earth": ["so behind your easy, airy charm is someone who craves stability", "so your head may float but your heart wants solid ground"],
  "Air|Air": ["so you process the world through thought and talk, inside and out", "so your feelings make most sense once you have talked them through"],
  "Air|Water": ["so your easy social smile hides a heart that feels everything", "so your clear head shares space with surprisingly deep feelings"],
  "Water|Fire": ["so your gentle surface hides a fierce, passionate heart", "so your sensitivity comes with real fire when it is needed"],
  "Water|Earth": ["so your deep feelings rest on a practical, steady core", "so you feel deeply but handle life with common sense"],
  "Water|Air": ["so you feel deeply but like to understand your feelings too", "so your sensitivity comes with a cool, thinking streak"],
  "Water|Water": ["so you feel everything, deeply, and read people like a book", "so your inner world is rich, deep and wonderfully intuitive"],
};

/** When the Sun and Moon share a sign. {Sun} is the sign and {img} a picture of that Moon. */
export const SAME_SIGN: string[] = [
  "Your Moon is in {Sun} too, so who you are and what you feel are one and the same, like {img}.",
  "With your Moon also in {Sun}, you are {Sun} through and through: {img}, inside and out.",
  "Your Moon shares your Sun's sign, so the private you is {img} too, with no hidden side.",
  "Sun and Moon both in {Sun} means people get exactly what they see: {img}, all the way down.",
]

export interface LifePathSpot {
  flavour: Two;
  call: Two;
  strength: string;
  edge: Two;
}

export const LIFE_PATH_SPOT: Record<number, LifePathSpot> = {
  1: {
    flavour: ["an independent, pioneering streak", "a strong, self-starting spirit"],
    call: ["you are here to lead the way and trust your own ideas", "life keeps asking you to go first, and you grow every time you do"],
    strength: "the courage to start what others only talk about",
    edge: ["letting others help before you are completely stuck", "asking for other views before you decide"],
  },
  2: {
    flavour: ["a gentle, peacemaking streak", "a deeply intuitive, cooperative heart"],
    call: ["you are here to bring people together and sense what is unspoken", "you are the quiet reason groups work, and gentleness is your strength"],
    strength: "an instinct for what other people need",
    edge: ["putting your own needs on the list too", "speaking up early about the small things"],
  },
  3: {
    flavour: ["a creative, expressive streak", "a joyful, imaginative spark"],
    call: ["you are here to say it, make it and share it", "words, art and laughter are how you light up the world"],
    strength: "a gift for words, creativity and lifting the mood",
    edge: ["focusing your many gifts so they can fully shine", "finishing one thing before starting the next"],
  },
  4: {
    flavour: ["a steady, practical backbone", "a loyal, hard-working streak"],
    call: ["you are here to build things that last", "patience and honest effort are your superpowers"],
    strength: "turning plans into something solid and real",
    edge: ["staying open to change while keeping your solid ground", "letting things be a little messy sometimes"],
  },
  5: {
    flavour: ["a free, adventurous streak", "a restless love of change"],
    call: ["you are here to learn by living, and you collect experiences like treasure", "variety, travel and new ideas keep you feeling alive"],
    strength: "adapting to anything life throws at you",
    edge: ["finding a freedom that still has roots", "sticking with something after it stops being new"],
  },
  6: {
    flavour: ["a warm, nurturing heart", "a deep sense of care and responsibility"],
    call: ["you are here to love, look after people and make life more beautiful", "home, family and the people you care for are your centre"],
    strength: "making people feel loved and looked after",
    edge: ["caring for yourself as generously as you care for others", "letting people solve their own problems"],
  },
  7: {
    flavour: ["a reflective, searching mind", "a deep, quietly spiritual streak"],
    call: ["you are here to ask the big questions and find your own answers", "you need quiet to think, and what you discover is worth sharing"],
    strength: "wisdom, insight and a strong inner compass",
    edge: ["sharing what you discover instead of keeping it inside", "trusting people as much as you trust your own mind"],
  },
  8: {
    flavour: ["an ambitious, capable drive", "a strong instinct for success"],
    call: ["you are here to turn vision into results", "achievement and abundance come naturally when you back yourself"],
    strength: "turning big ideas into real results",
    edge: ["balancing success with rest, generosity and heart", "measuring your worth by more than what you achieve"],
  },
  9: {
    flavour: ["a compassionate, big-picture heart", "a generous, humanitarian streak"],
    call: ["you are here to make the world a little kinder", "you see the bigger picture and want everyone to be all right"],
    strength: "compassion that reaches far beyond your own circle",
    edge: ["letting go gracefully when something is finished", "giving without giving yourself away"],
  },
  11: {
    flavour: ["a master number's intuition", "an inspired, visionary sensitivity"],
    call: ["you can inspire people simply by being yourself", "you pick up on what others miss and carry a sense of bigger purpose"],
    strength: "intuition that borders on knowing",
    edge: ["trusting your sensitivity rather than fearing it", "grounding your big visions in everyday life"],
  },
  22: {
    flavour: ["a master builder's vision", "a rare mix of big dreams and practical skill"],
    call: ["you can turn huge dreams into real, lasting things", "you are here to build something that helps many people"],
    strength: "making big visions practical",
    edge: ["believing the vision is possible", "pacing yourself so the size of the dream does not crush the joy"],
  },
  33: {
    flavour: ["a master teacher's compassion", "a loving, healing energy"],
    call: ["you are here to guide, heal and uplift", "compassion is your path, and people feel better around you"],
    strength: "a healing, generous presence",
    edge: ["serving others without carrying everyone's burdens alone", "letting others look after you too"],
  },
};

/** The Sun's element with the Life Path's number family, as a clause after "Your Libra Sun and Life Path 3". */
export const SUN_FAMILY: Record<string, string> = {
  "Fire|independent minds": "are both made to go their own way, so you trust your gut and rarely wait for permission",
  "Fire|steady builders": "give you spark and structure, so your enthusiasm actually gets things built",
  "Fire|creative hearts": "make you a natural performer, with big feelings, big ideas and the nerve to share them",
  "Earth|independent minds": "keep your own-way thinking grounded, so it turns into practical results",
  "Earth|steady builders": "pull in exactly the same direction, towards things that are patient, practical and made to last",
  "Earth|creative hearts": "give your ideas a pair of capable hands, so they become things people can hold",
  "Air|independent minds": "make a free-thinking mind that loves to question everything",
  "Air|steady builders": "bring the ideas and the follow-through, a rare and useful mix",
  "Air|creative hearts": "make words your superpower, so you think, talk and create in the same breath",
  "Water|independent minds": "pull between closeness and freedom, so you need both your people and time alone",
  "Water|steady builders": "bring feeling and steadiness together, so you care in ways that genuinely last",
  "Water|creative hearts": "make you deeply expressive, with feelings flowing straight into art, words and care",
};

/** A Personal Year in a few words: follows "a year of" or "so expect". */
export const PY_SHORT: Record<number, string[]> = {
  1: ["fresh starts and brave first steps", "planting seeds for the next nine years", "beginning the thing you keep putting off", "new doors and a clean slate"],
  2: ["patience, partnership and quiet growth", "slowing down and letting things ripen", "teamwork and listening closely", "small steps and good company"],
  3: ["fun, friends and creative sparks", "saying yes to invitations", "sharing your ideas and being seen", "laughter and a fuller diary"],
  4: ["hard work that lasts", "routines, plans and solid foundations", "getting organised and building steadily", "rolled-up sleeves and real progress"],
  5: ["change, travel and surprises", "shake-ups and new people", "freedom and a change of scene", "the unexpected, in a good way"],
  6: ["home, family and love", "looking after people and being looked after", "commitments of the heart", "making your space feel like home"],
  7: ["rest, reflection and big questions", "quiet study and inner answers", "time alone to think", "trusting your gut"],
  8: ["harvest, results and recognition", "money matters and stepping up", "reaping what you have sown", "confidence and ambition"],
  9: ["endings, clearing out and forgiving", "finishing what needs finishing", "letting go to make room", "wrapping up a nine-year chapter"],
};

export interface AnimalSpot {
  /** Follows "you carry". */
  spirit: Two;
  /** Follows "your Horse adds". */
  gift: string;
}

export const ANIMAL_SPOT: Record<string, AnimalSpot> = {
  rat: { spirit: ["a quick, resourceful spirit that spots every opportunity", "a clever, adaptable streak and a nose for a good chance"], gift: "a knack for finding a way where others see none" },
  ox: { spirit: ["a patient, dependable strength", "a steady, hard-working spirit that never gives up"], gift: "the stamina to finish what you start" },
  tiger: { spirit: ["a brave, magnetic spirit that loves a challenge", "a bold, passionate courage"], gift: "the courage to stand up for what is right" },
  rabbit: { spirit: ["a gentle, graceful spirit", "a calm, kind and quietly intuitive nature"], gift: "a talent for creating calm and beauty" },
  dragon: { spirit: ["a powerful, visionary energy", "a bold, lucky spirit full of big ideas"], gift: "an energy that makes big things happen" },
  snake: { spirit: ["a wise, perceptive spirit", "a calm, refined and deeply intuitive nature"], gift: "the ability to see straight to the heart of things" },
  horse: { spirit: ["a free, restless spirit", "a lively, independent energy that loves to keep moving"], gift: "an energy that gets everyone moving" },
  goat: { spirit: ["a gentle, creative soul", "an artistic, compassionate spirit that seeks harmony"], gift: "an artist's eye and a soft heart" },
  monkey: { spirit: ["a playful, inventive mind", "a curious, clever spirit that loves a puzzle"], gift: "a talent for solving problems with a grin" },
  rooster: { spirit: ["an observant, honest spirit", "a proud, precise and hard-working nature"], gift: "an eye for detail and a love of the truth" },
  dog: { spirit: ["a loyal, fair-minded heart", "a faithful, protective spirit"], gift: "the loyalty of a true friend for life" },
  pig: { spirit: ["a warm, generous heart", "a sincere, easy-going spirit that loves life's pleasures"], gift: "a generous, kind way of making life feel good" },
};

/** What the year's Chinese element adds to the animal. Follows a comma. */
export const YEAR_ELEMENT_TWIST: Record<ChineseElement, Two> = {
  Wood: ["with a Wood year's urge to grow and help others grow", "softened by Wood's kindness and love of growth"],
  Fire: ["turned up by Fire's warmth and passion", "with Fire's extra spark and charisma"],
  Earth: ["grounded by Earth's patience and common sense", "with Earth's steadiness underneath it all"],
  Metal: ["with a backbone of steel from your Metal year", "sharpened by Metal's focus and strong principles"],
  Water: ["deepened by Water's intuition and flow", "with Water's quiet wisdom running through it"],
};

/**
 * East meets West: the Chinese year element with the Sun sign's element. Keyed "Chinese|Western".
 * {Sun} is the sign and {Animal} the animal. They are never joined into one name like "Libra Horse".
 */
export const EAST_WEST: Record<`${ChineseElement}|${WesternElement}`, string[]> = {
  "Wood|Fire": [
    "East and West agree here: Wood feeds Fire, so your {Sun} spark has endless fuel.",
    "Your Wood year is kindling and your {Sun} Sun is the flame, so once you get going you are hard to put out.",
    "Wood and Fire: your {Animal} keeps feeding your {Sun} enthusiasm, like logs on a winter fire.",
  ],
  "Wood|Earth": [
    "Your Wood year wants to grow while your {Sun} Sun wants to be sure, so you grow slowly, strongly and for good.",
    "Wood roots into Earth, so your {Animal} side keeps reaching for growth while your {Sun} side holds the ground.",
    "Your Wood year and {Sun} Sun are a sapling in a good field: slow to show, impossible to uproot.",
  ],
  "Wood|Air": [
    "Wood and Air make a kind, idea-filled mix: your {Sun} mind keeps finding new ways to help things grow.",
    "Wind spreads seeds, so your {Sun} ideas carry your Wood year's kindness a long way.",
    "Your Wood year gives your {Sun} chatter a purpose: you talk to help things grow.",
  ],
  "Wood|Water": [
    "East and West agree here: Water feeds Wood, so your {Sun} feelings nourish everything you grow.",
    "Your {Sun} Sun waters your Wood year, so the people around you seem to grow when you are near.",
    "Water and Wood: your {Sun} feelings are the rain and your {Animal} is the garden that thrives on it.",
  ],
  "Fire|Fire": [
    "Fire in the East and Fire in the West: your {Animal} and your {Sun} Sun give you warmth and passion twice over, so pace yourself.",
    "Your Fire year and {Sun} Sun make a bonfire, not a candle, so pace yourself and keep some logs back.",
    "Double Fire from your {Animal} and your {Sun} Sun: you light up a room, and you can burn out just as fast.",
  ],
  "Fire|Earth": [
    "Fire warms Earth, so your Fire year brings heat and drive to your patient {Sun} nature.",
    "Your Fire year is the oven and your {Sun} Sun is the bread, so warmth turns into something solid.",
    "Fire bakes Earth hard, so your {Animal} drive makes your {Sun} plans set like brick.",
  ],
  "Fire|Air": [
    "Your Fire year and Air Sun feed each other, so your {Sun} side has charm, energy and plenty to say.",
    "Air feeds fire, so every {Sun} idea gets a gust of your {Animal} energy behind it.",
    "Your Fire year and {Sun} Sun are a kite in a warm wind: up fast and fun to watch.",
  ],
  "Fire|Water": [
    "A Fire year and a Water Sun make steam: your {Sun} side feels deeply while your {Animal} acts boldly, often at the same time.",
    "Your Fire year boils while your {Sun} Sun simmers, so you can be bold and soft in the same breath.",
    "Fire and Water make a hot bath: your {Animal} brings the heat and your {Sun} side makes it soothing.",
  ],
  "Earth|Fire": [
    "Your Earth year steadies your Fire Sun, so your {Sun} enthusiasm has somewhere solid to land.",
    "Your Earth year is the fireplace and your {Sun} Sun is the fire, so your passion stays safe and useful.",
    "Earth holds Fire, so your {Animal} gives your {Sun} spark a place to burn without burning out.",
  ],
  "Earth|Earth": [
    "Earth in the East and Earth in the West: your {Animal} and your {Sun} Sun make you grounded twice over and reliable to the core.",
    "Your Earth year and {Sun} Sun are bedrock: storms pass over you and you are still there in the morning.",
    "Double Earth from your {Animal} and your {Sun} Sun: you are the one everyone leans on when things wobble.",
  ],
  "Earth|Air": [
    "Your Earth year gives your airy {Sun} ideas a firm footing, so your thoughts turn into things.",
    "Your Earth year ties a string to your {Sun} kite, so you can fly high and still come home.",
    "Earth and Air: your {Animal} keeps your feet on the floor while your {Sun} head is in the clouds.",
  ],
  "Earth|Water": [
    "Earth gives Water a shape, so your Earth year gives your deep {Sun} feelings a safe riverbank.",
    "Your Earth year is a riverbank for your {Sun} Sun, so big feelings flow somewhere useful.",
    "Earth and Water make good soil: your {Animal} steadiness and {Sun} feeling grow things together.",
  ],
  "Metal|Fire": [
    "Your Metal year adds edge and discipline to your Fire Sun, so your {Sun} passion comes with precision.",
    "Fire shapes Metal, so your {Sun} passion forges your Metal year into something sharp and useful.",
    "Your Metal year and {Sun} Sun are a blacksmith's forge: heat plus discipline.",
  ],
  "Metal|Earth": [
    "Earth feeds Metal, so your {Sun} patience and your Metal year's focus make you formidable once you commit.",
    "Your Metal year is the blade and your {Sun} Sun the whetstone, so patience only makes you sharper.",
    "Earth makes Metal, so your {Sun} steadiness quietly strengthens your {Animal} backbone.",
  ],
  "Metal|Air": [
    "Metal gives your airy {Sun} ideas a sharp edge and a strong spine, so you want freedom and fairness in equal measure.",
    "Your Metal year is a bell and your {Sun} Sun the air it rings through, so when you speak, people hear it.",
    "Metal and Air: your {Animal} brings the principles and your {Sun} side brings the words for them.",
  ],
  "Metal|Water": [
    "Metal feeds Water, so your Metal year's strength quietly supports your deep {Sun} feelings.",
    "Your Metal year is the cup and your {Sun} Sun the water, so your feelings have something strong to hold them.",
    "Metal feeds Water, so your {Animal} backbone lets your {Sun} heart go deep without going under.",
  ],
  "Water|Fire": [
    "Your Water year cools and deepens your Fire Sun, so your {Sun} side acts boldly but feels things through.",
    "Your Water year and {Sun} Sun make steam: real power when it is channelled, a fog when it isn't.",
    "Water calms Fire, so your {Animal} helps your {Sun} heat cool into wisdom.",
  ],
  "Water|Earth": [
    "Water and Earth make fertile ground: your Water year softens your practical {Sun} side and makes it wiser.",
    "Your Water year is rain on your {Sun} field, so your patience grows into something green.",
    "Water and Earth: your {Animal} brings the flow and your {Sun} side builds the banks.",
  ],
  "Water|Air": [
    "Your Water year adds depth to your airy {Sun} mind, so you understand people as well as ideas.",
    "Your Water year and {Sun} Sun are sea and sky: one feels, one thinks, and they meet at the horizon.",
    "Water and Air: your {Animal} intuition puts real feeling behind your {Sun} ideas.",
  ],
  "Water|Water": [
    "Water in the East and Water in the West: your {Animal} and your {Sun} Sun make you intuitive twice over, and you read people effortlessly.",
    "Your Water year and {Sun} Sun make a deep ocean: calm on top, a whole world underneath.",
    "Double Water from your {Animal} and your {Sun} Sun: you can read the mood of a group chat from one emoji.",
  ],
};

/** How the animal's yin or yang year shows: follows "you". */
export const ANIMAL_POLARITY: Record<string, string[]> = {
  rat: ["move first and think on your feet", "jump on a chance before anyone else has spotted it", "keep busy, keep curious and keep a plan B"],
  ox: ["watch, wait and then move with total commitment", "prove yourself quietly rather than loudly", "save your energy for what really matters"],
  tiger: ["throw yourself in and sort out the details later", "meet a challenge head on, chin up", "act on instinct and trust it"],
  rabbit: ["read the room long before you speak", "win people over gently rather than loudly", "protect your peace and pick your moments"],
  dragon: ["walk in and take up space without apologising", "start big and expect things to work out", "lead from the front and pull others along"],
  snake: ["think three moves ahead and say less than you know", "keep your cards close and your timing perfect", "move quietly and act at exactly the right moment"],
  horse: ["are already moving while others are still deciding", "need movement, plans and fresh air to feel like yourself", "act first and enjoy the ride"],
  goat: ["feel your way into things rather than rushing", "do your best in a calm, kind setting", "take things in deeply before you respond"],
  monkey: ["try things out loud and learn by doing", "jump in, play with it and find the clever route", "keep things moving with quick ideas"],
  rooster: ["prepare carefully and turn up ready", "notice the details and quietly put them right", "watch first, then speak with confidence"],
  dog: ["stand up for people straight away", "act the moment something feels unfair", "throw your energy behind the people you love"],
  pig: ["take life at a kind, unhurried pace", "enjoy the moment rather than chase the next one", "give generously and without fuss"],
};

/** When three or more of the five personal planets share an element. */
export const ELEMENT_LEADS: Record<WesternElement, string[]> = {
  Fire: ["With most of your personal planets in Fire, you run on enthusiasm, courage and instinct.", "Fire leads your chart, so energy and confidence are your default settings.", "Three or more of your personal planets are in Fire, so you warm up any room and get bored of waiting fast.", "Fire runs through most of your chart: you are the one who says \"why not today?\""],
  Earth: ["With most of your personal planets in Earth, you are practical, patient and good at making things real.", "Earth leads your chart, so common sense and steadiness are your default settings.", "Most of your personal planets sit in Earth, so you trust what you can see, touch and count.", "Earth runs through most of your chart: you are the one who actually books the table and turns up."],
  Air: ["With most of your personal planets in Air, you live in ideas, conversation and connection.", "Air leads your chart, so thinking, talking and connecting are your default settings.", "Most of your personal planets sit in Air, so a good conversation does more for you than almost anything.", "Air runs through most of your chart: you are the one keeping the group chat alive."],
  Water: ["With most of your personal planets in Water, feeling and intuition guide almost everything you do.", "Water leads your chart, so empathy and intuition are your default settings.", "Most of your personal planets sit in Water, so you feel the mood of a room the moment you walk in.", "Water runs through most of your chart: you are the one who knows something is wrong before anyone says a word."],
};

/** When none of the five personal planets is in an element: a clause. */
export const ELEMENT_MISSING: Record<WesternElement, string[]> = {
  Fire: ["you may need a push to start things, and enthusiastic people are good for you", "you rarely rush in, so a friend who drags you out on a whim can be a gift", "motivation can take a while to warm up, so set yourself small, fun deadlines"],
  Earth: ["routines and practical details may take effort, and grounded friends help", "budgets and to-do lists may not come naturally, so keep them simple", "your body may need reminding to eat, sleep and slow down"],
  Air: ["you may feel things before you can put them into words, and that is fine", "talking things through may feel awkward, so writing it down can help", "you act on instinct more than overthinking, which keeps you honest"],
  Water: ["feelings may be easier to act on than to talk about", "you may need a moment to notice what you feel, so check in with yourself", "other people's moods can puzzle you, so asking directly beats guessing"],
};

/** When three or more of the five personal planets share a modality. {planets} is "your Sun, Moon and Mars". */
export const MODALITY_LEADS: Record<Modality, string[]> = {
  Cardinal: ["You are a natural starter: {planets} all sit in cardinal signs, the ones that get things moving.", "With {planets} in cardinal signs, you would rather start the new thing than maintain the old one.", "{Planets} all sit in cardinal signs, so you are usually the one who gets the ball rolling."],
  Fixed: ["You are a natural finisher: {planets} all sit in fixed signs, steady and hard to shift.", "With {planets} in fixed signs, once you are in, you are in for good.", "{Planets} all sit in fixed signs, so you see things through long after others have wandered off."],
  Mutable: ["You are a natural adapter: {planets} all sit in mutable signs, flexible and good with change.", "With {planets} in mutable signs, you bend rather than break when plans change.", "{Planets} all sit in mutable signs, so a change of plan rarely throws you."],
};

/** Three or more personal planets in one sign. {Count} is "Three", "Four" or "All five". */
export const STELLIUM: Two = [
  "{Count} of your personal planets sit in {Sign}, which makes {native} your native language.",
  "With {count} personal planets in {Sign}, {native} runs through everything you do.",
];

/** Venus (what you love) against Mars (how you chase it), by how their signs meet. A clause after the two pictures. */
export const VENUS_MARS: Record<"easy" | "care" | "mixed", string[]> = {
  easy: ["and the two get on, so what you love and how you chase it pull the same way", "and they work together, so your heart and your drive rarely argue", "and they are on the same side, so you go after what you want without second-guessing it"],
  care: ["and the two pull in different directions, so what you long for and how you chase it can clash", "and they don't always agree, which gives your love life spark and the odd inner tug of war", "and they argue now and then, so you can want closeness and then push it away"],
  mixed: ["and they speak different languages, so you might want one thing and chase another", "and they are neighbours with different styles, which makes you more complex than you first seem", "and they sit side by side without quite matching, so your heart and your drive take turns"],
};

/** Mercury beside the Sun. {Sun} and {Mer} are signs, {aKw} Mercury's keywords with "a" or "an", {chat} an everyday moment. */
export const MERCURY_SUN: { same: string[]; other: string[] } = {
  same: [
    "Your Mercury shares your {Sun} Sun's sign, so your words sound exactly like you: you're the one {chat}.",
    "With Mercury in {Sun} too, there is no gap between what you think and what you say, and it shows when you're {chat}.",
    "Mercury in {Sun} as well means you talk the way you live; in the group chat you're {chat}.",
  ],
  other: ["Your Mercury in {Mer} gives your {Sun} nature {aKw} way of thinking.", "Mercury in {Mer} adds {aKw} accent to the way you think and talk."],
};
