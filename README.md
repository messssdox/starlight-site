# Starlight

A free-forever website for personalised numerology, astrology and Chinese zodiac readings.

## What's in here

| Folder or file | What it is |
| --- | --- |
| `src/pages/` | One file per page. `index.astro` is the homepage, `reading.astro` the reading, and so on. |
| `src/components/` | Reusable pieces: the zodiac wheel, the reading form, the donation box, the moving cosmos. |
| `src/content/library/` | Library articles, written in Markdown. Add a new `.md` file and it becomes a new article. |
| `src/data/` | The facts the site uses: zodiac animals and colours, number meanings, glossary words, Lunar New Year dates. |
| `src/lib/` | The calculations: numerology and the Chinese zodiac. |
| `src/config/donations.ts` | **The one place to plug in donations** when you're ready. |
| `functions/api/counter.ts` | The "readings completed so far" counter (runs on Cloudflare). |
| `public/` | Images and files served as they are, including the 12 animal illustrations. |
| `tests/` | Automatic checks that the calculations are right. |

## Everyday commands

You need [Node.js](https://nodejs.org) (the LTS version) installed once.

```
npm install      # first time only: downloads the tools the site needs
npm run dev      # opens a live preview at http://localhost:4321
npm test         # checks the numerology and zodiac calculations
npm run build    # builds the finished site into the dist/ folder
```

## Tools and languages

- **Astro** builds the pages. Files ending in `.astro` are HTML with a small code section at the top.
- **TypeScript** (`.ts`) does the calculations. It is JavaScript with labels that catch mistakes.
- **CSS** sets colours and layout. All colours live in `src/styles/global.css`.
- **Markdown** (`.md`) is used for Library articles.
- **Astronomy Engine** calculates planet positions and Moon phases (for the Sky Now page, coming next).
- **Cloudflare Pages** hosts the site for free and republishes it each time you push to GitHub.

## Credits

- Animal illustrations: [Fluent Emoji](https://github.com/microsoft/fluentui-emoji) by Microsoft, MIT licence.
- Astronomy: [Astronomy Engine](https://github.com/cosinekitty/astronomy) by Don Cross, MIT licence.
