// Wording for the parts of a relationship reading that are built from both people's
// charts together. Each combination has two wordings, and the reading picks one from both
// birth dates, so two different pairs rarely read the same.
//
// Placeholders: {them} is the other person as an object ("Sam", "your partner", "you"),
// {their} its possessive ("Sam's", "your"). Never write "they" or "their" for the other
// person, because in the second half of Start and stop the other person is "you".

import type { SignId } from "./astrology.ts";
import type { PairPlanet } from "./synastry.ts";
import type { Relation } from "../lib/chinese.ts";

type Two = [string, string];

/** Two Western elements meeting. Keyed by both elements in alphabetical order; {Fire} etc. is whoever holds that element, {A} and {B} when both share one. */
export const ELEMENT_MEET: Record<string, Two> = {
  "Fire|Fire": [
    "{A} and {B} are both Fire, so there is plenty of heat and enthusiasm here, and it burns brightest when you chase something together.",
    "{A} and {B} are both Fire signs: quick sparks, big feelings and a shared love of momentum. Just make sure someone keeps an eye on the embers.",
  ],
  "Earth|Earth": [
    "{A} and {B} are both Earth, so you value the same solid, real things and trust what you can see and touch.",
    "{A} and {B} are both Earth signs: steady, practical and built to last, though you may need a nudge to try something new.",
  ],
  "Air|Air": [
    "{A} and {B} are both Air, so ideas bounce between you and the talk rarely runs dry.",
    "{A} and {B} are both Air signs: light, curious and quick, though feelings can end up talked about more than felt.",
  ],
  "Water|Water": [
    "{A} and {B} are both Water, so you read each other's feelings almost without trying.",
    "{A} and {B} are both Water signs: deep and tuned in, which is lovely until you both sink into the same mood at once.",
  ],
  "Earth|Fire": [
    "{Fire} brings the spark and {Earth} brings the ground: one wants to go now, the other wants to be sure. Together that is a plan with a pulse.",
    "{Fire} is Fire and {Earth} is Earth, so one rushes ahead while the other checks the footing. Fire warms Earth, and Earth gives Fire somewhere to land.",
  ],
  "Air|Fire": [
    "{Air} is Air and {Fire} is Fire, and air feeds a flame: ideas on one side become action on the other.",
    "{Fire} and {Air} make a lively mix of Fire and Air. You egg each other on, which is wonderful for fun and risky for overcommitting.",
  ],
  "Fire|Water": [
    "{Fire} is Fire and {Water} is Water, which makes steam: lots of heat and feeling, best let off gently rather than all at once.",
    "{Fire} burns hot and {Water} runs deep. One acts on a feeling straight away while the other sits with it first, so allow time to catch up.",
  ],
  "Air|Earth": [
    "{Earth} is Earth and {Air} is Air: one thinks in plans, the other in possibilities. Pair the ideas with the follow-through and you go far.",
    "{Air} brings the ideas and {Earth} brings the means to make them real. Just don't mistake caution for doubt, or chat for flakiness.",
  ],
  "Earth|Water": [
    "{Earth} is Earth and {Water} is Water, a naturally nourishing mix: Earth gives Water a shape, and Water softens Earth.",
    "{Water} and {Earth} meet as Water and Earth: feeling and steadiness, which together make something fertile and safe.",
  ],
  "Air|Water": [
    "{Air} is Air and {Water} is Water: one wants to talk it through, the other wants to feel it through. Both are right, in turn.",
    "{Water} feels and {Air} reasons, Water and Air in one bond. Each can show the other a side of life that does not come naturally.",
  ],
};

