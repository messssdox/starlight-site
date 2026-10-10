// Draws the living cosmos on one canvas. Some stars twinkle brightly, the planets turn on their
// axes as they drift, and a black hole draws in light and passing stars. It all moves slowly
// enough to be calm rather than distracting.

/** `spark` stars twinkle strongly, with a little cross of light at their brightest. */
interface Star { x: number; y: number; r: number; layer: number; phase: number; spark: boolean; speed: number }
type Kind = "mars" | "saturn" | "jupiter" | "neptune" | "moon";
interface Planet {
  kind: Kind;
  x: number; // 0..1 of width
  y: number; // 0..1 of height
  size: number; // radius in px at 1000px wide
  vx: number; // fraction of width per minute
  vy: number;
  spin: number; // seconds for one turn on its axis (0 = does not turn)
  tilt: number; // axis lean across the screen, radians
  lean: number; // axis lean toward us, radians
}
/** Something falling into the black hole: a clump of the glowing disc, or a captured star. */
interface Mote { a: number; d: number; star: boolean; size: number; life: number }

const LAYER_SPEED = [2, 4, 8]; // px per second, far to near
const TAU = Math.PI * 2;

/** Moon age in days (0 = new, ~14.8 = full), from the mean synodic month. Close enough for a background. */
function moonAge(now = Date.now()): number {
  const knownNew = Date.UTC(2000, 0, 6, 18, 14);
  const synodic = 29.530588853;
  return ((((now - knownNew) / 86400000) % synodic) + synodic) % synodic;
}

// ---- Surface textures, made once from noise so no images need downloading ----

type RGB = [number, number, number];
const mix = (a: RGB, b: RGB, t: number): RGB => {
  const k = Math.max(0, Math.min(1, t));
  return [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k, a[2] + (b[2] - a[2]) * k];
};
const smooth = (e0: number, e1: number, x: number) => {
  const t = Math.max(0, Math.min(1, (x - e0) / (e1 - e0)));
  return t * t * (3 - 2 * t);
};

function seeded(seed: number) {
  return () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296);
}

/** Smooth noise that wraps left to right, so a texture joins up as the planet turns. Returns 0..1. */
function fbm(seed: number, base: number, octaves = 5) {
  const rand = seeded(seed);
  const layers = Array.from({ length: octaves }, (_, o) => {
    const gx = base * 2 ** o, gy = Math.max(2, (base / 2) * 2 ** o);
    return { gx, gy, g: Float32Array.from({ length: gx * (gy + 1) }, rand) };
  });
  return (u: number, v: number) => {
    let sum = 0, amp = 0.5, norm = 0;
    for (const { gx, gy, g } of layers) {
      const x = u * gx, y = Math.min(v * gy, gy - 1e-6);
      const x0 = Math.floor(x), y0 = Math.floor(y);
      const fx = x - x0, fy = y - y0;
      const sx = fx * fx * (3 - 2 * fx), sy = fy * fy * (3 - 2 * fy);
      const xa = x0 % gx, xb = (x0 + 1) % gx;
      const a = g[y0 * gx + xa], b = g[y0 * gx + xb], c = g[(y0 + 1) * gx + xa], d = g[(y0 + 1) * gx + xb];
      sum += amp * (a + (b - a) * sx + (c - a) * sy + (a - b - c + d) * sx * sy);
      norm += amp; amp *= 0.5;
    }
    return sum / norm;
  };
}

interface Texture { w: number; h: number; rgb: Uint8ClampedArray }
function texture(w: number, h: number, paint: (u: number, v: number) => RGB): Texture {
  const rgb = new Uint8ClampedArray(w * h * 3);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const c = paint(x / w, (y + 0.5) / h);
      const i = (y * w + x) * 3;
      rgb[i] = c[0]; rgb[i + 1] = c[1]; rgb[i + 2] = c[2];
    }
  }
  return { w, h, rgb };
}
/** Distance across the wrap seam, for spots that sit near the join. */
const wrapDist = (u: number, at: number) => { const d = Math.abs(u - at) % 1; return Math.min(d, 1 - d); };

