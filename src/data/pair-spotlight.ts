// Wording for "Meet the two of you", the spotlight at the top of a relationship reading.
// It reads the pair as one: what each of you brings the other, where you click, where you
// rub and your story together. Each piece has two wordings, and src/lib/pair-spotlight.ts
// picks one from both birth dates, so two pairs with the same signs still read differently.
//
// Placeholders: {a} is your sign and {b} the other person's, {their} is the other person's
// possessive ("Sam's", "your partner's"), {link} how the two signs sit ("square each other").
// Lines never say which of you is which element, so they read right either way round.

import type { Element as WesternElement, SignId } from "./astrology.ts";
import type { Tone } from "./synastry.ts";
import type { Relation } from "../lib/chinese.ts";

type Two = [string, string];

/** The pair's title noun, from both Sun elements (alphabetical key), with what it means. */
export const PAIR_NOUN: Record<string, [{ name: string; means: string }, { name: string; means: string }]> = {
  "Fire|Fire": [
    { name: "Blaze", means: "two fires that make each other burn brighter" },
    { name: "Bonfire", means: "a big, warm fire that other people gather round" },
  ],
  "Earth|Earth": [
    { name: "Oak", means: "something that grows slowly and stands for a very long time" },
    { name: "Mountain", means: "a bond that is hard to shake once it is set" },
  ],
  "Air|Air": [
    { name: "Breeze", means: "an easy, moving bond full of fresh air and new ideas" },
    { name: "Skylark", means: "a bond that lifts and sings, happiest with plenty of sky" },
  ],
  "Water|Water": [
    { name: "Tide", means: "a pull between you that keeps coming back, deep and steady" },
    { name: "Deep Well", means: "a bond with more underneath than anyone outside can see" },
  ],
  "Earth|Fire": [
    { name: "Flame", means: "a fire with something solid underneath it, so it lasts" },
    { name: "Hearth", means: "a fire that warms a home rather than burning it down" },
  ],
  "Air|Fire": [
    { name: "Wildfire", means: "ideas and energy that catch fast and spread" },
    { name: "Comet", means: "a bright streak across the sky that people notice" },
  ],
  "Fire|Water": [
    { name: "Hot Spring", means: "heat and feeling mixed into something that soothes" },
    { name: "Storm", means: "a bond with real weather in it, and clear skies after" },
  ],
  "Air|Earth": [
    { name: "Kite", means: "something light that flies because someone holds the string" },
    { name: "Windmill", means: "ideas turned into real, useful work" },
  ],
  "Earth|Water": [
    { name: "Garden", means: "a place where things grow because they are tended" },
    { name: "Riverbank", means: "feeling given a safe shape to flow along" },
  ],
  "Air|Water": [
    { name: "Rainbow", means: "thought and feeling meeting to make something lovely" },
    { name: "Sea Mist", means: "a soft, shifting bond that is hard to pin down and easy to love" },
  ],
};

/** The pair's title adjective, from both Life Path families (alphabetical key). */
export const PAIR_ADJ: Record<string, Two> = {
  "steady builders|steady builders": ["Steady", "Solid"],
  "creative hearts|creative hearts": ["Golden", "Bright"],
  "independent minds|independent minds": ["Free", "Wandering"],
  "independent minds|steady builders": ["Anchored", "Daring"],
  "creative hearts|independent minds": ["Spirited", "Starry"],
  "creative hearts|steady builders": ["Warm", "Faithful"],
};

