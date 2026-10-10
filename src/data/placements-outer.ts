// What the slower planets, Dark Moon Lilith and the Rising sign mean in each sign.
import type { Placement } from "./astrology.ts";

export const OUTER_PLACEMENTS = {
  jupiter: {
    aries: {
      glance: "Luck follows when you dare to go first",
      text: "Jupiter in Aries grows through courage, so life opens up when you take the first brave step instead of waiting for permission. Your faith in yourself is catching, and your generosity often shows as cheering others on to start their own adventures. Watch out for leaping before you look, because bold confidence can tip into rashness when you skip the dull but useful details.",
    },
    taurus: {
      glance: "Steady abundance built through patience and simple pleasures",
      text: "Jupiter in Taurus brings growth slowly and solidly, like a garden that rewards you for tending it season after season. You have a gift for attracting comfort, money and beauty, and you share good food and a warm home generously. Watch out for overindulging or clinging to what feels safe, because too much comfort can quietly stop you from growing further.",
    },
    gemini: {
      glance: "Opportunities arrive through curiosity, conversation and connections",
      text: "Jupiter in Gemini opens doors through words, ideas and the people you happen to chat with. Your luck often comes from a passing conversation, a book or a clever idea you share freely, and you are wonderfully good at learning anything quickly. Watch out for spreading yourself too thin, because chasing every interesting thread can leave you knowing a little about everything and finishing very little.",
    },
    cancer: {
      glance: "Growth through caring, home and emotional generosity",
      text: "Jupiter in Cancer is a lovely placement for kindness, so life opens up when you nurture others and build a sense of belonging. You have deep faith in family, whether that is the one you were born into or the one you choose, and people feel safe around you. Watch out for mothering everyone or holding on too tightly, because care works best when it also lets people grow.",
    },
    leo: {
      glance: "Big-hearted luck that shines when you're seen",
      text: "Jupiter in Leo grows through creativity, play and the courage to let your light show. Your generosity is grand and warm, and you have a talent for making others feel special, which tends to bring good fortune straight back to you. Watch out for needing too much applause, because pride can swell when attention becomes the reward rather than the joy of creating itself.",
    },
    virgo: {
      glance: "Opportunity found in useful work and careful improvement",
      text: "Jupiter in Virgo finds growth in the small, practical things, so life opens up when you help, fix and improve. Your faith lies in effort and skill, and your generosity often looks like quietly solving a problem for someone without being asked. Watch out for getting lost in details or criticising too much, because perfection can shrink a big opportunity into an endless to do list.",
    },
    libra: {
      glance: "Fortune grows through partnership, fairness and grace",
      text: "Jupiter in Libra brings luck through other people, so your life tends to open up through partners, friends and collaborations. You believe deeply in fairness and beauty, and your generosity shows as diplomacy, making peace and seeing every side. Watch out for avoiding hard decisions to keep everyone happy, because sitting on the fence too long can let good chances drift away.",
    },
    scorpio: {
      glance: "Deep growth through intensity, trust and transformation",
      text: "Jupiter in Scorpio grows by going deep rather than wide, so life opens up when you face hidden truths and difficult feelings. You have a powerful faith in healing and renewal, and you are generous with loyalty once someone has earned your trust. Watch out for an all or nothing attitude, because intensity can turn into control when you try to protect yourself from being hurt.",
    },
    sagittarius: {
      glance: "Natural optimism that loves travel, truth and adventure",
      text: "Jupiter feels right at home in Sagittarius, so your luck flows through exploring, learning and believing in something bigger. You are open hearted, honest and full of faith that things will work out, and that hope often makes it so. Watch out for overpromising or preaching, because your enthusiasm can run ahead of reality and your honesty can land more bluntly than you mean.",
    },
    capricorn: {
      glance: "Success built slowly through ambition and integrity",
      text: "Jupiter in Capricorn grows through hard work and long term goals, so life opens up the more responsibility you take on. Your faith rests in what is earned, and your generosity is practical, like mentoring others or building something that lasts. Watch out for being too cautious or serious, because waiting for guarantees can stop you from enjoying the luck that is already here.",
    },
    aquarius: {
      glance: "Growth through friendship, ideals and fresh ideas",
      text: "Jupiter in Aquarius opens up life through groups, causes and forward thinking, so your luck often arrives through friends and communities. You have a broad, tolerant faith in people and a generous wish to make the world fairer for everyone. Watch out for caring more about humanity than the person in front of you, because big ideals can sometimes feel cool and distant up close.",
    },
    pisces: {
      glance: "Compassionate luck guided by intuition and faith",
      text: "Jupiter in Pisces is wonderfully kind, so life opens up through compassion, imagination and trusting your inner voice. You have a deep spiritual faith and a generous heart that wants to help anyone who is struggling. Watch out for giving until you are empty or believing whatever feels hopeful, because your openness needs a few sensible boundaries to keep you from being taken advantage of.",
    },
  },
  saturn: {
    aries: {
      glance: "Learning to lead with patience and self-control",
      text: "Saturn in Aries asks you to master your own drive, so your big lesson is turning raw impatience into disciplined courage. You may fear being weak or holding back, yet with time you become a steady, brave leader who acts with purpose. Watch out for frustration when things move slowly, because your strength grows most when you learn that waiting can also be a form of power.",
    },
    taurus: {
      glance: "Building real security slowly and on your terms",
      text: "Saturn in Taurus teaches you about money, comfort and self worth, and you may have worried early on about never having enough. Your strength is a patient, practical nature that builds lasting security brick by brick. Watch out for holding on too tightly to possessions or routines out of fear, because true stability comes from trusting your own value, not just your bank balance.",
    },
    gemini: {
      glance: "Mastering your voice, mind and clear communication",
      text: "Saturn in Gemini makes learning and speaking a serious matter, so you may have once feared sounding foolish or not clever enough. Over time you become a careful thinker and a precise, trustworthy communicator whose words carry weight. Watch out for overthinking or staying quiet when you have something worthwhile to say, because your ideas deserve to be heard even before they feel perfect.",
    },
    cancer: {
      glance: "Learning to build emotional safety from within",
      text: "Saturn in Cancer puts lessons around home, family and feelings, and you may have felt you had to grow up quickly or hide your needs. Your strength is a deep sense of responsibility for the people you love, and you build a home that truly holds them. Watch out for guarding your heart so carefully that nobody can care for you in return."
    },
    leo: {
      glance: "Earning the confidence to shine without apology",
      text: "Saturn in Leo teaches you about self expression, and you may have feared being laughed at or not special enough to stand out. With time you develop a dignified, well earned confidence and creative work with real substance. Watch out for holding back your playful side or needing constant proof that you matter, because your light is worth sharing even before it has been perfected.",
    },
    virgo: {
      glance: "Mastering skill, health and useful daily habits",
      text: "Saturn in Virgo makes you a natural craftsperson, so your lessons revolve around work, health and doing things properly. You may fear making mistakes, but over time you become reliable, skilled and wonderfully organised. Watch out for worry and harsh self criticism, because not every task needs to be flawless, and being gentle with yourself is part of the discipline too.",
    },
    libra: {
      glance: "Learning fairness, commitment and balanced relationships",
      text: "Saturn in Libra takes relationships seriously, so your lessons come through partnership, fairness and keeping your promises. You may fear conflict or being alone, yet with time you become someone who builds loyal, mature and balanced bonds. Watch out for staying in situations out of duty or keeping score, because a good relationship should feel fair to you as well as to them.",
    },
    scorpio: {
      glance: "Mastering trust, intimacy and your inner strength",
      text: "Saturn in Scorpio asks you to face deep emotions, and you may fear betrayal, losing control or being truly seen. Your strength is remarkable resilience, a quiet power that grows each time you come through something hard. Watch out for building walls or keeping secrets out of self protection, because letting the right people in slowly is how you turn fear into real trust.",
    },
    sagittarius: {
      glance: "Building wisdom through study and honest beliefs",
      text: "Saturn in Sagittarius asks you to take your beliefs seriously, so your lessons come through learning, travel and finding meaning. You may have doubted your right to an opinion, but with time you grow into a grounded teacher whose wisdom is truly earned. Watch out for becoming rigid about being right, because the best beliefs stay open to new questions and experiences.",
    },
    capricorn: {
      glance: "A natural builder who masters ambition with time",
      text: "Saturn is at home in Capricorn, so you have a strong sense of duty and a talent for long term achievement. You may fear failure or not being respected, but with patience you build something solid and lasting, often getting better with age. Watch out for working so hard that you forget to rest, because success means more when there is joy in it too.",
    },
    aquarius: {
      glance: "Learning to belong while staying true to yourself",
      text: "Saturn in Aquarius brings lessons about community and individuality, and you may have felt like an outsider who did not quite fit. Over time you learn to build thoughtful systems and groups where different people can belong, including you. Watch out for keeping people at arm's length or becoming stubborn about your ideas, because real progress also needs warmth and the willingness to listen.",
    },
    pisces: {
      glance: "Giving shape and structure to dreams and feelings",
      text: "Saturn in Pisces asks you to bring form to the formless, so your lessons involve boundaries, faith and sensitivity. You may fear chaos or being overwhelmed, yet with time you learn to turn compassion and imagination into something real and helpful. Watch out for self sacrifice or escaping when life feels heavy, because your gentle strength grows when you stay present and protect your energy.",
    },
  },
  uranus: {
    aries: {
      glance: "A generation of bold pioneers starting fresh",
      text: "Uranus stays in each sign for about seven years, so you share Uranus in Aries with your whole generation, a group born to break new ground fast. Personally, you crave freedom to act on your own impulses and you are brilliant at starting things nobody has tried before. Watch out for restlessness and rebelling just for the thrill, because not every rule needs breaking.",
    },
    taurus: {
      glance: "Changing how we value money, earth and comfort",
      text: "Uranus in Taurus is shared by everyone born over roughly seven years, a generation set on reinventing money, food and how we care for the planet. For you personally, change works best when it is practical, and you can find wonderfully original ways to make life stable. Watch out for sudden swings between clinging to comfort and throwing it all away.",
    },
    gemini: {
      glance: "Restless minds rewiring how people talk and connect",
      text: "Uranus in Gemini marks a generation born over several years with quick, inventive minds who change how people communicate and share ideas. For you, freedom means thinking for yourself, and you often spot clever connections that others miss. Watch out for a scattered, jumpy attention span, because brilliant ideas still need some focus to turn into something real.",
    },
    cancer: {
      glance: "Reinventing what home and family can look like",
      text: "Uranus in Cancer belongs to a whole generation born over about seven years who rethink family, home and belonging. Personally, you may have experienced an unusual home life, and you have a gift for creating original, accepting kinds of family. Watch out for mood swings or pulling away when closeness feels restrictive, because your independence and your need for roots can both be honoured.",
    },
    leo: {
      glance: "Creative rebels who insist on being themselves",
      text: "Uranus in Leo is shared by your generation, born over roughly seven years, who changed ideas about self expression, fun and individuality. For you personally, originality shines through creativity, and you love standing out in a way nobody else could copy. Watch out for stubborn pride or needing to be the most different person in the room, because uniqueness does not require an audience.",
    },
    virgo: {
      glance: "Innovators changing work, health and everyday technology",
      text: "Uranus in Virgo marks a generation born over several years who reshape work, health and daily routines with fresh methods and new technology. Personally, your originality shows in clever, practical fixes, and you are often ahead of the curve on wellbeing. Watch out for nervous restlessness or criticising old ways too sharply, because improvement lands better with patience.",
    },
    libra: {
      glance: "Rewriting the rules of love and partnership",
      text: "Uranus in Libra belongs to everyone born over roughly seven years, a generation who questioned traditional marriage and created new kinds of relationship. For you, freedom within partnership really matters, and you bring fresh, fair ideas to how people relate. Watch out for keeping one foot out of the door, because commitment and independence can live together more easily than you expect.",
    },
    scorpio: {
      glance: "Fearless explorers of taboo, power and change",
      text: "Uranus in Scorpio is shared by a generation born over several years who brought hidden topics like sex, death and power into the open. Personally, you have a sharp, probing instinct for change and the courage to transform yourself completely when needed. Watch out for sudden extreme reactions, because not every upheaval needs to be total, and gentle change can be just as powerful.",
    },
    sagittarius: {
      glance: "A generation breaking free through ideas and travel",
      text: "Uranus in Sagittarius marks a generation born over about seven years who rethink beliefs, education and global connection. For you personally, freedom means exploring the world and questioning everything you were taught, and you can be a visionary about what life could be. Watch out for restless wanderlust or dismissing other views, because open mindedness should include people who disagree with you.",
    },
    capricorn: {
      glance: "Reforming old structures from the inside out",
      text: "Uranus in Capricorn belongs to your generation, born over roughly seven years, who are set on reshaping business, government and tradition. Personally, you are unusually good at changing systems from within, mixing original ideas with real practical sense. Watch out for feeling torn between playing it safe and breaking free, because you can honour the past while still building something new.",
    },
    aquarius: {
      glance: "Visionary minds born to imagine the future",
      text: "Uranus is at home in Aquarius, so you and your generation, born over about seven years, are natural innovators with a strong sense of shared humanity. Personally, you think differently, value freedom highly and often feel connected to technology and progressive causes. Watch out for feeling detached or too cool to care, because the future you dream of still needs warm, personal connection.",
    },
    pisces: {
      glance: "Dreamers reinventing art, spirit and compassion",
      text: "Uranus in Pisces is shared by everyone born over roughly seven years, a generation who blend technology with imagination and new forms of spirituality. For you, originality flows through intuition, art and compassion, and you can sense change before it happens. Watch out for drifting or escaping into fantasy when the world feels overwhelming, because your visions are most useful when grounded.",
    },
  },
  neptune: {
    aries: {
      glance: "Idealists who dream of brave new beginnings",
      text: "Neptune spends around fourteen years in each sign, so you share Neptune in Aries with a huge generation inspired by heroic, pioneering dreams. Personally, your imagination is fuelled by action, and you are drawn to fight for causes that stir your spirit. Watch out for chasing one exciting vision after another, because your ideals grow strongest when you stay with them long enough to see results.",
    },
    taurus: {
      glance: "Dreaming of beauty, nature and simple peace",
      text: "Neptune in Taurus marks a generation born over many years who idealise nature, art and the comforts of the earth. For you personally, spirituality is found through your senses, like music, gardens or a beautifully made thing. Watch out for confusing material security with happiness, because the peace you long for comes from within as much as from what you own.",
    },
    gemini: {
      glance: "Imaginative storytellers who dream through words",
      text: "Neptune in Gemini is shared by a generation born over more than a decade who dream through stories, ideas and new ways of communicating. Personally, you have a poetic, playful imagination and can find magic in language and conversation. Watch out for mixed messages or believing whatever you last heard, because your bright mind needs a little scepticism to keep fact and fantasy apart.",
    },
    cancer: {
      glance: "Longing for a perfect home and belonging",
      text: "Neptune in Cancer belongs to a generation born over many years who idealise home, family and homeland. For you personally, imagination flows through memory and feeling, and you can create a deeply soothing, nurturing atmosphere. Watch out for rose tinted nostalgia or expecting family to be perfect, because real belonging includes the messy, imperfect people you love.",
    },
    leo: {
      glance: "Romantic dreamers drawn to glamour and creativity",
      text: "Neptune in Leo is shared by a generation born over more than a decade who dreamt of romance, stardom and creative glory. Personally, you have a theatrical imagination and a big, loving heart that sees the hero in everyone. Watch out for falling in love with an image rather than a person, because the most magical romance is the one that is real.",
    },
    virgo: {
      glance: "Finding spirit in service and quiet devotion",
      text: "Neptune in Virgo marks a generation born over many years who idealised duty, health and being useful. For you personally, spirituality is found in caring for others and doing small things well, almost like a prayer. Watch out for vague worries or feeling never quite good enough, because your devotion is beautiful only when it includes kindness towards yourself.",
    },
    libra: {
      glance: "Dreaming of harmony, peace and ideal love",
      text: "Neptune in Libra is shared by a generation born over more than a decade who longed for peace, fairness and the perfect partnership. Personally, you have a refined sense of beauty and a gentle wish for everyone to get along. Watch out for idealising partners or avoiding conflict at all costs, because true harmony sometimes needs honest disagreement first.",
    },
    scorpio: {
      glance: "Drawn to mystery, depth and hidden truths",
      text: "Neptune in Scorpio belongs to a generation born over many years who were fascinated by the hidden side of life, from psychology to the occult. For you personally, imagination runs deep, and you sense what lies beneath the surface with uncanny accuracy. Watch out for being pulled into intense, secretive situations, because not every mystery needs solving to bring you peace.",
    },
    sagittarius: {
      glance: "Seekers dreaming of meaning beyond every horizon",
      text: "Neptune in Sagittarius is shared by a generation born over more than a decade who searched for truth through travel, philosophy and many faiths. Personally, you have a hopeful, wide open spirit and a hunger for meaning that keeps you exploring. Watch out for following gurus or grand promises too easily, because your own lived wisdom is often the best guide.",
    },
    capricorn: {
      glance: "Idealists who dream of building something real",
      text: "Neptune in Capricorn marks a generation born over many years who blend dreams with ambition and question how institutions really work. For you personally, imagination wants a practical shape, and you can turn ideals into lasting structures. Watch out for confusion about authority or disappointment when systems let you down, because you may be part of how they get rebuilt.",
    },
    aquarius: {
      glance: "Dreaming of a connected, more humane future",
      text: "Neptune in Aquarius belongs to a generation born over more than a decade who dream of a world joined by technology and shared ideals. Personally, you feel deeply for humanity as a whole and imagine bright, inventive futures. Watch out for losing yourself in online worlds or vague utopias, because your ideals become real through the people you actually meet.",
    },
    pisces: {
      glance: "Deeply sensitive souls with boundless imagination",
      text: "Neptune is at home in Pisces, so you and your generation, born over many years, are especially intuitive, artistic and spiritually open. Personally, you may feel everything around you, which makes you wonderfully compassionate and creative. Watch out for blurry boundaries and the urge to escape, because protecting your sensitivity with rest and solid ground helps your gifts shine.",
    },
  },
  pluto: {
    aries: {
      glance: "Raw power to start the world afresh",
      text: "Pluto stays in a sign for many years, often decades, so you share Pluto in Aries with a whole generation born to transform through bold, direct action. Personally, your deepest power lies in your will, and you can rebuild yourself from scratch with real courage. Watch out for meeting every challenge as a battle, because some changes come through softening rather than force.",
    },
    taurus: {
      glance: "Deep change in values, money and the earth",
      text: "Pluto in Taurus belongs to a generation born over many years who will reshape our relationship with resources, money and nature. Personally, your power is steady and enduring, and you transform slowly but completely. Watch out for gripping too hard onto possessions or old habits, because letting something outworn die is how you make room for richer growth.",
    },
    gemini: {
      glance: "Transforming the world through ideas and information",
      text: "Pluto in Gemini is shared by a generation born over many years whose power works through words, information and the spread of new ideas. Personally, you have a penetrating mind and can change people simply through what you say or write. Watch out for using clever words to manipulate or avoid feelings, because your truest power is honest communication.",
    },
    cancer: {
      glance: "Profound change rooted in home and family",
      text: "Pluto in Cancer marks a generation born over many years whose deepest transformations came through family, homeland and emotional security. Personally, your power lies in protecting what you love, and you may rebuild your sense of home after loss. Watch out for clinging to the past or controlling loved ones, because real emotional safety grows when you let old wounds heal.",
    },
    leo: {
      glance: "Powerful self-expression that demands to be seen",
      text: "Pluto in Leo belongs to a generation born over many years who transformed ideas about personal identity, fame and creative freedom. Personally, your power comes through your heart and your will to express who you truly are. Watch out for ego battles or needing to be in charge, because your greatest strength appears when your pride gives way to generosity.",
    },
    virgo: {
      glance: "Transforming work, health and how things function",
      text: "Pluto in Virgo is shared by a generation born over many years who reshaped work, health and technology with analytical precision. Personally, your power lies in improvement, and you can quietly transform yourself through daily habits and skilled effort. Watch out for obsessive perfectionism or anxiety about control, because some messiness is a natural part of growth and healing.",
    },
    libra: {
      glance: "Deep transformation through love and partnership",
      text: "Pluto in Libra marks a generation born over many years whose relationships became a place of profound change, from divorce reform to new ideas of equality. Personally, your power is found through partnership, and close bonds are where you transform the most. Watch out for power struggles disguised as politeness, because honest negotiation builds stronger connections than quiet resentment.",
    },
    scorpio: {
      glance: "Intense power to face darkness and rebirth",
      text: "Pluto is at home in Scorpio, so you share with a generation born over many years a fierce drive to uncover truth, face taboos and transform completely. Personally, you have extraordinary emotional strength and the ability to rise again after any loss. Watch out for jealousy or a need to control, because your deepest power comes from trusting life enough to let go.",
    },
    sagittarius: {
      glance: "Transforming beliefs, truth and global horizons",
      text: "Pluto in Sagittarius belongs to a generation born over many years who are changing religion, education and how cultures meet across the globe. Personally, your power lies in your convictions and your hunger to understand life's bigger meaning. Watch out for treating your truth as the only truth, because real wisdom stays humble and curious even when it feels certain.",
    },
    capricorn: {
      glance: "Tearing down and rebuilding society's old structures",
      text: "Pluto in Capricorn marks a generation born over many years who are watching old systems of power collapse and helping rebuild them. Personally, your strength is serious ambition and the ability to transform how things are organised. Watch out for fearing failure so much that you control everything, because what must end often clears the way for your best achievements.",
    },
    aquarius: {
      glance: "Collective power reshaping technology and society",
      text: "Pluto in Aquarius is shared by a generation born over many years who will transform society through technology, networks and shared ideals. Personally, your power lies in community and in standing up for the future you believe in. Watch out for losing yourself in the crowd or becoming rigid about your causes, because true change still honours each individual.",
    },
    pisces: {
      glance: "Transforming the world through spirit and compassion",
      text: "Pluto in Pisces belongs to a generation born over many years whose deepest changes will come through spirituality, art and collective healing. Personally, your power is subtle, flowing through intuition and compassion rather than force. Watch out for dissolving your own needs completely, because transformation through kindness works best when you remain clearly yourself.",
    },
  },
  lilith: {
    aries: {
      glance: "Untamed independence that refuses to be held back",
      text: "Lilith in Aries reveals a fierce, independent streak you will not water down for anyone. You may have been shamed for being too angry, too pushy or too much, yet reclaiming your fire gives you astonishing courage. Watch out for treating every limit as an attack, because your power is greatest when you choose your battles rather than fighting all of them.",
    },
    taurus: {
      glance: "Unapologetic pleasure, sensuality and self worth",
      text: "Lilith in Taurus is your raw love of pleasure, comfort and your own body, which you refuse to feel guilty about. You may have been made to feel greedy or wrong for wanting nice things, but reclaiming that desire grounds you powerfully. Watch out for stubbornness or possessiveness, because owning your worth does not require holding tightly to everything you enjoy.",
    },
    gemini: {
      glance: "A wild tongue and mind that won't be silenced",
      text: "Lilith in Gemini is your untamed voice, the curious, cheeky mind that says what others only think. You may have been told you talk too much or ask the wrong questions, yet speaking freely is where you reclaim real power. Watch out for using sharp words as a shield, because your truth lands best when it is honest rather than cutting.",
    },
    cancer: {
      glance: "Fierce, raw feelings you refuse to hide",
      text: "Lilith in Cancer holds your deepest emotional needs, the ones you may have been shamed for as clingy or too sensitive. Your strength is a protective, primal love that you will not shrink to make others comfortable. Watch out for swinging between needing everyone and pushing them away, because reclaiming your feelings means trusting that your needs are allowed to exist.",
    },
    leo: {
      glance: "A bold desire to be seen, unashamed",
      text: "Lilith in Leo is your wild hunger to shine, perform and be adored without apology. You may have been criticised for showing off or wanting attention, but reclaiming your spotlight brings out dazzling confidence. Watch out for fearing that you will be ignored unless you dominate the room, because your glow is real even on quiet days.",
    },
    virgo: {
      glance: "Refusing to be perfect for anyone else",
      text: "Lilith in Virgo is the raw part of you that rebels against being picked apart or made to serve. You may have felt shamed for mistakes or for your body, yet reclaiming your power means trusting your own standards, not everyone else's. Watch out for turning that old criticism on yourself, because you are allowed to be messy, human and still worthy.",
    },
    libra: {
      glance: "Refusing to keep the peace at your expense",
      text: "Lilith in Libra is your untamed refusal to be the agreeable one who always smooths things over. You may have been shamed for being difficult in relationships, but reclaiming your right to want things brings real self respect. Watch out for flipping between people pleasing and sudden defiance, because balance means your needs count as much as anyone else's.",
    },
    scorpio: {
      glance: "Deep, magnetic intensity that won't be tamed",
      text: "Lilith in Scorpio is a potent placement for raw desire, secrets and emotional depth that you will never pretend away. You may have felt shamed for being too intense or too dark, yet reclaiming this gives you a magnetic, fearless strength. Watch out for using intensity to test or control others, because your depth is most powerful when it is shared with trust.",
    },
    sagittarius: {
      glance: "Wild freedom and beliefs you won't surrender",
      text: "Lilith in Sagittarius is your untamed need for freedom, adventure and the right to believe what you choose. You may have been shamed for questioning faith or rules, but reclaiming your independent spirit makes you a bold truth teller. Watch out for running away whenever you feel fenced in, because freedom can also mean choosing to stay.",
    },
    capricorn: {
      glance: "Raw ambition that refuses to bow down",
      text: "Lilith in Capricorn is your fierce drive for authority and success on your own terms. You may have been told you were too ambitious, too cold or not allowed to lead, yet reclaiming your power makes you a formidable builder. Watch out for becoming the harsh authority you once resisted, because real strength can be firm and kind at once.",
    },
    aquarius: {
      glance: "The proud outsider who refuses to conform",
      text: "Lilith in Aquarius is your untamed weirdness, the part of you that will never fit into a neat box. You may have been rejected for being too odd or too rebellious, yet reclaiming your difference connects you with your true people. Watch out for pushing everyone away to prove you do not need them, because belonging and individuality can coexist.",
    },
    pisces: {
      glance: "Untamed imagination and a fiercely mystical soul",
      text: "Lilith in Pisces is your raw, dreamy side, full of visions, sensitivity and spiritual hunger that you refuse to deny. You may have been shamed for being too emotional or not living in the real world, yet reclaiming it unlocks deep creative power. Watch out for losing yourself to escape or rescuing others, because your magic needs firm edges to flourish.",
    },
  },
  rising: {
    aries: {
      glance: "Bold, energetic and quick to jump in",
      text: "With Aries rising, you come across as lively, direct and ready for action the moment you walk into a room. People see you as brave and refreshingly honest, and you meet new situations by diving straight in. Watch out for seeming impatient or a bit abrupt at first, because others may need a moment to warm up before they can keep pace with you.",
    },
    taurus: {
      glance: "Calm, grounded and pleasantly easy to trust",
      text: "With Taurus rising, you give a first impression of calm, warmth and quiet reliability, often with a natural sense of style. People feel relaxed around you, and you approach new situations at your own steady pace. Watch out for coming across as stubborn or slow to open up, because a little flexibility helps others see the generous heart behind your composure.",
    },
    gemini: {
      glance: "Chatty, curious and full of bright energy",
      text: "With Gemini rising, you come across as quick, friendly and endlessly curious, usually asking questions within minutes of meeting someone. People find you youthful and fun, and you adapt easily to any new crowd. Watch out for seeming scattered or hard to pin down, because others sometimes wonder which version of you is the real one until they know you better.",
    },
    cancer: {
      glance: "Gentle, caring and quietly protective at first",
      text: "With Cancer rising, you give a soft, approachable first impression, and people often sense that you will look after them. You tend to test the waters carefully in new situations, reading the mood before you open up. Watch out for retreating into your shell when you feel unsure, because your warmth is one of your best features and deserves to be seen.",
    },
    leo: {
      glance: "Warm, radiant and naturally eye catching",
      text: "With Leo rising, you make a confident, sunny first impression, and people tend to notice you as soon as you arrive. You approach new situations with generosity and a flair for drama, which makes others feel welcome. Watch out for appearing proud or attention seeking to people who do not yet know you, because your true kindness shows best when you share the stage.",
    },
    virgo: {
      glance: "Neat, thoughtful and quietly observant",
      text: "With Virgo rising, you come across as tidy, modest and sharply observant, often noticing details others overlook. People see you as helpful and sensible, and you approach new situations by quietly working out how things function. Watch out for seeming reserved or critical on first meeting, because your nerves can hide the genuinely caring person underneath.",
    },
    libra: {
      glance: "Charming, graceful and easy to get along with",
      text: "With Libra rising, you make a polished, friendly first impression, with good manners and a natural eye for beauty. People find you easy to talk to, and you handle new situations by finding common ground. Watch out for being so agreeable that people struggle to know what you really think, because your honest opinion is worth sharing too.",
    },
    scorpio: {
      glance: "Magnetic, intense and a little mysterious",
      text: "With Scorpio rising, you give a powerful, intriguing first impression, often with a steady gaze that seems to see right through people. You approach new situations cautiously, sizing up who can be trusted before revealing much. Watch out for seeming guarded or intimidating, because letting people glimpse your warmth early helps them feel safe around your intensity.",
    },
    sagittarius: {
      glance: "Cheerful, open and up for an adventure",
      text: "With Sagittarius rising, you come across as upbeat, friendly and full of enthusiasm, often with a big laugh or a funny story. People see you as easygoing and adventurous, and you treat new situations as exciting chances to explore. Watch out for being tactless or overpromising in your excitement, because your honesty is a gift when it is delivered with care.",
    },
    capricorn: {
      glance: "Composed, capable and quietly in charge",
      text: "With Capricorn rising, you give a serious, polished first impression, and people often assume you are older or more experienced than you are. You approach new situations carefully, with a clear sense of what needs doing. Watch out for seeming cool or distant at first, because your dry humour and loyalty only appear once people are given the chance to know you.",
    },
    aquarius: {
      glance: "Friendly, unusual and refreshingly original",
      text: "With Aquarius rising, you make an interesting, slightly unconventional first impression, and people sense that you march to your own beat. You approach new situations with openness and curiosity, treating everyone as an equal. Watch out for coming across as detached or aloof, because a little personal warmth helps others realise how much you genuinely care about people.",
    },
    pisces: {
      glance: "Soft, dreamy and gently easy to approach",
      text: "With Pisces rising, you give a gentle, kind and slightly otherworldly first impression, and people often feel they can confide in you straight away. You approach new situations by tuning into the atmosphere and going with the flow. Watch out for absorbing everyone's moods or seeming vague, because clear boundaries help your lovely sensitivity stay a strength.",
    },
  },
} satisfies Record<string, Record<string, Placement>>;
