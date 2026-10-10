// Turns a birth town typed by the visitor into a map position and time zone,
// using Open-Meteo's free place finder (no account or key needed).

export interface Place {
  /** "Manchester, England, United Kingdom" */
  label: string;
  lat: number;
  /** East is positive, west is negative. */
  lon: number;
  /** IANA time zone name, e.g. "Europe/London". */
  timeZone: string;
}

interface Hit {
  name: string;
  latitude: number;
  longitude: number;
  timezone?: string;
  country?: string;
  country_code?: string;
  admin1?: string;
}

/** Splits "Manchester, US" into the town to search for and the words that narrow it down. */
export function splitPlace(text: string): { town: string; hints: string[] } {
  const [town, ...rest] = text.split(",").map((s) => s.trim()).filter(Boolean);
  return { town: town ?? "", hints: rest.map((h) => h.toLowerCase()) };
}

/** Picks the first (most populous) match, preferring one whose region or country fits the hints. */
export function pickPlace(hits: Hit[], hints: string[]): Place | null {
  const fits = (h: Hit) =>
    hints.every((hint) =>
      [h.country, h.country_code, h.admin1].some((v) => {
        const s = (v ?? "").toLowerCase();
        return s && (s === hint || s.startsWith(hint) || (hint === "uk" && h.country_code === "GB") || (hint === "usa" && h.country_code === "US"));
      }),
    );
  const usable = hits.filter((h) => h.timezone);
  const hit = usable.find(fits) ?? usable[0];
  if (!hit) return null;
  return {
    label: [hit.name, hit.admin1, hit.country].filter((v, i, a) => v && a.indexOf(v) === i).join(", "),
    lat: hit.latitude,
    lon: hit.longitude,
    timeZone: hit.timezone!,
  };
}

export async function findPlace(text: string): Promise<Place | null> {
  const { town, hints } = splitPlace(text);
  if (!town) return null;
  const url = `https://geocoding-api.open-meteo.com/v1/search?count=10&language=en&format=json&name=${encodeURIComponent(town)}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Place finder replied ${res.status}`);
  const data = (await res.json()) as { results?: Hit[] };
  return pickPlace(data.results ?? [], hints);
}

/** 53.48, -2.24 → "53.48° N, 2.24° W" */
export function formatCoords(lat: number, lon: number): string {
  return `${Math.abs(lat).toFixed(2)}° ${lat >= 0 ? "N" : "S"}, ${Math.abs(lon).toFixed(2)}° ${lon >= 0 ? "E" : "W"}`;
}
