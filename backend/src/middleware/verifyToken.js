import { admin, rtdb } from "../firebaseAdmin.js";

// verifyToken middleware
// - Extracts the Firebase ID token from the Authorization header (Bearer token).
// - Verifies the token with Firebase Admin SDK to ensure signature and expiry are valid.
// - Attaches a minimal `req.user` object with `uid`, `email`, and `role` from Firestore.
// Why: Token verification prevents unauthenticated clients from calling protected APIs.
// The server must validate tokens instead of trusting client-sent identifiers.
// Role-based security: we read the server-side `users/{uid}` document and use its
// `role` field for authorization decisions — this prevents clients from spoofing roles.
export default async function verifyToken(req, res, next) {
  try {
    const authHeader = (req.headers.authorization || "").trim();
    if (!authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Missing or malformed Authorization header" });
    }

    const idToken = authHeader.split(" ")[1];
    if (!idToken) return res.status(401).json({ error: "Missing ID token" });

    // Verify the token using Firebase Admin SDK. This checks signature, expiry, and
    // revocation state (if revoke check is enabled server-side).
    const decoded = await admin.auth().verifyIdToken(idToken);

    // Attach minimal decoded token info
    req.user = {
      uid: decoded.uid,
      email: decoded.email || null,
    };

    // Read the authoritative role from Firestore users/{uid}
    const snap = await rtdb.ref(`users/${req.user.uid}`).get();
    req.user.role = snap.exists() ? snap.val().role : null;

    return next();
  } catch (err) {
    console.error("verifyToken error:", err && err.message ? err.message : err);
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}
