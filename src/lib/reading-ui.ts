// Small HTML helpers shared by the reading page and the numerology deep dive.

import { NUMBER_MEANINGS } from "../data/numbers.ts";
import type { Result } from "./numerology.ts";
import type { Breakdown } from "./explain.ts";

export type Tier = "glance" | "first" | "deep";

export const esc = (s: string) => s.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

/** One step-by-step card. Library links appear only for articles that exist. */
export function howCard(b: Breakdown, articles: Set<string>) {
  const letters = b.letters
    ? `<div class="letters" aria-hidden="true">${b.letters
        .map((l, i) => `${i > 0 && l.wordStart ? `<span class="gap"></span>` : ""}<span class="${l.counted ? "" : "off"}">${l.letter}<small>${l.value}</small></span>`)
        .join("")}</div>`
    : "";
  const links = b.articles.filter((a) => articles.has(a.id));
  return `
    <div class="panel how-card" id="${b.id}">
      <h3>${esc(b.title)}</h3>
      <p class="muted">${esc(b.intro)}</p>
      ${letters}
      <ol>${b.steps.map((s) => `<li>${esc(s.text)}${s.why ? `<span class="why">${esc(s.why)}</span>` : ""}</li>`).join("")}</ol>
      <p class="result">${esc(b.result)}</p>
      ${b.meaning ? `<div class="meaning"><h4>${esc(b.meaning.title)}</h4><p>${esc(b.meaning.text)}</p></div>` : ""}
      ${b.note ? `<p class="note muted">${esc(b.note)}</p>` : ""}
      ${links.length ? `<p class="more">Learn more in the Library: ${links.map((a) => `<a href="/library/${a.id}">${esc(a.label)}</a>`).join(" · ")}</p>` : ""}
    </div>`;
}

/** The small "How it's calculated" reveal that sits under a section, closed by default. */
export function calc(cards: Breakdown[], articles: Set<string>, label = "How it's calculated") {
  return `<details class="calc"><summary>${esc(label)}</summary>${cards.map((b) => howCard(b, articles)).join("")}</details>`;
}

export function medallion(what: string, r: Result, tier: Tier) {
  const m = NUMBER_MEANINGS[r.value];
  const body = tier === "glance" ? `<p class="muted">${m?.essence ?? ""}</p>` : `<p class="muted">${m?.gentle ?? ""}</p>`;
  return `<div class="medallion panel"><span class="what">${what}</span><span class="n">${r.value}</span><span class="k">${m?.keyword ?? ""}</span>${body}</div>`;
}

/** Count every reading: each new set of details counts once, so only a refresh of the same page doesn't. */
export function countReading() {
  const params = new URLSearchParams(location.search);
  params.sort();
  const key = `counted:${params.toString()}`;
  try {
    if (sessionStorage.getItem(key)) return;
    sessionStorage.setItem(key, "1");
  } catch {}
  fetch("/api/counter", { method: "POST" }).catch(() => {});
}

/** The same details as the current link, without the second person: someone's own reading. */
export function soloQuery(q: URLSearchParams) {
  const solo = new URLSearchParams(q);
  for (const k of ["rel", "n2", "d2", "t2", "p2"]) solo.delete(k);
  return solo.toString();
}

/** True when the link carries a second person, so the page shows the relationship reading. */
export const isPartnerReading = (q: URLSearchParams) => !!q.get("rel") && /^\d{4}-\d{2}-\d{2}$/.test(q.get("d2") ?? "");
