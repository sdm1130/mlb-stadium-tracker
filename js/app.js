/* ========================================================================
   MLB Stadium Tracker — main app logic
   Works fully offline with localStorage. If js/firebase-config.js has
   FIREBASE_ENABLED = true with valid config, it also syncs to Firestore
   under a "sync code" so the same data shows up on multiple devices.
   ======================================================================== */

const LS_KEYS = {
  name: "mlbTracker.name",
  code: "mlbTracker.code",
  data: "mlbTracker.data"
};

// Fallback monogram shown on a pin/stamp if a team's logo image fails to load.
const TEAM_ABBR = {
  "yankee-stadium": "NYY", "fenway-park": "BOS", "rogers-centre": "TOR",
  "camden-yards": "BAL", "tropicana-field": "TB", "rate-field": "CWS",
  "progressive-field": "CLE", "comerica-park": "DET", "kauffman-stadium": "KC",
  "target-field": "MIN", "daikin-park": "HOU", "angel-stadium": "LAA",
  "sutter-health-park": "ATH", "t-mobile-park": "SEA", "globe-life-field": "TEX",
  "truist-park": "ATL", "loandepot-park": "MIA", "citi-field": "NYM",
  "citizens-bank-park": "PHI", "nationals-park": "WSH", "wrigley-field": "CHC",
  "great-american-ball-park": "CIN", "american-family-field": "MIL", "pnc-park": "PIT",
  "busch-stadium": "STL", "chase-field": "ARI", "coors-field": "COL",
  "dodger-stadium": "LAD", "petco-park": "SD", "oracle-park": "SF"
};

// Small inline icon set (stroke-based, consistent style) used throughout the UI.
const ICONS = {
  pin: `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="4"/><polygon points="8,12 16,12 12,20"/></svg>`,
  calendar: `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="16" rx="2"/><line x1="3" y1="10" x2="21" y2="10"/><line x1="8" y1="3" x2="8" y2="7"/><line x1="16" y1="3" x2="16" y2="7"/></svg>`,
  users: `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="8" r="3"/><polygon points="3,20 9,13 15,20"/><circle cx="17" cy="9" r="2.2"/><polygon points="13,20 17,14 21,20"/></svg>`,
  umbrella: `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12A8 8 0 0 1 20 12"/><line x1="12" y1="12" x2="12" y2="19"/><path d="M9 19a3 3 0 0 0 6 0"/></svg>`,
  compass: `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><polygon points="12,7 14,12 12,17 10,12"/></svg>`,
  info: `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><line x1="12" y1="11" x2="12" y2="16"/><circle cx="12" cy="7.5" r="0.9" fill="currentColor" stroke="none"/></svg>`,
  trash: `<svg class="icon icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7h16"/><path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"/><path d="M6 7l1 13a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-13"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>`,
  check: `<svg class="icon icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="4,12 9,17 20,6"/></svg>`,
  lock: `<svg class="icon icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="10" width="14" height="10" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></svg>`,
  plus: `<svg class="icon icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>`,
  stadium: `<svg class="fallback-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="12" cy="12" rx="9" ry="6"/><ellipse cx="12" cy="12" rx="4" ry="2.4"/></svg>`
};

const DEFAULT_NAME = "My MLB Stadium Tracker";

let trackerName = localStorage.getItem(LS_KEYS.name) || DEFAULT_NAME;
let syncCode = localStorage.getItem(LS_KEYS.code) || "";
let stadiumData = loadLocalData(); // { [stadiumId]: { visited, games: [{id,date,opponent,score,note}] } }

let map = null;
let markers = {};
let firebaseApp = null;
let firestore = null;
let firebaseUser = null;
let unsubscribeSnapshot = null;
let suppressNextWrite = false;

/* ---------------------------------------------------------------------- */
/* Local storage                                                          */
/* ---------------------------------------------------------------------- */

function loadLocalData() {
  try {
    const raw = localStorage.getItem(LS_KEYS.data);
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    console.warn("Could not parse local tracker data, starting fresh.", e);
    return {};
  }
}

function saveLocalData() {
  localStorage.setItem(LS_KEYS.data, JSON.stringify(stadiumData));
}

function getEntry(stadiumId) {
  if (!stadiumData[stadiumId]) {
    stadiumData[stadiumId] = { visited: false, games: [] };
  }
  return stadiumData[stadiumId];
}

