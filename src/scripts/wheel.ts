// Brings the zodiac wheel to life. Selecting an animal (or a year, or a birth date) turns the wheel
// so that animal sits at the top under the gold marker, labels its friends, secret friend and clash
// on the wheel, fills the three boxes under the wheel with what each one means, and shows the
// animal's own profile in the side panel.
import { ANIMALS, GROUPS, PROFILES, SECRET_FRIENDS, animalById, seasonOf, type Animal } from "../data/zodiac.ts";
import { LUNAR_NEW_YEAR } from "../data/lunar-new-year.ts";
import {
  chineseSign, friendsOf, secretFriendOf, clashOf, relationBetween,
  animalOfZodiacYear, elementOfZodiacYear, yinYangOfZodiacYear,
} from "../lib/chinese.ts";

const CLASH_RED = "#d8343c";
const TURN_MS = 1300; // keep in step with the transition in ZodiacWheel.astro

const img = (a: Animal, size = 40) => `<img src="/animals/${a.id}.png" alt="" width="${size}" height="${size}" loading="lazy">`;
const list = (xs: string[]) => (xs.length < 2 ? xs.join("") : `${xs.slice(0, -1).join(", ")} and ${xs.at(-1)}`);
const longDate = (iso: string) =>
  new Date(`${iso}T12:00:00Z`).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
