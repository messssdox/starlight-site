// Everyday pictures for each placement, so a reading is easier to see and remember: "a Taurus
// Moon is the friend who remembers your coffee order". Each planet has its own pictures in each
// sign (a Taurus Moon and a Taurus Venus read differently), and each animal, Life Path and
// Chinese year element has a few of its own. The spotlights pick one by birth date.
//
// Every picture is a noun phrase that reads after "is" and after "like":
//   "your Taurus Moon is the friend who remembers your coffee order"
//   "like a tractor in low gear"

import type { SignId } from "./astrology.ts";
import type { Element as ChineseElement } from "./zodiac.ts";

export type ImagePlanet = "sun" | "moon" | "mercury" | "venus" | "mars";

export const PLANET_IMAGE: Record<ImagePlanet, Record<SignId, string[]>> = {
  // who you are: the self everyone sees
  sun: {
    aries: ["the first match struck on a cold night", "the friend who says \"let's just go\" and is already in the car", "the alarm clock that gets the whole house moving", "a starting whistle that nobody can ignore"],
    taurus: ["the oak in the garden, not the weather vane", "a slow-cooked Sunday roast that is worth the wait", "the sofa everyone ends up sinking into", "a pair of well-worn boots that never let anyone down"],
    gemini: ["a radio that picks up every station", "the group chat that never goes quiet", "a browser with forty tabs open, all of them interesting", "a pocketful of bright, mismatched coins"],
    cancer: ["the kitchen light left on for whoever comes home late", "a crab's shell with a soft heart inside", "the friend who keeps every birthday card", "a biscuit tin that is somehow never empty"],
    leo: ["the sun breaking through on a grey afternoon", "the friend who starts the dancing at a wedding", "a birthday candle that refuses to blow out", "the headline act who stays behind to sign autographs"],
    virgo: ["the person who actually reads the instructions", "a toolbox where every spanner has its place", "the editor who catches the typo before it goes to print", "an allotment weeded every single morning"],
    libra: ["a perfectly laid dinner table", "the friend who makes sure everyone gets a slice of cake", "a set of scales that always finds the middle", "the playlist that somehow suits everyone in the car"],
    scorpio: ["a deep lake, calm on top and miles down underneath", "the friend who remembers what was really said", "a locked diary with a very good key", "the detective who notices the one muddy footprint"],
    sagittarius: ["a packed rucksack by the front door", "the friend with a plane ticket and a big grin", "an open road with no speed signs", "the one who turns a wrong turn into the best bit of the trip"],
    capricorn: ["a mountain goat on a steep path, sure of every step", "a five-year plan written in pen, not pencil", "a dry-stone wall that will outlast everyone", "the friend who brings a spare umbrella, just in case"],
    aquarius: ["the odd sock that turns out to be the fashion", "a flash of an idea at three in the morning", "a satellite: a little apart, but seeing the whole map", "the friend who sees the future first and is cheerful about it"],
    pisces: ["a sea mist rolling in over the harbour", "a sketchbook full of half-remembered dreams", "the friend who cries at adverts and means it", "a lighthouse that somehow knows which boat is lost"],
  },
  // what you feel and need: the private self
  moon: {
    aries: ["the friend who wants to fix it today, not next week", "a smoke alarm: loud for a minute, then completely fine", "a summer storm that clears the air", "the one who needs a brisk walk before a big talk"],
    taurus: ["the friend who remembers your coffee order", "a weighted blanket on a cold evening", "a favourite mug that always comes out first", "the same cosy café and the same corner table, every week"],
    gemini: ["the friend who texts late at night to talk a feeling through", "a voice note that starts \"so, the thing is\"", "a diary written as a running conversation", "someone who thinks out loud until it all makes sense"],
    cancer: ["a home-cooked meal left in the fridge with a note", "the friend who still has the old photos", "a shell to curl up in after a long day", "the grandparent who always has the kettle on"],
    leo: ["a heart that glows when someone says \"I'm proud of you\"", "the friend who secretly loves a surprise party", "a stage light waiting for its cue", "a cat stretched out in the one sunny patch on the floor"],
    virgo: ["the friend who calms down by tidying the kitchen", "a neatly written to-do list on a hard day", "someone who shows love by fixing the wobbly shelf", "a first-aid kit, checked and restocked"],
    libra: ["the friend who lights a candle before a hard conversation", "a calm room with the cushions just right", "someone who needs everyone to be okay before they can relax", "soft music playing under a busy day"],
    scorpio: ["a locked box that opens for very few keys", "the friend who knows when \"fine\" does not mean fine", "deep water, still on top with strong currents underneath", "a candle burning steadily in a dark room"],
    sagittarius: ["an open window on a stuffy day", "the friend who cures a sad mood with a road trip", "a ticket to anywhere tucked in a back pocket", "someone who laughs hardest straight after crying"],
    capricorn: ["the friend who does the washing-up at your party before anyone asks", "a sturdy coat that keeps its warmth on the inside", "a lock that only opens for people who have earned the key", "someone who sleeps best with the bills paid and a plan made"],
    aquarius: ["the friend who gives space, and somehow it feels like a hug", "a clear night sky: cool, wide and full of stars", "someone who has to think a feeling through before saying it", "an open door that is never forced"],
    pisces: ["a sponge for every mood in the room", "the friend who knows what is wrong before a word is said", "a rock pool full of hidden life", "a lullaby humming quietly in the background"],
  },
  // how you think and talk
  mercury: {
    aries: ["a text sent before the thought is finished", "a sports commentator calling it live", "a first draft written in one go"],
    taurus: ["a notebook that never loses a page", "a cast-iron pan: slow to heat, and holds it for ages", "a slow-loading page that always gets there in the end"],
    gemini: ["a radio flicking through stations", "a quiz-night champion", "a busy café full of chatter"],
    cancer: ["a scrapbook of every conversation that mattered", "a memory for how things felt, not just what was said", "a voice that softens when the subject does"],
    leo: ["a storyteller holding the room round a campfire", "a wedding speech that gets a standing ovation", "a big, warm voice made for toasts"],
    virgo: ["a spreadsheet with tidy columns", "a red pen that is kind but precise", "a recipe followed to the gram"],
    libra: ["a debate where both sides feel heard", "a diplomat's careful sentence", "a pros-and-cons list that keeps growing"],
    scorpio: ["a detective's notebook", "X-ray vision for hidden meanings", "one quiet question that gets the real answer"],
    sagittarius: ["a lecture that turns into a pub debate", "a map with big arrows and very few details", "an arrow that hits the truth, bluntly"],
    capricorn: ["a business plan with a timeline", "a few well-chosen words at a board meeting", "a chess player thinking five moves ahead"],
    aquarius: ["an inventor's sketch on a napkin", "a group chat full of odd but brilliant links", "a radio tuned to a different wavelength"],
    pisces: ["a poem written on a steamy window", "a mind that thinks in pictures and songs", "a daydream that turns out to be right"],
  },
  // how you love and what you enjoy
  venus: {
    aries: ["a surprise weekend away booked on a whim", "a flirt that feels like a dare", "the first one on the dance floor"],
    taurus: ["a candlelit dinner cooked from scratch", "a hand held all the way through the film", "a gift chosen months in advance"],
    gemini: ["a love letter written in jokes", "a first date that turns into six hours of talking", "a playlist that says what words can't"],
    cancer: ["a pot of soup made when someone is poorly", "a photo album of every anniversary", "a spare key on a ribbon"],
    leo: ["a bunch of flowers delivered to the office", "a grand gesture under fairy lights", "a toast that makes someone blush"],
    virgo: ["a packed lunch with a note tucked inside", "the car serviced without being asked", "a favourite snack that is always in the cupboard"],
    libra: ["a picnic laid out just so", "a love song shared on one pair of earphones", "a table for two by the window"],
    scorpio: ["a secret only two people know", "a look across a crowded room", "a promise kept to the letter"],
    sagittarius: ["a last-minute trip with one bag between two", "a love that feels like a road trip", "a shared laugh on the top deck of a bus"],
    capricorn: ["a savings jar for a shared future", "a promise made slowly and kept for life", "an anniversary planned a year ahead"],
    aquarius: ["a friendship that quietly became love", "an unusual gift that is exactly right", "a love with plenty of breathing room"],
    pisces: ["a mixtape full of feelings", "a love story straight out of a film", "a note left on the pillow"],
  },
  // how you go after things
  mars: {
    aries: ["a struck match", "a sprinter off the blocks", "a battering ram with a good heart"],
    taurus: ["a tractor in low gear: slow to start and impossible to stop", "a bulldog with a bone", "a marathon runner who never checks the clock"],
    gemini: ["a juggler with five balls in the air", "a fox that finds three ways round a fence", "a quick-fire text exchange that gets things done"],
    cancer: ["a crab that goes sideways but never lets go", "a mother bear guarding the den", "a tide that keeps coming back"],
    leo: ["a captain leading from the front", "a lion who wants the win and the applause", "a spotlight that finds the goal"],
    virgo: ["a craftsperson sanding by hand until it is perfect", "a checklist ticked off one line at a time", "a mechanic who will not leave until it runs"],
    libra: ["a diplomat winning over the room", "a dancer who leads gently", "a team captain who makes sure everyone gets a turn"],
    scorpio: ["a submarine running silent and deep", "a chess player who never forgets a move", "a slow-burning fuse"],
    sagittarius: ["an archer aiming at the far horizon", "a wild horse heading for open country", "a runner who spots a new race halfway through"],
    capricorn: ["a climber with a rope and a plan", "a steam engine that builds up speed", "a builder laying one brick at a time"],
    aquarius: ["a rebel with a clipboard", "an inventor who refuses to do it the usual way", "a wind that changes direction without warning"],
    pisces: ["a river finding its way round the rocks", "a dancer following the music", "a current that moves things without being seen"],
  },
};