/* ---------------------------------------------------------------------- */
/* Mutations (write-through to local + firestore)                         */
/* ---------------------------------------------------------------------- */

function persistAndSync() {
  saveLocalData();
  pushToFirestore();
}

function setVisited(stadiumId, visited) {
  const entry = getEntry(stadiumId);
  entry.visited = visited;
  persistAndSync();
  fullRerender();
}

function addGame(stadiumId, game) {
  const entry = getEntry(stadiumId);
  entry.visited = true;
  game.id = "g" + Date.now() + Math.floor(Math.random() * 1000);
  entry.games.push(game);
  entry.games.sort((a, b) => (a.date < b.date ? 1 : -1));
  persistAndSync();
  fullRerender();
}

function removeGame(stadiumId, gameId) {
  const entry = getEntry(stadiumId);
  entry.games = entry.games.filter(g => g.id !== gameId);
  persistAndSync();
  fullRerender();
}

function fullRerender() {
  renderStats();
  renderMapMarkers();
  renderPassport();
  renderBadges();
  if (currentModalStadiumId) renderModalBody(currentModalStadiumId);
}

/* ---------------------------------------------------------------------- */
/* Stats                                                                  */
/* ---------------------------------------------------------------------- */

function getVisitedStadiums() {
  return STADIUMS.filter(s => stadiumData[s.id] && stadiumData[s.id].visited);
}

function getGameCount() {
  return Object.values(stadiumData).reduce((sum, e) => sum + (e.games ? e.games.length : 0), 0);
}

function getBadgeContext() {
  return {
    visitedStadiums: getVisitedStadiums(),
    gameCount: getGameCount()
  };
}

function getEarnedBadges() {
  const ctx = getBadgeContext();
  return BADGES.filter(b => b.check(ctx));
}

function renderStats() {
  const visited = getVisitedStadiums();
  const states = new Set(visited.map(s => s.state));
  const games = getGameCount();
  const badges = getEarnedBadges().length;

  document.getElementById("stat-visited").innerHTML = `${visited.length}<span class="stat-total">/${STADIUMS.length}</span>`;
  document.getElementById("stat-games").textContent = games;
  document.getElementById("stat-states").textContent = states.size;
  document.getElementById("stat-badges").innerHTML = `${badges}<span class="stat-total">/${BADGES.length}</span>`;

  const pct = Math.round((visited.length / STADIUMS.length) * 100);
  document.getElementById("stat-progress-fill").style.width = pct + "%";
}

/* ---------------------------------------------------------------------- */
/* Map                                                                    */
/* ---------------------------------------------------------------------- */

function initMap() {
  map = L.map("map", { scrollWheelZoom: true }).setView([39.5, -98.35], 4);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 18
  }).addTo(map);

  STADIUMS.forEach(stadium => {
    const marker = L.marker([stadium.lat, stadium.lng], {
      icon: makePinIcon(stadium, false)
    }).addTo(map);

    marker.bindPopup(makePopupHtml(stadium));
    marker.on("popupopen", () => {
      const btn = document.getElementById(`popup-open-${stadium.id}`);
      if (btn) btn.addEventListener("click", () => openModal(stadium.id));
    });

    markers[stadium.id] = marker;
  });

  renderMapMarkers();
}

function makePinIcon(stadium, visited) {
  const color = stadium.mapColor || "#0C2340";
  const abbr = TEAM_ABBR[stadium.id] || "";
  return L.divIcon({
    className: "",
    html: `<div class="pin-chip${visited ? " visited" : ""}" style="--pin-color:${color}">
             <img src="${stadium.logoUrl || ""}" alt="" onerror="this.parentElement.classList.add('logo-failed')">
             <span class="pin-fallback">${abbr}</span>
           </div>`,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
    popupAnchor: [0, -16]
  });
}

function makePopupHtml(stadium) {
  const abbr = TEAM_ABBR[stadium.id] || "";
  return `
    <div class="popup-head">
      <div class="popup-logo-wrap">
        <img src="${stadium.logoUrl || ""}" alt="" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex'">
        <span style="display:none; font-size:10px; font-weight:800; color:${stadium.mapColor || "#0C2340"};">${abbr}</span>
      </div>
      <div>
        <div class="popup-title">${escapeHtml(stadium.stadiumName)}</div>
        <div class="popup-team">${escapeHtml(stadium.team)} &middot; ${escapeHtml(stadium.city)}, ${escapeHtml(stadium.state)}</div>
      </div>
    </div>
    <button class="popup-open-btn" id="popup-open-${stadium.id}">View Details</button>
  `;
}

