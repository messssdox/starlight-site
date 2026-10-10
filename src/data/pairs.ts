// The pieces that blend a sun sign and a Chinese zodiac animal into one reading, such as
// "The Cancer Horse". Each sign and each animal gives a short phrase for every line of the
// reveal panel, and src/lib/pair.ts joins them, so every line speaks for both at once while
// staying about as long as the animal-only line it replaced.
import type { SignId, Element as WesternElement } from "./astrology.ts";
import type { Element as ChineseElement, GroupId } from "./zodiac.ts";

export interface SignPart {
  /** Approximate dates, for the sign wheel's date band. */
  dates: string;
  /** Season on the sign wheel's outer edge (northern hemisphere). */
  season: "Spring" | "Summer" | "Autumn" | "Winter";
  /** "You ..." sentence start for the summary line. */
  you: string;
  strengths: string;
  watchOut: string;
  love: string;
  work: string;
  wellbeing: string;
  careers: string[];
  /** The weekday of the sign's traditional ruling planet. */
  day: string;
  dayRuler: string;
  luckyNumber: number;
  luckyColour: string;
  luckyFlower: string;
}

export const SIGN_PARTS: Record<SignId, SignPart> = {
  aries: { dates: "21 Mar – 19 Apr", season: "Spring", you: "You charge at life with courage", strengths: "courage and drive", watchOut: "haste", love: "passionate and direct", work: "being first", wellbeing: "a good sweat", careers: ["Entrepreneur", "firefighter"], day: "Tuesday", dayRuler: "Mars", luckyNumber: 9, luckyColour: "Red", luckyFlower: "Honeysuckle" },
  taurus: { dates: "20 Apr – 20 May", season: "Spring", you: "You are calm, steady and loyal", strengths: "patience and loyalty", watchOut: "resistance to change", love: "loyal and affectionate", work: "building something solid", wellbeing: "good food and time in nature", careers: ["Chef", "banker"], day: "Friday", dayRuler: "Venus", luckyNumber: 6, luckyColour: "Green", luckyFlower: "Rose" },
  gemini: { dates: "21 May – 20 Jun", season: "Spring", you: "You are curious about everything", strengths: "curiosity and quick mind", watchOut: "scattered energy", love: "flirty and fun to talk to", work: "ideas and conversation", wellbeing: "a quiet mind at bedtime", careers: ["Journalist", "teacher"], day: "Wednesday", dayRuler: "Mercury", luckyNumber: 5, luckyColour: "Yellow", luckyFlower: "Lavender" },
  cancer: { dates: "21 Jun – 22 Jul", season: "Summer", you: "You feel deeply and look after the people you love", strengths: "caring, intuitive heart", watchOut: "moodiness", love: "devoted and nurturing", work: "looking after people", wellbeing: "a calm home to retreat to", careers: ["Nurse", "counsellor"], day: "Monday", dayRuler: "the Moon", luckyNumber: 2, luckyColour: "Silver", luckyFlower: "Larkspur" },
  leo: { dates: "23 Jul – 22 Aug", season: "Summer", you: "You light up a room", strengths: "warmth and creative confidence", watchOut: "need for praise", love: "generous and romantic", work: "a stage to shine on", wellbeing: "play and laughter", careers: ["Performer", "manager"], day: "Sunday", dayRuler: "the Sun", luckyNumber: 1, luckyColour: "Gold", luckyFlower: "Sunflower" },
  virgo: { dates: "23 Aug – 22 Sep", season: "Summer", you: "You notice what others miss", strengths: "practical skill and care", watchOut: "self-criticism", love: "thoughtful and quietly caring", work: "fixing and improving", wellbeing: "a tidy routine", careers: ["Doctor", "editor"], day: "Wednesday", dayRuler: "Mercury", luckyNumber: 5, luckyColour: "Navy", luckyFlower: "Aster" },
  libra: { dates: "23 Sep – 22 Oct", season: "Autumn", you: "You bring people together", strengths: "charm and gift for harmony", watchOut: "people-pleasing", love: "charming and partnership-minded", work: "teamwork and fairness", wellbeing: "beauty and calm around you", careers: ["Designer", "mediator"], day: "Friday", dayRuler: "Venus", luckyNumber: 6, luckyColour: "Pink", luckyFlower: "Hydrangea" },
  scorpio: { dates: "23 Oct – 21 Nov", season: "Autumn", you: "You live life at depth", strengths: "depth and determination", watchOut: "grudges", love: "intense and all-or-nothing", work: "getting to the truth", wellbeing: "deep rest and honest talk", careers: ["Psychologist", "investigator"], day: "Tuesday", dayRuler: "Mars", luckyNumber: 8, luckyColour: "Burgundy", luckyFlower: "Chrysanthemum" },
  sagittarius: { dates: "22 Nov – 21 Dec", season: "Autumn", you: "You are always looking further ahead", strengths: "optimism and love of adventure", watchOut: "overpromising", love: "warm but freedom-loving", work: "learning and travel", wellbeing: "open air and movement", careers: ["Travel writer", "lecturer"], day: "Thursday", dayRuler: "Jupiter", luckyNumber: 3, luckyColour: "Purple", luckyFlower: "Carnation" },
  capricorn: { dates: "22 Dec – 19 Jan", season: "Winter", you: "You build success step by step", strengths: "ambition and discipline", watchOut: "habit of overworking", love: "serious and committed", work: "responsibility and long-term goals", wellbeing: "real time off", careers: ["Manager", "architect"], day: "Saturday", dayRuler: "Saturn", luckyNumber: 4, luckyColour: "Brown", luckyFlower: "Pansy" },
  aquarius: { dates: "20 Jan – 18 Feb", season: "Winter", you: "You march to your own drum", strengths: "originality and big-picture thinking", watchOut: "habit of keeping feelings at a distance", love: "friendly but independent", work: "new ideas and good causes", wellbeing: "time with like-minded friends", careers: ["Inventor", "scientist"], day: "Saturday", dayRuler: "Saturn", luckyNumber: 4, luckyColour: "Turquoise", luckyFlower: "Orchid" },
  pisces: { dates: "19 Feb – 20 Mar", season: "Winter", you: "You feel everything and dream big", strengths: "compassion and imagination", watchOut: "habit of escaping into daydreams", love: "tender and deeply romantic", work: "creativity and helping others", wellbeing: "quiet time near water", careers: ["Artist", "therapist"], day: "Thursday", dayRuler: "Jupiter", luckyNumber: 7, luckyColour: "Sea green", luckyFlower: "Water lily" },
};