/** What a Sun in each sign brings to someone else: a noun phrase with no "you" or "they" in it. */
export const SUN_GIVES: Record<SignId, Two> = {
  aries: ["courage and a push to get going", "honest nerve and a taste for adventure"],
  taurus: ["calm, comfort and a steady hand", "patience and a sense that things will last"],
  gemini: ["fresh ideas and easy conversation", "curiosity, wit and a lighter mood"],
  cancer: ["warmth and a real sense of home", "care, a long memory for what matters and a soft place to land"],
  leo: ["warmth, praise and a generous heart", "confidence, fun and loyal encouragement"],
  virgo: ["practical help and thoughtful attention", "a calm eye for detail and quiet, useful care"],
  libra: ["fairness, charm and a peaceful touch", "balance, good taste and easy company"],
  scorpio: ["depth, loyalty and fierce protection", "honesty, focus and a trust that runs deep"],
  sagittarius: ["optimism, laughter and a bigger horizon", "adventure, honesty and a sense of meaning"],
  capricorn: ["structure, ambition and steady support", "patience, plans and a long-term view"],
  aquarius: ["originality and room to breathe", "new ideas and a true friendship with no strings"],
  pisces: ["tenderness, imagination and compassion", "gentleness, intuition and a touch of magic"],
};

/** Each animal's best quality, and the softer side another animal can help with. Nouns. */
export const ANIMAL_SIDES: Record<string, { quality: Two; soft: Two }> = {
  rat: { quality: ["quick wits", "sharp eye for a chance"], soft: ["restless worrying", "busy mind"] },
  ox: { quality: ["patience", "steady strength"], soft: ["stubborn streak", "habit of carrying too much"] },
  tiger: { quality: ["courage", "fire"], soft: ["restlessness", "big feelings"] },
  rabbit: { quality: ["gentleness", "tact"], soft: ["worries", "need for peace"] },
  dragon: { quality: ["vision", "confidence"], soft: ["big plans", "pride"] },
  snake: { quality: ["wisdom", "calm insight"], soft: ["secrets", "deep thinking"] },
  horse: { quality: ["energy", "free spirit"], soft: ["restless feet", "impatience"] },
  goat: { quality: ["kindness", "creativity"], soft: ["dreaming", "soft heart"] },
  monkey: { quality: ["wit", "inventiveness"], soft: ["mischief", "quick boredom"] },
  rooster: { quality: ["honesty", "eye for detail"], soft: ["high standards", "need to be right"] },
  dog: { quality: ["loyalty", "sense of fairness"], soft: ["worry", "watchfulness"] },
  pig: { quality: ["warmth", "generosity"], soft: ["easy-going ways", "trusting nature"] },
};

/** How one animal's quality meets the other's softer side, by where they sit on the wheel. */
export const ANIMAL_VERB: Record<Relation, Two> = {
  secret: ["quietly guards", "fits neatly around"],
  friend: ["steadies", "backs up"],
  same: ["understands", "mirrors"],
  neutral: ["balances", "sits easily beside"],
  clash: ["challenges", "stretches"],
};

/** Where you click: a planet pair that gets on. */
export const CLICK_PLANET: Record<"sun" | "mercury" | "venus" | "mars", Two> = {
  sun: [
    "Your {a} Sun and {their} {b} Sun {link}, so you tend to like who the other is without trying.",
    "With Suns in {a} and {b}, your basic natures fit, and you rarely have to explain yourselves.",
  ],
  mercury: [
    "Your {a} Mercury and {their} {b} Mercury {link}, so talking comes easily and you often finish each other's thoughts.",
    "With Mercury in {a} and {b}, you think along similar lines, which makes plans and decisions quicker.",
  ],
  venus: [
    "Your {a} Venus and {their} {b} Venus {link}, so you enjoy the same kinds of time together.",
    "With Venus in {a} and {b}, the way one of you shows care is the way the other likes to receive it.",
  ],
  mars: [
    "Your {a} Mars and {their} {b} Mars {link}, so when you want something you pull in the same direction.",
    "With Mars in {a} and {b}, your energy matches, and you get things done side by side.",
  ],
};