export const ANIMAL_IMAGE: Record<string, string[]> = {
  rat: ["the person who finds the last parking space", "a pocket full of plans B, C and D", "the friend who knows a shortcut through every town", "the one who spots the bargain before the sale starts"],
  ox: ["the friend with jump leads in the boot", "a plough turning one steady row at a time", "the one still working when the lights go out", "an old stone bridge that carries everyone over"],
  tiger: ["the friend who stands up for the new kid", "a striped coat in a grey crowd", "the one who takes the dare and wins", "a roar that clears the room of nonsense"],
  rabbit: ["a soft blanket on a quiet Sunday", "the friend who smooths things over at family dinners", "a quiet garden at dawn", "the one who notices when someone is left out"],
  dragon: ["a firework display over a sleepy town", "the friend whose big idea becomes everyone's weekend", "a kite pulling hard on its string", "the one who walks in and changes the room"],
  snake: ["a calm cup of tea in the middle of a storm", "the friend who says one sentence and it is the right one", "a still pond that reflects everything", "the one who sees the trick before the magician has finished"],
  horse: ["a gust of wind through an open door", "the friend who is always halfway out of the door to somewhere fun", "a gallop along an empty beach", "the one with muddy trainers and a big grin"],
  goat: ["a sketchbook left open on the table", "the friend who makes a rented flat feel like home", "a soft jumper knitted by hand", "the one who cries at the beautiful bits of films"],
  monkey: ["the friend who fixes the telly with a paperclip", "a box of tricks that never runs out", "the one who makes a dull meeting fun without anyone noticing", "a puzzle solved before the instructions are opened"],
  rooster: ["the alarm clock that is never wrong", "a perfectly ironed shirt", "the friend who tells you there is spinach in your teeth", "the one who arrives early and already knows the plan"],
  dog: ["the friend who picks up at 2am, no questions asked", "a porch light that never goes off", "the one who remembers who was kind and who was not", "a loyal face at the door when you come home"],
  pig: ["the friend who always brings pudding", "a host with an open fridge and an open door", "a warm kitchen where nobody leaves hungry", "the one who forgives first and laughs the most"],
};

