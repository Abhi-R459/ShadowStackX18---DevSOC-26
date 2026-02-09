import express from "express";
import { verifyToken, requireRole } from "../middleware/auth.js";
import { rtdb } from "../firebaseAdmin.js";

const router = express.Router();

// GET /analyses
// Manager-only: list all analyses across users. Uses a collectionGroup query
// to read all `analyses` subcollections. We attach owner uid from the
// document reference path. This endpoint is protected by token verification
// and role enforcement server-side to avoid client-side role tampering.
router.get("/", verifyToken, requireRole("manager"), async (req, res) => {
  try {
    const snap = await rtdb.ref("calls").get();
    const calls = snap.exists() ? Object.values(snap.val() || {}) : [];
    return res.json({ analyses: calls });
  } catch (err) {
    console.error("Failed to list analyses:", err && err.message ? err.message : err);
    return res.status(500).json({ error: "Failed to list analyses" });
  }
});

// GET /analyses/me
// Returns analyses belonging to the authenticated user. Customers receive only
// summary fields to avoid exposing internals; agents receive full records.
router.get("/me", verifyToken, async (req, res) => {
  try {
    const uid = req.user && req.user.uid;
    if (!uid) return res.status(401).json({ error: "Unauthenticated" });

    const roleSnap = await rtdb.ref(`users/${uid}`).get();
    const role = roleSnap.exists() ? roleSnap.val().role : null;

    const snap = await rtdb.ref("calls").orderByChild("agentId").equalTo(uid).get();
    const items = snap.exists() ? Object.values(snap.val() || {}) : [];
    if (role === "customer") {
      // Expose only summaries to customers
      const summaries = items.map((it) => ({
        callId: it.callId,
        summary: it.summary || null,
        createdAt: it.createdAt || null,
      }));
      return res.json({ analyses: summaries });
    }

    // Agents or managers requesting their own analyses see full records
    return res.json({ analyses: items });
  } catch (err) {
    console.error("Failed to fetch user analyses:", err && err.message ? err.message : err);
    return res.status(500).json({ error: "Failed to fetch analyses" });
  }
});

export default router;
