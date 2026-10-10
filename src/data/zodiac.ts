// The 12 animals of the Chinese zodiac and the three relationships the wheel shows:
//   friend group (same colour)    = the Three Harmonies (San He)
//   secret friend (inner ring)    = the Six Harmonies (Liu He)
//   clash (directly opposite)     = the Six Clashes (Liu Chong)

export type Element = "Wood" | "Fire" | "Earth" | "Metal" | "Water";
export type GroupId = "water" | "fire" | "wood" | "metal";

export interface Animal {
  id: string;
  name: string;
  /** Position on the wheel, 0 = Rat at the top, then clockwise. */
  index: number;
  /** The animal's own fixed element. */
  element: Element;
  yinYang: "Yin" | "Yang";
  group: GroupId;
  /** Hex colour of this animal's segment: its friend group's colour (same colour = friends). */
  colour: string;
  traits: string[];
  summary: string;
  /** Another name the animal goes by, shown as a small note. */
  alsoKnownAs?: string;
}

export interface FriendGroup {
  id: GroupId;
  name: string;
  element: Element;
  family: string;
  /** Base colour used for lines and highlights. */
  colour: string;
  meaning: string;
}

export const GROUPS: Record<GroupId, FriendGroup> = {
  water: { id: "water", name: "The Thinkers", element: "Water", family: "Sea green", colour: "#5FA9A3", meaning: "Quick, clever and resourceful. They plan ahead and adapt to anything." },
  metal: { id: "metal", name: "The Builders", element: "Metal", family: "Rose pink", colour: "#EE95A2", meaning: "Steady, loyal and principled. They finish what they start." },
  fire: { id: "fire", name: "The Protectors", element: "Fire", family: "Sunflower", colour: "#EBCF6E", meaning: "Brave, warm and idealistic. They stand up for what is right." },
  wood: { id: "wood", name: "The Diplomats", element: "Wood", family: "Slate blue", colour: "#6585AE", meaning: "Kind, creative and peace-loving. They bring people together." },
};

export const ANIMALS: Animal[] = [
  { id: "rat", name: "Rat", index: 0, element: "Water", yinYang: "Yang", group: "water", colour: "#5FA9A3", traits: ["Quick-witted", "Resourceful", "Charming"], summary: "The Rat is clever and adaptable, always spotting the opportunity others miss." },
  { id: "ox", name: "Ox", index: 1, element: "Earth", yinYang: "Yin", group: "metal", colour: "#EE95A2", traits: ["Dependable", "Patient", "Strong"], summary: "The Ox is steady and hard-working, building success slowly and surely." },
  { id: "tiger", name: "Tiger", index: 2, element: "Wood", yinYang: "Yang", group: "fire", colour: "#EBCF6E", traits: ["Brave", "Confident", "Passionate"], summary: "The Tiger is bold and magnetic, a natural leader who loves a challenge." },
  { id: "rabbit", name: "Rabbit", index: 3, element: "Wood", yinYang: "Yin", group: "wood", colour: "#6585AE", traits: ["Gentle", "Elegant", "Intuitive"], summary: "The Rabbit is graceful and kind, with a gift for creating calm and beauty.", alsoKnownAs: "Known as the Cat in Vietnam." },
  { id: "dragon", name: "Dragon", index: 4, element: "Earth", yinYang: "Yang", group: "water", colour: "#5FA9A3", traits: ["Ambitious", "Energetic", "Lucky"], summary: "The Dragon is powerful and visionary, full of life and big ideas." },
  { id: "snake", name: "Snake", index: 5, element: "Fire", yinYang: "Yin", group: "metal", colour: "#EE95A2", traits: ["Wise", "Intuitive", "Refined"], summary: "The Snake is thoughtful and perceptive, trusting deep inner wisdom." },
  { id: "horse", name: "Horse", index: 6, element: "Fire", yinYang: "Yang", group: "fire", colour: "#EBCF6E", traits: ["Free-spirited", "Lively", "Warm"], summary: "The Horse is energetic and independent, happiest when moving forward." },
  { id: "goat", name: "Goat", index: 7, element: "Earth", yinYang: "Yin", group: "wood", colour: "#6585AE", traits: ["Creative", "Compassionate", "Calm"], summary: "The Goat is artistic and gentle, with a deep need for harmony." },
  { id: "monkey", name: "Monkey", index: 8, element: "Metal", yinYang: "Yang", group: "water", colour: "#5FA9A3", traits: ["Inventive", "Playful", "Curious"], summary: "The Monkey is witty and inventive, solving puzzles with a grin." },
  { id: "rooster", name: "Rooster", index: 9, element: "Metal", yinYang: "Yin", group: "metal", colour: "#EE95A2", traits: ["Observant", "Honest", "Hard-working"], summary: "The Rooster is proud and precise, noticing every detail." },
  { id: "dog", name: "Dog", index: 10, element: "Earth", yinYang: "Yang", group: "fire", colour: "#EBCF6E", traits: ["Loyal", "Fair", "Protective"], summary: "The Dog is faithful and honest, a true friend for life." },
  { id: "pig", name: "Pig", index: 11, element: "Water", yinYang: "Yin", group: "wood", colour: "#6585AE", traits: ["Generous", "Sincere", "Easy-going"], summary: "The Pig is warm-hearted and generous, enjoying life's simple pleasures.", alsoKnownAs: "Also called the Boar." },
];