const dayBefore = (iso: string) => {
  const d = new Date(`${iso}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() - 1);
  return d.toISOString().slice(0, 10);
};
const yearsOfAnimal = (a: Animal, from: number, to: number) =>
  Array.from({ length: to - from + 1 }, (_, k) => from + k).filter((y) => animalOfZodiacYear(y).id === a.id);
const nextYearOf = (a: Animal) => yearsOfAnimal(a, new Date().getFullYear(), new Date().getFullYear() + 11)[0];
const article = (word: string) => (/^[AEIOU]/.test(word) ? "an" : "a");

const COMPARE_TEXT = {
  same: (a: Animal) => `Two ${a.name}s: the same animal. You understand each other's instincts instantly, and you can also share the same blind spots.`,
  friend: (a: Animal, b: Animal) => `Friends. The ${a.name} and the ${b.name} share a colour on the wheel, so they see the world the same way and work well together.`,
  secret: (a: Animal, b: Animal) => `Secret friends. The ${a.name} and the ${b.name} share an inner-ring colour: a quiet, loyal bond that often runs deeper than it looks.`,
  clash: (a: Animal, b: Animal) => `A clash. The ${a.name} and the ${b.name} sit directly opposite, so their energies pull in opposite directions. It can work, with patience and respect for your differences.`,
  neutral: (a: Animal, b: Animal) => `Neutral. The ${a.name} and the ${b.name} are neither friends nor rivals on the wheel, so this bond is shaped by how you treat each other.`,
};

/** What each friend group brings to the selected animal, in plain words. */
const FRIEND_INSIGHT: Record<string, string> = {
  water: "Together you think fast and plan ahead. These friends understand your ideas before you finish explaining them.",
  metal: "Together you build things that last. These friends share your sense of duty and keep their promises.",
  fire: "Together you stand up for what is right. These friends are brave, warm and always on your side.",
  wood: "Together you bring people together. These friends share your kindness and love of peace and beauty.",
};

interface Focus { date?: string; year?: number }

export function initWheel(root: HTMLElement) {
  const svg = root.querySelector<SVGSVGElement>("svg.wheel")!;
  const details = root.querySelector<HTMLElement>("[data-details]")!;
  const insights = root.querySelector<HTMLElement>("[data-insights]")!;
  const centreImg = svg.querySelector<SVGImageElement>(".centre-img")!;
  const segs = [...svg.querySelectorAll<SVGGElement>(".seg")];
  const cols = [...svg.querySelectorAll<SVGGElement>(".year-col")];
  const yearCells = [...svg.querySelectorAll<SVGGElement>(".year")];
  const texts = [...svg.querySelectorAll<SVGElement>(".tt")];

  let spin = 0; // running total, so the wheel always turns the short way round
  let current = "";
  let compareWith = "";
  let focus: Focus = {};
  let orientTimer = 0;

  /** Keep every label along the ring readable for the wheel's current turn: none upside down. */
  function orientText() {
    for (const t of texts) {
      const i = Number(t.dataset.i);
      const a = -90 + i * 30 + spin;
      const s = Math.sin((a * Math.PI) / 180);
      const rot = (s > 0.01 ? a - 90 : a + 90) - spin;
      t.setAttribute("transform", `translate(${t.dataset.x} ${t.dataset.y}) rotate(${rot.toFixed(2)})`);
    }
  }

  function turnTo(a: Animal, animate: boolean) {
    const target = -a.index * 30;
    let delta = (target - spin) % 360;
    if (delta > 180) delta -= 360;
    if (delta < -180) delta += 360;
    spin += delta;
    svg.classList.toggle("no-anim", !animate);
    svg.style.setProperty("--spin", `${spin}deg`);
    clearTimeout(orientTimer);
    if (animate) orientTimer = window.setTimeout(orientText, TURN_MS);
    else orientText();
  }

  function setBadge(seg: SVGGElement, label: string | null, kind = "") {
    const badge = seg.querySelector<SVGGElement>(".badge")!;
    badge.classList.toggle("is-on", !!label);
    badge.classList.toggle("k-clash", kind === "clash");
    if (!label) return;
    badge.querySelector("text")!.textContent = label;
    const w = label.length * 10.5 + 28;
    const rect = badge.querySelector("rect")!;
    rect.setAttribute("x", String(-w / 2));
    rect.setAttribute("width", String(w));
  }

  function paint(animate: boolean) {
    const self = animalById(current);
    const friends = friendsOf(current);
    const secret = secretFriendOf(current);
    const clash = clashOf(current);
    const other = compareWith && compareWith !== current ? animalById(compareWith) : null;

    turnTo(self, animate);
    segs.forEach((g) => {
      const id = g.dataset.id!;
      const isFriend = friends.some((f) => f.id === id);
      g.classList.toggle("is-self", id === self.id);
      g.classList.toggle("is-friend", isFriend);
      g.classList.toggle("is-secret", id === secret.id);
      g.classList.toggle("is-clash", id === clash.id);
      g.setAttribute("aria-pressed", String(id === self.id));
      if (id === self.id) setBadge(g, "SELECTED");
      else if (isFriend) setBadge(g, "FRIEND");
      else if (id === secret.id) setBadge(g, "SECRET FRIEND");
      else if (id === clash.id) setBadge(g, "CLASH", "clash");
      else if (other && id === other.id) setBadge(g, "COMPARING");
      else setBadge(g, null);
    });
    cols.forEach((c) => c.classList.toggle("is-self", c.dataset.for === self.id));
    yearCells.forEach((c) => c.classList.toggle("is-picked", focus.year !== undefined && Number(c.dataset.year) === focus.year));
    centreImg.setAttribute("href", `/animals/${self.id}.png`);

    renderInsights(self, friends, secret, clash);
    renderDetails(self, friends, secret, clash, other);
  }

  /** The three boxes under the wheel: what the friends, secret friend and clash mean for this animal. */
  function renderInsights(self: Animal, friends: Animal[], secret: Animal, clash: Animal) {
    const group = GROUPS[self.group];
    const pair = SECRET_FRIENDS.find((s) => s.pair.includes(self.id))!;
    const box = (kind: string) => insights.querySelector<HTMLElement>(`[data-kind="${kind}"]`)!;
    box("friends").style.setProperty("--c", group.colour);
    box("secret").style.setProperty("--c", pair.colour);
    box("clash").style.setProperty("--c", CLASH_RED);

    box("friends").querySelector(".body")!.innerHTML = `
      <div class="who">${friends.map((f) => img(f)).join("")}<strong>${list(friends.map((f) => f.name))}</strong></div>
      <p>${FRIEND_INSIGHT[self.group]} The ${self.name}, ${list(friends.map((f) => f.name))} are known as ${group.name}.</p>
      <p class="next">They share the ${self.name}'s colour on the wheel. Next friend years: ${friends.map((f) => `${nextYearOf(f)} (${f.name})`).join(", ")}.</p>`;
    box("secret").querySelector(".body")!.innerHTML = `
      <div class="who">${img(secret)}<strong>The ${secret.name}</strong></div>
      <p>Your hidden ally. The ${secret.name} brings what the ${self.name} lacks, and this bond is often quiet, loyal and deeper than it looks.</p>
      <p class="next">You share the same colour on the inner ring. Next ${secret.name} year: ${nextYearOf(secret)}.</p>`;
    box("clash").querySelector(".body")!.innerHTML = `
      <div class="who">${img(clash)}<strong>The ${clash.name}</strong></div>
      <p>Your opposite. The ${self.name} and the ${clash.name} want different things, so this bond takes patience. Learn from each other rather than compete.</p>
      <p class="next">Directly opposite on the wheel. Next ${clash.name} year, a year to take extra care: ${nextYearOf(clash)}.</p>`;
    delete insights.dataset.glossaryDone;
  }

  function renderDetails(self: Animal, friends: Animal[], secret: Animal, clash: Animal, other: Animal | null) {
    const season = seasonOf(self.id);
    const profile = PROFILES[self.id];
    let yearBox = "";
    if (focus.year !== undefined) {
      const y = focus.year;
      const start = LUNAR_NEW_YEAR[y];
      const next = LUNAR_NEW_YEAR[y + 1];
      const today = new Date().toISOString().slice(0, 10);
      const verb = next && dayBefore(next) < today ? "ran" : start > today ? "will run" : "runs";
      const span = start && next ? ` It ${verb} from ${longDate(start)} to ${longDate(dayBefore(next))}.` : "";
      let born = "";
      if (focus.date) {
        const calYear = Number(focus.date.slice(0, 4));
        born = calYear !== y
          ? `<p>You were born on ${longDate(focus.date)}, before Lunar New Year ${calYear} (${longDate(LUNAR_NEW_YEAR[calYear])}), so you belong to the ${y} animal, not the ${calYear} one.</p>`
          : `<p>You were born on ${longDate(focus.date)}.</p>`;
      }
      const el = elementOfZodiacYear(y);
      yearBox = `<div class="year-box">${born}<p><strong>${y} is ${article(el)} ${el} ${self.name} year</strong> (${yinYangOfZodiacYear(y).toLowerCase()}).${span}</p></div>`;
    }

    const now = new Date().getFullYear();
    const ahead = Array.from({ length: 12 }, (_, k) => now + k);
    const good = ahead.filter((y) => [secret.id, ...friends.map((f) => f.id)].includes(animalOfZodiacYear(y).id));
    const hard = ahead.filter((y) => [clash.id, self.id].includes(animalOfZodiacYear(y).id));
    const hardText = hard
      .map((y) => (animalOfZodiacYear(y).id === self.id ? `${y} (your own ${self.name} year, Ben Ming Nian)` : `${y} (a ${clash.name} year)`))
      .join(" and ");

    const chips = ANIMALS.map(
      (a) => `<button type="button" data-compare="${a.id}" aria-pressed="${a.id === compareWith}">${img(a, 30)}${a.name}</button>`,
    ).join("");
    const verdict = other ? `<p class="verdict">${COMPARE_TEXT[relationBetween(self.id, other.id)](self, other)}</p>` : "";

    details.innerHTML = `
      ${yearBox}
      <div class="head">${img(self, 84)}<div><h3>The ${self.name}</h3>
        <p class="sub">Number ${self.index + 1} on the wheel · ${self.yinYang} · ${season.season} (${season.element})</p>
        ${self.alsoKnownAs ? `<p class="aka">${self.alsoKnownAs}</p>` : ""}</div></div>
      <ul class="tags">${self.traits.map((t) => `<li>${t}</li>`).join("")}</ul>
      <p>${self.summary}</p>
      <dl>
        <dt>Strengths</dt><dd>${profile.strengths}</dd>
        <dt>Watch out for</dt><dd>${profile.watchOut}</dd>
        <dt>In love</dt><dd>${profile.love}</dd>
        <dt>At work</dt><dd>${profile.work}</dd>
        <dt>Season</dt><dd>${season.season} (${season.element}) brings ${season.meaning}.</dd>
      </dl>
      <div class="lucky">
        <div><span>Lucky numbers</span><b>${profile.luckyNumbers.join(", ")}</b></div>
        <div><span>Lucky colours</span><b>${profile.luckyColours.join(", ")}</b></div>
        <div><span>Lucky flowers</span><b>${profile.luckyFlowers.join(", ")}</b></div>
      </div>

      <div class="compare">
        <h4>How does the ${self.name} get on with…</h4>
        <div class="chips">${chips}</div>
        ${verdict}
      </div>

      <div class="years-note">
        <h4>${self.name} years</h4>
        <p>${yearsOfAnimal(self, 1924, 2031).reverse().join(", ")}</p>
        <p><strong class="good">Supportive years ahead:</strong> ${good.slice(0, 4).join(", ")}, the years of your friends and secret friend.</p>
        <p><strong class="hard">Years to take extra care:</strong> ${hardText}.</p>
      </div>`;
    delete details.dataset.glossaryDone;
    document.dispatchEvent(new Event("glossary:scan"));
  }

  function select(id: string, f: Focus = {}, animate = true) {
    if (id !== current) compareWith = "";
    current = id;
    focus = f;
    paint(animate);
  }

  segs.forEach((g) => {
    g.addEventListener("click", () => select(g.dataset.id!));
    g.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); select(g.dataset.id!); }
    });
  });
  yearCells.forEach((c) => c.addEventListener("click", () => select(c.dataset.id!, { year: Number(c.dataset.year) })));

  details.addEventListener("click", (e) => {
    const btn = (e.target as HTMLElement).closest<HTMLButtonElement>("[data-compare]");
    if (!btn) return;
    compareWith = compareWith === btn.dataset.compare ? "" : btn.dataset.compare!;
    paint(false);
  });

  root.querySelector<HTMLFormElement>("form.finder")!.addEventListener("submit", (e) => {
    e.preventDefault();
    const date = root.querySelector<HTMLInputElement>("#wheel-date")!.value;
    if (!date) return;
    const sign = chineseSign(date);
    select(sign.animal.id, { date, year: sign.zodiacYear });
  });

  // start on this year's animal, with this year highlighted, already turned to the top
  const today = chineseSign(new Date().toISOString().slice(0, 10));
  select(today.animal.id, { year: today.zodiacYear }, false);
  requestAnimationFrame(() => svg.classList.remove("no-anim"));
}
