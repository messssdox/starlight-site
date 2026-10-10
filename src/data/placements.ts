// Every planet-in-sign meaning in one place, e.g. PLACEMENTS.mars.cancer.
import type { PointId, SignId, Placement } from "./astrology.ts";
import { PERSONAL_PLACEMENTS } from "./placements-personal.ts";
import { OUTER_PLACEMENTS } from "./placements-outer.ts";

export const PLACEMENTS: Record<PointId | "rising", Record<SignId, Placement>> = {
  ...PERSONAL_PLACEMENTS,
  ...OUTER_PLACEMENTS,
};