/** Two modalities meeting: how each sign gets things moving. {Cardinal} etc. is whoever has it, {A} and {B} when they match. */
export const MODALITY_MEET: Record<string, Two> = {
  "Cardinal|Cardinal": [
    "Both signs are starters, so decide who leads on what before you both grab the wheel.",
    "Two cardinal signs bring plenty of initiative, and the odd tug of war over who goes first.",
  ],
  "Fixed|Fixed": [
    "Both signs hold their ground, which makes this part of you loyal and hard to shift, including in an argument.",
    "Two fixed signs make a steady anchor: very reliable, and very slow to back down.",
  ],
  "Mutable|Mutable": [
    "Both signs adapt easily, so you go with the flow together, though someone still has to decide sometimes.",
    "Two mutable signs are easy-going and open, with a risk of drifting when no one takes charge.",
  ],
  "Cardinal|Fixed": [
    "{Cardinal} likes to start things and {Fixed} likes to see them through, a strong team when you respect both jobs.",
    "{Fixed} keeps things steady while {Cardinal} keeps them moving, so agree when it is time to change and when to stay put.",
  ],
  "Cardinal|Mutable": [
    "{Cardinal} sets the direction and {Mutable} adjusts along the way, so plans can bend without breaking.",
    "{Mutable} is happy to adapt to the lead of {Cardinal}, as long as the plan leaves a little room to change.",
  ],
  "Fixed|Mutable": [
    "{Fixed} holds steady while {Mutable} stays flexible: a rock and a river, each useful when the other is stuck.",
    "{Mutable} brings fresh options and {Fixed} brings staying power, so neither of you gets stuck or scattered for long.",
  ],
};

/** How a link reads in a short list line: "your Leo Sun and Sam's Aries Sun share Fire". */
export const LINK_PHRASE = {
  same: "are the same sign",
  neighbour: "sit side by side",
  sextile: "sit two signs apart, a friendly match",
  square: "square each other",
  trine: "share {element}",
  quincunx: "have little in common",
  opposite: "sit opposite each other",
} as const;

/** Start: what a Moon in each sign needs to feel safe. */
export const MOON_NEEDS: Record<SignId, string[]> = {
  aries: ["Let {them} blow off steam with something active first, and talk once the heat has passed.", "Allow {them} a fast first reaction, and don't hold it against {them} afterwards.", "Let {them} vent first and fix it fast; a Moon in Aries hates a problem left hanging overnight."],
  taurus: ["Offer {them} calm and comfort: a good meal, a quiet evening, no sudden changes of plan.", "Keep your word to {them} on the small things; steady routines are what feel safe to a Taurus Moon.", "Bring {them} a favourite snack and sit together quietly; for a Taurus Moon, calm company says more than any speech."],
  gemini: ["Ask {them} what is on {their} mind, and keep it light enough to think out loud.", "Send {them} the little message or the funny link; for a Gemini Moon, staying in touch is feeling close.", "Talk it through with {them} as long as it takes; a Gemini Moon feels better once the feeling has words."],
  cancer: ["Make home a soft place to land for {them}, and ask about {their} day before you share yours.", "Follow up on what mattered to {them} last week; being remembered means a lot to a Cancer Moon.", "Check in on {them} with a text that says you remembered; a Cancer Moon keeps those for years."],
  leo: ["Praise {them} out loud for something specific; warm, honest appreciation refuels a Leo Moon.", "Make {them} feel chosen: plan something special just for {them} now and then.", "Tell {them} you're proud of {them}, in front of people who matter to {them}."],
  virgo: ["Help {them} with something practical when stress builds, rather than saying not to worry.", "Notice {their} quiet, behind-the-scenes effort, and say so.", "Take one job off {their} list without being asked; for a Virgo Moon that is a love letter."],
  libra: ["Raise problems with {them} early and gently, before they grow; peace matters to a Libra Moon.", "Make time for something lovely with {them}: a nice place, good music, a shared treat.", "Keep your tone gentle with {them}, even in a disagreement; harsh words linger with a Libra Moon."],
  scorpio: ["Be completely honest with {them}, even when it is awkward; trust is a Scorpio Moon's safe place.", "Give {them} your full attention in the moments that matter, and keep private things private.", "Tell {them} the whole truth the first time; a Scorpio Moon always finds out the rest."],
  sagittarius: ["Plan something to look forward to with {them}: a trip, an outing, something new.", "Give {them} space to roam, and trust the coming back; freedom feels like home to a Sagittarius Moon.", "Cheer {them} up with a plan or a joke rather than a long, heavy talk."],
  capricorn: ["Back {their} goals through what you do, not just what you say.", "Respect {their} way of handling things, and offer help without taking over.", "Show {them} you can be relied on: be on time, keep the promise, and don't make a fuss about it."],
  aquarius: ["Give {them} room to be a separate person, and take an interest in {their} ideas, even the odd ones.", "Be easy company for {them}, with no pressure to explain every feeling.", "Let {them} think a feeling through before you ask about it; pressure only makes an Aquarius Moon go quiet."],
  pisces: ["Be gentle with {them} on hard days: a hug, a quiet moment, a kind word.", "Make space for {their} dreams and moods without rushing to fix anything.", "Notice {their} mood without making {them} explain it, and offer a quiet bit of kindness."],
};

