// Wording for "Meet yourself", the spotlight at the top of a solo reading. It weaves the
// Sun, Moon and personal planets, the Life Path and the Chinese animal into one portrait.
// Most pieces have two or more wordings, and src/lib/spotlight.ts picks one from the birth
// date, so two people with the same signs still read differently.
//
// House style (the user's rules): plain, warm, complete sentences. No metaphors, sayings or
// jokes; every line describes something that comes from a placement or a number, and the
// tests in tests/style.test.ts check for the phrases the user does not want.
//
// Clause shapes, so the pieces join into sentences:
//   core    follows "you are a Libra: "            → "fair, charming and ..."
//   need    follows "your Cancer Moon "            → "needs a safe, loving home ..." (no "you", so it also reads for someone else)
//   mind, love, drive follow "you " or "Sam tends to " → "weigh every side before speaking" (no "you" in them)
//   gift, edge, trap are "-ing" phrases            → "making people feel heard"
//   SUN_MOON_MIX clauses start with "so"
//   the *_WAY lists follow "you "                  → "learn best by trying something and adjusting as you go"

import type { Element as WesternElement, Modality, SignId } from "./astrology.ts";
import type { Element as ChineseElement } from "./zodiac.ts";

type Two = [string, string];

export interface SignSpot {
  /** Title words: "the Graceful Creator". */
  title: Two;
  core: Two;
  need: Two;
  /** For the closing line: "a gentle Libra Moon". */
  heart: Two;
  /** Mercury in this sign. */
  mind: Two;
  /** Venus in this sign. */
  love: Two;
  /** Mars in this sign. */
  drive: Two;
  /** The Sun's gift. */
  gift: Two;
  /** The Moon's growing edge. */
  edge: Two;
  /** Mars's trap, for the Full Deep Dive. */
  trap: string;
  /** What runs through you when three or more planets share the sign. */
  native: string;
}

