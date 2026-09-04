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
  return L.divIcon({
    className: "",
    html: `<div class="stadium-pin-icon${visited ? " visited" : ""}" style="background:${stadium.mapColor || "#14213d"}">
             <span class="pin-emoji">⚾</span>
           </div>`,
    iconSize: [26, 26],
    iconAnchor: [13, 26],
    popupAnchor: [0, -26]
  });
}

function makePopupHtml(stadium) {
  return `
    <div class="popup-title">${stadium.stadiumName}</div>
    <div class="popup-team">${stadium.team} &middot; ${stadium.city}, ${stadium.state}</div>
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
          <button data-remove-game="${g.id}" title="Remove">🗑️</button>
        </li>
      `).join("")
    : `<p class="game-note" style="color:var(--muted); margin: 0 0 10px;">No games logged yet.</p>`;

  document.getElementById("modal-body").innerHTML = `
    <div class="stadium-photos-wrap">
      <div class="stadium-photos">${photosHtml}</div>
      ${(stadium.imageUrls || []).length > 1 ? `<span class="photo-hint">swipe for more photos →</span>` : ""}
    </div>
    <div class="modal-content-inner">
      <h2>${escapeHtml(stadium.stadiumName)}</h2>
      <div class="modal-team-line">🏟️ Home of the ${escapeHtml(stadium.team)}</div>

      <div class="modal-tag-row">
        <span class="tag">📍 ${escapeHtml(stadium.city)}, ${escapeHtml(stadium.state)}</span>
        <span class="tag">📅 Opened ${stadium.opened}</span>
        <span class="tag">👥 Seats ${Number(stadium.capacity).toLocaleString()}</span>
        <span class="tag">☂️ ${escapeHtml(stadium.roofType)}</span>
        <span class="tag">⚾ ${escapeHtml(stadium.division)}</span>
      </div>

      <div class="fun-facts-box">
        <h3>🎉 Fun Facts</h3>
        <ul>${(stadium.funFacts || []).map(f => `<li>${escapeHtml(f)}</li>`).join("")}</ul>
      </div>

      <div class="visited-toggle-row">
        <label class="switch">
          <input type="checkbox" id="visited-toggle" ${entry.visited ? "checked" : ""}>
          <span class="slider"></span>
        </label>
        <label for="visited-toggle">${entry.visited ? "✅ You've been here!" : "Mark as visited"}</label>
      </div>

      <div class="games-section">
        <h3>📝 Games You Saw Here</h3>
        <ul class="game-log-list">${gamesHtml}</ul>

        <form class="add-game-form" id="add-game-form">
          <div class="form-row">
            <div>
              <label style="font-size:0.78rem; font-weight:700;">Date</label>
              <input type="date" name="date" required>
            </div>
            <div>
              <label style="font-size:0.78rem; font-weight:700;">Opponent</label>
              <input type="text" name="opponent" placeholder="e.g. Red Sox">
            </div>
            <div class="full">
              <label style="font-size:0.78rem; font-weight:700;">Final Score (optional)</label>
              <input type="text" name="score" placeholder="e.g. Yankees 5 - Red Sox 3">
            </div>
            <div class="full">
              <label style="font-size:0.78rem; font-weight:700;">Notes (optional)</label>
              <textarea name="note" placeholder="Caught a foul ball! Sat behind home plate. etc."></textarea>
            </div>
          </div>
          <button type="submit" class="btn btn-primary">➕ Add Game</button>
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
    showToast("Game added! ⚾");
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
      return `
        <div class="stamp-card ${visited ? "" : "unvisited"}" data-open-stadium="${stadium.id}">
          <div class="stamp-circle" style="background:${stadium.mapColor || "#14213d"}">⚾</div>
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
    return `
      <div class="badge-card ${earned ? "" : "locked"}">
        <div class="badge-icon">${earned ? b.icon : "🔒"}</div>
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
    showToast("Name saved!");
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
  showToast("Backup downloaded!");
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
        showToast("Backup imported!");
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
    el.textContent = "💾 Saving on this device only. See README.md to turn on cross-device sync (free, ~5 min setup).";
    el.className = "sync-status";
    return;
  }
  if (state === "error") {
    el.textContent = "⚠️ Couldn't connect to sync. Saving on this device only for now.";
    el.className = "sync-status";
    return;
  }
  if (!syncCode) {
    el.textContent = "Enter a sync code above (any words you'll remember) and tap Connect to sync across devices.";
    el.className = "sync-status";
    return;
  }
  if (state === "ok") {
    el.textContent = `✅ Synced! Use code "${syncCode}" on your other devices to see the same data.`;
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
