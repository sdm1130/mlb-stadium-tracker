# ⚾ MLB Stadium Tracker

A web app for tracking every MLB ballpark you've visited — an interactive map
with a pin for all 30 stadiums. Click a pin to see photos, who plays there,
fun facts, and log the games you saw there. Includes a "passport" stamp book,
unlockable badges, and an overall stats bar.

It's a plain static site (HTML/CSS/JS) — no build step, no server required.

**Live at: <https://sdm1130.github.io/mlb-stadium-tracker/>**

## Features

- Interactive map with a pin for every MLB ballpark, showing each team's real
  logo, with visited parks clearly highlighted
- Photos, home team, fun facts, capacity, roof type, and more per stadium
- Mark stadiums as visited and log games you saw there (date, opponent,
  score, notes)
- "Passport" view — a stamp for every park you've visited
- 20 unlockable badges (milestones, division sweeps, coast-to-coast, etc.)
- Stats bar: parks visited, games seen, states visited, badges earned
- Works offline with zero setup (saves in your browser)
- Cross-device sync via Firebase, already configured for this deployment
  (see below)

## Quick start

Just open `index.html` in a browser — that's it. Or serve it locally:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

Data (visited parks + logged games) is saved to your browser's local storage
*and* synced to Firebase, so it shows up the same way across devices — see
next section.

## Cross-device sync (already set up for this deployment)

This deployment already has Firebase sync configured and enabled
(`js/firebase-config.js` points at a live Firebase project, and
`FIREBASE_ENABLED = true`). To use it on a new device, just go to
**Settings → Sync code** and enter the same code you're already using
elsewhere — no separate setup needed.

If you ever fork this project or want your own independent copy with its own
sync (a different family's tracker, for example), here's how to stand up a
new Firebase project from scratch:

1. Go to <https://console.firebase.google.com/> and click **Add project**
   (any name is fine). You can skip Google Analytics.
2. **Build → Firestore Database → Create database** — any region, start in
   **production mode**.
3. **Build → Authentication → Get started** → **Sign-in method** tab →
   enable **Anonymous**.
4. **Project settings** (gear icon) → "Your apps" → click **</>** (web) to
   register a new web app. Copy the `firebaseConfig` values it shows you.
5. Open `js/firebase-config.js` and replace `FIREBASE_CONFIG` with your
   values, then set `FIREBASE_ENABLED = true`.
6. In the Firebase console, under **Firestore Database → Rules**, set:

   ```
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /trackers/{code} {
         allow read, write: if request.auth != null;
       }
     }
   }
   ```

   This lets any signed-in (anonymous) user read/write a tracker by its code.
   There's no login screen — anyone with the same **sync code** (set in the
   app's Settings tab) sees the same data. Treat the sync code like a shared
   password: pick something specific, not "test" or "1234". For extra
   protection you can also restrict the Firebase Web API key to your site's
   domain under Google Cloud Console → APIs & Services → Credentials
   (Application restrictions → Websites) — this stops the key from being
   casually reused on someone else's page, though it's not a substitute for
   the Firestore rule above.
7. Reload the app, go to **Settings → Sync code**, type a code (or click the
   dice icon for a random one), and hit **Connect**.

If you skip Firebase setup entirely, the app still works perfectly — it just
saves to one device at a time. **Settings → Export/Import Backup** can move
data between devices manually instead.

## Deployment

This project is hosted on **GitHub Pages**, configured to deploy from the
**`claude/mlb-stadium-tracker-b426yg`** branch (not `main`). Any push to that
branch rebuilds the live site automatically within about a minute. The
repository is public, which is required for free GitHub Pages hosting on a
free GitHub plan (Pages on a private repo needs a paid plan) — there are no
secrets in this codebase, so that's a safe tradeoff (Firebase web config
values are meant to be public; see the note in `js/firebase-config.js`).

To point Pages at a different branch or repo, or to set it up fresh
elsewhere: **Settings → Pages → Source: "Deploy from a branch"**, pick the
branch and `/ (root)` folder, and save.

## Project structure

```
index.html              Page structure
css/style.css            All styling
js/stadiums-data.js      Data for all 30 ballparks (facts, photos, coords, etc.)
js/badges-data.js        Badge/achievement definitions
js/firebase-config.js    Sync configuration (see above) — already live for this deployment
js/app.js                App logic (map, modal, passport, badges, sync)
assets/logos/            Team logo SVGs used on map pins, popups, and passport stamps
CLAUDE.md                Notes for Claude/any coding agent working in this repo
```

If you're picking this project up with Claude Code (or another coding
agent), read `CLAUDE.md` first — it covers a few hard-won gotchas (like why
logos are vendored locally instead of hotlinked) and flags the parts of this
app that now hold real, synced user data and deserve extra care.

## Notes on data

- Stadium names, capacities, and locations reflect the 2026 season, including
  recent renames (e.g. Rate Field, Daikin Park) and temporary situations
  (e.g. the Athletics playing in West Sacramento ahead of their eventual
  Las Vegas move). Stadium sponsorships and situations change often — if
  something looks out of date, it's easy to update in `js/stadiums-data.js`.
- Stadium photos link directly to Wikimedia Commons images and require an
  internet connection to display; if a photo ever fails to load, the app
  shows a friendly placeholder instead of a broken image.
- Team logos are bundled locally in `assets/logos/` (one SVG per team, named
  after the stadium's id in `stadiums-data.js`) so pins never depend on an
  external link staying up. These are official team logos/trademarks, used
  here purely for personal, non-commercial fan identification — same basis
  most fan sites and apps rely on. If a logo ever needs swapping, just
  replace the matching SVG file; no code changes needed.
