// Brings the two wheels to life. Show me (or tapping a sign, animal or year) turns each wheel so the
// chosen sign and animal sit at the top under the gold markers, labels their friends, secret friend
// and clash on both wheels, fills the three boxes with the pair's matches, and shows one reading for
// the sign and animal together, with its month and year forecast, in the side panel.
import { ANIMALS, GROUPS, SECRET_FRIENDS, SEASONS, ELEMENTS, EARTH_ANIMALS, animalById, seasonOf, type Animal, type Element } from "../data/zodiac.ts";
import { LUNAR_NEW_YEAR } from "../data/lunar-new-year.ts";
import { SIGNS, type Sign, type SignId } from "../data/astrology.ts";
import { SIGN_FRIEND, ANIMAL_FRIEND, SIGN_SECRET } from "../data/pairs.ts";
import { chineseSign, animalOfZodiacYear, elementOfZodiacYear, yinYangOfZodiacYear } from "../lib/chinese.ts";
import { pairMonthlyForecast, pairYearlyForecast, luckyAnimals, animalHours } from "../lib/forecast.ts";
import { pairProfile, pairMatches, sunSignOn, signById, poss, type PairMatch } from "../lib/pair.ts";

const CLASH_RED = "#d8343c";
const TURN_MS = 1500; // keep in step with the transition in ZodiacWheel.astro

const img = (a: Animal, size = 40) => `<img src="/animals/${a.id}.png" alt="" width="${size}" height="${size}" loading="lazy">`;
const list = (xs: string[]) => (xs.length < 2 ? xs.join("") : `${xs.slice(0, -1).join(", ")} and ${xs.at(-1)}`);
const longDate = (iso: string) =>
  new Date(`${iso}T12:00:00Z`).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