/** Where you rub: a planet pair that pulls against itself. */
export const RUB_PLANET: Record<"sun" | "mercury" | "venus" | "mars", Two> = {
  sun: [
    "Your {a} Sun and {their} {b} Sun {link}, so you go about life in different ways, and what seems obvious to one of you can puzzle the other.",
    "With Suns in {a} and {b}, your basic styles differ, and that can feel like being misunderstood.",
  ],
  mercury: [
    "Your {a} Mercury and {their} {b} Mercury {link}, so you can talk past each other and hear criticism where none was meant.",
    "With Mercury in {a} and {b}, you think in different ways, so small misunderstandings can pile up.",
  ],
  venus: [
    "Your {a} Venus and {their} {b} Venus {link}, so you show care in different ways, and a kind gesture can go unnoticed.",
    "With Venus in {a} and {b}, you enjoy different things, so time together needs a little planning.",
  ],
  mars: [
    "Your {a} Mars and {their} {b} Mars {link}, so you push at different speeds, and tempers can meet head on.",
    "With Mars in {a} and {b}, one of you charges while the other digs in, which can turn small things into standoffs.",
  ],
};

/** How to handle the main rub, by where it comes from. */
export const HANDLE: Record<"sun" | "moon" | "mercury" | "venus" | "mars" | "animal" | "family" | "element" | "none", Two> = {
  sun: [
    "The way through is respect: let each of you do some things your own way, without needing the other to copy.",
    "When it grates, ask what the other's way gets right before you defend your own.",
  ],
  moon: [
    "After a hard day, ask rather than guess: does the other want space, company or help?",
    "Learn the other's way of being comforted and offer that, even when your own instinct is different.",
  ],
  mercury: [
    "Slow down in tricky talks, and say back what you heard before you reply.",
    "Give each other's tone the benefit of the doubt, and ask before you assume.",
  ],
  venus: [
    "Learn each other's way of showing care and use it on purpose, even when it feels unnatural.",
    "Take turns choosing how you spend your time, and say out loud what a gesture meant.",
  ],
  mars: [
    "Agree a pause signal you both respect, and come back to it once you have cooled down.",
    "Decide in calm moments who leads on what, so it is never fought out in the heat.",
  ],
  animal: [
    "When your instincts pull apart, say out loud that you are on the same side, then find the middle.",
    "Treat the difference as a second pair of eyes: each of you sees what the other misses.",
  ],
  family: [
    "Talk about what each of you wants from the next year, so neither of you is guessing.",
    "Make room for both ways of living: some plans that are just for fun or freedom, and some that build something together.",
  ],
  element: [
    "Notice when guidance starts to feel like control, and ask before you steer.",
    "Let the one being held back say when they need more room.",
  ],
  none: [
    "Your only real risk is taking the ease for granted, so keep choosing each other on purpose.",
    "Easy bonds still need tending, so keep making time that is only yours.",
  ],
};

/** Both Moons, by their elements (alphabetical key): how your feelings meet. */
export const MOON_MEET: Record<string, Two> = {
  "Fire|Fire": [
    "Your {a} Moon and {their} {b} Moon are both Fire, so feelings come out fast, honest and warm, and blow over just as fast.",
    "With Moons in {a} and {b}, you both feel in bright, quick bursts, and neither of you needs things spelled out.",
  ],
  "Earth|Earth": [
    "Your {a} Moon and {their} {b} Moon are both Earth, so you both feel safe with routine, comfort and promises kept.",
    "With Moons in {a} and {b}, you comfort each other in practical ways: a meal, a plan, a job done.",
  ],
  "Air|Air": [
    "Your {a} Moon and {their} {b} Moon are both Air, so you understand each other best by talking things through.",
    "With Moons in {a} and {b}, you both need space to think and a good chat to feel close.",
  ],
  "Water|Water": [
    "Your {a} Moon and {their} {b} Moon are both Water, so you sense each other's moods almost before a word is said.",
    "With Moons in {a} and {b}, you feel things deeply and quietly, and you rarely need to explain a hurt.",
  ],
  "Earth|Fire": [
    "Your {a} Moon and {their} {b} Moon mix Fire and Earth: one of you feels it now, the other wants time to be sure.",
    "With Moons in {a} and {b}, one of you reacts quickly and the other slowly, so hard days need a little patience.",
  ],
  "Air|Fire": [
    "Your {a} Moon and {their} {b} Moon mix Fire and Air, so feelings turn quickly into talk and plans, and the mood between you is lively.",
    "With Moons in {a} and {b}, one of you feeds the other's spark, and cheering each other up comes easily.",
  ],
  "Fire|Water": [
    "Your {a} Moon and {their} {b} Moon mix Fire and Water: one of you wants to act on a feeling, the other wants to sit with it.",
    "With Moons in {a} and {b}, one of you flares and the other floods, so hard days need patience on both sides.",
  ],
  "Air|Earth": [
    "Your {a} Moon and {their} {b} Moon mix Air and Earth: one of you wants to talk a feeling through, the other wants to do something about it.",
    "With Moons in {a} and {b}, comfort means different things: a chat for one of you, a practical fix for the other.",
  ],
  "Earth|Water": [
    "Your {a} Moon and {their} {b} Moon mix Earth and Water, a soothing match: one gives safety and shape, the other tenderness.",
    "With Moons in {a} and {b}, you look after each other naturally, through steady care and gentle feeling.",
  ],
  "Air|Water": [
    "Your {a} Moon and {their} {b} Moon mix Air and Water: one of you thinks about feelings, the other simply feels them.",
    "With Moons in {a} and {b}, one of you wants to understand and the other wants to be understood, so take turns.",
  ],
};

