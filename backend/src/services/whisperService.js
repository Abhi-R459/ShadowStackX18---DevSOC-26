import axios from "axios";
import fs from "fs";
import FormData from "form-data";

// Stateless service wrapper for Whisper transcription API.
// Expects WHISPER_API_URL to point to the existing STT service endpoint.
export async function transcribeAudioFile({ filePath, mimeType, originalName }) {
  const url = process.env.WHISPER_API_URL;
  const apiKey = process.env.WHISPER_API_KEY;

  if (!url) {
    return {
      success: false,
      error: "WHISPER_API_URL not configured",
      transcript: "",
      language: null,
      confidence: null,
    };
  }

  try {
    const form = new FormData();
    form.append("audio", fs.createReadStream(filePath), {
      contentType: mimeType || "audio/wav",
      filename: originalName || "audio.wav",
    });

    const headers = {
      ...form.getHeaders(),
    };
    if (apiKey) headers.Authorization = `Bearer ${apiKey}`;

    const resp = await axios.post(url, form, {
      headers,
      timeout: 60000,
    });

    const data = resp && resp.data ? resp.data : {};
    const transcript = typeof data.transcript === "string" ? data.transcript : (typeof data.text === "string" ? data.text : "");
    const language = data.language || null;
    const confidence = typeof data.confidence === "number" ? data.confidence : null;

    if (!transcript) {
      return { success: false, error: "empty transcription response", transcript: "", language: null, confidence: null };
    }

    return { success: true, transcript, language, confidence };
  } catch (err) {
    console.error("whisperService error:", err && err.message ? err.message : err);
    return {
      success: false,
      error: err && err.message ? err.message : "whisper request failed",
      transcript: "",
      language: null,
      confidence: null,
    };
  }
}