export interface AnimalPart {
  /** Finishes "like the Horse you are ...". */
  you: string;
  strengths: string;
  watchOut: string;
  /** Finishes "like the Horse you ...". */
  love: string;
  work: string;
  wellbeing: string;
}

export const ANIMAL_PARTS: Record<string, AnimalPart> = {
  rat: { you: "clever and adaptable", strengths: "quick wit and eye for an opportunity", watchOut: "worry about security", love: "are quietly romantic once you trust someone", work: "clever, fast-moving work", wellbeing: "screen-free evenings" },
  ox: { you: "steady and hard-working", strengths: "patience and staying power", watchOut: "stubborn streak", love: "show love through actions more than words", work: "steady work that rewards persistence", wellbeing: "rest days and stretching" },
  tiger: { you: "bold and magnetic", strengths: "courage and natural leadership", watchOut: "impatience and need to win", love: "love with passion and fierce protection", work: "a challenge to lead", wellbeing: "hard exercise to burn off energy" },
  rabbit: { you: "graceful and kind", strengths: "grace, tact and gentle intuition", watchOut: "habit of avoiding conflict", love: "want a calm, gentle and loyal bond", work: "calm, creative surroundings", wellbeing: "peace, quiet and early nights" },
  dragon: { you: "powerful and full of big ideas", strengths: "energy, vision and big ideas", watchOut: "impatience with slower people", love: "love big and like to be admired", work: "big, ambitious projects", wellbeing: "real rest between big pushes" },
  snake: { you: "thoughtful and perceptive", strengths: "quiet wisdom and sharp insight", watchOut: "secrecy and suspicion", love: "love deeply but take time to trust", work: "work that needs deep thinking", wellbeing: "quiet time alone" },
  horse: { you: "happiest when moving forward", strengths: "energy and independence", watchOut: "restlessness once the excitement fades", love: "need space as much as closeness", work: "travel, sport and variety", wellbeing: "daily exercise outdoors" },
  goat: { you: "artistic and gentle", strengths: "creativity and kindness", watchOut: "worrying and indecision", love: "need tenderness and reassurance", work: "art, beauty and kindness", wellbeing: "creative hobbies and calm" },
  monkey: { you: "witty and inventive", strengths: "inventiveness and playful wit", watchOut: "habit of getting bored or cutting corners", love: "keep love playful and fun", work: "puzzles to solve", wellbeing: "fresh challenges for your mind" },
  rooster: { you: "proud and precise", strengths: "eye for detail and honesty", watchOut: "bluntness and perfectionism", love: "are devoted, honest and a little proud", work: "precision and high standards", wellbeing: "a steady daily routine" },
  dog: { you: "faithful and honest", strengths: "loyalty and sense of fairness", watchOut: "anxiety and black-and-white thinking", love: "are loyal for life once you commit", work: "work that helps or protects people", wellbeing: "time to switch off from worry" },
  pig: { you: "warm-hearted and generous", strengths: "generosity and warm heart", watchOut: "habit of trusting too easily", love: "give your whole heart, generously", work: "a friendly team and a good cause", wellbeing: "balance with food and treats" },
};