/** Both Moons in the same sign. */
export const SAME_MOON: Two = [
  "You both have {anA} Moon, so you need the same things to feel safe, and you often know without asking.",
  "With both Moons in {a}, comfort comes in exactly the same shape for you both, for better and for worse.",
];

/** The animals on the wheel, when they help. {A1} is your animal, {A2} the other's. */
export const ANIMAL_CLICK: Partial<Record<Relation, Two>> = {
  friend: [
    "On the Chinese wheel your {A1} and {their} {A2} sit in the same friend group, so you are natural allies.",
    "Your {A1} and {their} {A2} are friends on the Chinese wheel, which adds an easy, everyday loyalty.",
  ],
  secret: [
    "Your {A1} and {their} {A2} are secret friends on the Chinese wheel, one of its closest matches.",
    "On the Chinese wheel your {A1} and {their} {A2} are secret friends, a quiet bond that tends to bring out the best in both.",
  ],
  same: [
    "You are both {A1}s, so you understand each other's instincts from the inside.",
    "Two {A1}s know each other's habits by heart, the lovely ones and the tricky ones.",
  ],
};

/** The animals on the wheel, when they pull apart. */
export const ANIMAL_RUB: Two = [
  "Your {A1} and {their} {A2} sit opposite each other on the Chinese wheel, so your instincts often pull in different directions.",
  "On the Chinese wheel your {A1} and {their} {A2} face each other from opposite sides, which brings friction and a lot to learn.",
];

/** Year elements: one feeds the other (help) or keeps it in check (rub). {E1} is the giver. */
export const ELEMENT_FEED: Two = [
  "{Who1} {E1} year feeds {who2} {E2} year, so one of you naturally helps the other grow.",
  "In the five elements, {who1} {E1} feeds {who2} {E2}, which makes support between you feel natural.",
];
export const ELEMENT_CHECK: Two = [
  "{Who1} {E1} year keeps {who2} {E2} year in check, which steadies things but can feel like being reined in.",
  "In the five elements, {who1} {E1} holds {who2} {E2} back a little, useful guidance that can tip into control.",
];

/** Life Paths in the same family. {n1} and {n2} are the two numbers. */
export const FAMILY_CLICK: Record<string, Two> = {
  "independent minds": [
    "Life Paths {n1} and {n2} are both independent minds, so you give each other room without taking it personally.",
    "Your Life Paths, {n1} and {n2}, both belong to the independent minds, so you respect each other's freedom by instinct.",
  ],
  "steady builders": [
    "Life Paths {n1} and {n2} are both steady builders, so you want the same solid things from life.",
    "Your Life Paths, {n1} and {n2}, are both steady builders, so you trust each other's effort.",
  ],
  "creative hearts": [
    "Life Paths {n1} and {n2} are both creative hearts, so warmth and expression flow both ways.",
    "Your Life Paths, {n1} and {n2}, are both creative hearts, so you light each other up.",
  ],
};
export const SAME_LIFE_PATH: Two = [
  "You share Life Path {n1}, so you are walking the same road and want the same things from it.",
  "With the same Life Path, {n1}, you each recognise the other's purpose straight away.",
];

