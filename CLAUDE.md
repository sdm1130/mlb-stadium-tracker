# CLAUDE.md

Guidance for Claude (or any coding agent) working in this repository.

## What this is

A personal, non-commercial MLB stadium tracker built for one family — specifically
for a dad's middle-school-age son (a Yankees fan) to track which of the 30 MLB
ballparks he's visited and log games he's seen. It's a plain static site:
HTML/CSS/vanilla JS, no build tooling, no `package.json`, no framework. Open
`index.html` directly in a browser or serve it with any static file server —
there is nothing to install or compile.

## Read this before touching data or config

- **This app is in active use with real data.** The son has already marked
  stadiums visited and logged real games, synced through a live Firebase
  project. Treat `js/stadiums-data.js`'s structure, `js/firebase-config.js`,
  and anything sync-related with real care — a change that looks fine in a
  diff could still corrupt or wipe real synced data if you're not careful.
  Prefer small, targeted edits over restructuring; verify in a browser before
  calling something done.
- **Firebase sync is live and enabled right now.** `js/firebase-config.js`
  has real project credentials for the Firebase project
  `ethan-mlb-stadium-tracker`, with `FIREBASE_ENABLED = true`. Do not blank
  this out, regenerate it, or flip it back to `false` unless the user
  explicitly asks — doing so would silently stop cross-device sync for data
  that already exists.
- The Firestore security rule in place allows read/write on `trackers/{code}`
  to any authenticated (anonymous) user — there's no login screen; the app
  signs users in anonymously and the "sync code" (set in Settings) is what
  scopes access to a given family's data. Don't loosen this rule, and don't
  add a login/auth UI, without discussing it with the user first.
- **Hosting is GitHub Pages, deployed from the `claude/mlb-stadium-tracker-b426yg`
  branch — not `main`.** Live URL: https://sdm1130.github.io/mlb-stadium-tracker/.
  Any push to that branch triggers an automatic rebuild (~1 minute). Don't
  rename/delete that branch, merge it away, or change the Pages source branch
  without confirming with the user — that wiring is easy to break and not
  obvious to notice until the live site stops updating.
- The GitHub repo (`sdm1130/mlb-stadium-tracker`) is **public**. That was a
  deliberate, discussed tradeoff to get free GitHub Pages hosting on a free
  GitHub plan (Pages on private repos needs a paid plan). The code has no
  actual secrets in it — Firebase web config values are meant to be public;
  see the note in `js/firebase-config.js` itself.

## Architecture

- **`index.html`** — page shell and static nav/tab markup. Scripts load in
  this exact order and it matters: Leaflet (CDN) → Firebase compat SDKs
  (CDN) → `firebase-config.js` → `stadiums-data.js` → `badges-data.js` →
  `app.js`. Both `badges-data.js` and `app.js` reference the global
  `STADIUMS` array at load time.
- **`css/style.css`** — all styling, single stylesheet. One font family
  (Manrope, via Google Fonts). The visual design was deliberately moved away
  from a bright, bubbly "kid app" look toward a flatter, more muted dashboard
  aesthetic partway through this project, specifically because the target
  user is a middle schooler, not a young child — don't reintroduce heavy
  emoji, pill-shaped buttons, or primary-color-heavy styling without reason.
  The theme color is Yankees navy (`--primary: #0C2340`) with a muted gold
  accent — chosen because that's the son's favorite team, not a generic
  default; keep that in mind if asked to touch the palette.
- **`js/stadiums-data.js`** — the `STADIUMS` array, one object per current
  MLB team/ballpark: `id`, `team`, `stadiumName`, `city`/`state`, `lat`/`lng`,
  `opened`, `capacity`, `roofType`, `league`, `division`, `funFacts[]`,
  `imageUrls[]` (hotlinked Wikipedia photos), `mapColor`, `logoUrl` (a local
  path into `assets/logos/`).
- **`js/badges-data.js`** — the `BADGES` array (visit-count milestones,
  division/league sweeps, coast-to-coast, etc.), each with a `check(ctx)`
  predicate evaluated against currently-visited stadiums and logged games.
- **`js/firebase-config.js`** — Firebase Web SDK config plus the
  `FIREBASE_ENABLED` flag described above.
- **`js/app.js`** — all app logic: localStorage persistence, optional
  Firestore sync via a user-chosen "sync code" (no real login), the Leaflet
  map and custom pin rendering, the stadium detail modal, the passport grid,
  the badges grid, settings/backup/export-import, and a small hand-rolled
  inline-SVG icon set (the `ICONS` object) used in place of emoji/icon fonts
  throughout the UI.
- **`assets/logos/<stadium-id>.svg`** — one team logo per stadium, filename
  matching that stadium's `id` in `stadiums-data.js`. Vendored locally rather
  than hotlinked — see the gotcha below for why that matters.

## Known gotchas / hard-won lessons

- **Don't add or fix team logos by guessing Wikipedia/Commons file names.**
  Earlier attempts to set `logoUrl` values by pattern-guessing Wikipedia's
  `Special:FilePath` filenames broke twice after shipping (Yankees, then
  Marlins) — the guessed filenames either didn't exist or lived on a
  different Wikimedia domain than assumed, and there was no way to verify a
  hotlink actually resolves before shipping it. The permanent fix was
  vendoring real, verified SVGs into `assets/logos/` instead of hotlinking.
  If a logo ever needs to change, verify the replacement file actually
  renders in a browser before committing it, or just swap the local SVG
  file directly — don't reintroduce external logo hotlinks.
- **`TEAM_ABBR` in `app.js`** is a fallback monogram (e.g. `"NYY"`) shown if
  a team's logo image fails to load, keyed by stadium `id`. If a stadium's
  `id` ever changes or a new one is added, update `TEAM_ABBR` too, or the
  fallback silently renders blank.
- Stadium *photos* (`imageUrls`, separate from logos) are still hotlinked to
  Wikipedia and can go stale or break. This is lower-stakes than the logo
  issue — the UI already degrades gracefully to a placeholder icon — but
  worth knowing if a photo is ever reported broken.
- No test suite, no build step, no linter configured. Verify changes by
  actually opening the page in a browser (`python3 -m http.server` or
  similar + a browser) rather than assuming correctness from the diff —
  especially for anything touching the Leaflet map rendering or the sync
  logic, both of which are easy to get subtly wrong.

## Working style expected here

- This is a low-stakes hobby project for a family, but real user data now
  flows through it — data-path changes deserve real verification, not just
  "looks right in the diff."
- Keep changes scoped: a visual tweak shouldn't touch data files; a content
  fix in `stadiums-data.js` shouldn't restyle things. Small, focused diffs
  make it much easier to trust that nothing else was disturbed.
- For anything destructive or hard to reverse — restructuring
  `stadiums-data.js`, changing the Pages deploy branch, touching Firestore
  rules, disabling sync — ask before doing it rather than assuming it's fine.
