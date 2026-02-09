import express from "express";
import { verifyToken, requireRole } from "../middleware/auth.js";
import { rtdb } from "../firebaseAdmin.js";

const router = express.Router();

// GET /api/analytics/manager/overview
router.get("/overview", verifyToken, requireRole("manager"), async (req, res) => {
  try {
    const snap = await rtdb.ref("calls").get();
    if (!snap.exists()) {
      return res.json({ hasData: false, message: "No calls analyzed yet" });
    }

    const calls = Object.values(snap.val() || {});
    const analyzed = calls.filter((c) => c && c.analysisStatus === "ANALYZED");
    if (!analyzed.length) {
      return res.json({ hasData: false, message: "No calls analyzed yet" });
    }

    return res.json({
      hasData: true,
      totalCallsAnalyzed: analyzed.length,
      highRiskClients: null,
      likelyPaymentsNextMonth: null,
      complianceScore: null,
    });
  } catch (err) {
    console.error("analytics/overview error:", err && err.message ? err.message : err);
    return res.status(500).json({ error: "Failed to compute overview" });
  }
});

// GET /api/analytics/manager/payment-forecast
router.get("/payment-forecast", verifyToken, requireRole("manager"), async (req, res) => {
  try {
    const snap = await rtdb.ref("calls").get();
    if (!snap.exists()) {
      return res.json({ hasData: false, message: "No calls analyzed yet" });
    }
    const calls = Object.values(snap.val() || {});
    const analyzed = calls.filter((c) => c && c.analysisStatus === "ANALYZED");
    if (!analyzed.length) {
      return res.json({ hasData: false, message: "No calls analyzed yet" });
    }

    return res.json([]);
  } catch (err) {
    console.error("analytics/payment-forecast error:", err && err.message ? err.message : err);
    return res.status(500).json({ error: "Failed to compute payment forecast" });
  }
});

// GET /api/analytics/manager/risk-by-agent
router.get("/risk-by-agent", verifyToken, requireRole("manager"), async (req, res) => {
  try {
    const snap = await rtdb.ref("calls").get();
    if (!snap.exists()) {
      return res.json({ hasData: false, message: "No calls analyzed yet" });
    }
    const calls = Object.values(snap.val() || {});
    const analyzed = calls.filter((c) => c && c.analysisStatus === "ANALYZED");
    if (!analyzed.length) {
      return res.json({ hasData: false, message: "No calls analyzed yet" });
    }

    return res.json([]);
  } catch (err) {
    console.error("analytics/risk-by-agent error:", err && err.message ? err.message : err);
    return res.status(500).json({ error: "Failed to compute risk by agent" });
  }
});

export default router;
