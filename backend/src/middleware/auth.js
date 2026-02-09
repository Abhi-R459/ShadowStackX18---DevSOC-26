import { admin, rtdb } from "../firebaseAdmin.js";

// Verify Firebase ID token and attach decoded token to req.user
export async function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Missing auth token" });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = await admin.auth().verifyIdToken(token);
    // Attach decoded token (uid, email, claims)
    req.user = decoded;
    return next();
  } catch (err) {
    console.error("verifyToken failed:", err && err.message ? err.message : err);
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}

// requireRole middleware ensures the authenticated user has one of the allowed roles.
export function requireRole(...allowedRoles) {
  return async (req, res, next) => {
    try {
      const uid = req.user && req.user.uid;
      if (!uid) return res.status(401).json({ error: "Unauthenticated" });

      const snap = await rtdb.ref(`users/${uid}`).get();
      if (!snap.exists()) {
        return res.status(403).json({ error: "User role not found" });
      }

      const role = snap.val() && snap.val().role;
      if (!allowedRoles.includes(role)) {
        return res.status(403).json({
          error: "Unauthorized access",
          required: allowedRoles,
          actual: role,
        });
      }

      // Attach the authoritative role to req.user for downstream handlers
      req.user.role = role;
      return next();
    } catch (err) {
      console.error("requireRole error:", err && err.message ? err.message : err);
      return res.status(500).json({ error: "Internal server error" });
    }
  };
}
