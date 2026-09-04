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
  apiKey: "",
  authDomain: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: ""
};

const FIREBASE_ENABLED = false;