function renderMapMarkers() {
  STADIUMS.forEach(stadium => {
    const entry = stadiumData[stadium.id];
    const visited = !!(entry && entry.visited);
    const marker = markers[stadium.id];
    if (marker) marker.setIcon(makePinIcon(stadium, visited));
  });
}

/* ---------------------------------------------------------------------- */
/* Modal                                                                  */
/* ---------------------------------------------------------------------- */

let currentModalStadiumId = null;

function openModal(stadiumId) {
  currentModalStadiumId = stadiumId;
  renderModalBody(stadiumId);
  document.getElementById("modal-overlay").classList.add("open");
}

function closeModal() {
  document.getElementById("modal-overlay").classList.remove("open");
  currentModalStadiumId = null;
}

function renderModalBody(stadiumId) {
  const stadium = STADIUMS.find(s => s.id === stadiumId);
  if (!stadium) return;
  const entry = getEntry(stadiumId);
  const abbr = TEAM_ABBR[stadium.id] || "";

  const photosHtml = (stadium.imageUrls || []).map(url =>
    `<img src="${url}" alt="${escapeHtml(stadium.stadiumName)}" loading="lazy" onerror="this.style.display='none'">`
  ).join("");

  const gamesHtml = entry.games.length
    ? entry.games.map(g => `
        <li class="game-log-item">
          <div class="game-info">
            <div class="game-date">${formatDate(g.date)} ${g.opponent ? "vs " + escapeHtml(g.opponent) : ""}</div>
            ${g.score ? `<div class="game-note">Final: ${escapeHtml(g.score)}</div>` : ""}
            ${g.note ? `<div class="game-note">${escapeHtml(g.note)}</div>` : ""}
          </div>
          <button data-remove-game="${g.id}" title="Remove">${ICONS.trash}</button>
        </li>
      `).join("")
    : `<p class="empty-note">No games logged yet.</p>`;

  document.getElementById("modal-body").innerHTML = `
    <div class="stadium-photos-wrap">
      ${ICONS.stadium}
      <div class="stadium-photos">${photosHtml}</div>
      ${(stadium.imageUrls || []).length > 1 ? `<span class="photo-hint">swipe for more photos →</span>` : ""}
    </div>
    <div class="modal-content-inner">
      <div class="modal-head">
        <div class="modal-logo-wrap">
          <img src="${stadium.logoUrl || ""}" alt="" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex'">
          <span style="display:none; font-size:11px; font-weight:800; color:${stadium.mapColor || "#0C2340"};">${abbr}</span>
        </div>
        <div>
          <h2>${escapeHtml(stadium.stadiumName)}</h2>
          <div class="modal-team-line">Home of the ${escapeHtml(stadium.team)}</div>
        </div>
      </div>

      <div class="modal-tag-row">
        <span class="tag">${ICONS.pin} ${escapeHtml(stadium.city)}, ${escapeHtml(stadium.state)}</span>
        <span class="tag">${ICONS.calendar} Opened ${stadium.opened}</span>
        <span class="tag">${ICONS.users} Seats ${Number(stadium.capacity).toLocaleString()}</span>
        <span class="tag">${ICONS.umbrella} ${escapeHtml(stadium.roofType)}</span>
        <span class="tag">${ICONS.compass} ${escapeHtml(stadium.division)}</span>
      </div>

      <div class="section-box">
        <h3>${ICONS.info} Fun Facts</h3>
        <ul>${(stadium.funFacts || []).map(f => `<li>${escapeHtml(f)}</li>`).join("")}</ul>
      </div>

      <div class="visited-toggle-row">
        <label class="switch">
          <input type="checkbox" id="visited-toggle" ${entry.visited ? "checked" : ""}>
          <span class="slider"></span>
        </label>
        <label for="visited-toggle">${entry.visited ? "You've been here" : "Mark as visited"}</label>
      </div>

      <div class="games-section">
        <h3>${ICONS.calendar} Games You Saw Here</h3>
        <ul class="game-log-list">${gamesHtml}</ul>

        <form class="add-game-form" id="add-game-form">
          <div class="form-row">
            <div>
              <label class="field-label">Date</label>
              <input type="date" name="date" required>
            </div>
            <div>
              <label class="field-label">Opponent</label>
              <input type="text" name="opponent" placeholder="e.g. Red Sox">
            </div>
            <div class="full">
              <label class="field-label">Final Score (optional)</label>
              <input type="text" name="score" placeholder="e.g. Yankees 5 - Red Sox 3">
            </div>
            <div class="full">
              <label class="field-label">Notes (optional)</label>
              <textarea name="note" placeholder="Caught a foul ball! Sat behind home plate. etc."></textarea>
            </div>
          </div>
          <button type="submit" class="btn btn-primary">${ICONS.plus} Add Game</button>
        </form>
      </div>
    </div>
  `;

  document.getElementById("visited-toggle").addEventListener("change", e => {
    setVisited(stadiumId, e.target.checked);
  });

  document.getElementById("add-game-form").addEventListener("submit", e => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const date = fd.get("date");
    if (!date) return;
    addGame(stadiumId, {
      date,
      opponent: fd.get("opponent") || "",
      score: fd.get("score") || "",
      note: fd.get("note") || ""
    });
    showToast("Game added.");
  });

  document.getElementById("modal-body").querySelectorAll("[data-remove-game]").forEach(btn => {
    btn.addEventListener("click", () => {
      removeGame(stadiumId, btn.getAttribute("data-remove-game"));
    });
  });
}

