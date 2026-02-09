import { admin, rtdb } from "../firebaseAdmin.js";

// Middleware: verify Firebase ID token from Authorization header and attach user info.
// Security notes:
// - We rely on Firebase Admin SDK to validate the token signature and expiry.
// - We fetch the user's Firestore profile to read their assigned role. The role stored
//   in Firestore is authoritative for server-side authorization decisions.

export default async function verifyFirebaseToken(req, res, next) {
  try {
    const authHeader = (req.headers.authorization || "").trim();
    if (!authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Missing or malformed Authorization header" });
    }

    const idToken = authHeader.split(" ")[1];
    if (!idToken) {
      return res.status(401).json({ error: "Missing ID token" });
    }

    // Verify the token with Firebase Admin SDK
    const decoded = await admin.auth().verifyIdToken(idToken);

    // Attach minimal auth principal to request
    req.user = {
      uid: decoded.uid,
      email: decoded.email || null,
    };

    // Fetch role from Firestore users/{uid}. We trust this server-side value.
    const snap = await rtdb.ref(`users/${req.user.uid}`).get();
    const profile = snap.exists() ? snap.val() : {};
    req.user.role = profile.role || null;

    return next();
  } catch (err) {
    console.error("Token verification failed:", err && err.message ? err.message : err);
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}
