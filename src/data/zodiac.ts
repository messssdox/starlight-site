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
  { id: "rabbit", name: "Rabbit", index: 3, element: "Wood", yinYang: "Yin", group: "wood", colour: "#6585AE", traits: ["Gentle", "Elegant", "Intuitive"], summary: "The Rabbit is graceful and kind, with a gift for creating calm and beauty." },
  { id: "dragon", name: "Dragon", index: 4, element: "Earth", yinYang: "Yang", group: "water", colour: "#5FA9A3", traits: ["Ambitious", "Energetic", "Lucky"], summary: "The Dragon is powerful and visionary, full of life and big ideas." },
  { id: "snake", name: "Snake", index: 5, element: "Fire", yinYang: "Yin", group: "metal", colour: "#EE95A2", traits: ["Wise", "Intuitive", "Refined"], summary: "The Snake is thoughtful and perceptive, trusting deep inner wisdom." },
  { id: "horse", name: "Horse", index: 6, element: "Fire", yinYang: "Yang", group: "fire", colour: "#EBCF6E", traits: ["Free-spirited", "Lively", "Warm"], summary: "The Horse is energetic and independent, happiest when moving forward." },
  { id: "goat", name: "Goat", index: 7, element: "Earth", yinYang: "Yin", group: "wood", colour: "#6585AE", traits: ["Creative", "Compassionate", "Calm"], summary: "The Goat is artistic and gentle, with a deep need for harmony." },
  { id: "monkey", name: "Monkey", index: 8, element: "Metal", yinYang: "Yang", group: "water", colour: "#5FA9A3", traits: ["Inventive", "Playful", "Curious"], summary: "The Monkey is witty and inventive, solving puzzles with a grin." },
  { id: "rooster", name: "Rooster", index: 9, element: "Metal", yinYang: "Yin", group: "metal", colour: "#EE95A2", traits: ["Observant", "Honest", "Hard-working"], summary: "The Rooster is proud and precise, noticing every detail." },
  { id: "dog", name: "Dog", index: 10, element: "Earth", yinYang: "Yang", group: "fire", colour: "#EBCF6E", traits: ["Loyal", "Fair", "Protective"], summary: "The Dog is faithful and honest, a true friend for life." },
  { id: "pig", name: "Pig", index: 11, element: "Water", yinYang: "Yin", group: "wood", colour: "#6585AE", traits: ["Generous", "Sincere", "Easy-going"], summary: "The Pig is warm-hearted and generous, enjoying life's simple pleasures." },
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