export const SIGN_SPOT: Record<SignId, SignSpot> = {
  aries: {
    title: ["Bold", "Fearless"],
    core: ["direct, energetic and at your best when you are starting something", "brave, honest and keen to get things moving"],
    need: ["needs to act on a feeling quickly rather than sit with it", "needs room to react fast and then move on"],
    heart: ["fiery", "impatient"],
    mind: ["think quickly and say things plainly", "decide fast and speak with direct honesty"],
    love: ["fall quickly and show interest openly, with no mixed messages", "look for a partner with plenty of energy and a direct manner"],
    drive: ["start straight away and work out the details along the way", "go first and enjoy the challenge as much as the result"],
    gift: ["giving other people the confidence to begin", "turning plans into action quickly"],
    edge: ["letting a hurt settle before you respond", "slowing down long enough to see what sits under the anger"],
    trap: "rushing ahead before others have caught up",
    native: "action",
  },
  taurus: {
    title: ["Steadfast", "Grounded"],
    core: ["calm, loyal and committed for the long term", "steady, patient and determined to make things last"],
    need: ["needs comfort, routine and people who stay", "needs stability, good food and a calm home to feel settled"],
    heart: ["steady", "loyal"],
    mind: ["think things through slowly and rarely change course once decided", "take time with new ideas and trust what can be proven"],
    love: ["show love through touch, loyalty and small, reliable gestures", "prefer love that builds slowly and can be counted on"],
    drive: ["keep going long after others have stopped", "work at a steady pace and refuse to give up"],
    gift: ["making people feel safe and looked after", "building things that last for years"],
    edge: ["accepting change before it is forced on you", "loosening your grip on what feels safe so something better can arrive"],
    trap: "refusing to move when a small compromise would do",
    native: "loyalty and comfort",
  },
  gemini: {
    title: ["Curious", "Inquisitive"],
    core: ["curious, talkative and interested in almost everything", "quick, witty and happiest with plenty of ideas to work with"],
    need: ["needs to talk feelings through before they make sense", "needs variety, conversation and friends who stay in touch"],
    heart: ["restless", "lively"],
    mind: ["think in quick leaps and talk easily with almost anyone", "learn quickly, ask plenty of questions and enjoy a good debate"],
    love: ["fall for a good mind first and value a partner with a sense of humour", "keep love playful and value conversation as much as romance"],
    drive: ["juggle several plans at once and keep them all moving", "pursue goals with wit and persuasion rather than force"],
    gift: ["connecting people and ideas that would not otherwise meet", "making conversations livelier and more interesting"],
    edge: ["staying with a feeling instead of explaining it away", "letting people see the serious side under the jokes"],
    trap: "spreading energy over too many things at once",
    native: "conversation",
  },
  cancer: {
    title: ["Tender", "Devoted"],
    core: ["caring, protective and closely tied to the people you love", "warm, intuitive and happiest looking after your own"],
    need: ["needs a safe, loving home to come back to", "needs to feel wanted and to keep loved ones close"],
    heart: ["tender", "protective"],
    mind: ["remember details, especially how things felt at the time", "think with feeling and read a room within seconds"],
    love: ["show love by caring, cooking and protecting, and remember every kindness", "look for love that feels like home and give the same in return"],
    drive: ["approach problems indirectly but hold on to what matters", "fight hardest for the people closest to home"],
    gift: ["making people feel remembered and cared for", "making any place feel like home"],
    edge: ["saying what hurt you instead of withdrawing", "letting old hurts go so they stop shaping new days"],
    trap: "holding on to a hurt long after it has been dealt with",
    native: "care",
  },
  leo: {
    title: ["Radiant", "Generous"],
    core: ["warm, generous and confident", "big-hearted, proud and naturally creative"],
    need: ["needs to feel appreciated and to hear it said out loud", "needs warmth, loyalty and some recognition"],
    heart: ["generous", "proud"],
    mind: ["speak with confidence and tell a story well", "think in big terms and express it with warmth"],
    love: ["love loyally and openly, and want the same warmth in return", "give generously and enjoy a romantic gesture"],
    drive: ["pursue goals with pride and real commitment", "lead from the front and take pride in the result"],
    gift: ["making the people around you feel valued", "bringing warmth and fun to a group"],
    edge: ["knowing your worth when nobody is praising you", "letting someone else have the attention without feeling smaller"],
    trap: "taking it personally when effort goes unnoticed",
    native: "warmth",
  },
  virgo: {
    title: ["Thoughtful", "Discerning"],
    core: ["helpful, thoughtful and committed to making things better", "observant, modest and happiest when you are useful"],
    need: ["needs order and a useful job to feel calm", "needs to help, and to feel that things are under control"],
    heart: ["careful", "conscientious"],
    mind: ["notice details and think in clear, practical steps", "analyse carefully and say exactly what is meant"],
    love: ["show love through small, practical acts of care", "love quietly, through attention, effort and remembering small things"],
    drive: ["work steadily until the job is done properly", "put energy into getting the details right"],
    gift: ["noticing what others miss and fixing it early", "making daily life run more smoothly for others"],
    edge: ["being as kind to yourself as you are to others", "accepting good enough when perfection is costing you peace"],
    trap: "criticising yourself more harshly than anyone else would",
    native: "being useful",
  },
  libra: {
    title: ["Graceful", "Gracious"],
    core: ["fair, charming and happiest when life feels balanced", "gracious, sociable and good at keeping the peace"],
    need: ["needs harmony, beauty and close company", "needs calm surroundings and finds conflict hard to sit with"],
    heart: ["gentle", "even-tempered"],
    mind: ["weigh every side before speaking, and speak with tact", "look for the fair answer that others miss"],
    love: ["love with courtesy and want a partnership of equals", "value romance, beauty and a sense of being a pair"],
    drive: ["pursue goals through charm and cooperation rather than force", "work best alongside others and fight hardest for fairness"],
    gift: ["making people feel heard", "calming a tense room"],
    edge: ["saying what you want, not just what keeps the peace", "making your own choice instead of waiting for others to choose"],
    trap: "agreeing to keep the peace and resenting it later",
    native: "harmony",
  },
  scorpio: {
    title: ["Magnetic", "Intense"],
    core: ["intense, private and fiercely loyal", "deep, determined and willing to face the truth"],
    need: ["needs complete trust before letting anyone close", "needs depth and honesty, and has little patience for small talk about feelings"],
    heart: ["deep", "fiercely loyal"],
    mind: ["look beneath the surface and notice what is left unsaid", "investigate carefully and keep plans private"],
    love: ["love intensely and fully, or not at all", "want a deep, loyal bond with no secrets on either side"],
    drive: ["pursue goals with quiet, steady focus", "commit fully once decided and think long term"],
    gift: ["seeing the truth and staying when things get hard", "helping people face what they have been avoiding"],
    edge: ["letting go of a grudge so it stops costing you", "trusting people a little before you have proof"],
    trap: "keeping score long after it matters",
    native: "depth",
  },
  sagittarius: {
    title: ["Free-spirited", "Adventurous"],
    core: ["adventurous, honest and always looking ahead", "optimistic, funny and interested in the wider world"],
    need: ["needs freedom, space and something to look forward to", "needs a plan for something good ahead and room to move"],
    heart: ["hopeful", "optimistic"],
    mind: ["think in big ideas and speak frankly", "enjoy learning, teaching and debating what life means"],
    love: ["love freely and generously, and value a partner who enjoys adventure", "want love with plenty of laughter and room to grow"],
    drive: ["aim high and pursue goals with real enthusiasm", "take risks and stay optimistic about the outcome"],
    gift: ["lifting people's spirits and widening their outlook", "finding the hopeful way through a difficult situation"],
    edge: ["staying put when feelings get heavy instead of looking for the exit", "following through after the exciting first step"],
    trap: "promising more than there is time to deliver",
    native: "adventure",
  },
  capricorn: {
    title: ["Determined", "Resolute"],
    core: ["ambitious, patient and steadily climbing", "disciplined, dry-witted and quietly strong"],
    need: ["needs to feel useful and in control before relaxing", "needs structure and respect, and shares feelings only once trust is earned"],
    heart: ["quietly strong", "reserved"],
    mind: ["think in plans, strategies and long-term goals", "speak carefully and mean every word"],
    love: ["take love seriously and show it by building a future together", "take time to commit, then stay loyal"],
    drive: ["climb steadily, one sensible step at a time", "work harder and longer than most people"],
    gift: ["turning big goals into lasting results", "being someone others can rely on"],
    edge: ["letting yourself rest without having to earn it", "showing your softer side before you feel completely safe"],
    trap: "working through the rest that is actually needed",
    native: "ambition",
  },
  aquarius: {
    title: ["Original", "Visionary"],
    core: ["original, independent and often ahead of your time", "inventive, friendly and true to your own way of doing things"],
    need: ["needs independence and friendships without conditions", "needs freedom and fresh ideas, and thinks feelings through before sharing them"],
    heart: ["free-thinking", "independent"],
    mind: ["come up with ideas nobody else has had yet", "see patterns and possibilities and enjoy a good debate"],
    love: ["want a best friend as much as a partner, with plenty of space", "love in an unconventional way, loyal but never clingy"],
    drive: ["pursue goals independently, often against the crowd", "fight hardest for causes larger than any one person"],
    gift: ["seeing a better way that nobody else has considered", "making outsiders feel they belong"],
    edge: ["letting people close enough to see your feelings", "staying in the room when emotions get messy"],
    trap: "going cool and distant when actually hurt",
    native: "originality",
  },
  pisces: {
    title: ["Imaginative", "Intuitive"],
    core: ["imaginative, compassionate and sensitive", "gentle, intuitive and closely attuned to other people"],
    need: ["needs quiet, beauty and time to unwind", "needs to feel connected to others, and absorbs the mood of a room"],
    heart: ["compassionate", "sensitive"],
    mind: ["think in images, feelings and hunches that often prove right", "pick up on what is unsaid and express it well"],
    love: ["love wholeheartedly and believe in real romance", "give generously in love and look for a deep, lasting bond"],
    drive: ["follow intuition rather than a fixed plan", "put energy into helping, creating and imagining"],
    gift: ["understanding people without them having to explain", "bringing imagination and kindness to everything"],
    edge: ["keeping firm boundaries so you do not lose yourself in others", "facing hard things directly rather than drifting away from them"],
    trap: "drifting away from a problem instead of facing it",
    native: "imagination",
  },
};

/** How the Sun's element (who you are) meets the Moon's (what you feel). Keyed "Sun|Moon". */
export const SUN_MOON_MIX: Record<`${WesternElement}|${WesternElement}`, Two> = {
  "Fire|Fire": ["so your feelings are as direct and energetic as the rest of you", "so what you feel and how you act rarely pull apart"],
  "Fire|Earth": ["so behind the confident front is someone who needs things to feel secure", "so your energy is steadier than people expect"],
  "Fire|Air": ["so your feelings come out in talk and plans as much as in action", "so ideas and feelings feed each other and keep you busy"],
  "Fire|Water": ["so the confident side people see covers feelings that run deeper than you show", "so you can look fearless while feeling far more than you let on"],
  "Earth|Fire": ["so beneath the calm manner is a quick, passionate emotional side", "so your steady habits sit alongside feelings that flare quickly"],
  "Earth|Earth": ["so you are practical in what you do and in how you feel", "so the steadiness people see is the same steadiness you feel inside"],
  "Earth|Air": ["so your practical side lives alongside a busy, curious mind", "so you look calm while your thoughts move quickly"],
  "Earth|Water": ["so your practical manner protects feelings that run deep", "so you look after people with practical help and real tenderness"],
  "Air|Fire": ["so your easy social manner is backed by strong, restless feelings", "so your ideas come with real conviction behind them"],
  "Air|Earth": ["so behind your easy charm is someone who wants stability", "so you think freely but feel safest on solid ground"],
  "Air|Air": ["so you handle both ideas and feelings by thinking and talking them through", "so your feelings make most sense once you have put them into words"],
  "Air|Water": ["so your sociable manner covers feelings that run deeper than people guess", "so your clear thinking sits alongside strong feelings"],
  "Water|Fire": ["so your gentle manner hides a fierce emotional side", "so your sensitivity comes with real fight when it is needed"],
  "Water|Earth": ["so your strong feelings rest on a practical, steady base", "so you feel things strongly but handle life with common sense"],
  "Water|Air": ["so you feel strongly and also want to understand why", "so your sensitivity comes with a cool, analytical streak"],
  "Water|Water": ["so you feel things strongly and read people with ease", "so your emotional life is rich and your intuition reliable"],
};

