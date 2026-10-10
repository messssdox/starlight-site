// Brings the zodiac wheel to life. Tapping an animal (or a year, or entering a birth date)
// lights up its friends, secret friend and clash on the wheel, labels each one, draws the
// lines between them and explains what each relationship means in plain words.
// The three rule buttons under the wheel show one rule across the whole wheel at once.
import { ANIMALS, GROUPS, SECRET_FRIENDS, animalById, seasonOf, type Animal } from "../data/zodiac.ts";
import { LUNAR_NEW_YEAR } from "../data/lunar-new-year.ts";
import {
  chineseSign, friendsOf, secretFriendOf, clashOf, relationBetween,
  animalOfZodiacYear, elementOfZodiacYear, yinYangOfZodiacYear,
} from "../lib/chinese.ts";

const SVG_NS = "http://www.w3.org/2000/svg";
const CLASH_RED = "#d8343c";
const INK = "#1d1729";
const LINE_R = 262; // lines start and end on the secret-friend ring
const angleOf = (i: number) => ((-90 + i * 30) * Math.PI) / 180;
const pt = (i: number, r: number) => [r * Math.cos(angleOf(i)), r * Math.sin(angleOf(i))];

/** One relationship line: a dark halo underneath so it reads on every colour, the colour on top. */
function line(a: Animal, b: Animal, colour: string, dash?: string): SVGGElement {
  const g = document.createElementNS(SVG_NS, "g");
  const [x1, y1] = pt(a.index, LINE_R);
  const [x2, y2] = pt(b.index, LINE_R);
  for (const [stroke, width] of [[INK, 9], [colour, 5]] as const) {
    const el = document.createElementNS(SVG_NS, "line");
    el.setAttribute("x1", x1.toFixed(1)); el.setAttribute("y1", y1.toFixed(1));
    el.setAttribute("x2", x2.toFixed(1)); el.setAttribute("y2", y2.toFixed(1));
    el.setAttribute("stroke", stroke);
    el.setAttribute("stroke-width", String(width));
    if (dash && stroke !== INK) el.setAttribute("stroke-dasharray", dash);
    g.append(el);
  }
  return g;
}

const img = (a: Animal) => `<img src="/animals/${a.id}.png" alt="" width="44" height="44" loading="lazy">`;
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

const COMPARE_TEXT = {
  same: (a: Animal) => `Two ${a.name}s: the same animal. You understand each other's instincts instantly, and you can also share the same blind spots.`,
  friend: (a: Animal, b: Animal) => `Friends. The ${a.name} and the ${b.name} share a colour on the wheel, so they see the world the same way and work well together.`,
  secret: (a: Animal, b: Animal) => `Secret friends. The ${a.name} and the ${b.name} share an inner-ring colour: a quiet, loyal bond that often runs deeper than it looks.`,
  clash: (a: Animal, b: Animal) => `A clash. The ${a.name} and the ${b.name} sit directly opposite, so their energies pull in opposite directions. It can work, with patience and respect for your differences.`,
  neutral: (a: Animal, b: Animal) => `Neutral. The ${a.name} and the ${b.name} are neither friends nor rivals on the wheel, so this bond is shaped by how you treat each other.`,
};

interface Focus { date?: string; year?: number }