function formatDate(iso) {
  try {
    const d = new Date(iso + "T00:00:00");
    return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
  } catch (e) {
    return iso;
  }
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = String(str == null ? "" : str);
  return div.innerHTML;
}

/* ---------------------------------------------------------------------- */
/* Passport                                                                */
/* ---------------------------------------------------------------------- */

function renderPassport() {
  const grid = document.getElementById("passport-grid");
  grid.innerHTML = STADIUMS.slice()
    .sort((a, b) => a.team.localeCompare(b.team))
    .map(stadium => {
      const entry = stadiumData[stadium.id];
      const visited = !!(entry && entry.visited);
      const firstGame = entry && entry.games.length ? entry.games[entry.games.length - 1] : null;
      const abbr = TEAM_ABBR[stadium.id] || "";
      return `
        <div class="stamp-card ${visited ? "" : "unvisited"}" data-open-stadium="${stadium.id}">
          <div class="stamp-circle" style="--stamp-color:${stadium.mapColor || "#0C2340"}">
            <img src="${stadium.logoUrl || ""}" alt="" onerror="this.parentElement.classList.add('logo-failed')">
            <span class="stamp-fallback">${abbr}</span>
          </div>
          <div class="stamp-team">${escapeHtml(stadium.team)}</div>
          ${visited && firstGame ? `<div class="stamp-date">${formatDate(firstGame.date)}</div>` : ""}
          ${visited && entry.games.length ? `<div class="stamp-games">${entry.games.length} game${entry.games.length > 1 ? "s" : ""} logged</div>` : ""}
          ${!visited ? `<div class="stamp-date">Not visited yet</div>` : ""}
        </div>
      `;
    }).join("");

  grid.querySelectorAll("[data-open-stadium]").forEach(card => {
    card.addEventListener("click", () => openModal(card.getAttribute("data-open-stadium")));
  });
}

/* ---------------------------------------------------------------------- */
/* Badges                                                                  */
/* ---------------------------------------------------------------------- */

function renderBadges() {
  const ctx = getBadgeContext();
  const grid = document.getElementById("badges-grid");
  grid.innerHTML = BADGES.map(b => {
    const earned = b.check(ctx);
    let iconHtml;
    if (!earned) {
      iconHtml = `<div class="badge-icon">${ICONS.lock}</div>`;
    } else if (b.monogram) {
      iconHtml = `<div class="badge-icon monogram" style="background:${b.chipColor}">${b.monogram}</div>`;
    } else {
      iconHtml = `<div class="badge-icon">${b.icon}</div>`;
    }
    return `
      <div class="badge-card ${earned ? "" : "locked"}">
        ${iconHtml}
        <div>
          <div class="badge-name">${escapeHtml(b.name)}</div>
          <div class="badge-desc">${escapeHtml(b.desc)}</div>
        </div>
      </div>
    `;
  }).join("");
}

