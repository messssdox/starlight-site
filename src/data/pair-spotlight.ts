// Wording for "Meet the two of you", the spotlight at the top of a relationship reading.
// It reads the pair as one: what each of you brings the other, where you click, where you
// rub and your story together. Each piece has two or more wordings, and src/lib/pair-spotlight.ts
// picks one from both birth dates, so two pairs with the same signs still read differently.
//
// House style (the user's rules): plain, warm, complete sentences with no metaphors or sayings.
// Every line names something from one of the two charts, so the wording varies with the people
// rather than with stock examples.
//
// Placeholders: {a} is your sign and {b} the other person's, {their} is the other person's
// possessive ("Sam's", "your partner's"), {them} the other person, {link} how the two signs sit
// in plain words ("sit directly opposite each other"). {xA}/{xB} are each sign's way of thinking,
// loving or acting ("think quickly and say things plainly"), and {kwA}/{kwB} its keywords.
// Lines never say which of you is which element, so they read right either way round.

import type { SignId } from "./astrology.ts";
import type { Tone } from "./synastry.ts";
import type { Relation } from "../lib/chinese.ts";

type Two = [string, string];

/** The pair's title noun, from both Sun elements (alphabetical key). */
export const PAIR_NOUN: Record<string, string[]> = {
  "Fire|Fire": ["Blaze", "Bonfire", "Beacon"],
  "Earth|Earth": ["Oak", "Mountain", "Orchard"],
  "Air|Air": ["Breeze", "Skylark", "Horizon"],
  "Water|Water": ["Tide", "Wellspring", "Lagoon"],
  "Earth|Fire": ["Flame", "Hearth", "Forge"],
  "Air|Fire": ["Wildfire", "Comet", "Lantern"],
  "Fire|Water": ["Hot Spring", "Storm", "Geyser"],
  "Air|Earth": ["Kite", "Windmill", "Meadow"],
  "Earth|Water": ["Garden", "Riverbank", "Harbour"],
  "Air|Water": ["Rainbow", "Sea Breeze", "Sailboat"],
};

/** The pair's title adjective, from both Life Path families (alphabetical key). */
export const PAIR_ADJ: Record<string, string[]> = {
  "steady builders|steady builders": ["Steady", "Solid", "Trusty", "Patient"],
  "creative hearts|creative hearts": ["Golden", "Bright", "Glowing", "Tender"],
  "independent minds|independent minds": ["Free", "Wandering", "Restless", "Curious"],
  "independent minds|steady builders": ["Anchored", "Daring", "Grounded", "Bold"],
  "creative hearts|independent minds": ["Spirited", "Lively", "Bright-eyed", "Searching"],
  "creative hearts|steady builders": ["Warm", "Faithful", "Gentle", "Homely"],
};

/** What a Sun in each sign brings to someone else: a noun phrase with no "you" or "they" in it. */
export const SUN_GIVES: Record<SignId, Two> = {
  aries: ["courage and a push to get going", "honest nerve and a taste for adventure"],
  taurus: ["calm, comfort and a steady hand", "patience and a sense that things will last"],
  gemini: ["fresh ideas and easy conversation", "curiosity, wit and a lighter mood"],
  cancer: ["warmth and a real sense of home", "care, a long memory for what matters and a reliable welcome"],
  leo: ["warmth, praise and a generous heart", "confidence, fun and loyal encouragement"],
  virgo: ["practical help and thoughtful attention", "a calm eye for detail and quiet, useful care"],
  libra: ["fairness, charm and a peaceful manner", "balance, good taste and easy company"],
  scorpio: ["depth, loyalty and fierce protection", "honesty, focus and lasting trust"],
  sagittarius: ["optimism, laughter and a wider outlook", "adventure, honesty and a sense of meaning"],
  capricorn: ["structure, ambition and steady support", "patience, plans and a long-term view"],
  aquarius: ["originality and room to breathe", "new ideas and friendship with no conditions"],
  pisces: ["tenderness, imagination and compassion", "gentleness, intuition and a vivid imagination"],
};

