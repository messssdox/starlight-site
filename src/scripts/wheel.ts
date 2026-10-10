// Brings the zodiac wheel to life. Selecting an animal (or a year, or a birth date) turns the wheel
// so that animal sits at the top under the gold marker, labels its friends, secret friend and clash
// on the wheel, fills the three boxes under the wheel with what each one means, and shows the
// animal's own profile in the side panel.
import { ANIMALS, GROUPS, PROFILES, SECRET_FRIENDS, SEASONS, ELEMENTS, EARTH_ANIMALS, animalById, seasonOf, type Animal, type Element } from "../data/zodiac.ts";
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

/** How each element feeds the next (the producing cycle) and keeps another in check (the controlling cycle), in pictures. */
const FEEDS_PICTURE: Record<Element, string> = {
  Wood: "wood fuels a flame",
  Fire: "fire leaves ash that becomes new earth",
  Earth: "the earth holds metal ore deep inside it",
  Metal: "cool metal gathers water, like morning dew",
  Water: "water helps plants and trees grow",
};
const CONTROLS_PICTURE: Record<Element, string> = {
  Wood: "roots break up and hold the soil",
  Fire: "fire melts metal",
  Earth: "earth banks hold back water",
  Metal: "the axe cuts wood",
  Water: "water puts out fire",
};

/** A tappable element name, used inside the side panel and boxes. */
const elemLink = (e: Element) => `<button type="button" class="elem-link" data-element="${e}">${e}</button>`;