/** When the Sun and Moon share a sign. {Sun} is the sign and {kw} its keywords. */
export const SAME_SIGN: string[] = [
  "Your Moon is in {Sun} as well, so what you show and what you feel rarely differ: {kw} in both.",
  "With the Moon also in {Sun}, the private you and the public you work the same way, {kw} in each.",
  "Sun and Moon, your character and your feelings, both sit in {Sun}, so people who know you well see the same {kw} person as everyone else.",
  "Because your Moon shares the {Sun} sign with your Sun, your feelings follow the same {kw} pattern as your character.",
];

/**
 * The Sun's modality (how a sign works with change) against the Moon's. Keyed "Sun|Moon".
 * {S} and {M} are the two signs. Every wording explains the term in passing.
 */
export const SUN_MOON_MODE: Record<`${Modality}|${Modality}`, string[]> = {
  "Cardinal|Cardinal": [
    "Both {S} and {M} are cardinal signs, the signs that start things, so you prefer to set the direction yourself.",
    "{S} and {M} are both cardinal, a term astrologers use for signs that initiate, so you would rather act early than wait.",
    "With the Sun in {S} and the Moon in {M}, two cardinal signs that begin things, you find starting easier than maintaining.",
    "Since your Sun in {S} and Moon in {M} are both cardinal (starting) signs, you tend to take charge when a decision is needed.",
    "Your {S} Sun and {M} Moon both belong to the cardinal group of signs, which act first, so waiting for others rarely suits you.",
  ],
  "Fixed|Fixed": [
    "Both {S} and {M} are fixed signs, the signs that keep things going, so you are loyal, consistent and slow to change your mind.",
    "{S} and {M} are both fixed, a term astrologers use for signs that sustain, so once you commit, you stay committed.",
    "With the Sun in {S} and the Moon in {M}, two fixed signs that hold steady, you finish what you start but resist sudden change.",
    "Since your Sun in {S} and Moon in {M} are both fixed (steady) signs, people can count on you, though you can be hard to move.",
    "Your {S} Sun and {M} Moon both belong to the fixed group of signs, which persist, so your habits and loyalties last.",
  ],
  "Mutable|Mutable": [
    "Both {S} and {M} are mutable signs, the signs that adapt, so you handle change well but can find it hard to settle.",
    "{S} and {M} are both mutable, a term astrologers use for flexible signs, so you adjust easily when plans shift.",
    "With the Sun in {S} and the Moon in {M}, two mutable signs that adapt, you are open to change, though sometimes undecided.",
    "Since your Sun in {S} and Moon in {M} are both mutable (adaptable) signs, you see several options where others see one.",
    "Your {S} Sun and {M} Moon both belong to the mutable group of signs, which adjust, so you cope well when circumstances change.",
  ],
  "Cardinal|Fixed": [
    "{S} is a cardinal sign, one that starts things, and {M} a fixed sign, one that keeps things going, so you begin readily and then stick with it.",
    "Your Sun in {S} likes to initiate, as cardinal signs do, while your Moon in {M} is fixed and wants stability, so you start what you mean to keep.",
    "Pairing a cardinal {S} Sun (a starter) with a fixed {M} Moon (a keeper), you act decisively but need emotional security underneath.",
    "With a cardinal (starting) Sun in {S} and a fixed (steady) Moon in {M}, you are quick to take the lead and slow to let go of what you value.",
    "Astrology calls {S} cardinal, a sign that initiates, and {M} fixed, a sign that sustains, so you lead outwardly and hold on inwardly.",
  ],
  "Cardinal|Mutable": [
    "{S} is a cardinal sign, one that starts things, and {M} a mutable sign, one that adapts, so you take the lead but let your feelings adjust to the situation.",
    "Your Sun in {S} likes to initiate, as cardinal signs do, while your Moon in {M} is mutable and flexible, so you set the course and adapt along the way.",
    "Pairing a cardinal {S} Sun (a starter) with a mutable {M} Moon (an adapter), you begin with purpose and stay open to change.",
    "With a cardinal (starting) Sun in {S} and a mutable (adaptable) Moon in {M}, you act decisively in public and feel your way more flexibly in private.",
    "Astrology calls {S} cardinal, a sign that initiates, and {M} mutable, a sign that adapts, so you set plans firmly but take setbacks in your stride.",
  ],
  "Fixed|Cardinal": [
    "{S} is a fixed sign, one that keeps things going, and {M} a cardinal sign, one that starts things, so you are steady outwardly but react quickly inside.",
    "Your Sun in {S} is fixed and values consistency, while your Moon in {M} is cardinal and wants to act, so your feelings often move faster than your plans.",
    "Pairing a fixed {S} Sun (a keeper) with a cardinal {M} Moon (a starter), you look steady while feeling a strong urge to act.",
    "With a fixed (steady) Sun in {S} and a cardinal (starting) Moon in {M}, you hold your course in public and push for change in private.",
    "Astrology calls {S} fixed, a sign that sustains, and {M} cardinal, a sign that initiates, so your feelings push for change your outward self is slow to make.",
  ],
  "Fixed|Mutable": [
    "{S} is a fixed sign, one that keeps things going, and {M} a mutable sign, one that adapts, so you are firm in your aims but flexible in your feelings.",
    "Your Sun in {S} is fixed and values consistency, while your Moon in {M} is mutable and adjusts easily, so you stay on course without becoming rigid.",
    "Pairing a fixed {S} Sun (a keeper) with a mutable {M} Moon (an adapter), you hold steady on what matters and adapt on the rest.",
    "With a fixed (steady) Sun in {S} and a mutable (adaptable) Moon in {M}, you are dependable outwardly and more changeable emotionally than people realise.",
    "Astrology calls {S} fixed, a sign that sustains, and {M} mutable, a sign that adapts, so you keep your commitments while your moods shift easily.",
  ],
  "Mutable|Cardinal": [
    "{S} is a mutable sign, one that adapts, and {M} a cardinal sign, one that starts things, so you seem easygoing but feel a strong need to act.",
    "Your Sun in {S} is mutable and flexible, while your Moon in {M} is cardinal and wants to initiate, so you adapt in public and push forward in private.",
    "Pairing a mutable {S} Sun (an adapter) with a cardinal {M} Moon (a starter), you stay open to options until your feelings decide for you.",
    "With a mutable (adaptable) Sun in {S} and a cardinal (starting) Moon in {M}, you adjust easily to others but act quickly when something matters to you.",
    "Astrology calls {S} mutable, a sign that adapts, and {M} cardinal, a sign that initiates, so you go along with others until something stirs you to lead.",
  ],
  "Mutable|Fixed": [
    "{S} is a mutable sign, one that adapts, and {M} a fixed sign, one that keeps things going, so you are flexible on the surface and steady underneath.",
    "Your Sun in {S} is mutable and adjusts easily, while your Moon in {M} is fixed and values security, so you change plans readily but not loyalties.",
    "Pairing a mutable {S} Sun (an adapter) with a fixed {M} Moon (a keeper), you are open-minded but emotionally consistent.",
    "With a mutable (adaptable) Sun in {S} and a fixed (steady) Moon in {M}, you adapt to circumstances while your feelings stay constant.",
    "Astrology calls {S} mutable, a sign that adapts, and {M} fixed, a sign that sustains, so you are easy to work with but slow to let go emotionally.",
  ],
};

