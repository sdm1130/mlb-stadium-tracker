/*
  OPTIONAL: cross-device sync.

  The tracker works great with zero setup — data is saved right in the
  browser. If you want the SAME data to show up on more than one device
  (e.g. dad's phone and the family iPad), follow the ~5 minute setup in
  README.md to create a free Firebase project, then paste your config
  below and flip FIREBASE_ENABLED to true.

  These values are safe to commit/publish — they are not secret keys,
  they just tell the browser which Firebase project to talk to. Access
  is controlled separately by Firestore security rules (see README.md).
*/

const FIREBASE_CONFIG = {
  apiKey: "AIzaSyDSrsP1cUWHXRAxABMcwijU6vOMwb4o8aI",
  authDomain: "ethan-mlb-stadium-tracker.firebaseapp.com",
  projectId: "ethan-mlb-stadium-tracker",
  storageBucket: "ethan-mlb-stadium-tracker.firebasestorage.app",
  messagingSenderId: "1045199256250",
  appId: "1:1045199256250:web:09b7c79823c73760432083"
};

const FIREBASE_ENABLED = true;
