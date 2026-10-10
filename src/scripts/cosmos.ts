// Draws the living cosmos on one canvas. Everything moves very slowly on purpose:
// it should be felt rather than watched.

interface Star { x: number; y: number; r: number; layer: number; phase: number }
interface Planet {
  kind: "mars" | "saturn" | "jupiter" | "neptune" | "moon";
  x: number; // 0..1 of width
  y: number; // 0..1 of height
  size: number; // radius in px at 1000px wide
  vx: number; // fraction of width per minute
  vy: number;
}

const LAYER_SPEED = [2, 4, 8]; // px per second, far to near

/** Moon age in days (0 = new, ~14.8 = full), from the mean synodic month. Close enough for a background. */
function moonAge(now = Date.now()): number {
  const knownNew = Date.UTC(2000, 0, 6, 18, 14);
  const synodic = 29.530588853;
  return ((((now - knownNew) / 86400000) % synodic) + synodic) % synodic;
}

export function startCosmos(canvas: HTMLCanvasElement, dim: boolean) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  let w = 0, h = 0, stars: Star[] = [];
  let nebula: HTMLCanvasElement | null = null;

  const planets: Planet[] = [
    { kind: "saturn", x: 0.82, y: 0.22, size: 34, vx: -0.004, vy: 0.001 },
    { kind: "mars", x: 0.12, y: 0.68, size: 16, vx: 0.005, vy: -0.0015 },
    { kind: "jupiter", x: 0.62, y: 0.86, size: 44, vx: -0.003, vy: -0.0008 },
    { kind: "neptune", x: 0.3, y: 0.12, size: 12, vx: 0.003, vy: 0.001 },
    { kind: "moon", x: 0.92, y: 0.62, size: 22, vx: -0.002, vy: -0.0005 },
  ];

  function resize() {
    w = window.innerWidth; h = window.innerHeight;
    canvas.width = w * dpr; canvas.height = h * dpr;
    ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    const count = Math.round((w * h) / 2600);
    stars = Array.from({ length: count }, () => {
      const layer = Math.random() < 0.6 ? 0 : Math.random() < 0.75 ? 1 : 2;
      return { x: Math.random() * w, y: Math.random() * h, r: 0.4 + layer * 0.45 + Math.random() * 0.5, layer, phase: Math.random() * Math.PI * 2 };
    });
    nebula = makeNebula(w, h);
  }

  function makeNebula(width: number, height: number) {
    const c = document.createElement("canvas");
    c.width = width; c.height = height;
    const g = c.getContext("2d")!;
    const clouds = [
      { x: 0.25, y: 0.3, r: 0.55, col: "59, 31, 107" },
      { x: 0.75, y: 0.7, r: 0.5, col: "88, 40, 120" },
      { x: 0.6, y: 0.2, r: 0.35, col: "40, 50, 120" },
      { x: 0.15, y: 0.85, r: 0.3, col: "120, 50, 90" },
    ];
    for (const cl of clouds) {
      const R = cl.r * Math.max(width, height);
      const grad = g.createRadialGradient(cl.x * width, cl.y * height, 0, cl.x * width, cl.y * height, R);
      grad.addColorStop(0, `rgba(${cl.col}, 0.28)`);
      grad.addColorStop(0.5, `rgba(${cl.col}, 0.09)`);
      grad.addColorStop(1, `rgba(${cl.col}, 0)`);
      g.fillStyle = grad;
      g.fillRect(0, 0, width, height);
    }
    // a faint distant black hole: a dark core inside a thin glowing ring
    const bx = width * 0.08, by = height * 0.4, br = Math.min(width, height) * 0.05;
    const ring = g.createRadialGradient(bx, by, br * 0.7, bx, by, br * 2.2);
    ring.addColorStop(0, "rgba(0,0,0,0)");
    ring.addColorStop(0.18, "rgba(212,175,90,0.10)");
    ring.addColorStop(0.35, "rgba(142,107,217,0.05)");
    ring.addColorStop(1, "rgba(0,0,0,0)");
    g.fillStyle = ring; g.fillRect(0, 0, width, height);
    g.fillStyle = "rgba(4,3,8,0.9)"; g.beginPath(); g.arc(bx, by, br * 0.7, 0, Math.PI * 2); g.fill();
    return c;
  }

  function sphere(x: number, y: number, r: number, light: string, mid: string, dark: string) {
    const g = ctx!.createRadialGradient(x - r * 0.4, y - r * 0.4, r * 0.1, x, y, r);
    g.addColorStop(0, light); g.addColorStop(0.55, mid); g.addColorStop(1, dark);
    ctx!.fillStyle = g;
    ctx!.beginPath(); ctx!.arc(x, y, r, 0, Math.PI * 2); ctx!.fill();
  }

  function drawPlanet(p: Planet) {
    const scale = Math.max(0.6, Math.min(w, 1400) / 1000);
    const r = p.size * scale, x = p.x * w, y = p.y * h;
    const c = ctx!;
    c.save();
    c.globalAlpha = dim ? 0.35 : 0.9;
    if (p.kind === "mars") {
      c.shadowColor = "rgba(255, 80, 40, 0.8)"; c.shadowBlur = r * 1.6;
      sphere(x, y, r, "#ffb08a", "#d4502a", "#5a1608");
    } else if (p.kind === "neptune") {
      c.shadowColor = "rgba(90, 150, 255, 0.6)"; c.shadowBlur = r;
      sphere(x, y, r, "#b8dcff", "#3f7fd8", "#0d2350");
    } else if (p.kind === "jupiter") {
      sphere(x, y, r, "#f3dcb8", "#c79b6a", "#4a3020");
      c.save(); c.beginPath(); c.arc(x, y, r, 0, Math.PI * 2); c.clip();
      c.globalAlpha *= 0.35;
      for (let i = -3; i <= 3; i++) {
        c.fillStyle = i % 2 ? "#8a5a36" : "#f5e3c5";
        c.fillRect(x - r, y + i * r * 0.26 - r * 0.06, r * 2, r * 0.12);
      }
      c.restore();
    } else if (p.kind === "saturn") {
      const tilt = -0.35;
      const ring = (front: boolean) => {
        c.save(); c.translate(x, y); c.rotate(tilt);
        c.beginPath();
        c.ellipse(0, 0, r * 2.2, r * 0.6, 0, front ? 0 : Math.PI, front ? Math.PI : Math.PI * 2);
        c.lineWidth = r * 0.28; c.strokeStyle = "rgba(226, 204, 160, 0.75)"; c.stroke();
        c.lineWidth = r * 0.08; c.strokeStyle = "rgba(120, 100, 70, 0.6)";
        c.beginPath(); c.ellipse(0, 0, r * 1.85, r * 0.5, 0, front ? 0 : Math.PI, front ? Math.PI : Math.PI * 2); c.stroke();
        c.restore();
      };
      ring(false);
      sphere(x, y, r, "#fbe9c2", "#d7b77a", "#5c4422");
      ring(true);
    } else if (p.kind === "moon") {
      // the Moon in today's real phase
      sphere(x, y, r, "#3a3848", "#24222f", "#121019"); // the unlit side, faintly visible
      const age = moonAge();
      const k = Math.cos((age / 29.530588) * Math.PI * 2); // 1 = new, -1 = full
      const waxing = age < 14.765;
      const side = waxing ? 1 : -1; // waxing: right side lit (as seen from the northern hemisphere)
      c.save();
      c.beginPath();
      // the lit half-disc edge
      c.arc(x, y, r, -Math.PI / 2, Math.PI / 2, side < 0);
      // back along the terminator: bulges toward the lit side for a crescent, away for a gibbous Moon
      const towardLit = k > 0;
      c.ellipse(x, y, Math.abs(k) * r, r, 0, Math.PI / 2, -Math.PI / 2, towardLit === side > 0);
      c.closePath();
      c.clip();
      sphere(x, y, r, "#ffffff", "#d9d6e4", "#8a869c");
      c.restore();
    }
    c.restore();
  }

  let last = performance.now();
  let running = true;
  const frameGap = 1000 / 30;

  function frame(now: number) {
    if (!running) return;
    const dt = Math.min(now - last, 100) / 1000;
    if (now - last < frameGap && !reduceMotion) { requestAnimationFrame(frame); return; }
    last = now;
    const c = ctx!;
    c.fillStyle = "#07060b"; c.fillRect(0, 0, w, h);
    if (nebula) { c.globalAlpha = dim ? 0.5 : 1; c.drawImage(nebula, 0, 0, w, h); c.globalAlpha = 1; }
    const t = now / 1000;
    for (const s of stars) {
      s.x -= LAYER_SPEED[s.layer] * dt * 0.6;
      if (s.x < -2) s.x = w + 2;
      const twinkle = 0.55 + 0.45 * Math.sin(t * (0.6 + s.layer * 0.3) + s.phase);
      c.globalAlpha = (dim ? 0.35 : 0.8) * twinkle;
      c.fillStyle = s.layer === 2 ? "#fff6e0" : "#e8e4ff";
      c.beginPath(); c.arc(s.x, s.y, s.r, 0, Math.PI * 2); c.fill();
    }
    c.globalAlpha = 1;
    for (const p of planets) {
      p.x += (p.vx * dt) / 60; p.y += (p.vy * dt) / 60;
      if (p.x < -0.1) p.x = 1.1; if (p.x > 1.1) p.x = -0.1;
      if (p.y < -0.1) p.y = 1.1; if (p.y > 1.1) p.y = -0.1;
      drawPlanet(p);
    }
    if (!reduceMotion) requestAnimationFrame(frame);
  }

  resize();
  window.addEventListener("resize", () => { resize(); if (reduceMotion) frame(performance.now()); });
  document.addEventListener("visibilitychange", () => {
    running = !document.hidden;
    if (running) { last = performance.now(); requestAnimationFrame(frame); }
  });
  requestAnimationFrame(frame);
}