const dayBefore = (iso: string) => {
  const d = new Date(`${iso}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() - 1);
  return d.toISOString().slice(0, 10);
};
const signGlyph = (g: Sign) => `<span class="sg" aria-hidden="true">${g.glyph}</span>`;
const pairName = (m: PairMatch) => `${m.sign.name} ${m.animal.name}`;
const yearsOfAnimal = (a: Animal, from: number, to: number) =>
  Array.from({ length: to - from + 1 }, (_, k) => from + k).filter((y) => animalOfZodiacYear(y).id === a.id);
const nextYearOf = (a: Animal) => yearsOfAnimal(a, new Date().getFullYear(), new Date().getFullYear() + 11)[0];
const article = (word: string) => (/^[AEIOU]/.test(word) ? "an" : "a");



/** Today's date where the reader is, as YYYY-MM-DD. */
const localToday = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};
const shortDate = (iso: string) => {
  const d = new Date(`${iso}T12:00:00Z`);
  const part = (o: Intl.DateTimeFormatOptions) => d.toLocaleDateString("en-GB", { ...o, timeZone: "UTC" });
  return `${part({ weekday: "short" })} ${d.getUTCDate()} ${part({ month: "short" })}`;
};
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const stars = (n: number) =>
  `<span class="stars" role="img" aria-label="${n} out of 5">${"★".repeat(n)}<span class="off">${"★".repeat(5 - n)}</span></span>`;
const TOPIC_NAMES = { love: "Love", work: "Work", money: "Money", wellbeing: "Wellbeing" };
const topicsHtml = (ts: { topic: keyof typeof TOPIC_NAMES; text: string }[]) =>
  `<div class="topics">${ts.map((t) => `<div><span>${TOPIC_NAMES[t.topic]}</span>${t.text}</div>`).join("")}</div>`;
type Scope = "month" | "year";

/** The forecast inside the reveal panel, for the sign and animal together. */
function forecastHtml(sign: Sign, self: Animal, scope: Scope): string {
  const today = localToday();
  if (scope === "month") {
    const f = pairMonthlyForecast(sign.id, self.id, today);
    const days = (xs: string[]) => xs.map((d) => shortDate(d)).join(", ");
    return `
      <p class="fc-when">${MONTHS[f.month - 1]} ${f.year}</p>
      <div class="fc-headline"><h4>${f.headline}</h4>${stars(f.stars)}</div>
      <p class="ruler">${img(f.animal, 34)}<span>${f.intro[0]}</span></p>
      ${topicsHtml(f.topics)}
      ${f.mercuryRetrograde ? "<p>Mercury is retrograde right now, so double-check plans and messages.</p>" : ""}
      <p><strong class="good">Your brightest days:</strong> ${f.bestDays.length ? days(f.bestDays) : "none stand out this month, so steady effort wins"}.</p>
      <p><strong class="hard">Days to take care:</strong> ${days(f.careDays)} (${clashName(self)} days, and days the Moon sits opposite ${sign.name}).</p>`;
  }
  const f = pairYearlyForecast(sign.id, self.id, today);
  const end = LUNAR_NEW_YEAR[f.zodiacYear + 1];
  const months = (xs: number[]) => list(xs.map((m) => MONTHS[m - 1]));
  return `
    <p class="fc-when">The ${f.element} ${f.animal.name} year: ${longDate(LUNAR_NEW_YEAR[f.zodiacYear])}${end ? ` to ${longDate(dayBefore(end))}` : ""}</p>
    <div class="fc-headline"><h4>${f.headline}</h4>${stars(f.stars)}</div>
    <p class="ruler">${img(f.animal, 34)}<span>${f.intro[0]}</span></p>
    <p>${f.jupiter} ${f.saturn}</p>
    <p><strong class="good">Your best months:</strong> ${f.bestMonths.length ? months(f.bestMonths) : "none stand out, so steady effort wins"}.</p>
    ${f.careMonths.length ? `<p><strong class="hard">Months to take care:</strong> ${months(f.careMonths)}.</p>` : ""}
    <p class="next">Months here follow the Chinese solar months, which start around the 4th to the 8th.</p>`;
}

interface Focus { date?: string; year?: number }
const clashName = (a: Animal) => animalById(ANIMALS[(a.index + 6) % 12].id).name;

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

/** Turns one wheel so a segment sits at the top, keeping every label along the ring the right way up. */
function makeTurner(svg: SVGSVGElement) {
  const texts = [...svg.querySelectorAll<SVGElement>(".tt")];
  let spin = 0; // running total, so the wheel always turns the short way round
  let timer = 0;
  const orient = () => {
    for (const t of texts) {
      const a = -90 + Number(t.dataset.i) * 30 + spin;
      const rot = (Math.sin((a * Math.PI) / 180) > 0.01 ? a - 90 : a + 90) - spin;
      t.setAttribute("transform", `translate(${t.dataset.x} ${t.dataset.y}) rotate(${rot.toFixed(2)})`);
    }
  };
  /** `extra` adds whole turns, so Show me visibly spins the wheel even when it is already in place. */
  return (index: number, animate: boolean, extra = 0) => {
    let delta = (-index * 30 - spin) % 360;
    if (delta > 180) delta -= 360;
    if (delta < -180) delta += 360;
    spin += delta + 360 * extra;
    svg.classList.toggle("no-anim", !animate);
    svg.style.setProperty("--spin", `${spin}deg`);
    clearTimeout(timer);
    if (animate) timer = window.setTimeout(orient, TURN_MS);
    else orient();
  };
}

export function initWheel(root: HTMLElement) {
  const svg = root.querySelector<SVGSVGElement>("svg.wheel:not(.sign-wheel)")!;
  const signSvg = root.querySelector<SVGSVGElement>("svg.sign-wheel")!;
  const details = root.querySelector<HTMLElement>("[data-details]")!;
  const insights = root.querySelector<HTMLElement>("[data-insights]")!;
  const reveal = root.querySelector<HTMLElement>("[data-reveal]")!;
  const signPick = root.querySelector<HTMLSelectElement>("#wheel-sign")!;
  const centreImg = svg.querySelector<SVGImageElement>(".centre-img")!;
  const segs = [...svg.querySelectorAll<SVGGElement>(".seg")];
  const signSegs = [...signSvg.querySelectorAll<SVGGElement>(".seg")];
  const cols = [...svg.querySelectorAll<SVGGElement>(".year-col")];
  const yearCells = [...svg.querySelectorAll<SVGGElement>(".year")];
  const elems = [...svg.querySelectorAll<SVGGElement>(".elem")];
  const centreGlyph = svg.querySelector<SVGTextElement>(".centre-glyph")!;
  const signCentre = signSvg.querySelector<SVGTextElement>(".sign-centre")!;
  const turnAnimal = makeTurner(svg);
  const turnSign = makeTurner(signSvg);
  const box = (kind: string) => insights.querySelector<HTMLElement>(`[data-kind="${kind}"]`)!;
  const setLabels = (a: string, b: string, c: string) => {
    box("friends").querySelector(".label")!.textContent = a;
    box("secret").querySelector(".label")!.textContent = b;
    box("clash").querySelector(".label")!.textContent = c;
  };

  let current = "";
  let sign: SignId = "aries";
  let focus: Focus = {};
  let scope: Scope = "month";
  let revealTimer = 0;

  function setBadge(seg: SVGGElement, label: string | null, kind = "") {
    const badge = seg.querySelector<SVGGElement>(".badge")!;
    badge.classList.toggle("is-on", !!label);
    badge.classList.toggle("k-clash", kind === "clash");
    if (!label) return;
    badge.querySelector("text")!.textContent = label;
    const w = label.length * 8.8 + 20;
    const rect = badge.querySelector("rect")!;
    rect.setAttribute("x", String(-w / 2));
    rect.setAttribute("width", String(w));
  }

  /** Mark self, friends, secret friend and clash on one wheel. */
  function mark(gs: SVGGElement[], key: (g: SVGGElement) => string, self: string, m: ReturnType<typeof pairMatches>, of: (x: PairMatch) => string) {
    gs.forEach((g) => {
      const id = key(g);
      const isFriend = m.friends.some((f) => of(f) === id);
      g.classList.toggle("is-self", id === self);
      g.classList.toggle("is-friend", isFriend);
      g.classList.toggle("is-secret", id === of(m.secret));
      g.classList.toggle("is-clash", id === of(m.clash));
      g.setAttribute("aria-pressed", String(id === self));
      if (id === self) setBadge(g, "SELECTED");
      else if (isFriend) setBadge(g, "FRIEND");
      else if (id === of(m.secret)) setBadge(g, "SECRET FRIEND");
      else if (id === of(m.clash)) setBadge(g, "CLASH", "clash");
      else setBadge(g, null);
    });
  }

  function paint(animate: boolean, extra = 0) {
    const self = animalById(current);
    const sg = signById(sign);
    const m = pairMatches(sign, current);

    turnAnimal(self.index, animate, extra);
    turnSign(SIGNS.indexOf(sg), animate, extra);
    elems.forEach((e) => e.classList.remove("is-on"));
    centreGlyph.textContent = "";
    centreImg.style.display = "";
    centreImg.setAttribute("href", `/animals/${self.id}.png`);
    signCentre.textContent = sg.glyph;
    setLabels("Friends", "Secret friend", "Clash");
    mark(segs, (g) => g.dataset.id!, self.id, m, (x) => x.animal.id);
    mark(signSegs, (g) => g.dataset.sign!, sg.id, m, (x) => x.sign.id);
    cols.forEach((c) => c.classList.toggle("is-self", c.dataset.for === self.id));
    yearCells.forEach((c) => c.classList.toggle("is-picked", focus.year !== undefined && Number(c.dataset.year) === focus.year));

    renderInsights(sg, self, m);
    renderDetails(sg, self, m);
  }

  /** The three boxes: the pair's friends, secret friend and clash, each a sign and an animal together. */
  function renderInsights(sg: Sign, self: Animal, m: ReturnType<typeof pairMatches>) {
    const group = GROUPS[self.group];
    const pair = SECRET_FRIENDS.find((s) => s.pair.includes(self.id))!;
    box("friends").style.setProperty("--c", group.colour);
    box("secret").style.setProperty("--c", pair.colour);
    box("clash").style.setProperty("--c", CLASH_RED);

    const fa = m.friends.map((f) => f.animal);
    box("friends").querySelector(".body")!.innerHTML = `
      <div class="who">${m.friends.map((f) => signGlyph(f.sign) + img(f.animal)).join("")}<strong>${list(m.friends.map(pairName))}</strong></div>
      <p>${SIGN_FRIEND[sg.element]}, and the ${list(fa.map((f) => f.name))} ${ANIMAL_FRIEND[self.group]}.</p>
      <p class="next">They share your colour on both wheels. Next friend years: ${fa.map((f) => `${nextYearOf(f)} (${f.name})`).join(", ")}.</p>`;
    box("secret").querySelector(".body")!.innerHTML = `
      <div class="who">${signGlyph(m.secret.sign)}${img(m.secret.animal)}<strong>The ${pairName(m.secret)}</strong></div>
      <p>Your hidden ally. ${SIGN_SECRET[sg.element]}, and the ${m.secret.animal.name} brings what the ${self.name} lacks: a quiet, loyal bond.</p>
      <p class="next">Two signs on, and the same colour on the inner ring. Next ${m.secret.animal.name} year: ${nextYearOf(m.secret.animal)}.</p>`;
    box("clash").querySelector(".body")!.innerHTML = `
      <div class="who">${signGlyph(m.clash.sign)}${img(m.clash.animal)}<strong>The ${pairName(m.clash)}</strong></div>
      <p>Your opposite. ${m.clash.sign.name} and ${sg.name} face each other, and the ${self.name} and ${m.clash.animal.name} want different things, so this bond takes patience. Learn from each other rather than compete.</p>
      <p class="next">Directly opposite on both wheels. Next ${m.clash.animal.name} year, a year to take extra care: ${nextYearOf(m.clash.animal)}.</p>`;
    delete insights.dataset.glossaryDone;
  }

  function renderForecast() {
    const body = details.querySelector<HTMLElement>("[data-forecast]");
    if (!body) return;
    details.querySelectorAll<HTMLButtonElement>(".fc-tabs [data-scope]").forEach((t) => t.setAttribute("aria-selected", String(t.dataset.scope === scope)));
    body.innerHTML = forecastHtml(signById(sign), animalById(current), scope);
  }

  function renderDetails(sg: Sign, self: Animal, m: ReturnType<typeof pairMatches>) {
    const season = seasonOf(self.id);
    const p = pairProfile(sg.id, self.id);
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
    const lucky = luckyAnimals(self.id);
    const tab = (k: Scope, label: string) => `<button type="button" role="tab" data-scope="${k}" aria-selected="${k === scope}">${label}</button>`;

    details.innerHTML = `
      ${yearBox}
      <div class="head"><div class="pic">${img(self, 84)}${signGlyph(sg)}</div><div><h3>${p.title}</h3>
        <p class="sub">${sg.element} sign, ruled by ${sg.ruler} · Number ${self.index + 1} on the wheel · ${self.yinYang} · ${season.season} (${season.element})</p>
        ${self.alsoKnownAs ? `<p class="aka">${self.alsoKnownAs}</p>` : ""}</div></div>
      <ul class="tags">${p.tags.map((t) => `<li>${t}</li>`).join("")}</ul>
      <p>${p.summary}</p>
      <dl>
        <dt>Strengths</dt><dd>${p.strengths}</dd>
        <dt>Watch out for</dt><dd>${p.watchOut}</dd>
        <dt>In love</dt><dd>${p.love}</dd>
        <dt>At work</dt><dd>${p.work}</dd>
        <dt>Careers</dt><dd>${p.careers}</dd>
        <dt>Wellbeing</dt><dd>${p.wellbeing}</dd>
        <dt>Lucky days</dt><dd>${p.part.day}s, ${poss(p.part.dayRuler)} day for ${sg.name}, and the days and hours of the ${list(lucky.map((a) => a.name))}, especially the ${m.secret.animal.name} (${animalHours(m.secret.animal)}). The forecast below picks them out.</dd>
        <dt>Elements</dt><dd>${p.elementSign} ${elemLink(self.element)}, in ${season.season.toLowerCase()} on the wheel's edge. ${p.elementBlend}</dd>
      </dl>
      <div class="lucky">
        <div><span>Lucky numbers</span><b>${p.luckyNumbers.join(", ")}</b></div>
        <div><span>Lucky colours</span><b>${p.luckyColours.join(", ")}</b></div>
        <div><span>Lucky flowers</span><b>${p.luckyFlowers.join(", ")}</b></div>
      </div>
      <section class="forecast" aria-label="Forecast">
        <div class="fc-top">
          <h4>Forecast for the ${sg.name} ${self.name}</h4>
          <div class="fc-tabs" role="tablist" aria-label="Forecast period">${tab("month", "This month")}${tab("year", "This year")}</div>
        </div>
        <div class="fc-body" role="tabpanel" aria-live="polite" data-forecast></div>
        <p class="fc-note">Based on the traditional Chinese calendar and where the planets are right now. For fun and reflection, not fate.</p>
      </section>`;
    renderForecast();
    delete details.dataset.glossaryDone;
    document.dispatchEvent(new Event("glossary:scan"));
  }

  /** Show one element: highlight it on the edge, mark its animals, and explain it in the boxes and panel. */
  function selectElement(el: Element) {
    const info = ELEMENTS[el];
    const season = SEASONS.find((x) => x.element === el);
    const seasonAnimals = (season ? season.animals : EARTH_ANIMALS).map(animalById);
    const own = ANIMALS.filter((a) => a.element === el);
    if (season) turnAnimal(animalById(season.animals[1]).index, true);
    showReveal(false);

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
        <p class="muted" style="margin-top:10px">Tap any animal or sign on the wheels to go back to your reading.</p>
      </div>`;
    delete details.dataset.glossaryDone;
    document.dispatchEvent(new Event("glossary:scan"));
  }

  /** Show the boxes and panel. After Show me they appear once the wheels have stopped. */
  function showReveal(afterSpin: boolean) {
    clearTimeout(revealTimer);
    const wasHidden = reveal.hidden;
    const open = () => {
      reveal.hidden = false;
      if (wasHidden && afterSpin) reveal.scrollIntoView({ behavior: "smooth", block: "start" });
    };
    const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (afterSpin && !still) revealTimer = window.setTimeout(open, TURN_MS);
    else open();
  }

  /** Change the animal and/or sign. Before Show me, this only turns the wheels. */
  function select(next: { animal?: string; sign?: SignId; focus?: Focus }, animate = true) {
    if (next.animal) current = next.animal;
    if (next.sign) { sign = next.sign; signPick.value = sign; }
    if (next.focus) focus = next.focus;
    paint(animate);
    if (!reveal.hidden) showReveal(false);
  }

  segs.forEach((g) => {
    const go = () => select({ animal: g.dataset.id!, focus: {} });
    g.addEventListener("click", go);
    g.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); go(); } });
  });
  signSegs.forEach((g) => {
    const go = () => select({ sign: g.dataset.sign as SignId });
    g.addEventListener("click", go);
    g.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); go(); } });
  });
  yearCells.forEach((c) => c.addEventListener("click", () => select({ animal: c.dataset.id!, focus: { year: Number(c.dataset.year) } })));
  signPick.addEventListener("change", () => select({ sign: signPick.value as SignId }));

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
    const t = (e.target as HTMLElement).closest<HTMLButtonElement>(".fc-tabs [data-scope]");
    if (!t) return;
    scope = t.dataset.scope as Scope;
    renderForecast();
  });

  // the sun sign fills itself in from the birth date (day and month are enough), and can still be changed
  const part = (k: string) => Number(root.querySelector<HTMLSelectElement>(`#wheel-date-${k}`)!.value);
  /** The date as YYYY-MM-DD, using a stand-in year when only the day and month are chosen. */
  const isoFrom = (stand?: number) => {
    const d = part("day"), mo = part("month"), y = part("year") || stand;
    if (!d || !mo || !y || new Date(Date.UTC(y, mo - 1, d)).getUTCDate() !== d) return "";
    return `${y}-${String(mo).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
  };
  const fillSign = () => {
    const iso = isoFrom(2001);
    if (iso) signPick.value = sunSignOn(iso).id;
  };
  for (const k of ["day", "month", "year"]) root.querySelector(`#wheel-date-${k}`)!.addEventListener("change", fillSign);

  root.querySelector<HTMLFormElement>("form.finder")!.addEventListener("submit", (e) => {
    e.preventDefault();
    const date = isoFrom();
    if (date) {
      const cs = chineseSign(date);
      current = cs.animal.id;
      focus = { date, year: cs.zodiacYear };
    }
    sign = signPick.value as SignId;
    paint(true, 1);
    showReveal(true);
  });

  // Enlarge: a big copy of the wheel to read up close; on phones it can be scrolled and pinched
  const zoom = root.querySelector<HTMLDialogElement>("dialog.zoom")!;
  const stage = zoom.querySelector<HTMLElement>("[data-zoom-stage]")!;
  root.querySelectorAll<HTMLButtonElement>("[data-zoom]").forEach((b) => b.addEventListener("click", () => {
    const copy = (b.dataset.zoom === "sign" ? signSvg : svg).cloneNode(true) as SVGSVGElement;
    copy.classList.add("no-anim");
    copy.removeAttribute("role");
    copy.querySelectorAll("[tabindex]").forEach((el) => el.removeAttribute("tabindex"));
    stage.replaceChildren(copy);
    zoomLevel = 0;
    applyZoom();
    zoom.showModal();
  }));
  // zoom steps: the whole wheel, then bigger; the view stays centred on the same spot
  const LEVELS = [1, 1.6, 2.4, 3.4];
  let zoomLevel = 0;
  function applyZoom() {
    const copy = stage.querySelector<SVGSVGElement>("svg");
    if (!copy) return;
    const cx = (stage.scrollLeft + stage.clientWidth / 2) / Math.max(stage.scrollWidth, 1);
    const cy = (stage.scrollTop + stage.clientHeight / 2) / Math.max(stage.scrollHeight, 1);
    copy.style.setProperty("--z", String(LEVELS[zoomLevel]));
    stage.scrollLeft = cx * stage.scrollWidth - stage.clientWidth / 2;
    stage.scrollTop = cy * stage.scrollHeight - stage.clientHeight / 2;
    zoom.querySelector<HTMLButtonElement>('[data-zoom-step="-1"]')!.disabled = zoomLevel === 0;
    zoom.querySelector<HTMLButtonElement>('[data-zoom-step="1"]')!.disabled = zoomLevel === LEVELS.length - 1;
  }
  zoom.querySelectorAll<HTMLButtonElement>("[data-zoom-step]").forEach((b) => b.addEventListener("click", () => {
    zoomLevel = Math.max(0, Math.min(LEVELS.length - 1, zoomLevel + Number(b.dataset.zoomStep)));
    applyZoom();
  }));
  zoom.querySelector("[data-zoom-close]")!.addEventListener("click", () => zoom.close());
  zoom.addEventListener("click", (e) => { if (e.target === zoom) zoom.close(); });
  zoom.addEventListener("close", () => stage.replaceChildren());

  // start on this year's animal and today's sign, already turned to the top; the reading waits for Show me
  const todayIso = localToday();
  const today = chineseSign(todayIso);
  current = today.animal.id;
  sign = sunSignOn(todayIso).id;
  signPick.value = sign;
  focus = { year: today.zodiacYear };
  paint(false);
  requestAnimationFrame(() => { svg.classList.remove("no-anim"); signSvg.classList.remove("no-anim"); });
}