/** Life Paths in different families (alphabetical key). */
export const FAMILY_RUB: Record<string, Two> = {
  "independent minds|steady builders": [
    "Life Paths {n1} and {n2} come from different families: freedom meets structure, and each of you can feel hemmed in or let down by the other.",
    "With Life Paths {n1} and {n2}, one of you wants room to roam and the other wants a solid plan.",
  ],
  "creative hearts|independent minds": [
    "Life Paths {n1} and {n2} come from different families: heart meets head, so closeness can mean different things to each of you.",
    "With Life Paths {n1} and {n2}, one of you leads with feeling and the other with independence.",
  ],
  "creative hearts|steady builders": [
    "Life Paths {n1} and {n2} come from different families: joy meets duty, and each of you can think the other has the wrong priorities.",
    "With Life Paths {n1} and {n2}, one of you lives for warmth and expression, the other for plans and results.",
  ],
};

/** Nothing clicks automatically, or nothing rubs. */
export const NO_CLICK: Two = [
  "Beyond that, {pairOf} and Life Paths {n1} and {n2} do not hand you an easy match, so this bond is built by choice, and those are often the strongest.",
  "Beyond that, {pairOf} and your {A1} and {their} {A2} do not click on their own, so every bit of closeness here is something you made together.",
];
export const NO_RUB: Two = [
  "Very little in your charts pulls hard against the other.",
  "Nothing in your charts pulls strongly the other way.",
];

/** Your story together: the opening of the summing up. */
export const STORY: Two = [
  "In short: your {heart1} {S1} heart and {their} {heart2} {S2} heart, your {El1} {A1} and {their} {El2} {A2}, on Life Paths {n1} and {n2}.",
  "Put it all together and you have {aHeart1} {S1} heart beside {aHeart2} {S2} heart, the {kw1} walking with the {kw2}.",
];

/** The last line, in this kind of bond's voice. */
export const STORY_TONE: Record<Tone, Two> = {
  love: [
    "A love like this grows best when you keep choosing each other, on the easy days and the hard ones.",
    "Keep the romance in the small things, and this can be a love that lasts.",
  ],
  friends: [
    "A friendship like this is worth turning up for, year after year.",
    "Keep making memories together, and this friendship will carry you both a long way.",
  ],
  family: [
    "Family ties like this deepen every time you meet each other where you are.",
    "Give each other patience and plenty of second chances, and this bond only gets stronger.",
  ],
  work: [
    "Working together, the trick is to let each of you lead where you are strongest.",
    "Share the credit and split the work by strengths, and you make a team people remember.",
  ],
};

/** Both Moons opposite each other: the same element family, but needs that pull apart. */
export const MOON_OPPOSITE: Two = [
  "Your {a} Moon and {their} {b} Moon sit opposite each other, so you need opposite things to feel safe, and each of you holds the piece the other is missing.",
  "With Moons in {a} and {b}, opposite each other, what comforts one of you can feel like too much or too little to the other.",
];