/** Each animal's best quality, and the softer side another animal can help with. Nouns. */
export const ANIMAL_SIDES: Record<string, { quality: Two; soft: Two }> = {
  rat: { quality: ["quick wits", "sharp eye for a chance"], soft: ["restless worrying", "busy mind"] },
  ox: { quality: ["patience", "steady strength"], soft: ["stubborn streak", "habit of carrying too much"] },
  tiger: { quality: ["courage", "energy"], soft: ["restlessness", "big feelings"] },
  rabbit: { quality: ["gentleness", "tact"], soft: ["worries", "need for peace"] },
  dragon: { quality: ["vision", "confidence"], soft: ["big plans", "pride"] },
  snake: { quality: ["wisdom", "calm insight"], soft: ["secrecy", "tendency to overthink"] },
  horse: { quality: ["energy", "independence"], soft: ["restlessness", "impatience"] },
  goat: { quality: ["kindness", "creativity"], soft: ["daydreaming", "sensitivity"] },
  monkey: { quality: ["wit", "inventiveness"], soft: ["mischief", "quick boredom"] },
  rooster: { quality: ["honesty", "eye for detail"], soft: ["high standards", "need to be right"] },
  dog: { quality: ["loyalty", "sense of fairness"], soft: ["worry", "watchfulness"] },
  pig: { quality: ["warmth", "generosity"], soft: ["easy-going ways", "trusting nature"] },
};

/** How one animal's quality meets the other's softer side, by where they sit on the wheel. */
export const ANIMAL_VERB: Record<Relation, Two> = {
  secret: ["protects", "complements"],
  friend: ["steadies", "supports"],
  same: ["understands", "mirrors"],
  neutral: ["balances", "sits easily beside"],
  clash: ["challenges", "tests"],
};

/** Where you click: a planet pair that gets on. */
export const CLICK_PLANET: Record<"sun" | "mercury" | "venus" | "mars", string[]> = {
  sun: [
    "Your {a} Sun is {kwA} and {their} {b} Sun is {kwB}; the two signs {link}, so you accept each other's character easily.",
    "With Suns in {a} and {b}, which {link}, your {kwA} nature and {their} {kwB} one sit comfortably together.",
    "Suns in {a} and {b} {link}, so {their} {kwB} way of being suits your own {kwA} one.",
  ],
  mercury: [
    "Your {a} Mercury means you {xA}. {Their} {b} Mercury means {them} tends to {xB}, and as the signs {link}, you understand each other quickly.",
    "Mercury, the planet of communication, is in {a} for you and {b} for {them}, and the signs {link}. You {xA}, and that suits {them}.",
    "With Mercury in {a} and {b}, which {link}, talking comes easily. {Them} tends to {xB}, which fits the way you {xA}.",
  ],
  venus: [
    "Your {a} Venus means you {xA}. {Their} {b} Venus means {them} tends to {xB}, and as the signs {link}, affection lands well both ways.",
    "Venus, the planet of affection, is in {a} for you and {b} for {them}, and the signs {link}. {Them} tends to {xB}, which suits you.",
    "With Venus in {a} and {b}, which {link}, care comes easily. You {xA}, and {them} enjoys receiving exactly that.",
  ],
  mars: [
    "Your {a} Mars means you {xA}. {Their} {b} Mars means {them} tends to {xB}, and as the signs {link}, you pull in the same direction.",
    "Mars, the planet of drive, is in {a} for you and {b} for {them}, and the signs {link}, so your energy and {their} fit together.",
    "With Mars in {a} and {b}, which {link}, shared jobs get done. You {xA}, while {them} tends to {xB}.",
  ],
};

/** Where you click, when both people have the planet in the same sign. */
export const CLICK_SAME: Record<"sun" | "mercury" | "venus" | "mars", string[]> = {
  sun: [
    "You are both {a} Suns, {kwA}, so you recognise yourselves in each other.",
    "With both Suns in {a}, you share a {kwA} nature and rarely need to explain yourselves.",
  ],
  mercury: [
    "Sharing a Mercury sign, {a}, means you think alike: you {xA}, and {them} tends to {xB}.",
    "Mercury, the planet of communication, is in {a} for you both, so conversation is easy: you {xA}, and {them} tends to {xB}.",
  ],
  venus: [
    "Sharing a Venus sign, {a}, means affection comes naturally: you {xA}, and {them} tends to {xB}.",
    "Venus is in {a} for you both, so care is easily understood: you {xA}, and {them} tends to {xB}.",
  ],
  mars: [
    "Sharing a Mars sign, {a}, means you pull the same way: you {xA}, and {them} tends to {xB}.",
    "Mars, the planet of drive, is in {a} for you both, so shared work moves quickly: you {xA}, and {them} tends to {xB}.",
  ],
};

