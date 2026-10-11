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

/** When the Sun and Moon share a sign. {Sun} is the sign. */
export const SAME_SIGN: Two = [
  "Your Moon is in {Sun} too, so who you are and what you feel are one and the same: there is no hidden side to you.",
  "With your Moon also in {Sun}, you are {Sun} through and through, and people get exactly what they see.",
];

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

/** The Sun's element with the Life Path's number family. {n} is the Life Path. */
export const SUN_FAMILY: Record<string, string> = {
  "Fire|independent minds": "Your Fire Sun and Life Path {n} are both made to go their own way, so you trust your gut and rarely wait for permission.",
  "Fire|steady builders": "Your Fire Sun brings the spark and your {n} brings the structure, so your enthusiasm actually gets things built.",
  "Fire|creative hearts": "Your Fire Sun and a creative {n} make you a natural performer: big feelings, big ideas and the nerve to share them.",
  "Earth|independent minds": "Your Earth Sun keeps your independent {n} grounded, so your own-way thinking turns into practical results.",
  "Earth|steady builders": "Your Earth Sun and a builder's {n} pull in exactly the same direction: patient, practical and made to last.",
  "Earth|creative hearts": "Your Earth Sun gives your creative {n} a pair of capable hands, so your ideas become things people can hold.",
  "Air|independent minds": "Your Air Sun and an independent {n} make a free-thinking mind that loves to question everything.",
  "Air|steady builders": "Your Air Sun brings the ideas and your {n} brings the follow-through, a rare and useful mix.",
  "Air|creative hearts": "Your Air Sun and a creative {n} make words your superpower: you think, talk and create in the same breath.",
  "Water|independent minds": "Your Water Sun feels deeply while your {n} wants to stand alone, so you need both close people and time to yourself.",
  "Water|steady builders": "Your Water Sun brings the feeling and your {n} brings the steadiness, so you care in ways that genuinely last.",
  "Water|creative hearts": "Your Water Sun and a creative {n} make you deeply expressive: feelings flow straight into art, words and care.",
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
export const EAST_WEST: Record<`${ChineseElement}|${WesternElement}`, string> = {
  "Wood|Fire": "East and West agree here: Wood feeds Fire, so your {Sun} spark has endless fuel.",
  "Wood|Earth": "Your Wood year wants to grow while your {Sun} Sun wants to be sure, so you grow slowly, strongly and for good.",
  "Wood|Air": "Wood and Air make a kind, idea-filled mix: your {Sun} mind keeps finding new ways to help things grow.",
  "Wood|Water": "East and West agree here: Water feeds Wood, so your {Sun} feelings nourish everything you grow.",
  "Fire|Fire": "Fire in the East and Fire in the West: your {Animal} and your {Sun} Sun give you warmth and passion twice over, so pace yourself.",
  "Fire|Earth": "Fire warms Earth, so your Fire year brings heat and drive to your patient {Sun} nature.",
  "Fire|Air": "Your Fire year and Air Sun feed each other, so your {Sun} side has charm, energy and plenty to say.",
  "Fire|Water": "A Fire year and a Water Sun make steam: your {Sun} side feels deeply while your {Animal} acts boldly, often at the same time.",
  "Earth|Fire": "Your Earth year steadies your Fire Sun, so your {Sun} enthusiasm has somewhere solid to land.",
  "Earth|Earth": "Earth in the East and Earth in the West: your {Animal} and your {Sun} Sun make you grounded twice over and reliable to the core.",
  "Earth|Air": "Your Earth year gives your airy {Sun} ideas a firm footing, so your thoughts turn into things.",
  "Earth|Water": "Earth gives Water a shape, so your Earth year gives your deep {Sun} feelings a safe riverbank.",
  "Metal|Fire": "Your Metal year adds edge and discipline to your Fire Sun, so your {Sun} passion comes with precision.",
  "Metal|Earth": "Earth feeds Metal, so your {Sun} patience and your Metal year's focus make you formidable once you commit.",
  "Metal|Air": "Metal gives your airy {Sun} ideas a sharp edge and a strong spine, so you want freedom and fairness in equal measure.",
  "Metal|Water": "Metal feeds Water, so your Metal year's strength quietly supports your deep {Sun} feelings.",
  "Water|Fire": "Your Water year cools and deepens your Fire Sun, so your {Sun} side acts boldly but feels things through.",
  "Water|Earth": "Water and Earth make fertile ground: your Water year softens your practical {Sun} side and makes it wiser.",
  "Water|Air": "Your Water year adds depth to your airy {Sun} mind, so you understand people as well as ideas.",
  "Water|Water": "Water in the East and Water in the West: your {Animal} and your {Sun} Sun make you intuitive twice over, and you read people effortlessly.",
};

export const YIN_YANG: Record<"Yin" | "Yang", Two> = {
  Yang: ["A yang year means you meet life head on and tend to act first.", "Yours is a yang year, so you lean outward: bold, active and quick to start."],
  Yin: ["A yin year means you watch first, feel deeply and act with care.", "Yours is a yin year, so you lean inward: thoughtful, receptive and quietly strong."],
};

/** When three or more of the five personal planets share an element. */
export const ELEMENT_LEADS: Record<WesternElement, Two> = {
  Fire: ["With most of your personal planets in Fire, you run on enthusiasm, courage and instinct.", "Fire leads your chart, so energy and confidence are your default settings."],
  Earth: ["With most of your personal planets in Earth, you are practical, patient and good at making things real.", "Earth leads your chart, so common sense and steadiness are your default settings."],
  Air: ["With most of your personal planets in Air, you live in ideas, conversation and connection.", "Air leads your chart, so thinking, talking and connecting are your default settings."],
  Water: ["With most of your personal planets in Water, feeling and intuition guide almost everything you do.", "Water leads your chart, so empathy and intuition are your default settings."],
};

/** When none of the five personal planets is in an element. */
export const ELEMENT_MISSING: Record<WesternElement, string> = {
  Fire: "With no Fire among your personal planets, you may need a push to start things, and enthusiastic people are good for you.",
  Earth: "With no Earth among your personal planets, routines and practical details may take effort, and grounded friends help.",
  Air: "With no Air among your personal planets, you may feel things before you can put them into words, and that is fine.",
  Water: "With no Water among your personal planets, feelings may be easier to act on than to talk about.",
};

/** When three or more of the five personal planets share a modality. */
export const MODALITY_LEADS: Record<Modality, string> = {
  Cardinal: "You are a natural starter: most of your planets sit in cardinal signs, the ones that get things moving.",
  Fixed: "You are a natural finisher: most of your planets sit in fixed signs, steady and hard to shift.",
  Mutable: "You are a natural adapter: most of your planets sit in mutable signs, flexible and good with change.",
};

/** Three or more personal planets in one sign. {Count} is "Three", "Four" or "All five". */
export const STELLIUM: Two = [
  "{Count} of your personal planets sit in {Sign}, which makes {native} your native language.",
  "With {count} personal planets in {Sign}, {native} runs through everything you do.",
];

/** Venus (what you love) against Mars (how you chase it), by how their signs meet. {V} and {M} are the signs. */
export const VENUS_MARS: Record<"easy" | "care" | "mixed", Two> = {
  easy: [
    "Your Venus in {V} and Mars in {M} get on well, so what you love and how you chase it pull the same way.",
    "Venus in {V} and Mars in {M} work together, so your heart and your drive rarely argue.",
  ],
  care: [
    "Venus in {V} and Mars in {M} pull in different directions, so what you long for and how you go after it can clash, and learning to blend them is part of your story.",
    "Your Venus in {V} and Mars in {M} don't always agree, which gives your love life spark and the odd inner tug of war.",
  ],
  mixed: [
    "Venus in {V} and Mars in {M} sit side by side but speak different languages, so you might want one thing and chase another.",
    "Your Venus in {V} and Mars in {M} are neighbours with different styles, which makes you more complex than you first seem.",
  ],
};

/** Mercury beside the Sun. {Sun} and {Mer} are signs, {aKw} Mercury's sign keywords with "a" or "an". */
export const MERCURY_SUN: { same: Two; other: Two } = {
  same: ["Your Mercury shares your Sun's sign, so you say what you mean and mean what you say.", "With Mercury in {Sun} too, your words sound exactly like you."],
  other: ["Your Mercury in {Mer} gives your {Sun} nature {aKw} way of thinking.", "Mercury in {Mer} adds {aKw} accent to the way you think and talk."],
};
