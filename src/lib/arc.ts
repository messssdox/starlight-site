// Curved lettering for the zodiac wheels. Labels sit on circle arcs instead of straight lines, so they
// follow the ring the way the hand-drawn wheel does.
//
// Each label's text runs along one of two arcs centred on the wheel: one across the top (letters
// pointing outwards) or one across the bottom (letters pointing inwards, so nothing is upside down).
// The label is then rotated into place, the same rotation the straight labels used.

const rad = (deg: number) => (deg * Math.PI) / 180;
const n = (v: number) => +v.toFixed(2);

/** Half the angle each label arc covers: wide enough for the longest label on any ring. */
const HALF = 80;

/** The arc across the top of the wheel, read left to right. */
export function topArc(r: number): string {
  const x = r * Math.sin(rad(HALF)), y = r * Math.cos(rad(HALF));
  return `M${n(-x)} ${n(-y)} A${r} ${r} 0 0 1 ${n(x)} ${n(-y)}`;
}

/** The arc across the bottom of the wheel, also read left to right. */
export function bottomArc(r: number): string {
  const x = r * Math.sin(rad(HALF)), y = r * Math.cos(rad(HALF));
  return `M${n(-x)} ${n(y)} A${r} ${r} 0 0 0 ${n(x)} ${n(y)}`;
}

/** A short arc of length `len` centred on `angle` (degrees, 0 = 3 o'clock), for drawing a curved pill behind a label. */
export function pillArc(r: number, angle: number, len: number): string {
  const half = Math.max(len, 0.01) / 2 / r;
  const a0 = rad(angle) - half, a1 = rad(angle) + half;
  return `M${n(r * Math.cos(a0))} ${n(r * Math.sin(a0))} A${r} ${r} 0 0 1 ${n(r * Math.cos(a1))} ${n(r * Math.sin(a1))}`;
}

/** Ids for one ring's pair of arcs. `wheel` keeps the two wheels' ids apart. */
export const arcId = (wheel: string, r: number, side: "t" | "b") => `${wheel}-arc-${side}-${String(r).replace(".", "_")}`;