export function initWheel(root: HTMLElement) {
  const svg = root.querySelector<SVGSVGElement>("svg.wheel")!;
  const lines = svg.querySelector<SVGGElement>(".lines")!;
  const details = root.querySelector<HTMLElement>("[data-details]")!;
  const centreImg = svg.querySelector<SVGImageElement>(".centre-img")!;
  const centreName = svg.querySelector<SVGTextElement>(".centre-name")!;
  const ruleButtons = [...root.querySelectorAll<HTMLButtonElement>(".rule")];
  const segs = [...svg.querySelectorAll<SVGGElement>(".seg")];
  const cols = [...svg.querySelectorAll<SVGGElement>(".year-col")];
  const yearCells = [...svg.querySelectorAll<SVGGElement>(".year")];

  let current = "";
  let compareWith = "";
  let focus: Focus = {};

  function setBadge(seg: SVGGElement, label: string | null) {
    const badge = seg.querySelector<SVGGElement>(".badge")!;
    badge.classList.toggle("is-on", !!label);
    if (!label) return;
    badge.querySelector("text")!.textContent = label;
    const w = label.length * 10 + 26;
    const rect = badge.querySelector("rect")!;
    rect.setAttribute("x", String(-w / 2));
    rect.setAttribute("width", String(w));
  }

  function clearWheel() {
    segs.forEach((g) => {
      g.classList.remove("is-self", "is-secret", "is-clash", "is-dim", "is-other");
      g.setAttribute("aria-pressed", "false");
      setBadge(g, null);
    });
    cols.forEach((c) => c.classList.remove("is-dim"));
    yearCells.forEach((c) => c.classList.remove("is-picked"));
    lines.replaceChildren();
  }

  function paint() {
    clearWheel();
    ruleButtons.forEach((b) => b.setAttribute("aria-pressed", "false"));
    const self = animalById(current);
    const friends = friendsOf(current);
    const secret = secretFriendOf(current);
    const clash = clashOf(current);
    const other = compareWith ? animalById(compareWith) : null;

    const related = new Set([self.id, secret.id, clash.id, ...friends.map((f) => f.id), ...(other ? [other.id] : [])]);
    segs.forEach((g) => {
      const id = g.dataset.id!;
      g.classList.toggle("is-self", id === self.id);
      g.classList.toggle("is-secret", id === secret.id || id === self.id);
      g.classList.toggle("is-clash", id === clash.id);
      g.classList.toggle("is-other", !!other && id === other.id && id !== self.id);
      g.classList.toggle("is-dim", !related.has(id));
      g.setAttribute("aria-pressed", String(id === self.id));
      const label =
        id === self.id ? "YOU" :
        friends.some((f) => f.id === id) ? "FRIEND" :
        id === secret.id ? "SECRET FRIEND" :
        id === clash.id ? "CLASH" :
        other && id === other.id ? "COMPARING" : null;
      setBadge(g, label);
    });
    cols.forEach((c) => c.classList.toggle("is-dim", !related.has(c.dataset.for!)));
    const picked = focus.year;
    yearCells.forEach((c) => c.classList.toggle("is-picked", picked !== undefined && Number(c.dataset.year) === picked));

    const group = GROUPS[self.group];
    const drawn = [
      line(self, friends[0], group.colour),
      line(friends[0], friends[1], group.colour),
      line(friends[1], self, group.colour),
      line(self, secret, "#d4af5a", "3 10"),
      line(self, clash, CLASH_RED, "14 9"),
    ];
    if (other && ![self.id, secret.id, clash.id, ...friends.map((f) => f.id)].includes(other.id)) {
      drawn.push(line(self, other, "#b79cf0", "1 9"));
    }
    lines.replaceChildren(...drawn);

    centreImg.setAttribute("href", `/animals/${self.id}.png`);
    centreName.textContent = self.name.toUpperCase();
    renderDetails(self, friends, secret, clash, other);
  }

  function renderDetails(self: Animal, friends: Animal[], secret: Animal, clash: Animal, other: Animal | null) {
    const group = GROUPS[self.group];
    const season = seasonOf(self.id);
    const pair = SECRET_FRIENDS.find((s) => s.pair.includes(self.id))!;
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
      yearBox = `<div class="year-box">${born}<p><strong>${y} is ${elementOfZodiacYear(y) === "Earth" ? "an" : "a"} ${elementOfZodiacYear(y)} ${self.name} year</strong> (${yinYangOfZodiacYear(y).toLowerCase()}).${span}</p></div>`;
    }

    const now = new Date().getFullYear();
    const ahead = Array.from({ length: 12 }, (_, k) => now + k);
    const good = ahead.filter((y) => [secret.id, ...friends.map((f) => f.id)].includes(animalOfZodiacYear(y).id));
    const hard = ahead.filter((y) => [clash.id, self.id].includes(animalOfZodiacYear(y).id));
    const hardText = hard
      .map((y) => (animalOfZodiacYear(y).id === self.id ? `${y} (your own ${self.name} year, Ben Ming Nian)` : `${y} (a ${clash.name} year, your clash)`))
      .join(" and ");

    const chips = ANIMALS.map(
      (a) => `<button type="button" data-compare="${a.id}" aria-pressed="${a.id === compareWith}">${img(a).replace('width="44" height="44"', 'width="30" height="30"')}${a.name}</button>`,
    ).join("");
    const verdict = other ? `<p class="verdict">${COMPARE_TEXT[relationBetween(self.id, other.id)](self, other)}</p>` : "";

    details.innerHTML = `
      ${yearBox}
      <h3>The ${self.name}</h3>
      <p class="sub">Number ${self.index + 1} on the wheel · ${self.yinYang} · ${season.season} animal (${season.element})</p>
      <p>${self.summary}</p>
      <ul class="tags">${self.traits.map((t) => `<li>${t}</li>`).join("")}</ul>

      <div class="rel" style="--c:${group.colour}">${img(friends[0])}<p><strong>Friends: ${list(friends.map((f) => f.name))}.</strong> ${group.meaning}
        <span class="why">Why: they share the ${self.name}'s colour and sit four places apart, joined by the triangle on the wheel. Together they are ${group.name}.</span></p></div>
      <div class="rel" style="--c:${pair.colour}">${img(secret)}<p><strong>Secret friend: the ${secret.name}.</strong> A quiet, loyal ally who often turns up when you least expect it.
        <span class="why">Why: the ${self.name} and the ${secret.name} share the same colour on the inner ring, joined by the gold dotted line.</span></p></div>
      <div class="rel" style="--c:${CLASH_RED}">${img(clash)}<p><strong>Clash: the ${clash.name}.</strong> Your energies pull in opposite directions. Not an enemy, but a bond that needs patience.
        <span class="why">Why: the ${clash.name} sits directly opposite the ${self.name}, on the red dashed line through the centre.</span></p></div>

      <div class="compare">
        <h4>How does the ${self.name} get on with…</h4>
        <div class="chips">${chips}</div>
        ${verdict}
      </div>

      <div class="years-note">
        <h4>${self.name} years on the wheel</h4>
        <p>${yearsOfAnimal(self, 1924, 2031).reverse().join(", ")}</p>
        <p><strong class="good">Supportive years ahead:</strong> ${good.slice(0, 4).join(", ")}, the years of your friends and secret friend.</p>
        <p><strong class="hard">Years to take extra care:</strong> ${hardText}.</p>
        <p class="muted">The ${season.season.toLowerCase()} (${season.element}) on the outer edge brings ${season.meaning}.</p>
      </div>`;
    delete details.dataset.glossaryDone;
    document.dispatchEvent(new Event("glossary:scan"));
  }

  function select(id: string, f: Focus = {}) {
    if (id !== current) compareWith = "";
    current = id;
    focus = f;
    paint();
  }

  /** Show one rule across the whole wheel at once. */
  function showRule(rule: "friends" | "secret" | "clash") {
    clearWheel();
    ruleButtons.forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.rule === rule)));
    let html = "";
    if (rule === "friends") {
      const groups = Object.values(GROUPS);
      lines.replaceChildren(
        ...groups.flatMap((g) => {
          const [a, b, c] = ANIMALS.filter((x) => x.group === g.id);
          return [line(a, b, g.colour), line(b, c, g.colour), line(c, a, g.colour)];
        }),
      );
      html = `<h3>Same colour = friends</h3><p>The wheel has four friend groups of three. Each group shares a colour, and its animals sit four places apart, making a triangle.</p>` +
        groups.map((g) => {
          const members = ANIMALS.filter((x) => x.group === g.id);
          return `<div class="rel" style="--c:${g.colour}">${img(members[0])}<p><strong>${list(members.map((m) => m.name))}: ${g.name}.</strong> ${g.meaning}</p></div>`;
        }).join("");
    } else if (rule === "secret") {
      lines.replaceChildren(...SECRET_FRIENDS.map((s) => line(animalById(s.pair[0]), animalById(s.pair[1]), s.colour)));
      segs.forEach((g) => g.classList.add("is-secret"));
      html = `<h3>Inner ring colour = secret friend</h3><p>Every animal has one secret friend: a hidden ally who shares its colour on the inner ring. The six pairs sit side by side across the wheel, like the rungs of a ladder.</p>` +
        SECRET_FRIENDS.map((s) => {
          const [a, b] = s.pair.map(animalById);
          return `<div class="rel" style="--c:${s.colour}">${img(a)}<p><strong>${a.name} and ${b.name}.</strong> A quiet, loyal bond.</p></div>`;
        }).join("");
    } else {
      lines.replaceChildren(...ANIMALS.slice(0, 6).map((a) => line(a, clashOf(a.id), CLASH_RED, "14 9")));
      segs.forEach((g) => g.classList.add("is-clash"));
      html = `<h3>Directly opposite = clash</h3><p>Animals straight across the wheel from each other clash: their energies pull in opposite directions. Their years clash too, so a year of your opposite animal can feel more challenging.</p>` +
        ANIMALS.slice(0, 6).map((a) => {
          const b = clashOf(a.id);
          return `<div class="rel" style="--c:${CLASH_RED}">${img(a)}<p><strong>${a.name} and ${b.name}.</strong> Six places apart, on opposite sides.</p></div>`;
        }).join("");
    }
    html += `<p class="muted">Tap any animal to see its own friends, secret friend and clash.</p>`;
    details.innerHTML = html;
    centreName.textContent = "";
    delete details.dataset.glossaryDone;
    document.dispatchEvent(new Event("glossary:scan"));
  }

  segs.forEach((g) => {
    g.addEventListener("click", () => select(g.dataset.id!));
    g.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); select(g.dataset.id!); }
    });
  });
  yearCells.forEach((c) => c.addEventListener("click", () => select(c.dataset.id!, { year: Number(c.dataset.year) })));
  ruleButtons.forEach((b) => b.addEventListener("click", () => showRule(b.dataset.rule as "friends" | "secret" | "clash")));

  details.addEventListener("click", (e) => {
    const btn = (e.target as HTMLElement).closest<HTMLButtonElement>("[data-compare]");
    if (!btn) return;
    compareWith = compareWith === btn.dataset.compare ? "" : btn.dataset.compare!;
    paint();
  });

  root.querySelector<HTMLFormElement>("form.finder")!.addEventListener("submit", (e) => {
    e.preventDefault();
    const date = root.querySelector<HTMLInputElement>("#wheel-date")!.value;
    if (!date) return;
    const sign = chineseSign(date);
    select(sign.animal.id, { date, year: sign.zodiacYear });
  });

  // start on this year's animal, with this year highlighted
  const today = chineseSign(new Date().toISOString().slice(0, 10));
  select(today.animal.id, { year: today.zodiacYear });
}