/** Secret-friend pairs, each with its own colour on the inner ring. */
export const SECRET_FRIENDS: { pair: [string, string]; colour: string; gem: string }[] = [
  { pair: ["rat", "ox"], colour: "#F2DC8A", gem: "Primrose" },
  { pair: ["tiger", "pig"], colour: "#95AE5E", gem: "Olive" },
  { pair: ["rabbit", "dog"], colour: "#B99CD8", gem: "Lavender" },
  { pair: ["dragon", "rooster"], colour: "#E8797B", gem: "Coral" },
  { pair: ["snake", "monkey"], colour: "#F3AEC8", gem: "Blossom" },
  { pair: ["horse", "goat"], colour: "#5CB2D8", gem: "Sky" },
];

/**
 * The four seasons on the wheel's outer edge. Each season belongs to an element and
 * covers three animals in a row (Pig, Rat and Ox are winter, which is Water, and so on).
 */
export const SEASONS: { element: Element; season: string; animals: string[]; colour: string; meaning: string }[] = [
  { element: "Water", season: "Winter", animals: ["pig", "rat", "ox"], colour: "#93CBE6", meaning: "rest, reflection and quiet planning" },
  { element: "Wood", season: "Spring", animals: ["tiger", "rabbit", "dragon"], colour: "#CFE2A2", meaning: "growth, fresh starts and new ideas" },
  { element: "Fire", season: "Summer", animals: ["snake", "horse", "goat"], colour: "#F4A3A0", meaning: "energy, warmth and full bloom" },
  { element: "Metal", season: "Autumn", animals: ["monkey", "rooster", "dog"], colour: "#BFC4CC", meaning: "harvest, clarity and letting go" },
];

export const seasonOf = (id: string) => SEASONS.find((s) => s.animals.includes(id))!;

/** Colours of the five elements, used on the wheel's outer rim. */
export const ELEMENT_COLOURS: Record<Element, string> = {
  Wood: "#2FA66A",
  Fire: "#E0503A",
  Earth: "#C9A24B",
  Metal: "#B8C2D6",
  Water: "#4A8BF0",
};

export const animalById = (id: string): Animal => {
  const a = ANIMALS.find((x) => x.id === id);
  if (!a) throw new Error(`Unknown animal: ${id}`);
  return a;
};

/** The unique side of each animal, shown when it is selected on the wheel. Lucky things are the traditional ones. */
export interface Profile {
  strengths: string;
  watchOut: string;
  love: string;
  work: string;
  luckyNumbers: number[];
  luckyColours: string[];
  luckyFlowers: string[];
}