function jupiterTexture() {
  const n = fbm(11, 6), fine = fbm(12, 16, 4);
  const cream: RGB = [240, 226, 200], tan: RGB = [205, 165, 120], brown: RGB = [150, 98, 64], rust: RGB = [196, 120, 78];
  return texture(512, 256, (u, v) => {
    const warp = (n(u, v) - 0.5) * 0.07 + (fine(u, v) - 0.5) * 0.025;
    const lat = v + warp;
    const bands = Math.sin(lat * Math.PI * 15) * 0.5 + 0.5;
    const broad = Math.sin(lat * Math.PI * 6 + 0.4) * 0.5 + 0.5;
    let c = mix(brown, cream, bands * 0.55 + broad * 0.45);
    c = mix(c, tan, fine(u, v) * 0.5);
    c = mix(c, rust, smooth(0.55, 0.8, n(u + 0.3, v)) * 0.35);
    c = mix(c, [235, 230, 215], smooth(0.08, 0, Math.abs(v - 0.5)) * 0.35); // bright equatorial zone
    c = mix(c, [130, 115, 105], smooth(0.32, 0.5, Math.abs(v - 0.5)) * 0.55); // greyer poles
    // the Great Red Spot, with a pale ring of cloud around it
    const du = wrapDist(u, 0.3) / 0.075, dv = (v - 0.64) / 0.045, e = Math.sqrt(du * du + dv * dv);
    c = mix(c, [236, 214, 186], smooth(1.5, 1.05, e) * 0.6);
    c = mix(c, [192, 88, 58], smooth(1.05, 0.4, e) * 0.9);
    return c;
  });
}

function saturnTexture() {
  const n = fbm(21, 5), fine = fbm(22, 14, 3);
  const pale: RGB = [244, 228, 190], gold: RGB = [214, 182, 122], dusk: RGB = [176, 140, 92];
  return texture(256, 128, (u, v) => {
    const lat = v + (n(u, v) - 0.5) * 0.03;
    const bands = Math.sin(lat * Math.PI * 18) * 0.5 + 0.5;
    let c = mix(gold, pale, bands * 0.7 + fine(u, v) * 0.3);
    c = mix(c, dusk, smooth(0.25, 0.5, Math.abs(v - 0.5)) * 0.6);
    return c;
  });
}

function marsTexture() {
  const land = fbm(31, 5), dust = fbm(32, 18, 4);
  const rust: RGB = [196, 86, 44], light: RGB = [226, 140, 92], dark: RGB = [98, 42, 22];
  return texture(256, 128, (u, v) => {
    const h = land(u, v);
    let c = mix(rust, light, dust(u, v) * 0.8 - 0.1);
    c = mix(c, dark, smooth(0.52, 0.66, h) * 0.75); // dark plains
    // ice caps at the poles, with ragged edges
    const pole = Math.abs(v - 0.5) * 2 + (dust(u, v) - 0.5) * 0.12;
    c = mix(c, [248, 244, 240], smooth(0.84, 0.9, pole));
    return c;
  });
}

function neptuneTexture() {
  const n = fbm(41, 5), wisps = fbm(42, 20, 3);
  const deep: RGB = [36, 70, 170], blue: RGB = [70, 120, 220], pale: RGB = [140, 185, 245];
  return texture(256, 128, (u, v) => {
    const lat = v + (n(u, v) - 0.5) * 0.05;
    let c = mix(deep, blue, Math.sin(lat * Math.PI * 9) * 0.25 + 0.5 + (n(u, v) - 0.5) * 0.5);
    c = mix(c, pale, smooth(0.62, 0.75, wisps(u, v * 0.4)) * 0.7); // high white clouds
    const du = wrapDist(u, 0.65) / 0.06, dv = (v - 0.62) / 0.04;
    c = mix(c, [18, 34, 100], smooth(1, 0.3, Math.sqrt(du * du + dv * dv)) * 0.8); // the dark spot
    return c;
  });
}

