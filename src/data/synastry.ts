// Wording for comparing two birth charts planet by planet. How far apart two signs sit
// on the zodiac (the same sign, next door, two apart and so on) says how easily that
// part of two people meets.

export type SignLink = "same" | "neighbour" | "sextile" | "square" | "trine" | "quincunx" | "opposite";
export type PairPlanet = "sun" | "moon" | "mercury" | "venus" | "mars";
export type Tone = "love" | "family" | "friends" | "work";

/** Signs 0 to 6 apart, round the shorter way. */
export const LINK_BY_DISTANCE: SignLink[] = ["same", "neighbour", "sextile", "square", "trine", "quincunx", "opposite"];

/** Whether a link tends to come easily, needs care, or simply differs. */
export const LINK_FEEL: Record<SignLink, "easy" | "care" | "mixed"> = {
  same: "easy", trine: "easy", sextile: "easy", opposite: "care", square: "care", quincunx: "care", neighbour: "mixed",
};

/** The headline for each planet pairing, in the voice of the bond. */
export const PAIR_TITLES: Record<PairPlanet, Record<Tone, string>> = {
  sun: { love: "Who you are together", family: "Who you are to each other", friends: "Who you are together", work: "How you work as people" },
  moon: { love: "Feeling safe together", family: "Your moods and comfort", friends: "Your moods and comfort", work: "Your moods under pressure" },
  mercury: { love: "Talking and listening", family: "Talking and listening", friends: "Talking and laughing", work: "Ideas and communication" },
  venus: { love: "How you show love", family: "How you show care", friends: "What you enjoy together", work: "What you each value" },
  mars: { love: "Passion and arguments", family: "Drive and disagreements", friends: "Drive and disagreements", work: "Getting things done" },
};

/** One line for each planet and link: what it is like when two people's signs meet this way. */
export const PAIR_LINES: Record<PairPlanet, Record<SignLink, string>> = {
  sun: {
    same: "You share a Sun sign, so you recognise each other straight away: the same instincts, and the same blind spots. Take turns leading so you are not both pulling the same way at once.",
    neighbour: "Your Sun signs sit side by side on the zodiac, yet they work very differently. Each of you has what the other is still learning, which can feel puzzling at first and enriching over time.",
    sextile: "Your Sun signs are a friendly match, so you like who the other is and spur each other on without much effort.",
    square: "Your Sun signs square each other, so your basic styles rub. That friction is energising when you respect it and tiring when you fight it, and it pushes you both to grow.",
    trine: "Your Sun signs share an element, so your core natures flow together. You get each other's way of being, and time together tends to feel natural.",
    quincunx: "Your Sun signs have little in common, so you come at life from different angles. It works best when you stay curious about each other instead of expecting the other to think like you.",
    opposite: "Your Sun signs sit opposite each other: opposites who attract. You balance each other out, and each of you sees what the other misses.",
  },
  moon: {
    same: "Your Moons are in the same sign, so you need the same things to feel safe. You comfort each other almost by instinct, though you can also catch each other's moods.",
    neighbour: "Your Moons sit side by side but feel things differently. What soothes one of you may not soothe the other, so ask rather than assume.",
    sextile: "Your Moons are a friendly match, so you feel at ease around each other and find it easy to offer comfort.",
    square: "Your Moons square each other, so your emotional needs can clash: one wants space when the other wants closeness. Saying what you need out loud makes a big difference.",
    trine: "Your Moons share an element, one of the warmest links two people can have. You feel safe and understood together, often without needing to explain.",
    quincunx: "Your Moons speak different emotional languages. The care is there, but it can get lost in translation, so learning how the other likes to be comforted pays off.",
    opposite: "Your Moons sit opposite each other, so you balance each other's feelings: when one wobbles, the other steadies. Just don't read the other's mood as a reaction against your own.",
  },
  mercury: {
    same: "Your minds work the same way, so conversation flows and you often finish each other's thoughts. Make sure someone still asks the awkward question now and then.",
    neighbour: "Your Mercury signs sit side by side but think differently: one may get there by feeling and the other by logic. Give each other time to explain.",
    sextile: "Your Mercury signs are a friendly match, so you enjoy talking, swap ideas easily and spark new thoughts in each other.",
    square: "Your Mercury signs square each other, so you can talk past each other or argue the point. Slow down and listen fully, and your different views become a strength.",
    trine: "Your Mercury signs share an element, so you think alike and understand what the other means, even when it comes out wrong.",
    quincunx: "Your Mercury signs have little in common, so the same words can mean different things to you. A quick \"did you mean…?\" saves a lot of misunderstanding.",
    opposite: "Your Mercury signs sit opposite each other, so you see every question from opposite sides. That makes for lively talks and well rounded decisions, as long as it does not become a contest.",
  },
  venus: {
    same: "Your Venus signs match, so you show care and enjoy life in the same way. You like the same things and feel appreciated by each other.",
    neighbour: "Your Venus signs sit side by side, so you show care in different ways. Notice the way the other gives, even when it is not the way you would.",
    sextile: "Your Venus signs are a friendly match: you enjoy each other's company, share tastes and find it easy to show appreciation.",
    square: "Your Venus signs square each other, so you value different things and show affection differently. Learning the other's way of giving prevents a lot of hurt.",
    trine: "Your Venus signs share an element, so warmth comes easily. You enjoy the same pleasures and feel valued just as you are.",
    quincunx: "Your Venus signs have little in common, so what feels like kindness to one may not register with the other. Ask what makes them feel cared for.",
    opposite: "Your Venus signs sit opposite each other: a strong pull between different tastes. You can open each other up to pleasures you would never find alone.",
  },
  mars: {
    same: "Your Mars signs match, so you go after things at the same pace and in the same way. You make a powerful team, though if you both dig in, neither of you backs down.",
    neighbour: "Your Mars signs sit side by side but act differently: one may rush where the other plans. Agree who leads on what.",
    sextile: "Your Mars signs are a friendly match, so you work well side by side and egg each other on. Disagreements tend to blow over quickly.",
    square: "Your Mars signs square each other, so you clash on how and when to act, and tempers can flare. Point that energy at a shared goal and it becomes drive.",
    trine: "Your Mars signs share an element, so you pull in the same direction. Getting things done together feels easy, and arguments rarely run deep.",
    quincunx: "Your Mars signs have little in common, so you handle tasks and conflict in very different ways. Patience with the other's method keeps things moving.",
    opposite: "Your Mars signs sit opposite each other, so your drives pull in opposite directions. Sparks fly, good and bad, and compromise is your secret weapon.",
  },
};

