# Investigation 13 — Sadie vs. TOBOR
**Department of Questionable Certainty** · The Institute of Unnecessary Research · Case No. 013

A static microsite for GitHub Pages. No build step, server, API key, or external service.

## Publish on GitHub Pages
1. Create a repository (for example `investigation-13`) and extract this ZIP so `index.html` sits at the repository root.
2. Commit and push to `main`.
3. In the repository, open **Settings → Pages**. Under **Build and deployment**, choose **Deploy from a branch**, branch `main`, folder `/ (root)`, then Save.
4. After a minute the site is served at `https://<user>.github.io/<repo>/`. All paths are relative, so the project sub-path works.

Local preview: serve the folder with any static server (for example `python3 -m http.server`) and open `http://localhost:8000/`.

## Structure
```
index.html
css/styles.css
js/claims.js          ten scripted claims (all dialogue, findings, cards)
js/investigation.js   deterministic critique engine and state
js/animations.js      overlay animation controller, motion pause
js/audio.js           Web Audio synthesis (TOBOR's sounds)
js/app.js             UI, dialogue, report, copy/download
assets/images/        approved illustration (unaltered)
assets/fonts/         Kingsland, Borel, Nunito Sans + OFL licenses
```

## How it works (accurate implementation notes)
- **Not live AI.** All dialogue is authored in advance. `investigation.js` records which questions were asked and which findings were uncovered, then selects responses from that state. Nothing is sent over the network.
- **Confidence meter.** Starts at 99.8%. Each newly uncovered weakness subtracts a fixed weight; questions that reveal nothing new, or surface a surviving narrower claim, leave it steady. It is a fictional character attribute, not a probability.
- **Ten claims.** TOBOR opens with the 10% brain myth; "Try another pathway" moves to the next of ten claims in a shuffled order, then reshuffles. "Restart this claim" replays the current one. Factual statements are summarized without citations.
- **Pathways.** Three question types, each with three follow-ups. The outcome is "Original claim withdrawn." if all three types were used, otherwise "Certainty temporarily unavailable."
- **Animation.** The illustration is a single flat image and is never moved. Motion comes from CSS and SVG overlays positioned in percentages on top of it (antenna pulse, eyelid, evidence-card glow, computer orbit and lights, flask bubbles, mobile and lamp glows, glasses glint, bead sparkle). The characters' bodies, faces, and braids are not animated, because the artwork cannot be separated into layers. Pause control and `prefers-reduced-motion` are supported.
- **Sound.** Web Audio sine/triangle tones, muted by default, enabled only by the Sound button. Muting stops active tones.
- **Fonts.** Kingsland (headings), Borel (motto, quotations), Nunito Sans (body). All supplied files; licenses in `assets/fonts/`.
- The factual content about the 10% myth is summarized without citations; no studies are named.
