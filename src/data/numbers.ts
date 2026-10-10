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

/** What each Challenge Number (0 to 8) asks you to learn. */
export const CHALLENGE_MEANINGS: Record<number, { keyword: string; text: string }> = {
  0: { keyword: "The Choice", text: "No single lesson is set for you, so you get to choose which ones to work on. The challenge is to notice where you hold back and pick your growth on purpose." },
  1: { keyword: "Standing Tall", text: "Learning to trust yourself and say what you need, without being pushed around or pushing others." },
  2: { keyword: "Sensitivity", text: "Learning not to take things too personally, and to value your own view as much as other people's." },
  3: { keyword: "Self-Expression", text: "Learning to share your real feelings openly, instead of hiding behind jokes or scattering your energy." },
  4: { keyword: "Discipline", text: "Learning steady habits and patience, while staying flexible enough to enjoy the journey." },
  5: { keyword: "Freedom", text: "Learning to handle change wisely: neither running from commitment nor clinging too tightly to what is safe." },
  6: { keyword: "Responsibility", text: "Learning to care without controlling, letting go of perfection, and letting people make their own choices." },
  7: { keyword: "Faith", text: "Learning to trust other people and life itself, and to open up rather than retreat into yourself." },
  8: { keyword: "Money and Power", text: "Learning a healthy, balanced relationship with money, success and control." },
};

/** The theme of each year in the nine-year Personal Year cycle. */
export const PERSONAL_YEAR_THEMES: Record<number, string> = {
  1: "A year of fresh starts. Seeds you plant now grow through the whole nine-year cycle, so be brave: begin the project, make the plan, step forward.",
  2: "A year of patience and partnership. What you started last year is growing quietly underground. Lean on cooperation, listen closely and rest when you can.",
  3: "A year of joy and expression. Life opens up socially and creatively, so share your ideas, say yes to invitations and let yourself have fun.",
  4: "A year of building foundations. Hard work, routines and organisation pay off now. It may feel slow, but what you build this year lasts.",
  5: "A year of change and freedom. Expect surprises, travel and new people. Stay flexible and welcome the shake-up rather than fighting it.",
  6: "A year of home and heart. Family, love and responsibility take centre stage. Care for the people around you, and let them care for you too.",
  7: "A year of reflection. A quieter, inward time for study, rest and finding answers within. Trust your intuition and make space to think.",
  8: "A year of harvest. Effort from earlier years can bring recognition, success and money matters into focus. Step into your power with confidence.",
  9: "A year of completion. Finish what needs finishing, forgive what you can and clear space, so you are ready for a fresh cycle that starts next year.",
};

/** The Life Path in depth: shown in its own section of the reading. */
export interface LifePathDeep {
  /** The big picture: what this path is about. */
  journey: string;
  strengths: string[];
  watchOut: string[];
  love: string;
  work: string;
  /** Ideas for paths and careers that often suit this number. */
  thrivesIn: string[];
  /** One gentle practice for growing on this path. */
  growth: string;
}