function moonTexture() {
  const maria = fbm(51, 4), grit = fbm(52, 24, 4);
  const rand = seeded(53);
  const craters = Array.from({ length: 70 }, () => ({ u: rand(), v: 0.1 + rand() * 0.8, r: 0.006 + rand() ** 3 * 0.04 }));
  return texture(256, 128, (u, v) => {
    const g = 150 + (grit(u, v) - 0.5) * 70;
    let c: RGB = [g + 30, g + 28, g + 24];
    c = mix(c, [92, 90, 96], smooth(0.5, 0.6, maria(u, v)) * 0.8);
    for (const k of craters) {
      const d = Math.hypot(wrapDist(u, k.u) * 2, v - k.v) / k.r;
      if (d < 1.25) c = mix(c, d > 0.85 ? [225, 222, 215] : [110, 108, 112], d > 0.85 ? (1.25 - d) * 1.4 : 0.35);
    }
    return c;
  });
}

// ---- Sphere maps: which part of the texture each pixel of the disc shows ----

interface SphereMap {
  size: number; // device pixels across
  n: number;
  pix: Int32Array; // pixel index in the image
  u: Float32Array; // longitude as 0..0.5 of the texture (one hemisphere shows)
  v: Int32Array; // texture row
  nx: Float32Array; ny: Float32Array; nz: Float32Array; // surface normal facing us
  edge: Uint8ClampedArray; // soft edge alpha
  canvas: HTMLCanvasElement;
  img: ImageData;
}

function sphereMap(radius: number, tex: Texture, tilt: number, lean: number): SphereMap {
  const size = Math.max(4, Math.ceil(radius * 2));
  const R = size / 2;
  const cap = size * size;
  const pix = new Int32Array(cap), u = new Float32Array(cap), v = new Int32Array(cap);
  const nx = new Float32Array(cap), ny = new Float32Array(cap), nz = new Float32Array(cap), edge = new Uint8ClampedArray(cap);
  const ct = Math.cos(tilt), st = Math.sin(tilt), cl = Math.cos(lean), sl = Math.sin(lean);
  let n = 0;
  for (let py = 0; py < size; py++) {
    for (let px = 0; px < size; px++) {
      const x = (px + 0.5 - R) / R, y = (py + 0.5 - R) / R;
      const d = Math.sqrt(x * x + y * y);
      if (d > 1 + 1 / R) continue;
      const z = Math.sqrt(Math.max(0, 1 - d * d));
      // turn the view into the planet's own frame: undo the lean across the screen, then toward us
      const x1 = x * ct + y * st, y1 = -x * st + y * ct;
      const y2 = y1 * cl - z * sl, z2 = y1 * sl + z * cl;
      const lat = Math.asin(Math.max(-1, Math.min(1, y2)));
      const lon = Math.atan2(x1, z2);
      pix[n] = py * size + px;
      u[n] = lon / TAU;
      v[n] = Math.min(tex.h - 1, Math.max(0, Math.floor((lat / Math.PI + 0.5) * tex.h)));
      nx[n] = x; ny[n] = y; nz[n] = z;
      edge[n] = Math.max(0, Math.min(1, (1 - d) * R + 0.5)) * 255;
      n++;
    }
  }
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const img = canvas.getContext("2d")!.createImageData(size, size);
  return { size, n, pix, u, v, nx, ny, nz, edge, canvas, img };
}

/** Paints the disc: the texture turned by `turn` (0..1), lit from direction `L`. */
function paintSphere(m: SphereMap, tex: Texture, turn: number, L: [number, number, number], ambient: number, haze: RGB | null) {
  const out = m.img.data;
  const { w, rgb } = tex;
  const shift = ((turn % 1) + 1) % 1;
  for (let k = 0; k < m.n; k++) {
    let tx = Math.floor((m.u[k] + shift) * w) % w;
    if (tx < 0) tx += w;
    const ti = (m.v[k] * w + tx) * 3;
    const nz = m.nz[k];
    const lit = Math.max(0, m.nx[k] * L[0] + m.ny[k] * L[1] + nz * L[2]);
    const limb = 0.55 + 0.45 * Math.sqrt(nz); // edges of a ball look darker
    const s = (ambient + (1 - ambient) * lit) * limb;
    const o = m.pix[k] * 4;
    let r = rgb[ti] * s, g = rgb[ti + 1] * s, b = rgb[ti + 2] * s;
    if (haze) {
      // a thin atmosphere glows at the lit edge
      const rim = (1 - nz) ** 3 * lit * 0.9;
      r += haze[0] * rim; g += haze[1] * rim; b += haze[2] * rim;
    }
    out[o] = r; out[o + 1] = g; out[o + 2] = b; out[o + 3] = m.edge[k];
  }
  m.canvas.getContext("2d")!.putImageData(m.img, 0, 0);
}

