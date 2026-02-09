import express from "express";
import multer from "multer";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import FormData from "form-data";
import { storage, rtdb } from "../firebaseAdmin.js";
import { verifyToken, requireRole } from "../middleware/auth.js";

const router = express.Router();

// Use memory storage so we can stream buffer to Firebase Storage and to STT API
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 50 * 1024 * 1024 } });

// POST /agent/upload
// Expects multipart form with `audio` (audio file field) and optional `agentId`
router.post("/agent/upload", verifyToken, requireRole("agent"), upload.single("audio"), async (req, res) => {
  try {
    const file = req.file;
    const agentId = req.body.agentId || null;

    if (!file) return res.status(400).json({ error: "No file uploaded" });

    const callId = uuidv4();
    const storagePath = `calls/${callId}.wav`;

    // Upload to Firebase Storage
    const bucket = storage.bucket();
    const remoteFile = bucket.file(storagePath);

    await remoteFile.save(file.buffer, { resumable: false, contentType: file.mimetype });

    // Create a signed URL (long-lived) for later retrieval
    let audioUrl = null;
    try {
      const expires = Date.now() + 1000 * 60 * 60 * 24 * 365 * 5; // 5 years
      const [url] = await remoteFile.getSignedUrl({ action: "read", expires });
      audioUrl = url;
    } catch (err) {
      // fallback: make public (best-effort)
      try { await remoteFile.makePublic(); audioUrl = remoteFile.publicUrl(); } catch (e) { audioUrl = null; }
    }

    // Call hosted Whisper (OpenAI) if API key available
    let transcript = null;
    let language = null;
    let confidence = null;
    let status = "UPLOADED";

    const OPENAI_KEY = process.env.OPENAI_API_KEY || process.env.HF_API_KEY || null;
    if (OPENAI_KEY) {
      try {
        const form = new FormData();
        form.append("file", file.buffer, { filename: `${callId}.wav`, contentType: file.mimetype });
        form.append("model", "whisper-1");

        const response = await axios.post("https://api.openai.com/v1/audio/transcriptions", form, {
          headers: { ...form.getHeaders(), Authorization: `Bearer ${OPENAI_KEY}` },
          maxContentLength: Infinity,
          maxBodyLength: Infinity,
        });

        if (response && response.data) {
          transcript = response.data.text || null;
          language = response.data.language || null;
          confidence = response.data.confidence || null;
          status = transcript ? "TRANSCRIBED" : "TRANSCRIBE_FAILED";
        }
      } catch (err) {
        console.error("Whisper transcription failed:", err && err.message ? err.message : err);
        status = "TRANSCRIBE_FAILED";
      }
    } else {
      // No API key configured; mark as pending transcription
      status = "AWAITING_TRANSCRIPTION";
    }

    // Store metadata and transcript in Realtime Database at calls/{callId}
    const payload = {
      agentId,
      uploadedAt: Date.now(),
      audioUrl,
      transcript,
      language,
      confidence,
      status,
    };

    await rtdb.ref(`calls/${callId}`).set(payload);

    return res.json({ ok: true, callId, status });
  } catch (error) {
    console.error("agent/upload error:", error && error.message ? error.message : error);
    return res.status(500).json({ error: "Upload failed" });
  }
});

export default router;
import express from "express";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";
import { admin, rtdb } from "../firebaseAdmin.js";
import { verifyToken, requireRole } from "../middleware/auth.js";
import { upload } from "../middleware/uploadMiddleware.js";
import { transcribeAudioFile } from "../services/whisperService.js";

const router = express.Router();

// POST /api/agent/upload
// Mounted at /api in index.js, so we define /agent/upload here.
router.post("/agent/upload", verifyToken, requireRole("agent"), upload.single("audio"), async (req, res) => {
  const file = req.file;
  if (!file) return res.status(400).json({ error: "Audio file missing" });

  try {
    // Use the shared whisper service to transcribe the file stored by middleware
    const result = await transcribeAudioFile({
      filePath: file.path,
      mimeType: file.mimetype,
      originalName: file.originalname,
    });

    if (!result.success) {
      return res.status(502).json({ error: "Transcription failed", detail: result.error });
    }

    const callId = uuidv4();
    const agentId = req.user.uid;
    const payload = {
      callId,
      agentId,
      transcript: result.transcript,
      language: result.language,
      confidence: result.confidence,
      analysisStatus: "TRANSCRIBED",
      createdAt: admin.database.ServerValue.TIMESTAMP,
    };

    await rtdb.ref(`calls/${callId}`).set(payload);

    return res.json({
      callId,
      analysisStatus: "TRANSCRIBED",
      transcript: result.transcript,
      language: result.language,
      confidence: result.confidence,
    });
  } catch (err) {
    console.error("upload error:", err && err.message ? err.message : err);
    return res.status(500).json({ error: "Upload processing failed" });
  } finally {
    // Clean up the uploaded file
    if (file && file.path) {
      fs.unlink(file.path, () => {});
    }
  }
});

export default router;