/** What a Moon in each sign quietly gives the people close to it. A noun phrase, no "you". */
export const MOON_GIVES: Record<SignId, Two> = {
  aries: ["a quick, honest read on how things really feel", "the energy to shake off a bad day"],
  taurus: ["a calm, steady presence when things wobble", "comfort that is felt rather than talked about"],
  gemini: ["a light touch that talks the worry out of things", "a lively ear and a quick way of cheering things up"],
  cancer: ["a deep, protective kind of care", "the feeling of being remembered and looked after"],
  leo: ["warm-hearted loyalty and a big, open heart", "the feeling of being proudly backed"],
  virgo: ["practical care that turns up when it is needed", "a thoughtful eye that notices what is wrong before it grows"],
  libra: ["a gentle sense of peace and fairness", "kindness that smooths over the rough edges"],
  scorpio: ["loyalty that does not waver", "a depth of feeling that makes closeness real"],
  sagittarius: ["hope and a sense of humour on hard days", "a reminder that there is always somewhere new to go"],
  capricorn: ["a steady shoulder that does not flinch", "quiet reliability and grown-up care"],
  aquarius: ["acceptance with no conditions attached", "a calm, clear head when feelings run high"],
  pisces: ["tender, wordless understanding", "compassion that forgives easily"],
};

/** How to make the most of the strongest click, by where it comes from. */
export const CLICK_USE: Record<"sun" | "moon" | "mercury" | "venus" | "mars" | "animal" | "family" | "element" | "none", Two> = {
  sun: ["Take on something big together, because you pull well as a team.", "Say out loud what you like about each other, because it is easy to forget to."],
  moon: ["Lean on that on hard days instead of going it alone.", "Make a small ritual of it: a walk, a cuppa, a proper check-in."],
  mercury: ["Talk the big decisions through together, because you think better as a pair.", "Keep a running list of ideas to try together."],
  venus: ["Plan more of the things you both enjoy, and protect that time.", "Do not let the easy warmth slip into being taken for granted."],
  mars: ["Pick a shared goal and chase it side by side.", "Take on a project together and let the momentum carry you."],
  animal: ["Do things side by side, not just face to face.", "Back each other in public, where loyalty shows most."],
  family: ["Set a shared goal for the year and check in on it together.", "Let each of you lead the plans that suit your path best."],
  element: ["Let the helping go both ways, so neither of you only gives.", "Notice the support when it comes, and say thank you for it."],
  none: ["Small, regular effort counts for more here than grand gestures.", "Build one habit that is only yours and keep it going."],
};

/** How a Venus in each sign shows care: follows "shows care through". No "you" in it. */
export const VENUS_SHOWS: Record<SignId, Two> = {
  aries: ["bold gestures and spur-of-the-moment plans", "honest words and a bit of playful competition"],
  taurus: ["small comforts, good food and time that is never rushed", "loyal, solid gestures that last"],
  gemini: ["funny messages, good chats and new ideas", "words: a compliment, a joke, a long talk"],
  cancer: ["homely touches and checking in", "looking after, feeding and remembering"],
  leo: ["big-hearted praise and making a fuss", "generous treats and open affection"],
  virgo: ["helpful acts and problems quietly solved", "remembering the details and acting on them"],
  libra: ["kindness, good manners and lovely shared moments", "fairness and little touches of beauty"],
  scorpio: ["loyalty, depth and complete attention", "intense, private devotion"],
  sagittarius: ["adventures, laughter and honesty", "shared discoveries and plenty of freedom"],
  capricorn: ["turning up, following through and planning ahead", "steady effort and long-term support"],
  aquarius: ["friendship, space and the unexpected", "unusual, thoughtful surprises"],
  pisces: ["tenderness, music and heartfelt notes", "gentle kindness given without being asked"],
};

/** This year for the pair, from whether both Personal Years point outward, inward or one of each. */
export const YEAR_STORY: Record<"out" | "in" | "mixed", Two> = {
  out: ["This year, with Personal Years {py1} and {py2}, you are both moving outward, so say yes to new things together.", "With Personal Years {py1} and {py2} this year, you are both in a going-out, getting-on-with-it phase."],
  in: ["This year, with Personal Years {py1} and {py2}, you are both turning inward, so a quieter, closer stretch suits you.", "With Personal Years {py1} and {py2} this year, you are both in a settling, looking-after phase."],
  mixed: ["This year, with Personal Years {py1} and {py2}, one of you is heading out while the other turns in, so agree a rhythm that suits you both.", "With Personal Years {py1} and {py2} this year, your energy runs at different speeds, so meet in the middle."],
};
