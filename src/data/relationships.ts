// Who the second person is to the reader, and how a compatibility reading talks about
// that kind of bond. Each relationship belongs to a kind, and each kind has its own
// wording for the zodiac wheel, the numbers and the tips, so a reading with your boss
// sounds different from one with your sister.

import type { Relation } from "../lib/chinese.ts";

export type KindId =
  | "love" | "parent" | "child" | "sibling" | "grandparent" | "grandchild" | "extended"
  | "friend" | "boss" | "colleague" | "report" | "mentor";

export interface Kind {
  /** What this kind of bond is about, opening the compatibility section. */
  intro: string;
  /** The zodiac wheel relationship, in this bond's voice. {me} and {them} are the two animals. */
  chinese: Record<Relation, string>;
  /** Life Paths in the same number family, or different ones. */
  numbers: { same: string; different: string };
  /** Three practical tips for this bond. */
  tips: string[];
}

export const KINDS: Record<KindId, Kind> = {
  love: {
    intro: "Romantic bonds are where we feel each other's energy most strongly. Here is how your signs and numbers meet, in love.",
    chinese: {
      same: "Two {me}s in love understand each other's instincts without a word, though you can also mirror each other's blind spots, so take turns leading.",
      friend: "Your {me} and their {them} share a friend group on the wheel: a natural, easy love that tends to feel like coming home.",
      secret: "Your {me} and their {them} are secret friends, one of the most loyal pairings on the wheel. This love often runs deeper than others can see.",
      clash: "Your {me} and their {them} sit opposite on the wheel. The pull can be magnetic, and so can the friction: this love grows strongest when you treat your differences as something to learn from.",
      neutral: "Your {me} and their {them} are neither friends nor rivals on the wheel, so this love is shaped most by the choices you make together.",
    },
    numbers: {
      same: "Your Life Paths share a family, so you want similar things from life and tend to move at the same pace as a couple.",
      different: "Your Life Paths come from different families, so each of you brings something the other is still learning. That keeps love interesting.",
    },
    tips: [
      "Say out loud what you love about each other, often. Small words keep a big bond warm.",
      "When you disagree, ask what your partner needs rather than who is right.",
      "Protect time that is only for the two of you, even when life is busy.",
    ],
  },
  parent: {
    intro: "The bond with a parent shapes us from the very start. Here is how your signs and numbers meet with theirs.",
    chinese: {
      same: "You and your parent are both {me}s, so you may recognise yourself in them, the good and the frustrating. That shared nature can become a deep understanding.",
      friend: "Your {me} and their {them} share a friend group on the wheel, which often means an easy, natural closeness between parent and child.",
      secret: "Your {me} and their {them} are secret friends: a quiet, loyal bond where they may understand you better than they show.",
      clash: "Your {me} and their {them} sit opposite on the wheel, so you may see the world very differently. Many of life's biggest lessons come from exactly this kind of parent.",
      neutral: "Your {me} and their {them} are neither friends nor rivals on the wheel, so your bond is shaped most by the time and care you give each other.",
    },
    numbers: {
      same: "Your Life Paths share a family, so your parent may understand your goals more easily than you expect.",
      different: "Your Life Paths come from different families. Your parent may want a different life for you than you want for yourself, and talking about that openly helps you both.",
    },
    tips: [
      "Ask them about their life before you were born. You may find more of yourself there than you think.",
      "Where you differ, remember they are working through their own Life Path too.",
      "A simple thank you for something specific can open a lot of doors.",
    ],
  },
  child: {
    intro: "Raising or loving a child is a two-way teaching. Here is how your signs and numbers meet with theirs.",
    chinese: {
      same: "You and your child are both {me}s, so you can read their moods easily. Give them room to become their own kind of {me}.",
      friend: "Your {me} and their {them} share a friend group on the wheel, which often means an easy, natural closeness and shared humour.",
      secret: "Your {me} and their {them} are secret friends: a quiet, loyal bond where they feel safe with you, even when they don't say so.",
      clash: "Your {me} and their {them} sit opposite on the wheel, so their way of doing things may puzzle you. They are here to show you a different side of life.",
      neutral: "Your {me} and their {them} are neither friends nor rivals on the wheel, so your bond grows through the everyday moments you share.",
    },
    numbers: {
      same: "Your Life Paths share a family, so you can guide them from real experience. Your road and theirs run in a similar direction.",
      different: "Your Life Paths come from different families, so the path that suits you may not be the one for them. Your gift is to support the road they choose.",
    },
    tips: [
      "Notice what lights them up, and say that you noticed.",
      "Let them see you make mistakes and put them right. It teaches more than perfection.",
      "Ask questions before giving advice. They often already know the answer.",
    ],
  },
  sibling: {
    intro: "Brothers and sisters know us longest. Here is how your signs and numbers meet with theirs.",
    chinese: {
      same: "You are both {me}s, so you may be easily compared, and also understand each other in a way nobody else can.",
      friend: "Your {me} and their {them} share a friend group on the wheel: siblings who tend to be natural allies and good company.",
      secret: "Your {me} and their {them} are secret friends: whatever happens, there is a loyalty here that runs deep.",
      clash: "Your {me} and their {them} sit opposite on the wheel, which can mean childhood squabbles and very different personalities. In later life, this often becomes the sibling who sees you most clearly.",
      neutral: "Your {me} and their {them} are neither friends nor rivals on the wheel, so your bond is shaped most by your shared history and the effort you both put in.",
    },
    numbers: {
      same: "Your Life Paths share a family, so you may want similar things from life, and sometimes compete for them. Cheer each other on.",
      different: "Your Life Paths come from different families, so you were never meant to follow the same road. Your differences make you a good team.",
    },
    tips: [
      "Leave old roles from childhood behind. You have both grown since then.",
      "Share a memory only the two of you have. It reminds you both what you share.",
      "Celebrate their wins as loudly as your own.",
    ],
  },
  grandparent: {
    intro: "Grandparents carry the family story. Here is how your signs and numbers meet with theirs.",
    chinese: {
      same: "You are both {me}s, a lovely echo across the generations. They may see their younger self in you.",
      friend: "Your {me} and their {them} share a friend group on the wheel, which often means a warm, easy bond and plenty of shared jokes.",
      secret: "Your {me} and their {them} are secret friends: a special, quiet bond where you may feel understood without explaining.",
      clash: "Your {me} and their {them} sit opposite on the wheel, and generations apart too. Their wisdom may come from a very different direction, which makes it worth hearing.",
      neutral: "Your {me} and their {them} are neither friends nor rivals on the wheel, so your bond grows through stories, time and care.",
    },
    numbers: {
      same: "Your Life Paths share a family, so their life lessons speak directly to yours.",
      different: "Your Life Paths come from different families, so they can show you a way of living that you might never have found on your own.",
    },
    tips: [
      "Ask them to tell you a story you have never heard.",
      "Write down what they teach you. One day it will be precious.",
      "Share something from your world with them, too. Curiosity goes both ways.",
    ],
  },
  grandchild: {
    intro: "A grandchild brings the family story forward. Here is how your signs and numbers meet with theirs.",
    chinese: {
      same: "You are both {me}s, a lovely echo across the generations. You may see your younger self in them.",
      friend: "Your {me} and their {them} share a friend group on the wheel, which often means an easy, joyful bond.",
      secret: "Your {me} and their {them} are secret friends: they may turn to you when they won't turn to anyone else.",
      clash: "Your {me} and their {them} sit opposite on the wheel, and generations apart too. They will keep you young by showing you the world anew.",
      neutral: "Your {me} and their {them} are neither friends nor rivals on the wheel, so your bond grows through the time you share.",
    },
    numbers: {
      same: "Your Life Paths share a family, so your experience can light the way for them.",
      different: "Your Life Paths come from different families, so they will walk a road unlike yours. Your gift is to cheer them on.",
    },
    tips: [
      "Tell them the family stories. They are part of who they are.",
      "Listen to their world without judging it. It is how they will listen to yours.",
      "Your time and attention matter more to them than anything you could buy.",
    ],
  },
  extended: {
    intro: "Aunts, uncles, cousins, nieces and nephews are family we often choose to stay close to. Here is how your signs and numbers meet with theirs.",
    chinese: {
      same: "You are both {me}s, so family gatherings may find you in the same corner, laughing at the same things.",
      friend: "Your {me} and their {them} share a friend group on the wheel: a relative who can also feel like a friend.",
      secret: "Your {me} and their {them} are secret friends: they may be the family member you turn to quietly when you need someone.",
      clash: "Your {me} and their {them} sit opposite on the wheel, so you may see things very differently. Keep it light, and you can learn a lot from each other.",
      neutral: "Your {me} and their {them} are neither friends nor rivals on the wheel, so this bond is what you both make of it.",
    },
    numbers: {
      same: "Your Life Paths share a family, so you may share similar dreams and understand each other's choices.",
      different: "Your Life Paths come from different families, so they can offer a fresh view on your life from just outside your closest circle.",
    },
    tips: [
      "Reach out between family events, not only at them.",
      "Be the relative you would have liked to have when you were younger.",
      "Share what you have in common, and stay curious about where you differ.",
    ],
  },
  friend: {
    intro: "Friends are the family we choose. Here is how your signs and numbers meet with theirs.",
    chinese: {
      same: "You are both {me}s, so you get each other's jokes and moods instantly. Just make sure one of you is looking out for your shared blind spots.",
      friend: "Your {me} and their {them} share a friend group on the wheel, the classic sign of an easy, lasting friendship.",
      secret: "Your {me} and their {them} are secret friends: the kind of friend who is there at three in the morning without being asked.",
      clash: "Your {me} and their {them} sit opposite on the wheel, so you will not always agree. The best friendships often grow from exactly this kind of honest difference.",
      neutral: "Your {me} and their {them} are neither friends nor rivals on the wheel, so this friendship is built on the time and trust you choose to share.",
    },
    numbers: {
      same: "Your Life Paths share a family, so you tend to enjoy the same things and move through life at a similar pace.",
      different: "Your Life Paths come from different families, so you each bring out a side of the other that might otherwise stay hidden.",
    },
    tips: [
      "Show up for the small things, not only the big ones.",
      "Tell them what their friendship means to you. People rarely hear it.",
      "Try something new together. Shared adventures make lasting memories.",
    ],
  },
  boss: {
    intro: "Working well with a manager can shape your whole career. Here is how your signs and numbers meet with theirs at work.",
    chinese: {
      same: "You and your boss are both {me}s, so you likely share a working style and can anticipate what they want. Watch that you don't both overlook the same risks.",
      friend: "Your {me} and their {them} share a friend group on the wheel, which usually makes for easy communication and mutual respect at work.",
      secret: "Your {me} and their {them} are secret friends: they may value and back you more than they say in meetings.",
      clash: "Your {me} and their {them} sit opposite on the wheel, so your working styles may differ. Agree clear expectations early, and your differences can cover each other's gaps.",
      neutral: "Your {me} and their {them} are neither friends nor rivals on the wheel, so this working relationship is built on clear communication and results.",
    },
    numbers: {
      same: "Your Life Paths share a family, so you likely value the same things at work, which makes it easier to agree on priorities.",
      different: "Your Life Paths come from different families, so you may define success differently. Ask what a great result looks like to them.",
    },
    tips: [
      "Ask how they like to receive updates, and stick to it.",
      "Bring a suggested solution along with every problem.",
      "Notice what they are under pressure from, and help where you can.",
    ],
  },
  colleague: {
    intro: "We spend a lot of our lives with the people we work beside. Here is how your signs and numbers meet with theirs at work.",
    chinese: {
      same: "You are both {me}s, so you can fall into an easy rhythm. Make sure you aren't both reaching for the same role on the team.",
      friend: "Your {me} and their {them} share a friend group on the wheel: a natural teammate you can rely on.",
      secret: "Your {me} and their {them} are secret friends: an ally at work who quietly has your back.",
      clash: "Your {me} and their {them} sit opposite on the wheel, so you may approach tasks very differently. Split the work by strengths and you become a strong pair.",
      neutral: "Your {me} and their {them} are neither friends nor rivals on the wheel, so this working relationship runs on fairness and good communication.",
    },
    numbers: {
      same: "Your Life Paths share a family, so you likely work in similar ways and value the same things in a job.",
      different: "Your Life Paths come from different families, so you bring different skills to the table. Together you cover more ground.",
    },
    tips: [
      "Give credit generously and in public.",
      "Agree who owns what before a project starts.",
      "Share a coffee or a break now and then. Trust grows outside meetings.",
    ],
  },
  report: {
    intro: "Leading someone well helps them grow. Here is how your signs and numbers meet with someone you manage.",
    chinese: {
      same: "You are both {me}s, so you can understand how they work. Make room for them to do things their own way.",
      friend: "Your {me} and their {them} share a friend group on the wheel, which usually means easy communication and trust.",
      secret: "Your {me} and their {them} are secret friends: a loyal team member who will go the extra mile for you.",
      clash: "Your {me} and their {them} sit opposite on the wheel, so they may work very differently from you. Judge them on results, not on method.",
      neutral: "Your {me} and their {them} are neither friends nor rivals on the wheel, so clear goals and regular feedback will shape this relationship.",
    },
    numbers: {
      same: "Your Life Paths share a family, so they are likely motivated by the same things as you.",
      different: "Your Life Paths come from different families, so ask what motivates them rather than assuming it is what motivates you.",
    },
    tips: [
      "Ask what they want to learn this year, and help them get there.",
      "Praise specific things, and give feedback early and kindly.",
      "Share the reasons behind decisions, not only the decisions.",
    ],
  },
  mentor: {
    intro: "A good teacher or mentor can change the direction of a life. Here is how your signs and numbers meet with theirs.",
    chinese: {
      same: "You are both {me}s, so their advice will often fit you like a glove.",
      friend: "Your {me} and their {them} share a friend group on the wheel, which makes learning from them feel natural and easy.",
      secret: "Your {me} and their {them} are secret friends: they may see your potential before you do.",
      clash: "Your {me} and their {them} sit opposite on the wheel, so their way of thinking may challenge yours. That challenge is often where the best learning happens.",
      neutral: "Your {me} and their {them} are neither friends nor rivals on the wheel, so this bond grows through your curiosity and their patience.",
    },
    numbers: {
      same: "Your Life Paths share a family, so they have likely walked a road close to yours, and their experience applies directly.",
      different: "Your Life Paths come from different families, so they can teach you things you would never learn on your own path.",
    },
    tips: [
      "Come with questions, not only for answers.",
      "Tell them how their advice helped. Teachers rarely hear it.",
      "Try what they suggest before deciding it isn't for you.",
    ],
  },
};