/** How a Moon in each sign recovers from a hard day. Follows "you" or "your Leo Moon tends to". */
export const MOON_COPE: Record<SignId, string[]> = {
  aries: ["deal with the problem straight away rather than wait", "do something physical to burn off the tension", "say what is wrong and then move on quickly"],
  taurus: ["return to familiar routines and comforts", "take time somewhere quiet and calm", "want practical reassurance rather than long talks"],
  gemini: ["talk the problem through with someone you trust", "write things down until they make sense", "turn your attention to something new for a while"],
  cancer: ["spend time at home with people you trust", "want to be looked after for a while", "need to hear that the people you love are still close"],
  leo: ["want warmth and encouragement from people close to you", "need to feel respected again before you can move on", "do something creative to lift your mood"],
  virgo: ["make a plan and tackle the problem in steps", "tidy, organise or fix something to feel in control", "need to know exactly what went wrong"],
  libra: ["want to restore calm with the people involved", "spend time somewhere pleasant and peaceful", "talk it over with someone fair-minded"],
  scorpio: ["need privacy before you can talk about it", "want the full truth of what happened", "work through the feeling thoroughly rather than set it aside"],
  sagittarius: ["make a plan for something enjoyable", "go outdoors or change your surroundings", "look for the lesson and move on"],
  capricorn: ["keep busy with work or a practical task", "handle it alone first and talk later", "want a clear plan for fixing things"],
  aquarius: ["step back and think about it from a distance", "need time alone before you discuss it", "talk it through with a friend rather than dwell on it"],
  pisces: ["need quiet time to let feelings settle", "turn to music, art or rest", "want gentle company without pressure to explain"],
};

/** How Mercury in each sign shows day to day. Follows "you". */
export const MIND_WAY: Record<SignId, string[]> = {
  aries: ["learn best by trying something and adjusting as you go", "prefer short, direct conversations to long discussions", "decide quickly and correct course later if needed"],
  taurus: ["learn best through repetition and hands-on practice", "prefer to hear an idea twice before you accept it", "make decisions slowly and then stick to them"],
  gemini: ["learn best by reading widely and asking questions", "handle several conversations or tasks at once", "change your mind readily when you hear a better argument"],
  cancer: ["remember conversations by how they made you feel", "talk most openly with people you already trust", "make decisions partly on instinct and partly on memory"],
  leo: ["learn best when you can explain the idea to someone else", "present your views with confidence and some flair", "prefer decisions you can stand behind publicly"],
  virgo: ["learn best by breaking a problem into clear steps", "spot errors and gaps that others overlook", "check the facts before you commit to a view"],
  libra: ["learn best by discussing ideas with other people", "look for common ground before you take a side", "take time over decisions because you see several sides"],
  scorpio: ["learn best by researching a subject in depth", "notice motives and tone as much as the words", "keep your conclusions to yourself until you are sure"],
  sagittarius: ["learn best by grasping the overall idea before the details", "speak frankly, even when tact would serve you better", "enjoy debates about beliefs, ethics and meaning"],
  capricorn: ["learn best when you can see how knowledge will be used", "prefer clear plans, deadlines and responsibilities", "think a decision through before you announce it"],
  aquarius: ["learn best by questioning how things usually work", "enjoy ideas for their own sake, including unusual ones", "hold your opinions firmly once you have reasoned them out"],
  pisces: ["learn best through stories and examples", "pick up on mood and tone before you notice the facts", "reach conclusions by instinct and explain them afterwards"],
};

/** How Venus in each sign shows in close relationships. Follows "you". */
export const VENUS_WAY: Record<SignId, string[]> = {
  aries: ["show affection openly and often make the first move", "enjoy some friendly competition in close relationships", "lose interest when a relationship becomes too predictable"],
  taurus: ["show affection through physical comfort and time spent together", "value reliability over grand gestures", "take time to trust someone new"],
  gemini: ["show affection through conversation, humour and messages", "need mental stimulation to stay interested", "enjoy a varied social life alongside a close relationship"],
  cancer: ["show affection by looking after people's practical needs", "remember anniversaries, preferences and small kindnesses", "need reassurance before you fully open up"],
  leo: ["show affection generously and enjoy marking birthdays and anniversaries", "need to feel admired by the people closest to you", "stay loyal once you have chosen someone"],
  virgo: ["show affection through practical help and attention to detail", "notice what the people you love need before they ask", "can be slow to put feelings into words"],
  libra: ["show affection through courtesy, compliments and shared plans", "work hard to avoid conflict in close relationships", "value fairness and equal effort in any partnership"],
  scorpio: ["show affection through loyalty and undivided attention", "take a long time to trust, and remember any betrayal", "prefer a few close relationships to many casual ones"],
  sagittarius: ["show affection through shared adventures and honesty", "need personal freedom within any relationship", "prefer partners who share your interests and outlook"],
  capricorn: ["show affection by planning a shared future", "express feelings through actions more than words", "take commitment seriously once you make it"],
  aquarius: ["show affection through friendship and shared interests", "need independence within close relationships", "value honesty over romantic convention"],
  pisces: ["show affection through kindness, creativity and small gestures", "sense what a partner feels without being told", "can idealise a new partner early on"],
};

