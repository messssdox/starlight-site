# Starlight

A free-forever website for personalised numerology, astrology and Chinese zodiac readings.

## What's in here

| Folder or file | What it is |
| --- | --- |
| `src/pages/` | One file per page. `index.astro` is the homepage, `reading.astro` the reading, and so on. |
| `src/components/` | Reusable pieces: the zodiac wheel, the reading form, the donation box, the moving cosmos. |
| `src/content/library/` | Library articles, written in Markdown. Add a new `.md` file and it becomes a new article. |
| `src/data/` | The facts the site uses: zodiac animals and colours, number meanings, glossary words, Lunar New Year dates, and the astrology meanings (`astrology.ts` for signs, planets, houses and aspects; `placements-*.ts` for every planet in every sign). |
| `src/lib/` | The calculations: numerology, the Chinese zodiac and the astrology birth chart (`astrology.ts`), plus the step-by-step working shown in readings. |
| `src/config/donations.ts` | **The one place to plug in donations** when you're ready. |
| `functions/api/counter.ts` | The "readings completed so far" counter (runs on Cloudflare). |
| `public/` | Images and files served as they are, including the 12 animal illustrations. |
| `tests/` | Automatic checks that the calculations are right. |

## Everyday commands

You need [Node.js](https://nodejs.org) (the LTS version) installed once.

```
npm install      # first time only: downloads the tools the site needs
npm run dev      # opens a live preview at http://localhost:4321
npm test         # checks the numerology, zodiac and birth chart calculations
npm run build    # builds the finished site into the dist/ folder
```

## Tools and languages

- **Astro** builds the pages. Files ending in `.astro` are HTML with a small code section at the top.
- **TypeScript** (`.ts`) does the calculations. It is JavaScript with labels that catch mistakes.
- **CSS** sets colours and layout. All colours live in `src/styles/global.css`.
- **Markdown** (`.md`) is used for Library articles.
- **Astronomy Engine** calculates planet positions for the birth chart, in the visitor's browser (and Moon phases for the Sky Now page, coming next).
- **Open-Meteo's place finder** turns a birth town into a map position and time zone, for the Rising sign and houses. It is free and needs no account.
- **Cloudflare Pages** hosts the site for free and republishes it each time you push to GitHub.

## Credits

- Animal medallions (`public/animals/*.png`): gold relief medallions rendered from [Game-icons.net](https://game-icons.net) silhouettes by Lorc, Delapouite and contributors (CC BY 3.0), and the EmojiOne dragon (CC BY 4.0). To use different artwork, replace the 12 PNG files with the same names.
- Astronomy: [Astronomy Engine](https://github.com/cosinekitty/astronomy) by Don Cross, MIT licence.
