// Brings the zodiac wheel to life: selecting an animal turns the wheel so it sits at the top,
// lights up its friends, secret friend and clash, and explains each one in plain words.
import { GROUPS, animalById, type Animal } from "../data/zodiac.ts";
import { chineseSign, friendsOf, secretFriendOf, clashOf, animalOfZodiacYear, elementOfZodiacYear, yinYangOfZodiacYear } from "../lib/chinese.ts";

const SVG_NS = "http://www.w3.org/2000/svg";
const CLASH_RED = "#ff5a5f";
const angleOf = (i: number) => ((-90 + i * 30) * Math.PI) / 180;
const pt = (i: number, r: number) => [r * Math.cos(angleOf(i)), r * Math.sin(angleOf(i))];

function line(a: Animal, b: Animal, colour: string, width: number, dash?: string) {
  const [x1, y1] = pt(a.index, 212);
  const [x2, y2] = pt(b.index, 212);
  const el = document.createElementNS(SVG_NS, "line");
  el.setAttribute("x1", x1.toFixed(1)); el.setAttribute("y1", y1.toFixed(1));
  el.setAttribute("x2", x2.toFixed(1)); el.setAttribute("y2", y2.toFixed(1));
  el.setAttribute("stroke", colour);
  el.setAttribute("stroke-width", String(width));
  el.setAttribute("stroke-opacity", "0.9");
  if (dash) el.setAttribute("stroke-dasharray", dash);
  el.setAttribute("filter", "url(#soft-glow)");
  return el;
}

const img = (a: Animal) => `<img src="/animals/${a.id}.png" alt="" width="36" height="36" loading="lazy">`;
const list = (xs: string[]) => (xs.length < 2 ? xs.join("") : `${xs.slice(0, -1).join(", ")} and ${xs.at(-1)}`);

export function initWheel(root: HTMLElement) {
  const svg = root.querySelector<SVGSVGElement>("svg.wheel")!;
  const lines = svg.querySelector<SVGGElement>(".lines")!;
  const details = root.querySelector<HTMLElement>("[data-details]")!;
  const centreImg = svg.querySelector<SVGImageElement>(".centre-img")!;
  const centreName = svg.querySelector<SVGTextElement>(".centre-name")!;
  let spin = 0; // running total, so the wheel always turns the short way round

  function select(id: string, birth?: { date: string; zodiacYear: number }) {
    const self = animalById(id);
    const friends = friendsOf(id);
    const secret = secretFriendOf(id);
    const clash = clashOf(id);
    const group = GROUPS[self.group];

    // turn the wheel so the chosen animal sits at the top
    const target = -self.index * 30;
    let delta = (target - spin) % 360;
    if (delta > 180) delta -= 360;
    if (delta < -180) delta += 360;
    spin += delta;
    svg.style.setProperty("--spin", `${spin}deg`);

    // highlight segments
    const related = new Set([id, secret.id, clash.id, ...friends.map((f) => f.id)]);
    svg.querySelectorAll<SVGGElement>(".seg").forEach((g) => {
      const sid = g.dataset.id!;
      g.classList.toggle("is-self", sid === id);
      g.classList.toggle("is-secret", sid === secret.id);
      g.classList.toggle("is-clash", sid === clash.id);
      g.classList.toggle("is-dim", !related.has(sid));
      g.setAttribute("aria-pressed", String(sid === id));
    });
    svg.querySelectorAll<SVGGElement>(".labels").forEach((g) => g.classList.toggle("is-dim", !related.has(g.dataset.for!)));
    svg.querySelectorAll<SVGTextElement>(".year").forEach((t) => t.classList.toggle("is-birth", !!birth && Number(t.dataset.year) === birth.zodiacYear));

    // relationship lines: a triangle for the friend group, a chord for the secret friend, a line through the centre for the clash
    lines.replaceChildren(
      line(self, friends[0], group.colour, 3),
      line(friends[0], friends[1], group.colour, 3),
      line(friends[1], self, group.colour, 3),
      line(self, secret, "#d4af5a", 3, "2 8"),
      line(self, clash, CLASH_RED, 3, "10 8"),
    );

    centreImg.setAttribute("href", `/animals/${self.id}.png`);
    centreName.textContent = self.name;

    // the explanation panel
    const now = new Date().getFullYear();
    const ahead = Array.from({ length: 12 }, (_, k) => now + k);
    const good = ahead.filter((y) => [secret.id, ...friends.map((f) => f.id)].includes(animalOfZodiacYear(y).id));
    const hard = ahead.filter((y) => [clash.id, self.id].includes(animalOfZodiacYear(y).id));
    const intro = birth
      ? `You were born in the year of the <strong>${elementOfZodiacYear(birth.zodiacYear)} ${self.name}</strong> (${birth.zodiacYear}), a ${yinYangOfZodiacYear(birth.zodiacYear).toLowerCase()} year.`
      : `${self.summary}`;

    details.innerHTML = `
      <h3>${self.name}</h3>
      <p>${intro}</p>
      <ul class="tags">${self.traits.map((t) => `<li>${t}</li>`).join("")}<li>${self.element} element</li><li>${self.yinYang}</li></ul>
      <div class="rel">${img(friends[0])}<p><strong>Friend group: ${group.element}, ${group.name}.</strong> ${self.name}, ${list(friends.map((f) => f.name))} share the same colour on the wheel, four places apart. ${group.meaning}</p></div>
      <div class="rel">${img(secret)}<p><strong>Secret friend: ${secret.name}.</strong> Shown by the matching colour on the inner ring. A quiet, loyal ally who often appears when least expected.</p></div>
      <div class="rel">${img(clash)}<p><strong>Clash: ${clash.name}.</strong> Directly opposite on the wheel, so their energies pull in opposite directions. Not an enemy for life, but a relationship that needs patience.</p></div>
      <p class="years-note"><strong>Supportive years ahead:</strong> ${good.slice(0, 4).join(", ")}.<br>
      <strong>Years for extra care:</strong> ${hard.join(" and ")} (the ${clash.name} clash year and your own ${self.name} year, known as Ben Ming Nian).</p>`;
    delete details.dataset.glossaryDone;
    document.dispatchEvent(new Event("glossary:scan"));
  }

  svg.querySelectorAll<SVGGElement>(".seg").forEach((g) => {
    g.addEventListener("click", () => select(g.dataset.id!));
    g.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); select(g.dataset.id!); }
    });
  });

  root.querySelector<HTMLFormElement>("form.finder")!.addEventListener("submit", (e) => {
    e.preventDefault();
    const date = (root.querySelector<HTMLInputElement>("#wheel-date")!).value;
    if (!date) return;
    const sign = chineseSign(date);
    select(sign.animal.id, { date, zodiacYear: sign.zodiacYear });
  });

  // start on this year's animal
  const thisYear = chineseSign(new Date().toISOString().slice(0, 10));
  select(thisYear.animal.id);
  details.insertAdjacentHTML("afterbegin", `<p class="muted">${new Date().getFullYear()} is the year of the ${thisYear.element} ${thisYear.animal.name}.</p>`);
}

