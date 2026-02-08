import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  sendEmailVerification,
  reload,
} from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "./firebase";

const FIREBASE_NOT_CONFIGURED =
  "Firebase is not configured. Copy .env.example to .env and add your Firebase project keys.";

function requireAuth() {
  if (!auth) {
    throw new Error(FIREBASE_NOT_CONFIGURED);
  }
}

/**
 * Log in with email and password
 * @param {string} email
 * @param {string} password
 * @returns {Promise<import(\"firebase/auth\").UserCredential>}
 */
export async function loginWithEmailAndPassword(email, password) {
  requireAuth();
  return signInWithEmailAndPassword(auth, email, password);
}

/**
 * Create a new user with email and password
 * @param {string} email
 * @param {string} password
 * @returns {Promise<import(\"firebase/auth\").UserCredential>}
 */
export async function createUser(email, password, role = "customer") {
  requireAuth();
  const credential = await createUserWithEmailAndPassword(auth, email, password);
  // Persist role in Firestore for this uid
  const { uid } = credential.user;
  await setDoc(doc(db, "users", uid), {
    role,
    email,
    createdAt: serverTimestamp(),
  });
  return credential;
}

/**
 * Send password reset email to the given address
 * @param {string} email
 * @returns {Promise<void>}
 */
export async function sendPasswordReset(email) {
  requireAuth();
  return sendPasswordResetEmail(auth, email);
}

/**
 * Sign out the current user
 * @returns {Promise<void>}
 */
export async function logout() {
  if (!auth) return;
  return signOut(auth);
}

/**
 * Send email verification link to the current user.
 * Uses a link-based flow so clicking the link completes verification.
 * @param {import(\"firebase/auth\").User} user
 * @returns {Promise<void>}
 */
export async function sendVerificationEmail(user) {
  requireAuth();
  if (!user) throw new Error("No user to verify.");
  const actionCodeSettings = {
    // After clicking the link, route them to the entry page where they can sign in
    url: `${window.location.origin}/enter`,
    handleCodeInApp: false,
  };
  return sendEmailVerification(user, actionCodeSettings);
}

/**
 * Reload the current user from the server (e.g. after they verified email)
 * @param {import(\"firebase/auth\").User} user
 * @returns {Promise<void>}
 */
export async function reloadUser(user) {
  if (!auth || !user) return;
  return reload(user);
}

/**
 * Fetch the user's profile (role) from Firestore
 * @param {string} uid
 * @returns {Promise<{role?: string, email?: string} | null>}
 */
export async function getUserProfile(uid) {
  if (!db || !uid) return null;
  const snap = await getDoc(doc(db, "users", uid));
  return snap.exists() ? snap.data() : null;
}