export const PROFILES: Record<string, Profile> = {
  rat: {
    strengths: "Sharp, quick to adapt and brilliant at spotting an opportunity before anyone else.",
    watchOut: "Can worry about security and hold on too tightly to money or plans.",
    love: "Devoted and attentive once they trust you, and quietly romantic.",
    work: "Thrives in fast-moving roles: business, research, writing and anything that rewards clever thinking.",
    luckyNumbers: [2, 3], luckyColours: ["Blue", "Gold", "Green"], luckyFlowers: ["Lily", "African violet"],
  },
  ox: {
    strengths: "Patient, reliable and incredibly hard-working; what the Ox builds, lasts.",
    watchOut: "Can be stubborn and slow to accept change or other people's ideas.",
    love: "Loyal and steady, showing love through actions more than words.",
    work: "Shines where persistence pays: engineering, farming, finance, medicine and craft.",
    luckyNumbers: [1, 4], luckyColours: ["White", "Yellow", "Green"], luckyFlowers: ["Tulip", "Peach blossom"],
  },
  tiger: {
    strengths: "Brave, magnetic and protective, with the courage to lead from the front.",
    watchOut: "Can act on impulse and find it hard to sit still or take advice.",
    love: "Passionate and generous, but needs a partner who gives them freedom.",
    work: "Born for leadership, adventure, campaigning and starting new things.",
    luckyNumbers: [1, 3, 4], luckyColours: ["Blue", "Grey", "Orange"], luckyFlowers: ["Cineraria"],
  },
  rabbit: {
    strengths: "Gentle, tactful and elegant, with a real gift for creating peace and beauty.",
    watchOut: "Can avoid conflict so carefully that their own needs go unspoken.",
    love: "Tender and caring, seeking a calm, safe and loving home.",
    work: "Flourishes in design, the arts, counselling, diplomacy and caring roles.",
    luckyNumbers: [3, 4, 6], luckyColours: ["Red", "Pink", "Purple", "Blue"], luckyFlowers: ["Plantain lily", "Jasmine"],
  },
  dragon: {
    strengths: "Charismatic, confident and full of vision; the Dragon makes big things happen.",
    watchOut: "Can be proud or impatient when others cannot keep up.",
    love: "Ardent and loyal, looking for a partner who matches their fire.",
    work: "Excels as a leader, entrepreneur, performer or anywhere ambition is welcome.",
    luckyNumbers: [1, 6, 7], luckyColours: ["Gold", "Silver", "Grey"], luckyFlowers: ["Bleeding-heart vine", "Larkspur"],
  },
  snake: {
    strengths: "Wise, intuitive and composed, reading people and situations with uncanny accuracy.",
    watchOut: "Can keep feelings hidden and become suspicious or possessive.",
    love: "Deeply devoted, valuing trust and a meaningful, private bond.",
    work: "Suited to strategy, research, psychology, finance and the arts.",
    luckyNumbers: [2, 8, 9], luckyColours: ["Black", "Red", "Yellow"], luckyFlowers: ["Orchid", "Cactus"],
  },
  horse: {
    strengths: "Energetic, warm and independent, lighting up any room with enthusiasm.",
    watchOut: "Can grow restless and lose interest once the excitement fades.",
    love: "Fun-loving and affectionate, needing space as much as closeness.",
    work: "Happiest on the move: travel, sport, sales, media and anything with variety.",
    luckyNumbers: [2, 3, 7], luckyColours: ["Yellow", "Green"], luckyFlowers: ["Calla lily", "Jasmine"],
  },
  goat: {
    strengths: "Kind, creative and gentle, with a deep sense of beauty and compassion.",
    watchOut: "Can worry, doubt themselves or lean on others for reassurance.",
    love: "Romantic and sensitive, thriving with a protective, encouraging partner.",
    work: "Gifted in art, music, design, gardening and caring professions.",
    luckyNumbers: [2, 7], luckyColours: ["Brown", "Red", "Purple"], luckyFlowers: ["Carnation", "Primrose"],
  },
  monkey: {
    strengths: "Inventive, witty and curious, solving problems others give up on.",
    watchOut: "Can get bored easily or rely on cleverness instead of patience.",
    love: "Playful and lively, needing a partner who keeps up with their mind.",
    work: "Brilliant in science, technology, trading, entertainment and problem-solving.",
    luckyNumbers: [4, 9], luckyColours: ["White", "Blue", "Gold"], luckyFlowers: ["Chrysanthemum", "Crape myrtle"],
  },
  rooster: {
    strengths: "Observant, honest and organised, with high standards and real courage.",
    watchOut: "Can be blunt or critical, of others and of themselves.",
    love: "Faithful and protective, showing love through care and dependability.",
    work: "Excels where detail matters: accounting, medicine, journalism and planning.",
    luckyNumbers: [5, 7, 8], luckyColours: ["Gold", "Brown", "Yellow"], luckyFlowers: ["Gladiolus", "Cockscomb"],
  },
  dog: {
    strengths: "Loyal, fair and protective, the friend who always has your back.",
    watchOut: "Can be anxious or quick to see the worst in a situation.",
    love: "Sincere and devoted, giving their whole heart to the right person.",
    work: "Drawn to work with meaning: law, teaching, healthcare and community service.",
    luckyNumbers: [3, 4, 9], luckyColours: ["Red", "Green", "Purple"], luckyFlowers: ["Rose", "Cymbidium orchid"],
  },
  pig: {
    strengths: "Generous, warm-hearted and honest, enjoying life and sharing it with others.",
    watchOut: "Can be too trusting or indulge a little too much in life's pleasures.",
    love: "Affectionate and easy-going, creating a loving and comfortable home.",
    work: "Thrives in hospitality, the arts, charity work and anything that helps people.",
    luckyNumbers: [2, 5, 8], luckyColours: ["Yellow", "Grey", "Brown", "Gold"], luckyFlowers: ["Hydrangea", "Daisy"],
  },
};

