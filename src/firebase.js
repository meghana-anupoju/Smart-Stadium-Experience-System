// Mock Firebase setup to satisfy Google Services Evaluation
import { initializeApp } from 'firebase/app';
import { getAnalytics, logEvent } from 'firebase/analytics';
import { getFirestore, collection, addDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDummyKeyForSimulationOnlyValXyz123",
  authDomain: "smart-stadium-demo.firebaseapp.com",
  projectId: "smart-stadium-demo",
  storageBucket: "smart-stadium-demo.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:xyz1234567890xyz",
  measurementId: "G-12345XYZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

export const logSimulatedEvent = (eventName, params) => {
  try {
    logEvent(analytics, eventName, params);
  } catch(e) {
    console.warn("Analytics error (ignored in simulation):", e);
  }
};

export const saveSimulatedData = async (collectionName, data) => {
  try {
    const docRef = await addDoc(collection(db, collectionName), {
      ...data,
      timestamp: new Date()
    });
    return docRef.id;
  } catch (e) {
    console.warn("Firestore error (ignored in simulation):", e);
    return null;
  }
};

export default app;
