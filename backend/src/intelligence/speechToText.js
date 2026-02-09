import axios from "axios";

// speechToText: wrapper to call an external STT (Whisper) endpoint.
// For demo flexibility we support calling a configurable HTTP endpoint
// via WHISPER_API_URL and WHISPER_API_KEY. If not configured, returns a
// deterministic error-friendly response so the backend remains stable.
export async function speechToTextFromBuffer(buffer, contentType = "audio/wav") {
  const url = process.env.WHISPER_API_URL;
  const key = process.env.WHISPER_API_KEY;

  if (!url || !key) {
    // No STT provider configured — return an error-like object that the caller can handle.
    return {
      success: false,
      error: "STT provider not configured",
      transcript: "",
      language: null,
      confidence: 0,
      timestamps: [],
    };
  }

  try {
    // Many hosted STT endpoints accept raw binary POSTs with an API key header.
    const resp = await axios.post(url, buffer, {
      headers: {
        "Content-Type": contentType,
        Authorization: `Bearer ${key}`,
      },
      timeout: 20000,
      responseType: "json",
    });

    const data = resp && resp.data;
    // Expect model to return an object with transcript, language, confidence, timestamps
    if (!data || typeof data.transcript !== "string") {
      return { success: false, error: "unexpected stt response", transcript: "", language: null, confidence: 0, timestamps: [] };
    }

    return {
      success: true,
      transcript: data.transcript,
      language: data.language || null,
      confidence: typeof data.confidence === "number" ? data.confidence : 0,
      timestamps: Array.isArray(data.timestamps) ? data.timestamps : [],
    };
  } catch (err) {
    console.error("speechToText error:", err && err.message ? err.message : err);
    return { success: false, error: err && err.message ? err.message : "stt failure", transcript: "", language: null, confidence: 0, timestamps: [] };
  }
}
