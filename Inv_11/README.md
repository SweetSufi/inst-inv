# Investigation 11 — Rabbit Hole

The Institute of Unnecessary Research. Static site: no build step, no API keys.

## Deploy to Netlify
Drag this folder (or the ZIP contents) onto Netlify Drop, or set the publish directory to `.`.

## Structure
- `index.html` — experience and Research Note
- `js/knowledge.js` — all research content (55 entries, 5 questions, 4 levels) and sources
- `js/app.js` — navigation, state (localStorage), Research Trail, summary
- `css/style.css`, `fonts/`, `assets/`, `evidence/`, `prompt/`

## Implementation
Curated, deterministic, rule-based. No live AI. `RH.provider` (in `knowledge.js`) is the single seam where a live service could later supply entries given the Research Trail as context. That is a design provision only; it is not built or tested.

## Fonts
Kingsland and Borel: supplied assets (see `fonts/OFL.txt`). Nunito Sans: not supplied; loaded from Google Fonts. Fallback is a system sans-serif and is not compliant.

## Known issues
Source citations were written from the build agent's knowledge and are not yet verified against originals.

## Editing content
Entries use `N(id, level, title, body, [sourceKeys], [E(targetId, label, connectionSentence)])`. Run `RH.validate()` in the console after edits.
