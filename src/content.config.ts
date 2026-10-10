import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

// Every Library article is a Markdown file in src/content/library/<category>/.
const library = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/library" }),
  schema: z.object({
    title: z.string(),
    category: z.enum([
      "start-here",
      "numerology",
      "sun-moon-rising",
      "planets",
      "houses-aspects",
      "chinese-zodiac",
      "elements",
      "moon-sky",
      "compatibility",
      "events",
    ]),
    /** Two or three sentences shown at the top and on article cards. */
    summary: z.string(),
    tags: z.array(z.string()).default([]),
    /** Sources consulted, so readers can see the perspectives behind the article. */
    sources: z.array(z.object({ title: z.string(), url: z.string().optional() })).default([]),
    updated: z.coerce.date(),
  }),
});

export const collections = { library };