/** Short phrases for the "where you click" and "where to take care" lists. */
export const PAIR_SHORT: Record<PairPlanet, { easy: string; care: string }> = {
  sun: { easy: "you like who the other is", care: "your basic styles rub" },
  moon: { easy: "you feel safe with each other", care: "your emotional needs differ" },
  mercury: { easy: "conversation flows", care: "you can talk past each other" },
  venus: { easy: "care and warmth come easily", care: "you show care in different ways" },
  mars: { easy: "you pull in the same direction", care: "you clash on how and when to act" },
};

/** Venus in one chart against Mars in the other: attraction, for romantic readings. {V} and {M} are possessives. */
export const CHEMISTRY: Record<"easy" | "magnetic" | "spark" | "slow", string> = {
  easy: "{V} Venus and {M} Mars are in harmony: an easy, natural attraction, where one person's drive suits the other's way of loving.",
  magnetic: "{V} Venus sits opposite {M} Mars, a classic magnetic pull. You are drawn to what you are not, which keeps things exciting.",
  spark: "{V} Venus squares {M} Mars: a spark with friction. Attraction and irritation can arrive together, so making up matters.",
  slow: "{V} Venus and {M} Mars have little in common, so attraction here builds slowly, through getting to know each other.",
};

/** Rising signs meet: only when both birth times and towns are known. */
export const RISING_TITLE: Record<Tone, string> = { love: "First impressions and chemistry on sight", family: "How you come across to each other", friends: "First impressions", work: "How you come across at work" };
export const RISING_LINES: Record<SignLink, string> = {
  same: "You share a Rising sign, so you meet the world the same way and probably felt familiar to each other from the start.",
  neighbour: "Your Rising signs sit side by side but give very different first impressions. Others may see you as a pair of contrasts.",
  sextile: "Your Rising signs are a friendly match, so you put each other at ease quickly and come across well together.",
  square: "Your Rising signs square each other, so your first reactions to life can clash. The friction fades once you see past the surface.",
  trine: "Your Rising signs share an element, so you clicked on first meeting and tend to approach new situations in the same spirit.",
  quincunx: "Your Rising signs have little in common, so first impressions may have been puzzling. You get each other better the longer you know each other.",
  opposite: "Your Rising signs sit opposite each other, the classic partnership axis: each of you is drawn to the way the other meets the world.",
};

/**
 * Start and stop tips for each person. What to start comes from the other person's
 * Moon (what they need to feel safe) and Venus (how they like to be appreciated); what
 * to stop comes from your own Mars (how you push and argue). {them} is the other person,
 * always as an object.
 */
type AstroElement = "Fire" | "Earth" | "Air" | "Water";
export const START_FOR_MOON: Record<AstroElement, string> = {
  Fire: "Bring the energy: suggest something spontaneous and fun to do with {them}.",
  Earth: "Show care for {them} in practical ways: turn up on time and follow through.",
  Air: "Talk things through with {them} before deciding anything together.",
  Water: "Check in on how things really feel for {them}, not just what happened.",
};
export const START_FOR_VENUS: Record<AstroElement, string> = {
  Fire: "Praise {them} out loud, and mean it. Big, warm appreciation lands best.",
  Earth: "Give {them} small, steady comforts: a cuppa, a hand with a chore, a thought-through gift.",
  Air: "Keep things interesting for {them} with new ideas, plans and good conversation.",
  Water: "Remember the little things that matter to {them}, and show you remembered.",
};
export const STOP_FOR_MARS: Record<AstroElement, string> = {
  Fire: "Reacting in the heat of the moment. Give it ten minutes before you reply.",
  Earth: "Digging your heels in. Being right matters less than getting on.",
  Air: "Arguing the logic when it is a feeling that needs hearing.",
  Water: "Going quiet and hoping it is noticed. Say what hurt, kindly and early.",
};