/** How Mars in each sign shows when there is work to do. Follows "you". */
export const MARS_WAY: Record<SignId, string[]> = {
  aries: ["start tasks immediately and finish them quickly", "work best with a clear challenge or rival", "lose patience with long delays and slow decisions"],
  taurus: ["work steadily and dislike being rushed", "finish what you start, even when it takes a long time", "resist pressure to change your methods"],
  gemini: ["switch between several tasks easily", "use persuasion and information rather than force", "lose focus when a task becomes repetitive"],
  cancer: ["work hardest when you are protecting someone", "approach conflict indirectly rather than head-on", "hold on to a goal long after others would give up"],
  leo: ["work best when you are leading or visible", "put real effort into anything with your name on it", "need recognition to stay motivated over time"],
  virgo: ["plan carefully and work through tasks in order", "notice what needs fixing and fix it without being asked", "find it hard to stop before everything is finished"],
  libra: ["work best in partnership or as part of a team", "prefer negotiation to confrontation", "can delay action while you weigh up the options"],
  scorpio: ["work with intense focus once committed", "keep your plans private until they are ready", "rarely give up on something that matters to you"],
  sagittarius: ["work with enthusiasm when a goal inspires you", "prefer freedom to choose how a task gets done", "start ambitious projects and need help with the details"],
  capricorn: ["set long-term goals and work towards them methodically", "take responsibility readily and dislike leaving things unfinished", "keep working when others have stopped"],
  aquarius: ["work best when you can do things your own way", "put energy into causes and group projects", "resist rules that seem pointless to you"],
  pisces: ["work best when a task means something to you", "adapt your approach as a situation changes", "need rest after periods of intense effort"],
};

export interface LifePathSpot {
  flavour: Two;
  call: Two;
  strength: string;
  edge: Two;
}

export const LIFE_PATH_SPOT: Record<number, LifePathSpot> = {
  1: {
    flavour: ["an independent, pioneering streak", "a strong, self-starting attitude"],
    call: ["you are here to lead and trust your own ideas", "life keeps asking you to go first, and you grow each time you do"],
    strength: "the courage to start what others only discuss",
    edge: ["letting others help before you are completely stuck", "asking for other views before you decide"],
  },
  2: {
    flavour: ["a gentle, cooperative streak", "an intuitive, diplomatic nature"],
    call: ["you are here to bring people together and notice what goes unsaid", "groups often work because of your patience and tact"],
    strength: "an instinct for what other people need",
    edge: ["putting your own needs on the list too", "speaking up early about small problems"],
  },
  3: {
    flavour: ["a creative, expressive streak", "a sociable, imaginative nature"],
    call: ["you are here to express ideas and share them", "words, creativity and humour are your main tools"],
    strength: "a talent for words, creativity and lifting the mood",
    edge: ["focusing your talents so they can develop fully", "finishing one thing before starting the next"],
  },
  4: {
    flavour: ["a steady, practical approach", "a loyal, hard-working streak"],
    call: ["you are here to build things that last", "patience and honest effort are your main strengths"],
    strength: "turning plans into something solid and real",
    edge: ["staying open to change while keeping your footing", "letting things be a little messy sometimes"],
  },
  5: {
    flavour: ["a free, adventurous streak", "a restless love of change"],
    call: ["you learn by doing and value experience over possessions", "variety, travel and new ideas keep you engaged"],
    strength: "adapting to whatever life brings",
    edge: ["finding a kind of freedom that still has roots", "sticking with something after it stops being new"],
  },
  6: {
    flavour: ["a caring, responsible nature", "a strong sense of duty to the people you love"],
    call: ["you are here to look after people and make daily life better", "home, family and the people in your care sit at the centre of your life"],
    strength: "making people feel loved and looked after",
    edge: ["caring for yourself as generously as you care for others", "letting people solve their own problems"],
  },
  7: {
    flavour: ["a reflective, searching mind", "a thoughtful, inward-looking streak"],
    call: ["you are here to ask big questions and find your own answers", "you need quiet to think, and what you work out is worth sharing"],
    strength: "insight and sound judgement",
    edge: ["sharing what you discover instead of keeping it to yourself", "trusting people as much as you trust your own mind"],
  },
  8: {
    flavour: ["an ambitious, capable drive", "a strong instinct for success"],
    call: ["you are here to turn plans into results", "success tends to follow when you back yourself"],
    strength: "turning big ideas into real results",
    edge: ["balancing success with rest, generosity and warmth", "measuring your worth by more than what you achieve"],
  },
  9: {
    flavour: ["a compassionate, broad-minded outlook", "a generous, public-minded streak"],
    call: ["you are here to make things fairer and kinder", "you think about the wider world and want everyone to be all right"],
    strength: "compassion that reaches beyond your own circle",
    edge: ["letting go when something has run its course", "giving without giving yourself away"],
  },
  11: {
    flavour: ["a sharp, reliable intuition", "an idealistic, sensitive streak"],
    call: ["you can inspire people by example", "you notice what others miss and want your life to mean something"],
    strength: "intuition you can rely on",
    edge: ["trusting your sensitivity rather than fearing it", "grounding big ideals in everyday life"],
  },
  22: {
    flavour: ["a practical vision on a large scale", "a rare mix of big plans and practical skill"],
    call: ["you can turn large plans into lasting results", "you are here to build something that helps many people"],
    strength: "making large plans practical",
    edge: ["believing the plan is possible", "pacing yourself so the size of the goal does not wear you down"],
  },
  33: {
    flavour: ["a deep, steady compassion", "a caring, teaching nature"],
    call: ["you are here to guide, teach and support", "compassion shapes your path, and people feel better around you"],
    strength: "a calm, supportive presence",
    edge: ["helping others without carrying every burden alone", "letting others look after you too"],
  },
};

/** How each Life Path shows day to day. Follows "you". */
export const LIFE_PATH_WAY: Record<number, string[]> = {
  1: ["prefer to make your own decisions and set your own pace", "start new projects readily and dislike waiting for permission", "work well alone and can find teamwork frustrating"],
  2: ["notice tension in a group early and work to ease it", "would rather support a plan than lead it", "need time to make decisions and dislike being rushed"],
  3: ["express yourself through words, art or humour", "make friends easily and keep a busy social life", "start many projects and sometimes struggle to finish them"],
  4: ["like clear routines, plans and dependable people", "would rather do a job properly than quickly", "find sudden changes of plan stressful"],
  5: ["get restless when life becomes routine", "adapt quickly to new places and people", "learn more from experience than from instruction"],
  6: ["take responsibility for the people around you", "make your home a priority", "find it hard to say no when someone needs help"],
  7: ["need time alone to think things through", "question what you are told until you understand it yourself", "trust a few people deeply rather than many people lightly"],
  8: ["set ambitious goals and work steadily towards them", "manage money, people and projects well", "tend to measure yourself by results"],
  9: ["care about fairness beyond your own circle", "give time and energy to causes and other people", "accept endings more readily than most people"],
  11: ["pick up on other people's moods quickly", "hold high ideals for yourself and others", "can feel nervous energy when you are under pressure"],
  22: ["think in large, long-term plans", "combine big goals with practical organisation", "can feel weighed down by your own expectations"],
  33: ["support and teach others naturally", "put other people's needs before your own", "need to guard against taking on too much"],
};