export const LIFE_PATH_IMAGE: Record<number, string[]> = {
  1: ["the first footprint in fresh snow", "the person who cuts the ribbon", "a compass needle that points its own way"],
  2: ["the glue that holds a group together", "a hand on the shoulder at just the right moment", "a bridge between two riverbanks"],
  3: ["a box of crayons with every colour in it", "the person who gets the whole table laughing", "a song that gets stuck in everyone's head"],
  4: ["the foundations under a house", "a well-kept toolbox", "a brick wall laid by hand, straight and true"],
  5: ["a suitcase that never gets fully unpacked", "a window seat on a train to somewhere new", "the first swim of the summer"],
  6: ["a kitchen table where everyone gathers", "the person who remembers everyone's birthday", "a garden tended with love"],
  7: ["a lamp left on in a library", "a deep well of quiet questions", "a telescope pointed at the big questions"],
  8: ["the captain's chair", "a well-run engine room", "a harvest that comes from years of planting"],
  9: ["an open door for anyone who needs it", "a lighthouse for a whole stretch of coast", "the last chapter that makes sense of the whole book"],
  11: ["a radio tuned to frequencies others miss", "a spark that lights up a dark room", "a tuning fork that hums when something is true"],
  22: ["an architect's plan for a whole city", "a bridge that thousands will cross", "the blueprint and the builder in one"],
  33: ["a healer's warm hands", "the teacher everyone remembers", "a kindness that ripples out for years"],
};