/** Start: how a Venus in each sign likes to be appreciated. Kept free of romance, so it suits family and work too. */
export const VENUS_VALUES: Record<SignId, string[]> = {
  aries: ["Show {them} some excitement: a spontaneous plan, a bold idea, a bit of friendly competition.", "Be direct with {them} about what you appreciate; a Venus in Aries values a clear, brave word.", "Plan something with {them} you've never done before; a Venus in Aries loves a first."],
  taurus: ["Treat {them} to simple pleasures: good food, a calm space, time that is not rushed.", "Show appreciation for {them} in ways that last: a thoughtful gift, a promise kept.", "Make time with {them} slow and unhurried, with good food and no checking the time."],
  gemini: ["Keep things interesting for {them} with new ideas, plans and good conversation.", "Appreciate {them} in words: a funny message, a clever compliment, a proper chat.", "Send {them} the thing that made you think of {them}; a Venus in Gemini loves being remembered in words."],
  cancer: ["Look after {them} in small, homely ways: a cuppa, a check-in, something made with care.", "Show {them} you are in it for the long haul; a Venus in Cancer values feeling safe and kept close.", "Cook for {them} or bring something home-made; a Venus in Cancer feels loved through looking after."],
  leo: ["Celebrate {them} properly: a compliment in front of others, a fuss on the big days.", "Be generous with warmth towards {them}; a Venus in Leo values open-hearted appreciation.", "Make a fuss of {them} on the day that matters, and let others see it."],
  virgo: ["Show care for {them} through helpful acts: a job done, a problem quietly solved.", "Remember the details of {their} likes and dislikes, and act on them.", "Fix the small thing that has been bugging {them} for weeks."],
  libra: ["Bring a little beauty and courtesy for {them}: a nice setting, good manners, a kind word.", "Treat {them} as an equal in every decision; fairness is how a Venus in Libra feels valued.", "Make the effort to look nice and pick a lovely place when you spend time with {them}."],
  scorpio: ["Give {them} depth and loyalty: real conversations and no half-measures.", "Let {them} see what you really think and feel; a Venus in Scorpio values trust over show.", "Keep {their} secrets as carefully as your own; loyalty is how a Venus in Scorpio measures love."],
  sagittarius: ["Share something new with {them}: a place, an idea, a good laugh.", "Keep things honest and light with {them}; a Venus in Sagittarius values freedom and fun.", "Book something together with {them} that ends in a story worth telling."],
  capricorn: ["Show {them} commitment through steady effort: turning up, following through, planning ahead.", "Respect {their} time and ambitions; a Venus in Capricorn values support for the long game.", "Help {them} with something that matters for the future, like a plan, a form or a big decision."],
  aquarius: ["Be a true friend to {them}: talk ideas, share causes and give space.", "Surprise {them} with something unusual and thoughtful; a Venus in Aquarius values the unexpected.", "Give {them} space to do their own thing, then take a real interest in it."],
  pisces: ["Bring some tenderness and imagination for {them}: music, a film, a heartfelt note.", "Show {them} kindness without being asked; a Venus in Pisces values gentle, wholehearted care.", "Make {them} a playlist, a card or a small gesture that says what you feel."],
};