/** The Sun's element with the Life Path's number family, as a clause after "Your Libra Sun and Life Path 3". */
export const SUN_FAMILY: Record<string, string> = {
  "Fire|independent minds": "both favour going your own way, so you trust your judgement and rarely wait for permission",
  "Fire|steady builders": "combine energy with structure, so your enthusiasm actually gets things built",
  "Fire|creative hearts": "make you expressive and confident, with strong feelings and the nerve to share them",
  "Earth|independent minds": "keep your independent thinking grounded, so it turns into practical results",
  "Earth|steady builders": "both value patience and practicality, so you build things to last",
  "Earth|creative hearts": "give your ideas practical form, so they become things people can use",
  "Air|independent minds": "make you a free thinker who questions how things are usually done",
  "Air|steady builders": "bring both ideas and follow-through, a useful and uncommon mix",
  "Air|creative hearts": "make words your strongest tool, so you think, talk and create easily",
  "Water|independent minds": "pull between closeness and independence, so you need both close company and time alone",
  "Water|steady builders": "combine feeling with steadiness, so the care you give lasts",
  "Water|creative hearts": "make you deeply expressive, with feelings going straight into creative work and care",
};

/** A Personal Year in a few words: follows "a year of", "so expect" or "a time for". */
export const PY_SHORT: Record<number, string[]> = {
  1: ["fresh starts and first steps", "starting what the next nine years will build on", "beginning something you have been putting off", "new opportunities and a clean slate"],
  2: ["patience, partnership and gradual progress", "slowing down and letting plans develop", "teamwork and careful listening", "small steps and good company"],
  3: ["friends, creativity and self-expression", "accepting invitations and meeting people", "sharing your ideas more widely", "a busier social life"],
  4: ["hard work that lasts", "routines, plans and solid foundations", "getting organised and building steadily", "steady work and visible progress"],
  5: ["change, travel and the unexpected", "new people and changes of direction", "freedom and a change of scene", "unplanned opportunities"],
  6: ["home, family and close relationships", "looking after people and being looked after", "commitments to the people you love", "putting your home in order"],
  7: ["rest, reflection and study", "quiet study and working things out", "time alone to think", "trusting your instincts"],
  8: ["results, recognition and responsibility", "money matters and stepping up", "seeing earlier effort pay off", "confidence and ambition"],
  9: ["endings, clearing out and forgiving", "finishing what needs finishing", "letting go to make room", "closing a nine-year cycle"],
};

export interface AnimalSpot {
  /** Follows "you carry". */
  spirit: Two;
  /** Follows "your Horse adds". */
  gift: string;
}

export const ANIMAL_SPOT: Record<string, AnimalSpot> = {
  rat: { spirit: ["a quick, resourceful nature that spots every opportunity", "a clever, adaptable streak and a good sense of timing"], gift: "a knack for finding a way where others see none" },
  ox: { spirit: ["a patient, dependable strength", "a steady, hard-working nature that does not give up"], gift: "the stamina to finish what you start" },
  tiger: { spirit: ["a brave, magnetic nature that enjoys a challenge", "a bold, passionate courage"], gift: "the courage to stand up for what is right" },
  rabbit: { spirit: ["a gentle, graceful nature", "a calm, kind and quietly intuitive manner"], gift: "a talent for creating calm" },
  dragon: { spirit: ["a powerful, ambitious energy", "a confident nature full of big plans"], gift: "an energy that gets big things done" },
  snake: { spirit: ["a wise, perceptive nature", "a calm, refined and intuitive manner"], gift: "the ability to see what really matters in a situation" },
  horse: { spirit: ["a free, restless energy", "a lively, independent nature that likes to keep moving"], gift: "an energy that gets other people moving" },
  goat: { spirit: ["a gentle, creative nature", "an artistic, compassionate temperament that seeks harmony"], gift: "an eye for beauty and a kind heart" },
  monkey: { spirit: ["a playful, inventive mind", "a curious, clever nature that enjoys a puzzle"], gift: "a talent for solving problems quickly" },
  rooster: { spirit: ["an observant, honest nature", "a proud, precise and hard-working manner"], gift: "an eye for detail and a respect for the truth" },
  dog: { spirit: ["a loyal, fair-minded nature", "a faithful, protective temperament"], gift: "the loyalty of a lasting friend" },
  pig: { spirit: ["a warm, generous nature", "a sincere, easy-going temperament that enjoys life's comforts"], gift: "a generous, kind way of making life pleasant" },
};

/** How each animal shows day to day. Follows "you". */
export const ANIMAL_WAY: Record<string, string[]> = {
  rat: ["spot opportunities quickly and act on them", "manage resources carefully and plan ahead", "read people well in social situations"],
  ox: ["work steadily and keep your commitments", "prefer routine and tested methods", "take time to warm up to new people"],
  tiger: ["take risks that others avoid", "stand up for people who are treated unfairly", "find routine and restrictions hard to accept"],
  rabbit: ["avoid conflict and smooth over tension", "create calm, comfortable surroundings", "prefer diplomacy to confrontation"],
  dragon: ["set ambitious goals and expect to reach them", "draw people towards your plans", "find it hard to accept a smaller role"],
  snake: ["think carefully before you speak or act", "keep personal matters private", "rely on intuition when weighing people up"],
  horse: ["need movement, variety and independence", "make decisions quickly and act on them", "lose interest when things become routine"],
  goat: ["express yourself through creativity and care", "need a peaceful, supportive setting to do your best", "can worry when plans are uncertain"],
  monkey: ["solve problems with quick, inventive thinking", "adapt easily to new situations", "get bored when there is nothing new to work on"],
  rooster: ["prepare thoroughly and pay attention to detail", "say what you think, even when it is unwelcome", "hold yourself and others to high standards"],
  dog: ["protect the people you care about", "speak up when something is unfair", "can worry about things that may never happen"],
  pig: ["enjoy good company, food and comfort", "give generously and trust people readily", "prefer to keep life simple and pleasant"],
};

/** What the year's Chinese element adds to the animal. Follows a comma. */
export const YEAR_ELEMENT_TWIST: Record<ChineseElement, Two> = {
  Wood: ["with a Wood year's urge to grow and help others grow", "softened by Wood's kindness and interest in growth"],
  Fire: ["strengthened by Fire's warmth and passion", "with Fire's extra energy and charisma"],
  Earth: ["grounded by Earth's patience and common sense", "with Earth's steadiness underneath"],
  Metal: ["with the firmness and focus of a Metal year", "sharpened by Metal's discipline and strong principles"],
  Water: ["deepened by Water's intuition and flexibility", "with Water's calm judgement running through it"],
};

/**
 * East meets West: the Chinese year element with the Sun sign's element. Keyed "Chinese|Western".
 * {Sun} is the sign and {Animal} the animal. They are never joined into one name like "Libra Horse".
 */
