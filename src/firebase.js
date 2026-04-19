// Firebase - Full integration: Analytics, Firestore, Auth
import { initializeApp } from 'firebase/app';
import { getAnalytics, logEvent } from 'firebase/analytics';
import {
  getFirestore,
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  limit,
  serverTimestamp,
  doc,
  setDoc,
  getDoc,
} from 'firebase/firestore';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDummyKeyForSimulationOnlyValXyz123",
  authDomain: "smart-stadium-demo.firebaseapp.com",
  projectId: "smart-stadium-demo",
  storageBucket: "smart-stadium-demo.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:xyz1234567890xyz",
  measurementId: "G-12345XYZ",
};

// Initialize Firebase services
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// Analytics - safe init (may fail in non-browser env)
let analytics = null;
try {
  analytics = getAnalytics(app);
} catch (e) {
  console.warn('Analytics unavailable:', e.message);
}

// ── Analytics ─────────────────────────────────────────────
export const logAnalyticsEvent = (eventName, params = {}) => {
  try {
    if (analytics) logEvent(analytics, eventName, params);
  } catch (e) {
    console.warn('logEvent error:', e.message);
  }
};

// ── Firestore: Alerts ──────────────────────────────────────
export const saveAlertToFirestore = async (text, type) => {
  try {
    const ref = await addDoc(collection(db, 'alerts'), {
      text,
      type,
      createdAt: serverTimestamp(),
    });
    return ref.id;
  } catch (e) {
    console.warn('Firestore saveAlert error:', e.message);
    return null;
  }
};

export const subscribeToAlerts = (callback) => {
  const q = query(
    collection(db, 'alerts'),
    orderBy('createdAt', 'desc'),
    limit(20)
  );
  return onSnapshot(q, (snap) => {
    const docs = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    callback(docs);
  }, (e) => console.warn('Firestore snapshot error:', e.message));
};

// ── Firestore: Orders ──────────────────────────────────────
export const saveOrderToFirestore = async (stallId, stallName, waitTime) => {
  try {
    const ref = await addDoc(collection(db, 'orders'), {
      stallId,
      stallName,
      waitTime,
      token: `#A${Math.floor(Math.random() * 900 + 100)}`,
      status: 'pending',
      createdAt: serverTimestamp(),
    });
    return ref.id;
  } catch (e) {
    console.warn('Firestore saveOrder error:', e.message);
    return null;
  }
};

// ── Firestore: Crowd Density ───────────────────────────────
export const saveCrowdSnapshot = async (zones) => {
  try {
    await setDoc(doc(db, 'crowdSnapshots', 'latest'), {
      zones,
      updatedAt: serverTimestamp(),
    });
  } catch (e) {
    console.warn('Firestore saveCrowdSnapshot error:', e.message);
  }
};

// ── Auth: Google Sign-In ───────────────────────────────────
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    logAnalyticsEvent('login', { method: 'google' });
    return result.user;
  } catch (e) {
    console.warn('Google sign-in error:', e.message);
    return null;
  }
};

// ── Auth: Email/Password Sign-In ───────────────────────────
export const signInWithEmail = async (email, password) => {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    logAnalyticsEvent('login', { method: 'email' });
    return result.user;
  } catch (e) {
    console.warn('Email sign-in error:', e.message);
    throw e;
  }
};

// ── Auth: Sign Out ─────────────────────────────────────────
export const firebaseSignOut = async () => {
  try {
    await signOut(auth);
    logAnalyticsEvent('logout');
  } catch (e) {
    console.warn('Sign-out error:', e.message);
  }
};

// ── Auth: State Observer ───────────────────────────────────
export const onAuthChange = (callback) => onAuthStateChanged(auth, callback);

export { db, auth };
export default app;