/** Start: how a Mercury in each sign likes to be talked with. */
export const MERCURY_TALK: Record<SignId, string[]> = {
  aries: ["Get to the point with {them}; short, honest and direct beats a long lead-up.", "Let {them} speak first and fast, then answer the heart of it.", "Keep it quick and honest with {them}; long messages lose a Mercury in Aries by the second paragraph."],
  taurus: ["Give {them} time to think before expecting an answer; rushing only slows things down.", "Talk things over with {them} calmly and practically, one thing at a time.", "Say it once, calmly and clearly, then give {them} space to mull it over."],
  gemini: ["Keep conversations with {them} lively and two-way, with room to jump between topics.", "Swap ideas with {them} freely; curiosity is the best way in.", "Reply to {them} with interest and a question back; a Gemini Mercury loves a lively back and forth."],
  cancer: ["Ask {them} how something felt, not just what happened.", "Pick a cosy, private moment for serious talks with {them}.", "Choose a soft tone with {them}; a Cancer Mercury hears the feeling before the words."],
  leo: ["Talk with {them} warmly and generously, and give credit where it is due.", "Listen to {their} stories properly; being heard matters as much as being right.", "Start with what went right before you tell {them} what needs changing."],
  virgo: ["Be clear and specific with {them}; vague promises worry a Virgo Mercury.", "Give {them} the details, and welcome the useful questions that follow.", "Put the plan in writing for {them}, with the times and the details."],
  libra: ["Keep the tone with {them} fair and friendly, even in a disagreement.", "Ask {their} opinion and weigh it properly before deciding.", "Ask {them} what feels fair before you lay out your view."],
  scorpio: ["Say what you really mean to {them}; a Scorpio Mercury hears what is left unsaid.", "Go deep with {them} rather than wide: one honest talk beats ten small ones.", "Skip the small talk with {them} and get to what really matters."],
  sagittarius: ["Talk big ideas with {them}: plans, places, what life is for.", "Be straight with {them} and keep a sense of humour; lectures land badly.", "Keep it honest and light with {them}, and leave room for a laugh."],
  capricorn: ["Be practical with {them}: what is the plan, and who does what?", "Respect {their} time in conversation, and follow words with action.", "Bring {them} solutions, not just the problem."],
  aquarius: ["Talk ideas with {them}, including unusual ones, without needing to agree.", "Leave {them} room to see things differently; a good debate is a kind of closeness here.", "Ask for {their} view and really weigh it, even if it is unusual."],
  pisces: ["Talk gently with {them}, and leave space for feelings that have no words yet.", "Use pictures, stories and kindness with {them} rather than cold facts.", "Listen for what {them} means rather than the exact words."],
};

/** Don't: the trap of your own Mars sign when you push or argue. Written to follow a "Don't" tag, with no full stop, since the reason follows. */
export const MARS_TRAPS: Record<SignId, string[]> = {
  aries: ["Snap first and think second", "Turn every disagreement into a race to win it", "Send the angry text you'll regret in ten minutes"],
  taurus: ["Dig your heels in", "Go silent and immovable when pushed", "Refuse to budge on something that doesn't really matter to you"],
  gemini: ["Argue the point for the sake of it, or change the subject when it gets real", "Win with clever words when a simple sorry would do", "Turn a serious talk into a joke to get out of it"],
  cancer: ["Sulk or go sideways when hurt", "Bring up old hurts in a new argument", "Go quiet and expect the other person to guess what's wrong"],
  leo: ["Take disagreement as a personal insult", "Need the last word, or the biggest reaction", "Make a scene when a quiet word would do"],
  virgo: ["Pick at small faults when the real issue is bigger", "Correct instead of listening", "List every mistake when one would make the point"],
  libra: ["Keep the peace on the surface while resentment builds underneath", "Say \"I'm fine\" when you are not", "Agree just to end the argument, then stew about it later"],
  scorpio: ["Keep score, or test loyalty instead of asking for reassurance", "Hold a grudge long after the moment has passed", "Go cold and silent to make a point"],
  sagittarius: ["Fire off blunt words without thinking how they land", "Walk off for space without saying you will come back", "Laugh off something that clearly matters to the other person"],
  capricorn: ["Go cold and businesslike when feelings run high", "Treat every problem as a job to manage rather than a feeling to share", "Answer a feeling with a lecture or a to-do list"],
  aquarius: ["Detach and go distant when things get emotional", "Argue on principle when what is needed is warmth", "Treat a hurt feeling like a debate to be won"],
  pisces: ["Avoid the issue and hope it goes away", "Go quiet and hope it is noticed", "Say yes when you mean no, then quietly drift away"],
};

/** Why a Start fits: your own planet against the other person's, with an everyday moment.
 * {Your}/{your} name whose planets these are ("Your", or "Sam's" in the other person's box), {selfIs}
 * and {otherIs} are "you're" or "Sam is", {scene} is the other person's moment and {own} your own. */