/** Where you rub: a planet pair that pulls against itself. Same placeholders as CLICK_PLANET. */
export const RUB_PLANET: Record<"sun" | "mercury" | "venus" | "mars", string[]> = {
  sun: [
    "Your {a} Sun is {kwA} and {their} {b} Sun is {kwB}; the two signs {link}, so what seems obvious to one of you can puzzle the other.",
    "Your Suns, {a} and {b}, {link}, so your {kwA} nature and {their} {kwB} one can grate on each other.",
    "{Their} {b} Sun and your {a} one {link}, so {their} {kwB} way of being can feel foreign to your {kwA} one.",
  ],
  mercury: [
    "Your {a} Mercury means you {xA}. {Their} {b} Mercury means {them} tends to {xB}, and as the signs {link}, a simple message can be misread.",
    "Mercury, the planet of communication, sits in {b} for {them} but {a} for you, and the signs {link}. You {xA}, which {them} can find hard to follow.",
    "{Their} {b} Mercury and your {a} one {link}, so {their} {kwB1} way of talking and your {kwA1} one can stall a conversation. {Them} tends to {xB}, and that can clash with the way you {xA}.",
  ],
  venus: [
    "Your {a} Venus means you {xA}. {Their} {b} Venus means {them} tends to {xB}, and as the signs {link}, a kind gesture can go unnoticed.",
    "Venus, the planet of affection, sits in {b} for {them} but {a} for you, and the signs {link}. {Them} tends to {xB}, which may not feel like care to you.",
    "{Their} {b} Venus and your {a} one {link}, so affection can miss its mark. You {xA}, which is not always what {them} is looking for.",
  ],
  mars: [
    "Your {a} Mars means you {xA}. {Their} {b} Mars means {them} tends to {xB}, and as the signs {link}, tempers can meet head-on.",
    "Mars, the planet of drive, sits in {b} for {them} but {a} for you, and the signs {link}, so you work at different speeds.",
    "{Their} {b} Mars and your {a} one {link}, so shared jobs can cause friction. You {xA}, while {them} tends to {xB}.",
  ],
};

