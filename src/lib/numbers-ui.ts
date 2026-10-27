// The full numerology reading, shared by the Numerology page and the deep dive (reading/numbers).
// Numbers are shown in three groups, most important first, each with a tiny tag saying what it is,
// so someone short on time can read "Start here" and stop.

import { lifePath, expression, soulUrge, personality, birthday, personalYear, maturity, universalYear, challenges } from "./numerology.ts";
import { CHALLENGE_MEANINGS, LIFE_PATH_DEEP, NUMBER_MEANINGS, PERSONAL_YEAR_THEMES, NUMBER_TAGS, NUMBER_GROUPS, NUMBER_GROUPS_INTRO } from "../data/numbers.ts";
import {
  lifePathBreakdown,
  nameBreakdown,
  birthdayBreakdown,
  personalYearBreakdown,
  challengesBreakdown,
  maturityBreakdown,
  universalYearBreakdown,
} from "./explain.ts";
import { esc, calc, medallion, type Tier } from "./reading-ui.ts";

export interface NumbersInput {
  date: string;
  name: string;
  tier: Tier;
  /** Library article ids that exist, so the working only links to real articles. */
  articles: Set<string>;
  /** Today as YYYY-MM-DD. */
  today: string;
  /** Shown in place of the name numbers when no name was given (may contain a link). */
  noNameHint: string;
}

const list = (items: string[]) => `<ul>${items.map((i) => `<li>${esc(i)}</li>`).join("")}</ul>`;
const group = (heading: string, body: string) => `<section class="part num-group"><h2>${esc(heading)}</h2>${body}</section>`;

export function numbersReading({ date, name, tier, articles, today, noNameHint }: NumbersInput): string {
  const year = Number(today.slice(0, 4));
  const hasName = /[a-z]/i.test(name);

  // Start here: Life Path, Expression, Soul Urge
  const lp = lifePath(date);
  const m = NUMBER_MEANINGS[lp.value];
  const deep = LIFE_PATH_DEEP[lp.value];
  // Everything about the Life Path in one box: the number, its meaning, then the detail under small headings.
  const bit = (title: string, body: string) => `<div class="lp-bit"><p class="eyebrow">${esc(title)}</p>${body}</div>`;
  const lifePathBlock = `
    <div class="panel lp-box">
      <div class="lp-head">
        <span class="n">${lp.value}</span>
        <div><span class="what">Life Path</span><span class="tag">${esc(NUMBER_TAGS.lifePath)}</span><span class="k">${m?.keyword ?? ""}</span></div>
      </div>
      <p>${esc(deep?.journey ?? m?.gentle ?? "")}</p>
      ${deep ? `
      <div class="lp-bits">
        ${bit("Your strengths", list(deep.strengths))}
        ${bit("Watch out for", list(deep.watchOut))}
        ${bit("In love", `<p>${esc(deep.love)}</p>`)}
        ${bit("At work", `<p>${esc(deep.work)}</p>`)}
        ${bit(`Where a ${lp.value} often thrives`, list(deep.thrivesIn))}
        ${bit("A practice for your path", `<p>${esc(deep.growth)}</p>`)}
      </div>` : ""}
      ${calc([lifePathBreakdown(date)], articles)}
    </div>`;
  const coreName = hasName
    ? `<div class="numbers">
        ${medallion("Expression", expression(name), tier, NUMBER_TAGS.expression, calc([nameBreakdown(name, "expression")], articles))}
        ${medallion("Soul Urge", soulUrge(name), tier, NUMBER_TAGS.soulUrge, calc([nameBreakdown(name, "soul")], articles))}
      </div>`
    : `<p class="panel no-name">${noNameHint}</p>`;

  // Worth reading: Birthday, Personality, Personal Year
  const py = personalYear(date, year);
  const pyTile = `<div class="medallion panel"><span class="what">Personal Year ${year}</span><span class="tag">${esc(NUMBER_TAGS.personalYear)}</span><span class="n">${py.value}</span><p class="muted">${esc(PERSONAL_YEAR_THEMES[py.value] ?? "")}</p>${calc([personalYearBreakdown(date, today)], articles)}</div>`;
  const worth = `
    <div class="numbers">
      ${medallion("Birthday", birthday(date), tier, NUMBER_TAGS.birthday, calc([birthdayBreakdown(date)], articles))}
      ${hasName ? medallion("Personality", personality(name), tier, NUMBER_TAGS.personality, calc([nameBreakdown(name, "personality")], articles)) : ""}
      ${pyTile}
    </div>`;

  // Extra detail: Challenges, Maturity, Universal Year
  const ch = challenges(date);
  const challengeCards = ([
    ["First", "early life", ch.first],
    ["Second", "middle years", ch.second],
    ["Third", "your main challenge", ch.third],
    ["Fourth", "later life", ch.fourth],
  ] as const)
    .map(([which, when, v]) => {
      const c = CHALLENGE_MEANINGS[v];
      return `<div class="medallion panel${which === "Third" ? " main" : ""}"><span class="what">${which} Challenge<br>${when}</span><span class="n">${v}</span><span class="k">${c.keyword}</span>${tier === "glance" ? "" : `<p class="muted">${c.text}</p>`}</div>`;
    })
    .join("");
  const uy = universalYear(year);
  const uyMeaning = NUMBER_MEANINGS[uy.value];
  const extra = `
    <h3>Challenges</h3>
    <p class="tag">${esc(NUMBER_TAGS.challenges)}</p>
    <div class="numbers challenges">${challengeCards}</div>
    ${calc([challengesBreakdown(date)], articles)}
    <div class="numbers">
      ${hasName ? medallion("Maturity", maturity(date, name), tier, NUMBER_TAGS.maturity, calc([maturityBreakdown(date, name)], articles)) : ""}
      <div class="medallion panel"><span class="what">Universal Year ${year}</span><span class="tag">${esc(NUMBER_TAGS.universalYear)}</span><span class="n">${uy.value}</span><span class="k">${uyMeaning?.keyword ?? ""}</span><p class="muted">${uyMeaning?.essence ?? ""}</p>${calc([universalYearBreakdown(year)], articles)}</div>
    </div>`;

  return `
    <p class="muted num-intro">${esc(NUMBER_GROUPS_INTRO)}</p>
    ${group(NUMBER_GROUPS.core, lifePathBlock + coreName)}
    ${group(NUMBER_GROUPS.worth, worth)}
    ${group(NUMBER_GROUPS.extra, extra)}`;
}