export const EAST_WEST: Record<`${ChineseElement}|${WesternElement}`, string[]> = {
  "Wood|Fire": [
    "In Chinese astrology Wood feeds Fire, so your Wood year gives your {Sun} Sun's enthusiasm a steady supply of energy.",
    "Your Wood year and {Sun} Sun support each other, so once your {Sun} drive starts, it tends to keep going.",
    "Wood and Fire are a supportive pair, so your {Animal} year keeps renewing the energy of your {Sun} Sun.",
  ],
  "Wood|Earth": [
    "Your Wood year wants growth while your {Sun} Sun wants security, so you tend to grow slowly but lastingly.",
    "Wood pushes and Earth holds, so your {Animal} side seeks progress while your {Sun} side protects what you have.",
    "With a Wood year and an Earth Sun in {Sun}, you balance an appetite for change with a need for stability.",
  ],
  "Wood|Air": [
    "Your Wood year adds a wish to help things grow to the ideas of your {Sun} Sun.",
    "Wood and Air combine kindness with curiosity, so your {Sun} ideas often aim at helping someone.",
    "Your {Animal} year brings Wood's generosity, and your {Sun} Sun brings the words to share it.",
  ],
  "Wood|Water": [
    "In Chinese astrology Water feeds Wood, so your {Sun} Sun's feelings support everything your Wood year tries to grow.",
    "Your {Sun} Sun's emotional depth suits your Wood year, and the people around you often benefit from both.",
    "Water and Wood support each other, so your {Sun} sensitivity and your {Animal} generosity work together.",
  ],
  "Fire|Fire": [
    "Your Fire year and {Sun} Sun double your warmth and energy, so pacing yourself matters.",
    "Fire in both East and West makes your {Animal} side and {Sun} Sun equally energetic, which can lead to burnout if you never rest.",
    "With Fire from your {Animal} year and your {Sun} Sun, you bring plenty of energy and need to watch how fast you spend it.",
  ],
  "Fire|Earth": [
    "In Chinese astrology Fire feeds Earth, so your Fire year brings drive to your patient {Sun} nature.",
    "Your Fire year supplies energy and your {Sun} Sun supplies patience, which helps ideas become something solid.",
    "Fire supports Earth, so your {Animal} drive gives your {Sun} plans the push they need.",
  ],
  "Fire|Air": [
    "Your Fire year and {Sun} Sun feed each other, giving you charm, energy and plenty to say.",
    "Air fuels Fire, so your {Sun} ideas gain force from your {Animal} year's energy.",
    "With a Fire year and an Air Sun in {Sun}, you move quickly from idea to action.",
  ],
  "Fire|Water": [
    "Your Fire year and {Sun} Sun pull in different directions: your {Animal} side wants to act while your {Sun} side wants to feel things through.",
    "A Fire year and a Water Sun in {Sun} make you bold and sensitive at once, so you may react strongly and then reflect.",
    "Your {Animal} year brings heat and your {Sun} Sun brings feeling, so you can be decisive and gentle at the same time.",
  ],
  "Earth|Fire": [
    "Your Earth year steadies your Fire Sun, so your {Sun} enthusiasm has a solid base.",
    "Earth gives Fire a safe place to burn, so your {Animal} side keeps your {Sun} energy useful.",
    "With an Earth year and {aSun} Sun, you combine enthusiasm with enough patience to finish things.",
  ],
  "Earth|Earth": [
    "Earth in both East and West makes your {Animal} side and {Sun} Sun doubly practical and reliable.",
    "Your Earth year and {Sun} Sun make you steady under pressure, though slow to change direction.",
    "With Earth from your {Animal} year and your {Sun} Sun, people tend to rely on you when things become uncertain.",
  ],
  "Earth|Air": [
    "Your Earth year gives your {Sun} ideas a firm footing, so your thoughts are more likely to become plans.",
    "Earth and Air balance each other: your {Animal} side stays practical while your {Sun} side explores ideas.",
    "Your Earth year keeps your {Sun} Sun's ideas realistic without holding them back.",
  ],
  "Earth|Water": [
    "Your Earth year gives your {Sun} Sun's strong feelings structure and a safe outlet.",
    "Earth contains Water, so your {Animal} steadiness helps your {Sun} feelings go somewhere useful.",
    "With an Earth year and {aSun} Sun, you pair emotional depth with practical common sense.",
  ],
  "Metal|Fire": [
    "Your Metal year adds discipline to your Fire Sun, so your {Sun} passion comes with precision.",
    "In Chinese astrology Fire shapes Metal, so your {Sun} energy sharpens your Metal year's focus.",
    "With a Metal year and {aSun} Sun, you combine strong principles with strong drive, which can make you hard to persuade.",
  ],
  "Metal|Earth": [
    "In Chinese astrology Earth feeds Metal, so your {Sun} patience strengthens your Metal year's focus.",
    "Your {Sun} Sun's steadiness and your {Animal} year's discipline make you formidable once you commit.",
    "Earth supports Metal, so your {Sun} reliability backs up your {Animal} principles.",
  ],
  "Metal|Air": [
    "Your Metal year gives your {Sun} ideas firm principles, so you care about freedom and fairness equally.",
    "Your {Animal} year brings conviction and your {Sun} Sun brings the words to express it.",
    "With a Metal year and an Air Sun in {Sun}, you think clearly and speak with authority.",
  ],
  "Metal|Water": [
    "In Chinese astrology Metal feeds Water, so your Metal year's strength supports your {Sun} Sun's strong feelings.",
    "Your {Animal} year gives structure to your {Sun} emotions, so you can feel strongly without being overwhelmed.",
    "Metal supports Water, so your {Animal} discipline steadies your {Sun} sensitivity.",
  ],
  "Water|Fire": [
    "Your Water year cools your Fire Sun, so your {Sun} side acts boldly but also thinks things through.",
    "Water checks Fire in Chinese astrology, so your {Animal} side tempers your {Sun} impulses with reflection.",
    "With a Water year and {aSun} Sun, your energy is strong but controlled, as long as you allow time to reflect.",
  ],
  "Water|Earth": [
    "Your Water year softens your practical {Sun} side and adds intuition to it.",
    "Water and Earth combine flexibility with stability, so your {Animal} side adapts while your {Sun} side holds steady.",
    "With a Water year and {aSun} Sun, you are practical but also sensitive to what others need.",
  ],
  "Water|Air": [
    "Your Water year adds emotional depth to your {Sun} Sun's ideas, so you understand people as well as concepts.",
    "Your {Animal} intuition gives real feeling to your {Sun} ideas.",
    "With a Water year and an Air Sun in {Sun}, you think clearly and also sense how others feel.",
  ],
  "Water|Water": [
    "Water in both East and West makes your {Animal} side and {Sun} Sun doubly intuitive, so you read people easily.",
    "Your Water year and {Sun} Sun make you highly sensitive to atmosphere, which helps with people and can tire you out.",
    "With Water from your {Animal} year and your {Sun} Sun, you notice moods quickly and need time alone to recover.",
  ],
};