/** Both Moons, by their elements (alphabetical key): how your feelings meet. */
export const MOON_MEET: Record<string, string[]> = {
  "Fire|Fire": [
    "Your {mkA} {a} Moon and {their} {mkB} {b} Moon are both Fire, so feelings come out fast, honest and warm, and pass just as quickly.",
    "With your {mkA} {a} Moon and {their} {mkB} {b} Moon, you both feel in quick, strong bursts, and neither of you needs things spelled out.",
    "Two Fire Moons, your {mkA} {a} one and {their} {mkB} {b} one, mean you both react quickly and recover quickly, which keeps arguments short.",
  ],
  "Earth|Earth": [
    "Your {mkA} {a} Moon and {their} {mkB} {b} Moon are both Earth, so you both feel safe with routine, comfort and promises kept.",
    "With your {mkA} {a} Moon and {their} {mkB} {b} Moon, you comfort each other in practical ways: a meal, a plan, a job done.",
    "Two Earth Moons, your {mkA} {a} one and {their} {mkB} {b} one, mean you both value reliability and show care through actions.",
  ],
  "Air|Air": [
    "Your {mkA} {a} Moon and {their} {mkB} {b} Moon are both Air, so you understand each other best by talking things through.",
    "With your {mkA} {a} Moon and {their} {mkB} {b} Moon, you both need space to think and a good conversation to feel close.",
    "Two Air Moons, your {mkA} {a} one and {their} {mkB} {b} one, mean you both process feelings by discussing them, which keeps things clear.",
  ],
  "Water|Water": [
    "Your {mkA} {a} Moon and {their} {mkB} {b} Moon are both Water, so you sense each other's moods before a word is said.",
    "With your {mkA} {a} Moon and {their} {mkB} {b} Moon, you both feel things strongly and rarely need to explain a hurt.",
    "Two Water Moons, your {mkA} {a} one and {their} {mkB} {b} one, mean you understand each other's feelings well, though you can share a low mood too.",
  ],
  "Earth|Fire": [
    "Your {mkA} {a} Moon and {their} {mkB} {b} Moon mix Fire and Earth: one of you reacts at once, the other wants time to be sure.",
    "With your {mkA} {a} Moon and {their} {mkB} {b} Moon, one of you reacts quickly and the other slowly, so hard days need patience.",
    "Your {mkA} {a} Moon and {their} {mkB} {b} Moon, one Fire and one Earth, mean one of you wants action and the other wants stability when things go wrong.",
  ],
  "Air|Fire": [
    "Your {mkA} {a} Moon and {their} {mkB} {b} Moon mix Fire and Air, so feelings turn quickly into talk and plans.",
    "With your {mkA} {a} Moon and {their} {mkB} {b} Moon, one of you encourages the other's enthusiasm, and cheering each other up comes easily.",
    "Your {mkA} {a} Moon and {their} {mkB} {b} Moon, one Fire and one Air, mean you lift each other's mood through energy and conversation.",
  ],
  "Fire|Water": [
    "Your {mkA} {a} Moon and {their} {mkB} {b} Moon mix Fire and Water: one of you wants to act on a feeling, the other wants to sit with it.",
    "With your {mkA} {a} Moon and {their} {mkB} {b} Moon, one of you reacts loudly and the other withdraws, so hard days need patience on both sides.",
    "Your {mkA} {a} Moon and {their} {mkB} {b} Moon, one Fire and one Water, mean one of you moves on quickly while the other needs more time.",
  ],
  "Air|Earth": [
    "Your {mkA} {a} Moon and {their} {mkB} {b} Moon mix Air and Earth: one of you wants to talk a feeling through, the other wants to act on it.",
    "With your {mkA} {a} Moon and {their} {mkB} {b} Moon, comfort means different things: a conversation for one of you, a practical fix for the other.",
    "Your {mkA} {a} Moon and {their} {mkB} {b} Moon, one Air and one Earth, mean one of you analyses feelings and the other prefers to deal with them practically.",
  ],
  "Earth|Water": [
    "Your {mkA} {a} Moon and {their} {mkB} {b} Moon mix Earth and Water, a supportive match: one gives stability, the other tenderness.",
    "With your {mkA} {a} Moon and {their} {mkB} {b} Moon, you look after each other naturally, through steady care and gentle feeling.",
    "Your {mkA} {a} Moon and {their} {mkB} {b} Moon, one Earth and one Water, mean one of you offers practical care and the other emotional understanding.",
  ],
  "Air|Water": [
    "Your {mkA} {a} Moon and {their} {mkB} {b} Moon mix Air and Water: one of you thinks about feelings, the other simply feels them.",
    "With your {mkA} {a} Moon and {their} {mkB} {b} Moon, one of you wants to understand and the other wants to be understood, so take turns.",
    "Your {mkA} {a} Moon and {their} {mkB} {b} Moon, one Air and one Water, mean one of you needs to talk and the other needs to be heard.",
  ],
};

/** Both Moons in the same sign. */
export const SAME_MOON: string[] = [
  "You both have {anA} Moon, {mkA} in both of you, so you need the same things to feel safe, and you often know without asking.",
  "With both Moons in {a}, the {mkA} sign, comfort means the same thing to you both, which helps on good days and doubles the strain on bad ones.",
  "Sharing {anA} Moon, {aMkA} sign, means you recover from a bad day in the same way, so you rarely need to explain yourselves.",
  "Each of you has {anA} Moon, {aMkA} sign, so your emotional needs match closely, including the difficult ones.",
];

/** Both Moons opposite each other: the same element family, but needs that pull apart. */
export const MOON_OPPOSITE: string[] = [
  "Your {mkA} {a} Moon and {their} {mkB} {b} Moon sit opposite each other, so you need opposite things to feel safe, and each of you has what the other lacks.",
  "With your {mkA} {a} Moon opposite {their} {mkB} {b} Moon, what comforts one of you can feel like too much or too little to the other.",
  "Your {mkA} {a} Moon and {their} {mkB} {b} Moon face each other across the zodiac, so your emotional needs differ but also complement each other.",
  "Opposite Moons, your {mkA} {a} one and {their} {mkB} {b} one, mean one of you often wants the reverse of the other on a hard day.",
];

