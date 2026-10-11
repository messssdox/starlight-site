import { test } from "node:test";
import assert from "node:assert/strict";
import { spotlight, type SpotlightTier } from "../src/lib/spotlight.ts";
import { pairSpotlight, type PairSpotlightText } from "../src/lib/pair-spotlight.ts";
import { pairReading } from "../src/lib/pair-reading.ts";
import { personalSigns } from "../src/lib/synastry.ts";
import { compare } from "../src/lib/compat.ts";
import { KINDS } from "../src/data/relationships.ts";
import { SIGN_SPOT, LIFE_PATH_SPOT } from "../src/data/spotlight.ts";
import type { Tone } from "../src/data/synastry.ts";

// The user's writing rules for the spotlights and the Dos and Don'ts: formal but friendly, no
// sayings, gimmicky lines, clichés or flattery, no padding or repeated points, astrology terms
// explained the first time they appear, every section opening on a detail of the person, at least
// one real challenge in each reading, and not every paragraph starting with "You" or "Your".
// These tests read many random people and pairs and fail on any line that breaks a rule.

function rng(seed: number) {
  return () => ((seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0) / 2 ** 32);
}
const rand = rng(1112026);
const randomDate = () => {
  const t = Date.UTC(1945, 0, 1) + Math.floor(rand() * (Date.UTC(2012, 0, 1) - Date.UTC(1945, 0, 1)));
  return new Date(t).toISOString().slice(0, 10);
};
const TIERS: SpotlightTier[] = ["glance", "first", "deep"];
const solo = (d: string, tier: SpotlightTier) => spotlight({ date: d, tier, year: 2026, signs: personalSigns(d, "", "Europe/London") });
const KINDS_BY_TONE: [string, Tone][] = [["love", "love"], ["friend", "friends"], ["parent", "family"], ["colleague", "work"]];
function pair(d1: string, d2: string, kind: number): PairSpotlightText {
  const [kindId, tone] = KINDS_BY_TONE[kind];
  const seed = `${d1}|${d2}|${kindId}`;
  const mine = personalSigns(d1, "", "UTC"), theirs = personalSigns(d2, "", "UTC"), c = compare(d1, d2, 2026);
  const pr = pairReading({ seed, dates: [d1, d2], tone, mine, theirs, c, them: "Sam", kind: KINDS[kindId as keyof typeof KINDS] });
  return pairSpotlight({ seed, tone, mine, theirs, c, them: "Sam", startStop: pr.startStop });
}

const sentences = (t: string) => t.split(/(?<=[.!?])\s+/).map((s) => s.trim()).filter(Boolean);

const N = 400;
// sections are the headed paragraphs, which open on a detail of the person; the rest is the closing line and the Dos and Don'ts
const readings: { name: string; sections: string[]; rest: string[] }[] = [];
for (let i = 0; i < N; i++) {
  const d = randomDate();
  for (const tier of TIERS) {
    const s = solo(d, tier);
    readings.push({ name: `${tier} for ${d}`, sections: s.sections.map((x) => x.text), rest: [s.closing].filter(Boolean) });
  }
  const d2 = randomDate();
  const p = pair(d, d2, i % 4);
  readings.push({ name: `pair ${d} + ${d2}`, sections: p.sections.map((x) => x.text), rest: [p.closing, p.doDont.me.do, p.doDont.me.dont, p.doDont.them.do, p.doDont.them.dont] });
}
const all = (r: (typeof readings)[number]) => [...r.sections, ...r.rest];

