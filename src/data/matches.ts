// One line for every pairing the Friends, Secret friend and Clash boxes can show, so each sign
// and each animal reads differently. Signs only pair with signs and animals with animals.
// Keys are the two ids in alphabetical order joined by "|", and each line names both, so it
// reads the same whichever of the two is yours.

/** Signs four and eight places apart: the same element. */
export const SIGN_FRIEND_LINES: Record<string, string> = {
  "aries|leo": "Aries starts the fire and Leo keeps it burning. You cheer each other on and never run out of things to try.",
  "aries|sagittarius": "Aries and Sagittarius both say yes first and ask later. Together life feels like one big adventure.",
  "leo|sagittarius": "Leo brings the warmth and Sagittarius brings the laughter. You make each other braver and bigger-hearted.",
  "taurus|virgo": "Taurus and Virgo both like things done properly. You trust each other's common sense and build calm, cosy routines.",
  "capricorn|taurus": "Taurus and Capricorn both play the long game. You value loyalty and hard work, and you build things that last.",
  "capricorn|virgo": "Virgo plans the details and Capricorn sees the bigger goal. You make a quietly unstoppable team.",
  "gemini|libra": "Gemini and Libra can talk for hours. You keep each other's minds busy and your social lives full.",
  "aquarius|gemini": "Gemini and Aquarius both love new ideas. You spark each other's curiosity and never get bored together.",
  "aquarius|libra": "Libra brings the charm and Aquarius brings the vision. You share a strong sense of fairness and a love of good company.",
  "cancer|scorpio": "Cancer and Scorpio feel things deeply and read each other without words. Trust comes easily and runs deep.",
  "cancer|pisces": "Cancer and Pisces are both gentle and caring. You make each other feel safe to dream and to feel.",
  "pisces|scorpio": "Scorpio brings strength and Pisces brings softness. You understand each other's hidden depths.",
};

/** The sign two places on: an element that completes yours. */
export const SIGN_SECRET_LINES: Record<string, string> = {
  "aries|gemini": "Gemini's quick ideas give Aries something exciting to chase, and Aries gives Gemini the push to act on them.",
  "cancer|taurus": "Taurus offers Cancer the steady ground it craves, and Cancer gives Taurus a tender heart to come home to.",
  "gemini|leo": "Gemini keeps Leo entertained and full of ideas, and Leo gives Gemini's ideas a stage.",
  "cancer|virgo": "Virgo quietly looks after Cancer's practical needs, and Cancer helps Virgo relax and feel cared for.",
  "leo|libra": "Libra adds grace and good company to Leo's warmth, and Leo gives Libra confidence to shine.",
  "scorpio|virgo": "Virgo and Scorpio both notice what others miss. Virgo brings order to Scorpio's depth, and Scorpio brings trust to Virgo's caution.",
  "libra|sagittarius": "Sagittarius brings adventure into Libra's life, and Libra adds charm and balance to Sagittarius' plans.",
  "capricorn|scorpio": "Capricorn gives Scorpio's drive a clear goal, and Scorpio gives Capricorn someone loyal to share it with.",
  "aquarius|sagittarius": "Sagittarius and Aquarius both want freedom and big ideas. You give each other room to roam and always come back.",
  "capricorn|pisces": "Capricorn helps Pisces turn dreams into something real, and Pisces softens Capricorn's serious side.",
  "aquarius|aries": "Aquarius gives Aries a cause worth fighting for, and Aries gives Aquarius the courage to go first.",
  "pisces|taurus": "Taurus gives Pisces a safe shore, and Pisces brings imagination and romance to Taurus' steady world.",
};