/** The animals on the wheel, when they help. {A1} is your animal, {A2} the other's, {qA}/{qB} their qualities. */
export const ANIMAL_CLICK: Partial<Record<Relation, string[]>> = {
  friend: [
    "On the Chinese wheel your {A1} and {their} {A2} sit in the same friend group, so your {qA} and {their} {qB} back each other up.",
    "Your {A1} and {their} {A2} are friends on the Chinese wheel, which adds an everyday loyalty: your {qA} and {their} {qB} work together.",
  ],
  secret: [
    "Your {A1} and {their} {A2} are secret friends on the Chinese wheel, one of its closest matches, so your {qA} and {their} {qB} support each other.",
    "On the Chinese wheel your {A1} and {their} {A2} are secret friends, a pairing said to give quiet support, so your {qA} brings out {their} {qB}.",
  ],
  same: [
    "You are both {A1s}, so you understand each other's instincts, including the {qA} and the {softA}.",
    "Two {A1s} know each other's habits well: the {qA} and the {softA} alike.",
  ],
};

/** The animals on the wheel, when they pull apart. */
export const ANIMAL_RUB: string[] = [
  "Your {A1} and {their} {A2} sit opposite each other on the Chinese wheel, so your {qA} and {their} {qB} often pull in different directions.",
  "On the Chinese wheel your {A1} and {their} {A2} face each other from opposite sides, so your {softA} and {their} {softB} can clash.",
];

/** What each Chinese year element contributes, for the element lines. */
export const ELEMENT_TRAIT: Record<string, string> = {
  Wood: "growth", Fire: "warmth", Earth: "steadiness", Metal: "discipline", Water: "intuition",
};

/** Year elements: one feeds the other (help) or keeps it in check (rub). {E1} is the giver, {t1}/{t2} the traits. */
export const ELEMENT_FEED: string[] = [
  "{Who1} {E1} year feeds {who2} {E2} year, so {t1} from one of you helps the other's {t2} grow.",
  "In the five Chinese elements, {who1} {E1} feeds {who2} {E2}, which makes support between you feel natural: {t1} strengthening {t2}.",
];
export const ELEMENT_CHECK: string[] = [
  "{Who1} {E1} year keeps {who2} {E2} year in check, so {t1} can steady {t2}, though it can feel like being held back.",
  "In the five Chinese elements, {who1} {E1} restrains {who2} {E2}: useful when {t1} tempers {t2}, harder when it turns into control.",
];

/** Life Paths in the same family. {n1}/{n2} are the numbers, {f1}/{f2} what each brings, {kw1}/{kw2} their names. */
export const FAMILY_CLICK: Record<string, string[]> = {
  "independent minds": [
    "Life Paths {n1} and {n2} are both independent minds, {f1} meeting {f2}, so you give each other room without taking it personally.",
    "Your Life Paths, the {kw1} and the {kw2}, are both independent minds, so you respect each other's freedom.",
  ],
  "steady builders": [
    "Life Paths {n1} and {n2} are both steady builders, {f1} meeting {f2}, so you want the same solid things from life.",
    "Your Life Paths, the {kw1} and the {kw2}, are both steady builders, so you trust each other's effort.",
  ],
  "creative hearts": [
    "Life Paths {n1} and {n2} are both creative hearts, {f1} meeting {f2}, so warmth and expression flow both ways.",
    "Your Life Paths, the {kw1} and the {kw2}, are both creative hearts, so you encourage each other's ideas.",
  ],
};
export const SAME_LIFE_PATH: string[] = [
  "You share Life Path {n1}, the {kw1}, so you want similar things from life and recognise them in each other.",
  "With the same Life Path, {n1}, you share {s1}, and you recognise it in each other straight away.",
];

/** Life Paths in different families (alphabetical key). Same placeholders as FAMILY_CLICK. */
export const FAMILY_RUB: Record<string, string[]> = {
  "independent minds|steady builders": [
    "Life Path {n1} brings {f1} and Life Path {n2} brings {f2}: freedom meets structure, and each of you can feel hemmed in or let down.",
    "With Life Paths {n1} and {n2}, the {kw1} and the {kw2}, one of you wants room to roam and the other a solid plan.",
  ],
  "creative hearts|independent minds": [
    "Life Path {n1} brings {f1} and Life Path {n2} brings {f2}: feeling meets independence, so closeness can mean different things to each of you.",
    "With Life Paths {n1} and {n2}, the {kw1} and the {kw2}, one of you leads with feeling and the other with independence.",
  ],
  "creative hearts|steady builders": [
    "Life Path {n1} brings {f1} and Life Path {n2} brings {f2}: enjoyment meets duty, and each of you can think the other has the wrong priorities.",
    "With Life Paths {n1} and {n2}, the {kw1} and the {kw2}, one of you lives for connection and the other for results.",
  ],
};

