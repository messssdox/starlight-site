// The rules for "Share your thoughts" messages. Kept free of Cloudflare code so tests can check them.

export const KINDS = ["praise", "feedback", "contact"] as const;
export type Kind = (typeof KINDS)[number];

export const STAR_SIGNS = [
  "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
  "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces",
] as const;

export const LIMITS = { email: 254, firstName: 40, message: 2000, links: 3 };

/** Anyone who submits faster than this after the page loads is almost certainly a bot. */
export const MIN_FILL_MS = 3000;

export interface Submission {
  kind: Kind;
  email: string;
  firstName: string;
  starSign: string;
  message: string;
  showPublicly: boolean;
}

type Raw = Record<string, unknown>;
const text = (v: unknown) => (typeof v === "string" ? v.trim() : "");

/** True for bots: the hidden "website" box was filled in, or the form was sent impossibly fast. */
export function looksLikeABot(raw: Raw, now = Date.now()): boolean {
  if (text(raw.website) !== "") return true;
  const loadedAt = Number(text(raw.t));
  return Number.isFinite(loadedAt) && loadedAt > 0 && now - loadedAt < MIN_FILL_MS;
}

export function validateSubmission(raw: Raw): { ok: true; value: Submission } | { ok: false; error: string } {
  const kind = text(raw.kind) as Kind;
  if (!KINDS.includes(kind)) return { ok: false, error: "Please choose Praise, Feedback or Contact." };

  const email = text(raw.email).toLowerCase();
  if (email.length > LIMITS.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { ok: false, error: "Please enter a valid email address." };
  }

  const firstName = text(raw.firstName).replace(/\s+/g, " ");
  if (firstName.length > LIMITS.firstName) return { ok: false, error: `Please keep your name under ${LIMITS.firstName} characters.` };

  const starSign = text(raw.starSign);
  if (starSign !== "" && !(STAR_SIGNS as readonly string[]).includes(starSign)) return { ok: false, error: "Please choose a star sign from the list." };

  const message = text(raw.message).replace(/\r\n/g, "\n");
  if (message.length < 2) return { ok: false, error: "Please write a message." };
  if (message.length > LIMITS.message) return { ok: false, error: `Please keep your message under ${LIMITS.message} characters.` };
  if ((message.match(/https?:\/\/|www\./gi) ?? []).length > LIMITS.links) {
    return { ok: false, error: `Please include no more than ${LIMITS.links} links.` };
  }

  const ticked = raw.showPublicly === true || ["on", "true", "1", "yes"].includes(text(raw.showPublicly));
  return { ok: true, value: { kind, email, firstName, starSign, message, showPublicly: kind === "praise" && ticked } };
}

/** What the Kind words wall shows for a name: the first word only, or a gentle stand-in. */
export function publicName(firstName: string): string {
  return firstName.trim().split(/\s+/)[0] || "A kind visitor";
}