const SUN: [number, number, number] = (() => {
  const v = [-0.55, -0.35, 0.76];
  const l = Math.hypot(v[0], v[1], v[2]);
  return [v[0] / l, v[1] / l, v[2] / l];
})();

export function startCosmos(canvas: HTMLCanvasElement, dim: boolean) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  let w = 0, h = 0, stars: Star[] = [];
  let nebula: HTMLCanvasElement | null = null;

  const planets: Planet[] = [
    { kind: "saturn", x: 0.82, y: 0.22, size: 34, vx: -0.09, vy: 0.012, spin: 30, tilt: -0.35, lean: 0.3 },
    { kind: "mars", x: 0.12, y: 0.72, size: 16, vx: 0.12, vy: -0.018, spin: 36, tilt: 0.42, lean: 0.15 },
    { kind: "jupiter", x: 0.62, y: 0.86, size: 44, vx: -0.07, vy: -0.01, spin: 24, tilt: 0.05, lean: 0.05 },
    { kind: "neptune", x: 0.3, y: 0.12, size: 12, vx: 0.1, vy: 0.014, spin: 32, tilt: 0.5, lean: 0.2 },
    { kind: "moon", x: 0.92, y: 0.62, size: 22, vx: -0.06, vy: -0.008, spin: 0, tilt: 0.1, lean: 0.1 },
  ];
  const textures: Partial<Record<Kind, Texture>> = {};
  const maps: Partial<Record<Kind, SphereMap>> = {};
  const HAZE: Partial<Record<Kind, RGB>> = { mars: [255, 150, 110], neptune: [150, 200, 255], jupiter: [255, 235, 200], saturn: [255, 240, 200] };
  const MAKERS: Record<Kind, () => Texture> = { jupiter: jupiterTexture, saturn: saturnTexture, mars: marsTexture, neptune: neptuneTexture, moon: moonTexture };

  // The black hole sits to the left; its glowing disc is made of clumps that orbit and fall in.
  const hole = { x: 0, y: 0, r: 0, tilt: -0.22 };
  let motes: Mote[] = [];
  let nextStar = 0;

  const planetScale = () => Math.max(0.6, Math.min(w, 1400) / 1000);

  function buildMaps() {
    for (const p of planets) {
      const tex = textures[p.kind];
      if (tex) maps[p.kind] = sphereMap(p.size * planetScale() * dpr, tex, p.tilt, p.lean);
    }
  }

  // Textures take a moment to make, so make one per idle moment; plain balls show until then.
  const idle = (fn: () => void) => ("requestIdleCallback" in window ? (window as any).requestIdleCallback(fn, { timeout: 400 }) : setTimeout(fn, 30));
  const queue = (["jupiter", "saturn", "moon", "mars", "neptune"] as Kind[]);
  function makeNext() {
    const kind = queue.shift();
    if (!kind) return;
    textures[kind] = MAKERS[kind]();
    const p = planets.find((x) => x.kind === kind)!;
    maps[kind] = sphereMap(p.size * planetScale() * dpr, textures[kind]!, p.tilt, p.lean);
    if (reduceMotion) frame(performance.now());
    idle(makeNext);
  }

  function diskMote(spread: boolean): Mote {
    return { a: Math.random() * TAU, d: hole.r * (spread ? 1.4 + Math.random() * 3.6 : 4.4 + Math.random() * 0.8), star: false, size: 0.4 + Math.random() * 0.9, life: 1 };
  }

  function resize() {
    w = window.innerWidth; h = window.innerHeight;
    canvas.width = w * dpr; canvas.height = h * dpr;
    ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    const count = Math.round((w * h) / 2600);
    stars = Array.from({ length: count }, () => {
      const layer = Math.random() < 0.6 ? 0 : Math.random() < 0.75 ? 1 : 2;
      const spark = Math.random() < 0.12;
      return { x: Math.random() * w, y: Math.random() * h, r: 0.4 + layer * 0.45 + Math.random() * 0.5 + (spark ? 0.4 : 0), layer, phase: Math.random() * TAU, spark, speed: 1 + Math.random() * 1.6 };
    });
    hole.r = Math.max(13, Math.min(w, h) * 0.034);
    hole.x = Math.max(w * 0.1, hole.r * 5.5);
    hole.y = h * 0.42;
    motes = Array.from({ length: 420 }, () => diskMote(true));
    nebula = makeNebula(w, h);
    buildMaps();
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
    return c;
  }

  // ---- the black hole ----

  /** Where an orbiting clump at angle `a`, distance `d` appears: the disc is seen nearly edge-on. */
  function onDisc(a: number, d: number): [number, number] {
    const x = Math.cos(a) * d, y = Math.sin(a) * d * 0.19;
    const ct = Math.cos(hole.tilt), st = Math.sin(hole.tilt);
    return [hole.x + x * ct - y * st, hole.y + x * st + y * ct];
  }

  /** Hot white near the edge of the hole, cooling to orange and deep red further out. */
  function heat(d: number): string {
    const t = Math.max(0, Math.min(1, (d / hole.r - 1.2) / 3.8));
    const c = t < 0.4 ? mix([255, 246, 225], [255, 176, 90], t / 0.4) : mix([255, 176, 90], [190, 70, 80], (t - 0.4) / 0.6);
    return `rgb(${c[0] | 0},${c[1] | 0},${c[2] | 0})`;
  }

  /** Moves everything falling in. Closer in, things orbit faster and fall faster, as in real gravity. */
  function stepHole(dt: number) {
    const r = hole.r;
    for (const m of motes) {
      const near = r / m.d;
      m.a += (m.star ? 0.9 : 1.5) * near ** 1.5 * dt;
      m.d -= r * (m.star ? 0.25 + 2.2 * near * near : 0.02 + 0.5 * near ** 3) * dt;
      if (m.d < r * 1.08) {
        if (m.star) m.life = 0;
        else Object.assign(m, diskMote(false));
      }
    }
    motes = motes.filter((m) => m.life > 0);
    // now and then a star from further out is pulled in
    nextStar -= dt;
    if (nextStar <= 0) {
      nextStar = 0.5 + Math.random() * 0.9;
      motes.push({ a: Math.random() * TAU, d: r * (7 + Math.random() * 3), star: true, size: 0.7 + Math.random() * 0.9, life: 1 });
    }
  }

  function drawMote(m: Mote, front: boolean, alpha: number) {
    const c = ctx!;
    const near = hole.r / m.d;
    const sweep = Math.min(0.9, (m.star ? 0.9 : 1.5) * near ** 1.5 * (m.star ? 0.6 : 0.22)); // a streak along its path
    const behind = Math.sin(m.a) < 0;
    if (behind === front) return;
    const steps = 4;
    c.beginPath();
    for (let s = 0; s <= steps; s++) {
      const a = m.a - (sweep * s) / steps;
      const dd = m.d + (m.star ? hole.r * 0.25 * near * s : 0);
      const [x, y] = m.star ? [hole.x + Math.cos(a) * dd, hole.y + Math.sin(a) * dd] : onDisc(a, dd);
      if (s === 0) c.moveTo(x, y); else c.lineTo(x, y);
    }
    // the side spinning toward us looks brighter
    const beam = m.star ? 1 : 0.65 + 0.55 * -Math.cos(m.a);
    const fade = smooth(1.05, 1.6, m.d / hole.r);
    const appear = m.star ? smooth(10, 7.5, m.d / hole.r) : 1;
    c.globalAlpha = alpha * beam * fade * appear * (m.star ? 0.9 : 0.55);
    c.strokeStyle = m.star ? (near > 0.35 ? heat(m.d * 0.8) : "#eef0ff") : heat(m.d);
    c.lineWidth = m.size * (m.star ? 1 : 1.3);
    c.lineCap = "round";
    c.stroke();
  }

  /** The smooth glow of the disc under the clumps, the near half drawn over the hole's shadow. */
  function disc(front: boolean, alpha: number) {
    const c = ctx!;
    const { x, y, r } = hole;
    c.save();
    c.translate(x, y); c.rotate(hole.tilt); c.scale(1, 0.19);
    const g = c.createRadialGradient(0, 0, r * 1.1, 0, 0, r * 5.2);
    g.addColorStop(0, "rgba(255,240,215,1)");
    g.addColorStop(0.1, "rgba(255,186,105,0.8)");
    g.addColorStop(0.4, "rgba(220,100,90,0.3)");
    g.addColorStop(1, "rgba(120,40,90,0)");
    c.globalAlpha = alpha * (front ? 0.6 : 1);
    c.fillStyle = g;
    c.beginPath();
    c.arc(0, 0, r * 5.2, front ? 0 : Math.PI, front ? Math.PI : TAU);
    c.arc(0, 0, r * 1.1, front ? Math.PI : TAU, front ? 0 : Math.PI, true);
    c.closePath(); c.fill();
    c.restore();
  }

  function drawHole(alpha: number) {
    const c = ctx!;
    const { x, y, r } = hole;
    c.save();
    // a soft glow of light bent round the hole
    const glow = c.createRadialGradient(x, y, r, x, y, r * 6);
    glow.addColorStop(0, "rgba(255,190,120,0.18)");
    glow.addColorStop(0.25, "rgba(200,110,150,0.07)");
    glow.addColorStop(1, "rgba(0,0,0,0)");
    c.globalAlpha = alpha;
    c.fillStyle = glow; c.fillRect(x - r * 6, y - r * 6, r * 12, r * 12);
    c.globalCompositeOperation = "lighter";
    disc(false, alpha);
    for (const m of motes) drawMote(m, false, alpha);
    // the far side of the disc, bent up over the top of the hole and faintly under it
    c.globalCompositeOperation = "lighter";
    for (const [k, a0, a1, op] of [[1, Math.PI, TAU, 1], [-1, 0, Math.PI, 0.35]] as const) {
      const ring = c.createRadialGradient(x, y, r * 1.02, x, y, r * 1.85);
      ring.addColorStop(0, "rgba(255,240,215,0.95)");
      ring.addColorStop(0.3, "rgba(255,170,90,0.5)");
      ring.addColorStop(1, "rgba(160,60,80,0)");
      c.globalAlpha = alpha * op;
      c.fillStyle = ring;
      c.beginPath();
      c.ellipse(x, y, r * 1.9, r * (k > 0 ? 1.75 : 1.4), hole.tilt, a0, a1);
      c.ellipse(x, y, r * 1.02, r * 1.02, hole.tilt, a1, a0, true);
      c.closePath(); c.fill();
    }
    // the shadow: nothing comes back out
    c.globalCompositeOperation = "source-over";
    c.globalAlpha = Math.min(1, alpha * 1.4);
    c.fillStyle = "#000";
    c.beginPath(); c.arc(x, y, r, 0, TAU); c.fill();
    // the photon ring, light circling right at the edge
    c.globalCompositeOperation = "lighter";
    c.globalAlpha = alpha * 0.85;
    c.strokeStyle = "rgba(255,226,180,0.9)";
    c.lineWidth = Math.max(1, r * 0.06);
    c.beginPath(); c.arc(x, y, r * 1.04, 0, TAU); c.stroke();
    disc(true, alpha);
    for (const m of motes) drawMote(m, true, alpha);
    c.restore();
  }

  /** Stars that drift close are bent outward (lensing); ones that drift right up to it are pulled in. */
  function bendStar(s: Star): [number, number, number] | null {
    const dx = s.x - hole.x, dy = s.y - hole.y;
    const d = Math.hypot(dx, dy);
    const reach = hole.r * 7;
    if (d > reach) return [s.x, s.y, 1];
    if (d < hole.r * 3.2 && !reduceMotion) {
      motes.push({ a: Math.atan2(dy, dx), d, star: true, size: s.r * 1.2, life: 1 });
      s.x = w + 2; s.y = Math.random() * h;
      return null;
    }
    const E = hole.r * 1.6;
    const seen = (d + Math.sqrt(d * d + 4 * E * E)) / 2;
    const k = seen / Math.max(d, 0.001);
    return [hole.x + dx * k, hole.y + dy * k, Math.min(2.5, k)];
  }

  // ---- planets ----

  function sphere(x: number, y: number, r: number, light: string, mid: string, dark: string) {
    const g = ctx!.createRadialGradient(x - r * 0.4, y - r * 0.4, r * 0.1, x, y, r);
    g.addColorStop(0, light); g.addColorStop(0.55, mid); g.addColorStop(1, dark);
    ctx!.fillStyle = g;
    ctx!.beginPath(); ctx!.arc(x, y, r, 0, TAU); ctx!.fill();
  }

  const FALLBACK: Record<Kind, [string, string, string]> = {
    mars: ["#ffb08a", "#d4502a", "#5a1608"],
    neptune: ["#b8dcff", "#3f7fd8", "#0d2350"],
    jupiter: ["#f3dcb8", "#c79b6a", "#4a3020"],
    saturn: ["#fbe9c2", "#d7b77a", "#5c4422"],
    moon: ["#e8e6ee", "#a9a6b6", "#3a3848"],
  };

  /** Saturn's rings, banded like the real ones, drawn in two halves so the planet sits between. */
  function rings(x: number, y: number, r: number, tilt: number, open: number, front: boolean) {
    const c = ctx!;
    const bands: [number, number, string][] = [
      [1.24, 1.52, "rgba(150,130,105,0.35)"], // faint inner ring
      [1.53, 1.94, "rgba(232,212,172,0.85)"], // bright main ring
      [2.02, 2.24, "rgba(206,184,146,0.7)"], // outer ring, past the dark gap
      [2.12, 2.14, "rgba(10,8,12,0.6)"], // a thin gap within it
    ];
    c.save();
    c.translate(x, y); c.rotate(tilt); c.scale(1, open);
    for (const [a, b, col] of bands) {
      c.beginPath();
      c.arc(0, 0, ((a + b) / 2) * r, front ? 0 : Math.PI, front ? Math.PI : TAU);
      c.lineWidth = (b - a) * r; c.strokeStyle = col; c.stroke();
    }
    c.restore();
  }

  /** Jupiter's four big moons, orbiting at their real speeds relative to each other (sped up a lot),
   *  seen almost edge-on so they pass in front of the planet and behind it. */
  const GALILEAN: { orbit: number; days: number; size: number; colour: [string, string, string]; start: number }[] = [
    { orbit: 1.6, days: 1.77, size: 0.075, colour: ["#fff2b0", "#e0b850", "#6a4a14"], start: 0.4 }, // Io
    { orbit: 2.1, days: 3.55, size: 0.065, colour: ["#ffffff", "#d8cdb8", "#5a5040"], start: 2.2 }, // Europa
    { orbit: 2.8, days: 7.15, size: 0.11, colour: ["#e8e0d4", "#9a8a78", "#3a3028"], start: 4.1 }, // Ganymede
    { orbit: 3.7, days: 16.69, size: 0.1, colour: ["#b8b0a8", "#6a625a", "#24201c"], start: 5.6 }, // Callisto
  ];
  function moons(x: number, y: number, r: number, t: number, front: boolean) {
    const c = ctx!;
    const tilt = 0.05;
    for (const mo of GALILEAN) {
      const a = mo.start + (reduceMotion ? 0 : (t / (mo.days * 7)) * TAU);
      const ahead = Math.sin(a) > 0; // the near half of the orbit
      if (ahead !== front) continue;
      const ox = Math.cos(a) * mo.orbit * r, oy = Math.sin(a) * mo.orbit * r * 0.08;
      const mx = x + ox * Math.cos(tilt) - oy * Math.sin(tilt);
      const my = y + ox * Math.sin(tilt) + oy * Math.cos(tilt);
      const mr = Math.max(1.2, mo.size * r);
      const [l, m, d] = mo.colour;
      sphere(mx, my, mr, l, m, d);
      // its small shadow on Jupiter's clouds when passing in front
      if (front && Math.abs(ox) < r * 0.85) {
        c.save(); c.globalAlpha *= 0.5; c.fillStyle = "#000";
        c.beginPath(); c.arc(mx + r * 0.12, my + r * 0.06, mr * 0.9, 0, TAU); c.fill(); c.restore();
      }
    }
  }

  /** `t` is seconds; `i` gives each planet its own gentle float so they never move in step. */
  function drawPlanet(p: Planet, t: number, i: number) {
    const scale = planetScale();
    const move = reduceMotion ? 0 : 1;
    const r = p.size * scale;
    const x = p.x * w + move * Math.cos(t * 0.23 + i * 1.7) * 5 * scale;
    const y = p.y * h + move * Math.sin(t * 0.31 + i * 2.3) * 8 * scale;
    const c = ctx!;
    c.save();
    c.globalAlpha = dim ? 0.35 : 0.92;
    const haze = HAZE[p.kind];
    if (haze && p.kind !== "saturn") {
      const g = c.createRadialGradient(x, y, r * 0.9, x, y, r * 1.45);
      g.addColorStop(0, `rgba(${haze[0]},${haze[1]},${haze[2]},0.22)`);
      g.addColorStop(1, `rgba(${haze[0]},${haze[1]},${haze[2]},0)`);
      c.fillStyle = g; c.fillRect(x - r * 1.5, y - r * 1.5, r * 3, r * 3);
    }
    if (p.kind === "saturn") rings(x, y, r, p.tilt, Math.sin(p.lean) + 0.02, false);
    if (p.kind === "jupiter") moons(x, y, r, t, false);
    const m = maps[p.kind], tex = textures[p.kind];
    if (m && tex) {
      let light = SUN, ambient = 0.05, turn = p.spin && !reduceMotion ? t / p.spin : 0.2;
      if (p.kind === "moon") {
        // lit from where the Sun really is today: from behind at new Moon, from the right while waxing
        const phi = (moonAge() / 29.530588853) * TAU;
        light = [Math.sin(phi), 0, -Math.cos(phi)];
        ambient = 0.12; turn = 0;
      }
      paintSphere(m, tex, turn, light, ambient, haze ?? null);
      c.drawImage(m.canvas, x - r, y - r, (m.size / dpr), (m.size / dpr));
    } else {
      const [a, b, d] = FALLBACK[p.kind];
      sphere(x, y, r, a, b, d);
    }
    if (p.kind === "saturn") rings(x, y, r, p.tilt, Math.sin(p.lean) + 0.02, true);
    if (p.kind === "jupiter") moons(x, y, r, t, true);
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
      const at = bendStar(s);
      if (!at) continue;
      const [sx, sy, stretch] = at;
      const base = dim ? 0.35 : 0.8;
      c.fillStyle = s.layer === 2 ? "#fff6e0" : "#e8e4ff";
      if (s.spark) {
        // a strong twinkle: mostly faint, flaring to full brightness with a small cross of light
        const tw = 0.12 + 0.88 * Math.max(0, Math.sin(t * s.speed + s.phase)) ** 3;
        c.globalAlpha = Math.min(1, base * 1.25) * tw;
        c.beginPath(); c.arc(sx, sy, s.r, 0, TAU); c.fill();
        if (tw > 0.55) {
          const len = s.r * 7 * tw;
          c.globalAlpha *= 0.55;
          c.fillRect(sx - len, sy - 0.35, len * 2, 0.7);
          c.fillRect(sx - 0.35, sy - len, 0.7, len * 2);
        }
      } else {
        const twinkle = 0.55 + 0.45 * Math.sin(t * (0.6 + s.layer * 0.3) + s.phase);
        c.globalAlpha = base * twinkle;
        if (stretch > 1.3) {
          // bent light is smeared into a short arc around the hole
          const ang = Math.atan2(sy - hole.y, sx - hole.x), d = Math.hypot(sx - hole.x, sy - hole.y);
          const span = (s.r * stretch * 2.2) / d;
          c.strokeStyle = c.fillStyle as string; c.lineWidth = s.r * 1.4;
          c.beginPath(); c.arc(hole.x, hole.y, d, ang - span, ang + span); c.stroke();
        } else {
          c.beginPath(); c.arc(sx, sy, s.r, 0, TAU); c.fill();
        }
      }
    }
    c.globalAlpha = 1;
    if (!reduceMotion) stepHole(dt);
    drawHole(dim ? 0.45 : 1);
    for (const [i, p] of planets.entries()) {
      p.x += (p.vx * dt) / 60; p.y += (p.vy * dt) / 60;
      if (p.x < -0.1) p.x = 1.1; if (p.x > 1.1) p.x = -0.1;
      if (p.y < -0.1) p.y = 1.1; if (p.y > 1.1) p.y = -0.1;
      drawPlanet(p, t, i);
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
  idle(makeNext);
}