export const START_FIT: Record<"easy" | "care" | "mixed", string[]> = {
  easy: [
    "This comes easily from {your} {mine} {planet}, which already understands {their} {theirs} side, the one {scene}.",
    "{Your} {mine} {planet} gets on with {their} {theirs} {planet}, so you already know what it means when {otherIs} {scene}: do more of it.",
    "With {your} {mine} {planet} and {their} {theirs} {planet} on good terms, this is an easy win, especially when {otherIs} {scene}.",
  ],
  care: [
    "{Your} {mine} {planet} would sooner be {own}, so this takes a conscious effort, and it shows.",
    "It may not come naturally: when it's {your} turn, {selfIs} {own}, while {their} {theirs} {planet} has {otherIs2} {scene}.",
    "{Your} {mine} {planet} wants something different from {their} {theirs} {planet}, so when {otherIs} {scene}, that is the moment to practise.",
  ],
  mixed: [
    "{Your} {mine} {planet} sits next door to {their} {theirs} {planet}, so check how it lands when {otherIs} {scene}.",
    "{Your} {mine} {planet} is close to {their} {theirs} {planet} but not the same: {selfIs} {own}, and {otherIs} {scene}, so ask rather than guess.",
    "{Your} {mine} {planet} and {their} {theirs} {planet} are neighbours, not twins, so when {otherIs} {scene}, ask whether this is what helps.",
  ],
};

/** Why a Stop matters: your Mars against the other person's Moon. {upset} is how the other person copes with a bad day, {marsImg} a picture of your Mars. */
export const STOP_FIT: Record<"easy" | "care" | "mixed", string[]> = {
  easy: [
    "{Their} {moon} Moon usually copes with {your} {mars} Mars, but when {otherIs} {upset}, this still chips away.",
    "{Your} {mars} Mars and {their} {moon} Moon mostly get on, so this habit is the one to watch, especially when {otherIs} {upset}.",
  ],
  care: [
    "{Your} {mars} Mars {link} {their} {moon} Moon, so this lands hardest when {otherIs} {upset}.",
    "With {your} {mars} Mars and {their} {moon} Moon at odds, this is the habit that hurts most, and it shows when {otherIs} {upset}.",
    "{Your} {mars} Mars can be {marsImg}, and {their} {moon} Moon feels that more than it lets on.",
  ],
  mixed: [
    "{Your} {mars} Mars sits next door to {their} {moon} Moon, so this can puzzle more than it hurts, especially when {otherIs} {upset}.",
    "{Their} {moon} Moon reads {your} {mars} Mars a little differently than it is meant, most of all when {otherIs} {upset}.",
  ],
};

/** Tips for the bond from your hardest planet pair. {a} is your sign, {b} the other's. */
export const TIP_CARE: Record<PairPlanet, Two> = {
  sun: ["With a {a} Sun and a {b} Sun, your styles rub. Take turns choosing how things get done.", "Your {a} Sun and {their} {b} Sun see life differently. When it grates, ask what {their} way gets right."],
  moon: ["Your {a} Moon and {their} {b} Moon need different things after a hard day. Ask: space, or company?", "Your {a} and {b} Moons comfort in different ways, so learn what helps {them} rather than giving what helps you."],
  mercury: ["Your {a} and {b} Mercury signs can talk past each other. Repeat back what you heard before you answer.", "With Mercury in {a} and {b}, the same words can mean different things. Check before you assume."],
  venus: ["Your {a} and {b} Venus signs show care differently. Once a week, show it {their} way.", "With Venus in {a} and {b}, a kind gesture can go unnoticed. Say what you meant by it."],
  mars: ["Your {a} and {b} Mars signs clash on pace. Agree who leads on what before it gets heated.", "With Mars in {a} and {b}, tempers can meet head on. Pick a cool-down signal you both respect."],
};

/** Tips for the bond from your easiest planet pair. */
export const TIP_EASY: Record<PairPlanet, Two> = {
  sun: ["Your {a} and {b} Suns get on naturally. Use that ease to take on something big together.", "With Suns in {a} and {b}, you like who the other is. Say so more often."],
  moon: ["Your {a} and {b} Moons soothe each other. Lean on that on hard days instead of going it alone.", "With Moons in {a} and {b}, comfort comes easily. Make a ritual of it: a walk, a cuppa, a check-in."],
  mercury: ["Your {a} and {b} Mercury signs click, so talk the big decisions through together.", "With Mercury in {a} and {b}, conversation flows. Keep a running list of ideas to try together."],
  venus: ["Your {a} and {b} Venus signs enjoy the same things. Plan more of them.", "With Venus in {a} and {b}, warmth is easy. Don't let it slip into being taken for granted."],
  mars: ["Your {a} and {b} Mars signs pull the same way. Pick a shared goal and chase it.", "With Mars in {a} and {b}, you get things done together. Take on a project side by side."],
};

