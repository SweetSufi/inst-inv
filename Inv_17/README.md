# Investigation 17 — The Door
The Institute of Unnecessary Research

Static site. No build step. Open `index.html` through any web server (audio and fonts need http, not file://).

    python3 -m http.server 8000   # then visit http://localhost:8000

Deploy: GitHub Pages (Settings > Pages > deploy from branch, root), Netlify or any static host. Keep the folder structure unchanged.

- `index.html` — the experience and the Behind the Investigation research section
- `support.js` — runtime required by `index.html`
- `uploads/` — corridor, six world images, desert cutout, audio (office, harp, train) and Kingsland and Borel fonts

Nunito Sans loads from Google Fonts.
