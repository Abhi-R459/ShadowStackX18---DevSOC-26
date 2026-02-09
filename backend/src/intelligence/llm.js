import axios from "axios";

// Generate a brief, professional summary using a hosted LLM (Hugging Face).
// For demo stability we:
// - Prefer calling the HF Inference API when an API key is configured.
// - Use a short timeout and guard response shapes.
// - Fall back to a deterministic message when the call fails or key is missing.
export async function generateSummary(transcripts, ruleResult, extractedEntities = {}) {
  const verifiedText = ruleResult && ruleResult.verified ? "Payment verified" : "Payment not verified";
  const prompt = `You are an expert compliance analyst. Given the transcript and verified facts below, produce a concise, legally-defensible summary (3-6 sentences), list confirmed entities, and suggest the next action. Do not hallucinate facts. If evidence is missing, state that explicitly.\n\nTRANSCRIPT:\n${(transcripts || []).join("\n")}\n\nVERIFIED_FACTS:\n- Verification: ${verifiedText}\n- RiskLevel: ${ruleResult?.riskLevel || 'unknown'}\n- ExtractedAmounts: ${JSON.stringify(extractedEntities.amounts || [])}\n- ExtractedDates: ${JSON.stringify(extractedEntities.dates || [])}\n\nOUTPUT FORMAT:\nSummary:\nConfirmedEntities:\nSuggestedAction:\nConfidenceScore:\n`;

  // If no Hugging Face key is set, skip the external call (safe demo behaviour).
  const hfKey = process.env.HF_API_KEY;
  if (!hfKey) {
    return deterministicFallback(transcripts, ruleResult);
  }

  try {
    const response = await axios.post(
      "https://api-inference.huggingface.co/models/google/flan-t5-base",
      { inputs: prompt, parameters: { max_new_tokens: 256, temperature: 0.0 } },
      {
        headers: {
          Authorization: `Bearer ${hfKey}`,
          "Content-Type": "application/json"
        },
        timeout: 8000
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

    if (typeof data === "string") {
      return sanitizeSummary(data);
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