export const NO_CLICK: { lifePaths: string[]; animals: string[] } = {
  lifePaths: [
    "Beyond that, {pairOf} do not give you an easy match, and neither do Life Paths {n1} and {n2}, so this is a bond you build by choice.",
    "Beyond that, {pairOf} do not click on their own, nor do your Life Paths, {n1} and {n2}, so the closeness here comes from effort rather than chance.",
  ],
  animals: [
    "Beyond that, {pairOf} and your {A1} and {their} {A2} do not click on their own, so the closeness between your {qA} and {their} {qB} is something you have built.",
    "Beyond that, {pairOf} and your {A1} and {their} {A2} do not give you an easy match, so your {qA} and {their} {qB} need deliberate effort to work together.",
  ],
};
export const NO_RUB: string[] = [
  "Very little in your charts pulls against the other: the Suns ({S1} and {S2}) and the Moons ({M1} and {M2}) mostly agree.",
  "Nothing in your charts pulls strongly the other way, whether you compare Suns ({S1} and {S2}) or Life Paths ({n1} and {n2}).",
  "Your charts barely clash, with your {M1} and {M2} Moons and {A1} and {A2} years all on good terms.",
];

/** How to make the most of the strongest click, by where it comes from. Same placeholders as the click lines. */
export const CLICK_USE: Record<"sun" | "moon" | "mercury" | "venus" | "mars" | "animal" | "family" | "element" | "none", string[]> = {
  sun: ["Take on something big together, where being {kwA1} and being {kwB1} both have a role.", "Say out loud what you value in each other, such as {their} {kwB1} {b} nature, because it is easy to take for granted."],
  moon: ["Lean on this on hard days: your {a} Moon offers {gA}, and {their} {b} Moon offers {gB}.", "Make a habit of checking in, so {their} {b} Moon gets {gA} from you and you get {gB} back."],
  mercury: ["Talk big decisions through together, since your {kwA1} {a} Mercury and {their} {kwB1} {b} Mercury notice different things.", "Plan together often, because your {kwA1} thinking and {their} {kwB1} thinking cover more ground as a pair."],
  venus: ["Plan more time around what you both enjoy: {showsA} for you, {showsB} for {them}.", "Protect the time you spend on {showsA} and {showsB}, so the ease between you does not become routine."],
  mars: ["Pick a shared goal for the year, where your {kwA1} {a} Mars and {their} {kwB1} {b} Mars can work side by side.", "Take on a practical project together, letting your {kwA1} energy and {their} {kwB1} energy share the load."],
  animal: ["Do things side by side, where the strengths of your {A1} and {their} {A2} both help.", "Back each other in public, where your {A1} and {their} {A2} show their best sides."],
  family: ["Set a shared goal for the year that uses both {f1} and {f2}.", "Let each of you lead the plans that suit your Life Path, {f1} for one of you and {f2} for the other."],
  element: ["Let the support run both ways, so {t2} gives something back to {t1}.", "Notice the support when it comes, whether it is {t1} or {t2}, and say thank you for it."],
  none: ["Build one regular habit that suits both of you: {showsA} for you, {showsB} for {them}.", "Small, regular effort counts for more here than grand gestures, especially {showsA} and {showsB}."],
};

/** How to handle the main rub, by where it comes from. Same placeholders as the rub lines;
 * {needA}/{needB} are what each Moon needs. */
export const HANDLE: Record<"sun" | "moon" | "mercury" | "venus" | "mars" | "animal" | "family" | "element" | "none", string[]> = {
  sun: [
    "Respect the difference: let {them} be {kwB1} and yourself be {kwA1}, without asking either of you to copy the other.",
    "When it grates, ask what {their} {kwB1} approach gets right before you defend your own {kwA1} one.",
  ],
  moon: [
    "After a hard day, ask rather than guess: your {a} Moon offers {gA}, and {their} {b} Moon offers {gB}.",
    "Learn each other's way of recovering: your {a} Moon gives {gA}, and {their} {b} Moon gives {gB}.",
  ],
  mercury: [
    "Slow down in difficult talks: you {xA}, {them} tends to {xB}, so say back what you heard before you reply.",
    "Expect different styles, since you {xA}, while {them} tends to {xB}, and ask before you assume.",
  ],
  venus: [
    "Learn each other's way of showing care: you {xA}, while {them} tends to {xB}.",
    "Say out loud what a gesture meant, because you {xA} and {them} tends to {xB}.",
  ],
  mars: [
    "Agree in calm moments who leads on what, because you {xA} while {them} tends to {xB}.",
    "Agree a pause signal you both respect, since you {xA}, while {them} tends to {xB}.",
  ],
  animal: [
    "Be patient with your {A1}'s {softA} and with {their} {A2}'s {softB}, and say out loud that you are on the same side.",
    "Treat the difference as useful: your {A1}'s {qA} and {their} {A2}'s {qB} each notice what the other misses.",
  ],
  family: [
    "Talk about what each of you wants from the year ahead, since one of you brings {f1} and the other {f2}.",
    "Make room for both ways of living, {f1} and {f2}, with some plans for each.",
  ],
  element: [
    "Notice when {t1} starts to feel like control over {t2}, and ask before you steer.",
    "Let the one with {t2} say when they need more room from the {t1}.",
  ],
  none: [
    "Your main risk is taking the ease for granted, so keep making time for each other, {sunA} and {sunB} as you are.",
    "Easy bonds still need attention, so keep choosing each other in busy seasons, when being {sunA} and being {sunB} pull you in different directions.",
  ],
};