/** Signs directly opposite: they balance each other. */
export const SIGN_CLASH_LINES: Record<string, string> = {
  "aries|libra": "Aries wants to act now and Libra wants to weigh things up. Aries learns patience and Libra learns to decide.",
  "scorpio|taurus": "Taurus wants calm and comfort while Scorpio wants depth and intensity. Both are stubborn, so neither likes to give way first.",
  "gemini|sagittarius": "Gemini wants every detail and Sagittarius wants the big picture. You can talk past each other, but you learn a lot when you listen.",
  "cancer|capricorn": "Cancer leads with feelings and Capricorn leads with duty. Home and work can pull you apart, yet you both want security.",
  "aquarius|leo": "Leo wants to be adored and Aquarius keeps a cool distance. Leo teaches warmth and Aquarius teaches perspective.",
  "pisces|virgo": "Virgo wants order and Pisces goes with the flow. Virgo can seem critical and Pisces vague, but each fills the other's gaps.",
};

/** Animals in the same friend group, four and eight places apart. */
export const ANIMAL_FRIEND_LINES: Record<string, string> = {
  "dragon|rat": "The Rat's clever plans and the Dragon's big energy make a lucky pair. The Rat spots the chance and the Dragon goes for it.",
  "monkey|rat": "The Rat and the Monkey are both quick and witty. You solve problems together and laugh while you do it.",
  "dragon|monkey": "The Monkey's tricks and the Dragon's ambition make a bold, inventive team that loves a challenge.",
  "ox|snake": "The Ox and the Snake both think before they act. You share patience, quiet wisdom and a love of doing things right.",
  "ox|rooster": "The Ox and the Rooster are both hard workers who keep their word. You respect each other's high standards.",
  "rooster|snake": "The Snake's insight and the Rooster's eye for detail make a sharp pair. You plan well and rarely miss a thing.",
  "horse|tiger": "The Tiger and the Horse both crave freedom and excitement. You keep each other moving and never hold each other back.",
  "dog|tiger": "The Tiger and the Dog both fight for what is right. The Dog's loyalty steadies the Tiger's bold heart.",
  "dog|horse": "The Horse's warmth and the Dog's faithfulness make an honest, easy friendship built on trust.",
  "goat|rabbit": "The Rabbit and the Goat are both gentle and creative. You make a peaceful, beautiful home together.",
  "pig|rabbit": "The Rabbit and the Pig are both kind and easy-going. You bring out each other's softest, most generous side.",
  "goat|pig": "The Goat and the Pig both love comfort, kindness and good food. Yours is a warm, caring bond with no games.",
};

/** The animal's one secret friend. */
export const ANIMAL_SECRET_LINES: Record<string, string> = {
  "ox|rat": "The Rat brings quick ideas and the Ox brings the patience to see them through. The Ox makes the Rat feel safe.",
  "pig|tiger": "The Pig's easy-going heart calms the Tiger's restless one, and the Tiger protects the Pig like family.",
  "dog|rabbit": "The Dog guards the gentle Rabbit, and the Rabbit soothes the Dog's worries. A tender, loyal pair.",
  "dragon|rooster": "The Rooster's care with details keeps the Dragon's big dreams on track, and the Dragon gives the Rooster a goal worth polishing.",
  "monkey|snake": "The Snake's deep wisdom and the Monkey's quick wit make a clever, private alliance. You get each other's jokes.",
  "goat|horse": "The Goat gives the restless Horse a place to rest, and the Horse gives the Goat courage and fresh air.",
};

/** Animals directly opposite each other. */
export const ANIMAL_CLASH_LINES: Record<string, string> = {
  "horse|rat": "The Rat plans carefully and the Horse runs on instinct. The Rat can feel rushed and the Horse can feel boxed in.",
  "goat|ox": "The Ox wants hard work and routine while the Goat wants beauty and freedom. Each finds the other hard to read.",
  "monkey|tiger": "The Tiger charges in and the Monkey plays tricks. Both want to be in charge, so rivalry comes easily.",
  "rabbit|rooster": "The Rooster speaks bluntly and the gentle Rabbit takes it to heart. Kind words go a long way here.",
  "dog|dragon": "The Dragon dreams big and the Dog asks hard questions. The Dog's caution can feel like doubt to the proud Dragon.",
  "pig|snake": "The Pig trusts openly and the Snake keeps its secrets. The Pig can feel shut out and the Snake can feel exposed.",
};

/** The key for a pairing: both ids in alphabetical order. */
export const matchKey = (a: string, b: string) => [a, b].sort().join("|");
