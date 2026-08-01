import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getDatabase, Database } from "firebase/database";
import { getFirestore, Firestore } from "firebase/firestore";
import { getAnalytics, Analytics, isSupported } from "firebase/analytics";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "",
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL || "",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "",
};

export const isFirebaseConfigured = (): boolean => {
  return Boolean(firebaseConfig.apiKey && firebaseConfig.projectId);
};

let app: FirebaseApp | null = null;
let database: Database | null = null;
let db: Firestore | null = null;
let analytics: Analytics | null = null;

try {
  if (typeof window !== "undefined" || isFirebaseConfigured()) {
    if (!getApps().length) {
      app = initializeApp(firebaseConfig);
    } else {
      app = getApp();
    }

    if (app) {
      try {
        database = getDatabase(app);
      } catch (err) {
        console.warn("Firebase Realtime Database init warning:", err);
      }

      try {
        db = getFirestore(app);
      } catch (err) {
        console.warn("Firebase Firestore init warning:", err);
      }

      if (typeof window !== "undefined") {
        isSupported().then((supported) => {
          if (supported && app) {
            try {
              analytics = getAnalytics(app);
            } catch (err) {
              console.warn("Firebase Analytics init warning:", err);
            }
          }
        });
      }
    }
  }
} catch (error) {
  console.error("Firebase SDK Initialization error:", error);
}

export { app, database, db, analytics, firebaseConfig };