/** How the animal's yin or yang year shows: follows "you". */
export const ANIMAL_POLARITY: Record<string, string[]> = {
  rat: ["move first and think on your feet", "act on a chance before others have spotted it", "keep busy and keep a backup plan"],
  ox: ["watch, wait and then commit fully", "prove yourself quietly rather than loudly", "save your energy for what really matters"],
  tiger: ["commit first and sort out the details later", "meet a challenge directly", "act on instinct and trust it"],
  rabbit: ["read the room before you speak", "win people over gently rather than loudly", "protect your peace and choose your moments"],
  dragon: ["take the lead without apologising for it", "start big and expect things to work out", "lead from the front and bring others with you"],
  snake: ["think several moves ahead and say less than you know", "keep your plans private and choose your timing carefully", "act quietly and at the right moment"],
  horse: ["are already moving while others are still deciding", "need movement, plans and fresh air to feel like yourself", "act first and adjust as you go"],
  goat: ["ease into things rather than rush", "do your best work in a calm, kind setting", "take things in fully before you respond"],
  monkey: ["try things out and learn by doing", "experiment until you find the clever route", "keep things moving with quick ideas"],
  rooster: ["prepare carefully and arrive ready", "notice the details and quietly put them right", "watch first, then speak with confidence"],
  dog: ["stand up for people straight away", "act the moment something feels unfair", "put your energy behind the people you love"],
  pig: ["take life at a kind, unhurried pace", "enjoy the present rather than chase the next thing", "give generously and without fuss"],
};

/** When three or more of the five personal planets share an element. {pp} is "your personal planets", explained the first time. */
export const ELEMENT_LEADS: Record<WesternElement, string[]> = {
  Fire: ["With most of {pp} in Fire, you run on enthusiasm, courage and instinct.", "Fire leads {pp}, so energy and confidence come naturally to you.", "Three or more of {pp} are in Fire, so you warm up a room quickly and dislike waiting.", "Fire dominates {pp}, so you act first and reflect later."],
  Earth: ["With most of {pp} in Earth, you are practical, patient and good at making things real.", "Earth leads {pp}, so common sense and steadiness come naturally to you.", "Most of {pp} sit in Earth, so you trust what you can see, touch and measure.", "Earth dominates {pp}, so you are usually the one who turns a plan into action."],
  Air: ["With most of {pp} in Air, you live in ideas, conversation and connection.", "Air leads {pp}, so thinking, talking and connecting come naturally to you.", "Most of {pp} sit in Air, so a good conversation restores you more than almost anything.", "Air dominates {pp}, so you are often the one keeping people in touch."],
  Water: ["With most of {pp} in Water, feeling and intuition guide most of what you do.", "Water leads {pp}, so empathy and intuition come naturally to you.", "Most of {pp} sit in Water, so you sense the mood of a room as soon as you enter.", "Water dominates {pp}, so you often notice that something is wrong before anyone says so."],
};

/** When none of the five personal planets is in an element: a clause. */
export const ELEMENT_MISSING: Record<WesternElement, string[]> = {
  Fire: ["you may need a push to start things, and enthusiastic people are good for you", "you rarely rush in, so spontaneous friends can help you try new things", "motivation can take a while to build, so small, achievable deadlines help"],
  Earth: ["routines and practical details may take effort, and grounded friends help", "budgets and to-do lists may not come naturally, so keep them simple", "your body may need reminding to eat, sleep and slow down"],
  Air: ["you may feel things before you can put them into words", "talking things through may feel awkward, so writing things down can help", "you act on instinct more than analysis, which keeps you honest"],
  Water: ["feelings may be easier to act on than to talk about", "you may need a moment to notice what you feel, so check in with yourself", "other people's moods can puzzle you, so asking directly works better than guessing"],
};

/** When three or more of the five personal planets share a modality. {planets} is "your Sun, Moon and Mars". */
export const MODALITY_LEADS: Record<Modality, string[]> = {
  Cardinal: ["{Planets} all sit in cardinal signs, which tend to initiate, so you would rather start something new than maintain something old.", "With {planets} in cardinal signs, the group that begins things, you are usually the one who gets things moving.", "Cardinal signs, which take the first step, hold {planets}, which makes starting things one of your strengths."],
  Fixed: ["{Planets} all sit in fixed signs, which tend to persist, so you see things through long after others have stopped.", "With {planets} in fixed signs, the group that holds its course, you rarely abandon what you start.", "Fixed signs, which hold their course, contain {planets}, which makes persistence one of your strengths."],
  Mutable: ["{Planets} all sit in mutable signs, which tend to adjust, so a change of plan rarely throws you.", "With {planets} in mutable signs, the group that bends with change, you adjust rather than resist when plans change.", "Mutable signs, which bend with change, hold {planets}, which makes flexibility one of your strengths."],
};

/** Three or more personal planets in one sign. {Count} is "Three", "Four" or "All five"; {pp} as in ELEMENT_LEADS. */
export const STELLIUM: Two = [
  "{Count} of {pp} sit in {Sign}, so {native} shapes much of what you do.",
  "With {count} of {pp} in {Sign}, {native} runs through most of your choices.",
];

/** Venus (what you love) against Mars (how you pursue it), by how their signs meet. A full clause. */
export const VENUS_MARS: Record<"easy" | "care" | "mixed", string[]> = {
  easy: ["the two signs get on, so what you want and how you pursue it rarely conflict", "the two work well together, so your affections and your ambitions point the same way", "the signs are compatible, so you go after what you want without much second-guessing"],
  care: ["the two signs pull in different directions, so what you want and how you pursue it can clash", "the signs do not always agree, which can leave you wanting closeness and then pushing it away", "the signs are at odds, so your romantic side and your competitive side need separate outlets"],
  mixed: ["the two signs work in different ways, so you may want one thing and pursue another", "the signs sit side by side without matching, which makes your motives more complex than they first appear", "the signs have little in common, so your heart and your drive take turns leading"],
};

/** Mercury beside the Sun. {Sun} and {Mer} are signs, {kw} Mercury's sign keywords and {aKw} the same with "a" or "an". */
export const MERCURY_SUN: { same: string[]; other: string[] } = {
  same: [
    "Your Mercury is also in {Sun}, so the way you speak is as {kw} as the rest of you.",
    "With Mercury in {Sun} as well, there is little gap between what you think and what you say, and both are {kw}.",
    "Mercury shares your {Sun} Sun's sign, so people hear your {kw} character clearly in how you talk.",
  ],
  other: [
    "Your Mercury in {Mer} gives your {Sun} nature {aKw} way of thinking.",
    "Mercury in {Mer} adds {aKw} tone to the way your {Sun} side thinks and talks.",
    "Because Mercury is in {Mer} rather than {Sun}, you think in {aKw} way that people may not expect from your Sun sign.",
  ],
};
