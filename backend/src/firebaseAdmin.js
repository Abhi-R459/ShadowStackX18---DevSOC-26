import admin from "firebase-admin";
import fs from "fs";

// Initialize Firebase Admin SDK for server-side token verification and Firestore.
// Prefer a JSON service account via FIREBASE_SERVICE_ACCOUNT_JSON, otherwise
// fall back to GOOGLE_APPLICATION_CREDENTIALS or application default.

function initAdmin() {
  if (admin.apps && admin.apps.length) return admin; // already initialized

  const svcJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (svcJson) {
    try {
      const parsed = JSON.parse(svcJson);
      admin.initializeApp({ credential: admin.credential.cert(parsed) });
      return admin;
    } catch (e) {
      console.error("Failed to parse FIREBASE_SERVICE_ACCOUNT_JSON:", e.message);
      throw e;
    }
  }

  // If a path to a service account key file is provided via GOOGLE_APPLICATION_CREDENTIALS,
  // the Admin SDK will pick it up automatically when calling initializeApp without args.
  try {
    admin.initializeApp();
    return admin;
  } catch (e) {
    console.error("Failed to initialize Firebase Admin SDK:", e.message);
    throw e;
  }
}

const adminApp = initAdmin();
const db = adminApp.firestore();

export { adminApp as admin, db };
