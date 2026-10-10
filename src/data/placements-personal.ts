// What each personal planet means in each sign. The Sun, Moon, Mercury, Venus and Mars
// move quickly, so these placements are the most personal part of a birth chart.
import type { Placement } from "./astrology.ts";

export const PERSONAL_PLACEMENTS = {
  sun: {
    aries: {
      glance: "Bold, quick to act and first off the mark",
      text: "The Sun is said to be exalted in Aries, meaning it shines especially brightly here, and you feel most alive when you are starting something new. Your courage, honesty and sheer get up and go can lift everyone around you. Watch out for rushing in before thinking, and for losing interest once the exciting first push is over.",
    },
    taurus: {
      glance: "Steady, patient and quietly determined to last",
      text: "Your core self is calm, grounded and built for the long haul, and you draw your energy from comfort, nature and simple pleasures. You are loyal and reliable, the person others lean on when life feels shaky. Watch out for digging your heels in, because your gift for staying put can turn into a stubborn refusal to change when change would help you.",
    },
    gemini: {
      glance: "Curious, chatty and endlessly interested in everything",
      text: "You come alive through ideas, conversation and variety, and your sense of self grows with every new thing you learn. Your quick wit and lightness make you wonderful company and a natural go between for different people. Watch out for scattering your energy across too many interests at once, so that nothing gets the deeper attention it deserves.",
    },
    cancer: {
      glance: "Caring, protective and deeply rooted in home",
      text: "Your sense of who you are is tied closely to the people you love and the place you call home. You shine when you are looking after others, and your warmth makes people feel safe and remembered. Watch out for retreating into your shell when you feel hurt, and for carrying old wounds long after it would be kinder to yourself to let them go.",
    },
    leo: {
      glance: "Warm, generous and made to shine brightly",
      text: "The Sun rules Leo, so it is completely at home here, and you radiate warmth, confidence and a big, open heart. You have a natural flair for creativity and leadership, and you make others feel special simply by being around them. Watch out for needing too much praise, and for feeling deeply wounded when your efforts go unnoticed.",
    },
    virgo: {
      glance: "Helpful, thoughtful and quietly devoted to improving",
      text: "You find your purpose in being useful, noticing the details others miss and making things work a little better each day. Your care, skill and modesty mean people trust you to get things right. Watch out for being too hard on yourself, because your eye for what could be improved can easily turn inward and become harsh self criticism.",
    },
    libra: {
      glance: "Charming, fair minded and happiest in good company",
      text: "Your sense of self shines brightest through relationships, beauty and keeping the peace. You have a real gift for seeing both sides and helping people find middle ground. The Sun is considered weaker in Libra, which simply means you may find it hard to put yourself first, so watch out for losing your own wishes while trying to keep everyone else happy.",
    },
    scorpio: {
      glance: "Intense, private and powerfully determined underneath",
      text: "You live life at depth, and your core self is fuelled by strong feelings, loyalty and a wish to understand what lies beneath the surface. You are brave in a crisis and can transform yourself again and again. Watch out for holding grudges or keeping people at arm's length, because guarding your heart too closely can leave you feeling alone.",
    },
    sagittarius: {
      glance: "Adventurous, optimistic and always looking further ahead",
      text: "You feel most yourself when you are exploring, whether that means travelling, studying or chasing a big idea about life. Your humour, honesty and hopeful outlook can light up a room and inspire others to aim higher. Watch out for restlessness and careless promises, as your love of freedom can make it hard to stick with things once the novelty fades.",
    },
    capricorn: {
      glance: "Ambitious, responsible and steadily climbing towards goals",
      text: "Your core self is serious, practical and patient, and you get real satisfaction from building something that lasts. You take responsibility seriously and often grow more relaxed and playful as you get older. Watch out for working so hard that you forget to rest, and for measuring your worth only by what you have achieved.",
    },
    aquarius: {
      glance: "Original, independent and thinking about the bigger picture",
      text: "You shine by being yourself, even when that means standing apart from the crowd, and you care deeply about fairness and the wider community. Your fresh ideas often feel ahead of their time. The Sun is considered less comfortable in Aquarius, which shows as a pull between being special and being one of the group, so watch out for seeming distant when people want warmth.",
    },
    pisces: {
      glance: "Gentle, imaginative and deeply in tune with others",
      text: "Your sense of self is soft, dreamy and generous, and you pick up on other people's feelings almost without trying. You have a rich imagination and a deep well of compassion that can make you a natural healer or artist. Watch out for drifting or losing yourself in other people's needs, and remember that your own boundaries matter too.",
    },
  },
  moon: {
    aries: {
      glance: "Quick feelings that flare up and pass fast",
      text: "Your emotions arrive fast and fierce, and you tend to react first and reflect later. You feel comforted by action, independence and having something to do rather than sitting with a problem. Your feelings are honest and you rarely sulk for long, but watch out for snapping when you feel stuck, and give others a moment to catch up with you.",
    },
    taurus: {
      glance: "Calm, steady and soothed by simple comforts",
      text: "The Moon is exalted in Taurus, which means it is especially happy here, and your feelings tend to be steady and settled. You find comfort in good food, cosy surroundings, nature and familiar routines. You bring a calming presence to people in distress, but watch out for clinging to what is safe and familiar when life is asking you to move on.",
    },
    gemini: {
      glance: "Talks feelings through and needs lively stimulation",
      text: "You make sense of your emotions by talking, writing or thinking them through, and you feel better once you have put a name to them. You are comforted by chat, variety and a sense of things happening. Your lightness helps you bounce back quickly, but watch out for explaining feelings away instead of letting yourself actually feel them.",
    },
    cancer: {
      glance: "Deeply caring, sensitive and nurturing by instinct",
      text: "The Moon rules Cancer, so your emotional nature is strong, tender and very much at home here. You instinctively know how to comfort others, and you feel safest surrounded by family, memories and a cosy home. Watch out for moodiness and for taking things too personally, as your sensitivity can make small slights feel much bigger than they are.",
    },
    leo: {
      glance: "Warm hearted, expressive and needing to feel appreciated",
      text: "Your feelings are big, warm and openly shown, and you feel comforted when you are loved, noticed and able to express yourself. You are generous with affection and loyal to those you care about. Watch out for feeling hurt by a lack of attention, and for pride getting in the way of admitting when you need some support yourself.",
    },
    virgo: {
      glance: "Finds comfort in order, routine and being useful",
      text: "You feel settled when your surroundings are tidy, your plans are clear and you can do something practical to help. Caring for you means caring in small, thoughtful ways, like remembering how someone takes their tea. Watch out for worry, as your mind can fret over every detail, and try to accept that comfort does not have to be earned.",
    },
    libra: {
      glance: "Needs harmony, fairness and a calm, pleasant atmosphere",
      text: "Your emotional wellbeing depends a great deal on peaceful relationships and lovely surroundings. You are comforted by companionship, kindness and beauty, and you are skilled at soothing tense situations. Watch out for hiding your true feelings to avoid an argument, as keeping the peace at any cost can quietly build resentment over time.",
    },
    scorpio: {
      glance: "Feels everything deeply and trusts only a few",
      text: "Your emotions run very deep and very private, and you need complete trust before you let anyone in. The Moon is said to be in its fall here, meaning feelings can be intense and hard to settle, yet this also gives you remarkable emotional strength. Watch out for jealousy and secrecy, and allow safe people to see your softer side.",
    },
    sagittarius: {
      glance: "Upbeat, freedom loving and soothed by adventure",
      text: "You cope with feelings by looking on the bright side, and you feel comforted by space, travel, laughter and a sense of meaning. Your optimism helps you and others recover from setbacks. Watch out for running from difficult emotions by staying busy or moving on, because some feelings need to be faced before you can truly feel free.",
    },
    capricorn: {
      glance: "Reserved, self reliant and emotionally steady under pressure",
      text: "You tend to keep feelings to yourself and handle them in a practical, sensible way. The Moon is considered uncomfortable in Capricorn, which means you may have learned early on to be grown up and strong. You are a rock for others in hard times, but watch out for bottling things up and remember that needing comfort is not a weakness.",
    },
    aquarius: {
      glance: "Cool headed, friendly and needs emotional breathing space",
      text: "You process feelings by stepping back and thinking about them, and you feel comforted by friendship, freedom and being accepted as you are. You are a loyal friend and rarely judge others for being different. Watch out for detaching from your own emotions when they feel messy, as people close to you may long for more warmth and openness.",
    },
    pisces: {
      glance: "Tender, intuitive and soaks up others' moods",
      text: "Your feelings are soft and boundless, and you sense the moods of people and places almost like a sponge. You are comforted by music, quiet time, daydreams and anything that lets you escape the harshness of the world. Your compassion is a real gift, but watch out for absorbing too much, and make time alone to recharge.",
    },
  },
  mercury: {
    aries: {
      glance: "Quick thinking, direct and says it straight",
      text: "Your mind works fast and you like to get to the point, often deciding in a flash. You are brilliant at quick answers, debates and getting new ideas off the ground. Watch out for speaking before you have thought it through, and for impatience with people who need more time, as your bluntness can land harder than you mean it to.",
    },
    taurus: {
      glance: "Slow, careful thinking that sticks once learned",
      text: "You like to take your time with ideas, and once you have learned something it stays with you for good. You speak in a calm, practical way and prefer solid facts to wild theories. Your common sense is a real strength, but watch out for closing your mind once you have made a decision, even when new information suggests a rethink.",
    },
    gemini: {
      glance: "Lively, witty and brilliant with words",
      text: "Mercury rules Gemini, so your mind is very much at home, quick, curious and full of questions. You learn fast, chat easily and can explain things in a way anyone can follow. Watch out for skimming the surface of a topic and moving on too soon, and for nervous chatter when a quiet moment would serve you better.",
    },
    cancer: {
      glance: "Thinks with feelings and remembers every detail",
      text: "Your thinking is coloured by your emotions, and you often understand things through a gut feeling before you can explain them. You have a wonderful memory, especially for people and the past, and you speak with warmth and care. Watch out for taking comments personally, and for letting a mood decide what you believe is true.",
    },
    leo: {
      glance: "Confident, expressive and a natural storyteller",
      text: "You speak with warmth, drama and conviction, and people tend to listen when you tell a story. Your mind loves creative projects and big, bold ideas that you can stand behind. Watch out for being so attached to your own opinions that you dismiss others, as true confidence includes being able to say that you might be wrong.",
    },
    virgo: {
      glance: "Precise, analytical and excellent with fine details",
      text: "Mercury both rules and is exalted in Virgo, so your mind is sharp, careful and wonderfully organised. You notice small errors, love solving practical problems and explain things clearly and accurately. Watch out for overthinking and worrying, and for being too critical in how you speak to others or yourself when something is not quite perfect.",
    },
    libra: {
      glance: "Diplomatic, fair and weighs up every side",
      text: "Your mind naturally looks for balance, and you are skilled at seeing every point of view before you decide. You speak tactfully and know how to say difficult things kindly. Watch out for sitting on the fence too long, because weighing up every option can turn into indecision, and sometimes people simply need you to choose.",
    },
    scorpio: {
      glance: "Probing, perceptive and reads between the lines",
      text: "Your mind is like a detective's, digging beneath the surface to find out what is really going on. You are hard to fool and can keep a secret better than anyone. Your insight is powerful, but watch out for suspicion and for cutting words when you feel threatened, as your sharp tongue can leave deeper marks than you realise.",
    },
    sagittarius: {
      glance: "Big picture thinker with honest, enthusiastic opinions",
      text: "You love big ideas, philosophy and learning about other cultures, and you speak with honesty and humour. Mercury is said to be less comfortable here, which means details can slip past you while you chase the bigger meaning. Watch out for exaggerating or speaking too bluntly, and check the small print before you leap.",
    },
    capricorn: {
      glance: "Practical, organised and thinks in clear steps",
      text: "Your thinking is sensible, structured and focused on what actually works in the real world. You plan carefully, speak with authority and tend to be taken seriously. Your patience and good judgement are real strengths, but watch out for pessimism and a dry, serious tone that can make you seem harsher or more closed off than you are.",
    },
    aquarius: {
      glance: "Inventive, original and full of unusual ideas",
      text: "Your mind works in surprising ways, and you often see solutions that others have missed. You enjoy science, technology and talking about how the world could be better. You are open minded about people, but watch out for being stubborn about your ideas, and for sounding detached when someone needs a warmer response than pure logic.",
    },
    pisces: {
      glance: "Imaginative, intuitive and thinks in pictures and feelings",
      text: "Your mind works through images, impressions and hunches rather than neat lists. Mercury is considered weakest in Pisces, so facts and plans can feel slippery, yet your intuition and creativity are often remarkable. You are gentle and understanding with words, but watch out for vagueness and forgetfulness, and write down what truly matters.",
    },
  },
  venus: {
    aries: {
      glance: "Passionate, impulsive and loves the thrill of chase",
      text: "In love you are direct and eager, and you know quickly when you are attracted to someone. You enjoy excitement, a little challenge and partners with confidence. Venus is less comfortable in Aries, so watch out for losing interest once the chase is over, and for spending on impulse when something shiny catches your eye.",
    },
    taurus: {
      glance: "Loyal, sensual and loves comfort and quality",
      text: "Venus rules Taurus, so here it is happy and at ease, and you show love through touch, good food and steady devotion. You appreciate beautiful, well made things and tend to be sensible and patient with money. Watch out for possessiveness in relationships and for holding on to people or possessions simply because they feel familiar.",
    },
    gemini: {
      glance: "Flirty, playful and attracted to clever minds",
      text: "You fall for wit and conversation, and a good chat can be more romantic to you than flowers. You love variety, fun dates and a partner who is also your friend. Watch out for restlessness and mixed signals, as you may enjoy flirting with ideas or people without fully committing, and spending can be spread across lots of small treats.",
    },
    cancer: {
      glance: "Tender, devoted and loves to nurture",
      text: "You love in a caring, protective way, and you feel most loved when you feel safe and looked after. You value home, family and keepsakes with sentimental meaning, and you are often careful with money to feel secure. Watch out for clinging when you feel unsure, and for expecting others to guess your needs instead of telling them.",
    },
    leo: {
      glance: "Romantic, generous and loves grand gestures",
      text: "You love with a big heart and enjoy romance that feels like something out of a film. You are loyal, affectionate and generous with gifts and attention, and you appreciate glamour and quality. Watch out for needing constant admiration from a partner, and for spending lavishly to impress, as true love does not need an audience.",
    },
    virgo: {
      glance: "Shows love through thoughtful, practical acts of care",
      text: "You express love by doing helpful things, like fixing something or remembering exactly what someone needs. Venus is said to be in its fall in Virgo, meaning love can feel more cautious and critical here. You are sincere and dependable, but watch out for nitpicking a partner's flaws or doubting whether you yourself are lovable enough.",
    },
    libra: {
      glance: "Charming, graceful and longs for true partnership",
      text: "Venus rules Libra, so love and beauty come naturally to you, and you have a real eye for style and harmony. You thrive in a balanced partnership and know how to make others feel valued. Watch out for avoiding conflict at any cost, and for staying in a relationship mainly because being on your own feels uncomfortable.",
    },
    scorpio: {
      glance: "Intense, loyal and wants deep, all in love",
      text: "You do not do casual love, and when you commit you give your whole heart and expect the same in return. Venus is considered uncomfortable here, so feelings can become intense and complicated. Your devotion and depth are rare gifts, but watch out for jealousy and testing people, and learn to trust that love does not always need to be proven.",
    },
    sagittarius: {
      glance: "Free spirited, fun and loves adventure together",
      text: "You are attracted to people who make you laugh, broaden your world and share your love of adventure. You are honest and generous in love, and money often goes on travel, learning or experiences. Watch out for fearing commitment, as you may resist anything that feels like a cage, even when a relationship would actually give you room to grow.",
    },
    capricorn: {
      glance: "Serious, loyal and builds love to last",
      text: "You approach love carefully and take commitment seriously, preferring a steady partner to a whirlwind romance. You show love through reliability and long term plans, and you are usually wise with money. Watch out for holding back affection until you feel completely sure, as your reserve can be mistaken for coldness by people who need more warmth.",
    },
    aquarius: {
      glance: "Friendly, unconventional and needs freedom in love",
      text: "You are drawn to people who are a bit different, and friendship is often the foundation of your romances. You value equality, independence and a partner who respects your space. Your open mindedness is lovely, but watch out for keeping people at a distance emotionally, as closeness can sometimes feel more threatening to you than it needs to.",
    },
    pisces: {
      glance: "Dreamy, devoted and loves with boundless compassion",
      text: "Venus is exalted in Pisces, which means love is at its most tender and selfless here. You are deeply romantic, forgiving and inspired by music, art and beauty. Your capacity to love unconditionally is a real gift, but watch out for seeing partners through rose tinted glasses, and for giving so much that you leave nothing for yourself.",
    },
  },
  mars: {
    aries: {
      glance: "Fiery, fearless and ready to charge ahead",
      text: "Mars rules Aries, so your drive is strong, direct and full of energy. You go after what you want without hesitation, and you are brave when others hang back. Your anger flares quickly but fades just as fast. Watch out for impatience and picking fights you do not need, as not every battle deserves your full force.",
    },
    taurus: {
      glance: "Slow to start but impossible to stop",
      text: "Your drive is steady and patient, and once you commit to something you keep going long after others give up. Mars is less comfortable in Taurus, so you may need a good reason before you act. You have remarkable stamina, but watch out for stubbornness and slow burning anger that builds quietly and then erupts all at once.",
    },
    gemini: {
      glance: "Quick, restless energy spread across many interests",
      text: "Your energy goes into ideas, talk and juggling lots of things at once. You are quick witted in an argument and can think your way out of almost any corner. You are adaptable and lively, but watch out for scattering your efforts and starting more projects than you finish, and for using sharp words when you feel frustrated.",
    },
    cancer: {
      glance: "Protective, indirect and fiercely defends loved ones",
      text: "Your drive is powered by feelings, and you act most strongly when protecting your home and the people you love. Mars is said to be in its fall in Cancer, meaning direct action can feel awkward, so you may go about things sideways. You are fiercely loyal, but watch out for sulking, passive aggression and holding on to hurts instead of saying them.",
    },
    leo: {
      glance: "Confident, dramatic and driven to shine",
      text: "You act with warmth, pride and plenty of flair, and you put your whole heart into whatever you do. You are a natural leader who inspires others with your enthusiasm and courage. Watch out for taking challenges personally and for your pride being easily wounded, which can make it hard for you to back down from an argument.",
    },
    virgo: {
      glance: "Efficient, hardworking and focused on doing it right",
      text: "Your drive goes into careful, practical work, and you get real satisfaction from doing a job properly. You are precise, skilled and reliable, often the one who quietly makes everything run smoothly. Watch out for channelling frustration into criticism or worry, and for wearing yourself out trying to make everything perfect.",
    },
    libra: {
      glance: "Diplomatic drive that fights for fairness",
      text: "You go after what you want through charm, cooperation and teamwork rather than force. Mars is considered uncomfortable in Libra, so open conflict can feel unpleasant and you may hesitate to act. You are a strong champion of justice for others, but watch out for indecision and for burying anger until it comes out sideways.",
    },
    scorpio: {
      glance: "Intense, strategic and quietly unstoppable",
      text: "Mars traditionally rules Scorpio, so your drive is deep, focused and incredibly determined. You prefer to plan in private and act when the moment is right, and you rarely give up. Your willpower and courage in tough times are outstanding, but watch out for holding grudges and wanting to get even when someone has crossed you.",
    },
    sagittarius: {
      glance: "Enthusiastic, adventurous and driven by big goals",
      text: "Your energy comes alive with a cause, a journey or an exciting goal on the horizon. You are optimistic, honest and keen to explore, and you inspire others with your enthusiasm. Watch out for overconfidence and taking on too much, and for blunt words in the heat of the moment that you later wish you could take back.",
    },
    capricorn: {
      glance: "Disciplined, ambitious and works patiently towards success",
      text: "Mars is exalted in Capricorn, which means your drive is at its most focused and effective here. You set clear goals, work hard and know how to use your energy wisely over the long term. Your self control is a real strength, but watch out for becoming cold or ruthless in pursuit of success, and remember to enjoy the climb.",
    },
    aquarius: {
      glance: "Independent, inventive and drives change for everyone",
      text: "Your energy goes into new ideas, causes and doing things your own way. You are happiest when working towards something that benefits a group or the wider world. Your originality is inspiring, but watch out for rebelling just for the sake of it, and for cool detachment when someone wants you to engage with their feelings.",
    },
    pisces: {
      glance: "Gentle, intuitive drive guided by feelings and dreams",
      text: "Your energy ebbs and flows like the tide, and you work best when you are inspired or helping someone in need. You often get your way through gentleness and quiet persistence rather than force. Your compassion is a strength, but watch out for avoiding confrontation altogether, and for letting your energy drain away when you lose direction.",
    },
  },
} satisfies Record<string, Record<string, Placement>>;
