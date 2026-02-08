import express from "express";
import { runIntelligence } from "../intelligence/fusion.js";
import { extractFinancialData } from "../services/documentIntelligence.js";

const router = express.Router();

/*
POST /process

Body (required):
{
  "transcripts": ["string", ...]
}

This endpoint expects an array of short call-transcript strings. We perform
lightweight validation here to keep the backend resilient during demos.
*/

router.post("/", async (req, res) => {
  try {
    const { transcripts } = req.body || {};

    // Basic validations: presence, type and content constraints.
    if (!transcripts || !Array.isArray(transcripts)) {
      return res.status(400).json({ error: "'transcripts' must be an array." });
    }

    if (transcripts.length === 0) {
      return res.status(400).json({ error: "'transcripts' must contain at least one message." });
    }

    if (transcripts.length > 50) {
      return res.status(400).json({ error: "'transcripts' array too large (max 50)." });
    }

    // Ensure each item is a non-empty string and trim excess length for safety.
    const cleaned = [];
    for (let i = 0; i < transcripts.length; i++) {
      const t = transcripts[i];
      if (typeof t !== "string") {
        return res.status(400).json({ error: "each transcript must be a string." });
      }
      const s = t.trim();
      if (s.length === 0) {
        return res.status(400).json({ error: "transcripts must not contain empty strings." });
      }
      // Trim extremely long input to avoid large prompts (demo-friendly limit).
      cleaned.push(s.length > 3000 ? s.slice(0, 3000) : s);
    }

    // Get structured document intelligence (Backboard wrapper).
    // In demo mode this is mocked by `extractFinancialData`.
    const documentData = await extractFinancialData();

    const result = await runIntelligence(cleaned, documentData);

    return res.json(result);

  } catch (error) {
    // Avoid logging secrets; only surface minimal error info in logs.
    console.error("Processing error:", error && error.message ? error.message : error);

    return res.status(500).json({ error: "Internal processing failure" });
  }
});

export default router;