/** How a sign's Western element meets the animal's own Chinese element. `{A}` is the animal's name. */
export const ELEMENT_BLEND: Record<WesternElement, Record<ChineseElement, string>> = {
  Fire: {
    Wood: "The {A}'s Wood feeds your Fire, so your spark keeps burning.",
    Fire: "That is a double dose of Fire: bold, warm and fast.",
    Earth: "Your Fire warms the {A}'s Earth, so drive turns into results.",
    Metal: "Your Fire shapes the {A}'s Metal, turning big feelings into firm plans.",
    Water: "The {A}'s Water cools your Fire, so feeling tempers your drive.",
  },
  Earth: {
    Wood: "The {A}'s Wood keeps your Earth growing, so steadiness never turns stale.",
    Fire: "The {A}'s Fire warms your Earth, adding energy to your patience.",
    Earth: "That is a double dose of Earth: grounded, patient and reliable.",
    Metal: "Your Earth feeds the {A}'s Metal, so patience becomes strength.",
    Water: "Your Earth gives the {A}'s Water a shape, so ideas get finished.",
  },
  Air: {
    Wood: "Your Air helps the {A}'s Wood spread, like wind carrying seeds.",
    Fire: "Your Air fans the {A}'s Fire, so ideas catch light quickly.",
    Earth: "Your Air lightens the {A}'s Earth, so plans stay flexible.",
    Metal: "Your Air and the {A}'s Metal make a clear, sharp mind.",
    Water: "Your Air stirs the {A}'s Water, so thoughts and feelings keep moving.",
  },
  Water: {
    Wood: "Your Water feeds the {A}'s Wood, so your care helps things grow.",
    Fire: "Your Water cools the {A}'s Fire, so feeling tempers drive.",
    Earth: "The {A}'s Earth gives your Water steady banks, so moods settle.",
    Metal: "The {A}'s Metal feeds your Water, so intuition comes with clarity.",
    Water: "That is a double dose of Water: intuitive, deep and adaptable.",
  },
};

/** Why fellow signs of the same element suit you (the sign half of the Friends box). */
export const SIGN_FRIEND: Record<WesternElement, string> = {
  Fire: "Fellow Fire signs match your enthusiasm",
  Earth: "Fellow Earth signs share your common sense",
  Air: "Fellow Air signs keep up with your ideas",
  Water: "Fellow Water signs understand your feelings",
};

/** Why the animal's friend group suits it (the animal half of the Friends box). */
export const ANIMAL_FRIEND: Record<GroupId, string> = {
  water: "think as fast as you do",
  metal: "share your sense of duty",
  fire: "stand up for what is right with you",
  wood: "share your kindness and love of peace",
};

/** The secret-friend sign is two signs on, an element that completes yours. */
export const SIGN_SECRET: Record<WesternElement, string> = {
  Fire: "Air feeds your Fire with ideas",
  Air: "Fire brings your ideas to life",
  Earth: "Water softens your Earth",
  Water: "Earth gives your Water a safe shore",
};

/** Colours for the sign wheel: same colour = same element = friends. */
export const SIGN_ELEMENT_COLOURS: Record<WesternElement, string> = {
  Fire: "#E8797B",
  Earth: "#95AE5E",
  Air: "#B99CD8",
  Water: "#5FA9A3",
};

/** The four seasons on the sign wheel's outer edge. */
export const SIGN_SEASONS: { season: string; first: number; colour: string }[] = [
  { season: "Spring", first: 0, colour: "#CFE2A2" },
  { season: "Summer", first: 3, colour: "#F4A3A0" },
  { season: "Autumn", first: 6, colour: "#BFC4CC" },
  { season: "Winter", first: 9, colour: "#93CBE6" },
];
