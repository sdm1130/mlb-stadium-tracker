# ⚾ MLB Stadium Tracker

A fun, kid-friendly web app for tracking every MLB ballpark you've visited —
built as a map with a pin for all 30 stadiums. Click a pin to see photos,
who plays there, fun facts, and log the games you saw there. Includes a
"passport" stamp book, unlockable badges, and overall stats.

It's a plain static site (HTML/CSS/JS) — no build step, no server required.

## Features

- 🗺️ Interactive map with a pin for every MLB ballpark
- 📸 Photos, home team, fun facts, capacity, roof type, and more per stadium
- ✅ Mark stadiums as visited and log games you saw there (date, opponent,
  score, notes)
- 📔 "Passport" view — a stamp for every park you've visited
- 🏅 20 unlockable badges (milestones, division sweeps, coast-to-coast, etc.)
- 📊 Stats bar: parks visited, games seen, states visited, badges earned
- 💾 Works offline with zero setup (saves in your browser)
- 🔄 Optional free cross-device sync via Firebase (see below)

## Quick start

Just open `index.html` in a browser — that's it. Or serve it locally:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

By default, all data (visited parks + logged games) is saved right in your
browser's local storage. This works great on one device, but won't show up
on a different phone/tablet/computer unless you turn on sync (next section).

## Optional: cross-device sync (~5 minutes, free)

Want the same data to show up on your phone AND a tablet? Set up a free
Firebase project:

1. Go to <https://console.firebase.google.com/> and click **Add project**
   (any name is fine, e.g. "stadium-tracker"). You can skip Google Analytics.
2. In your new project, go to **Build → Firestore Database → Create database**.
   Choose any region, and start in **production mode**.
3. Go to **Build → Authentication → Get started**, click the **Sign-in method**
   tab, and enable **Anonymous**.
4. Go to **Project settings** (gear icon) → scroll to "Your apps" → click the
   **</>** (web) icon to register a new web app (any nickname). It'll show you
   a `firebaseConfig` object — copy those values.
5. Open `js/firebase-config.js` in this project and paste your values in, then
   change `FIREBASE_ENABLED` to `true`:

   ```js
   const FIREBASE_CONFIG = {
     apiKey: "your-key-here",
     authDomain: "your-project.firebaseapp.com",
     projectId: "your-project",
     storageBucket: "your-project.appspot.com",
     messagingSenderId: "...",
     appId: "..."
   };
   const FIREBASE_ENABLED = true;
   ```

6. In the Firebase console, go to **Firestore Database → Rules** and set:

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
   password: pick something specific, not "test" or "1234".
7. Reload the app, go to **Settings → Sync code**, type a code (or click
   🎲 Random), and hit **Connect**. Do the same on your other device with the
   *same* code and they'll stay in sync automatically.

If you skip all of this, the app still works perfectly — it just saves to
one device at a time. You can always use **Settings → Export/Import Backup**
to move data between devices manually instead.

## Deploying to GitHub Pages

1. Push this repo to GitHub (already done if you're reading this from the repo).
2. In the repo, go to **Settings → Pages**.
3. Under "Build and deployment", set **Source** to "Deploy from a branch",
   pick the branch you want published (e.g. `main`) and folder `/ (root)`.
4. Save. GitHub will give you a URL like
   `https://<username>.github.io/mlb-stadium-tracker/` within a minute or two.

## Project structure

```
index.html            Page structure
css/style.css          All styling
js/stadiums-data.js    Data for all 30 ballparks (facts, photos, coords, etc.)
js/badges-data.js      Badge/achievement definitions
js/firebase-config.js  Optional sync configuration (see above)
js/app.js              App logic (map, modal, passport, badges, sync)
assets/logos/          Team logo SVGs used on map pins, popups, and passport stamps
```

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