/* ---------------------------------------------------------------------- */
/* Tabs                                                                     */
/* ---------------------------------------------------------------------- */

function initTabs() {
  document.querySelectorAll(".tab-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".tab-btn").forEach(b => {
        b.classList.remove("active");
        b.setAttribute("aria-selected", "false");
      });
      document.querySelectorAll(".tab-panel").forEach(p => p.classList.remove("active"));
      btn.classList.add("active");
      btn.setAttribute("aria-selected", "true");
      document.getElementById("tab-" + btn.dataset.tab).classList.add("active");
      if (btn.dataset.tab === "map" && map) {
        setTimeout(() => map.invalidateSize(), 50);
      }
    });
  });
}

/* ---------------------------------------------------------------------- */
/* Settings                                                                 */
/* ---------------------------------------------------------------------- */

function initSettings() {
  document.getElementById("tracker-name-input").value = trackerName;
  document.getElementById("sync-code-input").value = syncCode;
  document.getElementById("tracker-name-display").textContent = trackerName;

  document.getElementById("save-name-btn").addEventListener("click", () => {
    const val = document.getElementById("tracker-name-input").value.trim();
    trackerName = val || DEFAULT_NAME;
    localStorage.setItem(LS_KEYS.name, trackerName);
    document.getElementById("tracker-name-display").textContent = trackerName;
    showToast("Name saved.");
  });

  document.getElementById("save-code-btn").addEventListener("click", () => {
    const val = document.getElementById("sync-code-input").value.trim();
    connectSyncCode(val);
  });

  document.getElementById("new-code-btn").addEventListener("click", () => {
    const code = randomCode();
    document.getElementById("sync-code-input").value = code;
    connectSyncCode(code);
  });

  document.getElementById("export-btn").addEventListener("click", exportBackup);
  document.getElementById("import-input").addEventListener("change", importBackup);

  document.getElementById("reset-btn").addEventListener("click", () => {
    if (confirm("This will erase all visited parks and logged games on this device. Are you sure?")) {
      stadiumData = {};
      saveLocalData();
      pushToFirestore();
      fullRerender();
      showToast("All data cleared.");
    }
  });

  updateSyncStatusUi();
}

function randomCode() {
  const words = ["park", "homer", "grandslam", "dugout", "fastball", "rookie", "curveball", "bleacher"];
  const w = words[Math.floor(Math.random() * words.length)];
  return `${w}-${Math.floor(1000 + Math.random() * 9000)}`;
}

function exportBackup() {
  const payload = {
    trackerName,
    exportedAt: new Date().toISOString(),
    stadiumData
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "mlb-stadium-tracker-backup.json";
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
  showToast("Backup downloaded.");
}

function importBackup(e) {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const payload = JSON.parse(reader.result);
      if (payload.stadiumData) {
        stadiumData = payload.stadiumData;
        if (payload.trackerName) {
          trackerName = payload.trackerName;
          localStorage.setItem(LS_KEYS.name, trackerName);
          document.getElementById("tracker-name-display").textContent = trackerName;
          document.getElementById("tracker-name-input").value = trackerName;
        }
        saveLocalData();
        pushToFirestore();
        fullRerender();
        showToast("Backup imported.");
      } else {
        alert("That doesn't look like a valid backup file.");
      }
    } catch (err) {
      alert("Couldn't read that file: " + err.message);
    }
    e.target.value = "";
  };
  reader.readAsText(file);
}

/* ---------------------------------------------------------------------- */
/* Toast                                                                    */
/* ---------------------------------------------------------------------- */

let toastTimer = null;
function showToast(msg) {
  const el = document.getElementById("toast");
  el.textContent = msg;
  el.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove("show"), 2200);
}

/* ---------------------------------------------------------------------- */
/* Modal close handlers                                                     */
/* ---------------------------------------------------------------------- */

function initModalChrome() {
  document.getElementById("modal-close").addEventListener("click", closeModal);
  document.getElementById("modal-overlay").addEventListener("click", e => {
    if (e.target.id === "modal-overlay") closeModal();
  });
  document.addEventListener("keydown", e => {
    if (e.key === "Escape") closeModal();
  });
}

/* ---------------------------------------------------------------------- */
/* Firebase sync (optional)                                                 */
/* ---------------------------------------------------------------------- */

