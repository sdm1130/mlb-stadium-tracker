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
- **Hosting is Coolify, deployed from `main`** (since 2026-10-18). Live URL:
  https://stadiumtracker.stevenmurphy.net, behind a Cloudflare Access login.
  Work on `main` and deploy every change (see "Deployment: Coolify" below).
- **GitHub Pages is legacy, kept running for now.** It still serves
  https://sdm1130.github.io/mlb-stadium-tracker/ from the frozen
  `claude/mlb-stadium-tracker-b426yg` branch (at `7c35f9b`), so it no longer
  gets new changes. Don't push to, rename or delete that branch, or change
  the Pages settings, until Steve says Pages can be turned off. His son's
  devices still use it until they're moved over to the new site.
- **Moving a device to the new site:** localStorage belongs to a single site
  address, so on stadiumtracker.stevenmurphy.net each device starts empty
  until it enters the same **sync code** under Settings, which pulls the
  data back from Firebase. A device that never used sync must use
  **Settings → Export/Import Backup** on the old site first.
- The GitHub repo (`sdm1130/mlb-stadium-tracker`) is **public**, only because
  free GitHub Pages needed it. Once Pages is turned off it can go private
  (Coolify uses a deploy key, so it keeps working). The code has no actual
  secrets in it — Firebase web config values are meant to be public; see the
  note in `js/firebase-config.js` itself. If the Firebase Web API key is
  restricted to certain websites in Google Cloud, it must include
  `https://stadiumtracker.stevenmurphy.net/*`, or sync fails on the new site.

## Git workflow

Repo: https://github.com/sdm1130/mlb-stadium-tracker, branch `main`. Git
author is set locally in this repo (`Steve <sdm1130@gmail.com>`). Once a
requested change is complete and verified in a browser, commit it with a
clear message, push to `origin/main`, and deploy (below) as part of
finishing the task. Ask first before anything destructive (force-push,
rewriting history), or before anything the "Read this before touching data
or config" section above flags.

## Deployment: Coolify — every change ships here

**A change isn't finished until it's deployed and verified.** After pushing
to `main`, trigger a Coolify deploy and check it.

| | |
|---|---|
| URL | https://stadiumtracker.stevenmurphy.net (Cloudflare Access login: Steve and Ethan) |
| Host | Ubuntu VM `10.0.100.254`, Coolify 4.4.6. SSH: `ssh -i ~/.ssh/claude_vm claude@10.0.100.254` (works only from Steve's laptop at home) |
| Coolify app | uuid `j7tw4m3j5jpofmufyuodw891`, project `mlb-stadium-tracker`. Builds this repo's `Dockerfile` from `main` through a read-only GitHub deploy key. |
| Container | nginx 1.30.6 (Alpine) serving `index.html`, `css/`, `js/`, `assets/` with `deploy/nginx.conf`. No server-side data and no volume. |
| Health check | `GET /` |
| Limits | 128 MB memory, 0.25 CPU |

There is no push-to-deploy webhook. Coolify sits behind Cloudflare Access,
so GitHub can't reach it; deploys are triggered through the API.

### Credentials — never print, echo, or commit them

All on Steve's laptop, mode `600`:

- `~/.config/coolify/token`: Coolify API token (read, write, deploy). It has
  no `read:sensitive`, so the API hides deploy logs from it.
- `~/.config/cloudflare/access-client-id` and `access-client-secret`:
  Cloudflare Access service token that lets API calls through to
  `coolify.stevenmurphy.net`.
- `~/.config/cloudflare/api-token`: Cloudflare API token (Access apps,
  Tunnel, DNS on `stevenmurphy.net`). Not needed for normal deploys.

Read them inside the command (`$(tr -d '[:space:]' < file)`). Never paste
their values into chat, logs, commit messages or files. If one is missing or
rejected, ask Steve; don't work around it.

### Deploy and verify

```bash
A=https://coolify.stevenmurphy.net/api/v1; APP=j7tw4m3j5jpofmufyuodw891
CFH=(-H "CF-Access-Client-Id: $(tr -d '[:space:]' < ~/.config/cloudflare/access-client-id)"
     -H "CF-Access-Client-Secret: $(tr -d '[:space:]' < ~/.config/cloudflare/access-client-secret)"
     -H "Authorization: Bearer $(tr -d '[:space:]' < ~/.config/coolify/token)"
     -H 'Accept: application/json' -H 'Content-Type: application/json')

# 1. Trigger (must be POST; GET returns 405)
D=$(curl -s "${CFH[@]}" -X POST $A/deploy -d "{\"uuid\":\"$APP\"}" \
  | python3 -c 'import json,sys; print(json.load(sys.stdin)["deployments"][0]["deployment_uuid"])')

# 2. Poll about every 10 s until "finished" or "failed" (a build takes under a minute)
curl -s "${CFH[@]}" $A/deployments/$D \
  | python3 -c 'import json,sys; d=json.load(sys.stdin); print(d["status"], (d.get("commit") or "")[:7])'

# 3. Check the live app from inside the VM (Access blocks anonymous requests from outside)
ssh -i ~/.ssh/claude_vm claude@10.0.100.254 \
  'curl -s -o /dev/null -w "%{http_code}\n" -H "Host: stadiumtracker.stevenmurphy.net" http://localhost:80/'
```

Done means all of these:
- the status is `finished`,
- its commit matches `git rev-parse --short HEAD`,
- step 3 prints `200`,
- any file the change touched (a logo, `js/...`) returns 200 through the
  same Host-header `curl`.

Then tell Steve it's deployed. If the new container fails its health check,
Coolify keeps the previous one running.

### When a deploy fails

The API can't return deploy logs (no `read:sensitive`), so read them from
Coolify's database over SSH:

```bash
ssh -i ~/.ssh/claude_vm claude@10.0.100.254 \
  "sudo docker exec coolify-db psql -U coolify -d coolify -tA -c \"select logs from application_deployment_queues where deployment_uuid='$D'\""
```

The result is a JSON array of `{output, hidden}` lines. For runtime and nginx
logs, use `sudo docker logs <container>`; the container name starts with the
app uuid.

Container notes:
- **New top-level folders** must be added to the `COPY` lines in the
  `Dockerfile`, or they won't be in the image. Only `index.html`, `css/`,
  `js/` and `assets/` are copied.
- **IPv6:** `deploy/nginx.conf` listens on `[::]:80` as well as `80`.
  Inside the container `localhost` is `::1`, and Coolify's health check
  connects to it. Without the IPv6 listen, every deploy fails its health
  check.

### Infrastructure — don't change unless Steve asks

Cloudflare Tunnel `home-apps` routes `stadiumtracker.stevenmurphy.net` to
Traefik on the VM. The Access app `stadium-tracker` allows Steve and his
son Ethan (`ethanmurphy1120@gmail.com`); adding anyone else means adding their
email to that policy, with Steve's approval. There is **no wildcard Access app**, so a new hostname is public
until it has its own Access app; create the Access app before the DNS
record. How the VM is set up, and why, is documented in
`/Users/steve/Desktop/setup/hosting-runbook.md`.

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