/** What a Moon in each sign quietly gives the people close to it. A noun phrase, no "you". The third is for the tips. */
export const MOON_GIVES: Record<SignId, string[]> = {
  aries: ["a quick, honest read on how things really feel", "the energy to shake off a bad day", "quick encouragement when things go wrong"],
  taurus: ["a calm, steady presence when things are unsettled", "comfort that is felt rather than talked about", "reassurance through routine and physical comfort"],
  gemini: ["a light touch that talks the worry out of things", "a lively ear and a quick way of cheering things up", "conversation that helps make sense of a feeling"],
  cancer: ["a deep, protective kind of care", "the feeling of being remembered and looked after", "a safe, welcoming home"],
  leo: ["warm-hearted loyalty and open affection", "the feeling of being proudly backed", "warm reassurance and praise"],
  virgo: ["practical care that turns up when it is needed", "a thoughtful eye that notices what is wrong before it grows", "calm, sensible help with a problem"],
  libra: ["a gentle sense of peace and fairness", "kindness that eases tension", "a calm, even-handed view of a disagreement"],
  scorpio: ["loyalty that does not waver", "a depth of feeling that makes closeness real", "complete discretion and emotional honesty"],
  sagittarius: ["hope and a sense of humour on hard days", "a reminder that there is always something to look forward to", "perspective and good humour"],
  capricorn: ["steady support that does not falter", "quiet reliability and grown-up care", "level-headed advice in a crisis"],
  aquarius: ["acceptance with no conditions attached", "a calm, clear head when feelings run high", "space and an open mind"],
  pisces: ["understanding that needs no words", "compassion that forgives easily", "patience and gentle sympathy"],
};

/** How a Venus in each sign shows care: follows "shows care through". No "you" in it. The third is for the tips. */
export const VENUS_SHOWS: Record<SignId, string[]> = {
  aries: ["bold gestures and spontaneous plans", "honest words and some friendly competition", "direct compliments and shared challenges"],
  taurus: ["small comforts, good food and unhurried time", "loyal, solid gestures that last", "physical affection and reliable routines"],
  gemini: ["messages, conversation and new ideas", "words: a compliment, a joke, a long talk", "shared jokes, plans and outings"],
  cancer: ["homely touches and checking in", "looking after, feeding and remembering", "home cooking and remembering important dates"],
  leo: ["generous praise and marking occasions", "generous treats and open affection", "loyal support in front of others"],
  virgo: ["helpful acts and problems quietly solved", "remembering the details and acting on them", "practical favours and careful attention"],
  libra: ["kindness, good manners and shared outings", "fairness and attention to pleasant surroundings", "compliments, courtesy and well-chosen gifts"],
  scorpio: ["loyalty, depth and complete attention", "intense, private devotion", "keeping confidences and staying close in hard times"],
  sagittarius: ["adventures, laughter and honesty", "shared discoveries and plenty of freedom", "trips, new experiences and frank conversation"],
  capricorn: ["turning up, following through and planning ahead", "steady effort and long-term support", "dependable help and long-term plans"],
  aquarius: ["friendship, space and the unexpected", "unusual, thoughtful surprises", "shared causes and respect for independence"],
  pisces: ["tenderness, music and handwritten notes", "gentle kindness given without being asked", "small creative gestures and quiet understanding"],
};