function initFirebase() {
  if (typeof FIREBASE_ENABLED === "undefined" || !FIREBASE_ENABLED || !FIREBASE_CONFIG.apiKey) {
    updateSyncStatusUi();
    return;
  }
  try {
    firebaseApp = firebase.initializeApp(FIREBASE_CONFIG);
    firestore = firebase.firestore();
    firebase.auth().signInAnonymously().catch(err => {
      console.error("Firebase anonymous sign-in failed", err);
      updateSyncStatusUi("error");
    });
    firebase.auth().onAuthStateChanged(user => {
      firebaseUser = user;
      if (user && syncCode) {
        subscribeToCode(syncCode);
      }
      updateSyncStatusUi();
    });
  } catch (err) {
    console.error("Firebase init failed", err);
    updateSyncStatusUi("error");
  }
}

function isFirebaseReady() {
  return !!(typeof FIREBASE_ENABLED !== "undefined" && FIREBASE_ENABLED && firestore && firebaseUser);
}

function connectSyncCode(code) {
  syncCode = code;
  localStorage.setItem(LS_KEYS.code, syncCode);
  if (!code) {
    if (unsubscribeSnapshot) unsubscribeSnapshot();
    updateSyncStatusUi();
    return;
  }
  if (isFirebaseReady()) {
    subscribeToCode(code);
  } else {
    updateSyncStatusUi();
  }
}

function subscribeToCode(code) {
  if (!firestore) return;
  if (unsubscribeSnapshot) unsubscribeSnapshot();

  const docRef = firestore.collection("trackers").doc(code);

  docRef.get().then(snap => {
    if (snap.exists && snap.data().stadiums) {
      // Remote already has data for this code — merge it in as the source of truth.
      stadiumData = snap.data().stadiums;
      saveLocalData();
      fullRerender();
    } else {
      // No remote data yet — seed it with whatever is local.
      docRef.set({ stadiums: stadiumData, trackerName, updatedAt: firebase.firestore.FieldValue.serverTimestamp() }, { merge: true });
    }

    unsubscribeSnapshot = docRef.onSnapshot(snap => {
      if (!snap.exists) return;
      const remote = snap.data();
      if (remote.stadiums) {
        suppressNextWrite = true;
        stadiumData = remote.stadiums;
        saveLocalData();
        fullRerender();
      }
    }, err => {
      console.error("Sync listener error", err);
      updateSyncStatusUi("error");
    });

    updateSyncStatusUi("ok");
  }).catch(err => {
    console.error("Could not connect to sync code", err);
    updateSyncStatusUi("error");
  });
}

function pushToFirestore() {
  if (suppressNextWrite) {
    suppressNextWrite = false;
    return;
  }
  if (!isFirebaseReady() || !syncCode) return;
  firestore.collection("trackers").doc(syncCode).set({
    stadiums: stadiumData,
    trackerName,
    updatedAt: firebase.firestore.FieldValue.serverTimestamp()
  }, { merge: true }).catch(err => console.error("Sync write failed", err));
}

function updateSyncStatusUi(state) {
  const el = document.getElementById("sync-status");
  const firebaseConfigured = typeof FIREBASE_ENABLED !== "undefined" && FIREBASE_ENABLED && FIREBASE_CONFIG.apiKey;

  if (!firebaseConfigured) {
    el.textContent = "Saving on this device only. See README.md to turn on cross-device sync (free, ~5 min setup).";
    el.className = "sync-status";
    return;
  }
  if (state === "error") {
    el.textContent = "Couldn't connect to sync. Saving on this device only for now.";
    el.className = "sync-status";
    return;
  }
  if (!syncCode) {
    el.textContent = "Enter a sync code above (any words you'll remember) and tap Connect to sync across devices.";
    el.className = "sync-status";
    return;
  }
  if (state === "ok") {
    el.textContent = `Synced — use code "${syncCode}" on your other devices to see the same data.`;
    el.className = "sync-status ok";
    return;
  }
  el.textContent = "Connecting…";
  el.className = "sync-status";
}

/* ---------------------------------------------------------------------- */
/* Init                                                                     */
/* ---------------------------------------------------------------------- */

document.addEventListener("DOMContentLoaded", () => {
  initTabs();
  initModalChrome();
  initSettings();
  initMap();
  renderStats();
  renderPassport();
  renderBadges();
  initFirebase();
});
