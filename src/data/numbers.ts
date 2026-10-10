// What each number means, in three depths to match the three reading tiers.

export interface NumberMeaning {
  keyword: string;
  /** Quick Glance: one line. */
  essence: string;
  /** First Timers: a friendly paragraph. */
  gentle: string;
}

export const NUMBER_MEANINGS: Record<number, NumberMeaning> = {
  1: { keyword: "The Pioneer", essence: "Independent, driven and original.", gentle: "One is the number of beginnings. You are happiest leading the way, trusting your own ideas and starting things others only talk about. Your lesson is to lead with confidence while letting others in." },
  2: { keyword: "The Peacemaker", essence: "Gentle, intuitive and cooperative.", gentle: "Two is the number of partnership. You sense what others feel and bring people together. Your lesson is to value your own needs as much as you value harmony." },
  3: { keyword: "The Creator", essence: "Expressive, joyful and imaginative.", gentle: "Three is the number of creativity and communication. Words, art and laughter come naturally to you. Your lesson is to focus your many gifts so they can fully shine." },
  4: { keyword: "The Builder", essence: "Steady, practical and loyal.", gentle: "Four is the number of foundations. You build things that last, through patience and honest effort. Your lesson is to stay open to change while keeping your solid ground." },
  5: { keyword: "The Adventurer", essence: "Free, curious and adaptable.", gentle: "Five is the number of freedom. You learn by experience and love variety, travel and new ideas. Your lesson is to find freedom that still has roots." },
  6: { keyword: "The Nurturer", essence: "Caring, responsible and warm.", gentle: "Six is the number of love and home. You look after people and create beauty and comfort around you. Your lesson is to care for yourself as generously as you care for others." },
  7: { keyword: "The Seeker", essence: "Wise, reflective and spiritual.", gentle: "Seven is the number of inner wisdom. You ask deep questions and need quiet time to find the answers. Your lesson is to trust your intuition and share what you discover." },
  8: { keyword: "The Achiever", essence: "Ambitious, capable and strong.", gentle: "Eight is the number of power and abundance. You have a gift for turning vision into results. Your lesson is to balance material success with generosity and heart." },
  9: { keyword: "The Humanitarian", essence: "Compassionate, wise and generous.", gentle: "Nine is the number of completion. You see the bigger picture and want to make the world kinder. Your lesson is to let go gracefully and give without losing yourself." },
  11: { keyword: "The Intuitive", essence: "Inspired, sensitive and visionary.", gentle: "Eleven is a master number: a heightened Two. You have strong intuition and can inspire others simply by being yourself. Your lesson is to trust your sensitivity rather than fear it." },
  22: { keyword: "The Master Builder", essence: "Visionary, practical and powerful.", gentle: "Twenty-two is a master number: a heightened Four. You can turn big dreams into real, lasting things that help many people. Your lesson is to believe the vision is possible." },
  33: { keyword: "The Master Teacher", essence: "Loving, healing and selfless.", gentle: "Thirty-three is a master number: a heightened Six. Your path is about compassion, healing and guiding others. Your lesson is to serve without carrying everyone's burdens alone." },
};

/** Life Path numbers that traditionally flow together: 1-5-7 (independent minds), 2-4-8 (builders), 3-6-9 (creative hearts). */
export const NUMBER_FAMILIES = [
  { members: [1, 5, 7], name: "independent minds" },
  { members: [2, 4, 8, 11, 22], name: "steady builders" },
  { members: [3, 6, 9, 33], name: "creative hearts" },
];

export const RELATIONSHIPS = {
  partner: { label: "Partner", bond: "Your relationship with your partner", them: "your partner" },
  mother: { label: "Mother", bond: "Your bond with your mother", them: "your mother" },
  father: { label: "Father", bond: "Your bond with your father", them: "your father" },
  son: { label: "Son", bond: "Your bond with your son", them: "your son" },
  daughter: { label: "Daughter", bond: "Your bond with your daughter", them: "your daughter" },
  sibling: { label: "Sibling", bond: "Your bond with your sibling", them: "your sibling" },
  friend: { label: "Friend", bond: "Your friendship", them: "your friend" },
} as const;

export type RelationshipId = keyof typeof RELATIONSHIPS;