/** A tip from where your animals sit on the wheel. {me} and {other} are the animals. */
export const TIP_ANIMAL: Record<Relation, Two> = {
  same: ["Two {me}s share the same blind spots, so ask a friend for an outside view when you are both stuck.", "As two {me}s, take turns leading so you are not both pulling the same way."],
  friend: ["Your {me} and {their} {other} are wheel friends, so do things side by side, not just face to face.", "Your {me} and {their} {other} share a friend group. Bring your wider circles together now and then."],
  secret: ["Your {me} and {their} {other} are secret friends, so protect the private jokes and small rituals that are only yours.", "As secret friends, your {me} and {their} {other} do best with quiet loyalty. Back each other in public."],
  clash: ["Your {me} and {their} {other} sit opposite on the wheel, so when you clash, say out loud that you are on the same side.", "Opposite animals like your {me} and {their} {other} teach each other most. Ask what {their} way would do here."],
  neutral: ["Your {me} and {their} {other} are neither friends nor rivals, so the bond is what you build. Make one small habit that is yours.", "With a {me} and {article} {other}, nothing is automatic. Small, regular effort counts for more than grand gestures."],
};

/** How the two animals' traits meet, by where they sit on the wheel. */
export const ANIMAL_MIX: Record<Relation, Two> = {
  same: ["double up, for better and for worse", "mirror each other, so you see yourself in {them}"],
  friend: ["sit naturally together", "come from the same corner of the wheel, so they back each other up"],
  secret: ["fit together quietly, like two halves", "make a loyal, low-key partnership"],
  clash: ["pull in different directions, which is where you both grow", "can rub, yet each covers what the other lacks"],
  neutral: ["sit side by side without much pull either way, so you make of it what you choose", "balance each other once you get to know each other"],
};

/** Two Life Path families meeting. Keyed by both family names in alphabetical order. */
export const FAMILY_MIX: Record<string, Two> = {
  "independent minds|independent minds": ["Two independent minds give each other room, as long as you still make time to meet in the middle.", "As two independent minds, you respect each other's freedom. Just don't let it turn into two separate lives."],
  "steady builders|steady builders": ["Two steady builders share a love of real progress, as long as work does not crowd out fun.", "As two steady builders, you can make something solid together. Schedule the play as well as the plans."],
  "creative hearts|creative hearts": ["Two creative hearts bring warmth and colour, as long as someone remembers the practical side.", "As two creative hearts, you light each other up. Take turns being the grounded one."],
  "independent minds|steady builders": ["Freedom meets structure: one of you wants room to roam and the other wants a solid plan.", "An independent mind and a steady builder: one brings fresh ideas, the other makes them last."],
  "creative hearts|independent minds": ["Ideas meet expression: one of you thinks it up, the other brings it to life.", "A creative heart and an independent mind: one feels it, the other questions it, and both learn."],
  "creative hearts|steady builders": ["Plans meet heart: one of you builds the base and the other fills it with warmth.", "A steady builder and a creative heart: structure and joy, each making the other better."],
};

/** Personal Year energies, for "This year together". */
export const YEAR_PACE: Record<number, "out" | "in"> = { 1: "out", 2: "in", 3: "out", 4: "in", 5: "out", 6: "in", 7: "in", 8: "out", 9: "in" };
export const YEAR_MIX: Record<"out" | "in" | "mixed", Two> = {
  out: ["Both years point outward, so this is a good year for plans, outings and new things together.", "With two outgoing years, say yes to things together, and leave a little room to rest."],
  in: ["Both years turn inward, so a quieter, closer year suits you, with more nights in than nights out.", "With two inward years, this is a time to settle, reflect and look after each other."],
  mixed: ["One of you is in a more outgoing year and the other in a quieter one, so agree on a rhythm: some time out together, some time to recharge.", "With one outgoing year and one quieter year between you, don't take a difference in energy personally."],
};
export const YEAR_STEP: Two = [
  "You are one year apart in the nine-year cycle, so one of you is always a step ahead. Share what you have just been through.",
  "One year apart in the cycle, you can each see where the other is heading, or where you have just been.",
];
export const YEAR_TURN: Two = [
  "One of you is finishing a cycle while the other begins one, so let go of old plans together and start fresh.",
  "An ending meets a beginning this year: one of you clears space while the other plants seeds.",
];
