# russforstall.com

Personal website for Russ Forstall, hosted on [Cloudflare Pages](https://pages.cloudflare.com/). It has a home page, a contact form, and a few small side projects:

- **Chip Shuffle Kerfuffle** (`/chip-shuffle-kerfuffle`): a poker chip shuffling simulator.
- **Enter the Analysis Matrix** (`/enter-the-analysis-matrix`): an Eisenhower-style prioritization matrix. You can save a matrix and share it by link.

## Project layout

```
dist/        Static site, served as-is (HTML, CSS, images, compiled JS)
  _redirects Cloudflare Pages redirect rules (old /enter-the-eisenhower-matrix URLs)
  js/        Webpack output, plus hand-written scripts such as quadrant-io.js
src/         TypeScript/React source, compiled into dist/js
  chip-shuffler.tsx, chip-stack.ts   Chip Shuffle Kerfuffle
  matrix/                            Analysis Matrix app
functions/   Cloudflare Pages Functions (server-side endpoints)
```

### Functions

| Route | Method | Purpose |
| --- | --- | --- |
| `/ping-me` | POST | Handles the home page contact form. Writes a record to Airtable, then redirects to `/thanks-for-reaching-out`. |
| `/enter-the-analysis-matrix/saves/create` | POST | Saves matrix JSON to KV under `matrix:<saveId>`. Entries expire after 90 days. |
| `/enter-the-analysis-matrix/saves/:saveId` | GET | Loads a saved matrix from KV. |
| `/matrix-data` | GET | Experimental. Not used by the site. |

## Development

Requirements: Node.js and npm. Wrangler runs through `npx`.

```sh
npm install
npm run watch   # rebuild dist/js on change (development mode)
npm run dev     # serve dist/ plus functions locally with wrangler pages dev
```

Run `npm run build` to produce the bundles in `dist/js`. The build output is committed, because Cloudflare Pages serves `dist/` directly.

## Configuration

The Functions need these bindings in the Cloudflare Pages project. When you run locally, set them in `wrangler.json`, which git ignores.

| Name | Type | Used by |
| --- | --- | --- |
| `rfWeb` | KV namespace | Matrix save and load |
| `AIRTABLE_ACCESS_TOKEN` | Secret | Contact form |
| `AIRTABLE_BASE_ID` | Variable | Contact form |
| `AIRTABLE_TABLE_NAME` | Variable | Contact form |

To seed the local KV store, use `npm run kv-put-local -- <key> <value>`.
