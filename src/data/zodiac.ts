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
  /** Hex colour of this animal's segment: a shade of its group's colour family. */
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
  water: { id: "water", name: "The Thinkers", element: "Water", family: "Sapphire", colour: "#4A8BF0", meaning: "Quick, clever and resourceful. They plan ahead and adapt to anything." },
  metal: { id: "metal", name: "The Builders", element: "Metal", family: "Pearl", colour: "#B8C2D6", meaning: "Steady, loyal and principled. They finish what they start." },
  fire: { id: "fire", name: "The Protectors", element: "Fire", family: "Ember", colour: "#E0503A", meaning: "Brave, warm and idealistic. They stand up for what is right." },
  wood: { id: "wood", name: "The Diplomats", element: "Wood", family: "Jade", colour: "#2FA66A", meaning: "Kind, creative and peace-loving. They bring people together." },
};

export const ANIMALS: Animal[] = [
  { id: "rat", name: "Rat", index: 0, element: "Water", yinYang: "Yang", group: "water", colour: "#2E6FD8", traits: ["Quick-witted", "Resourceful", "Charming"], summary: "The Rat is clever and adaptable, always spotting the opportunity others miss." },
  { id: "ox", name: "Ox", index: 1, element: "Earth", yinYang: "Yin", group: "metal", colour: "#8E9AB3", traits: ["Dependable", "Patient", "Strong"], summary: "The Ox is steady and hard-working, building success slowly and surely." },
  { id: "tiger", name: "Tiger", index: 2, element: "Wood", yinYang: "Yang", group: "fire", colour: "#C93A3A", traits: ["Brave", "Confident", "Passionate"], summary: "The Tiger is bold and magnetic, a natural leader who loves a challenge." },
  { id: "rabbit", name: "Rabbit", index: 3, element: "Wood", yinYang: "Yin", group: "wood", colour: "#23885A", traits: ["Gentle", "Elegant", "Intuitive"], summary: "The Rabbit is graceful and kind, with a gift for creating calm and beauty." },
  { id: "dragon", name: "Dragon", index: 4, element: "Earth", yinYang: "Yang", group: "water", colour: "#4A8BF0", traits: ["Ambitious", "Energetic", "Lucky"], summary: "The Dragon is powerful and visionary, full of life and big ideas." },
  { id: "snake", name: "Snake", index: 5, element: "Fire", yinYang: "Yin", group: "metal", colour: "#B8C2D6", traits: ["Wise", "Intuitive", "Refined"], summary: "The Snake is thoughtful and perceptive, trusting deep inner wisdom." },
  { id: "horse", name: "Horse", index: 6, element: "Fire", yinYang: "Yang", group: "fire", colour: "#E0503A", traits: ["Free-spirited", "Lively", "Warm"], summary: "The Horse is energetic and independent, happiest when moving forward." },
  { id: "goat", name: "Goat", index: 7, element: "Earth", yinYang: "Yin", group: "wood", colour: "#2FA66A", traits: ["Creative", "Compassionate", "Calm"], summary: "The Goat is artistic and gentle, with a deep need for harmony." },
  { id: "monkey", name: "Monkey", index: 8, element: "Metal", yinYang: "Yang", group: "water", colour: "#7AAEFF", traits: ["Inventive", "Playful", "Curious"], summary: "The Monkey is witty and inventive, solving puzzles with a grin." },
  { id: "rooster", name: "Rooster", index: 9, element: "Metal", yinYang: "Yin", group: "metal", colour: "#DCE2EC", traits: ["Observant", "Honest", "Hard-working"], summary: "The Rooster is proud and precise, noticing every detail." },
  { id: "dog", name: "Dog", index: 10, element: "Earth", yinYang: "Yang", group: "fire", colour: "#F27A4A", traits: ["Loyal", "Fair", "Protective"], summary: "The Dog is faithful and honest, a true friend for life." },
  { id: "pig", name: "Pig", index: 11, element: "Water", yinYang: "Yin", group: "wood", colour: "#5CC98F", traits: ["Generous", "Sincere", "Easy-going"], summary: "The Pig is warm-hearted and generous, enjoying life's simple pleasures." },
];

/** Secret-friend pairs, each with its own jewel tone on the inner ring. */
export const SECRET_FRIENDS: { pair: [string, string]; colour: string; gem: string }[] = [
  { pair: ["rat", "ox"], colour: "#9B6BE0", gem: "Amethyst" },
  { pair: ["tiger", "pig"], colour: "#E6A23C", gem: "Amber" },
  { pair: ["rabbit", "dog"], colour: "#E57AA8", gem: "Rose quartz" },
  { pair: ["dragon", "rooster"], colour: "#3CC6C0", gem: "Turquoise" },
  { pair: ["snake", "monkey"], colour: "#D9CF4A", gem: "Citrine" },
  { pair: ["horse", "goat"], colour: "#F08A6B", gem: "Coral" },
];

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
