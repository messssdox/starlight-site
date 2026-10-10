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
| `functions/api/` | The small server pieces that run on Cloudflare (listed in `worker/index.ts`): the reading counter, "Share your thoughts" messages, the Kind words wall and the admin inbox. |
| `server/` | Shared rules for those server pieces: message checks, spam limits and the admin password check. |
| `migrations/` | The database tables, as numbered SQL files. Run each new one once (see below). |
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

## Turning on "Share your thoughts"

The form at `/thoughts` saves messages in the same free Cloudflare D1 database as the reading counter. Two one-off steps:

1. **Create the message tables.** In the Cloudflare dashboard, open **Storage & Databases → D1**, click **starlight-counter**, then the **Console** tab. Open `migrations/0002_thoughts.sql` on GitHub, copy everything in it, paste it into the console and click **Execute**.
2. **Choose an admin password.** Open **Workers & Pages**, click **starlight**, then **Settings → Variables and Secrets → Add**. Choose **Secret** as the type, type `ADMIN_PASSWORD` as the name, paste a long password (at least 12 characters) and click **Deploy**.

Then visit `/admin` on your site and enter the password. There you can:

- put shared praise on the **Kind words** wall (and take it off again),
- read feedback and contact messages and reply by email,
- delete anything you don't want to keep.

Visitors' emails are only ever shown on `/admin`. The wall shows a first name and star sign only, and only for praise the visitor agreed to share **and** you approved. Spam is slowed by a hidden trap box, a "sent too fast" check and a limit of 5 messages an hour per visitor.

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