export const LIFE_PATH_DEEP: Record<number, LifePathDeep> = {
  1: {
    journey: "The 1 path is about learning to stand on your own feet and trust your own ideas. Life keeps handing you chances to go first, and each time you do, you grow more confident in who you are.",
    strengths: ["Courage to start things", "Original thinking", "Determination", "Natural leadership"],
    watchOut: ["Impatience with slower people", "Finding it hard to ask for help", "Taking on everything alone"],
    love: "You need a partner who admires your drive and gives you space, and who is strong enough to be your equal. Love deepens when you let them in on your plans rather than announcing them.",
    work: "You do your best work when you can lead, invent or work for yourself. Being micromanaged drains you; being trusted lights you up.",
    thrivesIn: ["Starting a business", "Leading a team", "Inventing and designing", "Any role with freedom to decide"],
    growth: "Once a week, ask someone for their opinion before you decide, and really listen. Strength grows when it includes other people.",
  },
  2: {
    journey: "The 2 path is about connection. You are here to bring people together, to sense what is unspoken and to show that gentleness is a kind of strength.",
    strengths: ["Deep empathy", "Diplomacy", "Patience", "Seeing both sides"],
    watchOut: ["Putting everyone else first", "Avoiding conflict until it builds up", "Taking criticism to heart"],
    love: "You are a devoted, attentive partner and you flourish with someone who notices your needs as closely as you notice theirs. Speak up early about the small things.",
    work: "You shine in teams, partnerships and any role that needs tact. You are often the quiet reason a group works well.",
    thrivesIn: ["Counselling and caring roles", "Mediation and HR", "Partnerships", "Music and the arts"],
    growth: "Practise saying what you want in one clear sentence. Your needs matter as much as keeping the peace.",
  },
  3: {
    journey: "The 3 path is about expression. Words, art, humour and joy come through you, and your journey is to share them fully instead of holding back.",
    strengths: ["Creativity", "Warmth and humour", "Gift with words", "Lifting others' spirits"],
    watchOut: ["Scattering energy over too many projects", "Hiding feelings behind jokes", "Self-doubt about your talent"],
    love: "You bring fun and romance and need a partner who enjoys your sparkle and lets you talk things through. Love grows when you share your quieter feelings too.",
    work: "You thrive where you can create, communicate or perform. A job that stifles your voice will wear you down.",
    thrivesIn: ["Writing and media", "Design and the arts", "Teaching and presenting", "Marketing and events"],
    growth: "Pick one creative project and finish it before starting the next. Your gifts shine brightest when they are focused.",
  },
  4: {
    journey: "The 4 path is about building something real and lasting. You are here to turn ideas into foundations that others can stand on.",
    strengths: ["Reliability", "Hard work", "Practical problem-solving", "Loyalty"],
    watchOut: ["Rigidity when plans change", "Working too hard to rest", "Worrying about security"],
    love: "You show love through steady, practical care, and you need a partner who values commitment. Remember to say the loving words as well as doing the loving things.",
    work: "You excel wherever things need organising, building or keeping on track. People trust you with what matters.",
    thrivesIn: ["Building and engineering", "Finance and planning", "Project management", "Crafts and trades"],
    growth: "Leave a little room in each week for something unplanned. Flexibility makes your foundations stronger, not weaker.",
  },
  5: {
    journey: "The 5 path is about freedom and experience. You learn by doing, travelling and trying, and your journey is to find a freedom that still has roots.",
    strengths: ["Adaptability", "Curiosity", "Courage to change", "Bringing energy into any room"],
    watchOut: ["Restlessness", "Leaving before things get deep", "Overindulging"],
    love: "You need a partner who is also an adventurer, or who gives you room to roam and welcomes you home. Commitment feels easier when it still feels like an adventure.",
    work: "You do best with variety, movement and new challenges. Routine work drains you fast.",
    thrivesIn: ["Travel and tourism", "Sales and promotion", "Journalism", "Freelance and varied work"],
    growth: "Choose one commitment that matters and give it your full attention for a season. Depth can be its own adventure.",
  },
  6: {
    journey: "The 6 path is about love, home and responsibility. You are here to care, to create beauty and to make the people around you feel at home.",
    strengths: ["Nurturing", "Sense of responsibility", "Eye for beauty", "Generosity"],
    watchOut: ["Taking on others' problems", "Perfectionism", "Worrying about everyone"],
    love: "You are a deeply loving partner and you thrive in a warm, committed home. Let your partner care for you as much as you care for them.",
    work: "You flourish in work that helps or beautifies, and where you feel part of a family. You are the heart of any team.",
    thrivesIn: ["Healthcare and teaching", "Interior and fashion design", "Hospitality", "Community work"],
    growth: "When someone brings you a problem, ask if they want help or just a listener. Not everything is yours to fix.",
  },
  7: {
    journey: "The 7 path is about seeking truth. You are here to ask deep questions, to study, reflect and trust the quiet voice inside.",
    strengths: ["Insight", "Analytical mind", "Intuition", "Depth"],
    watchOut: ["Withdrawing from people", "Overthinking", "Finding it hard to trust"],
    love: "You need a partner who respects your need for quiet and enjoys deep conversation. Love grows when you let them into your inner world.",
    work: "You excel at research, analysis and anything that rewards depth over speed. Give yourself time to think.",
    thrivesIn: ["Research and science", "Technology", "Writing and philosophy", "Spiritual and healing work"],
    growth: "Share one thought you would normally keep to yourself. Your insight helps more when it is heard.",
  },
  8: {
    journey: "The 8 path is about power and abundance. You are here to achieve, to lead and to learn how to use success well.",
    strengths: ["Ambition", "Business sense", "Resilience", "Ability to lead"],
    watchOut: ["Overworking", "Measuring worth by money", "Needing to be in control"],
    love: "You are a loyal, protective partner and you need someone who supports your ambitions and shares their own. Make space for softness as well as strength.",
    work: "You are built for responsibility and big goals, and you rise naturally to positions of authority.",
    thrivesIn: ["Business and management", "Finance and law", "Property", "Running your own company"],
    growth: "Give something away each month: time, money or knowledge. Abundance flows best when it circulates.",
  },
  9: {
    journey: "The 9 path is about compassion and completion. You are here to see the bigger picture, to give, and to learn to let go gracefully.",
    strengths: ["Compassion", "Wisdom", "Generosity", "Creative vision"],
    watchOut: ["Holding on to the past", "Giving until empty", "Feeling disappointed by others"],
    love: "You love deeply and idealistically and need a partner who shares your values. Love grows when you accept people as they are, not as they could be.",
    work: "You thrive in work with meaning: helping, healing, teaching or creating something that touches many people.",
    thrivesIn: ["Charity and campaigning", "Healing and teaching", "The arts", "International work"],
    growth: "Each season, let go of one thing that no longer serves you. Endings make room for your next chapter.",
  },
  11: {
    journey: "The 11 path is a master path: a heightened 2. You are here to inspire, often through intuition and sensitivity that others don't have.",
    strengths: ["Strong intuition", "Inspiring presence", "Spiritual insight", "Empathy"],
    watchOut: ["Nervous tension", "Self-doubt", "Feeling overwhelmed by other people's emotions"],
    love: "You need a gentle, understanding partner who values your sensitivity. Quiet time together recharges you both.",
    work: "You shine where you can inspire or guide others, and you often sense what people need before they ask.",
    thrivesIn: ["Teaching and coaching", "Healing work", "The arts", "Spiritual guidance"],
    growth: "Protect your energy with regular quiet time. Your gift is strongest when you are rested.",
  },
  22: {
    journey: "The 22 path is a master path: a heightened 4. You are here to turn big visions into real, lasting things that help many people.",
    strengths: ["Vision with practicality", "Leadership", "Discipline", "Thinking big"],
    watchOut: ["Pressure from your own potential", "Overwork", "Frustration when others can't see your vision"],
    love: "You need a partner who believes in your dreams and keeps you grounded. Make sure work doesn't crowd out love.",
    work: "You are made for large projects: organisations, buildings, movements. You can build what others only imagine.",
    thrivesIn: ["Architecture and engineering", "Leading organisations", "Politics and public service", "Large creative projects"],
    growth: "Break your big dream into one small step for this week. Master builders still lay one brick at a time.",
  },
  33: {
    journey: "The 33 path is the rarest master path: a heightened 6. You are here to heal, teach and love on a large scale.",
    strengths: ["Unconditional love", "Healing presence", "Teaching", "Selflessness"],
    watchOut: ["Carrying everyone's burdens", "Martyrdom", "Neglecting yourself"],
    love: "You love with your whole heart and need a partner who cares for you in return. Let yourself receive.",
    work: "You thrive in teaching, healing and caring work, and anywhere compassion is needed.",
    thrivesIn: ["Teaching", "Healthcare and therapy", "Charity work", "Spiritual leadership"],
    growth: "Before you give today, ask what you need. Caring for yourself is part of caring for the world.",
  },
};