/** The Chinese year elements as things you can picture. */
export const YEAR_ELEMENT_IMAGE: Record<ChineseElement, string[]> = {
  Wood: ["a young tree", "a climbing vine", "a hedge in spring"],
  Fire: ["a lantern", "a hearth fire", "a summer bonfire"],
  Earth: ["a field of good soil", "a stone hearth", "a hillside"],
  Metal: ["a sharpened blade", "a church bell", "a silver ring"],
  Water: ["a river", "a deep well", "rain on a window"],
};

/**
 * Everyday moments: what someone with this placement is likely doing, as an "-ing" phrase with
 * no "you", "they" or names in it, so it reads for either person:
 *   "On a free evening you're probably {evening}."
 *   "You're {evening} while Sam is {evening}."
 * evening goes with the Sun, upset with the Moon, chat with Mercury, treat with Venus, task with Mars.
 */
export type SceneKind = "evening" | "upset" | "chat" | "treat" | "task";

export const SCENES: Record<SceneKind, Record<SignId, string[]>> = {
  evening: {
    aries: ["booking a last-minute padel court", "halfway through a workout video at full volume", "talking everyone into a spontaneous night out", "racing a friend at go-karting and demanding a rematch", "at a spin class booked twenty minutes ago", "trying a new hot sauce and regretting nothing"],
    taurus: ["on the sofa with a takeaway and a blanket", "cooking something slow that makes the whole flat smell amazing", "rewatching a comfort series for the fourth time", "in the garden with a cold drink, refusing to check the phone", "at a favourite restaurant, ordering the usual", "baking bread and refusing to rush the rise"],
    gemini: ["watching something while scrolling the phone and texting two people", "deep in a YouTube rabbit hole about something random", "on a video call that was meant to last five minutes", "flicking between four shows without finishing any of them", "at a quiz night, knowing a bit about everything", "learning a TikTok dance while on the phone to a friend"],
    cancer: ["cooking a proper dinner and sending family a photo of it", "turning the living room into a cosy nest with the candles on", "scrolling old photos and getting a bit nostalgic", "on the phone to family with the kettle just boiled", "hosting a cosy dinner for the people who matter", "watching an old family video and getting misty-eyed"],
    leo: ["getting ready for a night out that wasn't even planned yet", "hosting friends and taking charge of the music", "trying on outfits for something three weeks away", "singing along to a musical a little too loudly", "at karaoke, already holding the microphone", "planning an outfit for a party that is weeks away"],
    virgo: ["reorganising the kitchen cupboards with a podcast on", "finishing the to-do list before allowing a single episode of anything", "meal-prepping the week in labelled tubs", "reading the reviews of a film before agreeing to watch it", "fixing a dripping tap with a YouTube tutorial", "doing a jigsaw with every edge piece sorted first"],
    libra: ["trying a new restaurant that had great reviews", "making a playlist for a friend's birthday", "rearranging the living room until it finally looks right", "at a gallery or a candlelit bar with a good friend", "styling the shelves for the third time this month", "at a wine-tasting, comparing notes politely"],
    scorpio: ["three episodes deep into a true-crime documentary", "having a long, honest talk with one close friend", "reading a book nobody else has heard of", "researching something fascinating until 1am", "deep in a murder-mystery podcast with the lights off", "in a long, late conversation that gets very real"],
    sagittarius: ["browsing flights to somewhere new", "at a pub quiz arguing about an answer", "planning next summer's trip in a shared note", "learning a few words of a new language on an app", "at a comedy club, heckling a little", "watching a travel vlog and opening a new tab for flights"],
    capricorn: ["answering one last work email before switching off", "updating the budget spreadsheet with a cup of tea", "at the gym while everyone else is at the pub", "watching a documentary about how something was built", "batch-cooking with a podcast about money on", "reorganising the calendar for the month ahead"],
    aquarius: ["in a niche online forum about something fascinating", "at a gig for a band nobody else knows", "taking something apart to see how it works", "starting a debate about the future over a pint", "at a talk about space or the future", "rewiring something that technically wasn't broken"],
    pisces: ["listening to music with headphones on and the lights low", "watching a film that ends in happy tears", "doodling or writing something with no plan at all", "having a long bath with a playlist that fits the mood", "painting with no plan and the music up", "rewatching a favourite romantic film for the tenth time"],
  },
  upset: {
    aries: ["going for a hard run to burn it off", "venting in a quick voice note and feeling better straight after", "slamming a cupboard, then laughing about it five minutes later", "hitting the gym and coming back a different person", "blasting loud music in the car on the way home", "picking a fight with the washing-up instead of the person"],
    taurus: ["ordering a favourite takeaway and not talking until it arrives", "getting under a blanket with a familiar film", "running a long bath with the phone on silent", "pottering in the garden until the world feels slower", "eating the good biscuits straight from the packet", "going to bed early and waking up a new person"],
    gemini: ["texting three friends to talk it through from every angle", "ranting it all out on a phone call", "distracting the mind with a podcast and a long scroll", "writing it all down in the notes app to make sense of it", "starting three new hobbies in one evening", "making jokes about it until it feels smaller"],
    cancer: ["phoning home and staying on the line for ages", "baking something, because feeding people helps", "going quiet in a comfy jumper until someone asks the right question", "curling up with a hot water bottle and an old favourite film", "rewatching a childhood film under a duvet", "needing a long hug before any talking"],
    leo: ["needing a hug and some loyal outrage from a friend", "putting on something great and going out anyway", "telling the whole story, with feeling, to someone who will listen", "booking a treat because a hard day deserves one", "needing to be told it will all be fine, more than once", "dressing up for no reason, just to feel good again"],
    virgo: ["cleaning the whole kitchen until things feel under control", "writing a list of what went wrong and how to fix it", "sorting one small practical job to feel useful again", "going over the day in detail, looking for the mistake", "reorganising a drawer that was already tidy", "researching the problem until 1am"],
    libra: ["asking a friend \"was I being unreasonable?\"", "making the room calm and pretty before facing anything", "smoothing things over on the surface while still stewing underneath", "putting on soft music and lighting a candle", "treating themselves to something pretty", "talking it over with the one friend who always sees both sides"],
    scorpio: ["going quiet and thinking it all through alone", "telling one trusted person the whole truth", "replaying the conversation late into the night", "taking a long drive with the music up", "deleting the text drafts, one by one", "going to the gym and saying nothing to anyone"],
    sagittarius: ["making a joke about it straight away", "going for a long walk somewhere new", "planning a trip to have something to look forward to", "getting philosophical about it over a drink", "booking a cheap flight on a whim", "heading out to see friends rather than staying in"],
    capricorn: ["cracking on with work and dealing with feelings later", "making a plan so it never happens again", "saying \"I'm fine\" and quietly sorting it", "tidying up the finances because at least that is in control", "staying late at work where things make sense", "writing a five-point plan in the notes app"],
    aquarius: ["needing a bit of space before talking about it", "working out what happened like a puzzle", "going online to find people who get it", "throwing energy into a cause or a project instead", "headphones on and the world shut out for a bit", "fixing someone else's problem instead"],
    pisces: ["having a good cry to a sad playlist", "sinking into a film to forget about it", "soaking up everyone else's mood without meaning to", "going for a walk by the water to clear the head", "writing a sad poem in the notes app", "sleeping it off and dreaming it better"],
  },
  chat: {
    aries: ["sending one-word replies that are not meant to be rude", "calling instead of texting because it's quicker", "replying before finishing reading the message", "typing in capitals when excited", "voice-noting from the gym", "answering a question with another question, fast"],
    taurus: ["taking a while to reply, but meaning every word", "sending a thumbs up that says a lot", "saving the real talk for face to face", "replying hours later with exactly the right answer", "sending a photo of dinner instead of words", "replying to the important bit and ignoring the rest"],
    gemini: ["sending five messages in a row and a meme", "keeping three conversations going at once", "sending voice notes longer than a podcast", "changing the subject four times in one chat", "replying to a message from three days ago with a brand-new topic", "sending a screenshot with no context at all"],
    cancer: ["asking about the thing mentioned weeks ago", "sending a \"thinking of you\" out of nowhere", "reading the tone of every message very carefully", "keeping screenshots of the lovely messages", "remembering birthdays without a reminder", "checking in on the friend who went quiet"],
    leo: ["telling stories with plenty of exclamation marks", "sending the photo first and the story after", "hyping friends up in the group chat", "turning a simple update into a great anecdote", "sending a selfie with the news", "giving everyone in the chat a nickname"],
    virgo: ["spotting the typo before pressing send", "replying with a numbered list", "sending the link to exactly the thing that was needed", "double-checking the plan the night before", "correcting the date of the plan, kindly", "sending a link to the menu before everyone arrives"],
    libra: ["rewriting a message three times so it sounds kind", "adding an emoji to soften it", "asking what everyone else thinks before deciding", "replying to everyone in the group so nobody feels left out", "sending a poll so everyone gets a say", "being the peacemaker when the chat gets tense"],
    scorpio: ["reading between the lines of every message", "leaving a message on read while thinking it over", "asking the one question nobody else dared to", "saying very little and noticing everything", "sending one very honest message at midnight", "remembering exactly what was said last time"],
    sagittarius: ["sending a blunt opinion with a laughing face", "starting a debate in the group chat", "sharing a fascinating article at midnight", "telling the truth first and the softer version later", "sending travel photos to people still at work", "replying \"haha true\" then a whole essay"],
    capricorn: ["replying with the plan, the time and the place", "keeping messages short and to the point", "setting a reminder and actually turning up", "saving the jokes for old friends", "putting the plan in the calendar invite", "replying with a thumbs up and a deadline"],
    aquarius: ["sending the weirdest link of the week", "debating ideas just for fun", "going quiet for days, then replying as if no time has passed", "asking \"but why?\" about everything", "starting a group chat about a cause", "replying with a theory nobody asked for"],
    pisces: ["sending a song instead of explaining a feeling", "replying with a long, heartfelt paragraph", "forgetting to reply because the thought drifted off", "using exactly the right emoji for a mood", "sending a voice note that turns into a story", "sending the perfect gif at exactly the right moment"],
  },
  treat: {
    aries: ["booking a surprise day out at the last minute", "issuing a challenge with a silly prize", "turning up with tickets to something exciting", "planning a first-time-ever experience together", "challenging a friend to a race up a hill", "booking front-row tickets on impulse"],
    taurus: ["cooking a favourite meal from scratch", "buying the good chocolate, not the cheap one", "planning a slow, cosy evening in", "giving a gift that will last for years", "booking a massage as a surprise", "making breakfast in bed with proper coffee"],
    gemini: ["sending a meme about the exact thing mentioned last week", "booking a comedy night", "starting a conversation that lasts until 2am", "recommending the perfect book or podcast", "writing a silly poem for a birthday card", "planning a surprise quiz about shared memories"],
    cancer: ["dropping round soup at the first sniffle", "framing a photo of a special day", "keeping a drawer of little things that mean something", "making a care package for a hard week", "baking a favourite cake from scratch", "making a photo book of a year together"],
    leo: ["throwing a surprise birthday party", "posting a proud shout-out online", "booking the nice table and dressing up", "bragging about loved ones to anyone who'll listen", "making a big toast at a dinner party", "buying the most dramatic bunch of flowers in the shop"],
    virgo: ["remembering exactly how everyone takes their tea", "fixing the thing that has been broken for months", "making a playlist in exactly the right order", "quietly doing the boring errand nobody wanted", "booking the appointment that keeps getting put off", "tidying up the spare room for a visitor"],
    libra: ["planning a pretty picnic", "buying flowers just because", "booking a weekend somewhere beautiful", "setting the table properly for an ordinary Tuesday", "planning a perfect date with a dress code", "picking a gift that is wrapped beautifully"],
    scorpio: ["remembering a small secret and acting on it", "writing a heartfelt message nobody else sees", "giving undivided attention with the phone face down", "turning up at exactly the moment it matters", "planning a surprise only one person would understand", "staying up late for a proper heart-to-heart"],
    sagittarius: ["planning a spontaneous road trip", "sending a postcard from somewhere far away", "turning a normal Tuesday into an adventure", "booking a class to learn something new together", "booking a surprise mystery trip", "taking someone to try a brand-new food"],
    capricorn: ["remembering the anniversary and planning ahead", "helping with a CV or a big decision", "investing in something that will last", "turning up, every time, exactly when promised", "setting up a savings pot for a shared trip", "booking a table months ahead at a special restaurant"],
    aquarius: ["giving a gift nobody else would think of", "sending an invite to an odd but brilliant event", "giving space when space is what is needed", "sharing a new idea and wanting to hear the other side", "building a custom playlist with a hidden theme", "signing up for a quirky class together"],
    pisces: ["writing a little poem or a heartfelt card", "making a playlist that tells a story", "noticing a bad day and bringing a treat without being asked", "suggesting a film that says exactly what words couldn't", "painting or drawing something as a gift", "leaving little notes in coat pockets"],
  },
  task: {
    aries: ["building the flat-pack wardrobe without the instructions", "booking the holiday before checking the dates", "starting three DIY jobs on the same Saturday", "racing to finish first even when it isn't a race", "going first and asking questions later", "tackling the hardest bit before breakfast"],
    taurus: ["doing the flat-pack slowly and properly, once", "comparing prices for weeks before buying", "finishing the job long after everyone else gave up", "refusing to be rushed, and getting it right", "buying the best tools so the job lasts", "working through it steadily with a cup of tea at the ready"],
    gemini: ["reading reviews, asking friends and changing the plan twice", "doing two jobs at once and chatting through both", "finding a clever shortcut halfway through", "outsourcing the boring bits with a charming message", "doing it while on the phone to a friend", "watching three tutorials and mixing the best bits"],
    cancer: ["sorting the house first so everyone is comfortable", "doing it for the family first", "quietly getting the job done once nobody is watching", "packing snacks and plasters for everyone on the trip", "making sure everyone has eaten before starting", "turning the job into a family project"],
    leo: ["taking charge of the group holiday and loving it", "doing the job brilliantly and hoping it gets noticed", "turning a chore into a bit of a show", "rallying everyone with a pep talk", "sharing a before-and-after photo of the finished job", "taking charge and giving everyone a role"],
    virgo: ["reading the whole manual and laying out every screw", "fixing what someone else did \"nearly right\"", "making a checklist for the checklist", "colour-coding the holiday itinerary", "checking the measurements three times", "cleaning up as they go"],
    libra: ["getting someone to help so it's more fun", "choosing the perfect paint colour for weeks", "making sure everyone agrees before anything starts", "negotiating a better deal with a friendly smile", "making the finished job look beautiful", "turning it into a team effort with snacks"],
    scorpio: ["researching every option in secret, then deciding in one go", "refusing to quit until it is completely done", "quietly taking over the part that matters most", "noticing the catch in the small print", "working late until it is exactly right", "fixing the thing nobody else could"],
    sagittarius: ["booking the trip and sorting the details on the plane", "aiming big and improvising the rest", "turning the boring job into a challenge", "saying yes first and working out how later", "skipping the boring bit and coming back to it later", "turning a chore into an adventure"],
    capricorn: ["planning the job with a timeline and a budget", "getting up early to get it done", "doing it properly so it never needs doing again", "keeping the receipts in a labelled folder", "delegating the parts that someone else can do", "tracking progress in a spreadsheet"],
    aquarius: ["ignoring the manual and inventing a better way", "doing it at 2am because that's when inspiration hit", "getting the group to try something nobody has done before", "building a gadget to do the job instead", "finding an app that does half of it", "asking why it's done that way at all"],
    pisces: ["starting the job with music on and following the mood", "getting distracted and painting a mural instead", "doing it beautifully but not quite on time", "asking the universe for a sign before deciding", "going with gut feeling instead of the plan", "adding a creative twist nobody asked for"],
  },
};