export interface RelationshipInfo {
  label: string;
  /** The section heading, e.g. "Your bond with your aunt". */
  bond: string;
  /** How to refer to them when no name is given. */
  them: string;
  kind: KindId;
  group: "Love" | "Family" | "Friends" | "Work";
}

const r = (label: string, bond: string, them: string, kind: KindId, group: RelationshipInfo["group"]): RelationshipInfo => ({ label, bond, them, kind, group });

export const RELATIONSHIPS = {
  partner: r("Partner", "Your relationship with your partner", "your partner", "love", "Love"),
  spouse: r("Husband or wife", "Your marriage", "your husband or wife", "love", "Love"),
  date: r("Crush or date", "Your connection", "your crush", "love", "Love"),
  mother: r("Mother", "Your bond with your mother", "your mother", "parent", "Family"),
  father: r("Father", "Your bond with your father", "your father", "parent", "Family"),
  son: r("Son", "Your bond with your son", "your son", "child", "Family"),
  daughter: r("Daughter", "Your bond with your daughter", "your daughter", "child", "Family"),
  brother: r("Brother", "Your bond with your brother", "your brother", "sibling", "Family"),
  sister: r("Sister", "Your bond with your sister", "your sister", "sibling", "Family"),
  grandmother: r("Grandmother", "Your bond with your grandmother", "your grandmother", "grandparent", "Family"),
  grandfather: r("Grandfather", "Your bond with your grandfather", "your grandfather", "grandparent", "Family"),
  grandson: r("Grandson", "Your bond with your grandson", "your grandson", "grandchild", "Family"),
  granddaughter: r("Granddaughter", "Your bond with your granddaughter", "your granddaughter", "grandchild", "Family"),
  aunt: r("Aunt", "Your bond with your aunt", "your aunt", "extended", "Family"),
  uncle: r("Uncle", "Your bond with your uncle", "your uncle", "extended", "Family"),
  cousin: r("Cousin", "Your bond with your cousin", "your cousin", "extended", "Family"),
  niece: r("Niece", "Your bond with your niece", "your niece", "extended", "Family"),
  nephew: r("Nephew", "Your bond with your nephew", "your nephew", "extended", "Family"),
  bestfriend: r("Best friend", "Your friendship with your best friend", "your best friend", "friend", "Friends"),
  friend: r("Friend", "Your friendship", "your friend", "friend", "Friends"),
  boss: r("Boss or manager", "Working with your boss", "your boss", "boss", "Work"),
  coworker: r("Co-worker", "Working with your co-worker", "your co-worker", "colleague", "Work"),
  business: r("Business partner", "Your business partnership", "your business partner", "colleague", "Work"),
  employee: r("Someone you manage", "Leading your team member", "your team member", "report", "Work"),
  mentor: r("Teacher or mentor", "Learning from your mentor", "your mentor", "mentor", "Work"),
} satisfies Record<string, RelationshipInfo>;

export type RelationshipId = keyof typeof RELATIONSHIPS;

/** Older links used "sibling", before brother and sister were split; keep them working. */
export const RELATIONSHIP_ALIASES: Record<string, RelationshipInfo> = {
  sibling: r("Sibling", "Your bond with your sibling", "your sibling", "sibling", "Family"),
};

export function relationshipById(id: string | null): RelationshipInfo | undefined {
  if (!id) return undefined;
  return (RELATIONSHIPS as Record<string, RelationshipInfo>)[id] ?? RELATIONSHIP_ALIASES[id];
}

export const RELATIONSHIP_GROUPS = ["Love", "Family", "Friends", "Work"] as const;
