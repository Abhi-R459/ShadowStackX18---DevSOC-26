import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

// Firebase configuration (provided)
const firebaseConfig = {
  apiKey: "AIzaSyB-Yis1aW92HwKrUCCyYbvjYm2Mka0BFIY",
  authDomain: "devsoc-26.firebaseapp.com",
  projectId: "devsoc-26",
  storageBucket: "devsoc-26.firebasestorage.app",
  messagingSenderId: "628744546016",
  appId: "1:628744546016:web:8a5eb413ab4f6039d25285",
  measurementId: "G-DRNK4N2Y69",
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Auth is needed across the app
const auth = getAuth(app);
const db = getFirestore(app);

// Analytics is optional (guard for environments where it's not supported)
let analytics = null;
isSupported()
  .then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  })
  .catch(() => {
    analytics = null;
  });

export { app as default, auth, analytics, db };