export function initWheel(root: HTMLElement) {
  const svg = root.querySelector<SVGSVGElement>("svg.wheel")!;
  const details = root.querySelector<HTMLElement>("[data-details]")!;
  const insights = root.querySelector<HTMLElement>("[data-insights]")!;
  const centreImg = svg.querySelector<SVGImageElement>(".centre-img")!;
  const segs = [...svg.querySelectorAll<SVGGElement>(".seg")];
  const cols = [...svg.querySelectorAll<SVGGElement>(".year-col")];
  const yearCells = [...svg.querySelectorAll<SVGGElement>(".year")];
  const texts = [...svg.querySelectorAll<SVGElement>(".tt")];
  const elems = [...svg.querySelectorAll<SVGGElement>(".elem")];
  const centreGlyph = svg.querySelector<SVGTextElement>(".centre-glyph")!;
  const box = (kind: string) => insights.querySelector<HTMLElement>(`[data-kind="${kind}"]`)!;
  const setLabels = (a: string, b: string, c: string) => {
    box("friends").querySelector(".label")!.textContent = a;
    box("secret").querySelector(".label")!.textContent = b;
    box("clash").querySelector(".label")!.textContent = c;
  };

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
    elems.forEach((e) => e.classList.remove("is-on"));
    centreGlyph.textContent = "";
    centreImg.style.display = "";
    setLabels("Friends", "Secret friend", "Clash");
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
      yearBox = `<div class="year-box">${born}<p><strong>${y} is ${article(el)} ${el} ${self.name} year</strong> (${yinYangOfZodiacYear(y).toLowerCase()}).${span}</p><p>Every year also has an element, from its last digit. Tap ${elemLink(el)} to see what it brings.</p></div>`;
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
        <dt>Elements</dt><dd>The ${self.name}'s own element is ${elemLink(self.element)}. It sits in ${season.season.toLowerCase()} on the outer edge, the season of ${elemLink(season.element)}, which brings ${season.meaning}.${EARTH_ANIMALS.includes(self.id) ? ` As the last animal of its season, it also carries ${elemLink("Earth")}, which links one season to the next.` : ""}</dd>
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

  /** Show one element: highlight it on the edge, mark its animals, and explain it in the boxes and panel. */
  function selectElement(el: Element) {
    const info = ELEMENTS[el];
    const season = SEASONS.find((x) => x.element === el);
    const seasonAnimals = (season ? season.animals : EARTH_ANIMALS).map(animalById);
    const own = ANIMALS.filter((a) => a.element === el);
    if (season) turnTo(animalById(season.animals[1]), true);

    elems.forEach((e) => e.classList.toggle("is-on", e.dataset.element === el));
    segs.forEach((g) => {
      const id = g.dataset.id!;
      const inSeason = seasonAnimals.some((a) => a.id === id);
      g.classList.remove("is-self", "is-secret", "is-clash");
      g.classList.toggle("is-friend", inSeason);
      g.setAttribute("aria-pressed", "false");
      setBadge(g, inSeason ? el.toUpperCase() : null);
    });
    cols.forEach((c) => c.classList.remove("is-self"));
    yearCells.forEach((c) => c.classList.remove("is-picked"));
    centreImg.style.display = "none";
    centreGlyph.textContent = info.glyph;

    setLabels(season ? `${info.season} animals` : "Linking animals", "Feeds", "Controls");
    box("friends").style.setProperty("--c", info.colour);
    box("secret").style.setProperty("--c", ELEMENTS[info.feeds].colour);
    box("clash").style.setProperty("--c", ELEMENTS[info.controls].colour);
    box("friends").querySelector(".body")!.innerHTML = `
      <div class="who">${seasonAnimals.map((a) => img(a)).join("")}<strong>${list(seasonAnimals.map((a) => a.name))}</strong></div>
      <p>${season
        ? `These three animals make up ${info.season.toLowerCase()} on the wheel, so ${el} colours how they feel and act.`
        : "Earth has no season of its own. It sits at the turn of every season, in the last animal of each, and links one season to the next."}
      ${own.length ? ` The ${list(own.map((a) => a.name))} also ${own.length > 1 ? "carry" : "carries"} ${el} as ${own.length > 1 ? "their" : "its"} own element.` : ""}</p>`;
    box("secret").querySelector(".body")!.innerHTML = `
      <p><strong>${el} feeds ${elemLink(info.feeds)}</strong>, just as ${FEEDS_PICTURE[el]}. And ${elemLink(info.fedBy)} feeds ${el}, as ${FEEDS_PICTURE[info.fedBy]}.</p>
      <p class="next">In people, ${el} tends to energise and support ${info.feeds}, and to be nurtured by ${info.fedBy}.</p>`;
    box("clash").querySelector(".body")!.innerHTML = `
      <p><strong>${el} controls ${elemLink(info.controls)}</strong>, just as ${CONTROLS_PICTURE[el]}. And ${elemLink(info.controlledBy)} controls ${el}, as ${CONTROLS_PICTURE[info.controlledBy]}.</p>
      <p class="next">In people, ${el} can keep ${info.controls} grounded, and may feel held back or challenged by ${info.controlledBy}.</p>`;

    const now = new Date().getFullYear();
    const upcoming = Array.from({ length: 10 }, (_, k) => now + k).filter((y) => info.digits.includes(y % 10));
    const recent = Array.from({ length: 10 }, (_, k) => now - 9 + k).filter((y) => info.digits.includes(y % 10) && !upcoming.includes(y));
    const chips = (Object.keys(ELEMENTS) as Element[]).map(
      (e) => `<button type="button" data-element="${e}" aria-pressed="${e === el}" style="background:${ELEMENTS[e].colour}">${ELEMENTS[e].glyph} ${e}</button>`,
    ).join("");
    details.innerHTML = `
      <div class="head"><div class="glyph" style="background:${info.colour}">${info.glyph}</div><div><h3>${el}</h3>
        <p class="sub">${info.season} · ${info.direction} · ${info.colourName} · ${info.planet}</p></div></div>
      <p>${info.essence}</p>
      <dl>
        <dt>Personality</dt><dd>${info.personality}</dd>
        <dt>Strengths</dt><dd>${info.strengths}</dd>
        <dt>Watch out for</dt><dd>${info.watchOut}</dd>
        <dt>${el} years</dt><dd>Years ending in ${info.digits[0]} or ${info.digits[1]}${recent.length ? `, such as ${recent.join(" and ")}` : ""}. Next: ${upcoming.join(" and ")}. (Each year starts at Lunar New Year.)</dd>
        <dt>In the body</dt><dd>Traditional Chinese medicine links ${el} to the ${info.body.toLowerCase()}.</dd>
      </dl>
      <div class="compare">
        <h4>The five elements</h4>
        <div class="elem-chips">${chips}</div>
        <p class="muted" style="margin-top:10px">Tap any animal on the wheel to go back to the animals.</p>
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

  elems.forEach((g) => {
    g.addEventListener("click", () => selectElement(g.dataset.element as Element));
    g.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); selectElement(g.dataset.element as Element); }
    });
  });
  root.addEventListener("click", (e) => {
    const link = (e.target as HTMLElement).closest<HTMLButtonElement>("button[data-element]");
    if (link) selectElement(link.dataset.element as Element);
  });

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
