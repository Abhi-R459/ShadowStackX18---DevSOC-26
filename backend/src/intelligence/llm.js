import axios from "axios";

// Generate a brief, professional summary using a hosted LLM (Hugging Face).
// For demo stability we:
// - Prefer calling the HF Inference API when an API key is configured.
// - Use a short timeout and guard response shapes.
// - Fall back to a deterministic message when the call fails or key is missing.
export async function generateSummary(transcripts, ruleResult) {
  const prompt = `Customer call transcript:\n${(transcripts || []).join("\n")}\n\nVerification result:\n${ruleResult && ruleResult.verified ? "Payment verified" : "Payment not verified"}\n\nWrite a short professional summary and next action.`;

  // If no Hugging Face key is set, skip the external call (safe demo behaviour).
  const hfKey = process.env.HF_API_KEY;
  if (!hfKey) {
    return deterministicFallback(transcripts, ruleResult);
  }

  try {
    const response = await axios.post(
      "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2",
      { inputs: prompt, parameters: { max_new_tokens: 150 } },
      {
        headers: {
          Authorization: `Bearer ${hfKey}`
        },
        timeout: 5000
      }
    );

    // Hugging Face inference responses can vary by model and config.
    // Safely extract a text result from common shapes.
    const data = response && response.data;
    if (!data) return deterministicFallback(transcripts, ruleResult);

    // Common forms: { generated_text: '...' } OR [{ generated_text: '...' }]
    if (typeof data === "string") {
      // Some models return a plain string
      return sanitizeSummary(data);
    }

    if (Array.isArray(data) && data[0] && typeof data[0].generated_text === "string") {
      return sanitizeSummary(data[0].generated_text);
    }

    if (typeof data.generated_text === "string") {
      return sanitizeSummary(data.generated_text);
    }

    // If shape is unexpected, fall back.
    return deterministicFallback(transcripts, ruleResult);
  } catch (err) {
    // Keep logs minimal (don't log keys). Useful for debugging during demos.
    console.warn("LLM call failed:", err && err.message ? err.message : err);
    return deterministicFallback(transcripts, ruleResult);
  }
}

function deterministicFallback(transcripts, ruleResult) {
  // Simple, deterministic summary to use when LLM is unavailable.
  const firstLine = Array.isArray(transcripts) && transcripts.length ? transcripts[0] : "No transcript available.";
  if (ruleResult && ruleResult.verified) {
    return `Payment verified. ${firstLine} Case can be closed.`;
  }
  return `Payment not verified. ${firstLine} Escalate for manual review.`;
}

function sanitizeSummary(text) {
  // Keep output concise and trimmed for client display.
  const clean = (text || "").toString().trim();
  return clean.length > 800 ? clean.slice(0, 800) : clean;
}