/** Clichés, AI tropes, sayings, flattery and the everyday-example gimmicks the user turned down. */
const BANNED: RegExp[] = [
  /\bjourney\b/i, /\bdeep down\b/i, /\btruly\b/i, /\bthink of (it|your|yours)\b/i, /\bpicture\b/i, /\bimagine\b/i,
  /\blike an? \b/i, /\bas if\b/i, /\bsuperpowers?\b/i, /\bwhole chest\b/i, /\bthrough and through\b/i, /\bto the bone\b/i,
  /\bat the end of the day\b/i, /\bsomething (deep )?inside\b/i, /\bmagic(al)?\b/i, /\bsoul\b/i, /\bvibes?\b/i, /\btapestry\b/i,
  /\bunlock\b/i, /\bembrace\b/i, /\bresonates?\b/i, /\bspecial\b/i, /\bamazing\b/i, /\bwonderful(ly)?\b/i, /\bincredible\b/i,
  /\bperfect\b/i, /\blovely\b/i, /\bsparkl/i, /\bbuckle up\b/i, /\bgame.changer\b/i, /\bnavigat/i, /\bunique blend\b/i,
  /\bnetflix\b/i, /\bgroup chat\b/i, /\bkettle\b/i, /\bcuppa\b/i, /\bsofa\b/i, /\btakeaway\b/i, /\bscroll/i, /\bplaylist\b/i,
  /\bhalf the battle\b/i, /\blove letter\b/i, /\bat the drop of\b/i, /\bwear your heart\b/i, /\bheart of gold\b/i,
  /\bpartner in crime\b/i, /\bnative language\b/i, /\bthe secret sauce\b/i, /\bcherry on\b/i, /\bwhen push comes\b/i,
];
const MAX_WORDS = 45;
/** Collects every breach, so a failure lists them all rather than the first. */
function breaches(name: string, check: (bad: string[]) => void) {
  const bad: string[] = [];
  check(bad);
  const unique = [...new Set(bad)];
  assert.deepEqual(unique.slice(0, 20), [], `${name}: ${unique.length} breaches`);
}
const DETAIL = /\b(Aries|Taurus|Gemini|Cancer|Leo|Virgo|Libra|Scorpio|Sagittarius|Capricorn|Aquarius|Pisces|Rat|Ox|Tiger|Rabbit|Dragon|Snake|Horse|Goat|Monkey|Rooster|Dog|Pig|Fire|Earth|Air|Water|Wood|Metal|Life Paths?|\d+)s?\b/;
const NAME = /\b(Aries|Taurus|Gemini|Cancer|Leo|Virgo|Libra|Scorpio|Sagittarius|Capricorn|Aquarius|Pisces|Rat|Ox|Tiger|Rabbit|Dragon|Snake|Horse|Goat|Monkey|Rooster|Dog|Pig|Fire|Earth|Air|Water|Wood|Metal|Sam)('s)?\b/g;

test("no clichés, sayings, flattery or everyday-example gimmicks", () => breaches("banned phrases", (bad) => {
  for (const r of readings) {
    for (const s of all(r).flatMap(sentences)) {
      for (const b of BANNED) if (b.test(s)) bad.push(`${b.source}: ${s}`);
    }
  }
}));

test("no padded sentences", () => breaches("long sentences", (bad) => {
  for (const r of readings) {
    for (const s of all(r).flatMap(sentences)) if (s.split(/\s+/).length > MAX_WORDS) bad.push(`${s.split(/\s+/).length} words: ${s}`);
  }
}));

test("a reading never makes the same point twice", () => breaches("repeated points", (bad) => {
  // no run of six words (names aside) turns up in two different sentences of one reading
  const runs = (s: string) => {
    const w = s.replace(NAME, "_").toLowerCase().replace(/[^a-z_' ]/g, " ").split(/\s+/).filter(Boolean);
    return new Set(w.slice(0, -5).map((_, i) => w.slice(i, i + 6).join(" ")).filter((run) => run.replace(/[_ ]/g, "").length > 12));
  };
  for (const r of readings) {
    const seen = new Map<string, string>();
    for (const s of all(r).flatMap(sentences)) {
      for (const run of runs(s)) {
        const other = seen.get(run);
        if (other && other !== s) bad.push(`"${run}":\n  ${other}\n  ${s}`);
        seen.set(run, s);
      }
    }
  }
}));

/** Each term, and what explains it, in the sentence where the term first appears. */
const GLOSSES: [RegExp, RegExp][] = [
  [/\b(cardinal|mutable|fixed signs?)\b/i, /start|begin|initiat|sustain|adapt|keep|hold|steady|stabil|consisten|flexib|persist|adjust|to act\b|act first/i],
  [/\bLife Paths?\b/, /birth date|date of birth|numerology/i],
  [/\bPersonal Years?\b/, /numerology|1 January|birthday/i],
  [/\bRising\b/, /horizon|first impression/i],
  [/\b(yin|yang)\b/i, /active|receptive/i],
  [/\bsecret friends?\b/i, /paired|ally|support|closest/i],
  [/\bpersonal planets\b/, /Sun, Moon, Mercury, Venus and Mars/],
  [/\bmaster numbers?\b/i, /unreduced|not reduce|single digit/i],
  [/\bbirthday number\b/i, /day of the month|born on/i],
];

test("astrology and numerology terms are explained the first time they appear", () => breaches("unexplained terms", (bad) => {
  for (const r of readings) {
    const said = all(r).flatMap(sentences);
    for (const [term, gloss] of GLOSSES) {
      const first = said.find((s) => term.test(s));
      if (first && !gloss.test(first)) bad.push(`${term.source}: ${first}`);
    }
  }
  // and in the solo spotlights, each planet is introduced by what it governs
  const PLANETS: [RegExp, RegExp][] = [
    [/\bSun\b/, /core|character|personality|who you are|heart/i],
    [/\bMoon\b/, /feel|emotion|private/i],
    [/\bMercury\b/, /think|talk|mind|communicat/i],
    [/\bVenus\b/, /love|affection|relationship/i],
    [/\bMars\b/, /drive|action|go after/i],
  ];
  for (const r of readings.filter((x) => !x.name.startsWith("pair") && !x.name.startsWith("glance"))) {
    const said = all(r).flatMap(sentences);
    for (const [term, gloss] of PLANETS) {
      // a sentence that lists three or more planets, as the personal planets gloss does, does not introduce them
      const first = said.find((s) => term.test(s) && !/^Your Moon moved from/.test(s) && (s.match(/\b(Sun|Moon|Mercury|Venus|Mars)\b/g) ?? []).length < 3);
      if (first && !gloss.test(first)) bad.push(`${term.source}: ${first}`);
    }
  }
}));

test("every section opens on a detail of the person, and not every one with \"You\" or \"Your\"", () => breaches("openings", (bad) => {
  for (const r of readings) {
    const firsts = r.sections.map((t) => sentences(t)[0]);
    for (const f of firsts) if (!DETAIL.test(f)) bad.push(`no detail: ${f}`);
    if (firsts.length > 2 && firsts.every((f) => /^(You|Your)\b/.test(f))) bad.push(`${r.name}: every section starts with You or Your`);
    // and never four sentences in a row
    let run = 0;
    for (const s of all(r).flatMap(sentences)) {
      run = /^(You|Your)\b/.test(s) ? run + 1 : 0;
      if (run >= 4) bad.push(`four in a row start with You or Your, ending: ${s}`);
    }
  }
}));

test("every reading names at least one real challenge", () => {
  const edges = [...Object.values(SIGN_SPOT).flatMap((s) => [...s.edge, s.trap]), ...Object.values(LIFE_PATH_SPOT).flatMap((l) => l.edge)];
  for (const r of readings.filter((x) => !x.name.startsWith("pair"))) {
    const text = all(r).join(" ").toLowerCase();
    assert.ok(edges.some((e) => text.includes(e.toLowerCase())) || r.name.startsWith("deep"), `${r.name} names no challenge`);
  }
  for (let i = 0; i < 100; i++) {
    const d = randomDate();
    assert.ok(solo(d, "deep").edges.length > 0, `deep for ${d} names no challenge`);
    const p = pair(d, randomDate(), i % 4);
    assert.ok(p.sections.find((x) => x.heading === "Where you rub")?.text, "a pair spotlight with no Where you rub");
  }
});
