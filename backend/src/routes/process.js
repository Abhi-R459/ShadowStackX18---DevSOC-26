import express from "express";
import { runIntelligence } from "../intelligence/fusion.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const transcripts = req.body.transcripts || [
      "I paid 5000 on Jan 12",
      "EMI still shows unpaid"
    ];

    const documentData = {
      transactions: [{ amount: 5000, date: "2026-01-12" }],
      confidence: 0.92
    };

    const result = await runIntelligence(transcripts, documentData);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: "processing failed" });
  }
});

export default router;