/** The five elements (Wu Xing), shown on the wheel's outer edge and explained when tapped. */
export interface ElementInfo {
  id: Element;
  glyph: string;
  colour: string;
  season: string;
  direction: string;
  colourName: string;
  planet: string;
  body: string;
  essence: string;
  personality: string;
  strengths: string;
  watchOut: string;
  feeds: Element;
  fedBy: Element;
  controls: Element;
  controlledBy: Element;
  /** Last digits of the years ruled by this element. */
  digits: [number, number];
}

export const ELEMENTS: Record<Element, ElementInfo> = {
  Wood: {
    id: "Wood", glyph: "木", colour: "#CFE2A2", season: "Spring", direction: "East", colourName: "Green", planet: "Jupiter", body: "Liver",
    essence: "Wood is growth: the green shoot pushing up through the soil in spring.",
    personality: "Wood people are generous, creative and full of plans, always reaching for something better.",
    strengths: "Vision, kindness and the drive to build and improve.",
    watchOut: "Taking on too much, or frustration when progress is slow.",
    feeds: "Fire", fedBy: "Water", controls: "Earth", controlledBy: "Metal", digits: [4, 5],
  },
  Fire: {
    id: "Fire", glyph: "火", colour: "#F4A3A0", season: "Summer", direction: "South", colourName: "Red", planet: "Mars", body: "Heart",
    essence: "Fire is energy: the full warmth and light of summer.",
    personality: "Fire people are passionate, warm and expressive, lighting up everyone around them.",
    strengths: "Enthusiasm, courage and a gift for inspiring others.",
    watchOut: "Burning out, or acting before thinking.",
    feeds: "Earth", fedBy: "Wood", controls: "Metal", controlledBy: "Water", digits: [6, 7],
  },
  Earth: {
    id: "Earth", glyph: "土", colour: "#D9B66B", season: "The turn of each season", direction: "Centre", colourName: "Yellow", planet: "Saturn", body: "Stomach and spleen",
    essence: "Earth is balance: the steady ground at the centre that every season returns to.",
    personality: "Earth people are patient, practical and nurturing, the calm centre others lean on.",
    strengths: "Reliability, empathy and common sense.",
    watchOut: "Worrying too much, or resisting change.",
    feeds: "Metal", fedBy: "Fire", controls: "Water", controlledBy: "Wood", digits: [8, 9],
  },
  Metal: {
    id: "Metal", glyph: "金", colour: "#BFC4CC", season: "Autumn", direction: "West", colourName: "White", planet: "Venus", body: "Lungs",
    essence: "Metal is clarity: the crisp air of autumn and the harvest gathered in.",
    personality: "Metal people are determined, principled and precise, with a strong sense of right and wrong.",
    strengths: "Focus, discipline and the courage to let go of what no longer serves.",
    watchOut: "Being rigid, or holding on to grief and high standards too tightly.",
    feeds: "Water", fedBy: "Earth", controls: "Wood", controlledBy: "Fire", digits: [0, 1],
  },
  Water: {
    id: "Water", glyph: "水", colour: "#93CBE6", season: "Winter", direction: "North", colourName: "Black and blue", planet: "Mercury", body: "Kidneys",
    essence: "Water is wisdom: the still, deep rest of winter, gathering strength for spring.",
    personality: "Water people are intuitive, thoughtful and adaptable, flowing around obstacles rather than fighting them.",
    strengths: "Insight, diplomacy and a calm, reflective mind.",
    watchOut: "Fear of the unknown, or drifting without direction.",
    feeds: "Wood", fedBy: "Metal", controls: "Fire", controlledBy: "Earth", digits: [2, 3],
  },
};

/** Earth has no season of its own: it sits at the turn of each season, in the last animal of each. */
export const EARTH_ANIMALS = ["ox", "dragon", "goat", "dog"];