/** Your story together: the opening of the summing up. */
export const STORY: Two = [
  "In short, this is {aHeart1} {S1} with {aHeart2} {S2}, {aEl1} {A1} with {aEl2} {A2}, and Life Paths {n1} and {n2}.",
  "Put together, that is {aHeart1} {S1} beside {aHeart2} {S2}, the {kw1} with the {kw2}.",
];

/** Where the pair's title comes from. {title} is "the Steady Flame", {Noun}/{Adj} its words, {els} "Fire and Earth", {lps} "Life Paths 4 and 7". */
export const TITLE_LINE: string[] = [
  "The title {title} comes from the elements of your Suns ({els}) and from {lps}.",
  "{Title} is the name this spotlight gives you, taken from Sun elements {els} and {lps}.",
  "This spotlight calls you {title}: {Noun} for Sun elements {els}, {Adj} for {lps}.",
];

/** The last line, in this kind of bond's voice. {aS1}/{aS2} are the Suns with "a" or "an". */
export const STORY_TONE: Record<Tone, string[]> = {
  love: [
    "Keep choosing each other on ordinary days, and give your {M1} and {M2} Moons what they need on the difficult ones, {k1} and {k2} alike.",
    "Small, regular gestures will matter more to your {k1} {S1} side and {their} {k2} {S2} side than occasional grand ones.",
    "Make time that belongs only to the two of you, and spend it on something that suits both your {k1} {S1} Sun and {their} {k2} {S2} Sun.",
    "Look after this bond deliberately: {aK1} {S1} and {aK2} {S2} need different things, so ask, and act on the answer.",
  ],
  friends: [
    "A friendship between your {k1} {S1} Sun and {their} {k2} {S2} Sun lasts when both of you keep turning up, year after year.",
    "Keep making plans together, and a friendship that suits both {aK1} {S1} and {aK2} {S2} will keep growing.",
    "Regular contact matters more than big occasions for {aK1} {S1} and {aK2} {S2}: a message, a plan, a frank conversation.",
    "Friends as {k1} and {k2} as the two of you stay close by checking in when life gets busy, so make that a habit.",
  ],
  family: [
    "Family ties like this deepen each time you accept {their} {k2} {S2} nature and {them} accepts your {k1} {S1} one.",
    "Patience and second chances will strengthen this family bond, especially where your {k1} {S1} side and {their} {k2} {S2} side differ.",
    "A family bond between your {k1} {S1} Sun and {their} {k2} {S2} Sun needs small, steady care: a call, a visit, some forgiveness.",
    "Give each other room to be {k1} and {k2} in your own ways, and this family bond between {S1} and {S2} will last.",
  ],
  work: [
    "Working together, you are strongest when your {k1} {S1} side and {their} {k2} {S2} side each lead where they are most capable.",
    "Share the credit and divide the work by strengths, and {aK1} {S1} and {aK2} {S2} make a capable team.",
    "Clear roles and honest check-ins will help your {k1} {S1} Sun and {their} {k2} {S2} Sun work well together.",
    "A short weekly check-in and plenty of thanks will keep {aK1} {S1} and {aK2} {S2} working well side by side.",
  ],
};

/** This year for the pair, from whether both Personal Years point outward, inward or one of each.
 * {py1}/{py2} are the numbers and {s1}/{s2} what each year is about. */
export const YEAR_STORY: Record<"out" | "in" | "mixed", string[]> = {
  out: [
    "This year you are in Personal Year {py1}, numerology's number for the year, about {s1}, and {them} is in Personal Year {py2}, about {s2}, so say yes to new things together.",
    "With Personal Years, the yearly numbers from numerology, of {py1} and {py2}, you both look outward this year: {s1} for you, {s2} for {them}.",
  ],
  in: [
    "This year you are in Personal Year {py1}, numerology's number for the year, about {s1}, and {them} is in Personal Year {py2}, about {s2}, so a quieter, closer year suits you.",
    "With Personal Years, the yearly numbers from numerology, of {py1} and {py2}, you both turn inward this year: {s1} for you, {s2} for {them}.",
  ],
  mixed: [
    "This year your Personal Year, numerology's number for the year, is {py1}, meaning {s1}, while {their} is {py2}, meaning {s2}, so agree a rhythm that suits you both.",
    "With Personal Years, the yearly numbers from numerology, of {py1} and {py2}, you run at different speeds this year: {s1} for you, {s2} for {them}, so meet in the middle.",
  ],
};
